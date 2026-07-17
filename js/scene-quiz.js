// Scene 2: Interactive love quiz + Quran Ayah typewriter reveal

import { sceneManager } from './scene-manager.js';
import { audioManager } from './audio.js';
import { quizBg }       from './quiz-background.js';

const AYAH = 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنْفُسِكُمْ أَزْوَاجًا لِتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ';

const QUESTIONS = [
  {
    q: 'ما أهم أساس يُبنى عليه البيت السعيد؟',
    answers: ['المال والثروة', 'المودة والاحترام', 'المنزل الكبير', 'عدد الأصدقاء'],
    feedbacks: [
      'المال يُيسّر لكن المودة هي السكن الحقيقي 💛',
      'أصبت تماماً! المودة والرحمة هما روح كل بيت سعيد 💕',
      'المنزل مجرد جدران، والحب هو البيت الحقيقي 🏡',
      'الأصدقاء نعمة، لكن القلب الصادق بينكما أعظم 💖',
    ],
  },
  {
    q: 'ما معنى "الرحمة" في الزواج؟',
    answers: ['الشفقة وقت الضعف', 'تبادل الهدايا', 'الاتفاق دائماً', 'قضاء الوقت معاً'],
    feedbacks: [
      'بالضبط! الرحمة تجعل كل ضعف آمناً ومحاطاً بالحنان 🌸',
      'الهدايا تُبهج اللحظة، والرحمة تبقى مع الزمن 🎁',
      'الاختلاف طبيعي والرحمة تحوّله إلى فرصة للتفاهم 🌹',
      'وقت الحضور نعمة، والرحمة روح اللحظات المشتركة ☕',
    ],
  },
  {
    q: '"وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً" — ما أجمل ما في هذه الآية؟',
    answers: [
      'أن المودة والرحمة آية من آيات الله',
      'أنها تجمع قلبين مختلفين',
      'أنها تصف الزواج بأعمق معانيه',
      'كل ذلك معاً!',
    ],
    feedbacks: [
      'سبحان الله! كل بيت سعيد هو آية في ذاته 🌿',
      'القلبان المختلفان يصنعان معاً أجمل لوحة ❤️',
      'الزواج في القرآن مودة ورحمة وسكن، ما أعمق ذلك 📖',
      'أحسنت! جمال الآية في شموليتها وعمقها 💍',
    ],
  },
];

const reduced        = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const quizCard       = document.getElementById('quiz-card');
const heartsEl       = document.getElementById('hearts-progress');
const ayahScreen     = document.getElementById('ayah-screen');
const ayahTextEl     = document.getElementById('ayah-text');
const btnEnterInvite = document.getElementById('btn-enter-invite');
const quizIntroEl    = document.getElementById('quiz-intro');
const quizWrapperEl  = document.getElementById('quiz-wrapper');
const btnStartQuiz   = document.getElementById('btn-start-quiz');

let currentQ   = 0;
let quizActive = false;

// ===== INTRO → QUESTIONS TRANSITION =====
btnStartQuiz.addEventListener('click', startQuizFromIntro);
btnStartQuiz.addEventListener('touchend', e => { e.preventDefault(); startQuizFromIntro(); });

function startQuizFromIntro() {
  if (reduced) {
    quizIntroEl.classList.add('hidden');
    quizWrapperEl.classList.remove('hidden');
    buildHearts();
    renderQuestion(0);
    return;
  }
  gsap.to(quizIntroEl, {
    opacity: 0, scale: 0.96, duration: 0.4, ease: 'power2.in',
    onComplete: () => {
      quizIntroEl.classList.add('hidden');
      quizWrapperEl.classList.remove('hidden');
      gsap.from(quizWrapperEl, { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' });
      buildHearts();
      renderQuestion(0);
    },
  });
}

// ===== HEARTS PROGRESS =====
function buildHearts() {
  heartsEl.innerHTML = QUESTIONS.map((_, i) =>
    `<span class="heart-step" data-idx="${i}" aria-hidden="true">💍</span>`
  ).join('');
}

function fillHeart(idx) {
  const h = heartsEl.querySelector(`[data-idx="${idx}"]`);
  if (!h) return;
  h.classList.add('filled');
  audioManager.playHeartFill();
  if (reduced) return;
  gsap.fromTo(h,
    { scale: 0.6, opacity: 0.5 },
    { scale: 1.2, opacity: 1, duration: 0.45, ease: 'elastic.out(1.2, 0.4)',
      onComplete: () => gsap.to(h, { scale: 1, duration: 0.2, ease: 'power2.out' }) }
  );
}

// ===== QUESTION RENDER =====
function renderQuestion(idx) {
  const q = QUESTIONS[idx];

  quizCard.removeAttribute('data-answered');
  quizCard.innerHTML = `
    <p class="question-counter font-tajawal">السؤال ${idx + 1} من ${QUESTIONS.length}</p>
    <p class="question-text font-tajawal">${q.q}</p>
    <div class="answers-grid">
      ${q.answers.map((a, i) =>
        `<button class="answer-btn font-tajawal" data-idx="${i}">${a}</button>`
      ).join('')}
    </div>
    <p class="feedback-text font-tajawal" id="feedback-text" aria-live="polite"></p>
  `;

  if (!reduced) {
    gsap.from('.question-counter', { opacity: 0, duration: 0.3 });
    gsap.from('.question-text',    { y: 18, opacity: 0, duration: 0.5, ease: 'power2.out', delay: 0.05 });
    gsap.from('.answer-btn',       { y: 12, opacity: 0, duration: 0.4, stagger: 0.07, delay: 0.18, ease: 'power2.out' });
  }

  quizCard.querySelectorAll('.answer-btn').forEach(btn => {
    btn.addEventListener('click',    (e) => onAnswer(btn, idx, e));
    btn.addEventListener('touchend', (e) => { e.preventDefault(); onAnswer(btn, idx, e); });
  });
}

// ===== ANSWER HANDLER =====
function onAnswer(btn, qIdx, e) {
  if (quizCard.dataset.answered) return;
  quizCard.dataset.answered = '1';

  const aIdx = parseInt(btn.dataset.idx);
  btn.classList.add('selected');
  audioManager.playClick();

  // Sparkle burst from button centre
  const r = btn.getBoundingClientRect();
  quizBg.spawnSparkles(r.left + r.width / 2, r.top + r.height / 2, 22);

  // Ripple effect on button
  if (!reduced && e) {
    const rect = btn.getBoundingClientRect();
    const cx = (e.clientX || e.changedTouches?.[0]?.clientX || rect.left + rect.width / 2) - rect.left;
    const cy = (e.clientY || e.changedTouches?.[0]?.clientY || rect.top  + rect.height / 2) - rect.top;

    const circle = document.createElement('span');
    Object.assign(circle.style, {
      position: 'absolute', left: cx + 'px', top: cy + 'px',
      width: '8px', height: '8px',
      background: 'rgba(255,255,255,0.5)', borderRadius: '50%',
      transform: 'translate(-50%, -50%) scale(0)',
      pointerEvents: 'none',
    });
    btn.appendChild(circle);
    gsap.to(circle, { scale: 15, opacity: 0, duration: 0.5, ease: 'power2.out',
      onComplete: () => circle.remove() });
  }

  const feedbackEl = document.getElementById('feedback-text');
  feedbackEl.textContent = QUESTIONS[qIdx].feedbacks[aIdx];
  if (!reduced) gsap.from(feedbackEl, { opacity: 0, y: 6, duration: 0.4, ease: 'power2.out' });

  fillHeart(qIdx);

  setTimeout(() => nextQuestion(), 1700);
}

// ===== ADVANCE =====
function nextQuestion() {
  currentQ++;
  if (currentQ < QUESTIONS.length) {
    if (reduced) {
      renderQuestion(currentQ);
    } else {
      gsap.to(quizCard, {
        opacity: 0, y: -18, duration: 0.32, ease: 'power2.in',
        onComplete: () => {
          gsap.set(quizCard, { y: 20 });
          renderQuestion(currentQ);
          gsap.to(quizCard, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
        },
      });
    }
  } else {
    showAyah();
  }
}

// ===== AYAH REVEAL =====
function showAyah() {
  const toHide = [quizCard, heartsEl, document.querySelector('.quiz-title')];

  if (reduced) {
    toHide.forEach(el => el?.classList.add('hidden'));
    startAyahTypewriter();
    return;
  }

  gsap.to(toHide.filter(Boolean), {
    opacity: 0, scale: 0.97, duration: 0.4, ease: 'power2.in', stagger: 0.05,
    onComplete: () => {
      toHide.forEach(el => el?.classList.add('hidden'));
      startAyahTypewriter();
    },
  });
}

function startAyahTypewriter() {
  ayahScreen.classList.remove('hidden');
  ayahTextEl.textContent = '';

  if (!reduced) {
    gsap.fromTo(ayahScreen, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' });
  }

  const words = AYAH.split(' ');
  let i = 0;

  const tick = () => {
    if (i >= words.length) {
      showResult();
      return;
    }
    ayahTextEl.textContent += (i > 0 ? ' ' : '') + words[i];
    i++;
    setTimeout(tick, reduced ? 0 : 130);
  };

  setTimeout(tick, reduced ? 0 : 400);
}

function showResult() {
  const msg = document.createElement('p');
  msg.className = 'result-msg font-tajawal';
  msg.textContent = 'أنت شخص يُقدّر الحب الحقيقي! تفضل لحضور الاحتفال 💍';
  ayahScreen.insertBefore(msg, btnEnterInvite);

  btnEnterInvite.classList.remove('hidden');

  if (!reduced) {
    gsap.from([msg, btnEnterInvite], { opacity: 0, y: 18, duration: 0.6, stagger: 0.2, ease: 'power2.out' });
  }
}

// ===== ENTER INVITE BUTTON =====
btnEnterInvite.addEventListener('click', () => {
  if (!reduced) {
    gsap.to('#scene-quiz', { opacity: 0, scale: 1.03, duration: 0.5 });
  }
  setTimeout(() => {
    sceneManager.transitionTo('reveal', {
      flash: true,
      outDuration: 0.1,
      inDuration: 1.0,
      onComplete: () => window.revealScene?.start(),
    });
  }, reduced ? 0 : 450);
});

// ===== INIT WHEN SCENE BECOMES ACTIVE =====
// Only animate the intro card in — questions start on button click
function initQuiz() {
  if (quizActive) return;
  quizActive = true;

  quizBg.start();

  if (!reduced) {
    gsap.from('.quiz-intro-card', {
      opacity: 0, y: 30, scale: 0.95, duration: 0.7, ease: 'power2.out', delay: 0.1,
    });
  }
}

// Watch for scene activation
const observer = new MutationObserver(() => {
  const scene = document.getElementById('scene-quiz');
  if (scene.classList.contains('active')) initQuiz();
});
observer.observe(document.getElementById('scene-quiz'), { attributes: true, attributeFilter: ['class'] });
