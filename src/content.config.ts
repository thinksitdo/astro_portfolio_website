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

export const collections = { cases, 'academic-artistic': academicArtistic };
