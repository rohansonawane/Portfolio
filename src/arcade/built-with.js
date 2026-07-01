import { ARCADE_BUILT_WITH } from './data.js';
import { getSkillByTagLabel, getTagBrandColor } from '../lib/skill-brand.js';

const SIMPLE_ICONS_PKG = '11.14.0';
const SIMPLE_ICONS_JSdelivr = slug =>
  `https://cdn.jsdelivr.net/npm/simple-icons@${SIMPLE_ICONS_PKG}/icons/${slug}.svg`;

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
      fallback.onerror = () => resolve(coloredCdn);
      fallback.src = SIMPLE_ICONS_JSdelivr(slug);
    };
    img.src = coloredCdn;
  });
}

function styleArcadeSkillBadge(el, label) {
  const skill = getSkillByTagLabel(label);
  const brand = getTagBrandColor(label);
  const hex = brand.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const dark = document.documentElement.dataset.theme === 'dark';
  let textColor = brand;

  if (dark && isDarkHex(brand)) {
    textColor = skill?.iconHex
      ? `#${skill.iconHex.replace('#', '')}`
      : `rgb(${Math.min(r + 110, 255)}, ${Math.min(g + 110, 255)}, ${Math.min(b + 110, 255)})`;
  }

  el.style.color = textColor;
  el.style.background = dark
    ? `color-mix(in srgb, ${brand} 24%, var(--surface-strong))`
    : `color-mix(in srgb, ${brand} 16%, var(--surface-strong))`;
  el.style.borderColor = dark
    ? `rgba(${r}, ${g}, ${b}, 0.42)`
    : `rgba(${r}, ${g}, ${b}, 0.32)`;

  const iconWrap = el.querySelector('.arcade-skill-badge-icon-wrap');
  if (iconWrap) {
    iconWrap.style.background = dark
      ? `color-mix(in srgb, ${brand} 12%, var(--surface-strong))`
      : `color-mix(in srgb, ${brand} 8%, #ffffff)`;
    iconWrap.style.borderColor = dark
      ? `rgba(${r}, ${g}, ${b}, 0.28)`
      : `rgba(${r}, ${g}, ${b}, 0.2)`;
  }
}

function createSkillBadge(label) {
  const skill = getSkillByTagLabel(label);
  const dark = document.documentElement.dataset.theme === 'dark';
  const badge = document.createElement('span');
  badge.className = 'arcade-skill-badge';
  badge.dataset.tag = label;

  const iconWrap = document.createElement('span');
  iconWrap.className = 'arcade-skill-badge-icon-wrap';

  const icon = document.createElement('img');
  icon.className = 'arcade-skill-badge-icon';
  icon.alt = '';
  icon.decoding = 'async';
  iconWrap.appendChild(icon);
  badge.append(iconWrap, document.createTextNode(label));

  styleArcadeSkillBadge(badge, label);
  if (skill) {
    loadSkillIconUrl(skill, dark).then(url => { icon.src = url; });
  }

  return badge;
}

export function renderBuiltWith(container = document.getElementById('arcadeBuiltWith')) {
  if (!container) return;
  container.replaceChildren();
  ARCADE_BUILT_WITH.forEach(label => container.appendChild(createSkillBadge(label)));
}

export function initBuiltWith() {
  renderBuiltWith();
  window.addEventListener('rv-theme-change', () => renderBuiltWith());
}
