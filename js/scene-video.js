// Scene 0: Intro video — plays then transitions to envelope automatically

import { sceneManager } from './scene-manager.js';
import { audioManager }  from './audio.js';

const videoEl = document.getElementById('intro-video');
const skipBtn = document.getElementById('btn-skip-video');
const tapOverlay = document.getElementById('video-tap-overlay');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function goToDoor() {
  if (sceneManager.current !== 'video') return;
  videoEl.pause();
  sceneManager.transitionTo('door', { outDuration: 0.7, inDuration: 0.9 });
}

videoEl.addEventListener('ended', goToDoor, { once: true });

skipBtn.addEventListener('click',    goToDoor);
skipBtn.addEventListener('touchend', e => { e.preventDefault(); goToDoor(); });

function onVideoPlaying() {
  audioManager.startBGM();
  document.getElementById('music-btn').classList.remove('hidden');
}

function startVideo() {
  if (tapOverlay) {
    gsap.to(tapOverlay, {
      opacity: 0, duration: 0.4,
      onComplete: () => tapOverlay.remove(),
    });
  }
  videoEl.play().then(onVideoPlaying).catch(() => goToDoor());
}

if (reduced) {
  goToDoor();
} else {
  videoEl.muted = true;
  videoEl.play().then(() => {
    videoEl.muted = false;
    if (tapOverlay) tapOverlay.remove();
    onVideoPlaying();
  }).catch(() => {
    videoEl.muted = false;
    if (tapOverlay) {
      tapOverlay.style.display = 'flex';
      tapOverlay.addEventListener('click', startVideo, { once: true });
      tapOverlay.addEventListener('touchend', e => {
        e.preventDefault(); startVideo();
      }, { once: true });
    } else {
      goToDoor();
    }
  });
}
