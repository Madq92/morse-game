export default function FloatingLetters({ letters }) {
  return (
    <div className="echo-layer" aria-hidden="true">
      {letters.map((echo) => (
        <span
          key={echo.id}
          className={`letter-echo tone-${echo.tone}`}
          style={{
            left: `${echo.leftPct}%`,
            top: `${echo.topPct}%`,
            '--echo-tx': `${echo.txPx}px`,
            '--echo-ty': `${echo.tyPx}px`,
          }}
        >
          {echo.letter}
        </span>
      ))}
    </div>
  );
}
