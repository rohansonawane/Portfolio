import {
  createOptionRow,
  createSelect,
  createAiModeRow,
  createStatus,
  createToolbar,
  mountShell,
  playGameSound,
  randPick,
  bumpScore
} from '../game-common.js';

const MAX_WRONG = 6;
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const LETTER_FREQ = 'ETAOINSHRDLCUMWFGYPBVKJXQZ'.split('');
const WORD_BANK = [
  'ALGORITHM',
  'FUNCTION',
  'VARIABLE',
  'DATABASE',
  'JAVASCRIPT',
  'PYTHON',
  'DEBUGGING',
  'COMPILER',
  'FRAMEWORK',
  'COMPONENT',
  'NOTEBOOK',
  'PENCIL',
  'HOMEWORK',
  'CLASSROOM',
  'TEACHER',
  'STUDENT',
  'SCIENCE',
  'MATH',
  'HISTORY',
  'GEOGRAPHY',
  'LIBRARY',
  'CHALKBOARD',
  'PROJECT',
  'EXAMINATION',
  'SCHEDULE',
  'LECTURE',
  'ASSIGNMENT',
  'SEMESTER',
  'SCHOLARSHIP',
  'GRADUATION'
];

function filterWords(level) {
  if (level === 'short') return WORD_BANK.filter((w) => w.length <= 6);
  if (level === 'medium') return WORD_BANK.filter((w) => w.length >= 7 && w.length <= 9);
  if (level === 'long') return WORD_BANK.filter((w) => w.length >= 10);
  return WORD_BANK;
}

export function mount(container, api = {}) {
  let difficulty = 'all';
  let word = '';
  let guessed = new Set();
  let wrongGuesses = 0;
  let gameOver = false;
  let won = false;
  let hintUsed = false;
  let aiMode = 'off';
  let aiTimer = null;

  const status = createStatus('');
  const puzzle = document.createElement('div');
  puzzle.className = 'hangman-word';

  const keyboard = document.createElement('div');
  keyboard.className = 'game-board hangman-keys';
  keyboard.style.gridTemplateColumns = 'repeat(9, minmax(26px, 1fr))';

  const difficultySelect = createSelect(
    [
      ['all', 'All'],
      ['short', 'Short (<=6)'],
      ['medium', 'Medium (7-9)'],
      ['long', 'Long (10+)']
    ],
    difficulty,
    (next) => {
      difficulty = next;
      resetRound();
    }
  );
  const options = document.createElement('div');
  options.className = 'game-options';
  options.append(
    createOptionRow('Difficulty', difficultySelect),
    createAiModeRow(aiMode, (next) => {
      aiMode = next;
      syncAiTimer();
    })
  );

  const toolbar = createToolbar([
    { label: 'Hint', action: () => useHint(), primary: false },
    { label: 'New Word', action: () => resetRound(), primary: true }
  ]);

  function playSound(type) {
    if (typeof api.playSound === 'function') api.playSound(type);
    else playGameSound(type, api.settings || api);
  }

  function chooseWord() {
    const filtered = filterWords(difficulty);
    word = randPick(filtered.length ? filtered : WORD_BANK);
  }

  function maskedWord() {
    return word
      .split('')
      .map((ch) => (guessed.has(ch) ? ch : '_'))
      .join(' ');
  }

  function hasWon() {
    return word.split('').every((ch) => guessed.has(ch));
  }

  function guessLetter(letter) {
    if (gameOver || guessed.has(letter)) return;
    guessed.add(letter);
    if (!word.includes(letter)) {
      wrongGuesses += 1;
      playSound('lose');
    } else {
      playSound('tap');
    }

    if (hasWon()) {
      gameOver = true;
      won = true;
      bumpScore('hangman', 'wins', 1);
      playSound('win');
      api.onWin?.({ game: 'hangman', word });
    } else if (wrongGuesses >= MAX_WRONG) {
      gameOver = true;
      won = false;
      playSound('lose');
    }
    render();
  }

  function aiPickLetter() {
    for (const letter of LETTER_FREQ) {
      if (!guessed.has(letter)) return letter;
    }
    return LETTERS.find((letter) => !guessed.has(letter));
  }

  function syncAiTimer() {
    if (aiTimer) {
      clearInterval(aiTimer);
      aiTimer = null;
    }
    if (aiMode === 'assist' && !gameOver) {
      aiTimer = window.setInterval(() => {
        if (gameOver) return;
        const letter = aiPickLetter();
        if (letter) guessLetter(letter);
      }, 1800);
    }
  }

  function useHint() {
    if (gameOver || hintUsed) return;
    const hidden = word.split('').filter((ch) => !guessed.has(ch));
    if (!hidden.length) return;
    const reveal = randPick(hidden);
    guessed.add(reveal);
    hintUsed = true;
    playSound('flag');
    if (hasWon()) {
      gameOver = true;
      won = true;
      bumpScore('hangman', 'wins', 1);
      playSound('win');
      api.onWin?.({ game: 'hangman', word });
    }
    render();
  }

  function renderKeyboard() {
    keyboard.replaceChildren();
    LETTERS.forEach((letter) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'game-cell hangman-key';
      btn.textContent = letter;
      btn.disabled = guessed.has(letter) || gameOver;
      btn.addEventListener('click', () => guessLetter(letter));
      keyboard.appendChild(btn);
    });
  }

  function render() {
    puzzle.textContent = maskedWord();
    renderKeyboard();
    const missesLeft = MAX_WRONG - wrongGuesses;

    if (gameOver) {
      status.textContent = won
        ? `You won! Word: ${word} (${missesLeft} misses left).`
        : `You lost! Word was ${word}.`;
      return;
    }

    status.textContent = `Wrong guesses: ${wrongGuesses}/${MAX_WRONG} · Misses left: ${missesLeft}${hintUsed ? ' · Hint used' : ''}`;
  }

  function resetRound() {
    chooseWord();
    guessed = new Set();
    wrongGuesses = 0;
    gameOver = false;
    won = false;
    hintUsed = false;
    render();
  }

  const gameWrap = document.createElement('div');
  gameWrap.className = 'hangman-wrap';
  gameWrap.append(puzzle, keyboard);

  mountShell(container, { options, status, board: gameWrap, toolbar });
  resetRound();
  syncAiTimer();

  return () => {
    if (aiTimer) clearInterval(aiTimer);
  };
}
