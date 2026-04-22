import { useRef, useState, useEffect, useCallback } from 'react'
import * as alphaTab from '@coderline/alphatab'
import './App.css'

export default function App() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const apiRef = useRef<alphaTab.AlphaTabApi | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [loaded, setLoaded] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [tracks, setTracks] = useState<alphaTab.model.Track[]>([])
  const [activeTrackIndex, setActiveTrackIndex] = useState(0)
  const [tempo, setTempo] = useState(100) // percentage
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [countIn, setCountIn] = useState(false)
  const [looping, setLooping] = useState(false)

  // Initialize alphaTab
  useEffect(() => {
    if (!viewportRef.current) return

    const settings = new alphaTab.Settings()
    settings.core.fontDirectory = '/font/'
    settings.player.enablePlayer = true
    settings.player.enableCursor = true
    settings.player.enableUserInteraction = true
    settings.player.soundFont = '/soundfont/sonivox.sf2'
    settings.display.layoutMode = alphaTab.LayoutMode.Page

    const api = new alphaTab.AlphaTabApi(viewportRef.current, settings)

    api.scoreLoaded.on((score) => {
      setTracks(score.tracks)
      setActiveTrackIndex(0)
      setLoaded(true)
      setLoading(false)
    })

    api.playerStateChanged.on((e) => {
      setPlaying(e.state === alphaTab.synth.PlayerState.Playing)
    })

    api.playerPositionChanged.on((e) => {
      const pct = (e.currentTime / e.endTime) * 100
      setProgress(isNaN(pct) ? 0 : pct)
    })

    api.renderStarted.on(() => setLoading(true))
    api.renderFinished.on(() => setLoading(false))

    apiRef.current = api

    return () => {
      api.destroy()
      apiRef.current = null
    }
  }, [])

  // Sync tempo
  useEffect(() => {
    const api = apiRef.current
    if (api) {
      api.playbackSpeed = tempo / 100
    }
  }, [tempo])

  // Sync count-in
  useEffect(() => {
    const api = apiRef.current
    if (api) {
      api.countInVolume = countIn ? 1 : 0
    }
  }, [countIn])

  // Sync looping
  useEffect(() => {
    const api = apiRef.current
    if (api) {
      api.isLooping = looping
    }
  }, [looping])

  // Load file
  const loadFile = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = new Uint8Array(e.target!.result as ArrayBuffer)
      apiRef.current?.load(data)
    }
    reader.readAsArrayBuffer(file)
  }, [])

  const handleFileSelect = () => fileInputRef.current?.click()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) loadFile(file)
  }

  // Drag & drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }
  const handleDragLeave = () => setDragging(false)
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) loadFile(file)
  }

  // Playback controls
  const togglePlay = () => apiRef.current?.playPause()
  const stop = () => {
    apiRef.current?.stop()
    setPlaying(false)
    setProgress(0)
  }

  // Track selection
  const handleTrackChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const idx = Number(e.target.value)
    setActiveTrackIndex(idx)
    const track = tracks[idx]
    if (track && apiRef.current) {
      apiRef.current.renderTracks([track])
    }
  }

  return (
    <div className="app">
      {/* Toolbar */}
      <div className="toolbar">
        <h1>🎸 TabPlayer</h1>
        <button onClick={handleFileSelect}>Open File</button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".gp,.gp3,.gp4,.gp5,.gpx,.gp7,.musicxml,.mxl,.capx"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {loaded && (
          <>
            <div className="separator" />

            <button onClick={togglePlay} className={playing ? 'active' : ''}>
              {playing ? '⏸ Pause' : '▶ Play'}
            </button>
            <button onClick={stop}>⏹ Stop</button>

            <div className="separator" />

            <button
              onClick={() => setCountIn(!countIn)}
              className={countIn ? 'active' : ''}
            >
              Count-In
            </button>
            <button
              onClick={() => setLooping(!looping)}
              className={looping ? 'active' : ''}
            >
              🔁 Loop
            </button>

            <div className="separator" />

            <label>
              Track:
              <select value={activeTrackIndex} onChange={handleTrackChange}>
                {tracks.map((t, i) => (
                  <option key={i} value={i}>
                    {t.name || `Track ${i + 1}`}
                  </option>
                ))}
              </select>
            </label>

            <div className="separator" />

            <label>
              Tempo:
              <input
                type="range"
                min={25}
                max={200}
                value={tempo}
                onChange={(e) => setTempo(Number(e.target.value))}
              />
              <span className="tempo-display">{tempo}%</span>
            </label>
          </>
        )}
      </div>

      {/* Main content */}
      {!loaded ? (
        <div
          className={`drop-zone ${dragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <p>🎵 Drop a Guitar Pro file here</p>
          <p className="hint">.gp, .gp3, .gp4, .gp5, .gpx, .gp7, .musicxml</p>
          <button onClick={handleFileSelect}>Browse Files</button>
        </div>
      ) : null}

      <div className="at-wrap" style={{ display: loaded ? 'flex' : 'none' }}>
        {loading && (
          <div className="loading-overlay">Loading...</div>
        )}
        <div className="at-viewport" ref={viewportRef} />
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
