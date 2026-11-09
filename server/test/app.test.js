import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { createApp } from "../src/app.js";
import { createRateLimiter } from "../src/rateLimit.js";
import { SessionRegistry } from "../src/sessions.js";

describe("POST /api/leads", () => {
  let server;
  let url;
  const received = [];
  const intake = {
    receive: async (payload) => {
      received.push(payload);
      return payload?.contact ? { accepted: true, lead: { id: "lead-1" } } : { accepted: false, reason: "invalid" };
    },
  };

  before(async () => {
    const app = createApp({
      corsOrigin: "*",
      staticDir: "",
      registry: new SessionRegistry({ ttlMs: 1000 }),
      intake,
      rateLimiter: createRateLimiter({ limit: 3, windowMs: 60_000 }),
    });
    server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, resolve));
    url = `http://127.0.0.1:${server.address().port}`;
  });

  after(() => new Promise((resolve) => server.close(resolve)));

  const post = (body) =>
    fetch(`${url}/api/leads`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

  it("accepts a submission and answers with the lead id", async () => {
    const response = await post({ sessionId: "s", contact: { name: "Ana" } });
    assert.equal(response.status, 202);
    assert.deepEqual(await response.json(), { ok: true, id: "lead-1" });
    assert.equal(received.length, 1);
  });

  it("rejects an invalid submission", async () => {
    const response = await post({ nope: true });
    assert.equal(response.status, 400);
  });

  it("rate-limits a client that keeps retrying", async () => {
    const third = await post({ sessionId: "s", contact: { name: "Ana" } });
    assert.equal(third.status, 202);
    const fourth = await post({ sessionId: "s", contact: { name: "Ana" } });
    assert.equal(fourth.status, 429);
  });
});

describe("rate limiter", () => {
  it("allows up to the limit inside the window and recovers after it", () => {
    const limiter = createRateLimiter({ limit: 2, windowMs: 100 });
    assert.equal(limiter.allow("ip", 0), true);
    assert.equal(limiter.allow("ip", 10), true);
    assert.equal(limiter.allow("ip", 20), false);
    assert.equal(limiter.allow("other", 20), true);
    assert.equal(limiter.allow("ip", 150), true);
  });
});
