"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { BarChart3, TrendingUp, Download, Users, DollarSign, Target, Activity } from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';

const data = [
  { name: 'Week 1', revenue: 4200, tasks: 240 },
  { name: 'Week 2', revenue: 5100, tasks: 310 },
  { name: 'Week 3', revenue: 4800, tasks: 290 },
  { name: 'Week 4', revenue: 6300, tasks: 410 },
  { name: 'Week 5', revenue: 7800, tasks: 520 },
  { name: 'Week 6', revenue: 8500, tasks: 610 },
  { name: 'Week 7', revenue: 10400, tasks: 820 },
];

const barData = [
  { name: 'Planner', active: 120, idle: 20 },
  { name: 'Marketing', active: 300, idle: 45 },
  { name: 'Finance', active: 85, idle: 15 },
  { name: 'Operations', active: 180, idle: 60 },
  { name: 'Website', active: 40, idle: 10 },
];

export default function ReportsPage() {
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({
    agentsCount: 0,
    documentsCount: 0,
    automationsCount: 0,
  });

  useEffect(() => {
    setMounted(true);
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/dashboard/stats");
      if (res.ok) {
        const data = await res.json();
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-12">
      {/* Header */}
      <GlassCard className="p-8 md:p-12 border-white/60 relative overflow-hidden">
        <div className="absolute top-[-50%] right-[-10%] w-[40%] h-[150%] bg-[#4F7CFF]/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold text-[#0A121A] mb-3 tracking-tight">Intelligence Reports</h1>
            <p className="text-[#0A121A]/60 font-medium text-lg max-w-xl">
              Real-time analytics and performance metrics for your autonomous AI workforce.
            </p>
          </div>
          <div className="flex gap-3">
            <Button className="rounded-2xl h-14 px-8 text-lg font-bold shadow-[0_10px_20px_rgba(79,124,255,0.2)]">
              <Download className="w-5 h-5 mr-2" /> Export PDF
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Active AI Agents", value: stats.agentsCount.toString(), trend: "Active", icon: Users, color: "text-[#4F7CFF]", bg: "bg-[#4F7CFF]/10", border: "border-[#4F7CFF]/30" },
          { label: "Documents Loaded", value: stats.documentsCount.toString(), trend: "Stored", icon: Target, color: "text-[#42D392]", bg: "bg-[#42D392]/10", border: "border-[#42D392]/30" },
          { label: "Automations Running", value: stats.automationsCount.toString(), trend: "Live", icon: Activity, color: "text-[#7B5CFF]", bg: "bg-[#7B5CFF]/10", border: "border-[#7B5CFF]/30" },
          { label: "Est. Hours Saved", value: (stats.automationsCount * 14 + stats.agentsCount * 24).toString(), trend: "Saved", icon: TrendingUp, color: "text-[#2FD9FF]", bg: "bg-[#2FD9FF]/10", border: "border-[#2FD9FF]/30" },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <GlassCard 
              key={idx}
              animate={true} 
              delay={0.1 * idx}
              className="p-8 group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center border ${stat.border} group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                  <Icon className={`w-7 h-7 ${stat.color}`} />
                </div>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${stat.bg} ${stat.color} border ${stat.border} shadow-sm`}>
                  {stat.trend}
                </span>
              </div>
              <p className="text-xs font-bold text-[#0A121A]/40 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-[#0A121A] tracking-tight">{stat.value}</p>
            </GlassCard>
          );
        })}
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <GlassCard className="xl:col-span-2 p-8 md:p-10 flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-[#0A121A] tracking-tight">Revenue vs Tasks Over Time</h3>
            <select className="bg-white/40 border border-white/60 text-sm font-bold text-[#0A121A] rounded-xl px-4 py-2 outline-none focus:border-[#4F7CFF]/50 transition-colors backdrop-blur-md">
              <option>Last 7 Weeks</option>
              <option>Last 30 Days</option>
              <option>Year to Date</option>
            </select>
          </div>
          
          <div className="flex-1 w-full h-full min-h-[350px]">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F7CFF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4F7CFF" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7B5CFF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#7B5CFF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(10,18,26,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'rgba(10,18,26,0.4)', fontSize: 12, fontWeight: 600}} dy={10} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: 'rgba(10,18,26,0.4)', fontSize: 12, fontWeight: 600}} tickFormatter={(val) => `$${val/1000}k`} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: 'rgba(10,18,26,0.4)', fontSize: 12, fontWeight: 600}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(79,124,255,0.1)' }}
                    itemStyle={{ fontWeight: 'bold' }}
                  />
                  <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#4F7CFF" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  <Area yAxisId="right" type="monotone" dataKey="tasks" stroke="#7B5CFF" strokeWidth={3} fillOpacity={1} fill="url(#colorTasks)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-[#0A121A]/10 animate-pulse" />
              </div>
            )}
          </div>
        </GlassCard>

        <div className="flex flex-col gap-6">
          <GlassCard className="p-8 md:p-10 flex-1">
            <h3 className="text-xl font-bold text-[#0A121A] mb-8 tracking-tight">Agent Workload Focus</h3>
            <div className="h-[250px] w-full">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(10,18,26,0.05)" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: 'rgba(10,18,26,0.6)', fontSize: 12, fontWeight: 700}} width={80} />
                    <Tooltip 
                      cursor={{fill: 'rgba(79,124,255,0.05)'}}
                      contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)' }}
                    />
                    <Bar dataKey="active" stackId="a" fill="#4F7CFF" radius={[0, 4, 4, 0]} barSize={20} />
                    <Bar dataKey="idle" stackId="a" fill="#E2E8F0" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              ) : null}
            </div>
          </GlassCard>

          <GlassCard className="p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F7B955]/10 flex items-center justify-center border border-[#F7B955]/30">
                <TrendingUp className="w-6 h-6 text-[#F7B955]" />
              </div>
              <div>
                <h3 className="font-bold text-[#0A121A]">Efficiency Gain</h3>
                <p className="text-[10px] font-bold text-[#0A121A]/40 uppercase tracking-widest mt-0.5">This Month</p>
              </div>
            </div>
            <p className="text-sm font-medium text-[#0A121A]/60 leading-relaxed">
              Your autonomous AI agents have saved you approximately <span className="font-bold text-[#0A121A]">142 hours</span> of manual labor this month, resulting in a <span className="font-bold text-[#42D392]">+48%</span> increase in overall output compared to last month.
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
