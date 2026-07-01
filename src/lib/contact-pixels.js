import { SKILL_DEFS } from './skill-brand.js';

const SIMPLE_ICONS_PKG = '11.14.0';
const SIMPLE_ICONS_JSdelivr = slug =>
  `https://cdn.jsdelivr.net/npm/simple-icons@${SIMPLE_ICONS_PKG}/icons/${slug}.svg`;

const CONTACT_SKILL_SLUGS = [
  'react',
  'typescript',
  'nextdotjs',
  'javascript',
  'html5',
  'css3',
  'tailwindcss',
  'vite',
  'nodedotjs',
  'python',
  'fastapi',
  'django',
  'graphql',
  'postgresql',
  'mongodb',
  'redis',
  'openai',
  'pytorch',
  'tensorflow',
  'huggingface',
  'docker',
  'kubernetes',
  'amazonaws',
  'googlecloud',
  'terraform',
  'githubactions',
  'vercel',
  'netlify',
  'git',
  'github',
  'unity',
  'unrealengine',
  'threedotjs',
  'blender',
  'csharp',
  'webxr',
  'figma',
  'framermotion'
];

function getContactSkills() {
  return CONTACT_SKILL_SLUGS
    .map(slug => SKILL_DEFS.find(skill => skill.slug === slug))
    .filter(Boolean);
}

function hexToLuminance(hex) {
  const c = (hex || '').replace('#', '');
  if (c.length !== 6) return 0.5;
  const channels = [c.slice(0, 2), c.slice(2, 4), c.slice(4, 6)].map(part => parseInt(part, 16) / 255);
  const linear = channels.map(v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function isDarkHex(hex) {
  return hexToLuminance(hex) < 0.22;
}

function getSkillIconColorHex(skill, dark = document.documentElement.dataset.theme === 'dark') {
  const brand = (skill.color || '#888888').replace('#', '');
  const iconHex = skill.iconHex ? skill.iconHex.replace('#', '') : null;

  if (dark) {
    if (skill.iconHexDark) return skill.iconHexDark.replace('#', '');
    if (iconHex && !isDarkHex(iconHex)) return iconHex;
    if (isDarkHex(brand)) return 'FFFFFF';
    return brand;
  }

  if (skill.iconHexLight) return skill.iconHexLight.replace('#', '');
  if (isDarkHex(brand)) return brand;
  if (iconHex && !isDarkHex(iconHex)) return iconHex;
  return brand;
}

function tintMonochromeIcon(img, color) {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, size, size);
  ctx.globalCompositeOperation = 'source-in';
  ctx.fillStyle = color.startsWith('#') ? color : `#${color}`;
  ctx.fillRect(0, 0, size, size);
  return canvas.toDataURL('image/png');
}

function createSkillIconFallbackDataUri(skill, dark = document.documentElement.dataset.theme === 'dark') {
  const brand = (skill.color || '#4f55ff').replace('#', '');
  const iconHex = getSkillIconColorHex(skill, dark);
  const letter = (skill.label || skill.slug || '?').charAt(0).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="#${brand}"/><text x="12" y="16" text-anchor="middle" font-size="11" font-family="Inter,sans-serif" font-weight="700" fill="#${iconHex}">${letter}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function loadSkillIconUrl(skill, dark = document.documentElement.dataset.theme === 'dark') {
  if (skill.iconDataUri) return Promise.resolve(skill.iconDataUri);

  const slug = skill.iconSlug || skill.slug;
  const iconHex = getSkillIconColorHex(skill, dark);
  const iconColor = `#${iconHex}`;
  const coloredCdn = `https://cdn.simpleicons.org/${slug}/${iconHex}`;

  return new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (img.src.includes('simpleicons.org')) {
        resolve(coloredCdn);
        return;
      }
      resolve(tintMonochromeIcon(img, iconColor));
    };
    img.onerror = () => {
      const fallback = new Image();
      fallback.crossOrigin = 'anonymous';
      fallback.onload = () => resolve(tintMonochromeIcon(fallback, iconColor));
      fallback.onerror = () => resolve(createSkillIconFallbackDataUri(skill, dark));
      fallback.src = SIMPLE_ICONS_JSdelivr(slug);
    };
    img.src = coloredCdn;
  });
}

function bindContactIconFallback(img, skill) {
  if (!img || img.dataset.fallbackBound) return;
  img.dataset.fallbackBound = '1';
  img.addEventListener('error', () => {
    loadSkillIconUrl(skill).then(url => {
      if (img.src !== url) img.src = url;
    });
  });
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

export function initContactPixels() {
  const section = document.getElementById('contact');
  const layer = document.getElementById('contactPixels');
  if (!section || !layer) return () => {};

  const disposers = [];
  const on = (target, type, handler, opts) => {
    target.addEventListener(type, handler, opts);
    disposers.push(() => target.removeEventListener(type, handler, opts));
  };

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = () => window.innerWidth < 760;
  const count = () => (mobile() ? 16 : 22);
  const particles = [];
  let mouse = { x: -9999, y: -9999, active: false };
  let rafId = 0;
  let bounds = { w: 0, h: 0 };

  function isInDeadZone(x, y) {
    const nx = x / bounds.w;
    const ny = y / bounds.h;
    return nx > 0.24 && nx < 0.76 && ny > 0.2 && ny < 0.74;
  }

  async function applySkillIcon(particle) {
    const url = await loadSkillIconUrl(particle.skill);
    if (particle.img) particle.img.src = url;
  }

  function spawnParticle(skill) {
    const size = mobile() ? rand(22, 28) : rand(26, 32);

    const el = document.createElement('div');
    el.className = 'contact-pixel';
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.setProperty('--pixel-brand', skill.color || '#4f55ff');

    const iconWrap = document.createElement('div');
    iconWrap.className = 'contact-pixel-icon';

    const img = document.createElement('img');
    img.alt = '';
    img.draggable = false;
    img.decoding = 'async';
    bindContactIconFallback(img, skill);
    iconWrap.appendChild(img);
    el.appendChild(iconWrap);
    layer.appendChild(el);

    let x = 0;
    let y = 0;
    let attempts = 0;
    do {
      x = rand(0.05, 0.92) * bounds.w;
      y = rand(0.08, 0.9) * bounds.h;
      attempts += 1;
    } while (isInDeadZone(x, y) && attempts < 40);

    const particle = {
      el,
      img,
      skill,
      x,
      y,
      vx: rand(-0.2, 0.2),
      vy: rand(-0.2, 0.2),
      size,
      phase: rand(0, Math.PI * 2),
      wobble: rand(0.6, 1.2)
    };

    applySkillIcon(particle);
    return particle;
  }

  function measure() {
    bounds = { w: section.clientWidth, h: section.clientHeight };
  }

  function layoutStatic() {
    measure();
    layer.replaceChildren();
    particles.length = 0;

    const picks = [...getContactSkills()].sort(() => Math.random() - 0.5).slice(0, count());
    picks.forEach(skill => {
      const p = spawnParticle(skill);
      particles.push(p);
      p.el.style.transform = `translate3d(${p.x - p.size / 2}px, ${p.y - p.size / 2}px, 0)`;
    });
  }

  function tick() {
    measure();
    particles.forEach(p => {
      p.phase += 0.016 * p.wobble;
      p.vx += Math.sin(p.phase) * 0.0035;
      p.vy += Math.cos(p.phase * 0.9) * 0.0035;

      if (mouse.active) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy) || 1;
        const radius = 130;
        if (dist < radius) {
          const force = (1 - dist / radius) * 1.2;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
          p.el.classList.add('is-near');
        } else {
          p.el.classList.remove('is-near');
        }
      } else {
        p.el.classList.remove('is-near');
      }

      p.vx *= 0.986;
      p.vy *= 0.986;
      p.x += p.vx;
      p.y += p.vy;

      const pad = p.size * 0.52;
      if (p.x < pad) { p.x = pad; p.vx = Math.abs(p.vx) * 0.62; }
      if (p.x > bounds.w - pad) { p.x = bounds.w - pad; p.vx = -Math.abs(p.vx) * 0.62; }
      if (p.y < pad) { p.y = pad; p.vy = Math.abs(p.vy) * 0.62; }
      if (p.y > bounds.h - pad) { p.y = bounds.h - pad; p.vy = -Math.abs(p.vy) * 0.62; }

      if (isInDeadZone(p.x, p.y)) {
        const cx = bounds.w * 0.5;
        const cy = bounds.h * 0.5;
        const dx = p.x - cx;
        const dy = p.y - cy;
        const dist = Math.hypot(dx, dy) || 1;
        p.vx += (dx / dist) * 0.1;
        p.vy += (dy / dist) * 0.1;
      }

      const bob = Math.sin(p.phase * 2) * 2.5;
      const tilt = Math.sin(p.phase) * 5;
      p.el.style.transform = `translate3d(${p.x - p.size / 2}px, ${p.y - p.size / 2 + bob}px, 0) rotate(${tilt}deg)`;
    });

    rafId = window.requestAnimationFrame(tick);
  }

  function onPointerMove(event) {
    const rect = section.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
    mouse.active = true;
  }

  function onPointerLeave() {
    mouse.active = false;
  }

  layoutStatic();

  on(window, 'rv-theme-change', () => {
    particles.forEach(p => applySkillIcon(p));
  });

  if (reducedMotion) {
    on(window, 'resize', layoutStatic);
    return () => disposers.forEach(fn => fn());
  }

  on(section, 'pointermove', onPointerMove);
  on(section, 'pointerleave', onPointerLeave);
  on(window, 'resize', () => {
    cancelAnimationFrame(rafId);
    layoutStatic();
    rafId = requestAnimationFrame(tick);
  });

  rafId = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(rafId);
    disposers.forEach(fn => fn());
    layer.replaceChildren();
    particles.length = 0;
  };
}
