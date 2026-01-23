'use client';

import { Menu, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header({ activeTab, setSidebarOpen }: any) {
  return (
    <header className="h-16 shrink-0 flex items-center justify-between px-6 bg-[#0e1326] border-b border-white/10">
      <div className="flex items-center gap-3">
        <Button size="icon" variant="ghost" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
          <Menu />
        </Button>
        <span className="text-xs uppercase tracking-widest text-white/80">
          System / {activeTab}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <Button size="icon" variant="ghost" className="text-white/40">
          <Bell size={20} />
        </Button>
        <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold">
          AD
        </div>
      </div>
    </header>
  );
}
