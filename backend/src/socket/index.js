import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import matchingService from "../services/matchingService.js";

export default function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  // Authentication Middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id; // From the decoded JWT payload
      next();
    } catch (err) {
      return next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id} (User: ${socket.userId})`);

    socket.on("find_match", async (criteria) => {
      // criteria = { difficulty, topic }
      await matchingService.handleFindMatch(io, socket, criteria);
    });

    socket.on("cancel_match", () => {
      matchingService.removeFromQueue(socket.id);
    });

    socket.on("create_friend_match", async (criteria) => {
      await matchingService.handleCreateFriendMatch(io, socket, criteria);
    });

    socket.on("join_friend_match", async ({ code }) => {
      await matchingService.handleJoinFriendMatch(io, socket, code);
    });

    // Real-Time Collaborative Session Rooms
    socket.on("join_session", (sessionId) => {
      socket.join(sessionId);
      console.log(`User ${socket.userId} joined session room: ${sessionId}`);
      socket.to(sessionId).emit("peer_status", { userId: socket.userId, status: "online" });
    });

    socket.on("code_change", ({ sessionId, update }) => {
      socket.to(sessionId).emit("code_update", update);
    });

    socket.on("yjs_sync_req", (sessionId) => {
      socket.to(sessionId).emit("yjs_sync_req", { socketId: socket.id });
    });

    socket.on("yjs_sync_res", ({ targetSocketId, update, language }) => {
      io.to(targetSocketId).emit("yjs_sync_res", { update, language });
    });

    socket.on("language_change", ({ sessionId, language }) => {
      socket.to(sessionId).emit("language_update", { language });
    });

    socket.on("chat_message", ({ sessionId, text }) => {
      socket.to(sessionId).emit("chat_update", {
        userId: socket.userId,
        text,
        timestamp: new Date()
      });
    });

    socket.on("call_signal", ({ sessionId, type, payload }) => {
      socket.to(sessionId).emit("call_signal", {
        userId: socket.userId,
        type,
        payload
      });
    });

    // Relay mic/camera mute state to the partner (used by PeerJS flow)
    socket.on("media_status", ({ sessionId, mediaType, enabled }) => {
      socket.to(sessionId).emit("media_status", { mediaType, enabled });
    });

    socket.on("leave_session", (sessionId) => {
      socket.leave(sessionId);
      console.log(`User ${socket.userId} left session room: ${sessionId}`);
      socket.to(sessionId).emit("peer_status", { userId: socket.userId, status: "offline" });
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
      matchingService.removeFromQueue(socket.id);
    });
  });
}
