import {
  createStatus,
  createToolbar,
  createOptionRow,
  createSelect,
  mountShell,
  playGameSound,
  bumpScore,
  shuffle,
  PLAYER_MODE_OPTIONS
} from '../game-common.js';

const BOARD_SIZE = 8;
const SHIPS = [2, 2, 3];

function cellKey(r, c) {
  return `${r},${c}`;
}

function inBounds(r, c) {
  return r >= 0 && c >= 0 && r < BOARD_SIZE && c < BOARD_SIZE;
}

function makeGrid() {
  return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(''));
}

function buildShip(startR, startC, size, vertical = false) {
  const cells = [];
  for (let i = 0; i < size; i += 1) {
    const r = startR + (vertical ? i : 0);
    const c = startC + (vertical ? 0 : i);
    if (!inBounds(r, c)) return null;
    cells.push([r, c]);
  }
  return cells;
}

function canPlace(occupied, cells) {
  return cells.every(([r, c]) => !occupied.has(cellKey(r, c)));
}

function randomShips() {
  const occupied = new Set();
  const ships = [];
  SHIPS.forEach((size) => {
    let placed = false;
    while (!placed) {
      const vertical = Math.random() < 0.5;
      const r = Math.floor(Math.random() * BOARD_SIZE);
      const c = Math.floor(Math.random() * BOARD_SIZE);
      const cells = buildShip(r, c, size, vertical);
      if (!cells || !canPlace(occupied, cells)) continue;
      const ship = { size, cells: new Set(cells.map(([rr, cc]) => cellKey(rr, cc))), hits: new Set() };
      ships.push(ship);
      cells.forEach(([rr, cc]) => occupied.add(cellKey(rr, cc)));
      placed = true;
    }
  });
  return { ships, occupied };
}

export function mount(container, api = {}) {
  let phase = 'placing';
  let placingIndex = 0;
  let playerOccupied = new Set();
  let playerShips = [];
  let cpuOccupied = new Set();
  let cpuShips = [];
  let playerShots = new Set();
  let cpuShots = new Set();
  let turn = 'player';
  let gameOver = false;

  const status = createStatus('');
  const boardWrap = document.createElement('div');
  boardWrap.className = 'sea-battle-wrap';

  const playerBoard = document.createElement('div');
  playerBoard.className = 'game-board sea-board player-board';
  playerBoard.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, minmax(24px, 1fr))`;
  playerBoard.style.gridTemplateRows = `repeat(${BOARD_SIZE}, minmax(24px, 1fr))`;

  const cpuBoard = document.createElement('div');
  cpuBoard.className = 'game-board sea-board cpu-board';
  cpuBoard.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, minmax(24px, 1fr))`;
  cpuBoard.style.gridTemplateRows = `repeat(${BOARD_SIZE}, minmax(24px, 1fr))`;

  const labels = document.createElement('div');
  labels.className = 'sea-board-labels';
  labels.innerHTML = '<span>Your Fleet</span><span>Enemy Waters</span>';
  boardWrap.append(labels, playerBoard, cpuBoard);

  const toolbar = createToolbar([
    { label: 'Reset', action: () => resetGame(), primary: true }
  ]);

  const modeSelect = createSelect(PLAYER_MODE_OPTIONS, 'cpu', () => {});
  modeSelect.disabled = true;
  const options = document.createElement('div');
  options.className = 'game-options';
  options.appendChild(createOptionRow('Mode', modeSelect));

  function playSound(type) {
    if (typeof api.playSound === 'function') api.playSound(type);
    else playGameSound(type, api.settings || api);
  }

  function fleetSunk(ships) {
    return ships.every((ship) => ship.hits.size >= ship.cells.size);
  }

  function processShot(targetShips, key) {
    const hitShip = targetShips.find((ship) => ship.cells.has(key));
    if (!hitShip) return { hit: false, sunk: false };
    hitShip.hits.add(key);
    return { hit: true, sunk: hitShip.hits.size === hitShip.cells.size };
  }

  function placePlayerShip(r, c) {
    if (phase !== 'placing' || gameOver) return;
    const size = SHIPS[placingIndex];
    const cells = buildShip(r, c, size, false);
    if (!cells || !canPlace(playerOccupied, cells)) {
      status.textContent = `Cannot place size ${size} there. Try another cell.`;
      playSound('lose');
      return;
    }
    const ship = { size, cells: new Set(cells.map(([rr, cc]) => cellKey(rr, cc))), hits: new Set() };
    playerShips.push(ship);
    cells.forEach(([rr, cc]) => playerOccupied.add(cellKey(rr, cc)));
    placingIndex += 1;
    playSound('tap');

    if (placingIndex >= SHIPS.length) {
      const cpuSetup = randomShips();
      cpuShips = cpuSetup.ships;
      cpuOccupied = cpuSetup.occupied;
      phase = 'battle';
      turn = 'player';
      status.textContent = 'Battle started. Fire on enemy waters.';
    }
    render();
  }

  function playerShoot(r, c) {
    if (phase !== 'battle' || gameOver || turn !== 'player') return;
    const key = cellKey(r, c);
    if (playerShots.has(key)) return;
    playerShots.add(key);
    const result = processShot(cpuShips, key);
    if (result.hit) {
      playSound('hit');
      status.textContent = result.sunk ? 'Hit and sunk!' : 'Hit!';
    } else {
      playSound('tap');
      status.textContent = 'Miss.';
    }

    if (fleetSunk(cpuShips)) {
      gameOver = true;
      bumpScore('sea-battles', 'wins', 1);
      status.textContent = 'Victory! You sunk all enemy ships.';
      playSound('win');
      api.onWin?.({ game: 'sea-battles' });
      render();
      return;
    }

    turn = 'cpu';
    render();
    setTimeout(cpuShoot, 340);
  }

  function cpuShoot() {
    if (gameOver || turn !== 'cpu') return;
    const candidates = [];
    for (let r = 0; r < BOARD_SIZE; r += 1) {
      for (let c = 0; c < BOARD_SIZE; c += 1) {
        const key = cellKey(r, c);
        if (!cpuShots.has(key)) candidates.push(key);
      }
    }
    const shot = shuffle(candidates)[0];
    cpuShots.add(shot);
    const result = processShot(playerShips, shot);
    if (result.hit) {
      playSound('hit');
      status.textContent = result.sunk ? `CPU sunk one of your ships at ${shot}.` : `CPU hit at ${shot}.`;
    } else {
      playSound('tap');
      status.textContent = `CPU missed at ${shot}.`;
    }

    if (fleetSunk(playerShips)) {
      gameOver = true;
      status.textContent = 'Defeat. CPU sunk your fleet.';
      playSound('lose');
    } else {
      turn = 'player';
    }
    render();
  }

  function renderBoard(target, { showShips, onClick, shots, occupied, disabled }) {
    target.replaceChildren();
    for (let r = 0; r < BOARD_SIZE; r += 1) {
      for (let c = 0; c < BOARD_SIZE; c += 1) {
        const key = cellKey(r, c);
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'game-cell sea-cell';
        if (showShips && occupied.has(key)) cell.classList.add('game-ship');
        if (shots.has(key)) {
          const isHit = occupied.has(key);
          cell.classList.add(isHit ? 'game-hit' : 'game-miss');
          cell.textContent = isHit ? 'X' : 'o';
        }
        cell.disabled = gameOver || disabled;
        cell.addEventListener('click', () => onClick(r, c));
        target.appendChild(cell);
      }
    }
  }

  function render() {
    let nextStatus = status.textContent;
    if (phase === 'placing') {
      nextStatus = `Place ship ${placingIndex + 1}/${SHIPS.length} (size ${SHIPS[placingIndex]}), horizontal.`;
    } else if (!gameOver && turn === 'player') {
      nextStatus = 'Your turn. Fire on enemy waters.';
    }
    status.textContent = nextStatus;

    renderBoard(playerBoard, {
      showShips: true,
      onClick: placePlayerShip,
      shots: cpuShots,
      occupied: playerOccupied,
      disabled: phase !== 'placing'
    });

    renderBoard(cpuBoard, {
      showShips: gameOver,
      onClick: playerShoot,
      shots: playerShots,
      occupied: cpuOccupied,
      disabled: phase !== 'battle' || turn !== 'player'
    });

    cpuBoard.classList.toggle('active-turn', phase === 'battle' && turn === 'player' && !gameOver);
  }

  function resetGame() {
    phase = 'placing';
    placingIndex = 0;
    playerOccupied = new Set();
    playerShips = [];
    cpuOccupied = new Set();
    cpuShips = [];
    playerShots = new Set();
    cpuShots = new Set();
    turn = 'player';
    gameOver = false;
    render();
  }

  mountShell(container, { options, status, board: boardWrap, toolbar });
  resetGame();
}
