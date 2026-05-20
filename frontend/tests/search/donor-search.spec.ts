import { expect, test } from '@playwright/test';
import { donorSearch } from '../fixtures/test-data';
import { mockDonorSearch, mockUnauthenticatedSession } from '../helpers/api';
import { selectRadixOption } from '../helpers/selectors';

test.beforeEach(async ({ page }) => {
  await mockUnauthenticatedSession(page);
});

test('searches donors in Chandigarh for A+ blood', async ({ page }) => {
  await mockDonorSearch(page);
  await page.goto('/');

  await selectRadixOption(
    page,
    page.getByRole('combobox', { name: /blood group/i }),
    donorSearch.bloodGroup,
  );
  await selectRadixOption(
    page,
    page.getByRole('combobox', { name: /^state$/i }),
    donorSearch.state,
  );
  await selectRadixOption(
    page,
    page.getByRole('combobox', { name: /^city$/i }),
    donorSearch.city,
  );

  await page.getByRole('button', { name: /search donors/i }).click();

  await expect(page.getByRole('heading', { name: /available donors/i })).toBeVisible();
  await expect(page.getByText(/1 donors found/i)).toBeVisible();
  await expect(page.getByText('Asha Donor')).toBeVisible();
  await expect(page.getByText(donorSearch.bloodGroup).first()).toBeVisible();
});

test('shows a valid empty state when no donors match', async ({ page }) => {
  await mockDonorSearch(page, []);
  await page.goto('/');

  await selectRadixOption(
    page,
    page.getByRole('combobox', { name: /blood group/i }),
    donorSearch.bloodGroup,
  );
  await selectRadixOption(
    page,
    page.getByRole('combobox', { name: /^state$/i }),
    donorSearch.state,
  );
  await selectRadixOption(
    page,
    page.getByRole('combobox', { name: /^city$/i }),
    donorSearch.city,
  );

  await page.getByRole('button', { name: /search donors/i }).click();

  await expect(page.getByRole('heading', { name: /no donors found/i })).toBeVisible();
  await expect(page.getByText(/try another blood group/i)).toBeVisible();
});
