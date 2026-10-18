/* ==========================================================
   Chem FT — core runtime
   Exposes window.ChemApp: state, router hooks, UI helpers,
   quiz engine and reusable mini-game widgets.
   ========================================================== */
(function () {
  'use strict';

  const STORE_KEY = 'chemft-v1';
  const chapters = [];
  const chapterById = {};
  let viewCleanups = [];

  /* ---------------- state ---------------- */
  const defaultState = () => ({
    xp: 0, done: {}, solved: {}, rewards: {}, mistakes: {}, best: {},
    streak: { last: null, count: 0 }, muted: false, lastLesson: {}, attempts: 0, correct: 0
  });
  let state = defaultState();
  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) state = Object.assign(defaultState(), JSON.parse(raw));
    } catch (e) { /* storage unavailable: keep in-memory state */ }
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }
  load();

  function todayStr(d) {
    d = d || new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function touchStreak() {
    const today = todayStr();
    if (state.streak.last === today) return;
    const y = new Date(); y.setDate(y.getDate() - 1);
    state.streak.count = state.streak.last === todayStr(y) ? state.streak.count + 1 : 1;
    state.streak.last = today;
    save();
  }

  /* ---------------- DOM helper ---------------- */
  // h('div', {class:'x', on:{click: fn}, html:'<b>hi</b>', style:{...}}, child, 'text', [more])
  function h(tag, props, ...children) {
    const svgTags = h.svgTags;
    const isSvg = svgTags.has(tag);
    const el = isSvg ? document.createElementNS('http://www.w3.org/2000/svg', tag) : document.createElement(tag);
    if (props && (typeof props !== 'object' || props instanceof Node || Array.isArray(props))) {
      children.unshift(props); props = null;
    }
    if (props) {
      for (const k in props) {
        const v = props[k];
        if (v == null || v === false) continue;
        if (k === 'class' || k === 'className') { isSvg ? el.setAttribute('class', v) : (el.className = v); }
        else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
        else if (k === 'html') el.innerHTML = v;
        else if (k === 'text') el.textContent = v;
        else if (k === 'on') { for (const ev in v) el.addEventListener(ev, v[ev]); }
        else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
        else if (k === 'dataset') Object.assign(el.dataset, v);
        else if (v === true) el.setAttribute(k, '');
        else el.setAttribute(k, v);
      }
    }
    appendKids(el, children);
    return el;
  }
  h.svgTags = new Set(['svg', 'g', 'circle', 'ellipse', 'rect', 'line', 'path', 'polygon', 'polyline', 'text', 'tspan', 'defs', 'linearGradient', 'radialGradient', 'stop', 'clipPath', 'use', 'marker', 'pattern', 'mask', 'filter', 'feGaussianBlur', 'feOffset', 'feMerge', 'feMergeNode', 'animate', 'animateTransform', 'title', 'foreignObject']);
  function appendKids(el, kids) {
    for (const c of kids) {
      if (c == null || c === false) continue;
      if (Array.isArray(c)) appendKids(el, c);
      else if (c instanceof Node) el.appendChild(c);
      else el.appendChild(document.createTextNode(String(c)));
    }
  }
  function frag(html) { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content; }
  function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

  /* ---------------- utils ---------------- */
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  function sample(arr, n) { return shuffle(arr).slice(0, n); }
  function rng(seed) { // mulberry32 — deterministic layouts for particle boxes
    let t = (seed >>> 0) || 1;
    return function () {
      t += 0x6D2B79F5; let r = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r); return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }
  // normalise free-text answers: case, spacing, punctuation, UK/US spelling, chemistry quirks
  function norm(s) {
    return String(s).toLowerCase()
      .replace(/[‐-―]/g, '-')
      .replace(/sulfur/g, 'sulphur').replace(/sulfide/g, 'sulphide').replace(/sulfate/g, 'sulphate')
      .replace(/aluminum/g, 'aluminium').replace(/color/g, 'colour').replace(/vapor/g, 'vapour')
      .replace(/fumes?\s+cupboard/g, 'fume cupboard')
      .replace(/[.,!?;:'"()]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function matches(input, answers) {
    const n = norm(input);
    if (!n) return false;
    return [].concat(answers).some(a => norm(a) === n);
  }
  // "H2O" -> "H<sub>2</sub>O" ; leading coefficient stays normal ("2H2O")
  function chem(f) {
    return String(f).replace(/([A-Za-z\)\]])(\d+)/g, '$1<sub>$2</sub>');
  }

  /* ---------------- view lifecycle ---------------- */
  function onCleanup(fn) { viewCleanups.push(fn); }
  function runCleanups() { viewCleanups.forEach(fn => { try { fn(); } catch (e) { console.error(e); } }); viewCleanups = []; }
  function later(fn, ms) { const id = setTimeout(fn, ms); onCleanup(() => clearTimeout(id)); return id; }
  function every(fn, ms) { const id = setInterval(fn, ms); onCleanup(() => clearInterval(id)); return id; }
  function loop(fn) { // rAF loop with dt (seconds); auto-stopped on navigation
    let alive = true, last = performance.now();
    function tick(now) { if (!alive) return; const dt = Math.min(.05, (now - last) / 1000); last = now; if (fn(dt, now) === false) return; requestAnimationFrame(tick); }
    requestAnimationFrame(tick);
    const stop = () => { alive = false; };
    onCleanup(stop);
    return stop;
  }

  /* ---------------- sound ---------------- */
  let actx = null;
  function sound(kind) {
    if (state.muted) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === 'suspended') actx.resume();
      const seq = {
        good: [[660, .09], [880, .14]],
        bad: [[220, .18, 'sawtooth']],
        pop: [[520, .06], [780, .05]],
        click: [[440, .04]],
        win: [[523, .1], [659, .1], [784, .1], [1047, .25]],
        whoosh: [[300, .08, 'triangle'], [600, .08, 'triangle']],
        fizz: [[1200, .03, 'square'], [900, .03, 'square'], [1400, .03, 'square']]
      }[kind] || [[440, .05]];
      let t = actx.currentTime;
      for (const [f, d, type] of seq) {
        const o = actx.createOscillator(), g = actx.createGain();
        o.type = type || 'sine'; o.frequency.value = f;
        g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.12, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + d);
        o.connect(g).connect(actx.destination); o.start(t); o.stop(t + d + .02); t += d * .9;
      }
    } catch (e) { /* audio not available */ }
  }

  /* ---------------- toasts / confetti / xp ---------------- */
  function toast(msg, kind) {
    const box = document.getElementById('toasts'); if (!box) return;
    const t = h('div', { class: 'toast ' + (kind || ''), html: msg });
    box.appendChild(t);
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 260); }, 1900);
  }
  function celebrate(power) {
    const cv = document.getElementById('confetti'); if (!cv) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = cv.getContext('2d'); const dpr = window.devicePixelRatio || 1;
    cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; ctx.scale(dpr, dpr);
    const colors = ['#f2704f', '#12a594', '#8b5cf6', '#e8a317', '#5b5bf0', '#ef5350'];
    const n = Math.round(90 * (power || 1));
    const ps = Array.from({ length: n }, () => ({
      x: innerWidth / 2 + (Math.random() - .5) * 120, y: innerHeight * .45,
      vx: (Math.random() - .5) * 13, vy: -Math.random() * 13 - 4, r: Math.random() * 6 + 4,
      c: colors[Math.floor(Math.random() * colors.length)], a: Math.random() * 6, va: (Math.random() - .5) * .3, shape: Math.random() < .5
    }));
    let frames = 0;
    (function tick() {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      ps.forEach(p => {
        p.vy += .35; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.a += p.va;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c;
        if (p.shape) ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); else { ctx.beginPath(); ctx.arc(0, 0, p.r / 2.4, 0, 7); ctx.fill(); }
        ctx.restore();
      });
      if (++frames < 150) requestAnimationFrame(tick); else ctx.clearRect(0, 0, innerWidth, innerHeight);
    })();
  }
  function renderStats() {
    const xv = document.getElementById('xpVal'), sv = document.getElementById('streakVal'), mb = document.getElementById('muteBtn');
    if (xv) xv.textContent = state.xp;
    if (sv) sv.textContent = state.streak.count || 0;
    if (mb) mb.textContent = state.muted ? '🔇' : '🔊';
  }
  function addXP(n, reason) {
    if (!n) return;
    state.xp += n; save(); renderStats();
    const pill = document.getElementById('xpPill');
    if (pill) { pill.classList.remove('bump'); void pill.offsetWidth; pill.classList.add('bump'); }
    toast('+' + n + ' XP' + (reason ? ' · ' + esc(reason) : ''), 'xp');
  }
  // award XP once per key (games, lessons) — prevents farming
  function reward(key, n, reason) {
    if (state.rewards[key]) return false;
    state.rewards[key] = true; save(); addXP(n, reason); return true;
  }
  const LEVELS = [
    [0, 'Lab Rookie', '實驗室新手'], [100, 'Test-tube Tamer', '試管馴獸師'], [250, 'Bunsen Boss', '本生燈大佬'],
    [450, 'Particle Pro', '粒子達人'], [700, 'Element Expert', '元素專家'], [1000, 'Equation Master', '方程式大師'],
    [1400, 'Chem Legend', '化學傳說']
  ];
  function level() {
    let i = 0; while (i + 1 < LEVELS.length && state.xp >= LEVELS[i + 1][0]) i++;
    const cur = LEVELS[i], next = LEVELS[i + 1];
    return { n: i + 1, name: cur[1], zh: cur[2], from: cur[0], to: next ? next[0] : null };
  }

  /* ---------------- small UI builders ---------------- */
  function term(en, zh) { return '<span class="term" tabindex="0" data-zh="' + esc(zh) + '">' + en + '</span>'; }
  function keybox(html, label) { return h('div', { class: 'keybox', html: '<span class="kb-label">' + (label || '📖 Key definition') + '</span>' + html }); }
  function noteCard(title, html, tag) {
    return h('section', { class: 'card note' },
      title ? h('div', { class: 'card-title' }, tag ? h('span', { class: 'card-tag', text: tag }) : null, h('h3', { html: title })) : null,
      h('div', { html: html }));
  }
  function playCard(title, sub, badge) {
    const body = h('div', { class: 'play-body' });
    const score = h('span', { class: 'play-score' });
    const card = h('section', { class: 'play' },
      h('div', { class: 'play-head' }, h('span', { class: 'badge', text: badge || '🎮 Play' }), h('h3', { html: title }), score),
      sub ? h('div', { class: 'play-sub', html: sub }) : null,
      body);
    card.body = body; card.score = score;
    return card;
  }
  function table(headers, rows) {
    return h('div', { class: 'table-wrap' }, h('table', { class: 't' },
      h('thead', h('tr', headers.map(x => h('th', { html: x })))),
      h('tbody', rows.map(r => h('tr', r.map(c => h('td', { html: c })))))));
  }
  // tap-to-reveal answer button for textbook-style blanks
  function reveal(label, answerHtml) {
    const ans = h('span', { class: 'explain good', style: { display: 'none' }, html: answerHtml });
    const b = h('button', { class: 'btn btn-sm', text: label || 'Show answer', on: { click: () => { const open = ans.style.display === 'none'; ans.style.display = open ? 'block' : 'none'; b.textContent = open ? 'Hide answer' : (label || 'Show answer'); sound('click'); } } });
    return h('div', b, ans);
  }

  /* ---------------- question engine ---------------- */
  const TYPE_LABEL = { mcq: 'Multiple choice', tf: 'True or false', fill: 'Fill in the blank', multi: 'Select all that apply', match: 'Match the pairs' };

  // Renders a single question; calls done({correct, given}) once answered.
  // opts.instant: show right/wrong + explanation immediately (practice)
  function renderQuestion(q, opts) {
    opts = opts || {};
    const wrap = h('div', { class: 'q' });
    wrap.appendChild(h('div', { class: 'q-type', text: TYPE_LABEL[q.type] || '' }));
    wrap.appendChild(h('div', { class: 'q-text', html: q.type === 'fill' ? q.q.replace(/_{3,}/g, '<u>&nbsp;&nbsp;?&nbsp;&nbsp;</u>') : q.q }));
    if (q.fig) {
      try {
        const f = typeof q.fig === 'function' ? q.fig(api) : frag(q.fig);
        wrap.appendChild(h('div', { class: 'q-figure' }, f));
      } catch (e) { console.error(e); }
    }
    const fb = h('div', { class: 'feedback' });
    const ex = h('div', { class: 'explain', style: { display: 'none' } });
    let answered = false;

    function finish(correct, given) {
      if (answered) return; answered = true;
      if (opts.instant !== false) {
        fb.className = 'feedback ' + (correct ? 'good' : 'bad');
        fb.innerHTML = correct ? pick(['✅ Correct!', '✅ Nice one!', '✅ Spot on!', '✅ You got it!']) : '❌ Not quite.';
        if (q.explain || !correct) {
          ex.style.display = 'block'; ex.className = 'explain ' + (correct ? 'good' : 'bad');
          ex.innerHTML = (correct ? '' : '<b>Answer:</b> ' + answerText(q) + '<br>') + (q.explain || '');
        }
        sound(correct ? 'good' : 'bad');
        if (!correct) wrap.classList.add('shake');
      }
      if (opts.done) opts.done({ correct, given });
    }

    if (q.type === 'mcq' || q.type === 'tf') {
      const opts2 = q.type === 'tf' ? [{ t: 'True', v: true }, { t: 'False', v: false }]
        : q.options.map((t, i) => ({ t, v: i }));
      const order = q.type === 'tf' || q.noShuffle ? opts2 : shuffle(opts2);
      const box = h('div', { class: 'q-options' + (q.type === 'tf' ? ' q-tf' : '') });
      const btns = order.map((o, idx) => {
        const b = h('button', { class: 'q-opt', type: 'button' }, h('span', { class: 'k', text: q.type === 'tf' ? (o.v ? 'T' : 'F') : 'ABCDEFG'[idx] }), h('span', { html: o.t }));
        b.addEventListener('click', () => {
          if (answered) return;
          const correct = o.v === q.answer;
          btns.forEach((x, j) => {
            x.disabled = true;
            if (opts.instant !== false) {
              if (order[j].v === q.answer) x.classList.add('right');
              else if (x === b) x.classList.add('wrong');
            } else if (x === b) x.classList.add('picked');
          });
          finish(correct, o.t);
        });
        return b;
      });
      btns.forEach(b => box.appendChild(b));
      wrap.appendChild(box);
    } else if (q.type === 'multi') {
      const order = q.noShuffle ? q.options.map((t, i) => ({ t, v: i })) : shuffle(q.options.map((t, i) => ({ t, v: i })));
      const chosen = new Set();
      const box = h('div', { class: 'q-options' });
      const btns = order.map((o, idx) => {
        const b = h('button', { class: 'q-opt', type: 'button' }, h('span', { class: 'k', text: 'ABCDEFG'[idx] }), h('span', { html: o.t }));
        b.addEventListener('click', () => { if (answered) return; chosen.has(o.v) ? chosen.delete(o.v) : chosen.add(o.v); b.classList.toggle('picked'); sound('click'); });
        return b;
      });
      btns.forEach(b => box.appendChild(b));
      const check = h('button', { class: 'btn btn-primary', text: 'Check' });
      check.addEventListener('click', () => {
        if (answered) return;
        const ans = new Set(q.answer);
        const correct = ans.size === chosen.size && [...ans].every(v => chosen.has(v));
        btns.forEach((x, j) => {
          x.disabled = true; x.classList.remove('picked');
          if (opts.instant !== false) {
            if (ans.has(order[j].v)) x.classList.add('right'); else if (chosen.has(order[j].v)) x.classList.add('wrong');
          } else if (chosen.has(order[j].v)) x.classList.add('picked');
        });
        check.disabled = true;
        finish(correct, [...chosen].map(v => q.options[v]).join(', '));
      });
      wrap.appendChild(box);
      wrap.appendChild(h('div', { class: 'q-actions' }, check));
    } else if (q.type === 'fill') {
      const inp = h('input', { class: 'input', type: 'text', placeholder: 'Type your answer…', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', 'aria-label': 'Answer' });
      const check = h('button', { class: 'btn btn-primary', text: 'Check' });
      const go = () => {
        if (answered || !inp.value.trim()) { if (!inp.value.trim()) inp.focus(); return; }
        const correct = matches(inp.value, q.answer);
        inp.disabled = true; check.disabled = true;
        if (opts.instant !== false) inp.classList.add(correct ? 'right' : 'wrong');
        finish(correct, inp.value);
      };
      check.addEventListener('click', go);
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
      wrap.appendChild(h('div', { class: 'q-fill' }, inp, check));
      if (q.hint) wrap.appendChild(h('div', { class: 'tiny', style: { marginTop: '6px' }, html: '💡 ' + q.hint }));
      setTimeout(() => { if (opts.autofocus) inp.focus(); }, 30);
    } else if (q.type === 'match') {
      let mistakes = 0;
      const m = matchWidget(q.pairs, {
        onWrong: () => { mistakes++; },
        onDone: () => finish(mistakes === 0, mistakes === 0 ? 'all matched' : mistakes + ' wrong tries'),
        quiet: opts.instant === false
      });
      wrap.appendChild(m);
    }
    wrap.appendChild(fb);
    wrap.appendChild(ex);
    return wrap;
  }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function answerText(q) {
    if (q.type === 'mcq') return q.options[q.answer];
    if (q.type === 'tf') return q.answer ? 'True' : 'False';
    if (q.type === 'fill') return esc([].concat(q.answer)[0]);
    if (q.type === 'multi') return q.answer.map(i => q.options[i]).join('; ');
    if (q.type === 'match') return q.pairs.map(p => p[0] + ' → ' + p[1]).join('; ');
    return '';
  }

  function recordResult(q, correct) {
    state.attempts++;
    if (correct) {
      state.correct++;
      if (q.id && state.mistakes[q.id]) delete state.mistakes[q.id];
    } else if (q.id) {
      state.mistakes[q.id] = (state.mistakes[q.id] || 0) + 1;
    }
    save();
  }

  /**
   * quiz(root, questions, opts)
   *  opts.mode: 'practice' (instant feedback, default) | 'exam' (feedback at the end)
   *  opts.timeLimit: seconds (optional, whole quiz)
   *  opts.xpPerCorrect: XP for first-time-correct answers (default 5, practice only)
   *  opts.onFinish(result)  result = {score, total, items:[{q, correct, given}]}
   *  opts.title, opts.accent
   */
  function quiz(root, questions, opts) {
    opts = Object.assign({ mode: 'practice', xpPerCorrect: 5 }, opts || {});
    const qs = opts.keepOrder ? questions.slice() : shuffle(questions);
    const items = [];
    let i = 0, timerId = null, remaining = opts.timeLimit || 0, finished = false;
    const box = h('div', { class: 'quiz' });
    root.appendChild(box);

    const bar = h('i', { style: { width: '0%' } });
    const count = h('span', { class: 'quiz-count' });
    const timer = opts.timeLimit ? h('span', { class: 'quiz-timer' }) : null;
    const top = h('div', { class: 'quiz-top' }, h('div', { class: 'progress' }, bar), count, timer);
    const stage = h('div', { class: 'quiz-stage' });
    box.appendChild(top); box.appendChild(stage);

    function fmt(s) { return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }
    if (opts.timeLimit) {
      timer.textContent = '⏱ ' + fmt(remaining);
      timerId = setInterval(() => {
        remaining--; timer.textContent = '⏱ ' + fmt(Math.max(0, remaining));
        if (remaining <= 30) timer.classList.add('low');
        if (remaining <= 0) { clearInterval(timerId); toast('⏰ Time is up!', 'bad'); end(); }
      }, 1000);
      onCleanup(() => clearInterval(timerId));
    }

    function show() {
      if (finished) return;
      if (i >= qs.length) return end();
      bar.style.width = (i / qs.length * 100) + '%';
      count.textContent = (i + 1) + ' / ' + qs.length;
      stage.innerHTML = '';
      const q = qs[i];
      const next = h('button', { class: 'btn btn-primary', text: i + 1 < qs.length ? 'Next →' : 'Finish', style: { display: 'none' } });
      const node = renderQuestion(q, {
        instant: opts.mode !== 'exam', autofocus: true,
        done: r => {
          items.push({ q, correct: r.correct, given: r.given });
          recordResult(q, r.correct);
          if (r.correct && opts.mode !== 'exam' && q.id && !state.solved[q.id]) { state.solved[q.id] = true; save(); if (opts.xpPerCorrect) addXP(opts.xpPerCorrect); }
          if (opts.mode === 'exam') { i++; later(show, 260); }
          else { next.style.display = ''; next.focus({ preventScroll: true }); }
        }
      });
      next.addEventListener('click', () => { i++; show(); });
      stage.appendChild(node);
      stage.appendChild(h('div', { class: 'q-actions' }, next));
    }

    function end() {
      if (finished) return; finished = true;
      if (timerId) clearInterval(timerId);
      bar.style.width = '100%';
      const score = items.filter(x => x.correct).length;
      const result = { score, total: qs.length, answered: items.length, items, qs };
      if (opts.onFinish) { box.innerHTML = ''; opts.onFinish(result, box); }
      else {
        stage.innerHTML = '';
        const pct = Math.round(score / qs.length * 100);
        stage.appendChild(h('div', { class: 'center pop-in' },
          h('div', { style: { fontSize: '44px' }, text: pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '💪' }),
          h('h3', { text: 'You scored ' + score + ' / ' + qs.length }),
          h('p', { class: 'muted', text: pct >= 80 ? 'Excellent work!' : pct >= 50 ? 'Good effort — review the ones you missed.' : 'Keep going — try again to master it!' }),
          h('button', { class: 'btn', text: '↻ Try again', on: { click: () => { root.innerHTML = ''; quiz(root, questions, opts); } } })));
        if (pct >= 80) { celebrate(.6); sound('win'); }
      }
    }
    show();
    return { end };
  }

  /* ---------------- reusable widgets ---------------- */

  /** cloze(text, opts): text uses [[answer|alt1|alt2]] for blanks.
   *  Returns element with inputs + Check / Reveal buttons. opts.onComplete(allRight) */
  function cloze(text, opts) {
    opts = opts || {};
    const wrap = h('div', { class: 'cloze-wrap' });
    const p = h('div', { class: 'cloze' });
    const blanks = [];
    const parts = String(text).split(/(\[\[[^\]]+\]\])/g);
    parts.forEach(part => {
      const m = part.match(/^\[\[([^\]]+)\]\]$/);
      if (m) {
        const answers = m[1].split('|');
        const inp = h('input', { class: 'blank', type: 'text', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', 'aria-label': 'blank' });
        inp.style.width = Math.max(90, Math.min(260, answers[0].length * 13 + 30)) + 'px';
        inp.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
        blanks.push({ inp, answers });
        p.appendChild(inp);
      } else p.appendChild(frag(part));
    });
    const fb = h('div', { class: 'feedback' });
    let rewarded = false;
    function check() {
      let right = 0;
      blanks.forEach(b => {
        const ok = matches(b.inp.value, b.answers);
        b.inp.classList.toggle('right', ok); b.inp.classList.toggle('wrong', !ok && b.inp.value.trim() !== '');
        if (ok) { right++; b.inp.readOnly = true; }
      });
      const all = right === blanks.length;
      fb.className = 'feedback ' + (all ? 'good' : 'bad');
      fb.textContent = all ? '✅ All correct — great memory!' : right + ' / ' + blanks.length + ' correct. Fix the red ones or tap “Show answers”.';
      sound(all ? 'good' : 'bad');
      if (all && !rewarded) { rewarded = true; if (opts.onComplete) opts.onComplete(true); if (opts.rewardKey) reward(opts.rewardKey, opts.xp || 10, 'Key words'); }
    }
    function showAll() {
      blanks.forEach(b => { if (!matches(b.inp.value, b.answers)) { b.inp.value = b.answers[0]; b.inp.classList.remove('wrong'); b.inp.classList.add('right'); b.inp.readOnly = true; } });
      fb.className = 'feedback'; fb.textContent = 'Answers shown — try covering them and saying them out loud!';
      sound('click');
    }
    wrap.appendChild(p);
    wrap.appendChild(h('div', { class: 'row', style: { marginTop: '10px' } },
      h('button', { class: 'btn btn-primary btn-sm', text: 'Check', on: { click: check } }),
      h('button', { class: 'btn btn-sm btn-ghost', text: 'Show answers', on: { click: showAll } })));
    wrap.appendChild(fb);
    return wrap;
  }

  /** matchWidget(pairs, opts): tap a left item, then its partner on the right.
   *  pairs: [[leftHtml, rightHtml], ...]; opts.onDone(mistakes), opts.onWrong() */
  function matchWidget(pairs, opts) {
    opts = opts || {};
    const left = pairs.map((p, i) => ({ html: p[0], i }));
    const right = shuffle(pairs.map((p, i) => ({ html: p[1], i })));
    let sel = null, matched = 0, mistakes = 0;
    const grid = h('div', { class: 'match' });
    const lc = h('div', { class: 'match-col' }), rc = h('div', { class: 'match-col' });
    const lBtns = left.map(o => { const b = h('button', { class: 'match-item', type: 'button', html: o.html }); b._i = o.i; b._side = 'L'; return b; });
    const rBtns = right.map(o => { const b = h('button', { class: 'match-item', type: 'button', html: o.html }); b._i = o.i; b._side = 'R'; return b; });
    function click(b) {
      if (b.classList.contains('matched')) return;
      if (!sel || sel._side === b._side) {
        if (sel) sel.classList.remove('selected');
        sel = b; b.classList.add('selected'); sound('click'); return;
      }
      if (sel._i === b._i) {
        sel.classList.remove('selected'); sel.classList.add('matched'); b.classList.add('matched');
        sel.disabled = true; b.disabled = true;
        matched++; sel = null; if (!opts.quiet) sound('pop');
        if (matched === pairs.length) { if (!opts.quiet) sound('good'); if (opts.onDone) opts.onDone(mistakes); }
      } else {
        mistakes++; if (opts.onWrong) opts.onWrong();
        const a = sel; a.classList.remove('selected'); sel = null;
        [a, b].forEach(x => { x.classList.add('wrong'); setTimeout(() => x.classList.remove('wrong'), 450); });
        if (!opts.quiet) sound('bad');
      }
    }
    lBtns.concat(rBtns).forEach(b => b.addEventListener('click', () => click(b)));
    lBtns.forEach(b => lc.appendChild(b)); rBtns.forEach(b => rc.appendChild(b));
    grid.appendChild(lc); grid.appendChild(rc);
    return grid;
  }

  /** sortGame(opts): items into buckets. Tap an item then a bucket (or drag on desktop).
   *  opts.buckets: [{id, title, icon?}], opts.items: [{label(html), bucket:id, explain?}]
   *  opts.onDone(mistakes), opts.rewardKey, opts.xp */
  function sortGame(opts) {
    const wrap = h('div', { class: 'sort' });
    const pool = h('div', { class: 'sort-pool' });
    const bucketsEl = h('div', { class: 'sort-buckets' });
    const fb = h('div', { class: 'feedback' });
    const ex = h('div', { class: 'explain', style: { display: 'none' } });
    let sel = null, placed = 0, mistakes = 0;
    const items = shuffle(opts.items);
    const bMap = {};
    opts.buckets.forEach(b => {
      const list = h('div', { class: 'bucket-items' });
      const el = h('div', { class: 'bucket', role: 'button', tabindex: '0' }, h('div', { class: 'bucket-title', html: (b.icon ? b.icon + ' ' : '') + b.title }), list);
      el._id = b.id; el._list = list; bMap[b.id] = el;
      el.addEventListener('click', () => drop(el));
      el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); drop(el); } });
      el.addEventListener('dragover', e => { e.preventDefault(); el.classList.add('over'); });
      el.addEventListener('dragleave', () => el.classList.remove('over'));
      el.addEventListener('drop', e => { e.preventDefault(); el.classList.remove('over'); const idx = e.dataTransfer.getData('text/plain'); const c = chips[+idx]; if (c) { select(c); drop(el); } });
      bucketsEl.appendChild(el);
    });
    const chips = items.map((it, idx) => {
      const c = h('button', { class: 'chip', type: 'button', html: it.label, draggable: 'true' });
      c._it = it;
      c.addEventListener('click', () => select(c));
      c.addEventListener('dragstart', e => { e.dataTransfer.setData('text/plain', String(idx)); select(c); });
      pool.appendChild(c);
      return c;
    });
    function select(c) {
      if (sel) sel.classList.remove('selected');
      sel = c === sel ? null : c;
      if (sel) { sel.classList.add('selected'); sound('click'); }
      Object.values(bMap).forEach(b => b.classList.toggle('ready', !!sel));
    }
    function drop(bEl) {
      if (!sel) { fb.className = 'feedback'; fb.textContent = '👆 Tap an item first, then tap a box.'; return; }
      const it = sel._it;
      if (it.bucket === bEl._id) {
        const done = h('span', { class: 'chip good pop-in', html: it.label });
        bEl._list.appendChild(done);
        sel.remove(); sel = null; placed++;
        Object.values(bMap).forEach(b => b.classList.remove('ready'));
        fb.className = 'feedback good'; fb.innerHTML = '✅ ' + (it.explain || 'Correct!');
        ex.style.display = 'none';
        sound('pop');
        if (placed === items.length) {
          fb.innerHTML = mistakes === 0 ? '🏆 Perfect sort — no mistakes!' : '🎉 All sorted! (' + mistakes + ' wrong tries)';
          sound('win'); if (mistakes === 0) celebrate(.5);
          if (opts.rewardKey) reward(opts.rewardKey, opts.xp || 15, 'Sorting game');
          if (opts.onDone) opts.onDone(mistakes);
        }
      } else {
        mistakes++;
        bEl.classList.add('shake'); setTimeout(() => bEl.classList.remove('shake'), 420);
        fb.className = 'feedback bad'; fb.innerHTML = '❌ Not that box — think again!';
        if (it.hint) { ex.style.display = 'block'; ex.className = 'explain bad'; ex.innerHTML = '💡 ' + it.hint; }
        sound('bad');
      }
    }
    wrap.appendChild(pool); wrap.appendChild(bucketsEl); wrap.appendChild(fb); wrap.appendChild(ex);
    wrap.appendChild(h('div', { style: { marginTop: '8px' } }, h('button', { class: 'btn btn-sm btn-ghost', text: '↻ Reset', on: { click: () => { const nw = sortGame(opts); wrap.replaceWith(nw); } } })));
    return wrap;
  }

  /** flashcards(cards, opts): cards [{front(html), back(html), hint?}] — tap to flip, arrows to move */
  function flashcards(cards, opts) {
    opts = opts || {};
    let i = 0, order = opts.shuffle ? shuffle(cards) : cards.slice();
    const seen = new Set();
    const front = h('div', { class: 'flash-face front' }), back = h('div', { class: 'flash-face back' });
    const card = h('div', { class: 'flash', role: 'button', tabindex: '0', 'aria-label': 'Flip card' }, front, back);
    const counter = h('span', { class: 'tiny' });
    function draw() {
      const c = order[i]; card.classList.remove('flipped');
      setTimeout(() => {
        front.innerHTML = c.front + '<div class="hint">' + (c.hint || 'Tap to flip') + '</div>';
        back.innerHTML = c.back;
      }, card.classList.contains('flipped') ? 250 : 0);
      counter.textContent = (i + 1) + ' / ' + order.length;
    }
    function flip() {
      card.classList.toggle('flipped'); sound('whoosh'); seen.add(i);
      if (seen.size === order.length && opts.rewardKey) reward(opts.rewardKey, opts.xp || 10, 'Flashcards');
    }
    card.addEventListener('click', flip);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } });
    const prev = h('button', { class: 'btn btn-sm', text: '←', 'aria-label': 'Previous', on: { click: () => { i = (i - 1 + order.length) % order.length; draw(); } } });
    const next = h('button', { class: 'btn btn-sm', text: '→', 'aria-label': 'Next', on: { click: () => { i = (i + 1) % order.length; draw(); } } });
    const shuf = h('button', { class: 'btn btn-sm btn-ghost', text: '🔀 Shuffle', on: { click: () => { order = shuffle(order); i = 0; draw(); } } });
    draw();
    return h('div', { class: 'flash-wrap' }, card, h('div', { class: 'flash-nav' }, prev, counter, next, shuf));
  }

  /* ---------------- particle diagrams ---------------- */
  // Molecule templates: arrays of atoms {x, y, r, el} relative to centre, in px for base radius r.
  const MOL = {
    atom: (el, r) => [{ x: 0, y: 0, r: r || 8, el }],
    di: (a, b, r) => { r = r || 8; return [{ x: -r * .78, y: 0, r, el: a }, { x: r * .78, y: 0, r, el: b || a }]; },
    // A–B–A linear (e.g. CO2): centre atom b
    linear: (b, a, r) => { r = r || 8; return [{ x: -r * 1.55, y: 0, r: r * .9, el: a }, { x: 0, y: 0, r, el: b }, { x: r * 1.55, y: 0, r: r * .9, el: a }]; },
    // bent with big centre + 2 small (e.g. H2O: bent('O','H'))
    bent: (c, s, r) => { r = r || 8; return [{ x: -r * .95, y: r * .62, r: r * .62, el: s }, { x: r * .95, y: r * .62, r: r * .62, el: s }, { x: 0, y: -r * .1, r, el: c }]; },
    // three equal atoms bent (O3)
    tri: (a, r) => { r = r || 7; return [{ x: -r * 1.35, y: r * .55, r, el: a }, { x: r * 1.35, y: r * .55, r, el: a }, { x: 0, y: -r * .45, r, el: a }]; },
    // tetrahedral cluster of 4 (P4)
    p4: (a, r) => { r = r || 7; return [{ x: -r * .8, y: r * .55, r, el: a }, { x: r * .8, y: r * .55, r, el: a }, { x: 0, y: -r * .75, r, el: a }, { x: 0, y: r * .15, r: r * .95, el: a }]; },
    // custom: list of [x, y, r, el]
    custom: (list) => list.map(([x, y, r, el]) => ({ x, y, r, el }))
  };
  function molExtent(m) { return Math.max(...m.map(a => Math.hypot(a.x, a.y) + a.r)); }

  /**
   * particleBox(spec) -> <svg>
   *  spec.w, spec.h (viewBox size; default 160x120)
   *  spec.groups: [{mol: MOL.di('O'), n: 4}, ...]   (or spec.mols: [mol, mol, ...])
   *  spec.layout: 'gas' (default, spread out) | 'liquid' (close, irregular) | 'solid' (regular lattice)
   *  spec.lattice: for solid — array of element symbols to fill row by row (e.g. alternating ['Fe','S'])
   *  spec.seed: number for deterministic layout
   *  spec.motion: 'jiggle' | 'bounce' | false
   *  spec.label: caption under the box (returns wrapper div if given)
   */
  function particleBox(spec) {
    spec = spec || {};
    const W = spec.w || 160, H = spec.h || 120;
    const svg = h('svg', { class: 'pbox', viewBox: '0 0 ' + W + ' ' + H, width: spec.width || W, height: spec.height || H, role: 'img', 'aria-label': spec.aria || spec.label || 'particle diagram' });
    const R = rng(spec.seed || 7);
    let mols = [];
    if (spec.layout === 'solid' && spec.lattice) {
      const r = spec.r || 9; const step = r * 2.05;
      const cols = Math.floor((W - 6) / step), rows = Math.floor((H - 6) / step);
      const ox = (W - cols * step) / 2 + r, oy = (H - rows * step) / 2 + r;
      let k = 0;
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
        const el = spec.lattice[k++ % spec.lattice.length];
        mols.push({ atoms: [{ x: 0, y: 0, r, el }], cx: ox + x * step, cy: oy + y * step, ext: r });
      }
    } else {
      const list = spec.mols ? spec.mols.slice() : [];
      (spec.groups || []).forEach(g => { for (let k = 0; k < (g.n || 1); k++) list.push(g.mol); });
      const ordered = spec.keepOrder ? list : shuffleSeeded(list, R);
      const placed = [];
      const pad = spec.layout === 'liquid' ? 0.5 : 5;
      ordered.forEach(m => {
        const ext = molExtent(m);
        let best = null;
        for (let t = 0; t < 400; t++) {
          const cx = ext + 3 + R() * (W - 2 * ext - 6), cy = ext + 3 + R() * (H - 2 * ext - 6);
          let ok = true;
          for (const p of placed) { if (Math.hypot(p.cx - cx, p.cy - cy) < p.ext + ext + pad) { ok = false; break; } }
          if (ok) { best = { cx, cy }; break; }
        }
        if (!best) best = { cx: ext + R() * (W - 2 * ext), cy: ext + R() * (H - 2 * ext) };
        const rot = spec.noRotate ? 0 : R() * Math.PI * 2;
        const atoms = m.map(a => ({ ...a, x: a.x * Math.cos(rot) - a.y * Math.sin(rot), y: a.x * Math.sin(rot) + a.y * Math.cos(rot) }));
        const rec = { atoms, cx: best.cx, cy: best.cy, ext };
        placed.push(rec); mols.push(rec);
      });
    }
    const gEls = mols.map(m => {
      const g = h('g', { transform: 'translate(' + m.cx.toFixed(1) + ',' + m.cy.toFixed(1) + ')' });
      m.atoms.slice().sort((a, b) => a.y - b.y).forEach(a => {
        g.appendChild(h('circle', { class: 'atom', cx: a.x.toFixed(2), cy: a.y.toFixed(2), r: a.r, fill: atomColor(a.el) }));
      });
      svg.appendChild(g); m.g = g; return g;
    });
    if (spec.motion === 'jiggle' || spec.motion === 'bounce') {
      const amp = spec.motion === 'bounce' ? 0 : (spec.amp || 1.2);
      mols.forEach(m => { m.vx = (R() - .5) * (spec.speed || 60); m.vy = (R() - .5) * (spec.speed || 60); m.ox = m.cx; m.oy = m.cy; m.ph = R() * 6.28; });
      const stop = loop((dt, now) => {
        if (!svg.isConnected) return false;
        mols.forEach(m => {
          if (spec.motion === 'bounce') {
            m.cx += m.vx * dt; m.cy += m.vy * dt;
            if (m.cx < m.ext + 2 || m.cx > W - m.ext - 2) { m.vx *= -1; m.cx = Math.max(m.ext + 2, Math.min(W - m.ext - 2, m.cx)); }
            if (m.cy < m.ext + 2 || m.cy > H - m.ext - 2) { m.vy *= -1; m.cy = Math.max(m.ext + 2, Math.min(H - m.ext - 2, m.cy)); }
            m.g.setAttribute('transform', 'translate(' + m.cx.toFixed(1) + ',' + m.cy.toFixed(1) + ')');
          } else {
            const t = now / 1000 * (spec.freq || 9) + m.ph;
            m.g.setAttribute('transform', 'translate(' + (m.ox + Math.sin(t) * amp).toFixed(1) + ',' + (m.oy + Math.cos(t * 1.3) * amp).toFixed(1) + ')');
          }
        });
      });
      svg._stop = stop;
    }
    if (spec.label) return h('div', { class: 'pbox-fig' }, svg, h('div', { class: 'pbox-label', html: spec.label }));
    return svg;
  }
  function shuffleSeeded(a, R) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function atomColor(el) {
    if (!el) return 'var(--atom-X)';
    if (el[0] === '#' || el.startsWith('var(')) return el;
    return 'var(--atom-' + el + ', var(--atom-X))';
  }

  /* ---------------- registry ---------------- */
  // registerChapter(ch) — if a chapter with the same id exists, lessons/questions/glossary are appended
  // (lets one chapter be split across several files, e.g. ch2.js + ch2b.js).
  function registerChapter(ch) {
    const prev = chapterById[ch.id];
    const base = prev ? prev.questions.length : 0;
    const qs = (ch.questions || []).map((q, i) => Object.assign({ id: ch.id + (ch.part ? '-' + ch.part : '') + '-q' + (base + i + 1), chapter: ch.id }, q));
    if (prev) {
      prev.lessons.push(...(ch.lessons || []));
      prev.questions.push(...qs);
      prev.glossary.push(...(ch.glossary || []));
      return prev;
    }
    ch.lessons = ch.lessons || [];
    ch.questions = qs;
    ch.glossary = ch.glossary || [];
    chapters.push(ch); chapterById[ch.id] = ch;
    chapters.sort((a, b) => a.num - b.num);
    return ch;
  }
  // quickCheck(root, chapterId, lessonId, n): end-of-lesson practice quiz drawn from the chapter bank
  function quickCheck(root, chapterId, lessonId, n) {
    const ch = chapterById[chapterId]; if (!ch) return;
    const pool = ch.questions.filter(q => q.lesson === lessonId);
    if (!pool.length) return;
    const card = h('section', { class: 'card' },
      h('div', { class: 'card-title' }, h('span', { class: 'card-tag', text: '✅ Quick check' }), h('h3', { text: 'Did it stick?' })));
    root.appendChild(card);
    quiz(card, sample(pool, Math.min(n || 5, pool.length)), { mode: 'practice' });
    return card;
  }
  function allQuestions() { return chapters.flatMap(c => c.questions); }
  function questionById(id) { return allQuestions().find(q => q.id === id); }
  function chapterProgress(ch) {
    const n = ch.lessons.length; if (!n) return 0;
    return ch.lessons.filter(l => state.done[l.id]).length / n;
  }
  function markDone(lessonId) {
    if (state.done[lessonId]) return false;
    state.done[lessonId] = true; save(); addXP(20, 'Lesson complete'); return true;
  }

  /* ---------------- public api ---------------- */
  const api = {
    h, frag, esc, shuffle, sample, rng, norm, matches, chem, pick,
    get state() { return state; }, save, load, touchStreak, renderStats,
    addXP, reward, level, LEVELS, toast, celebrate, sound,
    term, keybox, noteCard, playCard, table, reveal,
    renderQuestion, quiz, cloze, matchWidget, sortGame, flashcards,
    MOL, particleBox, atomColor,
    onCleanup, runCleanups, later, every, loop,
    registerChapter, quickCheck, chapters, chapterById, allQuestions, questionById, chapterProgress, markDone,
    setMuted(m) { state.muted = !!m; save(); renderStats(); }
  };
  window.ChemApp = api;
})();
