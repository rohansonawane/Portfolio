import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeProvider';
import { trackPageview } from '../../lib/analytics';
import BgGrid from './BgGrid';
import Footer from './Footer';
import MobileNav from './MobileNav';

const HIRE_URL = 'https://www.linkedin.com/in/rohanbsonawane';

const homeLinks = [
  { to: '/', label: 'Home', section: 'home', end: true },
  { to: '/#about', label: 'About', section: 'about' },
  { to: '/#skills', label: 'Skills', section: 'skills' },
  { to: '/#projects', label: 'Projects', section: 'projects' },
  { to: '/#experience', label: 'Experience', section: 'experience' },
  { to: '/#contact', label: 'Contact', section: 'contact' },
  { to: '/blog', label: 'Blog', section: 'blog' },
  { to: '/play', label: 'Play Games', section: 'play' }
];

function navClass({ isActive }) {
  return isActive ? 'active' : undefined;
}

export default function Layout({ children }) {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const isArcade = location.pathname.startsWith('/play');
  const [mobileOpen, setMobileOpen] = useState(false);

  // The audio controllers attach document-level listeners and are route-gated
  // internally, so each script is loaded exactly once for the app lifetime
  // (re-adding the <script> would not remove its listeners on unmount).
  useEffect(() => {
    if (window.__rvBgAudioLoaded) return;
    window.__rvBgAudioLoaded = true;
    const script = document.createElement('script');
    script.src = '/assets/bg-audio.js';
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!isArcade || window.__naArcadeLoaded) return;
    window.__naArcadeLoaded = true;
    const script = document.createElement('script');
    script.src = '/assets/arcade-music.js';
    script.defer = true;
    document.body.appendChild(script);
  }, [isArcade]);

  // Report an SPA pageview on every path change (hash changes excluded).
  useEffect(() => {
    trackPageview(location.pathname);
  }, [location.pathname]);

  // React Router intercepts <Link> clicks and updates the hash without the
  // browser's native anchor scroll, so #section nav links never scroll.
  const prevPathRef = useRef(location.pathname);
  useEffect(() => {
    const changedRoute = prevPathRef.current !== location.pathname;
    prevPathRef.current = location.pathname;

    if (!location.hash) {
      window.scrollTo(0, 0);
      return undefined;
    }

    const id = decodeURIComponent(location.hash.slice(1));
    const timers = [];
    const scrollToEl = (behavior) => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior, block: 'start' });
      return Boolean(el);
    };

    if (!changedRoute) {
      // Same page: the section is already laid out — one smooth scroll.
      scrollToEl('smooth');
      return undefined;
    }

    // Cross-route: the target page is still mounting and its grids/images/3D
    // settle asynchronously, shifting section offsets. Wait for the element,
    // then re-correct a few times as the layout stabilizes.
    let tries = 0;
    const wait = () => {
      if (scrollToEl('auto')) {
        [150, 400, 700, 1000].forEach((d) => timers.push(window.setTimeout(() => scrollToEl('auto'), d)));
      } else if (tries++ < 30) {
        timers.push(window.setTimeout(wait, 50));
      }
    };
    wait();
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [location.pathname, location.hash, location.key]);

  return (
    <>
      <BgGrid />
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="page">
        <MobileNav links={homeLinks} open={mobileOpen} onClose={() => setMobileOpen(false)} />
        <main className={`main-shell${isArcade ? ' main-shell--arcade' : ''}`}>
          <nav className="nav">
            <Link className="brand" to="/">
              Rohan<span className="brand-verse">Verse</span>
              <span className="brand-dot" aria-hidden="true" />
            </Link>
            <div className="nav-links">
              {homeLinks.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.to}
                  end={link.end}
                  className={navClass}
                  data-section={link.section}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
            <div className="nav-actions">
              <div className="nav-utility">
                <button
                  className="icon-btn music-toggle"
                  type="button"
                  aria-label="Turn background music on"
                  aria-pressed="false"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                  </svg>
                </button>
                <span className="nav-utility-divider" aria-hidden="true" />
                <button
                  className="icon-btn theme-toggle"
                  type="button"
                  aria-label="Toggle theme"
                  onClick={toggleTheme}
                >
                  {theme === 'dark' ? '☾' : '☀︎'}
                </button>
                <span className="nav-utility-divider" aria-hidden="true" />
                <a className="download-btn" href={HIRE_URL} target="_blank" rel="noreferrer">
                  Hire Me
                </a>
              </div>
              <button
                className="mobile-menu"
                type="button"
                id="mobileMenuBtn"
                aria-label="Open menu"
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen(true)}
              >
                ☰
              </button>
            </div>
          </nav>
          <div id="main-content" tabIndex={-1}>
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </>
  );
}
