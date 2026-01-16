"use client";

import { ArrowBigRight } from "lucide-react";
import { useState } from "react";

interface Props {
  connected: boolean;
  onSend: (text: string) => void;
  onTyping: () => void;
}

export default function ChatInput({
  connected,
  onSend,
  onTyping,
}: Props) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="border-t border-white/5 p-4 bg-[#0e1326]">
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            onTyping();
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={!connected}
          placeholder="Reply to user..."
          className="flex-1 bg-[#0b0f1a] border border-white/10 rounded-xl px-4 py-3 outline-none disabled:opacity-40"
        />

        <button
          onClick={handleSend}
          disabled={!connected}
          className="px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40"
        >
          <ArrowBigRight />
        </button>
      </div>
    </div>
  );
}
