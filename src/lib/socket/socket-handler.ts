import { Server as SocketIOServer, Socket } from "socket.io";
import {
  modLoads,
  MAX_CHATS_PER_MOD,
  activeChats,
  searchTimeouts,
  endChat,
  clearSearch
} from "./socket-utils";

type ChatPayload =
  | {
    type: "text";
    content: string;
    roomId: string
  }
  | {
    type: "image";
    content: string; // hosted image URL
    roomId: string
  }


type GiftPayload = {
  type: "gift";
  amount: number;
  currency: "USD" | "EUR" | "INR";
  giftId?: string;
  roomId: string
};


export const handleUserNext = (io: SocketIOServer, socket: Socket) => {
  if (socket.data.role !== "user") return;

  // console.log("MESSAGE NEXT MOD")

  clearSearch(socket.id);
  // endChat(io, socket);
  // freeMods.delete(socket.id);

  // Matchmaking delay: 3-12 minutes based on your code (3*60*10 to 12*60*10)
  // Note: Your original math was (min 3000ms to 7200ms). Adjust if needed.
  const min = 3 * 60 * 10;
  const max = 12 * 60 * 10;
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;

  socket.emit("match:searching", delay);

  const timeout = setTimeout(() => {
    // const modSocketId = [...freeMods].find((id) => id !== socket.id);
    const modSocketId = [...modLoads.entries()]
  .filter(([_, count]) => count < MAX_CHATS_PER_MOD)
  .sort((a, b) => a[1] - b[1])[0]?.[0];
    if (!modSocketId) {
      socket.emit("no-mod-available");
      return;
    }
    
    const modSocket = io.sockets.sockets.get(modSocketId);
    if (!modSocket) return;
    
    // 🔑 CREATE ROOM
    const roomId = `chat_${socket.id}_${modSocketId}`;
    
    // 🔑 JOIN ROOM (THIS WAS MISSING)
    socket.join(roomId);
    modSocket.join(roomId);
    
    // 🔑 STORE ROOM ID
    socket.data.rooms.add(roomId);
    modSocket.data.rooms.add(roomId);
    
    // 🔑 TRACK ACTIVE CHAT
    activeChats.set(roomId, {
      userId: socket.id,
      modId: modSocketId,
    });

    modLoads.set(modSocketId, (modLoads.get(modSocketId) ?? 0) + 1);
    
    // 🔔 NOTIFY BOTH SIDES
    socket.emit("chat:connected", { roomId });

    modSocket.emit("mod:new-chat", {
      roomId,
      userId: socket.id,
      userPlan: socket.data.username
    });
    
    console.log("ROOM CREATED:", roomId);
    
  }, delay);

  searchTimeouts.set(socket.id, timeout);
};

export const handleMessage = (
  io: SocketIOServer,
  socket: Socket,
  payload: ChatPayload
) => {
  const { type, content } = payload;
  if (!content) {
    console.log("ERROR NO CONTENT")
    return
  };

  const roomId = payload.roomId;
  if (!roomId) {
    console.log("ERROR NO ROOM ID")
    return
  };
  
  console.log("MESSAGE SENT")
  io.to(roomId).emit("chat:message", {
    id: Date.now(),
    sender: socket.data.role,
    type,
    text: content,
    roomId
  });
};


export const handleGiftMessage = (io: SocketIOServer, socket: Socket, payload: GiftPayload) => {
  const { amount, currency, giftId } = payload;

  if (!amount || amount <= 0) return;

  const roomId = payload.roomId;
  if (!roomId) {
    console.log("NO ROOM ID GIFT", payload)
    return
  };

  io.to(roomId).emit("chat:gift", {
    id: Date.now(),
    sender: socket.data.role,
    type: "gift",
    amount,
    currency,
    giftId,
    roomId
  });
};

