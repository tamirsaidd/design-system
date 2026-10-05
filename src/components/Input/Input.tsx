import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { FormField } from '../FormField/FormField';
import { controlClass } from '../FormField/controlStyles';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Always visible above the field. */
  label: ReactNode;
  /** Help that stays visible while typing. */
  hint?: ReactNode;
  /** What went wrong and how to fix it. Sets the invalid state. */
  error?: ReactNode;
  /** Shows "Optional" next to the label. */
  optional?: boolean;
  /** An icon inside the field's start edge, such as a search glass. */
  iconStart?: ReactNode;
  /** Class names for the outer field wrapper. */
  fieldClassName?: string;
}

/**
 * A single-line text field, labelled and described through FormField.
 * Text is 16px so phones never zoom in when it takes focus.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, optional, iconStart, id, disabled, required, className, fieldClassName, type = 'text', ...rest },
  ref,
) {
  return (
    <FormField
      label={label}
      hint={hint}
      error={error}
      optional={optional}
      id={id}
      disabled={disabled}
      required={required}
      className={fieldClassName}
    >
      {(control) => (
        <div className="relative">
          {iconStart ? (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 flex w-control-md items-center justify-center text-fg-muted [&>svg]:size-4"
            >
              {iconStart}
            </span>
          ) : null}
          <input
            ref={ref}
            type={type}
            {...control}
            {...rest}
            className={cn(controlClass, 'h-control-md px-snug', iconStart && 'pl-control-md', className)}
          />
        </div>
      )}
    </FormField>
  );
});
