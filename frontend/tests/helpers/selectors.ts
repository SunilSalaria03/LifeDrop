import { expect, Locator, Page } from '@playwright/test';

declare global {
  interface Window {
    __lifedropGoogleCallback?: (response: { credential: string }) => void;
    google?: {
      accounts: {
        id: {
          initialize: (config: { callback: (response: { credential: string }) => void }) => void;
          renderButton: (container: HTMLElement) => void;
        };
      };
    };
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
    window.google = {
      accounts: {
        id: {
          initialize: (config: { callback: (response: { credential: string }) => void }) => {
            window.__lifedropGoogleCallback = config.callback;
          },
          renderButton: (container: HTMLElement) => {
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
  });
}
