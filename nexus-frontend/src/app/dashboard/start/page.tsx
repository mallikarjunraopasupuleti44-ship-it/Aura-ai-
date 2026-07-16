"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { 
  Rocket, BrainCircuit, LineChart, Users, Globe, LayoutList, CheckCircle2,
  Clock, FileText, Activity, ArrowRight, ChevronRight, Link as LinkIcon,
  Zap, Search, X, ChevronLeft, Sparkles, Eye, ThumbsUp, RotateCcw, Copy, Check
} from "lucide-react";
import ReactMarkdown from 'react-markdown';

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);
const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
);
const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.73 11.73M4 20l6.76-6.76M20 20l-6.76-6.76M20 4l-11.73 11.73"></path></svg>
);

function AnimatedCounter({ value, duration = 1000 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const end = value;
    if (end === 0) { setDisplay(0); return; }
    const increment = end / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) { setDisplay(end); clearInterval(timer); } 
      else { setDisplay(Math.floor(current)); }
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);
  return <>{display}</>;
}

function ShimmerSkeleton() {
  return (
    <div className="space-y-2 mt-3">
      <div className="h-2.5 aurora-shimmer rounded-full w-full opacity-60" />
      <div className="h-2.5 aurora-shimmer rounded-full w-4/5 opacity-60" style={{ animationDelay: '0.15s' }} />
      <div className="h-2.5 aurora-shimmer rounded-full w-3/5 opacity-60" style={{ animationDelay: '0.3s' }} />
    </div>
  );
}

function ProgressRing({ completed, total }: { completed: number; total: number }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const progress = total > 0 ? (completed / total) * circumference : 0;
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <svg className="w-12 h-12 -rotate-90" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r={radius} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="3" />
        <motion.circle cx="22" cy="22" r={radius} fill="none" stroke="url(#progressGrad)" strokeWidth="3" strokeLinecap="round" initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: circumference - progress }} transition={{ duration: 0.8, ease: "easeOut" }} strokeDasharray={circumference} />
        <defs>
          <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4F7CFF" />
            <stop offset="100%" stopColor="#2FD9FF" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute text-xs font-bold text-[#0A121A]">{completed}/{total}</span>
    </div>
  );
}

const agents = [
  { id: "planner", name: "Planner Agent", role: "Business Strategist", icon: BrainCircuit, bg: "bg-[#7B5CFF]/10", text: "text-[#7B5CFF]", glow: "violet", description: "Turns your idea into a complete business plan.", deliverable: "Business Plan" },
  { id: "marketing", name: "Marketing Agent", role: "Growth Marketer", icon: Users, bg: "bg-[#4F7CFF]/10", text: "text-[#4F7CFF]", glow: "blue", description: "Creates ready-to-publish social content.", deliverable: "Social Campaign" },
  { id: "finance", name: "Finance Agent", role: "Financial Analyst", icon: LineChart, bg: "bg-[#2FD9FF]/10", text: "text-[#2FD9FF]", glow: "cyan", description: "Builds startup cost analysis and 12-month projections.", deliverable: "Cost Analysis" },
  { id: "operations", name: "Operations Agent", role: "Operations Manager", icon: LayoutList, bg: "bg-[#7B5CFF]/10", text: "text-[#7B5CFF]", glow: "violet", description: "Produces weekly schedules and SOPs.", deliverable: "Weekly Schedule" },
  { id: "website", name: "Website Agent", role: "Web Developer", icon: Globe, bg: "bg-[#4F7CFF]/10", text: "text-[#4F7CFF]", glow: "blue", description: "Generates a live landing page for your business.", deliverable: "Landing Page" }
];

export default function StartBusinessPage() {
  const [prompt, setPrompt] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [activeTab, setActiveTab] = useState("Command Center");
  const [activityLog, setActivityLog] = useState<{ text: string; time: string; type: 'info' | 'success' | 'error' | 'system' }[]>([]);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectStatus, setProjectStatus] = useState<any>(null);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const loggedAgentsRef = useRef<Set<string>>(new Set());

  const addLog = useCallback((text: string, type: 'info' | 'success' | 'error' | 'system' = 'info') => {
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setActivityLog(prev => [...prev, { text, time, type }]);
  }, []);

  const handleDeploy = async () => {
    if (!prompt.trim() || isDeploying) return;
    setIsDeploying(true);
    setProjectStatus(null);
    setSelectedTask(null);
    setIsPanelOpen(false);
    setActivityLog([]);
    loggedAgentsRef.current = new Set();
    
    addLog(`Goal assigned: ${prompt}`, 'system');
    addLog("Initializing AI Workforce...", 'info');
    
    try {
      const API_URL = "https://aura-ai-orio.onrender.com";
      const token = localStorage.getItem("aura_token");
      const res = await fetch(`${API_URL}/api/ai/deploy`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ ideaPrompt: prompt })
      });
      if (!res.ok) throw new Error((await res.json().catch(()=>null))?.error || "Deployment failed");
      
      const data = await res.json();
      setProjectId(data.projectId);
      setProjectStatus({ status: 'deploying', agentTasks: [] });
      addLog("AI Team deployed — agents are thinking...", 'success');
    } catch (err: any) {
      addLog(`Error: ${err.message}`, 'error');
      addLog("If using a free Render backend, it may take 1-2 minutes to wake up.", 'info');
      setIsDeploying(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (projectId && projectStatus?.status !== 'completed') {
      interval = setInterval(async () => {
        try {
          const API_URL = "https://aura-ai-orio.onrender.com";
          const token = localStorage.getItem("aura_token");
          const res = await fetch(`${API_URL}/api/ai/status/${projectId}`, {
            headers: { "Authorization": `Bearer ${token}` },
            cache: 'no-store'
          });
          if (res.ok) {
            const data = await res.json();
            setProjectStatus(data.project);
            if (data.project.agentTasks) {
              data.project.agentTasks.forEach((task: any) => {
                if (!loggedAgentsRef.current.has(task.agentName)) {
                  loggedAgentsRef.current.add(task.agentName);
                  if (task.agentName === 'System Error') {
                    addLog(`${task.agentName} — ${task.deliverable} ready for review`, 'error');
                  } else {
                    addLog(`${task.agentName} finished — ${task.deliverable} ready for review`, 'success');
                  }
                }
              });
            }
            if (data.project.status === 'completed') {
              addLog("All deliverables completed successfully!", 'system');
              setIsDeploying(false);
            }
          }
        } catch (err) {}
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [projectId, projectStatus?.status, addLog]);

  const openPanel = (task: any) => { setSelectedTask(task); setIsPanelOpen(true); };
  const closePanel = () => { setIsPanelOpen(false); setTimeout(() => setSelectedTask(null), 300); };
  const copyContent = () => { if (selectedTask?.content) { navigator.clipboard.writeText(selectedTask.content); setCopied(true); setTimeout(() => setCopied(false), 2000); } };

  const completedCount = projectStatus?.agentTasks?.filter((t: any) => t.agentName !== 'System Error').length || 0;

  return (
    <div className="max-w-[1400px] mx-auto pb-12 flex flex-col gap-8">
      
      {/* HEADER SECTION */}
      <GlassCard className="p-8 md:p-12 border-white/60">
        <div className="flex items-center gap-2 text-sm font-medium text-[#0A121A]/50 mb-6">
          <span>Home</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#4F7CFF] bg-[#4F7CFF]/10 px-2 py-0.5 rounded flex items-center gap-1.5">
            <Rocket className="w-3.5 h-3.5" /> Aura AI
            <span className="text-[10px] tracking-widest uppercase ml-1">MISSION CONTROL</span>
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-[#0A121A] mb-4 tracking-tight">What business do you want to build?</h1>
        <p className="text-[#0A121A]/60 mb-8 max-w-2xl text-base md:text-lg leading-relaxed">
          Type your idea and your AI team gets to work — business plan, social campaign, cost analysis, operations and a live landing page. You review and approve every deliverable.
        </p>

        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full bg-white/40 backdrop-blur-md rounded-xl shadow-sm border border-white/60 overflow-hidden focus-within:border-[#4F7CFF]/50 focus-within:ring-2 focus-within:ring-[#4F7CFF]/20 transition-all">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder='e.g. "I want to start a bakery"'
              className="w-full bg-transparent outline-none px-6 py-5 text-[#0A121A] placeholder:text-[#0A121A]/40 text-lg"
              onKeyDown={(e) => e.key === 'Enter' && handleDeploy()}
            />
          </div>
          <Button 
            onClick={handleDeploy} 
            disabled={isDeploying || !prompt.trim()}
            className="w-full md:w-auto h-full min-h-[68px] rounded-xl px-10 bg-[#4F7CFF] hover:bg-[#7B5CFF] text-white font-semibold text-lg shadow-[0_0_20px_rgba(79,124,255,0.4)]"
          >
            <Rocket className="w-6 h-6 mr-3" />
            {isDeploying ? "Deploying..." : "Deploy AI Team"}
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-6">
          <span className="text-sm font-medium text-[#0A121A]/40">Try:</span>
          {["I want to start a bakery", "Launch a home-cooked tiffin delivery service", "Open a specialty coffee shop"].map((suggestion) => (
            <button 
              key={suggestion}
              onClick={() => setPrompt(suggestion)}
              className="px-4 py-2 rounded-full border border-white/40 bg-white/30 text-xs font-medium text-[#0A121A]/70 hover:bg-white/60 hover:text-[#4F7CFF] transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* STATS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "TASKS COMPLETED", value: completedCount, icon: CheckCircle2, color: "text-[#42D392]" },
          { label: "WORDS PRODUCED", value: completedCount * 450, icon: FileText, color: "text-[#4F7CFF]" },
          { label: "HOURS SAVED", value: completedCount * 12, icon: Clock, color: "text-[#F7B955]", suffix: "h" },
          { label: "AGENTS ACTIVE", value: (isDeploying || projectStatus?.status === 'deploying') ? 5 - completedCount : 0, icon: Activity, color: "text-[#7B5CFF]" },
        ].map((stat, i) => (
          <GlassCard key={i} className="p-6">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full bg-white/50 border border-white/60 shadow-sm flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-3xl font-bold text-[#0A121A]">
                  <AnimatedCounter value={stat.value} />{stat.suffix}
                </div>
                <div className="text-[10px] font-bold tracking-widest text-[#0A121A]/40 uppercase mt-1">{stat.label}</div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* TABS */}
      <GlassCard className="p-2 border-white/60 flex items-center">
        {["Command Center", "Team", "Automation"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all ${
              activeTab === tab 
                ? "bg-white/60 shadow-sm text-[#4F7CFF] border border-white/80" 
                : "text-[#0A121A]/60 hover:text-[#0A121A] hover:bg-white/40"
            }`}
          >
            {tab === "Team" ? (
              <span className="flex items-center justify-center gap-2"><Users className="w-4 h-4" /> {tab}</span>
            ) : tab === "Command Center" ? (
              <span className="flex items-center justify-center gap-2"><LayoutList className="w-4 h-4" /> {tab}</span>
            ) : (
              <span className="flex items-center justify-center gap-2"><Zap className="w-4 h-4" /> {tab}</span>
            )}
          </button>
        ))}
      </GlassCard>

      {/* MAIN CONTENT AREA */}
      {activeTab === "Command Center" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Agent Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {agents.map((agent, index) => {
              const task = projectStatus?.agentTasks?.find((t: any) => t.agentName === agent.name);
              const isCompleted = !!task;
              const isActive = (isDeploying || projectStatus?.status === 'deploying') && !isCompleted;
              const previewSnippet = task?.content ? task.content.replace(/[#*_`]/g, '').split('\n').filter((l: string) => l.trim()).slice(0, 2).join(' ').substring(0, 120) + '...' : null;
              
              return (
                <motion.div key={agent.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05, duration: 0.4 }}>
                  <GlassCard 
                    glow={isActive ? agent.glow as any : "none"}
                    hover={isCompleted ? "lift" : "none"}
                    className={`p-6 cursor-pointer transition-all duration-500 ${
                      isActive ? "ring-2 ring-white/50" : isCompleted ? `border-white/60 ring-1 ring-white/30` : "border-white/30"
                    }`}
                    onClick={() => isCompleted && openPanel(task)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-3 items-center">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isCompleted ? `bg-[#4F7CFF] text-white shadow-lg` : `${agent.bg} ${agent.text} border border-white/40`}`}>
                          <agent.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-[#0A121A] leading-tight text-lg">{agent.name}</h3>
                          <p className="text-xs font-bold text-[#0A121A]/40 uppercase tracking-wider mt-1">{agent.role}</p>
                        </div>
                      </div>
                      <div className={`text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-full border uppercase flex items-center gap-1.5 ${
                        isActive ? "bg-[#7B5CFF]/10 text-[#7B5CFF] border-[#7B5CFF]/30" : isCompleted ? "bg-[#42D392]/10 text-[#42D392] border-[#42D392]/30" : "bg-white/30 text-[#0A121A]/50 border-white/50"
                      }`}>
                        {isActive && <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7B5CFF] opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-[#7B5CFF]"></span></span>}
                        {isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {isActive ? "THINKING" : isCompleted ? "COMPLETED" : "IDLE"}
                      </div>
                    </div>
                    <p className="text-sm text-[#0A121A]/70 leading-relaxed line-clamp-2">{agent.description}</p>
                    {isActive && <ShimmerSkeleton />}
                    {isCompleted && previewSnippet && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.4 }} className="mt-4 p-4 bg-white/40 rounded-xl border border-white/60 shadow-inner">
                        <p className="text-xs text-[#0A121A]/60 leading-relaxed line-clamp-2 font-medium">{previewSnippet}</p>
                      </motion.div>
                    )}
                    <div className="text-xs text-[#0A121A]/60 bg-white/30 rounded-xl p-3 border border-white/50 flex justify-between items-center mt-4">
                      <div><span className="font-medium">Deliverable: </span><span className="font-semibold text-[#0A121A]">{agent.deliverable}</span></div>
                      {isCompleted && <button onClick={(e) => { e.stopPropagation(); openPanel(task); }} className="bg-[#4F7CFF] hover:bg-[#7B5CFF] text-white font-bold px-4 py-2 rounded-full flex items-center gap-1.5 transition-all shadow-md text-xs"><Eye className="w-3.5 h-3.5" /> View Report</button>}
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>

          {/* RIGHT: Team Activity */}
          <div className="lg:col-span-1">
            <GlassCard className="h-full min-h-[500px] flex flex-col">
              <div className="p-6 border-b border-white/30 flex justify-between items-center bg-white/20 sticky top-0 z-10 rounded-t-2xl">
                <h3 className="font-bold text-[#0A121A] text-lg">Team Activity</h3>
                <div className="flex items-center gap-3">
                  {(isDeploying || completedCount > 0) && <ProgressRing completed={completedCount} total={5} />}
                  <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-[#42D392] uppercase bg-[#42D392]/10 px-2.5 py-1 rounded-md border border-[#42D392]/30">
                    <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#42D392] opacity-75"></span><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#42D392]"></span></span>
                    LIVE
                  </div>
                </div>
              </div>
              <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                <AnimatePresence>
                  {activityLog.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex items-center justify-center text-center p-6">
                      <div>
                        <Sparkles className="w-10 h-10 text-[#0A121A]/20 mx-auto mb-4" />
                        <p className="text-sm text-[#0A121A]/50 font-medium">Your AI team&apos;s activity will appear here once you assign a goal.</p>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="space-y-3">
                      {activityLog.map((log, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -15, y: 5 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }} className={`flex gap-3 text-sm p-3 rounded-xl border ${log.type === 'success' ? 'bg-[#42D392]/10 border-[#42D392]/20' : log.type === 'error' ? 'bg-[#FF6B81]/10 border-[#FF6B81]/20' : log.type === 'system' ? 'bg-[#4F7CFF]/10 border-[#4F7CFF]/20' : 'bg-white/40 border-white/50'}`}>
                          <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${log.type === 'success' ? 'bg-[#42D392]' : log.type === 'error' ? 'bg-[#FF6B81]' : log.type === 'system' ? 'bg-[#4F7CFF]' : 'bg-[#0A121A]/40'}`} />
                          <div className="flex-1 min-w-0">
                            <span className="text-[#0A121A] font-medium leading-snug block">{log.text}</span>
                            <span className="text-[10px] font-bold tracking-wider uppercase text-[#0A121A]/40 mt-1 block">{log.time}</span>
                          </div>
                        </motion.div>
                      ))}
                      {isDeploying && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 text-sm p-3 rounded-xl bg-[#7B5CFF]/10 border border-[#7B5CFF]/20">
                          <div className="mt-2 flex gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#7B5CFF] animate-bounce" style={{ animationDelay: '0ms' }} /><span className="w-1.5 h-1.5 rounded-full bg-[#7B5CFF] animate-bounce" style={{ animationDelay: '150ms' }} /><span className="w-1.5 h-1.5 rounded-full bg-[#7B5CFF] animate-bounce" style={{ animationDelay: '300ms' }} /></div>
                          <span className="text-[#7B5CFF] text-xs font-bold uppercase tracking-wider">Agents are thinking...</span>
                        </motion.div>
                      )}
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {/* TEAM TAB CONTENT */}
      {activeTab === "Team" && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-2 px-2">
            <div>
              <h2 className="text-2xl font-bold text-[#0A121A]">Your AI Workforce</h2>
              <p className="text-[#0A121A]/60 text-sm">Hire, edit, pause or remove employees. You are the CEO.</p>
            </div>
            <Button className="rounded-xl px-6">
              <Users className="w-4 h-4 mr-2" />
              Hire Employee
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <GlassCard key={agent.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3 items-center">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border border-white/50 shadow-sm ${agent.bg} ${agent.text}`}>
                      <agent.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#0A121A] leading-tight text-lg">{agent.name}</h3>
                      <p className="text-[10px] font-bold text-[#0A121A]/40 uppercase tracking-wider mt-1">{agent.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full border border-white/60 bg-white/40 text-[#0A121A]/60 uppercase shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#4F7CFF]" />
                    Core team
                  </div>
                </div>
                <p className="text-sm text-[#0A121A]/70 mb-8 flex-1 leading-relaxed">{agent.description}</p>
                <div className="pt-5 border-t border-white/40 flex items-center justify-between mt-auto z-20">
                  <button className="flex items-center gap-2 text-sm font-bold text-[#0A121A]/60 hover:text-[#4F7CFF] transition-colors cursor-pointer relative z-20">
                    <Rocket className="w-4 h-4" />
                    Assign task
                  </button>
                  <div className="flex items-center gap-2 relative z-20">
                    <button className="w-9 h-9 rounded-full border border-white/60 bg-white/30 flex items-center justify-center text-[#0A121A]/50 hover:bg-white/60 hover:text-[#7B5CFF] hover:border-[#7B5CFF]/30 transition-colors cursor-pointer shadow-sm">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                    </button>
                    <button className="w-9 h-9 rounded-full border border-white/60 bg-white/30 flex items-center justify-center text-[#0A121A]/50 hover:bg-white/60 hover:text-[#FF6B81] hover:border-[#FF6B81]/30 transition-colors cursor-pointer shadow-sm">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="4" height="16" x="6" y="4"/><rect width="4" height="16" x="14" y="4"/></svg>
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* AUTOMATION TAB CONTENT */}
      {activeTab === "Automation" && (
        <div className="flex flex-col gap-6">
          <div className="mt-2 px-2">
            <h2 className="text-2xl font-bold text-[#0A121A]">Automation Hub</h2>
            <p className="text-[#0A121A]/60 text-sm">Connect your channels once — your Marketing Agent publishes content automatically on schedule.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#E1306C]/10 text-[#E1306C] flex items-center justify-center border border-[#E1306C]/20 shadow-sm">
                  <InstagramIcon className="w-6 h-6" />
                </div>
                <div><h3 className="font-bold text-[#0A121A]">Instagram</h3><p className="text-[10px] font-bold text-[#0A121A]/40 uppercase tracking-widest mt-0.5">Not connected</p></div>
              </div>
              <button className="w-10 h-10 rounded-full border border-white/60 bg-white/40 flex items-center justify-center text-[#0A121A]/40 hover:bg-white/70 hover:text-[#E1306C] transition-colors relative z-20 cursor-pointer shadow-sm"><LinkIcon className="w-4 h-4" /></button>
            </GlassCard>
            <GlassCard className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#FF0000]/10 text-[#FF0000] flex items-center justify-center border border-[#FF0000]/20 shadow-sm">
                  <YoutubeIcon className="w-6 h-6" />
                </div>
                <div><h3 className="font-bold text-[#0A121A]">YouTube</h3><p className="text-[10px] font-bold text-[#0A121A]/40 uppercase tracking-widest mt-0.5">Not connected</p></div>
              </div>
              <button className="w-10 h-10 rounded-full border border-white/60 bg-white/40 flex items-center justify-center text-[#0A121A]/40 hover:bg-white/70 hover:text-[#FF0000] transition-colors relative z-20 cursor-pointer shadow-sm"><LinkIcon className="w-4 h-4" /></button>
            </GlassCard>
            <GlassCard className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#1DA1F2]/10 text-[#1DA1F2] flex items-center justify-center border border-[#1DA1F2]/20 shadow-sm">
                  <TwitterIcon className="w-6 h-6" />
                </div>
                <div><h3 className="font-bold text-[#0A121A]">X (Twitter)</h3><p className="text-[10px] font-bold text-[#0A121A]/40 uppercase tracking-widest mt-0.5">Not connected</p></div>
              </div>
              <button className="w-10 h-10 rounded-full border border-white/60 bg-white/40 flex items-center justify-center text-[#0A121A]/40 hover:bg-white/70 hover:text-[#1DA1F2] transition-colors relative z-20 cursor-pointer shadow-sm"><LinkIcon className="w-4 h-4" /></button>
            </GlassCard>
          </div>
          <GlassCard className="mt-4 p-8">
            <div className="flex items-center gap-2 text-sm font-bold text-[#0A121A] mb-8">
              <Zap className="w-5 h-5 text-[#F7B955] fill-[#F7B955]" /> Publishing Workflow
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold tracking-wider text-[#0A121A]/50 uppercase bg-white/20 p-5 rounded-2xl border border-white/40">
              <span className="text-[#0A121A] bg-white/60 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm border border-white/80">Marketing Agent generates</span>
              <ArrowRight className="w-4 h-4 text-[#0A121A]/30" />
              <span className="text-[#0A121A] bg-white/60 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm border border-white/80">Owner approves</span>
              <ArrowRight className="w-4 h-4 text-[#0A121A]/30" />
              <span className="text-[#0A121A] bg-white/60 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm border border-white/80">Scheduler queues</span>
              <ArrowRight className="w-4 h-4 text-[#0A121A]/30" />
              <span className="text-[#0A121A] bg-white/60 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm border border-white/80">Auto-publish to channels</span>
            </div>
            <div className="mt-8 border border-dashed border-[#0A121A]/20 bg-white/20 rounded-2xl p-12 flex items-center justify-center text-center">
              <p className="text-[#0A121A]/60 font-medium text-sm max-w-lg leading-relaxed">
                No content queue yet. Deploy a business goal — once the Marketing Agent finishes its campaign, the posts appear here ready to publish.
              </p>
            </div>
          </GlassCard>
        </div>
      )}

      {/* SLIDE-OUT PANEL FOR DELIVERABLE REVIEW */}
      <AnimatePresence>
        {isPanelOpen && selectedTask && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-y-0 right-0 left-[312px] z-40 bg-[#0A121A]/40 backdrop-blur-sm" onClick={closePanel} />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} className="fixed inset-y-0 right-0 left-[312px] m-auto z-50 w-full max-w-4xl h-[85vh] max-h-[850px] bg-white/80 backdrop-blur-2xl rounded-3xl shadow-[0_30px_100px_rgba(79,124,255,0.2)] flex flex-col border border-white/80 overflow-hidden">
              <div className="px-10 py-8 border-b border-white/40 flex justify-between items-center shrink-0 bg-white/40">
                <div>
                  <h3 className="font-bold text-2xl text-[#0A121A] flex items-center gap-3">
                    {selectedTask.deliverable}
                    <span className="text-[10px] bg-[#F7B955]/20 text-[#F7B955] border border-[#F7B955]/30 px-3 py-1 rounded-full uppercase tracking-widest font-bold">Awaiting approval</span>
                  </h3>
                  <p className="text-sm font-medium text-[#0A121A]/50 mt-2">Produced by {selectedTask.agentName} ({selectedTask.agentRole})</p>
                </div>
                <button onClick={closePanel} className="p-3 bg-white/50 hover:bg-white border border-white/60 rounded-full text-[#0A121A]/50 hover:text-[#FF6B81] transition-all shadow-sm"><X className="w-5 h-5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                <div className="prose prose-sm md:prose-base max-w-none text-[#0A121A]/80 prose-headings:text-[#0A121A] prose-headings:font-bold prose-a:text-[#4F7CFF] prose-p:leading-relaxed prose-p:mb-5 prose-li:text-[#0A121A]/80 prose-li:marker:text-[#4F7CFF] prose-strong:text-[#0A121A] prose-strong:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h2:mt-10 prose-h2:mb-5 prose-h3:mt-8 prose-h3:mb-4">
                  <ReactMarkdown>{selectedTask.content}</ReactMarkdown>
                </div>
              </div>
              <div className="px-10 py-6 border-t border-white/40 flex justify-between items-center shrink-0 bg-white/50 backdrop-blur-md">
                <button onClick={copyContent} className="flex items-center gap-2 text-sm text-[#0A121A]/60 hover:text-[#0A121A] transition-colors font-bold px-4 py-2.5 rounded-xl border border-white/60 bg-white/40 hover:bg-white shadow-sm">
                  {copied ? <Check className="w-4 h-4 text-[#42D392]" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy content"}
                </button>
                <div className="flex gap-4">
                  <Button variant="outline" onClick={closePanel} className="rounded-xl border-white/60 bg-white/50 text-[#0A121A]/70 hover:bg-white hover:text-[#0A121A] font-bold flex items-center gap-2 px-6 h-12 shadow-sm">
                    <RotateCcw className="w-4 h-4" /> Request revision
                  </Button>
                  <Button onClick={closePanel} className="rounded-xl bg-gradient-to-r from-[#42D392] to-[#34A873] hover:from-[#34A873] hover:to-[#2A875C] text-white font-bold px-8 h-12 flex items-center gap-2 shadow-lg shadow-[#42D392]/30 border border-[#42D392]/20">
                    <CheckCircle2 className="w-5 h-5" /> Approve work
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
