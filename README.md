# scottrobinson.co.uk

The portfolio site of Dr Scott Robinson, designer and researcher. It shows case studies, academic and artistic projects, publications and a practice-based PhD in design.

The site is a static build with [Astro](https://astro.build/). It is designed as a brutalist system of heavy rules, a cream and ink palette with one pink accent, and light and dark themes. It was taken from design canvas to code with [Claude Code](https://claude.com/claude-code), working from the brief in [`CLAUDE.md`](CLAUDE.md).

## Running it

Needs Node 22 (pinned with Volta in `package.json`).

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static site in dist/
npm run preview  # serve the build locally
```

Copy `.env.example` to `.env` and fill it in.

| Variable | What it does |
|---|---|
| `CASE_PASSWORD` | Unlocks protected case studies. Their articles are encrypted with it at build time, so it is never in the published site. |
| `SITE_ENV` | `staging` keeps a test copy out of search engines (noindex on every page, robots.txt blocks everything). Leave empty for the live site. |

## How it is put together

```
src/
  content/        one Markdown file per case, project and publication
  pages/          home, cases, academic & artistic, publications, thesis, about
  components/     hero, case study template, lightbox, password gate, rows, header and menu
  layouts/        the page shell, with meta tags, Open Graph and structured data
  lib/            content helpers, images, Markdown plugins, encryption
  styles/         design tokens and shared states
public/media/     images and video, published exactly as supplied
design/           the design canvases and reference CSS the build follows
```

Case studies and academic or artistic projects are separate collections, and they are never mixed in any list, filter or slideshow.

## Writing a case study

Each file in `src/content/cases/` has frontmatter (title, client, role, year, intro, images and so on) and a Markdown article. Anything not written yet holds `TODO`, which shows on the page rather than breaking the build.

A case has one of three types.

- **full** shows the hero, the hero image, the article and a link to the next case.
- **lite** shows the hero and hero image only.
- **protected** puts the article behind a password. It is encrypted at build time (PBKDF2 and AES-GCM) and decrypted in the browser.

The article is shaped by the Markdown plugins in `src/lib/markdown-plugins.mjs`.

- Each `##` heading starts a numbered section.
- An image on its own line becomes a full-width figure, and two on consecutive lines sit side by side. The text in quotes becomes the caption.
- Figures are numbered automatically on each page.
- Every figure opens in a lightbox, which steps through the article's images with the arrows or arrow keys.
- A video is its poster image wrapped in a link to the file. It shows with a play button and plays in the lightbox.

```markdown
![Workshop groups sorting cards](/media/ngo-workshop.jpg "Breakout groups making departmental posters")

[![Mapping session](/media/ngo-mapping-poster.jpg "Mapping the journey live")](/media/ngo-mapping.mp4)
```

Recommended image widths are 2480px for heroes and full-width figures and 1200px for thumbnails. Images are not resized or recompressed, so export them at their final size.

## Search and sharing

- Every page has a canonical link, a description and Open Graph tags. Each case uses its own thumbnail as its share image.
- The homepage carries `Person` structured data.
- There is a sitemap at `/sitemap-index.xml`.
- `robots.txt` blocks AI training crawlers and allows search engines.

## Status

Work in progress. Pages, templates, theming, the password gate, the lightbox and SEO are built. Content is still being written (the `TODO`s), and redirects from the old WordPress addresses wait for the hosting decision.
