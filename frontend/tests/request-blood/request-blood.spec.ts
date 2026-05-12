import { expect, test } from '@playwright/test';
import { requestBloodData, searchDonorResult } from '../fixtures/test-data';
import {
  mockAuthenticatedSession,
  mockDonorDetail,
  mockRequestBlood,
} from '../helpers/api';

async function openRequestModal(page: import('@playwright/test').Page) {
  await mockAuthenticatedSession(page);
  await mockDonorDetail(page);
  await page.goto(`/donors/${searchDonorResult.id}`);
  await page.getByRole('button', { name: /request blood/i }).click();
  await expect(page.getByRole('dialog')).toContainText(`Request ${searchDonorResult.name}`);
}

test('consent and SMS selection are required before sending request', async ({ page }) => {
  await openRequestModal(page);

  await expect(page.getByRole('button', { name: /send request/i })).toBeDisabled();
  await page.getByRole('checkbox', { name: /send sms alert/i }).check();
  await expect(page.getByRole('button', { name: /send request/i })).toBeDisabled();
  await page.getByRole('checkbox', { name: /share my contact details/i }).check();
  await expect(page.getByRole('button', { name: /send request/i })).toBeEnabled();
});

test('submits blood request with SMS option', async ({ page }) => {
  await mockRequestBlood(page);
  await openRequestModal(page);

  await page.getByRole('checkbox', { name: /send sms alert/i }).check();
  await page.getByRole('checkbox', { name: /share my contact details/i }).check();
  await page.getByPlaceholder(/add a short note/i).fill(requestBloodData.message);
  await page.getByRole('button', { name: /send request/i }).click();

  await expect(page.getByText(/request sent/i)).toBeVisible();
});

test('request blood API failure shows an error state', async ({ page }) => {
  await mockRequestBlood(page, { fail: true });
  await openRequestModal(page);

  await page.getByRole('checkbox', { name: /send sms alert/i }).check();
  await page.getByRole('checkbox', { name: /share my contact details/i }).check();
  await page.getByRole('button', { name: /send request/i }).click();

  await expect(page.getByText(/request failed/i)).toBeVisible();
  await expect(page.getByText(/sms alert could not be sent/i)).toBeVisible();
});

test('WhatsApp option remains visible but service is skipped by the mocked API', async ({ page }) => {
  await mockRequestBlood(page);
  await openRequestModal(page);

  await expect(page.getByRole('checkbox', { name: /send whatsapp alert/i })).toBeVisible();
  // TODO: Add an assertion for real WhatsApp delivery once the service is active in the backend.
});
