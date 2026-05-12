import { expect, test } from '@playwright/test';
import { incompleteUser, profileUpdateData, testUser } from '../fixtures/test-data';
import {
  mockAuthenticatedSession,
  mockProfileUpdate,
  mockUnauthenticatedSession,
} from '../helpers/api';
import { selectRadixOption } from '../helpers/selectors';

test('guest opening profile is sent to the login flow', async ({ page }) => {
  await mockUnauthenticatedSession(page);

  await page.goto('/profile');

  await expect(page).toHaveURL(/auth=login/);
  await expect(page.getByRole('dialog')).toContainText('Login to LifeDrop');
});

test('logged-in user sees profile details', async ({ page }) => {
  await mockAuthenticatedSession(page);

  await page.goto('/profile');

  await expect(page.getByRole('heading', { name: testUser.name })).toBeVisible();
  await expect(page.getByText(testUser.email)).toBeVisible();
  await expect(page.getByText(testUser.phone)).toBeVisible();
  await expect(page.getByText(/user account/i)).toBeVisible();
});

test('profile edit form validates required fields', async ({ page }) => {
  await mockAuthenticatedSession(page);

  await page.goto('/profile');
  await page.getByRole('button', { name: /edit profile/i }).click();
  await page.getByLabel('Full name').fill('');
  await page.getByRole('button', { name: /save profile/i }).click();

  await expect(page.getByText(/name is required/i)).toBeVisible();
});

test('profile update success shows saved state', async ({ page }) => {
  const session = await mockAuthenticatedSession(page);
  await mockProfileUpdate(page, session);

  await page.goto('/profile');
  await page.getByRole('button', { name: /edit profile/i }).click();
  await page.getByLabel('Full name').fill(profileUpdateData.name);
  await page.getByLabel('Email').fill(profileUpdateData.email);
  await selectRadixOption(
    page,
    page.getByRole('combobox', { name: /^state$/i }),
    profileUpdateData.state,
  );
  await selectRadixOption(
    page,
    page.getByRole('combobox', { name: /district/i }),
    profileUpdateData.district,
  );
  await page.getByLabel('Pin code').fill(profileUpdateData.pincode);
  await page.getByRole('button', { name: /save profile/i }).click();

  await expect(page.getByText(/profile saved/i)).toBeVisible();
  await expect(page.getByRole('heading', { name: profileUpdateData.name })).toBeVisible();
});

test('profile update failure shows an error state', async ({ page }) => {
  const session = await mockAuthenticatedSession(page);
  await mockProfileUpdate(page, session, { fail: true });

  await page.goto('/profile');
  await page.getByRole('button', { name: /edit profile/i }).click();
  await page.getByLabel('Full name').fill(profileUpdateData.name);
  await page.getByRole('button', { name: /save profile/i }).click();

  await expect(page.getByText('Update failed', { exact: true })).toBeVisible();
  await expect(page.getByText(/profile update failed/i)).toBeVisible();
});

test('incomplete user can open the profile setup flow', async ({ page }) => {
  await mockAuthenticatedSession(page, {
    authenticated: true,
    user: { ...incompleteUser },
  });

  await page.goto('/profile/setup');

  await expect(
    page.getByRole('heading', { name: /complete your lifedrop profile/i }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: /complete profile/i })).toBeVisible();
});
