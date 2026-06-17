# Gustavs Garten 🐢

A cozy, German-language 2D browser game — a loving tribute to Gustav the
tortoise and his garden, made as a gift for Maria. Waddle around the garden
across four seasons, get fed and loved by the family, and watch a gentle story
unfold. Pure comfort: no sadness, no goodbyes — just Gustav, happy in his garden
forever.

Built with [Kaplay](https://kaplayjs.com/) (pixel-art world) + HTML/CSS overlays
(glossy Web 2.0 menus) on [Vite](https://vitejs.dev/). Cozy 2010 / Y2K-retro
look. All player-facing text is German ("du").

## Status

**Milestone 1 in progress** — title screen done; the Frühling vertical slice
(garden, Gustav, needs, strawberry/worn-path mechanic, Magda's quest, scrapbook,
Teezeit, save/load) is being built checkpoint by checkpoint.

## Develop

This machine's global `npm` is broken, so use pnpm via corepack:

```bash
COREPACK_INTEGRITY_KEYS=0 corepack pnpm@9.15.4 install
COREPACK_INTEGRITY_KEYS=0 corepack pnpm@9.15.4 exec vite
```

Then open http://localhost:5173/. (On a machine with a working npm, `npm install`
&& `npm run dev` work too.)

## Build

```bash
COREPACK_INTEGRITY_KEYS=0 corepack pnpm@9.15.4 run build   # outputs to dist/
```

## Project layout

- `src/config/` — Kaplay init, dev-only offscreen-preview shim
- `src/data/` — all content: German strings, garden layout, quests, dialogue
- `src/scenes/` — title, garden
- `src/systems/` — needs, strawberries, worn path, Glück, save, audio
- `src/ui/` — glossy HTML/CSS overlays (HUD, dialogue, scrapbook, options)
- `assets/` — placeholder art now; real pixel art + Gustav photos at M5
