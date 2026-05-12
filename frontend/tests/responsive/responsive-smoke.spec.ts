import { expect, test } from '@playwright/test';
import { donorSearch } from '../fixtures/test-data';
import { mockAuthenticatedSession, mockDonorSearch, mockUnauthenticatedSession } from '../helpers/api';
import { selectRadixOption } from '../helpers/selectors';

test.use({ viewport: { height: 844, width: 390 } });

test('landing search and auth are usable on mobile', async ({ page }) => {
  await mockUnauthenticatedSession(page);
  await mockDonorSearch(page);

  await page.goto('/');

  await expect(page.getByRole('heading', { name: /find blood donors/i })).toBeVisible();
  await page.getByRole('button', { name: /^login$/i }).click();
  await expect(page.getByRole('dialog')).toContainText('Login to LifeDrop');
  await page.getByRole('button', { name: /close login modal/i }).last().click();

  await selectRadixOption(page, page.getByRole('combobox', { name: /blood group/i }), donorSearch.bloodGroup);
  await selectRadixOption(page, page.getByRole('combobox', { name: /^state$/i }), donorSearch.state);
  await selectRadixOption(page, page.getByRole('combobox', { name: /^city$/i }), donorSearch.city);
  await page.getByRole('button', { name: /find blood/i }).click();

  await expect(page.getByRole('heading', { name: /available donors/i })).toBeVisible();
});

test('mobile header shows account menu actions for logged-in user', async ({ page }) => {
  await mockAuthenticatedSession(page);

  await page.goto('/');
  await page.getByRole('button', { name: /open account menu/i }).click();

  await expect(page.getByText(/profile settings/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /logout/i })).toBeVisible();
});

test('donor form is usable on mobile', async ({ page }) => {
  await mockAuthenticatedSession(page);

  await page.goto('/become-donor');

  await expect(page.getByRole('heading', { name: /share your donor availability/i })).toBeVisible();
  await expect(page.getByLabel('Name')).toBeVisible();
  await expect(page.getByRole('combobox', { name: /blood group/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /^become a donor$/i })).toBeVisible();
});
