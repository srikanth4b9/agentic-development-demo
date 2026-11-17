import { useId, type SelectHTMLAttributes } from 'react';

export interface SelectOption<V extends string = string> {
  value: V;
  label: string;
}

export interface SelectProps<V extends string = string> extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'id' | 'onChange' | 'value'
> {
  label: string;
  options: ReadonlyArray<SelectOption<V>>;
  value: V;
  onChange: (value: V) => void;
  error?: string;
  /** Visually hide the label while keeping it available to assistive tech. */
  hideLabel?: boolean;
}

/** Native select with a programmatic label — keyboard accessible by default. */
export function Select<V extends string = string>({
  label,
  options,
  value,
  onChange,
  error,
  hideLabel = false,
  ...rest
}: SelectProps<V>) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className="field">
      <label htmlFor={id} className={hideLabel ? 'visually-hidden' : 'field__label'}>
        {label}
      </label>
      <select
        id={id}
        className="field__control"
        value={value}
        onChange={(e) => onChange(e.target.value as V)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...rest}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && (
        <span id={errorId} className="field__error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
