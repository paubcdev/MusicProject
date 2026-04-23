# 🎸 TabPlayer# 🎸 TabPlayer# 🎸 TabPlayer# React + TypeScript + Vite



A local, offline guitar tablature viewer and player — like Songsterr, but running entirely on your machine. Built with **Go** ([Wails](https://wails.io/)) for the backend and a minimal JavaScript frontend using [alphaTab](https://www.alphatab.net/).



## FeaturesA local, offline guitar tablature viewer and player — like Songsterr, but running entirely on your machine. Built with React, TypeScript, [alphaTab](https://www.alphatab.net/), and [Tauri](https://tauri.app/).



- **Load Guitar Pro files** — `.gp`, `.gp3`, `.gp4`, `.gp5`, `.gpx`, `.gp7`, `.musicxml`, `.mxl`, `.capx`

- **Native file dialog** — open files via the OS file picker (powered by Go)

- **Recent files** — quick access to previously opened songs (persisted to disk)## FeaturesA local Songsterr-like guitar tablature viewer and player built with React, TypeScript, and [alphaTab](https://www.alphatab.net/).This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

- **Interactive tablature** — standard notation + tab rendered with a synced playback cursor

- **Built-in audio playback** — SoundFont-based synthesizer, no external software needed

- **Track selection** — switch between guitar, bass, drums, keyboards, etc.

- **Tempo control** — adjust playback speed from 25% to 200%- **Load Guitar Pro files** — `.gp`, `.gp3`, `.gp4`, `.gp5`, `.gpx`, `.gp7`, `.musicxml`, `.mxl`, `.capx`

- **Loop mode** — repeat the entire song continuously

- **Count-in** — metronome count before playback begins- **Interactive tablature** — standard notation + tab rendered in-app with a synced playback cursor

- **Drag & drop** — drop files directly onto the window to load them

- **Keyboard shortcuts** — Space (play/pause), Esc (stop), L (loop), +/- (tempo)- **Built-in audio playback** — SoundFont-based synthesizer, no external software needed## FeaturesCurrently, two official plugins are available:

- **Settings persistence** — tempo, loop, and count-in preferences saved automatically

- **Track selection** — switch between guitar, bass, drums, keyboards, etc.

## Prerequisites

- **Tempo control** — adjust playback speed from 25% to 200%

- [Go](https://go.dev/dl/) 1.21+

- [Node.js](https://nodejs.org/) 18+- **Loop mode** — repeat the entire song continuously

- [Wails CLI](https://wails.io/docs/gettingstarted/installation) — `go install github.com/wailsapp/wails/v2/cmd/wails@latest`

- Linux: `libwebkit2gtk-4.1-dev`, `libgtk-3-dev`- **Count-in** — metronome count before playback begins- **Load Guitar Pro files** — supports `.gp`, `.gp3`, `.gp4`, `.gp5`, `.gpx`, `.gp7`, `.musicxml`- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)



> **Ubuntu 24.04 note:** This distro ships `webkit2gtk-4.1` but Wails v2 expects `4.0`. A `.pkgconfig/` shim directory is included that maps 4.0 to 4.1. Set `PKG_CONFIG_PATH` before running:- **Drag & drop** — drop files directly onto the window to load them

>

> ```bash- **Desktop app** — runs as a native window via Tauri (also works in a browser)- **Interactive tablature rendering** — standard notation + tab, scrolling with playback cursor- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

> export PKG_CONFIG_PATH="$(pwd)/.pkgconfig:$PKG_CONFIG_PATH"

> ```



## Getting Started## Prerequisites- **Audio playback** — built-in synthesizer with SoundFont, no server needed



```bash

# Install Wails CLI (once)

go install github.com/wailsapp/wails/v2/cmd/wails@latest- [Node.js](https://nodejs.org/) (v18+)- **Track selection** — switch between guitar, bass, drums, etc.## React Compiler



# Run in dev mode (opens desktop window with hot reload)- [Rust](https://www.rust-lang.org/tools/install) (for Tauri desktop builds)

export PKG_CONFIG_PATH="$(pwd)/.pkgconfig:$PKG_CONFIG_PATH"  # Ubuntu 24.04 only

wails dev- Linux: `libwebkit2gtk-4.1`, `libgtk-3` (usually pre-installed on modern distros)- **Tempo control** — adjust playback speed from 25% to 200%

```



## Usage

## Getting Started- **Loop mode** — repeat the song continuouslyThe React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

1. **Open a file** — Click "Open File" or drag and drop a Guitar Pro file onto the window

2. **Play** — Press ▶ Play (or Space). The cursor follows along the tablature

3. **Change track** — Use the Track dropdown to switch instruments

4. **Adjust tempo** — Drag the slider or press +/- keys```bash- **Count-in** — metronome count before playback starts

5. **Loop** — Click 🔁 Loop or press L

6. **Recent files** — Click "Recent ▾" to reopen a previously loaded file# Install dependencies



## Building for Distributionnpm install- **Drag & drop** — drop files directly into the app## Expanding the ESLint configuration



```bash

export PKG_CONFIG_PATH="$(pwd)/.pkgconfig:$PKG_CONFIG_PATH"  # Ubuntu 24.04 only

wails build# Run in browser (dev mode)

```

npm run dev

Output binary will be in `build/bin/`.

# Then open http://localhost:5173## Getting StartedIf you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

## Project Structure



```

├── main.go               # Wails app entry point (Go)# Run as desktop app (dev mode)

├── app.go                # App logic: file dialogs, settings, recent files (Go)

├── frontend/             # Thin JS frontend (alphaTab only)npm run tauri dev

│   ├── index.html        # App shell

│   ├── src/``````bash```js

│   │   ├── main.js       # alphaTab init + UI event wiring (~180 lines)

│   │   └── style.css     # Dark theme styles

│   ├── wailsjs/          # Auto-generated Go-JS bindings

│   ├── vite.config.js    # Vite config (static copy for fonts/soundfont)## Usagenpm installexport default defineConfig([

│   └── package.json

├── build/                # Wails build assets and icons

├── .pkgconfig/           # pkg-config shim for Ubuntu 24.04

├── wails.json            # Wails project config1. **Open a file** — Click "Open File" in the toolbar or drag & drop a Guitar Pro file onto the window.npm run dev  globalIgnores(['dist']),

├── go.mod / go.sum       # Go dependencies

└── docs/dev/             # Development documentation2. **Play** — Press ▶ Play. The cursor follows along the tablature in real time.

```

3. **Change track** — Use the Track dropdown to switch between instruments in the file.```  {

## Architecture

4. **Adjust tempo** — Drag the Tempo slider to slow down (for practice) or speed up.

| Layer | Language | Responsibility |

|-------|----------|----------------|5. **Loop** — Toggle 🔁 Loop to repeat the song when it reaches the end.    files: ['**/*.{ts,tsx}'],

| Backend | Go | File I/O, native dialogs, settings persistence, all future app logic |

| Frontend | Vanilla JS | alphaTab rendering + playback only (~180 lines) |6. **Count-in** — Toggle Count-In for a metronome lead-in before playback starts.

| Bridge | Wails bindings | Go functions callable from JS (auto-generated) |

Then open http://localhost:5173 and drop a Guitar Pro file onto the page.    extends: [

## Building for Distribution

      // Other configs...

```bash

# Build a production desktop binary (.deb, .AppImage on Linux; .dmg on macOS; .msi on Windows)## Build for Production

npm run tauri build

```      // Remove tseslint.configs.recommended and replace with this



The output will be in `src-tauri/target/release/bundle/`.```bash      tseslint.configs.recommendedTypeChecked,



## Project Structurenpm run build      // Alternatively, use this for stricter rules



```npm run preview      tseslint.configs.strictTypeChecked,

├── src/                  # Frontend (React + TypeScript)

│   ├── App.tsx           # Main component — alphaTab integration, controls, UI```      // Optionally, add this for stylistic rules

│   ├── App.css           # Application styles (dark theme)

│   ├── index.css         # Global/reset styles      tseslint.configs.stylisticTypeChecked,

│   └── main.tsx          # React entry point

├── src-tauri/            # Tauri (Rust) backend## Tech Stack

│   ├── tauri.conf.json   # Tauri configuration (window size, app name, etc.)

│   ├── src/main.rs       # Rust entry point      // Other configs...

│   └── Cargo.toml        # Rust dependencies

├── vite.config.ts        # Vite config (static copy for alphaTab fonts/soundfont)- [Vite](https://vite.dev/) + [React](https://react.dev/) + TypeScript    ],

└── package.json

```- [@coderline/alphaTab](https://www.alphatab.net/) — tablature parsing, rendering, and playback    languageOptions: {



## Tech Stack      parserOptions: {

        project: ['./tsconfig.node.json', './tsconfig.app.json'],

| Layer | Technology |        tsconfigRootDir: import.meta.dirname,

|---|---|      },

| UI Framework | [React](https://react.dev/) + TypeScript |      // other options...

| Build Tool | [Vite](https://vite.dev/) |    },

| Tab Engine | [@coderline/alphaTab](https://www.alphatab.net/) |  },

| Desktop Shell | [Tauri v2](https://tauri.app/) |])

| Audio | SoundFont synth (via alphaTab, using sonivox.sf2) |```


You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
