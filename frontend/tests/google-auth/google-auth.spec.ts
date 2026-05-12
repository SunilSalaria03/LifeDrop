import { expect, test } from '@playwright/test';
import { testUser, unverifiedUser } from '../fixtures/test-data';
import {
  mockGoogleAuth,
  mockUnauthenticatedSession,
} from '../helpers/api';
import { installMockGoogleButton } from '../helpers/selectors';

test('shows fallback when Google login script is unavailable', async ({ page }) => {
  await mockUnauthenticatedSession(page);
  await page.route('https://accounts.google.com/gsi/client', async (route) => {
    await route.abort();
  });

  await page.goto('/?auth=login');

  await expect(page.getByText(/could not load google login script/i)).toBeVisible();
});

test('Google callback success logs in with a mocked idToken', async ({ page }) => {
  await installMockGoogleButton(page);
  await mockUnauthenticatedSession(page);
  await mockGoogleAuth(page, testUser);

  await page.goto('/');
  await page.getByRole('button', { name: /^login$/i }).click();
  await page.getByRole('button', { name: /continue with google/i }).click();

  await expect(page.getByRole('button', { name: /open account menu/i })).toBeVisible();
});

test('Google user without verified phone enters phone verification flow', async ({ page }) => {
  await installMockGoogleButton(page);
  await mockUnauthenticatedSession(page);
  await mockGoogleAuth(page, unverifiedUser);

  await page.goto('/');
  await page.getByRole('button', { name: /^login$/i }).click();
  await page.getByRole('button', { name: /continue with google/i }).click();

  await expect(page.getByRole('dialog')).toContainText('Verify your phone');
  await expect(page.getByLabel('Phone number')).toBeVisible();
});
