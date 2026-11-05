// EU Connect 2026 planner: small proxy so the AI API key never reaches the browser.
// Settings in Cloudflare (Worker > Settings > Variables and Secrets):
//   ANTHROPIC_API_KEY  (Secret)  your API key
//   PASSCODE           (Secret)  optional: if set, the page must send this code
//   ALLOWED_ORIGIN     (Text)    https://smccawille88.github.io

const MODEL = "claude-sonnet-5-5";   // or "claude-haiku-5-5" for the cheapest option
const MAX_PROMPT_CHARS = 120000;
const PER_HOUR = 40;          // plans per visitor per hour (rough guard, resets when the Worker restarts)
const seen = new Map();

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
    if (env.PASSCODE && (request.headers.get("x-passcode") || "") !== env.PASSCODE) return reply(401, { error: "passcode" });
    const ip = request.headers.get("CF-Connecting-IP") || "?";
    const now = Date.now(), hits = (seen.get(ip) || []).filter((t) => now - t < 3600000);
    if (hits.length >= PER_HOUR) return reply(429, { error: "limit" });
    hits.push(now); seen.set(ip, hits);

    let body;
    try { body = await request.json(); } catch { return reply(400, { error: "body" }); }
    const prompt = typeof body.prompt === "string" ? body.prompt : "";
    const fixed = typeof body.fixed === "string" ? body.fixed : "";
    if (!prompt || prompt.length + fixed.length > MAX_PROMPT_CHARS) return reply(400, { error: "prompt" });
    // The programme text (fixed) is the same for everyone, so it is cached and reused at a lower price.
    const content = fixed
      ? [{ type: "text", text: fixed, cache_control: { type: "ephemeral" } }, { type: "text", text: prompt }]
      : prompt;

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({ model: MODEL, max_tokens: 4000, messages: [{ role: "user", content }] }),
    });
    if (!r.ok) return reply(r.status === 429 ? 429 : 502, { error: "upstream", status: r.status });
    const j = await r.json();
    const text = (j.content || []).filter((c) => c.type === "text").map((c) => c.text).join("");
    return reply(200, { text });
  },
};
