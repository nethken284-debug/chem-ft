/* ==========================================================
   Chem FT — Chapter 2 (Part A) · Compounds & Mixtures 化合物與混合物
   Section 2.1 (book p.1–5): compounds, Experiment 2.1, mixtures
   (alloys, mixtures of compounds, air) and classification practice.
   Registers chapter 'ch2'; ch2b.js appends lessons ch2-4 onwards.
   Styles: injected once as <style id="style-ch2">, classes .c2-*
   ========================================================== */
(function () {
  'use strict';
  const A = window.ChemApp;
  const { h, MOL } = A;
  const F = A.chem;
  const T = A.term;
  const REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  let uidN = 0;
  const uid = p => 'c2' + (p || 'u') + (++uidN);
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const rand = (a, b) => a + Math.random() * (b - a);

  /* =========================================================
     Styles
     ========================================================= */
  const CSS = `
:root{
  --c2-ca:#6fb6e8; --c2-co:#7b8cd9; --c2-ni:#58b38a;
  --c2-fe:#8e97a2; --c2-s:#f2c94c; --c2-fes:#2a2c31; --c2-fes-line:#6b7079;
  --c2-cu:#d27c4b; --c2-sn:#c4c9d0;
  --c2-water:rgba(64,150,240,.18); --c2-waterline:rgba(64,150,240,.7);
  --c2-glass:var(--ink-3);
  --c2-glassfill:color-mix(in srgb,var(--surface-2) 70%,rgba(150,195,230,.45));
  --c2-ceramic:#ece6da; --c2-hot:#ffb27a;
}
@media (prefers-color-scheme: dark){
  :root:not([data-theme="light"]){ --c2-ceramic:#3b3e47; --c2-hot:#8a4a22; --c2-fes:#16171a; --c2-fes-line:#80858e; --c2-water:rgba(80,160,255,.20); }
}
:root[data-theme="dark"]{ --c2-ceramic:#3b3e47; --c2-hot:#8a4a22; --c2-fes:#16171a; --c2-fes-line:#80858e; --c2-water:rgba(80,160,255,.20); }

.c2-svg{display:block;width:100%;height:auto;margin:0 auto;user-select:none;-webkit-user-select:none}
.c2-svg text{font-family:var(--font)}
.c2-t{fill:var(--ink);font-weight:800;font-size:13px}
.c2-t2{fill:var(--ink-2);font-weight:700;font-size:12px}
.c2-mid{text-anchor:middle}
.c2-atom{stroke:var(--atom-stroke);stroke-width:1.3}
.c2-atl{font-weight:900;pointer-events:none;font-family:var(--font)}
.c2-glass{fill:none;stroke:var(--c2-glass);stroke-width:2.5;stroke-linejoin:round;stroke-linecap:round}
.c2-glassfill{fill:var(--c2-glassfill)}
.c2-water{fill:var(--c2-water)}
.c2-waterline{stroke:var(--c2-waterline);stroke-width:1.6}
.c2-steel{fill:#aeb6bf;stroke:#6f7882;stroke-width:1}
.c2-grain{stroke:rgba(0,0,0,.28);stroke-width:.6}
.c2-grain.fes{stroke:var(--c2-fes-line)}
.c2-bond line{stroke:var(--ink-3);stroke-width:3;stroke-linecap:round}
.c2-pb svg{width:100%;height:auto;max-width:190px;margin:0 auto;display:block}
.c2-gap{margin-top:14px}
.c2-lab .btn-sm,.c2-beans .btn-sm,.c2-done .btn-sm,.c2-center .btn-sm,.c2-gap .btn-sm,.c2-k .btn-sm,.c2-sortc .btn-sm,.c2-live .btn-sm{min-height:42px}
.c2-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.c2-center{display:flex;justify-content:center;flex-wrap:wrap;gap:8px}
.c2-note-sm{font-size:14px;color:var(--ink-2)}
.c2-ask-q{font-weight:800;margin:14px 0 10px}
.c2-done{text-align:center;padding:10px 4px 2px}
.c2-done .c2-emoji{font-size:42px;line-height:1.2}
.c2-done p{margin:4px 0 12px;color:var(--ink-2)}

/* goals */
.c2-goals summary{cursor:pointer;list-style:none;display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-weight:800}
.c2-goals summary::-webkit-details-marker{display:none}
.c2-goals summary::after{content:"▾";margin-left:auto;color:var(--ink-3);transition:transform .2s}
.c2-goals[open] summary::after{transform:rotate(180deg)}
.c2-goals ol{margin:12px 0 6px;padding-left:1.3em}
.c2-goals li{margin:.25em 0}
.c2-goals li::marker{color:var(--accent);font-weight:900}
.c2-goals ol.c2-sdl{margin-top:6px;font-style:italic;color:var(--ink-2);font-size:15px}

/* figures */
.c2-vs{display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);gap:12px;align-items:center;margin-top:12px}
.c2-vs-mid{font-weight:900;color:var(--ink-3);font-size:15px}
.c2-fig{margin:0;display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center;min-width:0}
.c2-fig figcaption{font-size:14px;line-height:1.35}
.c2-fig figcaption b{display:block;font-weight:900}
.c2-fig figcaption small{display:block;color:var(--ink-2);font-size:13px;font-weight:600}
.c2-specs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:6px}
@media(max-width:600px){.c2-specs{grid-template-columns:1fr}}
.c2-spec{border:1px solid var(--line);border-radius:var(--radius-sm);padding:14px;background:var(--surface-2);display:grid;grid-template-columns:120px minmax(0,1fr);gap:14px;align-items:center}
.c2-spec .c2-pb svg{max-width:120px}
.c2-spec h4{margin:0 0 4px;font-size:17px}
.c2-spec .c2-f{font-size:24px;font-weight:900;color:var(--accent);line-height:1.1}
.c2-spec p{margin:6px 0 0;font-size:14px;color:var(--ink-2)}
@media(max-width:420px){.c2-spec{grid-template-columns:96px minmax(0,1fr);gap:10px;padding:12px}.c2-spec .c2-pb svg{max-width:96px}}
.c2-mini-l{font-size:12px;font-weight:900;letter-spacing:.05em;text-transform:uppercase;color:var(--ink-3);margin-top:6px}
.c2-choices.c2-minich{grid-template-columns:repeat(auto-fit,minmax(44px,1fr));gap:6px;margin:4px 0 4px}
.c2-minich .c2-choice.c2-choice{min-height:42px;padding:6px 4px;font-size:15px;gap:3px}
.c2-cwout{margin-top:8px}
.c2-pill{display:inline-block;font-size:12px;font-weight:800;padding:2px 9px;border-radius:999px;background:var(--bg-soft);color:var(--ink-2);margin-left:4px;vertical-align:middle}
.c2-hc{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:10px;align-items:end}
@media(max-width:600px){.c2-hc{grid-template-columns:repeat(2,minmax(0,1fr))}}
.c2-mixfig{display:grid;grid-template-columns:minmax(0,170px) minmax(0,1fr);gap:16px;align-items:center;margin-top:14px}
.c2-mixfig .c2-pb svg{max-width:170px}
@media(max-width:420px){.c2-mixfig{grid-template-columns:120px minmax(0,1fr);gap:12px}}
.c2-key{display:inline-block;width:11px;height:11px;border-radius:50%;border:1px solid var(--atom-stroke);margin:0 3px 0 1px;vertical-align:-1px}

/* choices */
.c2-choices{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px}
.c2-choice{display:flex;align-items:center;justify-content:center;gap:6px;text-align:center;padding:11px 14px;min-height:48px;border-radius:var(--radius-sm);border:1.5px solid var(--line-2);background:var(--surface);font-weight:800;font-size:15px;cursor:pointer;transition:border-color .12s,background .12s,transform .08s;-webkit-tap-highlight-color:transparent}
.c2-choice:hover:not(:disabled){border-color:var(--accent)}
.c2-choice:active:not(:disabled){transform:scale(.98)}
.c2-choice:disabled{cursor:default}
.c2-choice.right{border-color:var(--good);background:var(--good-soft);color:var(--good)}
.c2-choice.wrong{border-color:var(--bad);background:var(--bad-soft);color:var(--bad);opacity:.8}
.c2-mark{font-weight:900}

/* atom workshop */
.c2-target{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:10px 14px;border-radius:var(--radius-sm);background:var(--accent-soft);font-weight:700}
.c2-target b{font-weight:900}
.c2-target .c2-tf{font-size:22px;font-weight:900;color:var(--accent);margin-left:auto}
.c2-bench{fill:var(--bg-soft);stroke:var(--line-2);stroke-width:1.5;stroke-dasharray:6 5}
.c2-glow{fill:var(--accent-soft);stroke:var(--accent);stroke-width:2;transition:opacity .35s}
.c2-palette{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-top:10px}
.c2-atombtn{display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 4px;min-height:64px;border-radius:var(--radius-sm);border:1.5px solid var(--line-2);background:var(--surface);cursor:pointer;font-weight:800;font-size:13px;color:var(--ink-2);-webkit-tap-highlight-color:transparent;transition:transform .08s,border-color .12s}
.c2-atombtn:hover:not(:disabled){border-color:var(--accent)}
.c2-atombtn:active:not(:disabled){transform:scale(.95)}
.c2-atombtn:disabled{opacity:.45;cursor:default}
.c2-dot{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;border:1.5px solid var(--atom-stroke);font-weight:900;font-size:13px;color:#fff}
.c2-dot.lt{color:#2a2f3a}
.c2-live{display:flex;align-items:center;gap:10px;flex-wrap:wrap;justify-content:space-between;margin-top:8px;min-height:36px}
.c2-live span{font-weight:800;color:var(--ink-2);font-size:15px}

/* formula cracker */
.c2-fcard{border:1.5px solid var(--line-2);border-radius:var(--radius);padding:16px;text-align:center;background:var(--surface-2)}
.c2-fsegs{display:flex;justify-content:center;align-items:flex-start;gap:0;flex-wrap:wrap;transition:gap .45s cubic-bezier(.3,1.4,.5,1)}
.c2-fseg{display:flex;flex-direction:column;align-items:center;border:0 solid transparent;border-radius:12px;padding:0;transition:background .3s,border-color .3s,padding .3s}
.c2-fsym{font-size:40px;font-weight:900;line-height:1.15}
.c2-fcount{font-size:13px;font-weight:800;color:var(--ink-2);max-height:0;max-width:0;white-space:nowrap;overflow:hidden;opacity:0;transition:max-height .35s,max-width .35s,opacity .35s}
.c2-fcard.open .c2-fsegs{gap:10px}
.c2-fcard.open .c2-fseg{background:color-mix(in srgb,var(--el) 24%,var(--surface));border-width:2px;border-color:var(--el);padding:2px 10px 6px}
.c2-fcard.open .c2-fcount{max-height:40px;max-width:160px;opacity:1}
.c2-fname{margin-top:6px;font-weight:800}
@media(max-width:420px){.c2-fsym{font-size:30px}.c2-fcard.open .c2-fsegs{gap:6px}.c2-fcard.open .c2-fseg{padding:2px 6px 5px}.c2-fcount{font-size:11px}}
.c2-atomrow{display:flex;justify-content:center;flex-wrap:wrap;gap:5px;margin-top:10px;min-height:20px}
.c2-atomrow i{width:16px;height:16px;border-radius:50%;border:1.3px solid var(--atom-stroke);display:inline-block}
.c2-elchips{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-top:14px}
@media(max-width:520px){.c2-elchips{grid-template-columns:repeat(2,minmax(0,1fr))}}
.c2-elchip{display:flex;align-items:center;gap:8px;padding:8px 10px;min-height:46px;border-radius:var(--radius-sm);border:1.5px solid var(--line-2);background:var(--surface);cursor:pointer;font-weight:800;font-size:14px;text-align:left;-webkit-tap-highlight-color:transparent;transition:all .12s}
.c2-elchip .c2-dot{width:26px;height:26px;font-size:12px;flex:none}
.c2-elchip.on{border-color:var(--accent);background:var(--accent-soft);transform:translateY(-1px)}
.c2-elchip.right{border-color:var(--good);background:var(--good-soft);color:var(--good)}
.c2-elchip.wrong{border-color:var(--bad);background:var(--bad-soft);color:var(--bad)}
.c2-elchip:disabled{cursor:default}

/* experiment 2.1 */
.c2-proc{margin-bottom:12px;font-size:15px}
.c2-proc summary{cursor:pointer;font-weight:800;color:var(--ink-2)}
.c2-proc ol{margin:8px 0 0;padding-left:1.3em;color:var(--ink-2)}
.c2-tabs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
@media(max-width:560px){.c2-tabs{grid-template-columns:repeat(2,minmax(0,1fr))}}
.c2-tab{display:flex;flex-direction:column;align-items:flex-start;gap:0;padding:8px 12px;min-height:52px;border-radius:var(--radius-sm);border:1.5px solid var(--line-2);background:var(--surface);cursor:pointer;text-align:left;position:relative;-webkit-tap-highlight-color:transparent}
.c2-tab b{font-size:14px;font-weight:900;line-height:1.25}
.c2-tab small{font-size:12px;font-weight:800;color:var(--ink-3);text-transform:uppercase;letter-spacing:.05em}
.c2-tab.on{border-color:var(--accent);background:var(--accent-soft)}
.c2-tab.done::after{content:"✓";position:absolute;top:6px;right:9px;font-weight:900;color:var(--good)}
.c2-lab{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:14px}
@media(max-width:640px){.c2-lab{grid-template-columns:1fr}}
.c2-panel{border-radius:var(--radius-sm);background:var(--bg-soft);padding:10px 10px 12px;display:flex;flex-direction:column;gap:8px;min-width:0}
.c2-panel-h{font-size:12px;font-weight:900;letter-spacing:.07em;text-transform:uppercase;color:var(--ink-3)}
.c2-panel .btn{align-self:center}
.c2-appear{font-size:14px;color:var(--ink-2);text-align:center;min-height:22px}
.c2-magnet{cursor:grab;touch-action:none;outline:none}
.c2-magnet:focus-visible .c2-maghit{stroke:var(--brand);stroke-width:2}
.c2-magl{fill:#fff;font-weight:900;font-size:13px;pointer-events:none}
.c2-hint{animation:c2nudge 1.4s ease-in-out infinite}
@keyframes c2nudge{50%{transform:translateX(6px)}}
.c2-res{display:grid;gap:8px;margin-top:16px}
.c2-res-row{display:grid;grid-template-columns:118px repeat(3,minmax(0,1fr));gap:8px;align-items:stretch}
.c2-res-head>div{font-size:12px;font-weight:900;letter-spacing:.05em;text-transform:uppercase;color:var(--ink-3);padding:0 4px}
.c2-res-name{display:flex;flex-direction:column;justify-content:center;font-size:14px;line-height:1.25}
.c2-res-name small{font-size:11px;font-weight:800;color:var(--ink-3);text-transform:uppercase;letter-spacing:.05em}
.c2-res-cell{background:var(--surface-2);border:1px solid var(--line);border-radius:10px;padding:8px 10px;font-size:14px;font-weight:700;line-height:1.35;min-height:42px}
.c2-res-cell.empty{color:var(--ink-3);font-weight:600;text-align:center}
@media(max-width:640px){
  .c2-res-head{display:none}
  .c2-res-row{grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;padding-top:10px;border-top:1px solid var(--line)}
  .c2-res-name{grid-column:1/-1;flex-direction:row;align-items:baseline;gap:8px;justify-content:flex-start}
  .c2-res-cell{font-size:13px;padding:6px 8px}
  .c2-res-cell::before{content:attr(data-h);display:block;font-size:10px;font-weight:900;letter-spacing:.05em;text-transform:uppercase;color:var(--ink-3);margin-bottom:2px;text-align:left}
}
.c2-concl{margin-top:16px}
.c2-concl h4{margin:0 0 6px}

/* beans toy */
.c2-beans{margin-top:12px;border-radius:var(--radius-sm);background:var(--bg-soft);padding:10px}
.c2-beans .c2-svg{max-width:420px}
.c2-bowl{fill:var(--surface);stroke:var(--ink-3);stroke-width:2}
.c2-cap{text-align:center;font-weight:800;font-size:15px;min-height:24px;margin-top:4px}

/* alloy maker */
.c2-stage{border-radius:var(--radius-sm);background:var(--bg-soft);padding:8px}
.c2-stage .c2-svg{max-width:440px}
.c2-cru{fill:var(--c2-ceramic);stroke:var(--ink-3);stroke-width:2.5;stroke-linejoin:round;transition:fill .8s}
.c2-cru.hot{fill:var(--c2-hot)}
.c2-flame{transition:opacity .4s}
.c2-flame path{transform-box:fill-box;transform-origin:50% 100%;animation:c2flick .16s ease-in-out infinite alternate}
@keyframes c2flick{to{transform:scaleY(.84) scaleX(1.06)}}
.c2-steps{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin:10px 0 2px}
.c2-stepp{font-size:13px;font-weight:800;padding:4px 12px;border-radius:999px;background:var(--surface);border:1.5px solid var(--line-2);color:var(--ink-3)}
.c2-stepp.done{border-color:var(--good);color:var(--good);background:var(--good-soft)}
.c2-tools{display:grid;grid-template-columns:repeat(auto-fit,minmax(96px,1fr));gap:8px;margin-top:10px}
.c2-tools .btn{padding:10px 8px}

/* salt lab */
.c2-slots{display:grid;gap:10px;margin-top:12px}
.c2-slotrow{display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-weight:700}
.c2-slot{min-width:120px;min-height:44px;border-radius:var(--radius-sm);border:2px dashed var(--line-2);background:var(--surface);font-weight:900;cursor:pointer;padding:6px 14px;color:var(--ink-3)}
.c2-slot.ready{border-color:var(--accent);background:var(--accent-soft)}
.c2-slot.right{border-style:solid;border-color:var(--good);background:var(--good-soft);color:var(--good)}
.c2-tags{display:flex;gap:10px;flex-wrap:wrap;margin-top:6px}

/* air */
.c2-airbox{border:2px solid var(--ink);border-radius:8px;background:var(--surface-2);max-width:520px}
.c2-airp{cursor:pointer;outline:none}
.c2-ring{fill:none;stroke:var(--accent);stroke-width:2.5;opacity:0;transition:opacity .2s}
.c2-airp.sel .c2-ring{opacity:1}
.c2-airinfo{min-height:48px;margin-top:10px;padding:10px 14px;border-radius:var(--radius-sm);background:var(--bg-soft);font-size:15px;display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.c2-badge{font-size:11px;font-weight:900;letter-spacing:.06em;text-transform:uppercase;padding:2px 8px;border-radius:999px;color:#fff;background:var(--ink-3)}
.c2-badge.el{background:var(--c1)}
.c2-badge.cp{background:var(--c2)}
.c2-badge.mx{background:var(--c0)}
.c2-found{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px;margin-top:10px}
@media(max-width:600px){.c2-found{grid-template-columns:repeat(3,minmax(0,1fr))}}
.c2-fi{border:1.5px dashed var(--line-2);border-radius:var(--radius-sm);padding:6px 4px;text-align:center;font-size:12px;font-weight:800;color:var(--ink-3);display:flex;flex-direction:column;align-items:center;gap:3px;min-height:74px;justify-content:center}
.c2-fi.on{border-style:solid;border-color:var(--good);background:var(--good-soft);color:var(--ink)}
.c2-fi svg{width:40px;height:26px}
.c2-comp{margin-top:18px;padding-top:16px;border-top:1px solid var(--line)}
.c2-waf{display:grid;grid-template-columns:minmax(0,190px) minmax(0,1fr);gap:18px;align-items:center;margin-top:12px}
@media(max-width:520px){.c2-waf{grid-template-columns:1fr;justify-items:center}}
.c2-waf .c2-svg{max-width:190px}
.c2-cell{fill:var(--bg-soft);transition:fill .35s}
.c2-legend{display:grid;gap:8px;font-size:15px;width:100%}
.c2-legend div{display:flex;align-items:flex-start;gap:10px;opacity:.35;transition:opacity .3s}
.c2-legend div.on{opacity:1}
.c2-legend i{width:16px;height:16px;border-radius:4px;flex:none;margin-top:3px;border:1px solid var(--line-2)}
.c2-legend b{font-weight:900;min-width:44px;display:inline-block}

/* classify lesson */
.c2-sum{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:6px}
@media(max-width:700px){.c2-sum{grid-template-columns:1fr}}
.c2-sumcol{border:1px solid var(--line);border-radius:var(--radius-sm);padding:14px;background:var(--surface-2)}
.c2-sumcol h4{margin:0 0 8px;display:flex;align-items:center;gap:8px}
.c2-sumcol ul{margin:10px 0 0;padding-left:1.15em;font-size:15px}
.c2-sumcol li{margin:.2em 0}
.c2-sumcol .c2-pb svg{max-width:150px}
@media(max-width:700px){.c2-sumcol{display:grid;grid-template-columns:110px minmax(0,1fr);gap:4px 14px;align-items:start}.c2-sumcol h4{grid-column:1/-1}.c2-sumcol ul{margin:0}}
.c2-cw1{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px}
@media(max-width:640px){.c2-cw1{grid-template-columns:repeat(3,minmax(0,1fr));gap:4px}.c2-cw1 .c2-boxbtn{padding:3px}}
@media(max-width:480px){.c2-cw1{grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}.c2-cw1 .c2-boxbtn:last-child{grid-column:1/-1;justify-self:center;width:50%}}
.c2-boxbtn{display:flex;flex-direction:column;align-items:center;gap:4px;padding:6px;border-radius:12px;border:2px solid transparent;background:none;cursor:pointer;min-width:0;-webkit-tap-highlight-color:transparent;transition:border-color .15s,background .15s}
.c2-boxbtn:hover:not(:disabled){border-color:var(--line-2)}
.c2-boxbtn svg{width:100%;height:auto;max-width:150px}
/* the book's black-and-white diagrams: printed-paper panel so black atoms stay visible in dark mode */
.c2-cw1 .pbox,.c2-paper .pbox{background:#f7f5ef}
.c2-paper{display:flex;justify-content:center}
.c2-boxbtn .c2-bl{font-weight:900;font-size:15px}
.c2-boxbtn .c2-bt{font-size:12px;font-weight:800;color:var(--good);min-height:16px;line-height:1.25;text-align:center}
.c2-boxbtn.right{border-color:var(--good);background:var(--good-soft)}
.c2-boxbtn.wrong{border-color:var(--bad);background:var(--bad-soft)}
.c2-boxbtn:disabled{cursor:default}
.c2-qline{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:2px 0 12px;font-size:17px;font-weight:800;padding:10px 14px;border-radius:var(--radius-sm);background:var(--accent-soft)}
.c2-dots{display:flex;gap:5px;margin-left:auto}
.c2-dots i{width:9px;height:9px;border-radius:50%;background:var(--line-2)}
.c2-dots i.on{background:var(--accent)}
.c2-dots i.ok{background:var(--good)}
.c2-sub{display:grid;grid-template-columns:150px minmax(0,1fr);gap:16px;align-items:center;margin-top:12px}
@media(max-width:520px){.c2-sub{grid-template-columns:1fr;justify-items:center;text-align:center}}
.c2-sub .c2-pb svg{max-width:150px}
.c2-sname{font-size:20px;font-weight:900;text-align:center;margin:8px 0 12px;line-height:1.3}
.c2-sname small{display:block;font-size:14px;font-weight:700;color:var(--ink-2)}
.c2-det{display:flex;justify-content:center;margin:6px 0 12px}
.c2-det svg{width:100%;height:auto;max-width:330px}
.c2-hud{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.c2-hud .pill{font-size:13px}
.c2-bigch{grid-template-columns:repeat(3,minmax(0,1fr))}
.c2-bigch .c2-choice{font-size:16px;min-height:54px;padding:10px 6px}
@media(max-width:420px){.c2-bigch .c2-choice{font-size:14px;padding:8px 3px;gap:3px}}
`;
  function injectStyle() {
    if (document.getElementById('style-ch2')) return;
    const st = document.createElement('style');
    st.id = 'style-ch2'; st.textContent = CSS;
    document.head.appendChild(st);
  }
  injectStyle();

  /* =========================================================
     Shared data
     ========================================================= */
  const ELNAME = {
    H: 'hydrogen', O: 'oxygen', C: 'carbon', N: 'nitrogen', Na: 'sodium', Cl: 'chlorine', Ca: 'calcium',
    S: 'sulphur', Fe: 'iron', Ar: 'argon', Cu: 'copper', Sn: 'tin', Au: 'gold', Co: 'cobalt', Ni: 'nickel'
  };
  const EXTRA_COL = { Ca: 'var(--c2-ca)', Co: 'var(--c2-co)', Ni: 'var(--c2-ni)' };
  const col = el => EXTRA_COL[el] || A.atomColor(el);
  const LIGHT_ATOMS = new Set(['H', 'S', 'Sn', 'Au', 'Fe', 'Ca', 'X']);

  /* =========================================================
     Small helpers (SVG, motion, feedback)
     ========================================================= */
  function svgBox(w, hh, label, cls) {
    return h('svg', { class: 'c2-svg' + (cls ? ' ' + cls : ''), viewBox: '0 0 ' + w + ' ' + hh, role: 'img', 'aria-label': label });
  }
  function stext(x, y, s, cls, attrs) { return h('text', Object.assign({ x, y, class: cls || 'c2-t' }, attrs || {}), s); }
  function place(node, x, y, rot, s) {
    node.setAttribute('transform', 'translate(' + x.toFixed(1) + ',' + y.toFixed(1) + ')' +
      (rot ? ' rotate(' + rot.toFixed(1) + ')' : '') + (s != null && s !== 1 ? ' scale(' + Math.max(0.001, s).toFixed(3) + ')' : ''));
  }
  // atom sphere (optionally with a letter or a metallic shine)
  function atomNode(el, r, opt) {
    opt = opt || {};
    const g = h('g');
    g.appendChild(h('circle', { class: 'c2-atom', r, fill: col(el) }));
    if (opt.shine) g.appendChild(h('circle', { r: (r * .3).toFixed(1), cx: (-r * .35).toFixed(1), cy: (-r * .38).toFixed(1), fill: '#fff', opacity: .5 }));
    if (opt.label) g.appendChild(h('text', { class: 'c2-atl', 'text-anchor': 'middle', 'dominant-baseline': 'central', 'font-size': Math.round(r * (el.length > 1 ? .8 : 1)), fill: LIGHT_ATOMS.has(el) ? '#2a2f3a' : '#fff' }, el));
    return g;
  }
  // molecule template (MOL.*) drawn as a <g> centred on 0,0
  function molNode(mol) {
    const g = h('g');
    mol.slice().sort((a, b) => a.y - b.y).forEach(a => { const n = atomNode(a.el, a.r); place(n, a.x, a.y); g.appendChild(n); });
    return g;
  }
  // tiny inline svg icon of a molecule
  function molIcon(mol, label) {
    const ext = Math.max(...mol.map(a => Math.max(Math.abs(a.x), Math.abs(a.y)) + a.r)) + 2;
    const s = h('svg', { viewBox: (-ext * 1.5) + ' ' + (-ext) + ' ' + (ext * 3) + ' ' + (ext * 2), role: 'img', 'aria-label': label || 'molecule' });
    s.appendChild(molNode(mol));
    return s;
  }
  function svgPt(svg, e) {
    const m = svg.getScreenCTM(); if (!m) return { x: 0, y: 0 };
    return new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
  }
  const ease = p => p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
  function tween(ms, fn, done) {
    if (REDUCED || ms <= 0) { fn(1, 1); if (done) done(); return () => {}; }
    const t0 = performance.now(); let dead = false;
    A.loop((dt, now) => {
      if (dead) return false;
      const p = Math.min(1, (now - t0) / ms);
      fn(ease(p), p);
      if (p >= 1) { dead = true; if (done) done(); return false; }
    });
    return () => { dead = true; };
  }
  const tw = (ms, fn) => new Promise(res => tween(ms, fn, res));
  const pause = ms => new Promise(res => A.later(res, REDUCED ? 0 : ms));
  // rAF loop that idles while its element is off-screen; auto-stops on navigation
  function liveLoop(el, fn) {
    let vis = true;
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(es => { vis = es[es.length - 1].isIntersecting; });
      io.observe(el); A.onCleanup(() => io.disconnect());
    }
    return A.loop((dt, now) => { if (!el.isConnected) return false; if (vis) fn(dt, now); });
  }
  function fbox() {
    const el = h('div', { class: 'feedback', 'aria-live': 'polite' });
    el.set = (kind, html) => { el.className = 'feedback' + (kind ? ' ' + kind : ''); el.innerHTML = html; };
    return el;
  }
  // tap-until-right choice buttons; onPick(ok, firstTry, value)
  function choices(opts, isRight, onPick, cls) {
    let tries = 0, done = false;
    const box = h('div', { class: 'c2-choices' + (cls ? ' ' + cls : '') });
    opts.forEach(o => {
      const b = h('button', { class: 'c2-choice', type: 'button', html: o.html });
      b.addEventListener('click', () => {
        if (done || b.disabled) return;
        tries++;
        if (isRight(o.value)) {
          done = true; b.classList.add('right'); b.insertAdjacentHTML('beforeend', ' <span class="c2-mark">✓</span>');
          box.querySelectorAll('button').forEach(x => { x.disabled = true; });
          A.sound('good'); onPick(true, tries === 1, o.value);
        } else {
          b.classList.add('wrong'); b.disabled = true; b.insertAdjacentHTML('beforeend', ' <span class="c2-mark">✗</span>');
          box.classList.remove('shake'); void box.offsetWidth; box.classList.add('shake');
          A.sound('bad'); onPick(false, false, o.value);
        }
      });
      box.appendChild(b);
    });
    return box;
  }
  function doneBox(emoji, title, text, again) {
    return h('div', { class: 'c2-done pop-in' },
      h('div', { class: 'c2-emoji', text: emoji }), h('h3', { html: title }), text ? h('p', { html: text }) : null,
      again ? h('button', { class: 'btn btn-sm', text: '↻ Play again', on: { click: again } }) : null);
  }
  function pb(spec) { return A.particleBox(Object.assign({ w: 150, h: 110 }, spec)); }
  function pbFig(spec, caption) {
    return h('figure', { class: 'c2-fig' }, h('div', { class: 'c2-pb', style: { width: '100%' } }, pb(spec)), caption ? h('figcaption', { html: caption }) : null);
  }
  // build a lattice array that exactly fills particleBox's solid grid
  function latticeFor(w, hh, r, pick) {
    const step = r * 2.05;
    const n = Math.floor((w - 6) / step) * Math.floor((hh - 6) / step);
    return Array.from({ length: n }, (_, i) => pick(i, n));
  }
  function scatter(major, minors, every, seed) {
    const R = A.rng(seed || 5);
    return (i) => (R() < 1 / every ? minors[Math.floor(R() * minors.length)] : major);
  }
  function parseFormula(f) {
    const out = []; f.replace(/([A-Z][a-z]?)(\d*)/g, (m, el, n) => { out.push([el, n ? +n : 1]); return m; });
    return out;
  }

  /* ---------- molecule templates used in several places ---------- */
  const WATER = (r) => MOL.bent('O', 'H', r || 8);
  const CO2 = (r) => MOL.linear('C', 'O', r || 7);
  const CH4 = (r) => { r = r || 7; const s = r * .55, d = r * 1.05; return MOL.custom([[0, -d, s, 'H'], [-d, 0, s, 'H'], [d, 0, s, 'H'], [0, d, s, 'H'], [0, 0, r, 'C']]); };
  // the book's black-and-white classwork molecules
  const CW = {
    WW: () => MOL.custom([[-5, 0, 6.5, 'H'], [5, 0, 6.5, 'H']]),
    BB: () => MOL.custom([[-3.4, 0, 4.3, 'C'], [3.4, 0, 4.3, 'C']]),
    Wb: () => MOL.custom([[-2, 0, 7, 'H'], [7.4, 0, 3.8, 'C']]),
    bWb: () => MOL.custom([[0, 1.6, 7, 'H'], [-6.1, -4.6, 3.8, 'C'], [6.1, -4.6, 3.8, 'C']])
  };
  const CW_SPEC = {
    A: [['BB', 4], ['WW', 6]], B: [['WW', 5], ['Wb', 4]], C: [['Wb', 3], ['bWb', 3]], D: [['WW', 9]], E: [['Wb', 6]]
  };
  function cwBox(letter, seed, w, hh) {
    return A.particleBox({ w: w || 130, h: hh || 104, seed: seed || (letter.charCodeAt(0) * 7), aria: 'Particle diagram ' + letter,
      groups: CW_SPEC[letter].map(([k, n]) => ({ mol: CW[k](), n })) });
  }
  const CLASS_OPTS = ['a single element', 'a single compound', 'a mixture of elements', 'a mixture of two compounds', 'a mixture of an element and a compound'];

  /* =========================================================
     LESSON 2.1a — Compounds
     ========================================================= */
  function goalsCard() {
    const goals = [
      'Identify substances as <b>elements, compounds or mixtures</b> and explain.',
      'Compare elements, compounds and mixtures using <b>particle diagrams</b>.',
      'Recognise examples of compounds and mixtures, including <b>alloys</b> and <b>crude oil</b>.',
      'Identify <b>physical changes</b> and <b>chemical changes</b> and explain.',
      'Write and balance simple <b>chemical equations</b>.',
      'Identify different <b>physical properties</b> and <b>chemical properties</b>.',
      'Compare the properties of mixtures and compounds with their <b>constituent elements</b>.'
    ];
    const selfDirected = [
      'Relate the use of metals to their ease of extraction and availability.',
      'Relate the properties of metals to their uses.',
      'Recognise that <b>fractional distillation</b> is the method for separating crude oil into different fractions. <span class="muted">(section 2.2)</span>',
      'State some major uses of different <b>oil fractions</b>. <span class="muted">(section 2.2)</span>',
      'Recognise that plastics are macromolecules made by joining up many hydrocarbon molecules, and give examples of plastics and their usage.'
    ];
    return h('details', { class: 'card c2-goals' },
      h('summary', null, h('span', { class: 'card-tag', text: 'Chapter 2' }), h('span', { text: 'Learning objectives' }), h('span', { class: 'tiny', text: '12 goals · tap to open' })),
      h('ol', null, goals.map(g => h('li', { html: g }))),
      h('div', { class: 'c2-panel-h', style: { marginTop: '10px' }, text: 'Self-directed learning' }),
      h('ol', { start: '8', class: 'c2-sdl' }, selfDirected.map(g => h('li', { html: g }))));
  }

  function noteCompound() {
    const card = A.noteCard('What is a compound?', '', '2.1');
    const body = card.lastChild;
    body.appendChild(A.keybox('A <b>' + T('compound', '化合物') + '</b> is a <b>pure</b> substance that is made up of two or more elements <b>' + T('chemically combined', '化學結合') + '</b>.'));
    body.appendChild(h('ul', { html:
      '<li>Compounds can be shown with <b>' + T('particle diagrams', '粒子圖') + '</b>.</li>' +
      '<li>Spheres of <b>different colours or shapes</b> = atoms of <b>different elements</b>.</li>' +
      '<li>In a compound, some spheres <b>stick</b> to one another: they are <b>chemically combined</b>.</li>' }));
    body.appendChild(h('div', { class: 'c2-vs' },
      pbFig({ groups: [{ mol: MOL.di('X', null, 9), n: 5 }], seed: 11, motion: 'jiggle', aria: 'Element: molecules made of the same atoms' }, '<b>Element</b><small>every atom is the same kind</small>'),
      h('div', { class: 'c2-vs-mid', text: 'vs' }),
      pbFig({ groups: [{ mol: MOL.di('C', 'H', 9), n: 5 }], seed: 12, motion: 'jiggle', aria: 'Compound: molecules made of two different atoms stuck together' }, '<b>Compound</b><small>different atoms stuck together</small>')));
    return card;
  }

  /* ---------- Game: Atom Workshop ---------- */
  const BUILDS = [
    { f: 'H2O', name: 'water', mol: () => WATER(20), kind: 'compound', why: 'It is made of <b>two elements</b>, hydrogen and oxygen, <b>chemically combined</b>.' },
    { f: 'CO2', name: 'carbon dioxide', mol: () => CO2(17), kind: 'compound', why: 'It is made of <b>two elements</b>, carbon and oxygen, <b>chemically combined</b>.' },
    { f: 'O2', name: 'oxygen', mol: () => MOL.di('O', null, 19), kind: 'element', why: 'Both atoms are oxygen atoms: only <b>one kind of atom</b>.' },
    { f: 'N2', name: 'nitrogen', mol: () => MOL.di('N', null, 19), kind: 'element', why: 'Both atoms are nitrogen atoms: only <b>one kind of atom</b>.' }
  ];
  const LOOSE_R = { H: 12, C: 17, N: 17, O: 17 };
  function needOf(f) { const o = {}; parseFormula(f).forEach(([el, n]) => { o[el] = n; }); return o; }
  function formulaOf(counts) {
    return ['C', 'H', 'N', 'O'].filter(el => counts[el]).map(el => el + (counts[el] > 1 ? counts[el] : '')).join('');
  }

  function atomWorkshop() {
    const card = A.playCard('Atom Workshop', 'Tap atoms to build each molecule. When they <b>stick together</b>, decide: element or compound?', '🔧 Build');
    const B = card.body;
    let step = 0, atoms = [], locked = false, firstTry = 0;
    const target = h('div', { class: 'c2-target' });
    const bench = svgBox(300, 150, 'Workbench. Atoms you add appear here.');
    bench.appendChild(h('rect', { x: 3, y: 3, width: 294, height: 144, rx: 16, class: 'c2-bench' }));
    const glow = h('ellipse', { cx: 150, cy: 74, rx: 74, ry: 50, class: 'c2-glow', opacity: 0 });
    bench.appendChild(glow);
    const layer = h('g'); bench.appendChild(layer);
    const hint = stext(150, 80, 'Tap an atom below to start', 'c2-t2 c2-mid'); bench.appendChild(hint);
    const live = h('span');
    const undo = h('button', { class: 'btn btn-sm btn-ghost', type: 'button', text: '↶ Undo', on: { click: () => removeLast() } });
    const clear = h('button', { class: 'btn btn-sm btn-ghost', type: 'button', text: '↺ Clear', on: { click: () => { while (atoms.length) removeLast(true); relayout(); } } });
    const pal = h('div', { class: 'c2-palette' });
    const palBtns = ['H', 'C', 'N', 'O'].map(el => {
      const b = h('button', { class: 'c2-atombtn', type: 'button', 'aria-label': 'Add a ' + ELNAME[el] + ' atom', on: { click: () => add(el) } },
        h('span', { class: 'c2-dot' + (LIGHT_ATOMS.has(el) ? ' lt' : ''), style: { background: col(el) }, text: el }), h('span', { text: ELNAME[el] }));
      pal.appendChild(b); return b;
    });
    const fb = fbox();
    const ask = h('div');
    B.append(target, h('div', { class: 'c2-stage', style: { marginTop: '10px' } }, bench), h('div', { class: 'c2-live' }, live, h('span', { class: 'c2-row' }, undo, clear)), pal, fb, ask);

    function cur() { return BUILDS[step]; }
    function counts() { const c = {}; atoms.forEach(a => { c[a.el] = (c[a.el] || 0) + 1; }); return c; }
    function slot(i) { return { x: 48 + i * 41, y: 74 + (i % 2 ? 13 : -13) }; }
    function drawTarget() {
      const t = cur();
      target.innerHTML = '<span>Build <b>one ' + t.name + ' molecule</b></span><span class="tiny">' + (step + 1) + ' / ' + BUILDS.length + '</span><span class="c2-tf">' + F(t.f) + '</span>';
      card.score.textContent = '';
    }
    function updateLive() {
      const c = counts();
      live.innerHTML = atoms.length ? 'On the bench: ' + Object.keys(c).map(el => c[el] + ' × ' + el).join(' + ') : '';
      hint.style.display = atoms.length ? 'none' : '';
      undo.disabled = !atoms.length || locked; clear.disabled = !atoms.length || locked;
      palBtns.forEach(b => { b.disabled = locked; });
    }
    function relayout() {
      atoms.forEach((a, i) => { const p = slot(i); const fx = a.x, fy = a.y; tween(200, e => { a.x = fx + (p.x - fx) * e; a.y = fy + (p.y - fy) * e; place(a.node, a.x, a.y, 0, a.s); }); });
      updateLive();
    }
    function add(el) {
      if (locked) return;
      const t = cur(), need = needOf(t.f), have = counts()[el] || 0;
      if (!need[el] || have >= need[el]) {
        // not needed: the atom pops onto the bench, wobbles and bounces off
        const node = atomNode(el, LOOSE_R[el], { label: true }), p = slot(atoms.length);
        layer.appendChild(node); A.sound('bad');
        fb.set('bad', '✗ One ' + t.name + ' molecule doesn’t need ' + (need[el] ? 'another ' : 'a ') + ELNAME[el] + ' atom, so it bounces off. Look at the formula ' + F(t.f) + '.');
        tween(600, (e, raw) => { place(node, p.x + Math.sin(raw * Math.PI * 6) * 7 * (1 - raw), p.y - 34 * raw, 0, 1 - .6 * raw); node.setAttribute('opacity', (1 - raw).toFixed(2)); }, () => node.remove());
        return;
      }
      const r0 = LOOSE_R[el];
      const node = atomNode(el, r0, { label: true });
      const p = slot(atoms.length);
      const a = { el, r0, node, x: p.x, y: p.y, s: 0 };
      atoms.push(a); layer.appendChild(node);
      tween(240, e => { a.s = e; place(node, a.x, a.y, 0, .2 + .8 * e); });
      A.sound('pop');
      updateLive();
      check();
    }
    function removeLast(silent) {
      if (locked || !atoms.length) return;
      const a = atoms.pop(); a.node.remove();
      if (!silent) { A.sound('click'); updateLive(); fb.set('', ''); }
    }
    function check() {
      const t = cur(), need = needOf(t.f), c = counts();
      const full = Object.keys(need).every(el => c[el] === need[el]);
      if (!full) { fb.set('', 'Good. Keep going…'); return; }
      locked = true; updateLive();
      fb.set('good', '✨ The atoms stick together: ' + F(formulaOf(c)) + '!');
      snap(t).then(askKind);
    }
    function snap(t) {
      const tpl = t.mol(), used = new Set();
      const plan = atoms.map(a => { const k = tpl.findIndex((p, j) => !used.has(j) && p.el === a.el); used.add(k); return { a, p: tpl[k] }; });
      const from = atoms.map(a => ({ x: a.x, y: a.y, s: a.s || 1 }));
      plan.slice().sort((u, v) => u.p.y - v.p.y).forEach(({ a }) => layer.appendChild(a.node));
      return tw(560, e => plan.forEach(({ a, p }, i) => {
        a.x = from[i].x + (150 + p.x - from[i].x) * e; a.y = from[i].y + (72 + p.y - from[i].y) * e;
        a.s = from[i].s + (p.r / a.r0 - from[i].s) * e; place(a.node, a.x, a.y, 0, a.s);
      })).then(() => { glow.setAttribute('opacity', .9); A.sound('pop'); });
    }
    function askKind() {
      const t = cur();
      ask.innerHTML = '';
      ask.appendChild(h('div', { class: 'c2-ask-q', html: 'Is ' + t.name + ' (' + F(t.f) + ') an element or a compound?' }));
      ask.appendChild(choices([{ html: 'Element', value: 'element' }, { html: 'Compound', value: 'compound' }], v => v === t.kind, (ok, first) => {
        if (!ok) { fb.set('bad', '❌ Look at the colours. How many <b>kinds</b> of atom are there?'); return; }
        if (first) firstTry++;
        fb.set('good', '✅ ' + cap(t.kind) + '! ' + t.why);
        ask.appendChild(h('div', { class: 'q-actions' }, h('button', { class: 'btn btn-primary', type: 'button', text: step + 1 < BUILDS.length ? 'Next molecule →' : 'Finish 🏁', on: { click: next } })));
      }));
    }
    function next() {
      step++;
      atoms.forEach(a => a.node.remove()); atoms = []; locked = false;
      glow.setAttribute('opacity', 0); ask.innerHTML = ''; fb.set('', '');
      if (step >= BUILDS.length) {
        B.innerHTML = '';
        B.appendChild(doneBox('🏆', 'All 4 molecules built!', 'Right first time: <b>' + firstTry + ' / 4</b>. An <b>element</b> has only one kind of atom. A <b>compound</b> has different elements <b>chemically combined</b>.',
          () => { const n = atomWorkshop(); card.replaceWith(n); }));
        A.sound('win'); A.celebrate(.5); A.reward('ch2-workshop', 15, 'Atom Workshop');
        return;
      }
      drawTarget(); updateLive();
    }
    drawTarget(); updateLive();
    return card;
  }

  function classworkCompounds() {
    const card = A.playCard('Classwork: complete the table', 'Look at each particle diagram. Pick the <b>physical state</b> (s / l / g) and decide: is it a <b>compound</b>?', '📝 Classwork');
    const body = card.body;
    let solved = 0;
    card.score.textContent = '0 / 2';
    const spec = (box, name, st, stWord, f, expl) => {
      let need = 2;
      const out = h('div', { class: 'c2-cwout', style: { display: 'none' } },
        h('div', { class: 'c2-f', html: F(f) + ' <span class="c2-pill">' + stWord + '</span>' }), h('p', { html: expl }));
      const hit = ok => {
        if (!ok || --need) return;
        out.style.display = ''; out.classList.add('pop-in');
        card.score.textContent = (++solved) + ' / 2';
        if (solved === 2) { A.sound('win'); A.reward('ch2-cwcomp', 10, 'Classwork'); }
      };
      return h('div', { class: 'c2-spec' },
        h('div', { class: 'c2-pb' }, box),
        h('div', null, h('h4', { text: name }),
          h('div', { class: 'c2-mini-l', text: 'Physical state?' }),
          choices(['s', 'l', 'g'].map(v => ({ html: v, value: v })), v => v === st, hit, 'c2-minich'),
          h('div', { class: 'c2-mini-l', text: 'Compound?' }),
          choices([{ html: 'Yes', value: true }, { html: 'No', value: false }], v => v === true, hit, 'c2-minich'),
          out));
    };
    body.appendChild(h('div', { class: 'c2-specs' },
      spec(pb({ groups: [{ mol: WATER(8), n: 8 }], layout: 'liquid', seed: 21, motion: 'jiggle', w: 120, h: 100, aria: 'Water molecules: one oxygen atom joined to two hydrogen atoms' }),
        'Water', 'l', 'liquid (l)', 'H2O', '✓ <b>Compound</b>. It is a <b>pure substance</b> that is made up of the elements <b>hydrogen</b> and <b>oxygen</b>, <b>chemically combined</b>.'),
      spec(pb({ groups: [{ mol: CO2(7), n: 5 }], seed: 22, motion: 'bounce', speed: 28, w: 120, h: 100, aria: 'Carbon dioxide molecules: one carbon atom joined to two oxygen atoms' }),
        'Carbon dioxide', 'g', 'gas (g)', 'CO2', '✓ <b>Compound</b>. It is a <b>pure substance</b> that is made up of the elements <b>carbon</b> and <b>oxygen</b>, <b>chemically combined</b>.')));
    body.appendChild(h('h4', { style: { margin: '18px 0 8px' }, text: 'Other examples of compounds' }));
    body.appendChild(A.table(['Example', 'Chemical formula', 'Constituent elements'], [
      [T('sodium chloride', '氯化鈉') + ' (table salt)', '<span class="formula">NaCl</span>', 'sodium, chlorine'],
      [T('calcium carbonate', '碳酸鈣') + ' (limestone)', '<span class="formula">' + F('CaCO3') + '</span>', 'calcium, carbon, oxygen'],
      [T('sodium sulphate', '硫酸鈉'), '<span class="formula">' + F('Na2SO4') + '</span>', 'sodium, sulphur, oxygen'],
      [T('iron(II) sulphide', '硫化亞鐵'), '<span class="formula">FeS</span>', 'iron, sulphur']
    ]));
    body.appendChild(h('p', { class: 'c2-note-sm', style: { margin: '10px 0 0' }, html: '💡 Each <b>capital letter</b> in a formula starts a new element symbol. The small number tells you how many atoms of the element just before it.' }));
    return card;
  }

  /* ---------- Game: Formula Cracker ---------- */
  const COMPOUNDS = [
    { name: 'water', f: 'H2O' },
    { name: 'carbon dioxide', f: 'CO2' },
    { name: 'sodium chloride', alias: 'table salt', f: 'NaCl' },
    { name: 'calcium carbonate', alias: 'limestone', f: 'CaCO3' },
    { name: 'sodium sulphate', f: 'Na2SO4' },
    { name: 'iron(II) sulphide', f: 'FeS' }
  ];
  const CRACK_ELS = ['H', 'O', 'C', 'Na', 'Cl', 'Ca', 'S', 'Fe'];

  function formulaCracker() {
    const card = A.playCard('Formula Cracker', 'Which elements are <b>chemically combined</b> in each compound? Tap all of them, then crack the formula open.', '🔍 Game');
    const B = card.body;
    const order = A.shuffle(COMPOUNDS);
    let i = 0, firstTries = 0;
    const stage = h('div');
    B.appendChild(stage);
    function draw() {
      const c = order[i], segs = parseFormula(c.f), need = new Set(segs.map(s => s[0]));
      let sel = new Set(), tries = 0, solved = false;
      stage.innerHTML = '';
      card.score.textContent = (i + 1) + ' / ' + order.length;
      const fcard = h('div', { class: 'c2-fcard' },
        h('div', { class: 'c2-fsegs' }, segs.map(([el, n]) => h('span', { class: 'c2-fseg', style: { '--el': col(el) } },
          h('span', { class: 'c2-fsym', html: el + (n > 1 ? '<sub>' + n + '</sub>' : '') }),
          h('span', { class: 'c2-fcount', text: n + ' × ' + ELNAME[el] })))),
        h('div', { class: 'c2-fname', html: cap(c.name) + (c.alias ? ' <span class="muted">(' + c.alias + ')</span>' : '') }));
      const atomRow = h('div', { class: 'c2-atomrow', 'aria-hidden': 'true' });
      fcard.appendChild(atomRow);
      const chips = h('div', { class: 'c2-elchips' });
      const chipBtn = {};
      CRACK_ELS.forEach(el => {
        const b = h('button', { class: 'c2-elchip', type: 'button', 'aria-pressed': 'false' },
          h('span', { class: 'c2-dot' + (LIGHT_ATOMS.has(el) ? ' lt' : ''), style: { background: col(el) }, text: el }), h('span', { text: ELNAME[el] }));
        b.addEventListener('click', () => {
          if (solved) return;
          sel.has(el) ? sel.delete(el) : sel.add(el);
          b.classList.toggle('on', sel.has(el)); b.setAttribute('aria-pressed', sel.has(el)); b.classList.remove('wrong');
          A.sound('click');
        });
        chipBtn[el] = b; chips.appendChild(b);
      });
      const fb = fbox();
      const crack = h('button', { class: 'btn btn-primary', type: 'button', text: '🔨 Crack it!' });
      const actions = h('div', { class: 'q-actions' }, crack);
      crack.addEventListener('click', () => {
        if (solved) return;
        if (!sel.size) { fb.set('bad', '👆 Tap the element(s) first.'); return; }
        const wrong = [...sel].filter(e => !need.has(e)), missing = [...need].filter(e => !sel.has(e));
        if (!wrong.length && !missing.length) {
          solved = true; if (tries === 0) firstTries++;
          sel.forEach(e => { chipBtn[e].classList.remove('on'); chipBtn[e].classList.add('right'); });
          Object.values(chipBtn).forEach(b => { b.disabled = true; });
          fcard.classList.add('open');
          segs.forEach(([el, n]) => { for (let k = 0; k < n; k++) atomRow.appendChild(h('i', { class: 'pop-in', style: { background: col(el), animationDelay: (k * 60) + 'ms' } })); });
          A.sound('good');
          const total = segs.reduce((s, x) => s + x[1], 0);
          fb.set('good', '✅ ' + F(c.f) + ' = ' + segs.map(([el, n]) => n + ' ' + ELNAME[el]).join(' + ') + ' (' + total + ' atoms in one unit), chemically combined.');
          crack.remove();
          actions.appendChild(h('button', { class: 'btn btn-primary', type: 'button', text: i + 1 < order.length ? 'Next compound →' : 'Finish 🏁', on: { click: () => { i++; i < order.length ? draw() : finish(); } } }));
        } else {
          tries++;
          wrong.forEach(e => { chipBtn[e].classList.add('wrong'); });
          fcard.classList.remove('shake'); void fcard.offsetWidth; fcard.classList.add('shake');
          A.sound('bad');
          fb.set('bad', '❌ Not quite: ' + [wrong.length ? wrong.length + ' wrong' : '', missing.length ? missing.length + ' missing' : ''].filter(Boolean).join(', ') + '. Hint: each capital letter starts a new element symbol.');
        }
      });
      stage.append(fcard, chips, fb, actions);
    }
    function finish() {
      stage.innerHTML = ''; card.score.textContent = '';
      stage.appendChild(doneBox(firstTries >= 5 ? '🏆' : '👍', 'All 6 compounds cracked!', 'Right first time: <b>' + firstTries + ' / 6</b>.',
        () => { const n = formulaCracker(); card.replaceWith(n); }));
      A.sound('win'); if (firstTries >= 5) A.celebrate(.5);
      A.reward('ch2-cracker', 15, 'Formula Cracker');
    }
    draw();
    return card;
  }

  /* ---------- Virtual lab: Experiment 2.1 ---------- */
  const SAMPLES = [
    { id: 'fe', name: 'Iron', type: 'element', appear: 'grey powder', magnet: 'attracted by the magnet', water: 'does not dissolve; sinks to the bottom',
      dish: [['fe', 44]], cup: [['fe', 26]],
      magMsg: 'The grey powder jumps towards the magnet: <b>iron is attracted</b>.',
      watMsg: 'Iron powder <b>does not dissolve</b> and it <b>sinks</b> to the bottom.' },
    { id: 's', name: 'Sulphur', type: 'element', appear: 'yellow powder', magnet: 'not attracted', water: 'does not dissolve; floats on the water',
      dish: [['s', 44]], cup: [['s', 26]],
      magMsg: 'Nothing moves: <b>sulphur is not attracted</b>.',
      watMsg: 'Sulphur powder <b>does not dissolve</b> and it <b>floats</b> on the water.' },
    { id: 'fes', name: 'Iron(II) sulphide', type: 'compound', appear: 'black (dark grey) solid', magnet: 'not attracted', water: 'does not dissolve; sinks',
      dish: [['fes', 20]], cup: [['fes', 12]],
      magMsg: 'Nothing moves! It contains iron, but iron(II) sulphide is <b>not attracted</b>.',
      watMsg: 'Iron(II) sulphide <b>does not dissolve</b> and it <b>sinks</b>.' },
    { id: 'mix', name: 'Iron + sulphur', type: 'mixture', appear: 'yellowish grey powder (grey and yellow bits can be seen)', magnet: 'iron powder is attracted and separated from the sulphur', water: 'iron sinks; sulphur floats',
      dish: [['fe', 22], ['s', 22]], cup: [['fe', 14], ['s', 14]],
      magMsg: 'The iron is pulled out and <b>separated from the sulphur</b>. The iron still behaves like iron!',
      watMsg: 'The iron <b>sinks</b> and the sulphur <b>floats</b>: each keeps its own properties.' }
  ];
  const GRAIN = {
    fe: { r: 2.5, fill: 'var(--c2-fe)', mag: true, float: false },
    s: { r: 2.7, fill: 'var(--c2-s)', mag: false, float: true },
    fes: { r: 4.4, fill: 'var(--c2-fes)', mag: false, float: false, chunk: true }
  };
  function grainNode(k) {
    const G = GRAIN[k];
    if (G.chunk) {
      const pts = Array.from({ length: 6 }, (_, i) => { const a = i / 6 * Math.PI * 2, rr = G.r * rand(.7, 1.15); return (Math.cos(a) * rr).toFixed(1) + ',' + (Math.sin(a) * rr).toFixed(1); });
      return h('polygon', { class: 'c2-grain fes', points: pts.join(' '), fill: G.fill });
    }
    return h('circle', { class: 'c2-grain', r: G.r, fill: G.fill });
  }
  const EXP_CONCLUSION = '<ul style="margin:6px 0 0;padding-left:1.2em">' +
    '<li>A <b>mixture keeps the properties of its constituents</b>: the iron is still attracted by the magnet and still sinks; the sulphur still floats. It can be <b>separated by physical means</b> (e.g. a magnet).</li>' +
    '<li>A <b>compound has different properties from its constituent elements</b>: iron(II) sulphide contains iron but is <b>not</b> attracted by a magnet.</li></ul>';

  function exp21() {
    const card = A.playCard('Experiment 2.1 · Comparing physical properties of mixture and compounds', 'A teacher’s demonstration that you can do yourself. Pick a sample, <b>drag the magnet</b> under the dish, then <b>add a spatula</b> of it to water.', '🔬 Virtual lab');
    const B = card.body;
    B.appendChild(h('details', { class: 'c2-proc' }, h('summary', { text: 'Procedure (from the book)' }), h('ol', { html:
      '<li>Observe the appearance of iron powder in a petri dish.</li><li>Move a magnet under the dish. Record the observation.</li>' +
      '<li>Add 1 spatula of iron powder into water. Describe the observation.</li>' +
      '<li>Repeat steps 1–3 using sulphur powder, iron(II) sulphide (a compound of iron and sulphur) and a mixture of iron and sulphur powder.</li>' })));

    const res = {}; SAMPLES.forEach(s => { res[s.id] = { mag: false, wat: false }; });
    let cur = null, concluded = false;

    /* sample tabs */
    const tabs = h('div', { class: 'c2-tabs', role: 'group', 'aria-label': 'Choose a sample' });
    const tabBtn = {};
    SAMPLES.forEach(s => {
      const b = h('button', { class: 'c2-tab', type: 'button', 'aria-pressed': 'false', on: { click: () => select(s.id, true) } }, h('b', { text: s.name }), h('small', { text: s.type }));
      tabBtn[s.id] = b; tabs.appendChild(b);
    });

    /* --- magnet panel --- */
    const FLOOR = 109;
    const dish = svgBox(300, 160, 'Petri dish with a bar magnet underneath. Drag the magnet left and right.');
    dish.setAttribute('viewBox', '22 0 256 160');
    // touch-action is ignored on SVG child elements, so set it on the <svg>: sideways drags move the magnet, vertical swipes still scroll
    dish.style.touchAction = 'pan-y';
    dish.appendChild(stext(160, 64, 'petri dish', 'c2-t2 c2-mid'));
    const lensClip = uid('lens');
    dish.appendChild(h('defs', null, h('clipPath', { id: lensClip }, h('circle', { cx: 62, cy: 32, r: 26 }))));
    dish.appendChild(h('line', { x1: 81, y1: 51, x2: 96, y2: 66, stroke: 'var(--ink-3)', 'stroke-width': 5, 'stroke-linecap': 'round' }));
    dish.appendChild(h('circle', { cx: 62, cy: 32, r: 26, fill: 'var(--surface)' }));
    const lensLayer = h('g', { 'clip-path': 'url(#' + lensClip + ')' }); dish.appendChild(lensLayer);
    dish.appendChild(h('circle', { cx: 62, cy: 32, r: 26, fill: 'none', stroke: 'var(--ink-2)', 'stroke-width': 3 }));
    dish.appendChild(stext(96, 30, 'close-up', 'c2-t2'));
    dish.appendChild(h('path', { class: 'c2-glassfill', d: 'M36 72 L36 104 Q36 112 44 112 L256 112 Q264 112 264 104 L264 72 Z' }));
    const dishLayer = h('g'); dish.appendChild(dishLayer);
    dish.appendChild(h('path', { class: 'c2-glass', d: 'M36 72 L36 104 Q36 112 44 112 L256 112 Q264 112 264 104 L264 72' }));
    const mag = h('g', { class: 'c2-magnet', tabindex: '0', role: 'slider', 'aria-label': 'Magnet. Drag, or use the arrow keys, to move it under the dish', 'aria-valuemin': '60', 'aria-valuemax': '240', 'aria-valuenow': '150' },
      h('rect', { class: 'c2-maghit', x: -52, y: -12, width: 104, height: 46, rx: 10, fill: 'transparent' }),
      h('rect', { x: -34, y: 0, width: 34, height: 22, rx: 4, fill: '#e5484d' }),
      h('rect', { x: 0, y: 0, width: 34, height: 22, rx: 4, fill: '#3d7be0' }),
      stext(-17, 15.5, 'N', 'c2-magl c2-mid'), stext(17, 15.5, 'S', 'c2-magl c2-mid'));
    dish.appendChild(mag);
    const dragHint = h('g', { class: 'c2-hint' }, stext(150, 156, '↔ drag the magnet', 'c2-t2 c2-mid'));
    dish.appendChild(dragHint);
    const appear = h('div', { class: 'c2-appear' });
    const btnM = h('button', { class: 'btn btn-sm', type: 'button', text: '🧲 Move it for me' });
    const panelM = h('div', { class: 'c2-panel' }, h('div', { class: 'c2-panel-h', text: '1–2 · Look, then magnet' }), dish, appear, btnM);

    let magX = 150, lastX = 150, active = false, travelled = 0, dragging = false, autoRun = false, grains = [], magPending = null;
    place(mag, magX, 120);
    const setMag = x => {
      const nx = Math.max(60, Math.min(240, x));
      if (active) travelled += Math.abs(nx - magX);
      magX = nx; mag.setAttribute('aria-valuenow', Math.round(magX));
      if (cur && active && !res[cur].mag && travelled > 150 && magPending !== cur) {
        const id = magPending = cur;
        A.later(() => { magPending = null; if (cur === id && !res[id].mag) recordMag(); }, 450);
      }
    };
    const wake = () => { active = true; dragHint.style.display = 'none'; };
    mag.addEventListener('pointerdown', e => { if (!cur) return; dragging = true; wake(); try { mag.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ } e.preventDefault(); });
    mag.addEventListener('pointermove', e => { if (dragging) setMag(svgPt(dish, e).x); });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => mag.addEventListener(ev, () => { dragging = false; }));
    mag.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); wake(); setMag(magX + (e.key === 'ArrowLeft' ? -14 : 14)); }
    });
    btnM.addEventListener('click', async () => {
      if (!cur || autoRun) return;
      autoRun = true; btnM.disabled = true; wake();
      const pts = [magX, 236, 64];
      for (let k = 1; k < pts.length; k++) { const a = pts[k - 1], b = pts[k]; await tw(Math.abs(b - a) * 5 + 200, e => setMag(a + (b - a) * e)); }
      autoRun = false; btnM.disabled = false;
    });
    function fillDish(s) {
      dishLayer.innerHTML = ''; lensLayer.innerHTML = ''; grains = [];
      const kinds = []; s.dish.forEach(([k, n]) => { for (let i = 0; i < Math.round(n / 2.6); i++) kinds.push(k); });
      A.shuffle(kinds).forEach(k => { const node = grainNode(k); place(node, 62 + rand(-24, 24), 32 + rand(-24, 24), rand(0, 90), k === 'fes' ? 1.8 : 2.4); lensLayer.appendChild(node); });
      s.dish.forEach(([k, n]) => { for (let i = 0; i < n; i++) {
        const G = GRAIN[k], node = grainNode(k);
        const g = { k, mag: G.mag, r: G.r, node, x: rand(46, 254), y: 0, off: rand(-18, 18), offY: 0, stuck: false };
        g.y = FLOOR - G.r - rand(0, 4.5);
        g.offY = (1 - Math.abs(g.off) / 18) * rand(0, 9);
        place(node, g.x, g.y); dishLayer.appendChild(node); grains.push(g);
      } });
    }
    liveLoop(dish, (dt) => {
      if (magX !== lastX) { lastX = magX; place(mag, magX, 120); }
      for (const g of grains) {
        if (!g.mag) continue;
        if (active && !g.stuck && Math.abs(magX - g.x) < 46) g.stuck = true;
        if (g.stuck) {
          const tx = magX + g.off, ty = FLOOR - g.r - g.offY, k = Math.min(1, dt * 8);
          if (Math.abs(tx - g.x) + Math.abs(ty - g.y) > .2) { g.x += (tx - g.x) * k; g.y += (ty - g.y) * k; place(g.node, g.x, g.y); }
        }
      }
    });

    /* --- water panel --- */
    const SURF = 58, BOT = 140;
    const bk = svgBox(300, 160, 'Beaker of water');
    bk.setAttribute('viewBox', '22 0 256 160');
    bk.appendChild(h('rect', { class: 'c2-water', x: 101, y: SURF, width: 98, height: BOT + 1 - SURF }));
    bk.appendChild(h('line', { class: 'c2-waterline', x1: 101, y1: SURF, x2: 199, y2: SURF }));
    const wLayer = h('g'); bk.appendChild(wLayer);
    bk.appendChild(h('path', { class: 'c2-glass', d: 'M93 18 L100 24 L100 134 Q100 142 108 142 L192 142 Q200 142 200 134 L200 24' }));
    [70, 90, 110, 130].forEach(y => bk.appendChild(h('line', { x1: 188, x2: 198, y1: y, y2: y, stroke: 'var(--c2-glass)', 'stroke-width': 1.2 })));
    const spat = h('g', { opacity: 0 }, h('rect', { class: 'c2-steel', x: 0, y: -2.5, width: 80, height: 5, rx: 2.5 }), h('path', { class: 'c2-steel', d: 'M2 -6 Q-17 -7 -20 0 Q-17 7 2 6 Z' }));
    bk.appendChild(spat);
    bk.appendChild(stext(150, 156, 'beaker of water', 'c2-t2 c2-mid'));
    const btnW = h('button', { class: 'btn btn-sm', type: 'button', text: '🥄 Add 1 spatula to water' });
    const panelW = h('div', { class: 'c2-panel' }, h('div', { class: 'c2-panel-h', text: '3 · Water test' }), bk, h('div', { class: 'c2-appear', html: '&nbsp;' }), btnW);

    let wGrains = [], pendingW = false, spawning = false;
    function clearWater() { wLayer.innerHTML = ''; wGrains = []; pendingW = false; }
    btnW.addEventListener('click', async () => {
      if (!cur || spawning) return;
      const id = cur, s = SAMPLES.find(x => x.id === id);
      spawning = true; btnW.disabled = true; clearWater();
      spat.setAttribute('opacity', 1);
      await tw(450, e => place(spat, 330 - (330 - 172) * e, 14));
      await tw(300, e => place(spat, 172, 14, -32 * e));
      if (cur !== id) { spawning = false; btnW.disabled = false; spat.setAttribute('opacity', 0); return; }
      A.sound('whoosh');
      const list = []; s.cup.forEach(([k, n]) => { for (let i = 0; i < n; i++) list.push(k); });
      A.shuffle(list).forEach((k, i) => A.later(() => {
        if (cur !== id) return;
        const G = GRAIN[k], node = grainNode(k);
        const g = { k, r: G.r, float: G.float, node, x: 160 + rand(-4, 4), y: 22, vx: rand(-45, 45), vy: rand(0, 25), st: 'air', t: 0, ph: rand(0, 6), floor: BOT - G.r - rand(0, 5) };
        wLayer.appendChild(node); wGrains.push(g);
      }, REDUCED ? 0 : i * 18));
      await pause(list.length * 18 + 100);
      tween(400, e => place(spat, 172 + (330 - 172) * e, 14, -32 * (1 - e)), () => spat.setAttribute('opacity', 0));
      spawning = false; btnW.disabled = false;
      if (cur === id) pendingW = true;
    });
    liveLoop(bk, (dt, now) => {
      let moving = 0;
      for (const g of wGrains) {
        if (g.st === 'air') {
          g.vy += 520 * dt; g.x += g.vx * dt; g.y += g.vy * dt;
          if (g.y >= SURF - g.r * .3) {
            if (g.float) { g.st = 'surf'; g.y = SURF - g.r * .3; g.vx *= .9; }
            else { g.st = 'sink'; g.vy = Math.min(g.vy, 70); g.vx *= .2; }
          }
        } else if (g.st === 'sink') {
          g.vy += (62 - g.vy) * Math.min(1, dt * 3); g.y += g.vy * dt; g.x += (Math.sin(now / 260 + g.ph) * 8 + g.vx) * dt;
          if (g.y >= g.floor) { g.y = g.floor; g.st = 'rest'; }
        } else if (g.st === 'surf') {
          g.t += dt; g.x += g.vx * dt; g.vx *= .985; g.y = SURF - g.r * .3 + Math.sin(now / 420 + g.ph) * .7;
        }
        g.x = Math.max(103 + g.r, Math.min(197 - g.r, g.x));
        if (g.st === 'air' || g.st === 'sink' || (g.st === 'surf' && g.t < .9)) moving++;
        if (g.st !== 'rest' || !g.placed) { place(g.node, g.x, g.y); if (g.st === 'rest') g.placed = true; }
      }
      if (pendingW && !spawning && moving === 0 && wGrains.length) { pendingW = false; recordWat(); }
    });

    /* --- feedback + results table --- */
    const fb = fbox();
    const tbl = h('div', { class: 'c2-res' });
    tbl.appendChild(h('div', { class: 'c2-res-row c2-res-head' }, h('div'), h('div', { text: 'Appearance' }), h('div', { text: 'Action of magnet' }), h('div', { text: 'Action of water' })));
    const cells = {};
    const cell = lbl => h('div', { class: 'c2-res-cell empty', dataset: { h: lbl }, text: '?' });
    SAMPLES.forEach(s => {
      const c = { ap: cell('Appearance'), mg: cell('Magnet'), wt: cell('Water') };
      cells[s.id] = c;
      tbl.appendChild(h('div', { class: 'c2-res-row' }, h('div', { class: 'c2-res-name', html: '<b>' + s.name + '</b><small>' + s.type + '</small>' }), c.ap, c.mg, c.wt));
    });
    function fill(c, html) { c.classList.remove('empty', 'pop-in'); c.innerHTML = html; void c.offsetWidth; c.classList.add('pop-in'); }
    const concl = h('div', { class: 'c2-concl' });

    function select(id, user) {
      cur = id; const s = SAMPLES.find(x => x.id === id);
      Object.keys(tabBtn).forEach(k => { tabBtn[k].classList.toggle('on', k === id); tabBtn[k].setAttribute('aria-pressed', k === id); });
      fillDish(s); clearWater();
      active = false; travelled = 0; dragHint.style.display = '';
      appear.innerHTML = '👀 <b>Appearance:</b> ' + s.appear;
      fill(cells[id].ap, s.appear);
      fb.set('', 'Testing <b>' + s.name.toLowerCase() + '</b> (' + s.type + '). Drag the magnet, then try the water.');
      if (user) A.sound('click');
    }
    function recordMag() {
      const s = SAMPLES.find(x => x.id === cur);
      res[cur].mag = true; fill(cells[cur].mg, s.magnet);
      fb.set('good', '🧲 ' + s.magMsg); A.sound(s.id === 's' || s.id === 'fes' ? 'pop' : 'good');
      progress();
    }
    function recordWat() {
      const s = SAMPLES.find(x => x.id === cur);
      res[cur].wat = true; fill(cells[cur].wt, s.water);
      fb.set('good', '💧 ' + s.watMsg); A.sound('pop');
      progress();
    }
    function progress() {
      SAMPLES.forEach(s => tabBtn[s.id].classList.toggle('done', res[s.id].mag && res[s.id].wat));
      const n = SAMPLES.reduce((k, s) => k + (res[s.id].mag ? 1 : 0) + (res[s.id].wat ? 1 : 0), 0);
      card.score.textContent = n + ' / 8 tests';
      if (res[cur].mag && res[cur].wat && n < 8) {
        const nx = SAMPLES.find(s => !(res[s.id].mag && res[s.id].wat));
        fb.innerHTML += ' <span class="muted">Next: try <b>' + nx.name.toLowerCase() + '</b>.</span>';
      }
      if (n === 8 && !concluded) conclude();
    }
    function conclude() {
      concluded = true;
      A.reward('ch2-exp21', 20, 'Experiment 2.1'); A.sound('win'); A.celebrate(.6);
      concl.innerHTML = '';
      concl.appendChild(h('h4', { text: '🧠 All 8 tests done! What does it show?' }));
      const q1 = { type: 'mcq', q: 'Which sample kept the properties of the substances it was made from?', options: ['The mixture of iron and sulphur', 'Iron(II) sulphide', 'Both of them', 'Neither of them'], answer: 0, noShuffle: true,
        explain: 'In the mixture the iron was still attracted and still sank, and the sulphur still floated: a <b>mixture keeps the properties of its constituents</b>.' };
      const q2 = { type: 'mcq', q: 'Iron(II) sulphide is made of iron and sulphur, but a magnet does <b>not</b> attract it. This shows that…', options: ['a compound has different properties from its constituent elements', 'a compound keeps the properties of its constituent elements', 'iron(II) sulphide contains no iron', 'iron(II) sulphide is a mixture'], answer: 0,
        explain: 'Iron and sulphur are <b>chemically combined</b> in iron(II) sulphide, so it has <b>new properties</b>.' };
      concl.appendChild(A.renderQuestion(q1, { done: () => concl.appendChild(A.renderQuestion(q2, { done: () => {
        concl.appendChild(A.keybox(EXP_CONCLUSION, '🔬 Conclusion'));
      } })) }));
    }

    B.append(tabs, h('div', { class: 'c2-lab' }, panelM, panelW), fb, tbl, concl,
      h('div', { class: 'c2-gap' }, A.reveal('Skip ahead: show the conclusion', EXP_CONCLUSION)));
    select('fe', false);
    card.score.textContent = '0 / 8 tests';
    return card;
  }

  function renderCompounds(root) {
    root.appendChild(goalsCard());
    root.appendChild(noteCompound());
    root.appendChild(atomWorkshop());
    root.appendChild(classworkCompounds());
    root.appendChild(formulaCracker());
    root.appendChild(exp21());
    const k = A.noteCard('Key definition practice', '', '📖 Recall'); k.classList.add('c2-k');
    k.lastChild.appendChild(A.cloze('A [[compound]] is a [[pure]] substance that is made up of two or more [[elements|element]] [[chemically]] combined.', { rewardKey: 'ch2-cloze-1', xp: 10 }));
    root.appendChild(k);
    A.quickCheck(root, 'ch2', 'ch2-1', 5);
  }

  /* =========================================================
     LESSON 2.1b — Mixtures
     ========================================================= */
  function beansToy() {
    const wrap = h('div', { class: 'c2-beans' });
    const s = svgBox(320, 160, 'Red beans and milk can be mixed into iced red beans, and separated again');
    const clip = uid('clip');
    const glassD = 'M136 34 L142 138 Q143 142 147 142 L173 142 Q177 142 178 138 L184 34 Z';
    s.appendChild(h('defs', null, h('clipPath', { id: clip }, h('path', { d: glassD }))));
    // bowl of beans
    s.appendChild(h('path', { class: 'c2-bowl', d: 'M18 100 L102 100 Q98 132 60 132 Q22 132 18 100 Z' }));
    // glass + milk
    s.appendChild(h('path', { d: glassD, class: 'c2-glassfill' }));
    const milk = h('rect', { x: 130, y: 142, width: 60, height: 0, fill: '#fbf6ea', 'clip-path': 'url(#' + clip + ')' });
    s.appendChild(milk);
    const stream = h('path', { d: 'M250 56 Q214 26 166 62', fill: 'none', stroke: '#fbf6ea', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0 });
    s.appendChild(stream);
    const beanLayer = h('g'); s.appendChild(beanLayer);
    s.appendChild(h('path', { class: 'c2-glass', d: glassD.replace(' Z', '') }));
    // milk carton
    const carton = h('g', null,
      h('rect', { x: 0, y: 18, width: 36, height: 68, rx: 3, fill: '#f7f4ee', stroke: 'var(--ink-3)', 'stroke-width': 2 }),
      h('path', { d: 'M0 18 L8 2 L28 2 L36 18 Z', fill: '#dfe9f7', stroke: 'var(--ink-3)', 'stroke-width': 2, 'stroke-linejoin': 'round' }),
      h('text', { x: 18, y: 58, 'text-anchor': 'middle', 'font-size': 10, 'font-weight': 900, fill: '#3d7be0', 'font-family': 'var(--font)' }, 'MILK'));
    s.appendChild(carton);
    s.appendChild(stext(60, 150, 'red beans', 'c2-t2 c2-mid'));
    s.appendChild(stext(160, 156, 'iced red beans', 'c2-t2 c2-mid'));
    s.appendChild(stext(280, 150, 'milk', 'c2-t2 c2-mid'));
    const START = [[36, 97], [48, 95], [60, 96], [72, 95], [84, 97], [42, 89], [54, 87], [66, 88], [78, 89], [60, 80]];
    const END = [[149, 136], [159, 137], [169, 136], [152, 128], [162, 129], [171, 127], [148, 120], [158, 121], [168, 119], [161, 112]];
    const beans = START.map(([x, y], i) => {
      const n = h('ellipse', { rx: 6, ry: 4, fill: '#7a2622', stroke: '#4a1513', 'stroke-width': 1 });
      beanLayer.appendChild(n); const b = { n, rot: rand(-40, 40), sx: x, sy: y, ex: END[i][0], ey: END[i][1] };
      return b;
    });
    let m = 0, busy = false;
    function draw() {
      beans.forEach((b, i) => {
        const p = Math.min(1, Math.max(0, m * 1.4 - i * .04));
        const cx = (b.sx + b.ex) / 2, cy = Math.min(b.sy, b.ey) - 62;
        const x = (1 - p) * (1 - p) * b.sx + 2 * (1 - p) * p * cx + p * p * b.ex;
        const y = (1 - p) * (1 - p) * b.sy + 2 * (1 - p) * p * cy + p * p * b.ey;
        place(b.n, x, y, b.rot + p * 180);
      });
      const lvl = 92 * Math.min(1, Math.max(0, (m - .15) / .85));
      milk.setAttribute('y', 142 - lvl); milk.setAttribute('height', lvl);
      const tilt = Math.sin(Math.PI * m);
      place(carton, 262, 50, -62 * tilt);
      stream.setAttribute('opacity', Math.max(0, tilt * 1.6 - .7).toFixed(2));
    }
    draw();
    const capEl = h('div', { class: 'c2-cap', html: 'red beans + milk' });
    const mixB = h('button', { class: 'btn btn-sm btn-primary', type: 'button', text: 'Mix ➜' });
    const sepB = h('button', { class: 'btn btn-sm', type: 'button', text: '⟲ Separate', disabled: true });
    async function go(to) {
      if (busy) return; busy = true; mixB.disabled = sepB.disabled = true;
      A.sound('whoosh');
      const from = m; await tw(1300, e => { m = from + (to - from) * e; draw(); });
      busy = false; mixB.disabled = to === 1; sepB.disabled = to === 0;
      capEl.innerHTML = to === 1 ? '🥤 <b>Iced red beans</b>: a mixture' : '↩️ Separated again: <b>red beans + milk</b>. Nothing was chemically combined!';
      A.sound('pop');
      if (to === 0) A.reward('ch2-beans', 5, 'Mix & separate');
    }
    mixB.addEventListener('click', () => go(1)); sepB.addEventListener('click', () => go(0));
    wrap.append(s, capEl, h('div', { class: 'c2-center', style: { marginTop: '6px' } }, mixB, sepB));
    return wrap;
  }

  function noteMixture() {
    const card = A.noteCard('What is a mixture?', '', '2.1');
    const body = card.lastChild;
    body.appendChild(A.keybox('A <b>' + T('mixture', '混合物') + '</b> consists of two or more <b>pure</b> substances (<i>elements or compounds</i>) which are <b>NOT chemically</b> combined.'));
    body.appendChild(h('p', { style: { margin: '8px 0 0' }, html: 'Everyday example: <b>red beans + milk ⇌ iced red beans</b>. They can be <b>mixed</b> and <b>separated</b> again. Try it:' }));
    body.appendChild(beansToy());
    return card;
  }

  function noteAlloy() {
    return A.noteCard('(1) Mixture of elements: alloys', '<ul>' +
      '<li><b>' + T('Alloys', '合金') + '</b> are mixtures of elements, in which <b>at least one</b> of them is a <b>metal</b>.</li>' +
      '<li>An alloy is made by <b>melting</b> the elements, <b>mixing</b> the liquids and <b>cooling</b> to form a solid.</li>' +
      '<li>Example: <b>' + T('bronze', '青銅') + '</b> consists of two elements, <b>copper</b> and <b>tin</b>, which are <b>not chemically combined</b>.</li>' +
      '<li>Particle picture: metal A + element B (metal or non-metal) → melt and mix → <b>alloy</b> (B atoms scattered among the A atoms).</li></ul>', 'Mixtures');
  }

  /* ---------- Game: Alloy Maker ---------- */
  function alloyMaker() {
    const card = A.playCard('Alloy Maker: make bronze', 'Add both metals, then do the 3 steps <b>in the right order</b>. Can you work out the order?', '🔥 Lab');
    const B = card.body;
    const s = svgBox(320, 215, 'Crucible over a Bunsen burner, with copper and tin atoms inside');
    const flame = h('g', { class: 'c2-flame', opacity: 0 },
      h('path', { d: 'M160 200 C145 188 149 172 160 156 C171 172 175 188 160 200 Z', fill: '#4f86ff', opacity: .85 }),
      h('path', { d: 'M160 196 C153 188 155 179 160 170 C165 179 167 188 160 196 Z', fill: '#c4d8ff' }));
    s.appendChild(flame);
    s.appendChild(h('rect', { x: 151, y: 198, width: 18, height: 16, rx: 2, fill: 'var(--ink-3)' }));
    const cru = h('path', { class: 'c2-cru', d: 'M44 44 L66 160 Q68 170 78 170 L242 170 Q252 170 254 160 L276 44 Z' });
    s.appendChild(cru);
    const layer = h('g'); s.appendChild(layer);
    const rod = h('g', { opacity: 0 }, h('rect', { x: -3, y: -120, width: 6, height: 128, rx: 3, fill: 'var(--c2-glassfill)', stroke: 'var(--c2-glass)', 'stroke-width': 1.5 }));
    s.appendChild(rod);
    const caption = stext(160, 30, 'Empty crucible', 'c2-t c2-mid');
    s.appendChild(caption);

    const REG = { x0: 82, x1: 240, y0: 80, y1: 162 };
    const LAT = []; for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) LAT.push([100 + c * 20, 152 - r * 20]);
    const SN_SPOTS = [[1, 4, 10, 23], [2, 5, 15, 21], [0, 9, 13, 26], [3, 8, 16, 24]];
    let atoms = [], phase = 'empty', added = { cu: false, sn: false }, busy = false, done = { melt: false, mix: false, cool: false };
    function mk(el, x, y) {
      const r = el === 'Sn' ? 11 : 9.5;
      const node = atomNode(el, r, { shine: true });
      const a = { el, r, node, x, y, bx: x, by: y, vx: 0, vy: 0, ph: rand(0, 6) };
      place(node, x, y, 0, .1); layer.appendChild(node);
      tween(260, e => place(node, a.x, a.y, 0, .1 + .9 * e));
      return a;
    }
    function addMetal(which) {
      if (busy) return;
      if (phase !== 'empty' && phase !== 'solid') { say('bad', 'Too late to add more. Tap ↺ Restart.'); return; }
      if (added[which]) { say('', (which === 'cu' ? 'Copper' : 'Tin') + ' is already in the crucible.'); return; }
      added[which] = true; phase = 'solid';
      if (which === 'cu') { for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) atoms.push(mk('Cu', 90 + c * 20, 152 - r * 20)); }
      else { for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) atoms.push(mk('Sn', 210 + c * 22, 150 - r * 22)); }
      A.sound('pop');
      caption.textContent = added.cu && added.sn ? 'Solid copper + solid tin' : added.cu ? 'Solid copper' : 'Solid tin';
      say('', added.cu && added.sn ? 'Both metals are in. Now… which step comes first?' : 'Now add the other metal.');
      sync();
    }
    function say(kind, html) { fb.set(kind, html); }
    function finished() { if (phase !== 'alloy') return false; say('', '🎉 Your bronze is ready! Tap ↺ Restart to make it again.'); return true; }
    async function melt() {
      if (busy || finished()) return;
      if (!(added.cu && added.sn)) { say('bad', 'Add <b>both</b> copper and tin first.'); A.sound('bad'); return; }
      if (phase !== 'solid') { say('', 'It is already melted.'); return; }
      phase = 'liquid'; done.melt = true; flame.setAttribute('opacity', 1); cru.classList.add('hot');
      caption.textContent = 'Melting… two separate liquids'; A.sound('whoosh');
      say('good', '🔥 <b>Melting</b>: the atoms break out of their neat rows and start to move around.');
      sync();
    }
    async function mix() {
      if (busy || finished()) return;
      if (phase === 'empty' || phase === 'solid') { say('bad', 'Solid lumps won’t mix! <b>Melt</b> them first.'); A.sound('bad'); shake(); return; }
      if (phase !== 'liquid') { say('', 'Already mixed.'); return; }
      busy = true; phase = 'stir'; rod.setAttribute('opacity', 1); A.sound('whoosh');
      const spots = A.shuffle(Array.from({ length: atoms.length }, (_, i) => [REG.x0 + 12 + (i % 7) * 23 + rand(-5, 5), REG.y0 + 14 + Math.floor(i / 7) * 18 + rand(-4, 4)]));
      const from = atoms.map(a => [a.x, a.y]);
      await tw(1500, (e, p) => {
        place(rod, 160 + Math.sin(p * Math.PI * 6) * 48, 150, Math.sin(p * Math.PI * 6) * 14);
        atoms.forEach((a, i) => { a.x = from[i][0] + (spots[i][0] - from[i][0]) * e; a.y = from[i][1] + (spots[i][1] - from[i][1]) * e; place(a.node, a.x, a.y); });
      });
      rod.setAttribute('opacity', 0); busy = false; phase = 'mixed'; done.mix = true;
      caption.textContent = 'Liquid copper and tin, mixed';
      say('good', '🥄 <b>Mixing</b>: copper and tin atoms are now spread among each other.');
      sync();
    }
    async function cool() {
      if (busy || finished()) return;
      if (phase === 'empty' || phase === 'solid') { say('bad', 'Nothing has melted yet. What do you need to do first?'); A.sound('bad'); shake(); return; }
      if (phase === 'liquid') { say('bad', 'If you cool now, you just get two separate lumps again. <b>Mix</b> the liquids first!'); A.sound('bad'); shake(); return; }
      if (phase !== 'mixed') return;
      busy = true; phase = 'cooling'; flame.setAttribute('opacity', 0); cru.classList.remove('hot'); A.sound('whoosh');
      const snSpots = new Set(A.sample(SN_SPOTS, 1)[0]);
      const tin = atoms.filter(a => a.el === 'Sn'), cu = atoms.filter(a => a.el === 'Cu');
      const cuSpots = A.shuffle(LAT.map((p, i) => i).filter(i => !snSpots.has(i)));
      const plan = [];
      [...snSpots].forEach((li, k) => plan.push([tin[k], LAT[li]]));
      cu.forEach((a, k) => plan.push([a, LAT[cuSpots[k]]]));
      const from = plan.map(([a]) => [a.x, a.y]);
      await tw(1300, e => plan.forEach(([a, p], i) => { a.x = from[i][0] + (p[0] - from[i][0]) * e; a.y = from[i][1] + (p[1] - from[i][1]) * e; place(a.node, a.x, a.y); }));
      plan.forEach(([a, p]) => { a.bx = p[0]; a.by = p[1]; });
      busy = false; phase = 'alloy'; done.cool = true;
      caption.textContent = '✨ Bronze (an alloy)';
      say('good', '❄️ <b>Cooling</b>: a solid forms with tin atoms scattered among the copper atoms. You made <b>bronze</b>!');
      A.sound('win'); A.celebrate(.6); A.reward('ch2-alloy', 15, 'Alloy Maker');
      sync(); finalQ();
    }
    function shake() { s.classList.remove('shake'); void s.getBoundingClientRect(); s.classList.add('shake'); }
    function restart() {
      if (busy) return;
      atoms.forEach(a => a.node.remove()); atoms = []; phase = 'empty'; added = { cu: false, sn: false }; done = { melt: false, mix: false, cool: false };
      flame.setAttribute('opacity', 0); cru.classList.remove('hot'); caption.textContent = 'Empty crucible'; ask.innerHTML = '';
      say('', 'Add copper and tin to the crucible.'); sync();
    }
    liveLoop(s, (dt, now) => {
      if (phase === 'liquid' || phase === 'mixed') {
        const sep = phase === 'liquid';
        atoms.forEach(a => {
          a.vx += rand(-1, 1) * 260 * dt; a.vy += rand(-1, 1) * 260 * dt + 40 * dt;
          a.vx *= .95; a.vy *= .95;
          const sp = Math.hypot(a.vx, a.vy); if (sp > 45) { a.vx *= 45 / sp; a.vy *= 45 / sp; }
          a.x += a.vx * dt; a.y += a.vy * dt;
          const xl = sep && a.el === 'Sn' ? 196 : REG.x0, xr = sep && a.el === 'Cu' ? 198 : REG.x1;
          if (a.x < xl + a.r) { a.x = xl + a.r; a.vx = Math.abs(a.vx); } if (a.x > xr - a.r) { a.x = xr - a.r; a.vx = -Math.abs(a.vx); }
          if (a.y < REG.y0 + a.r) { a.y = REG.y0 + a.r; a.vy = Math.abs(a.vy); } if (a.y > REG.y1 - a.r) { a.y = REG.y1 - a.r; a.vy = -Math.abs(a.vy); }
        });
        for (let i = 0; i < atoms.length; i++) for (let j = i + 1; j < atoms.length; j++) {
          const a = atoms[i], b = atoms[j], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || .01, min = a.r + b.r - 1.5;
          if (d < min) { const push = (min - d) / 2, ux = dx / d, uy = dy / d; a.x -= ux * push; a.y -= uy * push; b.x += ux * push; b.y += uy * push; }
        }
        atoms.forEach(a => place(a.node, a.x, a.y));
      } else if (phase === 'solid' || phase === 'alloy') {
        atoms.forEach(a => { if (a.node.getAttribute('transform').indexOf('scale') > -1) return; a.x = a.bx + Math.sin(now / 90 + a.ph) * .5; a.y = a.by + Math.cos(now / 110 + a.ph) * .5; place(a.node, a.x, a.y); });
      }
    });
    const steps = h('div', { class: 'c2-steps' });
    const pills = { melt: h('span', { class: 'c2-stepp', text: '① melting' }), mix: h('span', { class: 'c2-stepp', text: '② mixing' }), cool: h('span', { class: 'c2-stepp', text: '③ cooling' }) };
    Object.values(pills).forEach(p => steps.appendChild(p));
    const bCu = h('button', { class: 'btn', type: 'button', html: '<span class="c2-dot" style="width:18px;height:18px;background:var(--c2-cu)"></span> Copper', on: { click: () => addMetal('cu') } });
    const bSn = h('button', { class: 'btn', type: 'button', html: '<span class="c2-dot" style="width:18px;height:18px;background:var(--c2-sn)"></span> Tin', on: { click: () => addMetal('sn') } });
    const tools = h('div', { class: 'c2-tools' }, bCu, bSn,
      h('button', { class: 'btn', type: 'button', text: '❄️ Cool', on: { click: cool } }),
      h('button', { class: 'btn', type: 'button', text: '🔥 Melt', on: { click: melt } }),
      h('button', { class: 'btn', type: 'button', text: '🥄 Mix', on: { click: mix } }),
      h('button', { class: 'btn btn-ghost', type: 'button', text: '↺ Restart', on: { click: restart } }));
    const fb = fbox();
    const ask = h('div');
    function sync() {
      Object.keys(pills).forEach(k => pills[k].classList.toggle('done', done[k]));
      bCu.disabled = added.cu; bSn.disabled = added.sn;
    }
    function finalQ() {
      ask.innerHTML = '';
      ask.appendChild(h('div', { class: 'c2-ask-q', text: 'In bronze, are the copper and tin chemically combined?' }));
      ask.appendChild(choices([{ html: 'Yes: bronze is a compound', value: 0 }, { html: 'No: bronze is a mixture of elements', value: 1 }], v => v === 1, ok => {
        if (ok) fb.set('good', '✅ Right! An alloy is a <b>mixture</b>: the atoms are mixed, <b>not chemically combined</b>.');
        else fb.set('bad', '❌ Look at the atoms: are any of them stuck together as molecules?');
      }));
    }
    B.append(h('div', { class: 'c2-stage' }, s), steps, tools, fb, ask);
    say('', 'Add copper and tin to the crucible.'); sync();
    return card;
  }

  function hydrocarbon(n, name) {
    const step = 26, w = (n - 1) * step + 64, cy = 30;
    const s = svgBox(w, 76, name + ' molecule: ' + n + ' carbon atom' + (n > 1 ? 's' : '') + ' and ' + (2 * n + 2) + ' hydrogen atoms');
    s.style.maxWidth = (w * 1.05) + 'px';
    const bonds = h('g', { class: 'c2-bond' }), atoms = h('g');
    const H = (x, y) => { const a = atomNode('H', 5.5); place(a, x, y); atoms.appendChild(a); };
    for (let i = 0; i < n; i++) {
      const x = 32 + i * step;
      if (i) bonds.appendChild(h('line', { x1: x - step, y1: cy, x2: x, y2: cy }));
      [[0, -19], [0, 19]].concat(i === 0 ? [[-19, 0]] : []).concat(i === n - 1 ? [[19, 0]] : []).forEach(([dx, dy]) => {
        bonds.appendChild(h('line', { x1: x, y1: cy, x2: x + dx, y2: cy + dy })); H(x + dx, cy + dy);
      });
    }
    for (let i = 0; i < n; i++) { const c = atomNode('C', 8.5); place(c, 32 + i * step, cy); atoms.appendChild(c); }
    s.append(bonds, atoms, stext(w / 2, 72, name, 'c2-t c2-mid'));
    return h('div', { style: { minWidth: 0 } }, s);
  }

  function noteCompMix() {
    const card = A.noteCard('(2) Mixture of compounds', '', 'Mixtures');
    const body = card.lastChild;
    body.appendChild(A.table(['Example', 'Constituent substances <span class="tiny">(NOT chemically combined)</span>'], [
      ['<b>' + T('Sea water', '海水') + '</b>', '<b>water</b> and <b>dissolved salts</b> (e.g. sodium chloride)'],
      ['<b>' + T('Aqueous solution', '水溶液') + ' of table salt</b>', 'a mixture of <b>sodium chloride</b> (' + T('solute', '溶質') + ') and <b>water</b> (' + T('solvent', '溶劑') + ')'],
      ['<b>' + T('Petroleum', '石油') + ' / ' + T('crude oil', '原油') + '</b>', 'a mixture of <b>' + T('hydrocarbons', '烴') + '</b>, i.e. compounds of <b>hydrogen and carbon only</b>']
    ]));
    const dot = el => '<i class="c2-key" style="background:' + col(el) + '"></i>';
    body.appendChild(h('div', { class: 'c2-mixfig' },
      h('div', { class: 'c2-pb' }, pb({ groups: [{ mol: WATER(7), n: 11 }, { mol: MOL.atom('Na', 5), n: 2 }, { mol: MOL.atom('Cl', 6.5), n: 2 }], layout: 'liquid', seed: 41, motion: 'jiggle', aria: 'Particle diagram of sea water or salt solution: sodium and chloride particles spread among water molecules' })),
      h('p', { class: 'c2-note-sm', style: { margin: 0 }, html: '<b>Particle diagram</b> of sea water / salt solution: sodium chloride particles <span style="white-space:nowrap">(' + dot('Na') + 'Na</span> and <span style="white-space:nowrap">' + dot('Cl') + 'Cl)</span> spread among the <b>water</b> molecules. They are <b>not chemically combined</b>.' })));
    body.appendChild(h('p', { class: 'c2-note-sm', style: { margin: '14px 0 2px' }, html: 'Some hydrocarbons in crude oil (● carbon, ○ hydrogen):' }));
    body.appendChild(h('div', { class: 'c2-hc' }, hydrocarbon(1, 'methane'), hydrocarbon(2, 'ethane'), hydrocarbon(3, 'propane'), hydrocarbon(4, 'butane')));
    return card;
  }

  /* ---------- Game: salt solution lab ---------- */
  function saltLab() {
    const card = A.playCard('Make a salt solution', 'Dissolve table salt in water, zoom in on the particles, then label the <b>solute</b> and the <b>solvent</b>.', '🧂 Lab');
    const B = card.body;
    const s = svgBox(320, 190, 'Beaker of water with a zoomed-in particle view');
    const SURF = 76, clip = uid('zoom');
    s.appendChild(h('defs', null, h('clipPath', { id: clip }, h('circle', { cx: 252, cy: 104, r: 58 }))));
    s.appendChild(h('rect', { class: 'c2-water', x: 31, y: SURF, width: 118, height: 170 - SURF }));
    s.appendChild(h('line', { class: 'c2-waterline', x1: 31, y1: SURF, x2: 149, y2: SURF }));
    const crystals = h('g'); s.appendChild(crystals);
    s.appendChild(h('path', { class: 'c2-glass', d: 'M24 34 L30 40 L30 164 Q30 172 38 172 L142 172 Q150 172 150 164 L150 40' }));
    const rod = h('g', { opacity: 0 }, h('rect', { x: -3, y: -100, width: 6, height: 104, rx: 3, fill: 'var(--c2-glassfill)', stroke: 'var(--c2-glass)', 'stroke-width': 1.5 }));
    s.appendChild(rod);
    const spat = h('g', { opacity: 0 }, h('rect', { class: 'c2-steel', x: 0, y: -2.5, width: 78, height: 5, rx: 2.5 }), h('path', { class: 'c2-steel', d: 'M2 -6 Q-17 -7 -20 0 Q-17 7 2 6 Z' }));
    s.appendChild(spat);
    // zoom bubble
    s.appendChild(h('line', { x1: 140, y1: 118, x2: 196, y2: 96, stroke: 'var(--ink-3)', 'stroke-width': 1.2, 'stroke-dasharray': '4 3' }));
    s.appendChild(h('circle', { cx: 252, cy: 104, r: 58, fill: 'var(--surface-2)' }));
    const zl = h('g', { 'clip-path': 'url(#' + clip + ')' }); s.appendChild(zl);
    s.appendChild(h('circle', { cx: 252, cy: 104, r: 58, fill: 'none', stroke: 'var(--ink)', 'stroke-width': 2 }));
    s.appendChild(stext(252, 178, 'zoomed in', 'c2-t2 c2-mid'));
    s.appendChild(stext(90, 186, 'water', 'c2-t2 c2-mid'));
    const parts = [];
    const addP = (mol, x, y) => { const n = molNode(mol); const p = { n, x, y, vx: rand(-14, 14), vy: rand(-14, 14), rot: rand(0, 360), vr: rand(-40, 40) }; place(n, x, y, p.rot); zl.appendChild(n); parts.push(p); return p; };
    for (let i = 0; i < 13; i++) addP(WATER(6.5), 252 + rand(-46, 46), 104 + rand(-46, 46));
    liveLoop(s, dt => {
      parts.forEach(p => {
        p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
        const dx = p.x - 252, dy = p.y - 104, d = Math.hypot(dx, dy);
        if (d > 50) { p.vx -= dx / d * 30; p.vy -= dy / d * 30; p.x = 252 + dx / d * 50; p.y = 104 + dy / d * 50; }
        place(p.n, p.x, p.y, p.rot);
      });
    });
    const fb = fbox();
    const bAdd = h('button', { class: 'btn btn-sm btn-primary', type: 'button', text: '🧂 Add a spatula of salt' });
    const bStir = h('button', { class: 'btn btn-sm', type: 'button', text: '🥄 Stir', disabled: true });
    const label = h('div');
    let cr = [];
    bAdd.addEventListener('click', async () => {
      bAdd.disabled = true; spat.setAttribute('opacity', 1);
      await tw(450, e => place(spat, 330 - (330 - 110) * e, 30));
      await tw(250, e => place(spat, 110, 30, -30 * e));
      A.sound('whoosh');
      cr = Array.from({ length: 9 }, () => {
        const n = h('rect', { x: -2.6, y: -2.6, width: 5.2, height: 5.2, rx: .8, fill: '#ffffff', stroke: '#8f98a3', 'stroke-width': .8 });
        crystals.appendChild(n); return { n, x: 100 + rand(-4, 4), y: 36, fy: 166 - rand(0, 4), fx: rand(52, 128), rot: rand(0, 90) };
      });
      await tw(900, e => cr.forEach(c => place(c.n, c.x + (c.fx - c.x) * e, c.y + (c.fy - c.y) * e, c.rot)));
      tween(380, e => place(spat, 110 + (330 - 110) * e, 30, -30 * (1 - e)), () => spat.setAttribute('opacity', 0));
      bStir.disabled = false; A.sound('pop');
      fb.set('', 'The white salt crystals sink to the bottom. Now stir!');
    });
    bStir.addEventListener('click', async () => {
      bStir.disabled = true; rod.setAttribute('opacity', 1); A.sound('whoosh');
      await tw(1600, (e, p) => {
        place(rod, 90 + Math.sin(p * Math.PI * 6) * 40, 166, Math.sin(p * Math.PI * 6) * 10);
        cr.forEach(c => { c.n.setAttribute('opacity', (1 - e).toFixed(2)); place(c.n, c.fx, c.fy, c.rot + e * 90, 1 - e * .9); });
      });
      rod.setAttribute('opacity', 0); crystals.innerHTML = '';
      for (let i = 0; i < 3; i++) { addP(MOL.atom('Na', 5.5), 252 + rand(-40, 40), 104 + rand(-40, 40)); addP(MOL.atom('Cl', 7), 252 + rand(-40, 40), 104 + rand(-40, 40)); }
      A.sound('fizz');
      fb.set('good', '✨ The salt <b>dissolves</b> to give a colourless solution. Zoomed in: sodium chloride particles are spread out among the water molecules.');
      labelGame();
    });
    function labelGame() {
      label.innerHTML = '';
      label.appendChild(h('div', { class: 'c2-ask-q', text: 'Tap a label, then tap the gap it belongs in:' }));
      let sel = null;
      const tags = h('div', { class: 'c2-tags' });
      const tagBtn = ['solute', 'solvent'].map(t => {
        const b = h('button', { class: 'chip', type: 'button', text: t });
        b.addEventListener('click', () => { if (b.disabled) return; tagBtn.forEach(x => x.classList.remove('selected')); sel = sel === t ? null : t; if (sel) b.classList.add('selected'); slots.forEach(sl => sl.btn.classList.toggle('ready', !!sel && !sl.done)); A.sound('click'); });
        b._t = t; tags.appendChild(b); return b;
      });
      const slots = [{ who: '<b>Sodium chloride</b> (table salt) is the', ans: 'solute' }, { who: '<b>Water</b> is the', ans: 'solvent' }].map(o => {
        const btn = h('button', { class: 'c2-slot', type: 'button', text: '?' });
        const sl = { btn, ans: o.ans, done: false };
        btn.addEventListener('click', () => {
          if (sl.done) return;
          if (!sel) { fb.set('', '👆 Tap a label first.'); return; }
          if (sel === sl.ans) {
            sl.done = true; btn.classList.remove('ready'); btn.classList.add('right'); btn.textContent = sl.ans + ' ✓'; A.sound('good');
            const tb = tagBtn.find(x => x._t === sel); tb.disabled = true; tb.classList.remove('selected'); tb.classList.add('done'); sel = null;
            slots.forEach(x => x.btn.classList.remove('ready'));
            if (slots.every(x => x.done)) {
              fb.set('good', '✅ An aqueous solution of table salt is a <b>mixture</b> of sodium chloride (<b>solute</b>) and water (<b>solvent</b>). They are not chemically combined.');
              A.reward('ch2-salt', 10, 'Salt solution');
            }
          } else { btn.classList.add('shake'); A.later(() => btn.classList.remove('shake'), 420); A.sound('bad'); fb.set('bad', '❌ The <b>solute</b> is the substance that dissolves; the <b>solvent</b> is the liquid it dissolves in.'); }
        });
        o.row = h('div', { class: 'c2-slotrow' }, h('span', { html: o.who }), btn, h('span', { text: '.' }));
        return Object.assign(sl, { row: o.row });
      });
      label.append(tags, h('div', { class: 'c2-slots' }, slots.map(x => x.row)));
    }
    B.append(h('div', { class: 'c2-stage' }, s), h('div', { class: 'c2-center', style: { marginTop: '10px' } }, bAdd, bStir), fb, label);
    return card;
  }

  function noteAir() {
    return A.noteCard('(3) Mixture of elements and compounds: air', '<ul>' +
      '<li><b>Air</b> is a mixture of <b>elements</b> (e.g. <b>nitrogen</b>, <b>oxygen</b> and <b>argon</b>) and <b>compounds</b> (e.g. <b>carbon dioxide</b> and <b>' + T('water vapour', '水蒸氣') + '</b>).</li>' +
      '<li>Composition of air: nitrogen <b>78%</b>, oxygen <b>21%</b>, argon <b>0.9%</b>, other gases <b>0.1%</b> (including carbon dioxide, water vapour and other noble gases).</li></ul>', 'Mixtures');
  }

  /* ---------- Game: Air explorer ---------- */
  const AIRP = [
    { id: 'N2', n: 12, mol: () => MOL.di('N', null, 7), name: 'nitrogen', f: 'N2', kind: 'element', why: 'only nitrogen atoms' },
    { id: 'O2', n: 4, mol: () => MOL.di('O', null, 7), name: 'oxygen', f: 'O2', kind: 'element', why: 'only oxygen atoms' },
    { id: 'Ar', n: 1, mol: () => MOL.atom('Ar', 7.5), name: 'argon', f: 'Ar', kind: 'element', why: 'single argon atoms' },
    { id: 'CO2', n: 1, mol: () => CO2(6.5), name: 'carbon dioxide', f: 'CO2', kind: 'compound', why: 'carbon and oxygen chemically combined' },
    { id: 'H2O', n: 1, mol: () => WATER(7.5), name: 'water vapour', f: 'H2O', kind: 'compound', why: 'hydrogen and oxygen chemically combined' }
  ];
  function airExplorer() {
    const card = A.playCard('Air explorer', 'Tap the moving particles. Find all <b>5 kinds</b>. Two of them are <b>compounds</b>!', '💨 Hunt');
    const B = card.body;
    const W = 320, H = 190;
    const s = svgBox(W, H, 'Particle diagram of air: a box of moving particles you can tap', 'c2-airbox');
    const parts = [];
    const found = new Set();
    AIRP.forEach(t => { for (let i = 0; i < t.n; i++) {
      const mol = t.mol();
      const g = h('g', { class: 'c2-airp', role: 'button', tabindex: i === 0 ? '0' : '-1', 'aria-label': 'air particle' },
        h('circle', { r: 21, fill: 'transparent' }), h('circle', { class: 'c2-ring', r: 15 }), molNode(mol));
      let x, y, tries = 0;
      do { x = rand(20, W - 20); y = rand(20, H - 20); tries++; } while (tries < 60 && parts.some(p => Math.hypot(p.x - x, p.y - y) < 30));
      const a = rand(0, 6.28), sp = rand(16, 28);
      const p = { t, g, x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, rot: rand(0, 360), vr: rand(-30, 30), hold: 0 };
      const pick = e => { if (e) e.preventDefault(); tap(p); };
      g.addEventListener('pointerdown', pick);
      g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') pick(e); });
      s.appendChild(g); parts.push(p); place(g, x, y, p.rot);
    } });
    liveLoop(s, dt => {
      parts.forEach(p => {
        if (p.hold > 0) { p.hold -= dt; if (p.hold <= 0) p.g.classList.remove('sel'); return; }
        p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
        if (p.x < 14 || p.x > W - 14) { p.vx *= -1; p.x = Math.max(14, Math.min(W - 14, p.x)); }
        if (p.y < 14 || p.y > H - 14) { p.vy *= -1; p.y = Math.max(14, Math.min(H - 14, p.y)); }
      });
      // simple elastic bumps so particles don't pass through each other
      for (let i = 0; i < parts.length; i++) for (let j = i + 1; j < parts.length; j++) {
        const a = parts[i], b = parts[j], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || .01;
        if (d < 25) {
          const nx = dx / d, ny = dy / d, push = (25 - d) / 2;
          if (a.hold <= 0) { a.x -= nx * push; a.y -= ny * push; }
          if (b.hold <= 0) { b.x += nx * push; b.y += ny * push; }
          const va = a.vx * nx + a.vy * ny, vb = b.vx * nx + b.vy * ny;
          if (va - vb > 0) { a.vx += (vb - va) * nx; a.vy += (vb - va) * ny; b.vx += (va - vb) * nx; b.vy += (va - vb) * ny; }
        }
      }
      parts.forEach(p => { if (p.hold > 0) return; p.x = Math.max(14, Math.min(W - 14, p.x)); p.y = Math.max(14, Math.min(H - 14, p.y)); place(p.g, p.x, p.y, p.rot); });
    });
    const info = h('div', { class: 'c2-airinfo', html: '👆 Tap any particle to identify it.' });
    const list = h('div', { class: 'c2-found' });
    const cellOf = {};
    AIRP.forEach(t => { const c = h('div', { class: 'c2-fi' }, h('span', { style: { fontSize: '20px' }, text: '?' }), h('span', { text: 'not found' })); cellOf[t.id] = c; list.appendChild(c); });
    const fb = fbox();
    function tap(p) {
      p.hold = 1.4; p.g.classList.add('sel');
      const t = p.t, isNew = !found.has(t.id);
      info.innerHTML = '<span class="c2-badge ' + (t.kind === 'element' ? 'el' : 'cp') + '">' + t.kind + '</span> <b>' + F(t.f) + ' · ' + t.name + '</b> <span class="muted">(' + t.why + ')</span>';
      A.sound(isNew ? (t.kind === 'compound' ? 'good' : 'pop') : 'click');
      if (!isNew) return;
      found.add(t.id);
      const c = cellOf[t.id]; c.classList.add('on', 'pop-in'); c.innerHTML = '';
      c.append(molIcon(t.mol(), t.name), h('b', { html: F(t.f) }), h('span', { class: 'c2-badge ' + (t.kind === 'element' ? 'el' : 'cp'), text: t.kind }));
      card.score.textContent = found.size + ' / 5';
      if (t.kind === 'compound') A.toast('🎯 Compound found: ' + t.name + '!', 'good');
      if (found.size === AIRP.length) {
        fb.set('good', '🏆 All found! Air = <b>elements</b> (N₂, O₂, Ar) + <b>compounds</b> (CO₂, H₂O), not chemically combined → a <b>mixture</b>.');
        A.sound('win'); A.celebrate(.5); A.reward('ch2-air', 15, 'Air explorer');
      }
    }
    card.score.textContent = '0 / 5';
    B.append(s, h('div', { class: 'tiny', style: { marginTop: '4px' }, text: 'Particle diagram of air (not to scale)' }), info, list, fb, airComposition());
    return card;
  }
  function airComposition() {
    const wrap = h('div', { class: 'c2-comp' });
    wrap.appendChild(h('h4', { style: { margin: '0 0 4px' }, text: '📊 What is air made of?' }));
    const qBox = h('div');
    const COLS = { N: 'var(--atom-N)', O: 'var(--atom-O)', Ar: 'var(--atom-Ar)', X: 'var(--atom-X)' };
    const s = svgBox(180, 180, 'Waffle chart of 100 squares: nitrogen 78, oxygen 21, argon 0.9 and other gases 0.1');
    const cells = [];
    for (let i = 0; i < 100; i++) {
      const x = (i % 10) * 18 + 1, y = Math.floor(i / 10) * 18 + 1;
      const r = h('rect', { class: 'c2-cell', x, y, width: 16, height: 16, rx: 3 }, h('title', { text: 'empty' }));
      s.appendChild(r); cells.push(r);
    }
    const arCell = h('g', { opacity: 0 }, h('rect', { x: 163, y: 163, width: 14.4, height: 16, rx: 3, fill: COLS.Ar }), h('rect', { x: 177.4, y: 163, width: 1.6, height: 16, fill: COLS.X }), h('title', { text: 'argon 0.9% + other gases 0.1%' }));
    s.appendChild(arCell);
    const legend = h('div', { class: 'c2-legend' });
    const leg = [['N', 'nitrogen', '78%'], ['O', 'oxygen', '21%'], ['Ar', 'argon', '0.9%'], ['X', 'other gases (including carbon dioxide, water vapour and other noble gases)', '0.1%']].map(([k, name, pc]) => {
      const d = h('div', null, h('i', { style: { background: COLS[k] } }), h('span', { html: '<b>' + pc + '</b> ' + name }));
      legend.appendChild(d); return d;
    });
    function paint(from, to, colour, label) {
      for (let i = from; i < to; i++) { const c = cells[i]; c.style.transitionDelay = REDUCED ? '0ms' : ((i - from) * 9) + 'ms'; c.style.fill = colour; c.firstChild.textContent = label; }
    }
    function ask(qHtml, opts, right, after) {
      qBox.innerHTML = '';
      qBox.appendChild(h('div', { class: 'c2-ask-q', html: qHtml }));
      qBox.appendChild(choices(opts.map(o => ({ html: o, value: o })), v => v === right, ok => { if (ok) after(); }));
    }
    ask('About how much of the air is <b>nitrogen</b>?', ['0.9%', '21%', '78%', '99%'], '78%', () => {
      paint(0, 78, COLS.N, 'nitrogen'); leg[0].classList.add('on');
      A.later(() => ask('And how much is <b>oxygen</b>?', ['0.9%', '21%', '50%', '78%'], '21%', () => {
        paint(78, 99, COLS.O, 'oxygen'); leg[1].classList.add('on');
        A.later(() => { arCell.setAttribute('opacity', 1); leg[2].classList.add('on'); leg[3].classList.add('on'); A.reward('ch2-aircomp', 5, 'Air composition'); }, REDUCED ? 0 : 400);
        qBox.appendChild(h('p', { class: 'c2-note-sm', style: { margin: '10px 0 0' }, html: 'The last square: argon <b>0.9%</b> + other gases <b>0.1%</b>.' }));
      }), REDUCED ? 0 : 500);
    });
    wrap.append(qBox, h('div', { class: 'c2-waf' }, s, legend));
    return wrap;
  }

  function mixtureSort() {
    const card = A.playCard('Which kind of mixture?', 'Tap a mixture, then tap its box.', '🗂️ Sort'); card.classList.add('c2-sortc');
    card.body.appendChild(A.sortGame({
      buckets: [{ id: 'el', title: 'Mixture of elements' }, { id: 'cp', title: 'Mixture of compounds' }, { id: 'ec', title: 'Elements + compounds' }],
      items: [
        { label: 'bronze', bucket: 'el', explain: 'Bronze = copper + tin, two elements (an alloy).', hint: 'Copper and tin are elements.' },
        { label: 'iron + sulphur powder', bucket: 'el', explain: 'Iron and sulphur are both elements.', hint: 'Are iron and sulphur elements or compounds?' },
        { label: 'sea water', bucket: 'cp', explain: 'Water + dissolved salts: all compounds.', hint: 'Water and salts are compounds.' },
        { label: 'salt solution', bucket: 'cp', explain: 'Sodium chloride (solute) + water (solvent): two compounds.', hint: 'Sodium chloride and water are both compounds.' },
        { label: 'crude oil', bucket: 'cp', explain: 'A mixture of hydrocarbons, which are compounds.', hint: 'Hydrocarbons are compounds of hydrogen and carbon.' },
        { label: 'air', bucket: 'ec', explain: 'Nitrogen, oxygen, argon (elements) + carbon dioxide, water vapour (compounds).', hint: 'Air has N₂ and O₂, but also CO₂ and H₂O.' }
      ],
      rewardKey: 'ch2-mixsort', xp: 15
    }));
    return card;
  }

  function renderMixtures(root) {
    root.appendChild(noteMixture());
    root.appendChild(noteAlloy());
    root.appendChild(alloyMaker());
    root.appendChild(noteCompMix());
    root.appendChild(saltLab());
    root.appendChild(noteAir());
    root.appendChild(airExplorer());
    root.appendChild(mixtureSort());
    const k = A.noteCard('Key definition practice', '', '📖 Recall'); k.classList.add('c2-k');
    k.lastChild.appendChild(A.cloze('A [[mixture]] consists of two or more [[pure]] substances (elements or compounds) which are NOT [[chemically]] combined.', { rewardKey: 'ch2-cloze-2', xp: 10 }));
    k.lastChild.appendChild(h('div', { style: { height: '12px' } }));
    k.lastChild.appendChild(A.cloze('[[Alloys|alloy|an alloy]] are mixtures of elements, in which at least one of them is a [[metal]]. Bronze consists of copper and [[tin]].', { rewardKey: 'ch2-cloze-3', xp: 10 }));
    root.appendChild(k);
    A.quickCheck(root, 'ch2', 'ch2-2', 5);
  }

  /* =========================================================
     LESSON 2.1c — Element, compound or mixture?
     ========================================================= */
  function summaryCard() {
    const card = A.noteCard('Element vs compound vs mixture', '', 'Summary');
    const col3 = (title, badge, box, items) => h('div', { class: 'c2-sumcol' },
      h('h4', { html: '<span class="c2-badge ' + badge + '">' + title + '</span>' }),
      h('div', { class: 'c2-pb' }, box), h('ul', { html: items.map(x => '<li>' + x + '</li>').join('') }));
    card.lastChild.appendChild(h('div', { class: 'c2-sum' },
      col3('Element', 'el', pb({ groups: [{ mol: MOL.di('N', null, 8), n: 6 }], seed: 31, motion: 'jiggle', w: 130, h: 96, aria: 'Element: molecules of one kind of atom' }), [
        'Only <b>one kind of atom</b>', 'A <b>pure</b> substance', 'Cannot be broken down into anything simpler by <b>chemical</b> methods', 'e.g. gold Au, nitrogen ' + F('N2')]),
      col3('Compound', 'cp', pb({ groups: [{ mol: WATER(8), n: 6 }], seed: 32, motion: 'jiggle', w: 130, h: 96, aria: 'Compound: identical molecules made of different atoms' }), [
        'Two or more elements <b>chemically combined</b>', 'A <b>pure</b> substance', 'Properties <b>different</b> from its constituent elements', 'e.g. water ' + F('H2O') + ', iron(II) sulphide FeS']),
      col3('Mixture', 'mx', pb({ groups: [{ mol: MOL.di('N', null, 8), n: 4 }, { mol: MOL.di('O', null, 8), n: 2 }, { mol: CO2(6.5), n: 1 }], seed: 33, motion: 'jiggle', w: 130, h: 96, aria: 'Mixture: different kinds of particles, not combined' }), [
        'Two or more pure substances <b>NOT chemically combined</b>', '<b>Keeps</b> the properties of its constituents', 'Can be separated by <b>physical</b> means (e.g. a magnet)', 'e.g. air, bronze, sea water'])));
    return card;
  }

  /* ---------- Classwork 1: the book's five diagrams ---------- */
  function classwork1() {
    const card = A.playCard('Classwork 1: read the particle diagrams', 'Study diagrams A to E (like the book). Tap the diagram that answers each question.', '🔎 Classwork');
    const B = card.body;
    const QS = [
      { q: '(a) a single element?', ans: 'D', tag: 'single element', why: 'Only one kind of molecule, and each molecule has only <b>one kind of atom</b>.' },
      { q: '(b) a mixture of elements?', ans: 'A', tag: 'mixture of elements', why: 'Two kinds of molecules (black–black and white–white). Each one has only one kind of atom.' },
      { q: '(c) a single compound?', ans: 'E', tag: 'single compound', why: 'Only one kind of molecule, and each has <b>two different atoms stuck together</b>.' },
      { q: '(d) a mixture of two compounds?', ans: 'C', tag: 'mixture of 2 compounds', why: 'Two kinds of molecules, and both are made of different atoms chemically combined.' }
    ];
    let qi = 0, first = 0, tries = 0;
    const grid = h('div', { class: 'c2-cw1' });
    const btn = {};
    ['A', 'B', 'C', 'D', 'E'].forEach((L, i) => {
      const b = h('button', { class: 'c2-boxbtn', type: 'button', 'aria-label': 'Diagram ' + L }, cwBox(L, 40 + i * 13), h('span', { class: 'c2-bl', text: L }), h('span', { class: 'c2-bt' }));
      b.addEventListener('click', () => pick(L));
      btn[L] = b; grid.appendChild(b);
    });
    const qline = h('div', { class: 'c2-qline' });
    const dots = h('div', { class: 'c2-dots' });
    const fb = fbox();
    const extra = h('div');
    function drawQ() {
      const q = QS[qi]; tries = 0;
      qline.innerHTML = ''; qline.append(h('span', { html: 'Which diagram shows ' + q.q }), dots);
      dots.innerHTML = ''; QS.forEach((_, k) => dots.appendChild(h('i', { class: k < qi ? 'ok' : k === qi ? 'on' : '' })));
      Object.values(btn).forEach(b => b.classList.remove('wrong'));
    }
    function pick(L) {
      if (qi >= QS.length) return;
      const q = QS[qi];
      if (L === q.ans) {
        if (tries === 0) first++;
        const b = btn[L]; b.classList.remove('wrong'); b.classList.add('right'); b.querySelector('.c2-bt').textContent = q.tag + ' ✓';
        fb.set('good', '✅ <b>' + L + '</b>: ' + q.why); A.sound('good');
        qi++;
        if (qi < QS.length) A.later(drawQ, REDUCED ? 0 : 900); else A.later(bonus, REDUCED ? 0 : 900);
      } else {
        tries++; const b = btn[L]; b.classList.add('wrong'); A.sound('bad');
        fb.set('bad', '❌ Not ' + L + '. Count the <b>kinds of particles</b>, then check whether each particle has one or more kinds of atom.');
        A.later(() => b.classList.remove('wrong'), 700);
      }
    }
    function bonus() {
      qline.innerHTML = ''; qline.append(h('span', { text: 'Bonus: what does diagram B show?' }), dots);
      dots.innerHTML = ''; QS.forEach(() => dots.appendChild(h('i', { class: 'ok' })));
      extra.appendChild(choices(['a single compound', 'a mixture of an element and a compound', 'a mixture of two compounds'].map((t, i) => ({ html: t, value: i })), v => v === 1, ok => {
        if (!ok) { fb.set('bad', '❌ Look closely: B has white–white molecules <b>and</b> white–black molecules.'); return; }
        btn.B.classList.add('right'); btn.B.querySelector('.c2-bt').textContent = 'element + compound ✓';
        fb.set('good', '✅ B has white–white molecules (an <b>element</b>) and white–black molecules (a <b>compound</b>).');
        extra.appendChild(doneBox('🏅', 'Classwork 1 complete!', 'Right first time: <b>' + first + ' / 4</b>.', null));
        A.sound('win'); A.reward('ch2-cw1', 15, 'Classwork 1');
      }));
    }
    B.append(qline, grid, fb, extra);
    drawQ();
    return card;
  }

  /* ---------- Classwork 2: six substances ---------- */
  function cw2Items() {
    const steel = latticeFor(130, 96, 9, scatter('Fe', ['C', 'var(--c2-co)', 'var(--c2-ni)'], 4, 9));
    const gold = latticeFor(130, 96, 9, () => 'Au');
    return [
      { name: 'Rainwater', ans: 'mixture', why: 'Rainwater is water with other substances dissolved in it. They are <b>not chemically combined</b>.',
        box: () => pb({ groups: [{ mol: WATER(7.5), n: 7 }, { mol: MOL.atom('X', 5.5), n: 2 }, { mol: MOL.di('X', null, 5), n: 1 }], layout: 'liquid', seed: 51, w: 130, h: 96, aria: 'Water molecules with a few other particles' }), cap: 'water + other dissolved substances' },
      { name: 'Distilled water', ans: 'compound', why: 'Distilled water is pure water, ' + F('H2O') + ': hydrogen and oxygen <b>chemically combined</b>. Only one kind of molecule.',
        box: () => pb({ groups: [{ mol: WATER(7.5), n: 8 }], layout: 'liquid', seed: 52, w: 130, h: 96, aria: 'Only water molecules' }), cap: 'only H₂O molecules' },
      { name: 'Gold', ans: 'element', why: 'Gold contains <b>only one kind of atom</b> (Au), closely packed.',
        box: () => pb({ layout: 'solid', lattice: gold, r: 9, w: 130, h: 96, aria: 'Closely packed gold atoms' }), cap: 'only Au atoms' },
      { name: 'Nitrogen (' + F('N2') + ')', ans: 'element', why: 'Each molecule is made of <b>2 nitrogen atoms</b>. There is only one kind of atom, so it is an element (not a compound!).',
        box: () => pb({ groups: [{ mol: MOL.di('N', null, 7), n: 7 }], seed: 54, w: 130, h: 96, aria: 'Nitrogen molecules, each two nitrogen atoms' }), cap: 'only N₂ molecules' },
      { name: 'Stainless steel', sub: 'an alloy of iron, carbon, chromium and nickel', ans: 'mixture', why: 'An alloy is a <b>mixture of elements</b>. The iron, carbon, chromium and nickel are <b>not chemically combined</b>.',
        box: () => pb({ layout: 'solid', lattice: steel, r: 9, w: 130, h: 96, aria: 'Iron atoms with carbon, chromium and nickel atoms scattered among them' }), cap: 'iron atoms mixed with carbon, chromium and nickel atoms' },
      { name: 'An aqueous solution of sodium chloride', ans: 'mixture', why: 'Sodium chloride (solute) and water (solvent) are mixed but <b>not chemically combined</b>.',
        box: () => pb({ groups: [{ mol: WATER(7), n: 8 }, { mol: MOL.atom('Na', 5), n: 2 }, { mol: MOL.atom('Cl', 6.5), n: 2 }], layout: 'liquid', seed: 56, w: 130, h: 96, aria: 'Water molecules with sodium chloride particles spread among them' }), cap: 'water + sodium chloride' }
    ];
  }
  const KIND_BTNS = [{ html: 'Element', value: 'element' }, { html: 'Compound', value: 'compound' }, { html: 'Mixture', value: 'mixture' }];
  function classwork2() {
    const card = A.playCard('Classwork 2: element, compound or mixture?', 'Classify each substance from the book. Then check the particle diagram that explains it.', '📝 Classwork');
    const B = card.body;
    const items = cw2Items();
    let i = 0, first = 0;
    const stage = h('div');
    B.appendChild(stage);
    function draw() {
      const it = items[i];
      stage.innerHTML = '';
      card.score.textContent = '(' + 'abcdef'[i] + ') ' + (i + 1) + ' / 6';
      const fb = fbox(), after = h('div');
      stage.append(h('div', { class: 'c2-sname', html: it.name + (it.sub ? '<small>(' + it.sub + ')</small>' : '') }),
        choices(KIND_BTNS, v => v === it.ans, (ok, isFirst) => {
          if (!ok) { fb.set('bad', '❌ Think: how many kinds of particle? Are the atoms chemically combined?'); return; }
          if (isFirst) first++;
          fb.set('good', '✅ <b>' + cap(it.ans) + '</b>. ' + it.why);
          after.appendChild(h('div', { class: 'c2-sub' }, h('figure', { class: 'c2-fig' }, h('div', { class: 'c2-pb', style: { width: '100%' } }, it.box()), h('figcaption', { html: '<small>' + it.cap + '</small>' })),
            h('div', { class: 'q-actions', style: { marginTop: 0 } }, h('button', { class: 'btn btn-primary', type: 'button', text: i + 1 < items.length ? 'Next →' : 'Finish 🏁', on: { click: () => { i++; i < items.length ? draw() : finish(); } } }))));
        }, 'c2-bigch'), fb, after);
    }
    function finish() {
      stage.innerHTML = ''; card.score.textContent = '';
      stage.appendChild(doneBox(first >= 5 ? '🏆' : '👍', 'Classwork 2 complete!', 'Right first time: <b>' + first + ' / 6</b>.', () => { const n = classwork2(); card.replaceWith(n); }));
      A.sound('win'); if (first >= 5) A.celebrate(.5); A.reward('ch2-cw2', 15, 'Classwork 2');
    }
    draw();
    return card;
  }

  /* ---------- Game: Particle Detective ---------- */
  const DET = [
    { k: 'element', eg: 'e.g. argon, Ar: separate atoms of one kind', g: () => [[MOL.atom('Ar', 8), 9]] },
    { k: 'element', eg: 'e.g. nitrogen, N₂', g: () => [[MOL.di('N', null, 8), 8]] },
    { k: 'element', eg: 'e.g. oxygen, O₂', g: () => [[MOL.di('O', null, 8), 8]] },
    { k: 'element', eg: 'e.g. ozone, O₃ (another form of oxygen)', g: () => [[MOL.tri('O', 7), 6]] },
    { k: 'element', eg: 'e.g. gold, Au: closely packed atoms of one kind', solid: () => latticeFor(220, 150, 11, () => 'Au') },
    { k: 'compound', eg: 'e.g. water, H₂O', g: () => [[WATER(9), 7]] },
    { k: 'compound', eg: 'e.g. carbon dioxide, CO₂', g: () => [[CO2(8), 6]] },
    { k: 'compound', eg: 'e.g. hydrogen chloride, HCl', g: () => [[MOL.di('H', 'Cl', 8), 8]] },
    { k: 'compound', eg: 'e.g. methane, CH₄', g: () => [[CH4(8), 6]] },
    { k: 'mixture', eg: 'a mixture of elements (nitrogen + oxygen)', g: () => [[MOL.di('N', null, 8), 6], [MOL.di('O', null, 8), 3]] },
    { k: 'mixture', eg: 'a mixture of two compounds (water + carbon dioxide)', g: () => [[WATER(8.5), 5], [CO2(7.5), 3]] },
    { k: 'mixture', eg: 'a mixture of elements and compounds, like air', g: () => [[MOL.di('N', null, 7.5), 6], [MOL.di('O', null, 7.5), 2], [CO2(7), 1], [MOL.atom('Ar', 7.5), 1]] },
    { k: 'mixture', eg: 'an alloy (bronze): copper and tin atoms mixed, not chemically combined', solid: () => { const L = latticeFor(220, 150, 11, () => 'Cu'); A.sample(L.map((_, i) => i), 8).forEach(i => { L[i] = 'Sn'; }); return L; } },
    { k: 'mixture', eg: 'salt solution: water + sodium chloride', g: () => [[WATER(8.5), 6], [MOL.atom('Na', 6), 2], [MOL.atom('Cl', 7.5), 2]] }
  ];
  const DET_WHY = {
    element: 'Only <b>one kind of atom</b> → element.',
    compound: 'Every particle is the same, and each has <b>different atoms stuck together</b> → compound.',
    mixture: '<b>More than one kind of particle</b>, not chemically combined → mixture.'
  };
  function detective() {
    const ROUNDS = 10;
    const card = A.playCard('Particle Detective', ROUNDS + ' mystery boxes. Element, compound or mixture? Build a streak 🔥', '🕵️ Speed game');
    const B = card.body;
    let round = 0, score = 0, streak = 0, best = 0, lastIdx = -1, deck = [];
    const hud = h('div', { class: 'c2-hud' });
    const stage = h('div');
    B.append(hud, stage);
    function drawHud() {
      hud.innerHTML = '';
      hud.append(h('span', { class: 'pill', text: 'Box ' + Math.min(round + 1, ROUNDS) + ' / ' + ROUNDS }), h('span', { class: 'spacer' }), h('span', { class: 'pill', text: '⭐ ' + score }), h('span', { class: 'pill', text: '🔥 ' + streak }));
    }
    function nextSpec() {
      if (!deck.length) deck = A.shuffle(DET.map((_, i) => i));
      let idx = deck.pop(); if (idx === lastIdx && deck.length) { deck.unshift(idx); idx = deck.pop(); }
      lastIdx = idx; return DET[idx];
    }
    function draw() {
      drawHud();
      const d = nextSpec();
      const spec = d.solid ? { layout: 'solid', lattice: d.solid(), r: 11 } : { groups: d.g().map(([mol, n]) => ({ mol, n })), motion: 'jiggle', amp: 1.4 };
      const box = A.particleBox(Object.assign({ w: 220, h: 150, seed: Math.floor(rand(1, 99999)), aria: 'Mystery particle diagram' }, spec));
      const fb = fbox(), after = h('div');
      let answered = false;
      stage.innerHTML = '';
      stage.append(h('div', { class: 'c2-det' }, box),
        choices(KIND_BTNS, v => v === d.k, (ok, isFirst) => {
          if (answered) return;
          if (!ok) {
            answered = true; streak = 0;
            stage.querySelectorAll('.c2-choice').forEach(b => { if (b.textContent.trim().toLowerCase().startsWith(d.k)) b.classList.add('right'); });
            fb.set('bad', '❌ It is ' + (d.k === 'element' ? 'an' : 'a') + ' <b>' + d.k + '</b>. ' + DET_WHY[d.k] + ' <span class="muted">(' + d.eg + ')</span>'); drawHud(); showNext(after); return;
          }
          answered = true;
          score++; streak++; best = Math.max(best, streak);
          if (streak > 0 && streak % 3 === 0) A.toast('🔥 Streak ' + streak + '!', 'xp');
          fb.set('good', '✅ ' + DET_WHY[d.k] + ' <span class="muted">(' + d.eg + ')</span>');
          drawHud(); showNext(after);
        }, 'c2-bigch'), fb, after);
    }
    function showNext(after) {
      // one try per box in this speed game: reveal the answer button
      stage.querySelectorAll('.c2-choice').forEach(b => { b.disabled = true; });
      after.appendChild(h('div', { class: 'q-actions' }, h('button', { class: 'btn btn-primary', type: 'button', text: round + 1 < ROUNDS ? 'Next box →' : 'See score 🏁', on: { click: () => { round++; round < ROUNDS ? draw() : finish(); } } })));
    }
    function finish() {
      hud.innerHTML = ''; stage.innerHTML = '';
      const great = score >= 8;
      stage.appendChild(doneBox(great ? '🕵️‍♂️' : '💪', 'Score: ' + score + ' / ' + ROUNDS, 'Best streak: <b>' + best + '</b> 🔥. ' + (great ? 'Super detective!' : 'Look at the kinds of particles and atoms, then try again.'), () => { const n = detective(); card.replaceWith(n); }));
      A.sound(great ? 'win' : 'good'); if (great) A.celebrate(.7);
      A.reward('ch2-detective', 15, 'Particle Detective');
    }
    draw();
    return card;
  }

  function bigSort() {
    const card = A.playCard('The big sort', 'Every substance from this section. Tap one, then tap its box.', '🗂️ Sort'); card.classList.add('c2-sortc');
    card.body.appendChild(A.sortGame({
      buckets: [{ id: 'element', title: 'Element' }, { id: 'compound', title: 'Compound' }, { id: 'mixture', title: 'Mixture' }],
      items: [
        { label: 'gold', bucket: 'element', explain: 'Only gold atoms (Au).', hint: 'How many kinds of atom does gold have?' },
        { label: 'nitrogen (N₂)', bucket: 'element', explain: 'Only nitrogen atoms, in pairs.', hint: 'N₂ has two atoms, but only one kind.' },
        { label: 'iron', bucket: 'element', explain: 'Only iron atoms (Fe).' },
        { label: 'sulphur', bucket: 'element', explain: 'Only sulphur atoms (S).' },
        { label: 'distilled water', bucket: 'compound', explain: 'Pure H₂O: hydrogen + oxygen chemically combined.', hint: 'Distilled water is pure water: is anything else mixed in?' },
        { label: 'carbon dioxide', bucket: 'compound', explain: 'CO₂: carbon + oxygen chemically combined.' },
        { label: 'sodium chloride', bucket: 'compound', explain: 'NaCl: sodium + chlorine chemically combined.' },
        { label: 'calcium carbonate', bucket: 'compound', explain: 'CaCO₃: calcium + carbon + oxygen chemically combined.' },
        { label: 'iron(II) sulphide', bucket: 'compound', explain: 'FeS: iron + sulphur chemically combined (not attracted by a magnet!).', hint: 'Remember Experiment 2.1: it is not attracted by a magnet.' },
        { label: 'rainwater', bucket: 'mixture', explain: 'Water + other dissolved substances.', hint: 'Rainwater has other substances dissolved in it.' },
        { label: 'sea water', bucket: 'mixture', explain: 'Water + dissolved salts.' },
        { label: 'air', bucket: 'mixture', explain: 'Elements + compounds, not chemically combined.' },
        { label: 'bronze', bucket: 'mixture', explain: 'An alloy of copper and tin.', hint: 'Alloys are mixtures.' },
        { label: 'stainless steel', bucket: 'mixture', explain: 'An alloy of iron, carbon, chromium and nickel.', hint: 'Alloys are mixtures.' },
        { label: 'crude oil', bucket: 'mixture', explain: 'A mixture of hydrocarbons.' }
      ],
      rewardKey: 'ch2-bigsort', xp: 20
    }));
    return card;
  }

  function renderClassify(root) {
    root.appendChild(summaryCard());
    root.appendChild(classwork1());
    root.appendChild(classwork2());
    root.appendChild(detective());
    root.appendChild(bigSort());
    const k = A.noteCard('All three definitions', '', '📖 Recall'); k.classList.add('c2-k');
    k.lastChild.appendChild(A.cloze(
      'An <b>element</b> is a [[pure]] substance that cannot be broken down into anything simpler by [[chemical]] methods.<br>' +
      'A <b>compound</b> is a pure substance made up of two or more elements [[chemically]] combined.<br>' +
      'A <b>mixture</b> consists of two or more pure substances which are [[NOT|not]] chemically combined.', { rewardKey: 'ch2-cloze-4', xp: 10 }));
    root.appendChild(k);
    A.quickCheck(root, 'ch2', 'ch2-3', 5);
  }

  /* =========================================================
     Question bank
     ========================================================= */
  const L1 = 'ch2-1', L2 = 'ch2-2', L3 = 'ch2-3';
  const cwFig = (L, seed) => () => h('div', { class: 'c2-paper' }, cwBox(L, seed, 160, 120));
  const QUESTIONS = [
    /* ---- 2.1 Compounds ---- */
    { lesson: L1, type: 'mcq', q: 'Which of the following best describes a <b>compound</b>?',
      options: ['A pure substance made up of two or more elements chemically combined', 'Two or more substances mixed together but not chemically combined', 'A pure substance made up of only one kind of atom', 'Any substance that contains more than one kind of molecule'], answer: 0,
      explain: 'Book definition: a compound is a <b>pure</b> substance made up of two or more elements <b>chemically combined</b>.' },
    { lesson: L1, type: 'fill', q: 'A compound is a ___ substance that is made up of two or more elements chemically combined.', answer: ['pure'],
      explain: 'A compound contains only one kind of particle, so it is a <b>pure</b> substance.' },
    { lesson: L1, type: 'fill', q: 'The elements that make up a compound are called its ___ elements.', answer: ['constituent'], hint: 'It starts with “con…”.',
      explain: 'E.g. the <b>constituent elements</b> of sodium chloride are sodium and chlorine.' },
    { lesson: L1, type: 'mcq', q: 'This particle diagram shows a sample of water. Which feature shows that water is a <b>compound</b>, not an element?', fig: () => A.particleBox({ w: 160, h: 110, groups: [{ mol: WATER(8), n: 7 }], layout: 'liquid', seed: 61, aria: 'Water molecules' }),
      options: ['Each particle has atoms of two different elements stuck together', 'All the particles are the same', 'The particles are close together', 'There are many particles'], answer: 0,
      explain: 'Different colours = different elements; stuck together = <b>chemically combined</b>. (All particles being the same only shows it is <b>pure</b>.)' },
    { lesson: L1, type: 'mcq', q: 'What is the chemical formula of <b>carbon dioxide</b>?', options: [F('CO2'), F('C2O'), F('CO3'), F('CaCO3')], answer: 0,
      explain: 'One carbon atom and <b>two</b> oxygen atoms: ' + F('CO2') + '.' },
    { lesson: L1, type: 'tf', q: 'Water is a liquid at room conditions and its chemical formula is ' + F('H2O') + '.', answer: true,
      explain: 'Water is a liquid at room conditions. Each water molecule has 2 hydrogen atoms and 1 oxygen atom chemically combined, so its formula is ' + F('H2O') + '.' },
    { lesson: L1, type: 'mcq', q: 'Which elements make up <b>calcium carbonate</b> (' + F('CaCO3') + ', limestone)?', options: ['calcium, carbon and oxygen', 'calcium and carbon only', 'calcium, chlorine and oxygen', 'carbon and oxygen only'], answer: 0,
      explain: 'Ca = calcium, C = carbon, O = oxygen.' },
    { lesson: L1, type: 'multi', q: 'Which elements are found in <b>sodium sulphate</b>, ' + F('Na2SO4') + '? Select all.', options: ['sodium', 'sulphur', 'oxygen', 'chlorine', 'calcium'], answer: [0, 1, 2],
      explain: 'Na = sodium, S = sulphur, O = oxygen.' },
    { lesson: L1, type: 'match', q: 'Match each compound with its chemical formula.', pairs: [['sodium chloride', 'NaCl'], ['calcium carbonate', F('CaCO3')], ['sodium sulphate', F('Na2SO4')], ['iron(II) sulphide', 'FeS']],
      explain: 'Each formula shows the elements chemically combined: NaCl (sodium, chlorine), ' + F('CaCO3') + ' (calcium, carbon, oxygen), ' + F('Na2SO4') + ' (sodium, sulphur, oxygen), FeS (iron, sulphur).' },
    { lesson: L1, type: 'fill', q: 'Table salt is the compound sodium chloride. Its chemical formula is ___.', answer: ['NaCl'],
      explain: 'Na (sodium) + Cl (chlorine) → NaCl. Remember: capital letter first, then a small letter.' },
    { lesson: L1, type: 'fill', q: 'Limestone is mainly the compound calcium ___ (' + F('CaCO3') + ').', answer: ['carbonate'],
      explain: 'Calcium carbonate, ' + F('CaCO3') + '.' },
    { lesson: L1, type: 'mcq', q: 'How many <b>oxygen</b> atoms are there in one unit of ' + F('CaCO3') + '?', options: ['1', '2', '3', '5'], answer: 2, noShuffle: true,
      explain: 'The subscript 3 belongs to O, so there are 3 oxygen atoms (plus 1 Ca and 1 C).' },
    { lesson: L1, type: 'mcq', q: 'In Experiment 2.1, a magnet is moved under a dish of <b>iron(II) sulphide</b>. What is observed?', options: ['It is not attracted by the magnet', 'It is attracted, because it contains iron', 'The iron part is attracted and separated from the sulphur', 'It dissolves'], answer: 0,
      explain: 'Iron(II) sulphide is a compound with <b>different properties</b> from iron, so it is not attracted.' },
    { lesson: L1, type: 'tf', q: 'In Experiment 2.1, sulphur powder floats on water, while iron powder sinks to the bottom.', answer: true,
      explain: 'Neither dissolves; sulphur <b>floats</b> and iron <b>sinks</b>.' },
    { lesson: L1, type: 'mcq', q: 'In Experiment 2.1, one spatula of the <b>mixture of iron and sulphur</b> is added to water. What is observed?', options: ['The iron sinks and the sulphur floats', 'All of it sinks', 'All of it floats', 'All of it dissolves'], answer: 0,
      explain: 'Neither dissolves. In a mixture each substance keeps its own properties: iron <b>sinks</b>, sulphur <b>floats</b>.' },
    { lesson: L1, type: 'tf', q: 'Iron(II) sulphide has the same properties as iron, because it contains iron.', answer: false,
      explain: 'A compound has <b>different</b> properties from its constituent elements, e.g. it is not attracted by a magnet.' },
    { lesson: L1, type: 'mcq', q: 'Experiment 2.1 shows that a <b>compound</b>…', options: ['has different properties from its constituent elements', 'keeps the properties of its constituent elements', 'can be separated by a magnet', 'always dissolves in water'], answer: 0,
      explain: 'Iron(II) sulphide behaves differently from both iron and sulphur.' },
    { lesson: L1, type: 'match', q: 'Experiment 2.1: match each sample with its results.', pairs: [['iron', 'attracted by a magnet; sinks in water'], ['sulphur', 'not attracted; floats on water'], ['iron(II) sulphide', 'not attracted; sinks in water'], ['iron + sulphur mixture', 'iron part attracted; iron sinks, sulphur floats']],
      explain: 'The mixture keeps the properties of iron and sulphur; the compound iron(II) sulphide has new properties.' },
    { lesson: L1, type: 'tf', q: 'In a particle diagram of a compound, spheres of different colours stick to one another.', answer: true,
      explain: 'Different colours = different elements; sticking together = <b>chemically combined</b>.' },

    /* ---- 2.1 Mixtures ---- */
    { lesson: L2, type: 'mcq', q: 'A mixture consists of two or more pure substances. These pure substances can be…', options: ['elements or compounds', 'elements only', 'compounds only', 'atoms of one kind only'], answer: 0,
      explain: 'Book definition: two or more pure substances (<b>elements or compounds</b>), not chemically combined. E.g. bronze (elements), sea water (compounds), air (both).' },
    { lesson: L2, type: 'fill', q: 'A mixture consists of two or more pure substances (elements or compounds) which are NOT ___ combined.', answer: ['chemically'],
      explain: 'They are only mixed, not <b>chemically</b> combined.' },
    { lesson: L2, type: 'fill', q: '___ (合金) are mixtures of elements, in which at least one of them is a metal.', answer: ['alloys', 'alloy', 'an alloy'],
      explain: '<b>Alloys</b>, e.g. bronze (copper + tin).' },
    { lesson: L2, type: 'mcq', q: '<b>Bronze</b> (青銅) is an alloy. What does it consist of?', options: ['copper and tin, not chemically combined', 'copper and tin, chemically combined', 'iron and carbon, chemically combined', 'copper and oxygen, chemically combined'], answer: 0,
      explain: 'Bronze is a mixture of the elements copper and tin.' },
    { lesson: L2, type: 'mcq', q: 'How is an alloy made?', options: ['Melt the elements, mix the liquids, then cool to form a solid', 'Mix the powders, then dissolve them in water', 'Heat the elements until they burn', 'Cool the elements, then mix the solids'], answer: 0,
      explain: 'Melting → mixing → cooling.' },
    { lesson: L2, type: 'tf', q: 'In an alloy, at least one of the elements is a metal.', answer: true,
      explain: 'Alloys are mixtures of elements in which <b>at least one</b> is a metal.' },
    { lesson: L2, type: 'mcq', q: 'In an aqueous solution of table salt, which substance is the <b>solvent</b>?', options: ['water', 'sodium chloride', 'hydrogen', 'oxygen'], answer: 0,
      explain: 'Water is the solvent; sodium chloride (the salt) is the solute.' },
    { lesson: L2, type: 'fill', q: 'In salt solution, sodium chloride is the ___ and water is the solvent.', answer: ['solute'],
      explain: 'The substance that dissolves is the <b>solute</b>.' },
    { lesson: L2, type: 'mcq', q: '<b>Petroleum (crude oil)</b> is a mixture of…', options: ['hydrocarbons: compounds of hydrogen and carbon only', 'elements only', 'hydrogen and carbon atoms that are not combined', 'salts dissolved in water'], answer: 0,
      explain: 'Crude oil is a mixture of <b>hydrocarbons</b> (烴), e.g. methane, ethane, propane, butane.' },
    { lesson: L2, type: 'multi', q: 'Which of these are found in air as <b>elements</b>? Select all.', options: ['nitrogen', 'oxygen', 'argon', 'carbon dioxide', 'water vapour'], answer: [0, 1, 2],
      explain: 'Nitrogen, oxygen and argon are elements; carbon dioxide and water vapour are compounds.' },
    { lesson: L2, type: 'mcq', q: 'About what percentage of air is <b>nitrogen</b>?', options: ['0.9%', '21%', '50%', '78%'], answer: 3, noShuffle: true,
      explain: 'Nitrogen 78%, oxygen 21%, argon 0.9%, other gases 0.1%.' },
    { lesson: L2, type: 'tf', q: 'Air is a mixture of elements only.', answer: false,
      explain: 'Air also contains <b>compounds</b>, e.g. carbon dioxide and water vapour.' },
    { lesson: L2, type: 'mcq', q: '<b>Sea water</b> is best described as…', options: ['a mixture of compounds: water and dissolved salts', 'a compound', 'an element', 'a mixture of elements only'], answer: 0,
      explain: 'Water and salts (e.g. sodium chloride) are compounds, mixed but not chemically combined.' },
    { lesson: L2, type: 'match', q: 'Match each mixture with what it contains.', pairs: [['bronze', 'copper + tin'], ['sea water', 'water + dissolved salts'], ['salt solution', 'sodium chloride + water'], ['crude oil', 'hydrocarbons'], ['air', 'nitrogen, oxygen, argon, CO₂, water vapour']],
      explain: 'These are the examples of mixtures in the book.' },
    { lesson: L2, type: 'tf', q: 'Red beans and milk can be mixed to make iced red beans and then separated again, because they are not chemically combined.', answer: true,
      explain: 'Iced red beans is a mixture: red beans + milk ⇌ iced red beans.' },
    { lesson: L2, type: 'mcq', q: 'Which gas makes up about <b>21%</b> of air?', options: ['oxygen', 'nitrogen', 'argon', 'carbon dioxide'], answer: 0,
      explain: 'Oxygen is about 21% of air.' },
    { lesson: L2, type: 'multi', q: 'Which of the following are <b>hydrocarbons</b>? Select all.', options: ['methane', 'butane', 'water', 'carbon dioxide'], answer: [0, 1],
      explain: 'Hydrocarbons contain <b>hydrogen and carbon only</b>. Water has no carbon; carbon dioxide has no hydrogen.' },
    { lesson: L2, type: 'fill', q: 'Bronze is an alloy of copper and ___.', answer: ['tin', 'Sn'],
      explain: 'Bronze = copper + tin.' },
    { lesson: L2, type: 'match', q: 'Match each part of air with its percentage.', pairs: [['nitrogen', '78%'], ['oxygen', '21%'], ['argon', '0.9%'], ['other gases (incl. carbon dioxide, water vapour)', '0.1%']],
      explain: 'Composition of air: nitrogen 78%, oxygen 21%, argon 0.9%, other gases 0.1%.' },

    /* ---- 2.1 Element, compound or mixture? ---- */
    { lesson: L3, type: 'mcq', q: 'What does this particle diagram show?', fig: cwFig('D', 71), options: CLASS_OPTS, answer: 0,
      explain: 'Only one kind of molecule, made of only one kind of atom → a single element.' },
    { lesson: L3, type: 'mcq', q: 'What does this particle diagram show?', fig: cwFig('E', 72), options: CLASS_OPTS, answer: 1,
      explain: 'Only one kind of molecule, each with two different atoms stuck together → a single compound.' },
    { lesson: L3, type: 'mcq', q: 'What does this particle diagram show?', fig: cwFig('A', 73), options: CLASS_OPTS, answer: 2,
      explain: 'Two kinds of molecules, each made of one kind of atom → a mixture of elements.' },
    { lesson: L3, type: 'mcq', q: 'What does this particle diagram show?', fig: cwFig('C', 74), options: CLASS_OPTS, answer: 3,
      explain: 'Two kinds of molecules, both made of different atoms combined → a mixture of two compounds.' },
    { lesson: L3, type: 'mcq', q: 'What does this particle diagram show?', fig: cwFig('B', 75), options: CLASS_OPTS, answer: 4,
      explain: 'White–white molecules (element) mixed with white–black molecules (compound).' },
    { lesson: L3, type: 'mcq', q: '<b>Rainwater</b> is…', options: ['a mixture', 'a compound', 'an element', 'a pure substance'], answer: 0,
      explain: 'Rainwater is water with other substances dissolved in it, not chemically combined.' },
    { lesson: L3, type: 'tf', q: 'Distilled water is a mixture because it is a liquid.', answer: false,
      explain: 'Distilled water is pure ' + F('H2O') + ': a <b>compound</b>. Being a liquid has nothing to do with it.' },
    { lesson: L3, type: 'fill', q: 'Gold contains only one kind of atom, so it is an ___.', answer: ['element', 'an element'],
      explain: 'Only one kind of atom (Au) → <b>element</b>.' },
    { lesson: L3, type: 'tf', q: 'Nitrogen (' + F('N2') + ') is a compound because each molecule contains two atoms.', answer: false,
      explain: 'Both atoms are nitrogen: only <b>one kind of atom</b>, so nitrogen is an <b>element</b>.' },
    { lesson: L3, type: 'mcq', q: '<b>Stainless steel</b> (an alloy of iron, carbon, chromium and nickel) is…', options: ['a mixture', 'a compound', 'an element', 'a pure substance'], answer: 0,
      explain: 'Alloys are mixtures of elements that are not chemically combined. (The book’s table prints “cobalt”, but the metal added to make steel stainless is chromium. Either way, it is a mixture.)' },
    { lesson: L3, type: 'multi', q: 'Which of the following are <b>pure substances</b>? Select all.', options: ['gold', 'distilled water', 'carbon dioxide', 'rainwater', 'air', 'bronze'], answer: [0, 1, 2],
      explain: 'Elements and compounds are pure substances. Rainwater, air and bronze are mixtures.' },
    { lesson: L3, type: 'match', q: 'Match each word with its meaning.', pairs: [['element', 'only one kind of atom'], ['compound', 'two or more elements chemically combined'], ['mixture', 'two or more pure substances NOT chemically combined']],
      explain: 'These are the three key definitions of this section.' },
    { lesson: L3, type: 'fill', q: 'An aqueous solution of sodium chloride is a ___, because sodium chloride and water are not chemically combined.', answer: ['mixture', 'a mixture'],
      explain: 'Solute + solvent, not chemically combined → <b>mixture</b>.' },
    { lesson: L3, type: 'mcq', q: 'Odd one out: three of these are <b>elements</b>. Which one is <b>not</b> an element?', options: ['distilled water', 'gold', 'nitrogen', 'iron'], answer: 0,
      explain: 'Distilled water (' + F('H2O') + ') is a <b>compound</b>; gold, nitrogen and iron each have only one kind of atom.' },
    { lesson: L3, type: 'mcq', q: 'Odd one out: three of these are <b>mixtures</b>. Which one is <b>not</b> a mixture?', options: ['carbon dioxide', 'air', 'bronze', 'sea water'], answer: 0,
      explain: 'Carbon dioxide (' + F('CO2') + ') is a pure <b>compound</b>; air, bronze and sea water are mixtures.' },
    { lesson: L3, type: 'match', q: 'Match each description with the type of substance.', pairs: [['Cannot be broken down into anything simpler by chemical methods', 'element'], ['Has different properties from its constituent elements', 'compound'], ['Keeps the properties of its constituents', 'mixture']],
      explain: 'An element is the simplest pure substance. A compound has new properties (e.g. iron(II) sulphide is not attracted by a magnet). A mixture keeps the properties of what is in it (e.g. the iron in iron + sulphur is still attracted).' },
    { lesson: L3, type: 'tf', q: 'A compound can be separated into its constituent elements by physical methods, such as using a magnet.', answer: false,
      explain: 'The elements in a compound are <b>chemically combined</b>, so physical methods cannot separate them (a magnet does not even attract iron(II) sulphide). It is a <b>mixture</b> that can be separated by physical methods.' },
    { lesson: L3, type: 'multi', q: 'Which of these are <b>mixtures</b>? Select all.', options: ['rainwater', 'stainless steel', 'sea water', 'distilled water', 'gold', 'sodium chloride'], answer: [0, 1, 2],
      explain: 'Distilled water and sodium chloride are compounds; gold is an element.' },
    { lesson: L3, type: 'fill', q: 'A particle diagram shows only one kind of molecule, and each molecule has two different kinds of atom stuck together. It shows a single ___.', answer: ['compound', 'a compound'],
      explain: 'One kind of particle → pure; different atoms <b>chemically combined</b> → a single <b>compound</b>.' }
  ];

  /* =========================================================
     Glossary
     ========================================================= */
  const GLOSSARY = [
    { en: 'Compound', zh: '化合物', def: 'A pure substance that is made up of two or more elements chemically combined.' },
    { en: 'Mixture', zh: '混合物', def: 'Two or more pure substances (elements or compounds) which are NOT chemically combined, so it contains more than one kind of particle.' },
    { en: 'Chemically combined', zh: '化學結合', def: 'Atoms joined (stuck) together. In a compound, atoms of different elements are chemically combined.' },
    { en: 'Constituent elements', zh: '組成元素', def: 'The elements that make up a compound, e.g. sodium and chlorine in NaCl.' },
    { en: 'Sodium chloride (table salt)', zh: '氯化鈉（食鹽）', def: 'NaCl, a compound of sodium and chlorine.' },
    { en: 'Calcium carbonate (limestone)', zh: '碳酸鈣（石灰石）', def: 'CaCO<sub>3</sub>, a compound of calcium, carbon and oxygen.' },
    { en: 'Sodium sulphate', zh: '硫酸鈉', def: 'Na<sub>2</sub>SO<sub>4</sub>, a compound of sodium, sulphur and oxygen.' },
    { en: 'Alloy', zh: '合金', def: 'A mixture of elements in which at least one is a metal; made by melting, mixing and cooling.' },
    { en: 'Bronze', zh: '青銅', def: 'An alloy of copper and tin.' },
    { en: 'Stainless steel', zh: '不銹鋼', def: 'An alloy of iron with carbon, chromium and nickel.' },
    { en: 'Solute', zh: '溶質', def: 'The substance that dissolves, e.g. sodium chloride in salt solution.' },
    { en: 'Solvent', zh: '溶劑', def: 'The liquid the solute dissolves in, e.g. water.' },
    { en: 'Aqueous solution', zh: '水溶液', def: 'A solution in which water is the solvent.' },
    { en: 'Hydrocarbon', zh: '烴', def: 'A compound of hydrogen and carbon only, e.g. methane, ethane, propane, butane.' },
    { en: 'Petroleum (crude oil)', zh: '石油（原油）', def: 'A mixture of hydrocarbons.' },
    { en: 'Air', zh: '空氣', def: 'A mixture of elements (nitrogen 78%, oxygen 21%, argon 0.9%) and compounds (e.g. carbon dioxide, water vapour).' },
    { en: 'Sea water', zh: '海水', def: 'A mixture of water and dissolved salts (e.g. sodium chloride).' }
  ];

  /* =========================================================
     Register
     ========================================================= */
  A.registerChapter({
    id: 'ch2', num: 2, title: 'Compounds & Mixtures', zh: '化合物與混合物', icon: '⚗️', accent: 'c2',
    intro: 'Elements, compounds or mixtures? Physical vs chemical changes, and balancing chemical equations.',
    lessons: [
      { id: 'ch2-1', num: '2.1', kicker: 'Formulae · Experiment 2.1', title: 'Compounds', short: 'Compounds', zh: '化合物', render: root => renderCompounds(root) },
      { id: 'ch2-2', num: '2.1', kicker: 'Alloys · solutions · air', title: 'Mixtures', short: 'Mixtures', zh: '混合物', render: root => renderMixtures(root) },
      { id: 'ch2-3', num: '2.1', kicker: 'Classwork', title: 'Element, Compound or Mixture?', short: 'Classify', zh: '元素、化合物還是混合物？', render: root => renderClassify(root) }
    ],
    questions: QUESTIONS,
    glossary: GLOSSARY
  });
})();
