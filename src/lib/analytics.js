// Lightweight, provider-agnostic analytics.
// Activates only when an env var is set at build time — otherwise every call is
// a safe no-op, so the app ships tracking-ready without breaking when unconfigured.
//
//   Plausible:  VITE_PLAUSIBLE_DOMAIN=yourdomain.com
//   GA4:        VITE_GA_ID=G-XXXXXXXXXX
//
const env = (typeof import.meta !== 'undefined' && import.meta.env) || {};
const PLAUSIBLE_DOMAIN = env.VITE_PLAUSIBLE_DOMAIN;
const GA_ID = env.VITE_GA_ID;
const DEBUG = env.DEV;

let started = false;

export function initAnalytics() {
  if (started || typeof document === 'undefined') return;
  started = true;

  if (PLAUSIBLE_DOMAIN) {
    const s = document.createElement('script');
    s.defer = true;
    s.setAttribute('data-domain', PLAUSIBLE_DOMAIN);
    s.src = 'https://plausible.io/js/script.tagged-events.js';
    document.head.appendChild(s);
    window.plausible = window.plausible || function () { (window.plausible.q = window.plausible.q || []).push(arguments); };
  } else if (GA_ID) {
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { send_page_view: false });
  }
}

export function trackPageview(path) {
  if (PLAUSIBLE_DOMAIN && window.plausible) {
    window.plausible('pageview');
  } else if (GA_ID && window.gtag) {
    window.gtag('event', 'page_view', { page_path: path });
  } else if (DEBUG) {
    console.debug('[analytics] pageview', path);
  }
}

export function trackEvent(name, props = {}) {
  if (PLAUSIBLE_DOMAIN && window.plausible) {
    window.plausible(name, { props });
  } else if (GA_ID && window.gtag) {
    window.gtag('event', name, props);
  } else if (DEBUG) {
    console.debug('[analytics] event', name, props);
  }
}
