"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { AnimatedLogo } from "@/components/ui/AnimatedLogo";
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  BookOpen, 
  Zap, 
  BarChart3, 
  History, 
  Settings, 
  UserCircle, 
  LogOut 
} from "lucide-react";
import { cn } from "@/lib/utils";

const mainNavItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "AI Employees", href: "/dashboard/employees", icon: Users },
  { name: "Start Business", href: "/dashboard/start", icon: Briefcase },
  { name: "Knowledge", href: "/dashboard/knowledge", icon: BookOpen },
  { name: "Automation", href: "/dashboard/automation", icon: Zap },
  { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
  { name: "History", href: "/dashboard/history", icon: History },
];

const bottomNavItems = [
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Profile", href: "/dashboard/profile", icon: UserCircle },
  { name: "Logout", href: "/", icon: LogOut, textClass: "text-[#FF6B81]" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[280px] h-[calc(100vh-2rem)] fixed top-4 left-4 z-40 flex flex-col pt-8 pb-6 aurora-glass">
      {/* Logo Area */}
      <Link href="/dashboard" className="flex items-center gap-3 px-6 mb-12 group">
        <AnimatedLogo size="md" withText={true} />
      </Link>

      {/* Main Navigation */}
      <div className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        <p className="px-4 text-[10px] font-bold text-[#0A121A]/40 uppercase tracking-widest mb-4">Main Menu</p>
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          
          return (
            <Link key={item.name} href={item.href} className="block relative group/navitem">
              <div className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 relative z-10",
                isActive ? "text-[#4F7CFF] font-medium" : "text-[#0A121A]/60 group-hover/navitem:text-[#4F7CFF]"
              )}>
                <Icon className={cn("w-5 h-5 transition-transform duration-300 group-hover/navitem:scale-110", isActive ? "text-[#4F7CFF]" : "")} />
                {item.name}
              </div>
              
              {isActive && (
                <motion.div
                  layoutId="active-sidebar-tab"
                  className="absolute inset-0 bg-gradient-to-r from-[#4F7CFF]/10 to-[#2FD9FF]/10 backdrop-blur-md border border-[#4F7CFF]/20 rounded-2xl shadow-[0_0_20px_rgba(79,124,255,0.15)] -z-0"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {!isActive && (
                <div className="absolute inset-0 bg-[#4F7CFF]/0 group-hover/navitem:bg-[#4F7CFF]/5 rounded-2xl transition-colors duration-300 -z-0" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom Navigation */}
      <div className="px-4 mt-auto space-y-1 pt-6 border-t border-white/20">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.name} href={item.href} className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 hover:bg-white/40 hover:shadow-sm text-sm font-medium",
              item.textClass ? item.textClass : "text-[#0A121A]/60 hover:text-[#0A121A]"
            )}>
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
