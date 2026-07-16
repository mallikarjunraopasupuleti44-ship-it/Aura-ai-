"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { 
  Zap, Plus, ArrowRight, Play, Server, Clock, GitMerge, 
  MessageSquare, ShoppingCart, Mail, Database, CreditCard, Power
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AutomationPage() {
  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-12">
      {/* Header */}
      <GlassCard className="p-8 md:p-12 border-white/60 relative overflow-hidden">
        <div className="absolute top-[-50%] right-[-10%] w-[40%] h-[150%] bg-[#42D392]/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold text-[#0A121A] mb-3 tracking-tight">Automation Engine</h1>
            <p className="text-[#0A121A]/60 font-medium text-lg max-w-xl">
              Connect your favorite apps and orchestrate autonomous workflows for your AI team.
            </p>
          </div>
          <div className="flex gap-3">
            <Button className="rounded-2xl h-14 px-8 bg-[#0A121A] text-white hover:bg-black font-bold shadow-[0_10px_20px_rgba(0,0,0,0.1)] text-lg border-0">
              <Plus className="w-5 h-5 mr-2" /> Create Workflow
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Active Workflows", value: "3", icon: GitMerge, color: "text-[#4F7CFF]", bg: "bg-[#4F7CFF]/10", border: "border-[#4F7CFF]/30" },
          { label: "Tasks Automated (24h)", value: "1,249", icon: Zap, color: "text-[#7B5CFF]", bg: "bg-[#7B5CFF]/10", border: "border-[#7B5CFF]/30" },
          { label: "Hours Saved (Month)", value: "148h", icon: Clock, color: "text-[#42D392]", bg: "bg-[#42D392]/10", border: "border-[#42D392]/30" },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <GlassCard 
              key={idx}
              animate={true} 
              delay={0.1 * idx}
              className="p-8 group"
            >
              <div className="flex items-center gap-6">
                <div className={`w-16 h-16 rounded-2xl ${stat.bg} flex items-center justify-center border ${stat.border} group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0A121A]/40 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-4xl font-bold text-[#0A121A] tracking-tight">{stat.value}</p>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Content Removed as requested */}
    </div>
  );
}
