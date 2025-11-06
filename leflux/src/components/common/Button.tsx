import { forwardRef, ForwardedRef } from 'react';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

type ButtonProps = (
  | ({ to?: never; href?: never } & ButtonHTMLAttributes<HTMLButtonElement>)
  | ({ to: string; href?: never } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>)
  | ({ href: string; to?: never } & AnchorHTMLAttributes<HTMLAnchorElement>)
) & {
  intent?: 'accent' | 'neutral' | 'ghost';
  fullWidth?: boolean;
};

const baseStyles =
  'focus-ring inline-flex items-center justify-center rounded-3xl px-5 py-3 text-sm font-medium transition-transform duration-200 ease-in-out disabled:pointer-events-none disabled:opacity-40';

const intents: Record<NonNullable<ButtonProps['intent']>, string> = {
  accent: 'bg-accent text-[#1E1E1E] hover:scale-[1.02] shadow-[0_12px_40px_-20px_rgba(255,209,102,0.9)]',
  neutral: 'bg-white/10 text-text-primary hover:bg-white/16 hover:scale-[1.02] border border-white/10',
  ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-white/5',
};

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ intent = 'neutral', fullWidth, className, children, to, href, ...props }, ref) => {
    const composed = cn(baseStyles, intents[intent], fullWidth && 'w-full', className);

    if (to) {
      return (
  <Link ref={ref as ForwardedRef<HTMLAnchorElement>} to={to} className={composed} {...(props as Record<string, unknown>)}>
          {children}
        </Link>
      );
    }

    if (href) {
      return (
  <a ref={ref as ForwardedRef<HTMLAnchorElement>} href={href} className={composed} {...(props as Record<string, unknown>)}>
          {children}
        </a>
      );
    }

    return (
  <button ref={ref as ForwardedRef<HTMLButtonElement>} className={composed} {...(props as Record<string, unknown>)}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';