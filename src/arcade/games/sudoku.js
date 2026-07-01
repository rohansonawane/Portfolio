import {
  mountShell,
  createToolbar,
  createStatus,
  createOptionRow,
  createSelect,
  createAiModeRow,
  bumpScore,
  playGameSound,
  randPick
} from '../game-common.js';

const SIZE = 9;

const PUZZLES = {
  easy: [
    '530070000600195000098000060800060003400803001700020006060000280000419005000080079',
    '200080300060070084030500209000105408000000000402706000301007040720040060004010003',
    '000260701680070090190004500820100040004602900050003028009300074040050036703018000'
  ],
  medium: [
    '000000907000420180000705026100904000050000040000507009920108000034059000507000000',
    '030000080009705000000000700200080006000000000500040009001000000000903400060000050',
    '000900002050123400030000160908000000070000090000000205091000050007439020400007000'
  ],
  hard: [
    '000000000000003085001020000000507000004000100090000000500000073002010000000040009',
    '100007090030020008009600500005300900010080002600004000300000010040000007007000300',
    '000006000059000008200000000040080000000070000000030040000000004500000170000400000'
  ]
};

function parseGrid(text) {
  return text.split('').map((ch) => Number.parseInt(ch, 10) || 0);
}

function indexToRowCol(index) {
  return [Math.floor(index / SIZE), index % SIZE];
}

function rowColToIndex(row, col) {
  return row * SIZE + col;
}

function boxStart(v) {
  return Math.floor(v / 3) * 3;
}

function cloneBoard(board) {
  return board.slice();
}

function getConflicts(board) {
  const conflictSet = new Set();

  const markGroupConflicts = (indices) => {
    const seen = new Map();
    indices.forEach((idx) => {
      const val = board[idx];
      if (!val) return;
      if (!seen.has(val)) seen.set(val, []);
      seen.get(val).push(idx);
    });
    seen.forEach((idxs) => {
      if (idxs.length > 1) idxs.forEach((idx) => conflictSet.add(idx));
    });
  };

  for (let row = 0; row < SIZE; row += 1) {
    markGroupConflicts(Array.from({ length: SIZE }, (_, c) => rowColToIndex(row, c)));
  }
  for (let col = 0; col < SIZE; col += 1) {
    markGroupConflicts(Array.from({ length: SIZE }, (_, r) => rowColToIndex(r, col)));
  }
  for (let br = 0; br < SIZE; br += 3) {
    for (let bc = 0; bc < SIZE; bc += 3) {
      const group = [];
      for (let r = br; r < br + 3; r += 1) {
        for (let c = bc; c < bc + 3; c += 1) group.push(rowColToIndex(r, c));
      }
      markGroupConflicts(group);
    }
  }
  return conflictSet;
}

function isSolved(board, solution) {
  for (let i = 0; i < board.length; i += 1) {
    if (board[i] !== solution[i]) return false;
  }
  return true;
}

function setupPuzzle(difficulty) {
  const puzzle = randPick(PUZZLES[difficulty] || PUZZLES.easy);
  const given = parseGrid(puzzle);
  // These puzzle strings are paired with known full solutions for hint/check flow.
  const solution = solveSudoku(given);
  return {
    difficulty,
    given,
    board: cloneBoard(given),
    solution,
    selected: -1,
    won: false
  };
}

function solveSudoku(start) {
  const board = cloneBoard(start);

  const isValid = (idx, value) => {
    const [row, col] = indexToRowCol(idx);
    for (let c = 0; c < SIZE; c += 1) {
      if (c !== col && board[rowColToIndex(row, c)] === value) return false;
    }
    for (let r = 0; r < SIZE; r += 1) {
      if (r !== row && board[rowColToIndex(r, col)] === value) return false;
    }
    const sr = boxStart(row);
    const sc = boxStart(col);
    for (let r = sr; r < sr + 3; r += 1) {
      for (let c = sc; c < sc + 3; c += 1) {
        const target = rowColToIndex(r, c);
        if (target !== idx && board[target] === value) return false;
      }
    }
    return true;
  };

  const walk = () => {
    let idx = -1;
    let bestCandidates = null;
    for (let i = 0; i < board.length; i += 1) {
      if (board[i] !== 0) continue;
      const candidates = [];
      for (let n = 1; n <= 9; n += 1) {
        if (isValid(i, n)) candidates.push(n);
      }
      if (!candidates.length) return false;
      if (!bestCandidates || candidates.length < bestCandidates.length) {
        bestCandidates = candidates;
        idx = i;
        if (candidates.length === 1) break;
      }
    }
    if (idx === -1) return true;

    for (const n of bestCandidates) {
      board[idx] = n;
      if (walk()) return true;
    }
    board[idx] = 0;
    return false;
  };

  walk();
  return board;
}

function setCellValue(state, value) {
  if (state.won || state.selected < 0) return false;
  const idx = state.selected;
  if (state.given[idx]) return false;
  state.board[idx] = value;
  return true;
}

function safePlay(type, api) {
  if (typeof api.playSound === 'function') api.playSound(type);
  else playGameSound(type, api.settings);
}

function notifyWin(api, state) {
  const payload = {
    gameId: 'sudoku',
    difficulty: state.difficulty,
    solved: true
  };
  bumpScore('sudoku', 'wins', 1);
  if (typeof api.saveScore === 'function') {
    try { api.saveScore(payload); } catch { /* ignore host callback shape mismatch */ }
  }
  if (typeof api.onWin === 'function') api.onWin(payload);
}

export function mount(container, api = {}) {
  let state = setupPuzzle('easy');
  let aiMode = 'off';
  let aiTimer = null;

  const status = createStatus('Select a cell, then pick a number.');
  const board = document.createElement('div');
  board.className = 'game-board game-grid sudoku-grid';
  board.style.gridTemplateColumns = 'repeat(9, minmax(26px, 1fr))';

  const options = document.createElement('div');
  options.className = 'game-options';

  const difficultySelect = createSelect(
    [['easy', 'Easy'], ['medium', 'Medium'], ['hard', 'Hard']],
    state.difficulty,
    (value) => {
      state = setupPuzzle(value);
      status.textContent = `Loaded ${value} puzzle.`;
      syncAiTimer();
      render();
    }
  );
  options.append(
    createOptionRow('Difficulty', difficultySelect),
    createAiModeRow(aiMode, (value) => {
      aiMode = value;
      syncAiTimer();
    })
  );

  function applyHint() {
    if (state.won) return;
    const candidates = [];
    for (let i = 0; i < state.board.length; i += 1) {
      if (state.board[i] !== state.solution[i]) candidates.push(i);
    }
    if (!candidates.length) {
      status.textContent = 'No hint needed.';
      return;
    }
    const idx = randPick(candidates);
    state.board[idx] = state.solution[idx];
    state.selected = idx;
    safePlay('tap', api);
    status.textContent = 'Hint placed.';
    checkForWin(true);
    render();
  }

  function syncAiTimer() {
    if (aiTimer) {
      clearInterval(aiTimer);
      aiTimer = null;
    }
    if (aiMode === 'assist' && !state.won) {
      aiTimer = window.setInterval(() => applyHint(), 12000);
    }
  }

  const toolbar = createToolbar([
    {
      label: 'Hint',
      action: () => applyHint()
    },
    {
      label: 'Check',
      action: () => {
        const conflicts = getConflicts(state.board);
        if (conflicts.size) {
          status.textContent = `${conflicts.size} conflicting cells highlighted.`;
          safePlay('hit', api);
        } else if (isSolved(state.board, state.solution)) {
          status.textContent = 'Perfect solve!';
          checkForWin(false);
        } else {
          status.textContent = 'So far valid. Keep going!';
          safePlay('tap', api);
        }
        render();
      }
    },
    {
      label: 'New Puzzle',
      action: () => {
        state = setupPuzzle(state.difficulty);
        status.textContent = 'Fresh puzzle ready.';
        syncAiTimer();
        render();
      }
    }
  ]);

  const keypadWrap = document.createElement('div');
  keypadWrap.className = 'game-toolbar game-keypad';
  const keypadButtons = [];
  for (let n = 1; n <= 9; n += 1) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'arcade-btn arcade-btn-secondary arcade-btn-shiny';
    btn.textContent = String(n);
    btn.addEventListener('click', () => {
      if (!setCellValue(state, n)) return;
      status.textContent = `Placed ${n}.`;
      safePlay('tap', api);
      checkForWin(true);
      render();
    });
    keypadButtons.push(btn);
    keypadWrap.appendChild(btn);
  }
  const clearBtn = document.createElement('button');
  clearBtn.type = 'button';
  clearBtn.className = 'arcade-btn arcade-btn-secondary arcade-btn-shiny';
  clearBtn.textContent = 'Clear Cell';
  clearBtn.addEventListener('click', () => {
    if (!setCellValue(state, 0)) return;
    status.textContent = 'Cell cleared.';
    safePlay('tap', api);
    render();
  });
  keypadWrap.appendChild(clearBtn);

  const cells = [];
  for (let i = 0; i < SIZE * SIZE; i += 1) {
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'game-cell sudoku-cell';
    cell.dataset.index = String(i);
    cell.addEventListener('click', () => {
      state.selected = i;
      render();
    });
    board.appendChild(cell);
    cells.push(cell);
  }

  const shell = mountShell(container, { options, status, board, toolbar });
  shell.appendChild(keypadWrap);

  function checkForWin(playWinSound) {
    if (state.won) return;
    if (!isSolved(state.board, state.solution)) return;
    if (getConflicts(state.board).size) return;
    state.won = true;
    status.textContent = `Solved! ${state.difficulty} complete.`;
    if (playWinSound) safePlay('win', api);
    notifyWin(api, state);
  }

  function render() {
    const conflicts = getConflicts(state.board);
    cells.forEach((cell, idx) => {
      const value = state.board[idx];
      const [row, col] = indexToRowCol(idx);
      const given = state.given[idx] !== 0;
      cell.textContent = value ? String(value) : '';
      cell.disabled = state.won;
      cell.className = 'game-cell sudoku-cell';
      if (given) cell.classList.add('is-given');
      if (state.selected === idx) cell.classList.add('is-selected');
      if (conflicts.has(idx)) cell.classList.add('is-conflict');
      if (row % 3 === 0) cell.style.borderTopWidth = '2px';
      if (col % 3 === 0) cell.style.borderLeftWidth = '2px';
      if (row === 8) cell.style.borderBottomWidth = '2px';
      if (col === 8) cell.style.borderRightWidth = '2px';
      cell.setAttribute(
        'aria-label',
        given
          ? `Given ${value || 'empty'}`
          : `Row ${row + 1}, Col ${col + 1}, ${value || 'empty'}`
      );
    });

    keypadButtons.forEach((btn, idx) => {
      btn.disabled = state.won || state.selected < 0 || state.given[state.selected] !== 0;
      btn.classList.toggle('arcade-btn-primary', state.selected >= 0 && Number(btn.textContent) === idx + 1);
    });
    clearBtn.disabled = state.won || state.selected < 0 || state.given[state.selected] !== 0;
  }

  render();
  syncAiTimer();
  return () => {
    if (aiTimer) clearInterval(aiTimer);
    container.replaceChildren();
  };
}
