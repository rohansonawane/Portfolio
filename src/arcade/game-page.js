import {
  ARCADE_GAMES,
  getGameById,
  gameCardSrc,
  loadSettings,
  saveSettings,
  loadScores,
  loadAchievements,
  unlockAchievement
} from './data.js';
import { uiIcon } from './ui-icons.js';
import { playGameSound, bumpScore, getGameScore } from './game-common.js';
import { mountGame as mountRegisteredGame, hasGame } from './games/registry.js';
import { getGameGuide } from './game-guides.js';

const ACHIEVEMENTS = [
  { id: 'first-play', label: 'First Game', desc: 'Open any game' },
  { id: 'ttt-win', label: 'TTT Champion', desc: 'Win Tic Tac Toe vs CPU' },
  { id: 'puzzle-master', label: 'Puzzle Master', desc: 'Win any puzzle game' },
  { id: 'arcade-hero', label: 'Arcade Hero', desc: 'Beat a high score' },
  { id: 'word-wizard', label: 'Word Wizard', desc: 'Complete Hangman or Word Search' },
  { id: 'explorer', label: 'Explorer', desc: 'Play 5 different games' }
];

const PUZZLE_IDS = new Set(['sudoku', 'landmines', 'doodle-maze', 'word-search']);
const WORD_IDS = new Set(['hangman', 'word-search']);
const ARCADE_IDS = new Set(['snake', 'drop-dots', 'book-cricket']);

let state = { settings: loadSettings(), playedGames: new Set() };
const $ = (sel, root = document) => root.querySelector(sel);

let currentGameId = 'tic-tac-toe';

function getGameId() {
  return currentGameId;
}

function playSound(type) {
  playGameSound(type, state.settings);
}

function confetti() {
  if (state.settings.reducedMotion || !state.settings.animations) return;
  const layer = document.createElement('div');
  layer.className = 'arcade-confetti';
  const colors = ['#ffd93d', '#ff6bcb', '#2d8cff', '#38c98c', '#8a57ff'];
  for (let i = 0; i < 36; i += 1) {
    const p = document.createElement('span');
    p.className = 'arcade-confetti-piece';
    p.style.left = `${Math.random() * 100}%`;
    p.style.top = `${Math.random() * 30}%`;
    p.style.background = colors[i % colors.length];
    layer.appendChild(p);
  }
  document.body.appendChild(layer);
  setTimeout(() => layer.remove(), 1400);
}

function trackPlayedGame(gameId) {
  state.playedGames.add(gameId);
  try {
    const raw = localStorage.getItem('na-played');
    const list = raw ? JSON.parse(raw) : [];
    if (!list.includes(gameId)) list.push(gameId);
    localStorage.setItem('na-played', JSON.stringify(list));
    if (list.length >= 5) unlockAchievement('explorer');
  } catch { /* ignore */ }
}

function saveScoreFlexible(gameId, ...args) {
  if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null) {
    const payload = args[0];
    Object.entries(payload).forEach(([field, val]) => {
      if (typeof val === 'number') bumpScore(gameId, field, val);
    });
    return;
  }
  if (args.length >= 2 && typeof args[1] === 'string') {
    bumpScore(args[0], args[1], args[2] ?? 1);
    return;
  }
  bumpScore(gameId, args[0] || 'wins', args[1] ?? 1);
}

function onGameWin(game, detail = {}) {
  confetti();
  playSound('win');

  if (game.id === 'tic-tac-toe') unlockAchievement('ttt-win');
  if (PUZZLE_IDS.has(game.id)) unlockAchievement('puzzle-master');
  if (WORD_IDS.has(game.id)) unlockAchievement('word-wizard');
  if (ARCADE_IDS.has(game.id) || detail.highScore) unlockAchievement('arcade-hero');

  renderSidebar(game);
}

function createGameApi(game) {
  return {
    settings: state.settings,
    gameId: game.id,
    onWin: (detail) => onGameWin(game, detail),
    playSound: (type) => playSound(type),
    saveScore: (...args) => saveScoreFlexible(game.id, ...args)
  };
}

async function mountGame(container, game) {
  container.innerHTML = '';
  if (game.playable && hasGame(game.id)) {
    trackPlayedGame(game.id);
    await mountRegisteredGame(game.id, container, createGameApi(game));
    return;
  }
  container.innerHTML = `
    <div class="arcade-placeholder">
      <img class="arcade-placeholder-card" src="${gameCardSrc(game.id)}" alt="${game.title}" width="140" height="175" />
      <h3>${game.title}</h3>
      <p>${game.rules}</p>
      <button class="arcade-btn arcade-btn-secondary arcade-btn-shiny" type="button" disabled>Coming Soon</button>
    </div>`;
}

function formatScoreRows(gameId) {
  const scores = getGameScore(gameId);
  const rows = Object.entries(scores)
    .filter(([, v]) => typeof v === 'number' && v > 0)
    .map(([k, v]) => {
      const label = k.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());
      return `<div class="arcade-info-row"><span>${label}</span><b>${v}</b></div>`;
    });
  return rows.join('');
}

function buildGuideMarkup(game) {
  const guide = getGameGuide(game.id);
  const controls = guide.controls?.length
    ? `<h3>Controls</h3><ul class="game-guide-list">${guide.controls.map((c) => `<li><strong>${c.label}</strong> ${c.detail}</li>`).join('')}</ul>`
    : '';
  const tips = guide.tips?.length
    ? `<h3>Tips</h3><ul class="game-guide-list game-guide-tips">${guide.tips.map((t) => `<li>${t}</li>`).join('')}</ul>`
    : '';

  return `
    <div class="game-guide">
      <p class="game-guide-goal">${guide.goal}</p>
      <ol class="game-guide-steps">${guide.steps.map((s) => `<li>${s}</li>`).join('')}</ol>
      ${controls}
      ${tips}
    </div>`;
}

function renderSidebar(game) {
  const panel = $('#gameInfoPanel');
  if (!panel || !game) return;
  const achievements = loadAchievements();
  const scoreRows = formatScoreRows(game.id);
  panel.innerHTML = `
    <details class="arcade-panel game-side-box game-howto-accordion">
      <summary>
        <h2 class="game-accordion-title">How to Play</h2>
        <svg class="game-accordion-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
      </summary>
      <div class="game-howto-content">${buildGuideMarkup(game)}</div>
    </details>
    <section class="arcade-panel game-side-box">
      <h2>Game Info</h2>
      <div class="arcade-info-meta">
        <div class="arcade-info-row"><span>Category</span><b>${game.category}</b></div>
        <div class="arcade-info-row"><span>Difficulty</span><b>${game.difficulty}</b></div>
        <div class="arcade-info-row"><span>Players</span><b>${game.players}</b></div>
        <div class="arcade-info-row"><span>Time</span><b>${game.time}</b></div>
        ${scoreRows}
      </div>
    </section>
    <section class="arcade-panel game-side-box">
      <h2>Achievements</h2>
      <div class="arcade-achievements">
        ${ACHIEVEMENTS.map((a) => `<span class="arcade-badge${achievements.includes(a.id) ? '' : ' locked'}" title="${a.desc}">${a.label}</span>`).join('')}
      </div>
    </section>`;
}

function renderMoreGames(game) {
  const wrap = $('#gameMore');
  if (!wrap) return;
  const others = ARCADE_GAMES.filter((g) => g.id !== game.id && !g.comingSoon);
  if (!others.length) {
    wrap.innerHTML = '';
    return;
  }
  wrap.innerHTML = `
    <div class="arcade-icons-grid game-more-grid">
      ${others.map((g) => `
        <a class="arcade-game-icon" href="/play/${g.id}" aria-label="Play ${g.title}">
          <img src="${gameCardSrc(g.id)}" alt="${g.title}" loading="lazy" width="120" height="150" />
          <span class="arcade-game-icon-label">${g.title}</span>
        </a>`).join('')}
    </div>`;
}

function renderGamePage() {
  const game = getGameById(getGameId());
  const app = $('#gameApp');
  if (!game || !app) {
    if (app) app.innerHTML = `<div class="arcade-empty-state"><p>Game not found.</p><a class="arcade-btn arcade-btn-primary arcade-btn-shiny" href="/play">Back to Arcade</a></div>`;
    return;
  }

  unlockAchievement('first-play');
  document.title = `${game.title} | Notebook Arcade`;

  app.innerHTML = `
    <div class="game-page-layout">
      <header class="game-page-head">
        <div class="game-page-title">
          <img src="${gameCardSrc(game.id)}" alt="" width="72" height="90" class="game-page-thumb" />
          <div>
            <h1>${game.title}</h1>
            <p>${game.category} · ${game.players} · ${game.difficulty}</p>
          </div>
        </div>
        <a class="arcade-btn arcade-btn-secondary arcade-btn-shiny game-back-btn" href="/play">${uiIcon('back')}<span>Back</span></a>
      </header>
      <div class="game-page-body">
        <div class="arcade-panel game-play-panel">
          <div id="gamePlayArea" class="arcade-play-body"></div>
        </div>
        <aside class="game-info-panel" id="gameInfoPanel"></aside>
      </div>
      <section class="game-more" id="gameMore"></section>
    </div>`;

  void mountGame($('#gamePlayArea'), game);
  renderSidebar(game);
  renderMoreGames(game);
}

function bindSettings() {
  state.settings = loadSettings();
  try {
    const played = JSON.parse(localStorage.getItem('na-played') || '[]');
    state.playedGames = new Set(played);
  } catch { /* ignore */ }

  document.querySelectorAll('[data-setting]').forEach((toggle) => {
    const key = toggle.dataset.setting;
    toggle.classList.toggle('on', Boolean(state.settings[key]));
    toggle.onclick = () => {
      state.settings[key] = !state.settings[key];
      saveSettings(state.settings);
      toggle.classList.toggle('on', state.settings[key]);
      if (key === 'music' && typeof window.naSetMusic === 'function') {
        window.naSetMusic(state.settings.music);
      }
    };
  });
  $('#arcadeSettingsFab')?.addEventListener('click', () => $('#arcadeSettingsModal')?.classList.add('open'));
  $('#arcadeSettingsClose')?.addEventListener('click', () => $('#arcadeSettingsModal')?.classList.remove('open'));
  $('#resetProgressBtn')?.addEventListener('click', () => {
    localStorage.removeItem('na-scores');
    localStorage.removeItem('na-achievements');
    localStorage.removeItem('na-played');
    state.playedGames = new Set();
    renderGamePage();
  });
}

export function initGamePage(gameId = 'tic-tac-toe') {
  currentGameId = gameId;
  state.settings = loadSettings();
  renderGamePage();
  bindSettings();
}
