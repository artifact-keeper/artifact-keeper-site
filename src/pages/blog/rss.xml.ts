import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts } from '../../lib/blog';

export async function GET(context: APIContext) {
  // Never list drafts, not even under `npm run dev`.
  const posts = await getPosts({ includeDrafts: false });
  return rss({
    title: 'Artifact Keeper Blog',
    description: 'News, releases and walkthroughs from the Artifact Keeper project.',
    site: new URL('/blog/', context.site),
    xmlns: { dc: 'http://purl.org/dc/elements/1.1/' },
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${post.id}/`,
      categories: post.data.tags,
      // RSS <author> must be an email address; dc:creator takes a name.
      customData: `<dc:creator>${escapeXml(post.data.author)}</dc:creator>`,
    })),
  });
}

function escapeXml(text: string) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
