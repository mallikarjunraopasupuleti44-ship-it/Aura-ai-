"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Zap, Plus, ArrowRight, Play, Server, Clock, GitMerge } from "lucide-react";

export default function AutomationPage() {
  const workflows = [
    { name: "Lead Qualification", trigger: "New Typeform Submission", action: "Sales Agent evaluates & adds to CRM", status: "Active", runs: 142 },
    { name: "Customer Support Escalation", trigger: "Sentiment < 0.3 on Email", action: "Support Agent pages human via Slack", status: "Active", runs: 28 },
    { name: "Daily Competitor Scan", trigger: "Schedule (Every 24h)", action: "Research Agent scrapes 5 sites & emails summary", status: "Paused", runs: 0 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-[#0A121A] mb-1 tracking-tight">Automation</h1>
          <p className="text-[#0A121A]/60 font-medium">Create workflows and connect your AI agents to external tools.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Button className="rounded-xl h-12 px-6 bg-gradient-to-r from-[#4F7CFF] to-[#2FD9FF] hover:opacity-90 text-white font-bold shadow-[0_10px_30px_rgba(79,124,255,0.3)] transition-all transform hover:-translate-y-0.5 border-0">
            <Plus className="w-5 h-5 mr-2" /> New Workflow
          </Button>
        </motion.div>
      </div>

      {/* Stats/Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Active Workflows", value: "2", icon: GitMerge, color: "text-[#4F7CFF]", bg: "bg-[#4F7CFF]/10", border: "border-[#4F7CFF]/20" },
          { label: "Tasks Automated Today", value: "1,249", icon: Zap, color: "text-[#7B5CFF]", bg: "bg-[#7B5CFF]/10", border: "border-[#7B5CFF]/20" },
          { label: "Hours Saved", value: "48h", icon: Clock, color: "text-[#42D392]", bg: "bg-[#42D392]/10", border: "border-[#42D392]/20" },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.2 + (idx * 0.1) }}
              className="bg-white/40 backdrop-blur-3xl rounded-[24px] border border-white/60 p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-[16px] ${stat.bg} flex items-center justify-center border ${stat.border}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[#0A121A]/40 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-2xl font-bold text-[#0A121A] mt-1">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Workflows List */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.5 }}
        className="bg-white/40 backdrop-blur-3xl rounded-[24px] border border-white/60 p-8 shadow-[0_20px_40px_rgba(79,124,255,0.05)]"
      >
        <h3 className="text-xl font-bold text-[#0A121A] mb-6">Your Workflows</h3>
        <div className="space-y-4">
          {workflows.map((wf, idx) => (
            <div key={idx} className="group relative overflow-hidden bg-white/60 border border-[#0A121A]/5 rounded-[20px] p-6 hover:shadow-sm hover:border-[#4F7CFF]/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-[#4F7CFF]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              
              <div className="flex-1 relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-bold text-[#0A121A] text-lg group-hover:text-[#4F7CFF] transition-colors">{wf.name}</h4>
                  <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg ${wf.status === 'Active' ? 'bg-[#42D392]/10 text-[#42D392] border border-[#42D392]/20' : 'bg-[#0A121A]/5 text-[#0A121A]/50 border border-[#0A121A]/10'}`}>
                    {wf.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-[#0A121A]/60">
                  <span className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md shadow-sm border border-[#0A121A]/5">
                    <Server className="w-3.5 h-3.5 text-[#7B5CFF]" /> {wf.trigger}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#0A121A]/30" />
                  <span className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md shadow-sm border border-[#0A121A]/5">
                    <Zap className="w-3.5 h-3.5 text-[#4F7CFF]" /> {wf.action}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 relative z-10">
                <div className="text-right">
                  <p className="text-xs font-bold text-[#0A121A]/40 uppercase tracking-widest">Total Runs</p>
                  <p className="font-bold text-[#0A121A]">{wf.runs}</p>
                </div>
                <div className="w-px h-8 bg-[#0A121A]/10 mx-2" />
                <button className={`w-10 h-10 rounded-[12px] flex items-center justify-center border transition-colors ${wf.status === 'Active' ? 'bg-[#FF6B81]/10 border-[#FF6B81]/20 text-[#FF6B81] hover:bg-[#FF6B81]/20' : 'bg-[#42D392]/10 border-[#42D392]/20 text-[#42D392] hover:bg-[#42D392]/20'}`}>
                  {wf.status === 'Active' ? <div className="w-3 h-3 bg-[#FF6B81] rounded-sm" /> : <Play className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
