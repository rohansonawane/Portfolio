import { useEffect, useState } from 'react';

export default function BlogReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const article = document.querySelector('.blog-article-main');
      if (!article) return;

      const rect = article.getBoundingClientRect();
      const start = window.scrollY + rect.top - 120;
      const end = start + article.offsetHeight - window.innerHeight * 0.5;
      const scrolled = window.scrollY - start;
      const total = Math.max(end - start, 1);
      setProgress(Math.min(100, Math.max(0, (scrolled / total) * 100)));
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  if (progress <= 0) return null;

  return (
    <div
      className="blog-reading-progress"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    >
      <div className="blog-reading-progress-inner">
        <span className="blog-reading-progress-label">Reading progress</span>
        <span className="blog-reading-progress-value">{Math.round(progress)}%</span>
      </div>
      <div className="blog-reading-progress-track" aria-hidden="true">
        <div className="blog-reading-progress-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
