export type ToastVariant = 'success' | 'error';

export type Toast = {
  id: number;
  message: string;
  title?: string;
  variant: ToastVariant;
};

export type ToastContextValue = {
  showToast: (toast: Omit<Toast, 'id'>) => void;
};
