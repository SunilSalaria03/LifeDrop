import { expect, test } from '@playwright/test';
import { donorFormData } from '../fixtures/test-data';
import {
  mockAuthenticatedSession,
  mockCreateDonorProfile,
  mockUnauthenticatedSession,
} from '../helpers/api';
import { selectRadixOption } from '../helpers/selectors';

test('asks guests to log in before becoming a donor', async ({ page }) => {
  await mockUnauthenticatedSession(page);

  await page.goto('/');
  await page.getByRole('navigation').getByRole('button', { name: /become a donor/i }).click();

  await expect(page.getByRole('dialog')).toContainText('Login to LifeDrop');
  await expect(page.getByLabel('Phone number')).toBeVisible();
});

test('opens the donor form for a logged-in normal user', async ({ page }) => {
  await mockAuthenticatedSession(page);

  await page.goto('/');
  await expect(page.getByRole('button', { name: /open account menu/i })).toBeVisible();
  const becomeDonorButton = page
    .getByRole('navigation')
    .getByRole('link', { name: /become a donor/i });
  await becomeDonorButton.click({ force: true });

  await expect(page).toHaveURL(/\/become-donor$/);
  await expect(
    page.getByRole('heading', { name: /share your donor availability/i }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: /^become a donor$/i })).toBeVisible();
});

test('validates required donor fields', async ({ page }) => {
  await mockAuthenticatedSession(page);

  await page.goto('/become-donor');
  await page.getByLabel('Name').fill('');
  await page.getByRole('button', { name: /^become a donor$/i }).click();

  await expect(page.getByText(/name is required/i)).toBeVisible();
});

test('submits the donor form with safe mocked API data', async ({ page }) => {
  const session = await mockAuthenticatedSession(page);
  await mockCreateDonorProfile(page, session);

  await page.goto('/become-donor');

  await page.getByLabel('Name').fill(donorFormData.name);
  await selectRadixOption(
    page,
    page.getByRole('combobox', { name: /blood group/i }),
    donorFormData.bloodGroup,
  );
  await selectRadixOption(
    page,
    page.getByRole('combobox', { name: /gender/i }),
    donorFormData.gender,
  );
  await page.getByLabel('Weight').fill(donorFormData.weight);
  await page.getByLabel('Birth date').fill(donorFormData.birthDate);
  await selectRadixOption(
    page,
    page.getByRole('combobox', { name: /^state$/i }),
    donorFormData.state,
  );
  await selectRadixOption(
    page,
    page.getByRole('combobox', { name: /district/i }),
    donorFormData.district,
  );
  await page.getByLabel('Pincode').fill(donorFormData.pincode);

  await page.getByRole('button', { name: /^become a donor$/i }).click();

  await expect(page.getByText(/donor profile saved/i)).toBeVisible();
  await expect(page).toHaveURL(/\/profile$/, { timeout: 10_000 });
});
