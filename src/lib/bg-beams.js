const BEAM_PALETTE_LIGHT = [
  { core: '79, 85, 255', head: '120, 126, 255', glow: '79, 85, 255' },
  { core: '45, 140, 255', head: '80, 170, 255', glow: '45, 140, 255' },
  { core: '56, 201, 140', head: '90, 230, 175', glow: '56, 201, 140' },
  { core: '138, 87, 255', head: '170, 130, 255', glow: '138, 87, 255' }
];

const BEAM_PALETTE_DARK = [
  { core: '150, 155, 255', head: '230, 232, 255', glow: '100, 110, 255' },
  { core: '100, 190, 255', head: '210, 235, 255', glow: '60, 160, 255' },
  { core: '110, 245, 190', head: '220, 255, 240', glow: '70, 220, 160' },
  { core: '190, 150, 255', head: '240, 225, 255', glow: '150, 110, 255' }
];

function getGridSize() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--grid-size').trim();
  const size = parseFloat(raw);
  return Number.isFinite(size) && size > 0 ? size : 28;
}

function gridAxisOrigin(origin, gridSize) {
  return origin - gridSize / 2;
}

function lineCoordAt(index, origin, gridSize) {
  return gridAxisOrigin(origin, gridSize) + index * gridSize;
}

function lineIndexAt(value, origin, gridSize) {
  return Math.round((value - gridAxisOrigin(origin, gridSize)) / gridSize);
}

function laneCountsForWidth(width) {
  if (width < 640) return { h: 2, v: 2 };
  if (width < 980) return { h: 3, v: 3 };
  if (width < 1280) return { h: 4, v: 3 };
  return { h: 5, v: 4 };
}

function pickActiveLanes(width, height, gridSize, originX, originY) {
  const { h, v } = laneCountsForWidth(width);
  const horizontal = new Set();
  const vertical = new Set();
  const minH = lineIndexAt(gridSize, originY, gridSize);
  const maxH = lineIndexAt(height - gridSize, originY, gridSize);
  const minV = lineIndexAt(gridSize, originX, gridSize);
  const maxV = lineIndexAt(width - gridSize, originX, gridSize);
  const maxAttempts = 60;

  let attempts = 0;
  while (horizontal.size < h && attempts < maxAttempts) {
    attempts += 1;
    const index = minH + Math.floor(Math.random() * (maxH - minH + 1));
    horizontal.add(index);
  }

  attempts = 0;
  while (vertical.size < v && attempts < maxAttempts) {
    attempts += 1;
    const index = minV + Math.floor(Math.random() * (maxV - minV + 1));
    vertical.add(index);
  }

  return {
    horizontal: [...horizontal].sort((a, b) => a - b),
    vertical: [...vertical].sort((a, b) => a - b)
  };
}

function spawnBeam(width, height, gridSize, originX, originY, dark, laneIndex, axis) {
  const cellCount = 3 + Math.floor(Math.random() * 5);
  const palette = (dark ? BEAM_PALETTE_DARK : BEAM_PALETTE_LIGHT)[
    Math.floor(Math.random() * BEAM_PALETTE_LIGHT.length)
  ];
  const travelMargin = gridSize * (cellCount + 3);

  const base = {
    axis,
    laneIndex,
    cellCount,
    opacity: (dark ? 0.82 : 0.72) + Math.random() * 0.14,
    palette,
    phase: Math.random() * Math.PI * 2,
    pulseSpeed: 0.0035 + Math.random() * 0.0025,
    pulseCells: 2 + Math.floor(Math.random() * 3),
    speed: 48 + Math.random() * 52
  };

  if (axis === 'h') {
    const right = Math.random() > 0.5;
    return {
      ...base,
      direction: right ? 1 : -1,
      pos: right ? -travelMargin : width + travelMargin
    };
  }

  const down = Math.random() > 0.5;
  return {
    ...base,
    direction: down ? 1 : -1,
    pos: down ? -travelMargin : height + travelMargin
  };
}

function isOffScreen(beam, width, height, gridSize) {
  const margin = gridSize * 4;
  if (beam.axis === 'h') {
    return beam.direction > 0 ? beam.pos > width + margin : beam.pos < -margin;
  }
  return beam.direction > 0 ? beam.pos > height + margin : beam.pos < -margin;
}

function beamPosition(beam, gridSize, originX, originY) {
  if (beam.axis === 'h') {
    return {
      x: beam.pos,
      y: lineCoordAt(beam.laneIndex, originY, gridSize)
    };
  }
  return {
    x: lineCoordAt(beam.laneIndex, originX, gridSize),
    y: beam.pos
  };
}

function drawBeam(ctx, beam, dark, time, gridSize, originX, originY) {
  const horizontal = beam.axis === 'h';
  const { x: headX, y: headY } = beamPosition(beam, gridSize, originX, originY);
  const length = gridSize * beam.cellCount;
  const tailX = horizontal ? headX - beam.direction * length : headX;
  const tailY = horizontal ? headY : headY - beam.direction * length;
  const { core, head, glow } = beam.palette;

  const pulse = 0.72 + 0.28 * Math.sin(time * beam.pulseSpeed + beam.phase);
  const headPulse = 0.62 + 0.38 * Math.sin(time * beam.pulseSpeed * 1.6 + beam.phase * 1.35);
  const alpha = beam.opacity * pulse;
  const pulseLen = gridSize * beam.pulseCells;
  const pulseTailX = horizontal ? headX - beam.direction * pulseLen : headX;
  const pulseTailY = horizontal ? headY : headY - beam.direction * pulseLen;
  const glowAlpha = dark ? 0.28 : 0.22;

  ctx.save();
  ctx.lineCap = 'butt';

  ctx.lineWidth = 5;
  ctx.strokeStyle = `rgba(${glow}, ${alpha * glowAlpha * headPulse})`;
  ctx.beginPath();
  ctx.moveTo(pulseTailX, pulseTailY);
  ctx.lineTo(headX, headY);
  ctx.stroke();

  const gradient = ctx.createLinearGradient(tailX, tailY, headX, headY);
  gradient.addColorStop(0, `rgba(${core}, 0)`);
  gradient.addColorStop(0.28, `rgba(${core}, ${alpha * (dark ? 0.22 : 0.18)})`);
  gradient.addColorStop(0.68, `rgba(${core}, ${alpha * (dark ? 0.82 : 0.72)})`);
  gradient.addColorStop(0.88, `rgba(${head}, ${alpha * 0.95})`);
  gradient.addColorStop(1, `rgba(255, 255, 255, ${Math.min(alpha, 1)})`);

  ctx.lineWidth = dark ? 1.5 : 1.25;
  ctx.strokeStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(tailX, tailY);
  ctx.lineTo(headX, headY);
  ctx.stroke();

  const pulseGrad = ctx.createLinearGradient(pulseTailX, pulseTailY, headX, headY);
  pulseGrad.addColorStop(0, `rgba(${glow}, 0)`);
  pulseGrad.addColorStop(0.35, `rgba(${core}, ${alpha * 0.55 * headPulse})`);
  pulseGrad.addColorStop(0.78, `rgba(${head}, ${alpha * 0.98 * headPulse})`);
  pulseGrad.addColorStop(1, `rgba(255, 255, 255, ${Math.min(alpha * headPulse, 1)})`);

  ctx.lineWidth = dark ? 2 : 1.5;
  ctx.strokeStyle = pulseGrad;
  ctx.beginPath();
  ctx.moveTo(pulseTailX, pulseTailY);
  ctx.lineTo(headX, headY);
  ctx.stroke();

  ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.92 * headPulse})`;
  ctx.beginPath();
  ctx.arc(headX, headY, dark ? 2 : 1.6, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export function initBgBeams() {
  const grid = document.querySelector('.bg-grid');
  if (!grid || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;

  const canvas = document.createElement('canvas');
  canvas.className = 'bg-beams-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  grid.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  let beams = [];
  let width = 0;
  let height = 0;
  let dpr = 1;
  let rafId = 0;
  let gridSize = 28;
  let originX = 0;
  let originY = 0;
  let startTime = performance.now();
  let lastFrameTime = performance.now();

  function isDark() {
    return document.documentElement.dataset.theme === 'dark';
  }

  function updateGridMetrics() {
    gridSize = getGridSize();
    originX = width / 2;
    originY = height / 2;
  }

  function createBeams() {
    const dark = isDark();
    const lanes = pickActiveLanes(width, height, gridSize, originX, originY);

    beams = [
      ...lanes.horizontal.map(laneIndex => spawnBeam(width, height, gridSize, originX, originY, dark, laneIndex, 'h')),
      ...lanes.vertical.map(laneIndex => spawnBeam(width, height, gridSize, originX, originY, dark, laneIndex, 'v'))
    ];
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    updateGridMetrics();
    createBeams();
    lastFrameTime = performance.now();
  }

  function advanceBeam(beam, dt) {
    beam.pos += beam.direction * beam.speed * dt;
  }

  function tick(now) {
    const dt = Math.min((now - lastFrameTime) / 1000, 0.05);
    lastFrameTime = now;
    const time = now - startTime;
    const dark = isDark();

    ctx.clearRect(0, 0, width, height);

    beams.forEach((beam, index) => {
      advanceBeam(beam, dt);

      if (isOffScreen(beam, width, height, gridSize)) {
        beams[index] = spawnBeam(
          width,
          height,
          gridSize,
          originX,
          originY,
          dark,
          beam.laneIndex,
          beam.axis
        );
        return;
      }

      drawBeam(ctx, beam, dark, time, gridSize, originX, originY);
    });

    rafId = window.requestAnimationFrame(tick);
  }

  resize();
  rafId = window.requestAnimationFrame(tick);
  window.addEventListener('resize', resize);

  return () => {
    window.cancelAnimationFrame(rafId);
    window.removeEventListener('resize', resize);
    canvas.remove();
  };
}

