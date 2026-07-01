import {
  mountShell,
  createToolbar,
  createStatus,
  createOptionRow,
  createSelect,
  createAiModeRow,
  bumpScore,
  playGameSound,
  randPick,
  shuffle
} from '../game-common.js';

const SIZE = 12;
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DIRECTIONS = [
  [1, 0], [0, 1], [1, 1], [-1, 1],
  [-1, 0], [0, -1], [-1, -1], [1, -1]
];

const THEMES = {
  school: ['PENCIL', 'ERASER', 'NOTEBOOK', 'BACKPACK', 'LIBRARY', 'CHALK', 'MARKER', 'RULER', 'HOMEWORK', 'CLASSROOM'],
  tech: ['CODING', 'KEYBOARD', 'BROWSER', 'SERVER', 'JAVASCRIPT', 'ALGORITHM', 'TERMINAL', 'DATABASE', 'NETWORK', 'DEBUGGER'],
  nature: ['FOREST', 'RIVER', 'MOUNTAIN', 'MEADOW', 'THUNDER', 'BLOSSOM', 'OCEAN', 'SUNLIGHT', 'BREEZE', 'WILDLIFE']
};

const THEME_ORDER = ['school', 'tech', 'nature'];
let themeCursor = 0;

function indexOf(row, col) {
  return row * SIZE + col;
}

function rowCol(index) {
  return [Math.floor(index / SIZE), index % SIZE];
}

function inBounds(row, col) {
  return row >= 0 && row < SIZE && col >= 0 && col < SIZE;
}

function safePlay(type, api) {
  if (typeof api.playSound === 'function') api.playSound(type);
  else playGameSound(type, api.settings);
}

function nextTheme(current) {
  if (current && THEME_ORDER.includes(current)) {
    themeCursor = (THEME_ORDER.indexOf(current) + 1) % THEME_ORDER.length;
  }
  const theme = THEME_ORDER[themeCursor];
  themeCursor = (themeCursor + 1) % THEME_ORDER.length;
  return theme;
}

function generateBoard(themeName) {
  const words = shuffle(THEMES[themeName]).slice(0, 8);
  const grid = Array(SIZE * SIZE).fill('');
  const placements = new Map();

  const tryPlaceWord = (word) => {
    for (let attempt = 0; attempt < 200; attempt += 1) {
      const [dr, dc] = randPick(DIRECTIONS);
      const startRow = Math.floor(Math.random() * SIZE);
      const startCol = Math.floor(Math.random() * SIZE);
      const endRow = startRow + dr * (word.length - 1);
      const endCol = startCol + dc * (word.length - 1);
      if (!inBounds(endRow, endCol)) continue;

      const path = [];
      let fits = true;
      for (let i = 0; i < word.length; i += 1) {
        const row = startRow + dr * i;
        const col = startCol + dc * i;
        const target = indexOf(row, col);
        if (grid[target] && grid[target] !== word[i]) {
          fits = false;
          break;
        }
        path.push(target);
      }
      if (!fits) continue;
      path.forEach((target, i) => { grid[target] = word[i]; });
      placements.set(word, path);
      return true;
    }
    return false;
  };

  words.forEach((word) => {
    if (!tryPlaceWord(word)) {
      // Fallback to force placement to keep exactly 8 target words.
      const row = Math.floor(Math.random() * SIZE);
      const col = 0;
      const clipped = word.slice(0, Math.min(word.length, SIZE));
      const path = [];
      clipped.split('').forEach((ch, i) => {
        const target = indexOf(row, col + i);
        grid[target] = ch;
        path.push(target);
      });
      placements.set(word, path);
    }
  });

  for (let i = 0; i < grid.length; i += 1) {
    if (!grid[i]) grid[i] = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }

  return {
    theme: themeName,
    words,
    grid,
    placements
  };
}

function pathFromEndpoints(start, end) {
  if (start < 0 || end < 0) return [];
  const [sr, sc] = rowCol(start);
  const [er, ec] = rowCol(end);
  const dRow = er - sr;
  const dCol = ec - sc;
  const rowStep = dRow === 0 ? 0 : dRow / Math.abs(dRow);
  const colStep = dCol === 0 ? 0 : dCol / Math.abs(dCol);
  const straight = dRow === 0 || dCol === 0 || Math.abs(dRow) === Math.abs(dCol);
  if (!straight) return [];
  const len = Math.max(Math.abs(dRow), Math.abs(dCol)) + 1;
  const path = [];
  for (let i = 0; i < len; i += 1) {
    const row = sr + rowStep * i;
    const col = sc + colStep * i;
    if (!inBounds(row, col)) return [];
    path.push(indexOf(row, col));
  }
  return path;
}

function samePath(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function reversePath(path) {
  return [...path].reverse();
}

function notifyWin(api, state) {
  const payload = {
    gameId: 'word-search',
    theme: state.theme,
    foundWords: state.foundWords.size
  };
  bumpScore('word-search', 'wins', 1);
  if (typeof api.saveScore === 'function') {
    try { api.saveScore(payload); } catch { /* ignore host callback mismatch */ }
  }
  if (typeof api.onWin === 'function') api.onWin(payload);
}

export function mount(container, api = {}) {
  let aiMode = 'off';
  let aiTimer = null;
  let state = {
    ...generateBoard(nextTheme()),
    foundWords: new Set(),
    selectionStart: -1,
    selectionEnd: -1,
    preview: []
  };

  const status = createStatus('Drag to select letters, or click start then end.');
  const board = document.createElement('div');
  board.className = 'game-board game-grid word-search-grid';
  board.style.gridTemplateColumns = `repeat(${SIZE}, minmax(22px, 1fr))`;

  const options = document.createElement('div');
  options.className = 'game-options';
  const themeSelect = createSelect(
    [['school', 'School'], ['tech', 'Tech'], ['nature', 'Nature']],
    state.theme,
    (theme) => {
      state = {
        ...generateBoard(theme),
        foundWords: new Set(),
        selectionStart: -1,
        selectionEnd: -1,
        preview: []
      };
      status.textContent = `${theme} theme loaded.`;
      buildWordList();
      syncAiTimer();
      render();
    }
  );
  options.append(
    createOptionRow('Theme', themeSelect),
    createAiModeRow(aiMode, (value) => {
      aiMode = value;
      syncAiTimer();
    })
  );

  function showHint() {
    const remaining = state.words.filter((word) => !state.foundWords.has(word));
    if (!remaining.length) {
      status.textContent = 'All words found.';
      return;
    }
    const word = randPick(remaining);
    const firstCell = state.placements.get(word)?.[0];
    if (typeof firstCell !== 'number') return;
    status.textContent = `Hint: ${word} starts at a highlighted tile.`;
    safePlay('tap', api);
    const cell = cells[firstCell];
    if (cell) {
      cell.classList.add('is-hint');
      setTimeout(() => cell.classList.remove('is-hint'), 900);
    }
  }

  function syncAiTimer() {
    if (aiTimer) {
      clearInterval(aiTimer);
      aiTimer = null;
    }
    if (aiMode === 'assist' && state.foundWords.size < state.words.length) {
      aiTimer = window.setInterval(() => showHint(), 15000);
    }
  }

  const toolbar = createToolbar([
    {
      label: 'Hint',
      action: () => showHint()
    },
    {
      label: 'New Puzzle',
      action: () => {
        state = {
          ...generateBoard(nextTheme(state.theme)),
          foundWords: new Set(),
          selectionStart: -1,
          selectionEnd: -1,
          preview: []
        };
        themeSelect.value = state.theme;
        status.textContent = 'New puzzle generated.';
        buildWordList();
        syncAiTimer();
        render();
      }
    }
  ]);

  const wordList = document.createElement('ul');
  wordList.className = 'game-word-list';

  const cells = [];
  for (let i = 0; i < SIZE * SIZE; i += 1) {
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'game-cell word-search-cell';
    cell.dataset.index = String(i);

    cell.addEventListener('pointerdown', () => {
      state.selectionStart = i;
      state.selectionEnd = i;
      state.preview = [i];
      render();
    });
    cell.addEventListener('pointerenter', () => {
      if (state.selectionStart < 0) return;
      state.selectionEnd = i;
      state.preview = pathFromEndpoints(state.selectionStart, state.selectionEnd);
      render();
    });
    cell.addEventListener('pointerup', () => {
      finalizeSelection(i);
    });
    cell.addEventListener('click', () => {
      if (state.selectionStart < 0) {
        state.selectionStart = i;
        state.selectionEnd = i;
        state.preview = [i];
        status.textContent = 'Choose an end tile.';
      } else if (state.selectionStart === i) {
        state.selectionStart = -1;
        state.selectionEnd = -1;
        state.preview = [];
        status.textContent = 'Selection cleared.';
      } else {
        finalizeSelection(i);
      }
      render();
    });

    board.appendChild(cell);
    cells.push(cell);
  }

  const shell = mountShell(container, { options, status, board, toolbar });
  shell.appendChild(wordList);

  function clearSelection() {
    state.selectionStart = -1;
    state.selectionEnd = -1;
    state.preview = [];
  }

  function finalizeSelection(endIndex) {
    if (state.selectionStart < 0) return;
    state.selectionEnd = endIndex;
    const path = pathFromEndpoints(state.selectionStart, state.selectionEnd);
    if (!path.length) {
      status.textContent = 'Select a straight line (horizontal, vertical, diagonal).';
      clearSelection();
      render();
      return;
    }

    const matchedWord = state.words.find((word) => {
      if (state.foundWords.has(word)) return false;
      const wordPath = state.placements.get(word) || [];
      return samePath(wordPath, path) || samePath(reversePath(wordPath), path);
    });

    if (!matchedWord) {
      status.textContent = 'No word on that path.';
      safePlay('hit', api);
      clearSelection();
      render();
      return;
    }

    state.foundWords.add(matchedWord);
    safePlay('eat', api);
    status.textContent = `Found ${matchedWord}!`;
    clearSelection();
    buildWordList();
    if (state.foundWords.size === state.words.length) {
      status.textContent = `Great job! ${state.theme} puzzle solved.`;
      safePlay('win', api);
      notifyWin(api, state);
    }
    render();
  }

  function buildWordList() {
    wordList.innerHTML = '';
    state.words.forEach((word) => {
      const item = document.createElement('li');
      item.className = 'game-word-item';
      item.textContent = word;
      if (state.foundWords.has(word)) item.classList.add('is-found');
      wordList.appendChild(item);
    });
  }

  function render() {
    const foundCells = new Map();
    state.foundWords.forEach((word) => {
      const path = state.placements.get(word) || [];
      path.forEach((index) => foundCells.set(index, word));
    });

    cells.forEach((cell, i) => {
      cell.className = 'game-cell word-search-cell';
      cell.textContent = state.grid[i];
      if (foundCells.has(i)) {
        cell.classList.add('is-found');
        cell.dataset.word = foundCells.get(i);
      }
      if (state.preview.includes(i)) cell.classList.add('is-preview');
      if (state.selectionStart === i) cell.classList.add('is-selected');
    });
  }

  buildWordList();
  render();
  syncAiTimer();
  return () => {
    if (aiTimer) clearInterval(aiTimer);
    container.replaceChildren();
  };
}
