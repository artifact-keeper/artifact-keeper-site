# Contributing

## Blog posts

Posts live in `src/content/blog/`. The file name becomes the URL, so
`src/content/blog/my-post.md` is published at `/blog/my-post/`.

1. Add a `.md` or `.mdx` file with this frontmatter:

   ```yaml
   ---
   title: My post
   description: One or two sentences, shown on the index, in the feed and in link previews.
   date: 2026-11-02            # publish date, YYYY-MM-DD
   author: Your Name
   tags: [release, security]   # optional
   draft: true                 # optional, defaults to false
   ---
   ```

2. Preview it with `npm run dev` at <http://localhost:4321/blog/>. Drafts show here with a draft
   badge.
3. Run `npm run build` to check it. A missing or invalid frontmatter field fails the build.
4. When the post is ready to go out, remove `draft: true`.

`draft: true` keeps a post out of production builds: it gets no page, no entry on the `/blog/`
index, no item in the feed at `/blog/rss.xml` and no sitemap entry. The file itself is still
public in this repository, so do not put anything in a draft that must stay private.

Posts are not included in the docs search, which only indexes the pages under `/docs/`.
