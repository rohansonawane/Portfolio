import {
  createOptionRow,
  createSelect,
  createStatus,
  createToolbar,
  mountShell,
  playGameSound,
  bumpScore,
  randPick,
  shuffle
} from '../game-common.js';

const PLAYERS = ['Player 1', 'Player 2'];
const EDGE_PLAYER_CLASS = ['p1', 'p2'];
const MODES = [['2p', '2 Players'], ['cpu', 'Vs CPU']];
const DIFFICULTIES = [['easy', 'Easy'], ['medium', 'Medium'], ['hard', 'Hard']];
const CPU_PLAYER = 1;

function makeMatrix(rows, cols, value) {
  return Array.from({ length: rows }, () => Array(cols).fill(value));
}

export function mount(container, api = {}) {
  let gridSize = 4;
  let turn = 0;
  let scores = [0, 0];
  let hEdges = [];
  let vEdges = [];
  let boxOwners = [];
  let gameOver = false;
  let mode = '2p';
  let difficulty = 'medium';
  let cpuTimer = null;

  function playerName(i) {
    if (mode === 'cpu' && i === CPU_PLAYER) return 'CPU';
    return PLAYERS[i];
  }

  const status = createStatus('');
  const board = document.createElement('div');
  board.className = 'game-board dots-board';

  const sizeSelect = createSelect(
    [
      ['3', '3 x 3'],
      ['4', '4 x 4'],
      ['5', '5 x 5'],
      ['6', '6 x 6'],
      ['8', '8 x 8']
    ],
    String(gridSize),
    (next) => {
      gridSize = Number(next);
      resetGame();
    }
  );
  const modeSelect = createSelect(MODES, mode, (next) => {
    mode = next;
    resetGame();
  });
  const diffSelect = createSelect(DIFFICULTIES, difficulty, (next) => {
    difficulty = next;
    resetGame();
  });
  const options = document.createElement('div');
  options.className = 'game-options';
  options.append(
    createOptionRow('Grid', sizeSelect),
    createOptionRow('Mode', modeSelect),
    createOptionRow('Difficulty', diffSelect)
  );

  const toolbar = createToolbar([
    { label: 'Reset', action: () => resetGame(), primary: true }
  ]);

  function playSound(type) {
    if (typeof api.playSound === 'function') api.playSound(type);
    else playGameSound(type, api.settings || api);
  }

  function isBoxClosed(r, c) {
    return (
      hEdges[r][c] !== null &&
      hEdges[r + 1][c] !== null &&
      vEdges[r][c] !== null &&
      vEdges[r][c + 1] !== null
    );
  }

  function claimCompletedBoxes(player, touched) {
    let made = 0;
    touched.forEach(([r, c]) => {
      if (r < 0 || c < 0 || r >= gridSize || c >= gridSize) return;
      if (boxOwners[r][c] !== null) return;
      if (isBoxClosed(r, c)) {
        boxOwners[r][c] = player;
        scores[player] += 1;
        made += 1;
      }
    });
    return made;
  }

  function applyEdge(kind, r, c) {
    if (gameOver) return;
    const player = turn;
    if (kind === 'h') {
      if (hEdges[r][c] !== null) return;
      hEdges[r][c] = player;
      const made = claimCompletedBoxes(player, [[r - 1, c], [r, c]]);
      if (!made) turn = turn === 0 ? 1 : 0;
      else playSound('win');
    } else {
      if (vEdges[r][c] !== null) return;
      vEdges[r][c] = player;
      const made = claimCompletedBoxes(player, [[r, c - 1], [r, c]]);
      if (!made) turn = turn === 0 ? 1 : 0;
      else playSound('win');
    }

    if (scores[0] + scores[1] === gridSize * gridSize) {
      gameOver = true;
      if (scores[0] !== scores[1]) {
        bumpScore('dots-boxes', 'wins', 1);
      }
      playSound(scores[0] === scores[1] ? 'tap' : 'win');
    } else {
      playSound('tap');
    }
    render();
    maybeCpuTurn();
  }

  function onEdgeClick(kind, r, c) {
    // Ignore human clicks while the CPU is to move.
    if (mode === 'cpu' && turn === CPU_PLAYER) return;
    applyEdge(kind, r, c);
  }

  function edgeButton(kind, r, c) {
    const edge = document.createElement('button');
    edge.type = 'button';
    edge.className = `game-cell dots-edge dots-edge-${kind}`;
    edge.addEventListener('click', () => onEdgeClick(kind, r, c));
    return edge;
  }

  // ---- CPU opponent ----
  function clearCpuTimer() {
    if (cpuTimer) {
      clearTimeout(cpuTimer);
      cpuTimer = null;
    }
  }

  function boxSideCount(r, c) {
    if (r < 0 || c < 0 || r >= gridSize || c >= gridSize) return -1;
    let n = 0;
    if (hEdges[r][c] !== null) n += 1;
    if (hEdges[r + 1][c] !== null) n += 1;
    if (vEdges[r][c] !== null) n += 1;
    if (vEdges[r][c + 1] !== null) n += 1;
    return n;
  }

  function adjacentBoxes(kind, r, c) {
    return kind === 'h' ? [[r - 1, c], [r, c]] : [[r, c - 1], [r, c]];
  }

  function classifyEdge(kind, r, c) {
    let completes = false;
    let unsafe = false;
    adjacentBoxes(kind, r, c).forEach(([br, bc]) => {
      const n = boxSideCount(br, bc);
      if (n === 3) completes = true;
      if (n === 2) unsafe = true;
    });
    return { completes, unsafe };
  }

  function availableEdges() {
    const list = [];
    for (let r = 0; r <= gridSize; r += 1) {
      for (let c = 0; c < gridSize; c += 1) {
        if (hEdges[r][c] === null) list.push(['h', r, c]);
      }
    }
    for (let r = 0; r < gridSize; r += 1) {
      for (let c = 0; c <= gridSize; c += 1) {
        if (vEdges[r][c] === null) list.push(['v', r, c]);
      }
    }
    return list;
  }

  function pickCpuEdge() {
    const edges = shuffle(availableEdges());
    if (!edges.length) return null;
    if (difficulty === 'easy') return randPick(edges);

    const completing = edges.filter(([k, r, c]) => classifyEdge(k, r, c).completes);
    if (completing.length) return completing[0];

    const safe = edges.filter(([k, r, c]) => !classifyEdge(k, r, c).unsafe);
    if (safe.length) return randPick(safe);

    if (difficulty === 'medium') return randPick(edges);

    // hard: no safe move — give away the smallest chain
    let best = edges[0];
    let bestCost = Infinity;
    edges.forEach(([k, r, c]) => {
      let cost = 0;
      adjacentBoxes(k, r, c).forEach(([br, bc]) => {
        if (boxSideCount(br, bc) === 2) cost += 1;
      });
      if (cost < bestCost) {
        bestCost = cost;
        best = [k, r, c];
      }
    });
    return best;
  }

  function maybeCpuTurn() {
    clearCpuTimer();
    if (mode !== 'cpu' || gameOver || turn !== CPU_PLAYER) return;
    cpuTimer = window.setTimeout(() => {
      const edge = pickCpuEdge();
      if (edge) applyEdge(edge[0], edge[1], edge[2]);
    }, 420);
  }

  function render() {
    const dots = gridSize + 1;
    const boardTracks = dots * 2 - 1;
    // Alternate tracks: dot rows/cols are thin, edge/box rows/cols are flexible.
    const tracks = Array.from({ length: boardTracks }, (_, i) =>
      i % 2 === 0 ? '14px' : 'minmax(22px, 1fr)'
    ).join(' ');
    board.style.gridTemplateColumns = tracks;
    board.style.gridTemplateRows = tracks;
    board.replaceChildren();

    for (let r = 0; r < dots; r += 1) {
      for (let c = 0; c < dots; c += 1) {
        const dot = document.createElement('span');
        dot.className = 'dots-dot';
        dot.style.gridRow = String(r * 2 + 1);
        dot.style.gridColumn = String(c * 2 + 1);
        board.appendChild(dot);

        if (c < dots - 1) {
          const h = edgeButton('h', r, c);
          h.style.gridRow = String(r * 2 + 1);
          h.style.gridColumn = String(c * 2 + 2);
          const owner = hEdges[r][c];
          if (owner !== null) h.classList.add('claimed', EDGE_PLAYER_CLASS[owner]);
          board.appendChild(h);
        }

        if (r < dots - 1) {
          const v = edgeButton('v', r, c);
          v.style.gridRow = String(r * 2 + 2);
          v.style.gridColumn = String(c * 2 + 1);
          const owner = vEdges[r][c];
          if (owner !== null) v.classList.add('claimed', EDGE_PLAYER_CLASS[owner]);
          board.appendChild(v);
        }

        if (r < dots - 1 && c < dots - 1) {
          const box = document.createElement('div');
          box.className = 'game-cell dots-box';
          box.style.gridRow = String(r * 2 + 2);
          box.style.gridColumn = String(c * 2 + 2);
          if (boxOwners[r][c] !== null) {
            box.classList.add('owned', EDGE_PLAYER_CLASS[boxOwners[r][c]]);
            box.textContent = boxOwners[r][c] === 0 ? '1' : '2';
          }
          board.appendChild(box);
        }
      }
    }

    if (gameOver) {
      if (scores[0] === scores[1]) {
        status.textContent = `Draw game at ${scores[0]}-${scores[1]}.`;
      } else {
        const winner = scores[0] > scores[1] ? 0 : 1;
        status.textContent = `${playerName(winner)} wins ${scores[winner]}-${scores[winner === 0 ? 1 : 0]}.`;
      }
      return;
    }

    const p2Label = mode === 'cpu' ? 'CPU' : 'P2';
    status.textContent = `${playerName(turn)} turn · P1 ${scores[0]} - ${p2Label} ${scores[1]}`;
  }

  function resetGame() {
    clearCpuTimer();
    turn = 0;
    scores = [0, 0];
    hEdges = makeMatrix(gridSize + 1, gridSize, null);
    vEdges = makeMatrix(gridSize, gridSize + 1, null);
    boxOwners = makeMatrix(gridSize, gridSize, null);
    gameOver = false;
    render();
    maybeCpuTurn();
  }

  mountShell(container, { options, status, board, toolbar });
  resetGame();

  return () => {
    clearCpuTimer();
  };
}
