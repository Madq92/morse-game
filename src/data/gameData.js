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

export const nodeDefs = [
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
  { id: 'V', letter: 'V', lampType: 'square', orientation: 'vertical', labelPosition: 'left', x: 85, y: 24 },
  { id: 'Z', letter: 'Z', lampType: 'circle', labelPosition: 'right', x: 25, y: 34 },
  { id: 'F', letter: 'F', lampType: 'circle', labelPosition: 'left', x: 74, y: 34 },
  { id: 'Y', letter: 'Y', lampType: 'square', orientation: 'horizontal', labelPosition: 'below', x: 12, y: 50 },
  { id: 'K', letter: 'K', lampType: 'square', orientation: 'horizontal', labelPosition: 'below', x: 25, y: 50, dot: 'C', dash: 'Y' },
  { id: 'N', letter: 'N', lampType: 'circle', labelPosition: 'right', x: 38, y: 50, dot: 'D', dash: 'K' },
  { id: 'A', letter: 'A', lampType: 'square', orientation: 'vertical', labelPosition: 'left', x: 62, y: 50, dot: 'R', dash: 'W' },
  { id: 'R', letter: 'R', lampType: 'circle', labelPosition: 'below', x: 74, y: 50, dot: 'L' },
  { id: 'L', letter: 'L', lampType: 'circle', labelPosition: 'below', x: 85, y: 50 },
  { id: 'C', letter: 'C', lampType: 'circle', labelPosition: 'right', x: 25, y: 62 },
  { id: 'X', letter: 'X', lampType: 'square', orientation: 'horizontal', labelPosition: 'below', x: 25, y: 72 },
  { id: 'D', letter: 'D', lampType: 'circle', labelPosition: 'right', x: 38, y: 72, dot: 'B', dash: 'X' },
  { id: 'W', letter: 'W', lampType: 'square', orientation: 'vertical', labelPosition: 'left', x: 62, y: 72, dot: 'P', dash: 'J' },
  { id: 'P', letter: 'P', lampType: 'circle', labelPosition: 'below', x: 74, y: 72 },
  { id: 'B', letter: 'B', lampType: 'circle', labelPosition: 'right', x: 38, y: 84 },
  { id: 'J', letter: 'J', lampType: 'square', orientation: 'vertical', labelPosition: 'left', x: 62, y: 84 },
];

// Build the node map and tree links
export const nodes = Object.fromEntries(nodeDefs.map((n) => [n.id, n]));

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

// Board decoration: mounting holes
export const mountingHoles = [
  { cx: 5, cy: 8, className: 'hole-tl' },
  { cx: 95, cy: 8, className: 'hole-tr' },
  { cx: 5, cy: 132, className: 'hole-bl' },
  { cx: 95, cy: 132, className: 'hole-br' },
];

// Boot sequence stages: {at: ms from start, stage: string}
export const bootStages = [
  { at: 60, stage: 'board' },
  { at: 720, stage: 'silk' },
  { at: 1140, stage: 'trace' },
  { at: 1900, stage: 'ready' },
  { at: 2500, stage: 'live' },
];

// --------------- Digit tree (0-9) — bus-style layout ---------------

export function makeConnections(nodeDefs) {
  const byId = Object.fromEntries(nodeDefs.map((n) => [n.id, n]));
  const conns = {};
  for (const node of nodeDefs) {
    for (const [branch, childId] of [['dot', node.dot], ['dash', node.dash]]) {
      if (!childId) continue;
      const child = byId[childId];
      const py = 100 - node.y;
      const cy = 100 - child.y;
      conns[`${node.id}->${childId}`] = `M${node.x},${py} H${child.x} V${cy}`;
    }
  }
  return conns;
}

export const digitNodeDefs = [
  // ---- d-root ----
  { id: 'd-root', letter: '', lampType: 'circle', x: 50, y: 10, dot: 'cb1', dash: 'db1', labelPosition: 'below' },

  // ---- dash bus
  { id: 'db1', letter: '', lampType: 'square', orientation: 'horizontal', labelPosition: 'below', x: 45, y: 10, dot: 'd6a', dash: 'db2' },
  { id: 'db2', letter: '', lampType: 'square', orientation: 'horizontal', labelPosition: 'below', x: 35, y: 10, dot: 'd7a', dash: 'db3' },
  { id: 'db3', letter: '', lampType: 'square', orientation: 'horizontal', labelPosition: 'below', x: 25, y: 10, dot: 'd8a', dash: 'db4' },
  { id: 'db4', letter: '', lampType: 'square', orientation: 'horizontal', labelPosition: 'below', x: 15, y: 10, dot: 'd9', dash: 'db5' },
  { id: 'db5', letter: '0', lampType: 'square', orientation: 'horizontal', labelPosition: 'above', x: 5, y: 10 },

  // ---- dot bus
  { id: 'cb1', letter: '', lampType: 'circle', labelPosition: 'below', x: 55, y: 10, dot: 'cb2', dash: 'd1a' },
  { id: 'cb2', letter: '', lampType: 'circle', labelPosition: 'below', x: 65, y: 10, dot: 'cb3', dash: 'd2a' },
  { id: 'cb3', letter: '', lampType: 'circle', labelPosition: 'below', x: 75, y: 10, dot: 'cb4', dash: 'd3a' },
  { id: 'cb4', letter: '', lampType: 'circle', labelPosition: 'below', x: 85, y: 10, dot: 'cb5', dash: 'd4' },
  { id: 'cb5', letter: '5', lampType: 'circle', labelPosition: 'above', x: 95, y: 10 },

  // ---- dash bus → left branches (digits 6,7,8,9) ----
  { id: 'd6a', letter: '', lampType: 'circle', labelPosition: 'below', x: 45, y: 25, dot: 'd6b' },
  { id: 'd6b', letter: '', lampType: 'circle', labelPosition: 'below', x: 45, y: 40, dot: 'd6c' },
  { id: 'd6c', letter: '', lampType: 'circle', labelPosition: 'below', x: 45, y: 55, dot: 'd6' },
  { id: 'd6',  letter: '6', lampType: 'circle', labelPosition: 'left', x: 45,  y: 70 },

  { id: 'd7a', letter: '', lampType: 'circle', labelPosition: 'below', x: 35, y: 25, dot: 'd7b' },
  { id: 'd7b', letter: '', lampType: 'circle', labelPosition: 'below', x: 35, y: 40, dot: 'd7' },
  { id: 'd7',  letter: '7', lampType: 'circle', labelPosition: 'left', x: 35, y: 55 },

  { id: 'd8a', letter: '', lampType: 'circle', labelPosition: 'left', x: 25, y: 25, dot: 'd8' },
  { id: 'd8',  letter: '8', lampType: 'circle', labelPosition: 'left', x: 25, y: 40 },

  { id: 'd9',  letter: '9', lampType: 'circle', labelPosition: 'left', x: 15, y: 25 },

  // ---- dot bus → right branches (digits 1,2,3,4) ----
  { id: 'd1a', letter: '', lampType: 'square', orientation: 'horizontal', labelPosition: 'right', x: 55, y: 25, dash: 'd1b' },
  { id: 'd1b', letter: '', lampType: 'square', orientation: 'horizontal', labelPosition: 'right', x: 55, y: 40, dash: 'd1c' },
  { id: 'd1c', letter: '', lampType: 'square', orientation: 'horizontal', labelPosition: 'right', x: 55, y: 55, dash: 'd1' },
  { id: 'd1',  letter: '1', lampType: 'square', orientation: 'horizontal', labelPosition: 'right', x: 55, y: 70 },

  { id: 'd2a', letter: '', lampType: 'square', orientation: 'horizontal', labelPosition: 'right', x: 65, y: 25, dash: 'd2b' },
  { id: 'd2b', letter: '', lampType: 'square', orientation: 'horizontal', labelPosition: 'right', x: 65, y: 40, dash: 'd2' },
  { id: 'd2',  letter: '2', lampType: 'square', orientation: 'horizontal', labelPosition: 'right', x: 65, y: 55 },

  { id: 'd3a', letter: '', lampType: 'square', orientation: 'horizontal', labelPosition: 'right', x: 75, y: 25, dash: 'd3' },
  { id: 'd3',  letter: '3', lampType: 'square', orientation: 'horizontal', labelPosition: 'right', x: 75, y: 40 },

  { id: 'd4',  letter: '4', lampType: 'square', orientation: 'horizontal', labelPosition: 'right', x: 85, y: 25 },
];

export const digitNodes = Object.fromEntries(digitNodeDefs.map((n) => [n.id, n]));
export const digitConnections = makeConnections(digitNodeDefs);
