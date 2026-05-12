import { expect, Page } from '@playwright/test';
import { testCredentials, testUser } from '../fixtures/test-data';

export async function loginWithOtp(page: Page) {
  await page.getByRole('button', { name: /^login$/i }).click();
  await expect(page.getByRole('dialog')).toContainText('Login to LifeDrop');

  await page.getByLabel('Phone number').fill(testCredentials.phone);
  await page.getByRole('button', { name: /send otp/i }).click();

  await expect(page.getByText(/verify your otp/i)).toBeVisible();
  await page.getByLabel('OTP code').fill(testCredentials.otp);
  await page.getByRole('button', { name: /verify otp/i }).click();

  await expect(page.getByRole('button', { name: /open account menu/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /^login$/i })).toBeHidden();
}

export async function logout(page: Page) {
  await page.getByRole('button', { name: /open account menu/i }).click();
  await page.getByRole('button', { name: /^logout$/i }).click();

  await expect(page.getByRole('button', { name: /^login$/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /open account menu/i })).toBeHidden();
}

export async function expectLoggedInHeader(page: Page) {
  await expect(page.getByRole('button', { name: /open account menu/i })).toBeVisible();
  await page.getByRole('button', { name: /open account menu/i }).click();
  await expect(page.getByText(testUser.name)).toBeVisible();
  await page.keyboard.press('Escape');
}
