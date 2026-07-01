export const GAME_GUIDES = {
  'tic-tac-toe': {
    goal: 'Get three of your marks in a row before your opponent.',
    steps: [
      'Players take turns placing X and O on empty cells.',
      'The first to line up three in a row (horizontal, vertical, or diagonal) wins.',
      'If all nine cells are filled with no winner, the game is a draw.'
    ],
    controls: [
      { label: 'Click a cell', detail: 'Place your mark on your turn.' },
      { label: 'Hint', detail: 'Highlights a smart suggested move.' },
      { label: 'Undo', detail: 'Rewind one turn (two in Vs CPU mode).' },
      { label: 'Mode', detail: 'Switch between 2 Players and Vs CPU.' },
      { label: 'CPU difficulty', detail: 'Easy picks random moves; Unbeatable uses perfect play.' }
    ],
    tips: [
      'Control the center cell when you can.',
      'Block your opponent when they are one move from winning.',
      'In Vs CPU on Unbeatable, play for a draw if you cannot force a win.'
    ]
  },
  sudoku: {
    goal: 'Fill every row, column, and 3×3 box with digits 1 through 9, no repeats.',
    steps: [
      'Tap a blank cell, then pick a number from the keypad.',
      'Use Check to validate your grid without finishing.',
      'Complete the puzzle with no conflicts to win.'
    ],
    controls: [
      { label: 'Number pad', detail: 'Enter 1–9 into the selected cell.' },
      { label: 'Clear', detail: 'Remove the number from the selected cell.' },
      { label: 'Hint', detail: 'Reveals one correct digit.' },
      { label: 'Difficulty', detail: 'Choose Easy, Medium, or Hard puzzle.' }
    ],
    tips: [
      'Red cells mean a duplicate in the same row, column, or box.',
      'Start with rows or boxes that already have the most given numbers.',
      'Pencil-mark mentally: if a cell can only be one number, fill it in.'
    ]
  },
  snake: {
    goal: 'Eat food, grow longer, and survive as long as possible.',
    steps: [
      'Steer the snake with arrow keys or the on-screen D-pad.',
      'Each food piece increases your score and length.',
      'The game ends if you hit a wall or your own tail.'
    ],
    controls: [
      { label: 'Arrow keys / D-pad', detail: 'Change direction (cannot reverse instantly).' },
      { label: 'Grid size', detail: 'Smaller boards are tighter; larger boards give more room.' },
      { label: 'Speed', detail: 'Slow, Normal, or Fast pacing.' },
      { label: 'Restart', detail: 'Start a fresh run after game over.' }
    ],
    tips: [
      'Plan two moves ahead so you do not trap yourself.',
      'Use the edges early, then move inward as you grow.',
      'Beat your high score to unlock a win celebration.'
    ]
  },
  'book-cricket': {
    goal: 'Score more runs than your opponent across two innings.',
    steps: [
      'Press Flip Page to reveal a random last digit (0–9).',
      '0 means out; other digits score that many runs.',
      'Each side gets up to 6 balls or 3 wickets, then innings switch.',
      'Higher total after both innings wins.'
    ],
    controls: [
      { label: 'Flip Page', detail: 'Reveal the next ball outcome.' },
      { label: 'Mode', detail: '1 Player vs CPU or 2 Players on one device.' },
      { label: 'New Match', detail: 'Reset scores and start over.' }
    ],
    tips: [
      'Three quick wickets can end an innings early.',
      'Aggressive flipping is fine in 2P; in vs CPU, every run counts.',
      'Watch the scoreboard to know when to play safe.'
    ]
  },
  'dots-boxes': {
    goal: 'Capture the most boxes by completing their four sides.',
    steps: [
      'On your turn, click an edge between two adjacent dots.',
      'If you close a box, you score 1 point and take another turn immediately.',
      'When all edges are drawn, the player with the most boxes wins.'
    ],
    controls: [
      { label: 'Click an edge', detail: 'Claim a line between two dots.' },
      { label: 'Grid size', detail: '3×3 or 4×4 box layout.' },
      { label: 'Reset', detail: 'Start a new match.' }
    ],
    tips: [
      'Avoid giving your opponent a chain of free boxes.',
      'Sacrifice one box if it forces them to open a longer chain for you.',
      'Count remaining boxes near the end to pick safe lines.'
    ]
  },
  sos: {
    goal: 'Spell SOS in a straight line to score. First to 5 points wins.',
    steps: [
      'Choose S or O, then tap an empty cell to place it.',
      'If your move completes SOS horizontally, vertically, or diagonally, you score.',
      'Scoring grants an extra turn. Most points when the board fills wins.'
    ],
    controls: [
      { label: 'Letter toggle', detail: 'Switch between placing S and O.' },
      { label: 'Tap a cell', detail: 'Place your chosen letter.' },
      { label: 'Reset', detail: 'Clear the board and scores.' }
    ],
    tips: [
      'Set up double threats where one letter creates two SOS lines.',
      'Block lines where your opponent is one letter away from SOS.',
      'Corners and center lines often create the most scoring chances.'
    ]
  },
  hangman: {
    goal: 'Guess the hidden word before you run out of wrong guesses.',
    steps: [
      'Click letter keys to guess.',
      'Correct letters appear in the word; wrong guesses reduce your remaining tries.',
      'You have 6 wrong guesses maximum. Reveal the full word to win.'
    ],
    controls: [
      { label: 'A–Z keys', detail: 'Guess one letter at a time.' },
      { label: 'Hint', detail: 'Reveals one hidden letter (one use per word).' },
      { label: 'Difficulty', detail: 'Filter words by length.' },
      { label: 'New Word', detail: 'Start another puzzle.' }
    ],
    tips: [
      'Start with common vowels: E, A, O, I.',
      'Then try frequent consonants: T, N, S, R.',
      'Use word length and revealed letters to narrow possibilities.'
    ]
  },
  'sea-battles': {
    goal: 'Sink all enemy ships before yours are destroyed.',
    steps: [
      'Placement phase: click cells to place your ships (auto horizontal).',
      'Battle phase: click the enemy grid to fire.',
      'Hits mark red; misses mark gray. Sink every enemy ship to win.'
    ],
    controls: [
      { label: 'Place ships', detail: 'Click your grid during setup.' },
      { label: 'Fire', detail: 'Click the enemy grid on your turn.' },
      { label: 'Reset', detail: 'Replay placement and battle.' }
    ],
    tips: [
      'Spread ships out so one shot cannot reveal multiple targets.',
      'After a hit, target adjacent cells to hunt the rest of the ship.',
      'Track misses to avoid wasting shots in cleared areas.'
    ]
  },
  landmines: {
    goal: 'Reveal every safe cell without detonating a mine.',
    steps: [
      'Left-click a cell to reveal it.',
      'Numbers show how many mines touch that cell.',
      'Flag suspected mines, then clear all safe cells to win.'
    ],
    controls: [
      { label: 'Left click', detail: 'Reveal a cell.' },
      { label: 'Right click / long press', detail: 'Place or remove a flag.' },
      { label: 'Difficulty', detail: '10, 15, or 20 mines on the 9×9 grid.' }
    ],
    tips: [
      'Your first click is always safe.',
      'Use flags on definite mines to avoid mis-clicks.',
      'When a 1 touches exactly one flagged cell, the other neighbors are safe.'
    ]
  },
  'drop-dots': {
    goal: 'Connect four of your tokens in a row before your opponent.',
    steps: [
      'Click a column to drop your token; it falls to the lowest open slot.',
      'Players alternate turns (Red vs Yellow).',
      'First to connect four horizontally, vertically, or diagonally wins.'
    ],
    controls: [
      { label: 'Click a column', detail: 'Drop your token.' },
      { label: 'Mode', detail: '2 Players or Vs CPU.' },
      { label: 'Difficulty', detail: 'Easy or Hard CPU (blocks and wins when possible).' }
    ],
    tips: [
      'Control the center columns for more winning lines.',
      'Watch for diagonal four-in-a-row traps.',
      'Block opponent threats before building your own line.'
    ]
  },
  'doodle-maze': {
    goal: 'Move from the green start to the yellow exit as quickly as you can.',
    steps: [
      'Use arrow keys or on-screen buttons to move one cell at a time.',
      'You cannot pass through walls.',
      'Reach the exit to finish; try to beat your time and step count.'
    ],
    controls: [
      { label: 'Arrow keys / buttons', detail: 'Move up, down, left, right.' },
      { label: 'Maze size', detail: '15×15, 21×21, or 27×27.' },
      { label: 'Regenerate', detail: 'Create a new random maze.' },
      { label: 'Reset', detail: 'Return to start on the current maze.' }
    ],
    tips: [
      'Follow one wall (left-hand or right-hand rule) if you get lost.',
      'Bigger mazes mean longer paths but more exploration.',
      'Fewer steps usually means you found a shorter route.'
    ]
  },
  'word-search': {
    goal: 'Find every hidden word in the letter grid.',
    steps: [
      'Words may run horizontally, vertically, or diagonally.',
      'Click and drag across letters, or click start and end cells.',
      'Find all listed words to complete the puzzle.'
    ],
    controls: [
      { label: 'Drag select', detail: 'Highlight letters in a straight line.' },
      { label: 'Click start + end', detail: 'Select a word with two taps.' },
      { label: 'Hint', detail: 'Highlights the first letter of an unfound word.' },
      { label: 'Theme', detail: 'Rotates word lists (school, tech, nature).' }
    ],
    tips: [
      'Scan for rare letter pairs like Q, X, or Z first.',
      'Found words stay highlighted in the list below the grid.',
      'Diagonals are easy to miss; check all eight directions.'
    ]
  },
  'coming-soon': {
    goal: 'New notebook games are being sketched in the margins.',
    steps: ['Check back soon for more recess favorites.'],
    controls: [],
    tips: ['Browse the arcade hub for games you can play right now.']
  }
};

export function getGameGuide(gameId) {
  return GAME_GUIDES[gameId] || {
    goal: 'Learn the rules and start playing.',
    steps: ['Open the Play tab to begin.'],
    controls: [],
    tips: []
  };
}
