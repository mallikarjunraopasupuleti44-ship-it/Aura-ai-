"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Download, Users, DollarSign, Target } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-[#0A121A] mb-1 tracking-tight">Reports & Analytics</h1>
          <p className="text-[#0A121A]/60 font-medium">Track your AI workforce's performance and impact on your business.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Button className="rounded-xl h-12 px-6 bg-white/60 hover:bg-white text-[#4F7CFF] border border-[#4F7CFF]/20 font-bold shadow-sm transition-all transform hover:-translate-y-0.5">
            <Download className="w-5 h-5 mr-2" /> Export PDF
          </Button>
        </motion.div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Revenue Generated", value: "$42,500", trend: "+12.5%", icon: DollarSign, color: "text-[#42D392]", bg: "bg-[#42D392]/10", border: "border-[#42D392]/20" },
          { label: "Tasks Completed", value: "8,241", trend: "+34.2%", icon: Target, color: "text-[#4F7CFF]", bg: "bg-[#4F7CFF]/10", border: "border-[#4F7CFF]/20" },
          { label: "Customer Interactions", value: "1,204", trend: "+5.1%", icon: Users, color: "text-[#7B5CFF]", bg: "bg-[#7B5CFF]/10", border: "border-[#7B5CFF]/20" },
          { label: "AI Accuracy Score", value: "99.2%", trend: "+0.8%", icon: TrendingUp, color: "text-[#2FD9FF]", bg: "bg-[#2FD9FF]/10", border: "border-[#2FD9FF]/20" },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.2 + (idx * 0.1) }}
              className="bg-white/40 backdrop-blur-3xl rounded-[24px] border border-white/60 p-6 shadow-sm hover:shadow-[0_20px_40px_rgba(79,124,255,0.05)] transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-[14px] ${stat.bg} flex items-center justify-center border ${stat.border} group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${stat.bg} ${stat.color} border ${stat.border}`}>
                  {stat.trend}
                </span>
              </div>
              <p className="text-[11px] font-bold text-[#0A121A]/40 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-bold text-[#0A121A] mt-1 tracking-tight">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Placeholder Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.6 }}
          className="lg:col-span-2 bg-white/40 backdrop-blur-3xl rounded-[24px] border border-white/60 p-8 shadow-sm flex flex-col min-h-[400px]"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-[#0A121A]">Revenue vs Tasks Over Time</h3>
            <select className="bg-white/60 border border-white/60 text-sm font-bold text-[#0A121A] rounded-xl px-3 py-1.5 outline-none">
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
              <option>Year to Date</option>
            </select>
          </div>
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-[#0A121A]/10 rounded-[16px] bg-[#0A121A]/[0.02]">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-[#0A121A]/20 mx-auto mb-3" />
              <p className="text-[#0A121A]/40 font-medium">Chart visualization will render here</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.7 }}
          className="bg-white/40 backdrop-blur-3xl rounded-[24px] border border-white/60 p-8 shadow-sm flex flex-col"
        >
          <h3 className="text-xl font-bold text-[#0A121A] mb-6">Agent Workload</h3>
          <div className="flex-1 space-y-6">
            {[
              { name: "Sales Agent", percent: 45, color: "from-[#4F7CFF] to-[#2FD9FF]" },
              { name: "Support Agent", percent: 30, color: "from-[#7B5CFF] to-[#4F7CFF]" },
              { name: "Research Agent", percent: 15, color: "from-[#42D392] to-[#2FD9FF]" },
              { name: "Finance Agent", percent: 10, color: "from-[#F7B955] to-[#FF6B81]" },
            ].map((agent, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm font-bold text-[#0A121A] mb-2">
                  <span>{agent.name}</span>
                  <span>{agent.percent}%</span>
                </div>
                <div className="h-2.5 bg-[#0A121A]/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${agent.percent}%` }}
                    transition={{ duration: 1, delay: 0.8 + (idx * 0.1) }}
                    className={`h-full bg-gradient-to-r ${agent.color} rounded-full`} 
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
