// AudioManager: BGM via <audio> + Web Audio API for SFX

class AudioManager {
  constructor() {
    this.bgmEl   = document.getElementById('bgm');
    this.isMuted = false;
    this.bgmStarted = false;
    this._ctx    = null;
    this._setupMusicBtn();
  }

  _getCtx() {
    if (!this._ctx) {
      this._ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this._ctx.state === 'suspended') this._ctx.resume();
    return this._ctx;
  }

  // Low wooden knock via layered oscillators
  playKnock() {
    try {
      const ctx = this._getCtx();
      const t   = ctx.currentTime;

      // Low thud
      const osc1  = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(160, t);
      osc1.frequency.exponentialRampToValueAtTime(60, t + 0.18);
      gain1.gain.setValueAtTime(0.45, t);
      gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
      osc1.start(t);
      osc1.stop(t + 0.3);

      // Mid tap texture
      const osc2  = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(400, t);
      osc2.frequency.exponentialRampToValueAtTime(200, t + 0.05);
      gain2.gain.setValueAtTime(0.08, t);
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      osc2.start(t);
      osc2.stop(t + 0.1);
    } catch (_) {}
  }

  // Subtle door creak
  playDoorCreak() {
    try {
      const ctx = this._getCtx();
      const t   = ctx.currentTime;

      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      filter.type = 'bandpass';
      filter.frequency.value = 300;
      filter.Q.value = 2;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(380, t);
      osc.frequency.linearRampToValueAtTime(180, t + 1.0);
      osc.frequency.linearRampToValueAtTime(240, t + 1.5);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.07, t + 0.1);
      gain.gain.setValueAtTime(0.07, t + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.5);

      osc.start(t);
      osc.stop(t + 1.6);
    } catch (_) {}
  }

  playClick()       {}
  playHeartFill()   {}
  playCelebration() {}

  // Start BGM with gradual fade-in
  startBGM() {
    if (this.bgmStarted || this.isMuted) return;
    this.bgmStarted = true;
    this.bgmEl.volume = 0;

    const playPromise = this.bgmEl.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        this.bgmStarted = false;
      });
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      this.bgmEl.volume = 0.42;
      return;
    }

    if (window.gsap) {
      gsap.to(this.bgmEl, { volume: 0.42, duration: 3.5, ease: 'power1.inOut' });
    } else {
      let v = 0;
      const step = () => {
        if (v < 0.42) {
          v = Math.min(v + 0.01, 0.42);
          this.bgmEl.volume = v;
          setTimeout(step, 83);
        }
      };
      step();
    }
  }

  _setupMusicBtn() {
    const btn = document.getElementById('music-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      // First click also starts BGM if not started
      if (!this.bgmStarted) {
        this.startBGM();
        return;
      }
      this.toggleMute();
    });
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    const btn = document.getElementById('music-btn');
    const path = document.getElementById('music-icon-path');

    if (this.isMuted) {
      this.bgmEl.pause();
      btn.classList.add('muted');
      if (path) path.setAttribute('d', 'M16.5 12A4.5 4.5 0 0 0 14 7.97v1.79l2.48 2.48c.02-.08.02-.16.02-.24zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06A8.99 8.99 0 0 0 17.73 19L19 20.27 20.27 19 5.27 4 4.27 3zM12 4L9.91 6.09 12 8.18V4z');
    } else {
      this.bgmEl.play().catch(() => {});
      btn.classList.remove('muted');
      if (path) path.setAttribute('d', 'M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z');
    }
  }
}

export const audioManager = new AudioManager();
window.audioManager = audioManager;
