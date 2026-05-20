import { expect, test } from '@playwright/test';
import { mockUnauthenticatedSession } from './helpers/api';

test('landing page loads the main LifeDrop experience', async ({ page }) => {
  await mockUnauthenticatedSession(page);

  await page.goto('/');

  await expect(page).toHaveTitle(/LifeDrop/i);
  await expect(
    page.getByRole('heading', {
      name: /search donors by blood group and location across your city/i,
    }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: /lifedrop home/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /^login$/i })).toBeVisible();
  await expect(
    page.getByRole('navigation').getByRole('button', { name: /join as a donor/i }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: /search donors/i })).toBeVisible();
});
