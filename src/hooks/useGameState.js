import { useState, useRef, useCallback } from 'react';
import { nodes, getTiming, SPEED_TIERS, bootStages } from '../data/gameData';

export function useGameState({ onSymbol, treeNodes } = {}) {
  const tree = treeNodes || nodes;
  const rootId = tree['root'] ? 'root' : 'd-root';
  const onSymbolRef = useRef(onSymbol);
  onSymbolRef.current = onSymbol;
  const [output, setOutput] = useState([]); // Array of {type:'letter'|'space', value:string}
  const [speed, setSpeedState] = useState('medium');
  const [activePath, setActivePath] = useState([]); // Array of node IDs in current path
  const [isPressing, setIsPressing] = useState(false);
  const [floatingLetters, setFloatingLetters] = useState([]);
  const [bootPhase, setBootPhase] = useState('init'); // init|board|silk|trace|ready|live

  const timingRef = useRef(getTiming(SPEED_TIERS.medium));
  const currentNodeRef = useRef(tree[rootId]);
  const currentPathRef = useRef([]);
  const pressStartRef = useRef(null);
  const letterTimerRef = useRef(null);
  const wordTimerRef = useRef(null);
  const echoIdRef = useRef(0);
  const treeRef = useRef(tree);
  treeRef.current = tree;
  const rootIdRef = useRef(rootId);
  rootIdRef.current = rootId;

  // Clear all pending timers
  const clearTimers = useCallback(() => {
    if (letterTimerRef.current) {
      clearTimeout(letterTimerRef.current);
      letterTimerRef.current = null;
    }
    if (wordTimerRef.current) {
      clearTimeout(wordTimerRef.current);
      wordTimerRef.current = null;
    }
  }, []);

  // Reset to root
  const resetToRoot = useCallback(() => {
    const rid = rootIdRef.current;
    currentNodeRef.current = treeRef.current[rid];
    currentPathRef.current = [];
    setActivePath([rid]);
  }, []);

  // Walk symbols to get node ID array for active path
  const getNodePath = useCallback((symbols) => {
    const t = treeRef.current;
    const rid = rootIdRef.current;
    const path = [];
    let current = t[rid];
    for (const sym of symbols) {
      const childId = sym === '.' ? current.dot : current.dash;
      if (!childId) break;
      current = t[childId];
      path.push(childId);
    }
    return path;
  }, []);

  // Commit the current letter
  const commitLetter = useCallback(() => {
    const node = currentNodeRef.current;
    if (node && node.letter) {
      const letter = node.letter;
      setOutput((prev) => [...prev, { type: 'letter', value: letter }]);

      // Add floating letter echo
      echoIdRef.current += 1;
      const echo = {
        id: echoIdRef.current,
        letter,
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

  // Commit a word space
  const commitWord = useCallback(() => {
    setOutput((prev) => {
      // Don't add space if output is empty or last char is already a space
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      if (last.type === 'space') return prev;
      return [...prev, { type: 'space', value: ' ' }];
    });
  }, []);

  // Start commit timers after press ends
  const startCommitTimers = useCallback(() => {
    clearTimers();
    const { letterCommitMs, wordCommitMs } = timingRef.current;

    letterTimerRef.current = setTimeout(() => {
      commitLetter();
      // After letter commits, start word timer
      wordTimerRef.current = setTimeout(() => {
        commitWord();
      }, wordCommitMs - letterCommitMs);
    }, letterCommitMs);
  }, [clearTimers, commitLetter, commitWord]);

  // Press start
  const pressStart = useCallback(() => {
    clearTimers();
    pressStartRef.current = performance.now();
    setIsPressing(true);
    if (currentPathRef.current.length === 0) {
      setActivePath([rootIdRef.current]);
    }
  }, [clearTimers]);

  // Press end
  const pressEnd = useCallback(() => {
    if (!pressStartRef.current) return;
    setIsPressing(false);

    const duration = performance.now() - pressStartRef.current;
    pressStartRef.current = null;

    const { dashThresholdMs } = timingRef.current;
    const symbol = duration >= dashThresholdMs ? '-' : '.';

    if (onSymbolRef.current) {
      onSymbolRef.current(symbol);
    }

    const t = treeRef.current;
    const currentNode = currentNodeRef.current;
    const childId = symbol === '.' ? currentNode.dot : currentNode.dash;

    if (childId && t[childId]) {
      currentNodeRef.current = t[childId];
      currentPathRef.current = [...currentPathRef.current, symbol];
      setActivePath([rootIdRef.current, ...getNodePath(currentPathRef.current)]);
    }

    startCommitTimers();
  }, [startCommitTimers, getNodePath]);

  const setSpeed = useCallback(
    (tier) => {
      setSpeedState(tier);
      timingRef.current = getTiming(SPEED_TIERS[tier]);
      // Reset current input on speed change? Original resets
      clearTimers();
      resetToRoot();
    },
    [clearTimers, resetToRoot]
  );

  // Boot sequence
  const startBoot = useCallback(() => {
    setBootPhase('init');
    const stages = [...bootStages];
    const timers = stages.map(({ at, stage }) =>
      setTimeout(() => setBootPhase(stage), at)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return {
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
  };
}
