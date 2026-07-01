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

const GRID_SIZES = [
  ['12', '12 x 12'],
  ['16', '16 x 16'],
  ['20', '20 x 20'],
  ['26', '26 x 26'],
  ['32', '32 x 32']
];

const SPEEDS = [
  ['slow', 'Slow'],
  ['normal', 'Normal'],
  ['fast', 'Fast']
];

const SPEED_MS = { slow: 220, normal: 150, fast: 95 };
const KEY_TO_DIR = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  s: 'down',
  a: 'left',
  d: 'right'
};

const STEP = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 }
};

const OPPOSITE = { up: 'down', down: 'up', left: 'right', right: 'left' };

export function mount(container, api = {}) {
  const playFx = (type) => {
    if (typeof api.playSound === 'function') api.playSound(type);
    else playGameSound(type, api.settings);
  };
  const save = (gameId, field, amount = 1) => {
    if (typeof api.saveScore === 'function') return api.saveScore(gameId, field, amount);
    return bumpScore(gameId, field, amount);
  };

  let gridSize = 16;
  let speed = 'normal';
  let aiMode = 'off';
  let tickId = null;
  let snake = [];
  let food = { x: 0, y: 0 };
  let dir = 'right';
  let pendingDir = 'right';
  let score = 0;
  let gameOver = false;
  let hasBeatenHigh = false;
  let cells = [];
  const highKey = 'na-snake-high-score';
  let highScore = Number(localStorage.getItem(highKey) || 0);

  const status = createStatus('');
  const board = document.createElement('div');
  board.className = 'game-board game-grid';
  board.setAttribute('role', 'grid');
  board.setAttribute('aria-label', 'Snake board');

  const options = document.createElement('div');
  options.className = 'game-options';

  const sizeSelect = createSelect(GRID_SIZES, String(gridSize), (value) => {
    gridSize = Number(value);
    restart();
  });
  const speedSelect = createSelect(SPEEDS, speed, (value) => {
    speed = value;
    restartTicker();
  });
  options.append(
    createOptionRow('Grid', sizeSelect),
    createOptionRow('Speed', speedSelect),
    createAiModeRow(aiMode, (value) => {
      aiMode = value;
    })
  );

  const dpad = document.createElement('div');
  dpad.className = 'game-toolbar snake-dpad';
  [
    ['up', '↑', 'Up'],
    ['left', '←', 'Left'],
    ['down', '↓', 'Down'],
    ['right', '→', 'Right']
  ].forEach(([value, glyph, label]) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `arcade-btn arcade-btn-secondary arcade-btn-shiny snake-dpad-btn snake-dpad-${value}`;
    btn.textContent = glyph;
    btn.setAttribute('aria-label', label);
    btn.addEventListener('click', () => setDirection(value));
    dpad.appendChild(btn);
  });

  const toolbar = createToolbar([
    { label: 'Restart', primary: true, action: () => restart() }
  ]);

  const boardWrap = document.createElement('div');
  boardWrap.className = 'snake-layout';
  boardWrap.append(board, dpad);
  mountShell(container, { options, status, board: boardWrap, toolbar });

  function toIndex(x, y) {
    return y * gridSize + x;
  }

  function isSnakeCell(x, y) {
    return snake.some((part) => part.x === x && part.y === y);
  }

  function placeFood() {
    const openCells = [];
    for (let y = 0; y < gridSize; y += 1) {
      for (let x = 0; x < gridSize; x += 1) {
        if (!isSnakeCell(x, y)) openCells.push({ x, y });
      }
    }
    const shuffled = shuffle(openCells);
    food = shuffled[0] || randPick(openCells) || { x: 0, y: 0 };
  }

  function buildBoard() {
    board.innerHTML = '';
    board.style.display = 'grid';
    board.style.gridTemplateColumns = `repeat(${gridSize}, minmax(0, 1fr))`;
    board.style.gap = '2px';
    board.style.aspectRatio = '1 / 1';
    cells = [];
    for (let i = 0; i < gridSize * gridSize; i += 1) {
      const cell = document.createElement('div');
      cell.className = 'game-cell';
      board.appendChild(cell);
      cells.push(cell);
    }
  }

  function paint() {
    cells.forEach((cell) => {
      cell.className = 'game-cell';
      cell.textContent = '';
    });
    snake.forEach((part, i) => {
      const cell = cells[toIndex(part.x, part.y)];
      if (!cell) return;
      cell.classList.add(i === 0 ? 'snake-head' : 'snake-body');
      if (i === 0) cell.textContent = '●';
    });
    const foodCell = cells[toIndex(food.x, food.y)];
    if (foodCell) {
      foodCell.classList.add('snake-food');
      foodCell.textContent = '◆';
    }
    status.textContent = gameOver
      ? `Game over - score ${score}. High score ${highScore}.`
      : `Score ${score} - High score ${highScore}`;
  }

  function endGame() {
    gameOver = true;
    clearTicker();
    playFx('lose');
    if (score > highScore) {
      const delta = score - highScore;
      highScore = score;
      localStorage.setItem(highKey, String(highScore));
      save('snake', 'highScoreDelta', delta);
      if (!hasBeatenHigh) {
        hasBeatenHigh = true;
        api.onWin?.({ game: 'snake', score, highScore });
      }
      playFx('win');
    }
    paint();
  }

  function pickAiDirection() {
    const head = snake[0];
    const queue = [{ x: head.x, y: head.y, path: [] }];
    const visited = new Set([`${head.x},${head.y}`]);
    const tail = snake[snake.length - 1];

    while (queue.length) {
      const { x, y, path } = queue.shift();
      if (x === food.x && y === food.y) {
        return path[0] || dir;
      }

      Object.entries(STEP).forEach(([nextDir, delta]) => {
        if (path.length === 0 && OPPOSITE[dir] === nextDir && snake.length > 1) return;
        const nx = x + delta.x;
        const ny = y + delta.y;
        const key = `${nx},${ny}`;
        if (nx < 0 || ny < 0 || nx >= gridSize || ny >= gridSize) return;
        if (visited.has(key)) return;
        const isTail = snake.length > 1 && nx === tail.x && ny === tail.y;
        if (isSnakeCell(nx, ny) && !isTail) return;
        visited.add(key);
        queue.push({ x: nx, y: ny, path: [...path, nextDir] });
      });
    }

    const safeDirs = Object.keys(STEP).filter((nextDir) => {
      if (OPPOSITE[dir] === nextDir && snake.length > 1) return false;
      const nx = head.x + STEP[nextDir].x;
      const ny = head.y + STEP[nextDir].y;
      return nx >= 0 && ny >= 0 && nx < gridSize && ny < gridSize && !isSnakeCell(nx, ny);
    });
    return safeDirs.length ? randPick(safeDirs) : dir;
  }

  function step() {
    if (gameOver) return;
    if (aiMode === 'assist') {
      pendingDir = pickAiDirection();
    }
    dir = pendingDir;
    const head = snake[0];
    const next = {
      x: head.x + STEP[dir].x,
      y: head.y + STEP[dir].y
    };

    if (next.x < 0 || next.y < 0 || next.x >= gridSize || next.y >= gridSize) {
      endGame();
      return;
    }

    const hitSelf = snake.some((part) => part.x === next.x && part.y === next.y);
    if (hitSelf) {
      endGame();
      return;
    }

    snake.unshift(next);
    if (next.x === food.x && next.y === food.y) {
      score += 1;
      save('snake', 'foods', 1);
      playFx('eat');
      placeFood();
    } else {
      snake.pop();
    }
    paint();
  }

  function clearTicker() {
    if (tickId) {
      clearInterval(tickId);
      tickId = null;
    }
  }

  function restartTicker() {
    if (gameOver) return;
    clearTicker();
    tickId = window.setInterval(step, SPEED_MS[speed] || SPEED_MS.normal);
  }

  function setDirection(nextDir) {
    if (gameOver) return;
    if (OPPOSITE[dir] === nextDir && snake.length > 1) return;
    if (OPPOSITE[pendingDir] === nextDir && snake.length > 1) return;
    pendingDir = nextDir;
  }

  function restart() {
    gameOver = false;
    hasBeatenHigh = false;
    score = 0;
    dir = 'right';
    pendingDir = 'right';
    const center = Math.floor(gridSize / 2);
    snake = [
      { x: center, y: center },
      { x: center - 1, y: center },
      { x: center - 2, y: center }
    ];
    buildBoard();
    placeFood();
    paint();
    restartTicker();
  }

  function onKeydown(e) {
    const nextDir = KEY_TO_DIR[e.key] || KEY_TO_DIR[e.key.toLowerCase()];
    if (!nextDir) return;
    e.preventDefault();
    setDirection(nextDir);
  }

  window.addEventListener('keydown', onKeydown);
  restart();

  return () => {
    clearTicker();
    window.removeEventListener('keydown', onKeydown);
  };
}
