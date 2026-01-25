import { io, Socket } from "socket.io-client";

let socket: Socket;

export function getSocket(userId?: string, gender?:string) {
  if (!socket) {
    const SOCKET_URL =
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://192.168.1.6:10000";

    socket = io(SOCKET_URL, {
      path: "/api/socket/io",
      transports: ["websocket"],
      upgrade: false,

      auth: {
        role: "user",
        userId: userId,
        gender: gender
      },

      withCredentials: true,
    });
  }

  return socket;
}
