// SceneManager: coordinates GSAP-powered transitions between scenes

export class SceneManager {
  constructor() {
    this.scenes = {
      video:  document.getElementById('scene-video'),
      door:   document.getElementById('scene-door'),
      quiz:   document.getElementById('scene-quiz'),
      reveal: document.getElementById('scene-reveal'),
    };
    this.current = 'video';
    this._locked = false;
  }

  async transitionTo(nextScene, opts = {}) {
    if (this._locked || this.current === nextScene) return;
    this._locked = true;

    const outEl = this.scenes[this.current];
    const inEl  = this.scenes[nextScene];
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      outEl.classList.remove('active');
      inEl.classList.add('active');
      inEl.style.opacity = '1';
      this.current = nextScene;
      this._locked = false;
      opts.onComplete?.();
      return;
    }

    // Fade out current
    await new Promise(resolve => {
      gsap.to(outEl, {
        opacity: 0,
        duration: opts.outDuration ?? 0.6,
        ease: 'power2.in',
        onComplete: () => {
          outEl.classList.remove('active');
          resolve();
        },
      });
    });

    // White flash overlay (cinematic "enter through door" feel)
    if (opts.flash) {
      await this._flash();
    }

    // Activate next scene
    inEl.classList.add('active');
    inEl.style.opacity = '0';

    await new Promise(resolve => {
      gsap.to(inEl, {
        opacity: 1,
        duration: opts.inDuration ?? 0.9,
        ease: 'power2.out',
        onComplete: resolve,
      });
    });

    this.current = nextScene;
    this._locked = false;
    opts.onComplete?.();
  }

  _flash() {
    return new Promise(resolve => {
      const el = document.createElement('div');
      Object.assign(el.style, {
        position: 'fixed', inset: '0',
        background: 'radial-gradient(ellipse at center, #FFFFFF 0%, #FFF5F7 100%)',
        zIndex: '999', opacity: '1', pointerEvents: 'none',
      });
      document.body.appendChild(el);

      gsap.to(el, {
        opacity: 0,
        duration: 0.9,
        ease: 'power2.out',
        onComplete: () => { el.remove(); resolve(); },
      });
    });
  }
}

export const sceneManager = new SceneManager();
window.sceneManager = sceneManager;
