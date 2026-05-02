import { TIER_LABELS } from '../data/gameData';

const TIERS = ['slow', 'medium', 'fast'];

export default function SpeedBar({ speed, onChange, disabled }) {
  return (
    <div className="speed-tier-bar" role="radiogroup" aria-label="摩斯码速度档位">
      {TIERS.map((tier) => (
        <button
          key={tier}
          type="button"
          role="radio"
          aria-checked={speed === tier}
          disabled={disabled}
          className={`speed-tier-option ${speed === tier ? 'is-selected' : ''}`}
          onClick={() => tier !== speed && !disabled && onChange(tier)}
        >
          {TIER_LABELS[tier]}
        </button>
      ))}
    </div>
  );
}
