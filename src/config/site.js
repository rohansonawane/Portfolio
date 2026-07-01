// Single source of truth for the production origin.
// Override at build time with VITE_SITE_URL (e.g. VITE_SITE_URL=https://yourdomain.com npm run build).
// The prerender script + generated sitemap/robots read the same env var, so
// changing the domain is a one-line change.
const raw = (import.meta.env && import.meta.env.VITE_SITE_URL) || 'https://rohanverse.dev';
export const SITE_URL = raw.replace(/\/$/, '');
