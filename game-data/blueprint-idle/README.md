<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/Real-Fruit-Snacks/Blueprint/main/docs/assets/logo-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/Real-Fruit-Snacks/Blueprint/main/docs/assets/logo-light.svg">
  <img alt="Blueprint" src="https://raw.githubusercontent.com/Real-Fruit-Snacks/Blueprint/main/docs/assets/logo-dark.svg" width="100%">
</picture>

> [!IMPORTANT]
> **An engineering-sheet incremental.** Build a factory one machine at a time, prestige for Schematics, publish for Patents, exhibit for Legacy Marks. Pure vanilla HTML/CSS/JS, zero dependencies, installable as a PWA with offline play.

> *A blueprint is the smallest discrete plan — one sheet, one machine, one tier. Felt fitting for a game where every glyph, every sound, every node is generated at runtime from SVG primitives and the Web Audio API.*

---

## §1 / Premise

Blueprint is a **browser incremental drawn as an engineering schematic.** Mine ore, smelt ingots, press parts, assemble circuits, forge cores, and refine prototypes across six tiers. When a run matures, **prestige** to bank Schematics and unlock the radial research tree. Push deeper to unlock the meta layer — **publish** for Patents that persist across every reset, then **exhibit** for Legacy Marks that survive even publish.

No framework, no build step, no external assets. Every machine icon, research node, UI glyph, and sound is generated at runtime from SVG primitives and the Web Audio API.

▶ **[Play on itch.io](https://westicles.itch.io/blueprint-an-incremental-factory)** &nbsp;·&nbsp; ▶ **[Play on GitHub Pages](https://real-fruit-snacks.github.io/blueprint/)**

---

## §2 / Specs

| KEY        | VALUE                                                                       |
|------------|-----------------------------------------------------------------------------|
| TIERS      | **6** · Ore → Ingot → Part → Circuit → Core → Prototype                     |
| MACHINES   | **28** with three rarity rungs per tier (base / MK-IV / MK-V)               |
| RESEARCH   | **60+ nodes** on a radial tree across six discipline branches               |
| PRESTIGE   | **3 layers** · Schematics · Patents · Legacy Marks                          |
| MASTERY    | **21 patents** · **14 challenges** · **15 blueprints** · **8 exhibitions**  |
| ACHIEV.    | **79 earnables** with progress bars and stacking bonuses                    |
| STACK      | **Vanilla HTML/CSS/JS** · PWA · Web Audio · LocalStorage · MIT licensed     |

Architecture in §5 below.

---

## §3 / Quickstart

```bash
# Run locally — no install, no build, no server required
git clone https://github.com/Real-Fruit-Snacks/blueprint.git
cd blueprint
# open index.html in any modern browser
python -m http.server 8000              # optional: http://localhost:8000
```

The service worker only registers over `http://` or `https://`, so `file://` opens work but won't cache for offline use.

---

## §4 / Reference

```
DESKTOP CONTROLS

  Click                   Buy one machine
  Shift + Click           Buy ×10           (requires Bulk Buy research)
  Shift+Alt + Click       Buy ×100          (requires Bulk Buy research)
  Ctrl+Shift + Click      Buy ×1000         (requires Max Buy research)
  Right-click             Toggle auto-buy   (requires Auto-Buy research)
  Click + drag            Pan research tree
  Scroll wheel            Zoom research tree

TOUCH CONTROLS

  Tap                     Buy one machine
  Long-press              Open machine details
  Tap A chip              Toggle auto-buy
  BUY MODE bar            Bulk buy without modifier keys
  Drag / pinch            Pan / zoom research tree
  Tap-to-arm + tap        Confirm research node

PROGRESSION LAYERS

  Schematics              Per-run prestige currency
  Patents                 Meta currency · survives every publish
  Legacy Marks            Endgame currency · survives every reset
  Exhibitions             Unlock at 30 lifetime Patents

ACCESSIBILITY

  Reduce motion           Auto / on / off — disables flashes, shake, particles
  Colorblind palette      IBM-derived swap with ≥25° hue, ≥20% brightness sep
  Touch-first layout      Pinch-zoom, long-press, scrollable modals
  Notation                K/M/B vs scientific

PWA

  Installable             Add to Home Screen on desktop and mobile
  Offline play            Service worker precaches the entire shell
  Standalone window       Blueprint accent as theme color
```

---

## §5 / Architecture

```
[Browser]
 index.html  →  game.js  →  sim-worker.js  (production loop)
                       →  Web Audio API   (procedural sound)
                       →  LocalStorage    (saves, base64 export)
                       →  sw.js           (offline shell cache)
```

| Layer        | Implementation                                                  |
|--------------|-----------------------------------------------------------------|
| **Render**   | SVG + CSS for every visual — drafting grid, tier pips, flow connectors |
| **Sim**      | `sim-worker.js` runs the production loop off the main thread    |
| **Audio**    | Web Audio API · synthesized on demand · no samples              |
| **Saves**    | LocalStorage · base64-encodable for export and cross-device transfer |
| **Offline**  | Service worker (`sw.js`) · cache-first with background refresh  |
| **Deploy**   | Single-file static — every asset in repo root ships as-is       |

**Key patterns:** Every machine icon, research node, UI glyph, and sound is generated at runtime from SVG primitives — no external assets. Three prestige layers compose: Schematics reset on prestige, Patents survive publish, Legacy Marks survive every reset. The PWA shell installs from the GitHub Pages build (the itch embed can't register a service worker).

Tested on current Chrome, Firefox, Edge, Safari (desktop + mobile). Responsive down to ~360 px and handles iOS Safari viewport-chrome changes.

---

[License: MIT](LICENSE) · See [CHANGELOG.md](CHANGELOG.md) for the full version history. Part of [Real-Fruit-Snacks](https://github.com/Real-Fruit-Snacks) — building offensive security tools, one wave at a time.
