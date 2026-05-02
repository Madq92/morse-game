import { useEffect, useRef, useCallback } from 'react';
import { useGameState } from './hooks/useGameState';
import { playDot, playDash } from './utils/audio';
import OutputScreen from './components/OutputScreen';
import SpeedBar from './components/SpeedBar';
import Board from './components/Board';
import PressKey from './components/PressKey';
import FloatingLetters from './components/FloatingLetters';

export default function App() {
  const handleSymbol = useCallback((symbol) => {
    if (symbol === '.') playDot();
    else playDash();
  }, []);

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
  } = useGameState({ onSymbol: handleSymbol });

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

  return (
    <div className={`app ${appBootClass}`} ref={appRef}>
      <div className="main-column">
        <OutputScreen output={output} />
        <SpeedBar speed={speed} onChange={setSpeed} disabled={!isBootDone} />
        <Board activePath={activePath} isPressing={isPressing} bootPhase={bootPhase}>
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
