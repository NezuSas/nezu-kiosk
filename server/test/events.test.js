import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { normalizeEvents, summarizeStats } from "../src/events.js";
import { JsonlStore, NoopStore } from "../src/storage.js";

describe("normalizeEvents", () => {
  it("keeps known events, bounds them and stamps kiosk and reception time", () => {
    const now = new Date("2026-11-09T22:00:00Z");
    const events = normalizeEvents(
      {
        kioskId: "feria-1",
        events: [
          { name: "screen_view", screen: "/categories", at: "2026-11-09T21:59:00Z" },
          { name: "service_added", ref: "living-escenas" },
          { name: "hack", ref: "x" },
          "garbage",
          { name: "screen_view", at: "not a date" },
        ],
      },
      { now }
    );
    assert.equal(events.length, 3);
    assert.equal(events[0].kioskId, "feria-1");
    assert.equal(events[0].at, "2026-11-09T21:59:00Z");
    assert.equal(events[0].receivedAt, now.toISOString());
    assert.equal(events[2].at, now.toISOString(), "an invalid timestamp falls back to the reception time");
  });

  it("accepts a bare array and caps the batch", () => {
    const events = normalizeEvents(Array.from({ length: 80 }, () => ({ name: "idle_reset" })), { maxBatch: 50 });
    assert.equal(events.length, 50);
    assert.equal(events[0].kioskId, "kiosk");
    assert.deepEqual(normalizeEvents(null), []);
  });
});

describe("summarizeStats", () => {
  it("counts per day and ranks the most added services", async () => {
    const dir = await mkdtemp(join(tmpdir(), "kiosk-stats-"));
    try {
      const events = new JsonlStore(join(dir, "events"), "events");
      const leads = new JsonlStore(join(dir, "leads"), "leads");
      const today = new Date("2026-11-09T12:00:00Z");
      const yesterday = new Date("2026-11-08T12:00:00Z");
      await events.save({ name: "service_added", ref: "a", receivedAt: today.toISOString() });
      await events.save({ name: "service_added", ref: "a", receivedAt: today.toISOString() });
      await events.save({ name: "service_added", ref: "b", receivedAt: yesterday.toISOString() });
      await events.save({ name: "screen_view", screen: "/", receivedAt: yesterday.toISOString() });
      await leads.save({ id: "l1", receivedAt: today.toISOString() });

      const stats = await summarizeStats({ leads, events, payments: new NoopStore() }, { days: 3, today });
      assert.deepEqual(stats.days.map((d) => d.day), ["2026-11-07", "2026-11-08", "2026-11-09"]);
      assert.deepEqual(stats.days[2], { day: "2026-11-09", leads: 1, events: 2, payments: 0 });
      assert.deepEqual(stats.events, { service_added: 3, screen_view: 1 });
      assert.deepEqual(stats.topServices, [
        { ref: "a", count: 2 },
        { ref: "b", count: 1 },
      ]);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
