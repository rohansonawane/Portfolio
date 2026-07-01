import {
  mountShell,
  createToolbar,
  createStatus,
  createOptionRow,
  createSelect,
  createAiModeRow,
  bumpScore,
  playGameSound,
  shuffle
} from '../game-common.js';

const SIZE_OPTIONS = [['15', '15 x 15'], ['21', '21 x 21'], ['27', '27 x 27'], ['35', '35 x 35'], ['43', '43 x 43']];
const DIRS = [
  [0, -2], [2, 0], [0, 2], [-2, 0]
];

function idx(row, col, size) {
  return row * size + col;
}

function inBounds(row, col, size) {
  return row > 0 && row < size - 1 && col > 0 && col < size - 1;
}

function generateMaze(size) {
  const grid = Array(size * size).fill(1);
  const start = [1, 1];
  grid[idx(start[0], start[1], size)] = 0;

  const stack = [start];
  while (stack.length) {
    const [row, col] = stack[stack.length - 1];
    const nextChoices = shuffle(DIRS)
      .map(([dr, dc]) => [row + dr, col + dc, dr, dc])
      .filter(([nr, nc]) => inBounds(nr, nc, size) && grid[idx(nr, nc, size)] === 1);

    if (!nextChoices.length) {
      stack.pop();
      continue;
    }

    const [nr, nc, dr, dc] = nextChoices[0];
    const wallRow = row + dr / 2;
    const wallCol = col + dc / 2;
    grid[idx(wallRow, wallCol, size)] = 0;
    grid[idx(nr, nc, size)] = 0;
    stack.push([nr, nc]);
  }

  const startIndex = idx(1, 1, size);
  const exitIndex = idx(size - 2, size - 2, size);
  grid[startIndex] = 0;
  grid[exitIndex] = 0;
  return { size, grid, startIndex, exitIndex };
}

function safePlay(type, api) {
  if (typeof api.playSound === 'function') api.playSound(type);
  else playGameSound(type, api.settings);
}

function formatSeconds(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function notifyWin(api, state) {
  const payload = {
    gameId: 'doodle-maze',
    size: state.size,
    steps: state.steps,
    seconds: state.seconds
  };
  bumpScore('doodle-maze', 'wins', 1);
  if (typeof api.saveScore === 'function') {
    try { api.saveScore(payload); } catch { /* ignore host callback mismatch */ }
  }
  if (typeof api.onWin === 'function') api.onWin(payload);
}

export function mount(container, api = {}) {
  let aiMode = 'off';
  let aiTimer = null;
  let state = {
    ...generateMaze(15),
    player: idx(1, 1, 15),
    steps: 0,
    won: false,
    startAt: Date.now(),
    seconds: 0,
    timerId: null
  };

  const status = createStatus('Use arrow keys or buttons to reach the exit.');
  const board = document.createElement('div');
  board.className = 'game-board game-grid maze-grid';

  const options = document.createElement('div');
  options.className = 'game-options';
  const sizeSelect = createSelect(SIZE_OPTIONS, '15', (val) => {
    regenerate(Number.parseInt(val, 10));
  });
  options.append(
    createOptionRow('Maze Size', sizeSelect),
    createAiModeRow(aiMode, (value) => {
      aiMode = value;
      syncAiTimer();
    })
  );

  const toolbar = createToolbar([
    {
      label: 'Regenerate',
      action: () => regenerate(state.size)
    },
    {
      label: 'Reset Run',
      action: () => resetPlayer()
    }
  ]);

  const movePad = document.createElement('div');
  movePad.className = 'game-toolbar maze-controls';
  const moves = [
    ['Up', -1, 0],
    ['Left', 0, -1],
    ['Down', 1, 0],
    ['Right', 0, 1]
  ];
  moves.forEach(([label, dr, dc]) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'arcade-btn arcade-btn-secondary arcade-btn-shiny';
    btn.textContent = label;
    btn.addEventListener('click', () => move(dr, dc));
    movePad.appendChild(btn);
  });

  const shell = mountShell(container, { options, status, board, toolbar });
  shell.appendChild(movePad);

  const cells = [];

  function stopTimer() {
    if (!state.timerId) return;
    clearInterval(state.timerId);
    state.timerId = null;
  }

  function startTimer() {
    stopTimer();
    state.startAt = Date.now();
    state.seconds = 0;
    state.timerId = setInterval(() => {
      state.seconds = Math.floor((Date.now() - state.startAt) / 1000);
      renderStatus();
    }, 1000);
  }

  function bfsNextMove() {
    const queue = [state.player];
    const prev = new Map([[state.player, null]]);
    const firstStep = new Map();

    while (queue.length) {
      const cur = queue.shift();
      if (cur === state.exitIndex) {
        let node = cur;
        while (prev.get(node) !== null && prev.get(prev.get(node)) !== null) {
          node = prev.get(node);
        }
        return firstStep.get(node) || null;
      }

      const row = Math.floor(cur / state.size);
      const col = cur % state.size;
      [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dr, dc]) => {
        const nr = row + dr;
        const nc = col + dc;
        if (nr < 0 || nr >= state.size || nc < 0 || nc >= state.size) return;
        const next = idx(nr, nc, state.size);
        if (state.grid[next] === 1 || prev.has(next)) return;
        prev.set(next, cur);
        firstStep.set(next, [dr, dc]);
        queue.push(next);
      });
    }
    return null;
  }

  function syncAiTimer() {
    if (aiTimer) {
      clearInterval(aiTimer);
      aiTimer = null;
    }
    if (aiMode === 'assist' && !state.won) {
      aiTimer = window.setInterval(() => {
        const step = bfsNextMove();
        if (step) move(step[0], step[1]);
      }, 650);
    }
  }

  function resetPlayer() {
    state.player = state.startIndex;
    state.steps = 0;
    state.won = false;
    startTimer();
    render();
    renderStatus();
    syncAiTimer();
  }

  function regenerate(size) {
    state = {
      ...generateMaze(size),
      player: idx(1, 1, size),
      steps: 0,
      won: false,
      startAt: Date.now(),
      seconds: 0,
      timerId: state.timerId
    };
    board.style.gridTemplateColumns = `repeat(${state.size}, minmax(0, 1fr))`;
    buildBoard();
    resetPlayer();
    status.textContent = `New ${size}x${size} maze generated.`;
  }

  function renderStatus() {
    status.textContent = state.won
      ? `Escaped in ${state.steps} steps · ${formatSeconds(state.seconds)}`
      : `Steps: ${state.steps} · Time: ${formatSeconds(state.seconds)}`;
  }

  function cellAt(indexValue) {
    return cells[indexValue];
  }

  function move(dr, dc) {
    if (state.won) return;
    const row = Math.floor(state.player / state.size);
    const col = state.player % state.size;
    const nr = row + dr;
    const nc = col + dc;
    if (nr < 0 || nr >= state.size || nc < 0 || nc >= state.size) return;
    const next = idx(nr, nc, state.size);
    if (state.grid[next] === 1) return;
    state.player = next;
    state.steps += 1;
    safePlay('tap', api);
    if (state.player === state.exitIndex) {
      state.won = true;
      stopTimer();
      safePlay('win', api);
      notifyWin(api, state);
    }
    render();
    renderStatus();
  }

  function buildBoard() {
    board.replaceChildren();
    cells.length = 0;
    for (let i = 0; i < state.grid.length; i += 1) {
      const cell = document.createElement('div');
      cell.className = 'game-cell maze-cell';
      board.appendChild(cell);
      cells.push(cell);
    }
    render();
  }

  function render() {
    state.grid.forEach((value, i) => {
      const cell = cellAt(i);
      cell.className = 'game-cell maze-cell';
      if (value === 1) cell.classList.add('is-wall');
      else cell.classList.add('is-path');
      if (i === state.startIndex) cell.classList.add('is-start');
      if (i === state.exitIndex) cell.classList.add('is-exit');
      if (i === state.player) cell.classList.add('is-player');
    });
  }

  const onKeyDown = (event) => {
    if (event.key === 'ArrowUp') { event.preventDefault(); move(-1, 0); }
    else if (event.key === 'ArrowDown') { event.preventDefault(); move(1, 0); }
    else if (event.key === 'ArrowLeft') { event.preventDefault(); move(0, -1); }
    else if (event.key === 'ArrowRight') { event.preventDefault(); move(0, 1); }
  };

  window.addEventListener('keydown', onKeyDown);
  board.style.gridTemplateColumns = `repeat(${state.size}, minmax(0, 1fr))`;
  buildBoard();
  resetPlayer();

  return () => {
    stopTimer();
    if (aiTimer) clearInterval(aiTimer);
    window.removeEventListener('keydown', onKeyDown);
    container.replaceChildren();
  };
}
