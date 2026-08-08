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
const defaultTracks = [
  { id: 1, title: 'Midnight Rain', artist: 'Lo-Fi Chillers', album: 'Rainy Days', duration: '06:12', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', cover: null },
  { id: 2, title: 'Jazz Cafe', artist: 'Smooth Keys', album: 'Coffee & Chill', duration: '07:05', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', cover: null },
  { id: 3, title: 'Autumn Piano', artist: 'Acoustic Soul', album: 'Instrumentals', duration: '05:44', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', cover: null },
  { id: 4, title: 'Night Walk', artist: 'Lofi Beats', album: 'City Lights', duration: '05:02', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', cover: null },
  { id: 5, title: 'Soft Thunder', artist: 'Nature Sounds', album: 'Stormy Night', duration: '06:42', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', cover: null },
  { id: 6, title: 'Vintage Vinyl', artist: 'Jazz Quartet', album: 'Classic Cuts', duration: '04:30', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', cover: null },
  { id: 7, title: 'Morning Dew', artist: 'Chillhop Music', album: 'Dawn', duration: '05:11', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', cover: null },
  { id: 8, title: 'Silent Snow', artist: 'Piano Works', album: 'Winter', duration: '07:33', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', cover: null },
  { id: 9, title: 'Urban Rain', artist: 'Lofi Vibes', album: 'Streets', duration: '08:21', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', cover: null },
  { id: 10, title: 'Late Night Keys', artist: 'Jazz Bar', album: 'After Hours', duration: '06:55', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', cover: null },
  { id: 11, title: 'Ocean Waves', artist: 'Nature Calling', album: 'Sea Breeze', duration: '06:05', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3', cover: null },
  { id: 12, title: 'Study Session', artist: 'Lofi Beats', album: 'Focus', duration: '07:08', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3', cover: null },
  { id: 13, title: 'Distant Sax', artist: 'Smooth Jazz', album: 'Noire', duration: '06:17', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3', cover: null },
  { id: 14, title: 'Cozy Fireplace', artist: 'Acoustic Strings', album: 'Warmth', duration: '05:22', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3', cover: null },
  { id: 15, title: 'Neon Rain', artist: 'Synthwave Lofi', album: 'Cyber City', duration: '06:58', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3', cover: null },
  { id: 16, title: 'Acoustic Dawn', artist: 'Guitar Moods', album: 'Sunrise', duration: '07:25', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3', cover: null },
  { id: 17, title: 'Deep Focus', artist: 'Ambient Sounds', album: 'Mindfulness', duration: '07:11', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3', cover: null },
];

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

function init() {
  audioPlayer.volume = Number(volumeBar.value) / 100;
  volumeFill.style.width = `${volumeBar.value}%`;
  progressFill.style.width = '0%';
  progressThumb.style.left = '0%';

  createAmbientBalls();
  createParticles();
  animateParticles();
  updateNowPlaying(state.tracks[0]);
  renderTrackList();
  attachListeners();
  updatePlayButton();
}

init();
