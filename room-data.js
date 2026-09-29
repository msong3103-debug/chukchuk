/* 방꾸미기 데이터 — 가구, 벽지, 바닥
   window.RoomData = { THEMES, ITEMS, WALLS, FLOORS, patternCSS }
   가구: { id, cat, theme, name, price, w(방 너비 대비 %), y(처음 놓는 높이 %), layer:'rug'|'floor'|'wall', src? }
   종류(cat)마다 우주·숲속·파스텔 3가지를 두어 아이가 골라 쓰게 한다.
   그림은 테마별 시트(3×3, CATS 순서)를 잘라 img/room/{id}.webp 로 둔다.
   벽지·바닥 무늬는 그림 없이 코드로 그린다(화면은 CSS, 방 사진은 캔버스). */
(function () {
  const THEMES = [
    { id:'space',  name:'우주' },
    { id:'forest', name:'숲속' },
    { id:'pastel', name:'파스텔' },
  ];
  // 가구 종류: 시트 칸 순서와 같다. w·y·layer는 종류별 기본값
  const CATS = [
    { id:'bed',     name:'침대',      price:200, w:46, y:72, layer:'floor' },
    { id:'chair',   name:'의자',      price:120, w:26, y:78, layer:'floor' },
    { id:'table',   name:'탁자·책상', price:150, w:28, y:74, layer:'floor' },
    { id:'rug',     name:'러그',      price:100, w:48, y:87, layer:'rug' },
    { id:'lamp',    name:'조명',      price:80,  w:16, y:70, layer:'floor' },
    { id:'wallart', name:'벽 장식',   price:80,  w:22, y:28, layer:'wall' },
    { id:'window',  name:'창문',      price:120, w:30, y:26, layer:'wall' },
    { id:'storage', name:'수납장',    price:150, w:28, y:62, layer:'floor' },
    { id:'deco',    name:'소품',      price:50,  w:16, y:74, layer:'floor' },
    { id:'special', name:'특별',      price:0,   w:30, y:72, layer:'floor' },
  ];
  const NAMES = {
    space:  ['로켓 침대','은하수 빈백','지구본 책상','별 러그','달 무드등','토성 포스터','별이 보이는 둥근 창','행성 선반','우주 헬멧'],
    forest: ['나무 침대','도토리 의자','그루터기 탁자','동그란 짚 러그','버섯 램프','나뭇잎 액자','나뭇가지 창문','나무 책장','화분'],
    pastel: ['하트 캐노피 침대','구름 소파','딸기 케이크 탁자','무지개 러그','튤립 램프','하트 거울','커튼 달린 아치 창','파스텔 서랍장','풍선'],
  };
  const ITEMS = [];
  for (const t of THEMES) CATS.slice(0, 9).forEach((c, i) => ITEMS.push({ id:`${t.id}-${c.id}`, cat:c.id, theme:t.id, name:NAMES[t.id][i], price:c.price, w:c.w, y:c.y, layer:c.layer }));
  // 특별 가구: 예전 펫 가게에서 팔던 것 (산 적이 있으면 그대로 가져온다)
  ITEMS.push({ id:'house', cat:'special', theme:'forest', name:'통나무 집',   price:200, w:32, y:70, layer:'floor', src:'img/item/house.webp' });
  ITEMS.push({ id:'leaf',  cat:'special', theme:'forest', name:'나뭇잎 이불', price:100, w:40, y:88, layer:'rug',   src:'img/item/leaf.webp' });
  // 무늬 종류: vstripe(세로 줄) hstripe(가로 줄) dots(물방울) stars(별 밤) checker(체크)
  const WALLS = [
    { id:'mint',  name:'민트 줄무늬',     price:0,  base:'#e7f3ee', kind:'vstripe', c2:'#d6ebe1', size:22 },
    { id:'night', name:'별 밤하늘',       price:80, base:'#1d2350', kind:'stars',   c2:'#ffffff', c3:'#ffd54a', size:34 },
    { id:'sky',   name:'하늘 구름',       price:80, base:'#cfe8ff', kind:'dots',    c2:'#ffffff', size:56, r:0.32 },
    { id:'wood',  name:'통나무 벽',       price:80, base:'#d9b48a', kind:'vstripe', c2:'#c79f73', size:40 },
    { id:'candy', name:'딸기우유 물방울', price:60, base:'#fff0f6', kind:'dots',    c2:'#ffc6dd', size:30, r:0.25 },
  ];
  const FLOORS = [
    { id:'wood',   name:'나무 마루', price:0,  base:'#c99a6b', kind:'hstripe', c2:'#b8875a', size:20 },
    { id:'carpet', name:'보라 카펫', price:60, base:'#d9c9f2', kind:'dots',    c2:'#c9b5ec', size:16, r:0.2 },
    { id:'check',  name:'체크 타일', price:60, base:'#ffffff', kind:'checker', c2:'#bfe3ef', size:40 },
    { id:'grass',  name:'잔디밭',    price:60, base:'#8fd18a', kind:'vstripe', c2:'#82c47d', size:8 },
    { id:'moon',   name:'달 표면',   price:60, base:'#b9b4ad', kind:'dots',    c2:'#a39d95', size:36, r:0.3 },
  ];
  function patternCSS(p) {
    const s = p.size;
    if (p.kind === 'vstripe') return `repeating-linear-gradient(90deg,${p.base} 0 ${s}px,${p.c2} ${s}px ${s * 2}px)`;
    if (p.kind === 'hstripe') return `repeating-linear-gradient(0deg,${p.base} 0 ${s}px,${p.c2} ${s}px ${s + 2}px)`;
    if (p.kind === 'dots') return `radial-gradient(circle,${p.c2} ${p.r * 100}%,transparent ${p.r * 100 + 1}%) 0 0/${s}px ${s}px,${p.base}`;
    if (p.kind === 'stars') return `radial-gradient(circle,${p.c2} 1.5px,transparent 2px) 0 0/${s}px ${s}px,radial-gradient(circle,${p.c3} 2px,transparent 2.5px) ${s / 2}px ${s / 2}px/${s}px ${s}px,${p.base}`;
    if (p.kind === 'checker') return `conic-gradient(${p.base} 25%,${p.c2} 0 50%,${p.base} 0 75%,${p.c2} 0) 0 0/${s}px ${s}px`;
    return p.base;
  }
  const itemSrc = (it) => it.src || `img/room/${it.id}.webp`;

  window.RoomData = { THEMES, CATS, ITEMS, WALLS, FLOORS, patternCSS, itemSrc };
})();
