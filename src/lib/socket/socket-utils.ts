import { Server as SocketIOServer, Socket } from "socket.io";

export type Role = "user" | "mod";

// ==============================
// In-memory state
// ==============================

// Mods available for matchmaking
export const freeMods = new Set<string>();

// socket.id -> partner socket.id
export const activeChats = new Map<string, string>();

// socket.id -> matchmaking timeout
export const searchTimeouts = new Map<string, NodeJS.Timeout>();

// ==============================
// Clear matchmaking search
// ==============================
export const clearSearch = (socketId: string) => {
  const timeout = searchTimeouts.get(socketId);
  if (timeout) {
    clearTimeout(timeout);
    searchTimeouts.delete(socketId);
  }
};

// ==============================
// End chat & cleanup room
// ==============================
export const endChat = (io: SocketIOServer, socket: Socket) => {
  const partnerId = activeChats.get(socket.id);
  const roomId = socket.data.roomId;

  if (!partnerId || !roomId) return;

  const partnerSocket = io.sockets.sockets.get(partnerId);

  // 🔔 Notify both
  io.to(roomId).emit("chat:ended");

  // 🚪 Leave room
  socket.leave(roomId);
  partnerSocket?.leave(roomId);

  // 🧹 Cleanup
  activeChats.delete(socket.id);
  activeChats.delete(partnerId);

  socket.data.roomId = null;
  if (partnerSocket) partnerSocket.data.roomId = null;

  // ♻️ Re-queue mods
  if (socket.data.role === "mod") freeMods.add(socket.id);
  if (partnerSocket?.data.role === "mod") freeMods.add(partnerId);
};
