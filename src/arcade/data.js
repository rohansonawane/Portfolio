export const ARCADE_ASSETS = '/assets/notebook-arcade/images';

export const ARCADE_LOGO = `${ARCADE_ASSETS}/logo.png`;
export const HERO_BACKGROUND = `${ARCADE_ASSETS}/hero-background.png`;

export function gameCardSrc(id) {
  return `${ARCADE_ASSETS}/${id}.png`;
}

export const ARCADE_GAMES = [
  {
    id: 'tic-tac-toe',
    title: 'Tic Tac Toe',
    category: 'strategy',
    categories: ['all', '2-player', 'strategy'],
    difficulty: 'Easy',
    players: '2 Local',
    time: '5 min',
    playable: true,
    rules: 'Take turns placing X and O on the 3×3 grid. First to get three in a row wins. Use hint for a suggested move or undo to rewind one turn.'
  },
  {
    id: 'sudoku',
    title: 'Sudoku',
    category: 'puzzle',
    categories: ['all', 'puzzle'],
    difficulty: 'Medium',
    players: '1 Player',
    time: '10–20 min',
    playable: true,
    rules: 'Fill the 9×9 grid so each row, column, and 3×3 box contains digits 1–9 without repetition.'
  },
  {
    id: 'snake',
    title: 'Snake',
    category: 'arcade',
    categories: ['all', 'arcade'],
    difficulty: 'Easy',
    players: '1 Player',
    time: '3–10 min',
    playable: true,
    rules: 'Guide the snake to eat food and grow longer without hitting walls or yourself.'
  },
  {
    id: 'book-cricket',
    title: 'Book Cricket',
    category: 'arcade',
    categories: ['all', 'arcade', '2-player'],
    difficulty: 'Easy',
    players: '2 Local',
    time: '5–15 min',
    playable: true,
    rules: 'Flip through pages. Last digit decides runs. Classic school notebook cricket rules.'
  },
  {
    id: 'dots-boxes',
    title: 'Dots & Boxes',
    category: 'strategy',
    categories: ['all', '2-player', 'strategy'],
    difficulty: 'Medium',
    players: '2 Local',
    time: '8–15 min',
    playable: true,
    rules: 'Connect dots to form boxes. Complete a box to score and take another turn.'
  },
  {
    id: 'sos',
    title: 'SOS',
    category: 'word',
    categories: ['all', 'word', '2-player'],
    difficulty: 'Medium',
    players: '2 Local',
    time: '5–10 min',
    playable: true,
    rules: 'Place letters S or O on a grid. Spell SOS in a line to score points.'
  },
  {
    id: 'hangman',
    title: 'Pencil Hangman',
    category: 'word',
    categories: ['all', 'word'],
    difficulty: 'Easy',
    players: '1–2',
    time: '5 min',
    playable: true,
    rules: 'Guess letters to reveal the hidden word before the stick figure is complete.'
  },
  {
    id: 'sea-battles',
    title: 'Sea Battles',
    category: 'strategy',
    categories: ['all', '2-player', 'strategy'],
    difficulty: 'Medium',
    players: '2 Local',
    time: '10–20 min',
    playable: true,
    rules: 'Hide ships on a grid and take turns calling coordinates to sink your opponent\'s fleet.'
  },
  {
    id: 'landmines',
    title: 'Landmines',
    category: 'puzzle',
    categories: ['all', 'puzzle'],
    difficulty: 'Hard',
    players: '1 Player',
    time: '5–15 min',
    playable: true,
    rules: 'Clear the board without detonating hidden mines. Numbers hint at adjacent bombs.'
  },
  {
    id: 'drop-dots',
    title: 'Drop Dots',
    category: 'arcade',
    categories: ['all', 'arcade', '2-player'],
    difficulty: 'Easy',
    players: '2 Local',
    time: '5 min',
    playable: true,
    rules: 'Drop colored tokens into columns. Connect four in a row to win.'
  },
  {
    id: 'doodle-maze',
    title: 'Doodle Maze',
    category: 'puzzle',
    categories: ['all', 'puzzle'],
    difficulty: 'Medium',
    players: '1 Player',
    time: '5–10 min',
    playable: true,
    rules: 'Navigate from start to finish through a hand-drawn style maze on notebook paper.'
  },
  {
    id: 'word-search',
    title: 'Word Search',
    category: 'word',
    categories: ['all', 'word', 'puzzle'],
    difficulty: 'Easy',
    players: '1 Player',
    time: '5–10 min',
    playable: true,
    rules: 'Find hidden words in a letter grid: horizontal, vertical, or diagonal.'
  },
  {
    id: 'coming-soon',
    title: 'Coming Soon',
    category: 'arcade',
    categories: ['all', 'arcade'],
    difficulty: 'TBD',
    players: 'TBD',
    time: 'TBD',
    playable: false,
    comingSoon: true,
    rules: 'More nostalgic notebook games are on the way. Check back for updates!'
  }
];

export const ARCADE_SLIDES = [
  {
    icon: 'bolt',
    grad: 'linear-gradient(135deg, #ffd93d, #ff9f43)',
    title: 'Quick Recess Challenge',
    desc: 'Jump into a game in under 10 seconds, perfect between classes or meetings.'
  },
  {
    icon: 'offline',
    grad: 'linear-gradient(135deg, #38c98c, #2d8cff)',
    title: '100% Offline',
    desc: 'Games run in your browser with local logic, no login, no server required.'
  },
  {
    icon: 'friends',
    grad: 'linear-gradient(135deg, #ff6bcb, #8a57ff)',
    title: 'Play With Friends',
    desc: 'Pass-the-device multiplayer for classic schoolyard favorites.'
  },
  {
    icon: 'brain',
    grad: 'linear-gradient(135deg, #7d6bff, #4f55ff)',
    title: 'Brain Boost',
    desc: 'Puzzles and word games to keep your mind sharp the fun way.'
  },
  {
    icon: 'daily',
    grad: 'linear-gradient(135deg, #2d8cff, #049EF4)',
    title: 'Daily Challenge',
    desc: 'New challenges and streaks coming soon. Stay tuned!'
  }
];

export const ARCADE_CATEGORIES = [
  { id: 'all', label: 'All', icon: 'grid', color: '#4f55ff', bg: 'rgba(79,85,255,.15)' },
  { id: 'puzzle', label: 'Puzzle', icon: 'puzzle', color: '#2d8cff', bg: 'rgba(45,140,255,.15)' },
  { id: '2-player', label: '2 Player', icon: 'users', color: '#ff6bcb', bg: 'rgba(255,107,180,.15)' },
  { id: 'word', label: 'Word', icon: 'text', color: '#38c98c', bg: 'rgba(56,201,140,.15)' },
  { id: 'arcade', label: 'Arcade', icon: 'joystick', color: '#ffd93d', bg: 'rgba(255,217,61,.15)' },
  { id: 'strategy', label: 'Strategy', icon: 'chess', color: '#8a57ff', bg: 'rgba(138,87,255,.15)' }
];

export const ARCADE_BUILT_WITH = [
  'JavaScript',
  'HTML5',
  'CSS3',
  'Vite',
  'LocalStorage'
];

export const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

export function getGameById(id) {
  return ARCADE_GAMES.find((g) => g.id === id) || null;
}

export function getDefaultSettings() {
  return { sound: true, music: false, animations: true, reducedMotion: false };
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem('na-settings');
    return raw ? { ...getDefaultSettings(), ...JSON.parse(raw) } : getDefaultSettings();
  } catch {
    return getDefaultSettings();
  }
}

export function saveSettings(settings) {
  localStorage.setItem('na-settings', JSON.stringify(settings));
}

export function loadScores() {
  try {
    return JSON.parse(localStorage.getItem('na-scores') || '{}');
  } catch {
    return {};
  }
}

export function saveScores(scores) {
  localStorage.setItem('na-scores', JSON.stringify(scores));
}

export function loadAchievements() {
  try {
    return JSON.parse(localStorage.getItem('na-achievements') || '[]');
  } catch {
    return [];
  }
}

export function unlockAchievement(id) {
  const list = loadAchievements();
  if (!list.includes(id)) {
    list.push(id);
    localStorage.setItem('na-achievements', JSON.stringify(list));
  }
  return list;
}
