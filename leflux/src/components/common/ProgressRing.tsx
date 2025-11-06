import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressRingProps {
  value: number; // 0..1
  size?: number;
  strokeWidth?: number;
  className?: string;
}

const CIRCUMFERENCE = 100;

export function ProgressRing({ value, size = 72, strokeWidth = 6, className }: ProgressRingProps) {
  const clamped = Math.min(1, Math.max(0, value));
  const radius = (CIRCUMFERENCE - strokeWidth) / 2;
  const dashArray = Math.PI * (CIRCUMFERENCE - strokeWidth);
  const dashOffset = dashArray * (1 - clamped);

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-full bg-white/5 backdrop-blur-sm',
        className
      )}
      style={{ width: size, height: size }}
    >
      <svg
        className="absolute"
        width={size}
        height={size}
        viewBox={`0 0 ${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
      >
        <circle
          className="stroke-white/10"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={CIRCUMFERENCE / 2}
          cy={CIRCUMFERENCE / 2}
        />
        <motion.circle
          className="stroke-accent drop-shadow-[0_0_12px_rgba(255,209,102,0.45)]"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={CIRCUMFERENCE / 2}
          cy={CIRCUMFERENCE / 2}
          strokeDasharray={dashArray}
          strokeDashoffset={dashArray}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        />
      </svg>
      <span className="text-sm font-medium text-text-primary">{Math.round(clamped * 100)}%</span>
    </div>
  );
}
