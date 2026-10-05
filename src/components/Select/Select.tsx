import { ChevronDown } from 'lucide-react';
import { forwardRef, type ReactNode, type SelectHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { FormField } from '../FormField/FormField';
import { controlClass } from '../FormField/controlStyles';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** Always visible above the field. */
  label: ReactNode;
  /** Help that stays visible. */
  hint?: ReactNode;
  /** What went wrong and how to fix it. Sets the invalid state. */
  error?: ReactNode;
  /** Shows "Optional" next to the label. */
  optional?: boolean;
  /** The choices. Pass `<option>` children instead if you need groups. */
  options?: SelectOption[];
  /** A first, unselectable line such as "Choose a term". */
  placeholder?: string;
  /** Class names for the outer field wrapper. */
  fieldClassName?: string;
}

/**
 * A native select, styled to match the other fields. Native on purpose:
 * phones get their own picker, and keyboard and screen reader support come
 * for free.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, error, optional, options, placeholder, id, disabled, required, className, fieldClassName, children, ...rest },
  ref,
) {
  const usesPlaceholder = placeholder !== undefined && rest.value === undefined && rest.defaultValue === undefined;
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
          <select
            ref={ref}
            {...control}
            {...rest}
            defaultValue={usesPlaceholder ? '' : rest.defaultValue}
            className={cn(controlClass, 'h-control-md cursor-pointer appearance-none pl-snug pr-control-md', className)}
          >
            {placeholder !== undefined ? (
              <option value="" disabled>
                {placeholder}
              </option>
            ) : null}
            {options?.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
            {children}
          </select>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 flex w-control-md items-center justify-center text-fg-muted"
          >
            <ChevronDown className="size-4" />
          </span>
        </div>
      )}
    </FormField>
  );
});
