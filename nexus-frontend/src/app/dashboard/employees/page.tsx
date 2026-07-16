"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Plus, Users, MessageSquare, Shield, Box, Search, Mail, 
  Settings, UserPlus
} from "lucide-react";
import Link from "next/link";

export default function EmployeesPage() {
  const activeEmployees = [
    { name: "Planner Agent", role: "Strategy & Direction", icon: Users, status: "Active" },
    { name: "Marketing Agent", role: "Growth & Content", icon: MessageSquare, status: "Active" },
    { name: "Finance Agent", role: "Numbers & Forecast", icon: Shield, status: "Active" },
  ];

  const availableEmployees = [
    { name: "Customer Support Agent", icon: MessageSquare, desc: "Handles Zendesk, Intercom, and email support 24/7." },
    { name: "Inventory Agent", icon: Box, desc: "Monitors stock levels and automates reordering." },
    { name: "Legal Agent", icon: Shield, desc: "Drafts contracts and reviews compliance." },
    { name: "Sales Agent", icon: UserPlus, desc: "Qualifies leads and schedules meetings." },
    { name: "Research Agent", icon: Search, desc: "Analyzes market trends and competitors." },
    { name: "Email Agent", icon: Mail, desc: "Manages inbox and drafts responses." },
    { name: "Automation Agent", icon: Settings, desc: "Connects APIs and streamlines workflows." },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0A121A] mb-2 tracking-tight">AI Employees</h1>
          <p className="text-[#0A121A]/60 font-medium">Manage your active workforce and hire new specialized agents.</p>
        </div>
        <Button className="rounded-xl h-12 px-6 bg-gradient-to-r from-[#4F7CFF] to-[#2FD9FF] hover:opacity-90 text-white font-bold shadow-[0_10px_30px_rgba(79,124,255,0.3)] transition-all transform hover:-translate-y-0.5 border-0">
          <Plus className="w-5 h-5 mr-2" /> Create Custom Agent
        </Button>
      </div>

      {/* Active Employees */}
      <section>
        <h2 className="text-xl font-bold text-[#0A121A] mb-6">Active Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeEmployees.map((agent, idx) => {
             const Icon = agent.icon;
             return (
               <motion.div 
                 key={idx}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: idx * 0.1 }}
                 className="relative overflow-hidden p-6 border border-white/60 flex items-center justify-between hover:shadow-[0_20px_40px_rgba(79,124,255,0.1)] hover:-translate-y-1 hover:border-[#4F7CFF]/40 transition-all duration-500 group cursor-pointer bg-white/40 backdrop-blur-3xl rounded-[24px]"
               >
                 {/* Inner animated gradient background on hover */}
                 <div className="absolute inset-0 bg-gradient-to-r from-[#4F7CFF]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                 
                 <div className="relative z-10 flex items-center gap-4">
                   <div className="w-14 h-14 rounded-2xl bg-white/80 flex items-center justify-center border border-white/60 group-hover:border-[#4F7CFF]/40 transition-all duration-500 shadow-sm group-hover:scale-110">
                     <Icon className="w-6 h-6 text-[#4F7CFF] transition-colors duration-500" />
                   </div>
                   <div>
                     <h3 className="font-bold text-[#0A121A] group-hover:text-[#4F7CFF] transition-colors duration-300 text-lg">{agent.name}</h3>
                     <p className="text-sm font-medium text-[#0A121A]/50">{agent.role}</p>
                   </div>
                 </div>
                 <Link href="/dashboard/chat" className="relative z-10 px-6 py-2 bg-white/60 text-[#4F7CFF] rounded-full text-sm font-bold border border-white/60 hover:bg-white hover:text-[#7B5CFF] hover:shadow-sm transition-all duration-300">
                   Chat
                 </Link>
               </motion.div>
             )
          })}
        </div>
      </section>

      {/* Hire Employees */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#0A121A] mb-2">Hire Employee</h2>
          <p className="text-sm font-medium text-[#0A121A]/60">Expand your workforce with these specialized AI agents.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {availableEmployees.map((agent, idx) => {
            const Icon = agent.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="relative overflow-hidden bg-white/40 backdrop-blur-3xl rounded-[24px] p-8 border border-white/60 hover:shadow-[0_20px_40px_rgba(123,92,255,0.1)] hover:-translate-y-1 hover:border-[#7B5CFF]/40 transition-all duration-500 group flex flex-col cursor-pointer"
              >
                {/* Magical animated background glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#7B5CFF]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                
                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-14 h-14 rounded-2xl bg-white/60 flex items-center justify-center mb-6 border border-white/60 group-hover:bg-[#7B5CFF]/10 group-hover:border-[#7B5CFF]/30 transition-all duration-500 shadow-sm group-hover:scale-110">
                    <Icon className="w-6 h-6 text-[#0A121A]/40 group-hover:text-[#7B5CFF] transition-colors duration-500" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0A121A] mb-2 group-hover:text-[#7B5CFF] transition-colors">{agent.name}</h3>
                  <p className="text-sm text-[#0A121A]/60 font-medium flex-1 mb-8 leading-relaxed">{agent.desc}</p>
                  <Button variant="outline" className="w-full h-12 rounded-xl border-white/60 bg-white/60 font-bold hover:bg-white hover:text-[#7B5CFF] hover:border-[#7B5CFF]/30 hover:shadow-sm transition-all duration-300">
                    Hire Agent
                  </Button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

    </div>
  );
}
