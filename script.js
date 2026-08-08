/* ╔══════════════════════════════════════════╗
   ║   GlassWave — Premium Logic Engine        ║
   ╚══════════════════════════════════════════╝ */

// ── DOM References ──
const audioPlayer = document.getElementById('audioPlayer');
const particleField = document.getElementById('particleField');
const trackInput = document.getElementById('trackInput');
const trackList = document.getElementById('trackList');
const playButton = document.getElementById('playButton');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const coverArt = document.getElementById('coverArt');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const progressThumb = document.getElementById('progressThumb');
const volumeBar = document.getElementById('volumeBar');
const volumeFill = document.getElementById('volumeFill');
const nowTitle = document.getElementById('nowTitle');
const nowArtist = document.getElementById('nowArtist');
const nowAlbum = document.getElementById('nowAlbum');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');
const trackCountEl = document.getElementById('trackCount');
const tabButtons = document.querySelectorAll('.tab-item');
const tabPanels = document.querySelectorAll('.tab-panel');

// ── Accent Palette for covers ──
const coverPalettes = [
  { from: '#a855f7', to: '#6366f1' },
  { from: '#ec4899', to: '#a855f7' },
  { from: '#6366f1', to: '#3b82f6' },
  { from: '#f59e0b', to: '#ec4899' },
  { from: '#10b981', to: '#6366f1' },
  { from: '#f43f5e', to: '#f59e0b' },
];

// ── Ball Colors ──
const ballPalette = [
  '#ffffff', '#e2e2e2', '#c4c4c4',
  '#a6a6a6', '#888888', '#6a6a6a',
  '#4c4c4c', '#eeeeee', '#dddddd',
];

// ── Track Library ──
const defaultTracks = [];

// ── App State ──
const state = {
  tracks: [...defaultTracks],
  currentTrackIndex: 0,
  isPlaying: false,
  analyser: null,
  audioContext: null,
  sourceNode: null,
  particles: [],
};

// ═══════════════════════════════
// AMBIENT BACKGROUND
// ═══════════════════════════════

function createAmbientBalls() {
  const layer = document.getElementById('ambientLayer');
  if (!layer) return;

  const count = 55;

  for (let i = 0; i < count; i++) {
    const ball = document.createElement('span');
    ball.className = 'ambient-ball';

    const size = 8 + Math.random() * 80;
    const color = ballPalette[Math.floor(Math.random() * ballPalette.length)];
    const opacity = 0.15 + Math.random() * 0.45;

    ball.style.width = `${size}px`;
    ball.style.height = `${size}px`;
    ball.style.left = `${Math.random() * 100}vw`;
    ball.style.top = `${Math.random() * 100}vh`;
    ball.style.background = `radial-gradient(circle at 30% 30%, ${color}, ${color}88)`;
    ball.style.opacity = opacity;
    ball.style.boxShadow = `0 0 ${size * 0.6}px ${color}44`;
    ball.style.animationDuration = `${18 + Math.random() * 30}s`;
    ball.style.animationDelay = `-${Math.random() * 40}s`;

    layer.appendChild(ball);
  }
}

// ═══════════════════════════════
// PARTICLE SYSTEM
// ═══════════════════════════════

function createParticles() {
  const count = 22;
  particleField.innerHTML = '';

  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.className = 'particle';

    const size = 2 + Math.random() * 4;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.left = `${Math.random() * 100}%`;
    p.style.top = `${Math.random() * 100}%`;
    p.style.opacity = `${0.1 + Math.random() * 0.4}`;

    particleField.appendChild(p);
    state.particles.push({
      el: p,
      bx: Math.random() * 100,
      by: Math.random() * 100,
      phase: Math.random() * Math.PI * 2,
      size,
    });
  }
}

function ensureAudioGraph() {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return;

  if (!state.audioContext) {
    state.audioContext = new Ctx();
    state.analyser = state.audioContext.createAnalyser();
    state.analyser.fftSize = 256;
    state.analyser.smoothingTimeConstant = 0.88;
  }

  if (!state.sourceNode) {
    try {
      state.sourceNode = state.audioContext.createMediaElementSource(audioPlayer);
      state.sourceNode.connect(state.analyser);
      state.analyser.connect(state.audioContext.destination);
    } catch (error) {
      console.warn('AudioContext indisponível para este arquivo:', error.message);
      state.sourceNode = null;
      state.analyser = null;
    }
  }
}

function animateParticles() {
  if (!state.analyser || !state.particles.length) {
    requestAnimationFrame(animateParticles);
    return;
  }

  const data = new Uint8Array(state.analyser.frequencyBinCount);
  state.analyser.getByteFrequencyData(data);

  const avg = data.reduce((s, v) => s + v, 0) / data.length;
  const intensity = avg / 255;
  const now = performance.now();

  state.particles.forEach((p, i) => {
    const sx = Math.sin(now * 0.001 + p.phase + i) * (14 + intensity * 24);
    const sy = Math.cos(now * 0.0008 + p.phase * 1.3 + i) * (10 + intensity * 18);
    const sc = 0.8 + intensity * 1.6 + Math.sin(now * 0.0012 + i) * 0.15;
    const x = p.bx + sx;
    const y = p.by + sy + Math.sin(now * 0.0009 + i) * 10;

    p.el.style.transform = `translate(${x}px, ${y}px) scale(${sc})`;
    p.el.style.opacity = `${0.1 + intensity * 0.6}`;
  });

  requestAnimationFrame(animateParticles);
}

// ═══════════════════════════════
// TRACK MANAGEMENT
// ═══════════════════════════════

function formatTime(value) {
  if (!Number.isFinite(value) || value < 0) return '00:00';
  const m = Math.floor(value / 60);
  const s = Math.floor(value % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function updateCover(track) {
  const idx = state.tracks.indexOf(track);
  const palette = coverPalettes[idx % coverPalettes.length];

  if (track.cover) {
    coverArt.style.background = `url(${track.cover}) center/cover no-repeat`;
    coverArt.querySelector('.cover-inner').innerHTML = '';
  } else {
    coverArt.style.background = `linear-gradient(135deg, ${palette.from}, ${palette.to})`;
    coverArt.querySelector('.cover-inner').innerHTML = `
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
        <path d="M9 18V5l12-2v13" stroke="rgba(255,255,255,0.6)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="6" cy="18" r="3" stroke="rgba(255,255,255,0.6)" stroke-width="1.5"/>
        <circle cx="18" cy="16" r="3" stroke="rgba(255,255,255,0.6)" stroke-width="1.5"/>
      </svg>`;
  }
}

function updateNowPlaying(track) {
  if (!track) return;
  nowTitle.textContent = track.title;
  nowArtist.textContent = track.artist;
  nowAlbum.textContent = track.album;
  totalTimeEl.textContent = track.duration;
  updateCover(track);
}

function renderTrackList() {
  const tracks = state.tracks;
  trackList.innerHTML = '';
  trackCountEl.textContent = `${tracks.length} faixa${tracks.length !== 1 ? 's' : ''}`;

  if (!tracks.length) {
    trackList.innerHTML = `
      <div class="track-item" style="justify-content:center; opacity:0.5;">
        <div class="track-text" style="text-align:center;">
          <strong>Nenhuma faixa</strong>
          <span>Adicione músicas para começar</span>
        </div>
      </div>`;
    return;
  }

  tracks.forEach((track, index) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'track-item';
    item.style.animationDelay = `${index * 0.05}s`;

    if (index === state.currentTrackIndex) {
      item.classList.add('active');
    }

    const palette = coverPalettes[index % coverPalettes.length];

    item.innerHTML = `
      <div class="song-cover" style="${track.cover ? `background: url(${track.cover}) center/cover` : `background: linear-gradient(135deg, ${palette.from}44, ${palette.to}44)`}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M9 18V5l12-2v13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="6" cy="18" r="3" stroke="currentColor" stroke-width="1.5"/>
          <circle cx="18" cy="16" r="3" stroke="currentColor" stroke-width="1.5"/>
        </svg>
      </div>
      <div class="track-text">
        <strong>${track.title}</strong>
        <span>${track.artist}</span>
      </div>
      <div class="track-duration">${track.duration}</div>
    `;

    item.addEventListener('click', () => {
      state.currentTrackIndex = index;
      loadTrack(index, true);
      renderTrackList();
    });

    trackList.appendChild(item);
  });
}

function loadTrack(index, autoplay = false) {
  const track = state.tracks[index];
  if (!track) return;

  audioPlayer.crossOrigin = 'anonymous';
  audioPlayer.src = track.src;
  audioPlayer.load();
  updateNowPlaying(track);

  if (autoplay) {
    try {
      ensureAudioGraph();
      state.audioContext?.resume();
      const playPromise = audioPlayer.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise
          .then(() => {
            state.isPlaying = true;
            updatePlayButton();
          })
          .catch(() => {
            state.isPlaying = false;
            updatePlayButton();
          });
      } else {
        state.isPlaying = true;
        updatePlayButton();
      }
    } catch (error) {
      console.warn('Erro ao iniciar reprodução:', error.message);
      state.isPlaying = false;
      updatePlayButton();
    }
  }
}

// ═══════════════════════════════
// PLAYER CONTROLS
// ═══════════════════════════════

function updatePlayButton() {
  const playIcon = playButton.querySelector('.play-icon');
  const pauseIcon = playButton.querySelector('.pause-icon');

  if (state.isPlaying) {
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
  } else {
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
  }
}

function syncProgress() {
  const dur = audioPlayer.duration || 0;
  const cur = audioPlayer.currentTime || 0;
  const pct = dur ? (cur / dur) * 100 : 0;

  progressFill.style.width = `${pct}%`;
  progressThumb.style.left = `${pct}%`;
  progressBar.value = pct;
  currentTimeEl.textContent = formatTime(cur);

  if (dur) {
    totalTimeEl.textContent = formatTime(dur);
  }
}

function togglePlayback() {
  if (!audioPlayer.src) {
    loadTrack(state.currentTrackIndex, true);
    return;
  }

  try {
    ensureAudioGraph();
    state.audioContext?.resume();

    if (audioPlayer.paused) {
      const playPromise = audioPlayer.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise
          .then(() => {
            state.isPlaying = true;
            updatePlayButton();
          })
          .catch(() => {
            state.isPlaying = false;
            updatePlayButton();
          });
        return;
      }
      state.isPlaying = true;
    } else {
      audioPlayer.pause();
      state.isPlaying = false;
    }
  } catch (error) {
    console.warn('Erro ao alternar reprodução:', error.message);
    state.isPlaying = false;
  }

  updatePlayButton();
}

function playNext() {
  state.currentTrackIndex = (state.currentTrackIndex + 1) % state.tracks.length;
  loadTrack(state.currentTrackIndex, true);
  renderTrackList();
}

function playPrev() {
  state.currentTrackIndex = (state.currentTrackIndex - 1 + state.tracks.length) % state.tracks.length;
  loadTrack(state.currentTrackIndex, true);
  renderTrackList();
}

// ═══════════════════════════════
// EVENT LISTENERS
// ═══════════════════════════════

function switchTab(tabName) {
  tabButtons.forEach((button) => {
    const isActive = button.dataset.tab === tabName;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-selected', String(isActive));
  });

  tabPanels.forEach((panel) => {
    const isVisible = panel.dataset.tabPanel === tabName;
    panel.classList.toggle('active', isVisible);
    panel.classList.toggle('hidden', !isVisible);
  });
}

function attachListeners() {
  tabButtons.forEach((button) => {
    button.addEventListener('click', () => switchTab(button.dataset.tab));
  });

  playButton.addEventListener('click', togglePlayback);
  prevButton.addEventListener('click', playPrev);
  nextButton.addEventListener('click', playNext);

  audioPlayer.addEventListener('timeupdate', syncProgress);
  audioPlayer.addEventListener('loadedmetadata', () => {
    totalTimeEl.textContent = formatTime(audioPlayer.duration);
  });
  audioPlayer.addEventListener('ended', playNext);

  // Progress bar
  progressBar.addEventListener('input', (e) => {
    const val = Number(e.target.value);
    progressFill.style.width = `${val}%`;
    progressThumb.style.left = `${val}%`;
    if (audioPlayer.duration) {
      audioPlayer.currentTime = (val / 100) * audioPlayer.duration;
    }
  });

  // Volume bar
  volumeBar.addEventListener('input', (e) => {
    const val = Number(e.target.value);
    audioPlayer.volume = val / 100;
    volumeFill.style.width = `${val}%`;
  });

  // File Upload
  trackInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach((file, i) => {
      const url = URL.createObjectURL(file);
      state.tracks.unshift({
        id: Date.now() + i,
        title: file.name.replace(/\.[^/.]+$/, ''),
        artist: 'Música local',
        album: 'Biblioteca local',
        duration: '00:00',
        src: url,
        cover: null,
      });
    });

    e.target.value = '';
    state.currentTrackIndex = 0;
    loadTrack(0, true);
    renderTrackList();
  });
}

// ═══════════════════════════════
// INITIALIZATION
// ═══════════════════════════════

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((error) => {
      console.warn('Service Worker não registrado:', error);
    });
  });
}

async function loadDefaultTracks() {
  try {
    const response = await fetch('./musicas/playlist.json');
    if (!response.ok) throw new Error('Playlist não encontrada');

    const tracks = await response.json();
    state.tracks = tracks.map((track, index) => ({
      ...track,
      id: track.id ?? index + 1,
      duration: track.duration || '00:00',
      cover: track.cover ?? null,
    }));

    if (state.tracks.length) {
      updateNowPlaying(state.tracks[0]);
      renderTrackList();
      return;
    }
  } catch (error) {
    console.warn('Erro ao carregar a playlist local:', error);
  }

  state.tracks = [{
    id: 1,
    title: 'Música local',
    artist: 'Biblioteca',
    album: 'Sem lista',
    duration: '00:00',
    src: '',
    cover: null,
  }];

  updateNowPlaying(state.tracks[0]);
  renderTrackList();
}

async function init() {
  audioPlayer.volume = Number(volumeBar.value) / 100;
  volumeFill.style.width = `${volumeBar.value}%`;
  progressFill.style.width = '0%';
  progressThumb.style.left = '0%';

  registerServiceWorker();
  createAmbientBalls();
  createParticles();
  animateParticles();
  attachListeners();
  await loadDefaultTracks();
  updatePlayButton();
}

init();
