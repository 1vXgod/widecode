// Minimal stand-in for the Resend API, used only by the e2e tests
// (playwright.config.ts points RESEND_API_URL here). It never sends email.
//
//   POST /emails  stores the email and answers like Resend; an email whose text
//                 contains "[mock-resend:fail]" gets an HTTP 500 instead
//   GET  /emails  lists what was received, for assertions
//   GET  /        health check for Playwright
import { createServer } from "node:http";

const port = Number(process.env.MOCK_RESEND_PORT ?? 3199);
const received = [];

const server = createServer((request, response) => {
  const reply = (status, body) => {
    response.writeHead(status, { "Content-Type": "application/json" });
    response.end(JSON.stringify(body));
  };

  if (request.method === "GET" && request.url === "/") return reply(200, { ok: true });
  if (request.method === "GET" && request.url === "/emails") return reply(200, received);
  if (request.method !== "POST" || request.url !== "/emails") return reply(404, { name: "not_found" });

  if (!request.headers.authorization?.startsWith("Bearer ")) return reply(401, { name: "missing_api_key" });

  let raw = "";
  request.on("data", (chunk) => (raw += chunk));
  request.on("end", () => {
    let email;
    try {
      email = JSON.parse(raw);
    } catch {
      return reply(400, { name: "invalid_json" });
    }
    if (String(email.text ?? "").includes("[mock-resend:fail]")) {
      return reply(500, { name: "internal_server_error" });
    }
    const id = `mock-${received.length + 1}`;
    received.push({ id, idempotencyKey: request.headers["idempotency-key"] ?? null, ...email });
    return reply(200, { id });
  });
});

server.listen(port, "127.0.0.1", () => console.log(`Mock Resend API on http://127.0.0.1:${port}`));
