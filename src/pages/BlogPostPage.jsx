import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import BlogMarkdown from '../components/blog/BlogMarkdown';
import BlogReadingProgress from '../components/blog/BlogReadingProgress';
import BlogShare from '../components/blog/BlogShare';
import BlogSidebar from '../components/blog/BlogSidebar';
import BlogToc from '../components/blog/BlogToc';
import PageMeta from '../components/seo/PageMeta';
import { extractHeadings, getPostBySlug, getRelatedPosts } from '../lib/blog';
import { SITE_URL } from '../config/site';
import { trackEvent } from '../lib/analytics';

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);
  const related = getRelatedPosts(slug, 3);
  const headings = post ? extractHeadings(post.content) : [];
  const hasToc = headings.length > 3;

  useEffect(() => {
    if (post) trackEvent('blog_view', { slug: post.slug, category: post.category });
  }, [post]);

  if (!post) {
    return (
      <div className="blog-shell">
        <div className="blog-not-found">
          <h1>Article not found</h1>
          <p>The blog post you are looking for does not exist.</p>
          <Link to="/blog" className="primary-btn">Back to blog</Link>
        </div>
      </div>
    );
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.meta_description,
    image: `${SITE_URL}${post.bannerUrl}`,
    author: {
      '@type': 'Person',
      name: 'Rohan Sonawane',
      url: SITE_URL
    },
    publisher: {
      '@type': 'Person',
      name: 'Rohan Sonawane',
      url: SITE_URL
    },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
    articleSection: post.category,
    keywords: post.category
  };

  return (
    <>
      <PageMeta
        title={post.title}
        description={post.meta_description}
        path={`/blog/${post.slug}`}
        image={post.bannerUrl}
        type="article"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <article className={`blog-shell blog-article${hasToc ? ' blog-article--with-toc' : ''}`}>
        <BlogReadingProgress />

        <Link to="/blog" className="blog-back">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M10.828 12 15.778 7.05 14.364 5.636 7 12l7.364 6.364 1.414-1.414z" />
          </svg>
          Back to blog
        </Link>

        <header className="blog-article-header">
          {post.bannerUrl && (
            <div className="blog-article-banner">
              <img src={post.bannerUrl} alt="" />
            </div>
          )}
          <div className="blog-article-intro">
            <div className="blog-card-meta">
              <span className="blog-category">{post.category}</span>
              <span className="blog-read-time">{post.read_time}</span>
            </div>
            <h1>{post.title}</h1>
            <BlogShare title={post.title} path={`/blog/${post.slug}`} />
            <p className="blog-article-deck">{post.meta_description}</p>
          </div>
        </header>

        <div className="blog-article-layout">
          <BlogToc headings={headings} />

          <div className="blog-article-main">
            <BlogMarkdown content={post.content} />

            {post.diagramUrl && (
              <figure className="blog-diagram">
                <img src={post.diagramUrl} alt={`Diagram for ${post.title}`} loading="lazy" />
                <figcaption>Architecture overview</figcaption>
              </figure>
            )}

            {post.source_basis?.length > 0 && (
              <section className="blog-sources panel">
                <div className="panel-head">
                  <h2>Sources & further reading</h2>
                  <p>References used while writing this article.</p>
                </div>
                <ul className="blog-sources-list">
                  {post.source_basis.map((source) => (
                    <li key={source.url}>
                      <a href={source.url} target="_blank" rel="noreferrer">
                        {source.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <BlogSidebar related={related} />
        </div>

        {related.length > 0 && (
          <section className="blog-related blog-related--mobile">
            <h2>Continue reading</h2>
            <div className="blog-related-grid">
              {related.map((item) => (
                <Link key={item.slug} to={`/blog/${item.slug}`} className="blog-related-card">
                  <div className="blog-related-thumb">
                    {item.bannerUrl ? (
                      <img src={item.bannerUrl} alt="" loading="lazy" />
                    ) : (
                      <span aria-hidden="true" />
                    )}
                  </div>
                  <div>
                    <b>{item.title}</b>
                    <span>{item.meta_description}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
