import type { HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLElement> {
  /** Render as a semantic element, e.g. "article" for list items or "section". */
  as?: 'div' | 'article' | 'section' | 'li';
  padding?: 'sm' | 'md';
}

export function Card({ as: Tag = 'div', padding = 'md', className, ...rest }: CardProps) {
  const classes = ['card', `card--pad-${padding}`, className].filter(Boolean).join(' ');
  return <Tag className={classes} {...rest} />;
}
