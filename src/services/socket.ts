import io, { Socket } from "socket.io-client";

export class SocketService {
  private socket: Socket | null = null;
  private readonly path: string;

  constructor(path: string) {
    this.path = path;
  }

  connect(): Socket {
    if (!this.socket) {
      this.socket = io(this.path);

      this.socket.once("connect", () => {
        console.log(`✅ Connected to ${this.path}`);
      });

      this.socket.once("disconnect", () => {
        console.log(`⚠️ Disconnected from ${this.path}`);
      });
    }

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log(`❌ Socket disconnected from ${this.path}`);
    }
  }

  getSocket(): Socket {
    return this.socket ?? this.connect();
  }
}

export const cartSocket = new SocketService("/cart");
export const formSocket = new SocketService("/form");