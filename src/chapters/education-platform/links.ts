/**
 * Links between the chapter's screens. Each story is opened in the Storybook
 * shell (target _top), so the sidebar follows along.
 */
const storyPath = (screen: string, args?: Record<string, string>) => {
  const query = args
    ? `&args=${Object.entries(args)
        .map(([k, v]) => `${k}:${v}`)
        .join(';')}`
    : '';
  return `./?path=/story/chapters-education-platform-${screen}--default${query}`;
};

export const links = {
  programs: storyPath('program-browse'),
  scholarships: storyPath('scholarship-list'),
  result: (programId: string) => storyPath('eligibility-result', { programId }),
};
