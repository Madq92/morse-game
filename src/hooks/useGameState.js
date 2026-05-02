import { useState, useRef, useCallback } from 'react';
import { getActiveData, getTiming, SPEED_TIERS, bootStages } from '../data/gameData';

export function useGameState({ onSymbol } = {}) {
  const onSymbolRef = useRef(onSymbol);
  onSymbolRef.current = onSymbol;

  const [output, setOutput] = useState([]);
  const [speed, setSpeedState] = useState('medium');
  const [activePath, setActivePath] = useState([]);
  const [isPressing, setIsPressing] = useState(false);
  const [floatingLetters, setFloatingLetters] = useState([]);
  const [bootPhase, setBootPhase] = useState('init');
  const [mode, setMode] = useState('letter');
  const [currentInput, setCurrentInput] = useState(''); // accumulated dots/dashes string

  const timingRef = useRef(getTiming(SPEED_TIERS.medium));
  const nodesRef = useRef(getActiveData('letter').nodes);
  const currentNodeRef = useRef(nodesRef.current['root']);
  const currentPathRef = useRef([]);
  const pressStartRef = useRef(null);
  const letterTimerRef = useRef(null);
  const wordTimerRef = useRef(null);
  const echoIdRef = useRef(0);

  const clearTimers = useCallback(() => {
    if (letterTimerRef.current) { clearTimeout(letterTimerRef.current); letterTimerRef.current = null; }
    if (wordTimerRef.current) { clearTimeout(wordTimerRef.current); wordTimerRef.current = null; }
  }, []);

  const resetToRoot = useCallback(() => {
    currentNodeRef.current = nodesRef.current['root'];
    currentPathRef.current = [];
    setActivePath(['root']);
    setCurrentInput('');
  }, []);

  const commitLetter = useCallback(() => {
    const node = currentNodeRef.current;
    if (node && node.letter) {
      setOutput((prev) => [...prev, { type: 'letter', value: node.letter }]);
      echoIdRef.current += 1;
      const echo = {
        id: echoIdRef.current,
        letter: node.letter,
        leftPct: node.x,
        topPct: ((100 - node.y) / 140) * 100,
        txPx: (Math.random() - 0.5) * 60,
        tyPx: -30 - Math.random() * 30,
        tone: node.lampType === 'square' ? 'amber' : 'green',
      };
      setFloatingLetters((prev) => [...prev, echo]);
      setTimeout(() => {
        setFloatingLetters((prev) => prev.filter((e) => e.id !== echo.id));
      }, 1200);
    }
    resetToRoot();
  }, [resetToRoot]);

  const commitWord = useCallback(() => {
    setOutput((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      if (last.type === 'space') return prev;
      return [...prev, { type: 'space', value: ' ' }];
    });
  }, []);

  const startCommitTimers = useCallback(() => {
    clearTimers();
    const { letterCommitMs, wordCommitMs } = timingRef.current;
    letterTimerRef.current = setTimeout(() => {
      commitLetter();
      wordTimerRef.current = setTimeout(() => commitWord(), wordCommitMs - letterCommitMs);
    }, letterCommitMs);
  }, [clearTimers, commitLetter, commitWord]);

  const getNodePath = useCallback((symbols) => {
    const nodes = nodesRef.current;
    const path = [];
    let current = nodes['root'];
    for (const sym of symbols) {
      const childId = sym === '.' ? current.dot : current.dash;
      if (!childId) break;
      current = nodes[childId];
      path.push(childId);
    }
    return path;
  }, []);

  const pressStart = useCallback(() => {
    clearTimers();
    pressStartRef.current = performance.now();
    setIsPressing(true);
    if (currentPathRef.current.length === 0) {
      setActivePath(['root']);
    }
  }, [clearTimers]);

  const pressEnd = useCallback(() => {
    if (!pressStartRef.current) return;
    setIsPressing(false);
    const duration = performance.now() - pressStartRef.current;
    pressStartRef.current = null;
    const { dashThresholdMs } = timingRef.current;
    const symbol = duration >= dashThresholdMs ? '-' : '.';
    if (onSymbolRef.current) onSymbolRef.current(symbol);

    const nodes = nodesRef.current;
    const currentNode = currentNodeRef.current;
    const childId = symbol === '.' ? currentNode.dot : currentNode.dash;
    if (childId && nodes[childId]) {
      currentNodeRef.current = nodes[childId];
      currentPathRef.current = [...currentPathRef.current, symbol];
      setActivePath(['root', ...getNodePath(currentPathRef.current)]);
      setCurrentInput(currentPathRef.current.join(''));
    }
    startCommitTimers();
  }, [startCommitTimers, getNodePath]);

  const setSpeed = useCallback((tier) => {
    setSpeedState(tier);
    timingRef.current = getTiming(SPEED_TIERS[tier]);
    clearTimers();
    resetToRoot();
  }, [clearTimers, resetToRoot]);

  const switchMode = useCallback((newMode) => {
    setMode(newMode);
    nodesRef.current = getActiveData(newMode).nodes;
    clearTimers();
    resetToRoot();
  }, [clearTimers, resetToRoot]);

  const startBoot = useCallback(() => {
    setBootPhase('init');
    const stages = [...bootStages];
    const timers = stages.map(({ at, stage }) =>
      setTimeout(() => setBootPhase(stage), at)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return {
    output, speed, activePath, isPressing, floatingLetters,
    bootPhase, mode, currentInput, pressStart, pressEnd, setSpeed, switchMode, startBoot,
  };
}
