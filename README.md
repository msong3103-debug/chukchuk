# 척척 용돈통장

초등 2~4학년용 교과 문제 풀이 + 용돈 적립 PWA. 2022 개정 교육과정 기준, 현재 2학년 1·2학기 수록.

## 폴더 구성
- `index.html` — 앱 본체
- `math-gen.js` — 수학 자동생성기 (2-2: 네 자리 수, 곱셈구구, 길이 재기, 시각과 시간, 표와 그래프, 규칙 찾기 / 2-1 복습: 세 자리 수, 덧셈과 뺄셈, 곱셈)
- `bank-g2.js` — 국어(맞춤법·낱말·문장·읽기), 통합교과(마을·세계·안전) 문제은행 95문제
- `manifest.json`, `icon.svg` — 홈 화면 설치용
- `supabase/functions/kid-tutor/index.ts` — AI 친구 서버 (Claude API 키 보관)

## 1. GitHub Pages 배포
1. 새 저장소에 `supabase` 폴더를 뺀 나머지 파일을 올립니다.
2. Settings → Pages → Branch: main / root → Save.
3. 아이 폰 크롬에서 주소를 열고 메뉴 → "홈 화면에 추가".

## 2. AI 친구 연결 (Supabase)
1. Supabase 프로젝트의 Edge Functions → Secrets에 두 값을 넣습니다.
   - `ANTHROPIC_API_KEY` : 클로드 콘솔에서 만든 키
   - `APP_TOKEN` : 아무 긴 문자열 (예: 영문+숫자 20자)
2. `kid-tutor` 함수를 배포합니다. JWT 확인은 끕니다 (`--no-verify-jwt`). 대신 APP_TOKEN으로 막습니다.
3. 앱 → 부모님 메뉴 → AI 친구 연결에 함수 주소와 APP_TOKEN을 넣고 저장.
4. 클로드 콘솔 → Limits에서 월 사용 한도를 낮게 걸어 두면 안심입니다.

## 문제 추가하기
- 국어·통합: `bank-g2.js`에 `K('단원', 난이도, '문제', '정답', ['오답1','오답2','오답3'], '해설')` 한 줄 추가.
- 3학년: `bank-g3.js`를 같은 형식으로 만들고 `window.QBANK.g3 = {kor:[...], soc:[...], sci:[...], eng:[...], mor:[...]}`, 수학은 `MATH_UNITS.g3s1` 추가 후 index.html에 script 태그 한 줄.

## 데이터
적립금·거래내역은 폰 브라우저 안(localStorage)에 저장됩니다. 브라우저 데이터를 지우면 초기화되니, 앱 캐시 삭제는 피해 주세요.
