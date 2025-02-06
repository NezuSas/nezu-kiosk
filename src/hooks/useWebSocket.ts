import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useLocation } from "react-router-dom";

export const useWebSocket = () => {
  const location = useLocation();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (location.pathname === "/cart") {
      console.log("📡 Conectando a WebSocket en /cart...");
      const newSocket = io("http://localhost:4000");
      setSocket(newSocket);

      return () => {
        console.log("🔌 Desconectando WebSocket en /cart...");
        newSocket.disconnect();
      };
    } else {
      setSocket(null);
    }
  }, [location.pathname]);

  return socket;
};