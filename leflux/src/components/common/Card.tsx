import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export function Card({ className, interactive, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'surface-glass transition-transform duration-200 ease-in-out',
        interactive && 'hover:scale-[1.02]',
        className
      )}
      {...props}
    />
  );
}
