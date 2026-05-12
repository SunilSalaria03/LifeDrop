import { expect, test } from '@playwright/test';
import { logout } from '../helpers/auth';
import { mockAuthenticatedSession, mockLogout } from '../helpers/api';

test('logs out and restores the guest header actions', async ({ page }) => {
  const session = await mockAuthenticatedSession(page);
  await mockLogout(page, session);

  await page.goto('/');
  await expect(page.getByRole('button', { name: /open account menu/i })).toBeVisible();

  await logout(page);
});
