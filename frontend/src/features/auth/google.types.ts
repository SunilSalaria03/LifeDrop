export type GoogleCredentialResponse = {
  credential?: string;
};

export type GoogleButtonOptions = Record<string, string | number | boolean>;

export type GoogleAccounts = {
  accounts: {
    id: {
      initialize: (config: {
        client_id: string;
        callback: (response: GoogleCredentialResponse) => void;
      }) => void;
      renderButton: (
        element: HTMLElement,
        options: GoogleButtonOptions,
      ) => void;
    };
  };
};

declare global {
  interface Window {
    google?: GoogleAccounts;
  }
}

export {};
