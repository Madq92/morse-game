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

const nodeDefs = [
  { id: 'root', letter: '', lampType: 'root', x: 50, y: 10, dot: 'E', dash: 'T', labelPosition: 'above' },
  { id: 'O', letter: 'O', lampType: 'square', orientation: 'horizontal', labelPosition: 'below', x: 12, y: 10 },
  { id: 'M', letter: 'M', lampType: 'square', orientation: 'horizontal', labelPosition: 'below', x: 25, y: 10, dot: 'G', dash: 'O' },
  { id: 'T', letter: 'T', lampType: 'square', orientation: 'horizontal', labelPosition: 'below', x: 38, y: 10, dot: 'N', dash: 'M' },
  { id: 'E', letter: 'E', lampType: 'circle', labelPosition: 'below', x: 62, y: 10, dot: 'I', dash: 'A' },
  { id: 'I', letter: 'I', lampType: 'circle', labelPosition: 'below', x: 74, y: 10, dot: 'S', dash: 'U' },
  { id: 'S', letter: 'S', lampType: 'circle', labelPosition: 'below', x: 85, y: 10, dot: 'H', dash: 'V' },
  { id: 'H', letter: 'H', lampType: 'circle', labelPosition: 'below', x: 95, y: 10 },
  { id: 'Q', letter: 'Q', lampType: 'square', orientation: 'horizontal', labelPosition: 'below', x: 12, y: 24 },
  { id: 'G', letter: 'G', lampType: 'circle', labelPosition: 'right', x: 25, y: 24, dot: 'Z', dash: 'Q' },
  { id: 'U', letter: 'U', lampType: 'square', orientation: 'vertical', labelPosition: 'left', x: 74, y: 24, dot: 'F' },
  { id: 'V', letter: 'V', lampType: 'square', orientation: 'vertical', labelPosition: 'below', x: 85, y: 24 },
  { id: 'Z', letter: 'Z', lampType: 'circle', labelPosition: 'below', x: 25, y: 34 },
  { id: 'F', letter: 'F', lampType: 'circle', labelPosition: 'below', x: 74, y: 34 },
  { id: 'Y', letter: 'Y', lampType: 'square', orientation: 'horizontal', labelPosition: 'below', x: 12, y: 50 },
  { id: 'K', letter: 'K', lampType: 'square', orientation: 'horizontal', labelPosition: 'above', x: 25, y: 50, dot: 'C', dash: 'Y' },
  { id: 'N', letter: 'N', lampType: 'circle', labelPosition: 'right', x: 38, y: 50, dot: 'D', dash: 'K' },
  { id: 'A', letter: 'A', lampType: 'square', orientation: 'vertical', labelPosition: 'left', x: 62, y: 50, dot: 'R', dash: 'W' },
  { id: 'R', letter: 'R', lampType: 'circle', labelPosition: 'below', x: 74, y: 50, dot: 'L' },
  { id: 'L', letter: 'L', lampType: 'circle', labelPosition: 'below', x: 85, y: 50 },
  { id: 'C', letter: 'C', lampType: 'circle', labelPosition: 'right', x: 25, y: 62 },
  { id: 'X', letter: 'X', lampType: 'square', orientation: 'horizontal', labelPosition: 'below', x: 25, y: 72 },
  { id: 'D', letter: 'D', lampType: 'circle', labelPosition: 'right', x: 38, y: 72, dot: 'B', dash: 'X' },
  { id: 'W', letter: 'W', lampType: 'square', orientation: 'vertical', labelPosition: 'left', x: 62, y: 72, dot: 'P', dash: 'J' },
  { id: 'P', letter: 'P', lampType: 'circle', labelPosition: 'below', x: 74, y: 72 },
  { id: 'B', letter: 'B', lampType: 'circle', labelPosition: 'below', x: 38, y: 84 },
  { id: 'J', letter: 'J', lampType: 'square', orientation: 'vertical', labelPosition: 'below', x: 62, y: 84 },
];

// Build the node map and tree links
export const nodes = Object.fromEntries(nodeDefs.map((n) => [n.id, n]));

// Tree: for each node, store dot/dash children at the node level
export function getChildNode(nodeId, symbol) {
  const node = nodes[nodeId];
  if (!node) return null;
  const childId = symbol === '.' ? node.dot : node.dash;
  return childId ? nodes[childId] : null;
}

// Traverse a full path of symbols to get the letter
export function traversePath(path) {
  let current = nodes['root'];
  for (const sym of path) {
    const childId = sym === '.' ? current.dot : current.dash;
    if (!childId) return null;
    current = nodes[childId];
  }
  return current;
}

// Board trace connections: parent -> child SVG paths (y inverted: svg_y = 100 - data_y)
export const boardConnections = {
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

// Board decoration: mounting holes, vias, etc.
export const mountingHoles = [
  { cx: 5, cy: 8, className: 'hole-tl' },
  { cx: 95, cy: 8, className: 'hole-tr' },
  { cx: 5, cy: 132, className: 'hole-bl' },
  { cx: 95, cy: 132, className: 'hole-br' },
];

export const vias = [
  { cx: 5, cy: 22 }, { cx: 5, cy: 60 }, { cx: 5, cy: 100 },
  { cx: 95, cy: 22 }, { cx: 95, cy: 60 }, { cx: 95, cy: 100 },
  { cx: 50, cy: 134 },
];

// Boot sequence stages: {at: ms from start, stage: string}
export const bootStages = [
  { at: 60, stage: 'board' },
  { at: 720, stage: 'silk' },
  { at: 1140, stage: 'trace' },
  { at: 1900, stage: 'ready' },
  { at: 2500, stage: 'live' },
];

// All lamp IDs for boot animation delay calculation
export const allLampIds = nodeDefs.filter((n) => n.id !== 'root').map((n) => n.id);
