# Development Roadmap & Improvement Suggestions

This document outlines potential next steps, feature ideas, and architectural improvements for TabPlayer.

---

## Short-Term Improvements

### A/B Loop Selection
Allow users to click on two points in the tablature to define a loop region, rather than looping the entire song.
- alphaTab exposes beat/bar position data via `playbackRangeChanged` and `beatMouseDown` events
- Store `loopStart` and `loopEnd` bar indices, use `api.playbackRange` to set the region
- Add visual markers on the tab to show the loop boundaries

### Speed Trainer / Incremental Tempo
A practice mode that starts at a slow tempo and gradually increases by a configurable amount (e.g., +5% every loop) until reaching the target speed.
- Combine with A/B looping for targeted practice
- Simple implementation: increment `api.playbackSpeed` on each `playerFinished` event

### Keyboard Shortcuts
| Action | Suggested Shortcut |
|---|---|
| Play / Pause | `Space` |
| Stop | `Escape` |
| Tempo Up / Down | `+` / `-` |
| Next / Previous Track | `Ctrl+↑` / `Ctrl+↓` |
| Toggle Loop | `L` |
| Open File | `Ctrl+O` |

### Remember Last Opened File
Persist the last opened file path (or recent files list) using Tauri's `fs` and `store` plugins so users can quickly reopen songs.

---

## Medium-Term Features

### Song Library / File Browser
- A sidebar or separate view that indexes a user-configured directory of Guitar Pro files
- Show metadata: song title, artist, tracks, duration
- Search and filter by name/artist
- alphaTab can parse file headers without full rendering to extract metadata quickly

### Notation Display Options
- Toggle between: tab only, standard notation only, or both
- `api.settings.display.staves` controls this — expose it as a UI toggle
- Per-track display preferences

### Metronome / Click Track
- Add a standalone metronome that plays even without a loaded file
- Useful for warm-up practice
- alphaTab's `metronomeVolume` setting controls this

### Multiple Simultaneous Tracks
- Show two tracks side by side (e.g., rhythm + lead guitar)
- alphaTab supports rendering multiple tracks: `api.renderTracks([track1, track2])`

---

## Long-Term / Advanced Features

### Practice Session Tracking
- Record practice sessions: which songs, which sections, at what tempo
- Store data in a local SQLite database via Tauri
- Show progress over time (e.g., "you can now play this section at 90% speed, up from 60% last week")

### Tone / Effect Simulation
- Integrate with a Web Audio API guitar amp simulator
- Apply effects (distortion, reverb, delay) to the alphaTab synthesizer output
- Could use libraries like [Tone.js](https://tonejs.github.io/) or custom AudioWorklet nodes

### MIDI Input Support
- Detect notes played on a connected MIDI guitar/keyboard
- Compare against the tablature to provide accuracy feedback
- Web MIDI API is available in both browser and Tauri WebView contexts

### Import from Other Sources
- Support importing tabs from MusicXML, MIDI, or text-based tab formats
- alphaTab already supports MusicXML; MIDI import would need a converter layer

### Cloud Sync (Optional)
- Sync song library and practice data across devices
- Could use a simple file-based sync (Syncthing, Dropbox folder) since it's all local files + a SQLite DB
- Keep it optional — the app should always work fully offline

---

## Architectural Notes

### State Management
The current architecture separates concerns well:
- **Go backend** (`app.go`) handles all file I/O, settings, and future app logic
- **JS frontend** (`main.js`) is a thin alphaTab wrapper (~180 lines)

As features grow, consider:
- Adding new Go methods in `app.go` (Wails auto-generates JS bindings)
- Keeping the JS layer as thin as possible — just UI rendering
- Using Go structs for complex data passed to/from the frontend

### Testing
- Use Go's built-in `testing` package for backend unit tests (`go test ./...`)
- Test settings persistence, recent files logic, file reading independently
- Use [Playwright](https://playwright.dev/) for E2E tests of the full Wails app

### Performance
- alphaTab renders can be heavy for large scores; consider lazy rendering or virtual scrolling for very long songs
- The `optimizeDeps.exclude` for alphaTab in Vite config prevents bundler issues with its web worker

### Packaging & Distribution
- `wails build` produces a single native binary
- Cross-compilation requires the target platform's GTK/WebKit libs
- Consider auto-update via a simple version check endpoint
- Code signing is needed for macOS/Windows distribution outside of dev
