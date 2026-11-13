# scottrobinson.co.uk — Astro rebuild

This repository rebuilds Scott Robinson's portfolio (currently WordPress) as an Astro site.
The visual design is settled. Your job is to implement it faithfully, not to redesign it.

## Working agreement

- Build in the phases below. Finish and show each phase before starting the next.
- Small, descriptive commits. Never push to `main` or deploy without asking.
- The copy is Scott's. Do not rewrite, shorten or add copy. Missing copy stays as a visible `TODO`.
- British English. Avoid colons in user-facing copy you are asked to write.
- Ask before adding a dependency beyond Astro and its official integrations.

## Stack

- Astro (current stable), static output (`output: 'static'`).
- No UI framework. Interactivity is small vanilla JS in `<script>` tags inside Astro components.
- Content collections for case studies and for academic and artistic projects (schemas below).
- Plain CSS: one global stylesheet with design tokens, plus scoped component styles.

## Where the design lives

- `design/reference/*.dc.html` are exports from the design canvas. They are templates, not runnable pages:
  `{{t.ink}}`-style placeholders are filled by the `renderVals()` script at the bottom of each file,
  `<sc-for>` is a loop, `<sc-if>` is a conditional, `<dc-import>` embeds another file.
  Read them for exact markup, inline styles, copy and behaviour (the script shows the interaction logic).
  - `homepage.dc.html` — the homepage, including the full CSS for every interactive state.
  - `case-study.dc.html` — the case study template. Its `variant` prop switches `full`, `lite`, `protected`.
  - `cases.dc.html` — the Cases list page.
  - `academic-artistic.dc.html` — the Academic & Artistic list page.
  - `thesis.dc.html` — the thesis page.
  - `states.dc.html` — every interactive element in default, hover, focus, pressed and selected states.
- `design/homepage-styles.css` — the homepage CSS extracted verbatim. Use it as the behaviour reference.

## Design tokens

Light: background `#F9F7ED`, ink `#0A0A0A`, muted `#3F3F3F`, thumbnail placeholder `#DCDCD6`.
Dark: background `#0A0A0A`, ink `#F4F4F0`, muted `#BDBDB8`, thumbnail placeholder `#232323`.
Accent (both modes): pink `#FF3EA5`; text on pink is always `#0A0A0A`.

Type (Google Fonts):
- Display: Inter Tight, weights 800 and 900. Section headings 900 uppercase, tight tracking (-0.03em).
- Labels, buttons, metadata: JetBrains Mono, 500–600, uppercase, letter-spacing 0.04em.
- Body: JetBrains Mono on the homepage; Inter on case study and thesis pages.
  OPEN QUESTION for Scott: should these match? Ask before changing either.

Structure: 3px rules between sections and around boxes, 2px for row dividers and buttons, zero radius.
Grids are drawn by a 3px `gap` over an ink background. Focus: `outline: 3px solid currentColor; outline-offset: 3px`.
Fluid type uses `clamp()` and container query units (`cqi`) for the hero headline and tiles.

## Pages and routes

| Route | Source | Notes |
|---|---|---|
| `/` | homepage.dc.html | Hero, In short, Current focus, Cases (first 6 case studies), How I work, Design as research, PhD in Design, Get in touch |
| `/cases/` | cases.dc.html | All `case` entries only, with category filters |
| `/cases/[slug]/` | case-study.dc.html | Layout depends on `type` |
| `/academic-artistic/` | academic-artistic.dc.html | All `academic` and `artistic` entries only, filters All / Academic / Artistic |
| `/academic-artistic/[slug]/` | not yet designed | Use the case study Full layout without the gate, and flag it |
| `/thesis/` | thesis.dc.html | |
| `/publications/` | as academic-artistic.dc.html | All `publications` entries, filters by type. Intro copy is a TODO |
| `/publications/[slug]/` | not separately designed | Case study Full layout without the gate, like the project pages |
| `/about/` | not yet designed | Stub page with the shared layout and a TODO |

Case studies, academic or artistic projects and publications are never mixed in any list, filter or slideshow.

## Content model

`src/content/cases/*.md`:
```
title, kind: "case", type: "full" | "lite" | "protected", categories: string[], client, role,
activities, year, order: number, task, intro, heroImage, thumbnail, legacyUrl
```
`src/content/academic-artistic/*.md`:
```
title, kind: "academic" | "artistic", details, year, order: number, summary, thumbnail, legacyUrl
```
`src/content/publications/*.md`:
```
title, kind: "Book Chapter" | "Conference Paper" | "Thesis" | "Journal Article", year, date, order: number,
summary, reference (inline Markdown, shown in the details table), thumbnail (optional), legacyUrl
```
Starter files are in place, generated from the current site. Fields marked `TODO` need Scott's input.

### Case study types
- `full`: everything (hero, first image, article, next case).
- `lite`: hero and the first (hero) image only, then next case.
- `protected`: as `lite`, then the password box, then the article once unlocked.

### Password gate (encrypted, no server needed)
- The article is encrypted at build time (`src/lib/case-crypto.ts`) with a key made from `CASE_PASSWORD` in `.env`: PBKDF2-SHA256, 600,000 iterations, then AES-256-GCM. The page holds only the encrypted text, so search engines can't read the article and nobody can without the password.
- The browser makes the same key from the typed password and decrypts (`PasswordGate.astro`). A wrong password fails to decrypt.
- On success the key is kept in `localStorage` (`sr_case_key`) for 30 days, so other protected cases open without asking. If it stops working (password changed), the box shows again.
- `CASE_PASSWORD` is never put into the site. Without it, protected cases are published without their article. Use a long password: anyone can try guesses against a saved copy of the page.
- Copy for the box is in case-study.dc.html. Error message and "Ask for the password" mailto link included.

### Images in Markdown
Write a small remark/rehype plugin:
- A paragraph containing only one image becomes a full-width `<figure>`.
- A paragraph containing exactly two images (consecutive lines, no blank line) becomes a two-column figure row, stacking on narrow screens.
- The Markdown image title becomes the `<figcaption>`; the alt text stays as alt text.
- Reference-style images (`![alt][image-1]` with `[image-1]: ./images/x.jpg "Caption"` below, as Google Docs exports) are turned into ordinary images first. Astro only publishes ordinary ones.

## Components and behaviour

- **Header**: logo (inverts in dark mode), light/dark switch, "Let's talk" button, menu button.
- **Light/dark switch**: `<button role="switch" aria-checked>` labelled "Dark mode", sun and moon halves; the active half is filled ink; hover fills the inactive half pink. Respect `prefers-color-scheme` on first visit, remember the choice in `localStorage`, and set the theme in an inline `<head>` script so there is no flash.
- **Menu**: full-screen dialog, exactly one viewport tall (`100dvh`), never scrolls. Seven items: Home, Cases, Academic & Artistic, PhD in Design, Publications, Thesis, About. Label size `clamp(20px, min(6.2vw, calc((100dvh - 200px) / 7 * 0.62)), 112px)`. Trap focus, Escape closes, return focus to the menu button.
- **Hero**: grid 28fr / 32fr / 40fr. Headline sized with `cqi` inside its own container so it never overflows. Name box with three lines (see homepage). Bottom row: pink Get in touch tile, slideshow, See my work tile. Below 820px the layout stacks.
- **Scrub video**: `public/media/stepping-scrub.mp4` (every frame a keyframe, see below). Never plays by itself. Page scroll maps to the whole clip; horizontal pointer position over the video maps to the whole clip. Seek with `currentTime`, queueing the latest target while a seek is in progress. Caption shows the time.
- **Slideshow**: the first five case studies' thumbnails, advanced by scroll and by pointer position. Caption shows number and title.
- **Cursors**: the two-box scrub cursor over the video and slideshow; the single box with a top-right arrow on links and buttons (SVGs are in homepage-styles.css as data URIs; move them to `public/cursors/*.svg`).
- **Case lists**: numbered rows; hover or focus fills the row pink and shows a 440 × 275 thumbnail that follows the cursor and flips left near the right edge. Hidden on touch and below 900px.
- **States**: copy exactly from homepage-styles.css. Two known gaps to fix: rows have no pressed state, and the password input has no designed focus state (use the standard focus outline).

### Video encoding
The current file was encoded from the full 61.6s clip:
```
ffmpeg -i input.m4v -an -vf "fps=15,scale=600:-2,format=gray,format=yuv420p" \
  -c:v libx264 -preset slow -crf 28 -g 1 -keyint_min 1 -sc_threshold 0 -movflags +faststart stepping-scrub.mp4
```
Scott may supply a shorter 5–10s phrase; re-encode the same way.

## Accessibility and quality

- Real buttons and links; visible focus everywhere; text contrast at least 4.5:1.
- `prefers-reduced-motion`: no automatic movement; scrubbing still follows the user's input.
- The scrub video and slideshow need text alternatives (`aria-label` on the region).
- Meta title and description per page, Open Graph image, sitemap, `robots.txt`, `noindex` on nothing public. Done:
  - `BaseLayout` takes `description` ("TODO" warns in the terminal and is left out), `image` (each case, project and publication passes its thumbnail; `DEFAULT_SHARE_IMAGE` in `src/lib/site.ts` covers other pages) and `ogType`.
  - Person structured data (JSON-LD) on the homepage, from `src/lib/site.ts`.
  - `src/lib/noindex.mjs` lists pages kept out of search and the sitemap (`/about/` for now).
  - `@astrojs/sitemap` makes `sitemap-index.xml`. `src/pages/robots.txt.ts` blocks AI training crawlers and links the sitemap.
  - `SITE_ENV=staging` marks every page noindex and makes robots.txt block everything. Use it for the Cloudways test copy.
- Test in Safari (video seeking), on a phone, keyboard only, and with reduced motion on.

## Redirects from WordPress
Each content file has `legacyUrl`. Generate permanent redirects:
- `/project/<slug>/` to `/cases/<slug>/` or `/academic-artistic/<slug>/`
- `/commercial-work/` to `/cases/`, `/projects-and-collaborations/` to `/academic-artistic/`
- `/thesis/` stays. `/research/`, `/publications/`, `/about/`: ask Scott.

## Hosting (decision pending — ask before configuring)
Scott uses Cloudways. Options: upload the static `dist/` to the existing server, or Cloudways Velocity (Node). The agreed password approach is client-side, so static hosting is enough for now.

## Phases
1. Scaffold Astro, tokens, fonts, global CSS, layout with header, switch, menu and footer.
2. Homepage, including the scrub hero and case list.
3. Case study template with all three types, the image plugin and the password gate.
4. Cases, Academic & Artistic and Thesis pages.
5. Content: fill TODOs with Scott, add images.
6. Redirects, meta, QA, then deployment once Scott chooses hosting.
