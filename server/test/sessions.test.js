import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { SessionRegistry } from "../src/sessions.js";

describe("SessionRegistry", () => {
  it("returns the kiosk socket that registered the session", () => {
    const registry = new SessionRegistry({ ttlMs: 1000 });
    assert.equal(registry.register("s1", "kiosk-a", 0), true);
    assert.equal(registry.kioskFor("s1", 10), "kiosk-a");
    assert.equal(registry.kioskFor("other", 10), undefined);
  });

  it("rejects ids that are not non-empty strings", () => {
    const registry = new SessionRegistry({ ttlMs: 1000 });
    assert.equal(registry.register("", "k"), false);
    assert.equal(registry.register(42, "k"), false);
    assert.equal(registry.size, 0);
  });

  it("expires sessions after the ttl and refreshes them on use", () => {
    const registry = new SessionRegistry({ ttlMs: 100 });
    registry.register("s1", "k", 0);
    assert.equal(registry.kioskFor("s1", 90), "k");
    assert.equal(registry.kioskFor("s1", 180), "k", "the lookup at 90 refreshed the session");
    assert.equal(registry.kioskFor("s1", 400), undefined);
    assert.equal(registry.size, 0);
  });

  it("forgets every session of a disconnected socket", () => {
    const registry = new SessionRegistry({ ttlMs: 1000 });
    registry.register("s1", "k1", 0);
    registry.register("s2", "k1", 0);
    registry.register("s3", "k2", 0);
    assert.equal(registry.forgetSocket("k1"), 2);
    assert.equal(registry.size, 1);
    assert.equal(registry.kioskFor("s3", 1), "k2");
  });

  it("evicts only the expired sessions", () => {
    const registry = new SessionRegistry({ ttlMs: 100 });
    registry.register("old", "k", 0);
    registry.register("fresh", "k", 500);
    assert.equal(registry.evictExpired(550), 1);
    assert.equal(registry.kioskFor("fresh", 560), "k");
  });
});
