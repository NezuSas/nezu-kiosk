import express from "express";
import http from "http";
import { Server as SocketServer } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

const sessions = new Map();

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("register_session", (sessionId) => {
    console.log("✅ Sesión registrada:", sessionId);
    sessions.set(sessionId, socket.id);
  });

  socket.on("message", (data) => {
    console.log("📩 Datos recibidos del formulario:", data);
    
    const kioskSocketId = sessions.get(data.sessionId);

    if (kioskSocketId) {
      io.to(kioskSocketId).emit("message", data);
      console.log("📤 Datos enviados al kiosko:", data);
    } else {
      console.log("⚠️ No se encontró el kiosko para esta sesión.");
    }
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

server.listen(4000, () => console.log("Server on port 4000"));