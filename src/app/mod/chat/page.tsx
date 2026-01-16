"use client";

import ModChatHeader from "../components/ModChatHeader";
import MessageList from "../components/MessageList";
import ChatInput from "../components/ChatInput";
import { useModChatSocket } from "@/hooks/useModChatSocket";

export default function ModChatPage() {
  const modName =
    "Moderator_" + Math.floor(Math.random() * 100);

  const {
    messages,
    connected,
    partnerName,
    isTyping,
    sendMessage,
    handleTyping,
    exitChat,
  } = useModChatSocket(modName);

  return (
    <div className="h-dvh bg-[#0b0f1a] text-white flex flex-col">
      <ModChatHeader onNext={exitChat} connected={connected} />

      <MessageList
        messages={messages}
        isTyping={isTyping}
        partnerName={partnerName}
      />

      <ChatInput
        connected={connected}
        onSend={sendMessage}
        onTyping={handleTyping}
      />
    </div>
  );
}
