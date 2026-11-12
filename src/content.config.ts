import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Fields Scott has not filled in yet hold the string "TODO", so everything is a string here
// and the pages show TODO visibly rather than failing the build.

const cases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cases' }),
  schema: z.object({
    title: z.string(),
    kind: z.literal('case'),
    type: z.enum(['full', 'lite', 'protected']),
    categories: z.array(z.string()),
    client: z.string(),
    role: z.string(),
    activities: z.string(),
    year: z.coerce.string(),
    order: z.number(),
    task: z.string(),
    intro: z.string(),
    heroImage: z.string(),
    heroAlt: z.string().optional(),
    thumbnail: z.string(),
    legacyUrl: z.string().url(),
  }),
});

const academicArtistic = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/academic-artistic' }),
  schema: z.object({
    title: z.string(),
    kind: z.enum(['academic', 'artistic']),
    details: z.string(),
    year: z.coerce.string(),
    order: z.number(),
    summary: z.string(),
    thumbnail: z.string(),
    legacyUrl: z.string().url(),
  }),
});

const publications = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/publications' }),
  schema: z.object({
    title: z.string(),
    kind: z.enum(['Book Chapter', 'Conference Paper', 'Thesis', 'Journal Article']),
    year: z.coerce.string(),
    /** Publication date from the current site, kept for reference */
    date: z.coerce.date().optional(),
    order: z.number(),
    summary: z.string(),
    /** Optional: leave out (or TODO) for no thumbnail; then the list shows no popover */
    thumbnail: z.string().default(''),
    legacyUrl: z.string().url(),
  }),
});

export const collections = { cases, 'academic-artistic': academicArtistic, publications };
