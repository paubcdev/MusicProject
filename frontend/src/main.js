import * as alphaTab from '@coderline/alphatab';
import { OpenFileDialog, GetRecentFiles, OpenRecentFile, LoadSettings, SaveSettings } from '../wailsjs/go/main/App';

// ── DOM references ──
const dropZone     = document.getElementById('drop-zone');
const atWrap       = document.getElementById('at-wrap');
const viewport     = document.getElementById('at-viewport');
const loading      = document.getElementById('loading');
const progressFill = document.getElementById('progress-fill');

const btnOpen    = document.getElementById('btn-open');
const btnBrowse  = document.getElementById('btn-browse');
const btnRecent  = document.getElementById('btn-recent');
const recentMenu = document.getElementById('recent-menu');
const btnPlay    = document.getElementById('btn-play');
const btnStop    = document.getElementById('btn-stop');
const btnCountIn = document.getElementById('btn-countin');
const btnLoop    = document.getElementById('btn-loop');
const selTrack   = document.getElementById('sel-track');
const rngTempo   = document.getElementById('rng-tempo');
const txtTempo   = document.getElementById('txt-tempo');
const lblTrack   = document.getElementById('lbl-track');
const lblTempo   = document.getElementById('lbl-tempo');

// ── State ──
let api = null;
let tracks = [];
let isPlaying = false;
let settings = { tempo: 100, looping: false, countIn: false };

// ── Base64 to Uint8Array ──
// Wails serializes Go []byte as a base64 string in JSON.
// We must decode it before passing to alphaTab.
function base64ToUint8Array(base64) {
  if (!base64) return null;
  // If it's already an array/Uint8Array (e.g. from drag-and-drop), return as-is
  if (base64 instanceof Uint8Array) return base64;
  if (Array.isArray(base64)) return new Uint8Array(base64);
  // Decode base64 string
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// ── Initialize alphaTab ──
function initAlphaTab() {
  const atSettings = new alphaTab.Settings();
  atSettings.core.fontDirectory = '/font/';
  atSettings.player.enablePlayer = true;
  atSettings.player.enableCursor = true;
  atSettings.player.enableUserInteraction = true;
  atSettings.player.soundFont = '/soundfont/sonivox.sf2';
  atSettings.display.layoutMode = alphaTab.LayoutMode.Page;

  api = new alphaTab.AlphaTabApi(viewport, atSettings);

  api.scoreLoaded.on((score) => {
    tracks = score.tracks;
    populateTrackSelector();
    showPlayerControls();
    dropZone.classList.add('hidden');
    atWrap.classList.remove('hidden');
    loading.classList.add('hidden');
  });

  api.playerStateChanged.on((e) => {
    isPlaying = e.state === alphaTab.synth.PlayerState.Playing;
    btnPlay.textContent = isPlaying ? '⏸ Pause' : '▶ Play';
    btnPlay.classList.toggle('active', isPlaying);
  });

  api.playerPositionChanged.on((e) => {
    const pct = (e.currentTime / e.endTime) * 100;
    progressFill.style.width = (isNaN(pct) ? 0 : pct) + '%';
  });

  api.renderStarted.on(() => loading.classList.remove('hidden'));
  api.renderFinished.on(() => loading.classList.add('hidden'));
}

// ── Load file data into alphaTab ──
function loadFileData(data) {
  if (!data) return;
  const bytes = base64ToUint8Array(data);
  if (!bytes || bytes.length === 0) return;
  api.load(bytes);
}

// ── UI helpers ──
function populateTrackSelector() {
  selTrack.innerHTML = '';
  tracks.forEach((t, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = t.name || `Track ${i + 1}`;
    selTrack.appendChild(opt);
  });
}

function showPlayerControls() {
  btnPlay.classList.remove('hidden');
  btnStop.classList.remove('hidden');
  btnCountIn.classList.remove('hidden');
  btnLoop.classList.remove('hidden');
  lblTrack.classList.remove('hidden');
  lblTempo.classList.remove('hidden');
}

async function refreshRecentMenu() {
  const files = await GetRecentFiles();
  recentMenu.innerHTML = '';
  if (!files || files.length === 0) {
    recentMenu.innerHTML = '<div class="empty">No recent files</div>';
    return;
  }
  files.forEach((path) => {
    const a = document.createElement('a');
    a.href = '#';
    a.textContent = path.split('/').pop();
    a.title = path;
    a.addEventListener('click', async (e) => {
      e.preventDefault();
      recentMenu.classList.add('hidden');
      const data = await OpenRecentFile(path);
      loadFileData(data);
    });
    recentMenu.appendChild(a);
  });
}

// ── Apply saved settings ──
function applySettings(s) {
  settings = s;
  rngTempo.value = s.tempo || 100;
  txtTempo.textContent = rngTempo.value + '%';
  if (api) {
    api.playbackSpeed = rngTempo.value / 100;
    api.isLooping = !!s.looping;
    api.countInVolume = s.countIn ? 1 : 0;
  }
  btnLoop.classList.toggle('active', !!s.looping);
  btnCountIn.classList.toggle('active', !!s.countIn);
}

function persistSettings() {
  settings.tempo = parseInt(rngTempo.value);
  settings.looping = btnLoop.classList.contains('active');
  settings.countIn = btnCountIn.classList.contains('active');
  SaveSettings(settings);
}

// ── Event listeners ──

// Open file via Go native dialog
btnOpen.addEventListener('click', async () => {
  const data = await OpenFileDialog();
  loadFileData(data);
});

btnBrowse.addEventListener('click', async () => {
  const data = await OpenFileDialog();
  loadFileData(data);
});

// Recent files dropdown
btnRecent.addEventListener('click', () => {
  recentMenu.classList.toggle('hidden');
  if (!recentMenu.classList.contains('hidden')) {
    refreshRecentMenu();
    // Position next to button
    const rect = btnRecent.getBoundingClientRect();
    recentMenu.style.left = rect.left + 'px';
    recentMenu.style.top = rect.bottom + 4 + 'px';
  }
});

// Close dropdown on outside click
document.addEventListener('click', (e) => {
  if (!btnRecent.contains(e.target) && !recentMenu.contains(e.target)) {
    recentMenu.classList.add('hidden');
  }
});

// Playback
btnPlay.addEventListener('click', () => api?.playPause());
btnStop.addEventListener('click', () => {
  api?.stop();
  progressFill.style.width = '0%';
});

// Count-in
btnCountIn.addEventListener('click', () => {
  btnCountIn.classList.toggle('active');
  api.countInVolume = btnCountIn.classList.contains('active') ? 1 : 0;
  persistSettings();
});

// Loop
btnLoop.addEventListener('click', () => {
  btnLoop.classList.toggle('active');
  api.isLooping = btnLoop.classList.contains('active');
  persistSettings();
});

// Track selection
selTrack.addEventListener('change', () => {
  const track = tracks[parseInt(selTrack.value)];
  if (track) api.renderTracks([track]);
});

// Tempo
rngTempo.addEventListener('input', () => {
  txtTempo.textContent = rngTempo.value + '%';
  api.playbackSpeed = rngTempo.value / 100;
});
rngTempo.addEventListener('change', () => persistSettings());

// Drag & drop (for files dropped directly onto the window)
dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragging'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragging'));
dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragging');
  const file = e.dataTransfer.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (ev) => loadFileData(new Uint8Array(ev.target.result));
    reader.readAsArrayBuffer(file);
  }
});

// Also support drop on the whole window when a file is already loaded
document.addEventListener('dragover', (e) => e.preventDefault());
document.addEventListener('drop', (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (file && api) {
    const reader = new FileReader();
    reader.onload = (ev) => loadFileData(new Uint8Array(ev.target.result));
    reader.readAsArrayBuffer(file);
  }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (!api) return;
  switch (e.code) {
    case 'Space':
      e.preventDefault();
      api.playPause();
      break;
    case 'Escape':
      api.stop();
      progressFill.style.width = '0%';
      break;
    case 'KeyL':
      btnLoop.click();
      break;
    case 'Equal': // +
    case 'NumpadAdd':
      rngTempo.value = Math.min(200, parseInt(rngTempo.value) + 5);
      rngTempo.dispatchEvent(new Event('input'));
      persistSettings();
      break;
    case 'Minus':
    case 'NumpadSubtract':
      rngTempo.value = Math.max(25, parseInt(rngTempo.value) - 5);
      rngTempo.dispatchEvent(new Event('input'));
      persistSettings();
      break;
  }
});

// ── Startup ──
initAlphaTab();
LoadSettings().then(applySettings);
