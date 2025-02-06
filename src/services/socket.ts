import io, { Socket } from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;
  private path: string;

  constructor(path: string) {
    this.path = path;
  }

  connect() {
    if (!this.socket) {
      this.socket = io(this.path);
      
      // Manejar reconexión
      this.socket.on("connect", () => {
        console.log("🔗 Socket conectado");
      });

      this.socket.on("disconnect", () => {
        console.log("🔌 Socket desconectado");
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket() {
    if (!this.socket) {
      return this.connect();
    }
    return this.socket;
  }
}

export const cartSocket = new SocketService("/cart");
export const formSocket = new SocketService("/form");