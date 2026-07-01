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

const MODES = [
  ['cpu', '1P vs CPU'],
  ['2p', '2 Players']
];

const BALLS_PER_INNINGS = 6;
const MAX_WICKETS = 3;

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
  let innings = 1;
  let batting = 1;
  let gameOver = false;
  let target = null;
  let cpuTimer = null;
  let lastDigit = null;

  let teams = makeTeams();

  const status = createStatus('');
  const board = document.createElement('div');
  board.className = 'book-cricket-board';

  const options = document.createElement('div');
  options.className = 'game-options';
  const modeSelect = createSelect(MODES, mode, (value) => {
    mode = value;
    restart();
  });
  options.append(createOptionRow('Mode', modeSelect));

  const toolbar = createToolbar([
    { label: 'Flip Page', primary: true, action: () => humanFlip() },
    { label: 'New Match', action: () => restart() }
  ]);

  mountShell(container, { options, status, board, toolbar });

  function makeTeams() {
    return {
      1: { name: 'Player 1', score: 0, balls: 0, wickets: 0 },
      2: { name: mode === 'cpu' ? 'CPU' : 'Player 2', score: 0, balls: 0, wickets: 0 }
    };
  }

  function clearCpuTimer() {
    if (cpuTimer) {
      clearTimeout(cpuTimer);
      cpuTimer = null;
    }
  }

  function animateStatus() {
    if (api.settings?.reducedMotion) return;
    status.animate(
      [
        { transform: 'translateY(2px)', opacity: 0.8 },
        { transform: 'translateY(0)', opacity: 1 }
      ],
      { duration: 220, easing: 'ease-out' }
    );
  }

  function setStatus(text) {
    status.textContent = text;
    animateStatus();
  }

  function battingTeam() {
    return teams[batting];
  }

  function inningsOver(team) {
    return team.balls >= BALLS_PER_INNINGS || team.wickets >= MAX_WICKETS;
  }

  function randomDigit() {
    return Math.floor(Math.random() * 10);
  }

  function inningsBanner() {
    if (innings === 1) {
      return `${battingTeam().name} batting - ${battingTeam().balls}/${BALLS_PER_INNINGS} balls`;
    }
    return `${battingTeam().name} chasing ${target + 1}`;
  }

  function pageText(digit) {
    if (digit === null || digit === undefined) return '–';
    return digit === 0 ? 'OUT' : String(digit);
  }

  function paintBoard() {
    board.innerHTML = '';

    const isOut = lastDigit === 0;
    const foot = lastDigit === null ? 'tap Flip Page' : isOut ? 'wicket!' : `run${lastDigit === 1 ? '' : 's'}`;

    const book = document.createElement('div');
    book.className = 'bc-book';
    book.id = 'bcBook';
    book.innerHTML = `
      <div class="bc-page bc-page-left">
        <span class="bc-page-corner">Notebook</span>
        <span class="bc-page-lines" aria-hidden="true"></span>
        <span class="bc-page-foot">flip to score</span>
      </div>
      <div class="bc-spine" aria-hidden="true"></div>
      <div class="bc-page bc-page-right">
        <span class="bc-page-kicker">Page flip</span>
        <span class="bc-cur-num${isOut ? ' is-out' : ''}">${pageText(lastDigit)}</span>
        <span class="bc-page-foot">${foot}</span>
      </div>
      <div class="bc-leaf" aria-hidden="true"><span class="bc-leaf-num"></span></div>
    `;

    const scoreboard = document.createElement('div');
    scoreboard.className = 'bc-scoreboard';
    scoreboard.innerHTML = `
      <div class="bc-inning">Innings ${innings} · ${inningsBanner()}</div>
      <div class="bc-teams">
        <div class="bc-team${batting === 1 ? ' is-batting' : ''}">
          <span class="bc-team-name">${teams[1].name}</span>
          <b class="bc-team-score">${teams[1].score}/${teams[1].wickets}</b>
          <small>${teams[1].balls} balls</small>
        </div>
        <div class="bc-team${batting === 2 ? ' is-batting' : ''}">
          <span class="bc-team-name">${teams[2].name}</span>
          <b class="bc-team-score">${teams[2].score}/${teams[2].wickets}</b>
          <small>${teams[2].balls} balls</small>
        </div>
      </div>
    `;

    board.append(book, scoreboard);
  }

  function flipVisual(prevDigit) {
    if (api.settings?.reducedMotion) return;
    const book = board.querySelector('#bcBook');
    if (!book) return;
    const leaf = book.querySelector('.bc-leaf');
    const leafNum = leaf.querySelector('.bc-leaf-num');
    leafNum.textContent = prevDigit === null || prevDigit === undefined ? '' : pageText(prevDigit);
    leaf.classList.remove('is-flipping');
    // force reflow so the animation restarts on every flip
    void leaf.offsetWidth;
    leaf.classList.add('is-flipping');
  }

  function endMatch() {
    gameOver = true;
    clearCpuTimer();
    const p1 = teams[1].score;
    const p2 = teams[2].score;
    if (p1 === p2) {
      setStatus('Match tied!');
      playFx('tap');
      save('book-cricket', 'draws', 1);
      paintBoard();
      return;
    }

    const winner = p1 > p2 ? 1 : 2;
    setStatus(`${teams[winner].name} wins by ${Math.abs(p1 - p2)} runs!`);
    playFx('win');
    save('book-cricket', winner === 1 ? 'p1Wins' : 'p2Wins', 1);
    if (winner === 1) {
      api.onWin?.({ game: 'book-cricket', winner: 'player-1', margin: Math.abs(p1 - p2) });
    }
    paintBoard();
  }

  function startSecondInnings() {
    innings = 2;
    batting = 2;
    target = teams[1].score;
    lastDigit = null;
    const intros = shuffle([
      `${teams[2].name} now batting. Target: ${target + 1}.`,
      `Chase begins. ${teams[2].name} need ${target + 1}.`,
      `${teams[2].name} start innings 2, chasing ${target + 1}.`
    ]);
    setStatus(intros[0]);
    paintBoard();
    maybeCpuTurn();
  }

  function handleInningsProgress() {
    const striker = battingTeam();
    if (innings === 2 && striker.score > target) {
      endMatch();
      return;
    }
    if (!inningsOver(striker)) {
      maybeCpuTurn();
      return;
    }
    if (innings === 1) {
      startSecondInnings();
      return;
    }
    endMatch();
  }

  function playBall() {
    if (gameOver) return;
    const striker = battingTeam();
    const prevDigit = lastDigit;
    const pageDigit = randomDigit();
    lastDigit = pageDigit;
    striker.balls += 1;

    if (pageDigit === 0) {
      striker.wickets += 1;
      playFx('hit');
      setStatus(`${striker.name} is OUT on ball ${striker.balls}!`);
    } else {
      striker.score += pageDigit;
      playFx('eat');
      const messages = shuffle([
        `${striker.name} scores ${pageDigit} run${pageDigit === 1 ? '' : 's'}!`,
        `${pageDigit} from the page flip for ${striker.name}.`,
        `${striker.name} collects ${pageDigit}.`
      ]);
      setStatus(messages[0]);
      save('book-cricket', 'runs', pageDigit);
    }

    save('book-cricket', 'balls', 1);
    paintBoard();
    flipVisual(prevDigit);
    handleInningsProgress();
  }

  function maybeCpuTurn() {
    clearCpuTimer();
    if (gameOver || mode !== 'cpu' || batting !== 2) return;
    const line = randPick([
      'CPU flips the next page...',
      'CPU is thinking...',
      'CPU turns a page...'
    ]);
    setStatus(line);
    cpuTimer = window.setTimeout(() => {
      playBall();
    }, 520);
  }

  function humanFlip() {
    if (gameOver) return;
    if (mode === 'cpu' && batting === 2) {
      setStatus('Wait for CPU innings to finish.');
      return;
    }
    playBall();
  }

  function restart() {
    clearCpuTimer();
    innings = 1;
    batting = 1;
    gameOver = false;
    target = null;
    lastDigit = null;
    teams = makeTeams();
    setStatus('Flip a page to start batting.');
    paintBoard();
  }

  restart();

  return () => {
    clearCpuTimer();
  };
}
