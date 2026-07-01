/** Canvas pixel-art landscape — crisp scale, layered depth */

const W = 512;
const H = 168;

const PALETTE = {
  light: {
    sky: ['#1a68c0', '#2888d8', '#40a0e8', '#68bcef', '#94d4f8', '#bce8ff'],
    sun: { core: '#ffe45a', shine: '#fff8a8', ray: '#ffc820' },
    cloud: { fill: '#ffffff', hi: '#f4fbff', sh: '#b8d8f0', deep: '#98c0e0' },
    mtnFar: { fill: '#6888a8', light: '#88a8c8', dark: '#506878', deep: '#405868', snow: '#f0f8ff', snowSh: '#c0d4e8' },
    mtnMid: { fill: '#488868', light: '#60a880', dark: '#386850', deep: '#285040' },
    hill: { fill: '#3a9848', light: '#52b860', dark: '#2a7838' },
    tree: {
      hi: '#78d888', mid: '#50b060', dark: '#389048', deep: '#287038', shade: '#1a5830',
      trunk: '#a87040', trunkHi: '#c89058', trunkD: '#684828', shadow: 'rgba(20,50,30,0.28)'
    },
    grass: { hi: '#80e868', mid: '#58c848', lo: '#40a838', edge: '#308828' },
    dirt: { top: '#a87848', mid: '#886038', lo: '#684828', stripe: '#503820' }
  },
  dark: {
    sky: ['#040810', '#081020', '#0c1830', '#102040', '#142850', '#183058'],
    sun: { core: '#e8eef8', shine: '#ffffff', ray: '#a8b8d0' },
    cloud: { fill: 'rgba(210,225,255,0.14)', hi: 'rgba(255,255,255,0.08)', sh: 'rgba(60,80,120,0.35)', deep: 'rgba(40,55,90,0.45)' },
    mtnFar: { fill: '#243048', light: '#304058', dark: '#182030', deep: '#101820', snow: '#7888a0', snowSh: '#485868' },
    mtnMid: { fill: '#143028', light: '#1c4030', dark: '#0c2018', deep: '#081810' },
    hill: { fill: '#143820', light: '#1c4828', dark: '#0c2818' },
    tree: {
      hi: '#248850', mid: '#186840', dark: '#105030', deep: '#083820', shade: '#062818',
      trunk: '#403020', trunkHi: '#584030', trunkD: '#281810', shadow: 'rgba(0,0,0,0.38)'
    },
    grass: { hi: '#1a5838', mid: '#144028', lo: '#0c3020', edge: '#082018' },
    dirt: { top: '#302018', mid: '#281810', lo: '#201008', stripe: '#100804' }
  }
};

function getTheme() {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

function setupCanvas(canvas) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = false;
  return ctx;
}

function rect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
}

function drawSky(ctx, pal) {
  const bands = pal.sky.length;
  for (let y = 0; y < H; y += 1) {
    const idx = Math.min(bands - 1, Math.floor((y / (H * 0.72)) * bands));
    rect(ctx, 0, y, W, 1, pal.sky[idx]);
  }
  // horizon glow
  for (let y = Math.floor(H * 0.55); y < H * 0.78; y += 2) {
    const t = (y - H * 0.55) / (H * 0.23);
    rect(ctx, 0, y, W, 2, t < 0.5 ? pal.sky[bands - 2] : pal.sky[bands - 1]);
  }
}

function drawCloud(ctx, cx, cy, scale, c) {
  const puff = (px, py, w, h, col) => {
    rect(ctx, cx + px * scale, cy + py * scale, w * scale, h * scale, col);
  };
  // underside depth
  puff(-22, 10, 44, 5, c.deep);
  puff(-18, 6, 36, 5, c.sh);
  // main body lobes
  puff(-24, 4, 48, 10, c.fill);
  puff(-20, 0, 40, 8, c.fill);
  puff(-14, -4, 28, 8, c.fill);
  puff(-10, -8, 20, 6, c.fill);
  puff(-4, -10, 12, 5, c.fill);
  // top puffs
  puff(-18, -2, 10, 5, c.hi);
  puff(-8, -6, 8, 4, c.hi);
  puff(0, -8, 6, 3, c.hi);
  puff(-14, 4, 6, 3, c.hi);
}

function drawSun(ctx, pal) {
  const cx = 418;
  const cy = 36;
  const s = pal.sun;
  const rays = [[0, -14], [0, 14], [-14, 0], [14, 0], [-10, -10], [10, -10], [-10, 10], [10, 10]];
  rays.forEach(([dx, dy]) => rect(ctx, cx + dx - 1, cy + dy - 1, 2, 2, s.ray));
  rect(ctx, cx - 7, cy - 7, 14, 14, s.core);
  rect(ctx, cx - 5, cy - 5, 8, 8, s.shine);
  rect(ctx, cx - 3, cy - 5, 3, 3, '#ffffff');
}

function drawMoon(ctx, pal) {
  const cx = 420;
  const cy = 34;
  rect(ctx, cx - 6, cy - 8, 12, 16, pal.sun.core);
  rect(ctx, cx - 8, cy - 4, 3, 8, pal.sun.core);
  rect(ctx, cx + 5, cy - 4, 3, 8, pal.sun.core);
  rect(ctx, cx + 2, cy - 2, 2, 2, pal.sky[2]);
  rect(ctx, cx - 1, cy + 3, 2, 2, pal.sky[2]);
}

function drawPeak(ctx, cx, baseY, height, halfWidth, col, snow = false) {
  const steps = Math.max(1, Math.floor(height / 4));
  for (let i = 0; i < steps; i += 1) {
    const y = baseY - i * 4 - 4;
    const hw = Math.max(4, Math.floor(halfWidth * (1 - i / steps)));
    for (let px = -hw; px < hw; px += 4) {
      let c = col.fill;
      if (snow && i < steps * 0.3) {
        c = px <= 0 ? col.snow : col.snowSh;
      } else if (px < -hw * 0.15) c = col.light;
      else if (px > hw * 0.3) c = col.deep;
      else if (px > 0) c = col.dark;
      rect(ctx, cx + px, y, 4, 4, c);
    }
  }
}

function drawMountainLayer(ctx, baseY, peaks, col) {
  rect(ctx, 0, baseY, W, H - baseY, col.deep);
  peaks.forEach(([cx, h, w, snow]) => drawPeak(ctx, cx, baseY, h, w, col, snow));
  // fill gaps between peaks
  rect(ctx, 0, baseY, W, 8, col.dark);
}

function drawHills(ctx, baseY, col) {
  rect(ctx, 0, baseY, W, H - baseY, col.dark);
  for (let x = 0; x <= W; x += 4) {
    const wave = Math.sin(x * 0.028) * 10 + Math.sin(x * 0.011 + 1) * 14;
    const y = baseY - 18 - wave;
    rect(ctx, x, y, 4, H - y, col.fill);
    if (x % 8 === 0) rect(ctx, x, y - 4, 4, 4, col.light);
  }
  rect(ctx, 0, baseY - 4, W, 6, col.light);
}

function drawTreeShadow(ctx, cx, baseY, halfW, pal) {
  for (let px = -halfW; px <= halfW; px += 2) {
    const dist = Math.abs(px) / halfW;
    if (dist < 0.85) rect(ctx, cx + px - 1, baseY - 1, 2, 2, pal.tree.shadow);
  }
}

function drawPine(ctx, x, baseY, scale, pal, tall = false) {
  const t = pal.tree;
  const s = Math.max(1, Math.round(scale * 4) / 4);
  const cx = Math.floor(x + 8 * s);
  const trunkH = Math.floor((tall ? 16 : 13) * s);
  const trunkW = Math.max(2, Math.floor(3 * s));

  drawTreeShadow(ctx, cx, baseY, 10 * s, pal);

  rect(ctx, cx - Math.ceil(trunkW / 2) - s, baseY - trunkH, trunkW + 2 * s, trunkH, t.trunkD);
  rect(ctx, cx - Math.floor(trunkW / 2), baseY - trunkH, trunkW, trunkH - s, t.trunk);
  rect(ctx, cx - Math.floor(trunkW / 2), baseY - trunkH, Math.max(s, trunkW - s), trunkH - 2 * s, t.trunkHi);
  rect(ctx, cx - 2 * s, baseY - 2 * s, 4 * s, 2 * s, t.trunkD);

  const tiers = tall ? 5 : 4;
  for (let tier = 0; tier < tiers; tier += 1) {
    const rowY = baseY - trunkH - tier * 5 * s - 3 * s;
    const halfW = (tiers - tier + 1) * 3 * s;
    for (let px = -halfW; px < halfW; px += Math.max(2, 2 * s)) {
      let c = t.mid;
      if (px < -halfW * 0.25) c = t.hi;
      else if (px > halfW * 0.35) c = t.deep;
      else if (px > 0) c = t.dark;
      if (tier === 0 && px > halfW * 0.2) c = t.shade;
      rect(ctx, cx + px - s, rowY, Math.max(2, 2 * s), 4 * s, c);
    }
    if (tier < tiers - 1) rect(ctx, cx - s, rowY - s, 2 * s, s, t.hi);
  }
}

function drawRoundTree(ctx, x, baseY, scale, pal) {
  const t = pal.tree;
  const s = Math.max(1, Math.round(scale * 4) / 4);
  const cx = Math.floor(x + 8 * s);
  const trunkH = Math.floor(10 * s);

  drawTreeShadow(ctx, cx, baseY, 9 * s, pal);

  rect(ctx, cx - 2 * s, baseY - trunkH, 4 * s, trunkH, t.trunkD);
  rect(ctx, cx - Math.floor(1.5 * s), baseY - trunkH, 3 * s, trunkH - s, t.trunk);
  rect(ctx, cx - s, baseY - trunkH, 2 * s, trunkH - 2 * s, t.trunkHi);

  const layers = [
    { y: 18, r: 14, c: t.dark },
    { y: 14, r: 11, c: t.mid },
    { y: 10, r: 8, c: t.hi }
  ];
  layers.forEach(({ y, r, c }) => {
    const top = baseY - y * s;
    for (let px = -r; px <= r; px += 2) {
      for (let py = 0; py < r * 0.85; py += 2) {
        const dx = px / r;
        const dy = py / (r * 0.85);
        if (dx * dx + dy * dy <= 1) {
          let col = c;
          if (px < -r * 0.2) col = t.hi;
          else if (px > r * 0.35) col = t.deep;
          rect(ctx, cx + px - 1, top + py, 2, 2, col);
        }
      }
    }
    if (c === t.hi) rect(ctx, cx - 2, top - 2, 4, 2, t.hi);
  });
}

function drawBush(ctx, x, baseY, scale, pal) {
  const t = pal.tree;
  const s = scale;
  const cx = x + 6 * s;
  drawTreeShadow(ctx, cx, baseY, 8 * s, pal);
  for (let px = -10; px <= 10; px += 2) {
    for (let py = 0; py < 10; py += 2) {
      const dx = px / 10;
      const dy = py / 10;
      if (dx * dx + dy * dy * 1.2 <= 1) {
        let c = t.mid;
        if (px < -2) c = t.hi;
        else if (px > 4) c = t.dark;
        rect(ctx, cx + px * s - s, baseY - 12 * s + py * s, 2 * s, 2 * s, c);
      }
    }
  }
}

function drawTree(ctx, x, baseY, scale, pal, kind) {
  const far = scale < 0.85;
  if (far) {
    const muted = { ...pal, tree: { ...pal.tree, hi: pal.tree.mid, mid: pal.tree.dark, dark: pal.tree.deep } };
    if (kind === 'round') drawRoundTree(ctx, x, baseY, scale, muted);
    else if (kind === 'bush') drawBush(ctx, x, baseY, scale * 0.9, muted);
    else drawPine(ctx, x, baseY, scale, muted, kind === 'tall');
    return;
  }
  if (kind === 'round') drawRoundTree(ctx, x, baseY, scale, pal);
  else if (kind === 'bush') drawBush(ctx, x, baseY, scale * 0.9, pal);
  else drawPine(ctx, x, baseY, scale, pal, kind === 'tall');
}

function drawGround(ctx, baseY, pal) {
  const g = pal.grass;
  const d = pal.dirt;
  // dirt
  rect(ctx, 0, baseY + 10, W, H - baseY, d.lo);
  rect(ctx, 0, baseY + 10, W, 6, d.mid);
  for (let x = 0; x < W; x += 48) rect(ctx, x + 8, baseY + 20, 24, 2, d.stripe);
  for (let x = 12; x < W; x += 37) rect(ctx, x, baseY + 16, 2, 2, d.top);
  // grass top
  for (let x = 0; x < W; x += 4) {
    const bump = Math.sin(x * 0.05) * 3 + Math.sin(x * 0.019) * 2;
    const gy = baseY + bump;
    rect(ctx, x, gy, 4, 4, g.lo);
    rect(ctx, x, gy - 2, 4, 2, g.mid);
    if (x % 8 === 0) rect(ctx, x + 1, gy - 5, 2, 3, g.hi);
  }
  rect(ctx, 0, baseY - 2, W, 3, g.hi);
  rect(ctx, 0, baseY, W, 4, g.mid);
}

const FAR_PEAKS = [[60, 52, 38, true], [140, 44, 32, true], [230, 58, 42, true], [320, 48, 36, true], [410, 54, 40, true], [480, 46, 34, true]];
const MID_PEAKS = [[30, 38, 28, false], [110, 44, 32, false], [200, 36, 26, false], [290, 42, 30, false], [380, 38, 28, false], [460, 40, 30, false]];

const TREES_BACK = [
  [20, 0.72, 'pine'], [68, 0.65, 'round'], [118, 0.78, 'pine'], [172, 0.6, 'bush'],
  [218, 0.7, 'tall'], [268, 0.62, 'pine'], [318, 0.68, 'round'], [368, 0.58, 'pine'],
  [418, 0.74, 'bush'], [462, 0.66, 'pine']
];
const TREES_FRONT = [
  [8, 1.05, 'tall'], [56, 0.95, 'pine'], [108, 1.15, 'round'], [162, 1.0, 'pine'],
  [210, 1.08, 'tall'], [258, 0.92, 'pine'], [308, 1.12, 'round'], [358, 0.98, 'pine'],
  [408, 1.05, 'pine'], [452, 1.18, 'tall']
];

const SKY_CLOUDS = [
  [52, 26, 0.9], [128, 34, 0.7], [198, 22, 0.85], [268, 36, 0.6],
  [340, 24, 0.75], [408, 30, 0.55], [472, 20, 0.65]
];

export function paintHeroLayers(canvases, theme = getTheme()) {
  const pal = PALETTE[theme] || PALETTE.light;
  const [skyC, farC, midC, nearC] = canvases;

  if (skyC) {
    const ctx = setupCanvas(skyC);
    ctx.clearRect(0, 0, W, H);
    drawSky(ctx, pal);
    SKY_CLOUDS.forEach(([cx, cy, sc]) => drawCloud(ctx, cx, cy, sc, pal.cloud));
    if (theme === 'dark') drawMoon(ctx, pal);
    else drawSun(ctx, pal);
  }

  if (farC) {
    const ctx = setupCanvas(farC);
    ctx.clearRect(0, 0, W, H);
    drawMountainLayer(ctx, 108, FAR_PEAKS, pal.mtnFar);
  }

  if (midC) {
    const ctx = setupCanvas(midC);
    ctx.clearRect(0, 0, W, H);
    drawMountainLayer(ctx, 118, MID_PEAKS, pal.mtnMid);
    drawHills(ctx, 132, pal.hill);
    TREES_BACK.forEach(([x, sc, kind]) => drawTree(ctx, x, 138, sc, pal, kind));
  }

  if (nearC) {
    const ctx = setupCanvas(nearC);
    ctx.clearRect(0, 0, W, H);
    drawGround(ctx, 128, pal);
    TREES_FRONT.forEach(([x, sc, kind]) => drawTree(ctx, x, 138, sc, pal, kind));
  }
}

export function mountHeroCanvas(container) {
  if (!container) return null;

  container.innerHTML = `
    <div class="arcade-hero-canvas-stack" aria-hidden="true">
      <canvas class="arcade-hero-canvas arcade-hero-canvas--sky" data-depth="4"></canvas>
      <canvas class="arcade-hero-canvas arcade-hero-canvas--far" data-depth="10"></canvas>
      <canvas class="arcade-hero-canvas arcade-hero-canvas--mid" data-depth="20"></canvas>
      <canvas class="arcade-hero-canvas arcade-hero-canvas--near" data-depth="32"></canvas>
    </div>`;

  const canvases = [...container.querySelectorAll('canvas')];
  paintHeroLayers(canvases);

  const observer = new MutationObserver(() => {
    paintHeroLayers(canvases, getTheme());
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  return { canvases, observer };
}

export { W as HERO_CANVAS_W, H as HERO_CANVAS_H };
