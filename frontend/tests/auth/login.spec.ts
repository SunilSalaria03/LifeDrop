import { expect, test } from '@playwright/test';
import { loginWithOtp } from '../helpers/auth';
import { mockOtpLogin, mockUnauthenticatedSession } from '../helpers/api';

test('logs in through the OTP flow with mocked test credentials', async ({ page }) => {
  await mockUnauthenticatedSession(page);
  await mockOtpLogin(page);

  await page.goto('/');
  await loginWithOtp(page);

  await expect(page.getByText(/login successful/i)).toBeVisible();
});

test('opens login when visiting the auth query route', async ({ page }) => {
  await mockUnauthenticatedSession(page);

  await page.goto('/?auth=login');

  await expect(page.getByRole('dialog')).toContainText('Login to LifeDrop');
  await expect(page.getByLabel('Phone number')).toBeVisible();
});
