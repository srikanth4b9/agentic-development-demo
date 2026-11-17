import { useId, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';

interface FieldChrome {
  label: string;
  hint?: string;
  error?: string;
}

function describedBy(hintId: string, errorId: string, hint?: string, error?: string) {
  return [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined;
}

export type TextFieldProps = FieldChrome & Omit<InputHTMLAttributes<HTMLInputElement>, 'id'>;

/** Labelled text input with hint and error wiring (aria-invalid / aria-describedby). */
export function TextField({ label, hint, error, ...inputProps }: TextFieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  return (
    <div className="field">
      <label htmlFor={id} className="field__label">
        {label}
      </label>
      <input
        id={id}
        className="field__control"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(hintId, errorId, hint, error)}
        {...inputProps}
      />
      {hint && (
        <span id={hintId} className="field__hint">
          {hint}
        </span>
      )}
      {error && (
        <span id={errorId} className="field__error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

export type TextAreaProps = FieldChrome & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'>;

export function TextArea({ label, hint, error, ...areaProps }: TextAreaProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  return (
    <div className="field">
      <label htmlFor={id} className="field__label">
        {label}
      </label>
      <textarea
        id={id}
        className="field__control"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(hintId, errorId, hint, error)}
        {...areaProps}
      />
      {hint && (
        <span id={hintId} className="field__hint">
          {hint}
        </span>
      )}
      {error && (
        <span id={errorId} className="field__error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
