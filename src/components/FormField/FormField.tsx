import { CircleAlert } from 'lucide-react';
import { useId, type ReactNode } from 'react';
import { cn } from '../../lib/cn';

/** What a control needs from its field to be labelled and described. */
export interface FieldControlProps {
  id: string;
  'aria-describedby'?: string;
  'aria-invalid'?: true;
  disabled?: boolean;
  required?: boolean;
}

export interface FormFieldProps {
  /** Always visible, above the control. A placeholder is never the label. */
  label: ReactNode;
  /** Help that stays put: format, limits, why we ask. */
  hint?: ReactNode;
  /** Replaces nothing: shown under the hint, and turns the control's edge red. */
  error?: ReactNode;
  /** Marks the field as optional in the label, instead of starring required ones. */
  optional?: boolean;
  required?: boolean;
  disabled?: boolean;
  /** Use your own id for the control; one is generated otherwise. */
  id?: string;
  /** `fieldset` groups radios or checkboxes under a legend. */
  as?: 'div' | 'fieldset';
  className?: string;
  /** Render the control with the ids and aria attributes it needs. */
  children: (control: FieldControlProps) => ReactNode;
}

export function FieldHint({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <p id={id} className="text-sm leading-normal text-fg-muted">
      {children}
    </p>
  );
}

export function FieldError({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <p id={id} className="flex items-start gap-nudge text-sm leading-normal text-danger-fg">
      <span aria-hidden className="flex h-lh shrink-0 items-center">
        <CircleAlert className="size-4" />
      </span>
      <span>{children}</span>
    </p>
  );
}

/**
 * Label, control, hint and error, wired together. Every form control in the
 * system renders through this, so labels, descriptions and error states
 * behave the same everywhere.
 */
export function FormField({
  label,
  hint,
  error,
  optional = false,
  required,
  disabled,
  id,
  as = 'div',
  className,
  children,
}: FormFieldProps) {
  const autoId = useId();
  const controlId = id ?? `field-${autoId}`;
  const hintId = hint ? `${controlId}-hint` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  const labelContent = (
    <>
      {label}
      {optional ? <span className="ml-tight font-regular text-fg-muted">Optional</span> : null}
    </>
  );
  const labelClass = cn('text-sm font-semibold leading-normal', disabled ? 'text-fg-disabled' : 'text-fg');

  const control = children({
    id: controlId,
    'aria-describedby': describedBy,
    'aria-invalid': error ? true : undefined,
    disabled,
    required,
  });

  const messages = (
    <>
      {hint ? <FieldHint id={hintId}>{hint}</FieldHint> : null}
      {error ? <FieldError id={errorId}>{error}</FieldError> : null}
    </>
  );

  if (as === 'fieldset') {
    return (
      <fieldset
        aria-describedby={describedBy}
        disabled={disabled}
        className={cn('m-none flex min-w-0 flex-col gap-tight border-0 p-none', className)}
      >
        <legend className={cn(labelClass, 'mb-tight p-none')}>{labelContent}</legend>
        {control}
        {messages}
      </fieldset>
    );
  }

  return (
    <div className={cn('flex min-w-0 flex-col gap-tight', className)}>
      <label htmlFor={controlId} className={labelClass}>
        {labelContent}
      </label>
      {control}
      {messages}
    </div>
  );
}
