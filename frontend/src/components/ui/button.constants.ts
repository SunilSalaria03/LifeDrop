import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex min-w-0 items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-red-700 text-white shadow-sm shadow-red-700/20 hover:bg-red-800',
        outline:
          'border border-neutral-300 bg-white shadow-sm hover:border-neutral-300 hover:bg-neutral-50',
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
