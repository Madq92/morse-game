import {boardConnections, mountingHoles, nodes} from '../data/gameData';

// SVG y coordinate for lamp: svg_y = 100 - data_y (same as trace lines)
function sy(dataY) {
    return 100 - dataY;
}

// Lamp rendered as SVG elements inside the main board SVG
function SvgLamp({node, isActive}) {
    const {lampType, orientation, labelPosition, letter} = node;
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
                <circle cx={cx} cy={cy} r="2" className={`lamp-svg circle ${isActive ? 'active' : ''}`}/>
                <text x={labelPosition === 'left' ? cx - 3.5 : labelPosition === 'right' ? cx + 3.5 : cx}
                      y={labelPosition === 'above' ? cy - 5 : labelPosition === 'below' ? cy + 5 : cy}
                      textAnchor={labelPosition === 'left' ? 'end' : labelPosition === 'right' ? 'start' : 'middle'}
                      className={`lamp-label-svg ${labelPosition || 'below'}`}>
                    {letter}
                </text>
            </g>
        );
    }

    // Square lamps
    const isH = orientation === 'horizontal';
    const w = isH ? 5 : 2.5;
    const h = isH ? 2.5 : 5;
    return (
        <g className={`lamp-group ${isActive ? 'is-active' : ''}`}>
            {isActive && (
                <>
                    <rect x={cx - w/2} y={cy - h/2} width={w} height={h} rx="0.5" fill="none"
                          className="lamp-ripple ripple-1" />
                    <rect x={cx - w/2} y={cy - h/2} width={w} height={h} rx="0.5" fill="none"
                          className="lamp-ripple ripple-2" />
                </>
            )}
            <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx="0.5"
                  className={`lamp-svg square-${orientation} ${isActive ? 'active' : ''}`}/>
            <text x={labelPosition === 'left' ? cx - w / 2 - 1.5 : labelPosition === 'right' ? cx + w / 2 + 1.5 : cx}
                  y={labelPosition === 'above' ? cy - h / 2 - 1.5 : labelPosition === 'below' ? cy + h / 2 + 3 : cy + 1}
                  textAnchor={labelPosition === 'left' ? 'end' : labelPosition === 'right' ? 'start' : 'middle'}
                  className={`lamp-label-svg ${labelPosition || 'below'}`}>
                {letter}
            </text>
        </g>
    );
}

function BoardSvg({activePath, isPressing}) {
    const activeEdges = new Set();
    for (let i = 1; i < activePath.length; i++) {
        activeEdges.add(`${activePath[i - 1]}->${activePath[i]}`);
    }
    const activeNodeIds = new Set(activePath);

    return (
        <svg className="board-lines" viewBox="0 0 100 140" preserveAspectRatio="xMidYMid meet">
            {/* PCB trace lines - background */}
            {Object.entries(boardConnections).map(([key, d]) => {
                const isActive = activeEdges.has(key);
                const [, toId] = key.split('->');
                const toNode = nodes[toId];
                const isAmber = toNode?.lampType === 'square';

                return (
                    <g key={key}>
                        <path d={d} className="line" vectorEffect="non-scaling-stroke"/>
                        {isActive && (
                            <path d={d} pathLength="1"
                                  className={`line-active ${isAmber ? 'amber' : 'green'}`}
                                  vectorEffect="non-scaling-stroke"/>
                        )}
                    </g>
                );
            })}

            {/* Antenna - extends downward from root at bottom of board */}
            <g className={`antenna ${isPressing ? 'live' : ''}`}>
                <line x1="50" y1={sy(10)} x2="50" y2={sy(10) + 8} className="antenna-stem" stroke="#d2e6e2d9"
                      strokeWidth="0.6"/>
                <polygon points={`48,${sy(10)} 52,${sy(10)} 50,${sy(10) + 6}`} fill="#a0c8c899"/>
                <circle cx="50" cy={sy(10)} r="0.8" className="antenna-base"/>
            </g>

            {/* Lamps - all rendered in SVG for perfect alignment */}
            {Object.values(nodes).map((node) => {
                if (node.id === 'root') return null;
                return (
                    <SvgLamp key={node.id} node={node} isActive={activeNodeIds.has(node.id)}/>
                );
            })}

            {/* Speaker component */}
            <g className={`component component-speaker ${isPressing ? 'live' : ''}`}>
                <rect x="72" y="116" width="12" height="8" rx="1"/>
                <circle cx="78" cy="120" r="2.5" className="speaker-dot"/>
                <circle cx="78" cy="120" r="3.6" fill="none" className="speaker-wave wave-1"/>
                <circle cx="78" cy="120" r="7" fill="none" className="speaker-wave wave-2"/>
                <circle cx="78" cy="120" r="10.5" fill="none" className="speaker-wave wave-3"/>
                <text x="75" y="113" className="component-label">SPK</text>
            </g>

            {/* Mounting holes */}
            {mountingHoles.map((h, i) => (
                <circle key={`hole-${i}`} cx={h.cx} cy={h.cy} r="2.5" className={`mounting-hole ${h.className}`}/>
            ))}

        </svg>
    );
}

export default function Board({activePath, isPressing, children}) {
    return (
        <div className="board-stage">
            <div className={`board ${isPressing ? 'pressing' : ''}`}>
                <div className="board-surface" aria-hidden="true"/>
                <div className="board-sheen" aria-hidden="true"/>
                <div className="board-mask" aria-hidden="true"/>
                <BoardSvg activePath={activePath} isPressing={isPressing}/>
            </div>
            <div className="board-shadow" aria-hidden="true"/>
            {children}
        </div>
    );
}
