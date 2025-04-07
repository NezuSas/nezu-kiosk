import { describe, it, vi, beforeEach, expect } from "vitest";
import { SocketService } from "./socket";
import io, { Socket } from "socket.io-client";

vi.mock("socket.io-client", () => {
  const once = vi.fn();
  const disconnect = vi.fn();

  const mockSocket = {
    once,
    disconnect,
  } as unknown as Socket;

  return {
    default: vi.fn(() => mockSocket),
  };
});

describe("SocketService", () => {
  const path = "/test";
  let service: SocketService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new SocketService(path);
  });

  it("should create a socket connection on connect()", () => {
    const socket = service.connect();
    expect(socket).toBeDefined();
  });

  it("should not create a new socket if already connected", () => {
    service.connect();
    service.connect();
    expect(io).toHaveBeenCalledTimes(1);
  });

  it("should disconnect the socket", () => {
    const socket = service.connect();
    service.disconnect();
    expect(socket.disconnect).toHaveBeenCalled();
  });
});