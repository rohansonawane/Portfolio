import {
  ARCADE_GAMES,
  ARCADE_CATEGORIES,
  ARCADE_LOGO,
  gameCardSrc,
  loadSettings,
  saveSettings
} from './data.js';
import { uiIcon } from './ui-icons.js';
import { initBuiltWith } from './built-with.js';
import { renderHeroScene, initHeroParallax } from './hero-parallax.js';

let state = { filter: 'all', settings: loadSettings() };

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function filteredGames() {
  return ARCADE_GAMES.filter((g) => {
    if (g.comingSoon && state.filter !== 'all') return false;
    const catOk = state.filter === 'all' || g.categories.includes(state.filter);
    return catOk && !g.comingSoon;
  });
}

function renderHero() {
  const hero = $('#arcadeHero');
  if (!hero) return;

  hero.innerHTML = `
    <div class="arcade-hero-banner">
      <div class="arcade-hero-scene" id="arcadeHeroScene" aria-hidden="true"></div>
      <div class="arcade-hero-vignette" aria-hidden="true"></div>
      <div class="arcade-hero-center">
        <img class="arcade-brand-logo" src="${ARCADE_LOGO}" width="216" height="146" alt="Notebook Arcade" />
        <div class="arcade-eyebrow arcade-hero-eyebrow"><span class="arcade-eyebrow-dot" aria-hidden="true"></span>Notebook Arcade</div>
        <h1 class="arcade-hero-tagline">Play. Learn. <span class="arcade-hero-accent">Rewind.</span></h1>
        <p class="arcade-desc">Classic pencil-and-paper games from school breaks, rebuilt for the browser.</p>
        <div class="arcade-hero-actions">
          <a class="primary-btn" href="#games">Start Playing</a>
          <a class="cta-hire-btn" href="#arcade-about">About the Arcade</a>
        </div>
      </div>
    </div>`;

  renderHeroScene($('#arcadeHeroScene'));
  initHeroParallax(hero.querySelector('.arcade-hero-banner'));
}

function renderFilters() {
  $$('[data-arcade-filter]').forEach((chip) => {
    chip.classList.toggle('active', chip.dataset.arcadeFilter === state.filter);
    chip.onclick = () => { state.filter = chip.dataset.arcadeFilter; renderCards(); renderFilters(); };
  });
}

function renderCards() {
  const grid = $('#arcadeCards');
  if (!grid) return;
  const games = filteredGames();
  grid.innerHTML = games.map((g) => `
    <a class="arcade-game-icon" href="game.html?id=${g.id}" aria-label="Play ${g.title}">
      <img src="${gameCardSrc(g.id)}" alt="${g.title}" loading="lazy" width="120" height="150" />
      <span class="arcade-game-icon-label">${g.title}</span>
    </a>`).join('');
}

function initFilters() {
  const markup = ARCADE_CATEGORIES.map((c) => `
    <button class="arcade-chip" type="button" data-arcade-filter="${c.id}" style="--chip-color:${c.color};--chip-bg:${c.bg}">
      <span class="arcade-chip-icon">${uiIcon(c.icon)}</span>${c.label}
    </button>`).join('');
  ['#arcadeFilterChips'].forEach((sel) => {
    const el = $(sel);
    if (el) el.innerHTML = markup;
  });
}

function renderSettingsModal() {
  const s = state.settings;
  $$('[data-setting]').forEach((toggle) => {
    const key = toggle.dataset.setting;
    toggle.classList.toggle('on', Boolean(s[key]));
    toggle.onclick = () => {
      s[key] = !s[key];
      saveSettings(s);
      if (key === 'music' && typeof window.naSetMusic === 'function') {
        window.naSetMusic(s.music);
      } else {
        applySettings();
      }
      renderSettingsModal();
    };
  });
}

function applySettings() {
  $('.arcade-page')?.classList.toggle('no-anim', !state.settings.animations || state.settings.reducedMotion);
}

function bindSettings() {
  $('#arcadeSettingsFab')?.addEventListener('click', () => {
    $('#arcadeSettingsModal')?.classList.add('open');
    renderSettingsModal();
  });
  $('#arcadeSettingsClose')?.addEventListener('click', () => $('#arcadeSettingsModal')?.classList.remove('open'));
  $('#arcadeSettingsModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'arcadeSettingsModal') e.target.classList.remove('open');
  });
  $('#resetProgressBtn')?.addEventListener('click', () => {
    localStorage.removeItem('na-scores');
    localStorage.removeItem('na-achievements');
    renderSettingsModal();
  });
}

export function initHub() {
  state.settings = loadSettings();
  applySettings();
  renderHero();
  initFilters();
  bindSettings();
  renderCards();
  renderFilters();
  initBuiltWith();
}

if (document.body.dataset.arcadePage === 'hub') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initHub);
  else initHub();
}
