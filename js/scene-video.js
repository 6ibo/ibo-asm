// Scene 0: Video intro → Envelope
// Video autoplays muted (browser-allowed).
// BGM starts on first user touch/click anywhere — feels instant.

import { sceneManager } from './scene-manager.js';
import { audioManager }  from './audio.js';

const videoEl = document.getElementById('intro-video');
const skipBtn = document.getElementById('btn-skip-video');
const splash  = document.getElementById('splash-overlay');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function goToDoor() {
  if (sceneManager.current !== 'video') return;
  videoEl.pause();
  sceneManager.transitionTo('door', { outDuration: 0.7, inDuration: 0.9 });
}

videoEl.addEventListener('ended', goToDoor, { once: true });
skipBtn.addEventListener('click',    goToDoor);
skipBtn.addEventListener('touchend', e => { e.preventDefault(); goToDoor(); });

// ── Remove splash immediately (no tap needed) ──
if (splash) {
  gsap.to(splash, {
    opacity: 0, duration: 0.4, ease: 'power2.in',
    onComplete: () => splash.remove(),
  });
}

document.getElementById('music-btn').classList.remove('hidden');

// ── Start video (muted autoplay, always allowed) ──
if (!reduced) {
  videoEl.play().catch(() => goToDoor());
} else {
  goToDoor();
}

// ── BGM: try immediately, else unlock on first touch ──
function tryStartBGM() {
  audioManager.startBGM();
}

// Some browsers (Safari iOS) allow audio after first touch event
function unlockOnFirstTouch() {
  tryStartBGM();
  document.removeEventListener('touchstart', unlockOnFirstTouch, true);
  document.removeEventListener('click',      unlockOnFirstTouch, true);
  document.removeEventListener('keydown',    unlockOnFirstTouch, true);
}

// Try immediately in case browser allows it (desktop, or relaxed policy)
const immediatePromise = audioManager.bgmEl && audioManager.bgmEl.play();
if (immediatePromise !== undefined) {
  immediatePromise.then(() => {
    // Worked! Already playing — nothing else needed
    audioManager.bgmStarted = true;
    audioManager.bgmEl.volume = 0;
    if (window.gsap) {
      gsap.to(audioManager.bgmEl, { volume: 0.42, duration: 3.5, ease: 'power1.inOut' });
    }
  }).catch(() => {
    // Blocked — wait for first touch anywhere on screen
    document.addEventListener('touchstart', unlockOnFirstTouch, { once: false, capture: true });
    document.addEventListener('click',      unlockOnFirstTouch, { once: false, capture: true });
    document.addEventListener('keydown',    unlockOnFirstTouch, { once: false, capture: true });
  });
} else {
  document.addEventListener('touchstart', unlockOnFirstTouch, { once: false, capture: true });
  document.addEventListener('click',      unlockOnFirstTouch, { once: false, capture: true });
}
