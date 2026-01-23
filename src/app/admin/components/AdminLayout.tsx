'use client';

import { ReactNode, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AdminLayout({
  children,
  activeTab,
  setActiveTab
}: {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (v: string) => void;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-full overflow-hidden flex bg-[#0b0f1a] text-white">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <Header activeTab={activeTab} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 p-6 min-h-0">
          {children}
        </div>
      </main>
    </div>
  );
}
