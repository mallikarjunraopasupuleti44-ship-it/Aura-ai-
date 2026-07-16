"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { 
  History, Filter, FileText, MessageSquare, Zap, UserPlus, 
  Search, Calendar, Download, Eye, Sparkles, UploadCloud, Globe, Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";

type HistoryEvent = {
  id: string;
  agent: string;
  action: string;
  detail: string;
  timestamp: number;
  type: 'report' | 'automation' | 'upload' | 'campaign' | 'meeting' | 'website' | 'system';
};

const defaultSeed: HistoryEvent[] = [
  {
    id: "1",
    agent: "Planner Agent",
    action: "Generated Comprehensive Business Plan",
    detail: "Created a 25-page business plan for 'Eco-Friendly Bakery' including market analysis and competitive intelligence.",
    timestamp: Date.now() - 1000 * 60 * 30, // 30 mins ago
    type: "report"
  },
  {
    id: "2",
    agent: "Marketing Agent",
    action: "Launched Instagram Campaign",
    detail: "Scheduled 5 posts for the upcoming week based on the new brand guidelines. Estimated reach: 15k.",
    timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    type: "campaign"
  },
  {
    id: "3",
    agent: "Automation Agent",
    action: "Synced Stripe to Google Sheets",
    detail: "Successfully synced 14 new transactions to the 'Q3 Financials' sheet.",
    timestamp: Date.now() - 1000 * 60 * 60 * 5, // 5 hours ago
    type: "automation"
  },
  {
    id: "4",
    agent: "System",
    action: "Uploaded 'Q3_Financial_Report.xlsx'",
    detail: "Knowledge base updated. Vector embeddings generated and indexed for all AI agents.",
    timestamp: Date.now() - 1000 * 60 * 60 * 24, // Yesterday
    type: "upload"
  },
  {
    id: "5",
    agent: "Website Agent",
    action: "Deployed Landing Page v2",
    detail: "Live at bakery-eco.aura.run. Included the new pricing tiers and A/B testing scripts.",
    timestamp: Date.now() - 1000 * 60 * 60 * 48, // 2 days ago
    type: "website"
  }
];

export default function HistoryPage() {
  const [events, setEvents] = useState<HistoryEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Simulate Database Fetch from localStorage
  useEffect(() => {
    const fetchDB = () => {
      try {
        const stored = localStorage.getItem("aura_history_db");
        if (stored) {
          setEvents(JSON.parse(stored));
        } else {
          localStorage.setItem("aura_history_db", JSON.stringify(defaultSeed));
          setEvents(defaultSeed);
        }
      } catch (e) {
        setEvents(defaultSeed);
      } finally {
        setTimeout(() => setIsLoading(false), 600); // Simulate network delay
      }
    };
    fetchDB();
  }, []);

  const getIconConfig = (type: string) => {
    switch (type) {
      case 'report': return { icon: FileText, color: "text-[#4F7CFF]", bg: "bg-[#4F7CFF]/10", border: "border-[#4F7CFF]/20" };
      case 'campaign': return { icon: MessageSquare, color: "text-[#7B5CFF]", bg: "bg-[#7B5CFF]/10", border: "border-[#7B5CFF]/20" };
      case 'automation': return { icon: Zap, color: "text-[#42D392]", bg: "bg-[#42D392]/10", border: "border-[#42D392]/20" };
      case 'upload': return { icon: UploadCloud, color: "text-[#F7B955]", bg: "bg-[#F7B955]/10", border: "border-[#F7B955]/20" };
      case 'website': return { icon: Globe, color: "text-[#2FD9FF]", bg: "bg-[#2FD9FF]/10", border: "border-[#2FD9FF]/20" };
      case 'meeting': return { icon: UserPlus, color: "text-[#FF6B81]", bg: "bg-[#FF6B81]/10", border: "border-[#FF6B81]/20" };
      default: return { icon: Sparkles, color: "text-[#0A121A]", bg: "bg-black/5", border: "border-black/10" };
    }
  };

  const formatTime = (ts: number) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    if (mins < 60) return `${mins} mins ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days === 1) return `Yesterday`;
    return `${days} days ago`;
  };

  const filteredEvents = events.filter(e => 
    e.action.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.agent.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.detail.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <GlassCard className="p-8 md:p-12 border-white/60 relative overflow-hidden">
        {/* Animated background glow */}
        <div className="absolute top-[-50%] right-[-10%] w-[40%] h-[150%] bg-[#7B5CFF]/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold text-[#0A121A] mb-3 tracking-tight">System History</h1>
            <p className="text-[#0A121A]/60 font-medium text-lg max-w-xl">
              A comprehensive immutable ledger of everything your AI workforce has generated, automated, and uploaded.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-xl h-12 bg-white/40 hover:bg-white text-[#0A121A] border border-white/60 shadow-sm font-bold">
              <Calendar className="w-5 h-5 mr-2" /> Last 30 Days
            </Button>
            <Button className="rounded-xl h-12 bg-[#0A121A] text-white hover:bg-black font-bold shadow-[0_10px_20px_rgba(0,0,0,0.1)]">
              <Download className="w-5 h-5 mr-2" /> Export CSV
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Controls */}
      <div className="flex items-center gap-4 px-2">
        <div className="relative flex-1 bg-white/40 backdrop-blur-xl rounded-2xl shadow-sm border border-white/60 overflow-hidden focus-within:border-[#4F7CFF]/50 transition-all h-14">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0A121A]/40" />
          <input
            type="text"
            placeholder="Search by action, agent, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-full bg-transparent outline-none pl-12 pr-6 text-[#0A121A] font-medium placeholder:text-[#0A121A]/40"
          />
        </div>
        <Button variant="outline" className="rounded-2xl h-14 px-6 bg-white/40 hover:bg-white text-[#0A121A] border border-white/60 font-bold shadow-sm shrink-0">
          <Filter className="w-5 h-5 mr-2" /> Filter
        </Button>
      </div>

      {/* Timeline */}
      <GlassCard className="p-8 md:p-12 border-white/60 min-h-[500px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 opacity-50">
            <History className="w-12 h-12 mb-4 text-[#4F7CFF] animate-pulse" />
            <p className="font-bold text-[#0A121A]/60">Syncing ledger...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Search className="w-12 h-12 mb-4 text-[#0A121A]/20" />
            <p className="font-bold text-[#0A121A]/60 text-lg">No records found matching "{searchQuery}"</p>
          </div>
        ) : (
          <div className="relative">
            {/* Main Vertical Line */}
            <div className="absolute top-8 bottom-8 left-[3.25rem] w-px bg-gradient-to-b from-transparent via-[#0A121A]/10 to-transparent hidden md:block" />
            
            <div className="space-y-8 relative z-10">
              <AnimatePresence>
                {filteredEvents.map((event, idx) => {
                  const config = getIconConfig(event.type);
                  const Icon = config.icon;
                  
                  return (
                    <motion.div 
                      key={event.id}
                      initial={{ opacity: 0, x: -20, y: 10 }}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex gap-6 group cursor-pointer"
                    >
                      {/* Node Icon */}
                      <div className={cn(
                        "w-14 h-14 shrink-0 rounded-[20px] border flex items-center justify-center relative shadow-sm transition-all duration-300 z-10",
                        "group-hover:scale-110 group-hover:shadow-[0_10px_30px_rgba(79,124,255,0.15)] bg-white backdrop-blur-xl",
                        config.border
                      )}>
                        <div className={cn("absolute inset-0 opacity-20 rounded-[inherit]", config.bg)} />
                        <Icon className={cn("w-6 h-6 relative z-10", config.color)} />
                        
                        {/* Connecting branch line */}
                        <div className="absolute -left-[35px] top-1/2 -translate-y-1/2 w-[22px] h-px bg-[#0A121A]/10 hidden md:block" />
                      </div>
                      
                      {/* Event Card */}
                      <div className="flex-1 bg-white/40 backdrop-blur-md border border-white/60 rounded-[24px] p-6 shadow-sm group-hover:bg-white/60 group-hover:border-[#4F7CFF]/30 group-hover:shadow-[0_15px_40px_rgba(79,124,255,0.08)] transition-all relative overflow-hidden">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-2 relative z-10">
                          <h3 className="font-bold text-[#0A121A] text-lg tracking-tight">{event.action}</h3>
                          <span className="text-xs font-bold text-[#0A121A]/40 whitespace-nowrap bg-white/50 px-3 py-1.5 rounded-lg border border-white/60 shadow-sm">
                            {formatTime(event.timestamp)}
                          </span>
                        </div>
                        
                        <p className="text-base font-medium text-[#0A121A]/60 mb-5 relative z-10 leading-relaxed max-w-3xl">
                          {event.detail}
                        </p>
                        
                        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
                          <span className={cn(
                            "text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-lg border flex items-center gap-1.5",
                            config.bg, config.color, config.border
                          )}>
                            <Briefcase className="w-3.5 h-3.5" />
                            {event.agent}
                          </span>
                          
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="sm" variant="ghost" className="h-8 rounded-lg text-[#0A121A]/60 hover:text-[#4F7CFF] hover:bg-[#4F7CFF]/10 font-bold">
                              <Eye className="w-4 h-4 mr-1.5" /> View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
