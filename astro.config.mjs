// @ts-check
import { defineConfig, passthroughImageService } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import { figuresPlugin, sectionsPlugin } from './src/lib/markdown-plugins.mjs';

export default defineConfig({
  site: 'https://scottrobinson.co.uk',
  output: 'static',
  trailingSlash: 'always',
  // Images are supplied at the right size and compression, so Astro publishes them unchanged
  image: { service: passthroughImageService() },
  markdown: {
    // Figures run first so the sections pass sees them and keeps them at full width
    processor: satteri({ hastPlugins: [figuresPlugin, sectionsPlugin] }),
  },
});
