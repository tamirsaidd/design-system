import { forwardRef, useState, type ReactNode, type TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { FormField } from '../FormField/FormField';
import { controlClass } from '../FormField/controlStyles';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Always visible above the field. */
  label: ReactNode;
  /** Help that stays visible while typing. */
  hint?: ReactNode;
  /** What went wrong and how to fix it. Sets the invalid state. */
  error?: ReactNode;
  /** Shows "Optional" next to the label. */
  optional?: boolean;
  /** Visible rows before the field scrolls. The user can drag it taller. */
  rows?: number;
  /** Class names for the outer field wrapper. */
  fieldClassName?: string;
}

/**
 * Multi-line text. With `maxLength`, a live count sits under the field so
 * the limit is never a surprise.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, optional, id, disabled, required, rows = 4, maxLength, className, fieldClassName, onChange, ...rest },
  ref,
) {
  const initial = String(rest.value ?? rest.defaultValue ?? '').length;
  const [typed, setTyped] = useState(initial);
  const count = rest.value !== undefined ? String(rest.value).length : typed;

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
        <div className="flex flex-col gap-nudge">
          <textarea
            ref={ref}
            rows={rows}
            maxLength={maxLength}
            {...control}
            {...rest}
            onChange={(event) => {
              setTyped(event.target.value.length);
              onChange?.(event);
            }}
            className={cn(controlClass, 'min-h-control-lg resize-y px-snug py-tight', className)}
          />
          {maxLength ? (
            <p className="self-end font-mono text-xs text-fg-muted tabular-nums">
              <span className="sr-only">Characters used: </span>
              {count} / {maxLength}
            </p>
          ) : null}
        </div>
      )}
    </FormField>
  );
});
