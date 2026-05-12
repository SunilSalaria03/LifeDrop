import { expect, test } from '@playwright/test';
import { testCredentials, unverifiedUser } from '../fixtures/test-data';
import {
  mockAuthenticatedSession,
  mockOtpLogin,
  mockOtpSendFailure,
  mockProfilePhoneVerifyFailure,
  mockProfileUpdate,
} from '../helpers/api';

test('unverified logged-in user clicking Become Donor opens phone verification', async ({ page }) => {
  await mockAuthenticatedSession(page, {
    authenticated: true,
    user: { ...unverifiedUser },
  });

  await page.goto('/');
  await page.getByRole('navigation').getByRole('button', { name: /become a donor/i }).click();

  await expect(page.getByRole('dialog')).toContainText('Verify your phone');
  await expect(page.getByLabel('Phone number')).toBeVisible();
});

test('OTP send failure state is shown', async ({ page }) => {
  const session = await mockAuthenticatedSession(page, {
    authenticated: true,
    user: { ...unverifiedUser },
  });
  await mockProfileUpdate(page, session);
  await mockOtpSendFailure(page);

  await page.goto('/');
  await page.getByRole('navigation').getByRole('button', { name: /become a donor/i }).click();
  await page.getByLabel('Phone number').fill(testCredentials.phone);
  await page.getByRole('button', { name: /send otp/i }).click();

  await expect(page.getByText(/could not send otp/i)).toBeVisible();
});

test('OTP verify failure state is shown', async ({ page }) => {
  const session = await mockAuthenticatedSession(page, {
    authenticated: true,
    user: { ...unverifiedUser },
  });
  await mockProfileUpdate(page, session);
  await mockOtpLogin(page);
  await mockProfilePhoneVerifyFailure(page);

  await page.goto('/');
  await page.getByRole('navigation').getByRole('button', { name: /become a donor/i }).click();
  await page.getByLabel('Phone number').fill(testCredentials.phone);
  await page.getByRole('button', { name: /send otp/i }).click();
  await page.getByLabel('OTP code').fill(testCredentials.otp);
  await page.getByRole('button', { name: /verify otp/i }).click();

  await expect(page.getByText('Verification failed', { exact: true })).toBeVisible();
});

test('resend OTP timer is shown after sending an OTP', async ({ page }) => {
  const session = await mockAuthenticatedSession(page, {
    authenticated: true,
    user: { ...unverifiedUser },
  });
  await mockProfileUpdate(page, session);
  await mockOtpLogin(page);

  await page.goto('/');
  await page.getByRole('navigation').getByRole('button', { name: /become a donor/i }).click();
  await page.getByLabel('Phone number').fill(testCredentials.phone);
  await page.getByRole('button', { name: /send otp/i }).click();

  await expect(page.getByRole('button', { name: /resend otp in/i })).toBeDisabled();
});
