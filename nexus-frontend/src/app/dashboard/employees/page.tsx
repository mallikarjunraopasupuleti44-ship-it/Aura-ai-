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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Employees</h1>
          <p className="text-gray-500">Manage your active workforce and hire new specialized agents.</p>
        </div>
        <Button className="rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-md">
          <Plus className="w-4 h-4 mr-2" /> Create Custom Agent
        </Button>
      </div>

      {/* Active Employees */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Active Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeEmployees.map((agent, idx) => {
             const Icon = agent.icon;
             return (
               <motion.div 
                 key={idx}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: idx * 0.1 }}
                 className="relative overflow-hidden p-6 border border-gray-200/60 flex items-center justify-between hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-2 hover:border-purple-300/60 transition-all duration-500 group cursor-pointer bg-white/70 backdrop-blur-xl rounded-3xl"
               >
                 {/* Inner animated gradient background */}
                 <div className="absolute inset-0 bg-gradient-to-r from-purple-100/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                 
                 <div className="relative z-10 flex items-center gap-5">
                   <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center border border-purple-100 group-hover:bg-gradient-to-br group-hover:from-purple-600 group-hover:to-pink-500 transition-all duration-500 shadow-sm group-hover:shadow-purple-500/40 group-hover:scale-110 group-hover:-rotate-3">
                     <Icon className="w-7 h-7 text-purple-600 group-hover:text-white transition-colors duration-500" />
                   </div>
                   <div>
                     <h3 className="font-bold text-gray-900 group-hover:text-purple-900 transition-colors duration-300 text-lg">{agent.name}</h3>
                     <p className="text-sm text-gray-500 font-medium">{agent.role}</p>
                   </div>
                 </div>
                 <Link href="/dashboard/chat" className="relative z-10 px-6 py-2.5 bg-white text-purple-700 rounded-full text-sm font-bold border border-purple-100 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-500 hover:text-white hover:border-transparent transition-all duration-300 shadow-sm group-hover:shadow-md">
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
          <h2 className="text-xl font-bold text-gray-900 mb-2">Hire Employee</h2>
          <p className="text-sm text-gray-500">Expand your workforce with these specialized AI agents.</p>
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
                className="relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/60 shadow-sm hover:shadow-2xl hover:shadow-pink-500/20 hover:-translate-y-2 hover:border-pink-300/60 transition-all duration-500 group flex flex-col cursor-pointer"
              >
                {/* Magical animated background glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-100/40 via-purple-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-5 border border-gray-100 group-hover:bg-gradient-to-br group-hover:from-purple-500 group-hover:to-pink-500 transition-all duration-500 shadow-sm group-hover:shadow-pink-500/40 group-hover:scale-110 group-hover:rotate-3">
                    <Icon className="w-7 h-7 text-gray-400 group-hover:text-white transition-colors duration-500" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-900 transition-colors">{agent.name}</h3>
                  <p className="text-sm text-gray-500 font-medium flex-1 mb-6 leading-relaxed group-hover:text-gray-700 transition-colors">{agent.desc}</p>
                  <Button variant="outline" className="w-full rounded-xl border-gray-200/80 bg-white/80 font-bold hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-500 hover:text-white hover:border-transparent transition-all duration-300 shadow-sm group-hover:shadow-md">
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
