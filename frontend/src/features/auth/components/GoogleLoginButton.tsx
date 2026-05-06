"use client";

import { useEffect, useRef, useState } from "react";
import { AxiosError } from "axios";
import { useAuth } from "../hooks/useAuth";
import { AuthUser } from "../types/auth.types";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: Record<string, string | number | boolean>,
          ) => void;
        };
      };
    };
  }
}

function getErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message;

    if (Array.isArray(message)) {
      return message.join(" ");
    }

    if (typeof message === "string") {
      return message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Google login failed. Please try again.";
}

type GoogleLoginButtonProps = {
  onAuthenticated?: (user: AuthUser) => void;
  onSuccess?: () => void;
};

export function GoogleLoginButton({
  onAuthenticated,
  onSuccess,
}: GoogleLoginButtonProps) {
  const { googleMutation } = useAuth();
  const { error, isError, isPending, mutateAsync } = googleMutation;
  const buttonRef = useRef<HTMLDivElement>(null);
  const [scriptError, setScriptError] = useState<string | null>(null);
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!googleClientId) {
      setScriptError(
        "Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID in frontend/.env.local.",
      );
      return;
    }

    if (window.google) {
      renderGoogleButton();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = renderGoogleButton;
    script.onerror = () =>
      setScriptError("Could not load Google login script.");
    document.head.appendChild(script);

    return () => {
      script.remove();
    };

    function renderGoogleButton() {
      if (!window.google || !buttonRef.current || !googleClientId) {
        return;
      }

      buttonRef.current.innerHTML = "";
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response) => {
          if (!response.credential) {
            setScriptError("Google did not return an ID token.");
            return;
          }

          const authResponse = await mutateAsync(response.credential);
          onAuthenticated?.(authResponse.user);
        },
      });
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "pill",
        width: buttonRef.current.offsetWidth || 360,
      });
    }
  }, [googleClientId, mutateAsync, onAuthenticated]);

  const errorMessage = scriptError ?? (isError ? getErrorMessage(error) : null);

  useEffect(() => {
    if (googleMutation.isSuccess) {
      onSuccess?.();
    }
  }, [googleMutation.isSuccess, onSuccess]);

  return (
    <div className="grid gap-3">
      <div
        className={`grid min-h-11 w-full min-w-0 place-items-center overflow-hidden [&>div]:max-w-full ${isPending ? "pointer-events-none opacity-70" : ""}`}
        ref={buttonRef}
      />
      {isPending ? (
        <p className="text-sm font-medium text-neutral-600">
          Connecting to Google...
        </p>
      ) : null}
      {errorMessage ? (
        <p className="rounded-2xl bg-red-50 px-3 py-2 text-sm font-medium text-red-800 ring-1 ring-red-100">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
