import { HERO_BACKGROUND } from './data.js';

const PIXEL = 'shape-rendering="crispEdges"';

const BIRD = `<svg viewBox="0 0 16 8" ${PIXEL} class="arcade-bird-svg" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <g class="arcade-bird-frame arcade-bird-frame--up">
    <rect x="6" y="3" width="4" height="2" fill="currentColor"/>
    <rect x="2" y="1" width="4" height="2" fill="currentColor"/>
    <rect x="10" y="1" width="4" height="2" fill="currentColor"/>
  </g>
  <g class="arcade-bird-frame arcade-bird-frame--down">
    <rect x="6" y="3" width="4" height="2" fill="currentColor"/>
    <rect x="2" y="5" width="4" height="2" fill="currentColor"/>
    <rect x="10" y="5" width="4" height="2" fill="currentColor"/>
  </g>
</svg>`;

const BIRDS = [
  { top: '7%', size: 20, duration: 15, delay: 0, opacity: 1 },
  { top: '13%', size: 16, duration: 21, delay: -5, opacity: 0.88 },
  { top: '5%', size: 14, duration: 27, delay: -11, opacity: 0.72 },
  { top: '18%', size: 18, duration: 18, delay: -3, opacity: 0.92, reverse: true },
  { top: '10%', size: 15, duration: 24, delay: -8, opacity: 0.8, reverse: true },
  { top: '22%', size: 17, duration: 20, delay: -14, opacity: 0.76 },
  { top: '16%', size: 13, duration: 30, delay: -18, opacity: 0.65 },
  { top: '25%', size: 19, duration: 17, delay: -6, opacity: 0.84, reverse: true }
];

function birdMarkup(bird, index) {
  const reverse = bird.reverse ? ' arcade-hero-bird--reverse' : '';
  return `<div class="arcade-hero-bird arcade-hero-bird--${index + 1}${reverse}" style="--bird-top:${bird.top};--bird-size:${bird.size}px;--bird-duration:${bird.duration}s;--bird-delay:${bird.delay}s;--bird-opacity:${bird.opacity}">${BIRD}</div>`;
}

export function renderHeroScene(container) {
  if (!container) return;

  container.innerHTML = `
    <div class="arcade-hero-bg" aria-hidden="true">
      <img class="arcade-hero-bg-img" src="${HERO_BACKGROUND}" alt="" width="1024" height="576" decoding="async" fetchpriority="high" />
    </div>
    <div class="arcade-hero-overlay" aria-hidden="true">
      <div class="arcade-hero-birds">${BIRDS.map(birdMarkup).join('')}</div>
    </div>`;
}

export function initHeroParallax(banner) {
  if (!banner) return;

  const bgImg = banner.querySelector('.arcade-hero-bg-img');
  if (!bgImg) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  const maxShift = 56;

  const onScroll = () => {
    const rect = banner.getBoundingClientRect();
    if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;

    const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
    const shift = (progress - 0.5) * maxShift;
    bgImg.style.transform = `translate3d(-50%, calc(-50% + ${shift}px), 0)`;
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
