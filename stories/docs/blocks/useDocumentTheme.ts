import { useSyncExternalStore } from 'react';

export type DocumentTheme = 'light' | 'dark';

const read = (): DocumentTheme =>
  document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}

/** The theme currently set on the document root, kept in sync as it changes. */
export function useDocumentTheme(): DocumentTheme {
  return useSyncExternalStore(subscribe, read, () => 'light');
}
