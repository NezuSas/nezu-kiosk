import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { createPendingPayments } from "../src/pending.js";
import { createApp } from "../src/app.js";
import { SessionRegistry } from "../src/sessions.js";
import { NoopStore } from "../src/storage.js";

const submission = (sessionId, extra = {}) => ({
  sessionId,
  mode: "payment",
  paymentMethod: "card",
  contact: { name: "Ana", businessName: "Café Tomebamba", taxId: "0102030405001" },
  summary: { items: [{ name: "Escenas", quantity: 2, price: 10 }, { name: "Cámaras", quantity: 1, price: 120 }] },
  ...extra,
});

describe("pending payments", () => {
  it("remembers payment-mode submissions with customer, items and total", () => {
    const pending = createPendingPayments();
    assert.equal(pending.remember(submission("s-1"), 1_000), true);
    assert.equal(pending.remember({ ...submission("s-2"), mode: "quote" }), false, "quote requests are not payments");
    const [entry] = pending.list(2_000);
    assert.equal(entry.customer, "Café Tomebamba");
    assert.equal(entry.taxId, "0102030405001");
    assert.equal(entry.paymentMethod, "card");
    assert.equal(entry.total, 140);
    assert.equal(entry.receivedAtMs, undefined, "internal timestamp is not exposed");
  });

  it("leaves the total undefined when a price is missing and orders newest first", () => {
    const pending = createPendingPayments();
    pending.remember(submission("old", { summary: { items: [{ name: "Sin precio", quantity: 1 }] } }), 1_000);
    pending.remember(submission("new"), 5_000);
    const list = pending.list(6_000);
    assert.deepEqual(list.map((entry) => entry.sessionId), ["new", "old"]);
    assert.equal(list[1].total, undefined);
  });

  it("forgets settled and stale sessions", () => {
    const pending = createPendingPayments({ ttlMs: 1_000 });
    pending.remember(submission("s-1"), 0);
    pending.remember(submission("s-2"), 0);
    assert.equal(pending.settle("s-1")?.sessionId, "s-1");
    assert.equal(pending.settle("missing"), undefined);
    assert.equal(pending.list(500).length, 1);
    assert.equal(pending.list(5_000).length, 0);
  });
});

describe("/admin and /api/payments/pending", () => {
  let server;
  let url;
  const pending = createPendingPayments();
  const stores = { leads: new NoopStore(), events: new NoopStore(), payments: new NoopStore() };

  before(async () => {
    pending.remember(submission("s-9"));
    const app = createApp({
      corsOrigin: "*",
      staticDir: "",
      registry: new SessionRegistry({ ttlMs: 1000 }),
      stores,
      pending,
      adminToken: "secreto",
      notifyPayment: () => true,
    });
    server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, resolve));
    url = `http://127.0.0.1:${server.address().port}`;
  });

  after(() => new Promise((resolve) => server.close(resolve)));

  it("serves the admin page without a token but its data only with it", async () => {
    const page = await fetch(`${url}/admin/`);
    assert.equal(page.status, 200);
    assert.match(await page.text(), /Administración del kiosko/);
    assert.equal((await fetch(`${url}/api/payments/pending`)).status, 401);
    const data = await fetch(`${url}/api/payments/pending`, { headers: { Authorization: "Bearer secreto" } }).then((r) => r.json());
    assert.equal(data.pending.length, 1);
    assert.equal(data.pending[0].sessionId, "s-9");
  });

  it("removes the session from the waiting list once confirmed", async () => {
    const response = await fetch(`${url}/api/payments/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer secreto" },
      body: JSON.stringify({ sessionId: "s-9", method: "card", reference: "AUTH-1" }),
    });
    assert.equal(response.status, 202);
    assert.equal(pending.size, 0);
  });
});
