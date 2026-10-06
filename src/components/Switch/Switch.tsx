import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { FieldHint } from '../FormField/FormField';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'role'> {
  /** What turns on. Write it so "on" reads as true: "Only show programs I qualify for". */
  label: ReactNode;
  /** One line on what changes. */
  hint?: ReactNode;
  /** Called with the new state, after the native change event. */
  onCheckedChange?: (checked: boolean) => void;
}

/**
 * An on/off setting that applies straight away. Use a Checkbox instead when
 * the choice waits for a Save button. A native checkbox with the switch role,
 * so Space toggles it and forms read it.
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { label, hint, id, disabled, className, onChange, onCheckedChange, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? `switch-${autoId}`;
  const hintId = hint ? `${inputId}-hint` : undefined;
  return (
    <div className={cn('grid grid-cols-[1fr_auto] items-start gap-x-base gap-y-nudge text-md leading-normal', className)}>
      <label htmlFor={inputId} className={cn('cursor-pointer', disabled ? 'cursor-not-allowed text-fg-disabled' : 'text-fg')}>
        {label}
      </label>
      <span className="target-area relative row-span-2 flex h-lh items-center">
        <span className="relative inline-flex h-6 w-11 shrink-0">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            role="switch"
            disabled={disabled}
            aria-describedby={hintId}
            onChange={(event) => {
              onChange?.(event);
              onCheckedChange?.(event.target.checked);
            }}
            className={cn(
              'peer absolute inset-0 m-none size-full cursor-pointer appearance-none rounded-full bg-line-control',
              'transition-[background-color] duration-(--ds-duration-fast) ease-out',
              'checked:bg-accent hover:checked:bg-accent-hover',
              'disabled:cursor-not-allowed disabled:bg-line disabled:checked:bg-fg-disabled',
            )}
            {...rest}
          />
          <span
            aria-hidden
            className={cn(
              'pointer-events-none absolute left-0.5 top-0.5 size-5 rounded-full bg-surface-raised shadow-elevation-sm',
              'transition-transform duration-(--ds-duration-fast) ease-out peer-checked:translate-x-5',
              'peer-disabled:shadow-none',
            )}
          />
        </span>
      </span>
      {hint ? <FieldHint id={hintId}>{hint}</FieldHint> : null}
    </div>
  );
});
