"use client";

import { useEffect, useRef } from "react";
import { Message } from "@/hooks/useModChatSocket";

interface Props {
  messages: Message[];
  isTyping: boolean;
  partnerName: string | null;
}

export default function MessageList({
  messages,
  isTyping,
  partnerName,
}: Props) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((m) => (
        <div
          key={m.id}
          className={`flex ${
            m.sender === "me" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`px-4 py-2 rounded-2xl max-w-[70%] ${
              m.sender === "me"
                ? "bg-indigo-600"
                : "bg-white/10"
            }`}
          >
            {m.text}
          </div>
        </div>
      ))}

      {isTyping && (
        <p className="text-xs text-white/40">
          {partnerName} is typing...
        </p>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
