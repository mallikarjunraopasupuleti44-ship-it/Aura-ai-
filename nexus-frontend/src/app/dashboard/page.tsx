"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuraLogo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { 
  CheckCircle2, ShieldCheck, Zap, Database, Bot,
  FileText, Megaphone, TrendingUp, Search, UploadCloud, PieChart, Headphones,
  Mail, Edit3, Settings, Loader2
} from "lucide-react";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good Morning";
  if (hour >= 12 && hour < 17) return "Good Afternoon";
  if (hour >= 17 && hour < 21) return "Good Evening";
  return "Good Night";
}

export default function DashboardPage() {
  const [userName, setUserName] = useState("there");
  const [greeting, setGreeting] = useState("Welcome");
  const [activeWorkflow, setActiveWorkflow] = useState<string | null>(null);
  const [workflowProgress, setWorkflowProgress] = useState(0);

  const [stats, setStats] = useState({
    agentsCount: 0,
    documentsCount: 0,
    automationsCount: 0,
    hasBusinessProfile: false,
  });

  useEffect(() => {
    setGreeting(getGreeting());

    const storedName = localStorage.getItem("aura_user_name");
    if (storedName) {
      setUserName(storedName);
    } else {
      const token = localStorage.getItem("aura_token");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload.name) {
            setUserName(payload.name);
          }
        } catch (e) {}
      }
    }

    // Fetch real stats
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/dashboard/stats");
        if (res.ok) {
          const data = await res.json();
          setStats({
            agentsCount: data.stats.agentsCount,
            documentsCount: data.stats.documentsCount,
            automationsCount: data.stats.automationsCount,
            hasBusinessProfile: !!data.profile?.businessName,
          });
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    };
    fetchStats();
  }, []);

  // Simulate an AI workflow when a quick action is clicked
  const handleWorkflowStart = async (title: string) => {
    setActiveWorkflow(title);
    setWorkflowProgress(0);
    
    try {
      await fetch("/api/quick-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actionTitle: title })
      });
    } catch (e) {
      console.error(e);
    }

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setActiveWorkflow(null);
        }, 1000);
      }
      setWorkflowProgress(progress);
    }, 400);
  };

  const statusBadges = [
    { label: stats.hasBusinessProfile ? "Business Ready" : "Missing Profile", icon: CheckCircle2, color: stats.hasBusinessProfile ? "text-[#42D392]" : "text-[#0A121A]/30" },
    { label: `${stats.documentsCount} Docs Loaded`, icon: Database, color: stats.documentsCount > 0 ? "text-[#4F7CFF]" : "text-[#0A121A]/30" },
    { label: `${stats.agentsCount} Agents Active`, icon: Bot, color: stats.agentsCount > 0 ? "text-[#7B5CFF]" : "text-[#0A121A]/30" },
    { label: `${stats.automationsCount} Automations`, icon: Zap, color: stats.automationsCount > 0 ? "text-[#F7B955]" : "text-[#0A121A]/30" },
    { label: "Secure Workspace", icon: ShieldCheck, color: "text-[#2FD9FF]" },
  ];

  const quickActions = [
    { title: "Generate Business Plan", icon: FileText, desc: "Create a comprehensive strategy.", glow: "blue" },
    { title: "Marketing Strategy", icon: Megaphone, desc: "Plan campaigns and content.", glow: "violet" },
    { title: "Revenue Analysis", icon: TrendingUp, desc: "Forecast and financial models.", glow: "cyan" },
    { title: "Research Competitors", icon: Search, desc: "Analyze market landscape.", glow: "blue" },
    { title: "Upload Knowledge", icon: UploadCloud, desc: "Add PDFs, links, or text.", glow: "violet" },
    { title: "Generate Reports", icon: PieChart, desc: "Weekly performance summaries.", glow: "cyan" },
    { title: "Business Automation", icon: Settings, desc: "Configure workflows.", glow: "blue" },
    { title: "Customer Support", icon: Headphones, desc: "Train support agent.", glow: "violet" },
    { title: "Email Automation", icon: Mail, desc: "Draft and schedule emails.", glow: "cyan" },
    { title: "Create Proposal", icon: Edit3, desc: "Client pitching documents.", glow: "blue" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-12">
      {/* Top Hero Section */}
      <GlassCard glow="blue" hover="none" animate={true} delay={0} className="p-10 flex flex-col items-center text-center mt-4 border-white/60 relative overflow-hidden">
        
        {/* Decorative background blurs inside hero */}
        <div className="absolute top-[-50%] left-[-10%] w-[60%] h-[150%] bg-[#4F7CFF]/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-50%] right-[-10%] w-[60%] h-[150%] bg-[#2FD9FF]/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center w-full">
          <AuraLogo size="lg" className="mb-8" />
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-[#0A121A] mb-2 tracking-tight"
          >
            {greeting}, {userName}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[#0A121A]/60 text-lg mb-8 max-w-xl font-medium"
          >
            Your AI Business Operating System is online. Agents are standing by.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-10"
          >
            {statusBadges.map((badge, idx) => {
              const Icon = badge.icon;
              return (
                <div key={idx} className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/40 shadow-[0_4px_20px_rgba(79,124,255,0.05)] bg-white/40 backdrop-blur-md">
                  <Icon className={`w-4 h-4 ${badge.color}`} />
                  <span className="text-sm font-medium text-[#0A121A]/80">{badge.label}</span>
                </div>
              );
            })}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button size="lg" onClick={() => window.location.href='/dashboard/start'} className="rounded-full px-8 text-base font-medium h-14">
              Deploy AI Workforce
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 text-base font-medium h-14 bg-white/30 hover:bg-white/50">
              System Settings
            </Button>
          </motion.div>
        </div>
      </GlassCard>

      {/* Quick Actions */}
      <section>
        <div className="flex items-center justify-between mb-6 px-2">
          <h2 className="text-2xl font-bold text-[#0A121A] tracking-tight">Quick Actions</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <GlassCard 
                key={idx} 
                glow={action.glow as any} 
                hover="lift" 
                animate={true} 
                delay={0.05 * idx}
                className="p-5 group cursor-pointer transition-all"
                onClick={() => handleWorkflowStart(action.title)}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/80 to-white/30 border border-white/60 shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-5 h-5 text-[#4F7CFF]" />
                </div>
                <h3 className="font-semibold text-[#0A121A] mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#4F7CFF] group-hover:to-[#7B5CFF] transition-all duration-300 text-sm leading-tight">{action.title}</h3>
                <p className="text-xs text-[#0A121A]/50 line-clamp-2">{action.desc}</p>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* Simulated AI Workflow Overlay */}
      <AnimatePresence>
        {activeWorkflow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#FCFDFF]/60 backdrop-blur-sm"
          >
            <GlassCard className="w-full max-w-md p-8 text-center" glow="blue">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <AuraLogo size="lg" />
              </div>
              <h3 className="text-xl font-bold text-[#0A121A] mb-2">{activeWorkflow}</h3>
              <p className="text-[#0A121A]/60 mb-6">Agents are collaborating on this task...</p>
              
              <div className="w-full h-2 bg-white/50 rounded-full overflow-hidden border border-white/60">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#4F7CFF] to-[#2FD9FF]"
                  animate={{ width: `${workflowProgress}%` }}
                  transition={{ ease: "linear", duration: 0.4 }}
                />
              </div>
              <div className="mt-2 text-sm font-medium text-[#4F7CFF]">{workflowProgress}% Complete</div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
