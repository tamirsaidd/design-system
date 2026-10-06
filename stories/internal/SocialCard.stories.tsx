import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../../src/components/Badge/Badge';
import { Button } from '../../src/components/Button/Button';
import { Card } from '../../src/components/Card/Card';
import { Switch } from '../../src/components/Switch/Switch';
import { ThemeScope } from '../../src/theme/ThemeScope';

/**
 * The 1200 by 630 share image, built from real components. Rendered at half
 * size and captured at 2x by `npm run brand-assets`. Hidden from the sidebar.
 */
function SocialCard() {
  return (
    <ThemeScope className="flex h-[315px] w-[600px] items-center justify-between gap-loose overflow-hidden px-block">
      <div className="flex max-w-[16rem] flex-col gap-snug">
        <h1 className="m-none text-3xl">Same parts, different products.</h1>
        <p className="m-none text-sm leading-normal text-fg-secondary">
          A design system in Storybook by Tamir Said-Ahmed
        </p>
      </div>
      <Card className="w-[15rem] shrink-0 gap-snug" aria-hidden>
        <div className="flex">
          <Badge variant="success">Meets requirements</Badge>
        </div>
        <p className="m-none text-md font-semibold">Computer Science</p>
        <Switch label="Only show what I qualify for" defaultChecked tabIndex={-1} />
        <Button variant="primary" size="sm" tabIndex={-1}>
          Save program
        </Button>
      </Card>
    </ThemeScope>
  );
}

const meta = {
  title: 'Internal/Social card',
  component: SocialCard,
  tags: ['!dev', '!autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof SocialCard>;

export default meta;
export const Default: StoryObj<typeof meta> = {};
