import { getActiveData, mountingHoles, NUMBER_PATTERNS } from '../data/gameData';

// SVG y coordinate: svg_y = 100 - data_y
function sy(dataY) {
  return 100 - dataY;
}

// -------- Letter mode: tree-based PCB --------
function SvgLamp({ node, isActive }) {
  const { lampType, orientation, labelPosition, letter } = node;
  const cx = node.x;
  const cy = sy(node.y);

  if (lampType === 'circle') {
    return (
      <g className={`lamp-group ${isActive ? 'is-active' : ''}`}>
        {isActive && (
          <>
            <circle cx={cx} cy={cy} r="2" fill="none" className="lamp-ripple ripple-1" />
            <circle cx={cx} cy={cy} r="2" fill="none" className="lamp-ripple ripple-2" />
          </>
        )}
        <circle cx={cx} cy={cy} r="2" className={`lamp-svg circle ${isActive ? 'active' : ''}`} />
        <text x={labelPosition === 'left' ? cx - 3.5 : labelPosition === 'right' ? cx + 3.5 : cx}
              y={labelPosition === 'above' ? cy - 5 : labelPosition === 'below' ? cy + 5 : cy}
              textAnchor={labelPosition === 'left' ? 'end' : labelPosition === 'right' ? 'start' : 'middle'}
              className={`lamp-label-svg ${labelPosition || 'below'}`}>
          {letter}
        </text>
      </g>
    );
  }

  const isH = orientation === 'horizontal';
  const w = isH ? 5 : 2.5;
  const h = isH ? 2.5 : 5;
  return (
    <g className={`lamp-group ${isActive ? 'is-active' : ''}`}>
      {isActive && (
        <>
          <rect x={cx - w/2} y={cy - h/2} width={w} height={h} rx="0.5" fill="none" className="lamp-ripple ripple-1" />
          <rect x={cx - w/2} y={cy - h/2} width={w} height={h} rx="0.5" fill="none" className="lamp-ripple ripple-2" />
        </>
      )}
      <rect x={cx - w/2} y={cy - h/2} width={w} height={h} rx="0.5"
            className={`lamp-svg square-${orientation} ${isActive ? 'active' : ''}`} />
      <text x={labelPosition === 'left' ? cx - w/2 - 1.5 : labelPosition === 'right' ? cx + w/2 + 1.5 : cx}
            y={labelPosition === 'above' ? cy - h/2 - 1.5 : labelPosition === 'below' ? cy + h/2 + 3 : cy + 1}
            textAnchor={labelPosition === 'left' ? 'end' : labelPosition === 'right' ? 'start' : 'middle'}
            className={`lamp-label-svg ${labelPosition || 'below'}`}>
        {letter}
      </text>
    </g>
  );
}

function BoardSvg({ activePath, isPressing }) {
  const { nodes, connections } = getActiveData('letter');
  const activeEdges = new Set();
  for (let i = 1; i < activePath.length; i++) {
    activeEdges.add(`${activePath[i - 1]}->${activePath[i]}`);
  }
  const activeNodeIds = new Set(activePath);

  return (
    <svg className="board-lines" viewBox="0 0 100 140" preserveAspectRatio="xMidYMid meet">
      {Object.entries(connections).map(([key, d]) => {
        const isActive = activeEdges.has(key);
        const [, toId] = key.split('->');
        const toNode = nodes[toId];
        const isAmber = toNode?.lampType === 'square';
        return (
          <g key={key}>
            <path d={d} className="line" vectorEffect="non-scaling-stroke" />
            {isActive && (
              <path d={d} pathLength="1"
                    className={`line-active ${isAmber ? 'amber' : 'green'}`}
                    vectorEffect="non-scaling-stroke" />
            )}
          </g>
        );
      })}
      {Object.entries(connections).map(([key, d]) => (
        <path key={`hl-${key}`} d={d} className="line-highlight" vectorEffect="non-scaling-stroke" />
      ))}

      <g className={`antenna ${isPressing ? 'live' : ''}`}>
        <line x1="50" y1={sy(10)} x2="50" y2={sy(10) + 8} className="antenna-stem" stroke="#d2e6e2d9" strokeWidth="0.6" />
        <polygon points={`48,${sy(10)} 52,${sy(10)} 50,${sy(10) + 6}`} fill="#a0c8c899" />
        <circle cx="50" cy={sy(10)} r="0.8" className="antenna-base" />
      </g>

      {Object.values(nodes).map((node) => {
        if (node.id === 'root') return null;
        return <SvgLamp key={node.id} node={node} isActive={activeNodeIds.has(node.id)} />;
      })}

      <g className={`component component-speaker ${isPressing ? 'live' : ''}`}>
        <rect x="72" y="116" width="12" height="8" rx="1" />
        <circle cx="78" cy="120" r="2.5" className="speaker-dot" />
        <circle cx="78" cy="120" r="3.6" fill="none" className="speaker-wave wave-1" />
        <circle cx="78" cy="120" r="7" fill="none" className="speaker-wave wave-2" />
        <circle cx="78" cy="120" r="10.5" fill="none" className="speaker-wave wave-3" />
        <text x="75" y="113" className="component-label">SPK</text>
      </g>

      {mountingHoles.map((h, i) => (
        <circle key={`hole-${i}`} cx={h.cx} cy={h.cy} r="2.5" className={`mounting-hole ${h.className}`} />
      ))}
    </svg>
  );
}

// -------- Number mode: grid of 10 cols × 5 rows --------
// Pattern char → lamp type
function isDot(ch) { return ch === '.'; }

// Grid positions: 10 columns (1-5 left, 6-0 right), 5 rows
const COLS = ['1','2','3','4','5','6','7','8','9','0'];
const colX = [14, 26, 38, 50, 62, 70, 78, 86, 94, 100]; // x center of each column
const rowY = [20, 36, 52, 68, 84]; // y center of each row

// Get grid position for digit d at row r (0-indexed)
function gx(d) { return colX[COLS.indexOf(d)]; }
function gy(r) { return rowY[r]; }

function NumberBoard({ currentInput }) {
  return (
    <svg className="board-lines" viewBox="0 0 110 140" preserveAspectRatio="xMidYMid meet">
      {/* Horizontal connecting lines between rows */}
      {[0,1,2,3].map((r) => {
        const y1 = rowY[r];
        const y2 = rowY[r+1];
        return COLS.map((d, ci) => {
          if (ci === 0) return null;
          const prev = COLS[ci-1];
          const patD = NUMBER_PATTERNS[d];
          const patP = NUMBER_PATTERNS[prev];
          // Connect adjacent columns if same symbol at this row
          if (patD[r] === patP[r]) {
            return (
              <line key={`h${r}-${d}`} x1={colX[ci-1]} y1={y1} x2={colX[ci]} y2={y1}
                    className="line" stroke="var(--line)" strokeWidth="1" />
            );
          }
          return null;
        });
      })}

      {/* Vertical tree connections — from each lamp upward to previous row */}
      {COLS.map((d) => {
        const pat = NUMBER_PATTERNS[d];
        return [1,2,3,4].map((r) => {
          // Connect row r up to row r-1 (same column)
          return (
            <line key={`v${d}-${r}`} x1={gx(d)} y1={rowY[r-1]} x2={gx(d)} y2={rowY[r]}
                  className="line" stroke="var(--line)" strokeWidth="1" />
          );
        });
      })}

      {/* Cross connections: where tree splits */}
      {/* Root trunk going up to row 4 */}
      <line x1={colX[5]} y1={98} x2={colX[5]} y2={rowY[4]} className="line" stroke="var(--line)" strokeWidth="1" />
      {/* Row 4 horizontal: connect 5 to 6 at the center */}
      <line x1={colX[4]} y1={rowY[4]} x2={colX[5]} y2={rowY[4]} className="line" stroke="var(--line)" strokeWidth="1" />

      {/* Lamps — ○ for dot, ▬ for dash */}
      {COLS.map((d) => {
        const pat = NUMBER_PATTERNS[d];
        const matches = pat.startsWith(currentInput);
        return pat.split('').map((ch, r) => {
          const cx = gx(d);
          const cy = rowY[r];
          const dot = isDot(ch);
          return (
            <g key={`${d}-${r}`} className={`lamp-group ${matches && r < currentInput.length ? 'is-active' : ''}`}>
              {dot ? (
                <circle cx={cx} cy={cy} r="2.5"
                        className={`lamp-svg circle ${matches && r < currentInput.length ? 'active' : ''}`} />
              ) : (
                <rect x={cx-3} y={cy-1.5} width="6" height="3" rx="0.5"
                      className={`lamp-svg square-horizontal ${matches && r < currentInput.length ? 'active' : ''}`} />
              )}
            </g>
          );
        });
      })}

      {/* Digit labels */}
      {COLS.map((d) => (
        <text key={`lab-${d}`} x={gx(d)} y={rowY[4] + 8} textAnchor="middle"
              className="lamp-label-svg">{d}</text>
      ))}

      {/* Root label */}
      <text x={colX[5]} y={106} textAnchor="middle" className="lamp-label-svg">ROOT</text>

      {/* Speaker */}
      <g className={`component component-speaker ${currentInput ? 'live' : ''}`}>
        <rect x="48" y="118" width="14" height="6" rx="1" />
        <circle cx="55" cy="121" r="1.8" className="speaker-dot" />
        <circle cx="55" cy="121" r="2.5" fill="none" className="speaker-wave wave-1" />
        <circle cx="55" cy="121" r="5" fill="none" className="speaker-wave wave-2" />
        <circle cx="55" cy="121" r="7.5" fill="none" className="speaker-wave wave-3" />
        <text x="52" y="116" className="component-label">SPK</text>
      </g>

      {mountingHoles.map((h, i) => (
        <circle key={`hole-${i}`} cx={h.cx} cy={h.cy} r="2.5" className={`mounting-hole ${h.className}`} />
      ))}
    </svg>
  );
}

// -------- Board wrapper --------
export default function Board({ activePath, isPressing, mode, currentInput, children }) {
  return (
    <div className="board-stage">
      <div className={`board ${isPressing ? 'pressing' : ''}`}>
        <div className="board-surface" aria-hidden="true" />
        <div className="board-sheen" aria-hidden="true" />
        <div className="board-mask" aria-hidden="true" />
        {mode === 'number' ? (
          <NumberBoard currentInput={currentInput} />
        ) : (
          <BoardSvg activePath={activePath} isPressing={isPressing} />
        )}
      </div>
      <div className="board-shadow" aria-hidden="true" />
      {children}
    </div>
  );
}
