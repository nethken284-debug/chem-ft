/* ==========================================================
   Chem FT — Chapter 0 · Introduction to Chemistry 化學入門
   Source: school notes (chem1.pdf pp.1–7)
   Lessons: ch0-1 What is Chemistry? · ch0-2 Lab Rules ·
            ch0-3 Safety Precautions · ch0-4 Observations ·
            ch0-5 Experiment 0.1 (virtual lab)
   ========================================================== */
(function () {
  'use strict';
  const A = window.ChemApp;
  const { h } = A;
  const T = A.term;

  /* =========================================================
     1. Chapter styles (all classes prefixed .c0-)
     ========================================================= */
  const DARK_TOKENS = '--c0-glass:rgba(150,185,215,.16);--c0-glass-ln:#9fb4c8;--c0-coat:#dfe3ea;--c0-coat-ln:#7f8896;--c0-top:#646d80;--c0-cab:#6f5d49;--c0-cab-ln:#544638;--c0-metal:#8d96a2;--c0-metal-2:#646d79;--c0-paper:#e6e9ee;--c0-eye:#14161c;';
  const CSS = `
:root{--c0-glass:rgba(206,228,243,.45);--c0-glass-ln:#8fb3cf;--c0-skin:#f2c7a2;--c0-skin-ln:#b9805a;--c0-coat:#ffffff;--c0-coat-ln:#aab3bf;--c0-top:#4a5263;--c0-cab:#dcc5a5;--c0-cab-ln:#b39673;--c0-metal:#b3bac3;--c0-metal-2:#7d8692;--c0-paper:#ffffff;--c0-eye:#262a33}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){${DARK_TOKENS}}}
:root[data-theme="dark"]{${DARK_TOKENS}}
.c0-svg{display:block;width:100%;height:auto;-webkit-user-select:none;user-select:none;touch-action:manipulation}
.c0-stage{background:var(--surface-2);border:1px solid var(--line);border-radius:var(--radius-sm);overflow:hidden;position:relative}
.c0-out{fill:none;stroke:var(--ink);stroke-width:2.2;stroke-linejoin:round;stroke-linecap:round}
.c0-thin{fill:none;stroke:var(--ink);stroke-width:1.4;stroke-linejoin:round;stroke-linecap:round}
.c0-glassfill{fill:var(--c0-glass)}
.c0-shine{fill:none;stroke:#fff;stroke-opacity:.65;stroke-width:2.4;stroke-linecap:round}
.c0-mark{stroke:var(--ink);stroke-width:1.2;opacity:.45}
.c0-wall{fill:var(--surface-2)}
.c0-floor{fill:var(--bg-soft)}
.c0-top{fill:var(--c0-top)}
.c0-cab{fill:var(--c0-cab);stroke:var(--c0-cab-ln);stroke-width:1.5}
.c0-cabln{fill:none;stroke:var(--c0-cab-ln);stroke-width:1.5}
.c0-metal{fill:var(--c0-metal);stroke:var(--ink);stroke-width:1.5;stroke-linejoin:round}
.c0-metal2{fill:var(--c0-metal-2);stroke:var(--ink);stroke-width:1.5;stroke-linejoin:round}
.c0-hose{fill:none;stroke:#e08a2e;stroke-width:4;stroke-linecap:round}
.c0-wood{fill:#d9a86c;stroke:#9c6f3c;stroke-width:1.2}
.c0-rod{fill:none;stroke:var(--c0-glass-ln);stroke-width:3.2;stroke-linecap:round}
.c0-paper{fill:var(--c0-paper);stroke:var(--ink);stroke-width:1.3;stroke-linejoin:round}
.c0-coat{fill:var(--c0-coat);stroke:var(--c0-coat-ln);stroke-width:1.6;stroke-linejoin:round}
.c0-coatln{fill:none;stroke:var(--c0-coat-ln);stroke-width:1.6;stroke-linejoin:round}
.c0-arm-o{fill:none;stroke:var(--c0-coat-ln);stroke-width:10;stroke-linecap:round}
.c0-arm{fill:none;stroke:var(--c0-coat);stroke-width:7;stroke-linecap:round}
.c0-skin{fill:var(--c0-skin);stroke:var(--c0-skin-ln);stroke-width:1.4}
.c0-glove{fill:#7d6cf0;stroke:#4a3cb6;stroke-width:1.4}
.c0-goggle{fill:#bfe3ff;fill-opacity:.75;stroke:var(--ink);stroke-width:1.6}
.c0-eye{fill:var(--c0-eye)}
.c0-mouth{fill:none;stroke:#8a3b2e;stroke-width:1.6;stroke-linecap:round}
.c0-leg{fill:none;stroke:#3e4c6d;stroke-width:9;stroke-linecap:round}
.c0-shoe{fill:#2b2f38}
.c0-bub{fill:#fff;fill-opacity:.55;stroke:var(--ink);stroke-opacity:.55;stroke-width:.9}
.c0-wisp{fill:none;stroke:var(--ink-2);stroke-width:2.2;stroke-linecap:round;opacity:.75}
.c0-t{font-family:var(--font);font-weight:800;fill:var(--ink)}
.c0-tc{text-anchor:middle}
.c0-tw{fill:#fff}
.c0-tdark{fill:#222}
.c0-flicker{animation:c0-flick .16s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:50% 100%}
@keyframes c0-flick{from{transform:scale(1,1)}to{transform:scale(.93,1.08)}}
.c0-spin{animation:c0-spin 1.2s linear infinite;transform-box:fill-box;transform-origin:50% 50%}
@keyframes c0-spin{to{transform:rotate(360deg)}}
.c0-hit{fill:transparent;cursor:pointer;outline:none}
.c0-hit:focus-visible{stroke:var(--brand);stroke-width:3;stroke-dasharray:6 4}
.c0-ring{fill:none;stroke-width:3.2}
.c0-ring.bad{stroke:var(--bad)} .c0-ring.good{stroke:var(--good)}
.c0-hint{fill:none;stroke:var(--cx);stroke-width:3.5;stroke-dasharray:7 5;animation:c0-blink .5s ease-in-out 6 alternate}
@keyframes c0-blink{to{opacity:.15}}
.c0-sel{fill:none;stroke:var(--accent);stroke-width:3.5;stroke-dasharray:8 5}
.c0-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.c0-mt{margin-top:14px}
.c0-center{display:flex;justify-content:center}
.c0-info{margin-top:12px;padding:12px 14px;border-radius:var(--radius-sm);background:var(--bg-soft);font-size:15px;color:var(--ink-2);min-height:48px}
.c0-info b{color:var(--ink)}
.c0-info.good{background:var(--good-soft)} .c0-info.bad{background:var(--bad-soft)}
.c0-quote{font-style:italic;font-weight:800;text-align:center;font-size:18px;padding:16px;border-radius:var(--radius-sm);background:var(--accent-soft);color:var(--ink)}
.c0-obj{margin:0;padding-left:1.3em}
.c0-icons{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px;margin-top:14px}
.c0-icon{display:flex;flex-direction:column;align-items:center;gap:4px;text-align:center;font-size:12px;font-weight:800;color:var(--ink-2);line-height:1.2}
.c0-icon span:first-child{width:46px;height:46px;border-radius:50%;display:grid;place-items:center;font-size:22px;background:var(--accent-soft)}
.c0-tiles{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px}
@media (max-width:560px){.c0-tiles{grid-template-columns:repeat(3,minmax(0,1fr))}}
.c0-tile{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;padding:10px 4px;border-radius:var(--radius-sm);border:1.5px solid var(--line-2);background:var(--surface);cursor:pointer;font-weight:800;font-size:13px;line-height:1.2;min-height:44px;transition:transform .12s,border-color .15s,background .15s;-webkit-tap-highlight-color:transparent}
.c0-tile:hover{border-color:var(--accent)}
.c0-tile:active{transform:scale(.96)}
.c0-tile.on{border-color:var(--accent);background:var(--accent-soft)}
.c0-tile.right{border-color:var(--good);background:var(--good-soft)}
.c0-tile.wrong{border-color:var(--bad);background:var(--bad-soft)}
.c0-tile svg{width:44px;height:44px}
.c0-clue{font-size:19px;font-weight:800;text-align:center;padding:20px 12px;border-radius:var(--radius-sm);background:var(--bg-soft);margin-bottom:14px;min-height:70px;line-height:1.4}
.c0-bar{display:flex;align-items:center;gap:10px;margin-bottom:12px;font-weight:800;font-size:14px;color:var(--ink-2)}
.c0-bar .progress{flex:1;margin:0}
.c0-pill:empty{display:none}
.c0-note .card-title{flex-wrap:wrap;row-gap:6px}
.c0-note .card-tag{white-space:nowrap}
.c0-sort5 .sort-buckets{grid-template-columns:repeat(auto-fit,minmax(96px,1fr))}
.c0-sort5 .bucket{min-height:86px}
@media (max-width:560px){.c0-tl{display:none}}
.c0-w-sm{max-width:420px;margin-left:auto;margin-right:auto}
.c0-w-md{max-width:560px;margin-left:auto;margin-right:auto}
.c0-pill{display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:999px;background:var(--bg-soft);font-weight:800;font-size:13px;color:var(--ink-2);white-space:nowrap}
.c0-card{border:1.5px solid var(--line-2);border-radius:var(--radius);padding:22px 18px;background:var(--surface);text-align:center;transition:transform .3s ease,opacity .3s ease;min-height:150px;display:flex;flex-direction:column;justify-content:center;gap:10px}
.c0-card .c0-emo{font-size:40px;line-height:1}
.c0-card .c0-txt{font-size:18px;font-weight:700;line-height:1.4}
.c0-card.out{opacity:0;transform:translateY(-14px) scale(.97)}
.c0-dots{display:flex;gap:5px;justify-content:center;flex-wrap:wrap;margin-top:12px}
.c0-dots i{width:9px;height:9px;border-radius:50%;background:var(--line-2)}
.c0-dots i.ok{background:var(--good)} .c0-dots i.no{background:var(--bad)} .c0-dots i.cur{background:var(--accent);transform:scale(1.3)}
.c0-2btn{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px}
.c0-2col{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:18px;align-items:start}
@media (max-width:720px){.c0-2col{grid-template-columns:1fr}}
.c0-tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}
.c0-tabs .chip.on{background:var(--accent);color:#fff;border-color:transparent}
.c0-tabs .chip.c0-ok:not(.on){border-color:var(--good);color:var(--good)}
.c0-b.btn-sm{min-height:40px}
.c0-line{display:flex;flex-wrap:wrap;gap:8px;align-items:center;min-height:66px;padding:12px;margin:12px 0;border:2px dashed var(--line-2);border-radius:var(--radius-sm);background:var(--surface)}
.c0-line .chip{background:var(--accent-soft);border-color:var(--accent);color:var(--ink)}
.c0-pool{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;min-height:44px}
.c0-steps{list-style:none;margin:0;padding:0;display:grid;gap:6px}
.c0-steps li{display:flex;gap:10px;align-items:flex-start;padding:8px 10px;border-radius:10px;font-size:15px;color:var(--ink-3);line-height:1.45}
.c0-steps li.cur{background:var(--accent-soft);color:var(--ink);font-weight:700}
.c0-steps li.done{color:var(--ink-2)}
.c0-steps .n{flex:none;min-width:26px;height:26px;border-radius:13px;display:grid;place-items:center;background:var(--bg-soft);font-weight:900;font-size:12px;padding:0 4px}
.c0-steps li.cur .n{background:var(--accent);color:#fff}
.c0-steps li.done .n{background:var(--good);color:#fff}
.c0-act{margin-top:12px;display:grid;gap:10px}
.c0-act .q-opt{font-size:15px}
.c0-ask{font-weight:800;font-size:16px}
.c0-sense{display:inline-block;font-size:11px;font-weight:900;letter-spacing:.06em;text-transform:uppercase;color:var(--accent);margin-bottom:2px}
.c0-senses{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px}
.c0-senses .c0-tile span:first-child{font-size:26px}
.c0-chips{display:flex;flex-wrap:wrap;gap:6px}
.c0-sec{min-width:40px;justify-content:center;padding:6px 10px;font-size:14px}
.c0-sec.hot{border-color:var(--accent);box-shadow:inset 0 0 0 2px var(--accent)}
.c0-sec.on{background:var(--accent);color:#fff;border-color:transparent}
.c0-lane{padding:12px;border-radius:var(--radius-sm);background:var(--bg-soft)}
.c0-lane+.c0-lane{margin-top:10px}
.c0-lane h4{margin:0 0 8px;font-size:14px}
.c0-path{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:6px;margin-top:8px}
.c0-node{display:flex;flex-direction:column;align-items:center;gap:2px;padding:8px 2px;border-radius:12px;border:1.5px solid var(--line-2);background:var(--surface);font-weight:900;font-size:15px;cursor:pointer;min-height:44px}
.c0-node small{font-size:10px;font-weight:800;color:var(--ink-3)}
.c0-node.site{border-color:var(--accent);background:var(--accent-soft)}
.c0-node.on{box-shadow:0 0 0 3px var(--accent)}
.c0-details{margin-top:12px;border:1px solid var(--line);border-radius:var(--radius-sm);padding:10px 14px;background:var(--surface)}
.c0-details summary{cursor:pointer;font-weight:800;min-height:28px}
.c0-details ol{margin:10px 0 4px;padding-left:1.3em;font-size:15px}
.c0-ctrl{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
.c0-ctrl .btn{flex:1 1 150px}
.c0-toggle[aria-pressed="true"]{background:var(--accent-soft);border-color:var(--accent)}
.c0-table td:first-child{width:46%}
.c0-note{font-size:14px;color:var(--ink-3);margin-top:8px}
.c0-done{color:var(--good);font-weight:800}
.c0-shake{animation:shake .4s ease}
@media (max-width:420px){.c0-path{grid-template-columns:repeat(4,minmax(0,1fr))}.c0-icons{grid-template-columns:repeat(3,minmax(0,1fr))}.c0-senses{grid-template-columns:repeat(3,minmax(0,1fr))}.c0-card .c0-txt{font-size:17px}}
`;
  if (!document.getElementById('style-ch0')) document.head.appendChild(h('style', { id: 'style-ch0', text: CSS }));

  /* =========================================================
     2. Small utilities
     ========================================================= */
  const R = Math.random;
  const lerp = (a, b, k) => a + (b - a) * k;
  const easeIO = t => (t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const wait = ms => new Promise(res => A.later(res, ms));
  // tween(ms, k => ...) — rAF animation, auto-stopped on navigation
  function tween(ms, fn, ease) {
    const e = ease || easeIO;
    return new Promise(res => {
      let t = 0;
      A.loop(dt => { t += dt * 1000; const k = Math.min(1, t / ms); fn(e(k), k); if (k >= 1) { res(); return false; } });
    });
  }
  function rgb(c) { c = c.replace('#', ''); if (c.length === 3) c = c.replace(/./g, m => m + m); const n = parseInt(c, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  function mix(a, b, k) { const p = rgb(a), q = rgb(b); return '#' + p.map((v, i) => Math.round(lerp(v, q[i], k)).toString(16).padStart(2, '0')).join(''); }
  const n1 = v => Number(v).toFixed(1);
  function svg(w, ht, label, extra) { return h('svg', Object.assign({ class: 'c0-svg', viewBox: '0 0 ' + w + ' ' + ht, role: 'img', 'aria-label': label }, extra || {})); }
  const G = (attrs, ...kids) => h('g', attrs || {}, ...kids);
  const P = (d, cls, extra) => h('path', Object.assign({ d, class: cls }, extra || {}));
  const TXT = (x, y, s, cls, extra) => h('text', Object.assign({ x, y, class: 'c0-t ' + (cls || ''), 'font-size': 11 }, extra || {}), s);
  function place(el, x, y, rot, sc) { el.setAttribute('transform', 'translate(' + n1(x) + ' ' + n1(y) + ')' + (rot ? ' rotate(' + n1(rot) + ')' : '') + (sc != null && sc !== 1 ? ' scale(' + sc + ')' : '')); return el; }
  const btn = (label, onClick, cls, extra) => h('button', Object.assign({ class: 'btn ' + (cls || '') + (/btn-sm/.test(cls || '') ? ' c0-b' : ''), type: 'button', html: label, on: { click: onClick } }, extra || {}));
  function info(el, html, kind) { el.className = 'c0-info' + (kind ? ' ' + kind : ''); el.innerHTML = html; }
  function shakeEl(el) { el.classList.remove('c0-shake'); void el.offsetWidth; el.classList.add('c0-shake'); }
  function bestTime(key, secs) { // lower is better; returns previous best
    const st = A.state; const prev = st.best['c0-' + key];
    if (secs != null && (prev == null || secs < prev)) { st.best['c0-' + key] = secs; A.save(); }
    return prev;
  }

  /* =========================================================
     3. SVG lab kit — glassware, burner, people, tools
     ========================================================= */
  // liquid state shared by tubes & beakers: set(level, colour, opacity) / to(...) animated
  function liquid(el, pathFn, st) {
    function draw() { el.setAttribute('d', pathFn(st.level)); el.setAttribute('fill', st.color); el.setAttribute('fill-opacity', st.op.toFixed(2)); }
    return {
      set(level, color, op) { if (level != null) st.level = level; if (color) st.color = color; if (op != null) st.op = op; draw(); },
      to(level, color, op, ms) {
        const L0 = st.level, C0 = st.color, O0 = st.op;
        const L1 = level == null ? L0 : level, C1 = color || C0, O1 = op == null ? O0 : op;
        return tween(ms || 900, k => { st.level = lerp(L0, L1, k); st.color = mix(C0, C1, k); st.op = lerp(O0, O1, k); draw(); });
      }
    };
  }
  const COLOURLESS = '#d3e8f6';

  function testTube(o) {
    const x = o.x, top = o.top, H = o.H || 150, W = o.W || 34, r = W / 2, bot = top + H;
    const x0 = x - r, x1 = x + r, ri = r - 2;
    const shape = 'M' + x0 + ' ' + top + 'L' + x0 + ' ' + (bot - r) + 'A' + r + ' ' + r + ' 0 0 0 ' + x1 + ' ' + (bot - r) + 'L' + x1 + ' ' + top;
    const liqEl = h('path', {});
    const inner = G();
    const node = G({ class: 'c0-tube' },
      P(shape + 'Z', 'c0-glassfill'), liqEl, inner,
      P(shape, 'c0-out', { style: { strokeWidth: o.thin ? '1.6px' : '2.2px' } }),
      P('M' + (x0 - 3) + ' ' + top + 'L' + (x1 + 3) + ' ' + top, 'c0-out', { style: { strokeWidth: o.thin ? '1.6px' : '2.2px' } }),
      W > 16 ? P('M' + (x0 + 5) + ' ' + (top + 10) + 'L' + (x0 + 5) + ' ' + (bot - r - 2), 'c0-shine') : null);
    function shapeAt(level) {
      if (level <= 0.002) return 'M0 0';
      const y = Math.max(top + 2, bot - level * H), cy = bot - r;
      if (y > cy) { const hw = Math.sqrt(Math.max(0, ri * ri - (y - cy) * (y - cy))); return 'M' + n1(x - hw) + ' ' + n1(y) + 'A' + ri + ' ' + ri + ' 0 0 0 ' + n1(x + hw) + ' ' + n1(y) + 'Z'; }
      return 'M' + (x - ri) + ' ' + n1(y) + 'L' + (x - ri) + ' ' + cy + 'A' + ri + ' ' + ri + ' 0 0 0 ' + (x + ri) + ' ' + cy + 'L' + (x + ri) + ' ' + n1(y) + 'Z';
    }
    const st = { level: o.level || 0, color: o.color || COLOURLESS, op: o.op == null ? .55 : o.op };
    const liq = liquid(liqEl, shapeAt, st); liq.set();
    const t = Object.assign({ node, inner, x, top, bot, r, W, H, st, liqEl }, liq);
    t.surfaceY = () => bot - st.level * H;
    t.shapeAt = shapeAt;
    // random point inside the liquid (for particles)
    t.point = (yMin) => {
      const rr = r - 4, cy = bot - r, yTop = Math.max(t.surfaceY() + 3, yMin || 0);
      for (let i = 0; i < 40; i++) {
        const y = lerp(yTop, bot - 4, R());
        const hw = y > cy ? Math.sqrt(Math.max(0, rr * rr - (y - cy) * (y - cy))) : rr;
        if (hw > 1) return [x + (R() * 2 - 1) * hw, y];
      }
      return [x, bot - 6];
    };
    return t;
  }

  function beaker(o) {
    const x = o.x, y = o.y, W = o.W || 70, H = o.H || 80, b = y + H;
    const shape = 'M' + (x - 5) + ' ' + (y - 4) + 'L' + x + ' ' + (y + 3) + 'L' + x + ' ' + (b - 6) + 'Q' + x + ' ' + b + ' ' + (x + 6) + ' ' + b + 'L' + (x + W - 6) + ' ' + b + 'Q' + (x + W) + ' ' + b + ' ' + (x + W) + ' ' + (b - 6) + 'L' + (x + W) + ' ' + y;
    const liqEl = h('path', {});
    const inner = G();
    const marks = [1, 2, 3].map(i => P('M' + (x + W - 13) + ' ' + n1(b - i * H / 4) + 'L' + (x + W - 3) + ' ' + n1(b - i * H / 4), 'c0-mark'));
    const node = G({ class: 'c0-beaker' }, P(shape + 'Z', 'c0-glassfill'), liqEl, inner, ...marks, P(shape, 'c0-out'),
      P('M' + (x + 6) + ' ' + (y + 10) + 'L' + (x + 6) + ' ' + (b - 10), 'c0-shine'));
    function shapeAt(level) {
      if (level <= .002) return 'M0 0';
      const ly = b - 2 - level * (H - 4);
      return 'M' + (x + 2) + ' ' + n1(ly) + 'L' + (x + 2) + ' ' + (b - 6) + 'Q' + (x + 2) + ' ' + (b - 2) + ' ' + (x + 6) + ' ' + (b - 2) + 'L' + (x + W - 6) + ' ' + (b - 2) + 'Q' + (x + W - 2) + ' ' + (b - 2) + ' ' + (x + W - 2) + ' ' + (b - 6) + 'L' + (x + W - 2) + ' ' + n1(ly) + 'Z';
    }
    const st = { level: o.level || 0, color: o.color || COLOURLESS, op: o.op == null ? .55 : o.op };
    const liq = liquid(liqEl, shapeAt, st); liq.set();
    const bk = Object.assign({ node, inner, x, y, W, H, b, st }, liq);
    bk.surfaceY = () => b - 2 - st.level * (H - 4);
    return bk;
  }

  // flames: local origin = burner mouth, pointing up
  const FLAMES = {
    luminous: [['M-8 0C-14-16-5-26-4-38C1-30 4-46 0-60C12-42 14-16 8 0Z', '#ffa726'], ['M-4 0C-7-10-2-18 0-28C3-18 6-10 4 0Z', '#ffe27a']],
    blue: [['M-7 0C-8-14-3-30 0-44C3-30 8-14 7 0Z', '#86b8ff'], ['M-4 0C-4-8-2-16 0-23C2-16 4-8 4 0Z', '#2f5fd8']],
    golden: [['M-12 0C-18-20-6-32-6-44C0-34 4-52 0-66C14-46 18-18 12 0Z', '#ffb300'], ['M-6 0C-9-12-3-22 0-34C3-22 8-12 6 0Z', '#fff07a']]
  };
  function flame(kind, sc) {
    const inner = G({ class: 'c0-flicker' });
    (FLAMES[kind] || []).forEach(([d, c]) => inner.appendChild(P(d, '', { fill: c, 'fill-opacity': kind === 'blue' ? .85 : .95 })));
    return G({ transform: 'scale(' + (sc || 1) + ')' }, inner);
  }
  // Bunsen burner; origin = centre of base on the bench. kinds: off | luminous | small | blue
  function bunsen(x, baseY, sc, kind) {
    const holder = G({ transform: 'translate(0 -62)' });
    const node = G({ transform: 'translate(' + x + ' ' + baseY + ') scale(' + (sc || 1) + ')', class: 'c0-bunsen' },
      P('M14-12L30-12', 'c0-hose'),
      h('rect', { x: -24, y: -9, width: 48, height: 9, rx: 3, class: 'c0-metal' }),
      h('rect', { x: -6, y: -62, width: 12, height: 54, rx: 2, class: 'c0-metal' }),
      h('rect', { x: -8.5, y: -30, width: 17, height: 9, rx: 2, class: 'c0-metal2' }),
      holder);
    const b = { node, kind: 'off' };
    b.set = k => { b.kind = k; holder.innerHTML = ''; if (!k || k === 'off') return; holder.appendChild(flame(k === 'small' ? 'luminous' : k, k === 'small' ? .42 : 1)); };
    b.set(kind || 'off');
    return b;
  }

  // a cartoon student standing behind a bench. (x,y) = head centre.
  // o: dir (1 right / -1 left), hair short|long|tied, hairCol, goggles, gloves, eyes dot|down|closed|wide,
  //    mouth smile|open|flat|worried|tongue, hands [[hx,hy, elbowX?, elbowY?], …] (left, right), legs [[hipX,hipY,kneeX,kneeY,footX,footY],…]
  function person(o) {
    const x = o.x, y = o.y, d = o.dir || 1, hc = o.hairCol || '#2d2420';
    const g = G({ class: 'c0-person' });
    const add = el => { if (el) g.appendChild(el); };
    (o.legs || []).forEach(L => { add(P('M' + L[0] + ' ' + L[1] + 'Q' + L[2] + ' ' + L[3] + ' ' + L[4] + ' ' + L[5], 'c0-leg')); add(h('ellipse', { cx: L[4] + 4 * d, cy: L[5] + 3, rx: 8, ry: 4, class: 'c0-shoe' })); });
    if (o.hair === 'long') { const len = o.hairLen || 46; add(P('M' + (x - 15) + ' ' + (y - 3) + 'C' + (x - 23) + ' ' + (y + 14) + ' ' + (x - 20) + ' ' + (y + len - 12) + ' ' + (x - 17) + ' ' + (y + len) + 'L' + (x + 17) + ' ' + (y + len) + 'C' + (x + 20) + ' ' + (y + len - 12) + ' ' + (x + 23) + ' ' + (y + 14) + ' ' + (x + 15) + ' ' + (y - 3) + 'Z', '', { fill: hc })); }
    if (o.hair === 'tied') { const bx = x - 15 * d; add(P('M' + bx + ' ' + (y - 9) + 'Q' + (bx - 17 * d) + ' ' + (y - 8) + ' ' + (bx - 12 * d) + ' ' + (y + 16) + 'Q' + (bx - 5 * d) + ' ' + (y + 2) + ' ' + (bx + 2 * d) + ' ' + (y - 2) + 'Z', '', { fill: hc })); add(h('circle', { cx: bx - 1 * d, cy: y - 6, r: 3, fill: '#e2475b' })); }
    add(P('M' + (x - 21) + ' ' + (y + 23) + 'Q' + x + ' ' + (y + 14) + ' ' + (x + 21) + ' ' + (y + 23) + 'L' + (x + 27) + ' ' + (y + 92) + 'L' + (x - 27) + ' ' + (y + 92) + 'Z', 'c0-coat'));
    add(P('M' + (x - 7) + ' ' + (y + 17) + 'L' + x + ' ' + (y + 31) + 'L' + (x + 7) + ' ' + (y + 17), 'c0-coatln'));
    add(h('circle', { cx: x, cy: y, r: 15, class: 'c0-skin' }));
    add(P('M' + (x - 15.6) + ' ' + (y + 1) + 'A15.6 15.6 0 0 1 ' + (x + 15.6) + ' ' + (y + 1) + 'Q' + (x + 5 * d) + ' ' + (y - 10) + ' ' + (x - 15.6) + ' ' + (y + 1) + 'Z', '', { fill: hc }));
    const ex = x + 2 * d;
    if (o.eyes === 'closed') { add(P('M' + (ex - 8) + ' ' + (y + 3) + 'q3 2 6 0M' + (ex + 2) + ' ' + (y + 3) + 'q3 2 6 0', 'c0-mouth', { style: { stroke: 'var(--c0-eye)' } })); }
    else { const ey = o.eyes === 'down' ? y + 5 : y + 2, er = o.eyes === 'wide' ? 2.6 : 1.9; add(h('circle', { cx: ex - 5, cy: ey, r: er, class: 'c0-eye' })); add(h('circle', { cx: ex + 5, cy: ey, r: er, class: 'c0-eye' })); }
    if (o.goggles) add(h('rect', { x: x - 14, y: y - 4, width: 28, height: 11, rx: 5, class: 'c0-goggle' }));
    const m = o.mouth || 'smile', mx = x + 2 * d;
    if (m === 'smile') add(P('M' + (mx - 4) + ' ' + (y + 8) + 'Q' + mx + ' ' + (y + 11.5) + ' ' + (mx + 4) + ' ' + (y + 8), 'c0-mouth'));
    else if (m === 'flat') add(P('M' + (mx - 3.5) + ' ' + (y + 9) + 'L' + (mx + 3.5) + ' ' + (y + 9), 'c0-mouth'));
    else if (m === 'worried') add(P('M' + (mx - 4) + ' ' + (y + 10.5) + 'Q' + mx + ' ' + (y + 7) + ' ' + (mx + 4) + ' ' + (y + 10.5), 'c0-mouth'));
    else if (m === 'open') add(h('ellipse', { cx: mx, cy: y + 9.5, rx: 3.4, ry: 2.8, fill: '#7a2e2a' }));
    else if (m === 'tongue') { add(h('ellipse', { cx: mx, cy: y + 9.5, rx: 3.6, ry: 2.6, fill: '#7a2e2a' })); add(h('ellipse', { cx: mx + 1.5 * d, cy: y + 11.6, rx: 2.4, ry: 2, fill: '#ef7d8c' })); }
    (o.hands || []).forEach((p, i) => {
      if (!p) return;
      const sx = x + (i ? 17 : -17), sy = y + 30;
      const dd = p.length > 2 ? 'M' + sx + ' ' + sy + 'Q' + p[2] + ' ' + p[3] + ' ' + p[0] + ' ' + p[1] : 'M' + sx + ' ' + sy + 'L' + p[0] + ' ' + p[1];
      add(P(dd, 'c0-arm-o')); add(P(dd, 'c0-arm'));
      add(h('circle', { cx: p[0], cy: p[1], r: 5.2, class: o.gloves ? 'c0-glove' : 'c0-skin' }));
    });
    return g;
  }

  // simple open hand (local origin = wrist, fingers up)
  function hand(cls) {
    const c = cls || 'c0-skin';
    return G({}, ...[-6, -2.2, 1.6, 5.4].map((fx, i) => h('rect', { x: fx - 1.8, y: -24 + (i === 0 || i === 3 ? 3 : 0), width: 3.6, height: 12, rx: 1.8, class: c })),
      h('rect', { x: -8, y: -14, width: 16, height: 15, rx: 5, class: c }),
      h('rect', { x: -14, y: -12, width: 8, height: 4, rx: 2, class: c, transform: 'rotate(-35 -8 -10)' }));
  }
  // reagent bottle; origin = centre of the base
  function reagentBottle(o) {
    const w = o.w || 34, hh = o.h || 50, col = o.color;
    return G({ class: 'c0-bottle' },
      h('rect', { x: -w / 2, y: -hh, width: w, height: hh, rx: 6, class: 'c0-glassfill' }),
      col ? h('rect', { x: -w / 2 + 2, y: -hh * .62, width: w - 4, height: hh * .62 - 2, rx: 4, fill: col, 'fill-opacity': o.op || .6 }) : null,
      h('rect', { x: -w / 2, y: -hh, width: w, height: hh, rx: 6, class: 'c0-out' }),
      h('rect', { x: -6, y: -hh - 10, width: 12, height: 11, class: 'c0-glassfill' }), h('rect', { x: -6, y: -hh - 10, width: 12, height: 11, class: 'c0-out' }),
      o.stopper === false ? null : h('rect', { x: -8, y: -hh - 17, width: 16, height: 8, rx: 2, class: 'c0-metal2' }),
      o.label === false ? null : h('rect', { x: -w / 2 + 4, y: -hh * .8, width: w - 8, height: hh * .38, rx: 2, class: 'c0-paper' }),
      o.label && o.label !== true ? TXT(0, -hh * .8 + hh * .25, o.label, 'c0-tc', { 'font-size': o.fs || 7 }) : null);
  }
  function splint(lit) { // origin = tip, wood goes up-right
    return G({}, P('M0 0L46 -60', '', { stroke: '#c8955a', 'stroke-width': 4.5, 'stroke-linecap': 'round' }), lit ? G({ transform: 'rotate(-20)' }, flame('luminous', .32)) : null);
  }
  function spatula() { // origin = scoop
    return G({}, P('M0 0L70 -50', '', { fill: 'none', stroke: 'var(--c0-metal-2)', 'stroke-width': 3.5, 'stroke-linecap': 'round' }), h('ellipse', { cx: 0, cy: 0, rx: 8, ry: 4, class: 'c0-metal', transform: 'rotate(-35)' }));
  }
  function dropper() { // origin = tip
    return G({}, h('rect', { x: -3, y: -40, width: 6, height: 40, rx: 2, class: 'c0-glassfill' }), P('M-3 -40L-3 -2Q0 2 3 -2L3 -40', 'c0-thin'), h('rect', { x: -6, y: -60, width: 12, height: 22, rx: 6, fill: '#d9534f', stroke: 'var(--ink)', 'stroke-width': 1.3 }));
  }
  function popBurst(x, y, s) {
    const pts = []; for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2, rr = i % 2 ? 9 : 22; pts.push(n1(x + Math.cos(a) * rr * s) + ',' + n1(y + Math.sin(a) * rr * s)); }
    return G({ class: 'c0-pop' }, h('polygon', { points: pts.join(' '), fill: '#ffe066', stroke: '#f08c00', 'stroke-width': 2 }), TXT(x, y + 4 * s, 'POP!', 'c0-tc', { 'font-size': 11 * s, fill: '#b34700' }));
  }
  function wall(s, W, H) { s.appendChild(h('rect', { x: 0, y: 0, width: W, height: H, class: 'c0-wall' })); }
  function bench(s, W, H, y, doors) {
    s.appendChild(h('rect', { x: 0, y: y + 9, width: W, height: H - y - 9, class: 'c0-cab' }));
    for (let x = doors || 100; x < W; x += doors || 100) s.appendChild(P('M' + x + ' ' + (y + 14) + 'L' + x + ' ' + H, 'c0-cabln'));
    s.appendChild(h('rect', { x: 0, y, width: W, height: 9, class: 'c0-top' }));
  }
  // rising bubbles inside a vessel; area() -> {x0, x1, yBottom, yTop}
  function bubbler(layer, area) {
    let on = false, rate = 12, acc = 0, seen = false;
    const list = [];
    A.loop(dt => {
      if (layer.isConnected) seen = true; else if (seen) return false;
      const a = area();
      if (on) {
        acc += dt * rate;
        while (acc > 1) {
          acc--;
          const bx = lerp(a.x0, a.x1, R());
          const el = h('circle', { cx: n1(bx), cy: n1(a.yBottom), r: n1(1.4 + R() * 2.2), class: 'c0-bub' });
          layer.appendChild(el); list.push({ el, x: bx, y: a.yBottom, v: 35 + R() * 35, w: R() * 6 });
        }
      }
      for (let i = list.length - 1; i >= 0; i--) {
        const p = list[i]; p.y -= p.v * dt; p.w += dt * 9;
        p.el.setAttribute('cy', n1(p.y)); p.el.setAttribute('cx', n1(p.x + Math.sin(p.w) * 1.3));
        if (p.y <= a.yTop) { p.el.remove(); list.splice(i, 1); }
      }
    });
    return { start(r) { if (r) rate = r; on = true; }, stop() { on = false; }, rate(r) { rate = r; } };
  }
  // wisps of gas drifting from (x0,y0) towards (x1,y1)
  async function wisps(layer, x0, y0, x1, y1, n, colour) {
    const els = [];
    for (let i = 0; i < (n || 3); i++) {
      const el = P('M0 0q5 -6 0 -12q-5 -6 0 -12', 'c0-wisp', colour ? { style: { stroke: colour } } : null);
      layer.appendChild(el); els.push(el);
      const dx = x1 - x0, dy = y1 - y0, off = (i - 1) * 6;
      tween(1300, k => { place(el, x0 + dx * k + off * (1 - k), y0 + dy * k + off * .3); el.style.opacity = String(k < .8 ? .85 : (1 - k) * 4); }, t => t).then(() => el.remove());
      await wait(260);
    }
    await wait(1000);
  }

  /* ---------- shared lesson helpers ---------- */
  function note(title, html, tag) { const c = A.noteCard(title, html, tag); c.classList.add('c0-note'); return c; }
  function clozeCard(text, key, title) {
    const c = h('section', { class: 'card c0-note' }, h('div', { class: 'card-title' }, h('span', { class: 'card-tag', text: '✍️ Key words' }), h('h3', { text: title || 'Fill in the blanks' })));
    [].concat(text).forEach((t, i) => { if (i) c.appendChild(h('div', { style: { height: '14px' } })); c.appendChild(A.cloze(t, { rewardKey: key + (i ? '-' + i : ''), xp: 10 })); });
    return c;
  }
  // generic "yes / no" swipe deck. cards: [{e, t, ok, why}]
  function yesNoDeck(o) {
    const wrap = h('div');
    const card = h('div', { class: 'c0-card' });
    const dots = h('div', { class: 'c0-dots', 'aria-hidden': 'true' });
    const fb = h('div', { class: 'c0-info', html: o.intro });
    const yes = btn(o.yes, () => answer(true)), no = btn(o.no, () => answer(false));
    const next = btn('Next →', () => { i++; show(); }, 'btn-primary');
    const controls = h('div', { class: 'c0-2btn' }, yes, no);
    let deck, i, score, answered;
    function start() {
      deck = A.shuffle(o.cards); i = 0; score = 0;
      dots.innerHTML = ''; deck.forEach(() => dots.appendChild(h('i')));
      show();
    }
    function show() {
      if (i >= deck.length) return end();
      answered = false;
      [...dots.children].forEach((d, k) => d.classList.toggle('cur', k === i));
      card.classList.add('out');
      A.later(() => { card.innerHTML = ''; card.append(h('div', { class: 'c0-emo', text: deck[i].e }), h('div', { class: 'c0-txt', html: deck[i].t })); card.classList.remove('out'); }, 160);
      controls.style.display = ''; next.style.display = 'none';
      if (i) info(fb, o.prompt || 'Your call?');
      if (o.score) o.score.textContent = i + ' / ' + deck.length;
    }
    function answer(v) {
      if (answered) return; answered = true;
      const c = deck[i], right = v === c.ok;
      if (right) score++;
      dots.children[i].className = right ? 'ok' : 'no';
      info(fb, (right ? '✅ <b>Correct!</b> ' : '❌ <b>Not quite.</b> ') + (c.ok ? o.yesWord : o.noWord) + '<br>' + c.why, right ? 'good' : 'bad');
      A.sound(right ? 'good' : 'bad');
      if (!right) shakeEl(card);
      controls.style.display = 'none'; next.style.display = ''; next.textContent = i + 1 < deck.length ? 'Next →' : 'See my score';
    }
    function end() {
      controls.style.display = 'none'; next.style.display = 'none';
      card.innerHTML = '';
      card.append(h('div', { class: 'c0-emo', text: score === deck.length ? '🏆' : score >= deck.length * .7 ? '👍' : '💪' }), h('div', { class: 'c0-txt', text: 'You scored ' + score + ' / ' + deck.length }), h('div', null, btn('↻ Play again', start, 'btn-sm')));
      info(fb, score === deck.length ? 'Perfect — you know your lab rules!' : 'Play again to get them all right.', score === deck.length ? 'good' : '');
      if (o.score) o.score.textContent = score + ' / ' + deck.length;
      if (score >= Math.ceil(deck.length * .7) && o.rewardKey) A.reward(o.rewardKey, o.xp || 15, o.reason || 'Quick-fire');
      if (score === deck.length) { A.sound('win'); A.celebrate(.6); }
    }
    wrap.append(card, dots, controls, h('div', { class: 'c0-row c0-mt', style: { justifyContent: 'flex-end' } }, next), fb);
    start();
    return wrap;
  }

  /* =========================================================
     LESSON 0.1 — What is Chemistry?
     ========================================================= */
  const BRANCHES = [
    { id: 'ana', name: 'Analytical chemistry', short: 'Analytical', zh: '分析化學', desc: 'Analyse and separate substances.', clues: ['Analyse and separate substances', 'Find out what is in a sample, and separate it'] },
    { id: 'bio', name: 'Biochemistry', short: 'Biochemistry', zh: '生物化學', desc: 'Study of chemical processes in organisms.', clues: ['Study of chemical processes in organisms', 'Chemical processes inside living things'] },
    { id: 'org', name: 'Organic chemistry', short: 'Organic', zh: '有機化學', desc: 'Study of carbon-containing compounds.', clues: ['Study of carbon-containing compounds', 'Compounds that contain carbon'] },
    { id: 'ino', name: 'Inorganic chemistry', short: 'Inorganic', zh: '無機化學', desc: 'Study of substances not involving carbon.', clues: ['Study of substances not involving carbon', 'Substances that do not involve carbon'] },
    { id: 'phy', name: 'Physical chemistry', short: 'Physical', zh: '物理化學', desc: 'Applies concepts in physics to understand chemistry.', clues: ['Applies concepts in physics to understand chemistry', 'Uses ideas from physics to explain chemistry'] }
  ];
  function branchIcon(id) {
    const s = svg(48, 48, '', { 'aria-hidden': 'true', role: 'presentation' });
    s.appendChild(h('circle', { cx: 24, cy: 24, r: 23, fill: 'var(--accent-soft)' }));
    const st = { fill: 'none', stroke: 'var(--accent)', 'stroke-width': 2.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
    const thin = Object.assign({}, st, { 'stroke-width': 1.7 });
    if (id === 'ana') s.append(h('circle', Object.assign({ cx: 21, cy: 21, r: 10 }, st)), P('M28.5 28.5L37 37', '', st), P('M15.5 24l3-6 3 6 3-6', '', thin));
    if (id === 'bio') s.append(P('M17 9C34 17 14 31 31 39', '', st), P('M31 9C14 17 34 31 17 39', '', st), P('M19.5 14.5h9M17.5 24h13M19.5 33.5h9', '', thin));
    if (id === 'org') {
      const pts = []; for (let i = 0; i < 6; i++) { const a = Math.PI / 6 + i * Math.PI / 3; pts.push(n1(24 + 13 * Math.cos(a)) + ',' + n1(24 + 13 * Math.sin(a))); }
      s.append(h('polygon', Object.assign({ points: pts.join(' ') }, st)), h('text', { x: 24, y: 28.5, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 900, fill: 'var(--accent)', 'font-family': 'var(--font)' }, 'C'));
    }
    if (id === 'ino') s.append(h('polygon', Object.assign({ points: '24,9 36,19 31,38 17,38 12,19' }, st)), P('M12 19H36M24 9L19 19L24 38L29 19Z', '', thin));
    if (id === 'phy') s.append(P('M10 32A14 14 0 0 1 38 32', '', st), P('M24 32L32 21', '', st), h('circle', { cx: 24, cy: 32, r: 2.6, fill: 'var(--accent)' }), P('M15 25.5l-2-2M24 21.5v-3M33 25.5', '', thin));
    return s;
  }
  function branchExplorer() {
    const out = h('div', { class: 'c0-mt' });
    const tiles = h('div', { class: 'c0-tiles' });
    const box = h('div', { class: 'c0-info', html: '👆 Tap a branch to see what it studies.' });
    const seen = new Set();
    BRANCHES.forEach(b => {
      const t = h('button', { class: 'c0-tile', type: 'button' }, branchIcon(b.id), h('span', { text: b.short }));
      t.addEventListener('click', () => {
        tiles.querySelectorAll('.c0-tile').forEach(x => x.classList.toggle('on', x === t));
        info(box, '<b>' + b.name + '</b> <span class="zh">' + b.zh + '</span><br>' + b.desc);
        A.sound('pop'); seen.add(b.id);
        if (seen.size === BRANCHES.length) A.reward('c0-branches-seen', 5, 'Explored every branch');
      });
      tiles.appendChild(t);
    });
    out.append(tiles, box);
    return out;
  }
  function branchBlaster() {
    const card = A.playCard('Branch Blaster', 'Read the clue, then tap the branch that studies it. 10 clues — how fast can you go? (Wrong tap = +2 s)', '⚡ Speed game');
    const clue = h('div', { class: 'c0-clue', text: 'Ready? Press Start!' });
    const bar = h('i', { style: { width: '0%' } });
    const timeEl = h('span', { class: 'c0-pill', text: '⏱ 0.0 s' });
    const tiles = h('div', { class: 'c0-tiles' });
    const fb = h('div', { class: 'feedback' });
    const startB = btn('▶ Start', start, 'btn-primary');
    const prev = bestTime('blaster');
    const bestEl = h('span', { class: 'tiny', text: prev != null ? '🏅 Your best: ' + prev.toFixed(1) + ' s' : '' });
    let rounds = [], i = 0, t0 = 0, miss = 0, live = false, tick = null, lock = false;
    BRANCHES.forEach(b => {
      const t = h('button', { class: 'c0-tile', type: 'button', disabled: true, 'aria-label': b.name }, branchIcon(b.id), h('span', { text: b.short }));
      t._id = b.id; t.addEventListener('click', () => pick(t)); tiles.appendChild(t);
    });
    const setTiles = dis => tiles.querySelectorAll('.c0-tile').forEach(t => { t.disabled = dis; t.classList.remove('right', 'wrong'); });
    function start() {
      rounds = A.shuffle(BRANCHES.flatMap(b => b.clues.map(c => ({ c, id: b.id })))); i = 0; miss = 0; live = true; t0 = performance.now();
      startB.style.display = 'none'; fb.textContent = ''; setTiles(false); show();
      if (tick) clearInterval(tick);
      tick = A.every(() => { if (live) timeEl.textContent = '⏱ ' + ((performance.now() - t0) / 1000).toFixed(1) + ' s'; }, 100);
      A.sound('click');
    }
    function show() { clue.textContent = '“' + rounds[i].c + '”'; bar.style.width = (i / rounds.length * 100) + '%'; card.score.textContent = i + ' / ' + rounds.length; lock = false; }
    function pick(t) {
      if (!live || lock) return;
      if (t._id === rounds[i].id) {
        lock = true; t.classList.add('right'); A.sound('pop');
        fb.className = 'feedback good'; fb.textContent = '✓ ' + BRANCHES.find(b => b.id === t._id).name + '!';
        A.later(() => { t.classList.remove('right'); i++; if (i >= rounds.length) finish(); else show(); }, 260);
      } else {
        miss++; t0 -= 2000; t.classList.add('wrong'); A.sound('bad');
        fb.className = 'feedback bad'; fb.textContent = '✗ Not that one (+2 s)';
        A.later(() => t.classList.remove('wrong'), 420);
      }
    }
    function finish() {
      live = false; clearInterval(tick);
      const secs = Math.round((performance.now() - t0) / 100) / 10;
      timeEl.textContent = '⏱ ' + secs.toFixed(1) + ' s';
      bar.style.width = '100%'; card.score.textContent = rounds.length + ' / ' + rounds.length; setTiles(true);
      const pb = bestTime('blaster', secs), isBest = pb == null || secs < pb;
      clue.textContent = '🏁 ' + secs.toFixed(1) + ' seconds' + (isBest ? ' — new best!' : '');
      fb.className = 'feedback good'; fb.textContent = miss ? miss + ' wrong tap' + (miss > 1 ? 's' : '') + '. Play again to go faster!' : 'Perfect — no wrong taps!';
      bestEl.textContent = '🏅 Your best: ' + (isBest ? secs : pb).toFixed(1) + ' s';
      A.sound('win'); if (isBest || !miss) A.celebrate(.5);
      A.reward('c0-blaster', 15, 'Branch Blaster');
      startB.textContent = '↻ Play again'; startB.style.display = '';
    }
    card.body.append(h('div', { class: 'c0-bar' }, h('div', { class: 'progress' }, bar), timeEl), clue, tiles, fb, h('div', { class: 'c0-row c0-mt' }, startB, bestEl));
    return card;
  }
  function alchemist() {
    const card = A.playCard('The alchemist’s challenge', 'Chemists in the past tried to make <b>gold</b> from cheap metals by doing experiments. Your turn — 3 tries!', '🎮 Try it');
    const W = 300, H = 200, s = svg(W, H, 'An alchemist’s cauldron over a fire');
    wall(s, W, H);
    s.append(h('rect', { x: 108, y: 186, width: 84, height: 8, rx: 4, fill: '#8a5a33', transform: 'rotate(8 150 190)' }), h('rect', { x: 108, y: 186, width: 84, height: 8, rx: 4, fill: '#a06a3c', transform: 'rotate(-8 150 190)' }));
    s.append(G({ transform: 'translate(122 190)' }, flame('luminous', .5)), G({ transform: 'translate(150 192)' }, flame('luminous', .72)), G({ transform: 'translate(178 190)' }, flame('luminous', .5)));
    s.appendChild(P('M84 96Q80 172 150 172Q220 172 216 96Z', '', { fill: '#3b4150', stroke: 'var(--ink)', 'stroke-width': 2 }));
    const liq = h('ellipse', { cx: 150, cy: 98, rx: 64, ry: 10, fill: '#5bbf7a' });
    s.append(liq, h('ellipse', { cx: 150, cy: 96, rx: 69, ry: 12, fill: 'none', stroke: 'var(--ink)', 'stroke-width': 2.5 }));
    const fx = G(); s.appendChild(fx);
    const note = h('div', { class: 'c0-info', html: '📒 Notebook: <b>0 / 3</b> experiments recorded.' });
    let tries = 0, busy = false;
    const go = btn('⚗️ Do an experiment', run, 'btn-primary');
    const colours = ['#8a6cff', '#ff8a3d', '#3fb6c9'];
    async function run() {
      if (busy) return; busy = true; go.disabled = true;
      const lump = h('ellipse', { cx: 150, cy: 14, rx: 10, ry: 6.5, fill: '#8d949e', stroke: 'var(--ink)', 'stroke-width': 1.5 });
      fx.appendChild(lump); A.sound('whoosh');
      await tween(480, k => lump.setAttribute('cy', n1(lerp(14, 98, k))), t => t * t);
      lump.remove(); A.sound('fizz');
      const col = colours[tries % 3];
      liq.setAttribute('fill', col);
      for (let i = 0; i < 9; i++) {
        const b = h('circle', { cx: n1(96 + R() * 108), cy: 98, r: n1(3 + R() * 4), fill: col, stroke: 'var(--ink)', 'stroke-width': 1 });
        fx.appendChild(b);
        tween(650 + R() * 450, k => { b.setAttribute('cy', n1(98 - k * 55)); b.style.opacity = String(1 - k); }).then(() => b.remove());
      }
      await wait(850);
      const coin = G({}, h('circle', { cx: 0, cy: 0, r: 13, fill: '#a3abb5', stroke: 'var(--ink)', 'stroke-width': 2 }), TXT(0, 4.5, '?', 'c0-tc c0-tdark', { 'font-size': 13 }));
      fx.appendChild(coin);
      await tween(650, k => place(coin, 150 + k * 95, 92 - Math.sin(k * Math.PI) * 70 + k * 60), t => t);
      tries++;
      if (tries < 3) { A.sound('bad'); info(note, '😅 Still not gold… but you wrote down what happened!<br>📒 Notebook: <b>' + tries + ' / 3</b> experiments recorded.'); }
      else {
        A.sound('good');
        info(note, '📒 Notebook full! They never made gold, but these experiments gathered <b>valuable information about the properties of matter</b>. That is why chemistry is an <b>experimental science</b>.', 'good');
        if (A.reward('c0-alchemist', 10, 'Alchemist')) A.celebrate(.4);
        go.innerHTML = '↻ Try again';
      }
      await wait(600); coin.remove(); liq.setAttribute('fill', '#5bbf7a');
      busy = false; go.disabled = false;
    }
    card.body.append(h('div', { class: 'c0-stage c0-w-sm' }, s), h('div', { class: 'c0-ctrl c0-w-sm' }, go), note);
    return card;
  }
  const SECTIONS = { 1: 'Planet Earth', 2: 'Microscopic World I', 3: 'Metals', 4: 'Acids and Bases', 5: 'Fossil Fuels and Carbon Compounds', 6: 'Microscopic World II', 7: 'Chemical Cells, Redox Reactions and Electrolysis', 8: 'Chemical Reactions and Energy', 9: 'Rate of Reaction', 10: 'Chemical Equilibrium', 11: 'Chemistry of Carbon Compounds', 12: 'Patterns in the Chemical World', 13: 'Industrial Chemistry', 15: 'Analytical Chemistry' };
  const F3CH = ['Introduction to Chemistry', 'Elements', 'Mixtures and Compounds', 'Atomic Structure', 'Periodic Table', 'Ionic Compounds', 'Covalent Compounds', 'Laboratory Techniques'];
  const AOS = ['<b>Recall</b> and show <b>understanding of chemical facts</b>, patterns, principles, terminology and conventions.', 'Show an understanding of the use of apparatus and materials in performing <b>experiments</b>.', 'Handle materials, manipulate apparatus, carry out experiments <b>safely</b> and make accurate <b>observations</b>.', 'Demonstrate an understanding of the method used in chemical investigation.', 'Analyse, interpret, manipulate and translate chemical data and perform <b>calculation</b>.', 'Select and organise scientific information from appropriate sources and communicate it in an appropriate and logical manner.', 'Understand and evaluate the social, economic, environmental and technological implications of the <b>applications of chemistry</b>.', '<b>Make decisions</b> based on the examination of evidence and arguments.'];
  function journey() {
    const card = note('Your chemistry journey', '<p>The <b>HKDSE Chemistry syllabus</b> has a <b>compulsory part</b> (12 sections, F.3 – F.5) and an <b>elective part</b> (2 sections, F.6). Tap a section to see its name.</p>', '🗺️ Big picture');
    const secInfo = h('div', { class: 'c0-info' });
    const chips = [];
    function selSec(n) {
      chips.forEach(c => c.classList.toggle('on', c._n === n));
      info(secInfo, '<b>Section ' + n + ':</b> ' + SECTIONS[n] + (n === 2 ? ' — <b>your F.3 syllabus!</b>' : n > 12 ? ' <span class="muted">(elective, F.6)</span>' : ' <span class="muted">(compulsory)</span>'));
    }
    function lane(title, nums) {
      const row = h('div', { class: 'c0-chips' });
      nums.forEach(n => {
        const c = h('button', { class: 'chip c0-sec' + (n === 2 ? ' hot' : ''), type: 'button', text: String(n), 'aria-label': 'Section ' + n });
        c._n = n; c.addEventListener('click', () => { selSec(n); A.sound('click'); }); chips.push(c); row.appendChild(c);
      });
      return h('div', { class: 'c0-lane' }, h('h4', { html: title }), row);
    }
    const chInfo = h('div', { class: 'c0-info', html: '📍 You are in <b>Chapter 0</b>. Chem FT covers Chapters 0 – 2 (★).' });
    const pathEl = h('div', { class: 'c0-path' });
    F3CH.forEach((name, i) => {
      const nd = h('button', { class: 'c0-node' + (i <= 2 ? ' site' : ''), type: 'button', 'aria-label': 'Chapter ' + i + ': ' + name }, h('span', { text: String(i) }), h('small', { text: i === 0 ? '📍' : i <= 2 ? '★' : '·' }));
      nd.addEventListener('click', () => { pathEl.querySelectorAll('.c0-node').forEach(x => x.classList.toggle('on', x === nd)); info(chInfo, '<b>Chapter ' + i + ':</b> ' + name + (i <= 2 ? ' <span class="c0-done">★ on Chem FT</span>' : '')); A.sound('click'); });
      pathEl.appendChild(nd);
    });
    card.append(lane('Compulsory part · F.3 – F.5', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]), lane('Elective part · F.6', [13, 15]), secInfo,
      h('h4', { style: { margin: '18px 0 0' }, html: 'F.3 syllabus = Section 2: Microscopic World I' }), pathEl, chInfo,
      h('details', { class: 'c0-details' }, h('summary', { text: '📋 What the exam tests: the 8 assessment objectives' }), h('ol', { html: AOS.map(x => '<li>' + x + '</li>').join('') })));
    selSec(2);
    return card;
  }

  function renderWhatIs(root, api) {
    root.appendChild(note('In this chapter you will learn to…', '<ol class="c0-obj"><li>Recognise the location of laboratory <b>facilities</b>.</li><li>Suggest <b>safety precautions</b> and identify <b>unsafe practices</b> in the laboratory.</li><li><b>Observe</b> and <b>describe</b> experimental results accurately.</li></ol>', '🎯 Goals'));

    const def = note('What is chemistry?', '<ul><li><b>' + T('Composition', '組成') + '</b>: <b>what</b> is it made of?</li><li><b>' + T('Properties', '性質') + '</b>: qualities that we use to <b>distinguish</b> one matter from another.</li></ul>');
    def.lastChild.prepend(api.keybox('Chemistry is the study of ' + T('matter', '物質') + ', such as their <b>composition</b> and <b>properties</b>.', '📖 Definition'));
    root.appendChild(def);

    const sortP = api.playCard('Composition or property?', 'Tap a card, then tap the right box.', '🎮 Sort');
    sortP.body.appendChild(api.sortGame({
      buckets: [{ id: 'c', title: 'Composition', icon: '🧩' }, { id: 'p', title: 'Property', icon: '✨' }],
      items: [
        { label: 'Bronze is made of copper and tin.', bucket: 'c', explain: 'What it is <b>made of</b> → composition.', hint: 'Is it about what the substance is made of?' },
        { label: 'Water is made up of hydrogen and oxygen.', bucket: 'c', explain: 'What it is made of → composition.', hint: 'Is it about what the substance is made of?' },
        { label: 'Air contains nitrogen, oxygen and argon.', bucket: 'c', explain: 'What air is made of → composition.', hint: 'Is it about what the substance is made of?' },
        { label: 'Copper is shiny.', bucket: 'p', explain: 'A quality we can use to tell copper apart → property.', hint: 'Is it a quality that helps tell substances apart?' },
        { label: 'Iron is attracted by a magnet.', bucket: 'p', explain: 'A quality that distinguishes iron → property.', hint: 'Is it a quality that helps tell substances apart?' },
        { label: 'Sulphur floats on water.', bucket: 'p', explain: 'A quality that distinguishes sulphur → property.', hint: 'Is it a quality that helps tell substances apart?' }
      ],
      rewardKey: 'c0-comp-prop', xp: 10
    }));
    root.appendChild(sortP);

    const br = note('Branches of chemistry', '<p>There are various branches of chemistry. Examples include:</p>');
    br.appendChild(branchExplorer());
    root.appendChild(br);
    root.appendChild(branchBlaster());

    const ex = note('Chemistry is an experimental science', '<ul><li>Chemists in the past (' + T('alchemists', '煉金術士') + ') attempted to make <b>gold</b> from cheap metals by conducting <b>experiments</b>.</li><li>These experiments gathered valuable information about the <b>properties of matter</b>.</li><li>We often do experiments in the school ' + T('laboratory', '實驗室') + '. Always remember:</li></ul><div class="c0-quote">“Laboratory safety is the first priority in all experimental work.”</div>');
    root.appendChild(ex);
    root.appendChild(alchemist());
    root.appendChild(journey());
    root.appendChild(clozeCard('Chemistry is the study of [[matter]], such as their [[composition]] and [[properties]]. Chemistry is an [[experimental]] science. Laboratory [[safety]] is the first priority in all experimental work.', 'c0-cloze-1'));
    api.quickCheck(root, 'ch0', 'ch0-1', 5);
  }

  /* =========================================================
     LESSON 0.2 (1) — Students’ discipline in the laboratory
     ========================================================= */
  const FACILITIES = [
    { id: 'fume', name: 'Fume cupboard', zh: '煙櫥', use: 'Experiments involving the <b>use or formation of toxic gas</b> must be carried out here.', box: [10, 0, 144, 372] },
    { id: 'ext', name: 'Fire extinguisher', zh: '滅火筒', use: '<b>Fire-fighting equipment.</b>', box: [158, 264, 58, 108] },
    { id: 'sand', name: 'Sand bucket', zh: '沙桶', use: '<b>Fire-fighting equipment.</b>', box: [218, 298, 64, 74] },
    { id: 'blanket', name: 'Fire blanket', zh: '滅火氈', use: '<b>Fire-fighting equipment.</b>', box: [408, 40, 88, 116] },
    { id: 'aid', name: 'First aid materials', zh: '急救用品', use: '<b>Emergency equipment.</b>', box: [166, 104, 86, 82] },
    { id: 'eye', name: 'Eye-wash bottle', zh: '洗眼瓶', use: '<b>Emergency equipment.</b>', box: [254, 78, 64, 106] },
    { id: 'sink', name: 'Sink', zh: '水槽', use: 'Wash your hands after experiments, and wash chemicals off your skin with <b>plenty of cold running water</b>. Never put insoluble solids, filter papers or used organic solvents into it!', box: [318, 194, 94, 78] },
    { id: 'waste', name: 'Waste bottle', zh: '廢物瓶', use: 'Insoluble solids, filter papers and used organic solvents are collected here — <b>not</b> in the sink.', box: [422, 166, 72, 92] }
  ];
  const ink = { stroke: 'var(--ink)', 'stroke-width': 1.8 };
  function drawFacility(id) {
    const a = o => Object.assign({}, ink, o);
    switch (id) {
      case 'fume': {
        const fan = G({ transform: 'translate(82 34)' }, h('circle', { r: 13, class: 'c0-metal2' }), G({ class: 'c0-spin' }, P('M0 0L0-10M0 0L8.7 5M0 0L-8.7 5', 'c0-out')));
        return G({}, h('rect', { x: 62, y: 0, width: 40, height: 86, class: 'c0-metal' }), fan,
          h('rect', { x: 14, y: 84, width: 136, height: 288, rx: 6, class: 'c0-metal' }),
          h('rect', a({ x: 26, y: 100, width: 112, height: 188, rx: 3, fill: 'var(--bg-soft)', 'stroke-width': 1.5 })),
          P('M70 282L76 262L76 250L88 250L88 262L94 282Z', 'c0-glassfill'), P('M70 282L76 262L76 250L88 250L88 262L94 282Z', 'c0-thin'),
          h('rect', a({ x: 26, y: 100, width: 112, height: 112, rx: 3, fill: '#bfe3ff', 'fill-opacity': .45, 'stroke-width': 1.5 })),
          P('M40 112L60 150M52 112L70 146', 'c0-shine'),
          h('rect', { x: 58, y: 206, width: 48, height: 7, rx: 3.5, class: 'c0-metal2' }),
          h('rect', { x: 18, y: 286, width: 128, height: 9, class: 'c0-top' }),
          P('M82 300V366', 'c0-cabln'), h('circle', { cx: 74, cy: 334, r: 2.5, class: 'c0-metal2' }), h('circle', { cx: 90, cy: 334, r: 2.5, class: 'c0-metal2' }));
      }
      case 'ext': return G({},
        P('M199 300Q216 306 211 334Q208 352 197 354', '', { fill: 'none', stroke: '#222', 'stroke-width': 4, 'stroke-linecap': 'round' }),
        h('rect', a({ x: 172, y: 296, width: 30, height: 76, rx: 11, fill: '#e53935' })),
        h('rect', { x: 176, y: 318, width: 22, height: 26, rx: 3, fill: '#fff', stroke: '#b71c1c', 'stroke-width': 1 }),
        h('rect', { x: 181, y: 284, width: 12, height: 13, rx: 2, fill: '#333' }),
        P('M187 285L176 275H197', '', { fill: 'none', stroke: '#333', 'stroke-width': 3.5, 'stroke-linecap': 'round' }));
      case 'sand': return G({},
        P('M226 324Q251 300 276 324', '', { fill: 'none', stroke: '#666', 'stroke-width': 2.5 }),
        P('M220 324L282 324L274 372L228 372Z', '', a({ fill: '#e53935' })),
        h('ellipse', a({ cx: 251, cy: 325, rx: 30, ry: 5, fill: '#e2c48c', 'stroke-width': 1.4 })),
        TXT(251, 354, 'SAND', 'c0-tc c0-tw', { 'font-size': 11 }));
      case 'blanket': return G({},
        h('rect', { x: 434, y: 128, width: 8, height: 20, rx: 2, fill: '#222' }), h('rect', { x: 462, y: 128, width: 8, height: 20, rx: 2, fill: '#222' }),
        h('rect', a({ x: 420, y: 52, width: 64, height: 80, rx: 5, fill: '#d32f2f' })),
        TXT(452, 86, 'FIRE', 'c0-tc c0-tw', { 'font-size': 12 }), TXT(452, 101, 'BLANKET', 'c0-tc c0-tw', { 'font-size': 9.5 }));
      case 'aid': return G({},
        P('M196 121Q208 108 220 121', '', { fill: 'none', stroke: 'var(--ink)', 'stroke-width': 2.5 }),
        h('rect', a({ x: 174, y: 120, width: 68, height: 56, rx: 7, fill: '#2e9d5b' })),
        P('M208 132V164M192 148H224', '', { stroke: '#fff', 'stroke-width': 8 }));
      case 'eye': return G({},
        h('rect', { x: 262, y: 168, width: 46, height: 8, rx: 2, class: 'c0-metal2' }),
        h('rect', a({ x: 271, y: 112, width: 28, height: 56, rx: 9, fill: '#f5f7fa' })),
        h('rect', a({ x: 278, y: 100, width: 14, height: 13, rx: 3, fill: '#2b7de9', 'stroke-width': 1.4 })),
        P('M285 100Q285 88 298 90', '', { fill: 'none', stroke: '#2b7de9', 'stroke-width': 4, 'stroke-linecap': 'round' }),
        h('ellipse', { cx: 285, cy: 140, rx: 9, ry: 5.5, fill: '#fff', stroke: '#2b7de9', 'stroke-width': 1.8 }), h('circle', { cx: 285, cy: 140, r: 3, fill: '#2b7de9' }));
      case 'sink': return G({},
        P('M392 252V214Q392 204 382 204H374Q366 204 366 212V220', '', { fill: 'none', stroke: 'var(--c0-metal-2)', 'stroke-width': 5, 'stroke-linecap': 'round' }),
        h('rect', { x: 386, y: 246, width: 12, height: 7, rx: 2, class: 'c0-metal2' }),
        h('rect', a({ x: 326, y: 252, width: 78, height: 12, rx: 3, fill: 'var(--c0-metal-2)', 'stroke-width': 1.5 })));
      case 'waste': return G({},
        h('rect', a({ x: 434, y: 196, width: 46, height: 56, rx: 8, fill: '#b8742a', 'fill-opacity': .9 })),
        h('rect', a({ x: 448, y: 184, width: 18, height: 13, fill: '#b8742a', 'stroke-width': 1.5 })),
        h('rect', { x: 445, y: 177, width: 24, height: 8, rx: 2, fill: '#333' }),
        h('rect', { x: 438, y: 212, width: 38, height: 22, rx: 3, fill: '#fff', stroke: '#333', 'stroke-width': 1 }),
        TXT(457, 227, 'WASTE', 'c0-tc c0-tdark', { 'font-size': 9 }));
    }
    return G();
  }
  // standalone picture of one facility (for exam figures)
  function facilityFig(id, label) {
    const f = FACILITIES.find(x => x.id === id), [x, y, w, hh] = f.box;
    const ht = Math.min(200, (hh + 20) * 1.4);
    const s = svg(w + 20, hh + 20, label || 'A piece of laboratory equipment', { viewBox: (x - 10) + ' ' + (y - 10) + ' ' + (w + 20) + ' ' + (hh + 20), style: { height: ht + 'px', width: n1(ht * (w + 20) / (hh + 20)) + 'px' } });
    s.append(h('rect', { x: x - 10, y: y - 10, width: w + 20, height: hh + 20, class: 'c0-wall' }));
    if (id === 'sink') s.append(h('rect', { x: x - 10, y: 252, width: w + 20, height: 10, class: 'c0-top' }), h('rect', { x: x - 10, y: 262, width: w + 20, height: hh, class: 'c0-cab' }));
    s.appendChild(drawFacility(id));
    return s;
  }
  function labMap() {
    const card = A.playCard('Lab tour: where is everything?', 'Tap things to explore the lab. Then take the <b>Find it!</b> challenge.', '🗺️ Explore');
    const W = 520, H = 400, s = svg(W, H, 'A school laboratory with its safety facilities');
    wall(s, W, H);
    s.append(h('rect', { x: 0, y: 372, width: W, height: 28, class: 'c0-floor' }),
      h('rect', { x: 286, y: 262, width: 234, height: 110, class: 'c0-cab' }), P('M364 268V372M442 268V372', 'c0-cabln'), h('rect', { x: 286, y: 252, width: 234, height: 10, class: 'c0-top' }));
    FACILITIES.forEach(f => s.appendChild(drawFacility(f.id)));
    const marks = G(), hits = G();
    s.append(marks, hits);
    const prompt = h('div', { class: 'c0-clue', html: '👆 Tap anything in the lab.' });
    const panel = h('div', { class: 'c0-info', html: 'There are <b>8</b> things to find: emergency equipment, fire-fighting equipment and more.' });
    const timeEl = h('span', { class: 'c0-pill', text: '' });
    const startB = btn('🎯 Start “Find it!”', startFind, 'btn-primary');
    const prev = bestTime('labmap');
    const bestEl = h('span', { class: 'tiny', text: prev != null ? '🏅 Best: ' + prev.toFixed(1) + ' s' : '' });
    const seen = new Set();
    let mode = 'explore', order = [], k = 0, t0 = 0, miss = 0, tick = null;
    function ring(f, cls, temp) {
      const [x, y, w, hh] = f.box;
      const r = h('rect', { x: x + 2, y: y + 2, width: w - 4, height: hh - 4, rx: 12, class: cls });
      marks.appendChild(r);
      if (temp) A.later(() => r.remove(), temp);
      return r;
    }
    function tap(f) {
      if (mode === 'explore') {
        marks.innerHTML = ''; ring(f, 'c0-sel');
        info(panel, '<b>' + f.name + '</b> <span class="zh">' + f.zh + '</span><br>' + f.use);
        A.sound('pop'); seen.add(f.id);
        if (seen.size === FACILITIES.length) A.reward('c0-labtour', 5, 'Lab tour');
        return;
      }
      const want = order[k];
      if (f.id === want.id) {
        ring(f, 'c0-ring good'); A.sound('good');
        k++;
        if (k >= order.length) return endFind();
        ask();
      } else {
        miss++; t0 -= 2000; ring(f, 'c0-ring bad', 500); A.sound('bad');
        info(panel, '✗ That is the <b>' + f.name.toLowerCase() + '</b>. (+2 s)', 'bad');
      }
    }
    function ask() { prompt.innerHTML = 'Find the <b>' + order[k].name.toLowerCase() + '</b> (' + (k + 1) + '/' + order.length + ')'; if (k) info(panel, '✓ Nice! Keep going…', 'good'); }
    function startFind() {
      mode = 'find'; order = A.shuffle(FACILITIES); k = 0; miss = 0; t0 = performance.now(); marks.innerHTML = '';
      startB.style.display = 'none'; info(panel, 'Tap the right thing as fast as you can!'); ask();
      if (tick) clearInterval(tick);
      tick = A.every(() => { timeEl.textContent = '⏱ ' + ((performance.now() - t0) / 1000).toFixed(1) + ' s'; }, 100);
    }
    function endFind() {
      clearInterval(tick);
      const secs = Math.round((performance.now() - t0) / 100) / 10;
      timeEl.textContent = '⏱ ' + secs.toFixed(1) + ' s';
      const pb = bestTime('labmap', secs), isBest = pb == null || secs < pb;
      prompt.innerHTML = '🏁 All 8 found in <b>' + secs.toFixed(1) + ' s</b>' + (isBest ? ' — new best!' : '');
      info(panel, miss ? miss + ' wrong tap' + (miss > 1 ? 's' : '') + '. You now know where everything is!' : 'Perfect — no wrong taps! You know your lab.', 'good');
      bestEl.textContent = '🏅 Best: ' + (isBest ? secs : pb).toFixed(1) + ' s';
      A.sound('win'); A.celebrate(.5); A.reward('c0-labmap', 15, 'Find it!');
      mode = 'explore'; startB.innerHTML = '↻ Play again'; startB.style.display = '';
    }
    FACILITIES.forEach(f => {
      const [x, y, w, hh] = f.box;
      const r = h('rect', { x, y, width: w, height: hh, rx: 10, class: 'c0-hit', tabindex: 0, role: 'button', 'aria-label': f.name });
      r.addEventListener('click', () => tap(f));
      r.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tap(f); } });
      hits.appendChild(r);
    });
    card.body.append(prompt, h('div', { class: 'c0-stage', style: { maxWidth: '620px', margin: '0 auto' } }, s), panel, h('div', { class: 'c0-row c0-mt' }, startB, timeEl, bestEl));
    return card;
  }

  function coMolecule() {
    return G({}, h('circle', { cx: -3.6, cy: 0, r: 4.6, fill: 'var(--atom-C)', stroke: 'var(--atom-stroke)', 'stroke-width': 1 }), h('circle', { cx: 3.6, cy: 0, r: 4.6, fill: 'var(--atom-O)', stroke: 'var(--atom-stroke)', 'stroke-width': 1 }));
  }
  function coSim() {
    const card = A.playCard('Where should you burn carbon?', 'Burning carbon may give <b>' + T('carbon monoxide', '一氧化碳') + '</b> gas as a side product. Pick a place to do the experiment.', '🧪 Simulation');
    const W = 360, H = 230;
    const stage = h('div', { class: 'c0-stage c0-w-md' });
    const fb = h('div', { class: 'c0-info', html: '👇 Choose a place. <span class="muted">(The little red-and-grey particles show the carbon monoxide gas.)</span>' });
    let runId = 0;
    const bBench = btn('🪑 On the open bench', () => run('bench')), bFume = btn('🌀 In the fume cupboard', () => run('fume'));
    function draw(mode) {
      const s = svg(W, H, mode === 'fume' ? 'Carbon burning inside a fume cupboard' : 'Carbon burning on an open bench, next to a student');
      wall(s, W, H);
      const who = G();
      who.appendChild(person({ x: 292, y: 104, dir: -1, goggles: true, hair: 'tied', hairCol: '#4a2c1a', hands: [[276, 182], [310, 182]] }));
      s.appendChild(who);
      if (mode === 'fume') {
        s.append(h('rect', { x: 100, y: 0, width: 40, height: 22, class: 'c0-metal' }),
          G({ transform: 'translate(120 11)' }, h('circle', { r: 8, class: 'c0-metal2' }), G({ class: 'c0-spin' }, P('M0 0V-6M0 0L5.2 3M0 0L-5.2 3', 'c0-thin'))),
          h('rect', { x: 34, y: 20, width: 172, height: 172, rx: 4, class: 'c0-metal' }),
          h('rect', { x: 44, y: 30, width: 152, height: 160, fill: 'var(--bg-soft)', stroke: 'var(--ink)', 'stroke-width': 1.4 }));
      }
      bench(s, W, H, 190, 120);
      const burner = bunsen(120, 190, .62, 'blue'); s.appendChild(burner.node);
      s.append(P('M96 128L90 190M144 128L150 190M120 128L120 150', 'c0-thin', { style: { strokeWidth: '2.5px' } }), P('M92 128H148', 'c0-out'),
        P('M106 110L134 110L130 127L110 127Z', 'c0-metal'),
        h('ellipse', { cx: 114, cy: 110, rx: 5, ry: 3.5, fill: '#222', stroke: '#ff7a1a', 'stroke-width': 1.5 }), h('ellipse', { cx: 125, cy: 109, rx: 6, ry: 4, fill: '#222', stroke: '#ff7a1a', 'stroke-width': 1.5 }));
      if (mode === 'fume') s.appendChild(h('rect', { x: 44, y: 30, width: 152, height: 66, fill: '#bfe3ff', 'fill-opacity': .4, stroke: 'var(--ink)', 'stroke-width': 1.4 }));
      const gas = G(); s.appendChild(gas);
      stage.innerHTML = ''; stage.appendChild(s);
      return { s, gas, who };
    }
    function run(mode) {
      const id = ++runId;
      const sc = draw(mode);
      bBench.disabled = bFume.disabled = true;
      info(fb, mode === 'fume' ? '🌀 Burning carbon inside the fume cupboard…' : '🔥 Burning carbon on the open bench…');
      const parts = [];
      let t = 0, spawn = 0, reacted = false;
      A.sound('whoosh');
      A.loop(dt => {
        if (id !== runId) return false;
        t += dt; spawn += dt;
        if (t < 3.2 && spawn > .14) {
          spawn = 0;
          const g = coMolecule(); sc.gas.appendChild(g);
          parts.push({ g, x: 118 + R() * 6, y: 104, vx: mode === 'fume' ? (R() - .5) * 20 : 20 + R() * 30, vy: mode === 'fume' ? -55 - R() * 25 : -14 - R() * 16, life: 0 });
        }
        parts.forEach(p => {
          p.life += dt;
          if (mode === 'fume') { p.vx += (120 - p.x) * dt * 1.5; p.x += p.vx * dt; p.y += p.vy * dt; if (p.y < 2) p.g.style.display = 'none'; }
          else { p.x += p.vx * dt + Math.sin(p.life * 3 + p.y) * .3; p.y += p.vy * dt; if (p.x > 250) { p.vx *= .96; } if (p.y < 60) p.vy = Math.abs(p.vy) * .3; if (p.x > 345) p.vx = -Math.abs(p.vx); }
          place(p.g, p.x, p.y);
        });
        if (!reacted && t > 2.2) {
          reacted = true;
          if (mode === 'bench') {
            sc.who.innerHTML = '';
            sc.who.appendChild(person({ x: 292, y: 104, dir: -1, goggles: true, hair: 'tied', hairCol: '#4a2c1a', eyes: 'closed', mouth: 'worried', hands: [[278, 122, 270, 150], [310, 182]] }));
            sc.who.appendChild(TXT(300, 78, 'cough!', 'c0-tc', { 'font-size': 12, style: { fill: 'var(--bad)' } }));
            A.sound('bad');
            info(fb, '⚠️ <b>Carbon monoxide gas is toxic!</b> On an open bench it spreads into the lab. Experiments involving the use or formation of <b>toxic</b> gas must be carried out in the <b>fume cupboard</b>.', 'bad');
          } else {
            A.sound('good');
            info(fb, '✅ <b>Correct!</b> The experiment should be carried out in the <b>fume cupboard</b> because carbon monoxide gas is <b>toxic</b>.', 'good');
            if (A.reward('c0-co-sim', 10, 'Fume cupboard')) A.celebrate(.35);
          }
        }
        if (t > 4) { bBench.disabled = bFume.disabled = false; if (t > 8) return false; }
      });
    }
    draw('bench');
    card.body.append(stage, h('div', { class: 'c0-ctrl c0-w-md' }, bBench, bFume), fb);
    return card;
  }

  const RULE_CARDS = [
    { e: '🚪', t: 'The lab door is open but no teacher is there yet. Ken walks in to get ready.', ok: false, why: 'Rule 1: Do <b>NOT</b> enter the laboratory unless a teacher is present.' },
    { e: '🎒', t: 'Amy puts a test tube in her bag to finish the experiment at home.', ok: false, why: 'Rule 2: Do <b>NOT</b> take anything away from the laboratory.' },
    { e: '🏃', t: 'Two boys race each other to the sink.', ok: false, why: 'Rule 3: <b>Never</b> rush around or play in the laboratory.' },
    { e: '🥤', t: 'Sam takes a quick sip of his drink at the bench.', ok: false, why: 'Rule 4: Eating, <b>drinking</b> and smoking are strictly forbidden.' },
    { e: '👅', t: 'Mia tastes a white powder to check whether it is salt.', ok: false, why: 'Rule 4: <b>Never taste</b> or touch chemicals.' },
    { e: '🖐️', t: 'Joe picks up a solid chemical with his fingers to look at it closely.', ok: false, why: 'Rule 4: Never taste or <b>touch</b> chemicals.' },
    { e: '🔥', t: 'Jay leaves his experiment heating and goes to chat with friends.', ok: false, why: 'Rule 5: Do not leave your bench unless necessary. Experiments under way should <b>not be left unattended</b>.' },
    { e: '💥', t: 'Leo breaks a beaker and tells the teacher straight away.', ok: true, why: 'Rule 6: Report all accidents and breakages to the teacher <b>immediately</b> — otherwise students nearby are responsible for the damages.' },
    { e: '☠️', t: 'An experiment forms a toxic gas, so Ivy does it in the fume cupboard.', ok: true, why: 'Rule 7: Experiments involving the use or formation of <b>toxic</b> gas must be carried out in the <b>fume cupboard</b>.' },
    { e: '🧻', t: 'Some solution spills on the bench. Tom cleans it up at once.', ok: true, why: 'Rule 8: Clean up all spillages (on floor or bench) <b>at once</b>.' },
    { e: '🏷️', t: 'Kay returns the reagent bottle to its original place, with the label facing the front.', ok: true, why: 'Rule 9: Return bottles to their original places immediately after use, with their <b>labels facing the front</b>.' },
    { e: '↩️', t: 'Ben took too much solution, so he pours the extra back into the reagent bottle.', ok: false, why: 'Rule 10: Chemicals taken out should <b>never be poured back</b>. Work out the quantity needed beforehand to avoid excess and wastage.' },
    { e: '🚰', t: 'Zoe throws a used filter paper into the sink.', ok: false, why: 'Rule 11: Insoluble solids, filter papers and used organic solvents must <b>not</b> go into the sink — use the <b>waste bottle</b>.' },
    { e: '🗑️', t: 'Max pours used organic solvent into the waste bottle.', ok: true, why: 'Rule 11: Waste is collected in the <b>waste bottle</b>.' }
  ];

  function renderRules(root, api) {
    const n1c = note('General rules', '<ol><li>Do <b>NOT</b> enter the laboratory unless a <b>teacher</b> is present.</li><li>Do <b>NOT</b> take anything away from the laboratory.</li><li><b>Never</b> rush around or play in the laboratory.</li><li><b>Eating, drinking and smoking</b> are strictly forbidden. <b>Never taste or touch chemicals.</b></li></ol>', '(1) Students’ discipline');
    n1c.appendChild(h('div', { class: 'c0-icons' }, [['🙋', 'Ask for assistance'], ['🥼', 'Dress properly'], ['🧽', 'Keep area clean'], ['🧼', 'Wash hands'], ['🚫', 'Do not eat']].map(([e, t]) => h('div', { class: 'c0-icon' }, h('span', { text: e }), h('span', { text: t })))));
    root.appendChild(n1c);
    root.appendChild(labMap());
    root.appendChild(note('Accidents & spillage', '<ol start="5"><li>Do <b>not</b> leave your bench unless it is necessary. Experiments under way should <b>not</b> be left unattended.</li><li>Report all accidents and breakages to the teacher <b>immediately</b>. Otherwise, student(s) nearby will be responsible for the damages made.</li><li>Experiments involving the use or formation of ' + T('toxic', '有毒的') + ' gas must be carried out in the ' + T('fume cupboard', '煙櫥') + '.</li><li>Clean up all spillages (on floor or bench) <b>at once</b>. Clean up the bench after the experiment.</li></ol>'));
    root.appendChild(coSim());
    root.appendChild(clozeCard('Burning carbon may give carbon monoxide gas as a side product. The experiment should be carried out in the [[fume cupboard|fume-cupboard]]. It is because carbon monoxide [[gas]] is [[toxic]].', 'c0-cloze-co', 'Example: explain where'));
    root.appendChild(note('Clean-up after experiments', '<ol start="9"><li>Return the bottles to their original places immediately after use, with their <b>labels facing the front</b>.</li><li>Chemicals taken out from a container or ' + T('reagent bottle', '試劑瓶') + ' should <b>never be poured back</b>. Work out the quantities needed beforehand to avoid undue excess and wastage.</li><li>Do not dispose of insoluble solids, filter papers or used organic solvents into the <b>sink</b>. Waste is collected in the ' + T('waste bottle', '廢物瓶') + '.</li></ol>'));
    const deck = api.playCard('Rule breaker or rule follower?', 'Read each card. Is the student following the lab rules?', '⚡ Quick-fire');
    deck.body.appendChild(yesNoDeck({ cards: RULE_CARDS, yes: '👍 Follows the rules', no: '🚫 Breaks a rule', yesWord: 'This follows the rules.', noWord: 'This breaks a rule.', intro: 'Decide for each card.', prompt: 'Next card — follows or breaks the rules?', score: deck.score, rewardKey: 'c0-rules-deck', xp: 15, reason: 'Lab rules' }));
    root.appendChild(deck);
    root.appendChild(clozeCard(['Students should NOT enter the laboratory unless a [[teacher]] is present. Eating, drinking and smoking are strictly [[forbidden|prohibited]].', 'Report all accidents and breakages to the teacher [[immediately]]. Return bottles with their [[labels|label]] facing the front. Chemicals taken out should never be [[poured back]]. Filter papers go into the [[waste bottle]], not the sink.'], 'c0-cloze-2'));
    api.quickCheck(root, 'ch0', 'ch0-2', 5);
  }

  /* =========================================================
     LESSON 0.2 (2) — Safety precautions
     ========================================================= */
  const GEAR_TASKS = [
    { e: '🔥', t: 'Heating chemicals in a test tube', need: ['goggles', 'hair'], eyes: '<b>heating</b> chemicals is a risk to the eyes' },
    { e: '⚗️', t: 'Handling concentrated sulphuric acid (a corrosive acid)', need: ['goggles', 'gloves', 'hair'], eyes: 'handling <b>acidic</b> or other corrosive chemicals is a risk to the eyes' },
    { e: '🧴', t: 'Handling sodium hydroxide solution (an alkali)', need: ['goggles', 'gloves', 'hair'], eyes: 'handling <b>alkali</b> or other corrosive chemicals is a risk to the eyes' },
    { e: '💥', t: 'Carrying out a violent or exothermic reaction', need: ['goggles', 'hair'], eyes: '<b>violent or exothermic</b> reactions are a risk to the eyes' }
  ];
  function gearUp() {
    const card = A.playCard('Gear up!', 'Get the student ready for each task, then press <b>Start</b>. Think: what does the book say you need?', '🥽 Dress up');
    const gear = { goggles: false, gloves: false, hair: false };
    let round = 0, tries = 0, perfect = 0;
    const stage = h('div', { class: 'c0-stage', style: { maxWidth: '300px', margin: '0 auto' } });
    const task = h('div', { class: 'c0-clue' });
    const fb = h('div', { class: 'c0-info', html: 'Tap the gear buttons to put things on.' });
    const toggles = {
      goggles: btn('🥽 Goggles', () => flip('goggles'), 'c0-toggle', { 'aria-pressed': 'false' }),
      gloves: btn('🧤 Gloves', () => flip('gloves'), 'c0-toggle', { 'aria-pressed': 'false' }),
      hair: btn('🎀 Tie hair', () => flip('hair'), 'c0-toggle', { 'aria-pressed': 'false' })
    };
    const startB = btn('▶ Start experiment', check, 'btn-primary');
    const nextB = btn('Next task →', () => { round++; setup(); }, 'btn-primary');
    function avatar(face) {
      const s = svg(220, 200, 'A student getting ready for an experiment');
      wall(s, 220, 200);
      const p = person({ x: 110, y: 64, dir: 1, hair: gear.hair ? 'tied' : 'long', hairLen: 50, hairCol: '#3b2417', goggles: gear.goggles, gloves: gear.gloves, mouth: face || 'smile', eyes: face === 'worried' ? 'closed' : 'dot', hands: [[84, 120, 86, 104], [136, 120, 134, 104]] });
      s.appendChild(G({ transform: 'translate(110 64) scale(1.5) translate(-110 -64)' }, p));
      if (face === 'worried' && !gear.goggles) [[142, 52], [150, 62], [140, 70]].forEach(([x, y]) => s.appendChild(h('circle', { cx: x, cy: y, r: 3.5, fill: '#7fc4ef', stroke: 'var(--ink)', 'stroke-width': 1 })));
      if (face === 'smile' && round >= 0 && card._ok) s.appendChild(TXT(186, 40, '✓', 'c0-tc', { 'font-size': 30, style: { fill: 'var(--good)' } }));
      stage.innerHTML = ''; stage.appendChild(s);
    }
    function flip(k) {
      gear[k] = !gear[k]; toggles[k].setAttribute('aria-pressed', String(gear[k])); card._ok = false;
      A.sound('click'); avatar();
    }
    function setup() {
      if (round >= GEAR_TASKS.length) return finish();
      Object.keys(gear).forEach(k => { gear[k] = false; toggles[k].setAttribute('aria-pressed', 'false'); toggles[k].disabled = false; });
      card._ok = false; tries = 0;
      task.innerHTML = GEAR_TASKS[round].e + ' Task ' + (round + 1) + '/4: ' + GEAR_TASKS[round].t;
      startB.style.display = ''; nextB.style.display = 'none';
      info(fb, 'Put on what this task needs, then press Start.');
      card.score.textContent = round + ' / ' + GEAR_TASKS.length;
      avatar();
    }
    function check() {
      const tk = GEAR_TASKS[round];
      const missing = tk.need.filter(k => !gear[k]);
      tries++;
      if (missing.length) {
        const why = { goggles: '🥽 Wear <b>eye protection</b> (safety spectacles / goggles) — ' + tk.eyes + '.', gloves: '🧤 Wear <b>protective gloves</b> when handling corrosive chemicals.', hair: '🎀 <b>Long hair</b> must be securely tied.' };
        info(fb, '❌ <b>Not safe yet!</b><br>' + missing.map(k => why[k]).join('<br>'), 'bad');
        A.sound('bad'); avatar('worried'); shakeEl(stage);
        return;
      }
      if (tries === 1) perfect++;
      card._ok = true;
      const extra = gear.gloves && !tk.need.includes('gloves') ? '<br><span class="muted">(Gloves are fine, but the book only requires them for <b>corrosive</b> chemicals.)</span>' : '';
      info(fb, '✅ <b>Safe to start!</b> ' + tk.need.map(k => ({ goggles: 'Eye protection ✓', gloves: 'Gloves ✓', hair: 'Hair tied ✓' })[k]).join(' · ') + extra, 'good');
      A.sound('good'); avatar('smile');
      Object.values(toggles).forEach(b => { b.disabled = true; });
      startB.style.display = 'none'; nextB.style.display = ''; nextB.textContent = round + 1 < GEAR_TASKS.length ? 'Next task →' : 'Finish';
      card.score.textContent = (round + 1) + ' / ' + GEAR_TASKS.length;
    }
    function finish() {
      task.innerHTML = '🏁 All 4 tasks done!';
      info(fb, (perfect === 4 ? '🏆 Perfect — right first time, every time! ' : '👍 Well done! ') + 'Remember: <b>goggles</b> for heating, corrosive chemicals and violent/exothermic reactions; <b>gloves</b> for corrosive chemicals; <b>long hair tied</b> always.', 'good');
      Object.values(toggles).forEach(b => { b.disabled = true; });
      startB.style.display = 'none'; nextB.style.display = 'none';
      A.sound('win'); A.celebrate(.5); A.reward('c0-gearup', 15, 'Gear up');
      replay.style.display = '';
    }
    const replay = btn('↻ Play again', () => { round = 0; perfect = 0; replay.style.display = 'none'; setup(); }, 'btn-sm');
    replay.style.display = 'none';
    card.body.append(task, stage, h('div', { class: 'c0-ctrl' }, toggles.goggles, toggles.gloves, toggles.hair), h('div', { class: 'c0-row c0-mt', style: { justifyContent: 'flex-end' } }, replay, startB, nextB), fb);
    setup();
    return card;
  }

  /* ---------- Spot the hazard: four lab benches ---------- */
  const SW = 400, SH = 260, BY = 188;
  function tubeAt(x, y, rot, o) { // small test tube whose BOTTOM is at (x,y), rotated about it
    const t = testTube(Object.assign({ x: 0, top: -(o && o.H || 42), H: o && o.H || 42, W: o && o.W || 13, thin: true, level: .4, color: COLOURLESS }, o || {}));
    return G({ transform: 'translate(' + x + ' ' + y + ') rotate(' + (rot || 0) + ')' }, t.node);
  }
  const holder = (x1, y1, x2, y2) => P('M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2, '', { stroke: '#c8955a', 'stroke-width': 3.5, 'stroke-linecap': 'round' });
  const drops = (pts, col) => G({}, ...pts.map(([x, y, r]) => h('circle', { cx: x, cy: y, r: r || 2.6, fill: col || '#9fd3f5', stroke: 'var(--ink)', 'stroke-width': .9 })));
  const lines = d => P(d, 'c0-thin');
  const wisp = (d, col) => P(d, 'c0-wisp', col ? { style: { stroke: col } } : null);
  function flammableSign(x, y) {
    return G({ transform: 'translate(' + x + ' ' + y + ')' }, h('polygon', { points: '0,-11 11,0 0,11 -11,0', fill: '#fff', stroke: '#e53935', 'stroke-width': 2.2 }), P('M-3.5 5C-5 1-1-1-1-5C1-2 1-4 2-6C4-2 5 2 3.5 5Z', '', { fill: '#222' }));
  }
  const HAZ_SCENES = [
    function bench1(s) {
      wall(s, SW, SH);
      s.append(person({ x: 58, y: 112, hair: 'short', hairCol: '#3a2a20', goggles: true, mouth: 'open', hands: [[44, 184], [74, 124, 86, 150]] }),
        person({ x: 152, y: 120, hair: 'tied', hairCol: '#5a3825', goggles: true, eyes: 'closed', mouth: 'flat', hands: [[151, 170, 134, 170], [163, 172, 172, 178]] }),
        person({ x: 248, y: 112, hair: 'short', hairCol: '#1f1a17', goggles: true, hands: [[270, 132, 256, 150], [286, 168, 282, 152]] }));
      bench(s, SW, SH, BY);
      s.append(G({ transform: 'translate(79 119) rotate(-14)' }, h('rect', { x: -11, y: -5, width: 22, height: 10, rx: 3, fill: '#e8c07d', stroke: '#9c6f3c', 'stroke-width': 1.2 }), P('M-11 0.5H11', '', { stroke: '#43a047', 'stroke-width': 2.4 })),
        tubeAt(157, 184, 0), wisp('M159 140q4-4 0-8q-4-4 0-8'), wisp('M153 141q-4-4 0-7'), TXT(186, 112, 'sniff!', 'c0-tc', { 'font-size': 10, style: { fill: 'var(--ink-2)' } }),
        tubeAt(288, 184, 0), wisp('M287 138q-4-10-12-10q-8 0-12-8'), lines('M280 120q5 7 0 14M286 116q8 11 0 22'));
      s.appendChild(person({ x: 352, y: 102, hair: 'short', hairCol: '#6b3b1f', goggles: true, mouth: 'open', hands: [[326, 148, 322, 130], [378, 126, 380, 146]], legs: [[345, 194, 330, 220, 318, 244], [359, 194, 376, 212, 388, 236]] }));
      s.appendChild(lines('M322 204h-16M318 220h-22M322 236h-14'));
      return [
        { box: [16, 92, 84, 98], title: 'Eating in the lab', rule: 'Eating, drinking and smoking are <b>strictly forbidden</b> in the laboratory.' },
        { box: [116, 100, 74, 90], title: 'Smelling a gas directly', rule: '<b>Never smell gases directly.</b> ‘Fan’ a little of the gas towards your nose.' },
        { box: [210, 92, 94, 98], safe: true, title: 'Fanning the gas', rule: 'This student ‘fans’ a little of the gas towards the nose — the <b>correct</b> way to smell a gas. Not a hazard!' },
        { box: [306, 80, 92, 176], title: 'Running in the lab', rule: '<b>Never rush around or play</b> in the laboratory.' }
      ];
    },
    function bench2(s) {
      wall(s, SW, SH);
      s.append(person({ x: 44, y: 110, hair: 'short', hairCol: '#2d2420', goggles: true, hands: [[30, 184], [80, 140, 66, 154]] }),
        person({ x: 152, y: 112, dir: -1, hair: 'tied', hairCol: '#1f1a17', goggles: true, eyes: 'wide', mouth: 'open', hands: [[136, 184], [170, 184]] }),
        person({ x: 242, y: 92, hair: 'short', hairCol: '#5a3825', goggles: true, eyes: 'down', mouth: 'flat', hands: [[226, 184], [262, 134, 266, 152]] }),
        person({ x: 328, y: 120, hair: 'long', hairLen: 50, hairCol: '#4a2c1a', goggles: true, hands: [[312, 184], [366, 178, 362, 162]] }));
      bench(s, SW, SH, BY);
      const b1 = bunsen(92, BY, .6, 'blue'), b2 = bunsen(244, BY, .5, 'blue'), b3 = bunsen(343, BY, .6, 'blue');
      s.append(b1.node, tubeAt(90, 144, 52), holder(80, 140, 104, 132), drops([[133, 112], [139, 106, 2], [137, 118, 2]]), TXT(152, 86, '!', 'c0-tc', { 'font-size': 20, style: { fill: 'var(--bad)' } }),
        b2.node, tubeAt(244, 147, 0, { H: 38, W: 12 }), holder(262, 134, 249, 128),
        b3.node);
      return [
        { box: [14, 86, 166, 104], title: 'Pointing a heated test tube at someone', rule: 'Never point heated vessels (test tubes, flasks etc.) <b>at any person</b>.' },
        { box: [204, 70, 78, 120], title: 'Looking down a heated test tube', rule: '<b>Never look down</b> heated vessels (test tubes, flasks etc.).' },
        { box: [294, 92, 102, 98], title: 'Long hair not tied', rule: '<b>Long hair must be securely tied</b> — here it hangs into the flame!' }
      ];
    },
    function bench3(s) {
      wall(s, SW, SH);
      s.append(person({ x: 50, y: 108, hair: 'short', hairCol: '#3a2a20', goggles: true, gloves: true, hands: [[34, 184], [84, 128, 72, 152]] }),
        person({ x: 324, y: 108, dir: -1, hair: 'short', hairCol: '#1f1a17', goggles: false, hands: [[300, 140, 304, 160], [342, 184]] }));
      bench(s, SW, SH, BY);
      const acid = beaker({ x: 88, y: 160, W: 30, H: 28, level: .5, color: '#efe6c8', op: .75 });
      const water = beaker({ x: -18, y: -16, W: 36, H: 32, level: .45, color: COLOURLESS });
      const bF = bunsen(214, BY, .6, 'luminous'), bH = bunsen(286, BY, .55, 'blue');
      s.append(acid.node, G({ transform: 'translate(96 128) rotate(38)' }, water.node), P('M112 132Q114 146 106 158', '', { fill: 'none', stroke: '#9fd3f5', 'stroke-width': 3.5, 'stroke-linecap': 'round' }),
        drops([[92, 150], [86, 142, 2], [120, 146, 2.2], [126, 152, 1.8], [100, 140, 1.8]]), wisp('M98 156q-5-6 0-12q5-6 0-12'),
        TXT(103, 206, 'conc. acid', 'c0-tc', { 'font-size': 10 }), TXT(140, 124, 'water', 'c0-tc', { 'font-size': 10 }));
      s.append(G({ transform: 'translate(178 188)' }, reagentBottle({ w: 30, h: 44, color: '#e9f2f8', label: false })), flammableSign(178, 166), TXT(186, 206, 'flammable', 'c0-tc', { 'font-size': 10 }),
        bF.node, bH.node, tubeAt(286, 142, -28), holder(300, 140, 280, 126));
      return [
        { box: [14, 86, 118, 104], title: 'Adding water to concentrated acid', rule: 'Add a <b>small volume of concentrated acid to a large volume of water</b>, with stirring — never water to the acid. Mixing is highly exothermic and the corrosive acid may spill out.' },
        { box: [152, 110, 84, 80], title: 'Flammable liquid next to a flame', rule: 'Keep <b>flammable</b> liquids <b>away from flames</b>.' },
        { box: [256, 86, 112, 104], title: 'Heating without eye protection', rule: 'Wear <b>eye protection</b> (safety spectacles / goggles) when <b>heating</b> chemicals.' }
      ];
    },
    function bench4(s) {
      wall(s, SW, SH);
      s.append(person({ x: 48, y: 110, hair: 'tied', hairCol: '#2d2420', goggles: true, hands: [[32, 184], [84, 128, 72, 152]] }),
        person({ x: 178, y: 108, hair: 'short', hairCol: '#1f1a17', goggles: true, hands: [[162, 184], [204, 138, 196, 158]] }),
        person({ x: 292, y: 110, dir: -1, hair: 'short', hairCol: '#6b3b1f', goggles: true, mouth: 'tongue', hands: [[308, 184], [272, 134, 276, 156]] }));
      bench(s, SW, SH, BY);
      s.append(G({ transform: 'translate(108 188)' }, reagentBottle({ w: 32, h: 44, color: '#cfe3f2', stopper: false })), h('rect', { x: 128, y: 180, width: 14, height: 8, rx: 2, class: 'c0-metal2' }),
        tubeAt(80, 120, 122, { level: .25 }), P('M110 138Q110 132 109 128', '', { fill: 'none', stroke: '#9fd3f5', 'stroke-width': 3, 'stroke-linecap': 'round' }));
      s.append(h('rect', { x: 196, y: 187, width: 52, height: 9, rx: 3, fill: 'var(--c0-metal-2)', stroke: 'var(--ink)', 'stroke-width': 1.3 }),
        P('M244 188V160Q244 152 236 152H230Q224 152 224 158V164', '', { fill: 'none', stroke: 'var(--c0-metal-2)', 'stroke-width': 4.5, 'stroke-linecap': 'round' }),
        G({ transform: 'translate(212 164) rotate(15)' }, P('M-9 -8L9 -8L0 9Z', 'c0-paper')), lines('M206 146v8M214 144v8'));
      s.append(P('M280 120L262 146', '', { fill: 'none', stroke: 'var(--c0-metal-2)', 'stroke-width': 3, 'stroke-linecap': 'round' }), drops([[281, 119, 2.4], [284, 121, 2], [279, 122, 2]], '#ffffff'));
      s.append(h('rect', { x: 346, y: 140, width: 40, height: 48, rx: 7, fill: '#b8742a', 'fill-opacity': .9, stroke: 'var(--ink)', 'stroke-width': 1.6 }),
        h('rect', { x: 358, y: 130, width: 16, height: 11, fill: '#b8742a', stroke: 'var(--ink)', 'stroke-width': 1.4 }),
        h('rect', { x: 349, y: 156, width: 34, height: 16, rx: 2, fill: '#fff', stroke: '#333', 'stroke-width': 1 }), TXT(366, 167.5, 'WASTE', 'c0-tc c0-tdark', { 'font-size': 8 }),
        G({ transform: 'translate(366 124)' }, P('M-8 -7L8 -7L0 8Z', 'c0-paper')));
      return [
        { box: [12, 92, 130, 98], title: 'Pouring chemicals back into the reagent bottle', rule: 'Chemicals taken out of a reagent bottle should <b>never be poured back</b>. Work out the quantity needed beforehand to avoid excess and wastage.' },
        { box: [150, 90, 102, 106], title: 'Throwing filter paper into the sink', rule: 'Do not put insoluble solids, filter papers or used organic solvents into the <b>sink</b> — collect waste in the <b>waste bottle</b>.' },
        { box: [258, 90, 74, 100], title: 'Tasting a chemical', rule: '<b>Never taste or touch chemicals.</b>' },
        { box: [338, 112, 58, 80], safe: true, title: 'Using the waste bottle', rule: 'The used filter paper goes into the <b>waste bottle</b> — correct! Not a hazard.' }
      ];
    }
  ];
  function hazardHunt() {
    const card = A.playCard('Spot the hazard!', 'Tap every <b>unsafe practice</b> on each bench. Careful — some students are doing it right!', '🔍 Hunt');
    const nHaz = [3, 3, 3, 3], TOTAL = 12;
    const found = HAZ_SCENES.map(() => new Set()), okSeen = HAZ_SCENES.map(() => new Set());
    let cur = 0, items = [], ringLayer = null, hintLayer = null, done = false;
    const tabs = h('div', { class: 'c0-tabs' });
    const stage = h('div', { class: 'c0-stage' });
    const panel = h('div', { class: 'c0-info', html: '👆 Tap a person or object that looks unsafe.' });
    const hintB = btn('💡 Hint', hint, 'btn-sm btn-ghost');
    const nextB = btn('Next bench →', () => go((cur + 1) % HAZ_SCENES.length), 'btn-sm');
    const tabBtns = HAZ_SCENES.map((_, i) => { const b = h('button', { class: 'chip', type: 'button' }); b.addEventListener('click', () => { go(i); A.sound('click'); }); tabs.appendChild(b); return b; });
    function totalFound() { return found.reduce((n, f) => n + f.size, 0); }
    function updateTabs() {
      tabBtns.forEach((b, i) => { b.textContent = 'Bench ' + (i + 1) + ' · ' + found[i].size + '/' + nHaz[i]; b.classList.toggle('on', i === cur); b.classList.toggle('c0-ok', found[i].size === nHaz[i]); });
      card.score.textContent = '⚠️ ' + totalFound() + ' / ' + TOTAL;
    }
    function ring(it) {
      const [x, y, w, hh] = it.box;
      ringLayer.append(h('rect', { x: x + 3, y: y + 3, width: w - 6, height: hh - 6, rx: 14, class: 'c0-ring ' + (it.safe ? 'good' : 'bad') }),
        h('circle', { cx: x + w - 8, cy: y + 10, r: 10, fill: it.safe ? 'var(--good)' : 'var(--bad)' }), TXT(x + w - 8, y + 14.5, it.safe ? '✓' : '!', 'c0-tc c0-tw', { 'font-size': 13 }));
    }
    function go(i) {
      cur = i; stage.innerHTML = '';
      const s = svg(SW, SH - 60, 'Laboratory bench ' + (i + 1) + ': students doing experiments', { viewBox: '0 60 ' + SW + ' ' + (SH - 60) });
      items = HAZ_SCENES[i](s);
      ringLayer = G(); hintLayer = G(); s.append(ringLayer, hintLayer);
      const hits = G(); s.appendChild(hits);
      s.addEventListener('click', () => { info(panel, '🤔 Nothing unsafe right there — look at what each student is <b>doing</b>.'); A.sound('click'); });
      items.forEach((it, k) => {
        const [x, y, w, hh] = it.box;
        const r = h('rect', { x, y, width: w, height: hh, rx: 12, class: 'c0-hit', tabindex: 0, role: 'button', 'aria-label': 'Check this part of bench ' + (i + 1) });
        r.addEventListener('click', e => { e.stopPropagation(); hit(it, k); });
        r.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); hit(it, k); } });
        hits.appendChild(r);
        if (found[i].has(k) || okSeen[i].has(k)) ring(it);
      });
      stage.appendChild(s);
      if (!done) info(panel, found[i].size === nHaz[i] ? '✅ Bench ' + (i + 1) + ' is cleared. Try another bench!' : '👆 Bench ' + (i + 1) + ': find <b>' + (nHaz[i] - found[i].size) + '</b> more hazard' + (nHaz[i] - found[i].size === 1 ? '' : 's') + '.');
      updateTabs();
    }
    function hit(it, k) {
      if (it.safe) {
        if (!okSeen[cur].has(k)) { okSeen[cur].add(k); ring(it); }
        info(panel, '✅ <b>' + it.title + '</b><br>' + it.rule, 'good'); A.sound('good');
        return;
      }
      if (found[cur].has(k)) { info(panel, '⚠️ <b>' + it.title + '</b> (already found)<br>✓ ' + it.rule); return; }
      found[cur].add(k); ring(it); hintLayer.innerHTML = ''; A.sound('pop');
      info(panel, '🎯 <b>Hazard: ' + it.title + '</b><br>✓ Rule: ' + it.rule, 'bad');
      updateTabs();
      if (totalFound() === TOTAL) {
        done = true;
        A.later(() => { info(panel, '🏆 <b>All 12 hazards found!</b> You can identify unsafe practices like a pro.', 'good'); A.sound('win'); A.celebrate(.7); A.reward('c0-hazards', 25, 'Hazard hunter'); }, 900);
      } else if (found[cur].size === nHaz[cur]) {
        A.toast('✅ Bench ' + (cur + 1) + ' cleared!', 'good');
      }
    }
    function hint() {
      const k = items.findIndex((it, j) => !it.safe && !found[cur].has(j));
      if (k < 0) { info(panel, 'This bench is cleared — try another bench!'); return; }
      const [x, y, w, hh] = items[k].box;
      hintLayer.innerHTML = ''; hintLayer.appendChild(h('rect', { x: x + 2, y: y + 2, width: w - 4, height: hh - 4, rx: 14, class: 'c0-hint' }));
      A.later(() => { if (hintLayer) hintLayer.innerHTML = ''; }, 3000);
      A.sound('click');
    }
    card.body.append(tabs, stage, h('div', { class: 'c0-row c0-mt', style: { justifyContent: 'space-between' } }, hintB, nextB), panel);
    go(0);
    return card;
  }

  function dilutionLab() {
    const card = A.playCard('Dilution challenge', 'You need to dilute <b>concentrated sulphuric acid</b> with water. Which way round is safe?', '🧪 Simulation');
    const W = 360, H = 230;
    const stage = h('div', { class: 'c0-stage c0-w-md' });
    const fb = h('div', { class: 'c0-info', html: '👇 Choose how to mix them.' });
    let busy = false, sc = null;
    const bA = btn('Pour the acid into the water', () => run(true)), bW = btn('Pour the water into the acid', () => run(false));
    function draw() {
      const s = svg(W, H, 'A small beaker of concentrated sulphuric acid and a large beaker of water');
      wall(s, W, H); bench(s, W, H, 200, 400);
      const acid = beaker({ x: 60, y: 150, W: 46, H: 50, level: .5, color: '#efe6c8', op: .75 });
      const water = beaker({ x: 210, y: 100, W: 100, H: 100, level: .5, color: COLOURLESS, op: .5 });
      const acidG = G({}, acid.node), waterG = G({}, water.node), fx = G();
      s.append(acidG, waterG, fx, TXT(83, 222, 'conc. acid', 'c0-tc'), TXT(260, 222, 'water', 'c0-tc'));
      stage.innerHTML = ''; stage.appendChild(s);
      sc = { s, acid, water, acidG, waterG, fx };
    }
    function stream(x, y1, y2, col) { return h('rect', { x: x - 2, y: y1, width: 4, height: Math.max(0, y2 - y1), rx: 2, fill: col, 'fill-opacity': .9 }); }
    async function run(safe) {
      if (busy) return; busy = true; bA.disabled = bW.disabled = true;
      draw();
      const { acid, water, acidG, waterG, fx } = sc;
      if (safe) {
        info(fb, 'Pouring a <b>small volume</b> of concentrated acid into a <b>large volume</b> of water…');
        await tween(800, k => acidG.setAttribute('transform', 'translate(' + n1(180 * k) + ' ' + n1(-80 * k) + ') rotate(' + n1(-72 * k) + ' 55 146)'));
        const st = stream(235, 68, water.surfaceY(), '#efe6c8'); fx.appendChild(st);
        const rod = P('M286 60L262 196', 'c0-rod'); fx.appendChild(rod);
        A.sound('pop');
        await Promise.all([acid.to(.08, null, null, 1400), water.to(.6, '#dfe9ee', null, 1400), tween(1400, k => rod.setAttribute('transform', 'translate(' + n1(Math.sin(k * 18) * 12) + ' 0)'), t => t)]);
        st.remove();
        await tween(600, k => acidG.setAttribute('transform', 'translate(' + n1(180 * (1 - k)) + ' ' + n1(-80 * (1 - k)) + ') rotate(' + n1(-72 * (1 - k)) + ' 55 146)'));
        info(fb, '✅ <b>Safe!</b> Always add a <b>small volume of concentrated acid to a large volume of water</b>, <b>with stirring</b>.', 'good');
        A.sound('good');
        if (A.reward('c0-dilution', 10, 'Safe dilution')) A.celebrate(.4);
      } else {
        info(fb, 'Pouring water into the concentrated acid…');
        await tween(800, k => waterG.setAttribute('transform', 'translate(' + n1(-128 * k) + ' ' + n1(10 * k) + ') rotate(' + n1(-62 * k) + ' 205 96)'));
        const st = stream(77, 106, acid.surfaceY(), '#9fd3f5'); fx.appendChild(st);
        await wait(250);
        A.sound('bad'); shakeEl(stage);
        const ps = [];
        for (let i = 0; i < 22; i++) { const el = h('circle', { r: n1(2 + R() * 2.5), fill: '#efe6c8', stroke: 'var(--ink)', 'stroke-width': .8 }); fx.appendChild(el); ps.push({ el, x: 83, y: acid.surfaceY(), vx: (R() - .5) * 220, vy: -120 - R() * 160 }); }
        const boom = popBurst(83, 132, 1.2); boom.querySelector('text').textContent = 'SPLASH!'; fx.appendChild(boom);
        await tween(1100, k => ps.forEach(p => { p.vy += 9; p.x += p.vx * .016; p.y += p.vy * .016; p.el.setAttribute('cx', n1(p.x)); p.el.setAttribute('cy', n1(p.y)); }), t => t);
        st.remove(); boom.remove();
        await tween(600, k => waterG.setAttribute('transform', 'translate(' + n1(-128 * (1 - k)) + ' ' + n1(10 * (1 - k)) + ') rotate(' + n1(-62 * (1 - k)) + ' 205 96)'));
        info(fb, '⚠️ <b>Splash!</b> Mixing is <b>highly exothermic</b>. Adding water to the concentrated acid may cause the <b>corrosive</b> concentrated acid to <b>spill out</b>. Try the other way!', 'bad');
      }
      busy = false; bA.disabled = bW.disabled = false;
    }
    draw();
    card.body.append(stage, h('div', { class: 'c0-ctrl c0-w-md' }, bA, bW), fb);
    return card;
  }

  function bunsenBreak() {
    const card = A.playCard('Bunsen burner break', 'You will not use the Bunsen burner for a while (<b>no immediate use</b>). What should you do with it?', '🔥 Choose');
    const s = svg(200, 170, 'A Bunsen burner on a bench');
    wall(s, 200, 170); bench(s, 200, 170, 150, 400);
    const b = bunsen(100, 150, 1, 'blue'); s.appendChild(b.node);
    const fb = h('div', { class: 'c0-info', html: 'The burner has a big blue flame right now. Pick an option.' });
    const got = new Set();
    const opts = [
      { k: 'blue', label: 'Leave the big blue flame burning', ok: false, why: 'Not safe. When you have no immediate use of the Bunsen burner, turn it <b>off</b> or turn it to a <b>small luminous flame</b>.' },
      { k: 'small', label: 'Turn it to a small luminous (yellow) flame', ok: true, why: 'A small <b>luminous</b> flame is yellow and easy to see.' },
      { k: 'off', label: 'Turn it off', ok: true, why: 'Turning it <b>off</b> is also safe.' }
    ];
    const box = h('div', { class: 'c0-act' });
    opts.forEach(o => {
      const bt = h('button', { class: 'q-opt', type: 'button' }, h('span', { class: 'k', text: o.k === 'off' ? '⏻' : '🔥' }), h('span', { text: o.label }));
      bt.addEventListener('click', () => {
        b.set(o.k); box.querySelectorAll('.q-opt').forEach(x => x.classList.remove('right', 'wrong')); bt.classList.add(o.ok ? 'right' : 'wrong');
        info(fb, (o.ok ? '✅ <b>Correct!</b> ' : '❌ ') + o.why, o.ok ? 'good' : 'bad'); A.sound(o.ok ? 'good' : 'bad');
        if (o.ok) { got.add(o.k); if (got.size === 2) { info(fb, '✅ Both are right: turn it <b>off</b> or to a <b>small luminous flame</b>.', 'good'); A.reward('c0-bunsen', 10, 'Bunsen burner'); } }
      });
      box.appendChild(bt);
    });
    card.body.append(h('div', { class: 'c0-2col' }, h('div', { class: 'c0-stage', style: { maxWidth: '260px', width: '100%', margin: '0 auto' } }, s), h('div', null, box, fb)));
    return card;
  }

  function renderSafety(root, api) {
    root.appendChild(note('Before experiments', '<ol><li>Wear ' + T('eye protection', '護眼用品') + ' (<b>safety spectacles / goggles</b>) in the laboratory when there is any risk to the eyes:<ul><li><b>heating</b> chemicals;</li><li>handling <b>acidic, alkali</b> or other ' + T('corrosive', '腐蝕性') + ' chemicals; and</li><li>carrying out <b>violent</b> or ' + T('exothermic', '放熱') + ' reactions.</li></ul></li><li>Wear <b>protective gloves</b> when handling corrosive chemicals.</li><li><b>Long hair</b> must be securely tied.</li></ol>', '(2) Safety precautions'));
    root.appendChild(gearUp());
    root.appendChild(note('During experiments', '<ol start="4"><li><b>Special care</b> is needed when working with many chemicals, which are known ' + T('hazards', '危險') + ' (dangers). Understand the hazard in each case and take proper precautions.</li><li>Keep ' + T('flammable', '易燃') + ' liquids away from <b>flames</b>.</li><li><b>Never look down</b> heated vessels (test tubes, flasks etc.) or <b>point</b> them at any person.</li><li>When you have no immediate use of the ' + T('Bunsen burner', '本生燈') + ', turn it <b>off</b> or turn it to a small ' + T('luminous', '光亮') + ' flame.</li><li><b>Never smell gases directly.</b> <b>‘Fan’</b> a little of the gas towards your nose.</li><li><b>Wash your hands</b> after experiments.</li></ol>'));
    root.appendChild(hazardHunt());
    root.appendChild(bunsenBreak());
    const dil = note('Diluting acids and alkalis', '<ol start="10"><li>When acids and alkalis (especially <b>concentrated sulphuric acid</b>) are diluted, add a <b>small volume of acid / alkali</b> to a <b>large volume of water</b>, with <b>stirring</b>.</li></ol>');
    dil.lastChild.appendChild(api.keybox('When they are mixed, it is highly <b>exothermic</b>. It may cause the <b>corrosive</b> concentrated acid / alkali to <b>spill out</b>.', '⚠️ Why?'));
    root.appendChild(dil);
    root.appendChild(dilutionLab());
    root.appendChild(note('Handling accidents', '<ol start="11"><li>If chemicals spill onto your skin or clothes, wash the affected area with <b>plenty of cold running water</b>.</li><li>Be familiar with the location and use of<ul><li><b>emergency equipment</b> such as ' + T('first aid materials', '急救用品') + ', ' + T('eye-wash bottle', '洗眼瓶') + '; and</li><li><b>fire-fighting equipment</b>, e.g. ' + T('fire extinguisher', '滅火筒') + ', ' + T('fire blanket', '滅火氈') + ' and ' + T('sand bucket', '沙桶') + '.</li></ul></li></ol>'));
    const m = api.playCard('Emergency! What do you use?', 'Tap a problem on the left, then its answer on the right.', '🚑 Match');
    let mistakes = 0;
    m.body.appendChild(api.matchWidget([
      ['Acid spills onto your skin', 'Wash with plenty of cold running water'],
      ['A chemical splashes into your eye', 'Eye-wash bottle'],
      ['A small fire starts on the bench', 'Fire blanket / fire extinguisher / sand bucket'],
      ['A small cut from broken glass', 'First aid materials (and report it to the teacher)'],
      ['An experiment forms a toxic gas', 'Do it in the fume cupboard']
    ], { onWrong: () => { mistakes++; }, onDone: () => { m.score.textContent = mistakes ? mistakes + ' wrong tries' : 'Perfect!'; A.reward('c0-accidents', 10, 'Emergency match'); if (!mistakes) A.celebrate(.4); } }));
    root.appendChild(m);
    root.appendChild(clozeCard(['Wear eye protection when [[heating]] chemicals, handling acidic, alkali or other [[corrosive]] chemicals, and carrying out violent or [[exothermic]] reactions. Wear protective [[gloves]] when handling corrosive chemicals.', 'Keep [[flammable|inflammable]] liquids away from flames. When the Bunsen burner is not in use, turn it off or to a small [[luminous]] flame. Never smell gases directly — [[fan]] a little of the gas towards your nose.', 'To dilute concentrated sulphuric acid, add a small volume of [[acid|concentrated acid|conc acid|concentrated sulphuric acid]] to a large volume of [[water]] with stirring. If chemicals spill onto your skin, wash with plenty of [[cold running water|cold water|running water]].'], 'c0-cloze-3'));
    api.quickCheck(root, 'ch0', 'ch0-3', 5);
  }

  /* =========================================================
     LESSON 0.3 — Observations in chemistry
     ========================================================= */
  const SENSES = [
    { e: '👁️', n: 'Seeing', o: 'with eyes', what: 'colour change · a solid dissolving · effervescence · precipitate · flame or glow' },
    { e: '✋', n: 'Feeling', o: 'with hands', what: 'temperature change (hotter / colder)' },
    { e: '👃', n: 'Smelling', o: 'with nose', what: 'the smell of a gas (always ‘fan’ it!)' },
    { e: '👂', n: 'Hearing', o: 'with ears', what: '‘hissing’ sound or ‘pop’ sound' },
    { e: '👅', n: 'Tasting', o: 'with tongue', what: null }
  ];
  function sensesRow() {
    const wrap = h('div', { class: 'c0-mt' });
    const row = h('div', { class: 'c0-senses' });
    const box = h('div', { class: 'c0-info', html: '👆 Tap each sense.' });
    SENSES.forEach(s => {
      const b = h('button', { class: 'c0-tile', type: 'button' }, h('span', { text: s.e }), h('span', { text: s.n }), h('small', { class: 'tiny', text: s.o }));
      b.addEventListener('click', () => {
        row.querySelectorAll('.c0-tile').forEach(x => x.classList.remove('on', 'wrong'));
        if (!s.what) { b.classList.add('wrong'); shakeEl(b); A.sound('bad'); info(box, '🚫 <b>Tasting with the tongue is prohibited in the laboratory!</b>', 'bad'); return; }
        b.classList.add('on'); A.sound('pop'); info(box, '<b>' + s.n + ' ' + s.o + '</b>: ' + s.what);
      });
      row.appendChild(b);
    });
    wrap.append(row, box);
    return wrap;
  }
  const GUIDE = [
    ['👁️ Seeing', 'Whether there is a <b>colour change</b>', 'The solution turns from <i>(colour 1)</i> to <i>(colour 2)</i>.'],
    ['👁️ Seeing', 'Whether a solid <b>dissolves</b> in a liquid, and the colour of any solution formed', '<i>(Name of the solid, e.g. magnesium)</i> / <i>(colour, e.g. white)</i> solid dissolves to give a <i>(colour, e.g. colourless)</i> solution.'],
    ['👁️ Seeing', 'Whether there is ' + T('effervescence', '泡騰') + ' or formation of gas', 'Effervescence of colourless gas bubbles is observed. / <i>(e.g. Brown)</i> gas is evolved.'],
    ['👁️ Seeing', 'Whether there is formation of ' + T('precipitate', '沉澱') + ', and its colour', '<i>(e.g. Blue)</i> precipitate forms.'],
    ['👁️ Seeing', 'Whether there is a <b>flame</b> (and its colour), or the substance <b>glows</b> (gives out light)', 'The solid <i>(e.g. sodium)</i> burns with a golden yellow flame. / The solid glows red hot.'],
    ['✋ Feeling', 'Whether there is a <b>temperature change</b> in the reaction mixture', 'The reaction mixture becomes <b>hotter</b> (heat given out). / … becomes <b>colder</b> (heat absorbed). / There is no apparent temperature change.'],
    ['👃 Smelling', 'The <b>smell</b> of the gas', 'ammonia: <b>pungent</b> smell<br>chlorine: <b>irritating (choking)</b> smell<br>hydrogen sulphide: <b>bad egg (rotten egg)</b> smell'],
    ['👂 Hearing', 'Whether a <b>sound</b> is heard', '‘<b>hissing</b>’ sound · ‘<b>pop</b>’ sound'],
    ['🤔 Nothing?', 'No obvious changes can be detected', 'No <b>observable</b> changes.']
  ];
  function threeTubes(labels) {
    const s = svg(300, 196, 'Three test tubes: a clear solution, a cloudy suspension and a precipitate settled at the bottom');
    wall(s, 300, 196);
    const xs = [55, 150, 245];
    xs.forEach((x, i) => {
      const t = testTube({ x, top: 18, H: 142, W: 34, level: .78, color: i === 0 ? '#7cc0ee' : COLOURLESS, op: i === 0 ? .6 : .5 });
      s.appendChild(t.node);
      if (i === 1) { t.set(null, '#cfe4f3', .85); for (let k = 0; k < 90; k++) { const [px, py] = t.point(); t.inner.appendChild(h('circle', { cx: n1(px), cy: n1(py), r: 1.7, fill: '#3f86c6' })); } }
      if (i === 2) t.inner.appendChild(h('path', { d: t.shapeAt(.1), fill: '#3f86c6' }));
      s.appendChild(TXT(x, 186, labels[i], 'c0-tc', { 'font-size': 14 }));
    });
    return s;
  }
  function tubesCard() {
    const card = note('Solution, suspension or precipitate?', '<p>When you look at a test tube, describe exactly what you see. Tap each tube.</p>');
    const s = threeTubes(['Solution', 'Suspension', 'Precipitate']);
    const box = h('div', { class: 'c0-info', html: '👆 Tap a tube.' });
    const D = [
      '<b>Solution</b> <span class="zh">溶液</span> — <b>clear</b>: you can see through it (it may be coloured). No solid can be seen.',
      '<b>Suspension</b> <span class="zh">懸浮液</span> — tiny solid particles are spread all through the liquid, so it looks <b>cloudy</b>.',
      '<b>Precipitate</b> <span class="zh">沉澱</span> — a <b>solid</b> formed in the liquid; here it has settled at the bottom. Write: “<i>(Blue)</i> precipitate forms.”'
    ];
    const marks = G(); s.appendChild(marks);
    [55, 150, 245].forEach((x, i) => {
      const r = h('rect', { x: x - 40, y: 6, width: 80, height: 190, rx: 10, class: 'c0-hit', tabindex: 0, role: 'button', 'aria-label': ['Solution', 'Suspension', 'Precipitate'][i] });
      const go = () => { marks.innerHTML = ''; marks.appendChild(h('rect', { x: x - 30, y: 8, width: 60, height: 162, rx: 12, class: 'c0-sel' })); info(box, D[i]); A.sound('pop'); };
      r.addEventListener('click', go); r.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
      s.appendChild(r);
    });
    card.append(h('div', { class: 'c0-stage', style: { maxWidth: '380px', margin: '0 auto' } }, s), box);
    return card;
  }

  const GASES = [{ n: 'ammonia', tint: null, smell: 0 }, { n: 'chlorine', tint: '#d4e46a', smell: 1 }, { n: 'hydrogen sulphide', tint: null, smell: 2 }];
  const SMELLS = ['pungent smell', 'irritating (choking) smell', 'bad egg (rotten egg) smell'];
  function faceRight(x, y) { // a face looking left (towards the experiment)
    return G({}, h('circle', { cx: x, cy: y, r: 17, class: 'c0-skin' }), P('M' + (x - 17) + ' ' + (y - 3) + 'A17 17 0 0 1 ' + (x + 17) + ' ' + (y - 3) + 'Q' + (x + 6) + ' ' + (y - 14) + ' ' + (x - 17) + ' ' + (y - 3) + 'Z', '', { fill: '#2d2420' }),
      h('circle', { cx: x - 7, cy: y + 1, r: 2.1, class: 'c0-eye' }), P('M' + (x - 16) + ' ' + (y + 3) + 'L' + (x - 21) + ' ' + (y + 8) + 'L' + (x - 16) + ' ' + (y + 10), 'c0-thin'), P('M' + (x - 13) + ' ' + (y + 12) + 'q3 2 6 0', 'c0-mouth'));
  }
  function sniffTest() {
    const card = A.playCard('Sniff test (the safe way!)', 'Fan each gas towards your nose, then choose how it smells.', '👃 Smell');
    let order, i, busy, sc, miss;
    const stage = h('div', { class: 'c0-stage', style: { maxWidth: '380px', margin: '0 auto' } });
    const title = h('div', { class: 'c0-ask', style: { textAlign: 'center', marginBottom: '8px' } });
    const fanB = btn('✋ Fan the gas', fan, 'btn-primary'), sniffB = btn('👃 Sniff it directly', sniff);
    const choices = h('div', { class: 'c0-act' });
    const fb = h('div', { class: 'c0-info' });
    function start() { order = A.shuffle(GASES); i = 0; miss = 0; next(); }
    function next() {
      if (i >= order.length) return end();
      const g = order[i]; busy = false;
      title.innerHTML = 'Gas jar ' + (i + 1) + ' of 3: <b>' + g.n + '</b>';
      const s = svg(300, 190, 'A gas jar of ' + g.n);
      wall(s, 300, 190); bench(s, 300, 190, 172, 400);
      s.appendChild(h('rect', { x: 72, y: 52, width: 56, height: 120, rx: 3, class: 'c0-glassfill' }));
      if (g.tint) s.appendChild(h('rect', { x: 73, y: 53, width: 54, height: 118, fill: g.tint, 'fill-opacity': .45 }));
      s.append(P('M72 52V168Q72 172 76 172H124Q128 172 128 168V52', 'c0-out'), P('M80 60V160', 'c0-shine'));
      const cover = h('rect', { x: 64, y: 46, width: 72, height: 6, rx: 2, class: 'c0-metal' }); s.appendChild(cover);
      s.appendChild(faceRight(238, 74));
      const fx = G(); s.appendChild(fx);
      stage.innerHTML = ''; stage.appendChild(s);
      sc = { s, cover, fx };
      choices.innerHTML = ''; fanB.disabled = sniffB.disabled = false; fanB.style.display = sniffB.style.display = '';
      info(fb, 'How will you smell it?');
      card.score.textContent = i + ' / 3';
    }
    function sniff() { info(fb, '🚫 <b>Never smell gases directly!</b> ‘Fan’ a little of the gas towards your nose.', 'bad'); A.sound('bad'); shakeEl(stage); miss++; }
    async function fan() {
      if (busy) return; busy = true; fanB.disabled = sniffB.disabled = true;
      const { cover, fx } = sc;
      await tween(400, k => cover.setAttribute('x', n1(64 + 26 * k)));
      const hd = G({}, hand()); fx.appendChild(hd);
      const w = wisps(fx, 100, 44, 214, 78, 4, order[i].tint || null);
      await tween(1700, k => place(hd, 150, 52, -50 + Math.sin(k * Math.PI * 6) * 26), t => t);
      await w; hd.remove();
      info(fb, '👃 You can smell it now. How does it smell?');
      fanB.style.display = sniffB.style.display = 'none';
      A.shuffle(SMELLS.map((t, j) => ({ t, j }))).forEach(o => {
        const b = h('button', { class: 'q-opt', type: 'button' }, h('span', { class: 'k', text: '👃' }), h('span', { text: o.t }));
        b.addEventListener('click', () => {
          if (o.j === order[i].smell) {
            b.classList.add('right'); choices.querySelectorAll('.q-opt').forEach(x => { x.disabled = true; });
            info(fb, '✅ <b>' + order[i].n[0].toUpperCase() + order[i].n.slice(1) + '</b> has a <b>' + SMELLS[o.j] + '</b>.', 'good'); A.sound('good');
            i++; A.later(next, 1300);
          } else { b.classList.add('wrong'); b.disabled = true; miss++; info(fb, '❌ Not that one — try again.', 'bad'); A.sound('bad'); }
        });
        choices.appendChild(b);
      });
    }
    function end() {
      title.innerHTML = '🏁 All three gases done!';
      choices.innerHTML = '';
      info(fb, (miss ? '👍 Done! ' : '🏆 Perfect! ') + 'ammonia → <b>pungent</b> · chlorine → <b>irritating (choking)</b> · hydrogen sulphide → <b>bad egg</b>.', 'good');
      card.score.textContent = '3 / 3';
      A.sound('win'); A.reward('c0-sniff', 10, 'Sniff test'); if (!miss) A.celebrate(.4);
      choices.appendChild(btn('↻ Play again', start, 'btn-sm'));
    }
    card.body.append(title, stage, h('div', { class: 'c0-ctrl' }, fanB, sniffB), choices, fb);
    start();
    return card;
  }

  // small animated scenes for "Write it like a chemist"
  function miniScene(kind) {
    const W = 240, H = 150, B = 136;
    const s = svg(W, H, 'A mini experiment to observe');
    wall(s, W, H); bench(s, W, H, B, 400);
    const fx = G();
    let play = async () => {};
    const dropDown = async (x, y0, y1, col) => { const d = h('circle', { cx: x, cy: y0, r: 3, fill: col || COLOURLESS, stroke: 'var(--ink)', 'stroke-width': .8 }); fx.appendChild(d); await tween(320, k => d.setAttribute('cy', n1(lerp(y0, y1, k))), t => t * t); d.remove(); };
    const withDropper = async (x, yTip, yTo, n, col, onDrop) => {
      const dp = dropper(); fx.appendChild(dp);
      await tween(350, k => place(dp, x, lerp(-10, yTip, k)));
      for (let i = 0; i < n; i++) { await dropDown(x, yTip + 3, yTo, col); if (onDrop) onDrop(i); }
      await tween(300, k => place(dp, x, lerp(yTip, -10, k)));
      dp.remove();
    };
    if (kind === 'flame') {
      s.append(P('M200 16L128 84', '', { fill: 'none', stroke: 'var(--c0-metal-2)', 'stroke-width': 3.5, 'stroke-linecap': 'round' }), P('M108 84Q120 100 132 84Z', 'c0-metal'), h('ellipse', { cx: 120, cy: 85, rx: 6.5, ry: 3.5, fill: '#c9cdd3', stroke: 'var(--ink)', 'stroke-width': 1 }));
      const f = G({ transform: 'translate(120 84)', opacity: 0 }, flame('golden', .95)); s.appendChild(f);
      play = async () => { await wait(350); A.sound('whoosh'); await tween(500, k => f.setAttribute('opacity', n1(k))); };
    } else if (kind === 'glow') {
      const b = bunsen(120, B, .55, 'blue');
      const halo = h('circle', { cx: 120, cy: 70, r: 20, fill: '#ff6a00', opacity: 0 });
      const lump = h('ellipse', { cx: 120, cy: 71, rx: 11, ry: 6, fill: '#8d949e', stroke: 'var(--ink)', 'stroke-width': 1.2 });
      s.append(b.node, P('M92 78L86 136M148 78L154 136', 'c0-thin', { style: { strokeWidth: '2.5px' } }), P('M86 78H154', 'c0-out'), halo, lump);
      play = async () => { lump.setAttribute('fill', '#8d949e'); halo.setAttribute('opacity', 0); await wait(400); await tween(1300, k => { lump.setAttribute('fill', mix('#8d949e', '#ff4d1a', k)); halo.setAttribute('opacity', n1(k * .45)); }); };
    } else if (kind === 'brown') {
      const t = testTube({ x: 120, top: 34, H: 92, W: 26, level: .3, color: COLOURLESS });
      const gas = h('rect', { x: 109, y: 36, width: 22, height: 60, fill: '#a0522d', opacity: 0 });
      t.inner.appendChild(gas); s.appendChild(t.node);
      play = async () => { gas.setAttribute('opacity', 0); await wait(300); await tween(900, k => gas.setAttribute('opacity', n1(k * .55))); await wisps(fx, 120, 30, 150, -10, 4, '#a0522d'); };
    } else if (kind === 'hotter') {
      const bk = beaker({ x: 66, y: 66, W: 84, H: 70, level: .55, color: '#cfe8d9', op: .6 });
      const col = h('rect', { x: 134.5, y: 98, width: 3, height: 24, fill: '#e53935' });
      s.append(bk.node, h('rect', { x: 132, y: 18, width: 8, height: 104, rx: 4, class: 'c0-glassfill' }), h('rect', { x: 132, y: 18, width: 8, height: 104, rx: 4, class: 'c0-thin' }), col, h('circle', { cx: 136, cy: 124, r: 6, fill: '#e53935', stroke: 'var(--ink)', 'stroke-width': 1.2 }));
      for (let i = 0; i < 6; i++) s.appendChild(P('M140 ' + (30 + i * 14) + 'h5', 'c0-thin'));
      s.appendChild(TXT(160, 30, '°C', '', { 'font-size': 11 }));
      const arrow = TXT(164, 70, '▲', 'c0-tc', { 'font-size': 16, opacity: 0, style: { fill: 'var(--bad)' } }); s.appendChild(arrow);
      play = async () => { await wait(300); await tween(1600, k => { col.setAttribute('y', n1(98 - 62 * k)); col.setAttribute('height', n1(24 + 62 * k)); arrow.setAttribute('opacity', n1(k)); }); };
    } else if (kind === 'nothing' || kind === 'ppt') {
      const t = testTube({ x: 120, top: 30, H: 96, W: 26, level: .45, color: kind === 'ppt' ? '#7cc0ee' : COLOURLESS, op: kind === 'ppt' ? .6 : .55 });
      s.appendChild(t.node);
      const q = TXT(172, 84, '', '', { 'font-size': 18 }); s.appendChild(q);
      play = async () => {
        t.inner.innerHTML = ''; q.textContent = '';
        await withDropper(120, 22, t.surfaceY(), 3, COLOURLESS, i => {
          if (kind !== 'ppt') return;
          for (let k = 0; k < 14; k++) { const [px, py] = t.point(); const c = h('circle', { cx: n1(px), cy: n1(t.surfaceY() + 3), r: 1.9, fill: '#2f7fd1' }); t.inner.appendChild(c); const by = t.bot - 4 - R() * 6, bx = t.x + (R() * 2 - 1) * 6; tween(900 + R() * 600, kk => { c.setAttribute('cx', n1(lerp(px, bx, kk))); c.setAttribute('cy', n1(lerp(py, by, kk))); }); }
        });
        if (kind === 'nothing') { await wait(500); q.textContent = '…?'; }
      };
    } else if (kind === 'pop') {
      const t = testTube({ x: 110, top: 44, H: 86, W: 24, level: .06, color: COLOURLESS });
      s.appendChild(t.node);
      play = async () => {
        fx.innerHTML = '';
        const sp = G({}, splint(true)); fx.appendChild(sp);
        await tween(700, k => place(sp, lerp(210, 112, k), lerp(-10, 40, k)));
        const burst = popBurst(110, 34, 1.1); fx.appendChild(burst); A.sound('pop');
        await wait(900); burst.remove();
        await tween(400, k => place(sp, lerp(112, 210, k), lerp(40, -10, k)));
      };
    } else if (kind === 'dissolve') {
      const t = testTube({ x: 120, top: 30, H: 96, W: 26, level: .45, color: COLOURLESS });
      s.appendChild(t.node);
      play = async () => {
        t.inner.innerHTML = '';
        const ps = []; for (let k = 0; k < 26; k++) { const y = t.bot - 3 - R() * 9, cy = t.bot - t.r, rr = t.r - 4; const hw = y > cy ? Math.sqrt(Math.max(0, rr * rr - (y - cy) * (y - cy))) : rr; const c = h('circle', { cx: n1(t.x + (R() * 2 - 1) * hw), cy: n1(y), r: 2.4, fill: '#fff', stroke: '#9aa3ad', 'stroke-width': .7 }); t.inner.appendChild(c); ps.push(c); }
        const rod = P('M0 0L-5 100', 'c0-rod'); fx.appendChild(rod);
        await wait(300);
        await tween(1800, k => { place(rod, 128, 22 + Math.sin(k * Math.PI * 6) * 8); ps.forEach(c => { c.style.opacity = String(1 - k); }); }, x => x);
        rod.remove();
      };
    }
    s.appendChild(fx);
    return { s, play };
  }
  const CHEMIST = [
    { k: 'flame', p: 'A small piece of sodium is burnt.', o: ['The solid burns with a golden yellow flame.', 'Sodium is on fire!', 'It burns.'], why: 'Say <b>what</b> burns and the <b>colour of the flame</b>.' },
    { k: 'glow', p: 'A solid is heated strongly. It gives out red light.', o: ['The solid glows red hot.', 'The solid gets hot.', 'The solid turns into a new substance.'], why: 'It gives out light — write that the solid <b>glows</b> (red hot).' },
    { k: 'brown', p: 'Watch the test tube carefully.', o: ['A brown gas is evolved.', 'Smoke comes out.', 'Something brown happens.'], why: 'Give the <b>colour</b> of the gas and say it is <b>evolved</b> (given off).' },
    { k: 'hotter', p: 'Two solutions are mixed. Watch the thermometer.', o: ['The reaction mixture becomes hotter.', 'The reaction mixture becomes colder.', 'There is no apparent temperature change.'], why: 'The temperature goes <b>up</b>, so the mixture becomes <b>hotter</b> (heat is given out).' },
    { k: 'nothing', p: 'A few drops of a solution are added. Watch closely…', o: ['No observable changes.', 'Nothing.', 'The experiment failed.'], why: 'When nothing seems to happen, a chemist writes “<b>No observable changes</b>.”' },
    { k: 'pop', p: 'A burning splint is put at the mouth of a test tube of gas.', o: ['A ‘pop’ sound is heard.', 'It explodes.', 'The tube makes a noise.'], why: 'Describe the sound exactly: a <b>‘pop’ sound</b> is heard.' },
    { k: 'dissolve', p: 'A white solid is stirred in water.', o: ['The white solid dissolves to give a colourless solution.', 'The white solid melts.', 'The solid disappears.'], why: 'Say the solid <b>dissolves</b> (not melts) and give the <b>colour of the solution</b>.' },
    { k: 'ppt', p: 'A few drops of a solution are added to a blue solution.', o: ['A blue precipitate forms.', 'The solution becomes dirty.', 'The solution turns blue.'], why: 'A blue <b>solid</b> appears in the liquid and sinks — that is a <b>precipitate</b>.' }
  ];
  function chemistGame() {
    const card = A.playCard('Write it like a chemist', 'Watch each mini-experiment, then pick the observation a chemist would write down.', '✍️ Observe');
    let order, i, score, answered, slip;
    const prompt = h('div', { class: 'c0-ask' });
    const stage = h('div', { class: 'c0-stage', style: { maxWidth: '360px', margin: '10px auto 0' } });
    const opts = h('div', { class: 'c0-act' });
    const fb = h('div', { class: 'c0-info' });
    const replay = btn('↻ Replay', () => play(), 'btn-sm btn-ghost');
    const next = btn('Next →', () => { i++; show(); }, 'btn-primary');
    let scene = null;
    function play() { if (scene) { const m = miniScene(order[i].k); stage.innerHTML = ''; stage.appendChild(m.s); scene = m; m.play(); } }
    function start() { order = A.shuffle(CHEMIST); i = 0; score = 0; show(); }
    function show() {
      if (i >= order.length) return end();
      const r = order[i];
      scene = miniScene(r.k); stage.innerHTML = ''; stage.appendChild(scene.s); scene.play();
      answered = false; slip = false; next.style.display = 'none'; replay.style.display = '';
      prompt.innerHTML = '<span class="c0-pill">' + (i + 1) + ' / ' + order.length + '</span> ' + r.p;
      opts.innerHTML = ''; info(fb, 'Which is the best observation?');
      card.score.textContent = '⭐ ' + score;
      A.shuffle(r.o.map((t, j) => ({ t, j }))).forEach(o => {
        const b = h('button', { class: 'q-opt', type: 'button' }, h('span', { class: 'k', text: '✎' }), h('span', { text: o.t }));
        b.addEventListener('click', () => {
          if (answered) return;
          if (o.j === 0) {
            answered = true; b.classList.add('right'); opts.querySelectorAll('.q-opt').forEach(x => { x.disabled = true; });
            if (!slip) score++;
            card.score.textContent = '⭐ ' + score;
            info(fb, '✅ <b>Spot on!</b> ' + r.why, 'good'); A.sound('good');
            next.style.display = ''; next.textContent = i + 1 < order.length ? 'Next →' : 'See my score';
          } else { slip = true; b.classList.add('wrong'); b.disabled = true; info(fb, '❌ Not the best. ' + r.why, 'bad'); A.sound('bad'); }
        });
        opts.appendChild(b);
      });
    }
    function end() {
      stage.innerHTML = ''; opts.innerHTML = ''; next.style.display = 'none'; replay.style.display = 'none';
      prompt.innerHTML = '🏁 You scored <b>' + score + ' / ' + order.length + '</b> first time!';
      info(fb, score >= 7 ? '🏆 You write observations like a real chemist!' : 'Look at the guideline table again, then have another go.', score >= 7 ? 'good' : '');
      opts.appendChild(btn('↻ Play again', start, 'btn-sm'));
      A.sound('win'); if (score >= 6) A.reward('c0-chemist', 15, 'Write like a chemist'); if (score === order.length) A.celebrate(.6);
    }
    card.body.append(prompt, stage, opts, h('div', { class: 'c0-row c0-mt', style: { justifyContent: 'space-between' } }, replay, next), fb);
    start();
    return card;
  }

  function renderObserve(root, api) {
    const n = note('Observations in chemistry', '<p>Observations are <b>essential</b> because chemistry is an <b>experimental science</b>. They are usually noticed using our ' + T('sense organs', '感覺器官') + ': <b>seeing</b> with eyes, <b>feeling</b> with hands, <b>smelling</b> with nose and <b>hearing</b> with ears.</p><p>Tasting with tongue is <b>prohibited</b> in the laboratory.</p>');
    n.appendChild(sensesRow());
    root.appendChild(n);
    const g = note('How to record observations', '<p>Brief guidelines for recording observations in chemistry experiments:</p>');
    const tb = api.table(['What to observe', 'How to write it (examples)'], GUIDE.map(r => ['<span class="c0-sense">' + r[0] + '</span><br>' + r[1], r[2]]));
    tb.classList.add('c0-table');
    g.appendChild(tb);
    root.appendChild(g);
    const sp = api.playCard('Which sense?', 'Tap an observation, then tap the sense you would use. One of them is a trap!', '🎮 Sort');
    sp.body.classList.add('c0-sort5');
    sp.body.appendChild(api.sortGame({
      buckets: [{ id: 'see', title: 'Seeing', icon: '👁️' }, { id: 'feel', title: 'Feeling', icon: '✋' }, { id: 'smell', title: 'Smelling', icon: '👃' }, { id: 'hear', title: 'Hearing', icon: '👂' }, { id: 'never', title: 'Never!', icon: '🚫' }],
      items: [
        { label: 'The solution turns from orange to yellow', bucket: 'see' },
        { label: 'Effervescence of colourless gas bubbles', bucket: 'see' },
        { label: 'A blue precipitate forms', bucket: 'see' },
        { label: 'The solid burns with a golden yellow flame', bucket: 'see' },
        { label: 'The reaction mixture becomes colder', bucket: 'feel', hint: 'Temperature is felt with your hands.' },
        { label: 'A pungent smell', bucket: 'smell' },
        { label: 'A bad egg smell', bucket: 'smell' },
        { label: 'A ‘pop’ sound', bucket: 'hear' },
        { label: 'A ‘hissing’ sound', bucket: 'hear' },
        { label: 'Checking whether a solid tastes salty', bucket: 'never', explain: 'Tasting with the tongue is <b>prohibited</b> in the lab!', hint: 'Should you ever taste anything in the lab?' }
      ],
      rewardKey: 'c0-senses-sort', xp: 10
    }));
    root.appendChild(sp);
    root.appendChild(tubesCard());
    root.appendChild(sniffTest());
    root.appendChild(chemistGame());
    root.appendChild(clozeCard(['Observations are usually noticed using our [[sense organs|senses]]. Tasting with tongue is [[prohibited|forbidden|not allowed]] in the laboratory.', '[[Effervescence]] of colourless gas bubbles is observed. A blue [[precipitate]] forms. If the temperature goes up, the reaction mixture becomes [[hotter|warmer]] (heat given out).', 'Ammonia has a [[pungent]] smell. Chlorine has an [[irritating|choking]] smell. Hydrogen sulphide has a [[bad egg|rotten egg]] smell. When nothing happens, write: no [[observable]] changes.'], 'c0-cloze-4'));
    api.quickCheck(root, 'ch0', 'ch0-4', 5);
  }

  /* =========================================================
     LESSON 0.3 (cont.) — Experiment 0.1 virtual lab
     ========================================================= */
  const DICHROMATE = '#f07f1e', CHROMATE = '#f4cf16', CUSO4 = '#3d9be0', PALEBLUE = '#7fb8e6', DEEPBLUE = '#1f3fb3';
  function labStage() {
    const W = 320, H = 280, BENCH = 256;
    const s = svg(W, H, 'Virtual experiment: a test tube held in a clamp');
    wall(s, W, H); bench(s, W, H, BENCH, 400);
    s.append(h('rect', { x: 26, y: 248, width: 84, height: 8, rx: 2, class: 'c0-metal2' }), h('rect', { x: 55, y: 22, width: 7, height: 228, rx: 3, class: 'c0-metal' }), h('rect', { x: 55, y: 70, width: 90, height: 7, rx: 3, class: 'c0-metal' }), h('rect', { x: 50, y: 66, width: 17, height: 15, rx: 3, class: 'c0-metal2' }));
    const tube = testTube({ x: 160, top: 56, H: 150, W: 36 });
    const tubeG = G({}, tube.node), tools = G(), fx = G();
    s.append(tubeG, h('rect', { x: 138, y: 66, width: 44, height: 14, rx: 4, class: 'c0-metal2' }), tools, fx);
    const cap = TXT(10, 20, '', '', { 'font-size': 11 }); s.appendChild(cap);
    const L = { s, tube, pile: [], cloudPs: [] };
    L.caption = t => { cap.textContent = t || ''; };
    L.clearFx = () => { fx.innerHTML = ''; };
    L.pour = async o => {
      L.caption('Adding: ' + o.cap);
      const b = G({},
        h('rect', { x: -5, y: 0, width: 10, height: 13, class: 'c0-glassfill' }), h('rect', { x: -15, y: 12, width: 30, height: 52, rx: 6, class: 'c0-glassfill' }),
        h('rect', { x: -13, y: 32, width: 26, height: 30, rx: 4, fill: o.src, 'fill-opacity': .8 }),
        h('rect', { x: -15, y: 12, width: 30, height: 52, rx: 6, class: 'c0-out' }), h('rect', { x: -5, y: 0, width: 10, height: 13, class: 'c0-out' }));
      tools.appendChild(b);
      await tween(550, k => place(b, lerp(270, 168, k), lerp(150, 40, k), -112 * k));
      const st = h('rect', { x: 166, y: 42, width: 4, height: 0, rx: 2, fill: o.src, 'fill-opacity': .9 }); tools.appendChild(st);
      A.sound('pop');
      await Promise.all([tube.to(o.level, o.color, o.op, o.ms || 1100), tween(o.ms || 1100, () => st.setAttribute('height', n1(Math.max(0, tube.surfaceY() - 42))))]);
      st.remove();
      if (L.cloudPs.length) L.respread();
      await tween(450, k => place(b, lerp(168, 300, k), lerp(40, 20, k), -112 * (1 - k)));
      b.remove(); L.caption('');
    };
    L.drops = async (n, col, capT) => {
      L.caption('Adding: ' + capT);
      const d = dropper(); tools.appendChild(d);
      await tween(450, k => place(d, 160, lerp(-20, 46, k)));
      for (let i = 0; i < n; i++) {
        const dr = h('circle', { cx: 160, cy: 49, r: 3, fill: col, stroke: 'var(--ink)', 'stroke-width': .8 }); fx.appendChild(dr);
        await tween(330, k => dr.setAttribute('cy', n1(lerp(49, tube.surfaceY(), k))), t => t * t);
        dr.remove(); A.sound('click');
        tube.set(tube.st.level + .01);
      }
      await tween(400, k => place(d, 160, lerp(46, -40, k)));
      d.remove(); L.caption('');
    };
    function bottomPt(depth) {
      const cy = tube.bot - tube.r, rr = tube.r - 4, y = tube.bot - 4 - R() * depth;
      const hw = y > cy ? Math.sqrt(Math.max(0, rr * rr - (y - cy) * (y - cy))) : rr;
      return [tube.x + (R() * 2 - 1) * Math.max(1, hw - 1.5), y];
    }
    L.spoon = async (count, col, capT) => {
      L.caption('Adding: ' + capT);
      const sp = G({}, spatula(), h('circle', { cx: -2, cy: -2, r: 3, fill: col, stroke: '#9aa3ad', 'stroke-width': .6 }), h('circle', { cx: 2.5, cy: -2.5, r: 3, fill: col, stroke: '#9aa3ad', 'stroke-width': .6 }));
      tools.appendChild(sp);
      for (let c = 0; c < count; c++) {
        await tween(450, k => place(sp, lerp(250, 164, k), lerp(0, 46, k)));
        await tween(200, k => place(sp, 164, 46, 35 * k));
        for (let i = 0; i < 16; i++) {
          const [px, py] = bottomPt(3 + L.pile.length * .32);
          const p = h('circle', { cx: 164, cy: 52, r: 3, fill: col, stroke: '#7d8692', 'stroke-width': .9 });
          tube.inner.appendChild(p); L.pile.push(p);
          tween(380 + R() * 220, k => { p.setAttribute('cx', n1(lerp(164, px, k))); p.setAttribute('cy', n1(lerp(52, py, k))); }, t => t * t);
          await wait(22);
        }
        A.sound('click');
        await wait(350);
        await tween(380, k => place(sp, lerp(164, 250, k), lerp(46, 0, k), 35 * (1 - k)));
      }
      sp.remove(); L.caption('');
    };
    L.stir = async (n, dissolve) => {
      L.caption(dissolve ? 'Stirring…' : 'Stirring to mix…');
      const rod = P('M0 0L-6 150', 'c0-rod'); tools.appendChild(rod);
      await tween(450, k => place(rod, 172, lerp(-150, 46, k)));
      const ps = L.pile.slice();
      await tween(600 * n, k => {
        place(rod, 172 + Math.sin(k * Math.PI * 2 * n) * 5, 46 - Math.abs(Math.sin(k * Math.PI * 2 * n)) * 16);
        if (dissolve) ps.forEach(p => { p.style.opacity = String(Math.max(0, 1 - k * 1.15)); });
        else ps.forEach(p => { p.setAttribute('transform', 'translate(' + n1(Math.sin(k * 40 + +p.getAttribute('cx')) * 1.2) + ' 0)'); });
      }, t => t);
      if (dissolve) { ps.forEach(p => p.remove()); L.pile = []; }
      await tween(400, k => place(rod, 172, lerp(46, -150, k)));
      rod.remove(); L.caption('');
    };
    L.shake = async () => {
      L.caption('Shaking gently…');
      await tween(900, k => tubeG.setAttribute('transform', 'rotate(' + n1(Math.sin(k * Math.PI * 6) * 6 * (1 - k * .3)) + ' 160 73)'), t => t);
      tubeG.removeAttribute('transform'); L.caption('');
    };
    L.cloud = async col => {
      for (let k = 0; k < 80; k++) { const [px, py] = tube.point(); const c = h('circle', { cx: n1(px), cy: n1(py), r: 1.7, fill: col, opacity: 0 }); tube.inner.appendChild(c); L.cloudPs.push(c); }
      await Promise.all([tube.to(null, '#bfdcf2', .9, 900), tween(900, k => L.cloudPs.forEach(c => c.setAttribute('opacity', n1(k))))]);
    };
    L.respread = () => { L.cloudPs.forEach(c => { const [px, py] = tube.point(); const x0 = +c.getAttribute('cx'), y0 = +c.getAttribute('cy'); tween(700, k => { c.setAttribute('cx', n1(lerp(x0, px, k))); c.setAttribute('cy', n1(lerp(y0, py, k))); }); }); };
    L.clearCloud = async () => { const ps = L.cloudPs; L.cloudPs = []; await tween(900, k => ps.forEach(c => c.setAttribute('opacity', n1(1 - k)))); ps.forEach(c => c.remove()); };
    L.warm = async () => {
      const b = bunsen(0, BENCH, .7, 'small'), g = G({}, b.node); tools.appendChild(g);
      await tween(600, k => place(g, lerp(340, 160, k), 0));
      await tween(1900, k => L.caption('Warming gently… ' + Math.round(k * 15) + ' s'), t => t);
      wisps(fx, 160, 50, 172, 6, 2);
      await tween(500, k => place(g, lerp(160, 340, k), 0));
      g.remove(); L.caption('');
    };
    L.fan = async label => {
      L.caption('Fanning the gas towards your nose…');
      fx.appendChild(faceRight(288, 100));
      const hd = G({}, hand()); fx.appendChild(hd);
      const w = wisps(fx, 162, 50, 262, 100, 4);
      await tween(1700, k => place(hd, 204, 62, -45 + Math.sin(k * Math.PI * 6) * 26), t => t);
      await w; hd.remove();
      fx.appendChild(TXT(284, 68, label, 'c0-tc', { 'font-size': 12, style: { fill: 'var(--bad)' } }));
      L.caption('');
    };
    L.litmus = async () => {
      L.caption('Testing with moist red litmus paper…');
      const paper = h('rect', { x: -4, y: -38, width: 8, height: 38, rx: 1.5, fill: '#e0525a', stroke: 'var(--ink)', 'stroke-width': 1 });
      const g = G({}, P('M-1 -36L16 -78M3 -36L22 -76', 'c0-thin', { style: { strokeWidth: '2px' } }), paper); tools.appendChild(g); L.litmusEl = g;
      await tween(600, k => place(g, lerp(290, 166, k), lerp(10, 50, k)));
      await wait(500);
      await tween(1100, k => paper.setAttribute('fill', mix('#e0525a', '#4a63d8', k)));
      L.caption('');
    };
    L.dropMg = async () => {
      L.caption('Adding: a small folded piece of magnesium ribbon');
      const mg = P('M-11 -3L-5.5 3L0 -3L5.5 3L11 -3', '', { fill: 'none', stroke: '#7d8692', 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
      tube.inner.appendChild(mg); L.mg = mg; L.mgScale = 1;
      const yEnd = tube.bot - 8;
      await tween(500, k => place(mg, 160, lerp(30, yEnd, k)), t => t * t);
      L.bub = bubbler(tube.inner, () => ({ x0: 152, x1: 168, yBottom: tube.bot - 10, yTop: tube.surfaceY() + 2 }));
      L.bub.start(24); A.sound('fizz');
      L.mgShrink = A.loop(dt => { if (!L.mg || !L.mg.isConnected) return false; L.mgScale = Math.max(L.mgTarget == null ? .55 : L.mgTarget, L.mgScale - dt * .06); place(L.mg, 160, yEnd, 0, L.mgScale.toFixed(2)); });
      await wait(1400);
      L.caption('');
    };
    L.feel = async kind => {
      const cold = kind === 'cold';
      const hd = G({}, hand()); fx.appendChild(hd);
      await tween(500, k => place(hd, lerp(320, 206, k), 172, -90));
      for (let i = 0; i < 3; i++) fx.appendChild(P(cold ? 'M' + (128 - i * 3) + ' ' + (150 + i * 16) + 'h-10' : 'M' + (130 - i * 3) + ' ' + (150 + i * 16) + 'q-4-3-8 0q-4 3-8 0', '', { fill: 'none', stroke: cold ? '#3b82c4' : '#e0782a', 'stroke-width': 2.4, 'stroke-linecap': 'round' }));
      fx.append(h('rect', { x: 206, y: 118, width: 98, height: 28, rx: 14, fill: cold ? '#d8ecff' : '#ffe2c6', stroke: cold ? '#3b82c4' : '#e0782a', 'stroke-width': 1.5 }), TXT(255, 137, cold ? '❄ colder!' : '♨ warm!', 'c0-tc c0-tdark', { 'font-size': 13 }));
      A.sound('pop');
      await wait(900);
      await tween(400, k => place(hd, lerp(206, 330, k), 172, -90));
      hd.remove();
    };
    L.stopper = async () => {
      L.caption('Stoppered — waiting for the reaction to stop…');
      const st = h('polygon', { points: '151,30 169,30 181,57 139,57', fill: '#2b2f38', stroke: 'var(--ink)', 'stroke-width': 1.5 });
      tools.appendChild(st); L.stopperEl = st;
      await tween(400, k => st.setAttribute('transform', 'translate(0 ' + n1(-60 * (1 - k)) + ')'));
      const s0 = L.mgScale;
      await tween(2800, k => { if (L.bub) L.bub.rate(24 * (1 - k)); L.mgTarget = s0 * (1 - k); L.mgScale = s0 * (1 - k); }, t => t);
      if (L.bub) L.bub.stop();
      if (L.mg) { L.mg.remove(); L.mg = null; }
      L.caption('The reaction seems to have stopped.');
    };
    L.popTest = async () => {
      L.caption('Burning splint at the mouth of the tube…');
      if (L.stopperEl) { const st = L.stopperEl; await tween(400, k => { st.setAttribute('transform', 'translate(' + n1(70 * k) + ' ' + n1(-40 * k) + ')'); st.style.opacity = String(1 - k); }); st.remove(); L.stopperEl = null; }
      const sp = G({}, splint(true)); tools.appendChild(sp);
      await tween(550, k => place(sp, lerp(260, 162, k), lerp(-30, 52, k)));
      const burst = popBurst(160, 40, 1.15); fx.appendChild(burst); A.sound('pop'); A.later(() => A.sound('pop'), 90);
      await tween(350, k => burst.setAttribute('transform', 'translate(160 40) scale(' + n1(.5 + k * .6) + ') translate(-160 -40)'));
      await wait(900);
      await tween(450, k => place(sp, lerp(162, 280, k), lerp(52, -30, k)));
      sp.remove(); L.caption('');
    };
    return L;
  }

  const REACTIONS = [
    { name: 'Potassium dichromate + sodium hydroxide', short: 'Dichromate', steps: [
      { n: '1(a)', text: 'Put 1 cm³ of <b>acidified potassium dichromate solution</b> into a test tube.', act: '🧪 Pour in 1 cm³', run: L => L.pour({ cap: 'acidified potassium dichromate solution', src: DICHROMATE, level: .12, color: DICHROMATE, op: .9 }) },
      { n: '1(b)', text: 'Add 3 cm³ of <b>sodium hydroxide solution</b> to it.', act: '🧪 Add 3 cm³', run: L => L.pour({ cap: 'sodium hydroxide solution', src: COLOURLESS, level: .45, color: CHROMATE, op: .9, ms: 1600 }) },
      { obs: true, options: ['The solution turns from orange to yellow.', 'The solution changes colour.', 'The solution turns from yellow to orange.'], why: ['', 'Too vague — say <b>which</b> colours: “turns from (colour 1) to (colour 2)”.', 'Check the order — what colour was it at the start?'] }
    ] },
    { name: 'Ammonium chloride + water', short: 'Ammonium chloride', steps: [
      { n: '2(a)', text: 'Put 2 spatula measures of solid <b>ammonium chloride</b> into a test tube.', act: '🥄 Add 2 spatulas', run: L => L.spoon(2, '#ffffff', 'solid ammonium chloride (white)') },
      { n: '2(b)', text: 'Add 3 cm³ of <b>water</b> to the tube.', act: '💧 Add 3 cm³ of water', run: L => L.pour({ cap: 'water', src: COLOURLESS, level: .3, color: COLOURLESS, op: .5 }) },
      { n: '2(c)', text: 'Stir with a <b>glass rod</b> to mix the contents well.', act: '🥢 Stir', run: L => L.stir(3, true) },
      { sense: true, text: 'Use your hands: <b>feel</b> the outside of the test tube.', act: '✋ Feel the tube', run: L => L.feel('cold') },
      { obs: true, options: ['The white solid dissolves to give a colourless solution. The test tube becomes colder.', 'The white solid melts. The test tube becomes hotter.', 'The solid disappears.'], why: ['', 'It does not melt — it <b>dissolves</b>. And did the tube feel hotter or colder?', 'Too vague — give the colour of the solid, say it <b>dissolves</b>, describe the solution and the temperature.'] }
    ] },
    { name: 'Copper(II) sulphate + ammonia solution', short: 'Copper(II) sulphate', steps: [
      { n: '3(a)', text: 'Put 1 cm³ of <b>copper(II) sulphate</b> solution into a test tube.', act: '🧪 Pour in 1 cm³', run: L => L.pour({ cap: 'copper(II) sulphate solution', src: CUSO4, level: .12, color: CUSO4, op: .75 }) },
      { n: '3(b)', text: 'Add <b>a few drops of ammonia solution</b> and shake the tube gently.', act: '💧 Add drops & shake', run: async L => { await L.drops(4, COLOURLESS, 'a few drops of ammonia solution'); await L.shake(); await L.cloud(PALEBLUE); } },
      { obs: true, options: ['A pale blue precipitate forms.', 'The solution turns from blue to pale blue.', 'Effervescence of colourless gas bubbles is observed.'], why: ['', 'Look closely: the clear solution becomes <b>cloudy</b> — a solid has formed. That is a <b>precipitate</b>.', 'There are no gas bubbles.'] },
      { n: '3(c)', text: 'Pour <b>more ammonia solution</b> into the mixture until the tube is <b>three-quarters full</b>.', act: '🧪 Fill to ¾ full', run: L => L.pour({ cap: 'more ammonia solution', src: COLOURLESS, level: .75, color: '#86afe6', op: .88, ms: 1600 }) },
      { n: '3(d)', text: '<b>Shake</b> to mix the solution well.', act: '🤲 Shake', run: async L => { await L.shake(); await Promise.all([L.clearCloud(), L.tube.to(null, DEEPBLUE, .92, 1000)]); } },
      { obs: true, options: ['The pale blue precipitate dissolves to form a deep blue solution.', 'A white precipitate forms.', 'No observable changes.'], why: ['', 'Look again — the solid disappears and the colour becomes much darker.', 'Something did change — look at the solid and the colour.'] }
    ] },
    { name: 'Ammonium chloride + calcium hydroxide (warmed)', short: 'Warm the solids', steps: [
      { n: '4(a)', text: 'Put 1 spatula measure of solid <b>ammonium chloride</b> and 1 spatula measure of solid <b>calcium hydroxide</b> into a test tube.', act: '🥄 Add both solids', run: async L => { await L.spoon(1, '#ffffff', 'solid ammonium chloride'); await L.spoon(1, '#f1f1ea', 'solid calcium hydroxide'); } },
      { n: '4(b)', text: 'Stir with a glass rod to mix the solids well.', act: '🥢 Stir', run: L => L.stir(2, false) },
      { n: '4(c)', text: 'Warm <i>gently</i> for about 15 seconds.', act: '🔥 Warm gently', run: L => L.warm() },
      { choice: true, n: '4(d)', text: '‘Fan’ a little of any gas evolved towards your nose.', options: [{ label: '✋ Fan the gas towards my nose', ok: true, run: L => L.fan('pungent!') }, { label: '👃 Put my nose over the tube and sniff hard', ok: false, why: '🚫 <b>Never smell gases directly!</b> ‘Fan’ a little of the gas towards your nose.' }] },
      { obs: true, options: ['A gas with a pungent smell is given off.', 'A gas with a bad egg smell is given off.', 'Ammonia is formed.'], why: ['', 'A bad egg smell is hydrogen sulphide. This gas has a sharp, <b>pungent</b> smell.', 'That is a conclusion, not an observation. Describe what your senses detect: the <b>smell</b>.'] },
      { n: '4(e)', text: 'Test the gas with <b>moist red litmus paper</b>.', act: '📄 Test with litmus', run: L => L.litmus() },
      { obs: true, options: ['The moist red litmus paper turns blue.', 'The moist blue litmus paper turns red.', 'The litmus paper changes colour.'], why: ['', 'We used <b>red</b> litmus paper. What colour did it become?', 'Too vague — say which colour it turns.'] }
    ] },
    { name: 'Magnesium + dilute sulphuric acid', short: 'Magnesium', steps: [
      { n: '5(a)', text: 'Put 2 cm³ of <b>dilute sulphuric acid</b> into a test tube.', act: '🧪 Pour in 2 cm³', run: L => L.pour({ cap: 'dilute sulphuric acid', src: COLOURLESS, level: .2, color: COLOURLESS, op: .5 }) },
      { n: '5(b)', text: 'Drop a small, folded piece of <b>magnesium ribbon</b> into it.', act: '🎗️ Drop in magnesium', run: L => L.dropMg() },
      { sense: true, text: 'Use your hands: <b>feel</b> the outside of the test tube.', act: '✋ Feel the tube', run: L => L.feel('warm') },
      { obs: true, options: ['Effervescence (colourless gas bubbles) is observed. The magnesium ribbon becomes smaller and the test tube becomes warm.', 'Hydrogen gas is given off.', 'A blue precipitate forms and the test tube becomes colder.'], why: ['', 'You cannot <b>see</b> which gas it is! Describe what you observe: colourless gas bubbles (effervescence).', 'Look again — there are bubbles, no precipitate, and the tube feels warm.'] },
      { n: '5(c)', text: 'Quickly stopper the tube with an <b>inverted stopper</b>. Gently press your thumb on the stopper. Wait until the reaction seems to stop.', act: '⏳ Stopper & wait', run: L => L.stopper() },
      { n: '5(d)', text: 'Remove the bung and quickly put a <b>burning splint</b> in the mouth of the tube.', act: '🔥 Burning splint test', run: L => L.popTest() },
      { obs: true, options: ['A ‘pop’ sound is heard.', 'The burning splint goes out with no sound.', 'The glowing splint relights.'], why: ['', 'Listen again — there was a sound!', 'We used a <b>burning</b> splint, and it made a sound.'] }
    ] }
  ];

  function virtualLab() {
    const card = A.playCard('Experiment 0.1 — virtual lab', 'Do each step, use your senses, then choose the <b>best</b> observation. Finish all 5 reactions to complete your lab record.', '🔬 Virtual lab');
    const tabs = h('div', { class: 'c0-tabs' });
    const stageBox = h('div', { class: 'c0-stage' });
    const act = h('div', { class: 'c0-act' });
    const fb = h('div', { class: 'c0-info' });
    const stepsList = h('ol', { class: 'c0-steps' });
    const notebook = h('div');
    const record = REACTIONS.map(() => []), complete = new Set();
    let cur = 0, idx = 0, L = null, runId = 0, slips = 0;
    const rTitle = h('div', { class: 'c0-ask', style: { marginBottom: '8px' } });
    const tabLabel = i => (complete.has(i) ? '✓' : '<b>' + (i + 1) + '</b>') + '<span class="c0-tl">&nbsp;' + REACTIONS[i].short + '</span>';
    const tabBtns = REACTIONS.map((r, i) => { const b = h('button', { class: 'chip', type: 'button', html: tabLabel(i), 'aria-label': 'Reaction ' + (i + 1) + ': ' + r.name }); b.addEventListener('click', () => { open(i); A.sound('click'); }); tabs.appendChild(b); return b; });
    function updateTabs() { tabBtns.forEach((b, i) => { b.classList.toggle('on', i === cur); b.classList.toggle('c0-ok', complete.has(i)); b.innerHTML = tabLabel(i); }); card.score.textContent = complete.size + ' / 5'; }
    function drawNotebook() {
      notebook.innerHTML = '';
      notebook.append(h('h4', { style: { margin: '18px 0 8px' }, html: '📒 My lab record' }),
        A.table(['Reaction', 'Observations'], REACTIONS.map((r, i) => [(i + 1) + '. ' + r.name, record[i].length ? record[i].map(x => '• ' + x).join('<br>') : '<span class="muted">—</span>'])));
    }
    function updateSteps() {
      stepsList.innerHTML = '';
      REACTIONS[cur].steps.forEach((st, j) => {
        if (!st.n) return;
        stepsList.appendChild(h('li', { class: j < idx ? 'done' : j === idx ? 'cur' : '' }, h('span', { class: 'n', text: j < idx ? '✓' : st.n }), h('span', { html: st.text })));
      });
    }
    function open(i) {
      cur = i; idx = 0; runId++; slips = 0; // keep earlier records: a redo overwrites them observation by observation
      L = labStage(); stageBox.innerHTML = ''; stageBox.appendChild(L.s);
      rTitle.innerHTML = '🧪 Reaction ' + (i + 1) + ': ' + REACTIONS[i].name;
      info(fb, 'Follow the procedure step by step.');
      updateTabs(); drawNotebook(); render();
    }
    function lockAll() { act.querySelectorAll('button').forEach(b => { b.disabled = true; }); }
    async function runStep(fn) {
      const my = runId; lockAll();
      L.clearFx();
      if (L.litmusEl) { L.litmusEl.remove(); L.litmusEl = null; }
      await fn(L);
      if (my !== runId) return;
      idx++; render();
    }
    function render() {
      act.innerHTML = ''; updateSteps();
      const R_ = REACTIONS[cur], st = R_.steps[idx];
      if (!st) {
        complete.add(cur); updateTabs(); drawNotebook();
        act.appendChild(h('div', { class: 'c0-ask', html: '✅ Reaction ' + (cur + 1) + ' complete!' }));
        const nxt = REACTIONS.findIndex((_, j) => !complete.has(j));
        if (nxt >= 0) { act.appendChild(btn('Next: reaction ' + (nxt + 1) + ' →', () => open(nxt), 'btn-primary')); info(fb, (slips ? '👍 Done.' : '🌟 Perfect observations!') + ' Your observations are in the lab record below.', 'good'); A.sound('good'); }
        else { info(fb, '🏆 <b>All 5 reactions recorded!</b> Check your lab record below — that is exactly what to write in the book.', 'good'); A.sound('win'); A.celebrate(.8); A.reward('c0-lab', 40, 'Experiment 0.1'); }
        act.appendChild(btn('↻ Redo this reaction', () => open(cur), 'btn-sm btn-ghost'));
        return;
      }
      if (st.obs) {
        act.appendChild(h('div', { class: 'c0-ask', text: '👀 What do you observe? Pick the best record.' }));
        A.shuffle(st.options.map((t, j) => ({ t, j }))).forEach(o => {
          const b = h('button', { class: 'q-opt', type: 'button' }, h('span', { class: 'k', text: '✎' }), h('span', { text: o.t }));
          b.addEventListener('click', () => {
            if (o.j === 0) {
              b.classList.add('right'); lockAll(); record[cur][R_.steps.slice(0, idx).filter(x => x.obs).length] = st.options[0]; drawNotebook();
              info(fb, '✅ <b>Recorded!</b> “' + st.options[0] + '”', 'good'); A.sound('good');
              const my = runId; A.later(() => { if (my === runId) { idx++; render(); } }, 1000);
            } else { slips++; b.classList.add('wrong'); b.disabled = true; info(fb, '❌ ' + st.why[o.j], 'bad'); A.sound('bad'); }
          });
          act.appendChild(b);
        });
        return;
      }
      if (st.choice) {
        act.appendChild(h('div', { class: 'c0-ask', html: '<span class="c0-pill">' + st.n + '</span> ' + st.text }));
        st.options.forEach(o => {
          const b = h('button', { class: 'q-opt', type: 'button' }, h('span', { text: o.label }));
          b.addEventListener('click', () => {
            if (o.ok) { b.classList.add('right'); info(fb, '✅ Good — always fan the gas.', 'good'); A.sound('good'); runStep(o.run); }
            else { slips++; b.classList.add('wrong'); info(fb, o.why, 'bad'); A.sound('bad'); shakeEl(stageBox); }
          });
          act.appendChild(b);
        });
        return;
      }
      act.appendChild(h('div', { class: 'c0-ask', html: (st.n ? '<span class="c0-pill">' + st.n + '</span> ' : '') + st.text }));
      act.appendChild(btn(st.act, () => runStep(st.run), 'btn-primary'));
    }
    card.body.append(tabs, rTitle, h('div', { class: 'c0-2col' }, stageBox, h('div', null, act, fb, h('h4', { style: { margin: '16px 0 6px' }, text: 'Procedure' }), stepsList)), notebook);
    open(0);
    return card;
  }

  // tap word tiles in order to build the observation sentence (2 distractor tiles each)
  const SENTENCES = [
    { p: 'Step 1(b): Sodium hydroxide solution is added to acidified potassium dichromate solution.', parts: ['The solution', 'turns from', 'orange', 'to', 'yellow.'], extra: ['green', 'changes colour'] },
    { p: 'Step 2(c): Solid ammonium chloride is stirred with water.', parts: ['The white solid', 'dissolves', 'to give a', 'colourless', 'solution.'], extra: ['melts', 'blue'] },
    { p: 'Step 3(b): A few drops of ammonia solution are added to copper(II) sulphate solution.', parts: ['A', 'pale blue', 'precipitate', 'forms.'], extra: ['deep blue', 'gas'] },
    { p: 'Step 3(d): More ammonia solution is added and the tube is shaken.', parts: ['The pale blue precipitate', 'dissolves', 'to form a', 'deep blue', 'solution.'], extra: ['melts', 'white'] },
    { p: 'Step 4(e): The gas is tested with moist red litmus paper.', parts: ['The moist red litmus paper', 'turns', 'blue.'], extra: ['red.', 'ammonia'] },
    { p: 'Step 5(b): A piece of magnesium ribbon is dropped into dilute sulphuric acid.', parts: ['Effervescence of', 'colourless', 'gas bubbles', 'is observed.'], extra: ['brown', 'hydrogen'] }
  ];
  function sentenceBuilder() {
    const card = A.playCard('Build the observation', 'Tap the tiles in order to write each Experiment 0.1 observation like a chemist. Two tiles in each set do <b>not</b> belong!', '🧩 Builder');
    let order, i, score, built, slip, tiles = [];
    const prompt = h('div', { class: 'c0-ask' });
    const line = h('div', { class: 'c0-line', 'aria-live': 'polite' });
    const pool = h('div', { class: 'c0-pool' });
    const fb = h('div', { class: 'c0-info' });
    const clearB = btn('↺ Clear', () => { built = []; draw(); A.sound('click'); });
    const checkB = btn('✓ Check', check, 'btn-primary');
    const nextB = btn('Next →', () => { i++; show(); }, 'btn-primary');
    function start() { order = A.shuffle(SENTENCES); i = 0; score = 0; show(); }
    function show() {
      if (i >= order.length) return end();
      const s = order[i]; built = []; slip = false;
      prompt.innerHTML = '<span class="c0-pill">' + (i + 1) + ' / ' + order.length + '</span> ' + s.p;
      tiles = A.shuffle(s.parts.map((t, j) => ({ t, j })).concat(s.extra.map(t => ({ t, j: -1 }))));
      clearB.style.display = checkB.style.display = ''; nextB.style.display = 'none';
      info(fb, 'Tap the tiles in the right order. Tap a tile in the box to take it out.');
      card.score.textContent = '⭐ ' + score;
      draw();
    }
    function draw() {
      line.innerHTML = ''; pool.innerHTML = '';
      if (!built.length) line.appendChild(h('span', { class: 'muted', text: 'Your observation appears here…' }));
      built.forEach((k, n) => line.appendChild(h('button', { class: 'chip', type: 'button', text: tiles[k].t, 'aria-label': 'Remove “' + tiles[k].t + '”', on: { click: () => { built.splice(n, 1); draw(); A.sound('click'); } } })));
      tiles.forEach((tl, k) => { if (!built.includes(k)) pool.appendChild(h('button', { class: 'chip', type: 'button', text: tl.t, on: { click: () => { built.push(k); draw(); A.sound('pop'); } } })); });
    }
    function check() {
      const s = order[i], seq = built.map(k => tiles[k].j);
      const ok = seq.length === s.parts.length && seq.every((j, n) => j === n);
      if (!ok) {
        slip = true; A.sound('bad'); shakeEl(line);
        const msg = seq.includes(-1) ? 'One of your tiles does not belong in this observation.' : seq.length < s.parts.length ? 'Not finished yet — keep adding tiles.' : 'Check the order of your tiles.';
        info(fb, '❌ Not quite. ' + msg, 'bad');
        return;
      }
      if (!slip) score++;
      card.score.textContent = '⭐ ' + score;
      line.querySelectorAll('button').forEach(b => { b.disabled = true; });
      pool.innerHTML = '';
      info(fb, '✅ <b>Perfect record!</b> “' + s.parts.join(' ') + '”', 'good'); A.sound('good');
      clearB.style.display = checkB.style.display = 'none'; nextB.style.display = ''; nextB.textContent = i + 1 < order.length ? 'Next →' : 'See my score';
    }
    function end() {
      line.innerHTML = ''; pool.innerHTML = '';
      clearB.style.display = checkB.style.display = nextB.style.display = 'none';
      prompt.innerHTML = '🏁 You built <b>' + score + ' / ' + order.length + '</b> right first time!';
      line.appendChild(h('span', { class: 'muted', text: 'Lab record complete.' }));
      info(fb, score === order.length ? '🏆 Every observation perfect — chemist level!' : '👍 Done! Play again to get them all right first time.', 'good');
      pool.appendChild(btn('↻ Play again', start, 'btn-sm'));
      A.sound('win'); A.reward('c0-builder', 15, 'Sentence builder'); if (score === order.length) A.celebrate(.5);
    }
    card.body.append(prompt, line, pool, h('div', { class: 'c0-row c0-mt', style: { justifyContent: 'flex-end' } }, clearB, checkB, nextB), fb);
    start();
    return card;
  }

  function renderExperiment(root, api) {
    root.appendChild(note('Experiment 0.1 · Observation in chemistry', '<p>In this experiment, you record the observations of several chemical reactions. Write down <b>any</b> observations you can make — no matter how small they are!</p><ul><li>Use your senses: <b>see</b>, <b>feel</b>, <b>smell</b> (fan it!) and <b>hear</b>. Never taste.</li><li>Write like a chemist: colours <b>from → to</b>, “<b>dissolves</b>”, “<b>precipitate</b> forms”, “<b>effervescence</b>”, “‘<b>pop</b>’ sound”.</li></ul>', '🔬 Experiment 0.1'));
    root.appendChild(virtualLab());
    root.appendChild(sentenceBuilder());
    root.appendChild(clozeCard(['Sodium hydroxide solution is added to acidified potassium dichromate solution: the solution turns from [[orange]] to [[yellow]]. Solid ammonium chloride dissolves in water to give a [[colourless]] solution and the test tube becomes [[colder|cooler]].', 'A few drops of ammonia solution are added to copper(II) sulphate solution: a pale blue [[precipitate]] forms. With more ammonia solution, it dissolves to form a [[deep blue|dark blue]] solution.', 'The gas from warming ammonium chloride with calcium hydroxide has a [[pungent]] smell and turns moist red litmus paper [[blue]]. Magnesium in dilute sulphuric acid gives [[effervescence]]; a burning splint gives a ‘[[pop]]’ sound.'], 'c0-cloze-5', 'Record the results'));
    api.quickCheck(root, 'ch0', 'ch0-5', 5);
  }

  /* =========================================================
     Question bank (picture questions reuse the lesson drawings)
     ========================================================= */
  function sceneCrop(i, vb, label, w) { const s = svg(SW, SH, label, { viewBox: vb, style: { width: (w || 200) + 'px' } }); HAZ_SCENES[i](s); return s; }
  const figTubes = () => { const s = threeTubes(['A', 'B', 'C']); s.style.width = '270px'; return s; };
  const QUESTIONS = [
    /* ---- 0.1 What is chemistry? ---- */
    { lesson: 'ch0-1', type: 'mcq', q: 'Chemistry is the study of…', options: ['matter, such as its composition and properties', 'living things and how they grow', 'forces and motion only', 'how to make gold from cheap metals'], answer: 0, explain: 'Chemistry is the study of matter, such as their <b>composition</b> and <b>properties</b>.' },
    { lesson: 'ch0-1', type: 'fill', q: 'The <b>composition</b> of a substance tells us what it is ___ of.', answer: ['made', 'made up'], explain: 'Composition: <i>what</i> is it made of?' },
    { lesson: 'ch0-1', type: 'mcq', q: '“Qualities that we use to distinguish one matter from another” are called…', options: ['properties', 'composition', 'experiments', 'branches'], answer: 0, explain: '<b>Properties</b> are qualities that we use to distinguish (tell apart) one matter from another.' },
    { lesson: 'ch0-1', type: 'match', q: 'Match each branch of chemistry with what it studies.', pairs: [['Analytical chemistry', 'Analyse and separate substances'], ['Biochemistry', 'Chemical processes in organisms'], ['Organic chemistry', 'Carbon-containing compounds'], ['Inorganic chemistry', 'Substances not involving carbon'], ['Physical chemistry', 'Applies physics concepts to understand chemistry']], explain: 'These are the five branches of chemistry in the book.' },
    { lesson: 'ch0-1', type: 'mcq', q: 'Which branch of chemistry is the study of <b>carbon-containing compounds</b>?', options: ['Organic chemistry', 'Inorganic chemistry', 'Physical chemistry', 'Analytical chemistry'], answer: 0, explain: 'Organic chemistry studies carbon-containing compounds. Inorganic chemistry studies substances <b>not</b> involving carbon.' },
    { lesson: 'ch0-1', type: 'tf', q: 'Inorganic chemistry is the study of substances <b>not</b> involving carbon.', answer: true, explain: 'True. Inorganic chemistry studies substances <b>not</b> involving carbon; organic chemistry studies carbon-containing compounds.' },
    { lesson: 'ch0-1', type: 'mcq', q: 'A chemist analyses a sample of river water and separates the substances in it. Which branch of chemistry is this?', options: ['Analytical chemistry', 'Biochemistry', 'Organic chemistry', 'Physical chemistry'], answer: 0, explain: 'Analytical chemistry: <b>analyse and separate</b> substances.' },
    { lesson: 'ch0-1', type: 'mcq', q: 'Biochemistry is the study of…', options: ['chemical processes in organisms', 'carbon-containing compounds only', 'substances not involving carbon', 'concepts in physics'], answer: 0, explain: 'Bio = life. Biochemistry is the study of chemical processes in <b>organisms</b> (living things).' },
    { lesson: 'ch0-1', type: 'tf', q: 'Chemists in the past succeeded in turning cheap metals into gold.', answer: false, explain: 'They only <b>attempted</b> to make gold. But their experiments gathered valuable information about the properties of matter.' },
    { lesson: 'ch0-1', type: 'fill', q: 'Chemistry is an ___ science, so we often do experiments in the school laboratory.', answer: ['experimental'], explain: 'Chemistry is an <b>experimental</b> science.' },
    { lesson: 'ch0-1', type: 'fill', q: '“Laboratory ___ is the first priority in all experimental work.”', answer: ['safety'], explain: 'Laboratory <b>safety</b> is the first priority in all experimental work.' },
    { lesson: 'ch0-1', type: 'mcq', q: 'The F.3 chemistry syllabus (Chapters 0 – 7) belongs to which section of the HKDSE Chemistry syllabus?', options: ['Section 2: Microscopic World I', 'Section 1: Planet Earth', 'Section 3: Metals', 'Section 13: Industrial Chemistry'], answer: 0, explain: 'F.3 syllabus = Section 2: Microscopic World I.' },
    { lesson: 'ch0-1', type: 'tf', q: 'The HKDSE Chemistry syllabus has 12 sections in the compulsory part (F.3 – F.5) and 2 sections in the elective part (F.6).', answer: true, explain: '12 compulsory sections + 2 elective sections.' },
    { lesson: 'ch0-1', type: 'multi', q: 'Which of these questions are about the <b>composition</b> of a substance? Select all that apply.', options: ['What is bronze made of?', 'Which elements make up water?', 'Is copper shiny?', 'Does sulphur float on water?'], answer: [0, 1], explain: 'Composition = what it is <b>made of</b>. Being shiny or floating on water are <b>properties</b>.' },

    /* ---- 0.2 Lab rules ---- */
    { lesson: 'ch0-2', type: 'mcq', q: 'When may students enter the laboratory?', options: ['Only when a teacher is present', 'Whenever the door is open', 'Whenever they want to tidy up', 'When a classmate is already inside'], answer: 0, explain: 'Rule 1: Do <b>NOT</b> enter the laboratory unless a teacher is present.' },
    { lesson: 'ch0-2', type: 'tf', q: 'You may take a test tube home to finish an experiment.', answer: false, explain: 'Rule 2: Do <b>NOT</b> take anything away from the laboratory.' },
    { lesson: 'ch0-2', type: 'multi', q: 'Which of these must you <b>never</b> do in the laboratory? Select all that apply.', options: ['Eat', 'Drink', 'Smoke', 'Taste or touch chemicals', 'Wash your hands after experiments'], answer: [0, 1, 2, 3], explain: 'Eating, drinking and smoking are strictly forbidden, and you must never taste or touch chemicals. Washing your hands after experiments is a safety precaution — always do it!' },
    { lesson: 'ch0-2', type: 'fill', q: 'Experiments involving the use or formation of ___ gas must be carried out in the fume cupboard.', answer: ['toxic', 'poisonous'], hint: '有毒的', explain: 'Rule 7: <b>toxic</b> gas → fume cupboard.' },
    { lesson: 'ch0-2', type: 'mcq', q: 'Burning carbon may give carbon monoxide as a side product. Where should this experiment be carried out, and why?', options: ['In the fume cupboard, because carbon monoxide gas is toxic', 'On the open bench, because carbon monoxide gas is harmless', 'Next to the sink, so the gas can be washed away', 'Next to the window, because carbon monoxide is a liquid'], answer: 0, explain: 'The experiment should be carried out in the <b>fume cupboard</b> because carbon monoxide gas is <b>toxic</b>.' },
    { lesson: 'ch0-2', type: 'tf', q: 'If you break a beaker, you should report it to the teacher immediately.', answer: true, explain: 'Rule 6: report all accidents and breakages <b>immediately</b>. Otherwise, students nearby will be responsible for the damages made.' },
    { lesson: 'ch0-2', type: 'tf', q: 'An experiment that is under way can be left alone while you chat with friends at another bench.', answer: false, explain: 'Rule 5: do not leave your bench unless necessary. Experiments under way should <b>not be left unattended</b>.' },
    { lesson: 'ch0-2', type: 'fill', q: 'Return reagent bottles to their original places immediately after use, with their ___ facing the front.', answer: ['labels', 'label'], explain: 'Rule 9: <b>labels</b> facing the front.' },
    { lesson: 'ch0-2', type: 'mcq', q: 'Which is correct about chemicals taken out of a reagent bottle?', options: ['They should never be poured back; work out the quantity needed beforehand', 'Any extra should be poured back into the bottle', 'Any extra can be taken home', 'Any extra should be left on the bench'], answer: 0, explain: 'Rule 10: never pour chemicals back. Work out the quantities beforehand to avoid excess and wastage.' },
    { lesson: 'ch0-2', type: 'mcq', q: 'Where should used filter papers and insoluble solids go after an experiment?', options: ['The waste bottle', 'The sink', 'The reagent bottle', 'The fume cupboard'], answer: 0, explain: 'Rule 11: do not dispose of them into the sink — waste is collected in the <b>waste bottle</b>.' },
    { lesson: 'ch0-2', type: 'match', q: 'Match each situation with what you should do.', pairs: [['A toxic gas will be formed', 'Use the fume cupboard'], ['A beaker breaks', 'Report to the teacher immediately'], ['Solution spills on the bench', 'Clean it up at once'], ['Used organic solvent', 'Put it into the waste bottle']], explain: 'Rules 6, 7, 8 and 11 of students’ discipline.' },
    { lesson: 'ch0-2', type: 'mcq', q: 'What is this piece of laboratory equipment?', fig: () => facilityFig('fume', 'A tall cabinet with a glass front and a fan on top'), options: ['Fume cupboard', 'Fire blanket', 'Waste bottle', 'Eye-wash bottle'], answer: 0, explain: 'A <b>fume cupboard</b> — experiments involving the use or formation of toxic gas are carried out inside it.' },
    { lesson: 'ch0-2', type: 'tf', q: 'Used organic solvents can be poured into the sink if you run plenty of water.', answer: false, explain: 'Rule 11: used organic solvents must <b>not</b> go into the sink — collect them in the waste bottle.' },

    /* ---- 0.2 Safety precautions ---- */
    { lesson: 'ch0-3', type: 'multi', q: 'When must you wear eye protection (safety spectacles / goggles)? Select all that apply.', options: ['Heating chemicals', 'Handling acidic, alkali or other corrosive chemicals', 'Carrying out a violent or exothermic reaction', 'Reading the worksheet before any experiment has started'], answer: [0, 1, 2], explain: 'Wear eye protection when there is any risk to the eyes: heating, corrosive chemicals, violent or exothermic reactions.' },
    { lesson: 'ch0-3', type: 'fill', q: 'Wear protective ___ when handling corrosive chemicals.', answer: ['gloves', 'glove'], explain: 'Protective <b>gloves</b> for corrosive chemicals.' },
    { lesson: 'ch0-3', type: 'tf', q: 'Long hair must be securely tied before doing experiments.', answer: true, explain: 'Before experiments: long hair must be securely tied, so it cannot catch fire in a Bunsen flame or dip into chemicals.' },
    { lesson: 'ch0-3', type: 'mcq', q: 'How should concentrated sulphuric acid be diluted?', options: ['Add a small volume of the concentrated acid to a large volume of water, with stirring', 'Quickly add a large volume of water to the concentrated acid', 'Pour the water and the acid together without stirring', 'Heat the acid first, then add water'], answer: 0, explain: 'Add a <b>small volume of concentrated acid to a large volume of water</b>, with stirring.' },
    { lesson: 'ch0-3', type: 'mcq', q: 'Why should water NOT be added to concentrated acid?', options: ['Mixing is highly exothermic, and the corrosive concentrated acid may spill out', 'The water would freeze', 'The acid would turn into a solid', 'Nothing would happen, so it wastes time'], answer: 0, explain: 'Mixing is highly <b>exothermic</b>. Adding water to concentrated acid may cause the corrosive acid to <b>spill out</b>.' },
    { lesson: 'ch0-3', type: 'fill', q: 'Mixing concentrated acid with water is highly ___, so a lot of heat is given out.', answer: ['exothermic'], hint: '放熱', explain: '<b>Exothermic</b> = heat is given out.' },
    { lesson: 'ch0-3', type: 'mcq', q: 'What is the correct way to smell a gas in the laboratory?', options: ['‘Fan’ a little of the gas towards your nose', 'Put your nose right over the test tube and sniff', 'Breathe in deeply next to the gas jar', 'Ask a friend to smell it directly for you'], answer: 0, explain: '<b>Never smell gases directly.</b> ‘Fan’ a little of the gas towards your nose.' },
    { lesson: 'ch0-3', type: 'tf', q: 'When you have no immediate use of the Bunsen burner, you should turn it off or turn it to a small luminous flame.', answer: true, explain: 'Off, or a small <b>luminous</b> flame: the yellow flame is easy to see, so nobody touches it by accident.' },
    { lesson: 'ch0-3', type: 'fill', q: 'Keep ___ liquids away from flames.', answer: ['flammable', 'inflammable'], hint: '易燃', explain: 'Keep <b>flammable</b> liquids away from flames.' },
    { lesson: 'ch0-3', type: 'mcq', q: 'Some acid spills onto your hand. What should you do?', options: ['Wash the affected area with plenty of cold running water', 'Wipe it with a tissue and carry on', 'Cover it with the fire blanket', 'Put on gloves over it'], answer: 0, explain: 'If chemicals spill onto your skin or clothes, wash the affected area with <b>plenty of cold running water</b>.' },
    { lesson: 'ch0-3', type: 'match', q: 'Match each emergency with what to use.', pairs: [['A chemical splashes into your eye', 'Eye-wash bottle'], ['A small fire on the bench', 'Fire blanket'], ['A small cut from broken glass', 'First aid materials'], ['Acid spills onto your skin', 'Plenty of cold running water']], explain: 'Know the location and use of emergency equipment and fire-fighting equipment.' },
    { lesson: 'ch0-3', type: 'multi', q: 'Which of these are <b>fire-fighting equipment</b>? Select all that apply.', options: ['Fire extinguisher', 'Fire blanket', 'Sand bucket', 'Eye-wash bottle', 'First aid materials'], answer: [0, 1, 2], explain: 'Fire-fighting equipment: fire extinguisher, fire blanket and sand bucket. Eye-wash bottle and first aid materials are <b>emergency</b> equipment.' },
    { lesson: 'ch0-3', type: 'mcq', q: 'What is this student doing wrong?', fig: () => sceneCrop(1, '198 62 88 128', 'A student with goggles bending right over a test tube that is being heated', 170), options: ['Looking down a heated test tube', 'Not wearing eye protection', 'Eating in the laboratory', 'Using a burner that is turned off'], answer: 0, explain: '<b>Never look down</b> heated vessels (test tubes, flasks etc.). The student is wearing goggles, but that is not enough!' },
    { lesson: 'ch0-3', type: 'fill', q: 'Never ___ down heated vessels (test tubes, flasks etc.) or point them at any person.', answer: ['look', 'look straight', 'peer'], explain: 'Rule 6 (during experiments): <b>never look down</b> heated vessels (test tubes, flasks etc.) or point them at any person.' },
    { lesson: 'ch0-3', type: 'tf', q: 'It is safe to point a heated test tube at a friend, as long as the friend wears goggles.', answer: false, explain: 'Never point heated vessels <b>at any person</b>.' },
    { lesson: 'ch0-3', type: 'mcq', q: 'Look at the picture. Why is this unsafe?', fig: () => sceneCrop(2, '14 84 144 124', 'A student pouring water from a beaker into a small beaker of concentrated acid, with splashes', 200), options: ['Water is being added to concentrated acid, so the acid may splash out', 'The student is wearing gloves', 'The beakers are made of glass', 'A small volume of acid is being added to a large volume of water'], answer: 0, explain: 'Never add water to concentrated acid — add a small volume of acid to a large volume of water, with stirring.' },
    { lesson: 'ch0-3', type: 'mcq', q: 'This is a piece of <b>emergency equipment</b>. What is it?', fig: () => facilityFig('eye', 'A white squeeze bottle with a blue cap and an eye symbol'), options: ['Eye-wash bottle', 'Waste bottle', 'Fire extinguisher', 'Reagent bottle'], answer: 0, explain: 'An <b>eye-wash bottle</b> — emergency equipment, like first aid materials.' },
    { lesson: 'ch0-3', type: 'tf', q: 'Eye-wash bottles and first aid materials are examples of emergency equipment.', answer: true, explain: 'Emergency equipment: first aid materials, eye-wash bottle.' },

    /* ---- 0.3 Observations ---- */
    { lesson: 'ch0-4', type: 'tf', q: 'Tasting with the tongue is a good way to make observations in the laboratory.', answer: false, explain: 'Tasting with tongue is <b>prohibited</b> in the laboratory.' },
    { lesson: 'ch0-4', type: 'multi', q: 'Which of these can we use to make observations in the laboratory? Select all that apply.', options: ['Seeing with eyes', 'Feeling with hands', 'Smelling with nose', 'Hearing with ears', 'Tasting with tongue'], answer: [0, 1, 2, 3], explain: 'We use our sense organs — but tasting is prohibited.' },
    { lesson: 'ch0-4', type: 'fill', q: 'The formation of gas bubbles is called ___.', answer: ['effervescence'], hint: '泡騰', explain: '“<b>Effervescence</b> of colourless gas bubbles is observed.”' },
    { lesson: 'ch0-4', type: 'fill', q: 'A solid that forms in a liquid (and may settle at the bottom of the test tube) is called a ___.', answer: ['precipitate'], hint: '沉澱', explain: 'A <b>precipitate</b>. Record it with its colour: “(Blue) precipitate forms.”' },
    { lesson: 'ch0-4', type: 'match', q: 'Match each observation with the sense organ used to notice it.', pairs: [['The solution turns from orange to yellow', 'Seeing with eyes'], ['The reaction mixture becomes colder', 'Feeling with hands'], ['A gas with a pungent smell', 'Smelling with nose'], ['A ‘pop’ sound', 'Hearing with ears']], explain: 'Observations are noticed using our sense organs. Tasting with tongue is <b>prohibited</b>.' },
    { lesson: 'ch0-4', type: 'mcq', q: 'Which is the best way to record a colour change?', options: ['The solution turns from orange to yellow.', 'The solution changes colour.', 'It becomes yellow.', 'A new substance is formed.'], answer: 0, explain: 'Give <b>both</b> colours: “The solution turns from (colour 1) to (colour 2).”' },
    { lesson: 'ch0-4', type: 'match', q: 'Match each gas with its smell.', pairs: [['Ammonia', 'Pungent smell'], ['Chlorine', 'Irritating (choking) smell'], ['Hydrogen sulphide', 'Bad egg (rotten egg) smell']], explain: 'Smells from the guideline table. Remember to fan, never sniff directly!' },
    { lesson: 'ch0-4', type: 'mcq', q: 'Which gas has a <b>bad egg</b> (rotten egg) smell?', options: ['Hydrogen sulphide', 'Ammonia', 'Chlorine', 'Carbon monoxide'], answer: 0, explain: 'Hydrogen sulphide: bad egg smell. Ammonia: pungent. Chlorine: irritating (choking).' },
    { lesson: 'ch0-4', type: 'mcq', q: 'Nothing seems to happen in an experiment. What should you write?', options: ['No observable changes.', 'Nothing.', 'The experiment failed.', 'There is no reaction because the chemicals are old.'], answer: 0, explain: 'When no obvious changes can be detected, write “No <b>observable</b> changes.”' },
    { lesson: 'ch0-4', type: 'mcq', q: '“The reaction mixture becomes colder.” This means heat is…', options: ['absorbed', 'given out', 'not involved', 'destroyed'], answer: 0, explain: 'Colder → heat <b>absorbed</b>. Hotter → heat <b>given out</b>.' },
    { lesson: 'ch0-4', type: 'tf', q: 'If the reaction mixture becomes neither hotter nor colder, you should write “There is no apparent temperature change.”', answer: true, explain: 'This is the book’s wording when the temperature does not change. (Hotter = heat given out; colder = heat absorbed.)' },
    { lesson: 'ch0-4', type: 'mcq', q: 'The picture shows a solution, a suspension and a precipitate. In which tube has a <b>precipitate</b> settled at the bottom?', fig: figTubes, options: ['A', 'B', 'C'], noShuffle: true, answer: 2, explain: 'C: the solid has settled at the bottom. A is a clear solution; B is a cloudy suspension.' },
    { lesson: 'ch0-4', type: 'mcq', q: 'Which tube shows a <b>suspension</b>?', fig: figTubes, options: ['A', 'B', 'C'], noShuffle: true, answer: 1, explain: 'B: tiny solid particles are spread through the liquid, so it looks cloudy.' },
    { lesson: 'ch0-4', type: 'mcq', q: 'Sodium burns with a ___ flame.', options: ['golden yellow', 'blue', 'green', 'colourless'], answer: 0, explain: '“The solid (e.g. sodium) burns with a <b>golden yellow</b> flame.”' },
    { lesson: 'ch0-4', type: 'fill', q: 'A solid gives out red light when heated. Write: “The solid glows red ___.”', answer: ['hot', 'red hot', 'red-hot'], explain: '“The solid (e.g. magnesium) glows red <b>hot</b>” means it gives out red light when heated.' },
    { lesson: 'ch0-4', type: 'mcq', q: 'Which observation is made by <b>hearing</b>?', options: ['A ‘pop’ sound is heard.', 'Effervescence is observed.', 'The reaction mixture becomes hotter.', 'A gas with a pungent smell is given off.'], answer: 0, explain: 'Hearing with ears: ‘hissing’ sound or ‘pop’ sound.' },
    { lesson: 'ch0-4', type: 'multi', q: 'Which of these are observations made by <b>seeing</b>? Select all that apply.', options: ['A blue precipitate forms.', 'Effervescence of colourless gas bubbles is observed.', 'The solid burns with a golden yellow flame.', 'The reaction mixture becomes hotter.', 'A ‘hissing’ sound is heard.'], answer: [0, 1, 2], explain: 'Precipitates, effervescence and flames are seen. Temperature is felt; sounds are heard.' },

    /* ---- Experiment 0.1 ---- */
    { lesson: 'ch0-5', type: 'mcq', q: 'Sodium hydroxide solution is added to acidified potassium dichromate solution. What is observed?', options: ['The solution turns from orange to yellow.', 'The solution turns from yellow to orange.', 'The solution turns from orange to green.', 'A blue precipitate forms.'], answer: 0, explain: 'Experiment 0.1 step 1: orange → yellow.' },
    { lesson: 'ch0-5', type: 'mcq', q: 'Water is added to solid ammonium chloride and stirred. Which is the correct observation?', options: ['The white solid dissolves to give a colourless solution, and the test tube becomes colder.', 'The white solid dissolves to give a colourless solution, and the test tube becomes hotter.', 'The white solid does not dissolve.', 'A blue solution forms.'], answer: 0, explain: 'Experiment 0.1 step 2: the white solid dissolves to give a colourless solution; the tube feels <b>colder</b>.' },
    { lesson: 'ch0-5', type: 'tf', q: 'When solid ammonium chloride dissolves in water, the test tube becomes colder because heat is absorbed.', answer: true, explain: 'Colder = heat absorbed.' },
    { lesson: 'ch0-5', type: 'mcq', q: 'A few drops of ammonia solution are added to copper(II) sulphate solution. What forms?', options: ['A pale blue precipitate', 'A deep blue solution', 'An orange solution', 'Colourless gas bubbles'], answer: 0, explain: 'Experiment 0.1 step 3(b): a pale blue precipitate forms — the clear solution becomes cloudy.' },
    { lesson: 'ch0-5', type: 'fill', q: 'More ammonia solution is added to the pale blue precipitate formed from copper(II) sulphate solution, until the tube is three-quarters full. The precipitate dissolves to form a ___ blue solution.', answer: ['deep', 'dark'], explain: 'Experiment 0.1 step 3(c)–(d): a <b>deep blue</b> solution forms.' },
    { lesson: 'ch0-5', type: 'mcq', q: 'Solid ammonium chloride and solid calcium hydroxide are warmed together. Which describes the gas given off?', options: ['It has a pungent smell and turns moist red litmus paper blue.', 'It has a bad egg smell and turns moist blue litmus paper red.', 'It is brown and has no smell.', 'It gives a ‘pop’ sound with a burning splint.'], answer: 0, explain: 'Experiment 0.1 step 4: a gas with a <b>pungent</b> smell; moist red litmus paper turns <b>blue</b>.' },
    { lesson: 'ch0-5', type: 'fill', q: 'Solid ammonium chloride and solid calcium hydroxide are warmed together. The gas given off turns moist red litmus paper ___.', answer: ['blue'], explain: 'Experiment 0.1 step 4(e): moist red litmus paper turns <b>blue</b>.' },
    { lesson: 'ch0-5', type: 'fill', q: 'Acidified potassium dichromate solution is ___ in colour.', answer: ['orange'], explain: 'It is <b>orange</b>. Adding sodium hydroxide solution turns it from orange to yellow.' },
    { lesson: 'ch0-5', type: 'multi', q: 'A small piece of magnesium ribbon is dropped into dilute sulphuric acid. Which are correct observations? Select all that apply.', options: ['Effervescence (colourless gas bubbles) is observed', 'The magnesium ribbon becomes smaller', 'The test tube becomes warm', 'A pale blue precipitate forms', 'A brown gas is evolved'], answer: [0, 1, 2], explain: 'Experiment 0.1 step 5(b): effervescence, the magnesium gets smaller, and the tube becomes warm.' },
    { lesson: 'ch0-5', type: 'mcq', q: 'Magnesium ribbon reacts with dilute sulphuric acid in a stoppered test tube. The bung is removed and a <b>burning splint</b> is put at the mouth of the tube. What is observed?', options: ['A ‘pop’ sound is heard.', 'The burning splint goes out silently.', 'A brown gas is evolved.', 'No observable changes.'], answer: 0, explain: 'Experiment 0.1 step 5(d): a ‘pop’ sound is heard.' },
    { lesson: 'ch0-5', type: 'mcq', q: 'Solid ammonium chloride and solid calcium hydroxide are warmed together. Which of these is <b>not</b> an observation?', options: ['Ammonia gas is given off.', 'A gas with a pungent smell is given off.', 'Moist red litmus paper turns blue.', 'Both solids are white.'], answer: 0, explain: 'Your senses cannot tell you the gas <b>is</b> ammonia — that is a conclusion. Record what you detect: a <b>pungent</b> smell (fan it!) and moist red litmus paper turning <b>blue</b>.' },
    { lesson: 'ch0-5', type: 'tf', q: '“Hydrogen gas is given off” is a good way to record what you <b>observe</b> when magnesium is added to dilute sulphuric acid.', answer: false, explain: 'You cannot see which gas it is. Record what you observe: effervescence (colourless gas bubbles).' },
    { lesson: 'ch0-5', type: 'match', q: 'Match each reaction in Experiment 0.1 with its key observation.', pairs: [['Potassium dichromate + sodium hydroxide', 'Orange → yellow'], ['Ammonium chloride + water', 'Tube becomes colder'], ['Copper(II) sulphate + a few drops of ammonia', 'Pale blue precipitate'], ['Ammonium chloride + calcium hydroxide, warmed', 'Gas with a pungent smell'], ['Magnesium + dilute sulphuric acid', 'Effervescence']], explain: 'The five reactions of Experiment 0.1.' },
    { lesson: 'ch0-5', type: 'match', q: 'Experiment 0.1: match each test with what is observed.', pairs: [['Moist red litmus paper in the pungent gas', 'Turns blue'], ['Burning splint at the mouth of the tube (magnesium + acid)', 'A ‘pop’ sound is heard'], ['More ammonia solution added to the pale blue precipitate', 'A deep blue solution forms']], explain: 'The pungent gas turns moist red litmus paper blue; the gas from magnesium + dilute sulphuric acid gives a ‘pop’ with a burning splint; excess ammonia solution dissolves the pale blue precipitate to give a deep blue solution.' }
  ];

  const GLOSSARY = [
    { en: 'Chemistry', zh: '化學', def: 'The study of matter, such as their composition and properties.' },
    { en: 'Composition', zh: '組成', def: 'What a substance is made of.' },
    { en: 'Properties', zh: '性質', def: 'Qualities that we use to distinguish one matter from another.' },
    { en: 'Analytical chemistry', zh: '分析化學', def: 'Analyse and separate substances.' },
    { en: 'Biochemistry', zh: '生物化學', def: 'Study of chemical processes in organisms.' },
    { en: 'Organic chemistry', zh: '有機化學', def: 'Study of carbon-containing compounds.' },
    { en: 'Inorganic chemistry', zh: '無機化學', def: 'Study of substances not involving carbon.' },
    { en: 'Physical chemistry', zh: '物理化學', def: 'Applies concepts in physics to understand chemistry.' },
    { en: 'Experimental science', zh: '實驗科學', def: 'Chemistry is one — we learn by doing experiments. Laboratory safety is the first priority.' },
    { en: 'Fume cupboard', zh: '煙櫥', def: 'Experiments involving the use or formation of toxic gas must be carried out here.' },
    { en: 'Toxic', zh: '有毒的', def: 'Poisonous, e.g. carbon monoxide gas.' },
    { en: 'Carbon monoxide', zh: '一氧化碳', def: 'A toxic gas that may form as a side product when carbon burns.' },
    { en: 'Reagent bottle', zh: '試劑瓶', def: 'Chemicals taken out of it should never be poured back.' },
    { en: 'Waste bottle', zh: '廢物瓶', def: 'Collects insoluble solids, filter papers and used organic solvents (not the sink).' },
    { en: 'Safety spectacles / goggles', zh: '安全眼鏡／護目鏡', def: 'Eye protection: wear when heating chemicals, handling corrosive chemicals, or doing violent or exothermic reactions.' },
    { en: 'Protective gloves', zh: '防護手套', def: 'Wear them when handling corrosive chemicals.' },
    { en: 'Corrosive', zh: '腐蝕性', def: 'Describes chemicals (e.g. acids and alkalis) that can damage skin and eyes — wear eye protection and protective gloves.' },
    { en: 'Exothermic', zh: '放熱', def: 'Gives out heat, e.g. mixing concentrated acid with water.' },
    { en: 'Hazard', zh: '危險', def: 'A danger. Understand the hazard of each chemical and take proper precautions.' },
    { en: 'Flammable', zh: '易燃', def: 'Keep flammable liquids away from flames.' },
    { en: 'Bunsen burner', zh: '本生燈', def: 'With no immediate use, turn it off or to a small luminous flame.' },
    { en: 'Luminous flame', zh: '發光火焰', def: 'The yellow, visible flame of a Bunsen burner.' },
    { en: '‘Fan’ a gas', zh: '把氣體撥向鼻子', def: 'Wave a little of the gas towards your nose — never smell gases directly.' },
    { en: 'Emergency equipment', zh: '緊急設備', def: 'e.g. first aid materials, eye-wash bottle.' },
    { en: 'Fire-fighting equipment', zh: '滅火設備', def: 'e.g. fire extinguisher, fire blanket and sand bucket.' },
    { en: 'Eye-wash bottle', zh: '洗眼瓶', def: 'Emergency equipment.' },
    { en: 'First aid materials', zh: '急救用品', def: 'Emergency equipment.' },
    { en: 'Fire extinguisher', zh: '滅火筒', def: 'Fire-fighting equipment.' },
    { en: 'Fire blanket', zh: '滅火氈', def: 'Fire-fighting equipment.' },
    { en: 'Sand bucket', zh: '沙桶', def: 'Fire-fighting equipment.' },
    { en: 'Observation', zh: '觀察', def: 'What we notice using our sense organs while doing experiments.' },
    { en: 'Sense organs', zh: '感覺器官', def: 'Seeing with eyes, feeling with hands, smelling with nose, hearing with ears. Tasting is prohibited.' },
    { en: 'Effervescence', zh: '泡騰', def: 'Formation of gas bubbles: “Effervescence of colourless gas bubbles is observed.”' },
    { en: 'Precipitate', zh: '沉澱', def: 'A solid formed in a liquid: “(Blue) precipitate forms.”' },
    { en: 'Suspension', zh: '懸浮液', def: 'Solid particles spread through a liquid, so it looks cloudy.' },
    { en: 'Solution', zh: '溶液', def: 'A clear liquid (it may be coloured) — no solid can be seen.' },
    { en: 'Pungent smell', zh: '刺激性氣味', def: 'The smell of ammonia.' },
    { en: 'Irritating (choking) smell', zh: '刺鼻（令人窒息）的氣味', def: 'The smell of chlorine.' },
    { en: 'Bad egg smell', zh: '臭雞蛋氣味', def: 'The smell of hydrogen sulphide.' },
    { en: 'No observable changes', zh: '沒有可觀察的變化', def: 'What to write when no obvious changes can be detected.' },
    { en: '‘Hissing’ sound', zh: '嘶嘶聲', def: 'A sound heard during a reaction — record it as an observation (hearing with ears).' },
    { en: '‘Pop’ sound', zh: '「噗」聲', def: 'Heard when a burning splint is put at the mouth of the tube of gas from magnesium + dilute sulphuric acid (Experiment 0.1). In Chapter 2 this is the test for hydrogen.' },
    { en: 'Moist red litmus paper', zh: '濕潤的紅色石蕊試紙', def: 'Turns blue in the pungent gas given off when ammonium chloride and calcium hydroxide are warmed (Experiment 0.1).' },
    { en: 'Laboratory facilities', zh: '實驗室設施', def: 'e.g. fume cupboard, eye-wash bottle, first aid materials, fire extinguisher, fire blanket and sand bucket. Know where they are!' }
  ];

  A.registerChapter({
    id: 'ch0', num: 0, title: 'Introduction to Chemistry', zh: '化學入門', icon: '🧪', accent: 'c0',
    intro: 'What chemistry is, how to stay safe in the lab, and how to describe what you observe.',
    lessons: [
      { id: 'ch0-1', num: '0.1', title: 'What is Chemistry?', short: 'Chemistry?', zh: '甚麼是化學？', render: renderWhatIs },
      { id: 'ch0-2', num: '0.2', kicker: 'Laboratory safety (1)', title: 'Students’ Discipline in the Lab', short: 'Lab rules', zh: '實驗室守則', render: renderRules },
      { id: 'ch0-3', num: '0.2', kicker: 'Laboratory safety (2)', title: 'Safety Precautions', short: 'Safety', zh: '安全措施', render: renderSafety },
      { id: 'ch0-4', num: '0.3', title: 'Observations in Chemistry', short: 'Observing', zh: '化學中的觀察', render: renderObserve },
      { id: 'ch0-5', num: '0.3', kicker: 'Virtual lab', title: 'Experiment 0.1: Observation in Chemistry', short: 'Exp 0.1', zh: '實驗 0.1', render: renderExperiment }
    ],
    questions: QUESTIONS,
    glossary: GLOSSARY
  });
})();
