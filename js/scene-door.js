// Scene 1: Paper envelope — tap the wax seal to open
import { sceneManager } from './scene-manager.js';
import { audioManager }  from './audio.js';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let opened = false;

// ===== INJECT SVGs =====
function buildEnvelope() {
  // Body — aged parchment with decorative inner border + fold lines
  document.getElementById('env-body-front').innerHTML = `
<svg viewBox="0 0 360 240" xmlns="http://www.w3.org/2000/svg"
     preserveAspectRatio="none" aria-hidden="true">
  <defs>
    <linearGradient id="envBodyGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"   stop-color="#F5E9CE"/>
      <stop offset="100%" stop-color="#E8D5AE"/>
    </linearGradient>
  </defs>

  <!-- Aged parchment body -->
  <rect width="360" height="240" fill="url(#envBodyGrad)"/>

  <!-- Outer border -->
  <rect x="0.75" y="0.75" width="358.5" height="238.5"
        fill="none" stroke="rgba(140,105,58,0.35)" stroke-width="1.5"/>

  <!-- Inner decorative dashed border -->
  <rect x="10" y="10" width="340" height="220" fill="none"
        stroke="rgba(140,105,58,0.28)" stroke-width="0.8"
        stroke-dasharray="5,4" rx="1"/>

  <!-- Fold lines from 4 corners → center (180, 132) -->
  <line x1="0"   y1="0"   x2="180" y2="132" stroke="rgba(130,95,50,0.50)" stroke-width="1.3"/>
  <line x1="360" y1="0"   x2="180" y2="132" stroke="rgba(130,95,50,0.50)" stroke-width="1.3"/>
  <line x1="0"   y1="240" x2="180" y2="132" stroke="rgba(130,95,50,0.50)" stroke-width="1.3"/>
  <line x1="360" y1="240" x2="180" y2="132" stroke="rgba(130,95,50,0.50)" stroke-width="1.3"/>

  <!-- Flap shadow line -->
  <line x1="0" y1="132" x2="360" y2="132"
        stroke="rgba(110,78,35,0.20)" stroke-width="3"/>

  <!-- Edge depth shading -->
  <rect width="5"   height="240" fill="rgba(100,70,30,0.06)"/>
  <rect x="355" width="5" height="240" fill="rgba(100,70,30,0.06)"/>
  <rect y="235" width="360" height="5" fill="rgba(100,70,30,0.07)"/>
</svg>`;

  // Flap — aged triangle with postage stamp corner
  document.getElementById('env-flap').innerHTML = `
<svg viewBox="0 0 360 132" xmlns="http://www.w3.org/2000/svg"
     preserveAspectRatio="none" aria-hidden="true">
  <defs>
    <linearGradient id="envFlapGrad" x1="0" y1="0" x2="0.5" y2="1">
      <stop offset="0%"   stop-color="#EDDDBA"/>
      <stop offset="100%" stop-color="#DECDA0"/>
    </linearGradient>
  </defs>

  <!-- Flap fill -->
  <polygon points="0,0 360,0 180,132" fill="url(#envFlapGrad)"/>

  <!-- Fold edge highlights -->
  <line x1="0"   y1="0" x2="180" y2="132"
        stroke="rgba(190,162,110,0.60)" stroke-width="1"/>
  <line x1="360" y1="0" x2="180" y2="132"
        stroke="rgba(190,162,110,0.60)" stroke-width="1"/>
  <line x1="0" y1="0.5" x2="360" y2="0.5"
        stroke="rgba(215,195,148,0.70)" stroke-width="1.5"/>

  <!-- Vintage postage stamp (top-left corner of flap) -->
  <rect x="10" y="6" width="36" height="46" fill="rgba(255,252,242,0.7)"
        stroke="rgba(140,105,58,0.45)" stroke-width="0.8"/>
  <!-- Stamp perforation dots -->
  <g fill="rgba(235,220,185,0.9)">
    <circle cx="10" cy="9"  r="2"/><circle cx="10" cy="16" r="2"/>
    <circle cx="10" cy="23" r="2"/><circle cx="10" cy="30" r="2"/>
    <circle cx="10" cy="37" r="2"/><circle cx="10" cy="44" r="2"/>
    <circle cx="10" cy="51" r="2"/><circle cx="13" cy="6"  r="2"/>
    <circle cx="20" cy="6"  r="2"/><circle cx="27" cy="6"  r="2"/>
    <circle cx="34" cy="6"  r="2"/><circle cx="41" cy="6"  r="2"/>
    <circle cx="46" cy="9"  r="2"/><circle cx="46" cy="16" r="2"/>
    <circle cx="46" cy="23" r="2"/><circle cx="46" cy="30" r="2"/>
    <circle cx="46" cy="37" r="2"/><circle cx="46" cy="44" r="2"/>
    <circle cx="46" cy="51" r="2"/><circle cx="13" cy="51" r="2"/>
    <circle cx="20" cy="51" r="2"/><circle cx="27" cy="51" r="2"/>
    <circle cx="34" cy="51" r="2"/><circle cx="41" cy="51" r="2"/>
  </g>
  <!-- Stamp inner motif (small ring) -->
  <circle cx="28" cy="28" r="10" fill="none"
          stroke="rgba(130,95,50,0.4)" stroke-width="0.8"/>
  <circle cx="28" cy="28" r="5" fill="rgba(130,95,50,0.18)"/>
</svg>`;
}

// ===== SEAL TAP =====
function attachSealEvent() {
  const seal = document.getElementById('env-seal');

  function onTap(e) {
    e.preventDefault();
    if (opened) return;
    spawnRipple(e);
    openEnvelope();
  }

  seal.addEventListener('click',    onTap);
  seal.addEventListener('touchend', onTap);
  seal.addEventListener('keydown',  e => {
    if (e.key === 'Enter' || e.key === ' ') onTap(e);
  });
}

function spawnRipple(e) {
  if (reduced) return;
  const cx = e?.clientX ?? e?.changedTouches?.[0]?.clientX ?? window.innerWidth  / 2;
  const cy = e?.clientY ?? e?.changedTouches?.[0]?.clientY ?? window.innerHeight / 2;
  const el = document.createElement('div');
  el.className = 'knock-ripple';
  const s = 60;
  Object.assign(el.style, { width: s+'px', height: s+'px',
    left: (cx-s/2)+'px', top: (cy-s/2)+'px' });
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 750);
}

// ===== OPEN ENVELOPE =====
function openEnvelope() {
  opened = true;

  const flap   = document.getElementById('env-flap');
  const seal   = document.getElementById('env-seal');
  const letter = document.getElementById('env-letter-card');
  const hint   = document.getElementById('knock-hint');
  const outer  = document.getElementById('env-outer');

  if (reduced) {
    audioManager.startBGM();
    document.getElementById('music-btn').classList.remove('hidden');
    sceneManager.transitionTo('quiz', { outDuration: 0, inDuration: 0 });
    return;
  }

  // Hint fades out
  gsap.to(hint, { opacity: 0, y: 4, duration: 0.3 });

  // Seal cracks open then disappears
  gsap.timeline()
    .to(seal, { scale: 1.25, duration: 0.13, ease: 'power2.out' })
    .to(seal, { scale: 0, opacity: 0, duration: 0.22, ease: 'power2.in' });

  // Flap folds upward (scaleY collapses toward the top edge)
  gsap.to(flap, {
    scaleY: 0,
    duration: 0.72,
    ease: 'power2.inOut',
    delay: 0.18,
  });

  // Letter card rises from inside envelope
  gsap.to(letter, {
    zIndex:  10,
    opacity: 1,
    y:       0,
    duration: 0.78,
    ease:    'power2.out',
    delay:   0.62,
  });

  // After a moment, zoom out and transition to quiz
  setTimeout(() => {
    audioManager.startBGM();
    document.getElementById('music-btn').classList.remove('hidden');

    gsap.to(outer, {
      scale: 0.88, opacity: 0, duration: 0.6, ease: 'power2.in',
      onComplete: () => {
        sceneManager.transitionTo('quiz', {
          outDuration: 0.05,
          inDuration:  0.9,
        });
      },
    });
  }, 2700);
}

// ===== ENTRANCE ANIMATION =====
function entranceAnim() {
  if (reduced) return;
  gsap.timeline({ delay: 0.25 })
    .from('.welcome-text', { y: -20, opacity: 0, duration: 0.7, ease: 'power2.out' })
    .from('.envelope-box', { y: 32,  opacity: 0, duration: 0.95, ease: 'power3.out' }, '-=0.3')
    .from('.knock-hint',   { opacity: 0, duration: 0.5 }, '-=0.1');
}

// ===== INIT =====
buildEnvelope();

// Set letter card initial Y via GSAP (starts 90px inside the envelope area)
gsap.set('#env-letter-card', { y: 90 });

attachSealEvent();
entranceAnim();
