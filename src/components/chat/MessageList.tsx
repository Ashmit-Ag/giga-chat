import { useEffect, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import { Switch } from "@/components/ui/switch";
// import { ChevronDown, Flag, Sparkles, VenusAndMars } from "lucide-react";
import IdleUI from "./IdleUI";

type Message = { 
  id: number; 
  sender: "me" | "them"; 
  text: string; 
  type?: "text" | "image";
};

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
  partnerName: string | null;
  searchingText: string | null;
  seconds: number;
  connected: boolean;
  chatStatus: "active" | "partner_skipped" | "me_skipped" | "idle"; // Added this
}

export default function MessageList({ 
  messages, isTyping, partnerName, searchingText, seconds, connected, chatStatus 
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, chatStatus]);
 
  return (
    <div className="flex-1 flex flex-col overflow-hidden p-4">
      <div className="flex-1 flex flex-col overflow-y-auto space-y-3 justify-end">
        <div className="flex-1 pt-50" />

        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender === "me" ? "justify-end" : "justify-start"}`}>
            <div className={`px-4 py-2 rounded-2xl max-w-[70%] ${
              m.sender === "me" ? "bg-indigo-600 text-white" : "bg-white/10 text-white"
            }`}>
              {m.text}
            </div>
          </div>
        ))}

        {/* SKIPPED STATE UI */}
        {!connected &&
        (chatStatus === "partner_skipped" || chatStatus === "me_skipped") && (
          <IdleUI chatStatus={chatStatus}/>
        
      )}

        {isTyping && chatStatus === "active" && (
          <p className="text-xs text-white/40 animate-pulse">{partnerName || "Partner"} is typing...</p>
        )}
        
        <div ref={bottomRef} />
      </div>

      <div className="text-center text-white/50 pt-4 mb-14">
        {searchingText !== null ? (
          <span className="animate-pulse">Finding someone... {seconds}s</span>
        ) : (
          !connected && chatStatus === "idle" && "Click below to find someone!"
        )}
      </div>
    </div>
  );
}