import { Check, Minus } from 'lucide-react';
import { forwardRef, useEffect, useId, useImperativeHandle, useRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { FieldError, FieldHint } from '../FormField/FormField';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Sits to the right of the box and toggles it when clicked. */
  label: ReactNode;
  /** Help under the label. */
  hint?: ReactNode;
  /** What to do to continue. Sets the invalid state. */
  error?: ReactNode;
  /** The "some but not all" state, for a box that selects a group. */
  indeterminate?: boolean;
}

/**
 * A native checkbox, drawn to match the system. The box keeps a 44px tap
 * area and the whole label is clickable.
 *
 * | State          | Edge          | Fill           | Mark      |
 * | -------------- | ------------- | -------------- | --------- |
 * | Unchecked      | line-control  | surface-raised | none      |
 * | Checked        | accent        | accent         | on-accent |
 * | Indeterminate  | accent        | accent         | on-accent |
 * | Invalid        | danger        | surface-raised | none      |
 * | Disabled       | line          | surface-muted  | fg-disabled fill when checked |
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, hint, error, indeterminate = false, id, disabled, className, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? `checkbox-${autoId}`;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  const inner = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inner.current as HTMLInputElement);
  useEffect(() => {
    if (inner.current) inner.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <div className={cn('grid grid-cols-[auto_1fr] gap-x-tight gap-y-nudge text-md leading-normal', className)}>
      <span className="target-area flex h-lh items-center justify-center">
        <input
          ref={inner}
          id={inputId}
          type="checkbox"
          disabled={disabled}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          className={cn(
            'peer m-0 size-5 shrink-0 cursor-pointer appearance-none rounded-checkbox border border-line-control bg-surface-raised',
            'transition-[background-color,border-color] duration-(--ds-duration-fast) ease-out hover:border-fg-muted',
            'checked:border-accent checked:bg-accent checked:hover:border-accent-hover checked:hover:bg-accent-hover',
            'indeterminate:border-accent indeterminate:bg-accent',
            'aria-invalid:border-danger',
            'disabled:cursor-not-allowed disabled:border-line disabled:bg-surface-muted',
            'disabled:checked:border-fg-disabled disabled:checked:bg-fg-disabled disabled:indeterminate:bg-fg-disabled',
          )}
          {...rest}
        />
        <Check
          aria-hidden
          strokeWidth={3}
          className="pointer-events-none absolute size-3.5 text-on-accent opacity-0 peer-checked:opacity-100 peer-indeterminate:opacity-0"
        />
        <Minus
          aria-hidden
          strokeWidth={3}
          className="pointer-events-none absolute size-3.5 text-on-accent opacity-0 peer-indeterminate:opacity-100"
        />
      </span>
      <label htmlFor={inputId} className={cn('cursor-pointer', disabled ? 'cursor-not-allowed text-fg-disabled' : 'text-fg')}>
        {label}
      </label>
      {hint ? (
        <div className="col-start-2">
          <FieldHint id={hintId}>{hint}</FieldHint>
        </div>
      ) : null}
      {error ? (
        <div className="col-start-2">
          <FieldError id={errorId}>{error}</FieldError>
        </div>
      ) : null}
    </div>
  );
});
