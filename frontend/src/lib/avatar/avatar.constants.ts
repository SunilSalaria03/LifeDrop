import defaultAvatar from "@/assets/images/default.svg";
import femaleAvatar from "@/assets/images/female.svg";
import maleAvatar from "@/assets/images/male.svg";

export type AvatarGender = "male" | "female" | "other";

export const DEFAULT_AVATAR_SRC = defaultAvatar.src;

export const GENDER_AVATAR_SRC_MAP: Record<AvatarGender, string> = {
  male: maleAvatar.src,
  female: femaleAvatar.src,
  other: DEFAULT_AVATAR_SRC,
};
