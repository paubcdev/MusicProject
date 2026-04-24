# Changelog

All notable changes to TabPlayer are documented in this file.

## [0.2.0] - 2026-04-24

### Fixed

- **File loading broken** — Wails serializes Go `[]byte` as base64 strings over JSON. The frontend was passing this string directly to `new Uint8Array()`, producing garbage data. Added `base64ToUint8Array()` decoder in `main.js` so alphaTab receives valid binary data.
- **UI overlap** — alphaTab injects absolutely-positioned canvas and cursor layers that escaped the viewport container and painted over the toolbar. Fixed with:
  - `isolation: isolate` and `z-index: 1000` on the toolbar
  - `contain: layout style` on the alphaTab wrapper
  - Moved the recent-files dropdown outside the toolbar to avoid stacking context clipping
- **Black background in standalone app** — Changed `BackgroundColour` in `main.go` from dark (`rgb(26,26,46)`) to white (`rgb(255,255,255)`). Added `color-scheme: light` meta tag and inline background styles in `index.html` to override WebView defaults before CSS loads.

### Changed

- Switched from dark theme to **white/light theme** across all CSS variables and components.
- Restructured `index.html` — toolbar uses `<header>` element, dropdown menu rendered as sibling instead of nested inside toolbar.
- Added drag-and-drop support on the whole document (not just the drop zone) so files can be dropped even after a tab is already loaded.

## [0.1.0] - 2026-04-23

### Added

- Initial Go + Wails implementation replacing the previous TypeScript + Tauri version.
- **Go backend** (`app.go`):
  - `OpenFileDialog()` — native OS file picker with Guitar Pro filters
  - `GetRecentFiles()` / `OpenRecentFile()` — recent files list (max 10, persisted)
  - `LoadSettings()` / `SaveSettings()` — user preferences stored in `~/.config/tabplayer/settings.json`
- **JS frontend** (`main.js`, ~200 lines):
  - alphaTab initialization, rendering, and playback
  - Track selector, tempo slider, loop toggle, count-in toggle
  - Keyboard shortcuts: Space, Escape, L, +/-
  - Drag-and-drop file loading
- Wails auto-generated Go↔JS bindings
- `vite-plugin-static-copy` for alphaTab fonts and SoundFont
- `.pkgconfig/` shim for Ubuntu 24.04 (`webkit2gtk-4.0` → `4.1`)
- User-facing `README.md`, developer `CONTRIBUTING.md`, MIT `LICENSE`
- Development roadmap in `docs/dev/roadmap.md`
