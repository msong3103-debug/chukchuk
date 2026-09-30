// Supabase Edge Function: kid-tutor
// 척척 용돈통장의 AI 친구. Claude API 키는 여기(서버 비밀값)에만 있고 앱에는 없습니다.
// 필요한 비밀값(Secrets): ANTHROPIC_API_KEY, APP_TOKEN
// 배포: supabase functions deploy kid-tutor --no-verify-jwt

const MODEL = "claude-sonnet-5";
// Sonnet 5는 생각(thinking)이 기본으로 켜져 있고 max_tokens에 생각이 포함된다. 답 길이는 프롬프트로 조절한다.
const MAX_TOKENS = 2000;
const REFUSED = "그건 척척이가 대답하기 어려운 이야기예요. 엄마 아빠께 여쭤보자!";
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, x-app-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const BASE = (grade: number, name: string) => `
너는 "척척이"야. 한국 초등학교 ${grade}학년 어린이 ${name}의 공부 친구 AI야.

말투와 길이
- 다정하고 밝은 해요체로, 초등 ${grade}학년이 아는 쉬운 낱말만 써.
- 한 번에 3~4문장 이내로 짧게. 어려운 한자어는 쉬운 말로 풀어 줘.
- 이모지는 가끔 1개까지만.

지켜야 할 것
- 너는 사람이 아니라 AI라는 걸 숨기지 마. 물어보면 솔직하게 말해.
- 이름, 주소, 학교, 전화번호 같은 개인 정보를 묻지 말고, 아이가 말해도 기억하거나 되묻지 마.
- 폭력, 무서운 이야기, 성적인 내용, 위험한 장난이나 실험, 약·병 치료, 돈 거래 같은 주제는 자세히 답하지 말고 "그건 엄마 아빠께 여쭤보자"라고 부드럽게 안내해.
- 아이가 다쳤다, 누가 괴롭힌다, 무섭다, 많이 슬프다고 하면 걱정해 주고, 지금 바로 엄마 아빠나 선생님께 말하라고 꼭 알려 줘.
- 모르는 건 모른다고 말하고 지어내지 마.
- 오래 대화하도록 붙잡지 말고, 공부와 호기심을 칭찬해 줘.
`.trim();

const CURIOUS = (grade: number) => `
호기심 질문
- 답을 한 뒤 마지막에, 방금 이야기와 이어지는 짧은 "궁금증 질문"을 하나 던져 줘. 예: "그럼 밤하늘은 왜 까만색일까?"
- ${grade}학년이 스스로 생각하거나 주변에서 관찰해 볼 수 있는 질문으로 해. 정답은 바로 알려 주지 마.
- 아이가 슬프거나 무섭거나 다쳤다고 말했을 때, 또는 부모님께 여쭤보라고 안내한 경우에는 질문을 붙이지 마.
`.trim();

const HINT = `
지금은 "힌트 모드"야. 아이가 문제를 푸는 중이야.
- 절대로 정답을 말하거나, 정답이 무엇인지 알 수 있게 보기 하나로 좁혀 주지 마.
- 문제를 푸는 첫 단계나 생각하는 방법만 1~2문장으로 알려 줘.
- 계산 문제면 식을 세우는 방법이나 비슷한 쉬운 예를 들어 줘.
`.trim();

// ───── 놀이 모드 (모두 BASE 안전 규칙 위에 덧붙인다) ─────
const GREET = `
지금은 "척척이의 아침 인사"야. 아래에 아이의 요즘 기록이 있어.
- 1~2문장으로 반갑게 먼저 말을 걸어. 기록 가운데 하나를 골라 칭찬하거나 응원해 줘.
- 마지막에 오늘 같이 해 볼 것을 하나 제안해 (예: 문제 풀기, 이야기 짓기, 열고개).
- 기록에 없는 일은 지어내지 마. 개인 정보는 묻지 마.
`.trim();

const TWENTY = (secret: string, kind: string) => `
지금은 "열고개" 놀이야. 네가 마음속으로 생각한 것은 "${secret}"(${kind})이야. 아이가 질문해서 맞히는 놀이야.
- 아이가 예/아니요로 답할 수 있는 질문을 하면 "네!" 또는 "아니요!"로 먼저 답하고, 짧은 한 문장만 덧붙여.
- 덧붙이는 말은 정답을 바로 알 수 있을 만큼 큰 힌트가 되면 안 돼.
- 절대로 "${secret}"라는 이름을 말하거나 글자로 쓰지 마. 이름의 일부도 말하지 마.
- 잘 모르거나 애매한 질문이면 "음, 조금 그래요"처럼 솔직하게 답해.
- 아이가 이름을 정확히 말하면 "정답이야!"라고 크게 칭찬해.
- 사실이 확실하지 않으면 지어내지 말고 "그건 척척이도 헷갈려요"라고 말해.
`.trim();

const STORY = (words: string[], end: boolean) => `
지금은 "같이 이야기 짓기" 놀이야. 이야기 낱말: ${words.join(", ")}
- 아이와 번갈아 가며 짧은 동화를 지어. 네 차례에는 2~3문장만 써.
- 아이가 쓴 줄을 이어받아 자연스럽게 이어 가고, 아이의 생각을 칭찬해 줘.
- 무섭거나 폭력적이거나 슬픈 내용은 넣지 말고 따뜻하고 신나는 이야기로 만들어.
${end ? '- 이제 이야기를 2~3문장으로 행복하게 마무리하고, 맨 마지막 줄에 "제목: ..." 형식으로 이야기 제목을 붙여.' : '- 네 차례 끝에는 "다음엔 어떻게 될까?"처럼 아이 차례를 물어봐.'}
`.trim();

const DIARY = `
지금은 "한 줄 일기 답장"이야. 아이가 오늘 있었던 일을 일기로 한 줄 썼어.
- 2~3문장으로 다정하게 답장해. 아이의 마음을 알아주고 잘한 점을 칭찬해.
- 질문은 하나까지만. 오래 붙잡지 마.
`.trim();

const cleanMsgs = (list: unknown, keep: number) => {
  const arr = Array.isArray(list) ? list.slice(-keep) : [];
  const out = arr
    .filter((m: any) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map((m: any) => ({ role: m.role as "user" | "assistant", content: m.content.slice(0, 300) }));
  while (out.length && out[0].role !== "user") out.shift();
  return out;
};
const short = (v: unknown, n: number) => String(v ?? "").replace(/\s+/g, " ").trim().slice(0, n);

function bad(status: number, msg: string) {
  return new Response(JSON.stringify({ error: msg }), { status, headers: { ...CORS, "content-type": "application/json" } });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });
  if (req.method !== "POST") return bad(405, "POST only");

  const token = Deno.env.get("APP_TOKEN");
  if (!token || req.headers.get("x-app-token") !== token) return bad(401, "bad token");

  let body: any;
  try { body = await req.json(); } catch { return bad(400, "bad json"); }

  const grade = Math.min(6, Math.max(1, Number(body.grade) || 2));
  const name = String(body.name || "친구").slice(0, 10);
  let system = BASE(grade, name);
  // 부모님이 적은 아이의 관심사 (한 줄, 40자까지)
  const likes = String(body.likes || "").replace(/\s+/g, " ").trim().slice(0, 40);
  if (likes) system += `\n\n아이가 좋아하는 것: ${likes}\n- 설명할 때 어울리면 가끔 이와 관련된 예시를 들어 줘. 억지로 끌어오지는 마.`;
  let messages: { role: "user" | "assistant"; content: string }[] = [];

  if (body.mode === "hint") {
    const q = body.question || {};
    system += "\n\n" + HINT;
    const lines = [
      `과목: ${String(q.subject || "").slice(0, 20)} / 단원: ${String(q.unit || "").slice(0, 30)}`,
      q.passage ? `지문: ${String(q.passage).slice(0, 600)}` : "",
      `문제: ${String(q.text || "").slice(0, 400)}`,
      Array.isArray(q.choices) ? `보기: ${q.choices.slice(0, 5).map((c: unknown) => String(c).slice(0, 60)).join(" / ")}` : "",
      `(정답은 ${String(q.answer).slice(0, 60)} — 아이에게 절대 말하지 마)`,
      "이 문제에 대한 힌트를 줘.",
    ].filter(Boolean);
    messages = [{ role: "user", content: lines.join("\n") }];
  } else if (body.mode === "greet") {
    system += "\n\n" + GREET;
    const ctx = (Array.isArray(body.ctx) ? body.ctx : []).slice(0, 6).map((c: unknown) => "- " + short(c, 80)).filter((c: string) => c.length > 2);
    messages = [{ role: "user", content: "아이의 요즘 기록:\n" + (ctx.join("\n") || "- 오늘 처음 만났어요") }];
  } else if (body.mode === "twenty") {
    const secret = short(body.secret, 20), kind = short(body.kind, 10) || "동물";
    if (!secret) return bad(400, "no secret");
    system += "\n\n" + TWENTY(secret, kind);
    messages = cleanMsgs(body.messages, 22);
  } else if (body.mode === "story") {
    const words = (Array.isArray(body.words) ? body.words : []).slice(0, 3).map((w: unknown) => short(w, 10)).filter(Boolean);
    if (!words.length) return bad(400, "no words");
    system += "\n\n" + STORY(words, !!body.end);
    messages = cleanMsgs(body.messages, 12);
  } else if (body.mode === "diary") {
    system += "\n\n" + DIARY;
    const text = short(body.text, 200);
    if (!text) return bad(400, "no diary");
    messages = [{ role: "user", content: text }];
  } else {
    system += "\n\n" + CURIOUS(grade);
    messages = cleanMsgs(body.messages, 8);
  }
  if (!messages.length || messages[messages.length - 1].role !== "user") return bad(400, "no question");

  const key = Deno.env.get("ANTHROPIC_API_KEY");
  if (!key) return bad(500, "server key missing");

  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({
      model: MODEL, max_tokens: MAX_TOKENS, system, messages,
      output_config: { effort: "low" }, // 짧은 대화라 가볍게 생각하게 한다
    }),
  });
  if (!r.ok) return bad(502, "ai error " + r.status);
  const j = await r.json();
  // 거절되면 content가 비어 있거나 중간까지만 있으므로, 내용을 읽기 전에 먼저 확인한다
  if (j.stop_reason === "refusal") return new Response(JSON.stringify({ text: REFUSED }), { headers: { ...CORS, "content-type": "application/json" } });
  const text = (j.content || []).filter((c: any) => c.type === "text").map((c: any) => c.text).join("").trim();
  if (!text) return bad(502, "empty answer (" + j.stop_reason + ")");
  return new Response(JSON.stringify({ text }), { headers: { ...CORS, "content-type": "application/json" } });
});
