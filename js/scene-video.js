// Scene 0: Splash → Video → Envelope
// One tap starts video + BGM simultaneously (bypasses browser autoplay block)

import { sceneManager } from './scene-manager.js';
import { audioManager }  from './audio.js';

const videoEl  = document.getElementById('intro-video');
const skipBtn  = document.getElementById('btn-skip-video');
const splash   = document.getElementById('splash-overlay');
const reduced  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function goToDoor() {
  if (sceneManager.current !== 'video') return;
  videoEl.pause();
  sceneManager.transitionTo('door', { outDuration: 0.7, inDuration: 0.9 });
}

videoEl.addEventListener('ended', goToDoor, { once: true });

skipBtn.addEventListener('click',    goToDoor);
skipBtn.addEventListener('touchend', e => { e.preventDefault(); goToDoor(); });

// ── Dismiss splash and start everything ──
function startExperience() {
  // Fade out splash
  gsap.to(splash, {
    opacity: 0,
    duration: 0.55,
    ease: 'power2.in',
    onComplete: () => splash.remove(),
  });

  // Start video with sound (user gesture allows it)
  videoEl.play().catch(() => goToDoor());

  // Start BGM
  audioManager.startBGM();
  document.getElementById('music-btn').classList.remove('hidden');
}

if (reduced) {
  splash.remove();
  goToDoor();
} else {
  splash.addEventListener('click',    startExperience, { once: true });
  splash.addEventListener('touchend', e => {
    e.preventDefault();
    startExperience();
  }, { once: true });
  splash.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') startExperience();
  }, { once: true });
}
