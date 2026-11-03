import { defineCollection, z } from 'astro:content';
import { docsSchema } from '@astrojs/starlight/schema';
import { glob } from 'astro/loaders';

export const collections = {
  docs: defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/docs' }),
    schema: docsSchema(),
  }),
  // Authoring guide: CONTRIBUTING.md.
  blog: defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
    schema: z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      author: z.string(),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
    }),
  }),
};
