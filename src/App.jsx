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
    output, speed, activePath, isPressing, floatingLetters,
    bootPhase, mode, currentInput, pressStart, pressEnd, setSpeed, switchMode, startBoot,
  } = useGameState({ onSymbol: handleSymbol });

  const appRef = useRef(null);

  useEffect(() => { return startBoot(); }, [startBoot]);

  const keyDownRef = useRef(false);
  const handleKeyDown = useCallback((e) => {
    if (e.code === 'Space' && !keyDownRef.current && bootPhase === 'live') {
      e.preventDefault();
      keyDownRef.current = true;
      pressStart();
    }
  }, [pressStart, bootPhase]);

  const handleKeyUp = useCallback((e) => {
    if (e.code === 'Space' && keyDownRef.current) {
      e.preventDefault();
      keyDownRef.current = false;
      pressEnd();
    }
  }, [pressEnd]);

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
        <Board activePath={activePath} isPressing={isPressing} mode={mode} currentInput={currentInput} bootPhase={bootPhase}>
          <FloatingLetters letters={floatingLetters} />
          <PressKey
            isPressing={isPressing}
            onPressStart={pressStart}
            onPressEnd={pressEnd}
            disabled={!isBootDone}
          />
          {/* Mode toggle */}
          <div className="mode-toggle">
            <button
              type="button"
              className={`mode-btn ${mode === 'letter' ? 'is-active' : ''}`}
              disabled={!isBootDone}
              onClick={() => switchMode('letter')}
            >ABC</button>
            <button
              type="button"
              className={`mode-btn ${mode === 'number' ? 'is-active' : ''}`}
              disabled={!isBootDone}
              onClick={() => switchMode('number')}
            >123</button>
          </div>
        </Board>
      </div>
      <div className="meta-overlay">
        <span className="app-version">v1.0.0</span>
      </div>
    </div>
  );
}
