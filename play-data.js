// 놀이 데이터: 스티커 놀이판 배경, 색칠 도안, 그림 칭찬 문구, 행운 알 문구
// 색칠 도안은 360×360 좌표로 윤곽선만 그린다(선 레이어). 안쪽 색은 앱이 따로 칠한다.
(function(){
  'use strict';
  const TAU = Math.PI * 2;

  // ───── 스티커 놀이판 배경 ─────
  const BOARD_BG = [
    { id:'sky',   name:'하늘',   a:'#bfe6ff', b:'#eaf8ff' },
    { id:'space', name:'우주',   a:'#0d1b3e', b:'#2a1f4f', stars:true },
    { id:'grass', name:'풀밭',   a:'#d8f3e3', b:'#86d3a0' },
    { id:'pink',  name:'분홍',   a:'#ffe3ee', b:'#ffbfd8' },
    { id:'sun',   name:'노랑',   a:'#fff6c9', b:'#ffe08a' },
    { id:'sea',   name:'바다',   a:'#cdf3f7', b:'#6fc7d9' },
  ];
  // 우주 배경의 별 (놀이판 CSS·그림 파일 모두 같은 자리)
  const BOARD_STARS = [[8,10],[22,34],[36,8],[50,24],[64,12],[78,30],[90,10],[14,60],[44,52],[70,64],[88,56],[28,82],[58,90],[84,86],[10,92]];

  // ───── 색칠 도안 ─────
  // 모양마다 안쪽을 지우고 선을 그려서(shape) 겹친 부분의 선이 보이지 않게 한다
  function shape(c, fn){ c.save(); c.beginPath(); fn(c); c.globalCompositeOperation = 'destination-out'; c.fill(); c.globalCompositeOperation = 'source-over'; c.stroke(); c.restore(); }
  function line(c, pts){ c.beginPath(); c.moveTo(pts[0], pts[1]); for (let i = 2; i < pts.length; i += 2) c.lineTo(pts[i], pts[i + 1]); c.stroke(); }
  function heart(p, cx, cy, s){ p.moveTo(cx, cy + s * 0.9); p.bezierCurveTo(cx - s * 1.5, cy - s * 0.1, cx - s * 0.9, cy - s * 1.1, cx, cy - s * 0.4); p.bezierCurveTo(cx + s * 0.9, cy - s * 1.1, cx + s * 1.5, cy - s * 0.1, cx, cy + s * 0.9); p.closePath(); }
  function star(p, cx, cy, r){ for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; i ? p.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr) : p.moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } p.closePath(); }
  const circ = (c, x, y, r) => shape(c, (p) => p.arc(x, y, r, 0, TAU));
  const oval = (c, x, y, rx, ry, rot) => shape(c, (p) => p.ellipse(x, y, rx, ry, rot || 0, 0, TAU));

  const PAGES = [
    { id:'flower', name:'꽃', draw(c){
      shape(c, (p) => p.rect(172, 200, 16, 140));
      oval(c, 128, 285, 38, 16, -0.5); oval(c, 234, 255, 38, 16, 0.5);
      for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; oval(c, 180 + Math.cos(a) * 58, 150 + Math.sin(a) * 58, 40, 24, a); }
      circ(c, 180, 150, 30);
      line(c, [0, 340, 360, 340]);
    } },
    { id:'heart', name:'하트', draw(c){
      shape(c, (p) => heart(p, 180, 175, 120));
      shape(c, (p) => heart(p, 180, 175, 64));
      shape(c, (p) => star(p, 60, 60, 28)); shape(c, (p) => star(p, 305, 78, 24)); shape(c, (p) => star(p, 62, 305, 24)); shape(c, (p) => star(p, 304, 292, 30));
    } },
    { id:'house', name:'집', draw(c){
      shape(c, (p) => p.rect(232, 92, 28, 70));
      shape(c, (p) => p.rect(80, 170, 200, 150));
      shape(c, (p) => { p.moveTo(60, 172); p.lineTo(180, 72); p.lineTo(300, 172); p.closePath(); });
      shape(c, (p) => p.rect(160, 240, 50, 80)); circ(c, 200, 282, 4);
      for (const [x, y] of [[100, 200], [222, 200]]) for (const [dx, dy] of [[0, 0], [22, 0], [0, 22], [22, 22]]) shape(c, (p) => p.rect(x + dx, y + dy, 22, 22));
      circ(c, 50, 50, 24); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; line(c, [50 + Math.cos(a) * 32, 50 + Math.sin(a) * 32, 50 + Math.cos(a) * 44, 50 + Math.sin(a) * 44]); }
      shape(c, (p) => { p.moveTo(250, 120); p.bezierCurveTo(225, 120, 225, 92, 250, 94); p.bezierCurveTo(250, 67, 290, 67, 295, 90); p.bezierCurveTo(320, 82, 335, 112, 310, 120); p.closePath(); });
      line(c, [0, 320, 360, 320]);
    } },
    { id:'fish', name:'물고기', draw(c){
      shape(c, (p) => { p.moveTo(255, 180); p.lineTo(335, 115); p.lineTo(335, 245); p.closePath(); });
      shape(c, (p) => { p.moveTo(135, 135); p.lineTo(180, 88); p.lineTo(215, 135); p.closePath(); });
      oval(c, 170, 185, 108, 64);
      circ(c, 112, 168, 11); circ(c, 112, 168, 4);
      c.beginPath(); c.arc(80, 195, 16, 0.2, 1.3); c.stroke();
      for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(160 + i * 30, 188, 24, -1.2, 1.2); c.stroke(); }
      circ(c, 58, 100, 13); circ(c, 36, 66, 8); circ(c, 76, 56, 15);
      line(c, [0, 330, 40, 322, 80, 330, 120, 322, 160, 330, 200, 322, 240, 330, 280, 322, 320, 330, 360, 322]);
    } },
    { id:'acorn', name:'도토리', draw(c){
      shape(c, (p) => { p.moveTo(100, 160); p.bezierCurveTo(95, 290, 150, 330, 180, 335); p.bezierCurveTo(210, 330, 265, 290, 260, 160); p.quadraticCurveTo(180, 182, 100, 160); p.closePath(); });
      shape(c, (p) => p.rect(172, 58, 16, 36));
      shape(c, (p) => { p.moveTo(82, 158); p.bezierCurveTo(82, 72, 278, 72, 278, 158); p.quadraticCurveTo(180, 180, 82, 158); p.closePath(); });
      line(c, [120, 110, 140, 150]); line(c, [180, 95, 180, 160]); line(c, [240, 110, 220, 150]);
      oval(c, 275, 72, 42, 18, -0.6); line(c, [240, 90, 308, 54]);
      oval(c, 130, 300, 10, 18, 0.5);
      line(c, [0, 345, 360, 345]);
    } },
    { id:'butterfly', name:'나비', draw(c){
      oval(c, 128, 138, 72, 50, -0.55); oval(c, 232, 138, 72, 50, 0.55);
      oval(c, 140, 228, 52, 38, 0.45); oval(c, 220, 228, 52, 38, -0.45);
      circ(c, 118, 132, 20); circ(c, 242, 132, 20); circ(c, 144, 228, 14); circ(c, 216, 228, 14);
      oval(c, 180, 192, 14, 72);
      circ(c, 180, 110, 16);
      line(c, [174, 96, 150, 56]); line(c, [186, 96, 210, 56]); circ(c, 148, 52, 7); circ(c, 212, 52, 7);
    } },
    { id:'rocket', name:'로켓', draw(c){
      shape(c, (p) => { p.moveTo(140, 200); p.lineTo(90, 275); p.lineTo(140, 250); p.closePath(); });
      shape(c, (p) => { p.moveTo(220, 200); p.lineTo(270, 275); p.lineTo(220, 250); p.closePath(); });
      shape(c, (p) => { p.moveTo(152, 262); p.lineTo(180, 335); p.lineTo(208, 262); p.closePath(); });
      shape(c, (p) => { p.moveTo(180, 40); p.bezierCurveTo(240, 90, 240, 190, 225, 262); p.lineTo(135, 262); p.bezierCurveTo(120, 190, 120, 90, 180, 40); p.closePath(); });
      circ(c, 180, 132, 26); circ(c, 180, 132, 14);
      line(c, [128, 215, 232, 215]);
      shape(c, (p) => star(p, 56, 80, 16)); shape(c, (p) => star(p, 304, 100, 18)); shape(c, (p) => star(p, 306, 230, 13)); shape(c, (p) => star(p, 50, 190, 13));
      circ(c, 300, 305, 30); circ(c, 292, 298, 6); circ(c, 310, 316, 8);
    } },
    { id:'cupcake', name:'컵케이크', draw(c){
      oval(c, 180, 338, 120, 16);
      shape(c, (p) => { p.moveTo(110, 232); p.lineTo(250, 232); p.lineTo(232, 332); p.lineTo(128, 332); p.closePath(); });
      line(c, [150, 232, 156, 332]); line(c, [180, 232, 180, 332]); line(c, [210, 232, 204, 332]);
      oval(c, 180, 215, 92, 30); oval(c, 180, 174, 70, 30); oval(c, 180, 136, 44, 26);
      circ(c, 180, 100, 16); c.beginPath(); c.moveTo(184, 86); c.quadraticCurveTo(196, 60, 214, 56); c.stroke();
      circ(c, 140, 196, 5); circ(c, 220, 200, 5); circ(c, 168, 170, 5); circ(c, 206, 150, 5);
    } },
  ];

  // 알록달록 팔레트 (색 이름은 스크린리더·버튼 설명용)
  const PALETTE = [
    ['#e64a4a','빨강'], ['#ff8a3d','주황'], ['#ffd23f','노랑'], ['#8fd14f','연두'], ['#2fb36b','초록'], ['#3fc1c9','하늘'],
    ['#3d7be0','파랑'], ['#8a5fd0','보라'], ['#ff7eb6','분홍'], ['#c68642','갈색'], ['#2b2b2b','검정'], ['#ffffff','흰색'],
  ];

  // 그림을 저장했을 때 척척이가 하는 말
  const PRAISE = [
    '와, 색을 정말 예쁘게 골랐어요!', '우아, 멋진 그림이에요! 척척이가 벽에 걸어 놓고 싶어요.', '그림 속에서 이야기가 들리는 것 같아요!',
    '색깔이 알록달록 신나요! 다음엔 어떤 그림을 그릴까요?', '정성스럽게 칠했네요. 보는 사람도 기분이 좋아져요!',
  ];
  // 행운 알에서 나오는 간식 문구
  const SNACKS = ['달콤한 해바라기씨', '고소한 도토리', '바삭한 밤', '동글동글 잣'];

  window.PlayData = { BOARD_BG, BOARD_STARS, PAGES, PALETTE, PRAISE, SNACKS };
})();
