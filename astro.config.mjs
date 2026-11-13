// @ts-check
import { defineConfig, passthroughImageService } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import sitemap from '@astrojs/sitemap';
import { noindexPaths } from './src/lib/noindex.mjs';
import { figuresPlugin, imageReferencesPlugin, sectionsPlugin } from './src/lib/markdown-plugins.mjs';

export default defineConfig({
  site: 'https://scottrobinson.co.uk',
  output: 'static',
  integrations: [
    // Pages marked noindex are left out of the sitemap
    sitemap({ filter: (page) => !noindexPaths.includes(new URL(page).pathname) }),
  ],
  trailingSlash: 'always',
  // Images are supplied at the right size and compression, so Astro publishes them unchanged
  image: { service: passthroughImageService() },
  markdown: {
    // Figures run first so the sections pass sees them and keeps them at full width
    processor: satteri({ mdastPlugins: [imageReferencesPlugin], hastPlugins: [figuresPlugin, sectionsPlugin] }),
  },
});
