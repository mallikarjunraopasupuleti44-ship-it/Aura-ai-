"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AuraLogo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import Link from "next/link";
import { 
  CheckCircle2, ShieldCheck, Zap, Database, Bot,
  FileText, Megaphone, TrendingUp, Search, UploadCloud, PieChart, Headphones,
  Mail, Edit3, Settings
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
  }, []);

  const statusBadges = [
    { label: "Business Ready", icon: CheckCircle2, color: "text-[#42D392]" },
    { label: "Knowledge Loaded", icon: Database, color: "text-[#4F7CFF]" },
    { label: "Agents Active", icon: Bot, color: "text-[#7B5CFF]" },
    { label: "Automation Ready", icon: Zap, color: "text-[#F7B955]" },
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
      <GlassCard glow="blue" hover="none" animate={true} delay={0} className="p-10 flex flex-col items-center text-center mt-4 border-white/60">
        <div className="relative z-10 flex flex-col items-center">
          <AuraLogo size="lg" className="mb-8" />
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-[#0A121A] mb-2"
          >
            {greeting}, {userName}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[#0A121A]/60 text-lg mb-8 max-w-xl"
          >
            Welcome back. Your AI Workforce is ready to help your business grow.
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
                <div key={idx} className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/40 shadow-sm bg-white/40 backdrop-blur-md">
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
            <Button size="lg" onClick={() => window.location.href='/dashboard/start'} className="rounded-full px-8 text-base font-medium">
              Launch AI
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 text-base font-medium">
              Edit Business
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 text-base font-medium">
              Generate Report
            </Button>
          </motion.div>
        </div>
      </GlassCard>

      {/* Quick Actions */}
      <section>
        <div className="flex items-center justify-between mb-6 px-2">
          <h2 className="text-2xl font-bold text-[#0A121A]">Quick Actions</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <GlassCard 
                key={idx} 
                glow={action.glow as any} 
                hover="lift" 
                animate={true} 
                delay={0.1 * (idx % 4)}
                className="p-5 group cursor-pointer"
                onClick={() => {}}
              >
                <div className="w-10 h-10 rounded-xl bg-white/50 border border-white/60 shadow-inner flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-5 h-5 text-[#4F7CFF]" />
                </div>
                <h3 className="font-semibold text-[#0A121A] mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#4F7CFF] group-hover:to-[#7B5CFF] transition-all duration-300">{action.title}</h3>
                <p className="text-sm text-[#0A121A]/60">{action.desc}</p>
              </GlassCard>
            );
          })}
        </div>
      </section>
    </div>
  );
}
