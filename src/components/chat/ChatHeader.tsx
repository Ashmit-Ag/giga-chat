'use client';

import { usePlan } from "@/contexts/PlanContext";
import { Settings, UserPlus2Icon } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

interface ChatHeaderProps {
  connected: boolean;
  partner?: {
    name: string;
    avatarUrl: string;
  } | null;
  user?: {
    name: string;
    avatarUrl: string;
  };
  partnerName?: string
  searchingText?: string
}

export default function ChatHeader({ connected, partner, user }: ChatHeaderProps) {
  const { state, loading, clearPlan } = usePlan();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const isFreePlan = state?.planName === "Free";

  return (
    <header className="h-16 border-b border-white/5 flex items-center justify-between px-4 bg-[#0e1326]">

      {/* LEFT SIDE */}
      <div className="flex items-center gap-3">
        {/* <img
          src={connected ? partner?.avatarUrl : user.avatarUrl}
          alt="avatar"
          className="w-9 h-9 rounded-full object-cover"
        /> */}

        <div className="flex flex-col">
          <div className="flex items-center gap-3 p-2 rounded-lg w-fit">
            {/* Avatar Circle */}
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 shadow-lg">
              <span className="text-white font-bold text-lg">
                {connected ? "M" : "M"}
              </span>
            </div>

            {/* Name and Status */}
            <div className="flex flex-col">
              <h2 className="text-white font-medium text-base leading-tight">
                Me
              </h2>
              {/* <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                {connected ? "MODERATOR" : "ME"}
              </span> */}
            </div>
          </div>

          {/* {connected && (
            <span className="text-[10px] text-green-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Live
            </span>
          )} */}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-3 relative">
        {connected ? (
          <button
            disabled={isFreePlan}
            className={`px-3 py-1.5 text-xs rounded-md font-medium transition
              ${isFreePlan
                ? "text-white/40 cursor-not-allowed"
                : "hover:bg-white/10 text-white"
              }`}
          >
            {<UserPlus2Icon />}
          </button>
        ) : (
          <>
            <button
              onClick={() => setSettingsOpen(v => !v)}
              className="w-8 h-8 flex items-center justify-center"
            >
              <Settings className="hover:text-white/80" />
            </button>

            {settingsOpen && (
              <div className="absolute right-0 top-10 w-40 bg-[#151a35] border border-white/10 rounded-md shadow-lg overflow-hidden">
                <button className="w-full px-3 py-2 text-sm text-left hover:bg-white/10">
                  Edit Username
                </button>
                <button className="w-full px-3 py-2 text-sm text-left hover:bg-white/10">
                  Edit Profile Pic
                </button>
                <button
                  onClick={async () => {
                    await signOut();
                    clearPlan()
                  }}
                  className="w-full px-3 py-2 text-sm text-left text-red-400 hover:bg-white/10">
                  Log Out
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
}
