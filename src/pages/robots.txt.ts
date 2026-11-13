import type { APIRoute } from 'astro';
import { isStaging } from '../lib/site';

// Crawlers that collect text to train AI models. Blocking them doesn't affect normal search
// (Google-Extended, for example, is separate from Googlebot). Compliance is voluntary and the names
// change, so check the list now and then.
const aiTrainingBots = [
  'GPTBot',             // OpenAI
  'ClaudeBot',          // Anthropic
  'anthropic-ai',       // Anthropic (older name)
  'Google-Extended',    // Google AI training
  'Applebot-Extended',  // Apple AI training
  'CCBot',              // Common Crawl
  'Meta-ExternalAgent', // Meta
  'Bytespider',         // ByteDance
];

export const GET: APIRoute = ({ site }) => {
  const body = isStaging
    ? 'User-agent: *\nDisallow: /\n'
    : [
        ...aiTrainingBots.map((bot) => `User-agent: ${bot}\nDisallow: /\n`),
        'User-agent: *\nAllow: /\n',
        `Sitemap: ${new URL('sitemap-index.xml', site)}\n`,
      ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
