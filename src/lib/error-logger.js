// Global client error logging. Captures uncaught errors + unhandled promise
// rejections. Always logs to console; forwards to a sink when one is wired
// (e.g. Sentry) via window.__errorSink, which can be set by an env-gated init.
const env = (typeof import.meta !== 'undefined' && import.meta.env) || {};

let started = false;

function report(kind, error, extra) {
  const payload = {
    kind,
    message: (error && error.message) || String(error),
    stack: error && error.stack,
    href: typeof location !== 'undefined' ? location.href : undefined,
    ...extra
  };
  // Always surface locally.
  console.error('[app-error]', kind, payload.message, error);
  // Forward to an external sink if one is registered (Sentry adapter, etc.).
  if (typeof window !== 'undefined' && typeof window.__errorSink === 'function') {
    try { window.__errorSink(payload); } catch { /* never let logging throw */ }
  }
}

export function initErrorLogging() {
  if (started || typeof window === 'undefined') return;
  started = true;

  window.addEventListener('error', (e) => {
    report('error', e.error || e.message, { filename: e.filename, line: e.lineno, col: e.colno });
  });
  window.addEventListener('unhandledrejection', (e) => {
    report('unhandledrejection', e.reason);
  });

  if (env.DEV) console.debug('[error-logger] initialised');
}
