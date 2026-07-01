(function () {
  if (window.__rvBgAudioReady) return;
  window.__rvBgAudioReady = true;
  const STORAGE_KEY = 'rv-music';
  const MASTER_VOLUME = 0.1;
  const FADE_SECONDS = 2.2;

  const CHORDS = [
    [146.83, 174.61, 220.0, 293.66],
    [116.54, 146.83, 174.61, 233.08],
    [130.81, 164.81, 196.0, 261.63],
    [164.81, 196.0, 246.94, 329.63]
  ];

  let audioCtx = null;
  let masterGain = null;
  let filterNode = null;
  let lfoNode = null;
  let lfoGain = null;
  let delayNode = null;
  let delayGain = null;
  let voiceNodes = [];
  let chordIndex = 0;
  let chordTimer = null;
  let running = false;
  let fadeRaf = 0;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function syncToggleButtons(on) {
    document.querySelectorAll('.music-toggle').forEach(btn => {
      btn.classList.toggle('is-playing', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.setAttribute('aria-label', on ? 'Turn background music off' : 'Turn background music on');
    });
  }

  function fadeMasterTo(value, seconds) {
    if (!masterGain || !audioCtx) return Promise.resolve();
    window.cancelAnimationFrame(fadeRaf);
    const from = masterGain.gain.value;
    const to = value;
    const t0 = performance.now();

    return new Promise(resolve => {
      function step(now) {
        const t = Math.min((now - t0) / (seconds * 1000), 1);
        const eased = t * t * (3 - 2 * t);
        masterGain.gain.setTargetAtTime(from + (to - from) * eased, audioCtx.currentTime, 0.015);
        if (t < 1) {
          fadeRaf = window.requestAnimationFrame(step);
        } else {
          resolve();
        }
      }
      fadeRaf = window.requestAnimationFrame(step);
    });
  }

  function disposeVoices() {
    voiceNodes.forEach(({ osc, gain }) => {
      try {
        osc.stop();
        osc.disconnect();
        gain.disconnect();
      } catch (_) {}
    });
    voiceNodes = [];
  }

  function setChord(freqs) {
    if (!audioCtx || !masterGain || !filterNode) return;
    disposeVoices();

    freqs.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = i === 0 ? 'sine' : 'triangle';
      osc.frequency.value = freq;
      osc.detune.value = (i - 1.5) * 6;
      gain.gain.value = i === 0 ? 0.34 : 0.18;
      osc.connect(gain);
      gain.connect(filterNode);
      osc.start();
      voiceNodes.push({ osc, gain });
    });
  }

  function scheduleChords() {
    clearTimeout(chordTimer);
    if (!running) return;
    setChord(CHORDS[chordIndex]);
    chordIndex = (chordIndex + 1) % CHORDS.length;
    chordTimer = window.setTimeout(scheduleChords, 12000);
  }

  function buildGraph() {
    if (audioCtx) return;

    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0;

    filterNode = audioCtx.createBiquadFilter();
    filterNode.type = 'lowpass';
    filterNode.frequency.value = 820;
    filterNode.Q.value = 0.6;

    lfoNode = audioCtx.createOscillator();
    lfoGain = audioCtx.createGain();
    lfoNode.type = 'sine';
    lfoNode.frequency.value = 0.045;
    lfoGain.gain.value = 180;
    lfoNode.connect(lfoGain);
    lfoGain.connect(filterNode.frequency);
    lfoNode.start();

    delayNode = audioCtx.createDelay(1.2);
    delayNode.delayTime.value = 0.38;
    delayGain = audioCtx.createGain();
    delayGain.gain.value = 0.16;

    filterNode.connect(masterGain);
    filterNode.connect(delayNode);
    delayNode.connect(delayGain);
    delayGain.connect(filterNode);
    masterGain.connect(audioCtx.destination);
  }

  async function startMusic() {
    if (reducedMotion.matches) return;
    buildGraph();
    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }
    running = true;
    scheduleChords();
    await fadeMasterTo(MASTER_VOLUME, FADE_SECONDS);
  }

  async function stopMusic() {
    running = false;
    clearTimeout(chordTimer);
    await fadeMasterTo(0, FADE_SECONDS * 0.75);
    disposeVoices();
  }

  async function setMusic(on, persist = true) {
    syncToggleButtons(on);
    if (persist) {
      try { localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off'); } catch (_) {}
    }
    if (on) await startMusic();
    else await stopMusic();
  }

  function initToggle() {
    syncToggleButtons(false);

    document.addEventListener('click', event => {
      const btn = event.target.closest('.music-toggle');
      if (!btn) return;
      // Home page owns the ambient track; the arcade has its own controller.
      if (window.location.pathname !== '/') return;
      event.preventDefault();
      const next = !btn.classList.contains('is-playing');
      setMusic(next);
    });

    document.addEventListener('visibilitychange', () => {
      if (!running || !masterGain || !audioCtx) return;
      if (document.hidden) {
        masterGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.08);
      } else {
        masterGain.gain.setTargetAtTime(MASTER_VOLUME, audioCtx.currentTime, 0.35);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initToggle, { once: true });
  } else {
    initToggle();
  }

  window.rvSetMusic = setMusic;
})();
