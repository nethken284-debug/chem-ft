/* ==========================================================
   Chem FT — Chapter 1 · Elements 元素
   Lessons 1.1–1.4 (book pp.1–9), games, question bank, glossary.
   Only this file belongs to Chapter 1; styles are injected once
   as <style id="style-ch1"> and every class is prefixed .c1-
   ========================================================== */
(function () {
  'use strict';
  const A = window.ChemApp;
  const { h, MOL } = A;
  const F = A.chem;
  const T = A.term;
  const REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  let uidN = 0;
  const uid = p => 'c1' + p + (++uidN);
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

  /* =========================================================
     Styles
     ========================================================= */
  const CSS = `
:root{
  --c1x-me:color-mix(in srgb,var(--brand) 22%,var(--surface));
  --c1x-nm:color-mix(in srgb,var(--c0) 26%,var(--surface));
  --c1x-se:color-mix(in srgb,var(--cx) 34%,var(--surface));
  --c1x-s:color-mix(in srgb,var(--c1) 24%,var(--surface));
  --c1x-l:color-mix(in srgb,var(--c2) 30%,var(--surface));
  --c1x-g:color-mix(in srgb,var(--atom-N) 28%,var(--surface));
}
.c1-svg{width:100%;height:auto;display:block;margin:0 auto}
.c1-t{fill:var(--ink);font-family:var(--font);font-weight:800;font-size:13px}
.c1-t2{fill:var(--ink-2);font-family:var(--font);font-weight:700;font-size:13px}
.c1-mid{text-anchor:middle}
.c1-pbox{width:100%;height:auto;margin:0 auto}
.c1-row{display:flex;flex-wrap:wrap;gap:10px;align-items:center}
.c1-center{display:flex;justify-content:center}
.c1-gap{margin-top:14px}
.c1-label{display:block;font-size:12px;font-weight:900;letter-spacing:.07em;text-transform:uppercase;color:var(--ink-3);margin-bottom:6px}
.c1-seg{display:flex;flex-wrap:wrap;gap:8px}
.c1-field{margin-top:12px}
.c1-big{font-size:22px;font-weight:900;line-height:1.2}
.c1-prompt{font-size:19px;font-weight:800;text-align:center;margin:4px 0 12px}
.c1-prompt b{color:var(--accent)}
.c1-note-sm{font-size:14px;color:var(--ink-2)}
.c1-swipe{display:none;font-size:13px;color:var(--ink-3);font-weight:700;margin:6px 0 0}
@media(max-width:760px){.c1-swipe{display:block}}
.c1-done{text-align:center;padding:8px 0}
.c1-done .c1-emoji{font-size:44px;line-height:1.2}

/* figures grid */
.c1-mini{display:grid;grid-template-columns:repeat(auto-fit,minmax(96px,1fr));gap:14px;margin-top:10px}
.c1-mini figure,.c1-fig{margin:0;display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center}
.c1-mini figcaption,.c1-fig figcaption{font-size:14px;font-weight:800;line-height:1.35}
.c1-mini figcaption small{display:block;font-weight:600;color:var(--ink-2);font-size:13px}
.c1-mini .c1-pbox{max-width:150px}

/* states simulator */
.c1-simwrap{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:20px;align-items:start}
@media(max-width:720px){.c1-simwrap{grid-template-columns:1fr;gap:14px}}
.c1-sim{max-width:420px}
.c1-sim .atom,.c1-build .atom,.c1-stage .atom{stroke:var(--atom-stroke);stroke-width:1.4}
.c1-range{width:100%;accent-color:var(--accent);height:34px;margin:2px 0 0;cursor:pointer}
.c1-rangelab{display:flex;justify-content:space-between;font-size:13px;font-weight:800;color:var(--ink-3)}
.c1-readout{display:grid;gap:10px;margin-top:12px}
.c1-readout>div{background:var(--bg-soft);border-radius:var(--radius-sm);padding:10px 14px}
.c1-readout>div>b{display:block;font-size:18px;font-weight:900}
.c1-readout p{margin:2px 0 0;font-size:15px;color:var(--ink-2)}

/* classwork explain */
.c1-cw{display:grid;grid-template-columns:170px minmax(0,1fr);gap:18px;align-items:start}
.c1-cw+.c1-cw{margin-top:18px;padding-top:18px;border-top:1px solid var(--line)}
@media(max-width:600px){.c1-cw{grid-template-columns:1fr}}
.c1-cw .c1-pbox{max-width:170px}

/* periodic table */
.c1-pt-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch;padding:4px 2px 6px;margin:0 -2px}
.c1-pt{display:grid;grid-template-columns:repeat(18,minmax(0,1fr));gap:3px;min-width:780px}
@media(min-width:761px){.c1-pt{min-width:0}}
.c1-cell{aspect-ratio:1/1.12}
.c1-ghost{border:1px dashed var(--line-2);border-radius:6px;opacity:.55}
.c1-tile{position:relative;aspect-ratio:1/1.12;min-height:36px;border-radius:7px;border:1.5px solid var(--line-2);background:var(--surface);cursor:pointer;padding:0;display:flex;align-items:center;justify-content:center;color:var(--ink);font:inherit;line-height:1;transition:transform .12s,background .25s,border-color .2s;-webkit-tap-highlight-color:transparent}
.c1-tile .z{position:absolute;top:2px;left:3px;font-size:8.5px;font-weight:700;color:var(--ink-3)}
.c1-tile .sy{font-size:15px;font-weight:900}
.c1-tile:hover{border-color:var(--accent);transform:translateY(-1px)}
.c1-tile.sel{border-color:var(--accent);box-shadow:0 0 0 2px var(--accent)}
.c1-tile.extra{border-style:dashed}
.c1-tile.found{background:var(--good-soft)!important;border-color:var(--good)}
.c1-tile.found .sy::after{content:"✓";font-size:9px;color:var(--good);margin-left:1px}
.c1-tile.flip{animation:c1flip .45s ease}
.c1-pt.by-state .st-s,.c1-tag.st-s,.c1-key.st-s{background:var(--c1x-s)}
.c1-pt.by-state .st-l,.c1-tag.st-l,.c1-key.st-l{background:var(--c1x-l)}
.c1-pt.by-state .st-g,.c1-tag.st-g,.c1-key.st-g{background:var(--c1x-g)}
.c1-pt.by-class .cl-me,.c1-tag.cl-me,.c1-key.cl-me{background:var(--c1x-me)}
.c1-pt.by-class .cl-nm,.c1-tag.cl-nm,.c1-key.cl-nm{background:var(--c1x-nm)}
.c1-pt.by-class .cl-se,.c1-tag.cl-se,.c1-key.cl-se{background:var(--c1x-se)}
@keyframes c1flip{0%{transform:rotateY(0)}50%{transform:rotateY(90deg) scale(1.15)}100%{transform:rotateY(0)}}
.c1-legend{display:flex;flex-wrap:wrap;gap:8px 16px;margin:10px 0 2px;font-size:14px;font-weight:700}
.c1-legend span{display:inline-flex;align-items:center;gap:6px}
.c1-key{width:18px;height:18px;border-radius:5px;border:1px solid var(--line-2);display:inline-block}
.c1-info{display:flex;gap:16px;align-items:center;margin-top:12px;padding:14px;border-radius:var(--radius-sm);background:var(--bg-soft);min-height:118px}
.c1-info.empty{justify-content:center;color:var(--ink-3);font-weight:700;text-align:center}
.c1-bigtile{width:84px;height:94px;flex:none;border-radius:12px;border:2px solid var(--accent);background:var(--surface);display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative}
.c1-bigtile .z{position:absolute;top:5px;left:8px;font-size:12px;font-weight:800;color:var(--ink-3)}
.c1-bigtile .sy{font-size:34px;font-weight:900;line-height:1}
.c1-bigtile .nm{font-size:11px;font-weight:800;color:var(--ink-2);margin-top:5px}
.c1-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}
.c1-tag{font-size:13px;font-weight:800;padding:3px 10px;border-radius:999px;border:1px solid var(--line-2);background:var(--surface)}
.c1-findbar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;justify-content:space-between;margin:10px 0 8px;padding:10px 14px;border-radius:var(--radius-sm);background:var(--accent-soft)}
.c1-findbar .c1-prompt{margin:0;text-align:left}

/* latin strip */
.c1-latin{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-top:10px}
.c1-latin div{border:1px solid var(--line);border-radius:var(--radius-sm);padding:8px 12px;background:var(--surface-2);font-size:15px}
.c1-latin b.sy{font-size:20px;font-weight:900;margin-right:6px;color:var(--accent)}
.c1-latin u{text-decoration-thickness:2px;text-underline-offset:3px;font-weight:900}

/* choice grids */
.c1-ask{margin-top:14px}
.c1-ask-q{font-weight:800;margin-bottom:10px}
.c1-opts{display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(140px,1fr))}
.c1-opts .q-opt{justify-content:center;text-align:center;font-weight:800}
.c1-sym-opts .q-opt{font-size:24px;font-weight:900;min-height:64px;letter-spacing:.02em}

/* experiment stage */
.c1-stage{background:var(--surface-2);border:1px solid var(--line);border-radius:var(--radius-sm);padding:6px;overflow:hidden}
.c1-stage .c1-svg{max-width:560px}
.c1-picker{margin-bottom:12px}
.c1-picker .chip{gap:8px}
.c1-picker .chip.donechip::after{content:"✓";color:var(--good);font-weight:900}
.c1-swatch{width:14px;height:14px;border-radius:4px;display:inline-block;border:1px solid rgba(0,0,0,.25)}
.c1-steps{display:flex;gap:6px;margin:12px 0 2px}
.c1-step{flex:1;min-width:0;text-align:center;font-size:12px;font-weight:800;color:var(--ink-3);padding:6px 4px;border-radius:10px;background:var(--bg-soft);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.c1-step.now{background:var(--accent);color:#fff}
.c1-step.done{background:var(--good-soft);color:var(--good)}
.c1-actions{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:12px}
.c1-results td,.c1-results th{text-align:center;white-space:nowrap}
.c1-results td:first-child,.c1-results th:first-child{text-align:left}
.c1-results td.fill{color:var(--good);font-weight:800}
.c1-results tr.cur td{background:var(--accent-soft)}
.c1-wire{stroke:var(--ink-2);stroke-width:3;fill:none;stroke-linecap:round;stroke-linejoin:round}
.c1-flow{stroke:#ffc61a;stroke-width:3;fill:none;stroke-dasharray:3 9;stroke-linecap:round;opacity:0;transition:opacity .25s}
.c1-on .c1-flow{opacity:1;animation:c1flow .55s linear infinite}
@keyframes c1flow{to{stroke-dashoffset:-24}}
.c1-glass{fill:var(--surface);stroke:var(--ink-2);stroke-width:2;transition:fill .25s}
.c1-on .c1-glass{fill:#ffe066}
.c1-glow{fill:#ffd23f;opacity:0;transition:opacity .3s}
.c1-on .c1-glow{opacity:.45}
.c1-rays{stroke:#f5b800;stroke-width:3;stroke-linecap:round;opacity:0;transition:opacity .3s}
.c1-on .c1-rays{opacity:1}
.c1-fil{stroke:var(--ink-2);stroke-width:1.6;fill:none}
.c1-on .c1-fil{stroke:#e07b00}
.c1-twinkle{animation:c1tw 1.4s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
@keyframes c1tw{0%,100%{opacity:.15;transform:scale(.6)}50%{opacity:1;transform:scale(1.1)}}
.c1-sticker{font-family:var(--font);font-weight:900;font-size:17px}
.c1-tablecover td.c1-hide{filter:blur(6px);cursor:pointer;user-select:none}
.c1-tablecover td.c1-hide:hover{filter:blur(4px)}

/* suspects (exception hunter) */
.c1-rule{border-radius:var(--radius-sm);padding:12px 16px;background:var(--bg-soft);font-size:17px;font-weight:700;margin-bottom:12px}
.c1-rule small{display:block;font-size:12px;font-weight:900;letter-spacing:.07em;text-transform:uppercase;color:var(--ink-3)}
.c1-suspects{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
@media(max-width:560px){.c1-suspects{grid-template-columns:repeat(2,minmax(0,1fr))}}
.c1-suspect{display:flex;flex-direction:column;align-items:center;gap:2px;padding:12px 6px;border-radius:var(--radius-sm);border:1.5px solid var(--line-2);background:var(--surface);cursor:pointer;font:inherit;color:var(--ink);transition:transform .1s,border-color .15s}
.c1-suspect:hover:not(:disabled){border-color:var(--accent);transform:translateY(-2px)}
.c1-suspect .sy{font-size:26px;font-weight:900;line-height:1.1}
.c1-suspect .nm{font-size:14px;font-weight:700;color:var(--ink-2)}
.c1-suspect.right{border-color:var(--good);background:var(--good-soft)}
.c1-suspect.wrong{border-color:var(--bad);background:var(--bad-soft)}
.c1-suspect:disabled{cursor:default}

/* quick-fire */
.c1-qf-tile{width:132px;height:132px;margin:6px auto 14px;border-radius:20px;border:2.5px solid var(--accent);background:var(--surface);display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:var(--shadow)}
.c1-qf-tile .sy{font-size:52px;font-weight:900;line-height:1}
.c1-qf-tile .nm{font-size:15px;font-weight:800;color:var(--ink-2);margin-top:6px}
.c1-qf-btns{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.c1-qf-btns .btn{padding:12px 6px;min-height:56px;font-size:16px}
.c1-qf-top{display:flex;align-items:center;gap:12px;margin-bottom:8px}
.c1-qf-top .progress{flex:1;margin:0}

/* molecule builder */
.c1-build{max-width:300px;background:var(--surface-2);border:2px solid var(--ink);border-radius:8px}
.c1-tray{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:12px}
.c1-atombtn{width:58px;height:58px;border-radius:50%;border:2px solid var(--atom-stroke);font:inherit;font-weight:900;font-size:18px;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.45);cursor:pointer;box-shadow:var(--shadow);transition:transform .1s}
.c1-atombtn:active{transform:scale(.92)}
.c1-formula{font-size:30px;font-weight:900;text-align:center;min-height:42px;margin-top:8px}
.c1-atomtext{fill:#fff;stroke:rgba(0,0,0,.4);stroke-width:2.5px;paint-order:stroke;font-family:var(--font);font-weight:900;text-anchor:middle;dominant-baseline:central}
.c1-targets{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-bottom:10px}
.c1-targets span{font-size:13px;font-weight:800;padding:3px 10px;border-radius:999px;background:var(--bg-soft);color:var(--ink-3)}
.c1-targets span.now{background:var(--accent);color:#fff}
.c1-targets span.ok{background:var(--good-soft);color:var(--good)}

/* table builder (classwork 1.2) */
.c1-tb-q{display:grid;grid-template-columns:minmax(0,220px) minmax(0,1fr);gap:18px;align-items:start}
@media(max-width:620px){.c1-tb-q{grid-template-columns:1fr}}
.c1-tb-q .c1-pbox{max-width:220px}
.c1-cwtable .c1-pbox{width:84px;max-width:84px;border-width:1.5px}
.c1-cwtable td{vertical-align:middle;white-space:nowrap}
.c1-cwtable td.q{color:var(--ink-3)}
.c1-cwtable td.fill{color:var(--good);font-weight:800}

/* answer builder */
.c1-answer{min-height:64px;border:2px dashed var(--line-2);border-radius:var(--radius-sm);padding:10px;display:flex;flex-wrap:wrap;gap:8px;align-content:flex-start;background:var(--surface-2)}
.c1-answer:empty::before{content:"Tap the pieces below in the right order…";color:var(--ink-3);font-weight:700;font-size:14px;padding:6px}
.c1-pool{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
.c1-pool .chip,.c1-answer .chip{font-size:14px;text-align:left;border-radius:14px;line-height:1.35}
.c1-model{margin-top:12px}

/* compare lab */
.c1-cmp td,.c1-cmp th{text-align:center}
.c1-cmp td:first-child,.c1-cmp th:first-child{text-align:left}
.c1-cmp td.q{color:var(--ink-3)}
.c1-cmp td.fill{font-weight:700}
.c1-toggle.on{background:var(--accent);color:#fff;border-color:transparent}

/* touch targets: small buttons inside chapter games stay >= 42px tall */
.btn.c1-tap{min-height:42px}
.c1-opts.c1-opts3{grid-template-columns:repeat(3,minmax(0,1fr))}
.c1-opts.c1-opts3 .q-opt{padding-left:6px;padding-right:6px}

/* book notation on tiles (me/nm/se, s/l/g) so colour is never the only cue */
.c1-pt.by-state .c1-tile::after,.c1-pt.by-class .c1-tile::after{position:absolute;bottom:1px;right:3px;font-size:8.5px;font-weight:800;color:var(--ink-2)}
.c1-pt.by-state .c1-tile::after{content:attr(data-st)}
.c1-pt.by-class .c1-tile::after{content:attr(data-cl)}

/* learning objectives */
.c1-goals summary{display:flex;align-items:center;gap:10px;flex-wrap:wrap;cursor:pointer;font-weight:800;font-size:17px;list-style:none;min-height:40px}
.c1-goals summary::-webkit-details-marker{display:none}
.c1-goals summary::after{content:"▾";margin-left:auto;color:var(--ink-3);transition:transform .2s}
.c1-goals[open] summary::after{transform:rotate(180deg)}
.c1-goals ol{margin:12px 0 0;padding-left:22px;display:grid;gap:6px}
.c1-goals li a{color:var(--accent);font-weight:800;white-space:nowrap}

/* label the circuit */
.c1-lab-wrap{position:relative;max-width:560px;margin:0 auto}
.c1-mark{position:absolute;transform:translate(-50%,-50%);width:40px;height:40px;border-radius:50%;border:2.5px solid var(--accent);background:var(--surface);color:var(--ink);font:inherit;font-weight:900;font-size:16px;cursor:pointer;box-shadow:var(--shadow);padding:0;transition:transform .12s}
.c1-mark:hover:not(:disabled){transform:translate(-50%,-50%) scale(1.08)}
.c1-mark.ready{animation:c1pulse 1s ease-in-out infinite}
.c1-mark.ok{background:var(--good);border-color:var(--good);color:#fff;cursor:default}
.c1-mark.no{border-color:var(--bad);background:var(--bad-soft)}
@keyframes c1pulse{0%,100%{box-shadow:0 0 0 0 var(--accent-soft)}50%{box-shadow:0 0 0 6px var(--accent-soft)}}
.c1-lab-chips{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:12px}

/* question types (self-directed learning 2) */
.card.note ul.c1-qtypes{display:grid;gap:10px;margin:0;padding:0;list-style:none}
.card.note ul.c1-qtypes li{padding-left:14px}
.card.note ul.c1-qtypes li::before{display:none}
.c1-qtypes li{background:var(--bg-soft);border-radius:var(--radius-sm);padding:10px 14px}
.c1-qtypes li b{display:block}
.c1-qtypes li span{font-size:14px;color:var(--ink-2)}
`;
  function injectStyle() {
    if (document.getElementById('style-ch1')) return;
    const s = document.createElement('style');
    s.id = 'style-ch1';
    s.textContent = CSS;
    document.head.appendChild(s);
  }
  injectStyle();

  /* =========================================================
     Data — the 35 elements of the book's classwork table
     [atomic no., symbol, name, class (me/nm/se), state (s/l/g), period, group]
     ========================================================= */
  const toEl = extra => ([z, sym, name, cls, st, p, gr]) => ({ z, sym, name, cls, st, p, gr, extra });
  const ELS = [
    [1, 'H', 'hydrogen', 'nm', 'g', 1, 1], [2, 'He', 'helium', 'nm', 'g', 1, 18],
    [3, 'Li', 'lithium', 'me', 's', 2, 1], [4, 'Be', 'beryllium', 'me', 's', 2, 2], [5, 'B', 'boron', 'se', 's', 2, 13],
    [6, 'C', 'carbon', 'nm', 's', 2, 14], [7, 'N', 'nitrogen', 'nm', 'g', 2, 15], [8, 'O', 'oxygen', 'nm', 'g', 2, 16],
    [9, 'F', 'fluorine', 'nm', 'g', 2, 17], [10, 'Ne', 'neon', 'nm', 'g', 2, 18],
    [11, 'Na', 'sodium', 'me', 's', 3, 1], [12, 'Mg', 'magnesium', 'me', 's', 3, 2], [13, 'Al', 'aluminium', 'me', 's', 3, 13],
    [14, 'Si', 'silicon', 'se', 's', 3, 14], [15, 'P', 'phosphorus', 'nm', 's', 3, 15], [16, 'S', 'sulphur', 'nm', 's', 3, 16],
    [17, 'Cl', 'chlorine', 'nm', 'g', 3, 17], [18, 'Ar', 'argon', 'nm', 'g', 3, 18],
    [19, 'K', 'potassium', 'me', 's', 4, 1], [20, 'Ca', 'calcium', 'me', 's', 4, 2], [24, 'Cr', 'chromium', 'me', 's', 4, 6],
    [25, 'Mn', 'manganese', 'me', 's', 4, 7], [26, 'Fe', 'iron', 'me', 's', 4, 8], [27, 'Co', 'cobalt', 'me', 's', 4, 9],
    [28, 'Ni', 'nickel', 'me', 's', 4, 10], [29, 'Cu', 'copper', 'me', 's', 4, 11], [30, 'Zn', 'zinc', 'me', 's', 4, 12],
    [35, 'Br', 'bromine', 'nm', 'l', 4, 17],
    [47, 'Ag', 'silver', 'me', 's', 5, 11], [50, 'Sn', 'tin', 'me', 's', 5, 14], [53, 'I', 'iodine', 'nm', 's', 5, 17],
    [78, 'Pt', 'platinum', 'me', 's', 6, 10], [79, 'Au', 'gold', 'me', 's', 6, 11], [80, 'Hg', 'mercury', 'me', 'l', 6, 12],
    [82, 'Pb', 'lead', 'me', 's', 6, 14]
  ].map(toEl(false));
  const EXTRAS = [];
  const ALL = ELS.concat(EXTRAS);
  const bySym = {}; ALL.forEach(e => { bySym[e.sym] = e; });
  const CLS = { me: 'Metal', nm: 'Non-metal', se: 'Semi-metal' };
  const ST = { s: 'Solid', l: 'Liquid', g: 'Gas' };
  const ST_ICON = { s: '🧊', l: '💧', g: '💨' };
  // Latin origins (book p.2) with the letters that make the symbol
  const LATIN = { Na: ['Natrium', [0, 1]], Cu: ['Cuprum', [0, 1]], Ag: ['Argentum', [0, 2]], Au: ['Aurum', [0, 1]], Hg: ['Hydrargyrum', [0, 6]], Pb: ['Plumbum', [0, 4]] };
  const latinHtml = sym => { const [w, idx] = LATIN[sym]; return w.split('').map((c, i) => idx.includes(i) ? '<u>' + c + '</u>' : c).join(''); };

  /* =========================================================
     Small helpers
     ========================================================= */
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem('chemft-c1-' + k)); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem('chemft-c1-' + k, JSON.stringify(v)); } catch (e) { /* storage blocked */ } }
  };
  function svg(w, hh, label, cls) {
    return h('svg', { viewBox: '0 0 ' + w + ' ' + hh, width: w, height: hh, class: cls || 'c1-svg', role: 'img', 'aria-label': label });
  }
  function txt(x, y, s, cls, extra) {
    const a = Object.assign({ x, y, class: cls || 'c1-t' }, extra || {});
    if (a['font-size']) { a.style = Object.assign({ fontSize: a['font-size'] + 'px' }, a.style || {}); delete a['font-size']; } // beat the class rule
    return h('text', a, s);
  }
  function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); }
  function btn(label, onClick, cls) { cls = cls || ''; return h('button', { type: 'button', class: 'btn ' + cls + (/btn-sm/.test(cls) ? ' c1-tap' : ''), html: label, on: { click: onClick } }); }
  function shakeEl(el) { el.classList.remove('shake'); void el.getBoundingClientRect(); el.classList.add('shake'); }
  // animation helper (auto-cleaned through api.loop)
  function tween(ms, fn, done) {
    if (REDUCED) ms = 1;
    let t = 0;
    A.loop(dt => { t += dt * 1000; const k = Math.min(1, t / ms); fn(k); if (k >= 1) { if (done) done(); return false; } });
  }
  const ease = k => k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
  // segmented chips: opts [{label, value}], onPick(value)
  function seg(opts, onPick, aria) {
    const wrap = h('div', { class: 'c1-seg', role: 'group', 'aria-label': aria || 'options' });
    wrap.btns = opts.map(o => {
      const b = h('button', { class: 'chip', type: 'button', html: o.label });
      b._v = o.value;
      b.addEventListener('click', () => onPick(o.value, b));
      wrap.appendChild(b);
      return b;
    });
    wrap.select = v => wrap.btns.forEach(b => b.classList.toggle('selected', b._v === v));
    return wrap;
  }
  function field(label, el) { return h('div', { class: 'c1-field' }, h('span', { class: 'c1-label', text: label }), el); }
  // ask(): tap-to-answer observation question. options [{label, ok, why}]; onRight(firstTry)
  function ask(container, qHtml, options, onRight, gridCls) {
    const box = h('div', { class: 'c1-ask pop-in' }, qHtml ? h('div', { class: 'c1-ask-q', html: qHtml }) : null);
    const grid = h('div', { class: 'c1-opts' + (gridCls ? ' ' + gridCls : '') });
    const fb = h('div', { class: 'feedback' });
    let tries = 0, over = false;
    options.forEach(o => {
      const b = h('button', { class: 'q-opt', type: 'button' }, h('span', { html: o.label }));
      b.addEventListener('click', () => {
        if (over) return;
        if (o.ok) {
          over = true; b.classList.add('right');
          grid.querySelectorAll('button').forEach(x => { x.disabled = true; });
          fb.className = 'feedback good'; fb.innerHTML = '✅ ' + (o.why || 'Correct!');
          A.sound('good');
          if (onRight) onRight(tries === 0);
        } else {
          tries++; b.classList.add('wrong'); b.disabled = true;
          fb.className = 'feedback bad'; fb.innerHTML = '❌ ' + (o.why || 'Look again!');
          A.sound('bad'); shakeEl(box);
        }
      });
      grid.appendChild(b);
    });
    box.appendChild(grid); box.appendChild(fb);
    container.appendChild(box);
    return box;
  }
  function doneScreen(emoji, title, sub, again) {
    return h('div', { class: 'c1-done pop-in' }, h('div', { class: 'c1-emoji', text: emoji }), h('h3', { text: title }),
      sub ? h('p', { class: 'muted', html: sub }) : null, again ? btn('↻ Play again', again) : null);
  }

  /* ---------- particle boxes: lattice / liquid / gas, any molecule shape ---------- */
  function molExt(m) { return Math.max(...m.map(a => Math.hypot(a.x, a.y) + a.r)); }
  function seededShuffle(a, R) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  /**
   * pbox(spec) -> <svg>   spec: {w,h, layout:'solid'|'liquid'|'gas', groups:[{m: MOL..., n}], seed,
   *   fill (solid: fill whole box), pick(i,R) (solid fill: molecule per slot), cols, motion:'bounce'|'jiggle', speed, aria, label}
   */
  function pbox(spec) {
    const W = spec.w || 160, H = spec.h || 110, R = A.rng(spec.seed || 3);
    const list = [];
    (spec.groups || []).forEach(gp => { for (let k = 0; k < gp.n; k++) list.push(gp.m); });
    const items = seededShuffle(list, R);
    const s = h('svg', { class: 'pbox c1-pbox' + (spec.cls ? ' ' + spec.cls : ''), viewBox: '0 0 ' + W + ' ' + H, width: W, height: H, role: 'img', 'aria-label': spec.aria || 'particle diagram' });
    if (spec.maxW) s.style.maxWidth = spec.maxW + 'px';
    const P = [];
    const layout = spec.layout || 'gas';
    if (layout === 'solid') {
      const m0 = items[0];
      const e = molExt(m0), step = 2 * e + (spec.gap != null ? spec.gap : .4);
      const cols = Math.max(1, Math.floor((W - 4) / step)), rowsMax = Math.max(1, Math.floor((H - 4) / step));
      const useCols = spec.fill ? cols : Math.min(cols, spec.cols || cols);
      const n = spec.fill ? cols * rowsMax : Math.min(items.length, useCols * rowsMax);
      const x0 = (W - useCols * step) / 2 + step / 2;
      const yb = spec.fill ? H - (H - rowsMax * step) / 2 - step / 2 : H - 2 - step / 2;
      for (let i = 0; i < n; i++) {
        const m = spec.fill ? (spec.pick ? spec.pick(i, R) : m0) : items[i];
        P.push({ m, e, x: x0 + (i % useCols) * step, y: yb - Math.floor(i / useCols) * step, rot: 0 });
      }
    } else if (layout === 'liquid') {
      const e = Math.max(...items.map(molExt)), step = 2 * e + 1;
      let row = 0, x = 2 + e + R() * e * .6;
      items.forEach(m => {
        if (x > W - 2 - e) { row++; x = 2 + e + R() * e * 1.1; }
        P.push({ m, e: molExt(m), x: x + (R() - .5) * e * .2, y: H - 2 - e - row * step * .9 + (R() - .5) * e * .3, rot: R() * 6.283 });
        x += step + R() * e * (row ? .8 : .4);
      });
      // relax overlaps so particles are close together but never overlap
      for (let it = 0; it < 30; it++) {
        for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) {
          const a = P[i], b = P[j], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || .01, min = a.e + b.e + .6;
          if (d < min) { const o = (min - d) / 2, nx = dx / d, ny = dy / d; a.x -= nx * o; a.y -= ny * o; b.x += nx * o; b.y += ny * o; }
        }
        P.forEach(p => { p.x = Math.max(p.e + 2, Math.min(W - p.e - 2, p.x)); p.y = Math.max(p.e + 2, Math.min(H - p.e - 2, p.y)); });
      }
    } else {
      const space = spec.space != null ? spec.space : 9;
      items.forEach(m => {
        const e = molExt(m); let best = null, bestGap = -Infinity;
        for (let t = 0; t < 400; t++) { // keep the roomiest candidate; stop early once it is roomy enough
          const x = e + 3 + R() * (W - 2 * e - 6), y = e + 3 + R() * (H - 2 * e - 6);
          const gap = P.reduce((g, p) => Math.min(g, Math.hypot(p.x - x, p.y - y) - p.e - e), Infinity);
          if (gap > bestGap) { bestGap = gap; best = { x, y }; }
          if (gap > space) break;
        }
        P.push({ m, e, x: best.x, y: best.y, rot: R() * 6.283 });
      });
    }
    P.forEach(p => {
      const c = Math.cos(p.rot), sn = Math.sin(p.rot);
      const atoms = p.m.map(a => ({ x: a.x * c - a.y * sn, y: a.x * sn + a.y * c, r: a.r, el: a.el })).sort((a, b) => a.y - b.y);
      p.g = h('g', { transform: 'translate(' + p.x.toFixed(1) + ',' + p.y.toFixed(1) + ')' },
        atoms.map(a => h('circle', { class: 'atom', cx: a.x.toFixed(2), cy: a.y.toFixed(2), r: a.r, fill: A.atomColor(a.el) })));
      s.appendChild(p.g);
    });
    if (spec.motion && !REDUCED) {
      let seen = false;
      P.forEach(p => { const a = R() * 6.283, v = spec.speed || 24; p.vx = Math.cos(a) * v; p.vy = Math.sin(a) * v; p.ox = p.x; p.oy = p.y; p.ph = R() * 6.283; });
      A.loop((dt, now) => {
        if (!s.isConnected) { if (seen) return false; return; }
        seen = true;
        if (spec.motion === 'bounce') { // simple elastic collisions so particles never pass through each other
          for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) {
            const a = P[i], b = P[j], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || .01, min = a.e + b.e + 1;
            if (d < min) {
              const nx = dx / d, ny = dy / d, rv = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
              if (rv < 0) { a.vx += rv * nx; a.vy += rv * ny; b.vx -= rv * nx; b.vy -= rv * ny; }
            }
          }
        }
        P.forEach(p => {
          if (spec.motion === 'bounce') {
            p.x += p.vx * dt; p.y += p.vy * dt;
            if (p.x < p.e + 2 || p.x > W - p.e - 2) { p.vx *= -1; p.x = Math.max(p.e + 2, Math.min(W - p.e - 2, p.x)); }
            if (p.y < p.e + 2 || p.y > H - p.e - 2) { p.vy *= -1; p.y = Math.max(p.e + 2, Math.min(H - p.e - 2, p.y)); }
          } else {
            const t = now / 1000 * (spec.freq || 9) + p.ph, amp = spec.amp || .9;
            p.x = p.ox + Math.sin(t) * amp; p.y = p.oy + Math.cos(t * 1.3) * amp;
          }
          p.g.setAttribute('transform', 'translate(' + p.x.toFixed(1) + ',' + p.y.toFixed(1) + ')');
        });
      });
    }
    if (spec.label) return h('figure', { class: 'c1-fig' }, s, h('figcaption', { html: spec.label }));
    return s;
  }
  // a generic "matter" box for the classification games
  const PAIRS = [['N', 'S'], ['O', 'Cl'], ['Ar', 'N'], ['Na', 'S'], ['Cu', 'Cl'], ['Fe', 'O']];
  function matterBox(st, kinds, seed, pair, size) {
    size = size || {};
    const w = size.w || 150, hh = size.h || 110, r = size.r || 7.5;
    const ca = (pair || PAIRS[0])[0], cb = (pair || PAIRS[0])[1];
    const aria = size.aria || 'particle diagram';
    if (st === 'solid') {
      return pbox({ w, h: hh, layout: 'solid', fill: true, seed, aria, groups: [{ m: MOL.atom(ca, r), n: 1 }], pick: kinds === 2 ? (i, R) => MOL.atom(R() < .42 ? cb : ca, r) : null, motion: 'jiggle', amp: .7, maxW: size.maxW });
    }
    const n = st === 'liquid' ? Math.round(w * hh / 880) : Math.max(6, Math.round(w * hh / 2300));
    const nb = kinds === 2 ? Math.max(2, Math.round(n * .4)) : 0;
    const groups = [{ m: MOL.atom(ca, r), n: n - nb }];
    if (nb) groups.push({ m: MOL.atom(cb, r), n: nb });
    return pbox({ w, h: hh, layout: st, seed, aria, groups, motion: st === 'gas' ? 'bounce' : 'jiggle', speed: 26, amp: .8, maxW: size.maxW });
  }

  /* ---------- reusable SVG apparatus: bulb, battery, crocodile clips, circuit ---------- */
  function bulbArt(x, y) {
    const rays = [];
    for (let i = 0; i < 8; i++) {
      const a = -Math.PI / 2 + (i - 3.5) * .42, r1 = 27, r2 = 37;
      rays.push(h('line', { class: 'c1-rays', x1: (x + Math.cos(a) * r1).toFixed(1), y1: (y + Math.sin(a) * r1).toFixed(1), x2: (x + Math.cos(a) * r2).toFixed(1), y2: (y + Math.sin(a) * r2).toFixed(1) }));
    }
    return h('g', null,
      h('circle', { class: 'c1-glow', cx: x, cy: y, r: 34 }), rays,
      h('circle', { class: 'c1-glass', cx: x, cy: y, r: 20 }),
      h('path', { class: 'c1-fil', d: 'M' + (x - 6) + ' ' + (y + 18) + ' L' + (x - 6) + ' ' + y + ' l3 -5 l3 5 l3 -5 l3 5 L' + (x + 6) + ' ' + (y + 18) }),
      h('rect', { x: x - 10, y: y + 17, width: 20, height: 14, rx: 2, fill: '#9aa3ad', stroke: '#6b737d', 'stroke-width': 1.5 }),
      h('line', { x1: x - 10, y1: y + 22, x2: x + 10, y2: y + 22, stroke: '#6b737d', 'stroke-width': 1.2 }),
      h('line', { x1: x - 10, y1: y + 26, x2: x + 10, y2: y + 26, stroke: '#6b737d', 'stroke-width': 1.2 }));
  }
  function batteryArt(x, y, w, hh) {
    return h('g', null,
      h('rect', { x, y, width: w, height: hh, rx: 6, fill: '#343944', stroke: '#1d2027', 'stroke-width': 1.5 }),
      h('rect', { x: x + w - 16, y, width: 16, height: hh, rx: 4, fill: '#e8a317' }),
      h('rect', { x: x + w, y: y + hh / 2 - 5, width: 5, height: 10, rx: 1.5, fill: '#9aa3ad' }),
      h('text', { x: x + (w - 16) / 2, y: y + hh / 2 + 5, fill: '#fff', 'font-size': 15, 'font-weight': 900, 'text-anchor': 'middle', 'font-family': 'Nunito, sans-serif' }, '6 V'),
      txt(x + 7, y - 5, '−', 'c1-t2', { 'font-size': 15 }),
      txt(x + w - 6, y - 5, '+', 'c1-t2', { 'font-size': 15 }));
  }
  function clipArt(x, y, dir, col) { // jaws point in direction dir (1 = right, -1 = left)
    const d = dir;
    return h('g', { class: 'c1-clip' },
      h('path', { d: `M${x - 14 * d} ${y - 6} L${x + 4 * d} ${y - 6} L${x + 12 * d} ${y - 2} L${x + 12 * d} ${y + 2} L${x + 4 * d} ${y + 6} L${x - 14 * d} ${y + 6} Z`, fill: col, stroke: 'rgba(0,0,0,.35)', 'stroke-width': 1.2 }),
      h('path', { d: `M${x + 4 * d} ${y - 6} l2 3 l2 -2 l2 3 M${x + 4 * d} ${y + 6} l2 -3 l2 2 l2 -3`, stroke: 'rgba(0,0,0,.45)', 'stroke-width': 1, fill: 'none' }));
  }
  /**
   * circuit(sampleNode, opts) -> {svg, setOn(bool), connect(cb)}
   * 6 V battery + light bulb + connection wires + crocodile clips holding the sample (centre 258,166).
   */
  function circuit(sampleNode, opts) {
    opts = opts || {};
    const s = svg(360, 214, opts.aria || 'Circuit: 6 V battery, light bulb, crocodile clips and connection wires with the sample between the clips', 'c1-svg');
    const wires = ['M38 166 L16 166 L16 104 L174 104 L174 80', 'M186 80 L186 104 L344 104 L344 166 L322 166', 'M194 166 L132 166'];
    const root = h('g');
    wires.forEach(d => root.appendChild(h('path', { class: 'c1-wire', d })));
    wires.forEach(d => root.appendChild(h('path', { class: 'c1-flow', d })));
    root.appendChild(batteryArt(40, 150, 86, 34));
    root.appendChild(bulbArt(180, 48));
    if (sampleNode) root.appendChild(sampleNode);
    root.appendChild(h('path', { class: 'c1-flow', d: 'M214 166 L302 166' }));
    const cl = h('g', { transform: 'translate(-14,0)' }, clipArt(204, 166, 1, '#e5484d'));
    const cr = h('g', { transform: 'translate(14,0)' }, clipArt(312, 166, -1, '#2a2f3a'));
    root.appendChild(cl); root.appendChild(cr);
    if (opts.labels !== false) {
      root.appendChild(txt(83, 204, '6 V battery', 'c1-t2 c1-mid'));
      root.appendChild(txt(220, 44, 'light bulb', 'c1-t2'));
      root.appendChild(txt(258, 202, 'crocodile clips', 'c1-t2 c1-mid'));
      root.appendChild(txt(92, 97, 'connection wires', 'c1-t2 c1-mid'));
    }
    s.appendChild(root);
    let connected = false, waiting = null;
    return {
      svg: s, root,
      setOn(on) { root.classList.toggle('c1-on', !!on); },
      connect(cb) {
        if (connected) { if (cb) cb(); return; }
        if (waiting) { waiting = cb || waiting; return; } // already closing the clips: only the latest callback runs
        waiting = cb || (() => {});
        tween(450, k => { const e = ease(k); cl.setAttribute('transform', 'translate(' + (-14 + 14 * e).toFixed(1) + ',0)'); cr.setAttribute('transform', 'translate(' + (14 - 14 * e).toFixed(1) + ',0)'); },
          () => { connected = true; A.sound('click'); const f = waiting; waiting = null; f(); });
      }
    };
  }
  function sparkle(x, y, s) {
    s = s || 7;
    return h('polygon', { class: 'c1-twinkle', fill: '#fff6c2', stroke: '#f2c94c', 'stroke-width': 1,
      points: [[0, -s], [s * .28, -s * .28], [s, 0], [s * .28, s * .28], [0, s], [-s * .28, s * .28], [-s, 0], [-s * .28, -s * .28]].map(p => (x + p[0]).toFixed(1) + ',' + (y + p[1]).toFixed(1)).join(' '),
      style: { animationDelay: (Math.random() * 1.2).toFixed(2) + 's' } });
  }

  /* =========================================================
     Periodic table component (book p.3 layout, periods 1–6)
     ========================================================= */
  function periodicTable(opts) {
    opts = opts || {};
    const items = opts.items || ELS;
    const pos = {}; items.forEach(e => { pos[e.p + '-' + e.gr] = e; });
    const grid = h('div', { class: 'c1-pt', role: 'group', 'aria-label': 'Periodic table of common elements' });
    const tiles = {};
    for (let p = 1; p <= 6; p++) for (let gr = 1; gr <= 18; gr++) {
      const e = pos[p + '-' + gr];
      if (e) {
        const b = h('button', { type: 'button', class: 'c1-tile st-' + e.st + ' cl-' + e.cls + (e.extra ? ' extra' : ''), 'aria-label': e.name, 'data-st': e.st, 'data-cl': e.cls },
          h('span', { class: 'z', text: e.z }), h('span', { class: 'sy', text: e.sym }));
        b.addEventListener('click', () => {
          b.classList.remove('flip'); void b.offsetWidth; b.classList.add('flip');
          if (opts.onTap) opts.onTap(e, b);
        });
        tiles[e.sym] = b; grid.appendChild(b);
      } else {
        const ghost = p >= 4;
        grid.appendChild(h('div', { class: 'c1-cell' + (ghost ? ' c1-ghost' : ''), 'aria-hidden': 'true' }));
      }
    }
    grid.setMode = m => { grid.classList.toggle('by-state', m === 'state'); grid.classList.toggle('by-class', m === 'class'); };
    if (opts.mode) grid.setMode(opts.mode);
    const wrap = h('div', null, h('div', { class: 'c1-pt-scroll' }, grid), h('div', { class: 'c1-swipe', text: '↔ Swipe the table sideways to see every group.' }));
    wrap.grid = grid; wrap.tiles = tiles;
    return wrap;
  }
  function elInfo(e) {
    const lat = LATIN[e.sym];
    const origin = lat ? 'Symbol from the Latin name <b>' + latinHtml(e.sym) + '</b>'
      : (e.sym === 'H' || e.sym === 'He') ? 'Symbol from the English name' : '';
    return h('div', { class: 'c1-info pop-in' },
      h('div', { class: 'c1-bigtile' }, h('span', { class: 'z', text: e.z }), h('span', { class: 'sy', text: e.sym }), h('span', { class: 'nm', text: e.name })),
      h('div', { style: { minWidth: '0' } },
        h('div', { class: 'c1-big', text: cap(e.name) }),
        h('div', { class: 'c1-tags' },
          h('span', { class: 'c1-tag cl-' + e.cls, text: CLS[e.cls] }),
          h('span', { class: 'c1-tag st-' + e.st, text: ST_ICON[e.st] + ' ' + ST[e.st] + ' at room conditions' })),
        origin ? h('div', { class: 'tiny', style: { marginTop: '6px' }, html: origin }) : null,
        e.extra ? h('div', { class: 'tiny', style: { marginTop: '4px' }, text: 'Named in the book, but not in the classwork table.' }) : null));
  }
  const emptyInfo = txt0 => h('div', { class: 'c1-info empty', text: txt0 || '👆 Tap any element to see its name, type and state.' });

  /* =========================================================
     LESSON 1.1 — Classification of matter & particle diagrams
     ========================================================= */
  const STATE_DESC = {
    solid: ['🧊 Solid', 'Particles are <b>closely packed</b> in a <b>regular</b> arrangement. They only <b>vibrate</b> about fixed positions.'],
    liquid: ['💧 Liquid', 'Particles are <b>close together</b> but <b>irregularly</b> arranged. They can <b>move past each other</b>.'],
    gas: ['💨 Gas', 'Particles are <b>far apart</b> and <b>randomly</b> arranged. They move <b>fast</b> in all directions.']
  };
  const KIND_DESC = {
    1: ['Pure substance', 'Only <b>one kind</b> of particle.'],
    2: ['Mixture', '<b>More than one kind</b> of particle.']
  };

  function statesSim() {
    const W = 260, H = 180, N = 24, R0 = 9, cols = 6, step = 2 * R0 + .6;
    const s = svg(W, H, 'Particle simulator showing particles as a solid, liquid or gas', 'pbox c1-svg c1-sim');
    const x0 = (W - (cols - 1) * step) / 2, yb = H - 3 - R0;
    const P = [];
    for (let i = 0; i < N; i++) {
      const sx = x0 + (i % cols) * step, sy = yb - Math.floor(i / cols) * step;
      const c = h('circle', { class: 'atom', r: R0, cx: sx, cy: sy, fill: A.atomColor('N') });
      s.appendChild(c);
      P.push({ x: sx, y: sy, vx: 0, vy: 0, sx, sy, r: R0, c, ph: Math.random() * 6.28, b: [1, 4, 6, 9, 11, 14, 17, 19, 22].includes(i) });
    }
    let temp = 12, kinds = 1;
    const seen = new Set();
    const mode = () => temp < 34 ? 'solid' : temp < 67 ? 'liquid' : 'gas';
    function collide(m, dt) {
      for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
        const a = P[i], b = P[j], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || .01, min = a.r + b.r;
        const nx = dx / d, ny = dy / d;
        if (d < min) {
          const ov = (min - d) / 2;
          a.x -= nx * ov; a.y -= ny * ov; b.x += nx * ov; b.y += ny * ov;
          const rv = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
          if (rv < 0) { const imp = rv * (m === 'gas' ? 1 : .6); a.vx += imp * nx; a.vy += imp * ny; b.vx -= imp * nx; b.vy -= imp * ny; }
        } else if (m === 'liquid' && d < min * 1.25) { // weak cohesion keeps the liquid together
          const k = 40 * dt;
          a.vx += nx * k; a.vy += ny * k; b.vx -= nx * k; b.vy -= ny * k;
        }
      }
    }
    A.loop((dt, now) => {
      if (!s.isConnected) return;
      const m = mode(), sub = 3, hs = dt / sub;
      for (let k = 0; k < sub; k++) {
        for (const p of P) {
          let ax = 0, ay = 0;
          if (m === 'solid') { ax = 170 * (p.sx - p.x) - 17 * p.vx; ay = 170 * (p.sy - p.y) - 17 * p.vy; }
          else if (m === 'liquid') {
            const kick = 2600 + (temp - 34) * 80;
            ay = 650 + (Math.random() - .5) * kick * .4; ax = (Math.random() - .5) * kick;
            p.vx *= 1 - 1.1 * hs; p.vy *= 1 - 1.1 * hs;
          } else {
            const sp = Math.hypot(p.vx, p.vy), target = 85 + (temp - 67) * 4.5;
            if (sp < 4) { const a = Math.random() * 6.283; p.vx = Math.cos(a) * 40; p.vy = Math.sin(a) * 40; }
            else { const f = 1 + (target / sp - 1) * Math.min(1, hs * 4); p.vx *= f; p.vy *= f; }
          }
          p.vx += ax * hs; p.vy += ay * hs;
          p.x += p.vx * hs; p.y += p.vy * hs;
          const e = m === 'gas' ? 1 : .3;
          if (p.x < p.r + 2) { p.x = p.r + 2; p.vx = Math.abs(p.vx) * e; }
          if (p.x > W - p.r - 2) { p.x = W - p.r - 2; p.vx = -Math.abs(p.vx) * e; }
          if (p.y < p.r + 2) { p.y = p.r + 2; p.vy = Math.abs(p.vy) * e; }
          if (p.y > H - p.r - 2) { p.y = H - p.r - 2; p.vy = -Math.abs(p.vy) * e; }
        }
        if (m !== 'solid') collide(m, hs);
      }
      const amp = m === 'solid' ? .5 + temp / 34 * 1.7 : 0;
      for (const p of P) {
        const t = now / 1000 * 15 + p.ph;
        p.c.setAttribute('cx', (p.x + Math.sin(t) * amp).toFixed(1));
        p.c.setAttribute('cy', (p.y + Math.cos(t * 1.3) * amp).toFixed(1));
      }
    });

    const range = h('input', { type: 'range', min: 0, max: 100, value: temp, class: 'c1-range', 'aria-label': 'Temperature' });
    const stateSeg = seg([{ label: '🧊 Solid', value: 'solid' }, { label: '💧 Liquid', value: 'liquid' }, { label: '💨 Gas', value: 'gas' }],
      v => { temp = { solid: 15, liquid: 50, gas: 85 }[v]; range.value = temp; A.sound('whoosh'); update(); }, 'Physical state');
    const kindSeg = seg([{ label: 'One kind', value: 1 }, { label: 'Two kinds', value: 2 }], v => { kinds = v; A.sound('click'); paint(); update(); }, 'Kinds of particle');
    const rPhys = h('div'), rChem = h('div');
    range.addEventListener('input', () => { temp = +range.value; update(); });
    function paint() { P.forEach(p => p.c.setAttribute('fill', A.atomColor(kinds === 2 && p.b ? 'S' : 'N'))); }
    function update() {
      const m = mode();
      stateSeg.select(m); kindSeg.select(kinds);
      rPhys.innerHTML = '<span class="c1-label">Physical state</span><b>' + STATE_DESC[m][0] + '</b><p>' + STATE_DESC[m][1] + '</p>';
      rChem.innerHTML = '<span class="c1-label">Chemical state</span><b>' + KIND_DESC[kinds][0] + '</b><p>' + KIND_DESC[kinds][1] + '</p>';
      seen.add(m); seen.add('k' + kinds);
      if (seen.size === 5 && A.reward('c1-sim', 10, 'Particle explorer')) A.toast('🔬 You saw all 3 states and both kinds!', 'good');
    }
    update();
    return h('div', { class: 'c1-simwrap' },
      h('div', null, s),
      h('div', null,
        h('span', { class: 'c1-label', text: 'Temperature' }), range,
        h('div', { class: 'c1-rangelab' }, h('span', { text: '❄️ cool' }), h('span', { text: 'heat 🔥' })),
        field('Jump to', stateSeg), field('Particles', kindSeg),
        h('div', { class: 'c1-readout' }, rPhys, rChem)));
  }

  function classifyGame(card) {
    const combos = [];
    ['solid', 'liquid', 'gas'].forEach(st => [1, 2].forEach(k => combos.push([st, k])));
    const stage = h('div');
    card.body.appendChild(stage);
    let rounds, i, score, streak;
    function start() { rounds = A.shuffle(combos).concat(A.sample(combos, 2)); i = 0; score = 0; streak = 0; next(); }
    function next() {
      if (i >= rounds.length) return end();
      card.score.textContent = 'Box ' + (i + 1) + '/' + rounds.length + ' · ⭐ ' + score + (streak > 1 ? ' · 🔥' + streak : '');
      const [st, k] = rounds[i];
      const pick = { st: null, k: null };
      let done = false;
      const fb = h('div', { class: 'feedback' });
      const nextBtn = btn(i + 1 < rounds.length ? 'Next box →' : 'See score', () => { i++; next(); }, 'btn-primary');
      nextBtn.style.display = 'none';
      const s1 = seg([{ label: '🧊 Solid', value: 'solid' }, { label: '💧 Liquid', value: 'liquid' }, { label: '💨 Gas', value: 'gas' }], v => { if (done) return; pick.st = v; s1.select(v); A.sound('click'); maybe(); }, 'Physical state');
      const s2 = seg([{ label: 'Pure substance', value: 1 }, { label: 'Mixture', value: 2 }], v => { if (done) return; pick.k = v; s2.select(v); A.sound('click'); maybe(); }, 'Chemical state');
      function maybe() { if (pick.st && pick.k) check(); }
      function mark(sg, right, chosen) {
        sg.btns.forEach(b => { b.classList.remove('selected'); if (b._v === right) b.classList.add('good'); else if (b._v === chosen) b.classList.add('bad'); b.disabled = true; });
      }
      function check() {
        done = true;
        mark(s1, st, pick.st); mark(s2, k, pick.k);
        const why = STATE_DESC[st][1] + ' ' + KIND_DESC[k][1];
        if (pick.st === st && pick.k === k) {
          score++; streak++;
          fb.className = 'feedback good'; fb.innerHTML = '✅ ' + (streak > 2 ? 'On fire! ' : '') + why;
          A.sound(streak > 2 ? 'win' : 'good');
        } else {
          streak = 0;
          fb.className = 'feedback bad'; fb.innerHTML = '❌ It is a <b>' + st + ' ' + (k === 1 ? 'pure substance' : 'mixture') + '</b>. ' + why;
          A.sound('bad');
        }
        card.score.textContent = 'Box ' + (i + 1) + '/' + rounds.length + ' · ⭐ ' + score + (streak > 1 ? ' · 🔥' + streak : '');
        nextBtn.style.display = '';
      }
      clear(stage);
      stage.appendChild(h('div', { class: 'c1-center pop-in' }, matterBox(st, k, 1 + Math.floor(Math.random() * 1e6), A.sample(PAIRS, 1)[0], { w: 200, h: 130, maxW: 260 })));
      stage.appendChild(field('Physical state', s1));
      stage.appendChild(field('Chemical state', s2));
      stage.appendChild(fb);
      stage.appendChild(h('div', { class: 'q-actions' }, nextBtn));
    }
    function end() {
      card.score.textContent = '⭐ ' + score + '/' + rounds.length;
      const great = score >= rounds.length - 1;
      if (great) { A.celebrate(.7); A.sound('win'); }
      A.reward('c1-classify', 15, 'Name that box');
      clear(stage);
      stage.appendChild(doneScreen(great ? '🏆' : '👍', score + ' / ' + rounds.length + ' boxes named', great ? 'Particle-diagram pro!' : 'Look at how close the particles are, and count the kinds of particle.', start));
    }
    start();
  }

  // Classwork 1.1: "Draw particle diagrams … Explain your answer" — choose arrangement + kinds, the box redraws live
  function drawIt(key, title, st, kinds, clozeEl) {
    const pick = { st: null, k: null };
    const holder = h('div', { class: 'c1-center' });
    const fb = h('div', { class: 'feedback', html: '✏️ Choose how the particles are arranged and how many kinds there are.' });
    const NAME = { solid: 'solid', liquid: 'liquid', gas: 'gas' };
    function redraw() {
      clear(holder);
      if (!pick.st) {
        holder.appendChild(h('svg', { class: 'pbox c1-pbox', viewBox: '0 0 150 104', width: 150, height: 104, role: 'img', 'aria-label': 'empty box: your diagram' }, txt(75, 56, 'your diagram', 'c1-t2 c1-mid')));
        return;
      }
      holder.appendChild(matterBox(pick.st, pick.k || 1, key === 'a' ? 5 : 8, ['X', 'N'], { w: 150, h: 104, aria: 'your particle diagram: ' + pick.st + ', ' + (pick.k === 2 ? 'two kinds of particle' : 'one kind of particle') }));
      if (!pick.k) return;
      if (pick.st === st && pick.k === kinds) {
        fb.className = 'feedback good'; fb.innerHTML = '✅ That is ' + title.replace(/^\(\w\) /, '') + '! Now explain it below.';
        A.sound('good'); A.reward('c1-draw-' + key, 5, 'Particle diagram');
      } else {
        fb.className = 'feedback bad';
        fb.innerHTML = '❌ Your diagram shows a <b>' + NAME[pick.st] + ' ' + (pick.k === 1 ? 'pure substance' : 'mixture') + '</b>. ' + (pick.st !== st ? 'Check the arrangement.' : 'Check the kinds of particle.');
        A.sound('bad');
      }
    }
    const sArr = seg([{ label: '🧊 closely packed, regular', value: 'solid' }, { label: '💧 close together, irregular', value: 'liquid' }, { label: '💨 far apart, random', value: 'gas' }],
      v => { pick.st = v; sArr.select(v); redraw(); }, 'Arrangement of particles');
    const sKind = seg([{ label: 'one kind', value: 1 }, { label: 'more than one kind', value: 2 }], v => { pick.k = v; sKind.select(v); redraw(); }, 'Kinds of particle');
    redraw();
    return h('div', { class: 'c1-cw' },
      h('figure', { class: 'c1-fig' }, holder, h('figcaption', { text: title })),
      h('div', null, field('Arrangement', sArr), field('Kinds of particle', sKind), fb, h('div', { class: 'c1-gap' }, clozeEl)));
  }

  function goalsCard() {
    const goals = [
      ['Define <b>elements</b> macroscopically and microscopically.', 'ch1-2'],
      ['Represent some common elements using <b>chemical symbols</b>.', 'ch1-2'],
      ['Represent some common elements using <b>particle diagrams</b> and <b>chemical formulae</b>.', 'ch1-3'],
      ['Identify the difference between <b>atoms</b> and <b>molecules</b>.', 'ch1-3'],
      ['Distinguish between <b>metals</b>, <b>semi-metals</b> and <b>non-metals</b>.', 'ch1-4'],
      ['Describe some common <b>properties</b> of metals and non-metals.', 'ch1-5']
    ];
    const tab = { 'ch1-2': 'Symbols', 'ch1-3': 'Molecules', 'ch1-4': 'Classify', 'ch1-5': 'Properties' };
    return h('details', { class: 'card c1-goals' },
      h('summary', null, h('span', { class: 'card-tag', text: '🎯 Chapter 1' }), h('span', { text: 'Learning objectives' }), h('span', { class: 'tiny', text: '6 goals · tap to open' })),
      h('ol', null, goals.map(([g, l]) => h('li', { html: g + ' <a href="#/ch/ch1/' + l + '">→ ' + tab[l] + '</a>' }))));
  }

  function lessonParticles(root) {
    root.appendChild(goalsCard());
    root.appendChild(A.noteCard('Everything is made of particles', `
      <ul>
        <li>All ${T('matter', '物質')} is made up of <b>particles</b>. We show them with ${T('particle diagrams', '粒子圖')}.</li>
        <li>In a particle diagram, <b>each sphere represents one ${T('atom', '原子')}</b>.</li>
        <li><b>Different colours or shapes</b> of spheres represent <b>different types of atoms</b>.</li>
      </ul>`, 'Notes'));
    root.appendChild(A.keybox('An <b>atom</b> is the basic unit of matter.'));

    const n2 = A.noteCard('Two ways to classify matter', '<p style="margin:0">Matter can be classified by its <b>physical state</b> and by its <b>chemical state</b>.</p>', 'Notes');
    const fig = (st, k, seed, title, desc, pair) => h('figure', null,
      matterBox(st, k, seed, pair || ['N', 'S'], { w: 150, h: 104, aria: title + ' particle diagram' }), h('figcaption', { html: title + '<small>' + desc + '</small>' }));
    n2.appendChild(h('span', { class: 'c1-label c1-gap', text: 'Physical states' }));
    n2.appendChild(h('div', { class: 'c1-mini' },
      fig('solid', 1, 11, '🧊 ' + T('Solid', '固體'), 'closely packed, regular arrangement'),
      fig('liquid', 1, 12, '💧 ' + T('Liquid', '液體'), 'close together, irregular arrangement'),
      fig('gas', 1, 13, '💨 ' + T('Gas', '氣體'), 'far apart, random arrangement')));
    n2.appendChild(h('span', { class: 'c1-label c1-gap', text: 'Chemical states' }));
    n2.appendChild(h('div', { class: 'c1-mini' },
      fig('gas', 1, 21, T('Pure substance', '純物質'), 'only one kind of particle', ['Ar', 'N']),
      fig('gas', 2, 22, T('Mixture', '混合物'), 'more than one kind of particle', ['Ar', 'N'])));
    root.appendChild(n2);

    const sim = A.playCard('States of matter simulator', 'Slide the temperature from cool to hot and watch how the particles are <b>arranged</b> and how they <b>move</b> in a solid, a liquid and a gas. Then switch to <b>two kinds</b> of particle to make a mixture.', '🔬 Simulate');
    sim.body.appendChild(statesSim());
    root.appendChild(sim);

    const game = A.playCard('Name that box!', 'Pick the <b>physical state</b> and the <b>chemical state</b> of each particle diagram. 8 boxes. How long can your streak get?');
    root.appendChild(game);
    classifyGame(game);

    const cw = h('section', { class: 'card' }, h('div', { class: 'card-title' }, h('span', { class: 'card-tag', text: 'Classwork' }), h('h3', { text: 'Draw it, then explain it' })));
    cw.appendChild(h('p', { class: 'c1-note-sm', style: { margin: '0 0 6px' }, html: 'The book asks you to <b>draw</b> a particle diagram for each one and <b>explain</b> your answer. Build the diagram, then fill in the explanation.' }));
    cw.appendChild(drawIt('a', '(a) a solid pure substance', 'solid', 1,
      A.cloze('It is a <b>solid</b>, because the particles are [[closely packed|close packed|packed closely|tightly packed]] in a [[regular|orderly|fixed]] arrangement. It is a <b>pure substance</b>, because there is only [[one|1]] kind of particle.', { rewardKey: 'c1-cw-a', xp: 10 })));
    cw.appendChild(drawIt('b', '(b) a liquid mixture', 'liquid', 2,
      A.cloze('It is a <b>liquid</b>, because the particles are [[close together|close|closely packed]] but [[irregularly|randomly]] arranged. It is a <b>mixture</b>, because there is [[more than one|two|2|more than 1]] kind of particle.', { rewardKey: 'c1-cw-b', xp: 10 })));
    root.appendChild(cw);

    A.quickCheck(root, 'ch1', 'ch1-1', 5);
  }

  /* =========================================================
     LESSON 1.2 — Elements & chemical symbols
     ========================================================= */
  function ptPlay(card) {
    let mode = 'explore', info = emptyInfo();
    const bar = h('div', { class: 'c1-findbar', style: { display: 'none' } });
    const pt = periodicTable({ onTap: (e, b) => (mode === 'explore' ? showInfo(e, b) : findTap(e, b)) });
    const modes = seg([{ label: '🔍 Explore', value: 'explore' }, { label: '⏱ Find it!', value: 'find' }], v => setMode(v), 'Mode');
    modes.select('explore');
    card.body.appendChild(h('div', { class: 'c1-row', style: { marginBottom: '10px' } }, modes));
    card.body.appendChild(bar);
    card.body.appendChild(pt);
    card.body.appendChild(info);
    let sel = null;
    function showInfo(e, b) {
      if (sel) sel.classList.remove('sel');
      sel = b; b.classList.add('sel'); A.sound('pop');
      const n = elInfo(e); info.replaceWith(n); info = n;
    }
    // ---- find-it game
    let targets = [], idx = 0, misses = 0, t = 0, timerId = null, prompt = null, clock = null;
    function setMode(v) {
      if (v === mode) return;
      mode = v; modes.select(v); A.sound('click');
      if (timerId) { clearInterval(timerId); timerId = null; }
      Object.values(pt.tiles).forEach(b => b.classList.remove('found', 'sel'));
      if (v === 'find') { info.style.display = 'none'; startFind(); } else { bar.style.display = 'none'; info.style.display = ''; card.score.textContent = ''; }
    }
    function startFind() {
      targets = A.sample(ELS, 8); idx = 0; misses = 0; t = 0;
      Object.values(pt.tiles).forEach(b => b.classList.remove('found', 'sel'));
      prompt = h('div', { class: 'c1-prompt' }); clock = h('span', { class: 'quiz-timer', text: '⏱ 0.0 s' });
      clear(bar); bar.style.display = ''; bar.appendChild(prompt); bar.appendChild(clock);
      if (timerId) clearInterval(timerId);
      timerId = A.every(() => { t += .1; clock.textContent = '⏱ ' + t.toFixed(1) + ' s'; }, 100);
      ask1();
    }
    function ask1() {
      prompt.innerHTML = 'Tap <b>' + targets[idx].name + '</b>';
      card.score.textContent = (idx + 1) + ' / ' + targets.length + (misses ? ' · ✗' + misses : '');
    }
    function findTap(e, b) {
      if (!timerId) return;
      if (e.sym === targets[idx].sym) {
        b.classList.add('found'); A.sound('pop'); idx++;
        if (idx >= targets.length) return finish();
        ask1();
      } else {
        misses++; A.sound('bad'); shakeEl(b);
        A.toast('That is ' + e.name + ' (' + e.sym + ')', 'bad');
        card.score.textContent = (idx + 1) + ' / ' + targets.length + ' · ✗' + misses;
      }
    }
    function finish() {
      clearInterval(timerId); timerId = null;
      const total = t + misses * 2;
      const best = store.get('find-best');
      const isBest = best == null || total < best;
      if (isBest) store.set('find-best', +total.toFixed(1));
      A.sound('win'); if (isBest) A.celebrate(.6);
      A.reward('c1-find', 15, 'Element finder');
      clear(bar);
      bar.appendChild(h('div', { class: 'c1-prompt', html: '🏁 Found all 8 in <b>' + t.toFixed(1) + ' s</b>' + (misses ? ' + ' + misses + ' miss' + (misses > 1 ? 'es' : '') + ' (+2 s each)' : '') + (isBest ? ' · NEW BEST!' : ' · best ' + best + ' s') }));
      bar.appendChild(btn('↻ Again', startFind, 'btn-sm btn-primary'));
      card.score.textContent = '⭐ ' + total.toFixed(1) + ' s';
    }
  }

  const FIX = [
    ['cobalt', 'Co', ['CO', 'co', 'cO']], ['magnesium', 'Mg', ['MG', 'mg', 'Ma']], ['chlorine', 'Cl', ['CL', 'cl', 'Ch']],
    ['helium', 'He', ['HE', 'he', 'H']], ['sodium', 'Na', ['NA', 'So', 'na']], ['silver', 'Ag', ['AG', 'Si', 'Sv']],
    ['calcium', 'Ca', ['CA', 'ca', 'C']], ['lead', 'Pb', ['PB', 'Le', 'pb']], ['mercury', 'Hg', ['HG', 'Me', 'hg']],
    ['zinc', 'Zn', ['ZN', 'zn', 'Z']], ['copper', 'Cu', ['CU', 'Co', 'cu']], ['gold', 'Au', ['AU', 'Go', 'Ag']]
  ];
  function whyWrong(w, right, name) {
    if (w.toLowerCase() === right.toLowerCase()) {
      if (w[0] !== w[0].toUpperCase()) return 'The first letter must be a <b>capital</b> letter.';
      return 'The second letter must be <b>lower case</b>.' + (w === 'CO' ? ' “CO” would mean two elements — C and O!' : '');
    }
    const other = bySym[w];
    if (other) return '<b>' + w + '</b> is ' + other.name + ', not ' + name + '.';
    if (LATIN[right]) return cap(name) + '’s symbol comes from its Latin name, <b>' + latinHtml(right) + '</b>.';
    return '<b>' + w + '</b> is not the symbol of ' + name + '.';
  }
  function fixGame(card) {
    const stage = h('div');
    card.body.appendChild(stage);
    let rounds, i, score, streak;
    function start() { rounds = A.sample(FIX, 8); i = 0; score = 0; streak = 0; next(); }
    function next() {
      if (i >= rounds.length) return end();
      const [name, right, wrong] = rounds[i];
      card.score.textContent = (i + 1) + '/' + rounds.length + ' · ⭐ ' + score;
      clear(stage);
      stage.appendChild(h('div', { class: 'c1-prompt pop-in', html: '🏷️ Which label is correct for <b>' + name + '</b>?' }));
      const grid = h('div', { class: 'c1-opts c1-sym-opts' });
      const fb = h('div', { class: 'feedback' });
      let over = false;
      A.shuffle([right].concat(wrong)).forEach(sym => {
        const b = h('button', { class: 'q-opt', type: 'button', text: sym });
        b.addEventListener('click', () => {
          if (over) return; over = true;
          grid.querySelectorAll('button').forEach(x => { x.disabled = true; if (x.textContent === right) x.classList.add('right'); });
          if (sym === right) {
            score++; streak++; A.sound('good');
            fb.className = 'feedback good'; fb.innerHTML = '✅ ' + (LATIN[right] ? 'Yes! From Latin <b>' + latinHtml(right) + '</b>.' : 'Capital first, then lower case.') + (streak > 2 ? ' 🔥 ' + streak + ' in a row!' : '');
            A.later(() => { i++; next(); }, 1100);
          } else {
            streak = 0; b.classList.add('wrong'); A.sound('bad');
            fb.className = 'feedback bad'; fb.innerHTML = '❌ ' + whyWrong(sym, right, name);
            A.later(() => { i++; next(); }, 2200);
          }
          card.score.textContent = (i + 1) + '/' + rounds.length + ' · ⭐ ' + score;
        });
        grid.appendChild(b);
      });
      stage.appendChild(grid); stage.appendChild(fb);
    }
    function end() {
      const great = score >= 7;
      if (great) { A.celebrate(.6); A.sound('win'); }
      A.reward('c1-fix', 10, 'Symbol doctor');
      card.score.textContent = '⭐ ' + score + '/' + rounds.length;
      clear(stage);
      stage.appendChild(doneScreen(great ? '🩺' : '💪', score + ' / ' + rounds.length + ' labels fixed', 'Rule: one or two letters — the <b>first is a capital</b>, the second is lower case.', start));
    }
    start();
  }

  function lessonSymbols(root) {
    root.appendChild(A.noteCard('What is an element?', `
      <ul>
        <li>A ${T('pure substance', '純物質')} may exist as an <b>${T('element', '元素')}</b> or a <b>${T('compound', '化合物')}</b> (combined form — more in Chapter 2).</li>
      </ul>`, 'Notes'));
    root.appendChild(A.keybox('<b>Macroscopically</b>, an <b>element</b> is a <b>pure</b> substance that <b>cannot be broken down</b> into anything simpler by <b>chemical</b> methods.'));

    const sy = A.noteCard('Chemical symbols', `
      <ul>
        <li>Each element is represented by a ${T('chemical symbol', '化學符號')} of <b>one or two letters</b>.</li>
        <li>The <b>first letter is a capital letter</b>; a second letter is lower case: <span class="formula">Co</span> ✓ &nbsp;<span class="formula">CO</span> ✗ &nbsp;<span class="formula">co</span> ✗</li>
        <li>Some symbols come from the <b>English</b> names, e.g. hydrogen <b>H</b>, helium <b>He</b>.</li>
        <li>Others come from the <b>Latin</b> names:</li>
      </ul>`, 'Notes');
    sy.appendChild(h('div', { class: 'c1-latin' }, ['Na', 'Cu', 'Ag', 'Au', 'Hg', 'Pb'].map(s =>
      h('div', { html: '<b class="sy">' + s + '</b>' + bySym[s].name + '<br><span class="tiny">Latin: </span>' + latinHtml(s) }))));
    root.appendChild(sy);

    const pt = A.playCard('Interactive periodic table', 'The 35 common elements from your classwork. <b>Explore</b>: tap a tile to flip it. <b>Find it!</b>: race the clock to tap 8 elements.', '🗺️ Explore');
    ptPlay(pt);
    root.appendChild(pt);

    const fix = A.playCard('Symbol doctor', 'The lab labels are a mess! Pick the one that is written correctly.', '🩺 Play');
    fixGame(fix);
    root.appendChild(fix);

    const lat = A.playCard('Latin decoder', 'Match each symbol to the Latin name it comes from.', '🏛️ Match');
    const latDone = h('div', { class: 'feedback' });
    lat.body.appendChild(A.matchWidget(['Na', 'Cu', 'Ag', 'Au', 'Hg', 'Pb'].map(s => ['<b>' + s + '</b> · ' + bySym[s].name, LATIN[s][0]]), {
      onDone: m => { latDone.className = 'feedback good'; latDone.innerHTML = m === 0 ? '🏆 Perfect — no mistakes!' : '🎉 All matched! The underlined letters in each Latin name make the symbol.'; A.reward('c1-latin', 10, 'Latin decoder'); if (m === 0) A.celebrate(.4); }
    }));
    lat.body.appendChild(latDone);
    root.appendChild(lat);

    const kp = h('section', { class: 'card' }, h('div', { class: 'card-title' }, h('span', { class: 'card-tag', text: '📖 Key words' }), h('h3', { text: 'Fill in the definition' })));
    kp.appendChild(A.cloze('Macroscopically, an element is a [[pure]] substance that cannot be broken down into anything simpler by [[chemical]] methods. A chemical symbol has one or two letters, and the first letter is a [[capital|capital letter|upper case]] letter.', { rewardKey: 'c1-def-el', xp: 10 }));
    root.appendChild(kp);

    const fc = A.playCard('Symbol flashcards', 'Say the name before you flip. All 35 elements — shuffle for a challenge.', '🃏 Drill');
    fc.body.appendChild(A.flashcards(ELS.map(e => ({
      front: '<div class="big">' + e.sym + '</div>',
      back: '<div class="mid">' + e.name + '</div><div class="tiny" style="margin-top:6px">' + CLS[e.cls] + ' · ' + ST[e.st].toLowerCase() + (LATIN[e.sym] ? ' · Latin ' + LATIN[e.sym][0] : '') + '</div>',
      hint: 'Tap to flip'
    })), { rewardKey: 'c1-flash-sym', xp: 15, shuffle: true }));
    root.appendChild(fc);

    A.quickCheck(root, 'ch1', 'ch1-2', 5);
  }

  /* =========================================================
     LESSON 1.2 (cont.) — Atoms, molecules & formulae
     ========================================================= */
  const SUBST = [
    { key: 'a', name: 'argon', st: 'g', f: 'Ar', opts: ['Ar', 'Ar2', 'A', 'AR'], desc: 'separate single atoms', small: 5, box: { layout: 'gas', groups: [{ m: MOL.atom('Ar', 8), n: 6 }], motion: 'bounce' } },
    { key: 'b', name: 'oxygen', st: 'g', f: 'O2', opts: ['O2', 'O', 'O3', '2O'], desc: 'pairs of atoms', small: 4, box: { layout: 'gas', groups: [{ m: MOL.di('O', 'O', 7), n: 5 }], motion: 'bounce' } },
    { key: 'c', name: 'ozone (another form of oxygen)', st: 'g', f: 'O3', opts: ['O3', 'O2', '3O', 'Oz'], desc: 'groups of 3 atoms', small: 3, box: { layout: 'gas', groups: [{ m: MOL.tri('O', 6.5), n: 5 }], motion: 'bounce' } },
    { key: 'd', name: 'iron', st: 's', f: 'Fe', opts: ['Fe', 'Ir', 'FE', 'Fe2'], desc: 'closely packed atoms', box: { layout: 'solid', fill: true, groups: [{ m: MOL.atom('Fe', 8), n: 1 }], motion: 'jiggle', amp: .6 } },
    { key: 'e', name: 'bromine', hidden: true, st: 'l', f: 'Br2', opts: ['Br2', 'Br', 'B2', 'BR2'], desc: 'pairs of atoms', small: 8, box: { layout: 'liquid', groups: [{ m: MOL.di('Br', 'Br', 6.5), n: 13 }], motion: 'jiggle', amp: .8 } },
    { key: 'f', name: 'phosphorus', st: 's', f: 'P4', opts: ['P4', 'P', '4P', 'Ph4'], desc: 'groups of 4 atoms', small: 8, box: { layout: 'solid', cols: 5, groups: [{ m: MOL.p4('P', 6.5), n: 10 }], gap: 1.5, motion: 'jiggle', amp: .5 } }
  ];
  function substBox(sb, size, seed, small) {
    const box = Object.assign({}, sb.box);
    if (small && sb.small) box.groups = box.groups.map(g => ({ m: g.m, n: sb.small }));
    if (small && box.cols) box.cols = 4;
    return pbox(Object.assign({ seed: seed || 4, aria: 'particle diagram of ' + sb.name }, box, size));
  }

  function tableBuilder(card) {
    const head = ['', 'substance', 'particle diagram', 'physical state (s/l/g)', 'pure substance?', 'element?', 'chemical formula'];
    const tbl = h('table', { class: 't c1-cwtable' }, h('thead', h('tr', head.map(x => h('th', { text: x })))));
    const tb = h('tbody');
    const rowCells = {};
    SUBST.forEach((sb, i) => {
      const cells = {
        name: h('td', { html: sb.hidden ? '?' : sb.name.replace(' (', '<br><span class="tiny">(').replace(')', ')</span>') }),
        st: h('td', { class: 'q', text: '?' }), pure: h('td', { class: 'q', text: '?' }), el: h('td', { class: 'q', text: '?' }), f: h('td', { class: 'q', text: '?' })
      };
      rowCells[sb.key] = cells;
      tb.appendChild(h('tr', null, h('td', { text: '(' + sb.key + ')' }), cells.name, h('td', null, substBox(sb, { w: 132, h: 80, motion: false, space: 4 }, 30 + i, true)), cells.st, cells.pure, cells.el, cells.f));
    });
    tbl.appendChild(tb);
    const stage = h('div');
    card.body.appendChild(stage);
    card.body.appendChild(h('div', { class: 'table-wrap c1-gap' }, tbl));
    let i = 0;
    function fill(td, html) { td.className = 'fill pop-in'; td.innerHTML = html; }
    function next() {
      card.score.textContent = Math.min(i, SUBST.length) + ' / ' + SUBST.length + ' rows';
      clear(stage);
      if (i >= SUBST.length) {
        A.reward('c1-table', 20, 'Classwork table'); A.celebrate(.6); A.sound('win');
        stage.appendChild(h('div', { class: 'explain good pop-in', html: '🏆 Table complete! <b>All six are elements</b> — each is made up of <b>only one kind of atom</b>, even though the particles look very different (single atoms, pairs, groups of 3 or 4, or closely packed atoms).' }));
        return;
      }
      const sb = SUBST[i];
      const need = { st: false, el: false, f: false, name: !sb.hidden };
      const qs = h('div');
      stage.appendChild(h('div', { class: 'c1-tb-q pop-in' },
        h('figure', { class: 'c1-fig' }, substBox(sb, { w: 200, h: 124 }, 50 + i), h('figcaption', { html: '(' + sb.key + ') ' + (sb.hidden ? '<span class="muted">mystery substance — formula ' + F(sb.f) + '</span>' : sb.name) })), qs));
      const done = () => {
        if (need.st && need.el && need.f && need.name) {
          A.sound('pop');
          A.later(() => { i++; next(); }, 900);
        }
      };
      if (sb.hidden) {
        ask(qs, 'Its formula is <b>' + F(sb.f) + '</b> and it is a liquid. What is it?', [
          { label: 'bromine', ok: true, why: 'Bromine, Br<sub>2</sub> — pairs of Br atoms.' },
          { label: 'boron', why: 'Boron is B, a solid semi-metal.' }, { label: 'beryllium', why: 'Beryllium is Be, a solid metal.' }
        ], () => { need.name = true; fill(rowCells[sb.key].name, 'bromine'); done(); });
      }
      ask(qs, 'Physical state at room conditions?', ['s', 'l', 'g'].map(x => ({
        label: ST_ICON[x] + ' ' + x + ' (' + ST[x].toLowerCase() + ')', ok: x === sb.st,
        why: x === sb.st ? cap(sb.name.split(' (')[0]) + ' is a ' + ST[x].toLowerCase() + '.' : 'Look at the arrangement again — ' + (sb.st === 'g' ? 'the particles are far apart.' : sb.st === 'l' ? 'the particles are close but irregular.' : 'the particles are packed regularly.')
      })), () => { need.st = true; fill(rowCells[sb.key].st, sb.st); done(); }, 'c1-opts3');
      ask(qs, 'Is it an element?', [
        { label: '✓ Yes', ok: true, why: 'Only <b>one kind of atom</b> → a pure substance and an element.' },
        { label: '✗ No', why: 'Count the kinds of atom: only one colour means only one kind of atom.' }
      ], () => { need.el = true; fill(rowCells[sb.key].pure, '✓'); fill(rowCells[sb.key].el, '✓'); done(); });
      const sym = sb.f.replace(/\d/g, ''), nm = sb.name.split(' (')[0];
      const formulaWhy = o => {
        if (o === sb.f) return /\d/.test(sb.f) ? 'The small number shows ' + sb.f.replace(/\D/g, '') + ' ' + nm + ' atoms in each molecule.'
          : sb.st === 's' ? cap(nm) + ' is made up of closely packed ' + sym + ' atoms, so its formula is just ' + sym + '.' : 'Each particle is a single ' + sym + ' atom.';
        if (/^\d/.test(o)) return 'A big number in front means separate atoms, not atoms joined in one molecule.';
        if (o.toLowerCase() === sb.f.toLowerCase()) return 'The second letter of a symbol must be lower case.';
        if (o.replace(/\d/g, '') !== sym) return 'Wrong symbol — the symbol of ' + nm + ' is <b>' + sym + '</b>.';
        return 'Right symbol, wrong number — count the atoms in <b>one</b> particle.';
      };
      ask(qs, 'Chemical formula? <span class="tiny">(' + sb.desc + ')</span>', A.shuffle(sb.opts).map(o => ({ label: F(o), ok: o === sb.f, why: formulaWhy(o) })),
        () => { need.f = true; fill(rowCells[sb.key].f, F(sb.f)); done(); });
    }
    next();
  }

  // molecule builder
  const SHAPES = { 1: [[0, 0]], 2: [[-15, 0], [15, 0]], 3: [[-26, 9], [26, 9], [0, -9]], 4: [[-17, -1], [17, -1], [0, -20], [0, 15]] };
  const ATOM_R = 18;
  function atomG(el, x, y, r) {
    return h('g', null, h('circle', { class: 'atom', cx: x, cy: y, r, fill: A.atomColor(el) }),
      h('text', { x, y: y + 1, class: 'c1-atomtext', 'font-size': (el.length > 1 ? r * .72 : r * .85).toFixed(1) }, el));
  }
  function formulaOf(atoms) {
    if (!atoms.length) return '<span class="muted" style="font-size:18px">formula appears here</span>';
    const counts = {}; atoms.forEach(a => { counts[a] = (counts[a] || 0) + 1; });
    return Object.keys(counts).map(k => k + (counts[k] > 1 ? '<sub>' + counts[k] + '</sub>' : '')).join('');
  }
  function moleculeBuilder(card) {
    const TARGETS = [{ name: 'argon', el: 'Ar', n: 1 }, { name: 'oxygen', el: 'O', n: 2 }, { name: 'ozone', el: 'O', n: 3 }, { name: 'bromine', el: 'Br', n: 2 }, { name: 'phosphorus', el: 'P', n: 4 }];
    let ti = 0, atoms = [], busy = false;
    const chips = h('div', { class: 'c1-targets' }, TARGETS.map(t => h('span', { text: t.name })));
    const prompt = h('div', { class: 'c1-prompt' });
    const area = svg(240, 120, 'Molecule build area', 'c1-svg c1-build');
    const formula = h('div', { class: 'c1-formula' });
    const fb = h('div', { class: 'feedback center' });
    const tray = h('div', { class: 'c1-tray' }, ['Ar', 'O', 'Br', 'P'].map(el =>
      h('button', { type: 'button', class: 'c1-atombtn', style: { background: A.atomColor(el) }, 'aria-label': 'Add ' + bySym[el].name + ' atom', text: el, on: { click: () => add(el) } })));
    const actions = h('div', { class: 'c1-actions' },
      btn('↶ Undo', () => { if (busy) return; atoms.pop(); A.sound('click'); draw(); }, 'btn-sm'),
      btn('Clear', () => { if (busy) return; atoms = []; A.sound('click'); draw(); }, 'btn-sm btn-ghost'),
      btn('Check ✓', check, 'btn-primary'));
    card.body.appendChild(chips);
    card.body.appendChild(prompt);
    card.body.appendChild(area);
    card.body.appendChild(formula);
    card.body.appendChild(tray);
    card.body.appendChild(actions);
    card.body.appendChild(fb);
    function add(el) {
      if (busy || ti >= TARGETS.length) return;
      if (atoms.length >= 4) { fb.className = 'feedback center bad'; fb.textContent = 'Max 4 atoms in this builder — tap Undo.'; A.sound('bad'); return; }
      atoms.push(el); A.sound('pop'); fb.textContent = ''; draw();
    }
    function draw() {
      clear(area);
      const pts = SHAPES[atoms.length] || [];
      const order = atoms.map((el, i) => ({ el, x: 120 + pts[i][0], y: 62 + pts[i][1] })).sort((a, b) => a.y - b.y);
      order.forEach(a => area.appendChild(atomG(a.el, a.x, a.y, ATOM_R)));
      if (!atoms.length) area.appendChild(txt(120, 66, 'tap atoms below to build', 'c1-t2 c1-mid'));
      formula.innerHTML = formulaOf(atoms);
      const kinds = new Set(atoms).size;
      if (kinds > 1) { fb.className = 'feedback center bad'; fb.innerHTML = '⚠️ Two kinds of atom — that is <b>not an element</b>!'; }
    }
    function setTarget() {
      chips.querySelectorAll('span').forEach((s, i) => { s.className = i < ti ? 'ok' : i === ti ? 'now' : ''; });
      card.score.textContent = Math.min(ti, TARGETS.length) + ' / ' + TARGETS.length;
      if (ti >= TARGETS.length) {
        prompt.innerHTML = '🏆 All five built!';
        fb.className = 'feedback center good'; fb.innerHTML = 'One kind of atom each → all <b>elements</b>. The subscript tells you how many atoms are in one molecule.';
        A.reward('c1-builder', 15, 'Molecule builder'); A.celebrate(.6); A.sound('win');
        return;
      }
      prompt.innerHTML = 'Build one molecule of <b>' + TARGETS[ti].name + '</b>';
    }
    function check() {
      const tg = TARGETS[ti]; if (!tg || busy) return;
      const kinds = new Set(atoms);
      if (!atoms.length) { fb.className = 'feedback center bad'; fb.textContent = 'Add some atoms first!'; return; }
      if (kinds.size === 1 && atoms[0] === tg.el && atoms.length === tg.n) {
        fb.className = 'feedback center good'; fb.innerHTML = '✅ ' + cap(tg.name) + ' = <b>' + F(tg.el + (tg.n > 1 ? tg.n : '')) + '</b>' + (tg.n === 1 ? ' — a molecule of just one atom!' : ' — ' + tg.n + ' atoms chemically combined.');
        A.sound('good'); A.celebrate(.25);
        ti++; busy = true;
        A.later(() => { busy = false; atoms = []; draw(); setTarget(); }, 1300);
        return;
      }
      A.sound('bad'); shakeEl(area);
      fb.className = 'feedback center bad';
      if (kinds.size > 1) fb.innerHTML = '❌ An element has only <b>one kind of atom</b>.';
      else if (atoms[0] !== tg.el) fb.innerHTML = '❌ That is ' + bySym[atoms[0]].name + '. The symbol of ' + tg.name + ' is <b>' + tg.el + '</b>.';
      else fb.innerHTML = '❌ Right atom, wrong number: one ' + tg.name + ' molecule has <b>' + tg.n + '</b> atom' + (tg.n > 1 ? 's' : '') + '.';
    }
    draw(); setTarget();
  }

  function countGame(card) {
    const TYPES = [
      { name: 'argon', f: 'Ar', m: MOL.atom('Ar', 8), a: 1, opts: ['Ar', 'Ar2', 'A'] },
      { name: 'oxygen', f: 'O2', m: MOL.di('O', 'O', 7), a: 2, opts: ['O2', 'O', '2O'] },
      { name: 'ozone', f: 'O3', m: MOL.tri('O', 6.5), a: 3, opts: ['O3', '3O', 'O2'] },
      { name: 'bromine', f: 'Br2', m: MOL.di('Br', 'Br', 7), a: 2, opts: ['Br2', 'Br', 'B2'] },
      { name: 'phosphorus', f: 'P4', m: MOL.p4('P', 6.5), a: 4, opts: ['P4', '4P', 'P'] }
    ];
    const stage = h('div');
    card.body.appendChild(stage);
    let rounds, i, score;
    function start() {
      const kinds = A.shuffle(['atoms', 'molecules', 'formula', 'atoms', 'atoms', 'molecules']);
      rounds = kinds.map((k, j) => ({ k, t: TYPES[(j + Math.floor(Math.random() * 5)) % 5], n: 2 + Math.floor(Math.random() * 4) }));
      i = 0; score = 0; next();
    }
    function next() {
      if (i >= rounds.length) return end();
      const r = rounds[i];
      card.score.textContent = (i + 1) + '/' + rounds.length + ' · ⭐ ' + score;
      clear(stage);
      const q = { atoms: 'How many <b>atoms</b> are in the box?', molecules: 'How many <b>molecules</b> are in the box?', formula: 'What is the <b>chemical formula</b> of this element?' }[r.k];
      const right = r.k === 'atoms' ? r.n * r.t.a : r.k === 'molecules' ? r.n : r.t.f;
      let opts;
      if (r.k === 'formula') opts = r.t.opts.concat(['X']).slice(0, 3);
      else { const set = new Set([right]); [right + r.t.a, right - 1, right + 1, right * 2, r.n * r.t.a + 2].forEach(v => { if (v > 0 && set.size < 4) set.add(v); }); opts = [...set]; }
      stage.appendChild(h('div', { class: 'c1-prompt', html: q }));
      stage.appendChild(h('div', { class: 'c1-center pop-in' }, pbox({ w: 200, h: 120, layout: 'gas', seed: 1 + Math.floor(Math.random() * 1e6), groups: [{ m: r.t.m, n: r.n }], motion: 'bounce', speed: 14, space: 12, maxW: 260, aria: r.n + ' particles of ' + r.t.name })));
      const holder = h('div');
      stage.appendChild(holder);
      const why = r.k === 'formula' ? 'Each ' + r.t.name + ' molecule has ' + r.t.a + ' atom' + (r.t.a > 1 ? 's' : '') + ' → ' + F(r.t.f) + '.'
        : r.k === 'molecules' ? r.n + ' separate particles = ' + r.n + ' molecules' + (r.t.a === 1 ? ' (each is a single atom).' : '.')
          : r.n + ' molecules × ' + r.t.a + ' atom' + (r.t.a > 1 ? 's' : '') + ' each = ' + right + ' atoms.';
      ask(holder, '', A.shuffle(opts).map(o => ({ label: r.k === 'formula' ? F(o) : String(o), ok: o === right, why: o === right ? why : 'Try again — ' + (r.k === 'formula' ? 'count the atoms in ONE particle.' : 'count carefully!') })),
        first => { if (first) score++; card.score.textContent = (i + 1) + '/' + rounds.length + ' · ⭐ ' + score; A.later(() => { i++; next(); }, 1500); });
    }
    function end() {
      const great = score >= 5;
      if (great) { A.celebrate(.5); A.sound('win'); }
      A.reward('c1-count', 10, 'Atom counter');
      card.score.textContent = '⭐ ' + score + '/' + rounds.length;
      clear(stage);
      stage.appendChild(doneScreen(great ? '🧮' : '💪', score + ' / ' + rounds.length + ' first-try answers', 'Formula subscript = atoms in <b>one</b> molecule. Atoms in the box = molecules × subscript.', start));
    }
    start();
  }

  function lessonMolecules(root) {
    root.appendChild(A.keybox('<b>Microscopically</b>, each <b>element</b> is made up of <b>one kind of atom</b> only.'));
    root.appendChild(A.keybox('An <b>' + T('atom', '原子') + '</b> is the basic unit of matter. A <b>' + T('molecule', '分子') + '</b> is a kind of <b>discrete, neutral</b> particle. It is formed by <b>one atom</b>, or <b>more than one atom chemically combined</b> together.'));
    const n = A.noteCard('Chemical formulae', `
      <ul>
        <li>The ${T('chemical formula', '化學式')} of an element shows the atoms in <b>one particle</b>.</li>
        <li>The small number (subscript) = <b>number of atoms</b> in one molecule: ${F('O2')} has 2 O atoms, ${F('P4')} has 4 P atoms. No number = one atom.</li>
      </ul>`, 'Notes');
    // one molecule drawn in the middle of its own little box
    const mol = (m, f, d) => {
      const s = h('svg', { class: 'pbox c1-pbox', viewBox: '0 0 96 70', width: 96, height: 70, role: 'img', 'aria-label': 'one particle of ' + F(f).replace(/<\/?sub>/g, '') + ': ' + d });
      s.appendChild(h('g', { transform: 'translate(48,36)' }, m.slice().sort((a, b) => a.y - b.y).map(a => h('circle', { class: 'atom', cx: a.x, cy: a.y, r: a.r, fill: A.atomColor(a.el) }))));
      return h('figure', null, s, h('figcaption', { html: '<span class="formula">' + F(f) + '</span><small>' + d + '</small>' }));
    };
    n.appendChild(h('div', { class: 'c1-mini' },
      mol(MOL.atom('Ar', 11), 'Ar', 'a single atom'), mol(MOL.di('O', 'O', 11), 'O2', '2 atoms'), mol(MOL.tri('O', 10), 'O3', '3 atoms'), mol(MOL.p4('P', 11), 'P4', '4 atoms')));
    root.appendChild(n);

    const tb = A.playCard('Complete the classwork table', 'Study each particle diagram, then fill in its row. Watch the book’s table fill up below!', '📋 Classwork');
    tableBuilder(tb);
    root.appendChild(tb);

    const mb = A.playCard('Molecule builder', 'Tap atoms to build one molecule of each element. The formula updates as you build.', '🧩 Build');
    moleculeBuilder(mb);
    root.appendChild(mb);

    const cg = A.playCard('Count the atoms', 'The molecules keep moving — count fast! 6 rounds.', '🧮 Play');
    countGame(cg);
    root.appendChild(cg);

    const kp = h('section', { class: 'card' }, h('div', { class: 'card-title' }, h('span', { class: 'card-tag', text: '📖 Key words' }), h('h3', { text: 'Fill in the definitions' })));
    kp.appendChild(A.cloze('Microscopically, each element is made up of one kind of [[atom]] only. A [[molecule]] is a kind of [[discrete]], [[neutral]] particle. It is formed by one atom, or more than one atom [[chemically]] combined together.', { rewardKey: 'c1-def-mol', xp: 10 }));
    root.appendChild(kp);

    A.quickCheck(root, 'ch1', 'ch1-3', 5);
  }

  /* =========================================================
     LESSON 1.3 — Classification of elements
     ========================================================= */
  function quickFire(card) {
    const pool = ELS.concat(EXTRAS.filter(e => e.st === 'g'));
    const area = h('div');
    card.body.appendChild(area);
    function intro() {
      const best = store.get('qf-best');
      clear(area);
      area.appendChild(h('div', { class: 'c1-done' },
        h('div', { class: 'c1-emoji float', text: '⚡' }),
        h('p', { class: 'muted', html: '<b>30 seconds.</b> Is each element a solid, liquid or gas at room conditions?' + (best != null ? '<br>Your best: <b>' + best + '</b>' : '') }),
        btn('Start ⚡', play, 'btn-primary btn-lg')));
    }
    function play() {
      let left = 30, score = 0, streak = 0, over = false, deck = A.shuffle(pool), cur = null;
      const bar = h('i', { style: { width: '100%', transition: 'width .1s linear' } });
      const clock = h('span', { class: 'quiz-timer', text: '⏱ 30' });
      const tile = h('div', { class: 'c1-qf-tile' });
      const fb = h('div', { class: 'feedback center' });
      const btns = h('div', { class: 'c1-qf-btns' }, ['s', 'l', 'g'].map(st => btn(ST_ICON[st] + ' ' + ST[st], () => answer(st))));
      clear(area);
      area.appendChild(h('div', { class: 'c1-qf-top' }, h('div', { class: 'progress' }, bar), clock));
      area.appendChild(tile); area.appendChild(btns); area.appendChild(fb);
      function next() {
        if (!deck.length) deck = A.shuffle(pool);
        cur = deck.pop();
        tile.innerHTML = '<span class="sy">' + cur.sym + '</span><span class="nm">' + cur.name + '</span>';
        tile.classList.remove('pop-in'); void tile.offsetWidth; tile.classList.add('pop-in');
      }
      function answer(st) {
        if (over) return;
        if (st === cur.st) { score++; streak++; A.sound('pop'); fb.className = 'feedback center good'; fb.textContent = '✓ ' + (streak > 2 ? '🔥 ' + streak + ' in a row!' : 'Yes!'); }
        else { streak = 0; A.sound('bad'); fb.className = 'feedback center bad'; fb.textContent = '✗ ' + cap(cur.name) + ' is a ' + ST[cur.st].toLowerCase() + '.'; shakeEl(tile); }
        card.score.textContent = '⭐ ' + score;
        next();
      }
      const id = A.every(() => {
        left = Math.max(0, left - .1); bar.style.width = (left / 30 * 100) + '%';
        clock.textContent = '⏱ ' + Math.ceil(left);
        if (left <= 5) clock.classList.add('low');
        if (left <= 0) end();
      }, 100);
      function end() {
        if (over) return; over = true; clearInterval(id);
        const best = store.get('qf-best'), isBest = best == null || score > best;
        if (isBest) store.set('qf-best', score);
        A.reward('c1-qf', 15, 'Quick-fire');
        if (isBest && score >= 8) A.celebrate(.7);
        A.sound('win');
        clear(area);
        area.appendChild(doneScreen(isBest ? '🏆' : '⚡', score + ' correct', isBest ? 'New personal best!' : 'Best: ' + best + '. Remember: 11 gases, 2 liquids (mercury, bromine), the rest are solids.', play));
      }
      card.score.textContent = '⭐ 0';
      next();
    }
    intro();
  }

  function lessonClassify(root) {
    const gases = ['hydrogen', 'helium', 'nitrogen', 'oxygen', 'fluorine', 'neon', 'chlorine', 'argon'];
    root.appendChild(A.noteCard('By physical state (at room conditions)', `
      <ul>
        <li><b>11 elements are gases</b>, e.g. ${gases.join(', ')}.</li>
        <li><b>2 elements are liquids</b>: <b>mercury</b> and <b>bromine</b>.</li>
        <li>The other elements are <b>solids</b>, e.g. iron, carbon, silicon.</li>
      </ul>`, 'Notes'));

    const ex = A.playCard('Periodic table colour explorer', 'Switch the colours between <b>physical state</b> and <b>metal / semi-metal / non-metal</b>.', '🎨 Explore');
    let info = emptyInfo();
    const pt = periodicTable({ items: ALL, mode: 'state', onTap: (e, b) => { Object.values(pt.tiles).forEach(x => x.classList.remove('sel')); b.classList.add('sel'); A.sound('pop'); const n = elInfo(e); info.replaceWith(n); info = n; } });
    const legend = h('div', { class: 'c1-legend' });
    const LEG = {
      state: [['st-s', '🧊 Solid'], ['st-l', '💧 Liquid'], ['st-g', '💨 Gas']],
      class: [['cl-me', 'Metal'], ['cl-se', 'Semi-metal (metalloid)'], ['cl-nm', 'Non-metal']]
    };
    function setLegend(m) { clear(legend); LEG[m].forEach(([c, l]) => legend.appendChild(h('span', null, h('i', { class: 'c1-key ' + c }), l))); }
    const view = seg([{ label: 'By state', value: 'state' }, { label: 'By type', value: 'class' }], v => { view.select(v); pt.grid.setMode(v); setLegend(v); A.sound('whoosh'); A.reward('c1-explorer', 5, 'Colour explorer'); }, 'Colour by');
    view.select('state'); setLegend('state');
    ex.body.appendChild(view); ex.body.appendChild(legend); ex.body.appendChild(pt); ex.body.appendChild(info);
    root.appendChild(ex);

    const mn = A.noteCard('Metals, semi-metals and non-metals', `
      <ul>
        <li><b>All ${T('metals', '金屬')} are solids except mercury</b> (e.g. iron Fe, aluminium Al).</li>
        <li><b>${T('Non-metals', '非金屬')} can be solids, liquids or gases</b> (e.g. sulphur S, bromine Br, oxygen O).</li>
        <li>Some elements (e.g. boron B, silicon Si) are ${T('semi-metals', '半金屬')} (also called <b>${T('metalloids', '類金屬')}</b>). They have properties of <b>both metals and non-metals</b>.</li>
      </ul>`, 'Notes');
    const ex3 = [['Metals in the book', 'cl-me', ['Cu', 'Pb', 'Sn', 'Ni', 'Zn']], ['Non-metals in the book', 'cl-nm', ['C', 'S']], ['Semi-metals in the book', 'cl-se', ['B', 'Si']]];
    ex3.forEach(([t, c, syms]) => mn.appendChild(h('div', { class: 'c1-gap' }, h('span', { class: 'c1-label', text: t }),
      h('div', { class: 'c1-tags' }, syms.map(s => h('span', { class: 'c1-tag ' + c, html: '<b>' + s + '</b> ' + bySym[s].name }))))));
    mn.appendChild(h('p', { class: 'tiny', style: { marginTop: '10px', marginBottom: 0 }, text: 'The book also pictures steel — a mixture of elements (an alloy), which you will meet in Chapter 2.' }));
    root.appendChild(mn);

    const sg = A.playCard('Metal, semi-metal or non-metal?', 'Tap an element, then tap its box.');
    const items = [
      ['iron <b>Fe</b>', 'me'], ['aluminium <b>Al</b>', 'me'], ['copper <b>Cu</b>', 'me'], ['lead <b>Pb</b>', 'me'], ['tin <b>Sn</b>', 'me'], ['zinc <b>Zn</b>', 'me'],
      ['mercury <b>Hg</b>', 'me', 'Mercury is a liquid — but it is still a metal!'], ['sodium <b>Na</b>', 'me'],
      ['sulphur <b>S</b>', 'nm'], ['bromine <b>Br</b>', 'nm', 'Bromine is a liquid non-metal.'], ['oxygen <b>O</b>', 'nm'], ['carbon <b>C</b>', 'nm', 'Carbon is a non-metal (diamond and graphite are forms of carbon).'], ['iodine <b>I</b>', 'nm'],
      ['boron <b>B</b>', 'se', 'Boron has properties of both metals and non-metals.'], ['silicon <b>Si</b>', 'se', 'Silicon is a semi-metal — used in computer chips.']
    ].map(([label, bucket, hint]) => ({ label, bucket, hint }));
    sg.body.appendChild(A.sortGame({ buckets: [{ id: 'me', title: 'Metals', icon: '🔩' }, { id: 'se', title: 'Semi-metals', icon: '💻' }, { id: 'nm', title: 'Non-metals', icon: '🌫️' }], items, rewardKey: 'c1-sort-type', xp: 15 }));
    root.appendChild(sg);

    const qf = A.playCard('Gas, liquid or solid? Quick-fire', 'How many can you get right in 30 seconds?', '⚡ Speed');
    quickFire(qf);
    root.appendChild(qf);

    const kp = h('section', { class: 'card' }, h('div', { class: 'card-title' }, h('span', { class: 'card-tag', text: '📖 Key facts' }), h('h3', { text: 'Fill in the blanks' })));
    kp.appendChild(A.cloze('At room conditions, [[11|eleven]] elements are gases and [[2|two]] elements are liquids: mercury and [[bromine]]. All metals are solids except [[mercury]]. Boron and silicon are [[semi-metals|metalloids|semi metals|semimetals|semi-metal|metalloid]] — they have properties of both metals and non-metals.', { rewardKey: 'c1-def-cls', xp: 10 }));
    root.appendChild(kp);

    A.quickCheck(root, 'ch1', 'ch1-4', 5);
  }

  /* =========================================================
     LESSON 1.4 — Experiment 1.1 & general properties
     ========================================================= */
  const SAMPLES = [
    { id: 'cu', name: 'copper', col: '#d27c4b', edge: '#9b5530', metal: true },
    { id: 'fe', name: 'iron', col: '#8f979f', edge: '#5d646c', metal: true },
    { id: 'mg', name: 'magnesium', col: '#b9bec6', edge: '#7f858e', metal: true },
    { id: 'al', name: 'aluminium', col: '#d3d8de', edge: '#8e959d', metal: true },
    { id: 's', name: 'sulphur', col: '#f2c94c', edge: '#b38f1f', metal: false, lump: true },
    { id: 'gr', name: 'graphite', col: '#4a4f58', edge: '#7a818c', metal: false, graphite: true }
  ];
  SAMPLES.forEach(s => { s.shiny = s.metal || !!s.graphite; s.malleable = s.metal; s.conducts = s.metal || !!s.graphite; });
  const LUMP = [[-.5, .28], [-.44, -.18], [-.2, -.46], [.1, -.38], [.36, -.5], [.5, -.06], [.44, .4], [.12, .5], [-.24, .46]];
  // sampleArt -> {g, setPolish(k)} centred on (cx, cy)
  function sampleArt(smp, cx, cy, w, hh, polished) {
    const g = h('g');
    const inner = h('g', { transform: 'translate(' + cx + ',' + cy + ')' });
    g.appendChild(inner);
    let film = null, shine = null;
    if (smp.lump) {
      inner.appendChild(h('polygon', { points: LUMP.map(p => (p[0] * w).toFixed(1) + ',' + (p[1] * hh).toFixed(1)).join(' '), fill: smp.col, stroke: smp.edge, 'stroke-width': 1.5 }));
      [[-.22, -.1], [.15, .12], [.3, -.2], [-.05, .25], [-.32, .18]].forEach(p => inner.appendChild(h('circle', { cx: (p[0] * w).toFixed(1), cy: (p[1] * hh).toFixed(1), r: 1.8, fill: '#c9a227', opacity: .7 })));
    } else {
      const id = uid('sh');
      inner.appendChild(h('defs', null, h('linearGradient', { id, x1: 0, y1: 0, x2: 1, y2: 1 },
        h('stop', { offset: 0, 'stop-color': '#fff', 'stop-opacity': 0 }), h('stop', { offset: .3, 'stop-color': '#fff', 'stop-opacity': .75 }),
        h('stop', { offset: .42, 'stop-color': '#fff', 'stop-opacity': 0 }), h('stop', { offset: .62, 'stop-color': '#fff', 'stop-opacity': .45 }),
        h('stop', { offset: .72, 'stop-color': '#fff', 'stop-opacity': 0 }))));
      inner.appendChild(h('rect', { x: -w / 2, y: -hh / 2, width: w, height: hh, rx: 3, fill: smp.col, stroke: smp.edge, 'stroke-width': 1.5 }));
      film = h('rect', { x: -w / 2, y: -hh / 2, width: w, height: hh, rx: 3, fill: '#6b6f76', opacity: polished ? 0 : (smp.graphite ? .35 : .55) });
      shine = h('rect', { x: -w / 2, y: -hh / 2, width: w, height: hh, rx: 3, fill: 'url(#' + id + ')', opacity: polished ? (smp.graphite ? .5 : 1) : 0 });
      inner.appendChild(film); inner.appendChild(shine);
    }
    return {
      g, inner,
      setPolish(k) {
        if (!film) return;
        film.setAttribute('opacity', ((1 - k) * (smp.graphite ? .35 : .55)).toFixed(2));
        shine.setAttribute('opacity', (k * (smp.graphite ? .5 : 1)).toFixed(2));
      }
    };
  }

  // Step 1 (copper only, as in the book): polish with sandpaper. Other samples: step 2 only — look closely.
  function polishScene(smp, lookOnly) {
    const s = svg(360, 210, (lookOnly ? 'Looking closely at the ' : 'Polishing the ') + smp.name + (lookOnly ? '' : ' with sandpaper'), 'c1-svg');
    s.appendChild(h('line', { x1: 20, y1: 168, x2: 340, y2: 168, stroke: 'var(--line-2)', 'stroke-width': 3, 'stroke-linecap': 'round' }));
    const art = sampleArt(smp, 180, 136, 170, 52, !!lookOnly);
    s.appendChild(art.g);
    const tool = lookOnly
      ? h('g', { transform: 'translate(100,0)' },
        h('line', { x1: 18, y1: 118, x2: 40, y2: 146, stroke: '#6b4a2b', 'stroke-width': 7, 'stroke-linecap': 'round' }),
        h('circle', { cx: 0, cy: 96, r: 26, fill: '#dff1ff', 'fill-opacity': .35, stroke: '#4f565f', 'stroke-width': 5 }),
        h('text', { x: 0, y: 60, class: 'c1-t2 c1-mid' }, 'look closely'))
      : h('g', { transform: 'translate(180,0)' },
        h('rect', { x: -38, y: 92, width: 76, height: 30, rx: 3, fill: '#e3b57c', stroke: '#b5834a', 'stroke-width': 1.5 }),
        [[-28, 100], [-15, 112], [-2, 99], [10, 110], [22, 101], [30, 114], [-24, 116], [4, 117]].map(p => h('circle', { cx: p[0], cy: p[1], r: 1.4, fill: '#9c6b37' })),
        h('text', { x: 0, y: 87, class: 'c1-t2 c1-mid' }, 'sandpaper'));
    s.appendChild(tool);
    const fx = h('g');
    s.appendChild(fx);
    return {
      svg: s,
      run(cb) {
        A.sound(lookOnly ? 'whoosh' : 'fizz');
        tween(lookOnly ? 1100 : 1500, k => {
          if (lookOnly) tool.setAttribute('transform', 'translate(' + (100 + 160 * ease(k)).toFixed(1) + ',0)');
          else {
            tool.setAttribute('transform', 'translate(' + (180 + Math.sin(k * Math.PI * 8) * 50).toFixed(1) + ',0)');
            if (smp.shiny) art.setPolish(ease(k));
          }
        }, () => {
          tween(350, k => { tool.setAttribute('transform', 'translate(' + (lookOnly ? 260 : 180) + ',' + (-60 * k).toFixed(1) + ')'); tool.setAttribute('opacity', (1 - k).toFixed(2)); });
          if (smp.metal) [[110, 108], [255, 112], [230, 160], [130, 158]].forEach(p => fx.appendChild(sparkle(p[0], p[1], 8)));
          else if (smp.graphite) [[242, 116]].forEach(p => fx.appendChild(sparkle(p[0], p[1], 5)));
          else if (!lookOnly) [[120, 166], [140, 165], [215, 166], [236, 165], [252, 166]].forEach(p => fx.appendChild(h('circle', { cx: p[0], cy: p[1], r: 2, fill: '#e2b93b' })));
          A.sound(smp.shiny ? 'good' : 'click');
          if (cb) cb();
        });
      }
    };
  }

  function hammerScene(smp) {
    const s = svg(360, 210, 'Hitting the ' + smp.name + ' with a hammer on a wooden board', 'c1-svg');
    s.appendChild(h('rect', { x: 70, y: 150, width: 220, height: 22, rx: 3, fill: '#c8925a', stroke: '#9c6a3a', 'stroke-width': 1.5 }));
    ['M80 157 Q150 154 220 158 T285 156', 'M84 165 Q160 162 240 166 T286 164'].forEach(d => s.appendChild(h('path', { d, stroke: '#a8743f', 'stroke-width': 1.2, fill: 'none', opacity: .7 })));
    s.appendChild(txt(180, 196, 'wooden board', 'c1-t2 c1-mid'));
    const art = sampleArt(smp, 180, 140, 100, 20, true);
    s.appendChild(art.g);
    const frags = h('g'); s.appendChild(frags);
    const hammer = h('g', { transform: 'rotate(35 318 114)' },
      h('rect', { x: 198, y: 109, width: 122, height: 10, rx: 4, fill: '#9a6436', stroke: '#6e4524', 'stroke-width': 1.2 }),
      h('rect', { x: 160, y: 92, width: 40, height: 36, rx: 4, fill: '#7d8590', stroke: '#4f565f', 'stroke-width': 1.5 }),
      h('rect', { x: 160, y: 92, width: 40, height: 8, rx: 3, fill: '#a3abb5' }));
    s.appendChild(hammer);
    const sticker = h('g', { opacity: 0 });
    s.appendChild(sticker);
    const setRot = a => hammer.setAttribute('transform', 'rotate(' + a.toFixed(1) + ' 318 114)');
    return {
      svg: s,
      run(cb) {
        tween(260, k => setRot(35 + 10 * ease(k)), () => tween(150, k => setRot(45 - (smp.malleable ? 48.5 : 45) * k * k), () => {
          A.sound(smp.malleable ? 'pop' : 'fizz');
          if (smp.malleable) {
            tween(220, k => art.g.setAttribute('transform', 'translate(180,150) scale(' + (1 + .45 * k).toFixed(3) + ',' + (1 - .5 * k).toFixed(3) + ') translate(-180,-150)'));
            sticker.appendChild(txt(180, 60, '🥞 flattened!', 'c1-sticker c1-t c1-mid'));
          } else {
            art.g.setAttribute('opacity', 0);
            const R = A.rng(7);
            for (let i = 0; i < 9; i++) {
              const x0 = 140 + i * 10, w = 7 + R() * 7, hh = 5 + R() * 6, dx = (i - 4) * (7 + R() * 6), rot = R() * 180;
              const f = h('polygon', { points: [[-w / 2, -hh / 2], [w / 2, -hh / 3], [w / 3, hh / 2], [-w / 2, hh / 3]].map(p => p.join(',')).join(' '), fill: smp.col, stroke: smp.edge, 'stroke-width': 1 });
              frags.appendChild(f);
              tween(500, k => { const y = 140 + (146 - 140) * k - Math.sin(k * Math.PI) * (16 + R() * 2); f.setAttribute('transform', 'translate(' + (x0 + dx * k).toFixed(1) + ',' + y.toFixed(1) + ') rotate(' + (rot * k).toFixed(0) + ')'); });
            }
            sticker.appendChild(txt(180, 60, '💥 shattered!', 'c1-sticker c1-t c1-mid'));
          }
          sticker.setAttribute('opacity', 1);
          A.later(() => tween(400, k => setRot(-3 + 33 * ease(k)), cb), 350);
        }));
      }
    };
  }

  function circuitScene(smp) {
    const art = sampleArt(smp, 258, 166, 84, 18, true);
    const c = circuit(art.g, { aria: 'Testing whether ' + smp.name + ' conducts electricity' });
    return {
      svg: c.svg,
      run(cb) {
        c.connect(() => {
          if (smp.conducts) { c.setOn(true); A.sound('good'); }
          else { c.svg.appendChild(txt(180, 56, '✗', 'c1-t c1-mid', { 'font-size': 18, fill: 'var(--bad)', style: { fill: 'var(--bad)' } })); A.sound('bad'); }
          A.later(cb, 500);
        });
      }
    };
  }

  function exp11(card) {
    const RES = {}; // id -> {app, ham, cond, cls}
    let cur = null, step = 0, gen = 0; // gen: ignore animation callbacks from a step the user has left
    const picker = h('div', { class: 'c1-row c1-picker', role: 'group', 'aria-label': 'Choose a sample' });
    const chips = {};
    SAMPLES.forEach(smp => {
      const b = h('button', { type: 'button', class: 'chip' }, h('span', { class: 'c1-swatch', style: { background: smp.col } }), smp.name);
      b.addEventListener('click', () => select(smp));
      chips[smp.id] = b; picker.appendChild(b);
    });
    const STEPS = ['1–2 Polish', '3 Hammer', '4 Circuit', '5 Classify']; // the book's step numbers
    const stepsBar = h('div', { class: 'c1-steps' }, STEPS.map(s => h('div', { class: 'c1-step', text: s })));
    const stage = h('div', { class: 'c1-stage' });
    const actions = h('div', { class: 'c1-actions' });
    const askBox = h('div');
    // results table (book layout)
    const cells = {};
    const tbody = h('tbody', null, SAMPLES.map(smp => {
      cells[smp.id] = { row: null, app: h('td', { text: '—' }), ham: h('td', { text: '—' }), cond: h('td', { text: '—' }), cls: h('td', { text: '—' }) };
      const tr = h('tr', null, h('td', { html: '<b>' + smp.name + '</b>' }), cells[smp.id].app, cells[smp.id].ham, cells[smp.id].cond, cells[smp.id].cls);
      cells[smp.id].row = tr; return tr;
    }));
    const table = h('div', { class: 'table-wrap c1-gap' }, h('table', { class: 't c1-results' },
      h('thead', h('tr', null, ['Sample', '2 · Appearance', '3 · Hammer', '4 · Conducts?', 'Classification'].map(x => h('th', { text: x })))), tbody));
    card.body.appendChild(picker);
    card.body.appendChild(stage);
    card.body.appendChild(stepsBar);
    card.body.appendChild(actions);
    card.body.appendChild(askBox);
    card.body.appendChild(table);
    function setCell(id, k, html) { const td = cells[id][k]; td.className = 'fill pop-in'; td.innerHTML = html; }
    function progress() { card.score.textContent = Object.values(RES).filter(r => r.cls).length + ' / 6 classified'; }
    function select(smp) {
      cur = smp; A.sound('click');
      Object.keys(chips).forEach(k => chips[k].classList.toggle('selected', k === smp.id));
      SAMPLES.forEach(x => cells[x.id].row.classList.toggle('cur', x.id === smp.id));
      RES[smp.id] = RES[smp.id] || {};
      go(0);
    }
    function go(i) {
      step = i;
      const g = ++gen, live = fn => (...a) => { if (g === gen) fn(...a); };
      const smp = cur, polish = smp.id === 'cu'; // book: polish the copper (step 1), then repeat steps 2–4 for the others
      stepsBar.children[0].textContent = polish ? STEPS[0] : '2 Look';
      [...stepsBar.children].forEach((el, j) => { el.className = 'c1-step' + (j < i ? ' done' : j === i ? ' now' : ''); });
      clear(actions); clear(askBox);
      if (i === 0) {
        const sc = polishScene(smp, !polish); clear(stage); stage.appendChild(sc.svg);
        const b = btn(polish ? '🧽 Step 1 · Polish with sandpaper' : '🔍 Step 2 · Look closely', () => { b.disabled = true; sc.run(live(() => {
          ask(askBox, 'Step 2 · Observe: is the ' + smp.name + ' shiny or dull?', [
            { label: '✨ Shiny', ok: smp.shiny, why: smp.shiny ? (smp.graphite ? 'Graphite is grey-black but slightly <b>shiny</b>.' : polish ? 'After polishing, the copper is <b>shiny</b> — like all metals.' : 'Yes — ' + smp.name + ' is <b>shiny</b>, like all metals.') : 'Look again — sulphur is a <b>dull</b> yellow solid.' },
            { label: '🌫️ Dull', ok: !smp.shiny, why: smp.shiny ? 'Look again — it is shiny!' : 'Yes — sulphur is <b>dull</b> (yellow).' }
          ], () => { RES[smp.id].app = true; setCell(smp.id, 'app', smp.shiny ? (smp.graphite ? 'shiny (grey-black)' : 'shiny') : 'dull (yellow)'); nextBtn(1); });
        })); }, 'btn-primary');
        actions.appendChild(b);
      } else if (i === 1) {
        const sc = hammerScene(smp); clear(stage); stage.appendChild(sc.svg);
        const b = btn('🔨 Step 3 · Hit it with the hammer', () => { b.disabled = true; sc.run(live(() => {
          ask(askBox, 'Step 3 · What happened when it was hit?', [
            { label: '🥞 Flattened into a sheet', ok: smp.malleable, why: smp.malleable ? 'It flattens without breaking → <b>malleable</b>.' : 'Look again — it broke into pieces!' },
            { label: '💥 Broke into small pieces', ok: !smp.malleable, why: smp.malleable ? 'Look again — it only got flatter!' : 'It breaks into small pieces → <b>brittle</b>.' }
          ], () => { RES[smp.id].ham = true; setCell(smp.id, 'ham', smp.malleable ? 'flattens (malleable)' : 'breaks (brittle)'); nextBtn(2); });
        })); }, 'btn-primary');
        actions.appendChild(b);
        actions.appendChild(h('div', { class: 'tiny', style: { width: '100%', textAlign: 'center' }, text: 'Teacher demonstration in the real lab.' }));
      } else if (i === 2) {
        const sc = circuitScene(smp); clear(stage); stage.appendChild(sc.svg);
        const b = btn('🔌 Step 4 · Connect the crocodile clips', () => { b.disabled = true; sc.run(live(() => {
          ask(askBox, 'Step 4 · Does the bulb light up?', [
            { label: '💡 Yes — it conducts', ok: smp.conducts, why: smp.conducts ? (smp.graphite ? 'Graphite <b>conducts electricity</b> — unusual for a non-metal!' : 'The bulb lights up → it <b>conducts electricity</b>.') : 'Look at the bulb — it stays dark.' },
            { label: '⚫ No — it does not conduct', ok: !smp.conducts, why: smp.conducts ? 'Look at the bulb — it is glowing!' : 'The bulb stays off → it <b>does not conduct</b> electricity.' }
          ], () => { RES[smp.id].cond = true; setCell(smp.id, 'cond', smp.conducts ? 'yes 💡' : 'no'); nextBtn(3); });
        })); }, 'btn-primary');
        actions.appendChild(b);
      } else {
        clear(stage);
        const s = svg(360, 150, smp.name + ' sample with its results', 'c1-svg');
        s.appendChild(sampleArt(smp, 180, 56, 120, 34, true).g);
        s.appendChild(txt(180, 104, (smp.shiny ? '✨ shiny' : '🌫️ dull') + '   ' + (smp.malleable ? '🥞 malleable' : '💥 brittle'), 'c1-t c1-mid', { 'font-size': 15 }));
        s.appendChild(txt(180, 128, smp.conducts ? '💡 conducts electricity' : '⚫ does not conduct', 'c1-t c1-mid', { 'font-size': 15 }));
        stage.appendChild(s);
        ask(askBox, 'Step 5 · Classify the ' + smp.name + ':', [
          { label: '🔩 Metal', ok: smp.metal, why: smp.metal ? 'Shiny, malleable and conducts → <b>metal</b>.' : (smp.graphite ? 'Careful! Graphite conducts, but it is <b>brittle</b> — it is carbon, a <b>non-metal</b>.' : 'Dull, brittle and does not conduct — not a metal.') },
          { label: '🌫️ Non-metal', ok: !smp.metal, why: smp.metal ? 'A brittle, dull solid would be a non-metal — this one is shiny and malleable.' : (smp.graphite ? 'Yes! Graphite is a <b>non-metal</b>. It is the famous <b>exception</b>: a non-metal that conducts electricity.' : 'Dull, brittle and does not conduct → <b>non-metal</b>.') }
        ], () => {
          RES[smp.id].cls = true; setCell(smp.id, 'cls', smp.metal ? '<b>metal</b>' : '<b>non-metal</b>');
          chips[smp.id].classList.add('donechip');
          [...stepsBar.children].forEach(el => { el.className = 'c1-step done'; });
          progress();
          const left = SAMPLES.filter(x => !(RES[x.id] && RES[x.id].cls));
          if (!left.length) {
            A.reward('c1-exp11', 25, 'Experiment 1.1'); A.celebrate(1); A.sound('win');
            askBox.appendChild(h('div', { class: 'explain good pop-in', html: '🏆 <b>Experiment complete!</b> Metals: copper, iron, magnesium, aluminium (shiny, malleable, conduct). Non-metals: sulphur and graphite (brittle). Graphite is the exception — a non-metal that conducts.' }));
          } else {
            actions.appendChild(btn('Next sample: ' + left[0].name + ' →', () => select(left[0]), 'btn-primary'));
          }
        });
      }
    }
    function nextBtn(i) { actions.appendChild(btn('Next step →', () => go(i), 'btn-primary')); }
    progress();
    select(SAMPLES[0]);
  }

  // Book step 4: "Draw a labelled circuit diagram" — tap a label, then its spot on the diagram
  function labelCircuit(card) {
    const PARTS = [
      { name: '6 V battery', x: 75, y: 167 }, { name: 'light bulb', x: 180, y: 48 },
      { name: 'crocodile clips', x: 192, y: 166 }, { name: 'connection wires', x: 95, y: 104 }
    ];
    const L = 'ABCD';
    const c = circuit(sampleArt(SAMPLES[0], 258, 166, 84, 18, true).g, { labels: false, aria: 'Circuit diagram for Experiment 1.1 with four parts marked A to D: label each part' });
    const wrap = h('div', { class: 'c1-lab-wrap' }, c.svg);
    let sel = null, done = 0, miss = 0;
    const fb = h('div', { class: 'feedback center', html: '👆 Tap a label, then tap its spot (A–D) on the diagram.' });
    const marks = PARTS.map((p, i) => {
      const m = h('button', { type: 'button', class: 'c1-mark', style: { left: (p.x / 360 * 100).toFixed(2) + '%', top: (p.y / 214 * 100).toFixed(2) + '%' }, 'aria-label': 'Spot ' + L[i], text: L[i] });
      m.addEventListener('click', () => place(i, m));
      wrap.appendChild(m);
      return m;
    });
    const chips = A.shuffle(PARTS.map((p, i) => i)).map(i => {
      const b = h('button', { type: 'button', class: 'chip', text: PARTS[i].name });
      b._i = i;
      b.addEventListener('click', () => pick(b));
      return b;
    });
    function pick(b) {
      if (b.disabled) return;
      if (sel) sel.classList.remove('selected');
      sel = b === sel ? null : b;
      if (sel) { sel.classList.add('selected'); A.sound('click'); }
      marks.forEach(m => m.classList.toggle('ready', !!sel && !m.disabled));
    }
    function place(i, m) {
      if (!sel) { fb.className = 'feedback center'; fb.textContent = '👆 Pick a label below first.'; return; }
      if (sel._i === i) {
        m.classList.remove('ready'); m.classList.add('ok'); m.disabled = true; m.textContent = '✓'; m.setAttribute('aria-label', 'Spot ' + L[i] + ': ' + PARTS[i].name);
        sel.classList.remove('selected'); sel.classList.add('good'); sel.disabled = true; sel.textContent = L[i] + ' · ' + PARTS[i].name + ' ✓';
        sel = null; done++; A.sound('pop');
        marks.forEach(x => x.classList.remove('ready'));
        card.score.textContent = done + ' / 4 labels';
        fb.className = 'feedback center good'; fb.textContent = '✓ ' + L[i] + ' is the ' + PARTS[i].name + '.';
        if (done === 4) {
          c.connect(() => c.setOn(true));
          A.later(() => { // turn the markers into the finished labelled diagram
            marks.forEach(x => { x.style.display = 'none'; });
            [[83, 204, '6 V battery', 'c1-mid'], [220, 44, 'light bulb', ''], [258, 202, 'crocodile clips', 'c1-mid'], [92, 97, 'connection wires', 'c1-mid']]
              .forEach(([x, y, t, k]) => c.root.appendChild(txt(x, y, t, 'c1-t2 ' + k)));
          }, 900);
          fb.innerHTML = (miss ? '🎉 Labelled!' : '🏆 Perfect labels!') + ' The sample (here copper) is connected <b>between the crocodile clips</b>. If the bulb lights up, the sample conducts electricity.';
          A.sound('win'); if (!miss) A.celebrate(.4);
          A.reward('c1-label-circuit', 10, 'Circuit labels');
        }
      } else {
        miss++; A.sound('bad');
        m.classList.add('no'); A.later(() => m.classList.remove('no'), 450);
        fb.className = 'feedback center bad'; fb.textContent = '✗ Spot ' + L[i] + ' is not the ' + PARTS[sel._i].name + ' — try another spot.';
      }
    }
    card.score.textContent = '0 / 4 labels';
    card.body.appendChild(h('div', { class: 'c1-stage' }, wrap));
    card.body.appendChild(h('div', { class: 'c1-lab-chips' }, chips));
    card.body.appendChild(fb);
  }

  const PROPS = [
    ['Physical state at room conditions <span class="tiny">(25 °C, 1 atm)</span>', 'solid<br><span class="tiny">exception: mercury (liquid)</span>', 'solid or gas<br><span class="tiny">exception: bromine (liquid)</span>'],
    ['Melting point and boiling point', 'usually <b>high</b><br><span class="tiny">exception: e.g. mercury, sodium</span>', 'usually <b>low</b><br><span class="tiny">exception: carbon (diamond, graphite)</span>'],
    ['Appearance of solids', '<b>shiny</b>', '<b>dull</b>'],
    ['Density', 'usually <b>high</b><br><span class="tiny">exception: e.g. sodium</span>', 'usually <b>low</b> (e.g. gases)'],
    ['Electrical conductivity', '<b>good</b> conductor of electricity', '<b>poor</b> conductor of electricity<br><span class="tiny">exception: graphite</span>'],
    ['Thermal conductivity', '<b>good</b> conductor of heat', '<b>poor</b> conductor of heat'],
    ['Hardness and strength', '<b>hard</b> and <b>strong</b><br><span class="tiny">exception: e.g. sodium (soft)</span>', '<b>soft</b> and <b>brittle</b><br><span class="tiny">exception: diamond (very hard)</span>'],
    ['Malleability and ductility', '<b>malleable</b> and <b>ductile</b>', 'not malleable or ductile — <b>brittle</b>']
  ];
  const RULES = [
    { rule: 'Metals are <b>solids</b> at room conditions.', ans: 'mercury', opts: ['mercury', 'iron', 'copper', 'aluminium'], why: 'Mercury is a metal, but it is a <b>liquid</b> at room conditions.' },
    { rule: 'Non-metals are <b>solids or gases</b> at room conditions.', ans: 'bromine', opts: ['bromine', 'oxygen', 'sulphur', 'iodine'], why: 'Bromine is a non-metal that is a <b>liquid</b>.' },
    { rule: 'Metals usually have <b>high melting points</b>.', ans: 'sodium', opts: ['sodium', 'iron', 'copper', 'platinum'], why: 'Sodium (like mercury) has a low melting point for a metal.' },
    { rule: 'Non-metals usually have <b>low melting points</b>.', ans: 'graphite', opts: ['graphite', 'sulphur', 'oxygen', 'bromine'], why: 'Carbon (graphite and diamond) has a <b>very high</b> melting point — around 3500 °C.' },
    { rule: 'Metals usually have a <b>high density</b>.', ans: 'sodium', opts: ['sodium', 'lead', 'iron', 'gold'], why: 'Sodium has a <b>low density</b> — it floats on water!' },
    { rule: 'Non-metals are <b>poor conductors</b> of electricity.', ans: 'graphite', opts: ['graphite', 'sulphur', 'diamond', 'oxygen'], why: 'Graphite is a non-metal that <b>conducts</b> electricity.' },
    { rule: 'Metals are <b>hard and strong</b>.', ans: 'sodium', opts: ['sodium', 'iron', 'copper', 'nickel'], why: 'Sodium is a <b>soft</b> metal.' },
    { rule: 'Non-metals are <b>soft and brittle</b>.', ans: 'diamond', opts: ['diamond', 'sulphur', 'graphite', 'iodine'], why: 'Diamond (carbon) is <b>very hard</b> — the hardest natural substance.' }
  ];
  const symOf = n => (n === 'graphite' || n === 'diamond') ? 'C' : (ALL.find(e => e.name === n) || {}).sym || '?';
  function exceptionHunter(card) {
    const stage = h('div');
    card.body.appendChild(stage);
    let order, i, score;
    function start() { order = A.shuffle(RULES); i = 0; score = 0; next(); }
    function next() {
      if (i >= order.length) return end();
      const r = order[i];
      card.score.textContent = (i + 1) + '/' + order.length + ' · ⭐ ' + score;
      clear(stage);
      stage.appendChild(h('div', { class: 'c1-rule pop-in', html: '<small>📜 The rule</small>' + r.rule }));
      stage.appendChild(h('div', { class: 'c1-ask-q', text: '🕵️ Which suspect breaks the rule?' }));
      const grid = h('div', { class: 'c1-suspects' });
      const fb = h('div', { class: 'feedback' });
      let over = false;
      A.shuffle(r.opts).forEach(n => {
        const b = h('button', { type: 'button', class: 'c1-suspect' }, h('span', { class: 'sy', text: symOf(n) }), h('span', { class: 'nm', text: n }));
        b.addEventListener('click', () => {
          if (over) return; over = true;
          grid.querySelectorAll('button').forEach(x => { x.disabled = true; if (x.lastChild.textContent === r.ans) x.classList.add('right'); });
          if (n === r.ans) { score++; A.sound('good'); fb.className = 'feedback good'; fb.innerHTML = '✅ Rule-breaker caught! ' + r.why; }
          else { b.classList.add('wrong'); A.sound('bad'); fb.className = 'feedback bad'; fb.innerHTML = '❌ ' + cap(n) + ' follows the rule. ' + r.why; }
          card.score.textContent = (i + 1) + '/' + order.length + ' · ⭐ ' + score;
          next2.style.display = '';
        });
        grid.appendChild(b);
      });
      const next2 = btn(i + 1 < order.length ? 'Next rule →' : 'See score', () => { i++; next(); }, 'btn-primary');
      next2.style.display = 'none';
      stage.appendChild(grid); stage.appendChild(fb); stage.appendChild(h('div', { class: 'q-actions' }, next2));
    }
    function end() {
      const great = score >= 7;
      if (great) { A.celebrate(.7); A.sound('win'); }
      A.reward('c1-exc', 15, 'Exception hunter');
      card.score.textContent = '⭐ ' + score + '/' + order.length;
      clear(stage);
      stage.appendChild(doneScreen(great ? '🕵️' : '💪', score + ' / ' + order.length + ' rule-breakers caught', 'The usual suspects: <b>mercury</b>, <b>bromine</b>, <b>sodium</b>, <b>graphite</b> and <b>diamond</b>.', start));
    }
    start();
  }

  function lessonProperties(root) {
    root.appendChild(A.noteCard('Experiment 1.1 · Classifying metals and non-metals', `
      <ol>
        <li><b>Polish</b> the copper with a piece of sandpaper.</li>
        <li><b>Observe</b> the copper: is it shiny or dull?</li>
        <li>Place it on a <b>wooden board</b> and hit it with a <b>hammer</b> (teacher demonstration).</li>
        <li>Test its <b>electrical conductivity</b> with a circuit: <b>6 V battery</b>, <b>light bulb</b>, <b>crocodile clips</b> and <b>connection wires</b>.</li>
        <li>Repeat steps 2–4 with iron, magnesium, aluminium, sulphur and graphite. Classify each one.</li>
      </ol>`, 'Experiment'));

    const lab = A.playCard('Virtual lab: Experiment 1.1', 'Pick a sample, run each step, and record what you see. Your results table fills in below.', '🧪 Virtual lab');
    exp11(lab);
    root.appendChild(lab);

    const lc = A.playCard('Label the circuit diagram', 'Step 4 asks for a labelled circuit diagram. Tap a label, then tap where it goes.', '🔌 Label');
    labelCircuit(lc);
    root.appendChild(lc);

    root.appendChild(A.keybox(`<p><b>${T('Hardness', '硬度')}</b> is the ability to resist scratching or cutting.</p>
      <p><b>${T('Malleable', '有展性')}</b> means can be hammered into sheets.</p>
      <p><b>${T('Ductile', '有延性')}</b> means can be drawn into wires.</p>
      <p><b>${T('Brittle', '脆')}</b> means can be easily broken into small pieces when bent.</p>`));
    const kp = h('section', { class: 'card' }, h('div', { class: 'card-title' }, h('span', { class: 'card-tag', text: '📖 Key words' }), h('h3', { text: 'Name the property' })));
    kp.appendChild(A.cloze('[[Hardness]] is the ability to resist scratching or cutting. [[Malleable]] means can be hammered into sheets. [[Ductile]] means can be drawn into wires. [[Brittle]] means can be easily broken into small pieces when bent.', { rewardKey: 'c1-def-prop', xp: 10 }));
    root.appendChild(kp);

    const tcard = A.noteCard('General properties of metals and non-metals', '', 'Notes');
    const tbl = A.table(['Property', 'Metals', 'Non-metals'], PROPS);
    const coverBtn = btn('🙈 Test me: hide answers', () => {
      const on = !tbl.classList.contains('c1-tablecover');
      tbl.classList.toggle('c1-tablecover', on);
      tbl.querySelectorAll('tbody td:not(:first-child)').forEach(td => td.classList.toggle('c1-hide', on));
      coverBtn.innerHTML = on ? '👀 Show all answers' : '🙈 Test me: hide answers';
      coverHint.style.display = on ? '' : 'none';
      A.sound('whoosh');
    }, 'btn-sm');
    const coverHint = h('span', { class: 'tiny', style: { display: 'none' }, text: 'Say the answer, then tap the blurred cell to check.' });
    tbl.addEventListener('click', e => {
      const td = e.target.closest && e.target.closest('td.c1-hide');
      if (!td) return;
      td.classList.remove('c1-hide'); A.sound('pop');
      if (!tbl.querySelector('td.c1-hide')) A.reward('c1-table-recall', 10, 'Table recall');
    });
    tcard.appendChild(h('div', { class: 'c1-row', style: { marginBottom: '12px' } }, coverBtn, coverHint));
    tcard.appendChild(tbl);
    root.appendChild(tcard);

    const ps = A.playCard('Property sort', 'Is it a typical property of metals or of non-metals?');
    const items = [
      ['shiny', 'm'], ['dull', 'n'], ['good conductor of electricity', 'm'], ['poor conductor of electricity', 'n'],
      ['good conductor of heat', 'm'], ['poor conductor of heat', 'n'], ['malleable and ductile', 'm'], ['brittle', 'n'],
      ['usually high melting point', 'm'], ['usually low melting point', 'n'], ['usually high density', 'm'], ['hard and strong', 'm'], ['solid or gas at room conditions', 'n']
    ].map(([label, bucket]) => ({ label, bucket, hint: bucket === 'm' ? 'Think of copper or iron.' : 'Think of sulphur or oxygen.' }));
    ps.body.appendChild(A.sortGame({ buckets: [{ id: 'm', title: 'Metals', icon: '🔩' }, { id: 'n', title: 'Non-metals', icon: '🌫️' }], items, rewardKey: 'c1-sort-prop', xp: 15 }));
    root.appendChild(ps);

    const eh = A.playCard('Exception hunter', 'Every rule has a rule-breaker. Catch it!', '🕵️ Play');
    exceptionHunter(eh);
    root.appendChild(eh);

    A.quickCheck(root, 'ch1', 'ch1-5', 5);
  }

  /* =========================================================
     LESSON 1.4 (cont.) — Allotropes of carbon, semi-metals, self-directed learning
     ========================================================= */
  const DG = {
    look: { label: '👀 Look', row: 'Appearance', d: 'colourless, transparent, sparkling', g: 'black (dark grey), shiny, opaque' },
    melt: { label: '🔥 Heat it', row: 'Melting point', d: 'very high (around 3500 °C)', g: 'very high (around 3500 °C)' },
    cond: { label: '💡 Conductivity', row: 'Electrical conductivity', d: 'does not conduct', g: 'conducts' },
    hard: { label: '🪛 Scratch test', row: 'Hardness and strength', d: 'very hard (hardest natural substance) and strong', g: 'soft and slippery (feels greasy)' }
  };
  function carbonLab(card) {
    const s = svg(360, 230, 'Diamond and graphite on the test bench', 'c1-svg');
    const DX = 95, GX = 265, Y = 150;
    s.appendChild(h('line', { x1: 20, y1: 192, x2: 340, y2: 192, stroke: 'var(--line-2)', 'stroke-width': 3, 'stroke-linecap': 'round' }));
    // diamond
    const dia = h('g', { transform: 'translate(' + DX + ',' + Y + ')' },
      h('polygon', { points: '-36,-10 -21,-28 21,-28 36,-10 0,32', fill: '#e3f4ff', 'fill-opacity': .75, stroke: '#7fb6d6', 'stroke-width': 2, 'stroke-linejoin': 'round' }),
      h('path', { d: 'M-36 -10 L36 -10 M-21 -28 L-11 -10 L0 -28 L11 -10 L21 -28 M-11 -10 L0 32 L11 -10 M-36 -10 L0 32 L36 -10', stroke: '#9cc8e2', 'stroke-width': 1.2, fill: 'none' }));
    // graphite
    const gra = h('g', { transform: 'translate(' + GX + ',' + Y + ')' },
      h('polygon', { points: '-40,14 -33,-14 -12,-26 14,-22 36,-8 40,16 12,28 -22,26', fill: '#3f444d', stroke: '#7a818c', 'stroke-width': 2, 'stroke-linejoin': 'round' }),
      h('path', { d: 'M-24 -12 L6 -18 L26 -6', stroke: '#c9ced6', 'stroke-width': 2.5, 'stroke-linecap': 'round', fill: 'none', opacity: .55 }));
    s.appendChild(dia); s.appendChild(gra);
    s.appendChild(txt(DX, 216, 'Diamond', 'c1-t c1-mid')); s.appendChild(txt(GX, 216, 'Graphite', 'c1-t c1-mid'));
    const fx = h('g'); s.appendChild(fx);
    const stage = h('div', { class: 'c1-stage' }, s);
    const readout = h('div', { class: 'feedback center', html: 'Pick a test to compare the two allotropes.' });
    const doneSet = new Set();
    // comparison table
    const cell = {};
    const rows = Object.keys(DG).map(k => {
      cell[k] = { d: h('td', { class: 'q', text: '?' }), g: h('td', { class: 'q', text: '?' }) };
      return h('tr', null, h('th', { text: DG[k].row }), cell[k].d, cell[k].g);
    });
    const tbl = h('div', { class: 'table-wrap c1-gap' }, h('table', { class: 't c1-cmp' }, h('thead', h('tr', null, h('th', { text: 'Allotropes of carbon' }), h('th', { text: '💎 Diamond' }), h('th', { text: '✏️ Graphite' }))), h('tbody', null, rows)));
    let busy = false;
    const buttons = h('div', { class: 'c1-actions' }, Object.keys(DG).map(k => {
      const b = btn(DG[k].label, () => run(k, b), 'btn-sm');
      return b;
    }));
    card.body.appendChild(stage); card.body.appendChild(buttons); card.body.appendChild(readout); card.body.appendChild(tbl);
    function record(k) {
      ['d', 'g'].forEach(x => { cell[k][x].className = 'fill pop-in'; cell[k][x].textContent = DG[k][x]; });
      doneSet.add(k);
      card.score.textContent = doneSet.size + ' / 4 tests';
      if (doneSet.size === 4) { A.reward('c1-carbonlab', 20, 'Allotrope lab'); A.celebrate(.6); A.sound('win'); }
      busy = false;
    }
    function run(k, b) {
      if (busy) return; busy = true;
      clear(fx); b.classList.add('selected');
      if (k === 'look') {
        [[DX - 44, Y - 30], [DX + 40, Y - 24], [DX - 8, Y - 44], [DX + 28, Y + 14]].forEach(p => fx.appendChild(sparkle(p[0], p[1], 8)));
        fx.appendChild(sparkle(GX + 10, Y - 20, 5));
        A.sound('pop');
        readout.innerHTML = 'Diamond sparkles and you can see through it. Graphite is black, shiny and <b>opaque</b> (you can’t see through it).';
        record(k);
      } else if (k === 'cond') {
        const mk = (x, on) => {
          const gg = h('g', { class: on ? '' : 'c1-off' });
          ['M' + (x - 30) + ' ' + Y + ' L' + (x - 50) + ' ' + Y + ' L' + (x - 50) + ' 40 L' + (x - 22) + ' 40', 'M' + (x + 22) + ' 40 L' + (x + 50) + ' 40 L' + (x + 50) + ' ' + Y + ' L' + (x + 30) + ' ' + Y].forEach(d => { gg.appendChild(h('path', { class: 'c1-wire', d })); gg.appendChild(h('path', { class: 'c1-flow', d })); });
          gg.appendChild(bulbArt(x, 30));
          gg.appendChild(h('rect', { x: x - 60, y: 84, width: 20, height: 30, rx: 4, fill: '#343944' }));
          gg.appendChild(h('rect', { x: x - 60, y: 84, width: 20, height: 8, rx: 3, fill: '#e8a317' }));
          return gg;
        };
        const gD = mk(DX, false), gG = mk(GX, true);
        fx.appendChild(gD); fx.appendChild(gG);
        A.later(() => { gG.classList.add('c1-on'); A.sound('good'); fx.appendChild(txt(DX, 76, '✗ no light', 'c1-t c1-mid', { style: { fill: 'var(--bad)' } })); readout.innerHTML = 'Only <b>graphite</b> lights the bulb. Diamond does not conduct electricity.'; record(k); }, 450);
      } else if (k === 'melt') {
        const flames = [DX, GX].map(x => h('path', { d: 'M' + (x - 14) + ' 192 Q' + (x - 16) + ' 172 ' + x + ' 160 Q' + (x + 16) + ' 172 ' + (x + 14) + ' 192 Z', fill: '#ff8a1f', opacity: .9 }));
        const glowD = h('circle', { cx: DX, cy: Y, r: 40, fill: '#ff5a1f', opacity: 0 }), glowG = h('circle', { cx: GX, cy: Y, r: 42, fill: '#ff5a1f', opacity: 0 });
        const temp = txt(180, 40, '25 °C', 'c1-t c1-mid', { 'font-size': 22 });
        [glowD, glowG].concat(flames).forEach(x => fx.appendChild(x)); fx.appendChild(temp);
        A.sound('whoosh');
        tween(2200, kk => { const t = Math.round(25 + (3500 - 25) * kk * kk); temp.textContent = (t >= 3500 ? '≈ 3500' : t) + ' °C'; glowD.setAttribute('opacity', (kk * .35).toFixed(2)); glowG.setAttribute('opacity', (kk * .35).toFixed(2)); },
          () => { fx.appendChild(txt(180, 62, 'Both melt only at about 3500 °C!', 'c1-t2 c1-mid')); readout.innerHTML = 'Both have a <b>very high</b> melting point — around 3500 °C. (Most non-metals melt easily — carbon is an exception.)'; A.sound('good'); record(k); });
      } else {
        const tool = d => h('g', null, h('rect', { x: -4, y: -46, width: 8, height: 34, rx: 3, fill: '#7d8590' }), h('polygon', { points: '-4,-12 4,-12 0,-2', fill: '#4f565f' }), h('rect', { x: -7, y: -62, width: 14, height: 18, rx: 4, fill: d ? '#e5484d' : '#5b5bf0' }));
        const tD = tool(true), tG = tool(false);
        fx.appendChild(tD); fx.appendChild(tG);
        const scratch = h('path', { d: 'M' + (GX - 26) + ' ' + (Y - 6) + ' L' + (GX - 26) + ' ' + (Y - 6), stroke: '#a9afb8', 'stroke-width': 3, 'stroke-linecap': 'round', fill: 'none' });
        fx.appendChild(scratch);
        A.sound('fizz');
        tween(1300, kk => {
          const x = -26 + 52 * kk;
          tD.setAttribute('transform', 'translate(' + (DX + x * .9).toFixed(1) + ',' + (Y - 12 + Math.sin(kk * 30) * 1.5).toFixed(1) + ')');
          tG.setAttribute('transform', 'translate(' + (GX + x).toFixed(1) + ',' + (Y - 4).toFixed(1) + ')');
          scratch.setAttribute('d', 'M' + (GX - 26) + ' ' + (Y - 6) + ' L' + (GX + x).toFixed(1) + ' ' + (Y - 4 + Math.sin(kk * 9) * 2).toFixed(1));
        }, () => {
          fx.appendChild(txt(DX, 64, '✓ no scratch!', 'c1-t c1-mid')); fx.appendChild(txt(GX, 64, '✗ scratched easily', 'c1-t c1-mid'));
          readout.innerHTML = 'Diamond resists scratching — it is <b>very hard</b> (the hardest natural substance). Graphite is <b>soft and slippery</b>.';
          A.sound('good'); record(k);
        });
      }
    }
  }

  function semiSwitch(card) {
    const chip = h('g');
    chip.appendChild(h('rect', { x: 216, y: 155, width: 84, height: 22, rx: 3, fill: '#5d6b80', stroke: '#3b4554', 'stroke-width': 1.5 }));
    chip.appendChild(h('rect', { x: 216, y: 155, width: 84, height: 8, rx: 3, fill: '#9fb0c8', opacity: .6 }));
    const dots = h('g', { opacity: 0 }, [[228, 168], [246, 161], [262, 171], [281, 163], [292, 172]].map(p => h('circle', { cx: p[0], cy: p[1], r: 2.6, fill: '#f2704f' })));
    chip.appendChild(dots);
    const c = circuit(chip, { aria: 'Circuit testing a piece of silicon', labels: false });
    c.root.appendChild(txt(258, 146, 'silicon', 'c1-t2 c1-mid'));
    c.root.appendChild(txt(83, 204, '6 V battery', 'c1-t2 c1-mid'));
    const flame = h('path', { d: 'M244 214 Q240 196 258 184 Q276 196 272 214 Z', fill: '#ff8a1f', opacity: 0 });
    c.svg.setAttribute('viewBox', '0 0 360 222');
    c.svg.appendChild(flame);
    const state = { heat: false, imp: false }, found = new Set();
    const fb = h('div', { class: 'feedback center', html: '🌡️ Room conditions: the bulb is off. Find <b>two</b> ways to make silicon conduct.' });
    const tHeat = btn('🔥 Heat it', () => toggle('heat', tHeat), 'c1-toggle');
    const tImp = btn('➕ Make it slightly impure', () => toggle('imp', tImp), 'c1-toggle');
    card.body.appendChild(h('div', { class: 'c1-stage' }, c.svg));
    card.body.appendChild(h('div', { class: 'c1-actions' }, tHeat, tImp));
    card.body.appendChild(fb);
    function toggle(k, b) {
      state[k] = !state[k]; b.classList.toggle('on', state[k]); A.sound('click');
      flame.setAttribute('opacity', state.heat ? .9 : 0);
      dots.setAttribute('opacity', state.imp ? 1 : 0);
      const on = state.heat || state.imp;
      c.connect(() => {
        c.setOn(on);
        if (on) {
          if (state.heat) found.add('heat');
          if (state.imp) found.add('imp');
          A.sound('good');
          fb.className = 'feedback center good';
          fb.innerHTML = '💡 It conducts when ' + (state.heat && state.imp ? 'heated and slightly impure' : state.heat ? '<b>heated</b>' : '<b>slightly impure</b>') + '.' + (found.size < 2 ? ' Now find the other way!' : '');
        } else {
          fb.className = 'feedback center'; fb.innerHTML = '🌡️ Back to room conditions: silicon does <b>not</b> conduct.';
        }
        card.score.textContent = found.size + ' / 2 ways';
        if (found.size === 2 && A.reward('c1-semi', 10, 'Semiconductor')) { A.celebrate(.5); A.toast('🎉 Both ways found — that’s a semiconductor!', 'good'); }
      });
    }
    card.score.textContent = '0 / 2 ways';
  }

  const TEMPLATES = [
    { q: 'Describe an experiment to show a solid is brittle.', parts: ['Place the solid on a wooden board', 'and hit it with a hammer.', 'If it breaks into small pieces,', 'it is brittle.'], fake: ['If it flattens into a sheet,', 'Connect it in a circuit'],
      model: 'Place the solid on a <b>wooden board</b> and hit it with a <b>hammer</b>. If it <b>breaks into small pieces</b>, it is <b>brittle</b>.' },
    { q: 'Describe an experiment to show a solid conducts electricity.', parts: ['Connect the solid between the crocodile clips', 'in a circuit with a battery, a light bulb and connection wires.', 'If the bulb lights up,', 'the solid conducts electricity.'], fake: ['and hit it with a hammer.', 'If it is shiny,'],
      model: 'Connect the solid between the <b>crocodile clips</b> in a circuit with a <b>battery</b>, a <b>light bulb</b> and connection wires. If the <b>bulb lights up</b>, the solid <b>conducts electricity</b>.' },
    { q: 'Describe an experiment to show a metal is malleable.', parts: ['Place the metal on a wooden board', 'and hit it with a hammer.', 'If it flattens into a sheet without breaking,', 'it is malleable.'], fake: ['If it breaks into small pieces,', 'If the bulb lights up,'],
      model: 'Place the metal on a <b>wooden board</b> and hit it with a <b>hammer</b>. If it <b>flattens into a sheet</b> without breaking, it is <b>malleable</b>.' }
  ];
  function templateBuilder(card) {
    let ti = 0;
    const tabs = seg(TEMPLATES.map((t, i) => ({ label: 'Q' + (i + 1), value: i })), v => { ti = v; tabs.select(v); A.sound('click'); draw(); }, 'Question');
    const area = h('div');
    card.body.appendChild(tabs); card.body.appendChild(area);
    const solved = new Set();
    function draw() {
      const t = TEMPLATES[ti];
      clear(area);
      const answer = h('div', { class: 'c1-answer', 'aria-label': 'Your answer' });
      const pool = h('div', { class: 'c1-pool' });
      const fb = h('div', { class: 'feedback' });
      const model = h('div');
      const mk = (txt0, inAns) => {
        const c = h('button', { type: 'button', class: 'chip', text: txt0 });
        c.addEventListener('click', () => {
          A.sound('click');
          if (c.parentNode === pool) answer.appendChild(c); else pool.appendChild(c);
          fb.textContent = ''; [...answer.children].forEach(x => x.classList.remove('bad', 'good'));
        });
        return c;
      };
      A.shuffle(t.parts.concat(t.fake)).forEach(p => pool.appendChild(mk(p)));
      area.appendChild(h('div', { class: 'c1-rule c1-gap', html: '<small>Question</small>' + t.q }));
      area.appendChild(answer); area.appendChild(pool);
      area.appendChild(h('div', { class: 'q-actions' }, btn('↺ Reset', draw, 'btn-sm btn-ghost'), btn('Check ✓', () => {
        const got = [...answer.children].map(c => c.textContent);
        if (got.length === t.parts.length && got.every((g, i) => g === t.parts[i])) {
          [...answer.children].forEach(c => c.classList.add('good'));
          fb.className = 'feedback good'; fb.innerHTML = '✅ Perfect answer! Method → observation → conclusion.';
          clear(model);
          area.querySelectorAll('.c1-pool .chip, .c1-answer .chip').forEach(c => { c.disabled = true; });
          model.appendChild(h('div', { class: 'explain good c1-model', html: '<b>Model answer</b> (key terms in bold):<br>' + t.model }));
          A.sound('good'); solved.add(ti);
          A.reward('c1-tpl-' + ti, 8, 'Answer template');
          if (solved.size === TEMPLATES.length) A.celebrate(.6);
        } else {
          [...answer.children].forEach((c, i) => c.classList.add(c.textContent === t.parts[i] ? 'good' : 'bad'));
          fb.className = 'feedback bad';
          fb.innerHTML = got.some(g => t.fake.includes(g)) ? '❌ One of your pieces doesn’t belong in this answer.' : got.length < t.parts.length ? '❌ Not finished — you need ' + t.parts.length + ' pieces.' : '❌ Check the order: <b>method</b> first, then the <b>observation</b>, then the <b>conclusion</b>.';
          A.sound('bad');
        }
      }, 'btn-primary')));
      area.appendChild(fb); area.appendChild(model);
      card.score.textContent = solved.size + ' / ' + TEMPLATES.length;
    }
    tabs.select(0); draw();
  }

  function lessonCarbon(root) {
    root.appendChild(A.noteCard('Graphite (carbon) as an exception', `
      <ul>
        <li>Carbon shows <b>different properties</b> from most non-metals.</li>
        <li>It exists in two different <b>forms</b>: <b>${T('diamond', '金剛石')}</b> and <b>${T('graphite', '石墨')}</b>.</li>
      </ul>`, 'Notes'));
    root.appendChild(A.keybox('<b>Allotropes</b> are different forms of the same element in the same physical state.'));

    const lab = A.playCard('Diamond vs graphite test bench', 'Run all four tests to fill in the book’s comparison table.', '💎 Lab');
    carbonLab(lab);
    root.appendChild(lab);

    const sg = A.playCard('Diamond, graphite or both?', 'Tap a property, then tap the right box.');
    sg.body.appendChild(A.sortGame({
      buckets: [{ id: 'd', title: 'Diamond', icon: '💎' }, { id: 'g', title: 'Graphite', icon: '✏️' }, { id: 'b', title: 'Both', icon: '🤝' }],
      items: [['colourless and transparent', 'd'], ['sparkling', 'd'], ['does not conduct electricity', 'd'], ['very hard and strong', 'd'],
        ['black (dark grey) and shiny', 'g'], ['opaque', 'g'], ['conducts electricity', 'g'], ['soft and slippery', 'g'],
        ['very high melting point (about 3500 °C)', 'b'], ['a form of carbon', 'b']].map(([label, bucket]) => ({ label, bucket })),
      rewardKey: 'c1-sort-dg', xp: 15
    }));
    root.appendChild(sg);

    root.appendChild(A.noteCard(T('Semi-metals', '半金屬') + ' (or metalloids)', `
      <ul>
        <li><b>shiny</b> solids</li>
        <li><b>high</b> melting and boiling points</li>
        <li><b>brittle</b></li>
        <li><b>${T('semiconductors', '半導體')}</b>: they only conduct electricity when <b>heated</b> or <b>slightly impure</b>. They do <b>not</b> conduct electricity at room conditions.</li>
        <li>💻 Silicon is used to make the chips in computer processors.</li>
      </ul>`, 'Notes'));

    const sw = A.playCard('Semiconductor switch', 'A piece of silicon is connected in the circuit. Can you make the bulb light?', '💡 Play');
    semiSwitch(sw);
    root.appendChild(sw);

    const fc = A.playCard('Self-directed learning (1): key terms', 'Summarise the key terms of this chapter. Say the definition, then flip.', '🃏 Flashcards');
    fc.body.appendChild(A.flashcards([
      ['Element (macroscopic)', 'A <b>pure</b> substance that cannot be broken down into anything simpler by <b>chemical</b> methods.'],
      ['Element (microscopic)', 'Made up of <b>one kind of atom</b> only.'],
      ['Atom', 'The <b>basic unit</b> of matter.'],
      ['Molecule', 'A <b>discrete, neutral</b> particle formed by one atom, or more than one atom <b>chemically combined</b> together.'],
      ['Malleability', 'Malleable means can be <b>hammered into sheets</b>.'],
      ['Ductility', 'Ductile means can be <b>drawn into wires</b>.'],
      ['Brittle', 'Can be easily <b>broken into small pieces</b> when bent.'],
      ['Hardness', 'The ability to <b>resist scratching or cutting</b>.'],
      ['Allotropes', '<b>Different forms</b> of the <b>same element</b> in the <b>same physical state</b>.'],
      ['Semi-metal (metalloid)', 'Has properties of <b>both metals and non-metals</b>; a <b>semiconductor</b>.']
    ].map(([f, b]) => ({ front: '<div class="mid">' + f + '</div>', back: '<div style="font-size:17px;font-weight:700;line-height:1.45">' + b + '</div>' })), { rewardKey: 'c1-flash-terms', xp: 15 }));
    root.appendChild(fc);

    const qt = A.noteCard('Self-directed learning (2): question types in this chapter', '', 'Revision');
    qt.appendChild(h('ul', { class: 'c1-qtypes' }, [
      ['Define a key term', 'e.g. “What are allotropes?” → give the book definition word for word.', 'ch1-6'],
      ['Draw a particle diagram and explain', 'e.g. “Draw a liquid mixture.” → particles close together but irregularly arranged; more than one kind of particle.', 'ch1-1'],
      ['Write symbols and formulae', 'e.g. “Give the formula of phosphorus.” → P<sub>4</sub> (capital first letter; subscript = atoms in one molecule).', 'ch1-3'],
      ['Classify an element', 'e.g. “Is boron a metal, semi-metal or non-metal? Is it a solid, liquid or gas?” → semi-metal, solid.', 'ch1-4'],
      ['Describe an experiment', 'e.g. “Describe an experiment to show a solid is brittle.” → method, observation, conclusion. Build these below!', null]
    ].map(([t, e, l]) => h('li', { html: '<b>' + t + (l ? ' <a href="#/ch/ch1/' + l + '" class="tiny">(practise)</a>' : '') + '</b><span>' + e + '</span>' }))));
    root.appendChild(qt);

    const tb = A.playCard('Self-directed learning (3): answer templates', 'Build a full-mark answer: tap the pieces in order. Watch out for pieces that don’t belong!', '📝 Exam skills');
    templateBuilder(tb);
    root.appendChild(tb);

    A.quickCheck(root, 'ch1', 'ch1-6', 5);
  }

  /* =========================================================
     Question bank (all answerable from Chapter 1 of the book)
     ========================================================= */
  const figBox = (st, k, seed, pair) => () => matterBox(st, k, seed, pair, { w: 180, h: 116, maxW: 230 });
  const figMol = (m, n, seed, layout) => () => pbox({ w: 180, h: 112, layout: layout || 'gas', seed, groups: [{ m, n }], motion: layout === 'gas' || !layout ? 'bounce' : 'jiggle', speed: 12, space: 12, maxW: 230 });
  const Q = [];
  const add = (lesson, list) => list.forEach(q => Q.push(Object.assign({ lesson }, q)));

  add('ch1-1', [
    { type: 'mcq', q: 'In a particle diagram, what does each sphere represent?', options: ['one atom', 'one element', 'one substance', 'one mixture'], answer: 0, explain: 'Each sphere represents one atom; different colours or shapes mean different types of atoms.' },
    { type: 'fill', q: 'An ___ is the basic unit of matter.', answer: ['atom'], explain: 'Book definition: an atom is the basic unit of matter.' },
    { type: 'mcq', q: 'What does this particle diagram show?', fig: figBox('solid', 1, 101, ['Cu', 'S']), options: ['a solid pure substance', 'a solid mixture', 'a liquid pure substance', 'a gas pure substance'], answer: 0, explain: 'Closely packed, regular arrangement → solid. Only one kind of particle → pure substance.' },
    { type: 'mcq', q: 'What does this particle diagram show?', fig: figBox('gas', 2, 102, ['N', 'S']), options: ['a gas mixture', 'a gas pure substance', 'a liquid mixture', 'a solid mixture'], answer: 0, explain: 'Particles far apart and random → gas. Two kinds of particle → mixture.' },
    { type: 'mcq', q: 'The diagram shows a liquid. Why is it a <b>mixture</b>?', fig: figBox('liquid', 2, 103, ['O', 'Cl']), options: ['There is more than one kind of particle.', 'The particles are irregularly arranged.', 'The particles are close together.', 'The particles can move.'], answer: 0, explain: 'Pure substance vs mixture depends on the kinds of particle, not on how they are arranged.' },
    { type: 'tf', q: 'In a liquid, the particles are far apart and move about randomly at high speed.', answer: false, explain: 'That describes a gas. In a liquid, particles are close together but irregularly arranged.' },
    { type: 'tf', q: 'In particle diagrams, different colours or shapes of spheres represent different types of atoms.', answer: true, explain: 'This is how particle diagrams show different types of atoms.' },
    { type: 'fill', q: 'A substance that contains only one kind of particle is a ___ substance.', answer: ['pure'], explain: 'Only one kind of particle → pure substance; more than one kind → mixture.' },
    { type: 'fill', q: 'Solid, liquid and gas are the ___ states of matter. Pure substance and mixture are the chemical states.', answer: ['physical'], explain: 'Matter can be classified by its physical state (solid, liquid, gas) and by its chemical state (pure substance or mixture).' },
    { type: 'match', q: 'Match each type of matter to its particle picture.', pairs: [['solid', 'closely packed, regular arrangement'], ['liquid', 'close together, irregular arrangement'], ['gas', 'far apart, random arrangement'], ['mixture', 'more than one kind of particle']], explain: 'Arrangement tells the physical state; kinds of particle tell pure substance or mixture.' },
    { type: 'multi', q: 'Which statements describe the particles in a <b>solid</b>?', options: ['closely packed', 'regularly arranged', 'vibrate about fixed positions', 'far apart'], answer: [0, 1, 2], explain: 'Solid particles are closely packed in a regular arrangement and only vibrate about fixed positions.' }
  ]);

  add('ch1-2', [
    { type: 'fill', q: 'Macroscopically, an element is a ___ substance that cannot be broken down into anything simpler by chemical methods.', answer: ['pure'], explain: 'Book definition of an element (macroscopic view).' },
    { type: 'fill', q: 'An element cannot be broken down into anything simpler by ___ methods.', answer: ['chemical'], explain: 'Elements cannot be broken down by chemical methods.' },
    { type: 'mcq', q: 'What is the chemical symbol of sodium?', options: ['Na', 'So', 'S', 'Sd'], answer: 0, explain: 'Na comes from the Latin name <b>Na</b>trium. (S is sulphur.)' },
    { type: 'mcq', q: 'Which is the correct way to write the symbol for cobalt?', options: ['Co', 'CO', 'co', 'cO'], answer: 0, explain: 'The first letter is a capital and the second letter is lower case. “CO” would mean two elements, C and O.' },
    { type: 'match', q: 'Match each symbol to the Latin name it comes from.', pairs: [['Cu', 'Cuprum'], ['Ag', 'Argentum'], ['Hg', 'Hydrargyrum'], ['Pb', 'Plumbum'], ['Au', 'Aurum']], explain: 'Copper Cu (Cuprum), silver Ag (Argentum), mercury Hg (Hydrargyrum), lead Pb (Plumbum), gold Au (Aurum).' },
    { type: 'tf', q: 'The symbol of every element starts with a capital letter.', answer: true, explain: 'A symbol has one or two letters and the first letter is always a capital.' },
    { type: 'tf', q: 'The symbol of gold, Au, comes from its English name.', answer: false, explain: 'Au comes from the Latin name <b>Au</b>rum.' },
    { type: 'mcq', q: 'Which element has the symbol <b>Hg</b>?', options: ['mercury', 'silver', 'hydrogen', 'helium'], answer: 0, explain: 'Hg comes from mercury’s Latin name, <b>H</b>ydrar<b>g</b>yrum.' },
    { type: 'fill', q: 'The symbol of lead, Pb, comes from its Latin name, ___.', answer: ['Plumbum'], hint: 'Pb = the 1st and 5th letters of this 7-letter Latin word: P _ _ _ b _ _', explain: 'Lead is Pb, from <b>P</b>lum<b>b</b>um.' },
    { type: 'mcq', q: 'A pure substance may exist as…', options: ['an element or a compound', 'an element or a mixture', 'a compound or a mixture', 'a mixture only'], answer: 0, explain: 'A pure substance is either an element or a compound (elements in combined form). A mixture is not a pure substance.' },
    { type: 'multi', q: 'Which of these symbols come from <b>Latin</b> names?', options: ['Na', 'Cu', 'He', 'Ag', 'H'], answer: [0, 1, 3], explain: 'Na (Natrium), Cu (Cuprum) and Ag (Argentum) are Latin. H and He come from English names.' },
    { type: 'mcq', q: 'What is the chemical symbol of potassium?', options: ['K', 'P', 'Po', 'Pt'], answer: 0, explain: 'Potassium is K. P is phosphorus and Pt is platinum.' }
  ]);

  add('ch1-3', [
    { type: 'fill', q: 'Microscopically, each element is made up of one kind of ___ only.', answer: ['atom', 'atoms'], explain: 'Book definition of an element (microscopic view).' },
    { type: 'mcq', q: 'A molecule is a kind of ___ particle.', options: ['discrete, neutral', 'charged, joined-up', 'giant, charged', 'liquid, moving'], answer: 0, explain: 'A molecule is a discrete, neutral particle formed by one atom or more than one atom chemically combined.' },
    { type: 'tf', q: 'A molecule can be formed by just one atom.', answer: true, explain: 'Yes — e.g. argon exists as separate single atoms. A molecule is formed by one atom, or more than one atom chemically combined.' },
    { type: 'mcq', q: 'These are molecules of an element. What is its chemical formula?', fig: figMol(MOL.tri('O', 7), 4, 201), options: ['O<sub>3</sub>', 'O<sub>2</sub>', '3O', 'O'], answer: 0, explain: 'Each molecule has 3 oxygen atoms → O<sub>3</sub> (ozone).' },
    { type: 'mcq', q: 'How many atoms are there in one molecule of phosphorus, P<sub>4</sub>?', options: ['4', '1', '2', '8'], answer: 0, explain: 'The subscript 4 means 4 phosphorus atoms in each molecule.' },
    { type: 'match', q: 'Match each element to its chemical formula.', pairs: [['argon', 'Ar'], ['oxygen', 'O<sub>2</sub>'], ['ozone', 'O<sub>3</sub>'], ['bromine', 'Br<sub>2</sub>'], ['phosphorus', 'P<sub>4</sub>']], explain: 'Argon: single atoms; oxygen and bromine: pairs; ozone: groups of 3; phosphorus: groups of 4.' },
    { type: 'tf', q: 'Oxygen (O<sub>2</sub>) and ozone (O<sub>3</sub>) are both elements.', answer: true, explain: 'Both are made up of only one kind of atom — oxygen atoms.' },
    { type: 'mcq', q: 'Which of these elements is made up of <b>closely packed atoms</b>?', options: ['iron', 'argon', 'oxygen', 'bromine'], answer: 0, explain: 'Iron is a solid made up of closely packed Fe atoms. Argon exists as separate single atoms; oxygen and bromine exist as pairs of atoms (molecules).' },
    { type: 'fill', q: 'In the formula O<sub>2</sub>, the small 2 shows that each molecule contains ___ atoms.', answer: ['2', 'two'], explain: 'The subscript is the number of atoms in one molecule.' },
    { type: 'multi', q: 'Which statements about argon are correct?', options: ['It exists as separate single atoms.', 'It is a gas at room conditions.', 'It is an element.', 'Its formula is Ar<sub>2</sub>.'], answer: [0, 1, 2], explain: 'Argon is a gaseous element made of separate single atoms, so its formula is Ar.' },
    { type: 'mcq', q: 'How many atoms are shown in this box altogether?', fig: figMol(MOL.di('O', 'O', 7), 4, 202), options: ['8', '4', '2', '6'], answer: 0, explain: '4 molecules × 2 atoms in each = 8 atoms.' }
  ]);

  add('ch1-4', [
    { type: 'mcq', q: 'How many elements are gases at room conditions?', options: ['11', '2', '18', '35'], answer: 0, explain: '11 elements are gases, 2 are liquids and the rest are solids.' },
    { type: 'multi', q: 'Which elements are <b>liquids</b> at room conditions?', options: ['mercury', 'bromine', 'sodium', 'iodine', 'chlorine'], answer: [0, 1], explain: 'Only 2 elements are liquids: mercury (a metal) and bromine (a non-metal).' },
    { type: 'tf', q: 'All metals are solids at room conditions.', answer: false, explain: 'Mercury is a metal but it is a liquid.' },
    { type: 'fill', q: 'All metals are solids at room conditions except ___.', answer: ['mercury', 'Hg'], explain: 'Mercury is the only liquid metal.' },
    { type: 'mcq', q: 'Boron and silicon are classified as…', options: ['semi-metals (metalloids)', 'metals', 'non-metals', 'gases'], answer: 0, explain: 'They have properties of both metals and non-metals.' },
    { type: 'tf', q: 'Non-metals can be solids, liquids or gases at room conditions.', answer: true, explain: 'E.g. sulphur (solid), bromine (liquid), oxygen (gas).' },
    { type: 'match', q: 'Match each element to its description.', pairs: [['mercury', 'liquid metal'], ['bromine', 'liquid non-metal'], ['silicon', 'solid semi-metal'], ['chlorine', 'gaseous non-metal'], ['iron', 'solid metal']], explain: 'Mercury and bromine are the two liquid elements; silicon is a semi-metal.' },
    { type: 'mcq', q: 'Which element is a <b>gas</b> at room conditions?', options: ['neon', 'iodine', 'phosphorus', 'calcium'], answer: 0, explain: 'Neon is one of the 11 gaseous elements. Iodine, phosphorus and calcium are solids.' },
    { type: 'fill', q: 'Elements that have properties of both metals and non-metals are called semi-metals or ___.', answer: ['metalloids', 'metalloid'], explain: 'Semi-metals are also called metalloids.' },
    { type: 'mcq', q: 'Which of these is a semi-metal?', options: ['silicon', 'gold', 'iodine', 'argon'], answer: 0, explain: 'Silicon (like boron) is a semi-metal: it has properties of both metals and non-metals.' },
    { type: 'multi', q: 'Which of the following are <b>metals</b>?', options: ['tin', 'zinc', 'sulphur', 'nickel', 'carbon'], answer: [0, 1, 3], explain: 'Tin, zinc and nickel are metals. Sulphur and carbon are non-metals.' }
  ]);

  add('ch1-5', [
    { type: 'mcq', q: 'In Experiment 1.1, which apparatus is used to test electrical conductivity?', options: ['6 V battery, light bulb, crocodile clips and connection wires', 'hammer and wooden board', 'sandpaper', 'Bunsen burner and test tube'], answer: 0, explain: 'The sample is connected between the crocodile clips; if the bulb lights up, it conducts.' },
    { type: 'mcq', q: 'In Experiment 1.1, a piece of sulphur is hit with a hammer. What happens?', options: ['It breaks into small pieces.', 'It flattens into a sheet.', 'It becomes shiny.', 'It conducts electricity.'], answer: 0, explain: 'Sulphur is brittle, like most non-metals.' },
    { type: 'tf', q: 'Graphite conducts electricity, so graphite is a metal.', answer: false, explain: 'Graphite is a non-metal (carbon). It is an exception: a non-metal that conducts electricity.' },
    { type: 'fill', q: '___ means can be hammered into sheets.', answer: ['malleable'], explain: 'Malleable = can be hammered into sheets.' },
    { type: 'fill', q: '___ means can be drawn into wires.', answer: ['ductile'], explain: 'Ductile = can be drawn into wires.' },
    { type: 'fill', q: '___ is the ability to resist scratching or cutting.', answer: ['hardness'], explain: 'Book definition of hardness.' },
    { type: 'mcq', q: '<b>Brittle</b> means…', options: ['can be easily broken into small pieces when bent', 'can be hammered into sheets', 'can be drawn into wires', 'can resist scratching or cutting'], answer: 0, explain: 'Brittle = easily broken into small pieces when bent.' },
    { type: 'mcq', q: 'Which property is typical of <b>non-metals</b>?', options: ['dull appearance', 'good conductor of heat', 'malleable', 'shiny appearance'], answer: 0, explain: 'Non-metal solids are usually dull; the other properties are typical of metals.' },
    { type: 'multi', q: 'Which properties are typical of <b>metals</b>?', options: ['shiny', 'good conductor of electricity', 'malleable and ductile', 'brittle', 'usually low density'], answer: [0, 1, 2], explain: 'Metals are shiny, good conductors, malleable and ductile, and usually have a high density.' },
    { type: 'mcq', q: 'Which metal has a low density and floats on water?', options: ['sodium', 'iron', 'lead', 'copper'], answer: 0, explain: 'Sodium is an exception: a metal with a low density.' },
    { type: 'tf', q: 'Metals are good conductors of heat.', answer: true, explain: 'Metals are good thermal conductors; non-metals are poor conductors of heat.' },
    { type: 'match', q: 'Match each element to the rule it breaks.', pairs: [['mercury', 'a metal that is a liquid'], ['bromine', 'a non-metal that is a liquid'], ['graphite', 'a non-metal that conducts electricity'], ['diamond', 'a non-metal that is very hard'], ['sodium', 'a soft metal with a low density']], explain: 'These are the exceptions in the general properties table.' },
    { type: 'mcq', q: 'A sample is shiny, flattens when hammered and makes the bulb light up. It is most likely…', options: ['magnesium', 'sulphur', 'graphite', 'diamond'], answer: 0, explain: 'Shiny + malleable + conducts → metal, e.g. magnesium. Graphite conducts but it is brittle.' },
    { type: 'tf', q: '“Room conditions” means a temperature of 25 °C and a pressure of 1 atm.', answer: true, explain: 'The book uses room conditions = 25 °C, 1 atm when it gives the physical state of an element.' },
    { type: 'tf', q: 'In Experiment 1.1, hitting the sample with a hammer on a wooden board is a teacher demonstration.', answer: true, explain: 'Step 3 (place the sample on the wooden board and hit it with a hammer) is done by the teacher.' },
    { type: 'fill', q: 'To test electrical conductivity, the sample is connected between the ___ in a circuit with a 6 V battery and a light bulb.', answer: ['crocodile clips', 'crocodile clip', 'clips'], explain: 'The crocodile clips hold the sample in the circuit; if the bulb lights up, the sample conducts.' },
    { type: 'multi', q: 'In Experiment 1.1, which samples are classified as <b>non-metals</b>?', options: ['sulphur', 'graphite', 'copper', 'magnesium', 'aluminium'], answer: [0, 1], explain: 'Sulphur and graphite are brittle, so they are non-metals — even though graphite conducts. Copper, magnesium and aluminium are metals.' }
  ]);

  add('ch1-6', [
    { type: 'fill', q: '___ are different forms of the same element in the same physical state.', answer: ['allotropes', 'allotrope'], explain: 'Book definition of allotropes, e.g. diamond and graphite.' },
    { type: 'mcq', q: 'Diamond and graphite are allotropes of…', options: ['carbon', 'silicon', 'sulphur', 'boron'], answer: 0, explain: 'Carbon exists in two different forms: diamond and graphite.' },
    { type: 'tf', q: 'Diamond conducts electricity but graphite does not.', answer: false, explain: 'It is the other way round: graphite conducts, diamond does not.' },
    { type: 'mcq', q: 'Which is the hardest natural substance?', options: ['diamond', 'graphite', 'iron', 'silicon'], answer: 0, explain: 'Diamond is very hard and strong; graphite is soft and slippery.' },
    { type: 'mcq', q: 'The melting points of diamond and graphite are both…', options: ['very high (around 3500 °C)', 'very low', 'about 100 °C', 'different: diamond high, graphite low'], answer: 0, explain: 'Both allotropes of carbon have very high melting points, around 3500 °C.' },
    { type: 'multi', q: 'Which of these describe <b>graphite</b>?', options: ['black (dark grey) and shiny', 'soft and slippery', 'conducts electricity', 'colourless and transparent', 'very hard'], answer: [0, 1, 2], explain: 'Colourless, transparent and very hard describe diamond.' },
    { type: 'mcq', q: 'Semi-metals conduct electricity only when they are…', options: ['heated or slightly impure', 'cooled', 'at room conditions', 'polished'], answer: 0, explain: 'Semi-metals are semiconductors: they do not conduct at room conditions.' },
    { type: 'tf', q: 'Semi-metals are shiny, brittle solids with high melting and boiling points.', answer: true, explain: 'These are the properties of semi-metals listed in the book.' },
    { type: 'fill', q: 'Semi-metals such as silicon only conduct electricity when heated or slightly impure, so they are called ___.', answer: ['semiconductors', 'semiconductor', 'semi-conductors', 'semi-conductor'], explain: 'Semiconductors do not conduct electricity at room conditions.' },
    { type: 'mcq', q: '“Describe an experiment to show a solid is brittle.” Which answer is best?', options: ['Place the solid on a wooden board and hit it with a hammer. If it breaks into small pieces, it is brittle.', 'Connect it in a circuit. If the bulb lights up, it is brittle.', 'Polish it with sandpaper. If it stays dull, it is brittle.', 'Hit it with a hammer. If it flattens into a sheet, it is brittle.'], answer: 0, explain: 'A full answer gives the method (board + hammer), the observation (breaks into small pieces) and the conclusion (brittle).' },
    { type: 'match', q: 'Match each term to its description.', pairs: [['diamond', 'colourless, transparent, sparkling'], ['graphite', 'black, shiny, opaque'], ['semiconductor', 'conducts only when heated or slightly impure'], ['allotropes', 'different forms of the same element in the same state']], explain: 'Diamond and graphite are allotropes of carbon (same element, same state, different forms); semi-metals such as silicon are semiconductors.' },
    { type: 'tf', q: 'Diamond and graphite are allotropes because they are different forms of carbon in the same physical state (solid).', answer: true, explain: 'Same element, same state, different forms → allotropes.' }
  ]);

  /* =========================================================
     Glossary
     ========================================================= */
  const GLOSSARY = [
    { en: 'Atom', zh: '原子', def: 'The basic unit of matter.' },
    { en: 'Particle diagram', zh: '粒子圖', def: 'A drawing of particles: each sphere is one atom; different colours or shapes are different types of atoms.' },
    { en: 'Pure substance', zh: '純物質', def: 'A substance with only one kind of particle.' },
    { en: 'Element (macroscopic)', zh: '元素（宏觀）', def: 'A pure substance that cannot be broken down into anything simpler by chemical methods.' },
    { en: 'Element (microscopic)', zh: '元素（微觀）', def: 'Made up of one kind of atom only.' },
    { en: 'Chemical symbol', zh: '化學符號', def: 'One or two letters that represent an element; the first letter is a capital, e.g. Na, Cu.' },
    { en: 'Molecule', zh: '分子', def: 'A discrete, neutral particle formed by one atom, or more than one atom chemically combined together.' },
    { en: 'Chemical formula', zh: '化學式', def: 'Shows the atoms in one particle; the subscript is the number of atoms, e.g. O<sub>2</sub>, P<sub>4</sub>.' },
    { en: 'Metal', zh: '金屬', def: 'Shiny, malleable and ductile; good conductor of heat and electricity; solid except mercury.' },
    { en: 'Non-metal', zh: '非金屬', def: 'Usually dull and brittle; poor conductor (except graphite); solid or gas (except bromine, a liquid).' },
    { en: 'Semi-metal (metalloid)', zh: '半金屬（類金屬）', def: 'An element with properties of both metals and non-metals, e.g. boron, silicon.' },
    { en: 'Semiconductor', zh: '半導體', def: 'Conducts electricity only when heated or slightly impure; not at room conditions.' },
    { en: 'Hardness', zh: '硬度', def: 'The ability to resist scratching or cutting.' },
    { en: 'Malleable', zh: '有展性', def: 'Can be hammered into sheets.' },
    { en: 'Ductile', zh: '有延性', def: 'Can be drawn into wires.' },
    { en: 'Brittle', zh: '脆', def: 'Can be easily broken into small pieces when bent.' },
    { en: 'Allotropes', zh: '同素異形體', def: 'Different forms of the same element in the same physical state, e.g. diamond and graphite.' },
    { en: 'Diamond', zh: '金剛石', def: 'An allotrope of carbon: colourless, transparent and sparkling; very hard (the hardest natural substance); does not conduct electricity; melting point around 3500 °C.' },
    { en: 'Graphite', zh: '石墨', def: 'An allotrope of carbon: black (dark grey), shiny and opaque; soft and slippery; conducts electricity (an exception among non-metals).' },
    { en: 'Electrical conductivity', zh: '導電性', def: 'How well a substance conducts electricity. Test: connect it between crocodile clips in a circuit with a battery and a bulb — if the bulb lights up, it conducts.' },
    { en: 'Thermal conductivity', zh: '導熱性', def: 'How well a substance conducts heat. Metals are good conductors of heat; non-metals are poor conductors of heat.' },
    { en: 'Room conditions', zh: '室溫及常壓', def: '25 °C and 1 atm.' }
  ];

  /* =========================================================
     Register
     ========================================================= */
  A.registerChapter({
    id: 'ch1', num: 1, title: 'Elements', zh: '元素', icon: '⚛️', accent: 'c1',
    intro: 'Atoms, molecules, chemical symbols, and how metals differ from non-metals.',
    lessons: [
      { id: 'ch1-1', num: '1.1', kicker: 'Revision', title: 'Classification of Matter & Particle Diagrams', short: 'Particles', zh: '物質的分類與粒子圖', render: root => lessonParticles(root) },
      { id: 'ch1-2', num: '1.2', kicker: 'Macroscopic view', title: 'Elements & Chemical Symbols', short: 'Symbols', zh: '元素與化學符號', render: root => lessonSymbols(root) },
      { id: 'ch1-3', num: '1.2', kicker: 'Microscopic view', title: 'Atoms, Molecules & Formulae', short: 'Molecules', zh: '原子、分子與化學式', render: root => lessonMolecules(root) },
      { id: 'ch1-4', num: '1.3', kicker: 'States & types', title: 'Classification of Elements', short: 'Classify', zh: '元素的分類', render: root => lessonClassify(root) },
      { id: 'ch1-5', num: '1.4', kicker: 'Experiment 1.1', title: 'General Properties of Metals & Non-metals', short: 'Properties', zh: '金屬與非金屬的性質', render: root => lessonProperties(root) },
      { id: 'ch1-6', num: '1.4', kicker: 'Exceptions & revision', title: 'Allotropes of Carbon & Semi-metals', short: 'Carbon & more', zh: '碳的同素異形體與半金屬', render: root => lessonCarbon(root) }
    ],
    questions: Q,
    glossary: GLOSSARY
  });
})();
