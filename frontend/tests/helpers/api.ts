import { Page } from '@playwright/test';
import { searchDonorResult, testUser } from '../fixtures/test-data';

type MockSession = {
  authenticated: boolean;
  user: Record<string, unknown>;
};

const apiResponse = <T>(data: T, message = 'OK') => ({
  data,
  message,
  success: true,
});

export async function mockUnauthenticatedSession(page: Page) {
  await page.route('**/auth/me', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      json: { message: 'Unauthenticated', success: false },
      status: 401,
    });
  });

  await page.route('**/auth/refresh', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      json: { message: 'Unauthenticated', success: false },
      status: 401,
    });
  });
}

export async function mockAuthenticatedSession(
  page: Page,
  session: MockSession = { authenticated: true, user: { ...testUser } },
) {
  await page.route('**/auth/me', async (route) => {
    if (!session.authenticated) {
      await route.fulfill({
        contentType: 'application/json',
        json: { message: 'Unauthenticated', success: false },
        status: 401,
      });
      return;
    }

    await route.fulfill({
      contentType: 'application/json',
      json: apiResponse(session.user),
      status: 200,
    });
  });

  return session;
}

export async function mockOtpLogin(page: Page) {
  await page.route('**/auth/otp/send', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      json: apiResponse({ message: 'OTP sent successfully' }, 'OTP sent successfully'),
      status: 200,
    });
  });

  await page.route('**/auth/otp/verify', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      json: apiResponse({ user: testUser }, 'Login successful'),
      status: 200,
    });
  });
}

export async function mockOtpSendFailure(page: Page) {
  await page.route('**/auth/otp/send', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      json: { message: 'Could not send OTP.', success: false },
      status: 500,
    });
  });
}

export async function mockOtpVerifyFailure(page: Page) {
  await page.route('**/auth/otp/verify', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      json: { message: 'Invalid OTP.', success: false },
      status: 400,
    });
  });
}

export async function mockProfilePhoneVerifyFailure(page: Page) {
  await page.route('**/auth/otp/verify-profile-phone', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      json: { message: 'Invalid OTP.', success: false },
      status: 400,
    });
  });
}

export async function mockGoogleAuth(
  page: Page,
  user: Record<string, unknown> = testUser,
) {
  await page.route('**/auth/google', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      json: apiResponse({ user }, 'Google login successful'),
      status: 200,
    });
  });
}

export async function mockLogout(page: Page, session?: MockSession) {
  await page.route('**/auth/logout', async (route) => {
    if (session) {
      session.authenticated = false;
    }

    await route.fulfill({
      contentType: 'application/json',
      json: apiResponse({ message: 'Logged out' }, 'Logged out'),
      status: 200,
    });
  });
}

export async function mockDonorSearch(page: Page, items = [searchDonorResult]) {
  await page.route('**/donors/search**', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      json: apiResponse({
        count: items.length,
        items,
        radiusKm: 25,
      }),
      status: 200,
    });
  });
}

export async function mockDonorSearchFailure(page: Page) {
  await page.route('**/donors/search**', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      json: { message: 'Donor search API failed.', success: false },
      status: 500,
    });
  });
}

export async function mockDonorSearchSlow(page: Page, items = [searchDonorResult]) {
  await page.route('**/donors/search**', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await route.fulfill({
      contentType: 'application/json',
      json: apiResponse({
        count: items.length,
        items,
        radiusKm: 25,
      }),
      status: 200,
    });
  });
}

export async function mockDonorDetail(
  page: Page,
  donor: Record<string, unknown> = searchDonorResult,
) {
  await page.route(`**/api/**/donors/${String(donor.id)}`, async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      json: apiResponse(donor),
      status: 200,
    });
  });
}

export async function mockDonorDetailFailure(page: Page, donorId = searchDonorResult.id) {
  await page.route(`**/api/**/donors/${donorId}`, async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      json: { message: 'Donor profile was not found.', success: false },
      status: 404,
    });
  });
}

export async function mockCreateDonorProfile(page: Page, session?: MockSession) {
  await page.route('**/donors/profile', async (route) => {
    if (route.request().method() !== 'POST') {
      await route.continue();
      return;
    }

    const payload = route.request().postDataJSON();
    const donorProfile = {
      ...payload,
      id: 'e2e-donor-profile-1',
      isAvailable: true,
      state: payload.state,
      userId: testUser.id,
    };

    if (session) {
      session.user = {
        ...session.user,
        ...payload,
        donorProfile,
        isProfileCompleted: true,
        role: 'donor',
      };
    }

    await route.fulfill({
      contentType: 'application/json',
      json: apiResponse(donorProfile, 'Donor profile saved'),
      status: 200,
    });
  });
}

export async function mockProfileUpdate(
  page: Page,
  session?: MockSession,
  options: { fail?: boolean; completeProfile?: boolean } = {},
) {
  await page.route('**/users/profile', async (route) => {
    if (route.request().method() !== 'PUT') {
      await route.continue();
      return;
    }

    if (options.fail) {
      await route.fulfill({
        contentType: 'application/json',
        json: { message: 'Profile update failed.', success: false },
        status: 500,
      });
      return;
    }

    const payload = route.request().postDataJSON();
    const updatedUser = {
      ...(session?.user ?? testUser),
      ...payload,
      isProfileCompleted: options.completeProfile ?? true,
      phoneVerified: (session?.user?.phoneVerified as boolean | undefined) ?? true,
    };

    if (session) {
      session.user = updatedUser;
    }

    await route.fulfill({
      contentType: 'application/json',
      json: apiResponse(updatedUser, 'Profile saved'),
      status: 200,
    });
  });
}

export async function mockRequestBlood(
  page: Page,
  options: { fail?: boolean } = {},
) {
  await page.route('**/blood-requests/send-sms-alert', async (route) => {
    if (options.fail) {
      await route.fulfill({
        contentType: 'application/json',
        json: { message: 'SMS alert could not be sent.', success: false },
        status: 500,
      });
      return;
    }

    await route.fulfill({
      contentType: 'application/json',
      json: apiResponse({
        bloodRequestId: 'e2e-blood-request-1',
        smsStatus: 'sent',
        status: 'sent',
        whatsappStatus: 'skipped',
      }, 'Request sent'),
      status: 200,
    });
  });
}
