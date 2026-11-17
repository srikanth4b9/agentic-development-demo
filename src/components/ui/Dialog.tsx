import { useId, type ReactNode } from 'react';

export interface DialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

/** Modal dialog used for forms and confirmations. */
export function Dialog({ open, title, onClose, children }: DialogProps) {
  const titleId = useId();
  if (!open) return null;

  /* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions, jsx-a11y/no-noninteractive-element-interactions */
  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div
        className="dialog"
        role="dialog"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id={titleId} className="dialog__title">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
  /* eslint-enable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions, jsx-a11y/no-noninteractive-element-interactions */
}
