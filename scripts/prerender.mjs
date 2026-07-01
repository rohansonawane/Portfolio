// Post-build SEO prerender.
// The app is a client-rendered SPA, so per-route <title>/description/OG tags
// (added at runtime via react-helmet-async) are invisible to crawlers and
// social-link scrapers that don't execute JS. This script writes a static
// index.html per route with the correct meta baked into the served HTML.
// It also regenerates sitemap.xml + robots.txt from the same domain config.
//
// Runs after `vite build` (see package.json build script).

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { PROJECT_DEFS } from '../src/lib/projects.js';
import { ARCADE_GAMES } from '../src/arcade/data.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');
const SITE = (process.env.VITE_SITE_URL || 'https://www.rohansonawane.tech').replace(/\/$/, '');
const DEFAULT_IMAGE = '/assets/social/og-image.jpg';
const DEFAULT_IMAGE_ALT = 'RohanVerse — Rohan Sonawane | Software Developer Portfolio';

const escapeAttr = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const clamp = (s = '', n = 160) => (s.length <= n ? s : `${s.slice(0, n - 1).trimEnd()}…`);
const abs = (p) => (p && p.startsWith('http') ? p : `${SITE}${p || DEFAULT_IMAGE}`);

function buildHtml(template, { title, description, path, image }) {
  const url = `${SITE}${path}`;
  const desc = escapeAttr(clamp(description));
  const t = escapeAttr(title);
  let html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${t}</title>`)
    .replace(/(<meta name="description" content=")[\s\S]*?(")/, `$1${desc}$2`)
    .replace(/(<meta property="og:title" content=")[\s\S]*?(")/, `$1${t}$2`)
    .replace(/(<meta property="og:description" content=")[\s\S]*?(")/, `$1${desc}$2`)
    .replace(/(<meta property="og:image" content=")[\s\S]*?(")/, `$1${escapeAttr(abs(image))}$2`)
    .replace(/(<meta property="og:image:secure_url" content=")[\s\S]*?(")/, `$1${escapeAttr(abs(image))}$2`)
    .replace(/(<meta name="twitter:image" content=")[\s\S]*?(")/, `$1${escapeAttr(abs(image))}$2`);
  // Canonical + og:url are route-specific; inject before </head>.
  const inject = `  <link rel="canonical" href="${escapeAttr(url)}" />\n  <meta property="og:url" content="${escapeAttr(url)}" />\n  <meta property="og:image:alt" content="${escapeAttr(DEFAULT_IMAGE_ALT)}" />\n  <meta name="twitter:image:alt" content="${escapeAttr(DEFAULT_IMAGE_ALT)}" />\n`;
  html = html.replace('</head>', `${inject}</head>`);
  return html;
}

async function writeRoute(template, route) {
  const html = buildHtml(template, route);
  // "/" -> dist/index.html ; "/play/snake" -> dist/play/snake/index.html
  const rel = route.path === '/' ? '' : route.path.replace(/^\//, '');
  const dir = rel ? join(DIST, rel) : DIST;
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, 'index.html'), html, 'utf8');
  return route.path;
}

async function main() {
  const template = await readFile(join(DIST, 'index.html'), 'utf8');
  const blogManifest = JSON.parse(
    await readFile(join(__dirname, '..', 'src', 'lib', 'blog-manifest.json'), 'utf8')
  );
  const blogPosts = blogManifest.map((post) => ({
    ...post,
    bannerUrl: `/assets/blog/images/${post.banner_image}`
  }));

  const routes = [
    {
      path: '/',
      title: 'RohanVerse | Rohan Sonawane | Software Developer',
      description:
        'Portfolio of Rohan Sonawane, Software Developer building intelligent, scalable and immersive experiences across Full Stack, AI/ML, VR/XR, and Cloud.',
      image: DEFAULT_IMAGE
    },
    {
      path: '/play',
      title: 'Notebook Arcade | RohanVerse',
      description:
        'Classic pencil-and-paper school games rebuilt for the browser: Tic Tac Toe, Sudoku, Snake, Dots & Boxes and more.',
      image: DEFAULT_IMAGE
    },
    {
      path: '/blog',
      title: 'Tech Blog | RohanVerse',
      description:
        'Practical guides on AI agents, cloud engineering, databases, system design, DSA, and modern developer workflows.',
      image: blogPosts[0]?.bannerUrl || DEFAULT_IMAGE
    },
    ...blogPosts.map((post) => ({
      path: `/blog/${post.slug}`,
      title: `${post.title} | RohanVerse`,
      description: post.meta_description,
      image: post.bannerUrl || DEFAULT_IMAGE
    })),
    ...PROJECT_DEFS.map((p) => ({
      path: `/project/${p.slug}`,
      title: `${p.title} | RohanVerse`,
      description: p.desc || p.overview,
      image: p.thumbnail || DEFAULT_IMAGE
    })),
    ...ARCADE_GAMES.filter((g) => !g.comingSoon).map((g) => ({
      path: `/play/${g.id}`,
      title: `${g.title} | Notebook Arcade | RohanVerse`,
      description: g.rules,
      image: DEFAULT_IMAGE
    }))
  ];

  const written = [];
  for (const route of routes) written.push(await writeRoute(template, route));

  // Regenerate sitemap + robots from the same domain config.
  const sitemap =
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    routes
      .map((r) => {
        const priority = r.path === '/'
          ? '1.0'
          : r.path === '/play'
            ? '0.9'
            : r.path === '/blog'
              ? '0.85'
              : r.path.startsWith('/blog/')
                ? '0.8'
                : r.path.startsWith('/project')
                  ? '0.7'
                  : '0.6';
        return `  <url><loc>${SITE}${r.path}</loc><priority>${priority}</priority></url>`;
      })
      .join('\n') +
    `\n</urlset>\n`;
  await writeFile(join(DIST, 'sitemap.xml'), sitemap, 'utf8');
  await writeFile(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`, 'utf8');

  console.log(`[prerender] site: ${SITE}`);
  console.log(`[prerender] wrote ${written.length} route HTML files + sitemap.xml + robots.txt`);
}

main().catch((err) => {
  console.error('[prerender] failed:', err);
  process.exit(1);
});
