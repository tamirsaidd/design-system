import { educationPlatform } from './education-platform';
import type { ChapterTheme } from './types';

export type { ChapterTheme } from './types';

/** Chapters in build order. Chapter 2 and 3 land in later passes. */
export const chapters: readonly ChapterTheme[] = [educationPlatform];
