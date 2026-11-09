import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { JsonlLeadStore } from "../src/storage.js";

describe("JsonlLeadStore", () => {
  it("appends one JSON line per lead in a file per day and reads them back", async () => {
    const dir = await mkdtemp(join(tmpdir(), "kiosk-leads-"));
    try {
      const store = new JsonlLeadStore(join(dir, "nested", "leads"));
      const day = "2026-11-09";
      await store.save({ id: "a", receivedAt: `${day}T10:00:00.000Z`, contact: { name: "Ana" }, items: [] });
      await store.save({ id: "b", receivedAt: `${day}T11:00:00.000Z`, contact: { name: "Luis" }, items: [] });
      await store.save({ id: "c", receivedAt: "2026-11-10T09:00:00.000Z", contact: { name: "Eva" }, items: [] });

      const today = await store.list(new Date(`${day}T23:00:00Z`));
      assert.deepEqual(today.map((lead) => lead.id), ["a", "b"]);
      assert.deepEqual((await store.list(new Date("2026-11-10T00:00:00Z"))).map((lead) => lead.id), ["c"]);
      assert.deepEqual(await store.list(new Date("2020-01-01T00:00:00Z")), []);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
