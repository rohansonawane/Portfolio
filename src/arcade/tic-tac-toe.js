import { WIN_LINES } from './data.js';
import {
  mountShell,
  createToolbar,
  createStatus,
  createOptionRow,
  createSelect,
  playGameSound
} from './game-common.js';

export class TicTacToe {
  constructor(onUpdate) {
    this.onUpdate = onUpdate;
    this.resetSession();
  }

  resetSession() {
    this.scores = { X: 0, O: 0, draws: 0 };
    this.newMatch();
  }

  newMatch() {
    this.board = Array(9).fill('');
    this.current = 'X';
    this.winner = null;
    this.winLine = null;
    this.history = [];
    this.gameOver = false;
    this.emit();
  }

  restart() {
    this.newMatch();
  }

  getHintIndex() {
    if (this.gameOver) return -1;
    const empty = this.board.map((v, i) => (v ? -1 : i)).filter((i) => i >= 0);
    if (!empty.length) return -1;

    for (const i of empty) {
      const b = [...this.board];
      b[i] = this.current;
      if (this.checkWinner(b)?.player === this.current) return i;
    }

    const opp = this.current === 'X' ? 'O' : 'X';
    for (const i of empty) {
      const b = [...this.board];
      b[i] = opp;
      if (this.checkWinner(b)?.player === opp) return i;
    }

    if (empty.includes(4)) return 4;
    const corners = [0, 2, 6, 8].filter((i) => empty.includes(i));
    if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
    return empty[0];
  }

  play(index) {
    if (this.gameOver || this.board[index]) return false;
    this.history.push({ board: [...this.board], current: this.current });
    this.board[index] = this.current;
    const result = this.checkWinner(this.board);
    if (result) {
      this.winner = result.player;
      this.winLine = result.line;
      this.gameOver = true;
      if (result.player === 'X') this.scores.X += 1;
      else if (result.player === 'O') this.scores.O += 1;
    } else if (this.board.every(Boolean)) {
      this.winner = 'draw';
      this.gameOver = true;
      this.scores.draws += 1;
    } else {
      this.current = this.current === 'X' ? 'O' : 'X';
    }
    this.emit();
    return true;
  }

  undo() {
    if (!this.history.length || this.gameOver) return false;
    const prev = this.history.pop();
    this.board = prev.board;
    this.current = prev.current;
    this.winner = null;
    this.winLine = null;
    this.gameOver = false;
    this.emit();
    return true;
  }

  checkWinner(board) {
    for (const line of WIN_LINES) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[b] === board[c]) {
        return { player: board[a], line };
      }
    }
    return null;
  }

  emit() {
    this.onUpdate?.({
      board: [...this.board],
      current: this.current,
      winner: this.winner,
      winLine: this.winLine ? [...this.winLine] : null,
      gameOver: this.gameOver,
      scores: { ...this.scores }
    });
  }
}

export function renderTicTacToe(container, game, { animations = true } = {}) {
  container.innerHTML = '';

  const status = document.createElement('div');
  status.className = 'ttt-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');

  const scores = document.createElement('div');
  scores.className = 'ttt-scores';

  const boardEl = document.createElement('div');
  boardEl.className = 'ttt-board';
  boardEl.setAttribute('role', 'grid');
  boardEl.setAttribute('aria-label', 'Tic Tac Toe board');

  const controls = document.createElement('div');
  controls.className = 'ttt-controls';

  const mkBtn = (label, action, className = 'arcade-btn arcade-btn-secondary arcade-btn-shiny') => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = className;
    btn.textContent = label;
    btn.addEventListener('click', action);
    return btn;
  };

  controls.append(
    mkBtn('Restart', () => game.restart()),
    mkBtn('New Match', () => game.newMatch()),
    mkBtn('Undo', () => game.undo()),
    mkBtn('Hint', () => {
      const idx = game.getHintIndex();
      if (idx >= 0) {
        const cell = boardEl.querySelector(`[data-i="${idx}"]`);
        cell?.classList.add('ttt-hint');
        setTimeout(() => cell?.classList.remove('ttt-hint'), 800);
      }
    })
  );

  container.append(status, scores, boardEl, controls);

  const cells = [];
  for (let i = 0; i < 9; i += 1) {
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'ttt-cell';
    cell.dataset.i = String(i);
    cell.setAttribute('role', 'gridcell');
    cell.setAttribute('aria-label', `Cell ${i + 1}, empty`);
    cell.addEventListener('click', () => game.play(i));
    cell.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        game.play(i);
      }
    });
    boardEl.appendChild(cell);
    cells.push(cell);
  }

  const paint = (state) => {
    status.textContent = state.gameOver
      ? state.winner === 'draw'
        ? "It's a draw!"
        : `${state.winner} wins!`
      : `${state.current}'s turn`;

    scores.innerHTML = `
      <span>X: ${state.scores.X}</span>
      <span>Draws: ${state.scores.draws}</span>
      <span>O: ${state.scores.O}</span>
    `;

    state.board.forEach((mark, i) => {
      const cell = cells[i];
      cell.textContent = mark;
      cell.className = 'ttt-cell' + (mark ? ` ${mark.toLowerCase()}` : '');
      cell.disabled = Boolean(mark) || state.gameOver;
      cell.setAttribute('aria-label', `Cell ${i + 1}, ${mark || 'empty'}`);
      cell.classList.toggle('win', Boolean(state.winLine?.includes(i)));
    });

    if (state.gameOver && state.winner && state.winner !== 'draw' && animations) {
      container.dispatchEvent(new CustomEvent('ttt-win', { detail: state.winner }));
    }
  };

  game.onUpdate = paint;
  paint({
    board: game.board,
    current: game.current,
    winner: game.winner,
    winLine: game.winLine,
    gameOver: game.gameOver,
    scores: game.scores
  });

  return { paint };
}

function cpuPickMove(board, difficulty) {
  const empty = board.map((v, i) => (v ? -1 : i)).filter((i) => i >= 0);
  if (!empty.length) return -1;

  const referee = new TicTacToe();
  const randomOf = (list) => list[Math.floor(Math.random() * list.length)];

  if (difficulty === 'easy') {
    return randomOf(empty);
  }

  if (difficulty === 'medium') {
    // Win if possible, then block, otherwise prefer centre/corners — beatable.
    for (const i of empty) {
      const b = [...board];
      b[i] = 'O';
      if (referee.checkWinner(b)?.player === 'O') return i;
    }
    for (const i of empty) {
      const b = [...board];
      b[i] = 'X';
      if (referee.checkWinner(b)?.player === 'X') return i;
    }
    if (empty.includes(4)) return 4;
    const corners = [0, 2, 6, 8].filter((i) => empty.includes(i));
    if (corners.length) return randomOf(corners);
    return randomOf(empty);
  }

  const scoreMove = (b, depth, maximizing) => {
    const win = new TicTacToe().checkWinner(b);
    if (win?.player === 'O') return 10 - depth;
    if (win?.player === 'X') return depth - 10;
    if (b.every(Boolean)) return 0;

    const slots = b.map((v, i) => (v ? -1 : i)).filter((i) => i >= 0);
    if (maximizing) {
      let best = -Infinity;
      for (const i of slots) {
        const next = [...b];
        next[i] = 'O';
        best = Math.max(best, scoreMove(next, depth + 1, false));
      }
      return best;
    }
    let best = Infinity;
    for (const i of slots) {
      const next = [...b];
      next[i] = 'X';
      best = Math.min(best, scoreMove(next, depth + 1, true));
    }
    return best;
  };

  let bestIdx = empty[0];
  let bestScore = -Infinity;
  for (const i of empty) {
    const b = [...board];
    b[i] = 'O';
    const score = scoreMove(b, 1, false);
    if (score > bestScore) {
      bestScore = score;
      bestIdx = i;
    }
  }
  return bestIdx;
}

export function mount(container, api = {}) {
  let mode = '2p';
  let cpuDifficulty = 'medium';
  let cpuBusy = false;
  const game = new TicTacToe();
  const playFx = (type) => {
    if (typeof api.playSound === 'function') api.playSound(type);
    else playGameSound(type, api.settings);
  };

  const status = createStatus('');
  const scoresEl = document.createElement('div');
  scoresEl.className = 'ttt-scores';

  const boardEl = document.createElement('div');
  boardEl.className = 'ttt-board';
  boardEl.setAttribute('role', 'grid');
  boardEl.setAttribute('aria-label', 'Tic Tac Toe board');

  const options = document.createElement('div');
  options.className = 'game-options';
  options.append(
    createOptionRow('Mode', createSelect(
      [['2p', '2 Players'], ['cpu', 'Vs CPU']],
      mode,
      (v) => { mode = v; game.restart(); paint(game); }
    )),
    createOptionRow('CPU', createSelect(
      [['easy', 'Easy'], ['medium', 'Medium'], ['hard', 'Hard']],
      cpuDifficulty,
      (v) => { cpuDifficulty = v; }
    ))
  );

  const toolbar = createToolbar([
    { label: 'Restart', action: () => { cpuBusy = false; game.restart(); paint(game); } },
    { label: 'New Match', action: () => { cpuBusy = false; game.newMatch(); paint(game); } },
    { label: 'Undo', action: () => {
      if (mode === 'cpu') {
        game.undo();
        if (game.history.length) game.undo();
      } else game.undo();
      cpuBusy = false;
      paint(game);
    }},
    { label: 'Hint', action: () => {
      const idx = game.getHintIndex();
      if (idx >= 0) {
        const cell = boardEl.querySelector(`[data-i="${idx}"]`);
        cell?.classList.add('ttt-hint');
        setTimeout(() => cell?.classList.remove('ttt-hint'), 800);
        playFx('tap');
      }
    }}
  ]);

  mountShell(container, { options, status, board: boardEl, toolbar });
  container.querySelector('.game-shell')?.insertBefore(scoresEl, boardEl);

  const cells = [];
  for (let i = 0; i < 9; i += 1) {
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'ttt-cell';
    cell.dataset.i = String(i);
    cell.setAttribute('role', 'gridcell');
    cell.addEventListener('click', () => {
      if (cpuBusy || game.gameOver) return;
      if (mode === 'cpu' && game.current === 'O') return;
      if (game.play(i)) {
        playFx('tap');
        paint(game);
        maybeCpuTurn();
      }
    });
    boardEl.appendChild(cell);
    cells.push(cell);
  }

  function maybeCpuTurn() {
    if (mode !== 'cpu' || game.gameOver || game.current !== 'O') return;
    cpuBusy = true;
    setTimeout(() => {
      const idx = cpuPickMove(game.board, cpuDifficulty);
      if (idx >= 0 && game.play(idx)) playFx('tap');
      cpuBusy = false;
      paint(game);
    }, 350);
  }

  function paint(state) {
    const cpuLabel = mode === 'cpu' ? ' (You)' : '';
    status.textContent = state.gameOver
      ? state.winner === 'draw'
        ? "It's a draw!"
        : mode === 'cpu' && state.winner === 'X'
          ? 'You win!'
          : mode === 'cpu' && state.winner === 'O'
            ? 'CPU wins!'
            : `${state.winner} wins!`
      : mode === 'cpu' && state.current === 'X'
        ? `Your turn${cpuLabel}`
        : mode === 'cpu' && state.current === 'O'
          ? 'CPU thinking…'
          : `${state.current}'s turn`;

    scoresEl.innerHTML = `
      <span>X: ${state.scores.X}</span>
      <span>Draws: ${state.scores.draws}</span>
      <span>O: ${state.scores.O}</span>
    `;

    state.board.forEach((mark, i) => {
      const cell = cells[i];
      cell.textContent = mark;
      cell.className = 'ttt-cell' + (mark ? ` ${mark.toLowerCase()}` : '');
      const blocked = Boolean(mark) || state.gameOver || cpuBusy
        || (mode === 'cpu' && state.current === 'O' && !mark);
      cell.disabled = blocked;
      cell.classList.toggle('win', Boolean(state.winLine?.includes(i)));
    });

    if (state.gameOver && state.winner && state.winner !== 'draw') {
      playFx('win');
      if (mode === 'cpu' && state.winner === 'X') {
        api.onWin?.({ game: 'tic-tac-toe', winner: 'player' });
        api.saveScore?.('wins', 1);
      } else if (mode === '2p') {
        api.onWin?.({ game: 'tic-tac-toe', winner: state.winner });
      }
    }
  }

  game.onUpdate = paint;
  paint({
    board: game.board,
    current: game.current,
    winner: game.winner,
    winLine: game.winLine,
    gameOver: game.gameOver,
    scores: game.scores
  });
}
