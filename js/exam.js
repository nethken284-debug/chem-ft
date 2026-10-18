/* ==========================================================
   Chem FT — Exam Zone
   Chapter tests, mock exam, speed run, daily 5, mistake review.
   ========================================================== */
(function () {
  'use strict';
  const A = window.ChemApp;
  const { h } = A;

  function grade(pct) {
    if (pct >= 90) return ['5**', 'Outstanding! 🌟'];
    if (pct >= 80) return ['5*', 'Excellent work!'];
    if (pct >= 70) return ['5', 'Very good!'];
    if (pct >= 60) return ['4', 'Good. A little more practice and you\'ll get 5.'];
    if (pct >= 50) return ['3', 'Pass. Go over your mistakes below.'];
    if (pct >= 40) return ['2', 'Nearly there. Revise the lessons and try again.'];
    if (pct >= 30) return ['1', 'Keep going. Replay the lesson games first.'];
    return ['U', 'Don\'t give up! Start again from the lessons.'];
  }
  function strip(html) { const d = document.createElement('div'); d.innerHTML = html; return d.textContent || ''; }
  function answerText(q) {
    if (q.type === 'mcq') return q.options[q.answer];
    if (q.type === 'tf') return q.answer ? 'True' : 'False';
    if (q.type === 'fill') return A.esc([].concat(q.answer)[0]);
    if (q.type === 'multi') return q.answer.map(i => q.options[i]).join('; ');
    if (q.type === 'match') return q.pairs.map(p => p[0] + ' → ' + p[1]).join('; ');
    return '';
  }

  // balanced pick: n questions spread across chapters / lessons, avoiding near-duplicates
  function pickSet(pool, n) {
    const byLesson = {};
    pool.forEach(q => { const k = q.lesson || q.chapter; (byLesson[k] = byLesson[k] || []).push(q); });
    const buckets = A.shuffle(Object.values(byLesson).map(b => A.shuffle(b)));
    const out = [];
    while (out.length < n && buckets.some(b => b.length)) {
      for (const b of buckets) { if (b.length && out.length < n) out.push(b.pop()); }
    }
    return A.shuffle(out);
  }

  const MODES = {
    ch0: { title: 'Chapter 0 Test', ico: '🧪', sub: '12 questions · Intro & lab safety', n: 12, chapters: ['ch0'] },
    ch1: { title: 'Chapter 1 Test', ico: '⚛️', sub: '12 questions · Elements', n: 12, chapters: ['ch1'] },
    ch2: { title: 'Chapter 2 Test', ico: '⚗️', sub: '12 questions · Compounds & mixtures', n: 12, chapters: ['ch2'] },
    mock: { title: 'Mock Exam', ico: '🎓', sub: '30 questions · 25 minutes · Ch 0–2', n: 30, time: 25 * 60, chapters: ['ch0', 'ch1', 'ch2'] },
    speed: { title: 'Speed Run', ico: '⚡', sub: '90 seconds · how many can you get right in a row?', speed: true },
    daily: { title: 'Daily 5', ico: '☀️', sub: '5 random questions · instant feedback', n: 5, practice: true, chapters: ['ch0', 'ch1', 'ch2'] },
    mistakes: { title: 'Mistake Review', ico: '🩹', sub: 'Get them right to clear them', practice: true, mistakes: true }
  };

  function hub(root) {
    root.appendChild(h('div', { class: 'lesson-title' }, h('div', { class: 'kicker', text: 'Exam Zone' }), h('h2', { html: 'Test yourself <span class="zh">考試區</span>' })));
    root.appendChild(h('p', { class: 'muted', html: 'In chapter tests and the mock exam, answers are shown <b>at the end</b>, like a real exam. Grades use the DSE scale (5** is the top).' }));
    const total = A.allQuestions().length;
    const grid = h('div', { class: 'grid grid-2', style: { marginTop: '18px' } });
    ['mock', 'speed', 'ch0', 'ch1', 'ch2', 'daily', 'mistakes'].forEach(k => {
      const m = MODES[k];
      if (m.chapters && m.chapters.some(c => !A.chapterById[c])) return;
      const best = A.state.best[k];
      const nMist = Object.keys(A.state.mistakes).filter(id => A.questionById(id)).length;
      const extra = k === 'mistakes' ? (nMist ? nMist + ' to fix' : 'No mistakes yet 🎉') : best != null ? (k === 'speed' ? 'Best: ' + best + ' pts' : 'Best: ' + best + '%') : 'Not tried yet';
      const card = h('a', { class: 'card mode-card', href: '#/exam/' + k, style: { textDecoration: 'none', color: 'inherit' } },
        h('div', { class: 'row' }, h('span', { class: 'mc-ico', text: m.ico }), h('span', { class: 'spacer' }), h('span', { class: 'pill', text: extra })),
        h('h3', { text: m.title }), h('div', { class: 'muted', style: { fontSize: '15px' }, text: m.sub }));
      grid.appendChild(card);
    });
    root.appendChild(grid);
    root.appendChild(h('p', { class: 'tiny center', style: { marginTop: '20px' }, text: total + ' questions in the bank, all from the book (Ch 0–2).' }));
  }

  function header(root, m) {
    root.appendChild(h('div', { class: 'row', style: { marginBottom: '14px' } },
      h('a', { href: '#/exam', class: 'btn btn-sm btn-ghost', text: '← Exam Zone' }),
      h('span', { class: 'spacer' })));
    root.appendChild(h('div', { class: 'lesson-title' }, h('div', { class: 'kicker', text: m.sub }), h('h2', { text: m.ico + ' ' + m.title })));
  }

  function start(root, key) {
    const m = MODES[key];
    if (!m) return hub(root);
    header(root, m);
    if (m.speed) return speedRun(root);
    let pool;
    if (m.mistakes) {
      pool = Object.keys(A.state.mistakes).map(A.questionById).filter(Boolean);
      if (!pool.length) {
        root.appendChild(h('div', { class: 'card empty' }, h('div', { style: { fontSize: '40px' }, text: '🎉' }), h('p', { text: 'No mistakes to fix right now. Take a test to find your weak spots!' }), h('a', { class: 'btn btn-primary', href: '#/exam/mock', text: 'Try the mock exam' })));
        return;
      }
      pool = pool.slice(0, 15);
    } else {
      pool = A.allQuestions().filter(q => m.chapters.includes(q.chapter));
    }
    if (!pool.length) { root.appendChild(h('div', { class: 'empty', text: 'No questions yet.' })); return; }
    const set = m.mistakes ? pool : (key === 'mock' ? mockSet(m.n) : pickSet(pool, m.n));

    if (!m.practice && !m.time) {
      // intro screen
      const intro = h('div', { class: 'card center stack' },
        h('div', { style: { fontSize: '46px' }, text: m.ico }),
        h('p', { class: 'muted', html: set.length + ' questions. Answers are shown at the end. Ready?' }),
        h('div', null, h('button', { class: 'btn btn-primary btn-lg', text: 'Start test' })));
      intro.querySelector('button').addEventListener('click', () => { intro.remove(); run(); });
      root.appendChild(intro);
    } else if (m.time) {
      const intro = h('div', { class: 'card center stack' },
        h('div', { style: { fontSize: '46px' }, text: '🎓' }),
        h('h3', { text: set.length + ' questions · ' + Math.round(m.time / 60) + ' minutes' }),
        h('p', { class: 'muted', text: 'Mixed questions from Chapters 0, 1 and 2. The timer starts when you press Start. Answers are shown at the end.' }),
        h('div', null, h('button', { class: 'btn btn-primary btn-lg', text: 'Start mock exam' })));
      intro.querySelector('button').addEventListener('click', () => { intro.remove(); run(); });
      root.appendChild(intro);
    } else run();

    function run() {
      const card = h('div', { class: 'card' });
      root.appendChild(card);
      A.quiz(card, set, {
        mode: m.practice ? 'practice' : 'exam', timeLimit: m.time, keepOrder: true,
        xpPerCorrect: m.practice ? 5 : 0,
        onFinish: (res, box) => results(box, key, res)
      });
    }
  }

  function mockSet(n) {
    const per = Math.floor(n / 3);
    const out = [];
    ['ch0', 'ch1', 'ch2'].forEach((c, i) => {
      const pool = A.allQuestions().filter(q => q.chapter === c);
      out.push(...pickSet(pool, i === 2 ? n - per * 2 : per));
    });
    return A.shuffle(out);
  }

  function results(box, key, res) {
    const m = MODES[key];
    const pct = res.total ? Math.round(res.score / res.total * 100) : 0;
    const [g, msg] = grade(pct);
    const prev = A.state.best[key];
    if (!m.mistakes && (prev == null || pct > prev)) {
      const gain = Math.max(0, Math.round((pct - (prev || 0)) / 100 * res.total * 4));
      A.state.best[key] = pct; A.save();
      if (gain) A.addXP(gain, prev == null ? 'First attempt' : 'New best!');
    }
    if (pct >= 80) { A.celebrate(1); A.sound('win'); } else A.sound(pct >= 50 ? 'good' : 'pop');

    box.appendChild(h('div', { class: 'result-hero pop-in' },
      m.practice ? h('div', { style: { fontSize: '56px' }, text: pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '💪' }) : h('div', { class: 'grade', text: g }),
      h('h2', { style: { marginTop: '10px' }, text: res.score + ' / ' + res.total + '  (' + pct + '%)' }),
      h('p', { class: 'muted', text: m.practice ? (pct === 100 ? 'Perfect!' : 'Nice practice. Have another go at the red ones.') : msg }),
      res.answered < res.total ? h('p', { class: 'tiny', text: (res.total - res.answered) + ' question(s) not answered (time ran out).' }) : null));

    const wrong = res.items.filter(x => !x.correct).map(x => x.q).concat(res.qs.slice(res.answered));
    const actions = h('div', { class: 'row', style: { justifyContent: 'center', margin: '8px 0 24px' } },
      h('a', { class: 'btn', href: '#/exam', text: '← Exam Zone' }),
      h('button', { class: 'btn', text: '↻ New set', on: { click: () => { const r = document.getElementById('view'); r.innerHTML = ''; start(r, key); } } }),
      wrong.length ? h('button', { class: 'btn btn-primary', text: 'Practise my ' + wrong.length + ' wrong one' + (wrong.length > 1 ? 's' : ''), on: { click: () => { box.innerHTML = ''; A.quiz(box, wrong, { mode: 'practice', xpPerCorrect: 5 }); } } }) : null);
    box.appendChild(actions);

    if (!m.practice) {
      box.appendChild(h('h3', { text: 'Review your answers' }));
      const list = h('div', { class: 'stack' });
      res.qs.forEach((q, i) => {
        const it = res.items[i];
        const ok = it && it.correct;
        const ch = A.chapterById[q.chapter];
        list.appendChild(h('div', { class: 'review-item ' + (ok ? 'ok' : 'no') },
          h('div', { class: 'ri-q', html: (ok ? '✅ ' : '❌ ') + '<span class="tiny">Q' + (i + 1) + (ch ? ' · Ch ' + ch.num : '') + '</span> ' + (q.type === 'fill' ? q.q.replace(/_{3,}/g, '____') : q.q) }),
          h('div', { class: 'ri-a', html: (it ? 'Your answer: <b>' + A.esc(strip(String(it.given))) + '</b> · ' : 'Not answered · ') + 'Correct: <b>' + answerText(q) + '</b>' }),
          q.explain ? h('div', { class: 'ri-a', html: '💡 ' + q.explain }) : null));
      });
      box.appendChild(list);
    }
  }

  /* ---------- speed run ---------- */
  function speedRun(root) {
    const pool = A.allQuestions().filter(q => q.type === 'tf' || q.type === 'mcq');
    const card = h('div', { class: 'card' });
    root.appendChild(card);
    const intro = h('div', { class: 'center stack' },
      h('div', { style: { fontSize: '50px' }, class: 'float', text: '⚡' }),
      h('h3', { text: '90 seconds. Go!' }),
      h('p', { class: 'muted', text: 'True/false and multiple choice only. Each right answer in a row raises your combo bonus. A wrong answer resets the combo to 0.' }),
      h('div', null, h('button', { class: 'btn btn-primary btn-lg', text: 'Start ⚡' })));
    card.appendChild(intro);
    intro.querySelector('button').addEventListener('click', go);

    function go() {
      card.innerHTML = '';
      let t = 90, pts = 0, combo = 0, n = 0, right = 0, over = false;
      let deck = A.shuffle(pool);
      const timer = h('span', { class: 'quiz-timer', text: '⏱ 90' });
      const ptsEl = h('span', { class: 'pill', html: '⭐ <b>0</b> pts' });
      const comboEl = h('span', { class: 'pill', text: '🔥 x1' });
      const stage = h('div');
      card.appendChild(h('div', { class: 'quiz-top' }, timer, h('span', { class: 'spacer' }), comboEl, ptsEl));
      card.appendChild(stage);
      const id = A.every(() => {
        t--; timer.textContent = '⏱ ' + Math.max(0, t);
        if (t <= 10) timer.classList.add('low');
        if (t <= 0) end();
      }, 1000);
      function next() {
        if (over) return;
        if (!deck.length) deck = A.shuffle(pool);
        const q = deck.pop();
        stage.innerHTML = '';
        stage.appendChild(A.renderQuestion(q, {
          instant: true, done: r => {
            n++;
            if (r.correct) { right++; combo++; pts += 10 * (1 + Math.floor(combo / 3)); }
            else combo = 0;
            ptsEl.innerHTML = '⭐ <b>' + pts + '</b> pts';
            comboEl.textContent = '🔥 x' + (1 + Math.floor(combo / 3));
            if (combo && combo % 3 === 0) { A.toast('🔥 Combo x' + (1 + Math.floor(combo / 3)) + '!', 'xp'); }
            A.later(next, r.correct ? 650 : 1500);
          }
        }));
      }
      function end() {
        if (over) return; over = true; clearInterval(id);
        const prev = A.state.best.speed;
        const isBest = prev == null || pts > prev;
        if (isBest) { A.state.best.speed = pts; A.save(); }
        if (isBest && pts > 0) { A.celebrate(.8); A.sound('win'); A.addXP(Math.min(60, Math.round(pts / 10)), 'Speed record'); }
        card.innerHTML = '';
        card.appendChild(h('div', { class: 'center stack pop-in' },
          h('div', { style: { fontSize: '50px' }, text: isBest ? '🏆' : '⚡' }),
          h('h2', { text: pts + ' points' }),
          h('p', { class: 'muted', text: right + ' right out of ' + n + ' answered' + (isBest ? ' · NEW RECORD!' : ' · Best: ' + prev) }),
          h('div', { class: 'row', style: { justifyContent: 'center' } },
            h('a', { class: 'btn', href: '#/exam', text: '← Exam Zone' }),
            h('button', { class: 'btn btn-primary', text: '↻ Again', on: { click: go } }))));
      }
      next();
    }
  }

  window.ChemExam = {
    render(root, mode) { if (!mode) hub(root); else start(root, mode); }
  };
})();
