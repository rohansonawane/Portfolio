import { Link } from 'react-router-dom';

export default function BlogSidebar({ related = [] }) {
  if (!related.length) return null;

  return (
    <aside className="blog-sidebar" aria-label="Related articles">
      <div className="blog-sidebar-inner">
        <div className="blog-sidebar-card">
          <div className="blog-sidebar-card-head">
            <span>Related articles</span>
          </div>
          <ul className="blog-sidebar-related">
            {related.map((item) => (
              <li key={item.slug}>
                <Link to={`/blog/${item.slug}`}>
                  {item.bannerUrl && (
                    <img src={item.bannerUrl} alt="" loading="lazy" />
                  )}
                  <div className="blog-sidebar-related-body">
                    <span className="blog-sidebar-related-title">{item.title}</span>
                    <span className="blog-sidebar-related-meta">{item.read_time}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
