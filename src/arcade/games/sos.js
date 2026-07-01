import {
  createOptionRow,
  createSelect,
  createStatus,
  createToolbar,
  mountShell,
  playGameSound,
  bumpScore,
  randPick
} from '../game-common.js';

const PLAYERS = ['Player 1', 'Player 2'];
const SIZE_OPTIONS = [
  ['6', '6 x 6'],
  ['7', '7 x 7'],
  ['9', '9 x 9'],
  ['11', '11 x 11'],
  ['13', '13 x 13']
];
const MODES = [
  ['2p', '2 Players'],
  ['cpu', 'Vs CPU']
];
const DIFFICULTIES = [
  ['easy', 'Easy'],
  ['medium', 'Medium'],
  ['hard', 'Hard']
];
const DIRS = [
  [0, 1],
  [1, 0],
  [1, 1],
  [1, -1]
];
const CPU_PLAYER = 1;
const SVG_NS = 'http://www.w3.org/2000/svg';

function lineKey(cells) {
  return cells.map(([r, c]) => `${r},${c}`).join('-');
}

export function mount(container, api = {}) {
  let size = 7;
  let boardState = createBoard();
  let turn = 0;
  let letter = 'S';
  let gameOver = false;
  let scores = [0, 0];
  let mode = '2p';
  let difficulty = 'medium';
  let completedLines = [];
  let completedLineKeys = new Set();
  let cpuTimer = null;
  let boardWrap = null;
  let linesSvg = null;

  const status = createStatus('');
  boardWrap = document.createElement('div');
  boardWrap.className = 'sos-board-wrap';

  linesSvg = document.createElementNS(SVG_NS, 'svg');
  linesSvg.classList.add('sos-lines-overlay');
  linesSvg.setAttribute('aria-hidden', 'true');

  const board = document.createElement('div');
  board.className = 'game-board sos-board';

  boardWrap.append(linesSvg, board);

  const sizeSelect = createSelect(SIZE_OPTIONS, String(size), (next) => {
    size = Number(next);
    resetGame();
  });

  const letterToggle = document.createElement('div');
  letterToggle.className = 'sos-letter-toggle';
  letterToggle.setAttribute('role', 'group');
  letterToggle.setAttribute('aria-label', 'Letter to place');
  const letterButtons = {};
  ['S', 'O'].forEach((l) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'sos-letter-btn';
    btn.textContent = l;
    btn.addEventListener('click', () => setLetter(l));
    letterButtons[l] = btn;
    letterToggle.appendChild(btn);
  });

  const aiSelect = createSelect(DIFFICULTIES, difficulty, (next) => {
    difficulty = next;
  });
  const aiRow = createOptionRow('CPU', aiSelect);

  const options = document.createElement('div');
  options.className = 'game-options';
  options.append(
    createOptionRow('Grid', sizeSelect),
    createOptionRow('Mode', createSelect(MODES, mode, (next) => {
      mode = next;
      aiRow.hidden = mode !== 'cpu';
      resetGame();
    })),
    aiRow,
    createOptionRow('Letter', letterToggle)
  );
  aiRow.hidden = mode !== 'cpu';

  const toolbar = createToolbar([
    { label: 'Reset', action: () => resetGame(), primary: true }
  ]);

  function createBoard() {
    return Array.from({ length: size }, () => Array(size).fill(''));
  }

  function inBounds(r, c) {
    return r >= 0 && c >= 0 && r < size && c < size;
  }

  function playerName(index) {
    if (mode === 'cpu' && index === CPU_PLAYER) return 'CPU';
    return PLAYERS[index];
  }

  function clearCpuTimer() {
    if (cpuTimer) {
      clearTimeout(cpuTimer);
      cpuTimer = null;
    }
  }

  function setLetter(next) {
    letter = next;
    Object.entries(letterButtons).forEach(([key, btn]) => {
      const active = key === letter;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    renderStatus();
  }

  function playSound(type) {
    if (typeof api.playSound === 'function') api.playSound(type);
    else playGameSound(type, api.settings || api);
  }

  function collectSOSLinesForMove(r, c) {
    const lines = [];
    for (const [dr, dc] of DIRS) {
      if (boardState[r][c] === 'O') {
        const r1 = r - dr;
        const c1 = c - dc;
        const r2 = r + dr;
        const c2 = c + dc;
        if (inBounds(r1, c1) && inBounds(r2, c2) && boardState[r1][c1] === 'S' && boardState[r2][c2] === 'S') {
          lines.push([[r1, c1], [r, c], [r2, c2]]);
        }
      } else if (boardState[r][c] === 'S') {
        const rO = r + dr;
        const cO = c + dc;
        const rS = r + dr * 2;
        const cS = c + dc * 2;
        if (inBounds(rO, cO) && inBounds(rS, cS) && boardState[rO][cO] === 'O' && boardState[rS][cS] === 'S') {
          lines.push([[r, c], [rO, cO], [rS, cS]]);
        }

        const rO2 = r - dr;
        const cO2 = c - dc;
        const rS2 = r - dr * 2;
        const cS2 = c - dc * 2;
        if (inBounds(rO2, cO2) && inBounds(rS2, cS2) && boardState[rO2][cO2] === 'O' && boardState[rS2][cS2] === 'S') {
          lines.push([[rS2, cS2], [rO2, cO2], [r, c]]);
        }
      }
    }
    return lines;
  }

  function registerLines(lines, player) {
    lines.forEach((cells) => {
      const key = lineKey(cells);
      if (completedLineKeys.has(key)) return;
      completedLineKeys.add(key);
      completedLines.push({ cells, player });
    });
  }

  function isBoardFull() {
    return boardState.every((row) => row.every(Boolean));
  }

  function evaluateMove(r, c, testLetter) {
    boardState[r][c] = testLetter;
    const lines = collectSOSLinesForMove(r, c);
    boardState[r][c] = '';
    return lines.length;
  }

  function cpuPickMove() {
    const empties = [];
    for (let r = 0; r < size; r += 1) {
      for (let c = 0; c < size; c += 1) {
        if (!boardState[r][c]) empties.push([r, c]);
      }
    }
    if (!empties.length) return null;

    if (difficulty === 'easy') {
      const [r, c] = randPick(empties);
      return { r, c, letter: randPick(['S', 'O']) };
    }

    const candidates = [];
    empties.forEach(([r, c]) => {
      ['S', 'O'].forEach((testLetter) => {
        candidates.push({ r, c, letter: testLetter, score: evaluateMove(r, c, testLetter) });
      });
    });

    if (difficulty === 'medium') {
      const bestScore = Math.max(...candidates.map((move) => move.score));
      const best = candidates.filter((move) => move.score === bestScore);
      return randPick(best);
    }

    // hard: prioritize scoring, then blocking opponent scoring on next turn
    const scored = candidates.map((move) => {
      boardState[move.r][move.c] = move.letter;
      const gained = evaluateMove(move.r, move.c, move.letter);
      boardState[move.r][move.c] = '';

      let block = 0;
      const opponent = turn === 0 ? 1 : 0;
      const savedTurn = turn;
      turn = opponent;
      for (const [or, oc] of empties) {
        if (or === move.r && oc === move.c) continue;
        block = Math.max(block, Math.max(
          evaluateMove(or, oc, 'S'),
          evaluateMove(or, oc, 'O')
        ));
      }
      turn = savedTurn;

      return { ...move, score: gained * 10 - block };
    });

    const bestScore = Math.max(...scored.map((move) => move.score));
    const best = scored.filter((move) => move.score === bestScore);
    return randPick(best);
  }

  function scheduleCpuTurn() {
    clearCpuTimer();
    if (gameOver || mode !== 'cpu' || turn !== CPU_PLAYER) return;
    cpuTimer = window.setTimeout(() => {
      const move = cpuPickMove();
      if (!move) return;
      setLetter(move.letter);
      onMove(move.r, move.c);
    }, 420);
  }

  function onMove(r, c) {
    if (gameOver || boardState[r][c]) return;
    if (mode === 'cpu' && turn === CPU_PLAYER) return;

    boardState[r][c] = letter;
    const newLines = collectSOSLinesForMove(r, c);
    registerLines(newLines, turn);

    if (newLines.length > 0) {
      scores[turn] += newLines.length;
      playSound('win');
    } else {
      turn = turn === 0 ? 1 : 0;
      playSound('tap');
    }

    if (isBoardFull()) {
      gameOver = true;
      if (scores[0] !== scores[1]) bumpScore('sos', 'wins', 1);
      if (mode === 'cpu' && scores[0] > scores[1]) {
        api.onWin?.({ game: 'sos', winner: 'player' });
      }
    }

    render();
    scheduleCpuTurn();
  }

  function renderStatus() {
    if (!gameOver) {
      if (mode === 'cpu' && turn === CPU_PLAYER) {
        status.textContent = `CPU thinking… · You ${scores[0]} - CPU ${scores[1]} · placing ${letter}`;
        return;
      }
      status.textContent = `${playerName(turn)} turn · placing ${letter} · ${playerName(0)} ${scores[0]} - ${playerName(1)} ${scores[1]}`;
      return;
    }
    if (scores[0] === scores[1]) {
      status.textContent = `Draw at ${scores[0]}-${scores[1]} (board full).`;
      return;
    }
    const winner = scores[0] > scores[1] ? 0 : 1;
    status.textContent = `${playerName(winner)} wins ${scores[winner]}-${scores[winner === 0 ? 1 : 0]}.`;
  }

  function drawLines() {
    linesSvg.replaceChildren();
    linesSvg.setAttribute('viewBox', '0 0 100 100');
    linesSvg.setAttribute('preserveAspectRatio', 'none');

    const cellW = 100 / size;
    const cellH = 100 / size;

    completedLines.forEach(({ cells, player }) => {
      const [[r1, c1], [,], [r3, c3]] = cells;
      const line = document.createElementNS(SVG_NS, 'line');
      line.setAttribute('x1', String((c1 + 0.5) * cellW));
      line.setAttribute('y1', String((r1 + 0.5) * cellH));
      line.setAttribute('x2', String((c3 + 0.5) * cellW));
      line.setAttribute('y2', String((r3 + 0.5) * cellH));
      line.setAttribute('class', `sos-line sos-line-p${player + 1}`);
      linesSvg.appendChild(line);
    });
  }

  function render() {
    board.style.gridTemplateColumns = `repeat(${size}, minmax(0, 1fr))`;
    board.style.gridTemplateRows = `repeat(${size}, minmax(0, 1fr))`;
    board.replaceChildren();

    const markedCells = new Set();
    completedLines.forEach(({ cells, player }) => {
      cells.forEach(([r, c]) => markedCells.add(`${r},${c}|${player}`));
    });

    for (let r = 0; r < size; r += 1) {
      for (let c = 0; c < size; c += 1) {
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'game-cell sos-cell';
        cell.textContent = boardState[r][c];

        if (markedCells.has(`${r},${c}|0`)) cell.classList.add('sos-cell-scored', 'sos-cell-p1');
        if (markedCells.has(`${r},${c}|1`)) cell.classList.add('sos-cell-scored', 'sos-cell-p2');

        const humanTurnBlocked = mode === 'cpu' && turn === CPU_PLAYER;
        cell.disabled = gameOver || Boolean(boardState[r][c]) || humanTurnBlocked;
        cell.addEventListener('click', () => onMove(r, c));
        board.appendChild(cell);
      }
    }

    drawLines();
    renderStatus();
  }

  function resetGame() {
    clearCpuTimer();
    boardState = createBoard();
    turn = 0;
    scores = [0, 0];
    gameOver = false;
    completedLines = [];
    completedLineKeys = new Set();
    setLetter('S');
    render();
    scheduleCpuTurn();
  }

  mountShell(container, { options, status, board: boardWrap, toolbar });
  resetGame();

  return () => clearCpuTimer();
}
