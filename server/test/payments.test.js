import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { createApp } from "../src/app.js";
import { SessionRegistry } from "../src/sessions.js";
import { NoopStore } from "../src/storage.js";
import { normalizePaymentConfirmation } from "../src/payments.js";

describe("normalizePaymentConfirmation", () => {
  it("needs a session and bounds the rest", () => {
    assert.equal(normalizePaymentConfirmation({}), null);
    const confirmation = normalizePaymentConfirmation(
      { sessionId: " s-1 ", method: "card", reference: "AUTH-123", amount: 45.5, confirmedBy: "caja" },
      { id: "p-1", now: new Date("2026-11-09T22:00:00Z") }
    );
    assert.deepEqual(confirmation, {
      id: "p-1",
      receivedAt: "2026-11-09T22:00:00.000Z",
      sessionId: "s-1",
      method: "card",
      reference: "AUTH-123",
      amount: 45.5,
      confirmedBy: "caja",
    });
    assert.equal(normalizePaymentConfirmation({ sessionId: "s", method: "cash", amount: -3 }).method, "other");
  });
});

describe("protected routes", () => {
  let server;
  let url;
  const notified = [];
  const stores = { leads: new NoopStore(), events: new NoopStore(), payments: new NoopStore() };

  before(async () => {
    const app = createApp({
      corsOrigin: "*",
      staticDir: "",
      registry: new SessionRegistry({ ttlMs: 1000 }),
      stores,
      adminToken: "secreto",
      notifyPayment: (confirmation) => {
        notified.push(confirmation);
        return true;
      },
    });
    server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, resolve));
    url = `http://127.0.0.1:${server.address().port}`;
  });

  after(() => new Promise((resolve) => server.close(resolve)));

  it("rejects payment confirmations without the admin token", async () => {
    const response = await fetch(`${url}/api/payments/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: "s-1" }),
    });
    assert.equal(response.status, 401);
    assert.equal(notified.length, 0);
  });

  it("confirms a payment and notifies the kiosk", async () => {
    const response = await fetch(`${url}/api/payments/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer secreto" },
      body: JSON.stringify({ sessionId: "s-1", method: "qr", reference: "DEUNA-9" }),
    });
    assert.equal(response.status, 202);
    const body = await response.json();
    assert.equal(body.kioskNotified, true);
    assert.equal(notified[0].sessionId, "s-1");
  });

  it("serves stats to the admin only and accepts event batches from anyone", async () => {
    const denied = await fetch(`${url}/api/stats`);
    assert.equal(denied.status, 401);
    const allowed = await fetch(`${url}/api/stats`, { headers: { Authorization: "Bearer secreto" } });
    assert.equal(allowed.status, 200);
    assert.equal((await allowed.json()).days.length, 7);

    const events = await fetch(`${url}/api/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kioskId: "k", events: [{ name: "screen_view", screen: "/" }, { name: "nope" }] }),
    });
    assert.equal(events.status, 202);
    assert.deepEqual(await events.json(), { ok: true, accepted: 1 });
  });

  it("sets the security headers", async () => {
    const response = await fetch(`${url}/health`);
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
    assert.equal(response.headers.get("x-frame-options"), "SAMEORIGIN");
    assert.equal(response.headers.get("x-powered-by"), null);
  });
});
