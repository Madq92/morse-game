export const SPEED_TIERS = {
  slow: 280,
  medium: 200,
  fast: 130,
};

export const TIER_LABELS = {
  slow: '慢',
  medium: '中',
  fast: '快',
};

export function getTiming(baseMs) {
  return {
    tMs: baseMs,
    dashThresholdMs: 2 * baseMs,
    letterCommitMs: 3 * baseMs,
    wordCommitMs: 7 * baseMs,
  };
}

// -------- Letter tree (A-Z) --------
const letterDefs = [
  { id: 'root', letter: '', lampType: 'root', x: 50, y: 10, dot: 'E', dash: 'T' },
  { id: 'E', letter: 'E', lampType: 'circle', labelPosition: 'below', x: 62, y: 10, dot: 'I', dash: 'A' },
  { id: 'T', letter: 'T', lampType: 'square', orientation: 'horizontal', labelPosition: 'below', x: 38, y: 10, dot: 'N', dash: 'M' },
  { id: 'I', letter: 'I', lampType: 'circle', labelPosition: 'below', x: 74, y: 10, dot: 'S', dash: 'U' },
  { id: 'A', letter: 'A', lampType: 'square', orientation: 'vertical', labelPosition: 'left', x: 62, y: 50, dot: 'R', dash: 'W' },
  { id: 'N', letter: 'N', lampType: 'circle', labelPosition: 'right', x: 38, y: 50, dot: 'D', dash: 'K' },
  { id: 'M', letter: 'M', lampType: 'square', orientation: 'horizontal', labelPosition: 'below', x: 25, y: 10, dot: 'G', dash: 'O' },
  { id: 'S', letter: 'S', lampType: 'circle', labelPosition: 'below', x: 85, y: 10, dot: 'H', dash: 'V' },
  { id: 'U', letter: 'U', lampType: 'square', orientation: 'vertical', labelPosition: 'left', x: 74, y: 24, dot: 'F' },
  { id: 'R', letter: 'R', lampType: 'circle', labelPosition: 'below', x: 74, y: 50, dot: 'L' },
  { id: 'W', letter: 'W', lampType: 'square', orientation: 'vertical', labelPosition: 'left', x: 62, y: 72, dot: 'P', dash: 'J' },
  { id: 'D', letter: 'D', lampType: 'circle', labelPosition: 'right', x: 38, y: 72, dot: 'B', dash: 'X' },
  { id: 'K', letter: 'K', lampType: 'square', orientation: 'horizontal', labelPosition: 'below', x: 25, y: 50, dot: 'C', dash: 'Y' },
  { id: 'G', letter: 'G', lampType: 'circle', labelPosition: 'right', x: 25, y: 24, dot: 'Z', dash: 'Q' },
  { id: 'O', letter: 'O', lampType: 'square', orientation: 'horizontal', labelPosition: 'below', x: 12, y: 10 },
  { id: 'H', letter: 'H', lampType: 'circle', labelPosition: 'above', x: 95, y: 10 },
  { id: 'V', letter: 'V', lampType: 'square', orientation: 'vertical', labelPosition: 'left', x: 85, y: 24 },
  { id: 'F', letter: 'F', lampType: 'circle', labelPosition: 'left', x: 74, y: 34 },
  { id: 'L', letter: 'L', lampType: 'circle', labelPosition: 'below', x: 85, y: 50 },
  { id: 'P', letter: 'P', lampType: 'circle', labelPosition: 'below', x: 74, y: 72 },
  { id: 'J', letter: 'J', lampType: 'square', orientation: 'vertical', labelPosition: 'left', x: 62, y: 84 },
  { id: 'B', letter: 'B', lampType: 'circle', labelPosition: 'right', x: 38, y: 84 },
  { id: 'X', letter: 'X', lampType: 'square', orientation: 'horizontal', labelPosition: 'below', x: 25, y: 72 },
  { id: 'C', letter: 'C', lampType: 'circle', labelPosition: 'right', x: 25, y: 62 },
  { id: 'Y', letter: 'Y', lampType: 'square', orientation: 'horizontal', labelPosition: 'below', x: 12, y: 50 },
  { id: 'Z', letter: 'Z', lampType: 'circle', labelPosition: 'right', x: 25, y: 34 },
  { id: 'Q', letter: 'Q', lampType: 'square', orientation: 'horizontal', labelPosition: 'below', x: 12, y: 24 },
];

const letterConnections = {
  'root->E': 'M50,90 H62',
  'root->T': 'M50,90 H38',
  'E->I': 'M62,90 H74',
  'E->A': 'M62,90 V50',
  'I->S': 'M74,90 H85',
  'I->U': 'M74,90 V76',
  'S->H': 'M85,90 H95',
  'S->V': 'M85,90 V76',
  'U->F': 'M74,76 V66',
  'A->R': 'M62,50 H74',
  'A->W': 'M62,50 V28',
  'R->L': 'M74,50 H85',
  'W->P': 'M62,28 H74',
  'W->J': 'M62,28 V16',
  'T->N': 'M38,90 V50',
  'T->M': 'M38,90 H25',
  'M->G': 'M25,90 V76',
  'M->O': 'M25,90 H12',
  'G->Z': 'M25,76 V66',
  'G->Q': 'M25,76 H12',
  'N->D': 'M38,50 V28',
  'N->K': 'M38,50 H25',
  'K->C': 'M25,50 V38',
  'K->Y': 'M25,50 H12',
  'D->B': 'M38,28 V16',
  'D->X': 'M38,28 H25',
};

// -------- Number patterns (0-9) --------
// circle = dot, square = dash
export const NUMBER_PATTERNS = {
  '5': '.....',
  '4': '....-',
  '3': '...--',
  '2': '..---',
  '1': '.----',
  '6': '-....',
  '7': '--...',
  '8': '---..',
  '9': '----.',
  '0': '-----',
};

// Flat number tree — traversal only, no visual nodes except digits
const numberDefs = (() => {
  const defs = [
    { id: 'root', letter: '', dot: 'E', dash: 'T' },
    { id: 'E', letter: '', dot: 'I', dash: 'A' },
    { id: 'T', letter: '', dot: 'N', dash: 'M' },
    { id: 'I', letter: '', dot: 'S', dash: 'U' },
    { id: 'A', letter: '', dash: 'W' },
    { id: 'N', letter: '', dot: 'D' },
    { id: 'M', letter: '', dot: 'G', dash: 'O' },
    { id: 'S', letter: '', dot: 'H', dash: 'V' },
    { id: 'U', letter: '', dash: 'U1' },
    { id: 'W', letter: '', dash: 'J' },
    { id: 'D', letter: '', dot: 'B' },
    { id: 'G', letter: '', dot: 'Z' },
    { id: 'O', letter: '', dot: 'O1', dash: 'O2' },
    { id: 'H', letter: '', dot: '5', dash: '4' },
    { id: 'V', letter: '', dash: '3' },
    { id: 'U1', letter: '', dash: '2' },
    { id: 'J', letter: '', dash: 'J1' },
    { id: 'B', letter: '', dot: '6' },
    { id: 'Z', letter: '', dot: '7' },
    { id: 'O1', letter: '', dot: '8' },
    { id: 'O2', letter: '', dot: '9', dash: '0' },
    { id: 'J1', letter: '', dash: '1' },
  ];
  // Digit leaves
  for (let d = 0; d <= 9; d++) {
    defs.push({ id: String(d), letter: String(d) });
  }
  return defs.map((n) => ({ lampType: 'root', x: 0, y: 0, ...n }));
})();

// -------- Selectors --------
const letterNodes = Object.fromEntries(letterDefs.map((n) => [n.id, n]));
const numberNodes = Object.fromEntries(numberDefs.map((n) => [n.id, n]));

export function getActiveData(mode) {
  if (mode === 'number') {
    return { nodes: numberNodes, connections: {} };
  }
  return { nodes: letterNodes, connections: letterConnections };
}

// Board decoration
export const mountingHoles = [
  { cx: 5, cy: 8, className: 'hole-tl' },
  { cx: 95, cy: 8, className: 'hole-tr' },
  { cx: 5, cy: 132, className: 'hole-bl' },
  { cx: 95, cy: 132, className: 'hole-br' },
];

// Boot sequence stages
export const bootStages = [
  { at: 60, stage: 'board' },
  { at: 720, stage: 'silk' },
  { at: 1140, stage: 'trace' },
  { at: 1900, stage: 'ready' },
  { at: 2500, stage: 'live' },
];
