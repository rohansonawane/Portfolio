import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ARCADE_CATEGORIES,
  ARCADE_GAMES,
  ARCADE_LOGO,
  gameCardSrc,
  loadSettings,
  saveSettings
} from '../../arcade/data.js';
import { uiIcon } from '../../arcade/ui-icons.js';
import { initBuiltWith } from '../../arcade/built-with.js';
import { renderHeroScene, initHeroParallax } from '../../arcade/hero-parallax.js';
import ArcadeSettings from './ArcadeSettings';

function filteredGames(filter) {
  return ARCADE_GAMES.filter((g) => {
    if (g.comingSoon && filter !== 'all') return false;
    const catOk = filter === 'all' || g.categories.includes(filter);
    return catOk && !g.comingSoon;
  });
}

export default function ArcadeHub() {
  const [filter, setFilter] = useState('all');
  const sceneRef = useRef(null);
  const bannerRef = useRef(null);
  const games = useMemo(() => filteredGames(filter), [filter]);

  useEffect(() => {
    const scene = sceneRef.current;
    if (scene) renderHeroScene(scene);
    const banner = bannerRef.current;
    if (banner) initHeroParallax(banner);
  }, []);

  useEffect(() => {
    initBuiltWith();
  }, []);

  useEffect(() => {
    const s = loadSettings();
    document.querySelector('.arcade-page')?.classList.toggle('no-anim', !s.animations || s.reducedMotion);
  }, []);

  return (
    <>
      <section className="arcade-hero" id="arcadeHero" aria-label="Notebook Arcade hero">
        <div className="arcade-hero-banner" ref={bannerRef}>
          <div className="arcade-hero-scene" id="arcadeHeroScene" ref={sceneRef} aria-hidden="true" />
          <div className="arcade-hero-vignette" aria-hidden="true" />
          <div className="arcade-hero-center">
            <img className="arcade-brand-logo" src={ARCADE_LOGO} width="216" height="146" alt="Notebook Arcade" />
            <div className="arcade-eyebrow arcade-hero-eyebrow">
              <span className="arcade-eyebrow-dot" aria-hidden="true" />
              Notebook Arcade
            </div>
            <h1 className="arcade-hero-tagline">
              Play. Learn. <span className="arcade-hero-accent">Rewind.</span>
            </h1>
            <p className="arcade-desc">Classic pencil-and-paper games from school breaks, rebuilt for the browser.</p>
            <div className="arcade-hero-actions">
              <a className="primary-btn" href="#games">Start Playing</a>
              <a className="cta-hire-btn" href="#arcade-about">About the Arcade</a>
            </div>
          </div>
        </div>
      </section>

      <section className="arcade-games-hub" id="games" aria-label="Game library">
        <div className="arcade-hub-toolbar">
          <div className="arcade-filters" id="arcadeFilterChips">
            {ARCADE_CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`arcade-chip${filter === c.id ? ' active' : ''}`}
                data-arcade-filter={c.id}
                style={{ '--chip-color': c.color, '--chip-bg': c.bg }}
                onClick={() => setFilter(c.id)}
              >
                <span className="arcade-chip-icon" dangerouslySetInnerHTML={{ __html: uiIcon(c.icon) }} />
                {c.label}
              </button>
            ))}
          </div>
        </div>
        <div className="arcade-icons-grid" id="arcadeCards">
          {games.map((g) => (
            <Link key={g.id} className="arcade-game-icon" to={`/play/${g.id}`} aria-label={`Play ${g.title}`}>
              <img src={gameCardSrc(g.id)} alt={g.title} loading="lazy" width="120" height="150" />
              <span className="arcade-game-icon-label">{g.title}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="arcade-about-section" id="arcade-about" aria-labelledby="arcade-about-title">
        <div className="arcade-about-inner">
          <div className="arcade-about-header">
            <div className="arcade-about-copy">
              <div className="arcade-eyebrow"><span className="arcade-eyebrow-dot" aria-hidden="true" />About Notebook Arcade</div>
              <h2 id="arcade-about-title">School-day games, <span className="arcade-grad-text">rebuilt for the web</span></h2>
              <p className="arcade-about-lead">Notebook Arcade is the playful corner of RohanVerse: classic pencil-and-paper games from school breaks, rebuilt as fast, offline-friendly web experiences you can actually play.</p>
              <p className="arcade-about-body">I built it because portfolios often show what you made, but rarely let people <em>use</em> something you made. Each game is a small exercise in UI, logic, and polish, the same craft I bring to full-stack products, just with a little more nostalgia.</p>
              <blockquote className="arcade-about-pull">
                <p>Good software doesn’t always have to be serious. Sometimes the best way to show you can build is to let someone play.</p>
              </blockquote>
            </div>
          </div>

          <div className="arcade-about-highlights">
            <article className="arcade-about-card">
              <span className="arcade-about-card-num">01</span>
              <h3>Nostalgia, not novelty</h3>
              <p>Tic-tac-toe, dots &amp; boxes, book cricket: the games we sketched in notebook margins, digitized without losing their charm.</p>
            </article>
            <article className="arcade-about-card">
              <span className="arcade-about-card-num">02</span>
              <h3>Runs in your browser</h3>
              <p>No installs, no accounts, no backend. Pure HTML, CSS, and JavaScript, playable anywhere, even offline once loaded.</p>
            </article>
            <article className="arcade-about-card">
              <span className="arcade-about-card-num">03</span>
              <h3>Growing one game at a time</h3>
              <p>Tic Tac Toe is live today. More classics roll out as side projects between shipping real products and client work.</p>
            </article>
          </div>

          <div className="arcade-about-stack">
            <span className="arcade-about-stack-label">Built with</span>
            <div className="arcade-tech-badges" id="arcadeBuiltWith" />
          </div>
        </div>
      </section>

      <ArcadeSettings />
    </>
  );
}
