import { describe, expect, it, vi } from "vitest";
import { createHttpEventSink } from "./httpEventSink";

const okResponse = () => Promise.resolve({ ok: true } as Response);
const callOf = (mock: { mock: { calls: unknown[][] } }, index: number) => mock.mock.calls[index] as unknown as [string, RequestInit];

describe("httpEventSink", () => {
  it("sends a batch as soon as it reaches the batch size and stamps each event", async () => {
    const fetchImpl = vi.fn(okResponse);
    const sink = createHttpEventSink({ url: "https://srv.test", kioskId: "k1", batchSize: 2, fetchImpl, now: () => new Date("2026-11-09T22:00:00Z") });
    sink.track({ name: "screen_view", screen: "/" });
    expect(fetchImpl).not.toHaveBeenCalled();
    sink.track({ name: "service_added", ref: "living-escenas" });
    await vi.waitFor(() => expect(fetchImpl).toHaveBeenCalledTimes(1));
    const [url, init] = callOf(fetchImpl, 0);
    expect(url).toBe("https://srv.test/api/events");
    const body = JSON.parse(String(init.body));
    expect(body.kioskId).toBe("k1");
    expect(body.events).toHaveLength(2);
    expect(body.events[0].at).toBe("2026-11-09T22:00:00.000Z");
  });

  it("keeps events when the server is unreachable and retries later", async () => {
    vi.useFakeTimers();
    const fetchImpl = vi.fn().mockRejectedValueOnce(new Error("offline")).mockImplementation(okResponse);
    const sink = createHttpEventSink({ url: "", kioskId: "k", intervalMs: 1000, batchSize: 10, fetchImpl });
    sink.track({ name: "idle_reset" });
    await vi.advanceTimersByTimeAsync(1000);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1000);
    expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(JSON.parse(String(callOf(fetchImpl, 1)[1].body)).events).toHaveLength(1);
    await vi.advanceTimersByTimeAsync(5000);
    expect(fetchImpl).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });

  it("caps the queue", async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new Error("offline"));
    const sink = createHttpEventSink({ url: "", kioskId: "k", batchSize: 1000, maxQueue: 5, fetchImpl, intervalMs: 100_000 });
    for (let index = 0; index < 20; index += 1) sink.track({ name: "screen_view", ref: String(index) });
    await sink.flush();
    const body = JSON.parse(String(callOf(fetchImpl, 0)[1].body));
    expect(body.events.map((event: { ref: string }) => event.ref)).toEqual(["15", "16", "17", "18", "19"]);
  });
});
