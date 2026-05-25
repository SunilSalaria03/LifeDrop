import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Twilio } from "twilio";
import { SMS_ALERT_COOLDOWN_MS } from "./blood-request.constants";
import {
  SmsAlertResult,
  SmsMessageInput,
  WhatsappAlertInput,
} from "./blood-request.types";
import { SendSmsAlertDto } from "./dto/send-sms-alert.dto";
import {
  BloodRequest,
  BloodRequestStatus,
  SmsStatus,
  WhatsappProvider,
  WhatsappStatus,
} from "./schemas/blood-request.schema";
import { BloodRequestDocument } from "./schemas/blood-request.schema.types";
import { DonorProfile } from "../donors/schemas/donor-profile.schema";
import { DonorProfileDocument } from "../donors/schemas/donor-profile.schema.types";
import { User } from "../users/schemas/user.schema";
import { UserDocument } from "../users/schemas/user.schema.types";
import { normalizeIndianPhoneToE164 } from "../../common/phone/indian-phone";

@Injectable()
export class BloodRequestService {
  private readonly twilioClient?: Twilio;

  constructor(
    @InjectModel(BloodRequest.name)
    private readonly bloodRequestModel: Model<BloodRequestDocument>,
    @InjectModel(DonorProfile.name)
    private readonly donorProfileModel: Model<DonorProfileDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
  ) {
    this.twilioClient = this.createTwilioClient();
  }

  async sendSmsAlert(
    requester: UserDocument,
    dto: SendSmsAlertDto,
  ): Promise<SmsAlertResult> {
    const verifiedRequester = await this.getVerifiedRequester(requester);
    const { donorProfile, donorUser } = await this.getAvailableVerifiedDonor(
      dto.donorId,
      dto.bloodGroup,
    );

    await this.assertCanCreateSmsAlert(verifiedRequester._id, donorUser._id);

    const bloodRequest = await this.bloodRequestModel.create({
      requesterId: verifiedRequester._id,
      donorId: donorUser._id,
      bloodGroup: dto.bloodGroup,
      status: BloodRequestStatus.Pending,
      sendSms: dto.sendSms,
      sendWhatsapp: dto.sendWhatsapp ?? false,
      consentToShareContact: dto.consentToShareContact,
      smsStatus: SmsStatus.Pending,
      smsProvider: "twilio",
      whatsappStatus: dto.sendWhatsapp
        ? WhatsappStatus.Pending
        : WhatsappStatus.Skipped,
      whatsappProvider: dto.sendWhatsapp ? WhatsappProvider.Twilio : undefined,
      message: dto.message,
    });

    try {
      const donorPhone = this.toIndianE164(
        donorUser.phone ?? donorProfile.phone,
      );

      if (!donorPhone) {
        throw new ForbiddenException("Donor phone must be verified.");
      }

      const requesterPhone = this.toIndianE164(verifiedRequester.phone);

      if (!requesterPhone) {
        throw new ForbiddenException(
          "Requester phone must be verified before sending SMS alerts.",
        );
      }

      const smsProviderMessageId = await this.sendTwilioSms({
        donorPhone,
        requesterPhone,
        bloodGroup: dto.bloodGroup,
        message: dto.message,
      });

      await this.sendWhatsappIfRequested({
        bloodRequest,
        bloodGroup: dto.bloodGroup,
        donorPhone,
        message: dto.message,
        requesterPhone,
        sendWhatsapp: dto.sendWhatsapp ?? false,
      });

      bloodRequest.smsStatus = SmsStatus.Sent;
      bloodRequest.status = BloodRequestStatus.Sent;
      bloodRequest.smsProvider = "twilio";
      bloodRequest.smsProviderMessageId = smsProviderMessageId;
      bloodRequest.smsError = undefined;
      await bloodRequest.save();

      return {
        bloodRequestId: bloodRequest.id,
        message: "SMS alert sent successfully.",
        smsStatus: bloodRequest.smsStatus,
        status: bloodRequest.status,
        smsProvider: bloodRequest.smsProvider,
        smsProviderMessageId: bloodRequest.smsProviderMessageId,
        whatsappStatus: bloodRequest.whatsappStatus,
        whatsappProvider: bloodRequest.whatsappProvider,
        whatsappProviderMessageId: bloodRequest.whatsappProviderMessageId,
        whatsappError: bloodRequest.whatsappError
          ? "WhatsApp alert could not be sent."
          : undefined,
      };
    } catch (error) {
      const smsError = this.getSmsErrorMessage(error);
      bloodRequest.smsStatus = SmsStatus.Failed;
      bloodRequest.status = BloodRequestStatus.Failed;
      bloodRequest.smsError = smsError;
      await bloodRequest.save();

      return {
        bloodRequestId: bloodRequest.id,
        message: "SMS alert could not be sent.",
        smsStatus: bloodRequest.smsStatus,
        status: bloodRequest.status,
        smsProvider: bloodRequest.smsProvider,
        smsError: "SMS alert could not be sent. Please try again later.",
        whatsappStatus: bloodRequest.whatsappStatus,
        whatsappProvider: bloodRequest.whatsappProvider,
        whatsappError: bloodRequest.whatsappError
          ? "WhatsApp alert could not be sent."
          : undefined,
      };
    }
  }

  private async getVerifiedRequester(requester: UserDocument) {
    if (!requester?._id) {
      throw new ForbiddenException("Login is required to send SMS alerts.");
    }

    const verifiedRequester = await this.userModel
      .findById(requester._id)
      .exec();

    if (!verifiedRequester) {
      throw new NotFoundException("Requester account does not exist.");
    }

    if (!verifiedRequester.phoneVerified || !verifiedRequester.phone) {
      throw new ForbiddenException(
        "Requester phone must be verified before sending SMS alerts.",
      );
    }

    return verifiedRequester;
  }

  private async getAvailableVerifiedDonor(
    donorId: string,
    bloodGroup: SendSmsAlertDto["bloodGroup"],
  ) {
    if (!Types.ObjectId.isValid(donorId)) {
      throw new BadRequestException("donorId must be a valid MongoDB id.");
    }

    const objectId = new Types.ObjectId(donorId);
    const donorProfile = await this.donorProfileModel
      .findOne({
        $or: [{ _id: objectId }, { userId: objectId }],
        bloodGroup,
        isActive: true,
      })
      .exec();

    if (!donorProfile) {
      throw new NotFoundException("Donor does not exist.");
    }

    if (!donorProfile.isAvailable) {
      throw new ForbiddenException("Donor is not available.");
    }

    const donorUser = await this.userModel.findById(donorProfile.userId).exec();

    if (!donorUser) {
      throw new NotFoundException("Donor account does not exist.");
    }

    if (!donorUser.phoneVerified || !(donorUser.phone ?? donorProfile.phone)) {
      throw new ForbiddenException("Donor phone must be verified.");
    }

    return { donorProfile, donorUser };
  }

  private async assertCanCreateSmsAlert(
    requesterId: Types.ObjectId,
    donorId: Types.ObjectId,
  ) {
    const activeRequest = await this.bloodRequestModel
      .findOne({
        requesterId,
        donorId,
        status: {
          $in: [BloodRequestStatus.Pending, BloodRequestStatus.Sent],
        },
      })
      .exec();

    if (activeRequest) {
      throw new BadRequestException(
        "You already have an active request with this donor.",
      );
    }

    const cooldownStartedAt = new Date(Date.now() - SMS_ALERT_COOLDOWN_MS);
    const recentRequest = await this.bloodRequestModel
      .findOne({
        requesterId,
        donorId,
        createdAt: { $gte: cooldownStartedAt },
      })
      .exec();

    if (recentRequest) {
      throw new BadRequestException(
        "Please wait 30 minutes before sending another SMS alert to this donor.",
      );
    }
  }

  private async sendTwilioSms({
    bloodGroup,
    donorPhone,
    message,
    requesterPhone,
  }: SmsMessageInput) {
    const fromPhone = this.toIndianE164(
      this.configService.get<string>("TWILIO_PHONE_NUMBER"),
    );

    if (!this.twilioClient || !fromPhone) {
      throw new BadRequestException("Twilio SMS service is not configured.");
    }

    const sms = await this.twilioClient.messages.create({
      to: donorPhone,
      from: fromPhone,
      body: this.buildSmsBody({ bloodGroup, message, requesterPhone }),
    });

    return sms.sid;
  }

  private async sendWhatsappIfRequested({
    bloodGroup,
    bloodRequest,
    donorPhone,
    message,
    requesterPhone,
    sendWhatsapp,
  }: WhatsappAlertInput) {
    if (!sendWhatsapp) {
      bloodRequest.whatsappStatus = WhatsappStatus.Skipped;
      return;
    }

    const whatsappFrom = this.toTwilioWhatsappAddress(
      this.configService.get<string>("TWILIO_WHATSAPP_NUMBER"),
    );
    const whatsappTo = this.toTwilioWhatsappAddress(donorPhone);

    bloodRequest.whatsappProvider = WhatsappProvider.Twilio;

    if (!this.twilioClient || !whatsappFrom || !whatsappTo) {
      bloodRequest.whatsappStatus = WhatsappStatus.Failed;
      bloodRequest.whatsappError = "Twilio WhatsApp service is not configured.";
      return;
    }

    try {
      const whatsapp = await this.twilioClient.messages.create({
        to: whatsappTo,
        from: whatsappFrom,
        body: this.buildSmsBody({ bloodGroup, message, requesterPhone }),
      });

      bloodRequest.whatsappStatus = WhatsappStatus.Sent;
      bloodRequest.whatsappProviderMessageId = whatsapp.sid;
      bloodRequest.whatsappError = undefined;
    } catch (error) {
      bloodRequest.whatsappStatus = WhatsappStatus.Failed;
      bloodRequest.whatsappError = this.getSmsErrorMessage(error);
    }
  }

  private buildSmsBody({
    bloodGroup,
    message,
    requesterPhone,
  }: Pick<SmsMessageInput, "bloodGroup" | "message" | "requesterPhone">) {
    return [
      `A patient urgently needs ${bloodGroup} blood donation.`,
      `Your support can help save a life.`,
      `Contact requester: ${requesterPhone}.`,
      message ? `Note: ${message}` : undefined,
      `- Team LifeDrop`,
    ]
      .filter(Boolean)
      .join(" ");
  }

  private createTwilioClient() {
    const accountSid = this.configService.get<string>("TWILIO_ACCOUNT_SID");
    const authToken = this.configService.get<string>("TWILIO_AUTH_TOKEN");

    if (!accountSid || !authToken) {
      return undefined;
    }

    return new Twilio(accountSid, authToken);
  }

  private toIndianE164(phone?: string) {
    if (!phone) {
      return undefined;
    }

    return normalizeIndianPhoneToE164(phone) ?? undefined;
  }

  private toTwilioWhatsappAddress(phone?: string) {
    if (phone?.trim().startsWith("whatsapp:")) {
      return phone.trim();
    }

    const e164Phone = this.toIndianE164(phone);

    if (!e164Phone) {
      return undefined;
    }

    return `whatsapp:${e164Phone}`;
  }

  private getSmsErrorMessage(error: unknown) {
    if (error instanceof Error) {
      return error.message;
    }

    return "SMS provider failed to send alert.";
  }
}
