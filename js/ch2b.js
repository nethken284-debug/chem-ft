/* ==========================================================
   Chem FT — Chapter 2 (Part B) · Compounds & Mixtures 化合物與混合物
   2.2 Physical and Chemical Changes · 2.3 Writing Chemical Equations
   (book pp.6–13 = chem2.pdf pp.5–12)

   Appends lessons ch2-4 … ch2-8, questions and glossary to Chapter 2.
   Styles are injected once as <style id="style-ch2b">; every class is
   prefixed .c2b-
   ========================================================== */
(function () {
  'use strict';
  const A = window.ChemApp;
  if (!A) return;
  const { h } = A;
  const F = A.chem;                       // 'H2O' -> H<sub>2</sub>O
  const T = A.term;                       // term(en, zh)
  const EQ = s => F(s).replace(/->/g, '→').replace(/<=>/g, '⇌');
  // unicode subscripts typed in prose (H₂O) -> <sub> markup, like the rest of the site
  const SUB = s => String(s).replace(/[\u2080-\u2089]/g, c => '<sub>' + (c.charCodeAt(0) - 0x2080) + '</sub>');
  const notes = (title, html, tag) => A.noteCard(title, SUB(html), tag);
  const play = (title, sub, badge) => A.playCard(title, SUB(sub), badge);
  // notes that summarise a virtual lab stay hidden until the lab is finished (no spoilers), with a peek button for revision
  function resultsCard(title, html) {
    const card = notes(title, html);
    const body = card.lastElementChild;
    body.classList.add('c2b-hide');
    const peek = h('button', { type: 'button', class: 'btn btn-sm btn-ghost c2b-peek', html: '👀 Finish the lab to unlock, or tap to peek' });
    card.appendChild(peek);
    card.unlock = () => { if (!body.classList.contains('c2b-hide')) return; body.classList.remove('c2b-hide'); peek.remove(); popIn(body); };
    peek.addEventListener('click', () => { card.unlock(); A.sound('click'); });
    return card;
  }
  const subQ = q => { const o = Object.assign({}, q); ['q', 'explain', 'hint'].forEach(k => { if (o[k]) o[k] = SUB(o[k]); }); if (o.options) o.options = o.options.map(SUB); if (o.pairs) o.pairs = o.pairs.map(p => p.map(SUB)); return o; };
  const REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  let uidN = 0;
  const uid = p => 'c2b' + p + (++uidN);
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = t => (t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const wrongTries = n => n + ' wrong ' + (n === 1 ? 'try' : 'tries');

  /* =========================================================
     Styles
     ========================================================= */
  const CSS = `
:root{--c2b-al:#9fb4c9;--c2b-pb:#66707f;--c2b-water:rgba(80,160,240,.32);--c2b-hot:#e8590c;--c2b-cold:#3b82f6}
.c2b-svg{width:100%;height:auto;display:block;margin:0 auto}
.c2b-t{fill:var(--ink);font-family:var(--font);font-weight:800;font-size:13px}
.c2b-t2{fill:var(--ink-2);font-family:var(--font);font-weight:700;font-size:11px}
.c2b-mid{text-anchor:middle}
.c2b-end{text-anchor:end}
.c2b-atom{stroke:var(--atom-stroke);stroke-width:1.3}
.c2b-bk{stroke:var(--ink);stroke-width:1.6}
.c2b-glass{fill:color-mix(in srgb,var(--surface) 55%,transparent);stroke:var(--ink-2);stroke-width:2}
.c2b-line{stroke:var(--ink-2);stroke-width:2;fill:none}
.c2b-frame{fill:var(--surface);stroke:var(--ink);stroke-width:2}
.c2b-stage{background:var(--surface-2);border:1px solid var(--line);border-radius:var(--radius-sm);padding:8px 6px;overflow:hidden}
.c2b-stage .c2b-svg{max-width:500px}
.c2b-gap{margin-top:14px}
.c2b-label{display:block;font-size:12px;font-weight:900;letter-spacing:.07em;text-transform:uppercase;color:var(--ink-3);margin:0 0 8px}
.c2b-stepbar{display:flex;align-items:center;gap:10px;margin:12px 0 4px}
.c2b-stepbar .progress{flex:1;margin:0}
.c2b-stepn{font-size:13px;font-weight:900;color:var(--ink-3);white-space:nowrap}
.c2b-instr{font-weight:800;font-size:16px;min-height:26px;margin:6px 0 12px;text-align:center;line-height:1.45}
.c2b-actions{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}
.c2b-actions .btn{min-width:120px}
.c2b-msg{margin-top:12px;padding:10px 14px;border-radius:var(--radius-sm);background:var(--bg-soft);font-size:15px;color:var(--ink-2)}
.c2b-msg:empty{display:none}
.c2b-msg.good{background:var(--good-soft);color:var(--ink)}
.c2b-msg.bad{background:var(--bad-soft);color:var(--ink)}
.c2b-tbl td,.c2b-tbl th{font-size:14px}
@media(max-width:600px){.c2b-tbl td,.c2b-tbl th{font-size:13px;padding:8px 8px}}
.c2b-tbl td.c2b-pend{color:var(--ink-3)}
.c2b-tbl td.c2b-new{color:var(--good);font-weight:800;animation:c2bfill .6s ease}
.c2b-tbl td.c2b-ex{color:var(--ink);font-weight:600}
.c2b-label.c2b-gap{margin-top:16px}
@keyframes c2bfill{0%{background:var(--good-soft)}100%{background:transparent}}
.c2b-kick{font-size:12px;font-weight:900;letter-spacing:.07em;text-transform:uppercase;color:var(--accent);margin-bottom:4px}
.c2b-two{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.c2b-big{min-height:54px;font-size:16px}
.c2b-card{min-height:96px;display:flex;align-items:center;justify-content:center;text-align:center;padding:14px 16px;border-radius:var(--radius);border:2px solid var(--accent);background:var(--accent-soft);font-weight:800;font-size:17px;line-height:1.4}
.c2b-ico{font-size:34px;line-height:1.1;display:block;margin-bottom:4px}
.c2b-hide{display:none!important}
.c2b-done{text-align:center;padding:6px 0}
.c2b-done .c2b-ico{font-size:42px}
/* chooser panel */
.c2b-panel{margin-top:12px;padding:12px;border-radius:var(--radius-sm);background:var(--bg-soft)}
.c2b-panel:empty{display:none}
.c2b-panel .c2b-ask{font-weight:800;margin-bottom:10px;text-align:center}
.c2b-chips{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}
.c2b-chips .chip{min-height:44px}
.c2b-qo{display:grid;gap:10px}
/* choice cloze */
.c2b-cz{font-size:17px;line-height:2.3}
.c2b-czbr{display:block;height:8px}
.c2b-blank{display:inline-flex;align-items:center;justify-content:center;min-width:84px;min-height:40px;padding:0 10px;margin:0 2px;border:0;border-bottom:2.5px solid var(--accent);background:var(--accent-soft);border-radius:8px 8px 0 0;font:inherit;font-weight:800;color:var(--ink-3);cursor:pointer;line-height:1.35;vertical-align:baseline}
.c2b-blank.open{outline:3px solid var(--accent);outline-offset:1px;color:var(--accent)}
.c2b-blank.ok{color:var(--good);background:var(--good-soft);border-color:var(--good);cursor:default}
/* equation builder */
.c2b-eq{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px}
.c2b-op{color:var(--ink-3);font-size:20px;font-weight:900}
.c2b-slot{min-width:78px;min-height:44px;padding:6px 12px;border-radius:12px;border:2px dashed var(--line-2);background:var(--surface);font:inherit;font-size:15px;font-weight:800;color:var(--ink);cursor:pointer}
.c2b-slot.filled{border-style:solid;border-color:var(--accent);background:var(--accent-soft)}
.c2b-slot.ok{border-style:solid;border-color:var(--good);background:var(--good-soft);color:var(--good);cursor:default}
.c2b-slot.bad{border-style:solid;border-color:var(--bad);background:var(--bad-soft)}
.c2b-tiles{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:12px;padding:10px;border-radius:var(--radius-sm);background:var(--bg-soft)}
.c2b-tile.used{opacity:.25;pointer-events:none}
/* balancer */
.c2b-lv{display:flex;gap:8px;overflow-x:auto;padding:2px 2px 10px;-webkit-overflow-scrolling:touch}
.c2b-lv .chip{flex:none}
.c2b-lv .chip.solved:not(.selected){border-color:var(--good);color:var(--good)}
.c2b-lv .chip.solved::after{content:"✓";font-weight:900}
.c2b-desc{background:var(--bg-soft);border-radius:var(--radius-sm);padding:10px 14px;font-size:15px;color:var(--ink-2)}
.c2b-boxes{display:grid;grid-template-columns:minmax(0,1fr) 22px minmax(0,1fr);gap:6px;align-items:stretch;margin-top:12px}
.c2b-box{border:2px solid var(--line-2);border-radius:12px;background:var(--surface-2);min-height:118px;padding:6px;display:flex;flex-wrap:wrap;gap:6px 10px;align-content:flex-start;justify-content:center}
.c2b-boxlab{width:100%;text-align:center;font-size:11px;font-weight:900;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-3)}
.c2b-grp{display:flex;flex-wrap:wrap;gap:3px;align-items:center;justify-content:center;max-width:100%}
.c2b-arrowc{display:flex;align-items:center;justify-content:center;font-size:20px;color:var(--ink-3);font-weight:900}
.c2b-eqrow{display:flex;flex-wrap:wrap;justify-content:center;align-items:flex-end;gap:6px 4px;margin-top:14px}
.c2b-sp{display:flex;flex-direction:column;align-items:center;gap:3px;min-width:52px}
.c2b-stp{width:44px;height:40px;border-radius:10px;border:1.5px solid var(--line-2);background:var(--surface);cursor:pointer;font-weight:900;font-size:13px;color:var(--ink-2);display:grid;place-items:center}
.c2b-stp:hover:not(:disabled){border-color:var(--accent);color:var(--accent)}
.c2b-stp:disabled{opacity:.35;cursor:default}
.c2b-coef{font-size:22px;font-weight:900;color:var(--accent);line-height:1.1}
.c2b-fm{font-size:17px;font-weight:800;white-space:nowrap}
.c2b-st{font-size:13px;color:var(--ink-3);font-weight:700}
.c2b-eqrow .c2b-op{padding-bottom:4px}
.c2b-scales{display:grid;grid-template-columns:repeat(auto-fill,minmax(98px,1fr));gap:8px;margin-top:14px}
.c2b-scale{border:1.5px solid var(--line);border-radius:12px;background:var(--surface);padding:2px 4px 0;transition:border-color .2s,background .2s}
.c2b-scale.ok{border-color:var(--good);background:var(--good-soft)}
.c2b-beam{transition:transform .4s cubic-bezier(.3,1.5,.5,1)}
.c2b-final{margin-top:12px;text-align:center;font-size:19px;font-weight:900}
/* lab bits */
@keyframes c2bflick{0%,100%{transform:scale(1,1)}50%{transform:scale(1.05,.92)}}
.c2b-flick{transform-box:fill-box;transform-origin:50% 100%;animation:c2bflick .2s ease-in-out infinite}
@keyframes c2bshk{0%,100%{transform:translate(0,0)}25%{transform:translate(-3px,1px)}75%{transform:translate(3px,-1px)}}
.c2b-shk.go{animation:c2bshk .11s linear 7}
.c2b-ctrl{display:flex;flex-wrap:wrap;gap:10px 16px;align-items:center;justify-content:center;margin:8px 0 4px;padding:10px 12px;border-radius:var(--radius-sm);background:var(--bg-soft)}
.c2b-ctrl label{font-weight:800;font-size:15px;display:flex;align-items:center;gap:10px;flex:1;min-width:200px}
.c2b-range{flex:1;accent-color:var(--accent);height:40px;cursor:pointer;min-width:0}
.c2b-vread{font-weight:900;font-variant-numeric:tabular-nums;min-width:48px;text-align:right}
.c2b-read{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}
.c2b-read div{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius-sm);padding:8px 10px;text-align:center;font-size:13px;color:var(--ink-3);font-weight:700}
.c2b-read b{display:block;font-size:20px;color:var(--ink);font-variant-numeric:tabular-nums}
/* triangle */
.c2b-pill rect.bg{fill:var(--surface);stroke:var(--line-2);stroke-width:1.5}
.c2b-pill.sel rect.bg{stroke:var(--accent);stroke-width:2.5;fill:var(--accent-soft)}
.c2b-pill.done rect.bg{stroke:currentColor;fill:var(--surface)}
.c2b-pill text{font-size:12px}
.c2b-hit{cursor:pointer}
.c2b-legend{display:flex;flex-wrap:wrap;gap:6px 18px;justify-content:center;font-size:14px;font-weight:700;color:var(--ink-2);margin-top:6px}
.c2b-legend span{display:inline-flex;align-items:center;gap:6px}
/* tower */
.c2b-band{cursor:pointer}
.c2b-info{display:flex;gap:14px;align-items:center;margin-top:12px;padding:12px 14px;border-radius:var(--radius-sm);background:var(--bg-soft);min-height:92px}
.c2b-info.empty{justify-content:center;color:var(--ink-3);font-weight:700;text-align:center}
.c2b-info .c2b-ico{font-size:38px;margin:0}
.c2b-info b.nm{display:block;font-size:18px}
.c2b-info span{display:block;font-size:15px;color:var(--ink-2)}
.c2b-modes{display:flex;gap:8px;justify-content:center;margin-bottom:10px}
.c2b-prompt{font-size:18px;font-weight:800;text-align:center;margin:2px 0 10px}
.c2b-prompt b{color:var(--accent)}
/* quick-fire */
.c2b-timer{height:8px;border-radius:99px;background:var(--bg-soft);overflow:hidden;margin-bottom:12px}
.c2b-timer i{display:block;height:100%;background:var(--accent);transition:width .25s linear}
.c2b-qfstat{display:flex;justify-content:space-between;font-weight:800;font-size:14px;color:var(--ink-2);margin-bottom:8px}
/* anatomy */
.c2b-anat{display:flex;justify-content:center;align-items:flex-end;flex-wrap:nowrap;font-size:26px;font-weight:900;margin:8px 0 4px;white-space:nowrap}
@media(max-width:420px){.c2b-anat{font-size:21px}}
.c2b-grpw{display:inline-flex;flex-direction:column;align-items:center}
.c2b-brk{font-size:11px;font-weight:900;letter-spacing:.05em;text-transform:uppercase;color:var(--ink-3);border-bottom:2.5px solid var(--line-2);padding:0 4px 2px;margin-bottom:4px;align-self:stretch;text-align:center;transition:all .2s}
.c2b-brk.on{color:var(--accent);border-color:var(--accent)}
.c2b-pc{border:0;background:transparent;font:inherit;color:inherit;padding:2px 1px;border-radius:7px;cursor:pointer;line-height:1.2;min-height:40px}
.c2b-pc:hover{background:var(--bg-soft)}
.c2b-pc.hit{background:var(--good-soft);color:var(--good)}
.c2b-pc.miss{background:var(--bad-soft)}
.c2b-pc.sub{font-size:.62em;vertical-align:-.25em;padding:0}
.c2b-pc.st{font-size:.62em;color:var(--ink-2)}
.c2b-learn{display:grid;gap:8px;margin-top:12px}
.c2b-learn div{padding:9px 12px;border-radius:var(--radius-sm);background:var(--surface-2);border:1px solid var(--line);font-size:15px}
/* builders */
.c2b-bwrap{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px;align-items:center}
@media(max-width:600px){.c2b-bwrap{grid-template-columns:1fr}}
.c2b-bwrap .c2b-svg{max-width:260px}
.c2b-target{font-size:30px;font-weight:900;text-align:center;color:var(--accent)}
.c2b-keys{display:flex;gap:14px;justify-content:center;font-size:14px;font-weight:700;color:var(--ink-2);margin:6px 0 10px}
.c2b-keys i{display:inline-block;width:13px;height:13px;border-radius:50%;border:1.6px solid var(--ink);vertical-align:-2px;margin-right:4px}
.c2b-count{display:grid;gap:10px;max-width:360px;margin:0 auto}
.c2b-crow{display:flex;align-items:center;gap:10px;justify-content:space-between;padding:6px 10px;border-radius:12px;background:var(--surface-2);border:1px solid var(--line)}
.c2b-crow .c2b-coef{min-width:34px;text-align:center}
.c2b-crow .nm{font-weight:800;flex:1}
.c2b-crow.ok{border-color:var(--good);background:var(--good-soft)}
.c2b-crow.bad{border-color:var(--bad);background:var(--bad-soft)}
.c2b-dots{display:flex;gap:6px;justify-content:center;margin:0 0 10px}
.c2b-dots i{width:10px;height:10px;border-radius:50%;background:var(--line-2)}
.c2b-dots i.on{background:var(--accent)}
.c2b-dots i.ok{background:var(--good)}
.c2b-spc{display:inline-flex;align-items:center;gap:4px;white-space:nowrap}
.c2b-states{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:8px 6px;font-size:19px;font-weight:800}
.c2b-sbtn{min-width:46px;min-height:40px;border-radius:10px;border:2px dashed var(--line-2);background:var(--surface);font:inherit;font-size:15px;font-weight:800;color:var(--ink-3);cursor:pointer}
.c2b-sbtn.set{border-style:solid;border-color:var(--accent);color:var(--ink)}
.c2b-sbtn.ok{border-color:var(--good);color:var(--good);background:var(--good-soft)}
.c2b-sbtn.bad{border-color:var(--bad);background:var(--bad-soft)}
.c2b-figrow{display:flex;flex-wrap:wrap;gap:14px;justify-content:center;align-items:flex-start}
.c2b-figrow figure{margin:0;display:flex;flex-direction:column;align-items:center;gap:4px;font-size:14px;font-weight:800;text-align:center}
.c2b-figrow figcaption small{display:block;font-weight:600;color:var(--ink-2)}
.c2b-qfig{display:block;max-width:220px;width:100%;height:auto}
.c2b-peek{min-height:40px}
/* equation judge */
.c2b-jeq{font-size:21px;font-weight:900;line-height:1.5}
@media(max-width:420px){.c2b-jeq{font-size:18px}}
.c2b-two .c2b-big{padding-left:10px;padding-right:10px;line-height:1.25}
.c2b-two .btn.c2b-jok:disabled{opacity:1;background:var(--good-soft);border-color:var(--good);color:var(--good)}
.c2b-two .btn.c2b-jbad:disabled{opacity:1;background:var(--bad-soft);border-color:var(--bad);color:var(--bad)}
`;
  function injectCSS() {
    if (document.getElementById('style-ch2b')) return;
    document.head.appendChild(h('style', { id: 'style-ch2b', text: CSS }));
  }
  injectCSS();

  /* =========================================================
     Small helpers
     ========================================================= */
  function svgEl(vb, aria, cls) {
    return h('svg', { class: 'c2b-svg' + (cls ? ' ' + cls : ''), viewBox: vb, role: 'img', 'aria-label': aria });
  }
  function txt(x, y, s, cls, extra) {
    return h('text', Object.assign({ x, y, class: cls || 'c2b-t c2b-mid' }, extra || {}), s);
  }
  // SVG text with chemical subscripts ("H2O" -> H₂O); a leading coefficient stays full size
  function svgF(x, y, f, cls, extra) {
    const t = h('text', Object.assign({ x, y, class: cls || 'c2b-t c2b-mid' }, extra || {}));
    const parts = String(f).match(/\d+|[^\d]+/g) || [];
    let wasSub = false;
    parts.forEach((p, k) => {
      const isSub = /^\d+$/.test(p) && k > 0 && /[A-Za-z)]$/.test(parts[k - 1]);
      const at = isSub ? { dy: 3.5, style: { fontSize: '0.72em' } } : (wasSub ? { dy: -3.5 } : {});
      t.appendChild(h('tspan', at, p));
      wasSub = isSub;
    });
    return t;
  }
  function attrs(node, o) { for (const k in o) node.setAttribute(k, o[k]); return node; }
  function btn(label, fn, cls) {
    return h('button', { type: 'button', class: 'btn ' + (cls == null ? 'btn-primary' : cls), html: label, on: { click: fn } });
  }
  // tween over ms milliseconds: fn(easedT, rawT); auto-cleaned on navigation
  function tween(ms, fn, done) {
    if (REDUCED) ms = 1;
    let t0 = null;
    A.loop((dt, now) => {
      if (t0 === null) t0 = now;
      const t = Math.min(1, (now - t0) / ms);
      fn(ease(t), t);
      if (t >= 1) { if (done) done(); return false; }
    });
  }
  function shake(el) { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); A.later(() => el.classList.remove('shake'), 450); }
  function popIn(el) { el.classList.remove('pop-in'); void el.offsetWidth; el.classList.add('pop-in'); }
  function msg(el, html, kind) { el.className = 'c2b-msg' + (kind ? ' ' + kind : ''); el.innerHTML = SUB(html || ''); }

  // progress + instruction line for step-by-step labs
  function stepper(total) {
    const bar = h('i', { style: { width: '0%' } });
    const n = h('span', { class: 'c2b-stepn' });
    const ins = h('div', { class: 'c2b-instr', 'aria-live': 'polite' });
    const el = h('div', null, h('div', { class: 'c2b-stepbar' }, h('div', { class: 'progress' }, bar), n), ins);
    return {
      el,
      go(i, html) {
        bar.style.width = (Math.min(i, total) / total * 100) + '%';
        n.textContent = i >= total ? 'Done ✓' : 'Step ' + (i + 1) + ' / ' + total;
        ins.innerHTML = html || '';
        popIn(ins);
      },
      say(html) { ins.innerHTML = html; }
    };
  }

  /** choices(opts, onRight, o): tappable answer list. opts: [{html, ok, why}] */
  function choices(opts, onRight, o) {
    o = o || {};
    const wrap = h('div');
    const box = h('div', { class: o.chips ? 'c2b-chips' : 'c2b-qo' });
    const fb = h('div', { class: 'feedback' });
    let solved = false, tries = 0;
    const order = o.noShuffle ? opts.slice() : A.shuffle(opts);
    order.forEach((op, i) => {
      const b = o.chips
        ? h('button', { type: 'button', class: 'chip', html: '<span>' + SUB(op.html) + '</span>' })
        : h('button', { type: 'button', class: 'q-opt' }, h('span', { class: 'k', text: 'ABCDEFG'[i] }), h('span', { html: SUB(op.html) }));
      b.addEventListener('click', () => {
        if (solved) return;
        if (op.ok) {
          solved = true;
          b.classList.add(o.chips ? 'good' : 'right');
          box.querySelectorAll('button').forEach(x => { x.disabled = true; });
          fb.className = 'feedback good'; fb.innerHTML = '✅ ' + SUB(op.why || o.good || 'Correct!');
          A.sound('good');
          if (onRight) onRight(tries);
        } else {
          tries++;
          b.classList.add(o.chips ? 'bad' : 'wrong'); b.disabled = true;
          fb.className = 'feedback bad'; fb.innerHTML = '❌ ' + SUB(op.why || 'Not quite — try again.');
          A.sound('bad');
        }
      });
      box.appendChild(b);
    });
    wrap.appendChild(box); wrap.appendChild(fb);
    return wrap;
  }

  /** choiceCloze('Text with {{right|wrong|wrong}} blanks', {rewardKey, xp, onDone}) — tap a blank, pick a word */
  function choiceCloze(text, opts) {
    opts = opts || {};
    const wrap = h('div');
    const p = h('div', { class: 'c2b-cz' });
    const picker = h('div', { class: 'c2b-panel' });
    const fb = h('div', { class: 'feedback' });
    const blanks = [];
    let open = null, mistakes = 0, done = 0;
    String(text).split(/(\{\{[^}]+\}\})/g).forEach(part => {
      const m = part.match(/^\{\{([^}]+)\}\}$/);
      if (!m) { if (part) p.appendChild(A.frag(part)); return; }
      const options = m[1].split('|');
      const b = h('button', { type: 'button', class: 'c2b-blank', html: '?', 'aria-label': 'Blank: tap to choose' });
      const bl = { b, options, answer: options[0], ok: false };
      b.addEventListener('click', () => { if (!bl.ok) openPicker(bl); });
      blanks.push(bl); p.appendChild(b);
    });
    function openPicker(bl) {
      if (open) open.b.classList.remove('open');
      open = bl; bl.b.classList.add('open');
      picker.innerHTML = '';
      const row = h('div', { class: 'c2b-chips' });
      A.shuffle(bl.options).forEach(o => {
        const c = h('button', { type: 'button', class: 'chip', html: '<span>' + o + '</span>' });
        c.addEventListener('click', () => {
          if (o === bl.answer) {
            bl.ok = true; bl.b.innerHTML = o; bl.b.classList.remove('open'); bl.b.classList.add('ok'); bl.b.disabled = true; popIn(bl.b);
            open = null; done++; A.sound('pop'); fb.textContent = '';
            const next = blanks.find(x => !x.ok);
            if (next) openPicker(next); else { picker.innerHTML = ''; finish(); }
          } else {
            mistakes++; c.classList.add('bad'); c.disabled = true; A.sound('bad');
            fb.className = 'feedback bad'; fb.textContent = '❌ Not that one — try another word.';
          }
        });
        row.appendChild(c);
      });
      picker.appendChild(h('div', { class: 'c2b-ask', text: 'Choose the missing word:' }));
      picker.appendChild(row);
    }
    function finish() {
      fb.className = 'feedback good';
      fb.textContent = mistakes ? '🎉 All filled in! (' + wrongTries(mistakes) + ')' : '🏆 Perfect — every blank right first time!';
      A.sound('good');
      if (opts.rewardKey) A.reward(opts.rewardKey, opts.xp || 10, opts.reason || 'Key words');
      if (opts.onDone) opts.onDone(mistakes);
    }
    wrap.appendChild(p); wrap.appendChild(picker); wrap.appendChild(fb);
    if (blanks.length && opts.autoOpen !== false) openPicker(blanks[0]);
    return wrap;
  }

  /** eqBuilder({L:[..], R:[..], extra:[..], arrow, hint, onDone}) — tap word/formula tiles into the equation.
   *  Order inside each side does not matter. */
  function eqBuilder(spec) {
    const wrap = h('div');
    const line = h('div', { class: 'c2b-eq' });
    const slots = [];
    const op = s => h('span', { class: 'c2b-op', html: s });
    const mk = side => {
      const s = h('button', { type: 'button', class: 'c2b-slot', html: '&nbsp;', 'aria-label': (side === 'L' ? 'reactant' : 'product') + ' slot' });
      s._side = side; s._tile = null;
      s.addEventListener('click', () => unfill(s));
      slots.push(s); return s;
    };
    spec.L.forEach((_, i) => { if (i) line.appendChild(op('+')); line.appendChild(mk('L')); });
    line.appendChild(op(spec.arrow || '→'));
    spec.R.forEach((_, i) => { if (i) line.appendChild(op('+')); line.appendChild(mk('R')); });
    const tilesBox = h('div', { class: 'c2b-tiles' });
    const tiles = A.shuffle(spec.L.concat(spec.R, spec.extra || [])).map(lbl => {
      const t = h('button', { type: 'button', class: 'chip c2b-tile', html: '<span>' + lbl + '</span>' });
      t._lbl = lbl; t.addEventListener('click', () => fill(t));
      tilesBox.appendChild(t); return t;
    });
    const fb = h('div', { class: 'feedback' });
    let solved = false;
    function fill(t) {
      if (solved) return;
      const s = slots.find(x => !x._tile); if (!s) return;
      s._tile = t; s.innerHTML = t._lbl; s.classList.add('filled'); slots.forEach(x => x.classList.remove('bad'));
      t.classList.add('used'); A.sound('click');
      if (slots.every(x => x._tile)) check();
    }
    function unfill(s) {
      if (solved || !s._tile) return;
      s._tile.classList.remove('used'); s._tile = null; s.innerHTML = '&nbsp;'; s.classList.remove('filled', 'bad'); A.sound('click');
    }
    function sideOk(side, want) {
      const got = slots.filter(x => x._side === side).map(x => x._tile._lbl).sort();
      const w = want.slice().sort();
      return got.length === w.length && got.every((g, i) => g === w[i]);
    }
    function check() {
      const okL = sideOk('L', spec.L), okR = sideOk('R', spec.R);
      if (okL && okR) {
        solved = true;
        slots.forEach(s => { s.classList.remove('filled'); s.classList.add('ok'); s.disabled = true; });
        tiles.forEach(t => { t.disabled = true; });
        tilesBox.classList.add('c2b-hide');
        fb.className = 'feedback good'; fb.innerHTML = '✅ ' + SUB(spec.good || 'Correct!');
        A.sound('good');
        if (spec.onDone) spec.onDone();
      } else {
        slots.forEach(s => { if ((s._side === 'L' && !okL) || (s._side === 'R' && !okR)) s.classList.add('bad'); });
        shake(line);
        fb.className = 'feedback bad';
        fb.innerHTML = '❌ ' + (!okL && okR ? 'The left side (reactants) is not right.' : okL && !okR ? 'The right side (products) is not right.' : 'Not yet.') +
          ' Tap a box to take it back.' + (spec.hint ? ' 💡 ' + SUB(spec.hint) : '');
        A.sound('bad');
      }
    }
    wrap.appendChild(line); wrap.appendChild(tilesBox); wrap.appendChild(fb);
    return wrap;
  }

  /* =========================================================
     Formulae, atoms and molecule pictures
     ========================================================= */
  // '2Pb(NO3)2' -> {coef: 2, atoms: {Pb:1, N:2, O:6}}
  function parseFormula(f) {
    let i = 0, coef = 1;
    const m = f.match(/^(\d+)/);
    if (m) { coef = +m[1]; i = m[1].length; }
    function group() {
      const out = {};
      while (i < f.length && f[i] !== ')') {
        let part;
        if (f[i] === '(') { i++; part = group(); i++; }
        else { const em = f.slice(i).match(/^[A-Z][a-z]?/); if (!em) { i++; continue; } part = { [em[0]]: 1 }; i += em[0].length; }
        const nm = f.slice(i).match(/^\d+/);
        const k = nm ? +nm[0] : 1; if (nm) i += nm[0].length;
        for (const e in part) out[e] = (out[e] || 0) + part[e] * k;
      }
      return out;
    }
    return { coef, atoms: group() };
  }
  const ATOM = {
    H: [4.6, 'var(--atom-H)'], O: [7, 'var(--atom-O)'], N: [7, 'var(--atom-N)'], C: [7, 'var(--atom-C)'],
    Cl: [8, 'var(--atom-Cl)'], Na: [8.5, 'var(--atom-Na)'], S: [8, 'var(--atom-S)'], Al: [8.5, 'var(--c2b-al)'],
    Pb: [9.5, 'var(--c2b-pb)'], Fe: [8, 'var(--atom-Fe)']
  };
  const EL_NAME = { H: 'hydrogen', O: 'oxygen', N: 'nitrogen', C: 'carbon', Cl: 'chlorine', Na: 'sodium', S: 'sulphur', Al: 'aluminium', Pb: 'lead', Fe: 'iron' };
  const rad = e => (ATOM[e] || [7])[0];

  // layout primitives: arrays of [x, y, element]
  function chain(els) {
    const pts = []; let x = 0;
    els.forEach((e, i) => { if (i) x += (rad(els[i - 1]) + rad(e)) * .82; pts.push([x, 0, e]); });
    return pts.map(p => [p[0] - x / 2, 0, p[2]]);
  }
  function star(c, outs, startDeg) {
    const pts = outs.map((e, k) => {
      const a = ((startDeg == null ? -90 : startDeg) + k * 360 / outs.length) * Math.PI / 180;
      const d = (rad(c) + rad(e)) * .8;
      return [Math.cos(a) * d, Math.sin(a) * d, e];
    });
    return pts.concat([[0, 0, c]]);
  }
  const shift = (pts, dx, dy) => pts.map(p => [p[0] + dx, p[1] + dy, p[2]]);
  const LAYOUT = {
    H2O: () => [[-8.4, 4.6, 'H'], [8.4, 4.6, 'H'], [0, -1.5, 'O']],
    CO2: () => chain(['O', 'C', 'O']),
    CH4: () => star('C', ['H', 'H', 'H', 'H'], -45),
    NO2: () => [[-9.6, 4.8, 'O'], [9.6, 4.8, 'O'], [0, -2, 'N']],
    Al2O3: () => [[-17, -4.5, 'O'], [0, -4.5, 'O'], [17, -4.5, 'O'], [-8.5, 7, 'Al'], [8.5, 7, 'Al']],
    Na2SO4: () => star('S', ['O', 'O', 'O', 'O'], -45).concat([[-25, 0, 'Na'], [25, 0, 'Na']]),
    PbSO4: () => shift(star('S', ['O', 'O', 'O', 'O'], -45), 9, 0).concat([[-17, 0, 'Pb']]),
    NaNO3: () => shift(star('N', ['O', 'O', 'O'], 0), 8, 0).concat([[-14.5, 0, 'Na']]),
    'Pb(NO3)2': () => shift(star('N', ['O', 'O', 'O'], 180), -26, 0).concat(shift(star('N', ['O', 'O', 'O'], 0), 26, 0), [[0, 0, 'Pb']]),
    C6H12O6: () => {
      const pts = [];
      for (let k = 0; k < 6; k++) {
        const a = k * Math.PI / 3;
        [-.27, .27].forEach(o => pts.push([Math.cos(a + o) * 30, Math.sin(a + o) * 30, 'H']));
        pts.push([Math.cos(a) * 22.5, Math.sin(a) * 22.5, 'O']);
      }
      for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; pts.push([Math.cos(a) * 12, Math.sin(a) * 12, 'C']); }
      return pts;
    }
  };
  function expand(f) { const a = parseFormula(f).atoms; const out = []; for (const e in a) for (let k = 0; k < a[e]; k++) out.push(e); return out; }
  function layoutOf(f) { return LAYOUT[f] ? LAYOUT[f]() : chain(expand(f)); }
  function bbox(pts, pad) {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    pts.forEach(([x, y, e]) => { const r = rad(e); x0 = Math.min(x0, x - r); y0 = Math.min(y0, y - r); x1 = Math.max(x1, x + r); y1 = Math.max(y1, y + r); });
    return { x: x0 - pad, y: y0 - pad, w: x1 - x0 + 2 * pad, h: y1 - y0 + 2 * pad };
  }
  /** glyph(formula, maxPx): small coloured molecule picture (inline SVG) */
  function glyph(f, maxPx) {
    const pts = layoutOf(f);
    const b = bbox(pts, 1.5);
    const s = Math.min(1.6, (maxPx || 44) / Math.max(b.w, b.h));
    const svg = h('svg', { class: 'c2b-glyph', viewBox: [b.x, b.y, b.w, b.h].map(v => v.toFixed(1)).join(' '), width: (b.w * s).toFixed(1), height: (b.h * s).toFixed(1), 'aria-hidden': 'true' });
    pts.forEach(([x, y, e]) => svg.appendChild(h('circle', { class: 'c2b-atom', cx: x.toFixed(2), cy: y.toFixed(2), r: rad(e), fill: ATOM[e][1] })));
    return svg;
  }
  // Book-style keys: ● filled atom, ○ hollow atom
  function bkAtom(cx, cy, r, filled) {
    return h('circle', { class: 'c2b-bk', cx, cy, r, fill: filled ? 'var(--ink)' : 'var(--surface)' });
  }
  /** bookBox(mols, opts): particle-diagram box in the book's style. mols: [{els:['N','O'], x, y}], opts.filled: element shown as ● */
  function bookBox(mols, opts) {
    opts = opts || {};
    const W = opts.w || 150, H = opts.h || 96, r = opts.r || 9;
    const svg = h('svg', { class: 'c2b-qfig', viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': opts.aria || 'particle diagram' });
    svg.appendChild(h('rect', { class: 'c2b-frame', x: 1, y: 1, width: W - 2, height: H - 2, rx: 3 }));
    mols.forEach(m => {
      const n = m.els.length, step = r * 1.62;
      m.els.forEach((e, k) => svg.appendChild(bkAtom((m.x + (k - (n - 1) / 2) * step).toFixed(1), m.y, r, e === (opts.filled || 'N'))));
    });
    return svg;
  }

  /* =========================================================
     Equation balancer (PhET-style) with tilting balances
     ========================================================= */
  function seesaw(e) {
    const svg = svgEl('0 0 120 76', 'Balance for ' + EL_NAME[e] + ' atoms');
    const beam = h('g', { class: 'c2b-beam', style: { transformOrigin: '60px 44px' } });
    beam.appendChild(h('rect', { x: 6, y: 42, width: 108, height: 5, rx: 2.5, fill: 'var(--ink-2)' }));
    const aL = h('circle', { class: 'c2b-atom', cx: 20, cy: 33, r: 7.5, fill: ATOM[e][1] });
    const aR = h('circle', { class: 'c2b-atom', cx: 100, cy: 33, r: 7.5, fill: ATOM[e][1] });
    const nL = txt(20, 19, '0'), nR = txt(100, 19, '0');
    beam.append(aL, aR, nL, nR);
    svg.appendChild(beam);
    svg.appendChild(h('polygon', { points: '60,47 45,73 75,73', fill: 'var(--bg-soft)', stroke: 'var(--ink-2)', 'stroke-width': 1.5 }));
    svg.appendChild(txt(60, 69, e, 'c2b-t c2b-mid', { style: { fontSize: '12px' } }));
    const el = h('div', { class: 'c2b-scale' }, svg);
    return {
      el,
      set(l, r) {
        nL.textContent = l; nR.textContent = r;
        aL.style.opacity = l ? 1 : .25; aR.style.opacity = r ? 1 : .25;
        beam.style.transform = 'rotate(' + clamp((r - l) * 5, -16, 16) + 'deg)';
        el.classList.toggle('ok', l === r);
      }
    };
  }

  /** balancer(levels, opts)
   *  level: {id, short, desc, L:[[formula, state?]], R:[[formula, state?]], ans:[…], word?:{L, R, x}}
   *  opts: {rewardKey, word (ask the word equation first), onSolved(level), onAll()} */
  function balancer(levels, opts) {
    opts = opts || {};
    const MAX = 9;
    const wrap = h('div');
    const solved = {}, wordDone = {};
    let cur = 0;
    const chips = levels.length > 1 ? h('div', { class: 'c2b-lv', role: 'group', 'aria-label': 'Choose an equation' }) : null;
    const stage = h('div');
    if (chips) {
      levels.forEach((lv, i) => chips.appendChild(h('button', { type: 'button', class: 'chip', html: '<span>' + (i + 1) + ' · ' + lv.short + '</span>', on: { click: () => { cur = i; A.sound('click'); draw(); } } })));
      wrap.appendChild(chips);
    }
    wrap.appendChild(stage);
    function refresh() {
      if (!chips) return;
      [...chips.children].forEach((c, i) => { c.classList.toggle('selected', i === cur); c.classList.toggle('solved', !!solved[levels[i].id]); });
      const act = chips.children[cur];
      if (act) chips.scrollLeft = Math.max(0, act.offsetLeft - chips.offsetLeft - 24);
    }
    function draw() {
      refresh();
      stage.innerHTML = '';
      const lv = levels[cur];
      stage.appendChild(h('div', { class: 'c2b-desc', html: lv.desc }));
      if (opts.word && lv.word && !wordDone[lv.id] && !solved[lv.id]) {
        stage.appendChild(h('span', { class: 'c2b-label c2b-gap', text: 'Part 1 · Word equation' }));
        stage.appendChild(eqBuilder({
          L: lv.word.L, R: lv.word.R, extra: lv.word.x,
          good: 'Word equation done! Now balance the chemical equation.',
          onDone: () => { wordDone[lv.id] = true; A.later(draw, 1100); }
        }));
        return;
      }
      if (opts.word && lv.word) {
        stage.appendChild(h('span', { class: 'c2b-label c2b-gap', text: 'Part 2 · Balance the chemical equation' }));
        stage.appendChild(h('div', { class: 'tiny', style: { textAlign: 'center' }, html: 'Word equation: <b>' + lv.word.L.join(' + ') + ' → ' + lv.word.R.join(' + ') + '</b>' }));
      }
      balanceUI(lv);
    }
    function balanceUI(lv) {
      const sp = lv.L.map(s => ({ f: s[0], st: s[1], side: 'L' })).concat(lv.R.map(s => ({ f: s[0], st: s[1], side: 'R' })));
      sp.forEach(s => { s.atoms = parseFormula(s.f).atoms; });
      const coef = solved[lv.id] ? lv.ans.slice() : sp.map(() => 1);
      const els = [];
      sp.forEach(s => Object.keys(s.atoms).forEach(e => { if (!els.includes(e)) els.push(e); }));
      const boxL = h('div', { class: 'c2b-box' }), boxR = h('div', { class: 'c2b-box' });
      stage.appendChild(h('div', { class: 'c2b-boxes' }, boxL, h('div', { class: 'c2b-arrowc', text: '→' }), boxR));
      const row = h('div', { class: 'c2b-eqrow' });
      sp.forEach((s, i) => {
        if (i) row.appendChild(h('span', { class: 'c2b-op', text: i === lv.L.length ? '→' : '+' }));
        s.val = h('div', { class: 'c2b-coef' });
        s.up = h('button', { type: 'button', class: 'c2b-stp', 'aria-label': 'More ' + s.f, text: '▲', on: { click: () => change(i, 1) } });
        s.dn = h('button', { type: 'button', class: 'c2b-stp', 'aria-label': 'Fewer ' + s.f, text: '▼', on: { click: () => change(i, -1) } });
        row.appendChild(h('div', { class: 'c2b-sp' }, s.up, s.val, s.dn,
          h('div', { class: 'c2b-fm', html: F(s.f) + (s.st ? '<span class="c2b-st">(' + s.st + ')</span>' : '') })));
      });
      stage.appendChild(row);
      const scales = h('div', { class: 'c2b-scales' });
      const sc = {};
      els.forEach(e => { sc[e] = seesaw(e); scales.appendChild(sc[e].el); });
      stage.appendChild(scales);
      const status = h('div', { class: 'feedback', 'aria-live': 'polite' });
      const extra = h('div', { class: 'c2b-actions c2b-gap' });
      stage.appendChild(status); stage.appendChild(extra);
      let touched = false;
      function change(i, d) {
        const v = coef[i] + d;
        if (v < 1 || v > MAX) return;
        coef[i] = v; touched = true;
        A.sound(d > 0 ? 'pop' : 'click');
        update(d > 0 ? i : -1);
      }
      function drawBoxes(popIdx) {
        [[boxL, 'L', 'Reactants'], [boxR, 'R', 'Products']].forEach(([box, side, lab]) => {
          box.innerHTML = '';
          box.appendChild(h('div', { class: 'c2b-boxlab', text: lab }));
          sp.forEach((s, i) => {
            if (s.side !== side) return;
            const g = h('div', { class: 'c2b-grp', title: coef[i] + ' × ' + s.f });
            for (let k = 0; k < coef[i]; k++) {
              const gl = glyph(s.f, s.f.length > 6 ? 62 : 44);
              if (i === popIdx && k === coef[i] - 1) gl.classList.add('pop-in');
              g.appendChild(gl);
            }
            box.appendChild(g);
          });
        });
      }
      function update(popIdx) {
        sp.forEach((s, i) => { s.val.textContent = coef[i]; s.dn.disabled = coef[i] <= 1; s.up.disabled = coef[i] >= MAX; });
        drawBoxes(popIdx);
        const L = {}, R = {};
        sp.forEach((s, i) => { const t = s.side === 'L' ? L : R; for (const e in s.atoms) t[e] = (t[e] || 0) + s.atoms[e] * coef[i]; });
        els.forEach(e => sc[e].set(L[e] || 0, R[e] || 0));
        const bal = els.every(e => (L[e] || 0) === (R[e] || 0));
        const g = coef.reduce(gcd);
        extra.innerHTML = '';
        if (bal && g === 1 && (touched || solved[lv.id])) win();
        else if (bal && g === 1) {
          status.className = 'feedback';
          status.innerHTML = '🤔 Look at the balances. Is this equation <b>already balanced</b>?';
          extra.appendChild(btn('Yes, it’s already balanced!', () => { touched = true; update(-1); }, 'btn'));
        } else if (bal) {
          status.className = 'feedback bad';
          status.innerHTML = '⚖️ Balanced, but not the <b>simplest whole-number ratio</b>. All the numbers can be divided by ' + g + '.';
        } else {
          const off = els.filter(e => (L[e] || 0) !== (R[e] || 0));
          status.className = 'feedback';
          status.innerHTML = '⚖️ Not balanced yet: ' + off.map(e => '<b>' + e + '</b>').join(', ') + '. Change the big numbers in front, never the subscripts.';
        }
      }
      function win() {
        const first = !solved[lv.id];
        solved[lv.id] = true; refresh();
        const parts = sp.map((s, i) => (coef[i] > 1 ? coef[i] : '') + F(s.f) + (s.st ? '(' + s.st + ')' : ''));
        status.className = 'feedback good';
        status.innerHTML = '🎉 Balanced! The same number of each type of atom on both sides.';
        extra.appendChild(h('div', { class: 'c2b-final pop-in', style: { width: '100%' }, html: parts.slice(0, lv.L.length).join(' + ') + ' → ' + parts.slice(lv.L.length).join(' + ') }));
        if (first) {
          A.sound('win'); A.celebrate(.45);
          if (opts.rewardKey) A.reward(opts.rewardKey + '-' + lv.id, opts.xp || 8, 'Equation balanced');
          if (opts.onSolved) opts.onSolved(lv);
          if (levels.length > 1 && levels.every(l => solved[l.id])) {
            if (opts.rewardKey) A.reward(opts.rewardKey + '-all', 30, 'Every equation balanced');
            A.later(() => A.celebrate(1.2), 500);
            if (opts.onAll) opts.onAll();
          }
        }
        let nx = levels.findIndex((l, i) => i > cur && !solved[l.id]);
        if (nx < 0) nx = levels.findIndex(l => !solved[l.id]);
        if (levels.length > 1 && nx >= 0) extra.appendChild(btn('Next equation →', () => { cur = nx; draw(); }));
      }
      update(-1);
    }
    draw();
    return wrap;
  }

  /** quickFire(items, opts): timed "physical or chemical?" round. items: [{t, a:'P'|'C', why}] */
  function quickFire(items, opts) {
    opts = opts || {};
    const SECS = opts.secs || 45, KEY = 'c2b-quickfire';
    const wrap = h('div');
    function intro() {
      wrap.innerHTML = '';
      const best = A.state.best[KEY];
      wrap.appendChild(h('div', { class: 'c2b-done' },
        h('span', { class: 'c2b-ico', text: '⏱️' }),
        h('p', { class: 'muted', html: SECS + ' seconds. Tap <b>Physical</b> or <b>Chemical</b> for each change. Every 5 in a row = bonus point!' + (best != null ? '<br>Your best: <b>' + best + '</b>' : '') }),
        btn('Start', run)));
    }
    function run() {
      wrap.innerHTML = '';
      let left = SECS, score = 0, streak = 0, bestStreak = 0, answered = 0, k = 0, lock = false, over = false;
      let deck = A.shuffle(items);
      const bar = h('i', { style: { width: '100%' } });
      const stat = h('div', { class: 'c2b-qfstat' });
      const card = h('div', { class: 'c2b-card', 'aria-live': 'polite' });
      const fb = h('div', { class: 'feedback', style: { textAlign: 'center' } });
      wrap.append(h('div', { class: 'c2b-timer' }, bar), stat, card,
        h('div', { class: 'c2b-two c2b-gap' }, btn('💧 Physical', () => answer('P'), 'btn c2b-big'), btn('🔥 Chemical', () => answer('C'), 'btn c2b-big')), fb);
      const paint = () => { stat.innerHTML = '<span>Score ' + score + '</span><span>🔥 ' + streak + ' in a row</span><span>⏱ ' + left + ' s</span>'; };
      function next() {
        if (over) return;
        if (k >= deck.length) { deck = A.shuffle(items); k = 0; }
        card.innerHTML = '<div>' + deck[k].t + '</div>'; popIn(card); lock = false; fb.innerHTML = '';
      }
      function answer(a) {
        if (lock || over) return;
        lock = true;
        const it = deck[k++]; answered++;
        if (it.a === a) {
          score++; streak++; bestStreak = Math.max(bestStreak, streak);
          if (streak % 5 === 0) { score++; fb.className = 'feedback good'; fb.innerHTML = '🔥 ' + streak + ' in a row! +1 bonus'; A.sound('win'); }
          else { fb.className = 'feedback good'; fb.innerHTML = '✅ ' + cap(it.why); A.sound('good'); }
          paint(); A.later(next, 700);
        } else {
          streak = 0;
          fb.className = 'feedback bad'; fb.innerHTML = '❌ ' + (it.a === 'P' ? 'Physical' : 'Chemical') + ': ' + it.why;
          A.sound('bad'); shake(card); paint(); A.later(next, 1900);
        }
      }
      const id = A.every(() => {
        if (over) return;
        left--; bar.style.width = (left / SECS * 100) + '%'; paint();
        if (left <= 0) end();
      }, 1000);
      function end() {
        over = true; clearInterval(id);
        const best = A.state.best[KEY], isBest = best == null || score > best;
        if (isBest) { A.state.best[KEY] = score; A.save(); }
        wrap.innerHTML = '';
        wrap.appendChild(h('div', { class: 'c2b-done pop-in' },
          h('span', { class: 'c2b-ico', text: score >= 14 ? '🏆' : score >= 8 ? '👍' : '💪' }),
          h('h3', { text: 'Score: ' + score }),
          h('p', { class: 'muted', html: answered + ' answered · best streak ' + bestStreak + (isBest ? '<br><b>New personal best!</b>' : '') }),
          btn('↻ Play again', run, 'btn')));
        A.sound('win');
        if (score >= 10) A.celebrate(.6);
        if (opts.rewardKey && score >= 8) A.reward(opts.rewardKey, 15, 'Speed round');
      }
      paint(); next();
    }
    intro();
    return wrap;
  }

  /** multiPick(opts, onRight): select-all-that-apply with Check / retry */
  function multiPick(opts, onRight) {
    const wrap = h('div');
    const box = h('div', { class: 'c2b-qo' });
    const fb = h('div', { class: 'feedback' });
    const chosen = new Set();
    let solved = false;
    const items = A.shuffle(opts).map((o, i) => {
      const b = h('button', { type: 'button', class: 'q-opt' }, h('span', { class: 'k', text: 'ABCDEFG'[i] }), h('span', { html: o.html }));
      b.addEventListener('click', () => {
        if (solved) return;
        b.classList.remove('wrong');
        chosen.has(o) ? chosen.delete(o) : chosen.add(o);
        b.classList.toggle('picked'); A.sound('click');
      });
      box.appendChild(b);
      return { b, o };
    });
    const check = btn('Check', () => {
      if (solved) return;
      if (!chosen.size) { fb.className = 'feedback'; fb.textContent = '👆 Tap every correct statement first.'; return; }
      const ok = items.every(x => x.o.ok === chosen.has(x.o));
      if (ok) {
        solved = true; items.forEach(x => { x.b.disabled = true; x.b.classList.remove('picked'); if (x.o.ok) x.b.classList.add('right'); });
        check.disabled = true; fb.className = 'feedback good'; fb.innerHTML = '✅ Spot on — those are the observations!'; A.sound('good');
        if (onRight) onRight();
      } else {
        // keep the correct picks selected; flag and un-pick the wrong ones
        const wrong = items.filter(x => !x.o.ok && chosen.has(x.o));
        wrong.forEach(x => { chosen.delete(x.o); x.b.classList.remove('picked'); x.b.classList.add('wrong'); });
        const missed = items.filter(x => x.o.ok && !chosen.has(x.o)).length;
        fb.className = 'feedback bad';
        fb.innerHTML = '❌ ' + (wrong.length ? (wrong.length > 1 ? 'The red ones' : 'The red one') + ' did not happen.' : '') + (missed ? ' You still need ' + missed + ' more.' : '') + ' Try again!';
        A.sound('bad');
      }
    });
    wrap.append(box, h('div', { class: 'q-actions' }, check), fb);
    return wrap;
  }

  /* =========================================================
     LESSON ch2-4 · 2.2 Physical and chemical changes (Experiment 2.2)
     ========================================================= */
  function labFeS(onDone) {
    const card = play('Virtual lab: Experiment 2.2', 'Run the teacher demo yourself. Watch closely when the mixture gets hot!', '🧪 Virtual lab');
    const gid = uid('glow');
    const svg = svgEl('0 0 360 270', 'A boiling tube with iron and sulphur, held by a test tube holder above a Bunsen burner');
    svg.appendChild(h('defs', null, h('radialGradient', { id: gid },
      h('stop', { offset: '0%', 'stop-color': '#ffe08a', 'stop-opacity': 1 }),
      h('stop', { offset: '50%', 'stop-color': '#ff6a1a', 'stop-opacity': .7 }),
      h('stop', { offset: '100%', 'stop-color': '#ff3d00', 'stop-opacity': 0 }))));
    svg.appendChild(h('rect', { x: 14, y: 262, width: 332, height: 4, rx: 2, fill: 'var(--line-2)' }));
    const BX = 140;
    // Bunsen burner
    svg.appendChild(h('g', null,
      h('path', { d: `M${BX - 72},262 Q${BX - 52},250 ${BX - 26},256`, stroke: '#e0743a', 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }),
      h('path', { d: `M${BX - 34},262 L${BX - 26},250 L${BX + 26},250 L${BX + 34},262 Z`, fill: 'var(--ink-3)' }),
      h('rect', { x: BX - 7, y: 200, width: 14, height: 52, fill: 'var(--ink-2)' }),
      h('rect', { x: BX - 9, y: 230, width: 18, height: 8, rx: 2, fill: 'var(--ink-3)' })));
    svg.appendChild(txt(BX + 36, 246, 'Bunsen burner', 'c2b-t2'));
    // flames (behind the tube)
    const flameNL = h('g', { opacity: 0 }, h('g', { class: 'c2b-flick' },
      h('path', { d: `M${BX - 9},200 Q${BX - 12},178 ${BX},148 Q${BX + 12},178 ${BX + 9},200 Z`, fill: '#8fb8ff', opacity: .85 }),
      h('path', { d: `M${BX - 5},200 Q${BX - 6},187 ${BX},172 Q${BX + 6},187 ${BX + 5},200 Z`, fill: '#3a63d8' })));
    const flameL = h('g', { opacity: 0 }, h('g', { class: 'c2b-flick' },
      h('path', { d: `M${BX - 10},200 C${BX - 20},176 ${BX - 4},158 ${BX + 2},128 C${BX + 9},158 ${BX + 20},176 ${BX + 10},200 Z`, fill: '#ffc233' }),
      h('path', { d: `M${BX - 6},200 C${BX - 10},186 ${BX - 2},176 ${BX + 1},164 C${BX + 5},178 ${BX + 10},188 ${BX + 6},200 Z`, fill: '#ff8a1e' })));
    svg.append(flameNL, flameL);
    const flameLabel = txt(BX - 16, 190, '', 'c2b-t2 c2b-end');
    svg.appendChild(flameLabel);
    // boiling tube (local coords: bottom at 0, mouth at -LEN), tilted like the book figure
    const PX = 140, PY = 150, ANG = 32, LEN = 140, HW = 15;
    const outer = h('g', { transform: `translate(${PX},${PY}) rotate(${ANG})` });
    const inner = h('g', { class: 'c2b-shk' });
    outer.appendChild(inner);
    const glassD = `M${-HW},${-LEN} L${-HW},${-HW} A${HW},${HW} 0 0 0 ${HW},${-HW} L${HW},${-LEN}`;
    inner.appendChild(h('path', { d: glassD + ' Z', fill: 'color-mix(in srgb, var(--surface) 55%, transparent)' }));
    const halo = h('ellipse', { cx: 0, cy: -10, rx: 21, ry: 16, fill: `url(#${gid})`, opacity: 0 });
    const pg = h('g');
    inner.append(halo, pg);
    inner.appendChild(h('path', { d: glassD, class: 'c2b-line' }));
    inner.appendChild(h('ellipse', { cx: 0, cy: -LEN, rx: HW, ry: 3, class: 'c2b-line', 'stroke-width': 1.5 }));
    const plugG = h('g', { opacity: 0 }, [[-7, -128, 6], [0, -132, 7], [7, -128, 6], [-4, -123, 6], [4, -123, 6]]
      .map(([x, y, r]) => h('circle', { cx: x, cy: y, r, fill: '#f5f1e6', stroke: '#cfc6b2', 'stroke-width': 1 })));
    inner.appendChild(plugG);
    inner.appendChild(h('g', null,
      h('rect', { x: -HW - 5, y: -114, width: 2 * HW + 10, height: 10, rx: 3, fill: '#a0703c' }),
      h('rect', { x: HW + 5, y: -112, width: 84, height: 6, rx: 3, fill: '#c08a4e' })));
    svg.appendChild(outer);
    svg.appendChild(txt(150, 64, 'boiling tube', 'c2b-t2 c2b-end'));
    svg.appendChild(txt(352, 132, 'test tube holder', 'c2b-t2 c2b-end'));
    const plugLabel = h('g', { opacity: 0 }, h('line', { x1: 211, y1: 37, x2: 228, y2: 25, class: 'c2b-line', 'stroke-width': 1 }), txt(230, 24, 'mineral wool plug', 'c2b-t2'));
    svg.appendChild(plugLabel);
    // magnet (opening faces the tube)
    const RAD = ANG * Math.PI / 180, NX = Math.cos(RAD), NY = Math.sin(RAD);
    const MX = PX + 24 * NY + NX * 44, MY = PY - 24 * NX + NY * 44;
    const mag = h('g', { opacity: 0 },
      h('path', { d: 'M-12,-11 L2,-11 A11,11 0 0 1 2,11 L-12,11', stroke: '#e5484d', 'stroke-width': 8, fill: 'none' }),
      h('path', { d: 'M-17,-11 L-11,-11 M-17,11 L-11,11', stroke: '#c9ced6', 'stroke-width': 8 }));
    const placeMag = off => mag.setAttribute('transform', `translate(${(MX + NX * off * 50).toFixed(1)},${(MY + NY * off * 50).toFixed(1)}) rotate(${ANG})`);
    placeMag(1);
    svg.appendChild(mag);

    // powder particles inside the tube, sorted from the bottom up
    const R0 = A.rng(23), parts = [];
    while (parts.length < 84) {
      const x = (R0() * 2 - 1) * 11, y = -(2.5 + R0() * 44);
      if (y > -15 && Math.hypot(x, y + 15) > 10.5) continue;
      parts.push({ x, y, d: -y });
    }
    parts.sort((a, b) => a.d - b.d);
    parts.forEach(p => { p.el = h('circle', { cx: p.x.toFixed(1), cy: p.y.toFixed(1), r: 2.5, opacity: 0, stroke: 'var(--ink-3)', 'stroke-width': .35 }); pg.appendChild(p.el); });
    const COL = { Fe: '#8e959e', S: '#f2c94c', hot: '#ff7a1f', hot2: '#ffd27a', FeS: '#2b2522' };
    const paint = (p, c) => { if (p.cur !== c) { p.el.setAttribute('fill', c); p.cur = c; } };

    // appearance table (Discussion 1)
    const cells = {};
    const mkCell = k => (cells[k] = h('td', { class: 'c2b-pend', text: '—' }));
    const table = h('div', { class: 'table-wrap c2b-gap' }, h('table', { class: 't c2b-tbl' },
      h('thead', h('tr', h('th', { colspan: 2, text: 'Substance' }), h('th', { text: 'Appearance' }))),
      h('tbody',
        h('tr', h('th', { rowspan: 2, text: 'Elements' }), h('td', { html: '<b>Iron</b>' }), mkCell('Fe')),
        h('tr', h('td', { html: '<b>Sulphur</b>' }), mkCell('S')),
        h('tr', h('th', { text: 'Mixture' }), h('td', { html: '<b>Iron and sulphur</b>' }), mkCell('mix')),
        h('tr', h('th', { text: 'Compound' }), h('td', { html: '<b>Iron(II) sulphide</b>' }), mkCell('FeS')))));
    const fillCell = (k, html) => { const c = cells[k]; if (c.className === 'c2b-new') return; c.className = 'c2b-new'; c.innerHTML = html; };

    const st = stepper(8);
    const acts = h('div', { class: 'c2b-actions' });
    const ask = h('div', { class: 'c2b-gap' });
    const note = h('div', { class: 'c2b-msg' });
    const setActs = (...b) => { acts.innerHTML = ''; b.forEach(x => x && acts.appendChild(x)); };
    card.body.append(h('div', { class: 'c2b-stage' }, svg), st.el, acts, ask, note, table);

    let nFe = 0, nS = 0, filled = 0, flameOn = false, removed = false;
    const sBtn = btn('🥄 Sulphur powder (0/2)', () => spoon('S'), 'btn');
    function spoon(kind) {
      if (kind === 'Fe' && nFe >= 1) { msg(note, 'Only <b>one</b> spatula measure of iron powder!', 'bad'); A.sound('bad'); return; }
      if (kind === 'S' && nS >= 2) { msg(note, '<b>Two</b> spatula measures of sulphur powder is enough.', 'bad'); A.sound('bad'); return; }
      if (kind === 'Fe') nFe++; else nS++;
      parts.slice(filled, filled + 28).forEach((p, k) => { p.kind = kind; paint(p, COL[kind]); A.later(() => p.el.setAttribute('opacity', 1), k * 14); });
      filled += 28;
      A.sound('pop');
      sBtn.innerHTML = '🥄 Sulphur powder (' + nS + '/2)';
      if (kind === 'Fe') { fillCell('Fe', 'grey powder'); msg(note, 'Iron is a <b>grey powder</b>.'); }
      else { fillCell('S', 'yellow powder'); msg(note, 'Sulphur is a <b>yellow powder</b>.'); }
      if (nFe === 1 && nS === 2) { setActs(); A.later(() => go(1), 700); }
    }
    function mix() {
      setActs();
      inner.classList.remove('go'); inner.getBoundingClientRect(); inner.classList.add('go');
      A.sound('whoosh');
      const kinds = A.shuffle(parts.map(p => p.kind));
      A.later(() => {
        parts.forEach((p, i) => { p.kind = kinds[i]; paint(p, COL[p.kind]); });
        fillCell('mix', 'yellowish grey powder');
        msg(note, 'The mixture is a <b>yellowish grey powder</b>. You can still see grey bits and yellow bits.');
        go(2);
      }, 450);
    }
    function magnet(product) {
      setActs();
      mag.setAttribute('opacity', 1);
      tween(500, t => placeMag(1 - t), () => {
        if (!product) {
          const fe = parts.filter(p => p.kind === 'Fe');
          fe.forEach(p => { p.tx = Math.min(10.5, p.x + 8); });
          tween(600, t => fe.forEach(p => p.el.setAttribute('cx', lerp(p.x, p.tx, t).toFixed(1))), () => {
            msg(note, '🧲 The <b>iron powder is attracted</b> by the magnet, so the iron can be separated from the sulphur. Mixing is <b>easily reversed</b>.', 'good');
            A.sound('good');
            A.later(() => {
              tween(500, t => placeMag(t), () => mag.setAttribute('opacity', 0));
              tween(500, t => fe.forEach(p => p.el.setAttribute('cx', lerp(p.tx, p.x, t).toFixed(1))));
              go(3);
            }, 2000);
          });
        } else {
          A.later(() => {
            msg(note, '🧲 Nothing moves! The black solid is <b>not attracted</b> by the magnet. Iron(II) sulphide is a new substance with <b>different properties</b>.', 'good');
            A.sound('good');
            A.later(() => { tween(500, t => placeMag(t), () => mag.setAttribute('opacity', 0)); go(7); }, 1800);
          }, 700);
        }
      });
    }
    function plug() {
      setActs();
      tween(400, t => { plugG.setAttribute('opacity', t); plugLabel.setAttribute('opacity', t); }, () => go(4));
      A.sound('pop');
      msg(note, 'A <b>mineral wool plug</b> is placed in the mouth of the boiling tube.');
    }
    function light(nonLum) {
      if (!nonLum) {
        flameL.setAttribute('opacity', 1); flameLabel.textContent = 'luminous flame';
        msg(note, '❌ That is a yellow <b>luminous</b> flame. The procedure says: heat strongly with a <b>non-luminous</b> Bunsen flame.', 'bad');
        A.sound('bad'); return;
      }
      flameL.setAttribute('opacity', 0); flameNL.setAttribute('opacity', 1); flameLabel.textContent = 'non-luminous flame'; flameOn = true;
      msg(note, '✅ A blue <b>non-luminous</b> flame. Ready to heat!', 'good');
      A.sound('good'); go(5);
    }
    function heat() {
      setActs(h('span', { class: 'tiny', text: 'Heating strongly…' }));
      A.sound('whoosh');
      msg(note, '');
      A.later(ignite, REDUCED ? 30 : 1800);
    }
    function ignite() {
      st.say('🔥 The mixture <b>glows red hot</b>! Now remove the flame… does the glow stop?');
      setActs(btn('Remove the flame', removeFlame));
      A.sound('fizz');
      let front = 0;
      A.loop((dt, now) => {
        if (!svg.isConnected) return false;
        front += dt * 10;
        let busy = false;
        parts.forEach(p => {
          if (p.burn == null && p.d <= front) p.burn = now;
          if (p.burn == null) { busy = true; return; }
          if (now - p.burn < 900) { busy = true; paint(p, Math.random() < .35 ? COL.hot2 : COL.hot); } else paint(p, COL.FeS);
        });
        halo.setAttribute('cy', (-Math.min(front, 47)).toFixed(1));
        halo.setAttribute('opacity', (front < 48 ? .9 : Math.max(0, .9 - (front - 48) / 8)).toFixed(2));
        if (!busy) { reacted(); return false; }
      });
    }
    function removeFlame() {
      removed = true; flameOn = false;
      flameNL.setAttribute('opacity', 0); flameLabel.textContent = '';
      setActs();
      st.say('👀 Flame removed… the <b>glow keeps spreading</b> through the mixture!');
      msg(note, 'Even without the flame, the glow spreads through the mixture: <b>heat is given out</b>.', 'good');
    }
    function reacted() {
      if (flameOn) { flameNL.setAttribute('opacity', 0); flameLabel.textContent = ''; flameOn = false; }
      setActs();
      fillCell('FeS', 'black solid');
      msg(note, (removed ? '' : 'Did you notice? Once it started, the glow spread through the mixture by itself: <b>heat is given out</b>. ') +
        '⚫ A <b>black solid</b> is formed: iron(II) sulphide, a new substance.', 'good');
      A.sound('good');
      A.later(() => go(6), 1200);
    }
    const STEPS = [
      () => { st.go(0, 'Mix <b>one</b> spatula measure of iron powder and <b>two</b> spatula measures of sulphur powder in the boiling tube.'); setActs(btn('🥄 Iron powder (1 only)', () => spoon('Fe'), 'btn'), sBtn); },
      () => { st.go(1, 'Shake to mix the two powders.'); setActs(btn('🔀 Shake to mix', mix)); },
      () => { st.go(2, 'Quick test (like Experiment 2.1): bring a magnet close to the mixture.'); setActs(btn('🧲 Magnet test', () => magnet(false))); },
      () => { st.go(3, 'Place a <b>mineral wool plug</b> in the mouth of the boiling tube.'); setActs(btn('Insert mineral wool plug', plug)); },
      () => { st.go(4, 'Light the Bunsen burner. Which flame do we heat with?'); setActs(btn('Luminous flame (yellow)', () => light(false), 'btn'), btn('Non-luminous flame (blue)', () => light(true), 'btn')); },
      () => { st.go(5, 'Heat the boiling tube <b>strongly</b>.'); setActs(btn('🔥 Heat strongly', heat)); },
      () => { st.go(6, 'Test the black solid with the magnet.'); setActs(btn('🧲 Magnet test', () => magnet(true))); },
      () => {
        st.go(7, 'What did you observe on heating? Pick <b>all</b> the correct observations, then Check.');
        setActs();
        ask.appendChild(multiPick([
          { html: 'The mixture <b>glows red hot</b>.', ok: true },
          { html: 'The glow <b>spreads through the mixture</b>, even after the flame is removed.', ok: true },
          { html: 'A <b>black solid</b> is formed.', ok: true },
          { html: 'Colourless gas bubbles are given off.', ok: false },
          { html: 'The mixture melts into a blue liquid.', ok: false },
          { html: 'No observable changes.', ok: false }
        ], () => {
          st.go(8, '🏆 Experiment complete! Heating iron and sulphur made a <b>new substance</b>.');
          A.sound('win'); A.celebrate(.7);
          A.reward('c2b-lab22', 20, 'Experiment 2.2');
          if (onDone) onDone();
          card.score.textContent = '✓ done';
          msg(note, 'Heating iron and sulphur: the mixture glows red hot, the glow spreads (heat is given out) and a black solid, iron(II) sulphide, is formed. A <b>new substance</b> → a <b>chemical change</b>.', 'good');
          setActs(btn('↻ Run it again', () => card.replaceWith(labFeS(onDone)), 'btn'));
        }));
      }
    ];
    function go(i) { STEPS[i](); }
    go(0);
    return card;
  }

  function mixVsHeat() {
    const card = play('Mixing vs heating: fill in the table', 'Each card describes <b>mixing</b> or <b>heating</b> iron and sulphur. Tap the right one and watch the book’s table fill in.', '🃏 Sort');
    const ROWS = [
      { k: 'Reversibility', m: 'easily <b>reversed</b> (e.g. a magnet can remove the iron)', x: 'cannot be reversed by <b>physical methods</b>', hint: 'A magnet can still pull iron out of the mixture, but not out of iron(II) sulphide.' },
      { k: 'Properties', m: 'forms substances with generally <b>similar</b> properties', x: 'forms substances with <b>different (new)</b> properties', hint: 'A mixture keeps the properties of iron and sulphur; the black solid does not.' },
      { k: 'Composition', m: 'forms substances with <b>variable</b> composition', x: 'forms substances with a <b>fixed</b> composition', hint: 'You can mix any amounts, but a compound always has the same make-up.' },
      { k: 'New substance formed?', m: '<b>No</b>', x: '<b>Yes</b>: iron(II) sulphide', hint: 'Only heating made the black solid.' },
      { k: 'Heat change', m: '<b>no</b> (or very little) heat change', x: 'heat is <b>given out</b>', hint: 'Remember the glow that kept spreading by itself?' },
      { k: 'Classification', m: '<b>physical</b> change', x: '<b>chemical</b> change', hint: 'New substance formed → chemical change.' }
    ];
    const cells = {};
    const table = h('div', { class: 'table-wrap' }, h('table', { class: 't c2b-tbl' },
      h('thead', h('tr', h('th'), h('th', { text: 'Mixing iron and sulphur' }), h('th', { text: 'Heating iron and sulphur' }))),
      h('tbody', ROWS.map((r, i) => h('tr', h('th', { text: r.k }),
        (cells[i + 'm'] = h('td', { class: 'c2b-pend', text: '?' })), (cells[i + 'x'] = h('td', { class: 'c2b-pend', text: '?' })))))));
    const deck = A.shuffle(ROWS.flatMap((r, i) => [{ i, col: 'm', html: r.m }, { i, col: 'x', html: r.x }]));
    let k = 0, mistakes = 0;
    const cardEl = h('div', { class: 'c2b-card', 'aria-live': 'polite' });
    const bM = btn('🥄 Mixing', () => pick('m'), 'btn c2b-big'), bX = btn('🔥 Heating', () => pick('x'), 'btn c2b-big');
    const fb = h('div', { class: 'feedback' });
    function show() {
      card.score.textContent = k + ' / ' + deck.length;
      if (k >= deck.length) return finish();
      const c = deck[k];
      cardEl.innerHTML = '<div><div class="c2b-kick">' + ROWS[c.i].k + '</div>' + c.html + '</div>';
      popIn(cardEl);
    }
    function pick(col) {
      const c = deck[k]; if (!c) return;
      if (c.col === col) {
        const td = cells[c.i + c.col]; td.innerHTML = c.html; td.className = 'c2b-new';
        A.sound('pop'); fb.className = 'feedback good'; fb.innerHTML = '✅ Yes!';
        k++; show();
      } else {
        mistakes++; shake(cardEl); A.sound('bad');
        fb.className = 'feedback bad'; fb.innerHTML = '❌ ' + ROWS[c.i].hint;
      }
    }
    function finish() {
      cardEl.innerHTML = '<div><span class="c2b-ico">🏆</span>Table complete! Mixing = <b>physical</b> change · Heating = <b>chemical</b> change</div>';
      bM.disabled = bX.disabled = true;
      fb.className = 'feedback good'; fb.innerHTML = mistakes ? '🎉 Done with ' + wrongTries(mistakes) + '.' : '🌟 Perfect — no mistakes!';
      A.sound('win'); if (!mistakes) A.celebrate(.5);
      A.reward('c2b-mixheat', 15, 'Mixing vs heating');
    }
    card.body.append(cardEl, h('div', { class: 'c2b-two c2b-gap' }, bM, bX), fb, h('div', { class: 'c2b-gap' }, table));
    show();
    return card;
  }

  function chemChangeCard() {
    const card = play('Reactants → product', 'Label the particle diagram, then write the equations for heating iron and sulphur.', '✍️ Write');
    const svg = svgEl('0 0 340 132', 'Iron atoms and sulphur atoms are heated to form iron(II) sulphide');
    for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) svg.appendChild(h('circle', { class: 'c2b-atom', cx: 16 + c * 15 + r * 7, cy: 40 + r * 14, r: 8, fill: 'var(--atom-Fe)' }));
    svg.appendChild(txt(96, 54, '+', 'c2b-t c2b-mid', { style: { fontSize: '20px' } }));
    [[116, 36], [131, 32], [146, 38], [122, 50], [138, 48], [153, 52]].forEach(([x, y]) => svg.appendChild(h('circle', { class: 'c2b-atom', cx: x, cy: y, r: 8.5, fill: 'var(--atom-S)' })));
    svg.appendChild(h('line', { x1: 174, y1: 46, x2: 206, y2: 46, class: 'c2b-line', 'stroke-width': 3 }));
    svg.appendChild(h('polygon', { points: '206,40 217,46 206,52', fill: 'var(--ink-2)' }));
    svg.appendChild(txt(194, 34, 'heat'));
    for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) svg.appendChild(h('circle', { class: 'c2b-atom', cx: 238 + c * 16, cy: 26 + r * 16, r: 8, fill: (r + c) % 2 ? 'var(--atom-S)' : 'var(--atom-Fe)' }));
    svg.appendChild(txt(46, 78, 'iron', 'c2b-t2 c2b-mid')); svg.appendChild(txt(135, 78, 'sulphur', 'c2b-t2 c2b-mid'));
    svg.appendChild(h('path', { d: 'M10,88 Q10,96 45,96 Q82,96 84,104 Q86,96 124,96 Q160,96 160,88', class: 'c2b-line', 'stroke-width': 1.6 }));
    svg.appendChild(h('path', { d: 'M230,82 Q230,90 255,90 Q268,90 270,98 Q272,90 285,90 Q310,90 310,82', class: 'c2b-line', 'stroke-width': 1.6 }));
    const labL = txt(84, 124, '?'), labR = txt(270, 118, '?');
    svg.append(h('rect', { x: 34, y: 106, width: 100, height: 24, rx: 6, class: 'c2b-frame' }), labL, h('rect', { x: 220, y: 100, width: 100, height: 24, rx: 6, class: 'c2b-frame' }), labR);
    const s2 = h('div', { class: 'c2b-hide c2b-gap' }), s3 = h('div', { class: 'c2b-hide c2b-gap' });
    const done = h('div', { class: 'c2b-msg' });
    card.body.append(h('div', { class: 'c2b-stage' }, svg),
      h('div', { class: 'c2b-gap' }, h('span', { class: 'c2b-label', text: '1 · Label the boxes' }),
        choiceCloze('Iron and sulphur are the {{reactants|products|mixtures}}. Iron(II) sulphide is the {{product|reactant|element}}.', {
          onDone: () => { labL.textContent = 'reactants'; labR.textContent = 'product'; s2.classList.remove('c2b-hide'); }
        })), s2, s3, done);
    s2.append(h('span', { class: 'c2b-label', text: '2 · Word equation' }), eqBuilder({
      L: ['iron', 'sulphur'], R: ['iron(II) sulphide'], extra: ['heat', 'oxygen'],
      hint: '“Heat” is a condition, not a substance.', good: 'iron + sulphur → iron(II) sulphide',
      onDone: () => s3.classList.remove('c2b-hide')
    }));
    s3.append(h('span', { class: 'c2b-label', text: '3 · Chemical equation' }), eqBuilder({
      L: ['Fe', 'S'], R: ['FeS'], extra: ['I', 'Su'],
      hint: 'The symbol of iron is Fe and the symbol of sulphur is S.', good: 'Fe + S → FeS',
      onDone: () => { msg(done, '🎉 <b>Word equation:</b> iron + sulphur → iron(II) sulphide<br><b>Chemical equation:</b> Fe + S → FeS', 'good'); A.reward('c2b-fes-eq', 10, 'Equations'); A.sound('win'); }
    }));
    return card;
  }

  function renderL4(root) {
    root.appendChild(notes('Experiment 2.2 · Mixing and heating iron and sulphur',
      '<p>What is the difference between just <b>mixing</b> two elements and <b>heating</b> them together? Procedure (teacher demonstration):</p>' +
      '<ol><li>Mix <b>one</b> spatula measure of iron powder and <b>two</b> spatula measures of sulphur powder in a ' + T('boiling tube', '大試管') + '.</li>' +
      '<li>Place a ' + T('mineral wool', '礦物棉') + ' plug in the mouth of the boiling tube.</li>' +
      '<li>Heat the boiling tube strongly with a ' + T('non-luminous', '無光焰') + ' Bunsen flame (hold it with a test tube holder).</li></ol>', 'Teacher demo'));
    const seen = resultsCard('What did we see?',
      '<ul><li>On heating, the mixture <b>glows red hot</b>.</li><li>The glow <b>spreads through the mixture</b>, even after the flame is removed → heat is given out.</li>' +
      '<li>A <b>black solid</b> is formed: ' + T('iron(II) sulphide', '硫化亞鐵') + ', a new substance.</li></ul>');
    root.appendChild(labFeS(() => seen.unlock()));
    root.appendChild(seen);
    root.appendChild(mixVsHeat());
    root.appendChild(A.keybox('<p>A ' + T('physical change', '物理變化') + ' is a change in which <b>no</b> new substance is formed.</p>' +
      '<p>A ' + T('chemical change', '化學變化') + ' is a change in which one or more <b>new substances are formed</b>. A chemical change is also called a ' + T('chemical reaction', '化學反應') + '.</p>'));
    const kw = play('Key definitions', 'Type the missing words.', '📖 Key words');
    kw.body.appendChild(A.cloze('A physical change is a change in which [[no]] new substance is formed. A chemical change is a change in which one or more [[new substances|new substance]] are formed.', { rewardKey: 'c2b-def-change', xp: 10 }));
    root.appendChild(kw);
    root.appendChild(notes('Chemical change (chemical reaction)',
      '<ul><li>Example: <b>heating elements to form compounds</b>, e.g. heating iron and sulphur.</li>' +
      '<li>The substances that react are the ' + T('reactants', '反應物') + ' (iron and sulphur). The new substance formed is the ' + T('product', '生成物') + ' (iron(II) sulphide).</li>' +
      '<li>' + T('Word equation', '文字方程式') + ': <b>iron + sulphur → iron(II) sulphide</b></li>' +
      '<li>' + T('Chemical equation', '化學方程式') + ': <b>Fe + S → FeS</b></li></ul>'));
    root.appendChild(chemChangeCard());
    A.quickCheck(root, 'ch2', 'ch2-4', 5);
  }

  /* =========================================================
     LESSON ch2-5 · 2.2 Classifying changes
     ========================================================= */
  function mixDemo() {
    const card = play('Mixing is a physical change', 'Tap <b>Mix</b> and watch the particles.', '👀 Watch');
    const svg = svgEl('0 0 340 112', 'Particles of two substances before and after mixing');
    [[6, 15, 80], [112, 15, 80], [246, 12, 86]].forEach(([x, y, w]) => svg.appendChild(h('rect', { class: 'c2b-frame', x, y, width: w, height: w, rx: 3 })));
    svg.appendChild(txt(99, 61, '+', 'c2b-t c2b-mid', { style: { fontSize: '18px' } }));
    svg.appendChild(h('line', { x1: 202, y1: 55, x2: 232, y2: 55, class: 'c2b-line' }));
    svg.appendChild(h('polygon', { points: '232,50 241,55 232,60', fill: 'var(--ink-2)' }));
    svg.appendChild(txt(219, 45, 'mix', 'c2b-t2 c2b-mid'));
    const startA = [[24, 32], [60, 42], [30, 72], [66, 80]], startB = [[130, 36], [168, 32], [138, 66], [172, 78]];
    const ends = A.shuffle([[262, 30], [292, 26], [320, 40], [270, 58], [302, 60], [326, 80], [258, 86], [292, 86]]);
    const ps = [];
    startA.forEach((p, i) => ps.push({ el: h('circle', { cx: p[0], cy: p[1], r: 6.5, class: 'c2b-bk', fill: 'var(--surface)' }), s: p, e: ends[i], c: 1 }));
    startB.forEach((p, i) => ps.push({ el: h('rect', { x: -5.5, y: -5.5, width: 11, height: 11, fill: 'var(--ink)', transform: `translate(${p[0]},${p[1]}) rotate(45)` }), s: p, e: ends[4 + i], c: 0 }));
    ps.forEach(p => svg.appendChild(p.el));
    const place = (p, x, y) => (p.c ? attrs(p.el, { cx: x.toFixed(1), cy: y.toFixed(1) }) : p.el.setAttribute('transform', `translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(45)`));
    const note = h('div', { class: 'c2b-msg' });
    let mixed = false;
    const b = btn('🔀 Mix!', () => {
      if (mixed) { ps.forEach(p => place(p, p.s[0], p.s[1])); mixed = false; b.innerHTML = '🔀 Mix!'; msg(note, ''); return; }
      mixed = true; b.disabled = true; A.sound('whoosh');
      tween(1100, t => ps.forEach(p => place(p, lerp(p.s[0], p.e[0], t), lerp(p.s[1], p.e[1], t) - Math.sin(t * Math.PI) * 18)), () => {
        b.disabled = false; b.innerHTML = '↺ Reset';
        msg(note, 'The particles just <b>spread among each other</b>. They are the same particles as before, so <b>no new substance</b> is formed → a physical change.', 'good');
        A.reward('c2b-mixdemo', 5, 'Mixing');
      });
    });
    card.body.append(h('div', { class: 'c2b-stage' }, svg), h('div', { class: 'c2b-actions c2b-gap' }, b), note);
    return card;
  }

  const STATE_ARROWS = [
    { id: 'mel', from: 'solid', to: 'liquid', name: 'melting', heat: 'abs' },
    { id: 'fre', from: 'liquid', to: 'solid', name: 'freezing', heat: 'out' },
    { id: 'boi', from: 'liquid', to: 'gas', name: 'boiling', heat: 'abs' },
    { id: 'con', from: 'gas', to: 'liquid', name: 'condensation', heat: 'out' },
    { id: 'sub', from: 'solid', to: 'gas', name: 'sublimation', heat: 'abs' },
    { id: 'dep', from: 'gas', to: 'solid', name: 'deposition', heat: 'out' }
  ];
  function stateTriangle() {
    const card = play('Changes of physical state', 'Tap a <b>?</b> label, name the change, then decide: is heat <b>absorbed</b> or <b>given out</b>?', '🔺 Play');
    const P = { solid: [64, 74], gas: [296, 74], liquid: [180, 270] };
    const svg = svgEl('0 0 360 324', 'Triangle showing the six changes of state between solid, liquid and gas');
    const movers = [];
    Object.keys(P).forEach(state => {
      const [cx, cy] = P[state];
      svg.appendChild(h('rect', { class: 'c2b-frame', x: cx - 30, y: cy - 24, width: 60, height: 48, rx: 3 }));
      let pts;
      if (state === 'solid') { pts = []; for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) pts.push([cx - 17.25 + c * 11.5, cy - 11.5 + r * 11.5]); }
      else if (state === 'liquid') pts = [[-18, -4], [-7, -8], [5, -2], [17, -7], [-14, 10], [-2, 6], [10, 12], [21, 8]].map(([x, y]) => [cx + x, cy + y + 4]);
      else pts = [[-14, -10], [12, 4], [-4, 12]].map(([x, y]) => [cx + x, cy + y]);
      pts.forEach((p, i) => {
        const c = h('circle', { class: 'c2b-atom', cx: p[0], cy: p[1], r: 5.4, fill: 'var(--atom-N)' });
        svg.appendChild(c);
        movers.push({ c, x: p[0], y: p[1], st: state, ph: i * 1.7, vx: (i % 2 ? 1 : -1) * (16 + i * 5), vy: (i % 2 ? -1 : 1) * (12 + i * 4), bx: cx, by: cy });
      });
      svg.appendChild(txt(cx, state === 'liquid' ? cy + 42 : cy - 32, state));
    });
    const arrows = {};
    const SIDE = { sub: -1, dep: -1 };
    STATE_ARROWS.forEach(a => {
      const [x1, y1] = P[a.from], [x2, y2] = P[a.to];
      const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
      const side = SIDE[a.id] || 1, nx = -uy * side, ny = ux * side;
      const sx = x1 + ux * 44 + nx * 8, sy = y1 + uy * 44 + ny * 8, ex = x2 - ux * 44 + nx * 8, ey = y2 - uy * 44 + ny * 8;
      const g = h('g', { style: { color: 'var(--ink-3)' } });
      const line = h('line', { x1: sx.toFixed(1), y1: sy.toFixed(1), x2: (ex - ux * 8).toFixed(1), y2: (ey - uy * 8).toFixed(1), stroke: 'currentColor', 'stroke-width': 2.5, 'stroke-linecap': 'round' });
      const head = h('polygon', { fill: 'currentColor', points: [[ex, ey], [ex - ux * 10 - uy * 5, ey - uy * 10 + ux * 5], [ex - ux * 10 + uy * 5, ey - uy * 10 - ux * 5]].map(p => p.map(v => v.toFixed(1)).join(',')).join(' ') });
      const mx = (x1 + x2) / 2 + nx * 26, my = (y1 + y2) / 2 + ny * 26;
      let ang = Math.atan2(dy, dx) * 180 / Math.PI;
      if (ang > 90) ang -= 180; if (ang < -90) ang += 180;
      const pill = h('g', { class: 'c2b-pill c2b-hit', role: 'button', tabindex: 0, 'aria-label': a.from + ' to ' + a.to, transform: `translate(${mx.toFixed(1)},${my.toFixed(1)}) rotate(${ang.toFixed(1)})` });
      const label = txt(0, 4.5, '?');
      pill.append(h('rect', { class: 'bg', x: -45, y: -11, width: 90, height: 22, rx: 11 }), label, h('rect', { x: -50, y: -16, width: 100, height: 32, fill: 'transparent' }));
      pill.addEventListener('click', () => select(a, true));
      pill.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(a, true); } });
      g.append(line, head, pill);
      svg.appendChild(g);
      arrows[a.id] = { g, line, pill, label };
    });
    const legend = h('div', { class: 'c2b-legend' },
      h('span', { html: '<svg width="36" height="10" aria-hidden="true"><line x1="1" y1="5" x2="27" y2="5" stroke="var(--c2b-hot)" stroke-width="2.5"/><polygon points="27,1 35,5 27,9" fill="var(--c2b-hot)"/></svg> heat absorbed' }),
      h('span', { html: '<svg width="36" height="10" aria-hidden="true"><line x1="1" y1="5" x2="27" y2="5" stroke="var(--c2b-cold)" stroke-width="2.5" stroke-dasharray="6 5"/><polygon points="27,1 35,5 27,9" fill="var(--c2b-cold)"/></svg> heat given out' }));
    const panel = h('div', { class: 'c2b-panel' });
    const done = {};
    let nDone = 0;
    function select(a, user) {
      if (done[a.id]) return;
      Object.values(arrows).forEach(x => x.pill.classList.remove('sel'));
      arrows[a.id].pill.classList.add('sel');
      if (user) A.sound('click');
      panel.innerHTML = '';
      panel.appendChild(h('div', { class: 'c2b-ask', html: cap(a.from) + ' → ' + a.to + ': what is this change called?' }));
      panel.appendChild(choices(STATE_ARROWS.map(x => ({ html: x.name, ok: x.id === a.id, why: x.id === a.id ? '' : cap(x.name) + ' is ' + x.from + ' → ' + x.to + '. Try again!' })),
        () => A.later(() => askHeat(a), 450), { chips: true }));
    }
    function askHeat(a) {
      arrows[a.id].label.textContent = a.name;
      panel.innerHTML = '';
      panel.appendChild(h('div', { class: 'c2b-ask', html: 'During <b>' + a.name + '</b>, is heat absorbed or given out?' }));
      const why = 'Melting, boiling and sublimation absorb heat; freezing, condensation and deposition give out heat.';
      panel.appendChild(choices([{ html: '🔥 Heat absorbed', ok: a.heat === 'abs', why: a.heat === 'abs' ? '' : why }, { html: '❄️ Heat given out', ok: a.heat === 'out', why: a.heat === 'out' ? '' : why }],
        () => finishArrow(a), { chips: true, noShuffle: true }));
    }
    function finishArrow(a) {
      done[a.id] = true; nDone++;
      const ar = arrows[a.id];
      ar.g.style.color = a.heat === 'abs' ? 'var(--c2b-hot)' : 'var(--c2b-cold)';
      if (a.heat === 'out') ar.line.setAttribute('stroke-dasharray', '6 5');
      ar.pill.classList.remove('sel'); ar.pill.classList.add('done');
      card.score.textContent = nDone + ' / 6';
      A.sound('pop');
      if (nDone === STATE_ARROWS.length) {
        panel.innerHTML = '';
        panel.appendChild(h('div', { class: 'c2b-ask', html: '🏆 All six named! Changes of physical state are <b>physical changes</b>: no new substance is formed.' }));
        A.sound('win'); A.celebrate(.6); A.reward('c2b-triangle', 15, 'Changes of state');
        return;
      }
      const next = STATE_ARROWS.find(x => !done[x.id]);
      A.later(() => select(next, false), 650);
    }
    const gasM = movers.filter(m => m.st === 'gas');
    if (!REDUCED) A.loop((dt, now) => {
      if (!svg.isConnected) return false;
      const t = now / 1000;
      movers.forEach(m => {
        if (m.st === 'solid') attrs(m.c, { cx: (m.x + Math.sin(t * 14 + m.ph) * .7).toFixed(1), cy: (m.y + Math.cos(t * 12 + m.ph) * .7).toFixed(1) });
        else if (m.st === 'liquid') attrs(m.c, { cx: (m.x + Math.sin(t * 1.6 + m.ph) * 2.6).toFixed(1), cy: (m.y + Math.cos(t * 1.3 + m.ph) * 1.6).toFixed(1) });
        else {
          m.x += m.vx * dt; m.y += m.vy * dt;
          if (m.x < m.bx - 24 || m.x > m.bx + 24) { m.vx *= -1; m.x = clamp(m.x, m.bx - 24, m.bx + 24); }
          if (m.y < m.by - 18 || m.y > m.by + 18) { m.vy *= -1; m.y = clamp(m.y, m.by - 18, m.by + 18); }
          attrs(m.c, { cx: m.x.toFixed(1), cy: m.y.toFixed(1) });
        }
      });
      // gas particles bounce off each other instead of overlapping (they stay far apart)
      for (let i = 0; i < gasM.length; i++) for (let j = i + 1; j < gasM.length; j++) {
        const a = gasM[i], b = gasM[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 11 && d > 0) {
          [a.vx, b.vx] = [b.vx, a.vx]; [a.vy, b.vy] = [b.vy, a.vy];
          const push = (11 - d) / 2, ux = (a.x - b.x) / d, uy = (a.y - b.y) / d;
          a.x += ux * push; a.y += uy * push; b.x -= ux * push; b.y -= uy * push;
        }
      }
    });
    card.body.append(h('div', { class: 'c2b-stage' }, svg), legend, panel);
    select(STATE_ARROWS[0], false);
    return card;
  }

  const CHANGES6 = [
    { ico: '♨️', t: 'Boiling water turning into steam', a: 'P', ex: [['There is <b>no</b> new substance formed (steam is still water). The change is easily <b>reversed</b>: steam condenses back to water.', 1], ['Bubbles appear, so a new gas is made.', 0], ['Heat is needed, so the change cannot be reversed.', 0]] },
    { ico: '🚗', t: 'Car rusting', a: 'C', ex: [['There is a new substance (<b>rust</b>) formed.', 1], ['It happens slowly, so it must be a chemical change.', 0], ['Only the colour of the car changes.', 0]] },
    { ico: '🍬', t: 'Dissolving sugar in water', a: 'P', ex: [['There is <b>no</b> new substance formed. The sugar can be got back by evaporating the water.', 1], ['The sugar disappears, so it has been destroyed.', 0], ['A new substance, sugar solution, is formed.', 0]] },
    { ico: '🍷', t: 'Alcohol goes sour', a: 'C', ex: [['There is a new substance (a <b>sour</b> substance) formed.', 1], ['Only the taste changes; it is still the same alcohol.', 0], ['It can easily be reversed by adding sugar.', 0]] },
    { ico: '🛢️', t: 'Fractional distillation of petroleum to form purer oil fractions (by vaporisation and condensation)', a: 'P', ex: [['Only changes of state (vaporisation and condensation) happen, so <b>no</b> new substance is formed. The fractions were already in the crude oil.', 1], ['New substances such as petrol and diesel are made from the crude oil.', 0], ['The crude oil is heated strongly, so it cannot be a physical change.', 0]] },
    { ico: '⛽', t: 'Combustion (i.e. burning) of petrol in a car engine', a: 'C', ex: [['New substances (e.g. carbon dioxide and water) are formed, and heat is given out.', 1], ['The petrol only changes from a liquid into a gas.', 0], ['Petrol is a mixture, so burning only separates it.', 0]] }
  ];
  function classwork6() {
    const card = play('Classwork: physical or chemical?', 'For each change: <b>(a)</b> classify it, <b>(b)</b> explain your answer, just like the book’s table.', '📋 Classwork');
    const dots = h('div', { class: 'c2b-dots' }, CHANGES6.map(() => h('i')));
    const stage = h('div');
    const tbody = h('tbody');
    const tableWrap = h('div', { class: 'table-wrap c2b-gap c2b-hide' }, h('table', { class: 't c2b-tbl' },
      h('thead', h('tr', h('th', { text: 'Change' }), h('th', { text: 'Type' }), h('th', { text: 'Explanation' }))), tbody));
    let i = 0, mistakes = 0;
    function show() {
      [...dots.children].forEach((d, k) => { d.className = k < i ? 'ok' : k === i ? 'on' : ''; });
      card.score.textContent = Math.min(i, CHANGES6.length) + ' / ' + CHANGES6.length;
      stage.innerHTML = '';
      if (i >= CHANGES6.length) {
        stage.appendChild(h('div', { class: 'c2b-done pop-in' }, h('span', { class: 'c2b-ico', text: '🏆' }),
          h('p', { html: 'Classwork complete' + (mistakes ? ' (' + wrongTries(mistakes) + ').' : ' with no mistakes!') + '<br><b>Is a new substance formed?</b> Yes → chemical. No → physical.' }),
          btn('↻ Do it again', () => { i = 0; mistakes = 0; tbody.innerHTML = ''; tableWrap.classList.add('c2b-hide'); show(); }, 'btn')));
        A.sound('win'); A.celebrate(.6); A.reward('c2b-classwork6', 20, 'Classwork');
        return;
      }
      const c = CHANGES6[i];
      stage.appendChild(h('div', { class: 'c2b-card pop-in' }, h('div', null, h('span', { class: 'c2b-ico', text: c.ico }), h('span', { html: (i + 1) + '. ' + c.t }))));
      stage.appendChild(h('span', { class: 'c2b-label c2b-gap', text: '(a) Classify' }));
      const hint = 'Ask yourself: is a <b>new substance</b> formed?';
      stage.appendChild(choices([{ html: '💧 Physical change', ok: c.a === 'P', why: c.a === 'P' ? '' : hint }, { html: '🔥 Chemical change', ok: c.a === 'C', why: c.a === 'C' ? '' : hint }],
        tries => { mistakes += tries; A.later(() => explain(c), 350); }, { chips: true, noShuffle: true }));
    }
    function explain(c) {
      stage.appendChild(h('span', { class: 'c2b-label c2b-gap', text: '(b) Explain' }));
      stage.appendChild(choices(c.ex.map(([html, ok]) => ({ html, ok: !!ok })), tries => {
        mistakes += tries;
        tbody.appendChild(h('tr', h('td', { html: c.t }), h('td', { html: '<b>' + (c.a === 'P' ? 'Physical' : 'Chemical') + '</b>' }), h('td', { class: 'c2b-new c2b-ex', html: c.ex[0][0] })));
        tableWrap.classList.remove('c2b-hide');
        A.later(() => { i++; show(); }, 1400);
      }));
    }
    card.body.append(dots, stage, tableWrap);
    show();
    return card;
  }

  const FRACTIONS = [
    { n: 'Liquefied petroleum gas', s: 'LPG', bp: 'below 25 °C', use: 'fuel (in gas cylinders)', ico: '🔥' },
    { n: 'Petrol (gasoline)', s: 'Petrol', bp: '25–60 °C', use: 'fuel for cars', ico: '🚗' },
    { n: 'Naphtha', s: 'Naphtha', bp: '60–180 °C', use: 'raw material for making chemicals', ico: '🧪' },
    { n: 'Paraffin', s: 'Paraffin', bp: '180–220 °C', use: 'fuel for aeroplanes', ico: '✈️' },
    { n: 'Diesel', s: 'Diesel', bp: '220–250 °C', use: 'fuel for lorries', ico: '🚚' },
    { n: 'Fuel oil', s: 'Fuel oil', bp: '250–300 °C', use: 'fuel for ships', ico: '🚢' },
    { n: 'Lubricating oil', s: 'Lubricating oil', bp: '300–350 °C', use: 'lubricants for machines', ico: '⚙️' },
    { n: 'Bitumen', s: 'Bitumen', bp: 'above 350 °C', use: 'making roads', ico: '🛣️' }
  ];
  const BAND_COL = ['#fdf0c2', '#f8dc8c', '#f0c060', '#e09a3c', '#c06e2a', '#8a4a22', '#5c3218', '#3a2010'];
  function tower() {
    const card = play('Fractional distillation of petroleum', 'Crude oil is heated in a furnace. The vapour rises up the tower and each fraction condenses at its own level. <b>Explore</b> the levels, then <b>play</b>.', '🛢️ Explore');
    const svg = svgEl('0 0 360 340', 'Fractional distillation tower separating crude oil into eight fractions');
    const TX = 118, TW = 80, TY = 34, BH = 32, BOT = TY + 8 * BH;
    svg.appendChild(h('path', { d: `M${TX},${TY} Q${TX},${TY - 16} ${TX + TW / 2},${TY - 16} Q${TX + TW},${TY - 16} ${TX + TW},${TY} Z`, fill: BAND_COL[0] }));
    svg.appendChild(h('path', { d: `M${TX},${BOT} L${TX + TW},${BOT} Q${TX + TW},${BOT + 12} ${TX + TW / 2},${BOT + 12} Q${TX},${BOT + 12} ${TX},${BOT} Z`, fill: BAND_COL[7] }));
    // crude oil tank, pipe and furnace
    svg.appendChild(h('path', { d: `M46,244 L46,296 L${TX},296`, stroke: '#2b2018', 'stroke-width': 7, fill: 'none', 'stroke-linejoin': 'round' }));
    svg.appendChild(h('rect', { x: 8, y: 186, width: 76, height: 60, rx: 9, fill: '#2b2018' }));
    svg.appendChild(h('path', { d: 'M8,200 Q27,192 46,200 T84,200', stroke: '#5a4636', 'stroke-width': 3, fill: 'none' }));
    svg.appendChild(txt(46, 224, 'CRUDE OIL', 'c2b-t c2b-mid', { style: { fontSize: '10px', fill: '#fff' } }));
    [62, 80, 98].forEach(x => svg.appendChild(h('g', { class: 'c2b-flick' },
      h('path', { d: `M${x - 6},322 C${x - 9},314 ${x - 2},308 ${x},300 C${x + 3},308 ${x + 9},314 ${x + 6},322 Z`, fill: '#ff8a1e' }),
      h('path', { d: `M${x - 3},322 C${x - 4},316 ${x - 1},313 ${x},308 C${x + 2},313 ${x + 4},316 ${x + 3},322 Z`, fill: '#ffd23f' }))));
    svg.appendChild(txt(80, 336, 'FURNACE', 'c2b-t2 c2b-mid'));
    const bands = [];
    FRACTIONS.forEach((fr, i) => {
      const y = TY + i * BH, ay = y + BH / 2;
      const g = h('g', { class: 'c2b-band', role: 'button', tabindex: 0, 'aria-label': fr.n + ', boiling range ' + fr.bp });
      const hl = h('rect', { x: TX + TW + 2, y: y + 2, width: 360 - TX - TW - 4, height: BH - 4, rx: 8, fill: 'var(--accent-soft)', opacity: 0 });
      const rect = h('rect', { x: TX, y, width: TW, height: BH, fill: BAND_COL[i], stroke: 'none' });
      g.append(hl, rect,
        txt(TX + TW / 2, ay + 4, fr.bp.replace('below ', '< ').replace('above ', '> '), 'c2b-t c2b-mid', { style: { fontSize: '10.5px', fill: i < 4 ? '#3a2a10' : '#fff7e8' } }),
        h('line', { x1: TX + TW, y1: ay, x2: 230, y2: ay, stroke: 'var(--ink-3)', 'stroke-width': 3 }),
        h('polygon', { points: `230,${ay - 5} 239,${ay} 230,${ay + 5}`, fill: 'var(--ink-3)' }),
        txt(252, ay + 6, fr.ico, 'c2b-mid', { style: { fontSize: '16px' } }),
        txt(265, ay + 4, fr.s, 'c2b-t', { style: { fontSize: '11.5px' } }),
        h('rect', { x: TX, y, width: 360 - TX, height: BH, fill: 'transparent' }));
      g.addEventListener('click', () => tap(i));
      g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tap(i); } });
      svg.appendChild(g);
      bands.push({ g, hl, rect });
    });
    svg.appendChild(h('path', { d: `M${TX},${TY} Q${TX},${TY - 16} ${TX + TW / 2},${TY - 16} Q${TX + TW},${TY - 16} ${TX + TW},${TY} L${TX + TW},${BOT} Q${TX + TW},${BOT + 12} ${TX + TW / 2},${BOT + 12} Q${TX},${BOT + 12} ${TX},${BOT} Z`, fill: 'none', stroke: 'var(--ink-2)', 'stroke-width': 2, 'pointer-events': 'none' }));
    // rising vapour
    const vap = h('g', { 'pointer-events': 'none' });
    svg.appendChild(vap);
    const dots = [];
    let acc = 0;
    if (!REDUCED) A.loop(dt => {
      if (!svg.isConnected) return false;
      acc += dt * 4;
      while (acc >= 1 && dots.length < 24) {
        acc--;
        const lvl = Math.floor(Math.random() * 8);
        // rise along the inner walls so the bubbles never cover the temperature labels
        dots.push({ x: TX + (Math.random() < .5 ? 3.5 : TW - 8.5) + Math.random() * 5, y: BOT - 2, stop: TY + lvl * BH + BH / 2, el: vap.appendChild(h('circle', { r: 2.2, fill: '#ffffff', opacity: .75 })) });
      }
      if (acc >= 1) acc = 0;
      for (let j = dots.length - 1; j >= 0; j--) {
        const d = dots[j];
        d.y -= dt * 34;
        const o = d.y < d.stop ? Math.max(0, .75 - (d.stop - d.y) / 10) : .75;
        if (o <= 0) { d.el.remove(); dots.splice(j, 1); continue; }
        attrs(d.el, { cx: d.x.toFixed(1), cy: d.y.toFixed(1), opacity: o.toFixed(2) });
      }
    });
    const info = h('div', { class: 'c2b-info empty', text: '👆 Tap a level of the tower.' });
    const prompt = h('div', { class: 'c2b-prompt c2b-hide', 'aria-live': 'polite' });
    const fb = h('div', { class: 'feedback' });
    const mE = h('button', { type: 'button', class: 'chip selected', text: '🔍 Explore' });
    const mP = h('button', { type: 'button', class: 'chip', text: '🎯 Play: find the level' });
    let mode = 'explore', rounds = [], r = 0, score = 0, tries = 0, lock = false;
    const seen = new Set();
    function mark(i, kind) {
      bands.forEach((b, k) => {
        b.hl.setAttribute('opacity', k === i ? 1 : 0);
        b.hl.setAttribute('fill', kind === 'good' ? 'var(--good-soft)' : kind === 'bad' ? 'var(--bad-soft)' : 'var(--accent-soft)');
        b.rect.setAttribute('stroke', k === i ? (kind === 'good' ? 'var(--good)' : kind === 'bad' ? 'var(--bad)' : 'var(--accent)') : 'none');
        b.rect.setAttribute('stroke-width', 3);
      });
    }
    function showInfo(i) {
      const fr = FRACTIONS[i];
      info.className = 'c2b-info'; info.innerHTML = '';
      info.append(h('span', { class: 'c2b-ico', text: fr.ico }), h('div', null, h('b', { class: 'nm', text: fr.n }),
        h('span', { html: 'Boiling range: <b>' + fr.bp + '</b>' }), h('span', { html: 'Used as: ' + fr.use })));
    }
    function tap(i) {
      if (mode === 'explore') {
        mark(i); showInfo(i); A.sound('click'); seen.add(i);
        if (seen.size === FRACTIONS.length) A.reward('c2b-tower', 10, 'Explored the tower');
        return;
      }
      if (lock || r >= rounds.length) return;
      const R = rounds[r];
      if (i === R.i) {
        lock = true; if (!tries) score++;
        mark(i, 'good'); showInfo(i); A.sound('good');
        fb.className = 'feedback good'; fb.innerHTML = '✅ ' + FRACTIONS[i].n + ' (' + FRACTIONS[i].bp + ')';
        r++; card.score.textContent = score + ' / ' + rounds.length;
        A.later(nextRound, 1100);
      } else {
        tries++; mark(i, 'bad'); A.sound('bad'); shake(prompt);
        fb.className = 'feedback bad'; fb.innerHTML = '❌ That level is ' + FRACTIONS[i].n.toLowerCase() + ' (' + FRACTIONS[i].bp + '). Try again!';
      }
    }
    function nextRound() {
      lock = false; tries = 0; mark(-1);
      if (r >= rounds.length) {
        prompt.innerHTML = '🏆 You scored <b>' + score + ' / ' + rounds.length + '</b>!';
        fb.className = 'feedback'; fb.innerHTML = '';
        A.sound('win'); if (score >= 6) A.celebrate(.6);
        A.reward('c2b-towerplay', 15, 'Fraction finder');
        prompt.appendChild(h('div', { class: 'c2b-gap' }, btn('↻ Play again', startPlay, 'btn')));
        return;
      }
      prompt.innerHTML = rounds[r].q; popIn(prompt);
      fb.innerHTML = '';
    }
    function startPlay() {
      mode = 'play'; r = 0; score = 0;
      mP.classList.add('selected'); mE.classList.remove('selected');
      prompt.classList.remove('c2b-hide'); info.classList.add('c2b-hide');
      rounds = A.shuffle(FRACTIONS.map((fr, i) => ({ i, q: A.pick(['Where is <b>' + fr.n.toLowerCase() + '</b> collected?', 'Which fraction is used as <b>' + fr.use + '</b>?', 'Which fraction has a boiling range of <b>' + fr.bp + '</b>?']) })));
      card.score.textContent = '0 / ' + rounds.length;
      nextRound();
    }
    mE.addEventListener('click', () => { mode = 'explore'; mE.classList.add('selected'); mP.classList.remove('selected'); prompt.classList.add('c2b-hide'); info.classList.remove('c2b-hide'); fb.innerHTML = ''; mark(-1); card.score.textContent = ''; A.sound('click'); });
    mP.addEventListener('click', () => { A.sound('click'); startPlay(); });
    card.body.append(h('div', { class: 'c2b-modes' }, mE, mP), prompt, h('div', { class: 'c2b-stage' }, svg), info, fb,
      h('div', { class: 'c2b-msg', html: '💡 Fractions with <b>lower boiling points</b> come out <b>higher up</b> the tower. Separating the fractions only needs vaporisation and condensation, so fractional distillation is a <b>physical change</b>.' }));
    return card;
  }

  const QUICKFIRE = [
    { t: 'Mixing iron powder and sulphur powder', a: 'P', why: 'no new substance — a magnet can take the iron out again.' },
    { t: 'Heating iron and sulphur strongly', a: 'C', why: 'a new substance, iron(II) sulphide, is formed.' },
    { t: 'Melting (solid → liquid)', a: 'P', why: 'only a change of physical state.' },
    { t: 'Freezing (liquid → solid)', a: 'P', why: 'only a change of physical state.' },
    { t: 'Condensation (gas → liquid)', a: 'P', why: 'only a change of physical state.' },
    { t: 'Sublimation (solid → gas)', a: 'P', why: 'only a change of physical state.' },
    { t: 'Deposition (gas → solid)', a: 'P', why: 'only a change of physical state.' },
    { t: 'Boiling water turning into steam', a: 'P', why: 'no new substance; steam condenses back to water.' },
    { t: 'Car rusting', a: 'C', why: 'a new substance, rust, is formed.' },
    { t: 'Dissolving sugar in water', a: 'P', why: 'no new substance; the sugar can be got back.' },
    { t: 'Alcohol going sour', a: 'C', why: 'a new, sour substance is formed.' },
    { t: 'Fractional distillation of petroleum', a: 'P', why: 'only vaporisation and condensation; no new substance.' },
    { t: 'Burning petrol in a car engine', a: 'C', why: 'new substances (carbon dioxide and water) are formed and heat is given out.' },
    { t: 'Electrolysis of water', a: 'C', why: 'water is broken down into new substances: hydrogen and oxygen.' },
    { t: 'Dissolving table salt in water', a: 'P', why: 'no new substance; salt solution is a mixture of sodium chloride and water.' },
    { t: 'Melting, mixing and cooling copper and tin to make bronze', a: 'P', why: 'an alloy is a mixture; the metals are not chemically combined.' },
    { t: 'Burning carbon in oxygen to give carbon dioxide', a: 'C', why: 'a new substance, carbon dioxide, is formed.' },
    { t: 'Heating sodium in chlorine gas to give sodium chloride', a: 'C', why: 'a new substance, sodium chloride, is formed.' },
    { t: 'Hydrogen and chlorine reacting to form hydrogen chloride', a: 'C', why: 'a new substance, hydrogen chloride, is formed.' },
    { t: 'Mixing red beans with milk', a: 'P', why: 'it is a mixture and can be separated again.' }
  ];

  function renderL5(root) {
    root.appendChild(notes('Examples of physical change',
      '<p>📖 Remember: a physical change forms <b>no new substance</b>.</p>' +
      '<ul><li><b>Mixing</b>: the particles of two substances just spread among each other.</li>' +
      '<li><b>Changes of physical state</b>: the particles stay the same; only their arrangement changes.</li></ul>'));
    root.appendChild(mixDemo());
    root.appendChild(notes('Changes of physical state',
      '<ul><li>Solid → liquid: ' + T('melting', '熔化') + ' · liquid → solid: ' + T('freezing', '凝固') + '</li>' +
      '<li>Liquid → gas: ' + T('boiling', '沸騰') + ' · gas → liquid: ' + T('condensation', '凝結') + '</li>' +
      '<li>Solid → gas: ' + T('sublimation', '昇華') + ' · gas → solid: ' + T('deposition', '凝華') + '</li>' +
      '<li><b>Heat absorbed</b>: melting, boiling, sublimation. <b>Heat given out</b>: freezing, condensation, deposition.</li></ul>'));
    root.appendChild(stateTriangle());
    root.appendChild(classwork6());
    root.appendChild(notes('Fractional distillation of petroleum',
      '<ul><li><b>Petroleum (crude oil)</b> is a mixture of hydrocarbons. ' + T('Fractional distillation', '分餾') + ' separates it into purer ' + T('oil fractions', '餾分') + ' by <b>vaporisation and condensation</b>.</li>' +
      '<li>The crude oil is heated in a <b>furnace</b>; the fractions are separated by their <b>boiling ranges</b>.</li>' +
      '<li>It is a <b>physical change</b>: no new substance is formed.</li></ul>'));
    root.appendChild(tower());
    const qf = play('Physical or chemical? Speed round', 'Every change from this chapter. How many can you sort in 45 seconds?', '⚡ Speed');
    qf.body.appendChild(quickFire(QUICKFIRE, { secs: 45, rewardKey: 'c2b-speed' }));
    root.appendChild(qf);
    A.quickCheck(root, 'ch2', 'ch2-5', 5);
  }

  /* =========================================================
     Equations used by the balancers (book p.10 & p.13)
     ========================================================= */
  const LV = {
    water: { id: 'water', short: 'Water', ans: [2, 2, 1], L: [['H2O', 'l']], R: [['H2', 'g'], ['O2', 'g']],
      desc: '<b>Electrolysis of water:</b> water is broken down into hydrogen gas (' + F('H2') + ') and oxygen gas (' + F('O2') + ').',
      word: { L: ['water'], R: ['hydrogen', 'oxygen'], x: ['electricity', 'carbon dioxide'] } },
    al: { id: 'al', short: 'Al + steam', ans: [2, 3, 1, 3], L: [['Al', 's'], ['H2O', 'g']], R: [['Al2O3', 's'], ['H2', 'g']],
      desc: 'When aluminium reacts with steam, aluminium oxide (' + F('Al2O3') + ') and hydrogen gas (' + F('H2') + ') are formed.' },
    c: { id: 'c', short: 'Carbon', ans: [1, 1, 1], L: [['C'], ['O2']], R: [['CO2']],
      desc: '<b>1.</b> Burning of carbon in oxygen (' + F('O2') + ') gives carbon dioxide (' + F('CO2') + ').',
      word: { L: ['carbon', 'oxygen'], R: ['carbon dioxide'], x: ['water', 'hydrogen'] } },
    na: { id: 'na', short: 'Sodium', ans: [2, 1, 2], L: [['Na'], ['Cl2']], R: [['NaCl']],
      desc: '<b>2.</b> Heating sodium in chlorine gas (' + F('Cl2') + ') gives table salt, sodium chloride (NaCl).',
      word: { L: ['sodium', 'chlorine'], R: ['sodium chloride'], x: ['oxygen', 'hydrogen chloride'] } },
    hcl: { id: 'hcl', short: F('H2') + ' + ' + F('Cl2'), ans: [1, 1, 2], L: [['H2'], ['Cl2']], R: [['HCl']],
      desc: '<b>3.</b> Hydrogen gas (' + F('H2') + ') and chlorine gas (' + F('Cl2') + ') react to form hydrogen chloride gas (HCl).',
      word: { L: ['hydrogen', 'chlorine'], R: ['hydrogen chloride'], x: ['sodium chloride', 'water'] } },
    glu: { id: 'glu', short: 'Glucose', ans: [6, 6, 3, 1], L: [['C'], ['H2'], ['O2']], R: [['C6H12O6']],
      desc: '<b>4.</b> Formation of glucose (' + F('C6H12O6') + ') from carbon, hydrogen gas (' + F('H2') + ') and oxygen gas (' + F('O2') + ').',
      word: { L: ['carbon', 'hydrogen', 'oxygen'], R: ['glucose'], x: ['water', 'carbon dioxide'] } },
    ch4: { id: 'ch4', short: 'Methane', ans: [1, 2, 1, 2], L: [['CH4'], ['O2']], R: [['CO2'], ['H2O']],
      desc: '<b>5.</b> Combustion of methane gas (' + F('CH4') + ') in oxygen (' + F('O2') + ') to give carbon dioxide (' + F('CO2') + ') and water.',
      word: { L: ['methane', 'oxygen'], R: ['carbon dioxide', 'water'], x: ['hydrogen', 'carbon'] } },
    pb: { id: 'pb', short: 'Lead(II) sulphate', ans: [1, 1, 2, 1], L: [['Na2SO4', 'aq'], ['Pb(NO3)2', 'aq']], R: [['NaNO3', 'aq'], ['PbSO4', 's']],
      desc: '<b>6.</b> Sodium sulphate solution (' + F('Na2SO4') + ') reacts with lead(II) nitrate solution (' + F('Pb(NO3)2') + ') to give sodium nitrate solution (' + F('NaNO3') + ') and lead(II) sulphate solid (' + F('PbSO4') + ').',
      word: { L: ['sodium sulphate', 'lead(II) nitrate'], R: ['sodium nitrate', 'lead(II) sulphate'], x: ['sodium', 'water'] } }
  };

  /* =========================================================
     LESSON ch2-6 · 2.3 Experiment 2.3 Electrolysis of water
     ========================================================= */
  function labElectrolysis(onDone) {
    const card = play('Virtual lab: Experiment 2.3', 'Set up the apparatus, run the electrolysis for 5 minutes, then test both gases.', '⚡ Virtual lab');
    const svg = svgEl('0 0 360 366', 'Electrolysis of water apparatus with two gas collecting tubes, connected to a power supply');
    const WT = 76, WB = 262, PXC = 6;                 // water top when full, water bottom, px per cm³
    const TUBES = [{ x: 78, cx: 100 }, { x: 238, cx: 260 }]; // [0] negative pole, [1] positive pole
    const S = { fill: 0, on: false, V: 0, t: 0, vH: 0, vO: 0 };
    // glass backs
    TUBES.forEach(tb => svg.appendChild(h('rect', { x: tb.x, y: 70, width: 44, height: 196, rx: 6, class: 'c2b-glass', stroke: 'none' })));
    svg.appendChild(h('rect', { x: 150, y: 88, width: 60, height: 178, rx: 8, class: 'c2b-glass', stroke: 'none' }));
    svg.appendChild(h('rect', { x: 118, y: 246, width: 124, height: 18, class: 'c2b-glass', stroke: 'none' }));
    // water
    const wT = TUBES.map(tb => svg.appendChild(h('rect', { x: tb.x + 3, y: WB, width: 38, height: 0, fill: 'var(--c2b-water)' })));
    const wRes = svg.appendChild(h('rect', { x: 153, y: WB, width: 54, height: 0, fill: 'var(--c2b-water)' }));
    const wChan = svg.appendChild(h('rect', { x: 118, y: 248, width: 124, height: 14, fill: 'var(--c2b-water)', opacity: 0 }));
    // electrodes + inner wiring
    TUBES.forEach((tb, k) => {
      svg.appendChild(h('path', { d: `M${tb.cx},258 L${tb.cx},276 L${k ? 290 : 70},277`, stroke: 'var(--ink-3)', 'stroke-width': 1.5, fill: 'none' }));
      svg.appendChild(h('rect', { x: tb.cx - 7, y: 222, width: 14, height: 36, rx: 2, fill: '#5f6670' }));
    });
    const bubG = TUBES.map(() => svg.appendChild(h('g')));
    // graduations (cm³ of gas, 0 at the top)
    [0, 5, 10, 15, 20, 25].forEach(v => {
      const y = WT + v * PXC;
      svg.appendChild(h('line', { x1: 122, y1: y, x2: 127, y2: y, class: 'c2b-line', 'stroke-width': 1.2 }));
      svg.appendChild(h('line', { x1: 238, y1: y, x2: 233, y2: y, class: 'c2b-line', 'stroke-width': 1.2 }));
      if (v % 10 === 0) { svg.appendChild(txt(130, y + 4, String(v), 'c2b-t2')); svg.appendChild(txt(230, y + 4, String(v), 'c2b-t2 c2b-end')); }
    });
    svg.appendChild(txt(180, 82, 'cm³', 'c2b-t2 c2b-mid'));
    // glass outlines
    TUBES.forEach(tb => svg.appendChild(h('rect', { x: tb.x, y: 70, width: 44, height: 196, rx: 6, class: 'c2b-glass', fill: 'none' })));
    svg.appendChild(h('rect', { x: 150, y: 88, width: 60, height: 178, rx: 8, class: 'c2b-glass', fill: 'none' }));
    // gas discharge tubes, plastic tubes, clips
    const tubesG = h('g', { opacity: 0 }), clipsG = TUBES.map(() => h('g', { opacity: 0 }));
    TUBES.forEach((tb, k) => {
      svg.appendChild(h('rect', { x: tb.cx - 6, y: 56, width: 12, height: 15, rx: 2, class: 'c2b-glass' }));
      tubesG.appendChild(h('rect', { x: tb.cx - 5, y: 24, width: 10, height: 36, rx: 4, fill: '#e9f2fa', stroke: 'var(--ink-3)', 'stroke-width': 1.2 }));
      clipsG[k].appendChild(h('rect', { x: tb.cx - 12, y: 38, width: 24, height: 7, rx: 2, fill: '#3d7be0' }));
    });
    svg.appendChild(tubesG); clipsG.forEach(c => svg.appendChild(c));
    // base, terminals and labels
    svg.appendChild(h('rect', { x: 50, y: 266, width: 260, height: 22, rx: 6, class: 'c2b-glass' }));
    [[70, '−'], [290, '+']].forEach(([x, s]) => { svg.appendChild(h('circle', { cx: x, cy: 277, r: 8, fill: '#24272d', stroke: 'var(--ink-3)', 'stroke-width': 1 })); svg.appendChild(txt(x, 281.5, s, 'c2b-t c2b-mid', { style: { fill: '#fff', fontSize: '13px' } })); });
    svg.appendChild(txt(38, 166, 'negative', 'c2b-t2 c2b-mid')); svg.appendChild(txt(38, 180, 'pole (−)', 'c2b-t2 c2b-mid'));
    svg.appendChild(txt(322, 166, 'positive', 'c2b-t2 c2b-mid')); svg.appendChild(txt(322, 180, 'pole (+)', 'c2b-t2 c2b-mid'));
    const clock = txt(180, 52, '', 'c2b-t c2b-mid');
    svg.appendChild(clock);
    // power supply
    svg.appendChild(h('rect', { x: 110, y: 300, width: 140, height: 46, rx: 8, fill: 'var(--surface)', stroke: 'var(--ink-2)', 'stroke-width': 2 }));
    svg.appendChild(h('rect', { x: 120, y: 310, width: 58, height: 26, rx: 4, fill: '#0f2318' }));
    const vText = txt(149, 328, '0 V', 'c2b-mid', { style: { fill: '#5df28a', fontFamily: 'ui-monospace, monospace', fontWeight: 700, fontSize: '13px' } });
    const led = h('circle', { cx: 192, cy: 323, r: 5, fill: '#666' });
    svg.append(vText, led,
      h('circle', { cx: 214, cy: 323, r: 7, fill: '#24272d', stroke: 'var(--ink-3)', 'stroke-width': 1 }), h('circle', { cx: 236, cy: 323, r: 7, fill: '#d32f2f' }),
      txt(214, 314, '−', 'c2b-t2 c2b-mid'), txt(236, 314, '+', 'c2b-t2 c2b-mid'));
    const wireN = h('path', { d: 'M70,285 C70,366 214,370 214,331', stroke: 'var(--ink)', 'stroke-width': 3, fill: 'none', opacity: 0, 'stroke-linecap': 'round' });
    const wireP = h('path', { d: 'M290,285 C290,366 236,370 236,331', stroke: '#d32f2f', 'stroke-width': 3, fill: 'none', opacity: 0, 'stroke-linecap': 'round' });
    svg.append(wireN, wireP);
    const fx = h('g');   // splints + effects
    svg.appendChild(fx);

    // readouts + controls
    const rH = h('b', { text: '0.0 cm³' }), rO = h('b', { text: '0.0 cm³' });
    const read = h('div', { class: 'c2b-read c2b-hide' }, h('div', null, rH, 'gas at negative pole'), h('div', null, rO, 'gas at positive pole'));
    const pBtn = btn('⏻ Power: OFF', () => togglePower(), 'btn');
    const range = h('input', { type: 'range', min: 0, max: 20, step: 1, value: 0, class: 'c2b-range', 'aria-label': 'Voltage', disabled: true });
    const vread = h('span', { class: 'c2b-vread', text: '0 V' });
    const ctrl = h('div', { class: 'c2b-ctrl c2b-hide' }, pBtn, h('label', null, 'Voltage', range, vread));
    const st = stepper(12);
    const acts = h('div', { class: 'c2b-actions' });
    const ask = h('div', { class: 'c2b-gap' });
    const note = h('div', { class: 'c2b-msg' });
    const setActs = (...b) => { acts.innerHTML = ''; b.forEach(x => x && acts.appendChild(x)); };
    // results table (Discussion 1)
    const cell = {};
    const ROWS = [['pred', 'Prediction (gas)'], ['test', 'What to do'], ['exp', 'Expected observation'], ['obs', 'Observation']];
    const table = h('div', { class: 'table-wrap c2b-gap' }, h('table', { class: 't c2b-tbl' },
      h('thead', h('tr', h('th'), h('th', { text: 'At negative pole' }), h('th', { text: 'At positive pole' }))),
      h('tbody', ROWS.map(([k, lab]) => h('tr', h('th', { text: lab }), (cell[k + 0] = h('td', { class: 'c2b-pend', text: '—' })), (cell[k + 1] = h('td', { class: 'c2b-pend', text: '—' })))))));
    const fillT = (k, i, html) => { const c = cell[k + i]; c.className = 'c2b-new'; c.innerHTML = html; };
    card.body.append(h('div', { class: 'c2b-stage' }, svg), read, st.el, ctrl, acts, ask, note, table);

    function updatePSU() {
      vText.textContent = (S.on ? S.V : 0) + ' V';
      led.setAttribute('fill', S.on ? '#3ddc84' : '#666');
    }
    let lastV = 0, step = 0, timeUpFired = false;
    range.addEventListener('input', () => {
      const v = +range.value;
      if (v - lastV > 8) A.toast('🐢 Slowly! Turn the voltage up gradually.', 'bad');
      lastV = v; S.V = v; vread.textContent = v + ' V'; updatePSU();
      if (step === 5 && S.on && v === 20) go(6);
      if (step === 8 && v === 0) msg(note, '✅ 0 V. Now turn off the power supply.', 'good');
    });
    function togglePower() {
      if (step < 5) return;
      if (S.on) {
        if (step === 8 && S.V > 0) { msg(note, '⚠️ Adjust the power supply to <b>0 V</b> first, then turn it off.', 'bad'); A.sound('bad'); return; }
        S.on = false; range.disabled = true; pBtn.innerHTML = '⏻ Power: OFF'; updatePSU(); A.sound('click');
        if (step === 8) { ctrl.classList.add('c2b-hide'); go(9); }
      } else {
        if (step >= 8) return;
        S.on = true; range.disabled = false; pBtn.innerHTML = '⏻ Power: ON'; updatePSU(); A.sound('click');
        if (step === 5) msg(note, 'Power is on. Now slide the voltage <b>slowly</b> up to 20 V.');
      }
    }
    // simulation loop: water levels, bubbles, clock
    const bubbles = [], spawnAcc = [0, 0];
    let levels = [WB, WB];
    A.loop(dt => {
      if (!svg.isConnected) return false;
      if (S.on && S.V >= 20 && S.t < 300) {
        S.t = Math.min(300, S.t + dt * 37.5);   // 5 "minutes" in 8 s
        if (S.t >= 300 && !timeUpFired) { timeUpFired = true; A.later(timeUp, 30); }
      }
      S.vH = 20 * S.t / 300; S.vO = S.vH / 2;
      const full = WB - (WB - WT) * S.fill;
      levels = [Math.max(full, WT + S.vH * PXC), Math.max(full, WT + S.vO * PXC)];
      levels.forEach((y, k) => attrs(wT[k], { y: y.toFixed(1), height: (WB - y).toFixed(1) }));
      const ry = WB - (WB - 132) * S.fill - (S.vH + S.vO);   // displaced water rises in the reservoir
      attrs(wRes, { y: ry.toFixed(1), height: (WB - ry).toFixed(1) });
      wChan.setAttribute('opacity', S.fill > .05 ? 1 : 0);
      const rate = S.on && S.V > 1 ? S.V / 20 : 0;
      [0, 1].forEach(k => {
        spawnAcc[k] += dt * rate * (k === 0 ? 18 : 9);
        while (spawnAcc[k] >= 1 && bubbles.length < 70) {
          spawnAcc[k]--;
          const b = { k, x: TUBES[k].cx + (Math.random() - .5) * 14, y: 224 + Math.random() * 32, v: 45 + Math.random() * 35, ph: Math.random() * 6 };
          b.el = bubG[k].appendChild(h('circle', { r: (1.4 + Math.random() * 1.4).toFixed(1), fill: 'rgba(255,255,255,.8)', stroke: 'rgba(40,110,190,.75)', 'stroke-width': .8 }));
          bubbles.push(b);
        }
        if (spawnAcc[k] >= 1) spawnAcc[k] = 0;
      });
      for (let j = bubbles.length - 1; j >= 0; j--) {
        const b = bubbles[j];
        b.y -= b.v * dt; b.x += Math.sin(b.y / 6 + b.ph) * .3;
        if (b.y < levels[b.k] + 3) { b.el.remove(); bubbles.splice(j, 1); }
        else attrs(b.el, { cx: b.x.toFixed(1), cy: b.y.toFixed(1) });
      }
      if (step >= 5) {
        const m = Math.floor(S.t / 60), s = Math.floor(S.t % 60);
        clock.textContent = '⏱ ' + m + ':' + String(s).padStart(2, '0') + ' / 5:00' + (S.t < 300 && step >= 6 && !(S.on && S.V >= 20) ? ' (paused)' : '');
        rH.textContent = S.vH.toFixed(1) + ' cm³'; rO.textContent = S.vO.toFixed(1) + ' cm³';
      }
    });
    function timeUp() { if (step === 7) go(8); }
    function wire(pole, term) {
      if (pole !== term) {
        const w = pole === '+' ? 'positive' : 'negative';
        msg(note, '❌ Connect the ' + w + ' pole of the apparatus to the <b>' + w + '</b> terminal of the power supply.', 'bad');
        A.sound('bad'); return;
      }
      const w = pole === '+' ? wireP : wireN;
      w.setAttribute('opacity', 1);
      try {
        const len = w.getTotalLength();
        w.style.strokeDasharray = len; w.style.strokeDashoffset = len;
        tween(600, t => { w.style.strokeDashoffset = (len * (1 - t)).toFixed(1); }, () => { w.style.strokeDasharray = 'none'; });
      } catch (e) { /* drawn without animation */ }
      msg(note, '🔌 Connected: ' + (pole === '+' ? 'positive pole → positive terminal.' : 'negative pole → negative terminal.'), 'good');
      A.sound('click');
      go(pole === '+' ? 4 : 5);
    }
    function termBtns(pole) {
      return [btn('🔴 Positive (+) terminal', () => wire(pole, '+'), 'btn'), btn('⚫ Negative (−) terminal', () => wire(pole, '-'), 'btn')];
    }
    function splint(k, burning) {
      const cx = TUBES[k].cx;
      const g = h('g', { transform: 'translate(90,-30)' });
      g.appendChild(h('line', { x1: cx + 8, y1: 18, x2: cx + 86, y2: 2, stroke: '#c8955a', 'stroke-width': 4, 'stroke-linecap': 'round' }));
      const tip = h('circle', { cx: cx + 6, cy: 18.5, r: 3.4, fill: burning ? '#3b2a1d' : '#ff5a1f' });
      const glow = h('circle', { cx: cx + 6, cy: 18.5, r: 7, fill: '#ff8a3d', opacity: burning ? 0 : .35 });
      const flame = h('g', { opacity: burning ? 1 : 0 }, h('g', { class: 'c2b-flick' },
        h('path', { d: `M${cx + 6},21 C${cx},17 ${cx + 2},8 ${cx + 6},1 C${cx + 10},8 ${cx + 12},17 ${cx + 6},21 Z`, fill: '#ffb52e' }),
        h('path', { d: `M${cx + 6},20 C${cx + 3},17 ${cx + 4},12 ${cx + 6},8 C${cx + 8},12 ${cx + 9},17 ${cx + 6},20 Z`, fill: '#fff1a8' })));
      g.append(glow, tip, flame);
      fx.appendChild(g);
      return { g, flame, glow };
    }
    function runTest(k) {
      const cx = TUBES[k].cx;
      clipsG[k].setAttribute('opacity', 0);
      const sp = splint(k, k === 0);
      tween(700, t => sp.g.setAttribute('transform', `translate(${(90 * (1 - t)).toFixed(1)},${(-30 * (1 - t)).toFixed(1)})`), () => {
        if (k === 0) {
          const burst = h('g', { transform: `translate(${cx},16) scale(.2)` },
            h('polygon', { points: Array.from({ length: 20 }, (_, j) => { const r = j % 2 ? 9 : 22, a = j * Math.PI / 10; return (Math.cos(a) * r).toFixed(1) + ',' + (Math.sin(a) * r).toFixed(1); }).join(' '), fill: '#ffd23f', stroke: '#e8590c', 'stroke-width': 2 }),
            txt(0, 5, 'POP!', 'c2b-mid', { style: { fontSize: '13px', fontWeight: 900, fill: '#b23a00', fontFamily: 'var(--font)' } }));
          fx.appendChild(burst);
          A.sound('pop'); A.later(() => A.sound('pop'), 120);
          tween(500, t => burst.setAttribute('transform', `translate(${cx},16) scale(${(.2 + t * 1.1).toFixed(2)})`), () => A.later(() => tween(500, t => burst.setAttribute('opacity', (1 - t).toFixed(2))), 700));
          fillT('obs', 0, 'A <b>‘pop’ sound</b> is heard.');
          msg(note, '💥 <b>POP!</b> The gas burns with a ‘pop’ sound, so it is <b>hydrogen</b>.', 'good');
          A.later(() => testStep(1), 2200);
        } else {
          tween(400, t => { sp.flame.setAttribute('opacity', t.toFixed(2)); sp.glow.setAttribute('opacity', (.35 * (1 - t)).toFixed(2)); });
          A.sound('whoosh');
          fillT('obs', 1, 'The glowing splint <b>relights</b>.');
          msg(note, '✨ The glowing splint <b>relights</b>, so the gas is <b>oxygen</b>.', 'good');
          A.later(finish, 1400);
        }
      });
    }
    function testStep(k) {
      st.go(11, k === 0 ? 'Test the gas at the <b>negative pole</b>. Which splint do you use?' : 'Now test the gas at the <b>positive pole</b>. Which splint?');
      ask.innerHTML = '';
      ask.appendChild(choices([
        { html: '🔥 Burning splint', ok: k === 0, why: k === 0 ? '' : 'A burning splint is the test for hydrogen, not oxygen.' },
        { html: '✨ Glowing splint', ok: k === 1, why: k === 1 ? '' : 'A glowing splint is the test for oxygen, not hydrogen.' }
      ], () => {
        fillT('test', k, 'Test with a <b>' + (k ? 'glowing' : 'burning') + '</b> splint.');
        fillT('exp', k, k ? 'The glowing splint relights.' : 'It burns with a ‘pop’ sound.');
        A.later(() => { ask.innerHTML = ''; runTest(k); }, 500);
      }, { chips: true, noShuffle: true }));
    }
    function finish() {
      st.go(12, '🏆 Experiment complete! Electrolysis of water produces <b>hydrogen</b> and <b>oxygen</b>.');
      msg(note, 'Negative pole: <b>hydrogen</b> (20 cm³) · Positive pole: <b>oxygen</b> (10 cm³) · Volume ratio = <b>2 : 1</b>', 'good');
      A.sound('win'); A.celebrate(.7);
      A.reward('c2b-lab23', 20, 'Experiment 2.3');
      if (onDone) onDone();
      card.score.textContent = '✓ done';
      setActs(btn('↻ Run it again', () => card.replaceWith(labElectrolysis(onDone)), 'btn'));
    }
    const STEPS = [
      () => { st.go(0, 'Put two <b>plastic tubes</b> onto the gas discharge tubes.'); setActs(btn('Attach plastic tubes', () => { tween(300, t => tubesG.setAttribute('opacity', t)); A.sound('pop'); go(1); })); },
      () => { st.go(1, 'Fully fill the apparatus with about <b>100 cm³ water</b> until the water level of both sides reaches the top.'); setActs(btn('💧 Fill with water', () => { setActs(); A.sound('whoosh'); tween(1400, t => { S.fill = t; }, () => go(2)); })); },
      () => { st.go(2, '<b>Clip</b> the two plastic tubes to prevent the leakage of gas.'); setActs(btn('📎 Clip the tubes', () => { clipsG.forEach(c => c.setAttribute('opacity', 1)); A.sound('click'); go(3); })); },
      () => { st.go(3, 'Connect the <b>positive pole (+)</b> of the apparatus to which terminal of the power supply?'); setActs(...termBtns('+')); },
      () => { st.go(4, 'Connect the <b>negative pole (−)</b> of the apparatus to which terminal?'); setActs(...termBtns('-')); },
      () => { st.go(5, 'Turn on the power supply and adjust the voltage to <b>20 V</b> slowly.'); setActs(); ctrl.classList.remove('c2b-hide'); read.classList.remove('c2b-hide'); },
      () => {
        st.go(6, '👀 Look at the electrodes. What do you observe?');
        msg(note, '');
        ask.innerHTML = '';
        ask.appendChild(choices([
          { html: '<b>Colourless gas bubbles</b> are formed at <b>both</b> electrodes.', ok: true },
          { html: 'Gas bubbles are formed at the positive electrode only.', ok: false, why: 'Look again: bubbles rise from both electrodes.' },
          { html: 'A brown gas is formed at the negative electrode.', ok: false, why: 'Look at the colour: the gases are colourless.' },
          { html: 'No observable changes.', ok: false, why: 'Look at the electrodes: there are bubbles!' }
        ], () => A.later(() => { ask.innerHTML = ''; go(7); }, 1200)));
      },
      () => { st.go(7, '⏱ Keep it at 20 V and let the electrolysis run for <b>5 minutes</b>…'); if (S.t >= 300) A.later(() => go(8), 300); },
      () => { st.go(8, '5 minutes done! Adjust the power supply to <b>0 V</b> and then turn it off.'); A.sound('good'); },
      () => {
        st.go(9, 'Observe the ratio of the volumes of the two gases.');
        msg(note, 'Volume of gas at the <b>negative</b> pole = <b>20 cm³</b> · at the <b>positive</b> pole = <b>10 cm³</b>');
        ask.innerHTML = '';
        ask.appendChild(h('div', { class: 'c2b-ask', style: { fontWeight: 800, textAlign: 'center', marginBottom: '8px' }, text: 'Volume ratio (negative pole : positive pole) = ?' }));
        ask.appendChild(choices(['2 : 1', '1 : 1', '1 : 2', '3 : 1'].map((r, i) => ({ html: r, ok: !i, why: i ? 'Read the volumes again: 20 cm³ and 10 cm³.' : '' })), () => A.later(() => { ask.innerHTML = ''; go(10); }, 900), { chips: true }));
      },
      () => {
        st.go(10, 'Predict: which gas is collected at the <b>negative pole</b> (the bigger volume)?');
        ask.innerHTML = '';
        ask.appendChild(choices([
          { html: 'hydrogen', ok: true },
          { html: 'oxygen', ok: false, why: 'Water (H₂O) has twice as many hydrogen atoms as oxygen atoms, so the gas with twice the volume is hydrogen.' },
          { html: 'carbon dioxide', ok: false, why: 'Water contains only hydrogen and oxygen.' }
        ], () => {
          fillT('pred', 0, 'hydrogen'); fillT('pred', 1, 'oxygen');
          msg(note, 'Hydrogen at the negative pole, so the gas at the positive pole is <b>oxygen</b>. Now prove it!', 'good');
          A.later(() => testStep(0), 1100);
        }, { chips: true }));
      }
    ];
    function go(i) { step = i; STEPS[i](); }
    go(0);
    return card;
  }

  function waterParticles(onDone) {
    const wrap = h('div');
    const svg = svgEl('0 0 340 126', 'Two water molecules break apart and regroup into two hydrogen molecules and one oxygen molecule');
    [[8, 10, 104, 88], [150, 10, 92, 88], [260, 10, 72, 88]].forEach(([x, y, w, hh]) => svg.appendChild(h('rect', { class: 'c2b-frame', x, y, width: w, height: hh, rx: 3 })));
    svg.appendChild(h('line', { x1: 120, y1: 54, x2: 136, y2: 54, class: 'c2b-line' }));
    svg.appendChild(h('polygon', { points: '136,49 144,54 136,59', fill: 'var(--ink-2)' }));
    svg.appendChild(txt(251, 59, '+', 'c2b-t c2b-mid', { style: { fontSize: '16px' } }));
    svg.append(svgF(60, 118, '2H2O'), svgF(196, 118, '2H2'), svgF(296, 118, 'O2'));
    const AT = [
      { e: 'O', s: [38, 40], t: [289, 54] }, { e: 'O', s: [80, 70], t: [303, 54] },
      { e: 'H', s: [28, 49], t: [170, 38] }, { e: 'H', s: [48, 49], t: [182, 38] },
      { e: 'H', s: [70, 79], t: [208, 70] }, { e: 'H', s: [90, 79], t: [220, 70] }
    ];
    // faded copy of the reactants stays behind, so the finished picture shows both sides like the book
    const ghost = h('g', { opacity: 0 }, AT.map(a => bkAtom(a.s[0], a.s[1], a.e === 'O' ? 9 : 6, a.e === 'H')));
    svg.appendChild(ghost);
    AT.forEach(a => { a.el = bkAtom(a.s[0], a.s[1], a.e === 'O' ? 9 : 6, a.e === 'H'); svg.appendChild(a.el); });
    const note = h('div', { class: 'c2b-msg' });
    let ran = false;
    const go = btn('▶ Run the reaction', () => {
      go.disabled = true; A.sound('whoosh'); ghost.setAttribute('opacity', 0);
      AT.forEach(a => attrs(a.el, { cx: a.s[0], cy: a.s[1] }));
      tween(1500, t => AT.forEach((a, i) => attrs(a.el, { cx: lerp(a.s[0], a.t[0], t).toFixed(1), cy: (lerp(a.s[1], a.t[1], t) - Math.sin(t * Math.PI) * (14 + i * 3)).toFixed(1) })), () => {
        go.disabled = false; go.innerHTML = '↺ Replay'; tween(400, t => ghost.setAttribute('opacity', (t * .4).toFixed(2)));
        msg(note, 'Count them: <b>4 H atoms and 2 O atoms</b> on both sides. The atoms are only <b>rearranged</b>: 2 water molecules → 2 hydrogen molecules + 1 oxygen molecule.', 'good');
        if (!ran) { ran = true; if (onDone) onDone(); }
      });
    });
    wrap.append(h('div', { class: 'c2b-keys' }, h('span', { html: '<i style="background:var(--ink)"></i>hydrogen atom' }), h('span', { html: '<i style="background:var(--surface)"></i>oxygen atom' })),
      h('div', { class: 'c2b-stage' }, svg), h('div', { class: 'c2b-actions c2b-gap' }, go), note);
    return wrap;
  }

  function waterEquation() {
    const card = play('From experiment to equation', 'Discussion Q3: turn the electrolysis of water into a balanced chemical equation, one step at a time.', '✍️ Write');
    const sec = (lab) => { const s = h('div', { class: 'c2b-gap c2b-hide' }, h('span', { class: 'c2b-label', html: lab })); card.body.appendChild(s); return s; };
    const sA = sec('(a) Word equation'), sB = sec('(b) Unbalanced chemical equation'),
      sC = sec('(c) Balance it'), sD = sec('(d) Particle diagrams'), sE = sec('(e) Volume ratio vs equation');
    const show = s => { s.classList.remove('c2b-hide'); popIn(s); };
    show(sA);
    sA.appendChild(eqBuilder({ L: ['water'], R: ['hydrogen', 'oxygen'], extra: ['electricity', 'carbon dioxide'], hint: 'Electricity breaks the water down, but it is not a substance.', good: 'water → hydrogen + oxygen', onDone: () => show(sB) }));
    sB.appendChild(h('div', { class: 'tiny', style: { textAlign: 'center', marginBottom: '8px' }, html: SUB('The formulae of hydrogen gas and oxygen gas are H₂ and O₂.') }));
    sB.appendChild(eqBuilder({ L: [F('H2O')], R: [F('H2'), F('O2')], extra: ['H', 'O', F('H2O2')], hint: 'Hydrogen gas is H₂ and oxygen gas is O₂.', good: 'H₂O → H₂ + O₂ (not balanced yet!)', onDone: () => show(sC) }));
    sC.appendChild(balancer([LV.water], { rewardKey: 'c2b-bal1', onSolved: () => show(sD) }));
    sD.appendChild(waterParticles(() => show(sE)));
    sE.appendChild(choiceCloze('The ratio of volume of hydrogen gas : oxygen gas = {{2 : 1|1 : 2|1 : 1}}. The ratio of {{number of molecules|mass|size of molecules}} of hydrogen gas : oxygen gas = {{2 : 1|1 : 1|1 : 2}}. They are {{the same|different}}.', {
      autoOpen: false, rewardKey: 'c2b-ratio', xp: 10, onDone: () => { A.celebrate(.5); }
    }));
    return card;
  }

  function renderL6(root) {
    root.appendChild(notes('Experiment 2.3 · Electrolysis of water',
      '<p>' + T('Electrolysis', '電解') + ' uses electricity to break a substance down. What does water break down into? Try the experiment below. The steps follow the book’s procedure:</p>' +
      '<ol><li>Put two plastic tubes onto the gas discharge tubes; fill the apparatus with about <b>100 cm³ water</b>; clip the tubes.</li>' +
      '<li>Connect positive pole → <b>positive</b> terminal and negative pole → <b>negative</b> terminal of the power supply.</li>' +
      '<li>Switch on and adjust to <b>20 V</b> slowly. After <b>5 minutes</b>, adjust to <b>0 V</b>, then switch off. Compare the volumes of the two gases.</li></ol>', 'Experiment'));
    const results = resultsCard('Results',
      '<ul><li><b>Colourless gas bubbles</b> are formed at both electrodes.</li>' +
      '<li>Volume of gas at the negative pole : positive pole = <b>2 : 1</b> (e.g. 20 cm³ : 10 cm³).</li>' +
      '<li>Negative pole: <b>hydrogen</b>. Test: a ' + T('burning splint', '燃着的木條') + ' → burns with a <b>‘pop’ sound</b>.</li>' +
      '<li>Positive pole: <b>oxygen</b>. Test: a ' + T('glowing splint', '餘燼木條') + ' → the glowing splint <b>relights</b>.</li></ul>');
    root.appendChild(labElectrolysis(() => results.unlock()));
    root.appendChild(results);
    const d = play('Discussion: what does it prove?', 'Discussion Q2 from the book. Tap each blank and choose the right word.', '💬 Discuss');
    d.body.appendChild(choiceCloze(
      '<b>(a)</b> Electrolysis is the {{decomposition|combination|mixing}} (breaking down) of a substance by {{electricity|heat|water}}.<span class="c2b-czbr"></span>' +
      '<b>(b)</b> Electrolysis of water produces {{hydrogen|carbon dioxide|chlorine}} and {{oxygen|nitrogen|steam}}.<span class="c2b-czbr"></span>' +
      '<b>(c)</b> Water {{is not|is}} an element. It is a {{pure substance|mixture}} that can be {{broken down|mixed}} into something simpler (i.e. hydrogen and oxygen) by {{chemical methods|physical methods}} (e.g. electrolysis).<span class="c2b-czbr"></span>' +
      '<b>(d)</b> Water {{is|is not}} a compound. It is a pure substance that is made up of two or more elements (i.e. hydrogen and oxygen) {{chemically|physically}} combined.<span class="c2b-czbr"></span>' +
      '<b>(e)</b> The {{properties|colours}} of a compound are different from those of its constituent elements.',
      { autoOpen: false, rewardKey: 'c2b-disc23', xp: 15, reason: 'Discussion' }));
    root.appendChild(d);
    root.appendChild(A.keybox('<p><b>Electrolysis</b> is the <b>decomposition</b> (breaking down) of a substance by <b>electricity</b>.</p><p>Water is <b>not</b> an element: it can be broken down into hydrogen and oxygen. Water <b>is</b> a compound of hydrogen and oxygen chemically combined.</p>', '📖 Remember'));
    root.appendChild(waterEquation());
    A.quickCheck(root, 'ch2', 'ch2-6', 5);
  }

  /* =========================================================
     LESSON ch2-7 · 2.3 Chemical equations
     ========================================================= */
  function anatomy() {
    const card = play('Anatomy of a chemical equation', 'Read the clue, then tap that part of the equation.', '🔍 Explore');
    const brkL = h('div', { class: 'c2b-brk', text: '?' }), brkR = h('div', { class: 'c2b-brk', text: '?' });
    const pieces = [];
    const pc = (html, kind, side, cls) => {
      const b = h('button', { type: 'button', class: 'c2b-pc' + (cls ? ' ' + cls : ''), html });
      b._k = kind; b._s = side; b.addEventListener('click', () => tap(b)); pieces.push(b); return b;
    };
    const formula = (f, side) => f.match(/[A-Z][a-z]?|\d+/g).map(tok => (/^\d+$/.test(tok) ? pc(tok, 'sub', side, 'sub') : pc(tok, 'sym', side)));
    const eq = h('div', { class: 'c2b-anat', role: 'group', 'aria-label': '2H2O(l) → 2H2(g) + O2(g)' },
      h('div', { class: 'c2b-grpw' }, brkL, h('div', null, pc('2', 'coef', 'L'), formula('H2O', 'L'), pc('(l)', 'state', 'L', 'st'))),
      h('div', null, pc('&nbsp;→&nbsp;', 'arrow', '')),
      h('div', { class: 'c2b-grpw' }, brkR, h('div', null, pc('2', 'coef', 'R'), formula('H2', 'R'), pc('(g)', 'state', 'R', 'st'), pc('&nbsp;+&nbsp;', 'plus', 'R'), formula('O2', 'R'), pc('(g)', 'state', 'R', 'st'))));
    const KIND = { coef: 'a stoichiometric coefficient', sym: 'an atom symbol', sub: 'a subscript', state: 'a state symbol', arrow: 'the arrow', plus: 'a plus sign' };
    const TASKS = [
      { ask: 'Tap a <b>reactant</b>.', ok: b => b._s === 'L', learn: '<b>Reactants</b> are the substances that react. They are written on the <b>left</b> of the arrow.', on: () => { brkL.textContent = 'reactants'; brkL.classList.add('on'); } },
      { ask: 'Tap a <b>product</b>.', ok: b => b._s === 'R' && b._k !== 'plus', learn: '<b>Products</b> are the new substances formed. They are written on the <b>right</b>.', on: () => { brkR.textContent = 'products'; brkR.classList.add('on'); } },
      { ask: 'Tap a <b>state symbol</b>.', ok: b => b._k === 'state', learn: '<b>State symbols</b> show the physical states: (s) solid, (l) liquid, (g) gas, (aq) aqueous solution.' },
      { ask: 'Tap the part that shows the <b>reversibility</b> of the reaction.', ok: b => b._k === 'arrow', learn: 'The <b>arrow</b>: a single arrow (→) means an <b>irreversible</b> reaction; a double arrow (⇌) means a <b>reversible</b> reaction.' },
      { ask: 'Tap a <b>stoichiometric coefficient</b> (a big number in front).', ok: b => b._k === 'coef', learn: '<b>Coefficients</b> are put in front of formulae: 2H₂O means <b>two</b> water molecules.' },
      { ask: 'Tap a <b>subscript</b> (a small number inside a formula).', ok: b => b._k === 'sub', learn: 'Reactants and products are written in <b>complete formulae</b>, including the <b>subscripts</b> (H₂O has 2 H atoms and 1 O atom).' }
    ];
    let ti = 0;
    const prompt = h('div', { class: 'c2b-prompt', 'aria-live': 'polite' });
    const fb = h('div', { class: 'feedback', style: { textAlign: 'center' } });
    const learn = h('div', { class: 'c2b-learn' });
    function showTask() {
      card.score.textContent = ti + ' / ' + TASKS.length;
      if (ti >= TASKS.length) {
        prompt.innerHTML = '🏆 You found every part!'; fb.innerHTML = 'Tap any part again to check what it is.';
        A.sound('win'); A.celebrate(.5); A.reward('c2b-anatomy', 10, 'Equation parts');
        return;
      }
      prompt.innerHTML = '🔎 ' + TASKS[ti].ask; popIn(prompt);
    }
    function tap(b) {
      if (ti >= TASKS.length) { fb.className = 'feedback'; fb.innerHTML = 'That is ' + KIND[b._k] + (b._s === 'L' ? ' (in a reactant).' : b._s === 'R' && b._k !== 'plus' ? ' (in a product).' : '.'); A.sound('click'); return; }
      const t = TASKS[ti];
      if (t.ok(b)) {
        b.classList.add('hit'); A.later(() => b.classList.remove('hit'), 900);
        if (t.on) t.on();
        learn.appendChild(h('div', { class: 'pop-in', html: '✅ ' + SUB(t.learn) }));
        fb.className = 'feedback good'; fb.innerHTML = 'Found it!'; A.sound('good');
        ti++; showTask();
      } else {
        b.classList.add('miss'); A.later(() => b.classList.remove('miss'), 600);
        fb.className = 'feedback bad'; fb.innerHTML = 'That’s ' + KIND[b._k] + '. Try again!'; A.sound('bad');
      }
    }
    card.body.append(prompt, h('div', { style: { overflowX: 'auto' } }, eq), fb, learn);
    showTask();
    return card;
  }

  function noBuilder(onAll) {
    const card = play('Classwork: draw the particle diagrams', 'Keys: ● nitrogen atom, ○ oxygen atom. Big number in front = how many <b>molecules</b>; small subscript = how many of the atom just before it.', '✏️ Build');
    const TARGETS = [
      { f: '2NO', mols: [['N', 'O'], ['N', 'O']], tip: '2NO = <b>two</b> separate NO molecules (each 1 N + 1 O).' },
      { f: 'N2O', mols: [['N', 'N', 'O']], tip: 'N₂O = <b>one</b> molecule with 2 N atoms and 1 O atom.' },
      { f: 'NO2', mols: [['N', 'O', 'O']], tip: 'NO₂ = one molecule with 1 N atom and 2 O atoms.' },
      { f: 'N2O2', mols: [['N', 'N', 'O', 'O']], tip: 'N₂O₂ = one molecule with 2 N atoms and 2 O atoms.' }
    ];
    const key = m => 'N' + m.filter(e => e === 'N').length + 'O' + m.filter(e => e === 'O').length;
    let ti = 0, mols = [[]];
    const dots = h('div', { class: 'c2b-dots' }, TARGETS.map(() => h('i')));
    const target = h('div', { class: 'c2b-target' });
    const svg = h('svg', { class: 'c2b-svg', viewBox: '0 0 170 110', role: 'img', 'aria-label': 'Your particle diagram' });
    const fb = h('div', { class: 'feedback' });
    const bN = btn('+ ● N', () => add('N'), 'btn'), bO = btn('+ ○ O', () => add('O'), 'btn');
    const bNew = btn('New molecule', () => { if (mols[mols.length - 1].length && mols.length < 3) { mols.push([]); draw(); A.sound('click'); } }, 'btn btn-ghost');
    const bClr = btn('↺ Clear', () => { mols = [[]]; draw(); fb.innerHTML = ''; }, 'btn btn-ghost');
    const bChk = btn('Check', check);
    const POS = { 1: [[85, 55]], 2: [[50, 38], [120, 74]], 3: [[45, 30], [125, 46], [75, 84]] };
    function draw() {
      svg.innerHTML = '';
      svg.appendChild(h('rect', { class: 'c2b-frame', x: 1, y: 1, width: 168, height: 108, rx: 3 }));
      const list = mols.filter((m, i) => m.length || i === mols.length - 1);
      const pos = POS[Math.max(1, list.length)];
      list.forEach((m, i) => {
        const [cx, cy] = pos[i];
        if (!m.length) { svg.appendChild(h('circle', { cx, cy, r: 9, fill: 'none', stroke: 'var(--ink-3)', 'stroke-dasharray': '3 3' })); return; }
        m.forEach((e, k) => svg.appendChild(bkAtom((cx + (k - (m.length - 1) / 2) * 15).toFixed(1), cy, 9, e === 'N')));
      });
      const cur = mols[mols.length - 1];
      bN.disabled = bO.disabled = cur.length >= 4;
      bNew.disabled = !cur.length || mols.length >= 3;
    }
    function add(e) { mols[mols.length - 1].push(e); A.sound('pop'); fb.innerHTML = ''; draw(); }
    function check() {
      const got = mols.filter(m => m.length).map(key).sort(), want = TARGETS[ti].mols.map(key).sort();
      if (!got.length) { fb.className = 'feedback'; fb.textContent = '👆 Add some atoms first.'; return; }
      if (got.join() === want.join()) {
        fb.className = 'feedback good'; fb.innerHTML = '✅ ' + SUB(TARGETS[ti].tip); A.sound('good');
        bChk.disabled = true;
        A.later(() => { ti++; next(); }, 1600);
      } else {
        const count = (list, e) => list.flat().filter(x => x === e).length;
        const sameAtoms = ['N', 'O'].every(e => count(mols, e) === count(TARGETS[ti].mols, e));
        fb.className = 'feedback bad';
        fb.innerHTML = '❌ ' + (sameAtoms ? 'Right atoms, wrong grouping! Is it <b>one</b> molecule or <b>two</b>?' : 'Count again: the coefficient multiplies the whole molecule; a subscript only counts the atom just before it.');
        A.sound('bad'); shake(svg);
      }
    }
    function next() {
      [...dots.children].forEach((d, k) => { d.className = k < ti ? 'ok' : k === ti ? 'on' : ''; });
      if (ti >= TARGETS.length) {
        target.innerHTML = '🏆';
        card.body.querySelectorAll('.c2b-bctl').forEach(x => x.classList.add('c2b-hide'));
        fb.className = 'feedback good'; fb.innerHTML = SUB('All four drawn! Notice: 2NO and N₂O₂ both have 2 N and 2 O atoms, but 2NO is <b>two</b> molecules and N₂O₂ is <b>one</b>.');
        A.sound('win'); A.celebrate(.5); A.reward('c2b-nobuild', 15, 'Particle diagrams');
        if (onAll) onAll();
        return;
      }
      target.innerHTML = F(TARGETS[ti].f);
      mols = [[]]; bChk.disabled = false; draw();
    }
    card.body.append(dots, h('div', { class: 'c2b-bwrap' },
      h('div', null, h('div', { class: 'tiny center', text: 'Draw:' }), target, h('div', { class: 'c2b-actions c2b-gap c2b-bctl' }, bN, bO), h('div', { class: 'c2b-actions c2b-gap c2b-bctl' }, bNew, bClr, bChk)),
      svg), fb);
    next();
    return card;
  }

  const COUNT_POOL = ['2NO', 'N2O', 'NO2', '2NO2', 'N2O2', '3H2O', '2H2O', '3H2', 'Al2O3', 'C6H12O6', 'Pb(NO3)2', '2NaNO3', 'Na2SO4', 'CH4', '2O2', '2NaCl', '2HCl', 'PbSO4', '2CO2', '2Al'];
  function countGame() {
    const card = play('Count the atoms', 'How many atoms of each element? Remember: coefficient × subscript. 8 rounds.', '🧮 Play');
    const stage = h('div');
    card.body.appendChild(stage);
    let rounds, r, score;
    function start() { rounds = A.sample(COUNT_POOL, 8); r = 0; score = 0; round(); }
    function round() {
      stage.innerHTML = '';
      card.score.textContent = score + ' / ' + rounds.length;
      if (r >= rounds.length) {
        stage.appendChild(h('div', { class: 'c2b-done pop-in' }, h('span', { class: 'c2b-ico', text: score >= 7 ? '🏆' : score >= 5 ? '👍' : '💪' }),
          h('h3', { text: score + ' / ' + rounds.length + ' correct' }), btn('↻ New rounds', start, 'btn')));
        A.sound('win'); if (score >= 7) A.celebrate(.5);
        A.reward('c2b-count', 15, 'Atom counter');
        return;
      }
      const f = rounds[r], p = parseFormula(f), base = f.replace(/^\d+/, '');
      const els = Object.keys(p.atoms), val = {}, total = {};
      els.forEach(e => { total[e] = p.atoms[e] * p.coef; });
      stage.appendChild(h('div', { class: 'c2b-target', style: { margin: '4px 0 12px' }, html: F(f) }));
      const box = h('div', { class: 'c2b-count' });
      const rows = els.map(e => {
        val[e] = 0;
        const v = h('span', { class: 'c2b-coef', text: '0' });
        const row = h('div', { class: 'c2b-crow' }, h('span', { class: 'nm', html: e + ' <span class="tiny">(' + EL_NAME[e] + ')</span>' }),
          h('button', { type: 'button', class: 'c2b-stp', 'aria-label': 'fewer ' + EL_NAME[e], text: '−', on: { click: () => { val[e] = Math.max(0, val[e] - 1); v.textContent = val[e]; A.sound('click'); } } }),
          v,
          h('button', { type: 'button', class: 'c2b-stp', 'aria-label': 'more ' + EL_NAME[e], text: '+', on: { click: () => { val[e] = Math.min(24, val[e] + 1); v.textContent = val[e]; A.sound('click'); } } }));
        box.appendChild(row);
        return { e, row, v };
      });
      const fb = h('div', { class: 'feedback', style: { textAlign: 'center' } });
      const pics = h('div', { class: 'c2b-center c2b-gap', style: { display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' } });
      const act = h('div', { class: 'c2b-actions c2b-gap' });
      const chk = btn('Check', () => {
        const ok = rows.every(x => val[x.e] === total[x.e]);
        rows.forEach(x => { const good = val[x.e] === total[x.e]; x.row.classList.add(good ? 'ok' : 'bad'); if (!good) x.v.textContent = total[x.e]; x.row.querySelectorAll('button').forEach(b => { b.disabled = true; }); });
        const why = rows.map(x => x.e + ': ' + (p.coef > 1 ? p.coef + ' × ' + p.atoms[x.e] + ' = ' : '') + total[x.e]).join(' · ');
        if (ok) { score++; fb.className = 'feedback good'; fb.innerHTML = '✅ ' + why; A.sound('good'); }
        else { fb.className = 'feedback bad'; fb.innerHTML = '❌ ' + why; A.sound('bad'); }
        for (let k = 0; k < p.coef; k++) pics.appendChild(glyph(base, 52));
        act.innerHTML = ''; act.appendChild(btn(r + 1 < rounds.length ? 'Next →' : 'Finish', () => { r++; round(); }));
      });
      act.appendChild(chk);
      stage.append(box, act, fb, pics);
    }
    start();
    return card;
  }

  function renderL7(root) {
    root.appendChild(notes('Chemical equations',
      '<ul><li>A ' + T('chemical equation', '化學方程式') + ' shows the <b>reactants → products</b> of a reaction, e.g. 2H₂O(l) → 2H₂(g) + O₂(g).</li>' +
      '<li>Reactants and products are written in <b>complete formulae</b> (including the subscripts).</li>' +
      '<li>The ' + T('state symbols', '物態符號') + ' show the physical states: solid <b>(s)</b>, liquid <b>(l)</b>, gas <b>(g)</b>, ' + T('aqueous solution', '水溶液') + ' <b>(aq)</b>.</li>' +
      '<li>The arrow shows the reversibility: a single arrow <b>→</b> = an ' + T('irreversible', '不可逆') + ' reaction; a double arrow <b>⇌</b> = a ' + T('reversible', '可逆') + ' reaction.</li></ul>'));
    root.appendChild(anatomy());
    const m = play('Symbol match', 'Tap a symbol, then what it means.', '🔗 Match');
    const mfb = h('div', { class: 'feedback' });
    m.body.append(A.matchWidget([['(s)', 'solid'], ['(l)', 'liquid'], ['(g)', 'gas'], ['(aq)', 'aqueous solution'], ['→', 'irreversible reaction'], ['⇌', 'reversible reaction']], {
      onDone: mistakes => { mfb.className = 'feedback good'; mfb.innerHTML = mistakes ? '🎉 All matched (' + wrongTries(mistakes) + ').' : '🌟 Perfect match!'; A.reward('c2b-symmatch', 10, 'Symbols'); }
    }), mfb);
    root.appendChild(m);
    root.appendChild(notes('Balancing chemical equations (stoichiometry)',
      '<ul><li>Chemical equations have to be <b>balanced</b> because atoms <b>cannot be created or destroyed</b> in a reaction. They only <b>rearrange (regroup)</b> to form new substances.</li>' +
      '<li>To balance an equation, ' + T('stoichiometric coefficients', '化學計量係數') + ' are added <b>before</b> the chemical formulae.</li>' +
      '<li>They represent the <b>simplest whole-number ratio</b> of particles involved in the reaction.</li></ul>'));
    root.appendChild(A.keybox('The numbers of all types of atoms must be the <b>same</b> on both sides of a chemical equation.'));
    const kw = play('Key words', 'Type the missing words.', '📖 Key words');
    kw.body.appendChild(A.cloze('Atoms cannot be created or [[destroyed]] in a reaction. They only [[rearrange|regroup|rearranged|regrouped]] to form new substances. To balance an equation, stoichiometric [[coefficients|coefficient]] are added before the chemical formulae. They represent the simplest [[whole-number|whole number]] ratio of particles.', { rewardKey: 'c2b-def-balance', xp: 10 }));
    root.appendChild(kw);
    const cs = notes('Coefficient or subscript?',
      '<ul><li>The <b>stoichiometric coefficient</b> applies to <b>all atoms</b> in the chemical species. 2NO means 2 NO molecules, each with 1 N and 1 O atom → altogether <b>2 N and 2 O</b> atoms.</li>' +
      '<li>The ' + T('subscript', '下標') + ' applies <b>ONLY</b> to the atom just before it. NO₂ means <b>1 N and 2 O</b> atoms in each NO₂ molecule; the “2” does not apply to N.</li>' +
      '<li>💡 A subscript after a bracket applies to everything inside the bracket: Pb(NO₃)₂ has 1 Pb, 2 N and 6 O atoms.</li></ul>');
    cs.appendChild(h('div', { class: 'c2b-figrow c2b-gap' },
      h('figure', null, bookBox([{ els: ['N', 'O'], x: 45, y: 36 }, { els: ['N', 'O'], x: 102, y: 64 }], { aria: '2NO: two NO molecules' }), h('figcaption', { html: '2NO<small>2 molecules</small>' })),
      h('figure', null, bookBox([{ els: ['O', 'N', 'O'], x: 75, y: 50 }], { aria: 'NO2: one molecule' }), h('figcaption', { html: SUB('NO₂<small>1 molecule</small>') }))));
    const disc = h('div', { class: 'c2b-hide' });
    root.appendChild(noBuilder(() => { disc.classList.remove('c2b-hide'); popIn(disc); }));
    const qb = { type: 'mcq', q: '(b) Are 2NO, N₂O, NO₂ and N₂O₂ the same compound?', answer: 0, explain: 'The molecules contain different numbers (ratios) of N and O atoms, so they are different compounds. 2NO is just two NO molecules.',
      options: ['No: their molecules contain different numbers of N and O atoms.', 'Yes: they are all made of nitrogen and oxygen.', 'Yes: 2NO and N₂O₂ both have 2 N and 2 O atoms, so all are the same.', 'No: because they are written in a different order.'] };
    const qc = { type: 'mcq', q: '(c) A student claims that “2NO₂” is the chemical formula of one of the compounds formed between nitrogen and oxygen. Do you agree?', answer: 0, explain: 'The 2 in front is a stoichiometric coefficient: “2NO₂” means two NO₂ molecules. The chemical formula is NO₂.',
      options: ['Disagree: the 2 in front is a coefficient meaning two NO₂ molecules; the formula is NO₂.', 'Agree: it shows 2 N atoms and 4 O atoms.', 'Agree: coefficients are part of a chemical formula.', 'Disagree: nitrogen and oxygen cannot form compounds.'] };
    let nd = 0;
    const discCard = play('Classwork (b) and (c)', 'Explain like a chemist.', '💬 Think');
    discCard.body.append(A.renderQuestion(subQ(qb), { done: () => { if (++nd === 2) A.reward('c2b-nodisc', 10, 'Classwork'); } }), h('div', { class: 'c2b-gap' }), A.renderQuestion(subQ(qc), { done: () => { if (++nd === 2) A.reward('c2b-nodisc', 10, 'Classwork'); } }));
    disc.appendChild(discCard);
    root.appendChild(disc);
    // the book explains coefficient vs subscript after the classwork, so the drawings are not given away
    root.appendChild(cs);
    root.appendChild(countGame());
    A.quickCheck(root, 'ch2', 'ch2-7', 5);
  }

  /* =========================================================
     LESSON ch2-8 · 2.3 Balancing chemical equations
     ========================================================= */
  function flipped() {
    const card = play('Flipped classroom: aluminium + steam', 'When aluminium reacts with steam, aluminium oxide (Al₂O₃) and hydrogen gas (H₂) are formed. Write a balanced chemical equation in 3 steps.', '🎬 3 steps');
    const sec = lab => { const s = h('div', { class: 'c2b-gap c2b-hide' }, h('span', { class: 'c2b-label', text: lab })); card.body.appendChild(s); return s; };
    const s1 = sec('Step 1 · Write the word equation'), s2 = sec('Step 2 · Formulae with state symbols'), s3 = sec('Step 3 · Balance the equation');
    const show = s => { s.classList.remove('c2b-hide'); popIn(s); };
    show(s1);
    s1.appendChild(eqBuilder({ L: ['aluminium', 'steam'], R: ['aluminium oxide', 'hydrogen'], extra: ['oxygen', 'carbon dioxide'], good: 'aluminium + steam → aluminium oxide + hydrogen', onDone: () => show(s2) }));
    // step 2: tap to cycle the state symbol of each species
    const SP = [['Al', 's'], ['H2O', 'g'], ['Al2O3', 's'], ['H2', 'g']], OPTS = ['s', 'l', 'g', 'aq'];
    const row = h('div', { class: 'c2b-states' });
    const picks = SP.map(() => -1);
    const sb = SP.map(([f], i) => {
      if (i) row.appendChild(h('span', { class: 'c2b-op', text: i === 2 ? '→' : '+' }));
      const b = h('button', { type: 'button', class: 'c2b-sbtn', text: '(?)', 'aria-label': 'State symbol for ' + f + ': tap to change' });
      b.addEventListener('click', () => { picks[i] = (picks[i] + 1) % OPTS.length; b.textContent = '(' + OPTS[picks[i]] + ')'; b.className = 'c2b-sbtn set'; A.sound('click'); });
      row.appendChild(h('span', { class: 'c2b-spc' }, h('span', { html: F(f) }), b));
      return b;
    });
    const fb2 = h('div', { class: 'feedback' });
    const chk = btn('Check', () => {
      if (picks.some(p => p < 0)) { fb2.className = 'feedback'; fb2.textContent = '👆 Tap each (?) to choose its state symbol.'; return; }
      const ok = SP.map(([, s], i) => OPTS[picks[i]] === s);
      sb.forEach((b, i) => { b.className = 'c2b-sbtn ' + (ok[i] ? 'ok' : 'bad'); });
      if (ok.every(Boolean)) {
        sb.forEach(b => { b.disabled = true; }); chk.disabled = true;
        fb2.className = 'feedback good'; fb2.innerHTML = SUB('✅ Al(s) + H₂O(g) → Al₂O₃(s) + H₂(g). Steam is a gas!'); A.sound('good');
        show(s3);
      } else { fb2.className = 'feedback bad'; fb2.innerHTML = '❌ Not quite. Aluminium and aluminium oxide are solids; steam and hydrogen are gases.'; A.sound('bad'); }
    });
    s2.append(h('div', { class: 'tiny center', style: { marginBottom: '8px' }, text: 'Tap each (?) to change it: (s) → (l) → (g) → (aq)' }), row, h('div', { class: 'c2b-actions c2b-gap' }, chk), fb2);
    s3.appendChild(balancer([LV.al], { rewardKey: 'c2b-bal-al', xp: 15, onSolved: () => { A.celebrate(.8); } }));
    return card;
  }

  /** Equation judge: balanced? simplest ratio? or did someone change a subscript? (book equations only) */
  const JUDGE = [
    ['2H2O -> 2H2 + O2'], ['H2O -> H2 + O2'], ['4H2O -> 4H2 + 2O2'], ['H2O2 -> H2 + O2', 'Water is H2O. Changing it to H2O2 changes the substance.'],
    ['C + O2 -> CO2'], ['Fe + S -> FeS'],
    ['2Na + Cl2 -> 2NaCl'], ['Na + Cl2 -> NaCl'], ['4Na + 2Cl2 -> 4NaCl'], ['Na + Cl2 -> NaCl2', 'Sodium chloride is NaCl, not NaCl2.'],
    ['H2 + Cl2 -> 2HCl'], ['H2 + Cl2 -> HCl'], ['2H2 + 2Cl2 -> 4HCl'], ['H2 + Cl2 -> H2Cl2', 'Hydrogen chloride is HCl, not H2Cl2.'],
    ['CH4 + 2O2 -> CO2 + 2H2O'], ['CH4 + O2 -> CO2 + H2O'], ['2CH4 + 4O2 -> 2CO2 + 4H2O'], ['CH4 + O4 -> CO2 + 2H2O', 'Oxygen gas is O2, not O4.'],
    ['6C + 6H2 + 3O2 -> C6H12O6'], ['C + H2 + O2 -> C6H12O6'], ['12C + 12H2 + 6O2 -> 2C6H12O6'],
    ['2Al + 3H2O -> Al2O3 + 3H2'], ['Al + H2O -> Al2O3 + H2'], ['4Al + 6H2O -> 2Al2O3 + 6H2'],
    ['Na2SO4 + Pb(NO3)2 -> 2NaNO3 + PbSO4'], ['Na2SO4 + Pb(NO3)2 -> NaNO3 + PbSO4']
  ];
  function judgeVerdict([eq, note]) {
    const [l, r] = eq.split(' -> ').map(side => side.split(' + ').map(parseFormula));
    const count = list => { const o = {}; list.forEach(p => { for (const e in p.atoms) o[e] = (o[e] || 0) + p.atoms[e] * p.coef; }); return o; };
    const L = count(l), R = count(r), els = Object.keys(Object.assign({}, L, R));
    const tally = els.map(e => e + ': ' + (L[e] || 0) + ' → ' + (R[e] || 0)).join(' · ');
    const bal = els.every(e => (L[e] || 0) === (R[e] || 0));
    const g = l.concat(r).map(p => p.coef).reduce(gcd);
    if (note) return { v: 'sub', why: note + ' Never change a subscript; only change the coefficients in front.' };
    if (!bal) return { v: 'no', why: 'Count the atoms (left → right): ' + tally + '. Not the same on both sides.' };
    if (g > 1) return { v: 'ratio', why: 'It is balanced, but every coefficient can be divided by ' + g + '. Coefficients must be the simplest whole-number ratio.' };
    return { v: 'ok', why: 'Same number of each type of atom on both sides (' + tally + ') and the simplest ratio.' };
  }
  function judgeGame() {
    const card = play('Equation judge', 'Be a strict examiner! Is each equation <b>balanced</b>, in the <b>simplest ratio</b>, with the <b>right formulae</b>?', '🧑‍⚖️ Judge');
    const VERDICTS = [['ok', '✅ Balanced'], ['no', '⚖️ Not balanced'], ['ratio', '➗ Not the simplest ratio'], ['sub', '🚫 A formula was changed']];
    const all = JUDGE.map(j => Object.assign({ eq: j[0] }, judgeVerdict(j)));
    const stage = h('div');
    card.body.appendChild(stage);
    let rounds, r, score;
    function start() {
      // 2 of each verdict, shuffled, so every kind of mistake comes up
      rounds = A.shuffle(VERDICTS.flatMap(([v]) => A.sample(all.filter(x => x.v === v), 2)));
      r = 0; score = 0; round();
    }
    function round() {
      stage.innerHTML = '';
      card.score.textContent = score + ' / ' + rounds.length;
      if (r >= rounds.length) {
        stage.appendChild(h('div', { class: 'c2b-done pop-in' }, h('span', { class: 'c2b-ico', text: score >= 7 ? '🏆' : score >= 5 ? '👍' : '💪' }),
          h('h3', { text: score + ' / ' + rounds.length + ' correct' }), btn('↻ New equations', start, 'btn')));
        A.sound('win'); if (score >= 7) A.celebrate(.6);
        A.reward('c2b-judge', 15, 'Equation judge');
        return;
      }
      const it = rounds[r];
      const fb = h('div', { class: 'feedback', style: { textAlign: 'center' } });
      const nextBox = h('div', { class: 'c2b-actions c2b-gap' });
      const btns = VERDICTS.map(([v, lab]) => btn(lab, () => answer(v), 'btn c2b-big'));
      function answer(v) {
        btns.forEach(b => { b.disabled = true; });
        const ok = v === it.v, k = VERDICTS.findIndex(x => x[0] === it.v);
        btns[k].classList.add('c2b-jok');
        if (ok) { score++; fb.className = 'feedback good'; fb.innerHTML = '✅ ' + SUB(it.why); A.sound('good'); }
        else {
          btns[VERDICTS.findIndex(x => x[0] === v)].classList.add('c2b-jbad');
          fb.className = 'feedback bad'; fb.innerHTML = '❌ Answer: <b>' + VERDICTS[k][1].replace(/^\S+ /, '') + '</b>. ' + SUB(it.why); A.sound('bad'); shake(eqCard);
        }
        card.score.textContent = score + ' / ' + rounds.length;
        nextBox.appendChild(btn(r + 1 < rounds.length ? 'Next →' : 'Finish', () => { r++; round(); }));
      }
      const eqCard = h('div', { class: 'c2b-card pop-in' }, h('div', { class: 'c2b-jeq', html: EQ(it.eq) }));
      stage.append(h('div', { class: 'tiny center', style: { marginBottom: '6px' }, text: 'Equation ' + (r + 1) + ' of ' + rounds.length }), eqCard,
        h('div', { class: 'c2b-two c2b-gap' }, btns), fb, nextBox);
    }
    start();
    return card;
  }

  function renderL8(root) {
    root.appendChild(notes('Writing a balanced chemical equation in 3 steps',
      '<ol><li>Write the <b>word equation</b> for the reaction.</li>' +
      '<li>Write the <b>chemical formulae</b> of the reactants and products, with <b>state symbols</b> (if necessary).</li>' +
      '<li><b>Balance</b> the equation so that the number of atoms of each element on the left-hand side equals the number on the right-hand side.</li></ol>' +
      '<p>⚠️ Only change the <b>coefficients</b> in front. Never change a subscript: that would change the substance!</p>', 'Flipped classroom'));
    root.appendChild(flipped());
    const arc = play('Equation balancer: classwork', 'Write the word equation, then balance it. Use ▲ ▼ to change the numbers until every balance is level and green.', '⚖️ Balance');
    arc.body.appendChild(balancer([LV.water, LV.c, LV.na, LV.hcl, LV.glu, LV.ch4, LV.pb], { rewardKey: 'c2b-bal', word: true }));
    root.appendChild(arc);
    root.appendChild(A.keybox('The numbers of all types of atoms must be the <b>same</b> on both sides of a chemical equation. The coefficients give the <b>simplest whole-number ratio</b> of particles.'));
    root.appendChild(judgeGame());
    A.quickCheck(root, 'ch2', 'ch2-8', 5);
  }

  /* =========================================================
     Question figures (book-style keys)
     ========================================================= */
  const figNO2x = () => bookBox([{ els: ['N', 'O'], x: 45, y: 34 }, { els: ['N', 'O'], x: 104, y: 64 }], { aria: 'Two separate molecules, each with one nitrogen atom and one oxygen atom' });
  const figN2O2 = () => bookBox([{ els: ['O', 'N', 'N', 'O'], x: 75, y: 50 }], { aria: 'One molecule with two nitrogen atoms and two oxygen atoms' });
  const figN2O = () => bookBox([{ els: ['N', 'N', 'O'], x: 50, y: 34 }, { els: ['N', 'N', 'O'], x: 100, y: 66 }], { aria: 'Two molecules, each with two nitrogen atoms and one oxygen atom' });
  const figProducts = () => bookBox([{ els: ['H', 'H'], x: 34, y: 30 }, { els: ['H', 'H'], x: 62, y: 70 }, { els: ['O', 'O'], x: 112, y: 46 }], { filled: 'H', aria: 'Two hydrogen molecules and one oxygen molecule' });
  function figMixed() {
    const svg = h('svg', { class: 'c2b-qfig', viewBox: '0 0 150 96', role: 'img', 'aria-label': 'Circle particles and diamond particles spread among each other' });
    svg.appendChild(h('rect', { class: 'c2b-frame', x: 1, y: 1, width: 148, height: 94, rx: 3 }));
    [[24, 22], [70, 40], [120, 24], [40, 74]].forEach(([x, y]) => svg.appendChild(bkAtom(x, y, 7, false)));
    [[52, 20], [98, 64], [128, 76], [18, 50]].forEach(([x, y]) => svg.appendChild(h('rect', { x: -6, y: -6, width: 12, height: 12, fill: 'var(--ink)', transform: `translate(${x},${y}) rotate(45)` })));
    return svg;
  }

  /* =========================================================
     Question bank (all answers checked against the book)
     ========================================================= */
  const L4 = 'ch2-4', L5 = 'ch2-5', L6 = 'ch2-6', L7 = 'ch2-7', L8 = 'ch2-8';
  const questions = [
    /* ---- ch2-4 · Experiment 2.2, physical vs chemical change ---- */
    { lesson: L4, type: 'mcq', q: 'In Experiment 2.2, what is placed in the mouth of the boiling tube before heating the iron and sulphur?', options: ['A mineral wool plug', 'A rubber stopper', 'A glowing splint', 'A piece of filter paper'], answer: 0, explain: 'Step 2 of the procedure: place a mineral wool plug in the mouth of the boiling tube.' },
    { lesson: L4, type: 'mcq', q: 'Which flame is used to heat the mixture of iron and sulphur strongly?', options: ['A non-luminous Bunsen flame', 'A luminous Bunsen flame', 'A burning splint', 'No flame: it reacts on mixing'], answer: 0, explain: 'The boiling tube is heated strongly with a non-luminous (blue) Bunsen flame.' },
    { lesson: L4, type: 'multi', q: 'Which of the following are observed when a mixture of iron and sulphur is heated strongly?', options: ['The mixture glows red hot.', 'The glow spreads through the mixture.', 'A black solid is formed.', 'Colourless gas bubbles are given off.', 'The mixture turns into a blue liquid.'], answer: [0, 1, 2], explain: 'The mixture glows red hot, the glow spreads through the mixture (even after the flame is removed) and black iron(II) sulphide is formed.' },
    { lesson: L4, type: 'mcq', q: 'What is the appearance of iron(II) sulphide?', options: ['Black solid', 'Yellow powder', 'Grey powder', 'Yellowish grey powder'], answer: 0, explain: 'Iron(II) sulphide is a black solid, a new substance with properties different from iron and sulphur.' },
    { lesson: L4, type: 'match', q: 'Match each substance with its appearance.', pairs: [['Iron', 'grey powder'], ['Sulphur', 'yellow powder'], ['Mixture of iron and sulphur', 'yellowish grey powder'], ['Iron(II) sulphide', 'black solid']], explain: 'A mixture looks like its constituents mixed together; the compound looks completely different.' },
    { lesson: L4, type: 'tf', q: 'Mixing iron powder and sulphur powder forms a new substance.', answer: false, explain: 'Mixing is a physical change: no new substance is formed and the iron can still be removed with a magnet.' },
    { lesson: L4, type: 'tf', q: 'When iron and sulphur are heated, the glow continues to spread through the mixture even after the flame is removed.', answer: true, explain: 'The reaction gives out heat, so once started the glow spreads by itself.' },
    { lesson: L4, type: 'mcq', q: 'Which statement about <b>heating</b> iron and sulphur is correct?', options: ['It forms a substance with a fixed composition.', 'It can be easily reversed with a magnet.', 'It forms substances with variable composition.', 'There is no heat change.'], answer: 0, explain: 'Heating forms iron(II) sulphide, a new substance with a fixed composition and new properties; heat is given out.' },
    { lesson: L4, type: 'mcq', q: 'Which statement about <b>mixing</b> iron and sulphur is correct?', options: ['There is no (or very little) heat change.', 'It forms a substance with a fixed composition.', 'It cannot be reversed by physical methods.', 'A black solid is formed.'], answer: 0, explain: 'Mixing is a physical change: no new substance, variable composition, easily reversed and no heat change.' },
    { lesson: L4, type: 'tf', q: 'Mixing iron and sulphur is easily reversed, e.g. the iron can be removed by a magnet.', answer: true, explain: 'In a mixture the iron keeps its properties, so it is still attracted by a magnet.' },
    { lesson: L4, type: 'fill', q: 'A physical change is a change in which ___ new substance is formed.', answer: ['no'], explain: 'Book definition: a physical change is a change in which no new substance is formed.' },
    { lesson: L4, type: 'fill', q: 'A chemical change is a change in which one or more new ___ are formed.', answer: ['substances', 'substance'], explain: 'Book definition: a chemical change is a change in which one or more new substances are formed.' },
    { lesson: L4, type: 'fill', q: 'Word equation: iron + sulphur → ___', answer: ['iron(II) sulphide', 'iron(ii) sulphide', 'iron 2 sulphide', 'iron(2) sulphide', 'iron ii sulphide'], hint: 'The name of the black solid formed.', explain: 'Heating iron and sulphur forms iron(II) sulphide (FeS).' },
    { lesson: L4, type: 'mcq', q: 'In the reaction “iron + sulphur → iron(II) sulphide”, iron and sulphur are the…', options: ['reactants', 'products', 'mixtures', 'state symbols'], answer: 0, explain: 'The substances that react (left of the arrow) are the reactants; iron(II) sulphide is the product.' },
    { lesson: L4, type: 'mcq', q: 'Which is the chemical equation for heating iron and sulphur?', options: ['Fe + S → FeS', 'FeS → Fe + S', 'I + S → IS', 'Fe + Su → FeSu'], answer: 0, explain: 'Iron (Fe) and sulphur (S) react to form iron(II) sulphide (FeS).' },
    { lesson: L4, type: 'match', q: '<b>Heating</b> iron and sulphur: match each row of the book’s table with its entry.', pairs: [['Reversibility', 'cannot be reversed by physical methods'], ['Composition', 'a fixed composition'], ['New substance formed?', 'yes: iron(II) sulphide'], ['Heat change', 'heat is given out']], explain: 'Heating iron and sulphur is a chemical change: a new substance with a fixed composition is formed and heat is given out.' },

    /* ---- ch2-5 · Classifying changes, states, fractional distillation ---- */
    { lesson: L5, type: 'mcq', q: 'The change from a solid directly into a gas is called…', options: ['sublimation', 'deposition', 'condensation', 'melting'], answer: 0, explain: 'Solid → gas is sublimation (heat absorbed). The reverse, gas → solid, is deposition.' },
    { lesson: L5, type: 'mcq', q: 'The change from a gas directly into a solid is called…', options: ['deposition', 'sublimation', 'freezing', 'condensation'], answer: 0, explain: 'Gas → solid is deposition (heat given out).' },
    { lesson: L5, type: 'multi', q: 'In which of these changes of state is heat <b>absorbed</b>?', options: ['melting', 'boiling', 'sublimation', 'freezing', 'condensation', 'deposition'], answer: [0, 1, 2], explain: 'Melting, boiling and sublimation absorb heat; freezing, condensation and deposition give out heat.' },
    { lesson: L5, type: 'match', q: 'Match each change of state with what happens.', pairs: [['melting', 'solid → liquid'], ['freezing', 'liquid → solid'], ['boiling', 'liquid → gas'], ['condensation', 'gas → liquid'], ['sublimation', 'solid → gas']], explain: 'These are all changes of physical state, so they are physical changes.' },
    { lesson: L5, type: 'fill', q: 'The change of state from a gas to a liquid is called ___.', answer: ['condensation'], explain: 'Gas → liquid is condensation; heat is given out.' },
    { lesson: L5, type: 'tf', q: 'Car rusting is a physical change because only the colour of the car changes.', answer: false, explain: 'Car rusting is a chemical change: a new substance (rust) is formed.' },
    { lesson: L5, type: 'mcq', q: 'Why is dissolving sugar in water a physical change?', options: ['No new substance is formed; the sugar can be got back by evaporating the water.', 'The sugar disappears, so it is destroyed.', 'A new substance, sugar solution, is formed.', 'Heat is always given out.'], answer: 0, explain: 'Dissolving forms a mixture of sugar and water. No new substance is formed.' },
    { lesson: L5, type: 'mcq', q: 'Alcohol goes sour. This is a chemical change because…', options: ['a new (sour) substance is formed.', 'it changes state.', 'it can be easily reversed.', 'only the smell changes.'], answer: 0, explain: 'A new substance with a sour taste is formed, so it is a chemical change.' },
    { lesson: L5, type: 'tf', q: 'Fractional distillation of petroleum is a chemical change.', answer: false, explain: 'It only involves vaporisation and condensation. No new substance is formed; the fractions were already in the crude oil.' },
    { lesson: L5, type: 'tf', q: 'Combustion of petrol in a car engine forms new substances such as carbon dioxide and water, and gives out heat.', answer: true, explain: 'Burning petrol is a chemical change: new substances are formed and heat is given out.' },
    { lesson: L5, type: 'multi', q: 'Which of the following are <b>chemical</b> changes?', options: ['Car rusting', 'Combustion of petrol in a car engine', 'Alcohol goes sour', 'Boiling water turning into steam', 'Dissolving sugar in water', 'Fractional distillation of petroleum'], answer: [0, 1, 2], explain: 'Rusting, burning petrol and alcohol going sour form new substances. The other three form no new substance.' },
    { lesson: L5, type: 'mcq', q: 'Boiling water turning into steam is a physical change. Which explanation is best?', options: ['No new substance is formed and the change is easily reversed.', 'Bubbles are formed, so a new gas is made.', 'Heat is absorbed, so it cannot be reversed.', 'Steam is a different substance from water.'], answer: 0, explain: 'Steam is still water; it condenses back to water easily.' },
    { lesson: L5, type: 'mcq', q: 'In the fractional distillation tower, which fraction has the lowest boiling range and comes out at the very top?', options: ['Liquefied petroleum gas', 'Bitumen', 'Diesel', 'Fuel oil'], answer: 0, explain: 'Liquefied petroleum gas boils below 25 °C, so it comes out at the top. Bitumen (above 350 °C) comes out at the bottom.' },
    { lesson: L5, type: 'match', q: 'Match each oil fraction with its use.', pairs: [['Petrol', 'fuel for cars'], ['Paraffin', 'fuel for aeroplanes'], ['Diesel', 'fuel for lorries'], ['Fuel oil', 'fuel for ships'], ['Bitumen', 'making roads']], explain: 'These uses are shown in the fractional distillation tower in the book.' },
    { lesson: L5, type: 'fill', q: 'Bitumen comes out at the ___ of the fractional distillation tower.', answer: ['bottom', 'base'], explain: 'Bitumen has the highest boiling range (above 350 °C), so it is collected at the bottom.' },
    { lesson: L5, type: 'mcq', q: 'Which fraction is used as a raw material for making chemicals?', options: ['Naphtha', 'Diesel', 'Lubricating oil', 'Bitumen'], answer: 0, explain: 'Naphtha (60–180 °C) is a raw material for making chemicals.' },
    { lesson: L5, type: 'mcq', q: 'Fraction X has a boiling range of 220–250 °C. What is X?', options: ['Diesel', 'Petrol', 'Paraffin', 'Fuel oil'], answer: 0, explain: 'Diesel boils at 220–250 °C. Paraffin is 180–220 °C and fuel oil 250–300 °C.' },
    { lesson: L5, type: 'mcq', q: 'The diagram shows two kinds of particle after they are mixed. What kind of change is this?', fig: figMixed, options: ['Physical change: no new substance is formed.', 'Chemical change: new particles are formed.', 'Chemical change: the particles are chemically combined.', 'Physical change: a new substance is formed.'], answer: 0, explain: 'In mixing, the particles just spread among each other. No new substance is formed.' },
    { lesson: L5, type: 'tf', q: 'In the fractional distillation tower, fractions with lower boiling points are collected higher up the tower.', answer: true, explain: 'e.g. liquefied petroleum gas (below 25 °C) comes out at the top and bitumen (above 350 °C) at the bottom.' },

    /* ---- ch2-6 · Electrolysis of water ---- */
    { lesson: L6, type: 'mcq', q: 'What is electrolysis?', options: ['The decomposition (breaking down) of a substance by electricity', 'The mixing of substances using electricity', 'The boiling of water using electricity', 'The joining of two elements using heat'], answer: 0, explain: 'Electrolysis is the decomposition of a substance by electricity.' },
    { lesson: L6, type: 'mcq', q: 'In the electrolysis of water, the volume of gas at the negative pole : the volume of gas at the positive pole is…', options: ['2 : 1', '1 : 1', '1 : 2', '3 : 1'], answer: 0, explain: 'e.g. 20 cm³ of hydrogen at the negative pole and 10 cm³ of oxygen at the positive pole.' },
    { lesson: L6, type: 'mcq', q: 'Which gas is collected at the <b>negative</b> pole in the electrolysis of water?', options: ['Hydrogen', 'Oxygen', 'Carbon dioxide', 'Steam'], answer: 0, explain: 'Hydrogen collects at the negative pole (twice the volume); oxygen at the positive pole.' },
    { lesson: L6, type: 'match', q: 'Match each item about Experiment 2.3.', pairs: [['Gas at the negative pole', 'hydrogen'], ['Gas at the positive pole', 'oxygen'], ['Test for hydrogen', 'burning splint: ‘pop’ sound'], ['Test for oxygen', 'glowing splint relights']], explain: 'Hydrogen burns with a ‘pop’ sound; oxygen relights a glowing splint.' },
    { lesson: L6, type: 'fill', q: 'Oxygen is tested with a ___ splint, which relights.', answer: ['glowing'], explain: 'A glowing splint relights in oxygen.' },
    { lesson: L6, type: 'fill', q: 'When tested with a burning splint, hydrogen burns with a ‘___’ sound.', answer: ['pop'], explain: 'Hydrogen burns with a ‘pop’ sound.' },
    { lesson: L6, type: 'tf', q: 'Water is an element because it is a pure substance.', answer: false, explain: 'Water can be broken down into simpler substances (hydrogen and oxygen) by electrolysis, so it is not an element. It is a compound.' },
    { lesson: L6, type: 'tf', q: 'The properties of water are different from those of hydrogen and oxygen.', answer: true, explain: 'The properties of a compound are different from those of its constituent elements.' },
    { lesson: L6, type: 'mcq', q: 'Why is water a compound?', options: ['It is a pure substance made up of hydrogen and oxygen chemically combined.', 'It is a mixture of hydrogen and oxygen.', 'It contains only one kind of atom.', 'It is a liquid at room conditions.'], answer: 0, explain: 'A compound is a pure substance made up of two or more elements chemically combined.' },
    { lesson: L6, type: 'mcq', q: 'Which is the balanced chemical equation for the electrolysis of water?', options: [EQ('2H2O -> 2H2 + O2'), EQ('H2O -> H2 + O2'), EQ('H2O -> 2H2 + O2'), EQ('2H2O -> H2 + 2O2')], answer: 0, explain: 'Left: 4 H and 2 O atoms. Right: 2H₂ has 4 H atoms and O₂ has 2 O atoms. Balanced!' },
    { lesson: L6, type: 'multi', q: 'Which statements about the electrolysis of water are correct?', options: ['Colourless gas bubbles are formed at both electrodes.', 'Water is decomposed into hydrogen and oxygen.', 'The volume of gas at the negative pole is twice that at the positive pole.', 'Oxygen is collected at the negative pole.', 'It is a physical change.'], answer: [0, 1, 2], explain: 'Hydrogen (negative pole) and oxygen (positive pole) are new substances, so it is a chemical change.' },
    { lesson: L6, type: 'fill', q: 'The volume ratio of hydrogen : oxygen (2 : 1) is the same as the ratio of the number of ___ of hydrogen : oxygen in the balanced equation.', answer: ['molecules', 'molecule', 'particles'], explain: '2H₂O → 2H₂ + O₂: 2 hydrogen molecules to 1 oxygen molecule.' },
    { lesson: L6, type: 'mcq', q: 'The box shows the products from the electrolysis of 2 water molecules (● hydrogen atom, ○ oxygen atom). What is the ratio of hydrogen molecules : oxygen molecules?', fig: figProducts, options: ['2 : 1', '1 : 2', '4 : 1', '1 : 1'], answer: 0, explain: '2 hydrogen molecules and 1 oxygen molecule: 2 : 1 in the simplest whole-number ratio.' },
    { lesson: L6, type: 'tf', q: 'In Experiment 2.3, the power supply is adjusted to 0 V before it is turned off.', answer: true, explain: 'After 5 minutes, adjust the power supply to 0 V and then turn it off.' },
    { lesson: L6, type: 'fill', q: 'Word equation for the electrolysis of water: water → hydrogen + ___', answer: ['oxygen', 'oxygen gas'], explain: 'Water is decomposed into hydrogen and oxygen.' },
    { lesson: L6, type: 'fill', q: 'In Experiment 2.3, the two plastic tubes are clipped to prevent the ___ of gas.', answer: ['leakage', 'leaking', 'leak', 'escape', 'escaping'], explain: 'Procedure step 3: clip the two plastic tubes with clips to prevent the leakage of gas.' },
    { lesson: L6, type: 'fill', q: 'Electrolysis is the ___ (breaking down) of a substance by electricity.', answer: ['decomposition'], explain: 'Book answer: electrolysis is the decomposition (breaking down) of a substance by electricity.' },

    /* ---- ch2-7 · Chemical equations: parts, state symbols, coefficients & subscripts ---- */
    { lesson: L7, type: 'match', q: 'Match each state symbol with its meaning.', pairs: [['(s)', 'solid'], ['(l)', 'liquid'], ['(g)', 'gas'], ['(aq)', 'aqueous solution']], explain: 'State symbols show the physical states of the substances in an equation.' },
    { lesson: L7, type: 'mcq', q: 'In a chemical equation, a double arrow (⇌) represents…', options: ['a reversible reaction', 'an irreversible reaction', 'a balanced equation', 'heat given out'], answer: 0, explain: 'A single arrow (→) means irreversible; a double arrow (⇌) means reversible.' },
    { lesson: L7, type: 'tf', q: 'In ' + EQ('2H2O(l) -> 2H2(g) + O2(g)') + ', hydrogen and oxygen are the reactants.', answer: false, explain: 'Hydrogen and oxygen are on the right of the arrow, so they are the products. Water is the reactant.' },
    { lesson: L7, type: 'mcq', q: 'How many atoms are there altogether in 2NO?', options: ['2 N atoms and 2 O atoms', '1 N atom and 2 O atoms', '2 N atoms and 1 O atom', '1 N atom and 1 O atom'], answer: 0, explain: '2NO means two NO molecules, each with 1 N and 1 O. The coefficient applies to all atoms.' },
    { lesson: L7, type: 'mcq', q: 'How many atoms are there in one NO<sub>2</sub> molecule?', options: ['1 N atom and 2 O atoms', '2 N atoms and 2 O atoms', '2 N atoms and 1 O atom', '1 N atom and 1 O atom'], answer: 0, explain: 'The subscript 2 applies ONLY to the O atom just before it.' },
    { lesson: L7, type: 'tf', q: '“2NO<sub>2</sub>” is the chemical formula of a compound formed between nitrogen and oxygen.', answer: false, explain: 'The 2 in front is a stoichiometric coefficient meaning two NO₂ molecules. The formula is NO₂.' },
    { lesson: L7, type: 'fill', q: 'Chemical equations must be balanced because atoms cannot be created or ___ in a reaction.', answer: ['destroyed'], explain: 'Atoms only rearrange (regroup) to form new substances.' },
    { lesson: L7, type: 'fill', q: 'Stoichiometric coefficients represent the simplest ___ ratio of particles involved in the reaction.', answer: ['whole-number', 'whole number', 'whole'], explain: 'e.g. 2 : 2 : 1 in 2H₂O → 2H₂ + O₂.' },
    { lesson: L7, type: 'mcq', q: 'Which formula does this particle diagram show? (● nitrogen atom, ○ oxygen atom)', fig: figNO2x, options: ['2NO', 'N<sub>2</sub>O<sub>2</sub>', 'NO<sub>2</sub>', 'N<sub>2</sub>O'], answer: 0, explain: 'There are two separate molecules, each with 1 N and 1 O: 2NO.' },
    { lesson: L7, type: 'mcq', q: 'Which formula does this particle diagram show? (● nitrogen atom, ○ oxygen atom)', fig: figN2O2, options: ['N<sub>2</sub>O<sub>2</sub>', '2NO', 'NO<sub>2</sub>', '2N<sub>2</sub>O'], answer: 0, explain: 'One molecule with 2 N atoms and 2 O atoms: N₂O₂. It is not the same as 2NO (two molecules).' },
    { lesson: L7, type: 'mcq', q: 'The box contains molecules of one compound (● nitrogen atom, ○ oxygen atom). Which is correct?', fig: figN2O, options: ['It shows 2N<sub>2</sub>O.', 'It shows 2NO<sub>2</sub>.', 'It shows N<sub>4</sub>O<sub>2</sub>.', 'It shows 4NO.'], answer: 0, explain: 'Each molecule has 2 N and 1 O (N₂O), and there are two of them: 2N₂O.' },
    { lesson: L7, type: 'multi', q: 'Which statements about 2NO are correct?', options: ['It means two NO molecules.', 'It contains 2 N atoms and 2 O atoms altogether.', 'It is the same compound as N<sub>2</sub>O<sub>2</sub>.', 'The 2 is a subscript.'], answer: [0, 1], explain: 'The 2 in front is a coefficient. 2NO is two NO molecules, which is different from one N₂O₂ molecule.' },
    { lesson: L7, type: 'mcq', q: 'How many hydrogen atoms are there in 3H<sub>2</sub>O?', options: ['2', '3', '5', '6'], answer: 3, noShuffle: true, explain: '3 molecules × 2 H atoms each = 6 H atoms (and 3 O atoms).' },
    { lesson: L7, type: 'fill', q: 'How many oxygen atoms are there in Pb(NO<sub>3</sub>)<sub>2</sub>? Type a number: ___', answer: ['6', 'six'], explain: 'The subscript 2 after the bracket applies to everything inside: 2 × 3 = 6 O atoms (and 2 N atoms, 1 Pb atom).' },
    { lesson: L7, type: 'tf', q: 'When balancing an equation, you may change the subscripts in a formula.', answer: false, explain: 'Only add coefficients in front of formulae. Changing a subscript would change the substance.' },
    { lesson: L7, type: 'mcq', q: 'Reactants and products in a chemical equation are written…', options: ['in complete formulae, including the subscripts', 'as names only', 'without subscripts', 'as single atoms only'], answer: 0, explain: 'Reactants and products are written in complete formulae (including the subscripts).' },
    { lesson: L7, type: 'fill', q: 'In a chemical equation, a single arrow (→) represents an ___ reaction.', answer: ['irreversible'], explain: 'A single arrow (→) means an irreversible reaction; a double arrow (⇌) means a reversible reaction.' },

    /* ---- ch2-8 · Balancing chemical equations ---- */
    { lesson: L8, type: 'mcq', q: 'Aluminium reacts with steam to form aluminium oxide and hydrogen. Which equation is correctly balanced in the simplest whole-number ratio?', options: [EQ('2Al(s) + 3H2O(g) -> Al2O3(s) + 3H2(g)'), EQ('Al(s) + H2O(g) -> Al2O3(s) + H2(g)'), EQ('4Al(s) + 6H2O(g) -> 2Al2O3(s) + 6H2(g)'), EQ('2Al(s) + 3H2O(g) -> Al2O3(s) + H2(g)')], answer: 0, explain: '2 Al, 6 H and 3 O on each side. The 4 : 6 : 2 : 6 version is balanced but not in the simplest ratio.' },
    { lesson: L8, type: 'mcq', q: 'Methane (CH<sub>4</sub>) burns in oxygen (O<sub>2</sub>) to give carbon dioxide and water. Which is the correctly balanced chemical equation?', options: [EQ('CH4 + 2O2 -> CO2 + 2H2O'), EQ('CH4 + O2 -> CO2 + H2O'), EQ('CH4 + 2O2 -> CO2 + H2O'), EQ('CH4 + O4 -> CO2 + 2H2O')], answer: 0, explain: '1 C, 4 H and 4 O on each side. Never change O₂ into O₄; only change coefficients.' },
    { lesson: L8, type: 'fill', q: 'Balance: 2Na + Cl<sub>2</sub> → ___NaCl (type the coefficient)', answer: ['2', 'two'], explain: '2 Na and 2 Cl on each side: 2Na + Cl₂ → 2NaCl.' },
    { lesson: L8, type: 'fill', q: 'Balance: H<sub>2</sub> + Cl<sub>2</sub> → ___HCl (type the coefficient)', answer: ['2', 'two'], explain: '2 H and 2 Cl on each side: H₂ + Cl₂ → 2HCl.' },
    { lesson: L8, type: 'mcq', q: 'Which balanced equation shows the formation of glucose from carbon, hydrogen and oxygen?', options: [EQ('6C + 6H2 + 3O2 -> C6H12O6'), EQ('C + H2 + O2 -> C6H12O6'), EQ('6C + 6H2 + 6O2 -> C6H12O6'), EQ('6C + 12H2 + 3O2 -> C6H12O6')], answer: 0, explain: '6 C, 12 H (6 × 2) and 6 O (3 × 2) on each side.' },
    { lesson: L8, type: 'tf', q: EQ('C + O2 -> CO2') + ' is already balanced.', answer: true, explain: '1 C and 2 O atoms on each side, so all coefficients are 1.' },
    { lesson: L8, type: 'mcq', q: 'Complete the state symbol: Na<sub>2</sub>SO<sub>4</sub>(aq) + Pb(NO<sub>3</sub>)<sub>2</sub>(aq) → 2NaNO<sub>3</sub>(aq) + PbSO<sub>4</sub>( ? )', options: ['(s)', '(l)', '(g)', '(aq)'], answer: 0, explain: 'Lead(II) sulphate is formed as a solid, so its state symbol is (s).' },
    { lesson: L8, type: 'mcq', q: 'In Na<sub>2</sub>SO<sub>4</sub> + Pb(NO<sub>3</sub>)<sub>2</sub> → <b>?</b>NaNO<sub>3</sub> + PbSO<sub>4</sub>, what is the missing coefficient?', options: ['1', '2', '3', '4'], answer: 1, noShuffle: true, explain: 'There are 2 Na and 2 NO₃ groups on the left, so 2NaNO₃ is needed on the right.' },
    { lesson: L8, type: 'match', q: 'Match each word equation with its product(s).', pairs: [['carbon + oxygen →', 'carbon dioxide'], ['sodium + chlorine →', 'sodium chloride'], ['hydrogen + chlorine →', 'hydrogen chloride'], ['methane + oxygen →', 'carbon dioxide + water']], explain: 'These are the classwork reactions from the book.' },
    { lesson: L8, type: 'mcq', q: 'What is the <b>first</b> step in writing a balanced chemical equation?', options: ['Write the word equation.', 'Balance the atoms.', 'Change the subscripts.', 'Add the state symbols.'], answer: 0, explain: 'Step 1: word equation. Step 2: formulae with state symbols. Step 3: balance.' },
    { lesson: L8, type: 'tf', q: EQ('4Na + 2Cl2 -> 4NaCl') + ' is balanced and in the simplest whole-number ratio.', answer: false, explain: 'It is balanced, but every coefficient can be divided by 2: 2Na + Cl₂ → 2NaCl.' },
    { lesson: L8, type: 'multi', q: 'Which of these equations are balanced?', options: [EQ('C + O2 -> CO2'), EQ('H2 + Cl2 -> 2HCl'), EQ('CH4 + O2 -> CO2 + 2H2O'), EQ('2Na + Cl2 -> NaCl')], answer: [0, 1], explain: 'Count each type of atom on both sides. CH₄ + O₂ needs 2O₂; 2Na + Cl₂ needs 2NaCl.' },
    { lesson: L8, type: 'fill', q: 'Word equation: aluminium + steam → aluminium oxide + ___', answer: ['hydrogen', 'hydrogen gas'], explain: 'Aluminium reacts with steam to form aluminium oxide and hydrogen gas.' },
    { lesson: L8, type: 'fill', q: 'In step 2, the chemical formulae are written with state ___ (if necessary).', answer: ['symbols', 'symbol'], explain: 'e.g. Al(s) + H₂O(g) → Al₂O₃(s) + H₂(g).' },
    { lesson: L8, type: 'multi', q: 'Which equations are balanced but <b>not</b> in the simplest whole-number ratio?', options: [EQ('4Al + 6H2O -> 2Al2O3 + 6H2'), EQ('2H2 + 2Cl2 -> 4HCl'), EQ('2Na + Cl2 -> 2NaCl'), EQ('CH4 + 2O2 -> CO2 + 2H2O'), EQ('4H2O -> 4H2 + 2O2')], answer: [0, 1, 4], explain: 'Those three are balanced, but all their coefficients can be divided by 2 (e.g. 2Al + 3H₂O → Al₂O₃ + 3H₂). 2Na + Cl₂ → 2NaCl and CH₄ + 2O₂ → CO₂ + 2H₂O are already in the simplest ratio.' }
  ];

  const glossary = [
    { en: 'Physical change', zh: '物理變化', def: 'A change in which no new substance is formed, e.g. mixing, changes of physical state.' },
    { en: 'Chemical change (chemical reaction)', zh: '化學變化（化學反應）', def: 'A change in which one or more new substances are formed.' },
    { en: 'Reactant', zh: '反應物', def: 'A substance that reacts; written on the left of the arrow.' },
    { en: 'Product', zh: '生成物', def: 'A new substance formed in a reaction; written on the right of the arrow.' },
    { en: 'Iron(II) sulphide', zh: '硫化亞鐵', def: 'FeS, the black solid formed when iron and sulphur are heated together.' },
    { en: 'Melting', zh: '熔化', def: 'Solid → liquid (heat absorbed).' },
    { en: 'Freezing', zh: '凝固', def: 'Liquid → solid (heat given out).' },
    { en: 'Boiling', zh: '沸騰', def: 'Liquid → gas (heat absorbed).' },
    { en: 'Condensation', zh: '凝結', def: 'Gas → liquid (heat given out).' },
    { en: 'Sublimation', zh: '昇華', def: 'Solid → gas directly (heat absorbed).' },
    { en: 'Deposition', zh: '凝華', def: 'Gas → solid directly (heat given out).' },
    { en: 'Fractional distillation', zh: '分餾', def: 'Separating petroleum (crude oil) into purer oil fractions by vaporisation and condensation. A physical change.' },
    { en: 'Oil fraction', zh: '餾分', def: 'A part of crude oil with a certain boiling range, e.g. petrol (25–60 °C), diesel (220–250 °C).' },
    { en: 'Electrolysis', zh: '電解', def: 'The decomposition (breaking down) of a substance by electricity.' },
    { en: 'Decomposition', zh: '分解', def: 'Breaking down a substance into simpler substances, e.g. water → hydrogen + oxygen by electrolysis.' },
    { en: 'Burning splint test', zh: '燃着的木條測試', def: 'Test for hydrogen: the gas burns with a ‘pop’ sound.' },
    { en: 'Glowing splint test', zh: '餘燼木條測試', def: 'Test for oxygen: the glowing splint relights.' },
    { en: 'Word equation', zh: '文字方程式', def: 'An equation written with the names of the substances, e.g. iron + sulphur → iron(II) sulphide.' },
    { en: 'Chemical equation', zh: '化學方程式', def: 'An equation written with chemical formulae, e.g. Fe + S → FeS.' },
    { en: 'State symbols', zh: '物態符號', def: '(s) solid, (l) liquid, (g) gas, (aq) aqueous solution.' },
    { en: 'Irreversible reaction', zh: '不可逆反應', def: 'Shown by a single arrow (→).' },
    { en: 'Reversible reaction', zh: '可逆反應', def: 'Shown by a double arrow (⇌).' },
    { en: 'Stoichiometric coefficient', zh: '化學計量係數', def: 'A number put before a chemical formula to balance an equation. It applies to all atoms in the species and gives the simplest whole-number ratio of particles.' },
    { en: 'Subscript', zh: '下標', def: 'The small number in a formula; it applies only to the atom just before it (NO<sub>2</sub>: 1 N, 2 O).' },
    { en: 'Balanced equation', zh: '平衡方程式', def: 'The numbers of all types of atoms are the same on both sides of the chemical equation.' },
    { en: 'Stoichiometry', zh: '化學計量', def: 'Balancing chemical equations: the coefficients show the simplest whole-number ratio of the particles involved.' }
  ];

  const lessons = [
    { id: 'ch2-4', num: '2.2', kicker: 'Experiment 2.2', title: 'Physical and Chemical Changes', short: 'Mix vs heat', zh: '物理變化與化學變化', render: renderL4 },
    { id: 'ch2-5', num: '2.2', kicker: 'Classwork', title: 'Classifying Changes', short: 'Classify changes', zh: '變化的分類', render: renderL5 },
    { id: 'ch2-6', num: '2.3', kicker: 'Experiment 2.3', title: 'Electrolysis of Water', short: 'Electrolysis', zh: '水的電解', render: renderL6 },
    { id: 'ch2-7', num: '2.3', kicker: 'Writing chemical equations', title: 'Chemical Equations', short: 'Equations', zh: '化學方程式', render: renderL7 },
    { id: 'ch2-8', num: '2.3', kicker: 'Stoichiometry', title: 'Balancing Chemical Equations', short: 'Balancing', zh: '平衡化學方程式', render: renderL8 }
  ];

  // Part B appends to Chapter 2 (Part A, js/ch2.js, registers it first). The metadata
  // below is only used if Part A failed to load, so the lessons still appear.
  A.registerChapter({
    id: 'ch2', num: 2, part: 'b', title: 'Compounds & Mixtures', zh: '化合物與混合物', icon: '⚗️', accent: 'c2',
    intro: 'Elements, compounds or mixtures? Physical vs chemical changes, and balancing chemical equations.',
    lessons, questions: questions.map((q, i) => subQ(Object.assign({ id: 'ch2-b-q' + (i + 1) }, q))), glossary
  });
})();
