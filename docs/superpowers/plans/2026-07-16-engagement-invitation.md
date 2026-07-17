# Engagement Invitation Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a luxury multi-scene interactive engagement invitation SPA for Ibrahim & Asma with three scenes: Door → Quiz Game → Invitation Reveal.

**Architecture:** Single HTML file with modular JS files per scene, coordinated by a SceneManager. CSS split per scene with shared design tokens. GSAP drives all transitions; Web Audio API handles sound effects; Three.js powers the 3D door.

**Tech Stack:** HTML5, CSS3, Vanilla JS (ES6 modules), GSAP 3 (CDN), Three.js r165 (CDN), Google Fonts (Amiri, Aref Ruqaa, Tajawal)

---

## File Map

| File | Responsibility |
|------|---------------|
| `index.html` | SPA shell, scene containers, font/library imports |
| `css/variables.css` | Color tokens, font scales, spacing |
| `css/main.css` | Global reset, scene show/hide, music button |
| `css/scene-door.css` | Door scene layout and CSS 3D helpers |
| `css/scene-quiz.css` | Quiz cards, progress hearts, answer buttons |
| `css/scene-reveal.css` | Invitation card, countdown blocks, confetti canvas |
| `js/scene-manager.js` | SceneManager class — activate/deactivate scenes |
| `js/scene-door.js` | Three.js door, knock counter, door-open animation |
| `js/scene-quiz.js` | Quiz data, step logic, typewriter Ayah effect |
| `js/scene-reveal.js` | Confetti, countdown timer, add-to-calendar |
| `js/audio.js` | AudioManager — BGM fade-in, click SFX via Web Audio API |

---

## Task 1: Project Shell + Design Tokens

**Files:**
- Create: `index.html`
- Create: `css/variables.css`
- Create: `css/main.css`

- [ ] **Step 1: Create `index.html`**

```html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>دعوة خطوبة إبراهيم وأسماء</title>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Aref+Ruqaa:wght@400;700&family=Tajawal:wght@300;400;500;700&display=swap" rel="stylesheet" />

  <!-- GSAP -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/CustomEase.min.js" defer></script>

  <!-- Three.js -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r165/three.min.js" defer></script>

  <!-- Styles -->
  <link rel="stylesheet" href="css/variables.css" />
  <link rel="stylesheet" href="css/main.css" />
  <link rel="stylesheet" href="css/scene-door.css" />
  <link rel="stylesheet" href="css/scene-quiz.css" />
  <link rel="stylesheet" href="css/scene-reveal.css" />
</head>
<body>

  <!-- ===== SCENE 1: DOOR ===== -->
  <section id="scene-door" class="scene active" aria-label="المدخل">
    <div class="welcome-text">أهلاً وسهلاً بكم</div>
    <div id="door-container"></div>
    <p class="knock-hint">اطرق الباب مرتين</p>
  </section>

  <!-- ===== SCENE 2: QUIZ ===== -->
  <section id="scene-quiz" class="scene" aria-label="اختبار الحب">
    <div class="quiz-wrapper">
      <h2 class="quiz-title font-ruqaa">اختبار الحب 💍</h2>
      <div class="hearts-progress" id="hearts-progress" aria-label="التقدم"></div>
      <div id="quiz-card" class="quiz-card"></div>
    </div>
    <div id="ayah-screen" class="ayah-screen hidden">
      <p class="ayah-text font-amiri" id="ayah-text"></p>
      <p class="ayah-source font-tajawal">سورة الروم، الآية ٢١</p>
      <button id="btn-enter-invite" class="btn-primary font-tajawal hidden">ادخل للدعوة ✨</button>
    </div>
  </section>

  <!-- ===== SCENE 3: REVEAL ===== -->
  <section id="scene-reveal" class="scene" aria-label="بطاقة الدعوة">
    <canvas id="confetti-canvas"></canvas>
    <div class="invite-card" id="invite-card">
      <div class="card-ornament top"></div>
      <p class="card-label font-tajawal">بسم الله الرحمن الرحيم</p>
      <h1 class="couple-names font-ruqaa">
        <span class="groom-name">إبراهيم</span>
        <span class="heart-divider">💍</span>
        <span class="bride-name">أسماء</span>
      </h1>
      <p class="invite-text font-tajawal">يتشرف الأهل بدعوتكم لمشاركتهم فرحة الخطوبة</p>
      <div class="date-display font-ruqaa">
        <span class="date-num">٨</span>
        <span class="date-sep">/</span>
        <span class="date-num">٨</span>
        <span class="date-sep">/</span>
        <span class="date-num">٢٠٢٦</span>
      </div>
      <div class="countdown-grid" id="countdown-grid">
        <div class="cd-block"><span class="cd-val" id="cd-days">--</span><span class="cd-label font-tajawal">يوم</span></div>
        <div class="cd-block"><span class="cd-val" id="cd-hours">--</span><span class="cd-label font-tajawal">ساعة</span></div>
        <div class="cd-block"><span class="cd-val" id="cd-minutes">--</span><span class="cd-label font-tajawal">دقيقة</span></div>
        <div class="cd-block"><span class="cd-val" id="cd-seconds">--</span><span class="cd-label font-tajawal">ثانية</span></div>
      </div>
      <a id="btn-calendar" href="#" class="btn-calendar font-tajawal" target="_blank">
        📅 أضف للتقويم
      </a>
      <p class="closing-text font-tajawal">حضوركم يزيدنا سعادة وشرف</p>
      <div class="card-ornament bottom"></div>
    </div>
  </section>

  <!-- Music Control Button (hidden until after door) -->
  <button id="music-btn" class="music-btn hidden" aria-label="تحكم في الموسيقى">
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path id="music-icon-path" d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z"/>
    </svg>
  </button>

  <!-- Audio element for BGM -->
  <audio id="bgm" loop preload="none">
    <source src="assets/audio/majed-al-mohandis-engagement.mp3" type="audio/mpeg" />
  </audio>

  <!-- Scripts -->
  <script type="module" src="js/audio.js"></script>
  <script type="module" src="js/scene-manager.js"></script>
  <script type="module" src="js/scene-door.js"></script>
  <script type="module" src="js/scene-quiz.js"></script>
  <script type="module" src="js/scene-reveal.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create `css/variables.css`**

```css
:root {
  /* Colors */
  --cream:        #FFFDFB;
  --cream-2:      #FFF9FA;
  --blush-light:  #F8D7DA;
  --blush:        #F4C2C2;
  --blush-deep:   #EFA8B8;
  --rose-gold:    #D4A5A5;
  --rose-gold-2:  #C48B8B;
  --warm-text:    #4A3B3B;
  --warm-muted:   #7A6060;
  --gold-accent:  #C9A96E;

  /* Gradients */
  --grad-bg:      linear-gradient(135deg, #FFF9FA 0%, #FFFDFB 50%, #FFF0F3 100%);
  --grad-card:    linear-gradient(160deg, #FFFFFF 0%, #FFF5F7 100%);
  --grad-rose:    linear-gradient(135deg, #EFA8B8 0%, #D4A5A5 100%);

  /* Shadows */
  --shadow-soft:  0 4px 24px rgba(212, 165, 165, 0.15);
  --shadow-card:  0 8px 48px rgba(212, 165, 165, 0.20), 0 2px 8px rgba(212, 165, 165, 0.10);
  --shadow-glow:  0 0 40px rgba(239, 168, 184, 0.35);

  /* Fonts */
  --font-amiri:   'Amiri', serif;
  --font-ruqaa:   'Aref Ruqaa', serif;
  --font-tajawal: 'Tajawal', sans-serif;

  /* Spacing */
  --gap-sm:  0.5rem;
  --gap-md:  1rem;
  --gap-lg:  2rem;
  --gap-xl:  3rem;

  /* Transition */
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
}
```

- [ ] **Step 3: Create `css/main.css`**

```css
/* ===== RESET & BASE ===== */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { font-size: 16px; scroll-behavior: smooth; }

body {
  font-family: var(--font-tajawal);
  background: var(--grad-bg);
  color: var(--warm-text);
  min-height: 100dvh;
  overflow: hidden;
  direction: rtl;
}

/* ===== SCENE SYSTEM ===== */
.scene {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.1s;
  z-index: 1;
}
.scene.active {
  opacity: 1;
  pointer-events: all;
  z-index: 10;
}

/* ===== FONT HELPERS ===== */
.font-amiri   { font-family: var(--font-amiri); }
.font-ruqaa   { font-family: var(--font-ruqaa); }
.font-tajawal { font-family: var(--font-tajawal); }
.hidden       { display: none !important; }

/* ===== MUSIC BUTTON ===== */
.music-btn {
  position: fixed;
  bottom: 1.5rem;
  left: 1.5rem;
  z-index: 100;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: 1.5px solid var(--rose-gold);
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  color: var(--rose-gold-2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-soft);
  transition: transform 0.2s var(--ease-smooth), box-shadow 0.2s;
}
.music-btn:hover { transform: scale(1.1); box-shadow: var(--shadow-glow); }
.music-btn.muted { opacity: 0.5; }

/* ===== BUTTONS ===== */
.btn-primary {
  display: inline-block;
  padding: 0.85rem 2.5rem;
  background: var(--grad-rose);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  letter-spacing: 0.03em;
  box-shadow: var(--shadow-soft);
  transition: transform 0.2s var(--ease-smooth), box-shadow 0.2s;
}
.btn-primary:hover { transform: translateY(-2px); box-shadow: var(--shadow-glow); }
.btn-primary:active { transform: scale(0.97); }

/* ===== REDUCED MOTION ===== */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 4: Verify** — Open `index.html` in browser. Should see a white/cream gradient background, no errors in console.

---

## Task 2: SceneManager

**Files:**
- Create: `js/scene-manager.js`

- [ ] **Step 1: Create `js/scene-manager.js`**

```js
// Coordinates transitions between the three scenes using GSAP

export class SceneManager {
  constructor() {
    this.scenes = {
      door:   document.getElementById('scene-door'),
      quiz:   document.getElementById('scene-quiz'),
      reveal: document.getElementById('scene-reveal'),
    };
    this.current = 'door';
  }

  async transitionTo(nextScene, opts = {}) {
    const outEl = this.scenes[this.current];
    const inEl  = this.scenes[nextScene];

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      outEl.classList.remove('active');
      inEl.classList.add('active');
      this.current = nextScene;
      opts.onComplete?.();
      return;
    }

    // Fade out current scene
    await gsap.to(outEl, {
      opacity: 0,
      duration: opts.outDuration ?? 0.6,
      ease: 'power2.in',
      onComplete: () => outEl.classList.remove('active'),
    });

    inEl.classList.add('active');
    inEl.style.opacity = 0;

    // Optional white flash overlay for cinematic feel
    if (opts.flash) {
      const flash = document.createElement('div');
      Object.assign(flash.style, {
        position: 'fixed', inset: 0, background: 'white',
        zIndex: 999, opacity: 1, pointerEvents: 'none',
      });
      document.body.appendChild(flash);
      await gsap.to(flash, { opacity: 0, duration: 0.8, ease: 'power2.out' });
      flash.remove();
    }

    // Fade in next scene
    await gsap.to(inEl, {
      opacity: 1,
      duration: opts.inDuration ?? 0.8,
      ease: 'power2.out',
    });

    this.current = nextScene;
    opts.onComplete?.();
  }
}

// Singleton
export const sceneManager = new SceneManager();
```

- [ ] **Step 2: Expose globally for non-module scripts**

Add at the bottom of `scene-manager.js`:
```js
window.sceneManager = sceneManager;
```

---

## Task 3: Scene 1 — Door (CSS 3D + Three.js)

**Files:**
- Create: `css/scene-door.css`
- Create: `js/scene-door.js`

- [ ] **Step 1: Create `css/scene-door.css`**

```css
#scene-door {
  background: var(--grad-bg);
  perspective: 1200px;
}

.welcome-text {
  font-family: var(--font-ruqaa);
  font-size: clamp(1.4rem, 4vw, 2.2rem);
  color: var(--rose-gold-2);
  letter-spacing: 0.08em;
  margin-bottom: 2rem;
  opacity: 0.9;
  text-align: center;
}

#door-container {
  width: min(280px, 70vw);
  height: min(420px, 55vh);
  position: relative;
  filter: drop-shadow(0 20px 60px rgba(212, 165, 165, 0.4));
}

/* CSS 3D door wrapper */
.door-scene {
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  perspective: 800px;
}

.door-panel {
  width: 100%;
  height: 100%;
  position: absolute;
  background: linear-gradient(160deg, #FFF0F3 0%, #F8D7DA 40%, #EFA8B8 100%);
  border: 2px solid var(--rose-gold);
  border-radius: 4px 4px 2px 2px;
  transform-origin: left center;
  transform-style: preserve-3d;
  transition: transform 1.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  will-change: transform;
}

.door-panel::before {
  content: '';
  position: absolute;
  inset: 8%;
  border: 1.5px solid rgba(212, 165, 165, 0.5);
  border-radius: 2px;
}

.door-panel.open { transform: rotateY(-110deg); }

/* Door frame */
.door-frame {
  position: absolute;
  inset: -12px -12px -12px -12px;
  border: 3px solid var(--rose-gold);
  border-radius: 6px 6px 3px 3px;
  background: transparent;
  pointer-events: none;
}

/* Interior glow visible when door opens */
.door-interior {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, #FFF9FA 0%, #FFF0F3 60%, #F8D7DA 100%);
  border-radius: 2px;
  z-index: -1;
}

/* Door knocker */
.door-knocker {
  position: absolute;
  top: 42%;
  left: 50%;
  transform: translateX(-50%);
  width: 48px;
  height: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.knocker-ring {
  width: 36px;
  height: 36px;
  border: 3px solid var(--rose-gold-2);
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #E8C5C5, var(--rose-gold));
  box-shadow: 0 2px 8px rgba(196, 139, 139, 0.4), inset 0 1px 3px rgba(255,255,255,0.4);
  transform-origin: top center;
  transition: transform 0.15s ease-out;
}
.knocker-ring.knock { transform: rotate(30deg); }

.knocker-pin {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--rose-gold-2);
  box-shadow: 0 1px 4px rgba(196, 139, 139, 0.5);
}

.knock-hint {
  font-family: var(--font-tajawal);
  font-size: 0.95rem;
  color: var(--warm-muted);
  margin-top: 1.5rem;
  opacity: 0.8;
  animation: pulse-hint 2s ease-in-out infinite;
}

@keyframes pulse-hint {
  0%, 100% { opacity: 0.5; }
  50%       { opacity: 0.9; }
}
```

- [ ] **Step 2: Create `js/scene-door.js`**

```js
import { sceneManager } from './scene-manager.js';
import { audioManager } from './audio.js';

const doorContainer = document.getElementById('door-container');
const knockHint     = document.querySelector('.knock-hint');

let knockCount = 0;

function buildDoor() {
  doorContainer.innerHTML = `
    <div class="door-scene">
      <div class="door-interior"></div>
      <div class="door-panel" id="door-panel">
        <div class="door-frame"></div>
        <div class="door-knocker" id="door-knocker">
          <div class="knocker-ring" id="knocker-ring"></div>
          <div class="knocker-pin"></div>
        </div>
      </div>
    </div>
  `;

  const knocker = document.getElementById('door-knocker');
  const ring    = document.getElementById('knocker-ring');
  const panel   = document.getElementById('door-panel');

  function doKnock(e) {
    e.stopPropagation();
    if (knockCount >= 2) return;

    knockCount++;
    audioManager.playKnock();

    ring.classList.add('knock');
    setTimeout(() => ring.classList.remove('knock'), 200);

    // Subtle shake of door panel
    gsap.fromTo(panel, { x: -3 }, { x: 0, duration: 0.25, ease: 'elastic.out(1, 0.3)' });

    if (knockCount === 1) {
      knockHint.textContent = 'اطرق مرة أخرى';
    }

    if (knockCount === 2) {
      knockHint.textContent = '';
      setTimeout(openDoor, 400);
    }
  }

  knocker.addEventListener('click', doKnock);
  knocker.addEventListener('touchend', (e) => { e.preventDefault(); doKnock(e); });
}

function openDoor() {
  const panel = document.getElementById('door-panel');
  panel.classList.add('open');

  audioManager.playDoorCreak();

  // After door fully opens, do cinematic transition
  setTimeout(() => {
    audioManager.startBGM();
    sceneManager.transitionTo('quiz', {
      flash: true,
      outDuration: 0.5,
      inDuration: 1.0,
    });
  }, 1200);
}

// Initial GSAP entrance animation for door scene
function animateDoorEntrance() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.from('.welcome-text', { y: -30, opacity: 0, duration: 0.8, ease: 'power2.out' });
  gsap.from('#door-container', { y: 40, opacity: 0, duration: 1, delay: 0.3, ease: 'power3.out' });
  gsap.from('.knock-hint', { opacity: 0, duration: 0.6, delay: 1.1 });
}

buildDoor();
animateDoorEntrance();
```

- [ ] **Step 3: Verify** — Refresh browser. Should see welcome text, pink door with knocker. Clicking knocker twice should open door with rotation.

---

## Task 4: Scene 2 — Quiz Game

**Files:**
- Create: `css/scene-quiz.css`
- Create: `js/scene-quiz.js`

- [ ] **Step 1: Create `css/scene-quiz.css`**

```css
#scene-quiz {
  background: var(--grad-bg);
  padding: var(--gap-lg);
  overflow-y: auto;
}

.quiz-wrapper {
  width: min(500px, 92vw);
  text-align: center;
}

.quiz-title {
  font-size: clamp(1.6rem, 5vw, 2.4rem);
  color: var(--rose-gold-2);
  margin-bottom: 1.5rem;
}

/* ===== Hearts Progress ===== */
.hearts-progress {
  display: flex;
  justify-content: center;
  gap: 0.6rem;
  margin-bottom: 2rem;
}

.heart-step {
  font-size: 1.4rem;
  filter: grayscale(1) opacity(0.4);
  transition: filter 0.4s ease, transform 0.3s ease;
}
.heart-step.filled {
  filter: none;
  transform: scale(1.2);
}

/* ===== Quiz Card ===== */
.quiz-card {
  background: var(--grad-card);
  border-radius: 20px;
  padding: 2rem 1.5rem;
  box-shadow: var(--shadow-card);
  border: 1px solid rgba(212, 165, 165, 0.3);
  min-height: 200px;
}

.question-text {
  font-family: var(--font-tajawal);
  font-size: clamp(1rem, 3.5vw, 1.25rem);
  font-weight: 500;
  color: var(--warm-text);
  line-height: 1.7;
  margin-bottom: 1.5rem;
}

.answers-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

@media (max-width: 380px) {
  .answers-grid { grid-template-columns: 1fr; }
}

.answer-btn {
  background: white;
  border: 1.5px solid var(--blush);
  border-radius: 12px;
  padding: 0.75rem 0.5rem;
  font-family: var(--font-tajawal);
  font-size: 0.92rem;
  color: var(--warm-text);
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, transform 0.15s;
  line-height: 1.4;
}
.answer-btn:hover {
  background: var(--blush-light);
  border-color: var(--blush-deep);
  transform: translateY(-2px);
}
.answer-btn.selected {
  background: var(--grad-rose);
  border-color: var(--rose-gold-2);
  color: white;
  transform: scale(1.03);
}

/* ===== Response Feedback ===== */
.feedback-text {
  font-family: var(--font-tajawal);
  font-size: 1rem;
  color: var(--rose-gold-2);
  margin-top: 1rem;
  min-height: 1.5em;
}

/* ===== Ayah Screen ===== */
.ayah-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  width: min(580px, 92vw);
  text-align: center;
}

.ayah-text {
  font-size: clamp(1.2rem, 4vw, 1.65rem);
  line-height: 2.1;
  color: var(--warm-text);
  text-shadow: 0 1px 2px rgba(212, 165, 165, 0.2);
}

.ayah-source {
  font-size: 0.95rem;
  color: var(--rose-gold);
  letter-spacing: 0.04em;
}

.result-msg {
  font-size: 1.1rem;
  color: var(--warm-muted);
  font-weight: 500;
}
```

- [ ] **Step 2: Create `js/scene-quiz.js`**

```js
import { sceneManager } from './scene-manager.js';
import { audioManager } from './audio.js';

const AYAH = 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنْفُسِكُمْ أَزْوَاجًا لِتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ';

const QUESTIONS = [
  {
    q: 'ما أهم أساس يبنى عليه البيت السعيد؟',
    answers: ['المال والثروة', 'المودة والاحترام', 'المنزل الكبير', 'عدد الأصدقاء'],
    feedbacks: [
      'المال يُيسّر لكن المودة هي السكن 💛',
      'أصبت! المودة والرحمة هما روح الزواج 💕',
      'المنزل مجرد مكان، الحب هو البيت 🏡',
      'الأصدقاء نعمة، لكن القلب الصادق أعظم 💖',
    ],
  },
  {
    q: 'ماذا تعني "المودة" في الزواج؟',
    answers: ['الحب العميق والمستمر', 'الهدايا المتبادلة', 'اتفاق الآراء دائماً', 'الصبر فقط'],
    feedbacks: [
      'رائع! المودة هي ذلك الحب الدافئ الثابت ❤️',
      'الهدايا تُبهج، لكن المودة هي الأساس 🎁',
      'الاختلاف طبيعي، والمودة تجمع القلوب رغمه 🌹',
      'الصبر جزء جميل، والمودة تجعله عسلاً 🍯',
    ],
  },
  {
    q: 'ما سر الشريك المثالي حسب الحكمة العربية؟',
    answers: ['يكمّل ما ينقصك', 'يشبهك تماماً', 'يوافقك على كل شيء', 'يحل كل مشاكلك'],
    feedbacks: [
      'حكمة! الاختلاف يثري الحياة المشتركة 🌟',
      'التشابه يُريح، لكن الاختلاف يُثري ✨',
      'الاتفاق نعمة والاختلاف فرصة للنمو 🌱',
      'الشريك رفيق لا منقذ، والرحلة المشتركة هي الكنز 🗝️',
    ],
  },
  {
    q: 'خمّن: كم من الوقت استغرق التحضير لهذه الخطوبة؟',
    answers: ['أسبوع واحد! 😄', 'شهر بالضبط 🗓️', 'أشهر طويلة من الأحلام ✨', 'منذ الأزل! 🌙'],
    feedbacks: [
      'يا لها من سرعة في الخطى! 😄 الفرحة لا تنتظر!',
      'الشهر كافٍ حين القلب يعرف 🌹',
      'أشهر من التخطيط لليلة واحدة لا تُنسى ✨',
      'بعض القصص كُتبت قبل أن نبدأ! 🌙',
    ],
  },
  {
    q: '"وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً" — ما الفرق بين المودة والرحمة؟',
    answers: [
      'المودة: حب الشباب — الرحمة: حنان الكبر',
      'لا فرق بينهما',
      'المودة للزوجة — الرحمة للزوج',
      'المودة مشاعر — الرحمة أفعال',
    ],
    feedbacks: [
      'تأمّل جميل! الحب يتطور ويعمّق مع السنين 🌸',
      'هما وجهان لنور واحد يملأ البيت 💡',
      'كلاهما للقلبين معاً بلا حدود 💕',
      'رائع! المودة تُشعَر والرحمة تُرى في الأفعال 🌹',
    ],
  },
];

let currentQ = 0;
const quizCard      = document.getElementById('quiz-card');
const heartsEl      = document.getElementById('hearts-progress');
const ayahScreen    = document.getElementById('ayah-screen');
const ayahTextEl    = document.getElementById('ayah-text');
const btnEnterInvite = document.getElementById('btn-enter-invite');

// Build heart progress indicators
function buildHearts() {
  heartsEl.innerHTML = QUESTIONS.map((_, i) =>
    `<span class="heart-step" data-idx="${i}">💍</span>`
  ).join('');
}

function fillHeart(idx) {
  const h = heartsEl.querySelector(`[data-idx="${idx}"]`);
  if (!h) return;
  h.classList.add('filled');
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.fromTo(h, { scale: 0.5 }, { scale: 1.2, duration: 0.4, ease: 'elastic.out(1.2, 0.4)',
      onComplete: () => gsap.to(h, { scale: 1, duration: 0.2 }) });
  }
}

function renderQuestion(idx) {
  const q = QUESTIONS[idx];
  quizCard.innerHTML = `
    <p class="question-text">${q.q}</p>
    <div class="answers-grid">
      ${q.answers.map((a, i) =>
        `<button class="answer-btn" data-idx="${i}">${a}</button>`
      ).join('')}
    </div>
    <p class="feedback-text" id="feedback-text"></p>
  `;

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.from('.question-text', { y: 20, opacity: 0, duration: 0.5, ease: 'power2.out' });
    gsap.from('.answer-btn', { y: 15, opacity: 0, duration: 0.4, stagger: 0.08, delay: 0.2, ease: 'power2.out' });
  }

  quizCard.querySelectorAll('.answer-btn').forEach(btn => {
    btn.addEventListener('click', () => onAnswer(btn, idx));
    btn.addEventListener('touchend', (e) => { e.preventDefault(); onAnswer(btn, idx); });
  });
}

function onAnswer(btn, qIdx) {
  if (btn.closest('.quiz-card').dataset.answered) return;
  btn.closest('.quiz-card').dataset.answered = '1';

  const aIdx = parseInt(btn.dataset.idx);
  btn.classList.add('selected');
  audioManager.playClick();

  const feedbackEl = document.getElementById('feedback-text');
  feedbackEl.textContent = QUESTIONS[qIdx].feedbacks[aIdx];

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.from(feedbackEl, { opacity: 0, y: 8, duration: 0.4 });
  }

  fillHeart(qIdx);

  setTimeout(() => nextQuestion(), 1600);
}

function nextQuestion() {
  currentQ++;
  if (currentQ < QUESTIONS.length) {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.to(quizCard, { opacity: 0, y: -20, duration: 0.35, ease: 'power2.in', onComplete: () => {
        renderQuestion(currentQ);
        gsap.fromTo(quizCard, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
      }});
    } else {
      renderQuestion(currentQ);
    }
  } else {
    showAyah();
  }
}

function showAyah() {
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.to(quizCard, { opacity: 0, scale: 0.95, duration: 0.4, ease: 'power2.in', onComplete: () => {
      quizCard.classList.add('hidden');
      heartsEl.classList.add('hidden');
      document.querySelector('.quiz-title').classList.add('hidden');
      startAyahTypewriter();
    }});
  } else {
    quizCard.classList.add('hidden');
    heartsEl.classList.add('hidden');
    document.querySelector('.quiz-title').classList.add('hidden');
    startAyahTypewriter();
  }
}

function startAyahTypewriter() {
  ayahScreen.classList.remove('hidden');
  ayahTextEl.textContent = '';

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.from(ayahScreen, { opacity: 0, duration: 0.8 });
  }

  const words = AYAH.split(' ');
  let i = 0;
  const interval = setInterval(() => {
    if (i >= words.length) {
      clearInterval(interval);
      showResultAndButton();
      return;
    }
    ayahTextEl.textContent += (i > 0 ? ' ' : '') + words[i];
    i++;
  }, 150);
}

function showResultAndButton() {
  const msg = document.createElement('p');
  msg.className = 'result-msg font-tajawal';
  msg.textContent = 'أنت شخص يُقدّر الحب الحقيقي! تفضل لحضور الاحتفال 💍';
  ayahScreen.insertBefore(msg, btnEnterInvite);

  btnEnterInvite.classList.remove('hidden');

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.from([msg, btnEnterInvite], { opacity: 0, y: 20, duration: 0.6, stagger: 0.2 });
  }

  btnEnterInvite.addEventListener('click', () => {
    sceneManager.transitionTo('reveal', { flash: true, outDuration: 0.6, inDuration: 1.0,
      onComplete: () => window.revealScene?.start() });
  });
}

// Initialize quiz scene when it becomes active
const observer = new MutationObserver(() => {
  if (document.getElementById('scene-quiz').classList.contains('active')) {
    buildHearts();
    renderQuestion(0);
  }
});
observer.observe(document.getElementById('scene-quiz'), { attributes: true, attributeFilter: ['class'] });
```

- [ ] **Step 3: Verify** — After door opens, quiz scene should appear with title, ring progress indicators, and first question card. Answering should show feedback and advance.

---

## Task 5: Scene 3 — Invitation Reveal

**Files:**
- Create: `css/scene-reveal.css`
- Create: `js/scene-reveal.js`

- [ ] **Step 1: Create `css/scene-reveal.css`**

```css
#scene-reveal {
  background: var(--grad-bg);
  overflow-y: auto;
  padding: var(--gap-md);
}

#confetti-canvas {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 5;
}

/* ===== Invitation Card ===== */
.invite-card {
  position: relative;
  z-index: 10;
  width: min(480px, 92vw);
  background: var(--grad-card);
  border-radius: 24px;
  padding: 2.5rem 2rem;
  border: 1.5px solid rgba(212, 165, 165, 0.4);
  box-shadow: var(--shadow-card), 0 0 80px rgba(239, 168, 184, 0.15);
  text-align: center;
  margin: auto;
}

.card-ornament {
  width: 60%;
  height: 2px;
  background: var(--grad-rose);
  margin: 0 auto 1.5rem;
  border-radius: 2px;
  opacity: 0.6;
}
.card-ornament.bottom { margin: 1.5rem auto 0; }

.card-label {
  font-size: 0.95rem;
  color: var(--rose-gold);
  letter-spacing: 0.05em;
  margin-bottom: 1.2rem;
}

.couple-names {
  font-size: clamp(2rem, 7vw, 3rem);
  color: var(--warm-text);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.groom-name, .bride-name { color: var(--rose-gold-2); }
.heart-divider { font-size: 1.5rem; }

.invite-text {
  font-size: clamp(0.9rem, 2.8vw, 1.05rem);
  color: var(--warm-muted);
  line-height: 1.8;
  margin-bottom: 1.5rem;
}

/* ===== Date Display ===== */
.date-display {
  font-size: clamp(1.8rem, 5vw, 2.4rem);
  color: var(--rose-gold-2);
  letter-spacing: 0.1em;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
}
.date-sep { color: var(--rose-gold); font-size: 0.8em; }

/* ===== Countdown ===== */
.countdown-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.6rem;
  margin-bottom: 1.5rem;
}

.cd-block {
  background: white;
  border: 1px solid var(--blush);
  border-radius: 12px;
  padding: 0.7rem 0.3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  box-shadow: 0 2px 8px rgba(212, 165, 165, 0.1);
}

.cd-val {
  font-family: var(--font-ruqaa);
  font-size: clamp(1.4rem, 4.5vw, 1.8rem);
  color: var(--rose-gold-2);
  line-height: 1;
}

.cd-label {
  font-size: 0.72rem;
  color: var(--warm-muted);
}

/* ===== Calendar Button ===== */
.btn-calendar {
  display: inline-block;
  padding: 0.7rem 1.8rem;
  border: 1.5px solid var(--rose-gold);
  border-radius: 50px;
  color: var(--rose-gold-2);
  text-decoration: none;
  font-size: 0.95rem;
  margin-bottom: 1.2rem;
  transition: background 0.2s, color 0.2s, transform 0.2s;
  background: transparent;
}
.btn-calendar:hover {
  background: var(--grad-rose);
  color: white;
  transform: translateY(-2px);
  border-color: transparent;
}

.closing-text {
  font-size: 0.95rem;
  color: var(--warm-muted);
  font-style: italic;
}
```

- [ ] **Step 2: Create `js/scene-reveal.js`**

```js
// Confetti, countdown, add-to-calendar

const TARGET_DATE = new Date('2026-08-08T18:00:00');

// ===== CONFETTI =====
class Confetti {
  constructor(canvas) {
    this.canvas  = canvas;
    this.ctx     = canvas.getContext('2d');
    this.pieces  = [];
    this.running = false;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width  = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  spawn(count = 120) {
    const colors = ['#F4C2C2','#EFA8B8','#D4A5A5','#C9A96E','#FFFFFF','#F8D7DA'];
    for (let i = 0; i < count; i++) {
      this.pieces.push({
        x:    Math.random() * this.canvas.width,
        y:    Math.random() * -100,
        w:    Math.random() * 8 + 5,
        h:    Math.random() * 5 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rot:  Math.random() * 360,
        rotV: (Math.random() - 0.5) * 6,
        vx:   (Math.random() - 0.5) * 2,
        vy:   Math.random() * 3 + 2,
        alpha: 1,
      });
    }
  }

  tick() {
    if (!this.running) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.pieces = this.pieces.filter(p => p.alpha > 0.05);

    this.pieces.forEach(p => {
      p.x   += p.vx;
      p.y   += p.vy;
      p.rot += p.rotV;
      if (p.y > this.canvas.height * 0.7) p.alpha -= 0.01;

      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rot * Math.PI / 180);
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      this.ctx.restore();
    });

    requestAnimationFrame(() => this.tick());
  }

  start() {
    this.running = true;
    this.spawn(150);
    this.tick();
    // Second wave
    setTimeout(() => this.spawn(80), 600);
  }

  stop() { this.running = false; }
}

// ===== COUNTDOWN =====
function updateCountdown() {
  const now  = new Date();
  const diff = TARGET_DATE - now;

  if (diff <= 0) {
    document.getElementById('cd-days').textContent    = '٠';
    document.getElementById('cd-hours').textContent   = '٠';
    document.getElementById('cd-minutes').textContent = '٠';
    document.getElementById('cd-seconds').textContent = '٠';
    return;
  }

  const toArabicNum = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);

  const days    = Math.floor(diff / 86400000);
  const hours   = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000)  / 60000);
  const seconds = Math.floor((diff % 60000)    / 1000);

  document.getElementById('cd-days').textContent    = toArabicNum(days);
  document.getElementById('cd-hours').textContent   = toArabicNum(hours);
  document.getElementById('cd-minutes').textContent = toArabicNum(minutes);
  document.getElementById('cd-seconds').textContent = toArabicNum(seconds);
}

// ===== ADD TO CALENDAR =====
function buildCalendarLink() {
  const start  = '20260808T180000';
  const end    = '20260808T220000';
  const title  = encodeURIComponent('خطوبة إبراهيم وأسماء');
  const details = encodeURIComponent('يسعدنا حضوركم لمشاركتنا فرحة الخطوبة 💍');
  const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}`;
  document.getElementById('btn-calendar').href = url;
}

// ===== REVEAL ENTRANCE =====
function revealEntrance() {
  const card = document.getElementById('invite-card');

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.from(card, { scale: 0.85, opacity: 0, duration: 1.2, ease: 'elastic.out(0.8, 0.5)', delay: 0.3 });

  gsap.from(['.couple-names', '.invite-text', '.date-display', '.countdown-grid', '.btn-calendar', '.closing-text'], {
    y: 20,
    opacity: 0,
    duration: 0.6,
    stagger: 0.12,
    delay: 0.8,
    ease: 'power2.out',
  });
}

// ===== PUBLIC API =====
const confetti = new Confetti(document.getElementById('confetti-canvas'));

window.revealScene = {
  start() {
    confetti.start();
    revealEntrance();
    buildCalendarLink();
    updateCountdown();
    setInterval(updateCountdown, 1000);
    document.getElementById('music-btn').classList.remove('hidden');
  },
};
```

- [ ] **Step 3: Verify** — After completing quiz, reveal scene should show confetti burst, invitation card animating in, countdown running live.

---

## Task 6: Audio System

**Files:**
- Create: `js/audio.js`

- [ ] **Step 1: Create `js/audio.js`**

```js
// AudioManager: BGM via <audio> element + Web Audio API for SFX

class AudioManager {
  constructor() {
    this.bgmEl   = document.getElementById('bgm');
    this.bgmEl.volume = 0;
    this.isMuted = false;
    this._ctx    = null;
    this._setupMusicBtn();
  }

  _getCtx() {
    if (!this._ctx) this._ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (this._ctx.state === 'suspended') this._ctx.resume();
    return this._ctx;
  }

  // Knock sound via Web Audio API oscillator
  playKnock() {
    try {
      const ctx  = this._getCtx();
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type      = 'sine';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (_) {}
  }

  // Creak sound (for door opening)
  playDoorCreak() {
    try {
      const ctx  = this._getCtx();
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.8);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);
      osc.start();
      osc.stop(ctx.currentTime + 1);
    } catch (_) {}
  }

  // Soft click for quiz answers
  playClick() {
    try {
      const ctx  = this._getCtx();
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type      = 'sine';
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (_) {}
  }

  // Start BGM with fade-in
  startBGM() {
    if (this.isMuted) return;
    this.bgmEl.play().catch(() => {});
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.bgmEl.volume = 0.45;
      return;
    }
    gsap.to(this.bgmEl, { volume: 0.45, duration: 3, ease: 'power1.inOut' });
  }

  _setupMusicBtn() {
    const btn = document.getElementById('music-btn');
    btn.addEventListener('click', () => this.toggleMute());
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    const btn = document.getElementById('music-btn');
    if (this.isMuted) {
      this.bgmEl.pause();
      btn.classList.add('muted');
    } else {
      this.bgmEl.play().catch(() => {});
      btn.classList.remove('muted');
    }
  }
}

export const audioManager = new AudioManager();
window.audioManager = audioManager;
```

- [ ] **Step 2: Verify** — Knocking the door should produce a low thud sound via the browser. After door opens, BGM should begin fading in (if audio file exists in `assets/audio/`). Music button toggles pause/play.

---

## Task 7: Final Polish & Mobile Testing

**Files:**
- Modify: `css/main.css` — ensure overflow, safe-area-inset, touch targets

- [ ] **Step 1: Add mobile-specific CSS to `css/main.css`**

Append to `css/main.css`:
```css
/* Safe area for notched phones */
body {
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}

/* Minimum touch targets */
.answer-btn, .btn-primary, .btn-calendar, .music-btn {
  min-height: 44px;
}

/* Prevent double-tap zoom on buttons */
button, a { touch-action: manipulation; }

/* Smooth scrolling inside scenes on iOS */
.scene { -webkit-overflow-scrolling: touch; }
```

- [ ] **Step 2: Add `<meta>` tags for iOS/Android polish to `index.html` `<head>`**

```html
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<meta name="theme-color" content="#FFF9FA" />
```

- [ ] **Step 3: Mobile test checklist**

Test on a real phone or DevTools mobile emulation:
- [ ] Door knocker tappable and responds on first/second tap
- [ ] Quiz answers don't need double-tap
- [ ] Invitation card fully visible without horizontal scroll
- [ ] Countdown numbers update every second
- [ ] Music button visible and functional
- [ ] No layout breakage at 375px width (iPhone SE)

---

## Spec Coverage Review

| Requirement | Task |
|-------------|------|
| 3D CSS door, blush/rose gold palette | Task 3 |
| Arabic welcome text, Aref Ruqaa font | Task 1 (HTML) + Task 3 |
| Two knocks, sound, door open animation | Task 3 (scene-door.js) |
| Cinematic flash transition | Task 2 (SceneManager) |
| 5-question quiz with feedbacks | Task 4 |
| Animated hearts/ring progress | Task 4 |
| Quiz SFX (click sounds) | Task 6 |
| Ayah typewriter effect | Task 4 |
| Result message + "Enter Invite" button | Task 4 |
| Confetti burst on reveal | Task 5 |
| Luxury invitation card | Task 1 (HTML) + Task 5 |
| Countdown timer (Arabic numerals) | Task 5 |
| Add to Google Calendar | Task 5 |
| BGM fade-in after door | Task 6 |
| Music toggle button | Task 1 (HTML) + Task 6 |
| GSAP animations throughout | Tasks 2–5 |
| prefers-reduced-motion | Tasks 2–5 |
| Mobile responsive | Task 7 |
| Font trio (Amiri/Aref Ruqaa/Tajawal) | Task 1 |
