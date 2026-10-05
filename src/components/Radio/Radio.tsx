import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { FieldHint, FormField } from '../FormField/FormField';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Sits to the right of the circle and selects it when clicked. */
  label: ReactNode;
  /** One line that helps someone choose. */
  hint?: ReactNode;
}

/** One option in a RadioGroup. Arrow keys move between options natively. */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, hint, id, disabled, className, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? `radio-${autoId}`;
  const hintId = hint ? `${inputId}-hint` : undefined;
  return (
    <div className={cn('grid grid-cols-[auto_1fr] gap-x-tight gap-y-nudge text-md leading-normal', className)}>
      <span className="target-area flex h-lh items-center justify-center">
        <input
          ref={ref}
          id={inputId}
          type="radio"
          disabled={disabled}
          aria-describedby={hintId}
          className={cn(
            'peer m-0 size-5 shrink-0 cursor-pointer appearance-none rounded-full border border-line-control bg-surface-raised',
            'transition-[background-color,border-color] duration-(--ds-duration-fast) ease-out hover:border-fg-muted',
            'checked:border-accent checked:bg-accent checked:hover:bg-accent-hover',
            'aria-invalid:border-danger',
            'disabled:cursor-not-allowed disabled:border-line disabled:bg-surface-muted',
            'disabled:checked:border-fg-disabled disabled:checked:bg-fg-disabled',
          )}
          {...rest}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute size-2 scale-0 rounded-full bg-on-accent transition-transform duration-(--ds-duration-fast) ease-out peer-checked:scale-100"
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
    </div>
  );
});

export interface RadioOption {
  value: string;
  label: string;
  hint?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  /** The question, shown as the group's legend. */
  label: ReactNode;
  /** Help for the whole group. */
  hint?: ReactNode;
  /** What to do to continue. Marks every option invalid. */
  error?: ReactNode;
  /** Shared by every option. One is generated if you leave it out. */
  name?: string;
  options: RadioOption[];
  /** The selected value, when you control it. */
  value?: string;
  /** The starting value, when the group manages itself. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Horizontal suits two or three short options. */
  orientation?: 'vertical' | 'horizontal';
  optional?: boolean;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

/** A labelled set of radios: a fieldset with a legend, hint and error. */
export function RadioGroup({
  label,
  hint,
  error,
  name,
  options,
  value,
  defaultValue,
  onValueChange,
  orientation = 'vertical',
  optional,
  required,
  disabled,
  className,
}: RadioGroupProps) {
  const autoName = useId();
  const groupName = name ?? `radio-group-${autoName}`;
  const controlled = value !== undefined;
  return (
    <FormField
      as="fieldset"
      label={label}
      hint={hint}
      error={error}
      optional={optional}
      required={required}
      disabled={disabled}
      className={className}
    >
      {(control) => (
        <div
          className={cn(
            'flex',
            orientation === 'vertical' ? 'flex-col gap-snug' : 'flex-row flex-wrap gap-x-loose gap-y-snug',
          )}
        >
          {options.map((option) => (
            <Radio
              key={option.value}
              name={groupName}
              value={option.value}
              label={option.label}
              hint={option.hint}
              disabled={option.disabled}
              required={required}
              aria-invalid={control['aria-invalid']}
              {...(controlled ? { checked: value === option.value } : { defaultChecked: defaultValue === option.value })}
              onChange={(event) => {
                if (event.target.checked) onValueChange?.(option.value);
              }}
            />
          ))}
        </div>
      )}
    </FormField>
  );
}
