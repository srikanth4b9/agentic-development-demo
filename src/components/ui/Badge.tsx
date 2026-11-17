import type { ReactNode } from 'react';

export type BadgeTone = 'neutral' | 'info' | 'warning' | 'accent' | 'success' | 'danger';

export interface BadgeProps {
  tone?: BadgeTone;
  children: ReactNode;
  /** Optional accessible label when the visible text alone is ambiguous (e.g. "Priority: High"). */
  'aria-label'?: string;
}

export function Badge({ tone = 'neutral', children, ...rest }: BadgeProps) {
  return (
    <span className={`badge badge--${tone}`} {...rest}>
      {children}
    </span>
  );
}
