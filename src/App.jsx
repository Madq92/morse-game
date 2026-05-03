import { useEffect, useRef, useCallback, useState } from 'react';
import { useGameState } from './hooks/useGameState';
import { playDot, playDash } from './utils/audio';
import { nodes, nodeDefs, boardConnections, digitNodes, digitNodeDefs, digitConnections } from './data/gameData';
import OutputScreen from './components/OutputScreen';
import SpeedBar from './components/SpeedBar';
import Board from './components/Board';
import PressKey from './components/PressKey';
import FloatingLetters from './components/FloatingLetters';

export default function App() {
  const [mode, setMode] = useState('letters');

  const handleSymbol = useCallback((symbol) => {
    if (symbol === '.') playDot();
    else playDash();
  }, []);

  const treeNodes = mode === 'letters' ? nodes : digitNodes;

  const {
    output,
    speed,
    activePath,
    isPressing,
    floatingLetters,
    bootPhase,
    pressStart,
    pressEnd,
    setSpeed,
    startBoot,
    commitLetter,
    commitWord,
    resetToRoot,
    clearTimers,
  } = useGameState({ onSymbol: handleSymbol, treeNodes });

  const handleToggleMode = useCallback((newMode) => {
    if (newMode === mode) return;
    clearTimers();
    commitLetter();
    commitWord();
    setMode(newMode);
  }, [mode, commitLetter, commitWord, clearTimers]);

  // Reset tree position when treeNodes changes (mode switched)
  useEffect(() => {
    resetToRoot();
  }, [treeNodes, resetToRoot]);

  const appRef = useRef(null);

  // Start boot animation on mount
  useEffect(() => {
    return startBoot();
  }, [startBoot]);

  // Global keyboard listener for spacebar
  const keyDownRef = useRef(false);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.code === 'Space' && !keyDownRef.current && bootPhase === 'live') {
        e.preventDefault();
        keyDownRef.current = true;
        pressStart();
      }
    },
    [pressStart, bootPhase]
  );

  const handleKeyUp = useCallback(
    (e) => {
      if (e.code === 'Space' && keyDownRef.current) {
        e.preventDefault();
        keyDownRef.current = false;
        pressEnd();
      }
    },
    [pressEnd]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const isBootDone = bootPhase === 'live';
  const appBootClass = bootPhase !== 'live' ? `boot-${bootPhase}` : '';

  const currentDefs = mode === 'letters' ? nodeDefs : digitNodeDefs;
  const currentConns = mode === 'letters' ? boardConnections : digitConnections;

  return (
    <div className={`app ${appBootClass}`} ref={appRef}>
      <div className="main-column">
        <OutputScreen output={output} />
        <SpeedBar speed={speed} onChange={setSpeed} disabled={!isBootDone} />
        <Board
          activePath={activePath}
          isPressing={isPressing}
          bootPhase={bootPhase}
          nodeDefs={currentDefs}
          connections={currentConns}
          mode={mode}
          onToggleMode={handleToggleMode}
        >
          <FloatingLetters letters={floatingLetters} />
          <PressKey
            isPressing={isPressing}
            onPressStart={pressStart}
            onPressEnd={pressEnd}
            disabled={!isBootDone}
          />
        </Board>
      </div>
      <div className="meta-overlay">
        <span className="app-version">v1.0.0</span>
      </div>
    </div>
  );
}
