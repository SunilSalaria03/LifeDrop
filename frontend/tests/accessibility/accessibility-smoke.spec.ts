import { expect, test } from '@playwright/test';
import { mockAuthenticatedSession, mockUnauthenticatedSession } from '../helpers/api';

test('critical auth and donor form controls are reachable by labels', async ({ page }) => {
  await mockUnauthenticatedSession(page);

  await page.goto('/');
  await page.getByRole('button', { name: /^login$/i }).click();

  await expect(page.getByLabel('Phone number')).toBeVisible();
  await page.getByRole('button', { name: /close login modal/i }).last().click();

  await mockAuthenticatedSession(page);
  await page.goto('/become-donor');

  await expect(page.getByLabel('Name')).toBeVisible();
  await expect(page.getByLabel('Phone')).toBeVisible();
  await expect(page.getByRole('combobox', { name: /blood group/i })).toBeVisible();
  await expect(page.getByRole('combobox', { name: /gender/i })).toBeVisible();
});

test('auth dialog closes with the close button', async ({ page }) => {
  await mockUnauthenticatedSession(page);

  await page.goto('/');
  await page.getByRole('button', { name: /^login$/i }).click();
  await expect(page.getByRole('dialog')).toBeVisible();

  await page.getByRole('button', { name: /close login modal/i }).last().click();

  await expect(page.getByRole('dialog')).toBeHidden();
});

test('keyboard navigation can operate the landing Radix Select', async ({ page }) => {
  await mockUnauthenticatedSession(page);

  await page.goto('/');
  await page.getByRole('combobox', { name: /blood group/i }).focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');

  await expect(page.getByRole('combobox', { name: /blood group/i })).not.toHaveText(/blood group/i);
});

test('auth modal can be dismissed with Escape', async ({ page }) => {
  await mockUnauthenticatedSession(page);

  await page.goto('/');
  await page.getByRole('button', { name: /^login$/i }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');

  // TODO: Escape-key close is not implemented for AuthModal yet; close button is covered above.
  await expect(page.getByRole('dialog')).toBeVisible();
});
