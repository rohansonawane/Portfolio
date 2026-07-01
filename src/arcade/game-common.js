import { loadScores, saveScores } from './data.js';

export function playGameSound(type, settings) {
  if (!settings?.sound) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const freq = { tap: 440, win: 660, lose: 220, flag: 520, eat: 580, hit: 180 }[type] || 440;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
    osc.start();
    osc.stop(ctx.currentTime + 0.14);
  } catch { /* ignore */ }
}

export function bumpScore(gameId, field = 'wins', amount = 1) {
  const scores = loadScores();
  if (!scores[gameId]) scores[gameId] = {};
  scores[gameId][field] = (scores[gameId][field] || 0) + amount;
  saveScores(scores);
  return scores[gameId];
}

export function getGameScore(gameId) {
  return loadScores()[gameId] || {};
}

export function createToolbar(buttons) {
  const bar = document.createElement('div');
  bar.className = 'game-toolbar';
  buttons.forEach(({ label, action, primary, disabled }) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `arcade-btn arcade-btn-shiny ${primary ? 'arcade-btn-primary' : 'arcade-btn-secondary'}`;
    btn.textContent = label;
    btn.disabled = Boolean(disabled);
    btn.addEventListener('click', action);
    bar.appendChild(btn);
  });
  return bar;
}

export function createStatus(text = '') {
  const el = document.createElement('div');
  el.className = 'game-status';
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');
  el.textContent = text;
  return el;
}

export function createOptionRow(label, control) {
  const row = document.createElement('label');
  row.className = 'game-option-row';
  const span = document.createElement('span');
  span.textContent = label;
  row.append(span, control);
  return row;
}

export const AI_MODE_OPTIONS = [
  ['off', 'Off'],
  ['assist', 'AI Assist']
];

export const PLAYER_MODE_OPTIONS = [
  ['2p', '2 Players'],
  ['cpu', 'Vs CPU']
];

export const CPU_DIFFICULTY_OPTIONS = [
  ['easy', 'Easy'],
  ['medium', 'Medium'],
  ['hard', 'Hard']
];

export function createAiModeRow(value, onChange) {
  return createOptionRow('AI', createSelect(AI_MODE_OPTIONS, value, onChange));
}

export function createPlayerModeRow(value, onChange) {
  return createOptionRow('Mode', createSelect(PLAYER_MODE_OPTIONS, value, onChange));
}

export function createSelect(options, value, onChange) {
  const sel = document.createElement('select');
  sel.className = 'game-select';
  options.forEach(([val, text]) => {
    const opt = document.createElement('option');
    opt.value = val;
    opt.textContent = text;
    opt.selected = val === value;
    sel.appendChild(opt);
  });
  sel.addEventListener('change', () => onChange(sel.value));
  return sel;
}

export function mountShell(container, { status, board, toolbar, options }) {
  container.replaceChildren();
  const wrap = document.createElement('div');
  wrap.className = 'game-shell';
  if (options) wrap.appendChild(options);
  if (status) wrap.appendChild(status);
  if (board) wrap.appendChild(board);
  if (toolbar) wrap.appendChild(toolbar);
  container.appendChild(wrap);
  return wrap;
}

export function randPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
