import { useEffect, useRef, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Switch } from "@/components/ui/switch";
// import { ChevronDown, Flag, Sparkles, VenusAndMars } from "lucide-react";
import IdleUI from "./IdleUI";
import { RandomUserProfile } from "@/hooks/useModChatSocket";

type Message = {
  id: number;
  sender: "mod" | "user";
  type: "text" | "image" | "gift";
  text?: string;
  imageUrl?: string;
  amount?: number;
  currency?: "USD" | "EUR" | "INR";
};


interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
  partnerProfile: RandomUserProfile | null;
  searchingText: string | null;
  seconds: number;
  connected: boolean;
  chatStatus: "active" | "partner_skipped" | "me_skipped" | "idle"; // Added this
}

export default function MessageList({
  messages, isTyping, partnerProfile, searchingText, seconds, connected, chatStatus
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [openImage, setOpenImage] = useState<string | null | undefined>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });

    // console.log("MESSAGES", messages)
  }, [messages, isTyping, chatStatus]);

  const handleUnlockImage = (imageUrl: string, price: number) => {
    // 🔥 Call your gift/image/payment API here
    console.log("Unlock image:", imageUrl, "Price:", price);

    // example:
    // unlockPaidImage({ imageUrl, price })
  };


  return (
    <div className="flex-1 flex flex-col overflow-hidden p-4">
      <div className="flex-1 flex flex-col overflow-y-auto space-y-3 justify-end">
        <div className="flex-1 pt-50" />

        {messages.map((m) => {
          const isMe = m.sender === "user";

          return (
            <div
              key={m.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              {/* TEXT */}
              {m.type == "text" && (
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[70%] wrap-break-word ${isMe
                    ? "bg-indigo-600 text-white"
                    : "bg-white/10 text-white"
                    }`}
                >
                  {m.text}
                </div>
              )}

              {/* IMAGE */}
              {m.type === "image" && m.imageUrl && (() => {
                const { url, price } = parseImageText(m.imageUrl);
                const isLocked = typeof price === "number" && !isMe;

                if (!url) return null;

                return (
                  <div
                    className={`
                      relative rounded-2xl overflow-hidden max-w-[70%] border
                      ${isLocked
                        ? "border-amber-400/70 bg-amber-400/10"
                        : isMe
                          ? "border-indigo-500/40 cursor-pointer"
                          : "border-white/20 cursor-pointer"
                        }
                     `}
                    onClick={() => {
                      if (!isLocked) setOpenImage(url);
                    }}
                  >
                    <img
                      src={url}
                      alt="Shared image"
                      className={`max-h-64 object-cover transition
                        ${isLocked ? "blur-md scale-105" : "hover:opacity-90"}
                      `}
                                  />

                    {/* 🔒 LOCK OVERLAY */}
                    {isLocked && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnlockImage(url, price);
                        }}
                        className="
                          absolute inset-0 flex flex-col items-center justify-center
                          bg-black/50 hover:bg-black/60 transition
                          text-amber-300
                        "
                                    >
                        <div className="text-3xl mb-2">🔒</div>
                        <div className="text-sm font-semibold">
                          Unlock for {price}
                        </div>
                      </button>
                    )}
                  </div>
                );
              })()}


              {/* GIFT */}
              {m.type === "gift" && (
                <div
                  className="
                    px-4 py-3 rounded-2xl max-w-[70%]
                    flex flex-col items-center gap-1
                    bg-linear-to-r from-amber-500/30 via-yellow-400/30 to-amber-500/30
                    border border-amber-400/40
                    text-amber-100
                  "
                >
                  <span className="text-sm font-semibold">🎁 Gift</span>
                  <span className="text-xs">
                    {m.amount} {m.currency}
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {/* SKIPPED STATE UI */}
        {/* {!connected &&
          (chatStatus === "partner_skipped" || chatStatus === "idle") && (
            <div className=""><IdleUI chatStatus={chatStatus} /></div>

          )}

        {isTyping && chatStatus === "active" && (
          <p className="text-xs text-white/40 animate-pulse">{partnerName || "Partner"} is typing...</p>
        )} */}

        <div />
      </div>

      <div className="text-center text-white/50 pt-4 mb-14">
        {searchingText !== null ? (<>
          <span className="animate-pulse">Finding someone... {seconds}s</span><br></br>
          <span>{seconds > 30 && "Too slow?.. Get Premium for faster matches"}</span>
        </>
        ) : (
          !connected && chatStatus === "idle" && <><IdleUI chatStatus={chatStatus} /></>
        )}
        {!connected &&
          (chatStatus === "partner_skipped" || chatStatus === "me_skipped") && (
            <div className=""><IdleUI chatStatus={chatStatus} /></div>
          )}

        {isTyping && chatStatus === "active" && (
          <p className="text-xs text-white/40 animate-pulse">{partnerProfile?.name || "Partner"} is typing...</p>
        )}
      </div>
      {/* IMAGE MODAL */}
      {openImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
          onClick={() => setOpenImage(null)}
        >
          <div
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={openImage}
              alt="Full view"
              className="max-w-full max-h-[85vh] rounded-xl"
            />

            <button
              onClick={() => setOpenImage(null)}
              className="absolute top-2 right-2 bg-red-800/70 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black"
            >
              ✕
            </button>
          </div>
        </div>
      )}

    </div>
  );
}


const IMAGE_PRICE_MARKER = " + imagePrice=";

function parseImageText(text?: string) {
  if (!text) return { url: undefined, price: undefined };

  if (text.includes(IMAGE_PRICE_MARKER)) {
    const [url, priceStr] = text.split(IMAGE_PRICE_MARKER);
    return {
      url,
      price: Number(priceStr),
    };
  }

  return { url: text, price: undefined };
}
