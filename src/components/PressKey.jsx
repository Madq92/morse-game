import { useRef, useCallback } from 'react';

export default function PressKey({ isPressing, onPressStart, onPressEnd, disabled }) {
  const pointerDownRef = useRef(false);

  const handlePointerDown = useCallback(
    (e) => {
      if (disabled) return;
      e.preventDefault();
      pointerDownRef.current = true;
      onPressStart();
    },
    [disabled, onPressStart]
  );

  const handlePointerUp = useCallback(
    (e) => {
      if (!pointerDownRef.current) return;
      e.preventDefault();
      pointerDownRef.current = false;
      onPressEnd();
    },
    [onPressEnd]
  );

  return (
    <button
      type="button"
      className={`press-key ${isPressing ? 'pressing' : ''}`}
      disabled={disabled}
      aria-disabled={disabled}
      aria-label="按住输入摩斯码（也可以按空格键）"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerUp}
      tabIndex={-1}
    >
      <span className="press-key-text">
        <span className={`press-key-label default ${isPressing ? 'hidden' : ''}`}>
          Space
        </span>
        <span className={`press-key-label brand ${isPressing ? '' : 'hidden'}`}>
          Softcore
        </span>
      </span>
    </button>
  );
}
