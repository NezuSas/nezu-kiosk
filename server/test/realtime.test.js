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
  const registry = new SessionRegistry({ ttlMs: 60_000 });

  before(async () => {
    server = http.createServer(createApp({ corsOrigin: "*", staticDir: "", registry }));
    io = new SocketServer(server, { cors: { origin: "*" } });
    attachRealtime(io, { registry, log: silent });
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
    [kiosk, otherKiosk, phone].forEach((socket) => socket.disconnect());
  });

  it("drops messages for unknown sessions and malformed payloads without crashing", async () => {
    const phone = await connected(url);
    phone.emit("message", { sessionId: "nobody" });
    phone.emit("message", "garbage");
    phone.emit("message", null);
    await new Promise((resolve) => setTimeout(resolve, 50));
    const health = await fetch(`${url}/health`).then((response) => response.json());
    assert.equal(health.ok, true);
    phone.disconnect();
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
