import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { createEmailDelivery, createWebhookDelivery, deliverLead } from "../src/delivery.js";
import { createIntake } from "../src/intake.js";
import { normalizeLead } from "../src/leads.js";

const silent = { info() {}, warn() {} };
const lead = normalizeLead(
  { sessionId: "s", channel: "email", contact: { name: "Ana", email: "ana@ejemplo.com" }, summary: { items: [{ name: "Escenas", quantity: 1, lineName: "Luz", categoryName: "Living" }] } },
  { id: "lead-1", now: new Date("2026-11-09T22:00:00Z") }
);

describe("webhook delivery", () => {
  it("posts the lead as JSON with an HMAC signature", async () => {
    const calls = [];
    const fetchImpl = async (url, init) => {
      calls.push({ url, init });
      return { ok: true, status: 200 };
    };
    await createWebhookDelivery({ url: "https://crm.example/leads", secret: "shh", fetchImpl }).send(lead);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, "https://crm.example/leads");
    assert.equal(JSON.parse(calls[0].init.body).id, "lead-1");
    const expected = `sha256=${createHmac("sha256", "shh").update(calls[0].init.body).digest("hex")}`;
    assert.equal(calls[0].init.headers["X-Kiosk-Signature"], expected);
  });

  it("fails when the endpoint rejects", async () => {
    const delivery = createWebhookDelivery({ url: "https://crm.example/leads", fetchImpl: async () => ({ ok: false, status: 500 }) });
    await assert.rejects(() => delivery.send(lead), /500/);
  });
});

describe("email delivery", () => {
  it("sends a plain-text mail with reply-to set to the customer", async () => {
    const sent = [];
    const transport = { sendMail: async (mail) => sent.push(mail) };
    await createEmailDelivery({ transport, from: "kiosk@nezu.test", to: "ventas@nezu.test", businessName: "NEZU" }).send(lead);
    assert.equal(sent[0].to, "ventas@nezu.test");
    assert.equal(sent[0].replyTo, "ana@ejemplo.com");
    assert.match(sent[0].subject, /^\[NEZU\] Solicitud del kiosko · Ana · 1 servicio$/);
    assert.match(sent[0].text, /• Escenas \(Living · Luz\)/);
  });
});

describe("deliverLead", () => {
  it("runs every delivery and reports failures without stopping the others", async () => {
    const results = await deliverLead(
      lead,
      [
        { name: "ok", send: async () => {} },
        { name: "broken", send: async () => { throw new Error("boom"); } },
      ],
      silent
    );
    assert.deepEqual(results, [
      { name: "ok", ok: true },
      { name: "broken", ok: false, error: "boom" },
    ]);
  });
});

describe("intake", () => {
  it("stores, delivers and ignores a repeated submission of the same session and channel", async () => {
    const saved = [];
    const delivered = [];
    const intake = createIntake({
      store: { save: async (item) => saved.push(item) },
      deliveries: [{ name: "spy", send: async (item) => delivered.push(item) }],
      log: silent,
    });
    const payload = { sessionId: "s-9", channel: "email", contact: { name: "Ana", phone: "099" } };
    const first = await intake.receive(payload, { now: 1_000 });
    const second = await intake.receive(payload, { now: 2_000 });
    const viaWhatsApp = await intake.receive({ ...payload, channel: "whatsapp" }, { now: 3_000 });
    assert.equal(first.accepted, true);
    assert.equal(second.duplicate, true);
    assert.equal(viaWhatsApp.duplicate, undefined, "another channel for the same session is a distinct lead");
    assert.equal(saved.length, 2);
    assert.equal(delivered.length, 2);
    assert.deepEqual(await intake.receive({ nope: true }), { accepted: false, reason: "invalid" });
  });

  it("still delivers when the store fails", async () => {
    const delivered = [];
    const intake = createIntake({
      store: { save: async () => { throw new Error("disk full"); } },
      deliveries: [{ name: "spy", send: async (item) => delivered.push(item) }],
      log: silent,
    });
    const result = await intake.receive({ sessionId: "s", contact: { name: "Ana" } });
    assert.equal(result.accepted, true);
    assert.equal(delivered.length, 1);
  });
});
