import { expect, Locator, Page } from '@playwright/test';
import type {
  GoogleAccounts,
  GoogleButtonOptions,
  GoogleCredentialResponse,
} from '../../src/features/auth/google.types';

declare global {
  interface Window {
    __lifedropGoogleCallback?: (response: GoogleCredentialResponse) => void;
  }
}

export async function selectRadixOption(
  page: Page,
  trigger: Locator,
  optionName: string | RegExp,
) {
  await trigger.click();
  const option =
    typeof optionName === 'string'
      ? page.getByRole('option', { exact: true, name: optionName })
      : page.getByRole('option', { name: optionName });
  await expect(option).toBeVisible();
  await option.click();
}

export async function installMockGoogleButton(page: Page) {
  await page.addInitScript(() => {
    const googleMock: GoogleAccounts = {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
          }) => {
            window.__lifedropGoogleCallback = config.callback;
          },
          renderButton: (container: HTMLElement, _options: GoogleButtonOptions) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = 'Continue with Google';
            button.addEventListener('click', () => {
              window.__lifedropGoogleCallback?.({ credential: 'mock-google-id-token' });
            });
            container.appendChild(button);
          },
        },
      },
    };
    window.google = googleMock;
  });
}
