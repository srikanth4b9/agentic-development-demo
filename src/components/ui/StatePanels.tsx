import type { ReactNode } from 'react';

export function Spinner({ label = 'Loading' }: { label?: string }) {
  return (
    <span role="status" className="row">
      <span className="spinner" aria-hidden="true" />
      <span className="visually-hidden">{label}</span>
    </span>
  );
}

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="state-panel" aria-busy="true">
      <Spinner label={label} />
      <p className="text-muted text-sm" aria-hidden="true">
        {label}
      </p>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="state-panel">
      <p className="state-panel__title">{title}</p>
      {description && <p className="text-muted text-sm">{description}</p>}
      {action}
    </div>
  );
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  action,
}: {
  title?: string;
  message: string;
  action?: ReactNode;
}) {
  return (
    <div className="state-panel state-panel--error" role="alert">
      <p className="state-panel__title">{title}</p>
      <p className="text-sm">{message}</p>
      {action}
    </div>
  );
}
