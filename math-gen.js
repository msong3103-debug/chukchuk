/* 수학 문제 자동생성기 — 2022 개정 교육과정 기준
   학기 키: g2s1(2-1 복습), g2s2(2-2). 3~4학년은 같은 형식으로 추가하면 됩니다.
   문제 형식: {q, html?, type:'num'|'mc', answer, choices?, explain, unit, diff} */
(function () {
  const R = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  const P = (a) => a[Math.floor(Math.random() * a.length)];
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  function mc(correct, pool, n = 4) {
    const c = String(correct);
    const picks = [];
    for (const p of shuffle(pool.map(String))) {
      if (p !== c && !picks.includes(p)) picks.push(p);
      if (picks.length === n - 1) break;
    }
    if (picks.length < n - 1) throw new Error('not enough distractors');
    const choices = shuffle([c, ...picks]);
    return { type: 'mc', choices, answer: choices.indexOf(c) };
  }
  const num = (n) => ({ type: 'num', answer: n });

  // 수 읽기: 3052 → 삼천오십이
  const KD = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
  function toKor(n) {
    if (n === 0) return '영';
    const units = ['', '십', '백', '천'];
    const s = String(n); let out = '';
    for (let i = 0; i < s.length; i++) {
      const d = +s[i], u = units[s.length - 1 - i];
      if (d === 0) continue;
      out += (d === 1 && u) ? u : KD[d] + u;
    }
    return out;
  }
  const lenFmt = (cm) => { const m = Math.floor(cm / 100), r = cm % 100; if (!m) return `${r} cm`; if (!r) return `${m} m`; return `${m} m ${r} cm`; };
  const timeFmt = (h, m) => (m === 0 ? `${h}시` : `${h}시 ${m}분`);
  const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

  function clockSVG(h, m) {
    const hourA = ((h % 12) * 30 + m * 0.5) * Math.PI / 180;
    const minA = (m * 6) * Math.PI / 180;
    let ticks = '', nums = '';
    for (let i = 0; i < 60; i++) {
      const a = i * 6 * Math.PI / 180, r1 = i % 5 === 0 ? 80 : 85;
      ticks += `<line x1="${100 + r1 * Math.sin(a)}" y1="${100 - r1 * Math.cos(a)}" x2="${100 + 90 * Math.sin(a)}" y2="${100 - 90 * Math.cos(a)}" stroke="#555" stroke-width="${i % 5 === 0 ? 2.5 : 1}"/>`;
    }
    for (let i = 1; i <= 12; i++) {
      const a = i * 30 * Math.PI / 180;
      nums += `<text x="${100 + 67 * Math.sin(a)}" y="${100 - 67 * Math.cos(a) + 7}" text-anchor="middle" font-size="19" font-weight="700" fill="#333">${i}</text>`;
    }
    return `<svg class="clock" viewBox="0 0 200 200" width="180" height="180"><circle cx="100" cy="100" r="95" fill="#fffdf5" stroke="#f0a030" stroke-width="6"/>${ticks}${nums}
      <line x1="100" y1="100" x2="${100 + 45 * Math.sin(hourA)}" y2="${100 - 45 * Math.cos(hourA)}" stroke="#e05050" stroke-width="7" stroke-linecap="round"/>
      <line x1="100" y1="100" x2="${100 + 72 * Math.sin(minA)}" y2="${100 - 72 * Math.cos(minA)}" stroke="#3060c0" stroke-width="4" stroke-linecap="round"/>
      <circle cx="100" cy="100" r="6" fill="#333"/></svg><div class="clock-legend"><span style="color:#e05050">■ 짧은바늘(시)</span> <span style="color:#3060c0">■ 긴바늘(분)</span></div>`;
  }

  // ───────────── 2학년 2학기 ─────────────
  const u4digit = {
    id: 'g2s2-4digit', name: '네 자리 수',
    1: () => {
      if (Math.random() < 0.6) {
        const a = R(1, 9), b = R(0, 9), c = R(0, 9), d = R(0, 9);
        const n = a * 1000 + b * 100 + c * 10 + d;
        return { q: `1000이 ${a}개, 100이 ${b}개, 10이 ${c}개, 1이 ${d}개인 수는 얼마일까요?`, ...num(n), explain: `천의 자리 ${a}, 백의 자리 ${b}, 십의 자리 ${c}, 일의 자리 ${d} → ${n}` };
      }
      const t = P([['1000은 100이 몇 개인 수일까요?', 10, '100이 10개면 1000이에요.'], ['1000은 10이 몇 개인 수일까요?', 100, '10이 100개면 1000이에요.'], ['1000은 900보다 얼마나 큰 수일까요?', 100, '900 + 100 = 1000'], ['1000은 999보다 얼마나 큰 수일까요?', 1, '999 + 1 = 1000'], ['1000은 990보다 얼마나 큰 수일까요?', 10, '990 + 10 = 1000']]);
      return { q: t[0], ...num(t[1]), explain: t[2] };
    },
    2: () => {
      const v = R(0, 2);
      if (v === 0) {
        const ds = [R(1, 9), R(0, 9), R(0, 9), R(0, 9)]; ds[R(1, 3)] = 0;
        const n = +ds.join('');
        const s = String(n);
        const pool = [s[0] + s[2] + s[1] + s[3], s[0] + s[1] + s[3] + s[2], s.slice(1), s[0] + s[3] + s[2] + s[1], String(n + 1000 <= 9999 ? n + 1000 : n - 1000), s[0] + s[1] + s[2]]
          .map(Number).filter((x) => x !== n && x > 0).map(toKor);
        return { q: `${n}을(를) 바르게 읽은 것은?`, ...mc(toKor(n), pool), explain: `${n} → ${toKor(n)}. 0인 자리는 읽지 않아요.` };
      }
      if (v === 1) {
        const a = R(1000, 9998); let b;
        do { const s = String(a).split(''); const i = R(1, 3); s[i] = String(R(0, 9)); b = +s.join(''); } while (b === a);
        const sign = a > b ? '>' : '<';
        return { q: `두 수의 크기를 비교해요. ${a} ○ ${b}`, type: 'mc', choices: ['>', '<'], answer: sign === '>' ? 0 : 1, explain: `높은 자리부터 차례로 비교해요. ${a} ${sign} ${b}` };
      }
      let n, pos, d;
      do { n = R(1000, 9999); pos = R(0, 3); d = +String(n)[pos]; } while (d === 0 || String(n).split('').filter((x) => +x === d).length > 1);
      const val = d * 10 ** (3 - pos);
      return { q: `${n}에서 숫자 ${d}이(가) 나타내는 값은 얼마일까요?`, ...mc(val, [d * 1000, d * 100, d * 10, d]), explain: `${d}은(는) ${['천', '백', '십', '일'][pos]}의 자리 숫자라서 ${val}을 나타내요.` };
    },
    3: () => {
      const v = R(0, 2);
      if (v === 0) {
        const step = P([1, 10, 100, 1000]), k = R(2, 4);
        const start = step === 1000 ? R(1000, 9999 - step * k) : R(1000, 9000);
        const ans = start + step * k;
        return { q: `${start}에서 ${step}씩 ${k}번 뛰어 센 수는 얼마일까요?`, ...num(ans), explain: `${[start, ...Array.from({ length: k }, (_, i) => start + step * (i + 1))].join(' → ')}` };
      }
      if (v === 1) {
        const base = R(2, 8) * 1000 + R(0, 9) * 100;
        const set = new Set(); while (set.size < 4) set.add(base + R(0, 99));
        const arr = [...set]; const max = Math.max(...arr);
        return { q: '가장 큰 수는 어느 것일까요?', type: 'mc', choices: arr.map(String), answer: arr.indexOf(max), explain: `천·백의 자리가 같으면 십의 자리, 일의 자리 순서로 비교해요. 가장 큰 수는 ${max}.` };
      }
      const digs = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4);
      const big = Math.random() < 0.5;
      let ans;
      if (big) ans = +digs.slice().sort((a, b) => b - a).join('');
      else { const s = digs.slice().sort((a, b) => a - b); if (s[0] === 0) { const i = s.findIndex((x) => x > 0); [s[0], s[i]] = [s[i], s[0]]; } ans = +s.join(''); }
      return { q: `숫자 카드 [${digs.join('] [')}]를 한 번씩만 사용해서 만들 수 있는 가장 ${big ? '큰' : '작은'} 네 자리 수는?`, ...num(ans), explain: big ? '큰 숫자부터 높은 자리에 놓아요.' : '작은 숫자부터 높은 자리에 놓되, 0은 맨 앞에 올 수 없어요.' + ` → ${ans}` };
    }
  };

  const wordMul = [
    (a, b) => [`한 봉지에 사탕이 ${a}개씩 들어 있어요. ${b}봉지에는 사탕이 모두 몇 개일까요?`, a * b],
    (a, b) => [`의자 한 줄에 ${a}명씩 ${b}줄로 앉았어요. 모두 몇 명일까요?`, a * b],
    (a, b) => [`꽃병 ${b}개에 꽃을 ${a}송이씩 꽂았어요. 꽃은 모두 몇 송이일까요?`, a * b],
    (a, b) => [`문어 한 마리의 다리는 8개예요. 문어 ${b}마리의 다리는 모두 몇 개일까요?`, 8 * b],
    (a, b) => [`세발자전거 ${b}대의 바퀴는 모두 몇 개일까요?`, 3 * b],
    (a, b) => [`강아지 ${b}마리의 다리는 모두 몇 개일까요?`, 4 * b],
  ];
  const uMul = {
    id: 'g2s2-mul', name: '곱셈구구',
    1: () => { const a = P([2, 5, 3, 4]), b = R(1, 9); return { q: `${a} × ${b} = ?`, ...num(a * b), explain: `${a}단: ${a}씩 ${b}번 → ${a * b}` }; },
    2: () => {
      if (Math.random() < 0.2) { const z = P([0, 1]), b = R(2, 9); const [x, y] = Math.random() < 0.5 ? [z, b] : [b, z]; return { q: `${x} × ${y} = ?`, ...num(x * y), explain: z === 0 ? '0에 어떤 수를 곱하거나 어떤 수에 0을 곱하면 0이에요.' : '1과 어떤 수의 곱은 항상 그 수예요.' }; }
      const a = R(6, 9), b = R(2, 9); return { q: `${a} × ${b} = ?`, ...num(a * b), explain: `${a}단: ${a}씩 ${b}번 → ${a * b}` };
    },
    3: () => {
      const v = R(0, 2);
      if (v === 0) { const a = R(2, 9), b = R(2, 9); return { q: `${a} × □ = ${a * b}  □에 알맞은 수는?`, ...num(b), explain: `${a}단에서 ${a * b}가 나오는 곳을 찾아요. ${a} × ${b} = ${a * b}` }; }
      if (v === 1) { const a = R(2, 9), b = R(2, 9); const [q, ans] = P(wordMul)(a, b); return { q, ...num(ans), explain: `곱셈식으로 나타내면 답은 ${ans}이에요.` }; }
      const exps = new Map(); while (exps.size < 4) { const a = R(2, 9), b = R(2, 9); const k = a * b; if (![...exps.values()].includes(k)) exps.set(`${a} × ${b}`, k); }
      const keys = [...exps.keys()]; const maxK = keys.reduce((m, k) => (exps.get(k) > exps.get(m) ? k : m));
      return { q: '곱이 가장 큰 것은 어느 것일까요?', type: 'mc', choices: keys, answer: keys.indexOf(maxK), explain: keys.map((k) => `${k} = ${exps.get(k)}`).join(', ') };
    }
  };

  const uLen = {
    id: 'g2s2-len', name: '길이 재기',
    1: () => {
      const v = R(0, 2);
      if (v === 0) { const a = R(1, 9); return { q: `${a} m는 몇 cm일까요?`, ...num(a * 100), explain: `1 m = 100 cm 이므로 ${a} m = ${a * 100} cm` }; }
      if (v === 1) { const a = R(2, 9); return { q: `${a * 100} cm는 몇 m일까요?`, ...num(a), explain: `100 cm = 1 m 이므로 ${a * 100} cm = ${a} m` }; }
      const a = R(1, 5), b = R(10, 99); return { q: `${a} m ${b} cm는 몇 cm일까요?`, ...num(a * 100 + b), explain: `${a} m = ${a * 100} cm, ${a * 100} + ${b} = ${a * 100 + b} cm` };
    },
    2: () => {
      if (Math.random() < 0.5) {
        const n = R(101, 999); if (n % 100 === 0) return uLen[2]();
        const pool = [n + 100, n - 100, n + 10, n - 10, n + 1].filter((x) => x > 100 && x % 100).map(lenFmt).concat([`${Math.floor(n / 10)} m ${n % 10} cm`]);
        return { q: `${n} cm는 몇 m 몇 cm일까요?`, ...mc(lenFmt(n), pool), explain: `100 cm = 1 m 이므로 ${n} cm = ${lenFmt(n)}` };
      }
      const a = R(1, 4), b = R(10, 50), c = R(1, 4), d = R(10, 49);
      const t = (a + c) * 100 + b + d;
      return { q: `${a} m ${b} cm + ${c} m ${d} cm = ?`, ...mc(lenFmt(t), [t + 100, t - 100, t + 10, t - 10, t + 1].map(lenFmt)), explain: `m는 m끼리 (${a}+${c}=${a + c}), cm는 cm끼리 (${b}+${d}=${b + d}) 더해요.` };
    },
    3: () => {
      const v = R(0, 2);
      if (v === 0) {
        const a = R(3, 9), c = R(1, a - 1), d = R(10, 60), b = R(d, 95);
        const t = (a - c) * 100 + (b - d);
        return { q: `${a} m ${b} cm − ${c} m ${d} cm = ?`, ...mc(lenFmt(t), [t + 100, t - 100, t + 10, t - 10, t + 1].filter((x) => x > 0).map(lenFmt)), explain: `m는 m끼리 (${a}−${c}), cm는 cm끼리 (${b}−${d}) 빼요.` };
      }
      if (v === 1) {
        const a = R(1, 4), b = R(50, 90), d = R(100 - b + 1, 60);
        const t = a * 100 + b + d;
        return { q: `${a} m ${b} cm + ${d} cm = ?`, ...mc(lenFmt(t), [t - 100, t + 100, t + 10, t - 10, a * 100 + b + d - 100 + 10].filter((x) => x !== t).map(lenFmt).concat([`${a} m ${b + d} cm`])), explain: `cm끼리 더하면 ${b + d} cm → 100 cm는 1 m로 올려요. 답: ${lenFmt(t)}` };
      }
      const base = R(2, 5) * 100; const set = new Set(); while (set.size < 4) set.add(base + R(0, 99));
      const arr = [...set]; const max = Math.max(...arr);
      const labels = arr.map((x) => (Math.random() < 0.5 ? `${x} cm` : lenFmt(x)));
      return { q: '가장 긴 길이는 어느 것일까요?', type: 'mc', choices: labels, answer: arr.indexOf(max), explain: `모두 cm로 바꾸어 비교해요: ${arr.map((x) => x + ' cm').join(', ')}` };
    }
  };

  const uTime = {
    id: 'g2s2-time', name: '시각과 시간',
    1: () => {
      const h = R(1, 12), m = R(0, 11) * 5;
      const c = timeFmt(h, m);
      const pool = [timeFmt(h % 12 + 1, m), timeFmt(h === 1 ? 12 : h - 1, m), timeFmt(h, (m + 30) % 60), timeFmt(h, (m + 5) % 60)];
      if (m >= 5) pool.push(`${h}시 ${m / 5}분`);
      return { q: '시계가 나타내는 시각은 몇 시 몇 분일까요?', html: clockSVG(h, m), ...mc(c, pool), explain: `짧은바늘이 ${h}와 ${h % 12 + 1} 사이(또는 ${h}), 긴바늘이 ${m / 5 || 12}을(를) 가리키면 ${c}. 긴바늘의 숫자 1칸은 5분이에요.` };
    },
    2: () => {
      if (Math.random() < 0.55) {
        const h = R(1, 12); let m; do { m = R(1, 59); } while (m % 5 === 0);
        const c = timeFmt(h, m);
        const pool = [timeFmt(h, m + 1 > 59 ? m - 2 : m + 1), timeFmt(h, m - 1 < 1 ? m + 2 : m - 1), timeFmt(h, (m + 5) % 60 || 5), timeFmt(h % 12 + 1, m), timeFmt(h === 1 ? 12 : h - 1, m)];
        return { q: '시계가 나타내는 시각은 몇 시 몇 분일까요?', html: clockSVG(h, m), ...mc(c, pool), explain: `긴바늘이 작은 눈금으로 ${m}번째를 가리켜요 → ${c}` };
      }
      const v = R(0, 2);
      if (v === 0) { const hh = R(1, 3), mm = R(1, 5) * 10; return { q: `${hh}시간 ${mm}분은 몇 분일까요?`, ...num(hh * 60 + mm), explain: `1시간 = 60분 → ${hh * 60} + ${mm} = ${hh * 60 + mm}분` }; }
      if (v === 1) { const t = R(7, 17) * 10; if (t % 60 === 0) return uTime[2](); const c = `${Math.floor(t / 60)}시간 ${t % 60}분`; return { q: `${t}분은 몇 시간 몇 분일까요?`, ...mc(c, [`${Math.floor(t / 60) + 1}시간 ${t % 60}분`, `${Math.floor(t / 100)}시간 ${t % 100}분`, `${Math.floor(t / 60)}시간 ${(t % 60) + 10}분`, `${Math.floor(t / 60) - 1 || 3}시간 ${t % 60}분`]), explain: `60분 = 1시간. ${t}분 = ${c}` }; }
      const t = P([['1시간은 몇 분일까요?', 60], ['하루는 몇 시간일까요?', 24], ['1주일은 며칠일까요?', 7], ['1년은 몇 개월일까요?', 12], ['2주일은 며칠일까요?', 14], ['2시간은 몇 분일까요?', 120]]);
      return { q: t[0], ...num(t[1]), explain: '1시간 = 60분, 하루 = 24시간, 1주일 = 7일, 1년 = 12개월' };
    },
    3: () => {
      const v = R(0, 3);
      if (v === 0) {
        const h = R(1, 10), m = R(0, 11) * 5, k = R(2, 18) * 5;
        const tot = h * 60 + m + k; const nh = Math.floor(tot / 60), nm = tot % 60;
        const c = timeFmt(nh, nm);
        return { q: `지금은 ${timeFmt(h, m)}이에요. ${k}분 후는 몇 시 몇 분일까요?`, ...mc(c, [timeFmt(nh + 1, nm), timeFmt(nh, (nm + 10) % 60), timeFmt(nh - 1 || 12, nm), timeFmt(h, (m + k) % 100 < 60 ? (m + k) % 100 : nm + 5)]), explain: `60분이 넘으면 1시간이 늘어나요. → ${c}` };
      }
      if (v === 1) { const s = R(7, 11), e = R(1, 6); return { q: `오전 ${s}시부터 오후 ${e}시까지는 몇 시간일까요?`, ...num(12 - s + e), explain: `오전 ${s}시→낮 12시: ${12 - s}시간, 낮 12시→오후 ${e}시: ${e}시간. 합: ${12 - s + e}시간` }; }
      if (v === 2) {
        const d = R(1, 20), w = R(0, 6), k = R(1, 6);
        const c = DAYS[(w + k) % 7] + '요일';
        return { q: `어느 달 ${d}일이 ${DAYS[w]}요일이에요. 같은 달 ${d + k}일은 무슨 요일일까요?`, ...mc(c, DAYS.map((x) => x + '요일')), explain: `${d}일에서 ${k}일 뒤이므로 ${DAYS[w]}요일에서 ${k}칸 넘겨요 → ${c}` };
      }
      const mo = P([[1, 31], [3, 31], [4, 30], [5, 31], [6, 30], [7, 31], [8, 31], [9, 30], [10, 31], [11, 30], [12, 31]]);
      return { q: `${mo[0]}월은 며칠까지 있을까요?`, ...mc(mo[1] + '일', ['28일', '29일', '30일', '31일']), explain: '31일: 1·3·5·7·8·10·12월, 30일: 4·6·9·11월, 2월은 28일 또는 29일' };
    }
  };

  const THEMES = [
    ['좋아하는 과일', ['사과', '포도', '딸기', '바나나', '귤'], '명'],
    ['좋아하는 동물', ['강아지', '고양이', '토끼', '햄스터', '거북'], '명'],
    ['좋아하는 운동', ['축구', '줄넘기', '수영', '피구', '달리기'], '명'],
    ['좋아하는 계절', ['봄', '여름', '가을', '겨울'], '명'],
  ];
  function makeData(uniqueExtremes) {
    for (let t = 0; t < 50; t++) {
      const th = P(THEMES); const names = shuffle(th[1]).slice(0, 4); const vals = names.map(() => R(1, 8));
      const mx = Math.max(...vals), mn = Math.min(...vals);
      if (!uniqueExtremes || (vals.filter((v) => v === mx).length === 1 && vals.filter((v) => v === mn).length === 1)) return { th, names, vals };
    }
    return makeData(false);
  }
  const tableHTML = (d) => `<table class="qtable"><caption>${d.th[0]}별 학생 수</caption><tr><th>${d.th[0].replace('좋아하는 ', '')}</th>${d.names.map((n) => `<td>${n}</td>`).join('')}<td><b>합계</b></td></tr><tr><th>학생 수(명)</th>${d.vals.map((v) => `<td>${v}</td>`).join('')}<td>?</td></tr></table>`;
  const graphHTML = (d) => `<div class="qgraph"><div class="gcap">${d.th[0]}별 학생 수</div>${d.names.map((n, i) => `<div class="grow"><span class="glab">${n}</span><span class="gdots">${'○'.repeat(d.vals[i])}</span></div>`).join('')}</div>`;
  const uGraph = {
    id: 'g2s2-graph', name: '표와 그래프',
    1: () => { const d = makeData(false); const i = R(0, 3); return { q: `${d.names[i]}을(를) 좋아하는 학생은 몇 명일까요?`, html: Math.random() < 0.5 ? tableHTML(d) : graphHTML(d), ...num(d.vals[i]), explain: `${d.names[i]} 칸을 찾아 읽으면 ${d.vals[i]}명.` }; },
    2: () => {
      if (Math.random() < 0.5) { const d = makeData(false); const s = d.vals.reduce((a, b) => a + b, 0); return { q: '조사한 학생은 모두 몇 명일까요?', html: tableHTML(d), ...num(s), explain: `${d.vals.join(' + ')} = ${s}` }; }
      const d = makeData(true); const i = d.vals.indexOf(Math.max(...d.vals));
      return { q: `가장 많은 학생이 좋아하는 것은 무엇일까요?`, html: graphHTML(d), type: 'mc', choices: d.names, answer: i, explain: '○가 가장 많은 것을 찾아요.' };
    },
    3: () => {
      const d = makeData(true); const mx = Math.max(...d.vals), mn = Math.min(...d.vals);
      if (Math.random() < 0.5) return { q: '가장 많은 학생이 좋아하는 것과 가장 적은 학생이 좋아하는 것은 몇 명 차이일까요?', html: Math.random() < 0.5 ? tableHTML(d) : graphHTML(d), ...num(mx - mn), explain: `${mx} − ${mn} = ${mx - mn}명` };
      const s = d.vals.reduce((a, b) => a + b, 0); const hide = R(0, 3);
      const shown = { ...d, vals: d.vals.slice() };
      const html = `<table class="qtable"><caption>${d.th[0]}별 학생 수</caption><tr><th>${d.th[0].replace('좋아하는 ', '')}</th>${d.names.map((n) => `<td>${n}</td>`).join('')}<td><b>합계</b></td></tr><tr><th>학생 수(명)</th>${shown.vals.map((v, i) => `<td>${i === hide ? '□' : v}</td>`).join('')}<td>${s}</td></tr></table>`;
      return { q: `표를 보고 □에 알맞은 수를 구해요.`, html, ...num(d.vals[hide]), explain: `합계 ${s}에서 나머지를 빼요 → ${d.vals[hide]}` };
    }
  };

  const SHAPES = ['🔴', '🔵', '🟡', '🟢', '⭐', '🔺'];
  const uPattern = {
    id: 'g2s2-pattern', name: '규칙 찾기',
    1: () => { const d = P([1, 2, 5, 10]), s = R(1, 50); const seq = Array.from({ length: 5 }, (_, i) => s + d * i); return { q: `규칙에 따라 빈칸에 알맞은 수는?\n${seq.slice(0, 4).join(', ')}, □`, ...num(seq[4]), explain: `${d}씩 커지는 규칙이에요.` }; },
    2: () => {
      const d = P([3, 4, 6, 7, 9, 100]) * (Math.random() < 0.4 ? -1 : 1);
      const s = d < 0 ? R(60, 99) : R(1, 40); const seq = Array.from({ length: 6 }, (_, i) => s + d * i);
      if (seq.some((x) => x < 0)) return uPattern[2]();
      const hide = R(2, 4);
      return { q: `규칙에 따라 □에 알맞은 수는?\n${seq.map((x, i) => (i === hide ? '□' : x)).join(', ')}`, ...num(seq[hide]), explain: `${Math.abs(d)}씩 ${d > 0 ? '커지는' : '작아지는'} 규칙이에요.` };
    },
    3: () => {
      const v = R(0, 2);
      if (v === 0) {
        const kinds = shuffle(SHAPES).slice(0, 3); const pat = P([[0, 1], [0, 0, 1], [0, 1, 1], [0, 1, 2], [0, 1, 2, 1]]);
        const L = pat.length * 2 + R(0, pat.length - 1); const seq = Array.from({ length: L + 1 }, (_, i) => kinds[pat[i % pat.length]]);
        const used = [...new Set(pat.map((x) => kinds[x]))]; const choices = shuffle([...new Set([...used, ...kinds, P(SHAPES.filter((s) => !kinds.includes(s)))])]).slice(0, 4);
        if (!choices.includes(seq[L])) choices[0] = seq[L];
        return { q: `규칙에 따라 다음에 올 모양은?\n${seq.slice(0, L).join(' ')} □`, type: 'mc', choices, answer: choices.indexOf(seq[L]), explain: `${pat.map((x) => kinds[x]).join(' ')} 가 반복돼요.` };
      }
      if (v === 1) { const s = R(1, 5), inc = R(1, 2); const seq = [s]; for (let i = 1; i < 6; i++) seq.push(seq[i - 1] + inc * i); return { q: `규칙을 찾아 □에 알맞은 수를 구해요.\n${seq.slice(0, 5).join(', ')}, □`, ...num(seq[5]), explain: `커지는 수가 ${inc}, ${inc * 2}, ${inc * 3}… 처럼 ${inc}씩 늘어나요.` }; }
      const a = R(2, 9); return { q: `곱셈표에서 ${a}단의 곱은 몇씩 커질까요?`, ...num(a), explain: `${a}×1=${a}, ${a}×2=${a * 2}, … ${a}씩 커져요.` };
    }
  };

  // ───────────── 2학년 1학기 복습 ─────────────
  const u3digit = {
    id: 'g2s1-3digit', name: '세 자리 수 (복습)',
    1: () => { const a = R(1, 9), b = R(0, 9), c = R(0, 9); const n = a * 100 + b * 10 + c; return { q: `100이 ${a}개, 10이 ${b}개, 1이 ${c}개인 수는?`, ...num(n), explain: `→ ${n}` }; },
    2: () => { let n, pos, d; do { n = R(100, 999); pos = R(0, 2); d = +String(n)[pos]; } while (d === 0 || String(n).split('').filter((x) => +x === d).length > 1); const val = d * 10 ** (2 - pos); return { q: `${n}에서 숫자 ${d}이(가) 나타내는 값은?`, ...mc(val, [d * 100, d * 10, d, d * 1000]), explain: `${['백', '십', '일'][pos]}의 자리 → ${val}` }; },
    3: () => { const step = P([1, 10, 100]), k = R(2, 4), start = R(100, 999 - step * k); return { q: `${start}에서 ${step}씩 ${k}번 뛰어 센 수는?`, ...num(start + step * k), explain: `${start} + ${step}×${k} = ${start + step * k}` }; }
  };
  const uAddSub = {
    id: 'g2s1-addsub', name: '덧셈과 뺄셈 (복습)',
    1: () => { const a = R(15, 89), b = R(10 - (a % 10), 9); return { q: `${a} + ${b} = ?`, ...num(a + b), explain: '일의 자리끼리 더해 10이 넘으면 십의 자리로 받아올려요.' }; },
    2: () => { if (Math.random() < 0.5) { const a = R(15, 79), b = R(12, 99 - a); return { q: `${a} + ${b} = ?`, ...num(a + b), explain: `${a} + ${b} = ${a + b}` }; } const a = R(30, 99), b = R(11, a - 5); return { q: `${a} − ${b} = ?`, ...num(a - b), explain: '일의 자리끼리 뺄 수 없으면 십의 자리에서 10을 받아내려요.' }; },
    3: () => { const b = R(12, 48), c = R(b + 10, 99); if (Math.random() < 0.5) return { q: `□ + ${b} = ${c}  □에 알맞은 수는?`, ...num(c - b), explain: `□ = ${c} − ${b} = ${c - b}` }; const [q, ans] = P([[`귤이 ${c}개 있었는데 ${b}개를 먹었어요. 남은 귤은 몇 개일까요?`, c - b], [`줄넘기를 어제 ${b}번, 오늘 ${c - b}번 했어요. 모두 몇 번 했을까요?`, c]]); return { q, ...num(ans), explain: `식을 세워 계산하면 ${ans}` }; }
  };
  const uMulIntro = {
    id: 'g2s1-mulintro', name: '곱셈 (복습)',
    1: () => { const a = R(2, 5), b = R(2, 5); return { q: `${a}씩 ${b}묶음은 모두 몇 개일까요?`, html: `<div class="groups">${Array.from({ length: b }, () => `<span class="grp">${'🍎'.repeat(a)}</span>`).join('')}</div>`, ...num(a * b), explain: `${a} × ${b} = ${a * b}` }; },
    2: () => { const a = R(2, 9), b = R(2, 5); return { q: `${a}의 ${b}배는 얼마일까요?`, ...num(a * b), explain: `${a}의 ${b}배 = ${a} × ${b} = ${a * b}` }; },
    3: () => { const a = R(2, 9), b = R(3, 6); const c = `${a} × ${b}`; return { q: `${Array(b).fill(a).join(' + ')} 를 곱셈식으로 나타낸 것은?`, ...mc(c, [`${b} × ${b}`, `${a} × ${b + 1}`, `${a} + ${b}`, `${a} × ${b - 1}`, `${a + 1} × ${b}`]), explain: `${a}를 ${b}번 더했으니 ${a} × ${b}` }; }
  };

  const MATH_UNITS = {
    g2s1: [u3digit, uAddSub, uMulIntro],
    g2s2: [u4digit, uMul, uLen, uTime, uGraph, uPattern],
  };

  function genMath(unit, diff) {
    for (let i = 0; i < 20; i++) {
      try { const q = unit[diff](); q.unit = unit.name; q.diff = diff; q.subject = 'math'; q.key = unit.id + '|' + (q.q + (q.html || '')).slice(0, 80); return q; } catch (e) { /* retry */ }
    }
    throw new Error('generator failed: ' + unit.id);
  }

  window.MathGen = { MATH_UNITS, genMath, toKor, clockSVG };
})();
