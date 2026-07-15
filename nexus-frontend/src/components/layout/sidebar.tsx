"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { AuraLogo } from "@/components/ui/logo";
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
  { name: "Logout", href: "/", icon: LogOut, textClass: "text-red-500" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen fixed top-0 left-0 border-r border-gray-100 bg-white/80 backdrop-blur-xl z-40 flex flex-col pt-6 pb-6 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      {/* Logo Area */}
      <Link href="/dashboard" className="flex items-center gap-3 px-6 mb-10 group">
        <AuraLogo size="sm" />
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-800 to-pink-600">
          Aura AI
        </span>
      </Link>

      {/* Main Navigation */}
      <div className="flex-1 px-4 space-y-2 overflow-y-auto">
        <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Main Menu</p>
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          
          return (
            <Link key={item.name} href={item.href} className="block relative">
              <div className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative z-10",
                isActive ? "text-purple-700 font-medium" : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
              )}>
                <Icon className={cn("w-5 h-5", isActive ? "text-purple-600" : "")} />
                {item.name}
              </div>
              
              {isActive && (
                <motion.div
                  layoutId="active-sidebar-tab"
                  className="absolute inset-0 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl shadow-sm -z-0"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom Navigation */}
      <div className="px-4 mt-auto space-y-1 pt-6 border-t border-gray-100">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.name} href={item.href} className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-gray-50 text-sm font-medium",
              item.textClass ? item.textClass : "text-gray-500 hover:text-gray-800"
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
