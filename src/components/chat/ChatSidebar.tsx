"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { Button } from "../ui/button";

interface Session {
  id: string;
  name: string;
  avatar?: string;
}

interface SidebarProps {
  sessions: Session[];
  activeId?: string;
  onSelect?: (id: string) => void;
}

export default function Sidebar({
  sessions,
  activeId,
  onSelect,
}: SidebarProps) {
  const [open, setOpen] = useState(false);

  const onLogout = async () => {
    await signOut();
    redirect("/login");
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg"
      >
        <Menu className="text-white" />
      </button>

      {/* Overlay (Mobile) */}
      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static top-0 left-0 z-50
          h-full w-72
          bg-linear-to-b from-[#0f1222] to-[#070914]
          border-r border-white/10
          backdrop-blur-xl
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <span className="text-sm text-white/70 font-semibold uppercase">
            Basic
          </span>

          <button
            className="lg:hidden text-white/60 hover:text-white"
            onClick={() => setOpen(false)}
          >
            <X />
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1 scrollbar-thin scrollbar-thumb-white/10">
          {sessions.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                onSelect?.(s.id);
                setOpen(false);
              }}
              className={`
                w-full flex items-center gap-3
                px-3 py-2 rounded-lg text-left
                transition-colors
                ${
                  activeId === s.id
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }
              `}
            >
              <div className="w-8 h-8 rounded-full bg-indigo-500/30 flex items-center justify-center text-xs text-white">
                {s.avatar ?? s.name.charAt(0).toUpperCase()}
              </div>
              <span className="truncate text-sm">{s.name}</span>
            </button>
          ))}
        </div>

        <div className="border-t border-white/10 p-3 space-y-2">
        <Button
          onClick={onLogout}
          className="cursor-pointer border-white/10 hover:bg-red-500/10 hover:text-red-400"
        >
          Log out
        </Button>
        </div>
      </aside>
    </>
  );
}
