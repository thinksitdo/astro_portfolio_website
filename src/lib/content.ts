import { getCollection, type CollectionEntry } from 'astro:content';

export type Case = CollectionEntry<'cases'>;

export const isTodo = (value: string | undefined) => !value || value.trim().toUpperCase() === 'TODO';

/** All case studies in Scott's chosen order */
export async function getCases(): Promise<Case[]> {
  const entries = await getCollection('cases');
  return entries.sort((a, b) => a.data.order - b.data.order);
}

export const caseUrl = (entry: Case) => `/cases/${entry.id}/`;

/** Reading time in minutes from the Markdown body, or null while the body is still a TODO */
export function readingMinutes(body: string | undefined): number | null {
  const text = (body ?? '').replace(/!\[[^\]]*\]\([^)]*\)/g, ' ').trim();
  if (isTodo(text) || /^TODO\b/.test(text)) return null;
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
