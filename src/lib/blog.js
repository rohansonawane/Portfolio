import manifest from './blog-manifest.json' with { type: 'json' };

const markdownModules = import.meta.glob('../content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
});

const BLOG_IMAGE_BASE = '/assets/blog/images';

function parseFrontmatter(raw) {
  if (!raw?.startsWith('---')) return { meta: {}, content: raw || '' };
  const end = raw.indexOf('\n---', 3);
  if (end === -1) return { meta: {}, content: raw };

  const fmBlock = raw.slice(3, end).trim();
  const content = raw.slice(end + 4).replace(/^\n/, '');
  const meta = {};

  for (const line of fmBlock.split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    meta[key] = value;
  }

  return { meta, content };
}

function imageUrl(filename) {
  if (!filename) return null;
  const name = filename.replace(/^images\//, '');
  return `${BLOG_IMAGE_BASE}/${name}`;
}

function buildPost(meta) {
  const mdPath = `../content/blog/${meta.slug}.md`;
  const raw = markdownModules[mdPath] || '';
  const { content } = parseFrontmatter(raw);

  return {
    ...meta,
    content,
    bannerUrl: imageUrl(meta.banner_image),
    diagramUrl: imageUrl(meta.diagram_image)
  };
}

export const BLOG_POSTS = manifest.map(buildPost);

export function getAllPosts() {
  return BLOG_POSTS;
}

export function getPostBySlug(slug) {
  return BLOG_POSTS.find((post) => post.slug === slug) || null;
}

export function getRelatedPosts(slug, count = 3) {
  const current = getPostBySlug(slug);
  if (!current) return BLOG_POSTS.slice(0, count);

  const sameCategory = BLOG_POSTS.filter(
    (post) => post.slug !== slug && post.category === current.category
  );
  const others = BLOG_POSTS.filter(
    (post) => post.slug !== slug && post.category !== current.category
  );

  return [...sameCategory, ...others].slice(0, count);
}

export function extractHeadings(content) {
  const headings = [];
  const regex = /^## (.+)$/gm;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const text = match[1].trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    headings.push({ id, text });
  }
  return headings;
}
