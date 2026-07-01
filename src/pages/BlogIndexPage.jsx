import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PageMeta from '../components/seo/PageMeta';
import { getAllPosts } from '../lib/blog';
import { SITE_URL } from '../config/site';

const CATEGORY_GRADIENTS = [
  'linear-gradient(135deg, #121b3c, #3564ff)',
  'linear-gradient(135deg, #132a50, #23c7ff)',
  'linear-gradient(135deg, #091322, #6966ff)',
  'linear-gradient(135deg, #1a1238, #8a57ff)',
  'linear-gradient(135deg, #0f2a1e, #38c98c)',
  'linear-gradient(135deg, #2a1208, #ff9f43)'
];

function categoryGradient(category, index) {
  const hash = category.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return CATEGORY_GRADIENTS[(hash + index) % CATEGORY_GRADIENTS.length];
}

export default function BlogIndexPage() {
  const posts = getAllPosts();

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'RohanVerse Tech Blog',
    url: `${SITE_URL}/blog`,
    description: 'Practical guides on AI, cloud, databases, system design, and developer productivity.',
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.meta_description,
      url: `${SITE_URL}/blog/${post.slug}`,
      image: `${SITE_URL}${post.bannerUrl}`
    }))
  };

  return (
    <>
      <PageMeta
        title="Tech Blog"
        description="Practical guides on AI agents, cloud engineering, databases, system design, DSA, and modern developer workflows."
        path="/blog"
        image={posts[0]?.bannerUrl}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <div className="blog-shell">
        <header className="blog-hero">
          <div className="eyebrow">
            <span className="eyebrow-dot" aria-hidden="true" />
            TECH BLOG
          </div>
          <h1>
            Insights for <span className="grad-text">builders</span>
          </h1>
          <p>
            Practical guides on AI, cloud, databases, system design, and developer productivity, written for
            engineers who ship real products.
          </p>
        </header>

        <div className="blog-grid">
          {posts.map((post, index) => (
            <article key={post.slug} className="blog-card">
              <Link to={`/blog/${post.slug}`} className="blog-card-link">
                <div className="blog-card-banner">
                  {post.bannerUrl ? (
                    <img src={post.bannerUrl} alt="" loading={index < 3 ? 'eager' : 'lazy'} />
                  ) : (
                    <div
                      className="blog-card-banner-fallback"
                      style={{ background: categoryGradient(post.category, index) }}
                    />
                  )}
                </div>
                <div className="blog-card-body">
                  <div className="blog-card-meta">
                    <span className="blog-category">{post.category}</span>
                    <span className="blog-read-time">{post.read_time}</span>
                  </div>
                  <h2>{post.title}</h2>
                  <p>{post.meta_description}</p>
                  <span className="blog-card-cta">
                    Read article
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="currentColor" d="M13.172 12 8.222 7.05l1.415-1.414L16 12l-6.364 6.364-1.414-1.415z" />
                    </svg>
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
