import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

// FIX: Replaced React.ButtonHTMLAttributes with Framer Motion's HTMLMotionProps to resolve type conflicts.
// This is a more robust solution than omitting specific conflicting props, and it correctly types all motion-related attributes.
type ButtonProps = HTMLMotionProps<'button'> & {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  className,
  ...props
}) => {
  const baseClasses =
    'rounded-xl font-display font-semibold transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-base-end focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2';

  const variantClasses = {
    primary: 'bg-accent text-dark-base-end hover:brightness-110',
    secondary: 'bg-white/10 text-dark-text-primary hover:bg-white/20',
    ghost: 'bg-transparent text-dark-text-secondary hover:bg-white/5 hover:text-dark-text-primary',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </motion.button>
  );
};
