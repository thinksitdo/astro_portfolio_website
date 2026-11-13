// Site-wide settings used for search engines and link previews.

export const SITE_NAME = 'Scott Robinson';

/**
 * Staging builds tell search engines to keep out: every page gets noindex and robots.txt blocks
 * everything. Build staging with  SITE_ENV=staging npm run build  (or set it in .env).
 * Anything else, including no value, is a live build.
 */
export const isStaging = (import.meta.env.SITE_ENV ?? process.env.SITE_ENV ?? '').trim().toLowerCase() === 'staging';

/**
 * Share image for pages that have no thumbnail of their own (list pages, thesis, about).
 * Leave null for none, or set a path in public/, such as '/media/share.jpg' (1200 × 630).
 */
export const DEFAULT_SHARE_IMAGE: string | null = null;

/** Structured data describing Scott, added to the homepage so search engines can connect the site to him */
export const person = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Scott Robinson',
  jobTitle: ['Designer and Researcher', 'CPO/CXO'],
  hasCredential: {
    '@type': 'EducationalOccupationalCredential',
    credentialCategory: 'degree',
    name: 'PhD in Design',
  },
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'Goldsmiths, University of London' },
  email: 'mailto:hello@scottrobinson.co.uk',
  sameAs: [
    'https://www.linkedin.com/in/drscottrobinson/',
    'https://research.gold.ac.uk/id/eprint/40427/',
  ],
};
