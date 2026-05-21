import { expect, test } from '@playwright/test';
import { searchDonorResult } from '../fixtures/test-data';
import {
  mockAuthenticatedSession,
  mockDonorDetail,
  mockDonorDetailFailure,
  mockUnauthenticatedSession,
} from '../helpers/api';

test('donor detail page loads from the donor route', async ({ page }) => {
  await mockUnauthenticatedSession(page);
  await mockDonorDetail(page);

  await page.goto(`/donors/${searchDonorResult.id}`);

  await expect(page.getByRole('heading', { name: searchDonorResult.name })).toBeVisible();
  await expect(page.getByText(searchDonorResult.bloodGroup).first()).toBeVisible();
  await expect(page.getByRole('heading', { name: /donor details/i })).toBeVisible();
});

test('donor detail page shows unavailable state on API failure', async ({ page }) => {
  await mockUnauthenticatedSession(page);
  await mockDonorDetailFailure(page);

  await page.goto(`/donors/${searchDonorResult.id}`);

  await expect(
    page.getByRole('heading', { name: /donor profile unavailable/i }),
  ).toBeVisible();
});

test('guest requesting blood from donor detail opens auth modal', async ({ page }) => {
  await mockUnauthenticatedSession(page);
  await mockDonorDetail(page);

  await page.goto(`/donors/${searchDonorResult.id}`);
  await page.getByRole('button', { name: /request blood/i }).click();

  await expect(page.getByRole('dialog')).toContainText('Login to LifeDrop');
});

test('logged-in user can open request blood modal from donor detail', async ({ page }) => {
  await mockAuthenticatedSession(page);
  await mockDonorDetail(page);

  await page.goto(`/donors/${searchDonorResult.id}`);
  await page.getByRole('button', { name: /request blood/i }).click();

  await expect(page.getByRole('dialog')).toContainText(
    `Send a request to ${searchDonorResult.name}`,
  );
  await expect(page.getByRole('checkbox', { name: /send sms alert/i })).toBeVisible();
});
