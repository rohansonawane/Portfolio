import {
  mountShell,
  createToolbar,
  createStatus,
  createOptionRow,
  createSelect,
  bumpScore,
  playGameSound,
  randPick,
  shuffle
} from '../game-common.js';

const COLS = 7;
const ROWS = 6;
const MODES = [
  ['cpu', 'Vs CPU'],
  ['2p', '2 Players']
];
const DIFFICULTIES = [
  ['easy', 'Easy'],
  ['medium', 'Medium'],
  ['hard', 'Hard']
];
const TOKENS = { R: 'Red', Y: 'Yellow' };

export function mount(container, api = {}) {
  const playFx = (type) => {
    if (typeof api.playSound === 'function') api.playSound(type);
    else playGameSound(type, api.settings);
  };
  const save = (gameId, field, amount = 1) => {
    if (typeof api.saveScore === 'function') return api.saveScore(gameId, field, amount);
    return bumpScore(gameId, field, amount);
  };

  let mode = 'cpu';
  let difficulty = 'medium';
  let boardState = makeBoard();
  let current = 'R';
  let gameOver = false;
  let thinkingId = null;
  let cells = [];

  const status = createStatus('');
  const board = document.createElement('div');
  board.className = 'game-board game-grid';
  board.style.display = 'grid';
  board.style.gridTemplateColumns = `repeat(${COLS}, minmax(0, 1fr))`;
  board.style.gap = '4px';
  board.setAttribute('role', 'grid');
  board.setAttribute('aria-label', 'Drop Dots board');

  const options = document.createElement('div');
  options.className = 'game-options';
  const modeSelect = createSelect(MODES, mode, (value) => {
    mode = value;
    restart();
  });
  const diffSelect = createSelect(DIFFICULTIES, difficulty, (value) => {
    difficulty = value;
    restart();
  });
  options.append(
    createOptionRow('Mode', modeSelect),
    createOptionRow('Difficulty', diffSelect)
  );

  const toolbar = createToolbar([
    { label: 'Restart', primary: true, action: () => restart() }
  ]);

  mountShell(container, { options, status, board, toolbar });

  function makeBoard() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(''));
  }

  function clearCpuTimer() {
    if (thinkingId) {
      clearTimeout(thinkingId);
      thinkingId = null;
    }
  }

  function getAvailableRow(col, state = boardState) {
    for (let row = ROWS - 1; row >= 0; row -= 1) {
      if (!state[row][col]) return row;
    }
    return -1;
  }

  function canPlay(col, state = boardState) {
    return state[0][col] === '';
  }

  function checkDirection(row, col, token, dRow, dCol, state = boardState) {
    let count = 0;
    let r = row + dRow;
    let c = col + dCol;
    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && state[r][c] === token) {
      count += 1;
      r += dRow;
      c += dCol;
    }
    return count;
  }

  function checkWinAt(row, col, token, state = boardState) {
    const dirs = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1]
    ];
    return dirs.some(([dRow, dCol]) => {
      const line =
        1
        + checkDirection(row, col, token, dRow, dCol, state)
        + checkDirection(row, col, token, -dRow, -dCol, state);
      return line >= 4;
    });
  }

  function isDraw(state = boardState) {
    return state[0].every(Boolean);
  }

  function boardMessage() {
    if (gameOver) return status.textContent;
    if (mode === 'cpu' && current === 'Y') return 'CPU thinking...';
    return `${TOKENS[current]} to play`;
  }

  function paint() {
    cells.forEach((cell) => {
      const row = Number(cell.dataset.row);
      const col = Number(cell.dataset.col);
      const token = boardState[row][col];
      cell.className = 'game-cell';
      cell.textContent = '';
      if (token) {
        cell.classList.add(token === 'R' ? 'token-red' : 'token-yellow');
        cell.textContent = '●';
      }
      cell.disabled = gameOver || (mode === 'cpu' && current === 'Y');
      if (!token && !gameOver) {
        const canDrop = getAvailableRow(col) >= 0;
        cell.classList.toggle('playable', canDrop);
      }
    });
    if (!gameOver) status.textContent = boardMessage();
  }

  function finishGame(message, winnerToken = '') {
    gameOver = true;
    clearCpuTimer();
    status.textContent = message;
    if (!winnerToken) {
      playFx('tap');
      paint();
      return;
    }
    playFx('win');
    if (winnerToken === 'R') save('drop-dots', 'redWins', 1);
    else save('drop-dots', 'yellowWins', 1);
    if (mode === 'cpu' && winnerToken === 'R') {
      save('drop-dots', 'cpuBeaten', 1);
      api.onWin?.({ game: 'drop-dots', winner: 'player' });
    }
    paint();
  }

  function drop(col, token = current) {
    const row = getAvailableRow(col);
    if (row < 0 || gameOver) return false;
    boardState[row][col] = token;
    playFx('tap');
    save('drop-dots', 'moves', 1);
    const won = checkWinAt(row, col, token);
    if (won) {
      finishGame(`${TOKENS[token]} wins!`, token);
      return true;
    }
    if (isDraw()) {
      finishGame('Draw game!');
      return true;
    }
    current = token === 'R' ? 'Y' : 'R';
    paint();
    return true;
  }

  function cpuMove() {
    if (gameOver || mode !== 'cpu' || current !== 'Y') return;
    let col;
    if (difficulty === 'hard') col = pickHardMove();
    else if (difficulty === 'medium') col = pickMediumMove();
    else col = pickEasyMove();
    if (typeof col === 'number') drop(col, 'Y');
    if (!gameOver) paint();
  }

  function pickEasyMove() {
    const choices = [...Array(COLS).keys()].filter((col) => canPlay(col));
    return randPick(choices);
  }

  function pickMediumMove() {
    // Win or block, otherwise a random legal column (no positional planning).
    const playable = shuffle([...Array(COLS).keys()].filter((col) => canPlay(col)));
    for (const col of playable) {
      if (simulateWin(col, 'Y')) return col;
    }
    for (const col of playable) {
      if (simulateWin(col, 'R')) return col;
    }
    return playable[0];
  }

  function simulateWin(col, token) {
    const row = getAvailableRow(col);
    if (row < 0) return false;
    const clone = boardState.map((r) => [...r]);
    clone[row][col] = token;
    return checkWinAt(row, col, token, clone);
  }

  function pickHardMove() {
    const playable = shuffle([...Array(COLS).keys()].filter((col) => canPlay(col)));
    for (const col of playable) {
      if (simulateWin(col, 'Y')) return col;
    }
    for (const col of playable) {
      if (simulateWin(col, 'R')) return col;
    }
    const preferred = [3, 2, 4, 1, 5, 0, 6];
    const firstOpen = preferred.find((col) => canPlay(col));
    return typeof firstOpen === 'number' ? firstOpen : playable[0];
  }

  function maybeCpuTurn() {
    clearCpuTimer();
    if (gameOver || mode !== 'cpu' || current !== 'Y') return;
    status.textContent = boardMessage();
    thinkingId = window.setTimeout(cpuMove, 320);
  }

  function onCellClick(event) {
    if (gameOver) return;
    if (mode === 'cpu' && current === 'Y') return;
    const cell = event.target.closest('.game-cell');
    if (!cell) return;
    const col = Number(cell.dataset.col);
    if (!Number.isInteger(col)) return;
    if (!drop(col, current)) return;
    maybeCpuTurn();
  }

  function buildGrid() {
    board.innerHTML = '';
    cells = [];
    for (let row = 0; row < ROWS; row += 1) {
      for (let col = 0; col < COLS; col += 1) {
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'game-cell';
        cell.dataset.row = String(row);
        cell.dataset.col = String(col);
        cell.setAttribute('aria-label', `Column ${col + 1}, row ${row + 1}`);
        board.appendChild(cell);
        cells.push(cell);
      }
    }
  }

  function restart() {
    clearCpuTimer();
    boardState = makeBoard();
    current = 'R';
    gameOver = false;
    paint();
    maybeCpuTurn();
  }

  board.addEventListener('click', onCellClick);
  buildGrid();
  restart();

  return () => {
    clearCpuTimer();
    board.removeEventListener('click', onCellClick);
  };
}
