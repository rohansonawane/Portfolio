// Single source of truth for the production origin.
// Override at build time with VITE_SITE_URL (e.g. VITE_SITE_URL=https://yourdomain.com npm run build).
// The prerender script + generated sitemap/robots read the same env var, so
// changing the domain is a one-line change.
const raw = (import.meta.env && import.meta.env.VITE_SITE_URL) || 'https://www.rohansonawane.tech';
export const SITE_URL = raw.replace(/\/$/, '');

export const DEFAULT_OG_IMAGE = '/assets/social/og-image.jpg';
export const DEFAULT_OG_IMAGE_ALT =
  'RohanVerse — Rohan Sonawane | Software Developer Portfolio';
export const DEFAULT_OG_IMAGE_WIDTH = 1024;
export const DEFAULT_OG_IMAGE_HEIGHT = 512;
export const DEFAULT_SITE_DESCRIPTION =
  'Portfolio of Rohan Sonawane, Software Developer building intelligent, scalable and immersive experiences across Full Stack, AI/ML, VR/XR, and Cloud.';
export const DEFAULT_SITE_TITLE = 'RohanVerse | Rohan Sonawane | Software Developer';
