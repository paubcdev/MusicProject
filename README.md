# 🎸 TabPlayer

**Practice guitar tabs offline, at your own pace.**

TabPlayer is a free, local desktop app for viewing and playing back Guitar Pro tablature files — no account, no internet, no ads. Load a file, hit play, and practice along with a synced cursor and built-in audio.

<!-- TODO: Add a screenshot or GIF here -->
<!-- ![TabPlayer screenshot](docs/images/screenshot.png) -->

## Download

> **Pre-built binaries coming soon.** For now, see [Building from Source](CONTRIBUTING.md#building-from-source) to run the app.

<!--
### Linux
Download the latest `.AppImage` or `.deb` from [Releases](https://github.com/paubcdev/MusicProject/releases).

### macOS / Windows
Coming soon.
-->

## What It Does

- **Open Guitar Pro files** — supports `.gp`, `.gp3`, `.gp4`, `.gp5`, `.gpx`, `.gp7`, `.musicxml`, `.mxl`, and `.capx`
- **Play back any tab** — built-in audio synthesizer, no external software needed
- **Follow along** — synced cursor scrolls through the notation as it plays
- **Switch instruments** — view and listen to guitar, bass, drums, or any track in the file
- **Practice at any speed** — slow down to 25% or speed up to 200%
- **Loop** — repeat the song to drill a section
- **Count-in** — get a metronome lead-in before playback starts
- **Drag and drop** — just drop a file onto the window
- **Recent files** — quickly reopen songs you've practiced before
- **Works offline** — everything runs locally on your machine

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Play / Pause | `Space` |
| Stop | `Escape` |
| Toggle loop | `L` |
| Tempo up (+5%) | `+` |
| Tempo down (-5%) | `-` |

## Supported File Formats

| Format | Extensions |
|--------|------------|
| Guitar Pro | `.gp`, `.gp3`, `.gp4`, `.gp5`, `.gpx`, `.gp7` |
| MusicXML | `.musicxml`, `.mxl` |
| Capella | `.capx` |

Guitar Pro files are the most common format. You can find free tabs on sites like [Ultimate Guitar](https://www.ultimate-guitar.com/) (look for "Guitar Pro" downloads) or export from apps like [TuxGuitar](https://tuxguitar.com.ar/).

## FAQ / Troubleshooting

**No sound when I press play?**
The app loads a SoundFont file on first playback. Give it a few seconds. If sound still doesn't work, check your system audio output.

**The app won't start on Ubuntu 24.04?**
This is a known issue with `webkit2gtk` versions. See the [Ubuntu 24.04 workaround](CONTRIBUTING.md#ubuntu-2404-note) in the contributing guide.

**Can I use this on macOS or Windows?**
The app is built with [Wails](https://wails.io/) which supports all three platforms. macOS and Windows builds are not yet provided as pre-built binaries, but you can [build from source](CONTRIBUTING.md#building-from-source).

**Where does it store my settings?**
Settings (tempo, loop, count-in, recent files) are saved to `~/.config/tabplayer/settings.json`.

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, architecture overview, and how to build from source.

For feature ideas and roadmap, see [docs/dev/roadmap.md](docs/dev/roadmap.md).

## Acknowledgments

- [alphaTab](https://www.alphatab.net/) — tablature parsing, rendering, and audio playback
- [Wails](https://wails.io/) — Go desktop app framework
- [Sonivox SoundFont](https://github.com/niclasr/SonivoxSF2) — instrument samples for audio playback

## License

This project is licensed under the [MIT License](LICENSE).
