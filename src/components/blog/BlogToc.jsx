import { useEffect, useState } from 'react';

export default function BlogToc({ headings }) {
  const [activeId, setActiveId] = useState(headings[0]?.id || '');

  useEffect(() => {
    if (!headings.length) return undefined;

    const visible = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });

        const active = headings.find((heading) => visible.get(heading.id) > 0);
        if (active) setActiveId(active.id);
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: [0, 0.25, 0.5, 1]
      }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length <= 3) return null;

  return (
    <aside className="blog-toc" aria-label="Table of contents">
      <div className="blog-toc-head">
        <span className="blog-toc-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M4 6h16v2H4V6zm0 5h10v2H4v-2zm0 5h16v2H4v-2z"
            />
          </svg>
        </span>
        <h2>On this page</h2>
      </div>
      <nav className="blog-toc-nav">
        <ul>
          {headings.map((heading, index) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={activeId === heading.id ? 'active' : undefined}
                aria-current={activeId === heading.id ? 'location' : undefined}
              >
                <span className="blog-toc-index">{String(index + 1).padStart(2, '0')}</span>
                <span className="blog-toc-text">{heading.text}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
