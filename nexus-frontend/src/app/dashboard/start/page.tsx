"use client";

import React, { useState, useEffect, useRef } from "react";
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
  X
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

// --- GlowCard Component ---
// Adds a subtle colorful gradient background that follows the mouse
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

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
      {/* Content wrapper with higher z-index to stay above the glow */}
      <div className="relative z-10 h-full flex flex-col">
        {children}
      </div>
    </div>
  );
}

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
  
  // New state variables for real-time polling
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectStatus, setProjectStatus] = useState<any>(null);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const handleDeploy = async () => {
    if (!prompt.trim() || isDeploying) return;
    setIsDeploying(true);
    setActivityLog(["Goal assigned: " + prompt, "Initializing AI Workforce..."]);
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://aura-ai-orio.onrender.com";
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
      
    } catch (err: any) {
      console.error(err);
      setActivityLog(prev => [...prev, `Error: ${err.message}`, "If using a free Render backend, it may take 1-2 minutes to wake up."]);
      setIsDeploying(false);
    }
  };

  // Polling effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (projectId && projectStatus?.status !== 'completed') {
      interval = setInterval(async () => {
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://aura-ai-orio.onrender.com";
          const token = localStorage.getItem("aura_token");
          const res = await fetch(`${API_URL}/api/ai/status/${projectId}`, {
            headers: { "Authorization": `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setProjectStatus(data.project);
            
            // Build activity log based on real agent tasks
            const logs: string[] = ["Goal assigned: " + data.project.ideaPrompt, "Initializing AI Workforce..."];
            if (data.project.agentTasks) {
               data.project.agentTasks.forEach((task: any) => {
                 logs.push(`${task.agentName} finished — ${task.deliverable} ready for review`);
               });
            }
            if (data.project.status === 'completed') {
               logs.push("All deliverables completed successfully!");
               setIsDeploying(false);
            }
            setActivityLog(logs);
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [projectId, projectStatus?.status]);

  return (
    <div className="max-w-[1400px] mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
      
      {/* HEADER SECTION */}
      <div className="glass-card p-6 md:p-10 border border-white/60">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-6">
          <span>Home</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 bg-blue-50 px-2 py-0.5 rounded flex items-center gap-1.5">
            <Rocket className="w-3.5 h-3.5 text-blue-600" /> CofounderAI
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
          { label: "TASKS COMPLETED", value: projectStatus?.agentTasks?.length || 0, icon: CheckCircle2, color: "text-green-500" },
          { label: "WORDS PRODUCED", value: (projectStatus?.agentTasks?.length || 0) * 450, icon: FileText, color: "text-blue-500" },
          { label: "HOURS SAVED", value: projectStatus?.agentTasks?.length ? `${(projectStatus.agentTasks.length * 12)}h` : "0h", icon: Clock, color: "text-orange-500" },
          { label: "AGENTS ACTIVE", value: (isDeploying || projectStatus?.status === 'deploying') ? 5 : 0, icon: Activity, color: "text-purple-500" },
        ].map((stat, i) => (
          <GlowCard key={i} className="p-5">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
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
              <span className="flex items-center justify-center gap-2">
                <Users className="w-4 h-4" /> {tab}
              </span>
            ) : tab === "Command Center" ? (
              <span className="flex items-center justify-center gap-2">
                <LayoutList className="w-4 h-4" /> {tab}
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Zap className="w-4 h-4" /> {tab}
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
              const task = projectStatus?.agentTasks?.find((t: any) => t.agentName === agent.name);
              const isCompleted = !!task;
              const isActive = (isDeploying || projectStatus?.status === 'deploying') && !isCompleted;
              
              return (
                <GlowCard key={agent.id} className={`p-6 ${isActive ? "border-cyan-300 shadow-[0_8px_30px_rgba(6,182,212,0.12)] ring-1 ring-cyan-100" : ""}`}>
                  {isActive && (
                    <motion.div 
                      layoutId="active-agent-bg"
                      className="absolute inset-0 bg-gradient-to-br from-cyan-50/50 to-blue-50/50 -z-10"
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
                        ? "bg-cyan-100 text-cyan-700 border-cyan-200 animate-pulse" 
                        : isCompleted
                          ? "bg-orange-50 text-orange-600 border-orange-200"
                          : "bg-gray-100 text-gray-500 border-gray-200"
                    }`}>
                      {isActive ? "WORKING" : isCompleted ? "NEEDS REVIEW" : "IDLE"}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-5 leading-relaxed line-clamp-3">
                    {agent.description}
                  </p>

                  <div className="text-xs text-gray-500 bg-white/50 rounded-md p-2.5 border border-white/60 flex justify-between items-center mt-auto">
                    <div>
                      <span className="font-medium">Deliverable: </span>
                      <span className="font-semibold text-gray-900">{agent.deliverable}</span>
                    </div>
                    {isCompleted && (
                      <button 
                        onClick={() => setSelectedTask(task)}
                        className="bg-cyan-50 hover:bg-cyan-100 text-cyan-600 font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <Search className="w-3 h-3" />
                        Review work
                      </button>
                    )}
                  </div>
                </GlowCard>
              );
            })}
          </div>

          {/* RIGHT: Team Activity */}
          <div className="lg:col-span-1">
            <GlowCard className="h-full min-h-[500px]">
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
                          <div className="mt-1 w-2 h-2 rounded-full bg-pink-500 shrink-0" />
                          <span className="text-gray-700 leading-snug">{log}</span>
                        </motion.div>
                      ))}
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

      {/* MODAL FOR REVIEWING DELIVERABLES */}
      <AnimatePresence>
        {selectedTask && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-3xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
            >
              <div className="p-5 border-b flex justify-between items-center bg-gray-50">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 flex items-center gap-3">
                    {selectedTask.deliverable} 
                    <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full uppercase tracking-widest font-bold">Awaiting Approval</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Produced by {selectedTask.agentName} ({selectedTask.agentRole})</p>
                </div>
                <button onClick={() => setSelectedTask(null)} className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8 overflow-y-auto flex-1 prose prose-sm max-w-none prose-headings:text-gray-900 prose-a:text-cyan-600">
                <ReactMarkdown>{selectedTask.content}</ReactMarkdown>
              </div>
              <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setSelectedTask(null)} className="rounded-xl border-gray-300 text-gray-700 hover:bg-gray-100 font-medium">Request revision</Button>
                <Button onClick={() => setSelectedTask(null)} className="rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold shadow-md shadow-green-500/20 px-6">Approve work</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
