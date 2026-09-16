import { io } from "socket.io-client";
import { getToken } from "./auth";

let socket;

export const initSocket = () => {
  if (socket) return socket;

  const token = getToken();
  if (!token) {
    console.error("No auth token available for socket connection");
    return null;
  }

  socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", {
    auth: { token },
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) return initSocket();
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
