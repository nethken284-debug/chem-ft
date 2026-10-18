/* ==========================================================
   Chem FT — app shell: router, home, chapter & glossary views
   ========================================================== */
(function () {
  'use strict';
  const A = window.ChemApp;
  const { h } = A;
  const view = document.getElementById('view');

  const ACCENTS = { c0: ['var(--c0)', 'var(--c0-soft)'], c1: ['var(--c1)', 'var(--c1-soft)'], c2: ['var(--c2)', 'var(--c2-soft)'], cx: ['var(--cx)', 'var(--cx-soft)'] };
  function setAccent(el, key) {
    const a = ACCENTS[key] || ['var(--brand)', 'var(--brand-soft)'];
    el.style.setProperty('--accent', a[0]); el.style.setProperty('--accent-soft', a[1]);
  }

  /* ---------- navigation ---------- */
  function buildNav() {
    const items = [{ href: '#/', label: 'Home', ico: '🏠', key: 'home' }]
      .concat(A.chapters.map(c => ({ href: '#/ch/' + c.id, label: 'Ch ' + c.num, ico: c.icon, key: c.id })))
      .concat([{ href: '#/exam', label: 'Exam', ico: '📝', key: 'exam' }]);
    const top = document.getElementById('topnav'), bottom = document.getElementById('bottomnav');
    top.innerHTML = ''; bottom.innerHTML = '';
    items.forEach(it => {
      top.appendChild(h('a', { href: it.href, 'data-key': it.key, text: it.label }));
      bottom.appendChild(h('a', { href: it.href, 'data-key': it.key }, h('span', { class: 'bn-ico', text: it.ico }), h('span', { text: it.label })));
    });
  }
  function setActiveNav(key) {
    document.querySelectorAll('#topnav a, #bottomnav a').forEach(a => a.classList.toggle('active', a.dataset.key === key));
  }

  /* ---------- router ---------- */
  function parse() {
    const raw = (location.hash || '#/').slice(1);
    const [path, qs] = raw.split('?');
    const parts = path.split('/').filter(Boolean);
    const params = {}; (qs || '').split('&').filter(Boolean).forEach(kv => { const [k, v] = kv.split('='); params[k] = decodeURIComponent(v || ''); });
    return { parts, params };
  }
  function render() {
    A.runCleanups();
    const { parts, params } = parse();
    view.innerHTML = ''; view.classList.remove('fade-in'); void view.offsetWidth; view.classList.add('fade-in');
    view.style.removeProperty('--accent'); view.style.removeProperty('--accent-soft');
    try {
      if (parts[0] === 'ch' && A.chapterById[parts[1]]) { renderChapter(A.chapterById[parts[1]], parts[2]); setActiveNav(parts[1]); }
      else if (parts[0] === 'exam') { setAccent(view, 'cx'); window.ChemExam.render(view, parts[1], params); setActiveNav('exam'); }
      else if (parts[0] === 'terms') { renderGlossary(); setActiveNav('home'); }
      else { renderHome(); setActiveNav('home'); }
    } catch (e) {
      console.error(e);
      view.appendChild(h('div', { class: 'card' }, h('h3', { text: 'Oops — something went wrong.' }), h('p', { class: 'muted', text: String(e && e.message || e) }), h('a', { class: 'btn', href: '#/', text: 'Back home' })));
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  /* ---------- home ---------- */
  function ring(pct) {
    const r = 22, c = 2 * Math.PI * r;
    return h('svg', { class: 'ring', viewBox: '0 0 54 54' },
      h('circle', { class: 'bgc', cx: 27, cy: 27, r }),
      h('circle', { class: 'fgc', cx: 27, cy: 27, r, 'stroke-dasharray': c.toFixed(1), 'stroke-dashoffset': (c * (1 - pct)).toFixed(1) }),
      h('text', { x: 27, y: 27, text: Math.round(pct * 100) + '%' }));
  }
  function greeting() {
    const hr = new Date().getHours();
    return hr < 12 ? 'Good morning' : hr < 18 ? 'Good afternoon' : 'Good evening';
  }
  function renderHome() {
    const st = A.state, lv = A.level();
    const totalLessons = A.chapters.reduce((n, c) => n + c.lessons.length, 0);
    const doneLessons = A.chapters.reduce((n, c) => n + c.lessons.filter(l => st.done[l.id]).length, 0);
    const acc = st.attempts ? Math.round(st.correct / st.attempts * 100) + '%' : '—';
    const lvPct = lv.to ? (st.xp - lv.from) / (lv.to - lv.from) : 1;

    const wrap = h('div', { class: 'stack-lg' });
    wrap.appendChild(h('section', { class: 'hero' },
      h('h1', { html: greeting() + '! <span class="wave">👋</span>' }),
      h('p', { class: 'muted', style: { fontSize: '18px', maxWidth: '560px' }, html: 'F.3 Chemistry, Chapter 0 to 2. Each lesson is short, has a game to play, and ends with a quick check. When you\'re ready, go to the <b>Exam Zone</b>.' })));

    // level card
    const lvCard = h('section', { class: 'card', style: { display: 'flex', gap: '18px', alignItems: 'center', flexWrap: 'wrap' } },
      h('div', { style: { fontSize: '42px' }, class: 'float', text: ['🧪', '🧫', '🔥', '⚛️', '💎', '⚖️', '👑'][lv.n - 1] || '🧪' }),
      h('div', { style: { flex: '1', minWidth: '200px' } },
        h('div', { class: 'tiny', style: { fontWeight: 800, letterSpacing: '.06em', textTransform: 'uppercase' }, text: 'Level ' + lv.n }),
        h('h3', { style: { margin: '0' }, html: lv.name + ' <span class="zh muted" style="font-weight:500;font-size:15px">' + lv.zh + '</span>' }),
        h('div', { class: 'progress', style: { '--accent': 'var(--cx)' } }, h('i', { style: { width: Math.round(lvPct * 100) + '%' } })),
        h('div', { class: 'tiny', style: { marginTop: '4px' }, text: lv.to ? (lv.to - st.xp) + ' XP to next level' : 'Max level — legend!' })),
      h('div', { class: 'stat-row', style: { flex: '1 1 260px' } },
        h('div', { class: 'stat' }, h('b', { text: doneLessons + '/' + totalLessons }), h('span', { text: 'Lessons' })),
        h('div', { class: 'stat' }, h('b', { text: acc }), h('span', { text: 'Accuracy' })),
        h('div', { class: 'stat' }, h('b', { text: '🔥 ' + (st.streak.count || 0) }), h('span', { text: 'Day streak' }))));
    wrap.appendChild(lvCard);

    // chapters
    const chs = h('section', { class: 'stack' }, h('h2', { text: 'Learn' }));
    A.chapters.forEach(c => {
      const pct = A.chapterProgress(c);
      const resume = A.state.lastLesson[c.id];
      const a = h('a', { class: 'card chapter-card', href: '#/ch/' + c.id + (resume ? '/' + resume : '') },
        h('div', { class: 'cc-num', text: c.icon }),
        h('div', { class: 'cc-body' },
          h('div', { class: 'cc-kicker', text: 'Chapter ' + c.num + ' · ' + c.lessons.length + ' lessons' }),
          h('h3', { html: c.title + ' <span class="zh muted" style="font-weight:500;font-size:15px">' + c.zh + '</span>' }),
          h('div', { class: 'muted', style: { fontSize: '15px' }, text: c.intro || '' })),
        ring(pct));
      setAccent(a, c.accent);
      chs.appendChild(a);
    });
    wrap.appendChild(chs);

    // quick actions
    const mistakes = Object.keys(A.state.mistakes).filter(id => A.questionById(id)).length;
    const qa = h('section', { class: 'grid grid-3' },
      quick('#/exam/daily', '⚡', 'Daily 5', '5 random questions. Takes about 2 minutes.', 'cx'),
      quick('#/exam', '📝', 'Exam Zone', 'Chapter tests, a mock exam and a speed run.', 'cx'),
      quick(mistakes ? '#/exam/mistakes' : '#/terms', mistakes ? '🩹' : '📚', mistakes ? 'Fix mistakes (' + mistakes + ')' : 'Key terms', mistakes ? 'Retry the questions you got wrong.' : 'Every key term, with Chinese.', mistakes ? 'c0' : 'c1'));
    wrap.appendChild(qa);
    if (mistakes) wrap.appendChild(h('div', { class: 'center' }, h('a', { href: '#/terms', class: 'btn btn-ghost', text: '📚 Key terms glossary' })));
    view.appendChild(wrap);
  }
  function quick(href, ico, title, sub, acc) {
    const a = h('a', { class: 'card mode-card', href, style: { textDecoration: 'none', color: 'inherit' } },
      h('div', { class: 'mc-ico', text: ico }), h('h3', { text: title }), h('div', { class: 'muted', style: { fontSize: '15px' }, text: sub }));
    setAccent(a, acc);
    return a;
  }

  /* ---------- chapter ---------- */
  function renderChapter(ch, lessonId) {
    setAccent(view, ch.accent);
    const idx = Math.max(0, ch.lessons.findIndex(l => l.id === lessonId));
    const lesson = ch.lessons[idx];
    if (!lesson) { view.appendChild(h('div', { class: 'empty', text: 'Lessons coming soon.' })); return; }
    A.state.lastLesson[ch.id] = lesson.id; A.save();

    view.appendChild(h('div', { class: 'ch-head' },
      h('div', { class: 'ch-icon', text: ch.icon }),
      h('div', null,
        h('div', { class: 'tiny', style: { fontWeight: 800, letterSpacing: '.06em', textTransform: 'uppercase' }, text: 'Chapter ' + ch.num }),
        h('h1', { html: ch.title + ' <span class="zh">' + ch.zh + '</span>' }))));

    const tabs = h('nav', { class: 'lesson-tabs', 'aria-label': 'Lessons' });
    ch.lessons.forEach((l, i) => {
      const t = h('a', { class: 'lesson-tab' + (i === idx ? ' active' : '') + (A.state.done[l.id] ? ' done' : ''), href: '#/ch/' + ch.id + '/' + l.id },
        h('span', { class: 'lt-n', text: A.state.done[l.id] && i !== idx ? '✓' : String(i + 1) }), h('span', { text: l.short || l.title }));
      tabs.appendChild(t);
    });
    view.appendChild(tabs);
    setTimeout(() => { const act = tabs.querySelector('.active'); if (act) tabs.scrollLeft = act.offsetLeft - 20; }, 0);

    view.appendChild(h('div', { class: 'lesson-title' },
      h('div', { class: 'kicker', text: (lesson.num || (ch.num + '.' + (idx + 1))) + (lesson.kicker ? ' · ' + lesson.kicker : '') }),
      h('h2', { html: lesson.title + (lesson.zh ? '<span class="zh">' + lesson.zh + '</span>' : '') })));

    const body = h('div', { class: 'lesson-body' });
    view.appendChild(body);
    try {
      const cleanup = lesson.render(body, A);
      if (typeof cleanup === 'function') A.onCleanup(cleanup);
    } catch (e) {
      console.error(e);
      body.appendChild(h('div', { class: 'card' }, h('b', { text: 'This lesson failed to load: ' }), String(e.message || e)));
    }

    const prev = ch.lessons[idx - 1], next = ch.lessons[idx + 1];
    const nextChapter = A.chapters[A.chapters.indexOf(ch) + 1];
    const foot = h('div', { class: 'lesson-foot' });
    if (prev) foot.appendChild(h('a', { class: 'btn', href: '#/ch/' + ch.id + '/' + prev.id, text: '← Back' }));
    const nextHref = next ? '#/ch/' + ch.id + '/' + next.id : '#/exam/' + ch.id;
    const nextBtn = h('a', { class: 'btn btn-primary', href: nextHref, text: next ? 'Done, next lesson →' : '🏁 Done! Take the Chapter ' + ch.num + ' test' });
    nextBtn.addEventListener('click', () => {
      if (A.markDone(lesson.id)) A.sound('good');
      if (!next && A.chapterProgress(ch) === 1) A.reward('chapter-' + ch.id, 50, 'Chapter finished');
    });
    foot.appendChild(nextBtn);
    view.appendChild(foot);
    if (!next && nextChapter) view.appendChild(h('div', { class: 'center', style: { marginTop: '14px' } }, h('a', { class: 'btn btn-ghost', href: '#/ch/' + nextChapter.id, text: 'or go to Chapter ' + nextChapter.num + ' →' })));
  }

  /* ---------- glossary ---------- */
  function renderGlossary() {
    setAccent(view, 'c1');
    view.appendChild(h('div', { class: 'lesson-title' }, h('div', { class: 'kicker', text: 'Revision' }), h('h2', { html: 'Key terms <span class="zh">重要詞彙</span>' })));
    const input = h('input', { class: 'input', type: 'search', placeholder: '🔍 Search a term…', style: { width: '100%', marginBottom: '16px' } });
    view.appendChild(input);
    const list = h('div', { class: 'stack' });
    view.appendChild(list);
    function draw() {
      const qv = A.norm(input.value);
      list.innerHTML = '';
      A.chapters.forEach(c => {
        const items = c.glossary.filter(g => !qv || A.norm(g.en + ' ' + g.zh + ' ' + g.def).includes(qv));
        if (!items.length) return;
        const card = h('section', { class: 'card' }, h('div', { class: 'card-title' }, h('span', { class: 'card-tag', text: 'Ch ' + c.num }), h('h3', { text: c.title })));
        setAccent(card, c.accent);
        items.forEach(g => card.appendChild(h('div', { style: { padding: '10px 0', borderTop: '1px solid var(--line)' } },
          h('div', { html: '<b>' + g.en + '</b> <span class="zh muted">' + g.zh + '</span>' }),
          h('div', { class: 'muted', style: { fontSize: '15px' }, html: g.def }))));
        list.appendChild(card);
      });
      if (!list.children.length) list.appendChild(h('div', { class: 'empty', text: 'No matching terms.' }));
    }
    input.addEventListener('input', draw);
    draw();
  }

  /* ---------- boot ---------- */
  function boot() {
    A.touchStreak();
    A.renderStats();
    buildNav();
    document.getElementById('muteBtn').addEventListener('click', () => { A.setMuted(!A.state.muted); if (!A.state.muted) A.sound('pop'); });
    // tap-to-show chinese on touch devices
    document.addEventListener('click', e => {
      const t = e.target.closest && e.target.closest('.term');
      document.querySelectorAll('.term.show').forEach(x => { if (x !== t) x.classList.remove('show'); });
      if (t) t.classList.toggle('show');
    });
    window.addEventListener('hashchange', render);
    render();
  }
  boot();
})();
