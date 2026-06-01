"use client";

import { useEffect, useRef, useState } from "react";
import "../google.types";
import { getGoogleLoginErrorMessage } from "../google.helpers";
import { useAuth } from "../hooks/useAuth";
import { GoogleLoginButtonProps } from "../auth-component.types";

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

          try {
            const authResponse = await mutateAsync(response.credential);
            onAuthenticated?.(authResponse.user);
          } catch {
            // Error is surfaced through mutation state and inline UI message.
          }
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

  const errorMessage = scriptError ?? (isError ? getGoogleLoginErrorMessage(error) : null);

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
