# 🎸 TabPlayer

A local, offline guitar tablature viewer and player — like Songsterr, but running entirely on your machine.
Built with **Go** ([Wails](https://wails.io/)) for the backend and a minimal JavaScript frontend using [alphaTab](https://www.alphatab.net/).

## Features

- **Load Guitar Pro files** — `.gp`, `.gp3`, `.gp4`, `.gp5`, `.gpx`, `.gp7`, `.musicxml`, `.mxl`, `.capx`
- **Native file dialog** — open files via the OS file picker (powered by Go)
- **Recent files** — quick access to previously opened songs (persisted to disk)
- **Interactive tablature** — standard notation + tab rendered with a synced playback cursor
- **Built-in audio playback** — SoundFont-based synthesizer, no external software needed
- **Track selection** — switch between guitar, bass, drums, keyboards, etc.
- **Tempo control** — adjust playback speed from 25% to 200%
- **Loop mode** — repeat the entire song continuously
- **Count-in** — metronome count before playback begins
- **Drag and drop** — drop files directly onto the window to load them
- **Keyboard shortcuts** — Space (play/pause), Esc (stop), L (loop), +/- (tempo)
- **Settings persistence** — tempo, loop, and count-in preferences saved automatically

## Prerequisites

- [Go](https://go.dev/dl/) 1.21+
- [Node.js](https://nodejs.org/) 18+
- [Wails CLI](https://wails.io/docs/gettingstarted/installation) — `go install github.com/wailsapp/wails/v2/cmd/wails@latest`
- Linux: `libwebkit2gtk-4.1-dev`, `libgtk-3-dev`

### Ubuntu 24.04 note

This distro ships `webkit2gtk-4.1` but Wails v2 expects `4.0`.
A `.pkgconfig/` shim directory is included that maps 4.0 to 4.1.
Set `PKG_CONFIG_PATH` before running:

```bash
export PKG_CONFIG_PATH="$(pwd)/.pkgconfig:$PKG_CONFIG_PATH"
```

## Getting Started

```bash
# Install Wails CLI (once)
go install github.com/wailsapp/wails/v2/cmd/wails@latest

# Run in dev mode (opens desktop window with hot reload)
export PKG_CONFIG_PATH="$(pwd)/.pkgconfig:$PKG_CONFIG_PATH"  # Ubuntu 24.04 only
wails dev
```

## Usage

1. **Open a file** — Click "Open File" or drag and drop a Guitar Pro file onto the window
2. **Play** — Press Play (or Space). The cursor follows along the tablature
3. **Change track** — Use the Track dropdown to switch instruments
4. **Adjust tempo** — Drag the slider or press +/- keys
5. **Loop** — Click Loop or press L
6. **Recent files** — Click "Recent" to reopen a previously loaded file

## Building for Distribution

```bash
export PKG_CONFIG_PATH="$(pwd)/.pkgconfig:$PKG_CONFIG_PATH"  # Ubuntu 24.04 only
wails build
```

Output binary will be in `build/bin/`.

## Project Structure

```text
├── main.go               # Wails app entry point (Go)
├── app.go                # App logic: file dialogs, settings, recent files (Go)
├── frontend/             # Thin JS frontend (alphaTab only)
│   ├── index.html        # App shell
│   ├── src/
│   │   ├── main.js       # alphaTab init + UI event wiring (~180 lines)
│   │   └── style.css     # Dark theme styles
│   ├── wailsjs/          # Auto-generated Go-JS bindings
│   ├── vite.config.js    # Vite config (static copy for fonts/soundfont)
│   └── package.json
├── build/                # Wails build assets and icons
├── .pkgconfig/           # pkg-config shim for Ubuntu 24.04
├── wails.json            # Wails project config
├── go.mod / go.sum       # Go dependencies
└── docs/dev/             # Development documentation
```

## Architecture

| Layer | Language | Responsibility |
| ----- | -------- | -------------- |
| Backend | Go | File I/O, native dialogs, settings persistence, all future app logic |
| Frontend | Vanilla JS | alphaTab rendering and playback only (~180 lines) |
| Bridge | Wails bindings | Go functions callable from JS (auto-generated) |
