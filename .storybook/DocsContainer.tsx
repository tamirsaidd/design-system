import { DocsContainer as BaseContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks';
import type { PropsWithChildren } from 'react';
import { useDocumentTheme } from '../stories/docs/blocks/useDocumentTheme';
import { chromeThemes } from './themes';

/** Docs pages follow the toolbar's light and dark toggle, like the stories do. */
export function DocsContainer({ children, context }: PropsWithChildren<DocsContainerProps>) {
  const mode = useDocumentTheme();
  return (
    <BaseContainer context={context} theme={chromeThemes[mode]}>
      {children}
    </BaseContainer>
  );
}
