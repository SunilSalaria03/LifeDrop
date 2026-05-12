import { expect, test } from '@playwright/test';
import { incompleteUser } from '../fixtures/test-data';
import {
  mockAuthenticatedSession,
  mockUnauthenticatedSession,
} from '../helpers/api';

test('/become-donor as guest redirects to login flow', async ({ page }) => {
  await mockUnauthenticatedSession(page);

  await page.goto('/become-donor');

  await expect(page).toHaveURL(/auth=login/);
  await expect(page.getByRole('dialog')).toContainText('Login to LifeDrop');
});

test('/profile as guest redirects to login flow', async ({ page }) => {
  await mockUnauthenticatedSession(page);

  await page.goto('/profile');

  await expect(page).toHaveURL(/auth=login/);
  await expect(page.getByRole('dialog')).toContainText('Login to LifeDrop');
});

test('incomplete profile redirects to setup where supported', async ({ page }) => {
  await mockAuthenticatedSession(page, {
    authenticated: true,
    user: { ...incompleteUser },
  });

  await page.goto('/profile/setup');

  await expect(page.getByRole('heading', { name: /complete your lifedrop profile/i })).toBeVisible();
  // TODO: Add route-level redirect assertions for pages that pass requireCompletedProfile=true.
});

test('blocked user behavior is not enforced by the current frontend route guards', async ({ page }) => {
  await mockAuthenticatedSession(page, {
    authenticated: true,
    user: { ...incompleteUser, isBlocked: true },
  });

  await page.goto('/profile');

  await expect(page.getByRole('heading', { name: incompleteUser.name })).toBeVisible();
  // TODO: Add blocked-user redirect/lockout tests when the app implements blocked-user UI handling.
});
