import { cva } from 'class-variance-authority';

export const badgeVariants = cva(
  'h-5 gap-1 rounded-full border border-transparent px-2 py-0.5 text-[0.625rem] font-medium transition-all has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:size-2.5! inline-flex items-center justify-center w-fit whitespace-nowrap shrink-0 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-colors overflow-hidden group/badge',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground [a]:hover:bg-primary/80',
        secondary:
          'bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80',
        success:
          'bg-success/10 [a]:hover:bg-success/20 focus-visible:ring-success/20 dark:focus-visible:ring-success/40 text-success-foreground dark:text-success dark:bg-success/20',
        warning:
          'bg-warning/10 [a]:hover:bg-warning/20 focus-visible:ring-warning/20 dark:focus-visible:ring-warning/40 text-warning-foreground dark:text-warning dark:bg-warning/20',
        destructive:
          'bg-destructive/10 [a]:hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 text-destructive dark:bg-destructive/20',
        soft: 'bg-primary/10 text-primary-foreground dark:text-primary [a]:hover:bg-primary/20',
        'soft-secondary':
          'bg-secondary/50 text-secondary-foreground [a]:hover:bg-secondary/60',
        'soft-success': 'bg-success/15 text-success [a]:hover:bg-success/25',
        'soft-warning':
          'bg-warning/15 text-warning-foreground dark:text-warning [a]:hover:bg-warning/25',
        'soft-destructive':
          'bg-destructive/10 text-destructive [a]:hover:bg-destructive/20',
        outline:
          'border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground bg-input/20 dark:bg-input/30',
        'outlined-warning':
          'border-warning text-warning [a]:hover:bg-warning/10',
        'outlined-destructive':
          'border-destructive text-destructive [a]:hover:bg-destructive/10 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40',
        ghost:
          'hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);
