const LOADERS = {
  'tic-tac-toe': () => import('../tic-tac-toe.js'),
  snake: () => import('./snake.js'),
  sudoku: () => import('./sudoku.js'),
  'book-cricket': () => import('./book-cricket.js'),
  'dots-boxes': () => import('./dots-boxes.js'),
  sos: () => import('./sos.js'),
  hangman: () => import('./hangman.js'),
  'sea-battles': () => import('./sea-battle.js'),
  landmines: () => import('./minesweeper.js'),
  'drop-dots': () => import('./drop-dots.js'),
  'doodle-maze': () => import('./maze.js'),
  'word-search': () => import('./word-search.js')
};

export function hasGame(id) {
  return Boolean(LOADERS[id]);
}

export async function mountGame(id, container, api) {
  const load = LOADERS[id];
  if (!load) return false;
  const mod = await load();
  mod.mount(container, api);
  return true;
}
