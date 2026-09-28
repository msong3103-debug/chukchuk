/* 게임 놀이터 데이터 — 행성, 낱말 퍼즐, 연산 스피드 문제
   window.GameData = { PLANETS, planetSVG, WORDS, wordTiles, speedQ } */
(function () {
  const R = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  const P = (a) => a[Math.floor(Math.random() * a.length)];
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  // ───── 태양계 ───── (태양에서 가까운 순서)
  const PLANETS = [
    { id:'sun',     ko:'태양',   en:'Sun',     c1:'#ffd54a', c2:'#f59e0b', fact:'태양계 한가운데에서 빛나는 별이에요.' },
    { id:'mercury', ko:'수성',   en:'Mercury', c1:'#c9c3bb', c2:'#8d857b', fact:'태양에 가장 가까운 행성이에요.' },
    { id:'venus',   ko:'금성',   en:'Venus',   c1:'#f3d9a4', c2:'#d9a441', fact:'태양계에서 가장 뜨거운 행성이에요.' },
    { id:'earth',   ko:'지구',   en:'Earth',   c1:'#5fb3f0', c2:'#2a9d63', fact:'우리가 살고 있는 행성이에요.' },
    { id:'mars',    ko:'화성',   en:'Mars',    c1:'#f08a5d', c2:'#b8432c', fact:'붉은색으로 보여서 붉은 행성이라고 불러요.' },
    { id:'jupiter', ko:'목성',   en:'Jupiter', c1:'#f1d2a8', c2:'#c98b54', fact:'태양계에서 가장 큰 행성이에요.' },
    { id:'saturn',  ko:'토성',   en:'Saturn',  c1:'#f6e3a1', c2:'#d4b25c', fact:'크고 멋진 고리가 있는 행성이에요.' },
    { id:'uranus',  ko:'천왕성', en:'Uranus',  c1:'#b8ecef', c2:'#6fc9d0', fact:'옆으로 누운 채로 돌고 있는 행성이에요.' },
    { id:'neptune', ko:'해왕성', en:'Neptune', c1:'#6f9cf0', c2:'#2f5dc4', fact:'태양에서 가장 먼 행성이에요.' },
  ];
  // 제미나이 그림이 없을 때 쓰는 간단한 행성 그림
  function planetSVG(id) {
    const p = PLANETS.find((x) => x.id === id);
    const g = `<defs><radialGradient id="g" cx="35%" cy="35%" r="70%"><stop offset="0" stop-color="${p.c1}"/><stop offset="1" stop-color="${p.c2}"/></radialGradient></defs>`;
    let body = `<circle cx="50" cy="50" r="${id === 'sun' ? 40 : 30}" fill="url(#g)" stroke="#18352f" stroke-width="3"/>`;
    if (id === 'jupiter') body += '<path d="M24 42h52M22 52h56M26 62h48" stroke="#a8683a" stroke-width="4" stroke-linecap="round" opacity=".7"/><ellipse cx="60" cy="60" rx="7" ry="4" fill="#c0533a"/>';
    if (id === 'earth') body += '<path d="M36 36c8-4 14 2 10 8s4 10-2 14M58 58c6-2 12 2 10 8" fill="none" stroke="#2a7d4f" stroke-width="7" stroke-linecap="round"/>';
    if (id === 'saturn') body = `<ellipse cx="50" cy="52" rx="46" ry="12" fill="none" stroke="#c9a14a" stroke-width="5"/>${body}<path d="M8 55a46 12 0 0 0 84 0" fill="none" stroke="#c9a14a" stroke-width="5"/>`;
    if (id === 'sun') body += '<g stroke="#f59e0b" stroke-width="4" stroke-linecap="round">' + [0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<line x1="50" y1="3" x2="50" y2="8" transform="rotate(${a} 50 50)"/>`).join('') + '</g>';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${g}${body}</svg>`;
  }

  // ───── 낱말 퍼즐 ─────
  // trap: 헷갈리기 쉬운 글자 (맞춤법 연습용 오답 글자)
  const WORDS = [
    { w:'개나리', hint:'봄에 피는 노란 꽃', cat:'자연' },
    { w:'무지개', hint:'비가 그친 뒤 하늘에 뜨는 여러 빛깔의 띠', cat:'자연' },
    { w:'달팽이', hint:'등에 집을 지고 느릿느릿 기어가는 동물', cat:'자연' },
    { w:'코끼리', hint:'코가 길고 귀가 커다란 동물', cat:'자연' },
    { w:'거북이', hint:'딱딱한 등딱지가 있고 느리게 걷는 동물', cat:'자연' },
    { w:'다람쥐', hint:'도토리를 좋아하는 줄무늬 동물', cat:'자연' },
    { w:'고슴도치', hint:'몸에 뾰족한 가시가 잔뜩 난 작은 동물', cat:'자연' },
    { w:'해바라기', hint:'키가 크고 노란 꽃잎이 해를 닮은 꽃', cat:'자연' },
    { w:'눈사람', hint:'눈을 뭉쳐서 만든 사람', cat:'생활' },
    { w:'도서관', hint:'책을 읽거나 빌릴 수 있는 곳', cat:'마을' },
    { w:'소방관', hint:'불을 끄고 위험에 빠진 사람을 구하는 사람', cat:'마을' },
    { w:'우체국', hint:'편지나 소포를 보내는 곳', cat:'마을' },
    { w:'신호등', hint:'길을 건널 때 빨간불과 초록불을 보여 주는 것', cat:'마을' },
    { w:'놀이터', hint:'미끄럼틀과 그네가 있는 곳', cat:'마을' },
    { w:'냉장고', hint:'음식을 차갑게 보관하는 기계', cat:'생활' },
    { w:'지우개', hint:'연필로 쓴 글씨를 지우는 물건', cat:'생활' },
    { w:'색종이', hint:'접기 놀이를 할 때 쓰는 색깔 있는 종이', cat:'생활' },
    { w:'돋보기', hint:'작은 것을 크게 보이게 하는 렌즈', cat:'생활' },
    { w:'태극기', hint:'우리나라의 국기', cat:'세계' },
    { w:'한글', hint:'세종대왕이 만든 우리 글자', cat:'세계' },
    { w:'지구본', hint:'지구를 작고 둥글게 만든 모형', cat:'세계' },
    // 맞춤법
    { w:'설거지', hint:'밥을 먹은 뒤 그릇을 씻는 일', cat:'맞춤법', trap:['겆','이'] },
    { w:'깨끗이', hint:'방을 ○○○ 치웠어요.', cat:'맞춤법', trap:['히'] },
    { w:'오랜만', hint:'○○○에 할머니를 만났어요.', cat:'맞춤법', trap:['랫'] },
    { w:'며칠', hint:'오늘이 ○○이더라?', cat:'맞춤법', trap:['몇','일'] },
    { w:'어떡해', hint:'숙제를 집에 두고 왔어. ○○○!', cat:'맞춤법', trap:['떻'] },
    { w:'희망', hint:'앞으로 잘되기를 바라는 마음', cat:'맞춤법', trap:['히'] },
    // 우주
    { w:'수성', hint:'태양에 가장 가까운 행성', cat:'우주' },
    { w:'금성', hint:'태양계에서 가장 뜨거운 행성', cat:'우주' },
    { w:'지구', hint:'우리가 살고 있는 행성', cat:'우주' },
    { w:'화성', hint:'붉은색으로 보이는 행성', cat:'우주' },
    { w:'목성', hint:'태양계에서 가장 큰 행성', cat:'우주' },
    { w:'토성', hint:'크고 멋진 고리가 있는 행성', cat:'우주' },
    { w:'천왕성', hint:'옆으로 누운 채로 도는 행성', cat:'우주' },
    { w:'해왕성', hint:'태양에서 가장 먼 행성', cat:'우주' },
    { w:'우주선', hint:'사람이나 물건을 싣고 우주로 날아가는 탈것', cat:'우주' },
    { w:'별똥별', hint:'밤하늘에 빛줄기를 그으며 떨어지는 것', cat:'우주' },
    { w:'망원경', hint:'멀리 있는 별을 크게 보는 기구', cat:'우주' },
    { w:'우주비행사', hint:'우주선을 타고 우주에 가는 사람', cat:'우주' },
  ];
  // 낱말 글자 + 헷갈리는 글자 섞기. 오답 글자는 낱말에 없는 글자만 쓴다
  function wordTiles(item) {
    const chars = [...item.w];
    const extra = [];
    for (const t of item.trap || []) if (!chars.includes(t) && !extra.includes(t)) extra.push(t);
    const want = chars.length >= 5 ? 1 : 2; // 헷갈리는 글자가 이보다 적으면 다른 낱말 글자로 채운다
    for (const c of shuffle(WORDS.flatMap((x) => [...x.w]))) {
      if (extra.length >= want) break;
      if (!chars.includes(c) && !extra.includes(c)) extra.push(c);
    }
    return shuffle(chars.concat(extra));
  }

  // ───── 연산 스피드 ─────
  // 학년에 맞는 암산 문제 하나. 보기 4개, 모두 0 이상, 서로 다름
  function speedQ(grade) {
    const kinds = grade <= 2 ? ['add', 'sub', 'mul'] : ['add', 'sub', 'mul', 'div'];
    const k = P(kinds);
    let a, b, ans, q;
    if (k === 'add') {
      if (grade <= 2) { a = R(10, 89); b = R(2, 99 - a); } else { a = R(20, 99); b = R(11, 99); }
      ans = a + b; q = `${a} + ${b}`;
    } else if (k === 'sub') {
      if (grade <= 2) { a = R(20, 99); b = R(2, a - 1); } else { a = R(100, 199); b = R(11, 99); }
      ans = a - b; q = `${a} − ${b}`;
    } else if (k === 'mul') {
      a = R(2, 9); b = R(1, 9);
      if (grade >= 4 && Math.random() < 0.4) { a = R(11, 25); b = R(2, 5); }
      ans = a * b; q = `${a} × ${b}`;
    } else {
      b = R(2, 9); ans = R(1, 9); a = b * ans; q = `${a} ÷ ${b}`;
    }
    const cands = new Set();
    for (const d of shuffle([1, -1, 2, -2, 10, -10, 3, -3, 5, -5, 11, -9])) {
      const v = ans + d; if (v >= 0 && v !== ans) cands.add(v); if (cands.size === 3) break;
    }
    const choices = shuffle([ans, ...cands]);
    return { q, answer: choices.indexOf(ans), choices, value: ans, kind: k, a, b };
  }

  window.GameData = { PLANETS, planetSVG, WORDS, wordTiles, speedQ };
})();
