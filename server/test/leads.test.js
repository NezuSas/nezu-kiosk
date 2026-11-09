import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { leadSubject, leadToText, normalizeLead } from "../src/leads.js";

const payload = {
  sessionId: "s-1",
  mode: "quote",
  channel: "whatsapp",
  contact: { name: "  Ana Pérez ", phone: "0991234567", email: "ana@ejemplo.com", city: "Cuenca", notes: "Casa de dos pisos" },
  summary: {
    items: [
      { serviceId: "living-escenas", name: "Escenas por ambiente", quantity: 1, lineName: "Iluminación y escenas", categoryName: "Living" },
      { serviceId: "core-plc", name: "PLC por Modbus TCP", quantity: 2, lineName: "Control y supervisión", categoryName: "Core", price: 120 },
      { name: "", quantity: 1 },
      "garbage",
    ],
  },
};

describe("normalizeLead", () => {
  it("builds a trimmed, bounded lead with an id and timestamp", () => {
    const lead = normalizeLead(payload, { now: new Date("2026-11-09T22:00:00Z"), id: "lead-1" });
    assert.equal(lead.id, "lead-1");
    assert.equal(lead.receivedAt, "2026-11-09T22:00:00.000Z");
    assert.equal(lead.contact.name, "Ana Pérez");
    assert.equal(lead.channel, "whatsapp");
    assert.equal(lead.mode, "quote");
    assert.equal(lead.items.length, 2, "items without a name or that are not objects are dropped");
    assert.equal(lead.items[1].price, 120);
    assert.equal(lead.items[1].quantity, 2);
  });

  it("rejects payloads without session or without any way to contact the customer", () => {
    assert.equal(normalizeLead(null), null);
    assert.equal(normalizeLead({ contact: { name: "Ana" } }), null);
    assert.equal(normalizeLead({ sessionId: "s", contact: { city: "Cuenca" } }), null);
    assert.deepEqual(normalizeLead({ sessionId: "s", contact: { phone: "099" } }).items, [], "a phone number alone is enough to reach the customer");
  });

  it("defaults unknown modes and channels", () => {
    const lead = normalizeLead({ sessionId: "s", mode: "weird", channel: "pigeon", paymentMethod: "cash", contact: { name: "Ana" } });
    assert.equal(lead.mode, "quote");
    assert.equal(lead.channel, "email");
    assert.equal(lead.paymentMethod, undefined);
    assert.deepEqual(lead.items, []);
  });
});

describe("leadToText / leadSubject", () => {
  it("writes a readable summary with one line per service", () => {
    const lead = normalizeLead(payload, { id: "lead-1" });
    const text = leadToText(lead);
    assert.match(text, /Nombre: Ana Pérez/);
    assert.match(text, /• Escenas por ambiente \(Living · Iluminación y escenas\)/);
    assert.match(text, /• PLC por Modbus TCP \(Core · Control y supervisión\) ×2/);
    assert.match(text, /vía WhatsApp/);
    assert.equal(leadSubject(lead, "NEZU"), "[NEZU] Solicitud del kiosko · Ana Pérez · 2 servicios");
  });

  it("explains an empty selection instead of printing nothing", () => {
    const lead = normalizeLead({ sessionId: "s", contact: { phone: "099" } }, { id: "x" });
    assert.match(leadToText(lead), /sin servicios en la selección/);
    assert.equal(leadSubject(lead, "NEZU"), "[NEZU] Solicitud del kiosko · 099 · 0 servicios");
  });
});
