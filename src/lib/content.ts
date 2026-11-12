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

export type Project = CollectionEntry<'academic-artistic'>;

/** All academic and artistic projects in Scott's chosen order */
export async function getProjects(): Promise<Project[]> {
  const entries = await getCollection('academic-artistic');
  return entries.sort((a, b) => a.data.order - b.data.order);
}

export const projectUrl = (entry: Project) => `/academic-artistic/${entry.id}/`;
export const kindLabel = (kind: 'academic' | 'artistic') => (kind === 'academic' ? 'Academic' : 'Artistic');

/** List rows show the start of the intro, as in the design: at most 24 words, then an ellipsis */
export function excerpt(text: string, words = 24) {
  const parts = text.trim().split(/\s+/);
  return parts.length <= words ? text : `${parts.slice(0, words).join(' ')}…`;
}

const thumbOrNull = (v: string) => (isTodo(v) ? null : v);

/** Category filters for a set of cases: All, then each category in order of first appearance */
export const caseFilters = (cases: Case[]) => ['All', ...new Set(cases.flatMap((c) => c.data.categories))];

/** Rows for case lists. The homepage shows year and reading time; the Cases page shows client and year. */
export function caseRows(cases: Case[], fourth: 'year-read' | 'client-year') {
  return cases.map((c) => {
    const minutes = readingMinutes(c.body);
    return {
      href: caseUrl(c),
      title: c.data.title,
      summary: excerpt(c.data.intro),
      tags: c.data.categories,
      col3: c.data.categories.join(' · '),
      col4: fourth === 'year-read'
        ? [c.data.year, minutes === null ? 'TODO' : `${minutes} min`]
        : [c.data.client, c.data.year],
      thumbnail: thumbOrNull(c.data.thumbnail),
    };
  });
}

export function projectRows(projects: Project[]) {
  return projects.map((p) => ({
    href: projectUrl(p),
    title: p.data.title,
    summary: excerpt(p.data.summary),
    tags: [kindLabel(p.data.kind)],
    col3: kindLabel(p.data.kind),
    col4: [p.data.details, p.data.year],
    thumbnail: thumbOrNull(p.data.thumbnail),
  }));
}
