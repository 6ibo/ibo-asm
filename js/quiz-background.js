// Interactive animated background for the quiz scene
// Floating petals + sparkles that follow mouse/touch

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

class QuizBackground {
  constructor() {
    this.canvas  = document.getElementById('quiz-bg-canvas');
    this.ctx     = this.canvas.getContext('2d');
    this.petals  = [];
    this.sparks  = [];
    this.mouse   = { x: 0, y: 0, active: false };
    this.running = false;
    this._raf    = null;

    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });

    window.addEventListener('mousemove', e => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    }, { passive: true });

    window.addEventListener('touchmove', e => {
      this.mouse.x = e.touches[0].clientX;
      this.mouse.y = e.touches[0].clientY;
    }, { passive: true });
  }

  resize() {
    this.canvas.width  = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.mouse.x = window.innerWidth  / 2;
    this.mouse.y = window.innerHeight / 2;
  }

  // ── SPAWN PETALS ──
  _spawnPetals(count = 55) {
    const colors = [
      [239, 168, 184], // blush deep
      [212, 165, 165], // rose gold
      [248, 215, 218], // blush light
      [255, 255, 255], // white
      [244, 194, 194], // blush mid
    ];
    for (let i = 0; i < count; i++) {
      const c = colors[Math.floor(Math.random() * colors.length)];
      this.petals.push({
        x:       Math.random() * this.canvas.width,
        y:       Math.random() * this.canvas.height,
        w:       Math.random() * 14 + 6,
        h:       Math.random() * 8  + 4,
        rot:     Math.random() * 360,
        rotV:    (Math.random() - 0.5) * 1.8,
        vx:      (Math.random() - 0.5) * 0.4,
        vy:      Math.random() * 0.55 + 0.18,
        wobble:  Math.random() * Math.PI * 2,
        wobbleS: Math.random() * 0.018 + 0.008,
        alpha:   Math.random() * 0.35 + 0.12,
        r: c[0], g: c[1], b: c[2],
      });
    }
  }

  // ── SPARKLE BURST at (x, y) ──
  spawnSparkles(x, y, count = 18) {
    if (reduced) return;
    const colors = [
      [201, 169, 110],
      [239, 168, 184],
      [255, 255, 255],
      [212, 165, 165],
    ];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const speed = Math.random() * 3.5 + 1.5;
      const c     = colors[Math.floor(Math.random() * colors.length)];
      this.sparks.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size:  Math.random() * 5 + 2,
        alpha: 1,
        r: c[0], g: c[1], b: c[2],
        type: Math.random() > 0.5 ? 'star' : 'circle',
      });
    }
  }

  // ── DRAW PETAL ──
  _drawPetal(p) {
    const { ctx } = this;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot * Math.PI / 180);
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle   = `rgba(${p.r},${p.g},${p.b},1)`;
    ctx.strokeStyle = `rgba(${p.r},${p.g},${p.b},0.5)`;
    ctx.lineWidth   = 0.4;
    ctx.beginPath();
    ctx.ellipse(0, 0, p.w / 2, p.h / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // ── DRAW SPARKLE ──
  _drawSpark(s) {
    const { ctx } = this;
    ctx.save();
    ctx.globalAlpha = s.alpha;
    ctx.fillStyle   = `rgba(${s.r},${s.g},${s.b},1)`;
    ctx.translate(s.x, s.y);

    if (s.type === 'star') {
      // 4-point star
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const a  = (Math.PI / 2) * i;
        const a2 = a + Math.PI / 4;
        if (i === 0) ctx.moveTo(Math.cos(a) * s.size, Math.sin(a) * s.size);
        else         ctx.lineTo(Math.cos(a) * s.size, Math.sin(a) * s.size);
        ctx.lineTo(Math.cos(a2) * s.size * 0.35, Math.sin(a2) * s.size * 0.35);
      }
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, s.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // ── MAIN TICK ──
  _tick() {
    if (!this.running) return;
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const mx  = this.mouse.x;
    const cx  = canvas.width / 2;
    const drift = (mx - cx) / canvas.width; // -0.5 to 0.5

    // Update and draw petals
    for (const p of this.petals) {
      p.wobble += p.wobbleS;
      p.x += p.vx + Math.sin(p.wobble) * 0.55 + drift * 0.25;
      p.y += p.vy;
      p.rot += p.rotV;
      if (p.y > canvas.height + 20) { p.y = -20; p.x = Math.random() * canvas.width; }
      if (p.x < -20) p.x = canvas.width + 20;
      if (p.x > canvas.width + 20) p.x = -20;
      this._drawPetal(p);
    }

    // Update and draw sparkles
    this.sparks = this.sparks.filter(s => s.alpha > 0.02);
    for (const s of this.sparks) {
      s.x     += s.vx;
      s.y     += s.vy;
      s.vy    += 0.08; // gravity
      s.vx    *= 0.95;
      s.alpha -= 0.028;
      this._drawSpark(s);
    }

    this._raf = requestAnimationFrame(() => this._tick());
  }

  start() {
    if (this.running) return;
    this.running = true;
    if (!reduced) {
      this._spawnPetals(55);
    } else {
      this._spawnPetals(0); // no animation for reduced-motion
    }
    this._tick();
  }

  stop() {
    this.running = false;
    if (this._raf) cancelAnimationFrame(this._raf);
  }
}

// Create singleton and expose
export const quizBg = new QuizBackground();
window.quizBg = quizBg;
