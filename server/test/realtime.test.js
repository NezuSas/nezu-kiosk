import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { Server as SocketServer } from "socket.io";
import { io as connect } from "socket.io-client";
import { SessionRegistry } from "../src/sessions.js";
import { attachRealtime } from "../src/realtime.js";
import { createApp } from "../src/app.js";

const silent = { info() {}, warn() {} };

const once = (socket, event) => new Promise((resolve) => socket.once(event, resolve));
const connected = (url) => {
  const socket = connect(url, { transports: ["websocket"], forceNew: true });
  return once(socket, "connect").then(() => socket);
};

describe("realtime hand-off", () => {
  let server;
  let io;
  let url;
  let realtime;
  const registry = new SessionRegistry({ ttlMs: 60_000 });
  const intakeCalls = [];
  const intake = { receive: async (payload) => { intakeCalls.push(payload); return { accepted: true }; } };

  before(async () => {
    server = http.createServer(createApp({ corsOrigin: "*", staticDir: "", registry }));
    io = new SocketServer(server, { cors: { origin: "*" } });
    realtime = attachRealtime(io, { registry, intake, log: silent });
    await new Promise((resolve) => server.listen(0, resolve));
    url = `http://127.0.0.1:${server.address().port}`;
  });

  after(async () => {
    io.close();
    await new Promise((resolve) => server.close(resolve));
  });

  it("delivers the phone message only to the kiosk that registered the session", async () => {
    const kiosk = await connected(url);
    const otherKiosk = await connected(url);
    const phone = await connected(url);
    kiosk.emit("register_session", "s-1");
    otherKiosk.emit("register_session", "s-2");

    let leaked = false;
    otherKiosk.on("message", () => (leaked = true));
    const received = once(kiosk, "message");
    phone.emit("message", { sessionId: "s-1", contact: { name: "Ana" } });

    const payload = await received;
    assert.deepEqual(payload, { sessionId: "s-1", contact: { name: "Ana" } });
    await new Promise((resolve) => setTimeout(resolve, 50));
    assert.equal(leaked, false);
    assert.equal(intakeCalls.length, 1, "the intake receives the submission as well");
    assert.equal(intakeCalls[0].sessionId, "s-1");
    [kiosk, otherKiosk, phone].forEach((socket) => socket.disconnect());
  });

  it("drops messages for unknown sessions and malformed payloads without crashing", async () => {
    const phone = await connected(url);
    const before = intakeCalls.length;
    phone.emit("message", { sessionId: "nobody", contact: { name: "Sin kiosko" } });
    phone.emit("message", "garbage");
    phone.emit("message", null);
    await new Promise((resolve) => setTimeout(resolve, 50));
    assert.equal(intakeCalls.length, before + 3, "every message reaches the intake, which decides what is valid");
    const health = await fetch(`${url}/health`).then((response) => response.json());
    assert.equal(health.ok, true);
    phone.disconnect();
  });

  it("notifies the registered kiosk when a payment is confirmed", async () => {
    const kiosk = await connected(url);
    kiosk.emit("register_session", "s-pay");
    await new Promise((resolve) => setTimeout(resolve, 50));
    const confirmed = once(kiosk, "payment_confirmed");
    assert.equal(realtime.notifyPayment({ sessionId: "s-pay", method: "qr" }), true);
    assert.deepEqual(await confirmed, { sessionId: "s-pay", method: "qr" });
    assert.equal(realtime.notifyPayment({ sessionId: "unknown", method: "qr" }), false);
    kiosk.disconnect();
  });

  it("forgets the session when the kiosk disconnects", async () => {
    const kiosk = await connected(url);
    kiosk.emit("register_session", "s-gone");
    await new Promise((resolve) => setTimeout(resolve, 50));
    assert.equal(registry.kioskFor("s-gone") !== undefined, true);
    kiosk.disconnect();
    await new Promise((resolve) => setTimeout(resolve, 100));
    assert.equal(registry.kioskFor("s-gone"), undefined);
  });
});
