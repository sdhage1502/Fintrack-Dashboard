"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  BarChart3, 
  Settings, 
  LogOut,
  TrendingUp,
  ShieldCheck,
  User,
  PieChart,
  UserCircle
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ThemeToggle } from "./ThemeToggle";
import { logoutUser } from "@/lib/auth";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Transactions", href: "/transactions", icon: ArrowLeftRight },
  { name: "Insights", href: "/insights", icon: PieChart },
  { name: "Budgeting", href: "/budgeting", icon: BarChart3 },
];

const adminNavItems = [
  { name: "Admin Panel", href: "/admin", icon: ShieldCheck },
];

const secondaryNavItems = [
  { name: "Profile", href: "/profile", icon: UserCircle },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  
  const role = user?.role || "user";

  const handleSignOut = async () => {
    try {
      await logoutUser();
      toast.success("Logged out successfully!");
      router.push("/login");
    } catch (error) {
      console.error("Sign out failed:", error);
      toast.error("Failed to sign out.");
    }
  };



  // Close on mobile navigation
  React.useEffect(() => {
    if (onClose) onClose();
  }, [pathname]);

  // Do not render sidebar on login/signup pages
  if (pathname === "/login" || pathname === "/signup") return null;

  return (
    <>
      <aside className={cn(
        "w-64 h-screen fixed left-0 top-0 glass-sidebar flex flex-col p-6 z-[60] transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Brand */}
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-3 group cursor-pointer transition-transform duration-300 hover:scale-105">
            <div className="w-10 h-10 bg-luminous-gradient rounded-xl flex items-center justify-center glow-emerald">
              <TrendingUp className="text-background w-6 h-6" />
            </div>
            <span className="font-manrope text-2xl font-bold tracking-tight text-on-surface">
              FinTrack
            </span>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden p-2 rounded-xl bg-surface-lowest text-on-surface-variant"
          >
            <LogOut className="w-5 h-5 rotate-180" />
          </button>
        </div>

      {/* Role Highlighter (New) */}
      {user && (
        <div className="mx-2 mb-8 space-y-4">
           {/* Prominent Role Badge */}
           <div 
             className={cn(
             "p-4 rounded-[24px] border transition-all duration-500 relative overflow-hidden",
             role === "admin" ? "bg-primary/10 border-primary/20 glow-emerald" : 
             role === "viewer" ? "bg-purple-500/10 border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.1)]" :
             "bg-blue-500/10 border-blue-500/20"
           )}>
             <div className="relative z-10">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 mb-1">Current Session</p>
                <div className="flex items-center gap-2">
                   <div className={cn(
                     "w-2 h-2 rounded-full animate-pulse",
                     role === "admin" ? "bg-primary" : role === "viewer" ? "bg-purple-500" : "bg-blue-500"
                   )} />
                   <h4 className={cn(
                     "font-manrope font-black text-lg uppercase tracking-tight",
                     role === "admin" ? "text-primary text-glow-primary" : 
                     role === "viewer" ? "text-purple-400" : "text-blue-400"
                   )}>{role}</h4>
                </div>
             </div>
           </div>

           <Link href="/profile" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-surface-low transition-colors group">
              <div className="w-10 h-10 rounded-full bg-surface-highest flex items-center justify-center p-0.5 border border-outline/5 overflow-hidden">
                <User className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" />
              </div>
              <div className="min-w-0">
                <p className="font-manrope font-bold text-sm text-on-surface truncate leading-tight">{user.name}</p>
                <p className="text-[10px] text-on-surface-variant/40 truncate">{user.email}</p>
              </div>
           </Link>
        </div>
      )}

      <nav className="flex-1 space-y-2 overflow-y-auto pr-2">
        <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest mb-4 px-2 opacity-50">
          Main Menu
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group",
                isActive 
                  ? "bg-surface-high border border-outline shadow-lg glow-emerald" 
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-low"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-colors duration-300",
                isActive ? "text-primary scale-110" : "group-hover:text-primary"
              )} />
              <span className={cn(
                "font-medium tracking-tight",
                isActive ? "text-on-surface" : ""
              )}>
                {item.name}
              </span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}

        {/* Admin-only nav items */}
        {role === "admin" && (
          <>
            <div className="pt-4">
              <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest mb-4 px-2 opacity-50">
                Administration
              </p>
            </div>
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group",
                    isActive 
                      ? "bg-primary/10 border border-primary/20 shadow-lg text-primary" 
                      : "text-primary/70 hover:text-primary hover:bg-primary/5"
                  )}
                >
                  <item.icon className={cn(
                    "w-5 h-5 transition-colors duration-300",
                    isActive ? "text-primary scale-110" : "group-hover:text-primary"
                  )} />
                  <span className="font-bold tracking-tight">{item.name}</span>
                </Link>
              );
            })}
          </>
        )}

        <div className="pt-8">
          <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest mb-4 px-2 opacity-50">
            Account
          </p>
          <div className="space-y-1">
            {secondaryNavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group",
                  pathname === item.href
                    ? "bg-surface-high border border-outline text-on-surface"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-low"
                )}
              >
                <item.icon className="w-5 h-5 group-hover:text-primary transition-colors" />
                <span className="font-medium tracking-tight">{item.name}</span>
              </Link>
            ))}
          </div>
          <div className="mt-4 p-2 bg-surface-lowest/50 rounded-2xl border border-outline/5 space-y-1">
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="mt-auto border-t border-outline pt-6">
        <button 
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl text-on-surface-variant hover:text-rose-500 hover:bg-rose-500/10 transition-all duration-300 group"
        >
          <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
    {/* Mobile Overlay */}
    {isOpen && (
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[55] lg:hidden"
        onClick={onClose}
      />
    )}
  </>
);
};
