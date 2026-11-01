// EU Connect 2026 planner: small proxy so the AI API key never reaches the browser.
// Settings in Cloudflare (Worker > Settings > Variables and Secrets):
//   ANTHROPIC_API_KEY  (Secret)  your API key
//   PASSCODE           (Secret)  the code you give the committee, e.g. glasgow26
//   ALLOWED_ORIGIN     (Text)    https://smccawille88.github.io

const MODEL = "claude-sonnet-5-5";
const MAX_PROMPT_CHARS = 120000;

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowed = env.ALLOWED_ORIGIN || "";
    const cors = {
      "Access-Control-Allow-Origin": allowed,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "content-type, x-passcode",
      "Access-Control-Max-Age": "86400",
      "Vary": "Origin",
    };
    const reply = (status, obj) =>
      new Response(JSON.stringify(obj), { status, headers: { ...cors, "content-type": "application/json" } });

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST") return reply(405, { error: "method" });
    if (!allowed || origin !== allowed) return reply(403, { error: "origin" });
    if (!env.PASSCODE || (request.headers.get("x-passcode") || "") !== env.PASSCODE) return reply(401, { error: "passcode" });

    let body;
    try { body = await request.json(); } catch { return reply(400, { error: "body" }); }
    const prompt = typeof body.prompt === "string" ? body.prompt : "";
    if (!prompt || prompt.length > MAX_PROMPT_CHARS) return reply(400, { error: "prompt" });

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({ model: MODEL, max_tokens: 4000, messages: [{ role: "user", content: prompt }] }),
    });
    if (!r.ok) return reply(r.status === 429 ? 429 : 502, { error: "upstream", status: r.status });
    const j = await r.json();
    const text = (j.content || []).filter((c) => c.type === "text").map((c) => c.text).join("");
    return reply(200, { text });
  },
};
