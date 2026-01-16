import { Server as SocketIOServer, Socket } from "socket.io";

export type Role = "user" | "mod";

// In-memory state
export const freeMods = new Set<string>();
export const activeChats = new Map<string, string>();
export const searchTimeouts = new Map<string, NodeJS.Timeout>();

export const endChat = (io: SocketIOServer, socket: Socket) => {
  const partnerId = activeChats.get(socket.id);
  if (!partnerId) return;

  activeChats.delete(socket.id);
  activeChats.delete(partnerId);

  io.to(partnerId).emit("chat:ended");

  // Re-add mod to pool if they were the partner
  const partnerSocket = io.sockets.sockets.get(partnerId);
  if (partnerSocket?.data.role === "mod") {
    freeMods.add(partnerId);
  }
};

export const clearSearch = (socketId: string) => {
  const timeout = searchTimeouts.get(socketId);
  if (timeout) {
    clearTimeout(timeout);
    searchTimeouts.delete(socketId);
  }
};