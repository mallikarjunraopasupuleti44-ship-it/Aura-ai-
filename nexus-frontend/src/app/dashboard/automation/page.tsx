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

// Mock Data
const integrations = [
  { id: "stripe", name: "Stripe", category: "Finance", icon: CreditCard, color: "text-[#635BFF]", bg: "bg-[#635BFF]/10", connected: true },
  { id: "shopify", name: "Shopify", category: "Commerce", icon: ShoppingCart, color: "text-[#95BF47]", bg: "bg-[#95BF47]/10", connected: true },
  { id: "slack", name: "Slack", category: "Communication", icon: MessageSquare, color: "text-[#E01E5A]", bg: "bg-[#E01E5A]/10", connected: true },
  { id: "mailchimp", name: "Mailchimp", category: "Marketing", icon: Mail, color: "text-[#FFE01B]", bg: "bg-[#FFE01B]/10", connected: false },
  { id: "hubspot", name: "HubSpot", category: "CRM", icon: Database, color: "text-[#FF7A59]", bg: "bg-[#FF7A59]/10", connected: false },
];

const initialWorkflows = [
  { id: 1, name: "Lead Qualification via Typeform", trigger: "New Typeform Submission", action: "Sales Agent evaluates & adds to CRM", status: "Active", runs: 142 },
  { id: 2, name: "Support Ticket Escalation", trigger: "Sentiment < 0.3 on Email", action: "Support Agent pages human via Slack", status: "Active", runs: 28 },
  { id: 3, name: "Daily Competitor Scan", trigger: "Schedule (Every 24h)", action: "Research Agent scrapes 5 sites & emails summary", status: "Paused", runs: 0 },
  { id: 4, name: "Abandoned Cart Recovery", trigger: "Shopify Checkout Incomplete", action: "Marketing Agent sends personalized discount", status: "Active", runs: 854 },
];

export default function AutomationPage() {
  const [workflows, setWorkflows] = useState(initialWorkflows);

  const toggleWorkflow = (id: number) => {
    setWorkflows(workflows.map(wf => {
      if (wf.id === id) {
        return { ...wf, status: wf.status === 'Active' ? 'Paused' : 'Active' };
      }
      return wf;
    }));
  };

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
          { label: "Active Workflows", value: workflows.filter(w=>w.status === 'Active').length.toString(), icon: GitMerge, color: "text-[#4F7CFF]", bg: "bg-[#4F7CFF]/10", border: "border-[#4F7CFF]/30" },
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Workflows List */}
        <GlassCard className="xl:col-span-2 p-8 md:p-12 border-white/60">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-[#0A121A] tracking-tight">Active Workflows</h3>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#42D392] bg-[#42D392]/10 px-3 py-1.5 rounded-lg border border-[#42D392]/20 flex items-center gap-2">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#42D392] opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-[#42D392]"></span></span>
              System Live
            </span>
          </div>
          
          <div className="space-y-4">
            <AnimatePresence>
              {workflows.map((wf, idx) => (
                <motion.div 
                  key={wf.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + (idx * 0.1) }}
                  className="group relative overflow-hidden bg-white/40 backdrop-blur-sm border border-white/60 rounded-2xl p-6 md:p-8 hover:bg-white/60 hover:shadow-[0_15px_40px_rgba(79,124,255,0.08)] hover:border-[#4F7CFF]/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer"
                >
                  <div className="flex-1 relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <h4 className="font-bold text-[#0A121A] text-xl tracking-tight">{wf.name}</h4>
                      <span className={cn(
                        "px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-lg border flex items-center gap-1.5",
                        wf.status === 'Active' ? 'bg-[#42D392]/10 text-[#42D392] border-[#42D392]/20' : 'bg-[#0A121A]/5 text-[#0A121A]/50 border-[#0A121A]/10'
                      )}>
                        {wf.status === 'Active' && <Zap className="w-3 h-3" />}
                        {wf.status}
                      </span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm font-medium text-[#0A121A]/60">
                      <span className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-2 rounded-xl shadow-sm border border-white/80 w-fit">
                        <Server className="w-4 h-4 text-[#7B5CFF]" /> {wf.trigger}
                      </span>
                      <ArrowRight className="w-5 h-5 text-[#0A121A]/30 hidden sm:block" />
                      <span className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-2 rounded-xl shadow-sm border border-white/80 w-fit">
                        <Zap className="w-4 h-4 text-[#4F7CFF]" /> {wf.action}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 relative z-10">
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-[#0A121A]/40 uppercase tracking-widest mb-1">Total Runs</p>
                      <p className="text-xl font-bold text-[#0A121A]">{wf.runs}</p>
                    </div>
                    <div className="w-px h-10 bg-[#0A121A]/10" />
                    
                    {/* Toggle Button */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleWorkflow(wf.id); }}
                      className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center border shadow-sm transition-all duration-300",
                        wf.status === 'Active' 
                          ? 'bg-[#FF6B81]/10 border-[#FF6B81]/30 text-[#FF6B81] hover:bg-[#FF6B81] hover:text-white hover:shadow-[0_10px_20px_rgba(255,107,129,0.3)]' 
                          : 'bg-[#42D392]/10 border-[#42D392]/30 text-[#42D392] hover:bg-[#42D392] hover:text-white hover:shadow-[0_10px_20px_rgba(66,211,146,0.3)]'
                      )}
                    >
                      {wf.status === 'Active' ? <Power className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </GlassCard>

        {/* App Integrations */}
        <GlassCard className="p-8 md:p-12 border-white/60 flex flex-col">
          <h3 className="text-2xl font-bold text-[#0A121A] mb-8 tracking-tight">App Integrations</h3>
          
          <div className="space-y-4 flex-1">
            {integrations.map((app, idx) => {
              const Icon = app.icon;
              return (
                <motion.div 
                  key={app.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + (idx * 0.1) }}
                  className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/40 transition-colors border border-transparent hover:border-white/60"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shadow-sm border border-white/60", app.bg)}>
                      <Icon className={cn("w-6 h-6", app.color)} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0A121A]">{app.name}</h4>
                      <p className="text-[10px] font-bold text-[#0A121A]/40 uppercase tracking-widest">{app.category}</p>
                    </div>
                  </div>
                  
                  <Button 
                    variant={app.connected ? "outline" : "default"}
                    size="sm"
                    className={cn(
                      "rounded-lg font-bold shadow-sm h-9",
                      app.connected ? "bg-white/60 hover:bg-white border-white/80 text-[#0A121A]/60" : "bg-[#4F7CFF] text-white hover:bg-[#7B5CFF]"
                    )}
                  >
                    {app.connected ? "Connected" : "Connect"}
                  </Button>
                </motion.div>
              );
            })}
          </div>
          
          <Button variant="outline" className="w-full mt-6 rounded-xl border-dashed border-[#0A121A]/20 bg-white/20 text-[#0A121A]/60 hover:bg-white/60 hover:text-[#0A121A] font-bold h-12">
            View All Integrations
          </Button>
        </GlassCard>

      </div>
    </div>
  );
}
