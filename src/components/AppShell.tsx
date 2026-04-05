"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Menu, X, TrendingUp } from "lucide-react";

const AUTH_ROUTES = ["/login", "/signup"];

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const isAuthPage = AUTH_ROUTES.includes(pathname);

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex bg-background min-h-screen">
      {/* Mobile Top Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 glass-navbar border-b border-outline z-[50] flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
           <TrendingUp className="text-primary w-6 h-6" />
           <span className="font-manrope text-lg font-bold">FinTrack</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 rounded-xl bg-surface-lowest text-on-surface-variant transition-colors active:scale-95"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="flex-1 lg:ml-64 p-6 md:p-10 pt-24 lg:pt-10 min-h-screen bg-background relative selection:bg-primary/30 w-full overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10 transition-colors duration-300" />
        <div className="fixed bottom-0 left-64 w-[400px] h-[400px] bg-secondary/5 blur-[100px] rounded-full pointer-events-none -z-10 transition-colors duration-300" />
        {children}
      </main>
    </div>
  );
};
