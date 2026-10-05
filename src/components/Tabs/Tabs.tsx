import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn';

export interface TabItem {
  /** Stable key, also the value reported to `onValueChange`. */
  id: string;
  label: ReactNode;
  content: ReactNode;
  /** A count shown after the label, read out as part of the tab's name. */
  count?: number;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  /** Names the set of tabs for screen readers, such as "Filter programs". */
  label: string;
  /** The selected tab, when you control it. */
  value?: string;
  /** The tab selected first, when Tabs manages itself. */
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  /**
   * `automatic` selects a tab as soon as arrow keys reach it, right for
   * panels that render instantly. `manual` waits for Enter or Space.
   */
  activation?: 'automatic' | 'manual';
  className?: string;
}

/**
 * Tabs switch between views of the same thing. Keyboard: Tab enters the
 * list on the selected tab, arrow keys move along it and wrap, Home and End
 * jump to either end, and Tab again moves into the panel.
 */
export function Tabs({
  items,
  label,
  value,
  defaultValue,
  onValueChange,
  activation = 'automatic',
  className,
}: TabsProps) {
  const baseId = useId();
  const firstEnabled = items.find((item) => !item.disabled)?.id;
  const [internal, setInternal] = useState(defaultValue ?? firstEnabled);
  const selected = value ?? internal;
  const tabs = useRef(new Map<string, HTMLButtonElement>());
  const list = useRef<HTMLDivElement>(null);

  // On a narrow screen the tabs scroll sideways. Fade whichever edge has more
  // tabs past it, so nothing is hidden without a hint.
  useEffect(() => {
    const node = list.current;
    if (!node) return;
    const update = () => {
      const start = node.scrollLeft > 1;
      const end = node.scrollLeft + node.clientWidth < node.scrollWidth - 1;
      node.dataset.scrollFade = start && end ? 'both' : start ? 'start' : end ? 'end' : 'none';
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    node.addEventListener('scroll', update, { passive: true });
    return () => {
      observer.disconnect();
      node.removeEventListener('scroll', update);
    };
  }, []);

  const select = (id: string) => {
    if (value === undefined) setInternal(id);
    onValueChange?.(id);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, currentId: string) => {
    const enabled = items.filter((item) => !item.disabled);
    const index = enabled.findIndex((item) => item.id === currentId);
    const target = {
      ArrowRight: enabled[(index + 1) % enabled.length],
      ArrowLeft: enabled[(index - 1 + enabled.length) % enabled.length],
      Home: enabled[0],
      End: enabled[enabled.length - 1],
    }[event.key];
    if (!target) return;
    event.preventDefault();
    tabs.current.get(target.id)?.focus();
    if (activation === 'automatic') select(target.id);
  };

  const tabId = (id: string) => `${baseId}-tab-${id}`;
  const panelId = (id: string) => `${baseId}-panel-${id}`;

  return (
    <div className={cn('flex min-w-0 flex-col', className)}>
      <div
        ref={list}
        role="tablist"
        aria-label={label}
        aria-orientation="horizontal"
        className="flex gap-base overflow-x-auto border-b border-line-subtle [scrollbar-width:none] sm:gap-loose"
      >
        {items.map((item) => {
          const isSelected = item.id === selected;
          return (
            <button
              key={item.id}
              ref={(node) => {
                if (node) tabs.current.set(item.id, node);
                else tabs.current.delete(item.id);
              }}
              id={tabId(item.id)}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls={panelId(item.id)}
              tabIndex={isSelected ? 0 : -1}
              disabled={item.disabled}
              onClick={() => select(item.id)}
              onKeyDown={(event) => onKeyDown(event, item.id)}
              className={cn(
                'target-area relative inline-flex h-control-md shrink-0 items-center gap-tight whitespace-nowrap',
                'font-sans text-sm font-semibold text-fg-muted transition-[color] duration-(--ds-duration-fast) ease-out',
                'hover:text-fg aria-selected:text-fg focus-visible:-outline-offset-2',
                'before:absolute before:inset-x-0 before:bottom-0 before:h-0.5 before:rounded-full before:bg-accent before:opacity-0',
                'aria-selected:before:opacity-100',
                'disabled:cursor-not-allowed disabled:text-fg-disabled disabled:hover:text-fg-disabled',
              )}
            >
              {item.label}
              {item.count !== undefined ? (
                <span className="font-mono text-xs font-regular text-fg-muted tabular-nums">{item.count}</span>
              ) : null}
            </button>
          );
        })}
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          id={panelId(item.id)}
          role="tabpanel"
          aria-labelledby={tabId(item.id)}
          tabIndex={0}
          hidden={item.id !== selected}
          className="rounded-sm pt-loose focus-visible:outline-offset-4"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
