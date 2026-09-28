// Supabase Edge Function: kid-tutor
// 척척 용돈통장의 AI 친구. Claude API 키는 여기(서버 비밀값)에만 있고 앱에는 없습니다.
// 필요한 비밀값(Secrets): ANTHROPIC_API_KEY, APP_TOKEN
// 배포: supabase functions deploy kid-tutor --no-verify-jwt

const MODEL = "claude-haiku-4-5-20251001";
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

const HINT = `
지금은 "힌트 모드"야. 아이가 문제를 푸는 중이야.
- 절대로 정답을 말하거나, 정답이 무엇인지 알 수 있게 보기 하나로 좁혀 주지 마.
- 문제를 푸는 첫 단계나 생각하는 방법만 1~2문장으로 알려 줘.
- 계산 문제면 식을 세우는 방법이나 비슷한 쉬운 예를 들어 줘.
`.trim();

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
  } else {
    const list = Array.isArray(body.messages) ? body.messages.slice(-8) : [];
    messages = list
      .filter((m: any) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .map((m: any) => ({ role: m.role, content: m.content.slice(0, 300) }));
    while (messages.length && messages[0].role !== "user") messages.shift();
    if (!messages.length || messages[messages.length - 1].role !== "user") return bad(400, "no question");
  }

  const key = Deno.env.get("ANTHROPIC_API_KEY");
  if (!key) return bad(500, "server key missing");

  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model: MODEL, max_tokens: 350, system, messages }),
  });
  if (!r.ok) return bad(502, "ai error " + r.status);
  const j = await r.json();
  const text = (j.content || []).filter((c: any) => c.type === "text").map((c: any) => c.text).join("").trim();
  return new Response(JSON.stringify({ text }), { headers: { ...CORS, "content-type": "application/json" } });
});
