/**
 * Notebook Arcade — original procedural 8-bit chiptune BGM (royalty-free).
 * Square-wave melody + triangle bass + light noise percussion via Web Audio API.
 */
(function () {
  if (window.__naArcadeReady) return;
  window.__naArcadeReady = true;
  const MASTER = 0.14;
  const FADE = 1.8;
  const BPM = 132;
  const STEP = 60 / BPM / 4; // 16th notes
  const LOOP_STEPS = 64;

  const N = {
    C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.0, A3: 220.0, B3: 246.94,
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880.0, B5: 987.77
  };

  // 64-step melody (null = rest)
  const MELODY = [
    N.E5, N.G5, N.A5, N.G5, N.E5, N.C5, N.D5, null,
    N.E5, N.G5, N.B5, N.A5, N.G5, N.E5, N.C5, null,
    N.G5, N.A5, N.B5, N.C5, N.B5, N.A5, N.G5, null,
    N.E5, N.D5, N.C5, N.D5, N.E5, N.G5, N.A5, null,
    N.C5, N.E5, N.G5, N.E5, N.C5, N.A4, N.B4, null,
    N.C5, N.D5, N.E5, N.G5, N.E5, N.D5, N.C5, null,
    N.A4, N.C5, N.E5, N.C5, N.A4, N.G4, N.E4, null,
    N.C4, N.D4, N.E4, N.G4, N.A4, N.G4, N.E4, null
  ];

  const BASS = [
    N.C3, null, N.G3, null, N.A3, null, N.E3, null,
    N.F3, null, N.C3, null, N.G3, null, N.G3, null,
    N.C3, null, N.G3, null, N.A3, null, N.E3, null,
    N.F3, null, N.C3, null, N.G3, null, N.C3, null,
    N.A3, null, N.E3, null, N.F3, null, N.C3, null,
    N.G3, null, N.D3, null, N.E3, null, N.C3, null,
    N.F3, null, N.C3, null, N.G3, null, N.E3, null,
    N.C3, null, N.G3, null, N.C3, null, N.C3, null
  ];

  // Kick on 0,4,8... snare on 8,24,40,56
  const KICK = new Set([0, 16, 32, 48]);
  const SNARE = new Set([8, 24, 40, 56]);

  let audioCtx = null;
  let master = null;
  let melodyGain = null;
  let bassGain = null;
  let running = false;
  let stepIndex = 0;
  let nextTime = 0;
  let timer = null;
  let fadeRaf = 0;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  function loadMusicPref() {
    try {
      const raw = localStorage.getItem('na-settings');
      if (raw) return JSON.parse(raw).music === true;
    } catch (_) {}
    return false;
  }

  function saveMusicPref(on) {
    try {
      const raw = localStorage.getItem('na-settings');
      const settings = raw ? JSON.parse(raw) : {};
      settings.music = on;
      localStorage.setItem('na-settings', JSON.stringify(settings));
    } catch (_) {}
  }

  function syncUI(on) {
    document.querySelectorAll('.music-toggle').forEach((btn) => {
      btn.classList.toggle('is-playing', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.setAttribute('aria-label', on ? 'Turn arcade music off' : 'Turn arcade music on');
    });
    document.querySelectorAll('[data-setting="music"]').forEach((btn) => {
      btn.classList.toggle('on', on);
    });
  }

  function fadeTo(value, sec) {
    if (!master || !audioCtx) return Promise.resolve();
    window.cancelAnimationFrame(fadeRaf);
    const from = master.gain.value;
    const t0 = performance.now();
    return new Promise((resolve) => {
      function step(now) {
        const t = Math.min((now - t0) / (sec * 1000), 1);
        const eased = t * t * (3 - 2 * t);
        master.gain.setTargetAtTime(from + (value - from) * eased, audioCtx.currentTime, 0.012);
        if (t < 1) fadeRaf = requestAnimationFrame(step);
        else resolve();
      }
      fadeRaf = requestAnimationFrame(step);
    });
  }

  function buildGraph() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    master = audioCtx.createGain();
    master.gain.value = 0;

    const comp = audioCtx.createDynamicsCompressor();
    comp.threshold.value = -22;
    comp.ratio.value = 3;

    melodyGain = audioCtx.createGain();
    melodyGain.gain.value = 0.55;
    bassGain = audioCtx.createGain();
    bassGain.gain.value = 0.42;

    melodyGain.connect(comp);
    bassGain.connect(comp);
    comp.connect(master);
    master.connect(audioCtx.destination);
  }

  function playTone(freq, time, dur, type, gainVal, detune = 0) {
    if (!freq || !audioCtx) return;
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, time);
    osc.detune.value = detune;
    g.gain.setValueAtTime(0.0001, time);
    g.gain.exponentialRampToValueAtTime(gainVal, time + 0.008);
    g.gain.setValueAtTime(gainVal * 0.85, time + dur * 0.55);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    osc.connect(g);
    g.connect(type === 'square' ? melodyGain : bassGain);
    osc.start(time);
    osc.stop(time + dur + 0.02);
  }

  function playNoise(time, dur, gainVal) {
    const len = Math.floor(audioCtx.sampleRate * dur);
    const buf = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i += 1) data[i] = Math.random() * 2 - 1;
    const src = audioCtx.createBufferSource();
    src.buffer = buf;
    const g = audioCtx.createGain();
    const filt = audioCtx.createBiquadFilter();
    filt.type = 'highpass';
    filt.frequency.value = 1200;
    g.gain.setValueAtTime(gainVal, time);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    src.connect(filt);
    filt.connect(g);
    g.connect(master);
    src.start(time);
    src.stop(time + dur);
  }

  function playKick(time) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(40, time + 0.08);
    g.gain.setValueAtTime(0.35, time);
    g.gain.exponentialRampToValueAtTime(0.0001, time + 0.1);
    osc.connect(g);
    g.connect(master);
    osc.start(time);
    osc.stop(time + 0.12);
  }

  function scheduleStep(step, time) {
    const mi = step % MELODY.length;
    const bi = step % BASS.length;
    const freq = MELODY[mi];
    const bass = BASS[bi];

    if (freq) playTone(freq, time, STEP * 0.92, 'square', 0.22);
    if (bass) playTone(bass, time, STEP * 1.05, 'triangle', 0.28);

    if (KICK.has(step % LOOP_STEPS)) playKick(time);
    if (SNARE.has(step % LOOP_STEPS)) playNoise(time, 0.06, 0.08);
  }

  function tick() {
    if (!running || !audioCtx) return;
    while (nextTime < audioCtx.currentTime + 0.12) {
      scheduleStep(stepIndex, nextTime);
      nextTime += STEP;
      stepIndex = (stepIndex + 1) % LOOP_STEPS;
    }
    timer = window.setTimeout(tick, 25);
  }

  async function start() {
    if (reduced.matches) return;
    buildGraph();
    if (audioCtx.state === 'suspended') await audioCtx.resume();
    running = true;
    stepIndex = 0;
    nextTime = audioCtx.currentTime + 0.05;
    tick();
    await fadeTo(MASTER, FADE);
  }

  async function stop() {
    running = false;
    clearTimeout(timer);
    await fadeTo(0, FADE * 0.7);
  }

  function syncUIFromPref() {
    const on = loadMusicPref();
    syncUI(on);
    return on;
  }

  async function setMusic(on, persist = true) {
    syncUI(on);
    if (persist) saveMusicPref(on);
    if (on) await start();
    else await stop();
  }

  function initToggle() {
    syncUIFromPref();

    document.addEventListener('click', (event) => {
      const navBtn = event.target.closest('.music-toggle');
      if (!navBtn) return;
      // Only the arcade owns the chiptune track.
      if (!window.location.pathname.startsWith('/play')) return;
      event.preventDefault();
      const next = !navBtn.classList.contains('is-playing');
      setMusic(next);
    }, true);

    const autoStart = (event) => {
      if (!window.location.pathname.startsWith('/play')) return;
      if (event.target.closest('.music-toggle')) return;
      if (loadMusicPref() && !running) setMusic(true, false);
      document.removeEventListener('click', autoStart);
    };
    document.addEventListener('click', autoStart);

    document.addEventListener('visibilitychange', () => {
      if (!running || !master || !audioCtx) return;
      if (document.hidden) master.gain.setTargetAtTime(0, audioCtx.currentTime, 0.06);
      else master.gain.setTargetAtTime(MASTER, audioCtx.currentTime, 0.3);
    });
  }

  window.naSetMusic = setMusic;
  window.naGetMusic = () => running;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initToggle, { once: true });
  } else {
    initToggle();
  }
})();
