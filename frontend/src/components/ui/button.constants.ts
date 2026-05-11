import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex min-w-0 items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-red-700 text-white hover:bg-red-800',
        outline: 'border border-neutral-300 bg-white hover:bg-neutral-100',
        ghost: 'hover:bg-neutral-100',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);
