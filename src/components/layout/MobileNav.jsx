import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function MobileNav({ links, open, onClose }) {
  useEffect(() => {
    document.body.classList.toggle('mobile-nav-open', open);
    return () => document.body.classList.remove('mobile-nav-open');
  }, [open]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className={`mobile-nav${open ? ' open' : ''}`} id="mobileNav" aria-hidden={open ? 'false' : 'true'}>
      <div className="mobile-nav-backdrop" id="mobileNavBackdrop" onClick={onClose} />
      <div className="mobile-nav-panel">
        <div className="mobile-nav-head">
          <span>Menu</span>
          <button className="mobile-nav-close" type="button" id="mobileNavClose" aria-label="Close menu" onClick={onClose}>×</button>
        </div>
        <nav className="mobile-nav-links" id="mobileNavLinks">
          {links.map((link) => (
            <Link key={link.label} to={link.to} data-section={link.section} onClick={onClose}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
