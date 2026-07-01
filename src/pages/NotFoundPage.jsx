import { Link } from 'react-router-dom';
import PageMeta from '../components/seo/PageMeta';

export default function NotFoundPage() {
  return (
    <>
      <PageMeta
        title="Page Not Found | RohanVerse"
        description="The page you're looking for doesn't exist or has moved."
        path="/404"
      />
      <section className="not-found">
        <p className="not-found-code">404</p>
        <h1>Page not found</h1>
        <p className="not-found-text">
          The page you’re looking for doesn’t exist or may have moved.
        </p>
        <div className="not-found-actions">
          <Link className="primary-btn" to="/">Back home</Link>
          <Link className="secondary-btn" to="/play">Play the arcade</Link>
        </div>
      </section>
    </>
  );
}
