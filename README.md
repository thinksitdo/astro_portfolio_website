# Starting the build

1. Copy everything in this folder into the root of your `astro_portfolio_website` repository.
2. Commit it as the first commit ("Design handoff").
3. Open the repository in Claude Code and say:
   "Read CLAUDE.md and start phase 1."
4. Review each phase in the browser before saying "next phase".

## What is here

- `CLAUDE.md` — the brief Claude Code reads first: decisions, tokens, pages, behaviour, phases.
- `design/` — the canvas exports and the homepage CSS, for reference.
- `src/content/` — one Markdown file per project, named after its current WordPress address.
  Fill in anything marked `TODO`. Case studies have a `type` of full, lite or protected.
- `public/media/` — logo, stepping video (scrub-ready), poster, thesis images, NGO image.

## Things only you can decide

- Body font: mono on the homepage and Inter on inner pages, or one for both.
- Each case study's type (full, lite, protected), year, task, intro and images.
- Hosting: static upload to your Cloudways server, or Cloudways Velocity.
- Where `/research/`, `/publications/` and `/about/` should go.
