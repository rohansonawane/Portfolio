import { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import PageMeta from '../components/seo/PageMeta';
import { SITE_URL } from '../config/site';

const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      name: 'Rohan Sonawane',
      url: SITE_URL,
      jobTitle: 'Software Developer',
      description:
        'Software Developer building intelligent, scalable and immersive experiences across Full Stack, AI/ML, VR/XR, and Cloud.',
      sameAs: [
        'https://github.com/RohanBSonawane',
        'https://www.linkedin.com/in/rohanbsonawane'
      ],
      knowsAbout: ['Full Stack Development', 'AI/ML', 'VR/XR', 'Cloud', 'Three.js', 'React']
    },
    {
      '@type': 'WebSite',
      name: 'RohanVerse',
      url: SITE_URL,
      author: { '@type': 'Person', name: 'Rohan Sonawane' }
    }
  ]
};

export default function HomePage() {
  const threeRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    let scene = null;
    let disposeHome = null;
    let disposePixels = null;

    import('../lib/portfolio-home-init.js').then((mod) => {
      if (cancelled) return;
      if (threeRef.current) {
        scene = mod.initThreeScene(threeRef.current);
      }
      disposeHome = mod.initHome?.();
    });

    import('../lib/contact-pixels.js').then((mod) => {
      if (cancelled) return;
      disposePixels = mod.initContactPixels?.();
    }).catch(() => {});

    return () => {
      cancelled = true;
      scene?.dispose?.();
      disposeHome?.();
      disposePixels?.();
    };
  }, []);

  return (
    <>
      <PageMeta
        title="RohanVerse | Rohan Sonawane | Software Developer"
        description="Portfolio of Rohan Sonawane, Software Developer building intelligent, scalable and immersive experiences across Full Stack, AI/ML, VR/XR, and Cloud."
        path="/"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(STRUCTURED_DATA)}</script>
      </Helmet>
      <section className="hero" id="about">
        <div className="hero-left">
          <div className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" />WELCOME TO MY PORTFOLIO</div>
          <h1>Hi, I’m<br /><span className="grad-text">Rohan Sonawane</span></h1>
          <p className="subtitle-role">Software Developer</p>
          <div className="subtitle-tags">
            <span>Full Stack</span>
            <span>AI/ML</span>
            <span>VR/XR</span>
            <span>Cloud</span>
          </div>
          <p className="desc">I build intelligent, scalable and immersive digital experiences that solve real world problems.</p>
          <div className="cta-row">
            <button className="primary-btn" type="button" onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}>
              Explore My Work
            </button>
            <a className="cta-hire-btn" href="https://www.linkedin.com/in/rohanbsonawane" target="_blank" rel="noreferrer">Hire Me</a>
          </div>
          <div className="socials">
            <a className="social social-github" id="socialGithub" href="https://github.com/RohanBSonawane" target="_blank" rel="noreferrer" aria-label="GitHub">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
            </a>
            <a className="social social-linkedin" id="socialLinkedin" href="https://www.linkedin.com/in/rohanbsonawane" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a className="social social-email" id="socialEmail" href="mailto:rohanbsonawane@gmail.com" aria-label="Email">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"/></svg>
            </a>
            <a className="social social-resume" id="socialResume" href="/assets/resume.html" target="_blank" rel="noreferrer" aria-label="Resume">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11zm-3-9H9v2h6v-2zm0 4H9v2h6v-2z"/></svg>
            </a>
          </div>
        </div>
        <div className="hero-3d-wrap">
          <canvas id="threeStage" ref={threeRef} aria-label="Interactive 3D portfolio avatar" />
          <div className="skill-glass-pop" id="skillGlassPop" aria-hidden="true">
            <button type="button" className="skill-glass-close" id="skillGlassClose" aria-label="Close skill info">×</button>
            <div className="skill-glass-icon" id="skillGlassIcon" />
            <p className="skill-glass-title" id="skillGlassTitle">Skill</p>
            <p id="skillGlassDesc" />
            <span className="skill-glass-tag" id="skillGlassTag" />
          </div>
          <div className="anim-controls" id="animControls">
            <button className="anim-btn active" type="button" data-anim="stand">Stand</button>
            <button className="anim-btn" type="button" data-anim="run">Run</button>
            <button className="anim-btn" type="button" data-anim="walk">Walk</button>
            <button className="anim-btn" type="button" data-anim="waveHello">Wave</button>
            <button className="anim-btn" type="button" data-anim="jumpUp">Jump</button>
            <button className="anim-btn" type="button" data-anim="punch">Punch</button>
          </div>
        </div>
      </section>

      <section className="sections">
        <article className="panel" id="skills">
          <div className="panel-head">
            <div><h2>SKILLS OVERVIEW</h2><p>Technologies &amp; tools I work with</p></div>
            <button type="button" className="view-link" data-modal="skills">View all<span className="arrow-icon" aria-hidden="true"><svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></span></button>
          </div>
          <div className="skills-panel-toolbar">
            <div className="skill-tabs" id="skillPanelTabs" role="tablist" aria-label="Filter skills by category" />
            <p className="skills-filter-count" id="skillsFilterCount" aria-live="polite" />
          </div>
          <div className="skills-filter-grid" id="skillsFilterGrid" aria-label="Skills icon grid" />
        </article>

        <article className="panel" id="projects">
          <div className="panel-head">
            <div><h2>FEATURED PROJECTS</h2><p>A few things I’ve built</p></div>
            <button type="button" className="view-link" data-modal="projects">View all<span className="arrow-icon" aria-hidden="true"><svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></span></button>
          </div>
          <div className="project-filters" id="projectFilters" role="tablist" aria-label="Filter projects" />
          <div className="projects-scroll" id="projectsScroll">
            <div className="projects" id="projectsList" aria-live="polite" />
          </div>
        </article>

        <article className="panel" id="experience">
          <div className="panel-head"><div><h2>EXPERIENCE TIMELINE</h2><p>My professional journey</p></div></div>
          <div className="timeline">
            <div className="time-row">
              <div className="time-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 21h18" /><path d="M5 21V7l8-4v18" /><path d="M19 21V11l-6-4" /><path d="M9 9v.01" /><path d="M9 12v.01" /><path d="M9 15v.01" /><path d="M9 18v.01" /></svg>
              </div>
              <div><small>2023 – Present</small><b>AI/VR Research Assistant &amp; SDE II</b><p>CSU Dominguez Hills</p></div>
            </div>
            <div className="time-row">
              <div className="time-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /><rect width="20" height="14" x="2" y="6" rx="2" /></svg>
              </div>
              <div><small>2020 – 2023</small><b>Freelance Software Developer</b><p>Multiple Clients</p></div>
            </div>
            <div className="time-row">
              <div className="time-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="16" height="20" x="4" y="2" rx="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" /><path d="M12 10h.01" /><path d="M12 14h.01" /><path d="M16 10h.01" /><path d="M16 14h.01" /><path d="M8 10h.01" /><path d="M8 14h.01" /></svg>
              </div>
              <div><small>2016 – 2020</small><b>Software Developer</b><p>Briefkase Digital Communications</p></div>
            </div>
            <div className="time-row">
              <div className="time-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
              </div>
              <div><small>2025</small><b>Computer Science Expert</b><p>Mercor Contract</p></div>
            </div>
          </div>
        </article>
      </section>

      <section className="stats" id="stats">
        <div className="stat"><b>8+</b><span>Years in Development</span></div>
        <div className="stat"><b>50+</b><span>Technologies &amp; Tools</span></div>
        <div className="stat"><b>16+</b><span>Tech-Facing Clients</span></div>
        <div className="stat"><b>60+</b><span>Projects Shipped</span></div>
        <blockquote className="quote">
          <p className="quote-text">
            <span className="quote-lead">Good software doesn’t always have to be serious.</span>
            <span className="quote-rest">Sometimes the best way to show you can build is to let someone play.</span>
          </p>
          <footer className="quote-author">Rohan Sonawane</footer>
        </blockquote>
      </section>

      <section className="contact-section" id="contact">
        <div className="contact-pixels" id="contactPixels" aria-hidden="true" />
        <div className="contact-inner">
          <h2>Let&apos;s build something great</h2>
          <p>Open to full-time roles, contract work, and interesting collaborations.</p>
          <div className="contact-actions">
            <a className="primary-btn" href="mailto:rohanbsonawane@gmail.com">Get in touch</a>
            <a className="secondary-btn" href="https://github.com/RohanBSonawane" target="_blank" rel="noreferrer">View GitHub</a>
          </div>
        </div>
      </section>

      <div className="panel-modal" id="panelModal" aria-hidden="true">
        <div className="panel-modal-backdrop" id="panelModalBackdrop" />
        <div className="panel-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="panelModalTitle">
          <div className="panel-modal-head">
            <div>
              <h3 id="panelModalTitle">Title</h3>
              <p id="panelModalDesc" />
            </div>
            <button type="button" className="panel-modal-close" id="panelModalClose" aria-label="Close">×</button>
          </div>
          <div className="panel-modal-body" id="panelModalBody" />
        </div>
      </div>

      <div className="toast" id="toast" role="status" aria-live="polite" />
    </>
  );
}
