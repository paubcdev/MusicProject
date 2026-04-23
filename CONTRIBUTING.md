# Contributing to TabPlayer

Thanks for your interest in contributing! This document covers how to set up the development environment, build from source, and understand the project architecture.

## Building from Source

### Prerequisites

- [Go](https://go.dev/dl/) 1.21+
- [Node.js](https://nodejs.org/) 18+
- [Wails CLI](https://wails.io/docs/gettingstarted/installation)
- Linux: `libwebkit2gtk-4.1-dev`, `libgtk-3-dev`

Install the Wails CLI:

```bash
go install github.com/wailsapp/wails/v2/cmd/wails@latest
```

### Clone and Run

```bash
git clone https://github.com/paubcdev/MusicProject.git
cd MusicProject
wails dev
```

This will install frontend dependencies, generate Go-JS bindings, compile the Go backend, and open the desktop window with hot reload enabled.

### Build a Production Binary

```bash
wails build
```

The output binary will be in `build/bin/`.

### Ubuntu 24.04 Note

Ubuntu 24.04 ships `webkit2gtk-4.1` but Wails v2 expects version `4.0`. A `.pkgconfig/` shim directory is included in the repo that maps the old package name to the new one.

Set this environment variable before any `wails` command:

```bash
export PKG_CONFIG_PATH="$(pwd)/.pkgconfig:$PKG_CONFIG_PATH"
```

If you use this frequently, add it to your shell profile.

## Project Architecture

The app is split into two layers:

| Layer | Language | What it does |
|-------|----------|--------------|
| **Backend** | Go | All application logic — file I/O, native dialogs, settings persistence, recent files |
| **Frontend** | Vanilla JS (~180 lines) | alphaTab initialization, rendering, and playback only |

The Go backend exposes functions that the frontend calls via auto-generated [Wails bindings](https://wails.io/docs/howdoesitwork). This means **all future features** (song library, practice tracking, etc.) should be implemented in Go, keeping the JS layer as thin as possible.

### Project Structure

```text
├── main.go               # Wails app entry point
├── app.go                # Go app logic: file dialogs, settings, recent files
├── frontend/             # Thin JS frontend
│   ├── index.html        # App shell (HTML)
│   ├── src/
│   │   ├── main.js       # alphaTab init + UI wiring
│   │   └── style.css     # Dark theme styles
│   ├── wailsjs/          # Auto-generated Go<->JS bindings (do not edit)
│   ├── vite.config.js    # Vite build config
│   └── package.json      # Frontend dependencies (alphaTab + Vite)
├── build/                # Wails build assets and app icons
├── .pkgconfig/           # pkg-config shim for Ubuntu 24.04
├── docs/dev/             # Development docs and roadmap
├── wails.json            # Wails project configuration
└── go.mod / go.sum       # Go module dependencies
```

### Key Go Functions (app.go)

| Function | What it does |
|----------|--------------|
| `OpenFileDialog()` | Opens the native OS file picker, returns file bytes to JS |
| `GetRecentFiles()` | Returns list of recently opened file paths |
| `OpenRecentFile(path)` | Reads and returns a previously opened file |
| `LoadSettings()` | Reads user preferences from disk |
| `SaveSettings(s)` | Writes user preferences to disk |

Settings are stored in `~/.config/tabplayer/settings.json`.

### Adding a New Go Function

1. Add the method to the `App` struct in `app.go`
2. Run `wails dev` — bindings are regenerated automatically
3. Import and call the function from `frontend/src/main.js` via `import { YourFunc } from '../wailsjs/go/main/App'`

## Development Workflow

```bash
# Start dev mode with hot reload
wails dev

# The app window opens automatically
# Edit Go files -> backend recompiles and restarts
# Edit JS/CSS files -> frontend hot reloads instantly
```

## Roadmap

See [docs/dev/roadmap.md](docs/dev/roadmap.md) for planned features and improvement ideas, including:

- A/B loop selection
- Speed trainer (incremental tempo)
- Song library / file browser
- Practice session tracking

## Code Style

- **Go**: standard `gofmt` formatting
- **JS**: keep it minimal — the frontend should only handle rendering
- **New features**: implement logic in Go, not JS
