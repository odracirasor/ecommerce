// frontend/src/socket.js
import { io } from "socket.io-client";

// Ajuste a URL para seu backend Socket.IO (exemplo localhost:5000)
const socket = io("http://localhost:5000", {
  autoConnect: false, // conectar manualmente no código
  transports: ["websocket"],
});

export default socket;
