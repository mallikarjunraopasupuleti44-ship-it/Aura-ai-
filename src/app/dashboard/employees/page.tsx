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
                 className="glass-card p-6 border border-gray-100 flex items-center justify-between"
               >
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center border border-purple-200">
                     <Icon className="w-6 h-6 text-purple-600" />
                   </div>
                   <div>
                     <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                     <p className="text-sm text-gray-500">{agent.role}</p>
                   </div>
                 </div>
                 <Link href="/dashboard/chat" className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium hover:bg-purple-100 transition-colors">
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
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-lg hover:border-purple-200 transition-all group flex flex-col"
              >
                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-4 group-hover:bg-purple-50 transition-colors">
                  <Icon className="w-6 h-6 text-gray-400 group-hover:text-purple-600 transition-colors" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{agent.name}</h3>
                <p className="text-sm text-gray-500 flex-1 mb-6">{agent.desc}</p>
                <Button variant="outline" className="w-full rounded-xl border-gray-200 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 transition-colors">
                  Hire Agent
                </Button>
              </motion.div>
            )
          })}
        </div>
      </section>

    </div>
  );
}
