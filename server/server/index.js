import express from "express";
import http from "http";
import { Server as SocketServer } from "socket.io";
import compression from "compression";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: "*", // Permitir todos los orígenes para el túnel
    methods: ["GET", "POST"],
  },
  // Configuraciones de reconexión optimizadas para túneles
  connectTimeout: 45000,
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Optimizar la compresión
app.use(compression({
  level: 6,
  threshold: 0,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

// Optimizar static files
const staticOptions = {
  maxAge: '1y',
  etag: true,
  lastModified: true,
  cacheControl: true,
  immutable: true,
  headers: {
    'Cache-Control': 'public, max-age=31536000, immutable'
  }
};

app.use(express.static("public", staticOptions));

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  credentials: true
}));

// Mejorar el manejo de archivos comprimidos
app.use(express.static("public", {
  setHeaders: (res, path) => {
    // Agregar headers de cache
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

    if (path.endsWith(".br")) {
      res.setHeader("Content-Encoding", "br");
      res.setHeader("Content-Type", "application/javascript");
    }
    if (path.endsWith(".gz")) {
      res.setHeader("Content-Encoding", "gzip");
      res.setHeader("Content-Type", "application/javascript");
    }
  },
}));

// Usar WeakMap para mejor manejo de memoria
const sessions = new WeakMap();

// Mejorar el manejo de sesiones
class SessionManager {
  constructor() {
    this.sessions = new Map();
    this.cleanupInterval = setInterval(() => this.cleanup(), 1800000); // 30 minutos
  }

  addSession(sessionId, socketId) {
    this.sessions.set(sessionId, {
      socketId,
      timestamp: Date.now()
    });
  }

  getSocketId(sessionId) {
    const session = this.sessions.get(sessionId);
    return session?.socketId;
  }

  removeSession(sessionId) {
    this.sessions.delete(sessionId);
  }

  cleanup() {
    const now = Date.now();
    for (const [sessionId, session] of this.sessions.entries()) {
      if (now - session.timestamp > 3600000) { // 1 hora
        this.sessions.delete(sessionId);
      }
    }
  }
}

const sessionManager = new SessionManager();

io.on("connection", (socket) => {
  console.log("Client connected");

  // Manejar reconexiones
  socket.on("reconnect_attempt", () => {
    console.log("Cliente intentando reconectar");
  });

  socket.on("register_session", (sessionId) => {
    console.log("✅ Sesión registrada:", sessionId);
    sessionManager.addSession(sessionId, socket.id);
  });

  socket.on("message", (data) => {
    console.log("📩 Datos recibidos del formulario:", data);

    const kioskSocketId = sessionManager.getSocketId(data.sessionId);

    if (kioskSocketId) {
      io.to(kioskSocketId).emit("message", data);
      console.log("📤 Datos enviados al kiosko:", data);
    } else {
      console.log("⚠️ No se encontró el kiosko para esta sesión.");
    }
  });

  socket.on("disconnect", (reason) => {
    console.log("Cliente desconectado:", reason);
    for (const [sessionId, session] of sessionManager.sessions.entries()) {
      if (session.socketId === socket.id) {
        sessionManager.removeSession(sessionId);
        break;
      }
    }
  });

  // Manejar errores
  socket.on("error", (error) => {
    console.error("Error de socket:", error);
  });
});

// Manejo de errores del servidor
server.on('error', (error) => {
  console.error('Error del servidor:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Error no capturado:', error);
});

server.listen(4000, () => console.log("Server on port 4000"));