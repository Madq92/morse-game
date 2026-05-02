import { useRef, useEffect } from 'react';

export default function OutputScreen({ output }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [output]);

  return (
    <div className="output-screen">
      <div className="output-screen-inner" ref={scrollRef} aria-live="polite">
        {output.length === 0 ? (
          <span className="output-placeholder">按住按键输入摩斯码...</span>
        ) : (
          output.map((item, i) =>
            item.type === 'space' ? (
              <span key={i}> </span>
            ) : (
              <span key={i}>{item.value}</span>
            )
          )
        )}
        <span className="output-cursor">_</span>
      </div>
    </div>
  );
}
