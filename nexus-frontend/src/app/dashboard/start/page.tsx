"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Rocket, 
  BrainCircuit, 
  LineChart, 
  Users, 
  Globe, 
  LayoutList, 
  CheckCircle2,
  Clock,
  FileText,
  Activity,
  ArrowRight,
  ChevronRight
} from "lucide-react";

const agents = [
  { 
    id: "planner",
    name: "Planner Agent", 
    role: "Business Strategist",
    icon: BrainCircuit, 
    bg: "bg-purple-100",
    text: "text-purple-600",
    description: "Turns your idea into a complete business plan: concept, brand, market and roadmap.",
    deliverable: "Business Plan"
  },
  { 
    id: "marketing",
    name: "Marketing Agent", 
    role: "Growth Marketer",
    icon: Users, 
    bg: "bg-blue-100",
    text: "text-blue-600",
    description: "Creates ready-to-publish social content with captions, hashtags and a posting schedule.",
    deliverable: "Social Campaign"
  },
  { 
    id: "finance",
    name: "Finance Agent", 
    role: "Financial Analyst",
    icon: LineChart, 
    bg: "bg-green-100",
    text: "text-green-600",
    description: "Builds startup cost analysis, break-even point and 12-month projections with charts.",
    deliverable: "Cost Analysis"
  },
  { 
    id: "operations",
    name: "Operations Agent", 
    role: "Operations Manager",
    icon: LayoutList, 
    bg: "bg-indigo-100",
    text: "text-indigo-600",
    description: "Produces weekly schedules, supplier checklists and standard operating procedures.",
    deliverable: "Weekly Schedule"
  },
  { 
    id: "website",
    name: "Website Agent", 
    role: "Web Developer",
    icon: Globe, 
    bg: "bg-orange-100",
    text: "text-orange-600",
    description: "Generates a live landing page for your business using the brand identity.",
    deliverable: "Landing Page"
  }
];

export default function StartBusinessPage() {
  const [prompt, setPrompt] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [activeTab, setActiveTab] = useState("Command Center");
  const [activityLog, setActivityLog] = useState<string[]>([]);
  const [activeAgentIndex, setActiveAgentIndex] = useState(-1);

  const handleDeploy = () => {
    if (!prompt.trim() || isDeploying) return;
    setIsDeploying(true);
    setActivityLog(["Goal assigned: " + prompt, "Initializing AI Workforce..."]);
    setActiveAgentIndex(0);
  };

  useEffect(() => {
    if (activeAgentIndex >= 0 && activeAgentIndex < agents.length) {
      const agent = agents[activeAgentIndex];
      const timer1 = setTimeout(() => {
        setActivityLog(prev => [...prev, `${agent.name} is starting work on ${agent.deliverable}...`]);
      }, 1000);
      
      const timer2 = setTimeout(() => {
        setActivityLog(prev => [...prev, `${agent.name} completed ${agent.deliverable}.`]);
        setActiveAgentIndex(activeAgentIndex + 1);
      }, 4000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else if (activeAgentIndex === agents.length) {
      setTimeout(() => {
        setActivityLog(prev => [...prev, "All deliverables completed successfully!"]);
        setIsDeploying(false);
        setActiveAgentIndex(-1);
      }, 1000);
    }
  }, [activeAgentIndex]);

  return (
    <div className="max-w-[1400px] mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
      
      {/* HEADER SECTION */}
      <div className="glass-card p-6 md:p-10 border border-white/60">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-6">
          <span>Home</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 bg-blue-50 px-2 py-0.5 rounded flex items-center gap-1.5">
            <Rocket className="w-3.5 h-3.5 text-blue-600" /> CofounderAI
            <span className="text-[10px] tracking-widest text-blue-400 uppercase ml-1">Command Center</span>
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">What business do you want to build?</h1>
        <p className="text-gray-500 mb-8 max-w-2xl text-sm md:text-base leading-relaxed">
          Type your idea and your AI team gets to work — business plan, social campaign, cost analysis, operations and a live landing page. You review and approve every deliverable.
        </p>

        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder='e.g. "I want to start a bakery"'
              className="w-full bg-transparent outline-none px-5 py-4 text-gray-800 placeholder:text-gray-400"
              onKeyDown={(e) => e.key === 'Enter' && handleDeploy()}
            />
          </div>
          <Button 
            onClick={handleDeploy} 
            disabled={isDeploying || !prompt.trim()}
            className="w-full md:w-auto rounded-xl px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-md shadow-blue-500/20"
          >
            <Rocket className="w-5 h-5 mr-2" />
            {isDeploying ? "Deploying..." : "Deploy AI Team"}
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-5">
          <span className="text-sm font-medium text-gray-400">Try:</span>
          {["I want to start a bakery", "Launch a home-cooked tiffin delivery service", "Open a specialty coffee shop", "Start an online handmade jewelry brand"].map((suggestion) => (
            <button 
              key={suggestion}
              onClick={() => setPrompt(suggestion)}
              className="px-4 py-1.5 rounded-full border border-gray-200 bg-white/50 text-xs font-medium text-gray-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "TASKS COMPLETED", value: activeAgentIndex > 0 ? activeAgentIndex * 3 : 0, icon: CheckCircle2, color: "text-green-500" },
          { label: "WORDS PRODUCED", value: activeAgentIndex > 0 ? activeAgentIndex * 1500 : 0, icon: FileText, color: "text-blue-500" },
          { label: "HOURS SAVED", value: activeAgentIndex > 0 ? `${activeAgentIndex * 12}h` : "0h", icon: Clock, color: "text-orange-500" },
          { label: "AGENTS ACTIVE", value: isDeploying ? 5 : 0, icon: Activity, color: "text-purple-500" },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-5 border border-white/60 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div className="glass-card p-1 border border-white/60 rounded-xl flex items-center">
        {["Command Center", "Team", "Automation"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${
              activeTab === tab 
                ? "bg-white shadow-sm text-blue-700" 
                : "text-gray-500 hover:text-gray-700 hover:bg-white/40"
            }`}
          >
            {tab === "Team" ? (
              <span className="flex items-center justify-center gap-2">
                <Users className="w-4 h-4" /> {tab}
              </span>
            ) : tab === "Command Center" ? (
              <span className="flex items-center justify-center gap-2">
                <LayoutList className="w-4 h-4" /> {tab}
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Activity className="w-4 h-4" /> {tab}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* MAIN CONTENT AREA */}
      {activeTab === "Command Center" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT: Agent Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {agents.map((agent, index) => {
              const isActive = activeAgentIndex === index;
              const isCompleted = activeAgentIndex > index;
              
              return (
                <div 
                  key={agent.id} 
                  className={`glass-card p-6 border transition-all duration-300 relative overflow-hidden ${
                    isActive ? "border-blue-300 shadow-[0_8px_30px_rgba(59,130,246,0.12)] ring-1 ring-blue-100" : "border-white/60 hover:border-blue-100 hover:shadow-md"
                  }`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="active-agent-bg"
                      className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 -z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                  )}
                  
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-3 items-center">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${agent.bg} ${agent.text}`}>
                        <agent.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 leading-tight">{agent.name}</h3>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{agent.role}</p>
                      </div>
                    </div>
                    <div className={`text-[10px] font-bold tracking-widest px-2 py-1 rounded border uppercase ${
                      isActive 
                        ? "bg-blue-100 text-blue-700 border-blue-200 animate-pulse" 
                        : isCompleted
                          ? "bg-green-50 text-green-600 border-green-200"
                          : "bg-gray-100 text-gray-500 border-gray-200"
                    }`}>
                      {isActive ? "LIVE" : isCompleted ? "DONE" : "IDLE"}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-5 leading-relaxed line-clamp-3">
                    {agent.description}
                  </p>

                  <div className="text-xs text-gray-500 bg-white/50 rounded-md p-2.5 border border-white/60 flex justify-between items-center">
                    <span className="font-medium">Deliverable:</span>
                    <span className="font-semibold text-gray-900">{agent.deliverable}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT: Team Activity */}
          <div className="lg:col-span-1">
            <div className="glass-card border border-white/60 h-full min-h-[500px] flex flex-col relative overflow-hidden">
              <div className="p-5 border-b border-gray-100/50 flex justify-between items-center bg-white/40 backdrop-blur-sm sticky top-0 z-10">
                <h3 className="font-bold text-gray-900">Team Activity</h3>
                <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-green-600 uppercase bg-green-50 px-2 py-1 rounded border border-green-200">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                  </span>
                  LIVE
                </div>
              </div>

              <div className="p-5 flex-1 overflow-y-auto">
                <AnimatePresence>
                  {activityLog.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }}
                      className="h-full flex items-center justify-center text-center p-6"
                    >
                      <p className="text-sm text-gray-400">
                        Your AI team's activity will appear here once you assign a goal.
                      </p>
                    </motion.div>
                  ) : (
                    <div className="space-y-4">
                      {activityLog.map((log, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                          className="flex gap-3 text-sm"
                        >
                          <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                          <span className="text-gray-700 leading-snug">{log}</span>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TEAM TAB CONTENT */}
      {activeTab === "Team" && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your AI Workforce</h2>
              <p className="text-gray-500 text-sm">Hire, edit, pause or remove employees. You are the CEO.</p>
            </div>
            <Button className="rounded-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium px-6 py-2 shadow-md shadow-cyan-500/20">
              <Users className="w-4 h-4 mr-2" />
              Hire Employee
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <div 
                key={agent.id} 
                className="glass-card p-6 border border-white/60 hover:border-blue-100 hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3 items-center">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${agent.bg} ${agent.text}`}>
                      <agent.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 leading-tight">{agent.name}</h3>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{agent.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest px-2 py-1 rounded-full border border-gray-200 bg-white text-gray-600 uppercase">
                    <CheckCircle2 className="w-3 h-3 text-blue-500" />
                    Core team
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-6 flex-1 leading-relaxed">
                  {agent.description}
                </p>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <button className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">
                    <Rocket className="w-4 h-4" />
                    Assign task
                  </button>
                  
                  <div className="flex items-center gap-2">
                    <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-blue-600 transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                    </button>
                    <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-blue-600 transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="4" height="16" x="6" y="4"/><rect width="4" height="16" x="14" y="4"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
