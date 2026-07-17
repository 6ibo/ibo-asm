// Scene 3: Confetti, invitation card reveal, live countdown, add-to-calendar

const TARGET_DATE = new Date('2026-08-08T18:00:00');
const reduced     = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ===== CONFETTI ENGINE =====
class ConfettiEngine {
  constructor(canvas) {
    this.canvas  = canvas;
    this.ctx     = canvas.getContext('2d');
    this.pieces  = [];
    this.running = false;
    this._raf    = null;
    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });
  }

  resize() {
    this.canvas.width  = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  spawn(count = 130) {
    if (reduced) return;
    const colors = ['#F4C2C2','#EFA8B8','#D4A5A5','#C9A96E','#FFFFFF','#F8D7DA','#FFF0F3'];
    const shapes = ['rect', 'circle', 'diamond'];

    for (let i = 0; i < count; i++) {
      const size = Math.random() * 8 + 4;
      this.pieces.push({
        x:      Math.random() * this.canvas.width,
        y:      Math.random() * -120 - 20,
        w:      size * (Math.random() * 1.5 + 0.5),
        h:      size,
        color:  colors[Math.floor(Math.random() * colors.length)],
        shape:  shapes[Math.floor(Math.random() * shapes.length)],
        rot:    Math.random() * 360,
        rotV:   (Math.random() - 0.5) * 7,
        vx:     (Math.random() - 0.5) * 3,
        vy:     Math.random() * 2.5 + 1.5,
        alpha:  1,
        decay:  Math.random() * 0.008 + 0.004,
      });
    }
  }

  _drawPiece(ctx, p) {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot * Math.PI / 180);
    ctx.fillStyle = p.color;

    if (p.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.shape === 'diamond') {
      ctx.beginPath();
      ctx.moveTo(0, -p.h);
      ctx.lineTo(p.w / 2, 0);
      ctx.lineTo(0, p.h);
      ctx.lineTo(-p.w / 2, 0);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    }
    ctx.restore();
  }

  tick() {
    if (!this.running) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.pieces = this.pieces.filter(p => p.alpha > 0.02);

    for (const p of this.pieces) {
      p.x   += p.vx;
      p.y   += p.vy;
      p.rot += p.rotV;
      p.vx  *= 0.995;
      p.vy  *= 0.995;
      if (p.y > this.canvas.height * 0.65) p.alpha -= p.decay;
      this._drawPiece(this.ctx, p);
    }

    this._raf = requestAnimationFrame(() => this.tick());
  }

  start() {
    if (reduced) return;
    this.running = true;
    this.spawn(150);
    this.tick();
    // Second burst
    setTimeout(() => this.spawn(80), 700);
    // Third gentle burst
    setTimeout(() => this.spawn(50), 1500);
  }

  stop() {
    this.running = false;
    if (this._raf) cancelAnimationFrame(this._raf);
  }
}

// ===== COUNTDOWN =====
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';
function toArabic(n) {
  return String(Math.max(0, n)).replace(/\d/g, d => ARABIC_DIGITS[d]);
}

let countdownInterval = null;
let lastValues = {};

function updateCountdown() {
  const now  = new Date();
  const diff = TARGET_DATE - now;

  if (diff <= 0) {
    ['days', 'hours', 'minutes', 'seconds'].forEach(k => {
      setCounterVal(k, '٠');
    });
    clearInterval(countdownInterval);
    return;
  }

  const days    = Math.floor(diff / 86400000);
  const hours   = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000)  / 60000);
  const seconds = Math.floor((diff % 60000)    / 1000);

  setCounterVal('days',    toArabic(days));
  setCounterVal('hours',   toArabic(hours));
  setCounterVal('minutes', toArabic(minutes));
  setCounterVal('seconds', toArabic(seconds));
}

function setCounterVal(key, val) {
  const el = document.getElementById(`cd-${key}`);
  if (!el || lastValues[key] === val) return;
  lastValues[key] = val;
  el.textContent  = val;
  if (!reduced) {
    el.classList.remove('tick');
    void el.offsetWidth; // reflow
    el.classList.add('tick');
  }
}

// ===== ADD TO CALENDAR =====
function buildCalendarLink() {
  const start   = '20260808T180000';
  const end     = '20260808T220000';
  const title   = encodeURIComponent('خطوبة إبراهيم وأسماء 💍');
  const details = encodeURIComponent('نتشرف بحضوركم لمشاركتنا فرحة الخطوبة وإسعادنا بوجودكم.');
  const url     = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}`;
  const btn     = document.getElementById('btn-calendar');
  if (btn) btn.href = url;
}

// ===== SPARKLE PARTICLES =====
function spawnSparkles() {
  if (reduced) return;
  const colors = ['#F4C2C2', '#D4A5A5', '#C9A96E', '#EFA8B8'];
  for (let i = 0; i < 18; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'sparkle';
      const size = Math.random() * 6 + 4;
      Object.assign(el.style, {
        width:  size + 'px',
        height: size + 'px',
        left:   Math.random() * 100 + 'vw',
        top:    Math.random() * 100 + 'vh',
        background: colors[Math.floor(Math.random() * colors.length)],
        animationDelay: Math.random() * 1 + 's',
        animationDuration: (Math.random() * 1.5 + 1.5) + 's',
      });
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 3500);
    }, i * 120);
  }
}

// ===== CARD ENTRANCE =====
function revealCard() {
  const card = document.getElementById('invite-card');
  if (!card) return;

  if (reduced) return;

  const tl = gsap.timeline({ delay: 0.2 });
  tl.from(card, { scale: 0.82, opacity: 0, duration: 1.1, ease: 'elastic.out(0.7, 0.5)' })
    .from('.card-label',    { opacity: 0, y: 12, duration: 0.5, ease: 'power2.out' }, '-=0.4')
    .from('.couple-names',  { opacity: 0, y: 16, scale: 0.95, duration: 0.6, ease: 'back.out(1.5)' }, '-=0.25')
    .from('.invite-text',   { opacity: 0, y: 10, duration: 0.45, ease: 'power2.out' }, '-=0.15')
    .from('.date-display',  { opacity: 0, y: 10, duration: 0.4,  ease: 'power2.out' }, '-=0.1')
    .from('.date-label',    { opacity: 0, duration: 0.3 }, '-=0.1')
    .from('.countdown-grid',{ opacity: 0, y: 8,  duration: 0.4,  ease: 'power2.out' }, '-=0.1')
    .from('.btn-calendar',  { opacity: 0, y: 8,  duration: 0.35, ease: 'power2.out' }, '-=0.05')
    .from('.closing-text',  { opacity: 0, duration: 0.4 }, '-=0.05');
}

// ===== PUBLIC API =====
const confetti = new ConfettiEngine(document.getElementById('confetti-canvas'));

window.revealScene = {
  start() {
    if (window.audioManager) window.audioManager.playCelebration();

    confetti.start();
    spawnSparkles();
    revealCard();
    buildCalendarLink();
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
  },
};
