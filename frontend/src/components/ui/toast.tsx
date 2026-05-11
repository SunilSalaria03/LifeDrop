'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Toast, ToastContextValue } from './toast.types';

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const value = useMemo<ToastContextValue>(
    () => ({
      showToast: (toast) => {
        const id = Date.now();

        setToasts((currentToasts) => [
          ...currentToasts,
          {
            ...toast,
            id,
          },
        ]);

        window.setTimeout(() => {
          setToasts((currentToasts) =>
            currentToasts.filter((currentToast) => currentToast.id !== id),
          );
        }, 3600);
      },
    }),
    [],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-[80] grid w-[calc(100vw-2rem)] max-w-sm gap-3 sm:right-6 sm:top-6">
        {toasts.map((toast) => {
          const Icon = toast.variant === 'success' ? CheckCircle2 : XCircle;

          return (
            <div
              className={
                toast.variant === 'success'
                  ? 'flex items-start gap-3 rounded-2xl border border-green-100 bg-white p-4 text-green-800 shadow-2xl shadow-green-950/10'
                  : 'flex items-start gap-3 rounded-2xl border border-red-100 bg-white p-4 text-red-800 shadow-2xl shadow-red-950/10'
              }
              key={toast.id}
            >
              <Icon className="mt-0.5 h-5 w-5 shrink-0" />
              <div className="min-w-0">
                {toast.title ? (
                  <p className="text-sm font-bold text-neutral-950">
                    {toast.title}
                  </p>
                ) : null}
                <p className="text-sm font-semibold leading-5">
                  {toast.message}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within ToastProvider.');
  }

  return context;
}
