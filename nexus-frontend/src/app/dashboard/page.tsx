"use client";

import React from "react";
import { motion } from "framer-motion";
import { AuraLogo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  CheckCircle2, ShieldCheck, Zap, Database, Bot,
  FileText, Megaphone, TrendingUp, Search, UploadCloud, PieChart, Headphones,
  Mail, Edit3, Settings
} from "lucide-react";

export default function DashboardPage() {
  const statusBadges = [
    { label: "Business Ready", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50", border: "border-green-200" },
    { label: "Knowledge Loaded", icon: Database, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
    { label: "Agents Active", icon: Bot, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200" },
    { label: "Automation Ready", icon: Zap, color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" },
    { label: "Secure Workspace", icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
  ];

  const quickActions = [
    { title: "Generate Business Plan", icon: FileText, desc: "Create a comprehensive strategy." },
    { title: "Marketing Strategy", icon: Megaphone, desc: "Plan campaigns and content." },
    { title: "Revenue Analysis", icon: TrendingUp, desc: "Forecast and financial models." },
    { title: "Research Competitors", icon: Search, desc: "Analyze market landscape." },
    { title: "Upload Knowledge", icon: UploadCloud, desc: "Add PDFs, links, or text." },
    { title: "Generate Reports", icon: PieChart, desc: "Weekly performance summaries." },
    { title: "Business Automation", icon: Settings, desc: "Configure workflows." },
    { title: "Customer Support", icon: Headphones, desc: "Train support agent." },
    { title: "Email Automation", icon: Mail, desc: "Draft and schedule emails." },
    { title: "Create Proposal", icon: Edit3, desc: "Client pitching documents." },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-12">
      {/* Top Hero Section */}
      <section className="relative rounded-3xl overflow-hidden glass-card p-10 flex flex-col items-center text-center mt-4 border-white/80">
        <div className="absolute inset-0 mesh-bg opacity-30" />
        
        <div className="relative z-10 flex flex-col items-center">
          <AuraLogo size="lg" className="mb-8" />
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 mb-2"
          >
            Good Morning, Alexander
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 text-lg mb-8 max-w-xl"
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
                <div key={idx} className={`flex items-center gap-2 px-4 py-2 rounded-full border ${badge.bg} ${badge.border} shadow-sm bg-white/50 backdrop-blur-sm`}>
                  <Icon className={`w-4 h-4 ${badge.color}`} />
                  <span className={`text-sm font-medium text-gray-800`}>{badge.label}</span>
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
            <Button size="lg" onClick={() => window.location.href='/dashboard/start'} className="rounded-full px-8 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white shadow-lg shadow-purple-500/25 border-0 text-base font-medium transition-transform hover:scale-105">
              Launch AI
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 bg-white/80 backdrop-blur-md border-gray-200 text-gray-700 hover:bg-gray-50 text-base font-medium">
              Edit Business
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 bg-white/80 backdrop-blur-md border-gray-200 text-gray-700 hover:bg-gray-50 text-base font-medium">
              Generate Report
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (idx % 4) }}
                key={idx}
              >
                <Link href="#" className="block p-5 rounded-2xl bg-white border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:border-purple-100 hover:-translate-y-1 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-colors">
                    <Icon className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-purple-700 transition-colors">{action.title}</h3>
                  <p className="text-sm text-gray-500">{action.desc}</p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
