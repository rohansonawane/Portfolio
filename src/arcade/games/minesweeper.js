import {
  mountShell,
  createToolbar,
  createStatus,
  createOptionRow,
  createSelect,
  createAiModeRow,
  bumpScore,
  playGameSound,
  shuffle,
  randPick
} from '../game-common.js';

let SIZE = 9;
const SIZE_OPTIONS = [['9', '9 x 9'], ['12', '12 x 12'], ['16', '16 x 16'], ['20', '20 x 20']];
const DIFFICULTY_DENSITY = { easy: 0.12, medium: 0.16, hard: 0.21 };
const DIRS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1]
];

function idxToRowCol(idx) {
  return [Math.floor(idx / SIZE), idx % SIZE];
}

function rowColToIdx(row, col) {
  return row * SIZE + col;
}

function inBounds(row, col) {
  return row >= 0 && row < SIZE && col >= 0 && col < SIZE;
}

function makeState(difficulty) {
  const density = DIFFICULTY_DENSITY[difficulty] ?? DIFFICULTY_DENSITY.easy;
  return {
    difficulty,
    mineCount: Math.max(1, Math.round(density * SIZE * SIZE)),
    mines: new Set(),
    flagged: new Set(),
    revealed: new Set(),
    exploded: -1,
    startedAt: 0,
    elapsedMs: 0,
    timerId: null,
    firstClick: true,
    over: false,
    won: false
  };
}

function safePlay(type, api) {
  if (typeof api.playSound === 'function') api.playSound(type);
  else playGameSound(type, api.settings);
}

function neighborsOf(idx) {
  const [row, col] = idxToRowCol(idx);
  const result = [];
  DIRS.forEach(([dr, dc]) => {
    const nr = row + dr;
    const nc = col + dc;
    if (inBounds(nr, nc)) result.push(rowColToIdx(nr, nc));
  });
  return result;
}

function placeMines(state, safeIndex) {
  const available = [];
  for (let i = 0; i < SIZE * SIZE; i += 1) {
    if (i !== safeIndex) available.push(i);
  }
  const picks = shuffle(available).slice(0, state.mineCount);
  state.mines = new Set(picks);
}

function adjacentMineCount(state, idx) {
  let count = 0;
  neighborsOf(idx).forEach((n) => {
    if (state.mines.has(n)) count += 1;
  });
  return count;
}

function revealFlood(state, start) {
  const queue = [start];
  while (queue.length) {
    const idx = queue.shift();
    if (state.revealed.has(idx) || state.flagged.has(idx)) continue;
    state.revealed.add(idx);
    if (adjacentMineCount(state, idx) !== 0) continue;
    neighborsOf(idx).forEach((n) => {
      if (!state.revealed.has(n) && !state.mines.has(n)) queue.push(n);
    });
  }
}

function stopTimer(state) {
  if (state.timerId) {
    clearInterval(state.timerId);
    state.timerId = null;
  }
}

function startTimer(state, onTick) {
  if (state.timerId) return;
  state.startedAt = Date.now();
  state.timerId = setInterval(() => {
    state.elapsedMs = Date.now() - state.startedAt;
    onTick();
  }, 250);
}

function formatTime(ms) {
  const sec = Math.floor(ms / 1000);
  const min = Math.floor(sec / 60);
  const rem = sec % 60;
  return `${String(min).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
}

function maybeWin(state) {
  const safeCells = SIZE * SIZE - state.mineCount;
  return state.revealed.size >= safeCells;
}

function notifyWin(api, state) {
  const payload = {
    gameId: 'landmines',
    difficulty: state.difficulty,
    elapsedMs: state.elapsedMs,
    revealed: state.revealed.size
  };
  bumpScore('landmines', 'wins', 1);
  if (typeof api.saveScore === 'function') {
    try { api.saveScore(payload); } catch { /* ignore host callback mismatch */ }
  }
  if (typeof api.onWin === 'function') api.onWin(payload);
}

export function mount(container, api = {}) {
  let state = makeState('easy');
  let aiMode = 'off';
  let aiTimer = null;
  const holdTimers = new Map();

  const status = createStatus('Reveal all safe tiles. Right-click or long-press to flag.');
  const board = document.createElement('div');
  board.className = 'game-board game-grid minesweeper-grid';
  board.style.gridTemplateColumns = `repeat(${SIZE}, minmax(0, 1fr))`;

  const options = document.createElement('div');
  options.className = 'game-options';
  const sizeSelect = createSelect(
    SIZE_OPTIONS,
    String(SIZE),
    (value) => {
      SIZE = Number(value);
      reset(state.difficulty);
      buildCells();
      status.textContent = `Board set to ${SIZE} x ${SIZE}.`;
      render();
    }
  );
  const diffSelect = createSelect(
    [['easy', 'Easy'], ['medium', 'Medium'], ['hard', 'Hard']],
    state.difficulty,
    (value) => {
      reset(value);
      status.textContent = `Difficulty set to ${value}.`;
      render();
    }
  );
  options.append(
    createOptionRow('Grid', sizeSelect),
    createOptionRow('Mines', diffSelect),
    createAiModeRow(aiMode, (value) => {
      aiMode = value;
      syncAiTimer();
    })
  );

  function aiRevealStep() {
    if (state.over) return;
    if (state.firstClick) {
      const hidden = Array.from({ length: SIZE * SIZE }, (_, i) => i)
        .filter((i) => !state.revealed.has(i) && !state.flagged.has(i));
      if (hidden.length) reveal(randPick(hidden));
      return;
    }
    for (const idx of state.revealed) {
      const count = adjacentMineCount(state, idx);
      const hiddenNeighbors = neighborsOf(idx).filter((n) => !state.revealed.has(n) && !state.flagged.has(n));
      if (count > 0 && hiddenNeighbors.length === count) {
        hiddenNeighbors.forEach((n) => reveal(n));
        return;
      }
    }
    for (const idx of state.revealed) {
      const hiddenNeighbors = neighborsOf(idx).filter((n) => !state.revealed.has(n) && !state.flagged.has(n));
      if (hiddenNeighbors.length) {
        reveal(hiddenNeighbors[0]);
        return;
      }
    }
  }

  function syncAiTimer() {
    if (aiTimer) {
      clearInterval(aiTimer);
      aiTimer = null;
    }
    if (aiMode === 'assist' && !state.over) {
      aiTimer = window.setInterval(() => aiRevealStep(), 1400);
    }
  }

  const toolbar = createToolbar([
    {
      label: 'Restart',
      action: () => {
        reset(state.difficulty);
        status.textContent = 'Board reset.';
        render();
      }
    },
    {
      label: 'Auto Reveal',
      action: () => {
        if (state.over) return;
        const target = Array.from(state.revealed).find((idx) => adjacentMineCount(state, idx) === 0);
        if (typeof target === 'number') {
          revealFlood(state, target);
          safePlay('tap', api);
          evaluateState();
          render();
        }
      }
    }
  ]);

  let cells = [];
  function buildCells() {
    board.style.gridTemplateColumns = `repeat(${SIZE}, minmax(0, 1fr))`;
    board.replaceChildren();
    cells = [];
    for (let i = 0; i < SIZE * SIZE; i += 1) {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'game-cell minesweeper-cell';
      cell.dataset.index = String(i);

      cell.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        toggleFlag(i);
      });

      cell.addEventListener('pointerdown', (event) => {
        if (event.button !== 0) return;
        const timerId = setTimeout(() => {
          toggleFlag(i);
          holdTimers.delete(i);
        }, 450);
        holdTimers.set(i, timerId);
      });
      cell.addEventListener('pointerup', () => {
        const timerId = holdTimers.get(i);
        if (!timerId) return;
        clearTimeout(timerId);
        holdTimers.delete(i);
        reveal(i);
      });
      cell.addEventListener('pointerleave', () => {
        const timerId = holdTimers.get(i);
        if (!timerId) return;
        clearTimeout(timerId);
        holdTimers.delete(i);
      });
      cell.addEventListener('click', () => {
        reveal(i);
      });

      board.appendChild(cell);
      cells.push(cell);
    }
  }
  buildCells();

  mountShell(container, { options, status, board, toolbar });

  function reset(difficulty) {
    stopTimer(state);
    state = makeState(difficulty);
    syncAiTimer();
  }

  function ensureStarted(firstIndex) {
    if (!state.firstClick) return;
    state.firstClick = false;
    placeMines(state, firstIndex);
    startTimer(state, render);
  }

  function toggleFlag(idx) {
    if (state.over || state.revealed.has(idx)) return;
    if (state.flagged.has(idx)) state.flagged.delete(idx);
    else if (state.flagged.size < state.mineCount) state.flagged.add(idx);
    safePlay('flag', api);
    render();
  }

  function reveal(idx) {
    if (state.over || state.flagged.has(idx) || state.revealed.has(idx)) return;
    ensureStarted(idx);
    if (state.mines.has(idx)) {
      state.exploded = idx;
      state.over = true;
      state.won = false;
      stopTimer(state);
      safePlay('lose', api);
      status.textContent = 'Boom! You hit a mine.';
      render();
      return;
    }
    revealFlood(state, idx);
    safePlay('tap', api);
    evaluateState();
    render();
  }

  function evaluateState() {
    if (!maybeWin(state) || state.over) return;
    state.over = true;
    state.won = true;
    stopTimer(state);
    status.textContent = `Cleared! Time ${formatTime(state.elapsedMs)}.`;
    safePlay('win', api);
    notifyWin(api, state);
  }

  function render() {
    const minesLeft = Math.max(0, state.mineCount - state.flagged.size);
    if (!state.over) {
      status.textContent = `Mines left: ${minesLeft} · Time ${formatTime(state.elapsedMs)}`;
    }
    cells.forEach((cell, idx) => {
      const isRevealed = state.revealed.has(idx);
      const isFlagged = state.flagged.has(idx);
      const isMine = state.mines.has(idx);
      const count = adjacentMineCount(state, idx);

      cell.className = 'game-cell minesweeper-cell';
      cell.disabled = state.over && !isFlagged;
      cell.textContent = '';

      if (isRevealed) {
        cell.classList.add('is-revealed');
        if (count > 0) {
          cell.textContent = String(count);
          cell.dataset.count = String(count);
        }
      } else if (isFlagged) {
        cell.textContent = '🚩';
        cell.classList.add('is-flagged');
      }

      if (state.over && isMine) {
        cell.textContent = '💣';
        cell.classList.add('is-mine');
      }
      if (state.exploded === idx) cell.classList.add('is-exploded');
    });
  }

  render();
  syncAiTimer();
  return () => {
    holdTimers.forEach((id) => clearTimeout(id));
    if (aiTimer) clearInterval(aiTimer);
    stopTimer(state);
    container.replaceChildren();
  };
}
