import { nodes, boardConnections, mountingHoles, vias, allLampIds } from '../data/gameData';

// SVG y coordinate for lamp: svg_y = 100 - data_y (same as trace lines)
function sy(dataY) {
  return 100 - dataY;
}

// Lamp rendered as SVG elements inside the main board SVG
function SvgLamp({ node, isActive }) {
  const { lampType, orientation, labelPosition, letter } = node;
  const cx = node.x;
  const cy = sy(node.y);

  if (lampType === 'circle') {
    return (
      <g className={`lamp-group ${isActive ? 'is-active' : ''}`}>
        <circle cx={cx} cy={cy} r="5" className={`lamp-svg circle ${isActive ? 'active' : ''}`} />
        <text x={cx} y={labelPosition === 'above' ? cy - 7 : labelPosition === 'below' ? cy + 10 : cy}
              textAnchor={labelPosition === 'left' ? 'end' : labelPosition === 'right' ? 'start' : 'middle'}
              className={`lamp-label-svg ${labelPosition || 'below'}`}>
          {letter}
        </text>
      </g>
    );
  }

  // Square lamps
  const isH = orientation === 'horizontal';
  const w = isH ? 7 : 3.5;
  const h = isH ? 3.5 : 7;
  return (
    <g className={`lamp-group ${isActive ? 'is-active' : ''}`}>
      <rect x={cx - w/2} y={cy - h/2} width={w} height={h} rx="0.5"
            className={`lamp-svg square-${orientation} ${isActive ? 'active' : ''}`} />
      <text x={labelPosition === 'left' ? cx - w/2 - 1.5 : labelPosition === 'right' ? cx + w/2 + 1.5 : cx}
            y={labelPosition === 'above' ? cy - h/2 - 1.5 : labelPosition === 'below' ? cy + h/2 + 3.5 : cy + 1}
            textAnchor={labelPosition === 'left' ? 'end' : labelPosition === 'right' ? 'start' : 'middle'}
            className={`lamp-label-svg ${labelPosition || 'below'}`}>
        {letter}
      </text>
    </g>
  );
}

function BoardSvg({ activePath, isPressing }) {
  const activeEdges = new Set();
  for (let i = 1; i < activePath.length; i++) {
    activeEdges.add(`${activePath[i - 1]}->${activePath[i]}`);
  }
  const activeNodeIds = new Set(activePath);

  return (
    <svg className="board-lines" viewBox="0 0 100 140" preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="glow-green">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glow-amber">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* PCB trace lines - background */}
      {Object.entries(boardConnections).map(([key, d]) => {
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

      {/* Antenna - extends downward from root at bottom of board */}
      <g className={`antenna ${isPressing ? 'live' : ''}`}>
        <line x1="50" y1={sy(10)} x2="50" y2={sy(10) + 8} className="antenna-stem" stroke="#d2e6e2d9" strokeWidth="0.6" />
        <polygon points={`48,${sy(10)} 52,${sy(10)} 50,${sy(10) + 6}`} fill="#a0c8c899" />
        <circle cx="50" cy={sy(10)} r="0.8" className="antenna-base" />
          <circle cx="50" cy={sy(2)} r="0.8" className="antenna-base" />
      </g>

      {/* Lamps - all rendered in SVG for perfect alignment */}
      {Object.values(nodes).map((node) => {
        if (node.id === 'root') return null;
        return (
          <SvgLamp key={node.id} node={node} isActive={activeNodeIds.has(node.id)} />
        );
      })}

      {/* Speaker component */}
      <g className={`component component-speaker ${isPressing ? 'live' : ''}`}>
        <rect x="72" y="116" width="12" height="8" rx="1" />
        <circle cx="78" cy="120" r="2.5" className="speaker-dot" />
        <circle cx="78" cy="120" r="3.6" fill="none" className="speaker-wave wave-1" />
        <circle cx="78" cy="120" r="7" fill="none" className="speaker-wave wave-2" />
        <circle cx="78" cy="120" r="10.5" fill="none" className="speaker-wave wave-3" />
        <text x="75" y="113" className="component-label">SPK</text>
      </g>

      {/* Battery component */}
      {/*<g className="component component-battery">*/}
      {/*  <rect x="15" y="116" width="14" height="8" rx="1" />*/}
      {/*  <line x1="18" y1="118" x2="18" y2="122" />*/}
      {/*  <line x1="21" y1="118" x2="21" y2="122" />*/}
      {/*  <line x1="24" y1="118" x2="24" y2="122" />*/}
      {/*  <text x="18" y="115" className="component-label">BATT</text>*/}
      {/*</g>*/}

      {/* IC component */}
      {/*<g className="component component-ic">*/}
      {/*  <rect x="40" y="118" width="16" height="10" rx="1" />*/}
      {/*  <line x1="42" y1="119" x2="42" y2="127" />*/}
      {/*  <line x1="46" y1="119" x2="46" y2="127" />*/}
      {/*  <line x1="50" y1="119" x2="50" y2="127" />*/}
      {/*  <line x1="54" y1="119" x2="54" y2="127" />*/}
      {/*  <circle cx="42" cy="119" r="0.3" className="component-pin-mark" />*/}
      {/*  <text x="60" y="117" className="component-label">IC-MC</text>*/}
      {/*</g>*/}

      {/* Mounting holes */}
      {mountingHoles.map((h, i) => (
        <circle key={`hole-${i}`} cx={h.cx} cy={h.cy} r="2.5" className={`mounting-hole ${h.className}`} />
      ))}

      {/* Vias */}
      {/*<g className="vias">*/}
      {/*  {vias.map((v, i) => (*/}
      {/*    <circle key={`via-${i}`} cx={v.cx} cy={v.cy} r="0.8" />*/}
      {/*  ))}*/}
      {/*</g>*/}

      {/* Silkscreen text */}
      {/*<text x="50" y="3" className="silkscreen silkscreen-title" textAnchor="middle">MORSE DECODER</text>*/}
      {/*<text x="50" y="137" className="silkscreen silkscreen-brand" textAnchor="middle">SOFTCORE · PCB</text>*/}
    </svg>
  );
}

export default function Board({ activePath, isPressing, children }) {
  return (
    <div className="board-stage">
      <div className={`board ${isPressing ? 'pressing' : ''}`}>
        <div className="board-surface" aria-hidden="true" />
        <div className="board-sheen" aria-hidden="true" />
        <div className="board-mask" aria-hidden="true" />
        <BoardSvg activePath={activePath} isPressing={isPressing} />
      </div>
      <div className="board-shadow" aria-hidden="true" />
      {children}
    </div>
  );
}
