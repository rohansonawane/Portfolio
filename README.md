# RohanVerse Portfolio

[![Live Site](https://img.shields.io/badge/Live-rohanverse.dev-6c63ff?style=for-the-badge)](https://rohanverse.dev)
[![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Three.js](https://img.shields.io/badge/Three.js-3D_Hero-000000?style=for-the-badge&logo=threedotjs&logoColor=white)](https://threejs.org)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](./LICENSE)

<a href="https://www.youtube.com/watch?v=PLACEHOLDER" target="_blank" rel="noopener noreferrer">
  <img
    src="./docs/images/portfolio-preview.png"
    alt="RohanVerse portfolio website preview — click to watch the walkthrough on YouTube"
    width="100%"
  />
</a>

<p align="center">
  <strong>Click the preview above to watch the full site walkthrough on YouTube</strong><br />
  <em>Replace <code>PLACEHOLDER</code> in the README with your video ID when ready.</em>
</p>

<p align="center">
  <a href="https://rohanverse.dev"><strong>Live Demo</strong></a>
  ·
  <a href="https://github.com/rohansonawane/Portfolio/issues">Report Bug</a>
  ·
  <a href="https://github.com/rohansonawane/Portfolio/issues">Request Feature</a>
</p>

---

## Overview

**RohanVerse** is a production-ready personal portfolio built with **React**, **Vite**, and **Three.js**. It combines a cinematic 3D hero, detailed project case studies, a full **tech blog**, and an interactive **Notebook Arcade** with 12 browser games — all in one cohesive, performance-focused experience.

The previous Next.js portfolio is preserved in [`archive-portfolio/`](./archive-portfolio/) for reference.

## Highlights

- **3D hero experience** powered by Three.js with optimized GLB assets
- **8 project case studies** with rich feature breakdowns and tech stacks
- **12-article tech blog** written in Markdown with TOC, reading progress, and share tools
- **Notebook Arcade** with 12 playable games, AI/CPU modes, scores, and sound settings
- **SEO-first architecture** with route prerendering, sitemap, robots.txt, and Open Graph meta
- **Light / dark theme** with a glass-and-grid design system
- **Fully responsive** layout from mobile to desktop
- **Vercel-ready** deployment with explicit Vite build configuration

## Tech Stack

| Layer | Technologies |
|-------|----------------|
| **Frontend** | React 18, React Router 7 |
| **Build** | Vite 6, code splitting, lazy routes |
| **3D** | Three.js |
| **Content** | react-markdown, remark-gfm |
| **SEO** | react-helmet-async, custom prerender script |
| **Styling** | Custom CSS design system |
| **Deploy** | Vercel (SPA rewrites + static prerender) |

## Features

### Portfolio Home
- Animated hero with 3D scene
- Skills grid with brand icons and contact pixel wall
- Featured projects with category tags
- Experience timeline and downloadable resume

### Project Pages (`/project/:slug`)
- Deep-dive case studies for VR, AI, full-stack, and research work
- Feature lists, tech stacks, timelines, and external links

### Tech Blog (`/blog`)
- Markdown-driven posts with frontmatter
- Sticky reading progress bar
- Scroll-spy table of contents
- Related articles sidebar and social share row

### Notebook Arcade (`/play`)
- Tic Tac Toe, Sudoku, Snake, Dots & Boxes, SOS, Hangman, Sea Battle, Minesweeper, Drop Dots, Maze, Word Search, Book Cricket
- Vs CPU and AI Assist modes on supported games
- Local score persistence and arcade settings (sound, theme)

## Routes

| Path | Description |
|------|-------------|
| `/` | Portfolio home |
| `/project/:slug` | Project case study |
| `/blog` | Blog index |
| `/blog/:slug` | Blog article |
| `/play` | Arcade hub |
| `/play/:gameId` | Individual game |

## Getting Started

### Prerequisites

- **Node.js 18+**
- **npm** (or yarn / pnpm)

### Installation

```bash
git clone https://github.com/rohansonawane/Portfolio.git
cd Portfolio
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Production Build

```bash
npm run build
npm run preview
```

The build runs Vite and then `scripts/prerender.mjs`, which:
- Writes static `index.html` per route for crawlers and social previews
- Regenerates `sitemap.xml` and `robots.txt`

### Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `VITE_SITE_URL` | Canonical site URL for meta tags, sitemap, and robots | `https://rohanverse.dev` |

Example:

```bash
VITE_SITE_URL=https://yourdomain.com npm run build
```

## Project Structure

```
├── src/
│   ├── pages/              # Route-level pages (lazy-loaded)
│   ├── components/         # Layout, blog, arcade, SEO
│   ├── content/blog/       # Markdown blog posts
│   ├── arcade/             # Game logic and registry
│   ├── lib/                # Projects data, blog manifest, init scripts
│   ├── styles/             # Global and section CSS
│   └── three/              # Three.js portfolio hero
├── public/assets/          # Images, 3D model, blog banners, arcade art
├── scripts/prerender.mjs   # Post-build SEO prerender
├── docs/images/            # README and documentation assets
├── archive-portfolio/      # Archived Next.js portfolio
├── vercel.json             # Vercel deployment config
└── vite.config.js
```

## Deployment (Vercel)

Recommended settings:

| Setting | Value |
|---------|-------|
| Framework Preset | **Vite** |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install --include=dev` |

`vercel.json` is already configured for SPA routing and production installs.

## Updating the README Screenshot & Video

1. Replace `docs/images/portfolio-preview.png` with a real screenshot of the live site.
2. Update the YouTube link at the top of this README:

```markdown
<a href="https://www.youtube.com/watch?v=YOUR_VIDEO_ID">
```

## Archive

The legacy Next.js portfolio (Tailwind, Framer Motion, App Router) lives in [`archive-portfolio/`](./archive-portfolio/). It is not part of the active deployment.

## Author

**Rohan Sonawane**

- Portfolio: [rohanverse.dev](https://rohanverse.dev)
- GitHub: [@rohansonawane](https://github.com/rohansonawane)
- LinkedIn: [Rohan Sonawane](https://www.linkedin.com/in/rohansonawane)
- Email: rohansonawane28@gmail.com

---

<p align="center">
  Built with React, Vite, and Three.js
</p>
