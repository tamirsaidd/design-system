import { cn } from '../../lib/cn';

/**
 * The shared look of every text-entry control: Input, Textarea and Select.
 * One implementation, so a fix to one is a fix to all three.
 *
 * | State          | Edge              | Fill            | Text          |
 * | -------------- | ----------------- | --------------- | ------------- |
 * | Default        | line-control      | surface-raised  | fg            |
 * | Hover          | fg-muted          | surface-raised  | fg            |
 * | Focus-visible  | focus outline     | surface-raised  | fg            |
 * | Invalid        | danger            | surface-raised  | fg            |
 * | Disabled       | line              | surface-muted   | fg-disabled   |
 */
export const controlClass = cn(
  'block w-full min-w-0 rounded-control border border-line-control bg-surface-raised',
  'font-sans text-md leading-normal text-fg placeholder:text-fg-muted',
  'transition-[border-color,background-color] duration-(--ds-duration-fast) ease-out',
  'hover:border-fg-muted',
  'aria-invalid:border-danger aria-invalid:hover:border-danger',
  'disabled:cursor-not-allowed disabled:border-line disabled:bg-surface-muted disabled:text-fg-disabled',
  'disabled:hover:border-line',
);
