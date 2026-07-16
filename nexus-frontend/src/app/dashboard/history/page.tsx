"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { History, Filter, FileText, MessageSquare, Zap, UserPlus } from "lucide-react";

export default function HistoryPage() {
  const events = [
    {
      agent: "Sales Agent",
      action: "Qualified Lead & Scheduled Meeting",
      detail: "John Doe from Acme Corp booked a demo for Tuesday 10:00 AM.",
      time: "10 mins ago",
      icon: UserPlus,
      color: "text-[#4F7CFF]",
      bg: "bg-[#4F7CFF]/10",
      border: "border-[#4F7CFF]/20"
    },
    {
      agent: "Support Agent",
      action: "Resolved Customer Ticket #8492",
      detail: "Handled refund request for Sarah Jenkins successfully.",
      time: "2 hours ago",
      icon: MessageSquare,
      color: "text-[#7B5CFF]",
      bg: "bg-[#7B5CFF]/10",
      border: "border-[#7B5CFF]/20"
    },
    {
      agent: "Automation Agent",
      action: "Triggered Daily CRM Sync",
      detail: "Synced 45 new contacts from HubSpot to Salesforce.",
      time: "5 hours ago",
      icon: Zap,
      color: "text-[#42D392]",
      bg: "bg-[#42D392]/10",
      border: "border-[#42D392]/20"
    },
    {
      agent: "Legal Agent",
      action: "Drafted NDA for Vendor",
      detail: "Created standard mutual NDA for CloudServices Inc.",
      time: "Yesterday, 4:30 PM",
      icon: FileText,
      color: "text-[#F7B955]",
      bg: "bg-[#F7B955]/10",
      border: "border-[#F7B955]/20"
    },
    {
      agent: "Marketing Agent",
      action: "Published LinkedIn Post",
      detail: "Shared the Q3 Product Update article. Current impressions: 1,204.",
      time: "Yesterday, 10:15 AM",
      icon: MessageSquare,
      color: "text-[#2FD9FF]",
      bg: "bg-[#2FD9FF]/10",
      border: "border-[#2FD9FF]/20"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-[#0A121A] mb-1 tracking-tight">Activity History</h1>
          <p className="text-[#0A121A]/60 font-medium">A complete timeline of everything your AI workforce has done.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Button className="rounded-xl h-12 px-6 bg-white/60 hover:bg-white text-[#0A121A] border border-white/60 font-bold shadow-sm transition-all transform hover:-translate-y-0.5">
            <Filter className="w-5 h-5 mr-2" /> Filter
          </Button>
        </motion.div>
      </div>

      {/* Timeline */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.2 }}
        className="bg-white/40 backdrop-blur-3xl rounded-[32px] border border-white/60 p-8 shadow-[0_20px_40px_rgba(79,124,255,0.05)] relative"
      >
        <div className="absolute top-12 bottom-12 left-[3.25rem] w-px bg-[#0A121A]/10" />
        
        <div className="space-y-10 relative z-10">
          {events.map((event, idx) => {
            const Icon = event.icon;
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + (idx * 0.1) }}
                className="flex gap-6 group cursor-pointer"
              >
                <div className={`w-14 h-14 shrink-0 rounded-[16px] ${event.bg} border ${event.border} flex items-center justify-center relative shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all`}>
                  <Icon className={`w-6 h-6 ${event.color}`} />
                  {/* Timeline dot connection */}
                  <div className="absolute -left-[35px] top-1/2 -translate-y-1/2 w-[22px] h-px bg-[#0A121A]/10 hidden md:block" />
                </div>
                
                <div className="flex-1 bg-white/60 border border-white/60 rounded-[20px] p-5 shadow-sm group-hover:border-[#4F7CFF]/30 group-hover:shadow-[0_10px_30px_rgba(79,124,255,0.08)] transition-all relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#4F7CFF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  
                  <div className="flex justify-between items-start mb-1 relative z-10">
                    <h3 className="font-bold text-[#0A121A] text-lg">{event.action}</h3>
                    <span className="text-xs font-bold text-[#0A121A]/40 whitespace-nowrap bg-white px-2 py-1 rounded-md border border-[#0A121A]/5">{event.time}</span>
                  </div>
                  
                  <p className="text-sm font-medium text-[#0A121A]/60 mb-3 relative z-10">{event.detail}</p>
                  
                  <div className="flex items-center gap-2 relative z-10">
                    <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-md ${event.bg} ${event.color}`}>
                      {event.agent}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        <div className="mt-10 text-center">
          <Button variant="outline" className="rounded-xl border-white/60 bg-white/40 font-bold hover:bg-white text-[#0A121A] transition-all">
            Load More History
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
