import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;

/**
 * Blog posts, newest first. Drafts are left out of production builds, so they get no page, no
 * index entry, no feed item and no sitemap entry. `npm run dev` includes them for previewing.
 */
export async function getPosts({ includeDrafts = import.meta.env.DEV } = {}): Promise<BlogPost[]> {
  const posts = await getCollection('blog', ({ data }) => includeDrafts || !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
