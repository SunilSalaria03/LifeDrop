import { expect, test } from '@playwright/test';
import { donorSearch, searchDonorResult } from '../fixtures/test-data';
import {
  mockDonorSearchFailure,
  mockDonorSearchSlow,
  mockUnauthenticatedSession,
} from '../helpers/api';
import { selectRadixOption } from '../helpers/selectors';

test.beforeEach(async ({ page }) => {
  await mockUnauthenticatedSession(page);
});

test('search without blood group shows validation', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: /search donors/i }).click();

  await expect(page.getByText(/please select blood group/i)).toBeVisible();
});

test('search without state and city shows validation', async ({ page }) => {
  await page.goto('/');

  await selectRadixOption(
    page,
    page.getByRole('combobox', { name: /blood group/i }),
    donorSearch.bloodGroup,
  );
  await page.getByRole('button', { name: /search donors/i }).click();

  await expect(page.getByText(/please select state and city/i)).toBeVisible();
});

test('search API failure shows a usable error message', async ({ page }) => {
  await mockDonorSearchFailure(page);
  await page.goto('/');

  await selectRadixOption(page, page.getByRole('combobox', { name: /blood group/i }), donorSearch.bloodGroup);
  await selectRadixOption(page, page.getByRole('combobox', { name: /^state$/i }), donorSearch.state);
  await selectRadixOption(page, page.getByRole('combobox', { name: /^city$/i }), donorSearch.city);
  await page.getByRole('button', { name: /search donors/i }).click();

  await expect(page.getByRole('heading', { name: /api failed/i })).toBeVisible();
});

test('loading skeleton appears while donor search is pending', async ({ page }) => {
  await mockDonorSearchSlow(page);
  await page.goto('/');

  await selectRadixOption(page, page.getByRole('combobox', { name: /blood group/i }), donorSearch.bloodGroup);
  await selectRadixOption(page, page.getByRole('combobox', { name: /^state$/i }), donorSearch.state);
  await selectRadixOption(page, page.getByRole('combobox', { name: /^city$/i }), donorSearch.city);
  await page.getByRole('button', { name: /search donors/i }).click();

  await expect(page.getByLabel(/loading donor results/i)).toBeVisible();
  await expect(page.getByText(searchDonorResult.name)).toBeVisible();
});

test('result card View Profile navigates to donor detail', async ({ page }) => {
  await mockDonorSearchSlow(page);
  await page.goto('/');

  await selectRadixOption(page, page.getByRole('combobox', { name: /blood group/i }), donorSearch.bloodGroup);
  await selectRadixOption(page, page.getByRole('combobox', { name: /^state$/i }), donorSearch.state);
  await selectRadixOption(page, page.getByRole('combobox', { name: /^city$/i }), donorSearch.city);
  await page.getByRole('button', { name: /search donors/i }).click();
  await page.getByRole('link', { name: /view asha donor donor profile/i }).click();

  await expect(page).toHaveURL(new RegExp(`/donors/${searchDonorResult.id}$`));
});
