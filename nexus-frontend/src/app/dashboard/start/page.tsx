"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
  ChevronRight,
  Link,
  Zap,
  Search,
  X,
  ChevronLeft,
  Sparkles,
  Eye,
  ThumbsUp,
  RotateCcw,
  Copy,
  Check
} from "lucide-react";
import ReactMarkdown from 'react-markdown';

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l11.73 11.73M4 20l6.76-6.76M20 20l-6.76-6.76M20 4l-11.73 11.73"></path>
  </svg>
);

// --- Animated Counter ---
function AnimatedCounter({ value, duration = 1000 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  
  useEffect(() => {
    const end = value;
    if (end === 0) { setDisplay(0); return; }
    const increment = end / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setDisplay(end);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(current));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);
  
  return <>{display}</>;
}

// --- Shimmer Skeleton for Loading State ---
function ShimmerSkeleton() {
  return (
    <div className="space-y-2 mt-3">
      <div className="h-2.5 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full w-full animate-pulse" />
      <div className="h-2.5 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full w-4/5 animate-pulse" style={{ animationDelay: '0.15s' }} />
      <div className="h-2.5 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full w-3/5 animate-pulse" style={{ animationDelay: '0.3s' }} />
    </div>
  );
}

// --- GlowCard Component ---
function GlowCard({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return;
    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={() => { setIsFocused(true); setOpacity(1); }}
      onBlur={() => { setIsFocused(false); setOpacity(0); }}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden rounded-2xl glass-card transition-all duration-300 border border-white/60 hover:border-pink-200 hover:shadow-lg ${className}`}
      {...props}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 z-0"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(236, 72, 153, 0.15), transparent 40%)`,
        }}
      />
      <div className="relative z-10 h-full flex flex-col">
        {children}
      </div>
    </div>
  );
}

// --- Progress Ring ---
function ProgressRing({ completed, total }: { completed: number; total: number }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const progress = total > 0 ? (completed / total) * circumference : 0;
  
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <svg className="w-12 h-12 -rotate-90" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="3" />
        <motion.circle 
          cx="22" cy="22" r={radius} fill="none" 
          stroke="url(#progressGrad)" strokeWidth="3" strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          strokeDasharray={circumference}
        />
        <defs>
          <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute text-xs font-bold text-gray-700">{completed}/{total}</span>
    </div>
  );
}

const agents = [
  { 
    id: "planner", name: "Planner Agent", role: "Business Strategist",
    icon: BrainCircuit, bg: "bg-purple-100", text: "text-purple-600",
    gradientFrom: "from-purple-500", gradientTo: "to-violet-600", ringColor: "ring-purple-200",
    description: "Turns your idea into a complete business plan: concept, brand, market and roadmap.",
    deliverable: "Business Plan"
  },
  { 
    id: "marketing", name: "Marketing Agent", role: "Growth Marketer",
    icon: Users, bg: "bg-blue-100", text: "text-blue-600",
    gradientFrom: "from-blue-500", gradientTo: "to-cyan-600", ringColor: "ring-blue-200",
    description: "Creates ready-to-publish social content with captions, hashtags and a posting schedule.",
    deliverable: "Social Campaign"
  },
  { 
    id: "finance", name: "Finance Agent", role: "Financial Analyst",
    icon: LineChart, bg: "bg-green-100", text: "text-green-600",
    gradientFrom: "from-emerald-500", gradientTo: "to-green-600", ringColor: "ring-green-200",
    description: "Builds startup cost analysis, break-even point and 12-month projections with charts.",
    deliverable: "Cost Analysis"
  },
  { 
    id: "operations", name: "Operations Agent", role: "Operations Manager",
    icon: LayoutList, bg: "bg-indigo-100", text: "text-indigo-600",
    gradientFrom: "from-indigo-500", gradientTo: "to-purple-600", ringColor: "ring-indigo-200",
    description: "Produces weekly schedules, supplier checklists and standard operating procedures.",
    deliverable: "Weekly Schedule"
  },
  { 
    id: "website", name: "Website Agent", role: "Web Developer",
    icon: Globe, bg: "bg-orange-100", text: "text-orange-600",
    gradientFrom: "from-orange-500", gradientTo: "to-amber-600", ringColor: "ring-orange-200",
    description: "Generates a live landing page for your business using the brand identity.",
    deliverable: "Landing Page"
  }
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

  const addLog = useCallback((text: string, type: 'info' | 'success' | 'error' | 'system' = 'info') => {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
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
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ ideaPrompt: prompt })
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || "Deployment failed");
      }
      
      const data = await res.json();
      setProjectId(data.projectId);
      setProjectStatus({ status: 'deploying', agentTasks: [] });
      addLog("AI Team deployed — agents are thinking...", 'success');
      
    } catch (err: any) {
      console.error(err);
      addLog(`Error: ${err.message}`, 'error');
      addLog("If using a free Render backend, it may take 1-2 minutes to wake up.", 'info');
      setIsDeploying(false);
    }
  };

  const loggedAgentsRef = useRef<Set<string>>(new Set());

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
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [projectId, projectStatus?.status, addLog]);

  const openPanel = (task: any) => {
    setSelectedTask(task);
    setIsPanelOpen(true);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
    setTimeout(() => setSelectedTask(null), 300);
  };

  const copyContent = () => {
    if (selectedTask?.content) {
      navigator.clipboard.writeText(selectedTask.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const completedCount = projectStatus?.agentTasks?.filter((t: any) => t.agentName !== 'System Error').length || 0;

  return (
    <div className="max-w-[1400px] mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
      
      {/* HEADER SECTION */}
      <div className="glass-card p-6 md:p-10 border border-white/60">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-6">
          <span>Home</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 bg-blue-50 px-2 py-0.5 rounded flex items-center gap-1.5">
            <Rocket className="w-3.5 h-3.5 text-blue-600" /> Aura AI
            <span className="text-[10px] tracking-widest text-blue-400 uppercase ml-1">MISSION CONTROL</span>
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
              className="px-4 py-1.5 rounded-full border border-gray-200 bg-white/50 text-xs font-medium text-gray-600 hover:bg-pink-50 hover:border-pink-200 hover:text-pink-600 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "TASKS COMPLETED", value: completedCount, icon: CheckCircle2, color: "text-green-500", suffix: "" },
          { label: "WORDS PRODUCED", value: completedCount * 450, icon: FileText, color: "text-blue-500", suffix: "" },
          { label: "HOURS SAVED", value: completedCount * 12, icon: Clock, color: "text-orange-500", suffix: "h" },
          { label: "AGENTS ACTIVE", value: (isDeploying || projectStatus?.status === 'deploying') ? 5 - completedCount : 0, icon: Activity, color: "text-purple-500", suffix: "" },
        ].map((stat, i) => (
          <GlowCard key={i} className="p-5">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  <AnimatedCounter value={stat.value} />{stat.suffix}
                </div>
                <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">{stat.label}</div>
              </div>
            </div>
          </GlowCard>
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
                ? "bg-white shadow-sm text-pink-600 border border-pink-100" 
                : "text-gray-500 hover:text-gray-700 hover:bg-white/40"
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
      </div>

      {/* MAIN CONTENT AREA */}
      {activeTab === "Command Center" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT: Agent Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {agents.map((agent, index) => {
              const task = projectStatus?.agentTasks?.find((t: any) => t.agentName === agent.name);
              const isCompleted = !!task;
              const isActive = (isDeploying || projectStatus?.status === 'deploying') && !isCompleted;
              
              const previewSnippet = task?.content
                ? task.content.replace(/[#*_`]/g, '').split('\n').filter((l: string) => l.trim()).slice(0, 2).join(' ').substring(0, 120) + '...'
                : null;
              
              return (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                >
                  <GlowCard 
                    className={`p-6 cursor-pointer transition-all duration-500 ${
                      isActive 
                        ? "border-cyan-300 shadow-[0_8px_30px_rgba(6,182,212,0.12)] ring-1 ring-cyan-100" 
                        : isCompleted
                          ? `border-green-200 shadow-[0_8px_30px_rgba(34,197,94,0.08)] ring-1 ${agent.ringColor} hover:shadow-xl hover:-translate-y-0.5`
                          : "hover:shadow-md"
                    }`}
                    onClick={() => isCompleted && openPanel(task)}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/60 to-blue-50/60 -z-10" />
                    )}
                    
                    {isCompleted && (
                      <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 to-emerald-50/20 -z-10" />
                    )}
                    
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex gap-3 items-center">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isCompleted 
                            ? `bg-gradient-to-br ${agent.gradientFrom} ${agent.gradientTo} text-white shadow-sm` 
                            : `${agent.bg} ${agent.text}`
                        }`}>
                          <agent.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 leading-tight">{agent.name}</h3>
                          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{agent.role}</p>
                        </div>
                      </div>
                      
                      <div className={`text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full border uppercase flex items-center gap-1.5 ${
                        isActive 
                          ? "bg-amber-50 text-amber-600 border-amber-200" 
                          : isCompleted
                            ? "bg-green-50 text-green-600 border-green-200"
                            : "bg-gray-100 text-gray-500 border-gray-200"
                      }`}>
                        {isActive && (
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                          </span>
                        )}
                        {isCompleted && <CheckCircle2 className="w-3 h-3" />}
                        {isActive ? "THINKING" : isCompleted ? "COMPLETED" : "IDLE"}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                      {agent.description}
                    </p>

                    {isActive && <ShimmerSkeleton />}

                    {isCompleted && previewSnippet && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.4 }}
                        className="mt-3 p-3 bg-white/70 rounded-lg border border-gray-100 backdrop-blur-sm"
                      >
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                          {previewSnippet}
                        </p>
                      </motion.div>
                    )}

                    <div className="text-xs text-gray-500 bg-white/50 rounded-md p-2.5 border border-white/60 flex justify-between items-center mt-3">
                      <div>
                        <span className="font-medium">Deliverable: </span>
                        <span className="font-semibold text-gray-900">{agent.deliverable}</span>
                      </div>
                      {isCompleted && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); openPanel(task); }}
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all shadow-sm shadow-indigo-500/20 text-[11px]"
                        >
                          <Eye className="w-3 h-3" />
                          View Report
                        </button>
                      )}
                    </div>
                  </GlowCard>
                </motion.div>
              );
            })}
          </div>

          {/* RIGHT: Team Activity */}
          <div className="lg:col-span-1">
            <GlowCard className="h-full min-h-[500px]">
              <div className="p-5 border-b border-gray-100/50 flex justify-between items-center bg-white/40 backdrop-blur-sm sticky top-0 z-10">
                <h3 className="font-bold text-gray-900">Team Activity</h3>
                <div className="flex items-center gap-3">
                  {(isDeploying || completedCount > 0) && (
                    <ProgressRing completed={completedCount} total={5} />
                  )}
                  <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-green-600 uppercase bg-green-50 px-2 py-1 rounded border border-green-200">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                    </span>
                    LIVE
                  </div>
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
                      <div>
                        <Sparkles className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-400">
                          Your AI team&apos;s activity will appear here once you assign a goal.
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="space-y-3">
                      {activityLog.map((log, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, x: -15, y: 5 }}
                          animate={{ opacity: 1, x: 0, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.05 }}
                          className={`flex gap-3 text-sm p-2.5 rounded-lg ${
                            log.type === 'success' ? 'bg-green-50/50' :
                            log.type === 'error' ? 'bg-red-50/50' :
                            log.type === 'system' ? 'bg-indigo-50/50' :
                            'bg-white/30'
                          }`}
                        >
                          <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                            log.type === 'success' ? 'bg-green-500' :
                            log.type === 'error' ? 'bg-red-500' :
                            log.type === 'system' ? 'bg-indigo-500' :
                            'bg-gray-400'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <span className="text-gray-700 leading-snug block">{log.text}</span>
                            <span className="text-[10px] text-gray-400 mt-0.5 block">{log.time}</span>
                          </div>
                        </motion.div>
                      ))}
                      
                      {isDeploying && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex gap-3 text-sm p-2.5 rounded-lg bg-amber-50/50"
                        >
                          <div className="mt-1.5 flex gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                          <span className="text-amber-600 text-xs font-medium">Agents are thinking...</span>
                        </motion.div>
                      )}
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </GlowCard>
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
              <GlowCard key={agent.id} className="p-6">
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
                  <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest px-2 py-1 rounded-full border border-gray-200 bg-white text-gray-600 uppercase shadow-sm">
                    <CheckCircle2 className="w-3 h-3 text-blue-500" />
                    Core team
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-6 flex-1 leading-relaxed">
                  {agent.description}
                </p>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto z-20">
                  <button className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-pink-600 transition-colors cursor-pointer relative z-20">
                    <Rocket className="w-4 h-4" />
                    Assign task
                  </button>
                  
                  <div className="flex items-center gap-2 relative z-20">
                    <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 transition-colors cursor-pointer">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                    </button>
                    <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 transition-colors cursor-pointer">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="4" height="16" x="6" y="4"/><rect width="4" height="16" x="14" y="4"/></svg>
                    </button>
                  </div>
                </div>
              </GlowCard>
            ))}
          </div>
        </div>
      )}

      {/* AUTOMATION TAB CONTENT */}
      {activeTab === "Automation" && (
        <div className="flex flex-col gap-6">
          <div className="mt-2">
            <h2 className="text-2xl font-bold text-gray-900">Automation Hub</h2>
            <p className="text-gray-500 text-sm">Connect your channels once — your Marketing Agent publishes content automatically on schedule.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlowCard className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center border border-pink-100">
                  <InstagramIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Instagram</h3>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Not connected</p>
                </div>
              </div>
              <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-pink-50 hover:text-pink-600 transition-colors relative z-20 cursor-pointer">
                <Link className="w-4 h-4" />
              </button>
            </GlowCard>

            <GlowCard className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
                  <YoutubeIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">YouTube</h3>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Not connected</p>
                </div>
              </div>
              <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-pink-50 hover:text-pink-600 transition-colors relative z-20 cursor-pointer">
                <Link className="w-4 h-4" />
              </button>
            </GlowCard>

            <GlowCard className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-900 flex items-center justify-center border border-gray-200">
                  <TwitterIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">X (Twitter)</h3>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Not connected</p>
                </div>
              </div>
              <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-pink-50 hover:text-pink-600 transition-colors relative z-20 cursor-pointer">
                <Link className="w-4 h-4" />
              </button>
            </GlowCard>
          </div>

          <GlowCard className="mt-4 p-6 md:p-8">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-6">
              <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" /> 
              Publishing Workflow
            </div>
            
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-500 tracking-wide bg-gray-50/50 p-4 rounded-xl border border-gray-100">
              <span className="text-gray-800 bg-white px-3 py-1.5 rounded-md shadow-sm border border-gray-200">Marketing Agent generates</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <span className="text-gray-800 bg-white px-3 py-1.5 rounded-md shadow-sm border border-gray-200">Owner approves</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <span className="text-gray-800 bg-white px-3 py-1.5 rounded-md shadow-sm border border-gray-200">Scheduler queues</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <span className="text-gray-800 bg-white px-3 py-1.5 rounded-md shadow-sm border border-gray-200">Auto-publish to channels</span>
            </div>

            <div className="mt-8 border border-dashed border-gray-200 bg-white/30 rounded-2xl p-10 flex items-center justify-center text-center">
              <p className="text-gray-500 text-sm max-w-lg">
                No content queue yet. Deploy a business goal — once the Marketing Agent finishes its campaign, the posts appear here ready to publish.
              </p>
            </div>
          </GlowCard>
        </div>
      )}

      {/* SLIDE-OUT PANEL FOR DELIVERABLE REVIEW */}
      <AnimatePresence>
        {isPanelOpen && selectedTask && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
              onClick={closePanel}
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-0 m-auto z-50 w-full max-w-3xl h-[85vh] max-h-[800px] bg-[#0A121A] rounded-2xl shadow-2xl flex flex-col border border-gray-800"
            >
              <div className="px-8 py-6 border-b border-gray-800 flex justify-between items-center shrink-0">
                <div>
                  <h3 className="font-bold text-xl text-white flex items-center gap-3">
                    {selectedTask.deliverable}
                    <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                      Awaiting approval
                    </span>
                  </h3>
                  <p className="text-sm text-gray-400 mt-1.5">
                    Produced by {selectedTask.agentName} ({selectedTask.agentRole})
                  </p>
                </div>
                <button 
                  onClick={closePanel} 
                  className="p-2 hover:bg-gray-800 rounded-xl text-gray-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="prose prose-sm md:prose-base max-w-none text-gray-300
                  prose-headings:text-cyan-400 prose-headings:font-semibold
                  prose-a:text-cyan-400 
                  prose-p:leading-relaxed prose-p:mb-4
                  prose-li:text-gray-300 prose-li:marker:text-cyan-500
                  prose-strong:text-white prose-strong:font-semibold
                  prose-h1:text-2xl prose-h2:text-lg prose-h3:text-base 
                  prose-h2:mt-8 prose-h2:mb-4
                  prose-h3:mt-6 prose-h3:mb-3"
                >
                  <ReactMarkdown>{selectedTask.content}</ReactMarkdown>
                </div>
              </div>

              <div className="px-8 py-5 border-t border-gray-800 flex justify-between items-center shrink-0 bg-[#060D13] rounded-b-2xl">
                <button
                  onClick={copyContent}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors font-medium px-3 py-2 rounded-lg hover:bg-gray-800"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy content"}
                </button>
                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    onClick={closePanel} 
                    className="rounded-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white font-medium flex items-center gap-2 px-6"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Request revision
                  </Button>
                  <Button 
                    onClick={closePanel} 
                    className="rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#0A121A] font-bold px-8 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve work
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
