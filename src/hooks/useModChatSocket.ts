"use client";

import { useEffect, useRef, useState } from "react";
import { getSocket } from "@/lib/socket/socket-mod";

export type Message = {
  id: number;
  sender: "me" | "them";
  text: string;
};

export function useModChatSocket(modName: string) {
  const socketRef = useRef(getSocket());
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState(false);
  const [partnerName, setPartnerName] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const socket = socketRef.current;

    // 🔌 MOD ONLINE
    socket.emit("mod:online", { modName });

    // 🔗 CONNECTED TO USER
    socket.on("chat:connected", () => {
      setMessages([]);
      setConnected(true);
      setPartnerName("USER");
    });

    // 📩 RECEIVE MESSAGE FROM USER
    socket.on("chat:message", (msg) => {
      setMessages((prev) => [
        ...prev,
        {
          id: msg.id ?? Date.now(),
          sender: "them",
          text: msg.text,
        },
      ]);
    });

    // ✍️ TYPING INDICATORS
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop:typing", () => setIsTyping(false));

    // ❌ CHAT ENDED
    socket.on("chat:ended", () => {
      setConnected(false);
      setPartnerName(null);
      setMessages([]);
    });

    return () => {
      socket.off("chat:connected");
      socket.off("chat:message");
      socket.off("typing");
      socket.off("stop:typing");
      socket.off("chat:ended");
    };
  }, [modName]);

  // 📤 SEND MESSAGE TO USER
  const sendMessage = (text: string) => {
    if (!text.trim() || !connected) return;

    // Optimistic UI
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "me",
        text,
      },
    ]);

    // ✅ CORRECT PAYLOAD (MATCHES SERVER)
    socketRef.current.emit("chat:message", {
      type: "text",
      content: text,
    });

    socketRef.current.emit("stop:typing");
  };

  // ✍️ HANDLE TYPING
  const handleTyping = () => {
    socketRef.current.emit("typing");

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    typingTimeout.current = setTimeout(() => {
      socketRef.current.emit("stop:typing");
    }, 800);
  };

  // ⏭ EXIT / NEXT CHAT
  const exitChat = () => {
    socketRef.current.emit("chat:next");
    socketRef.current.emit("stop:typing");

    setMessages([]);
    setConnected(false);
    setPartnerName(null);
  };

  return {
    messages,
    connected,
    partnerName,
    isTyping,
    sendMessage,
    handleTyping,
    exitChat,
  };
}
