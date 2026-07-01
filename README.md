# RohanVerse Portfolio

Modern React + Vite portfolio for [rohanverse.dev](https://rohanverse.dev), with a 3D hero, project case studies, tech blog, and Notebook Arcade.

The previous Next.js portfolio lives in [`archive-portfolio/`](./archive-portfolio/) for reference.

## Stack

- **React 18** + **React Router 7**
- **Vite 6** with route-based code splitting
- **Three.js** (portfolio 3D hero)
- **react-helmet-async** (SEO meta tags)
- **react-markdown** + **remark-gfm** (blog)

## Scripts

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # builds + prerenders routes + sitemap
npm run preview
```

## Routes

| Path | Page |
|------|------|
| `/` | Portfolio home (3D hero, skills, projects) |
| `/project/:slug` | Project case study |
| `/blog` | Tech blog index |
| `/blog/:slug` | Blog post |
| `/play` | Notebook Arcade hub |
| `/play/:gameId` | Individual game |

## Structure

```
src/
  pages/           # Route pages (lazy-loaded)
  components/      # Layout, blog, arcade UI, SEO
  content/blog/    # Markdown blog posts
  arcade/          # Game logic
  lib/             # Portfolio init, projects data, blog manifest
  styles/          # Site CSS
public/assets/     # Images, 3D model, audio, blog assets
archive-portfolio/ # Previous Next.js portfolio (archived)
```

## Deploy

Configured for Vercel via `vercel.json`. After `npm run build`, deploy the `dist/` folder.

## Author

**Rohan Sonawane** — [GitHub](https://github.com/rohansonawane) · [LinkedIn](https://www.linkedin.com/in/rohansonawane)
