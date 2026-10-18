/* Chapter 0 — placeholder (to be built) */
(function () {
  'use strict';
  const A = window.ChemApp; const { h } = A;
  A.registerChapter({
    id: 'ch0', num: 0, title: ['Introduction to Chemistry','Elements','Compounds & Mixtures'][0], zh: ['化學入門','元素','化合物與混合物'][0],
    icon: ['🧪','⚛️','⚗️'][0], accent: 'c0', intro: 'Demo',
    lessons: [{ id: 'ch0-demo', title: 'Demo lesson', zh: '示範', render(root, api) {
      root.appendChild(api.noteCard('Notes', '<ul><li>Chemistry is the study of ' + api.term('matter', '物質') + '.</li></ul>' ));
      root.appendChild(api.keybox('An <b>element</b> is a pure substance.'));
      const p = api.playCard('Sort it', 'Tap then tap a box'); root.appendChild(p);
      p.body.appendChild(api.sortGame({ buckets: [{id:'m',title:'Metal'},{id:'n',title:'Non-metal'}], items: [{label:'Cu',bucket:'m'},{label:'S',bucket:'n'}], rewardKey:'demo0' }));
      root.appendChild(api.cloze('A [[mixture]] is not [[chemically]] combined.'));
      root.appendChild(api.matchWidget([['Na','Natrium'],['Cu','Cuprum']]));
      root.appendChild(api.flashcards([{front:'<div class=big>Na</div>', back:'<div class=mid>sodium</div>'}]));
      root.appendChild(api.particleBox({ groups: [{ mol: api.MOL.bent('O','H'), n: 5 }], motion: 'jiggle', label: 'water' }));
      root.appendChild(api.particleBox({ layout: 'solid', lattice: ['Fe'], label: 'iron' }));
      const qb = api.h('div', {class:'card'}); root.appendChild(qb);
      api.quiz(qb, this.qs || []);
    } }],
    questions: [
      { type: 'mcq', q: 'Symbol of sodium?', options: ['Na','So','S','N'], answer: 0, explain: 'Latin natrium', lesson: 'ch0-demo' },
      { type: 'tf', q: 'Mercury is a liquid metal.', answer: true, lesson: 'ch0-demo' },
      { type: 'fill', q: 'Water is a ___.', answer: ['compound'], lesson: 'ch0-demo' },
      { type: 'multi', q: 'Metals?', options: ['Cu','S','Fe'], answer: [0,2], lesson: 'ch0-demo' },
      { type: 'match', q: 'Match', pairs: [['H','hydrogen'],['He','helium']], lesson: 'ch0-demo' }
    ],
    glossary: [{ en: 'Element', zh: '元素', def: 'A pure substance that cannot be broken down.' }]
  });
})();
