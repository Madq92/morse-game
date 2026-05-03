# Morse Code Decoder

Demo: https://morse-game.oldhorse.tech:1443/

A PCB-themed Morse code practice tool. Press and hold to input dots and dashes, decoded via binary tree traversal.

This project is a copy of the softcorelab project: https://softcorelab.com/.

Vibe coded using Deepseek-v4 and ClaudeCode.
## Quick Start

```bash
npm install
npm run dev
```

## How to Play

| Action | Result |
|--------|--------|
| **Short press** (< threshold) | Dot (`.`) — goes left in tree |
| **Long press** (>= threshold) | Dash (`-`) — goes right in tree |
| **Pause after release** | Commits current letter |
| **Longer pause** | Adds word space |

- Press the circular key or **Spacebar**
- Speed tiers: 慢 (280ms) / 中 (200ms) / 快 (130ms)
- Dash threshold = 2× base speed

## Tech

- React 18 + Vite
- CSS custom properties (dark PCB theme)
- Web Audio API (dot/dash tones)
- Inline SVG (board, traces, lamps)

## License

MIT
