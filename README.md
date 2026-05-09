# PhotoGuard AI

A mobile web app that helps users clean their photo gallery using AI.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Pages

| URL | Page |
|-----|------|
| `/dashboard` | Dashboard — library status & start scan |
| `/select-photos` | Select Photos — choose photos to analyze |
| `/analysis` | Analysis Results — AI results with scores |
| `/review` | Review Before Delete — keep or delete |

## Tech Stack

- Vite + React 18
- React Router v6
- CSS Modules (no external UI library)
- Design system via CSS custom properties (`src/styles/globals.css`)

## Design System

See `DESIGN.md` for the full design system: colors, typography, spacing, and component patterns.
