"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket, BrainCircuit, LineChart, Users, Globe, CheckCircle2,
  FileText, Activity, ChevronRight, Zap, Loader2, Play, Edit2, Info,
  Eye, Camera, Video, MessageCircle, ArrowRight, Power, Clock,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { ReviewModal } from "@/components/modals/ReviewModal";

// ═══════════════════════════════════════════════════════════
// Agent Definitions (client-side mirror)
// ═══════════════════════════════════════════════════════════

const agents = [
  { key: "planner", name: "Planner Agent", role: "Business Strategist", icon: BrainCircuit, description: "Turns your idea into a complete business plan: concept, brand, market and roadmap.", deliverable: "Business Plan" },
  { key: "marketing", name: "Marketing Agent", role: "Growth Marketer", icon: Users, description: "Creates ready-to-publish social content with captions, hashtags and a posting schedule.", deliverable: "Social Campaign" },
  { key: "finance", name: "Finance Agent", role: "Financial Analyst", icon: LineChart, description: "Builds startup cost analysis, break-even point and 12-month projections with charts.", deliverable: "Cost Analysis" },
  { key: "operations", name: "Operations Agent", role: "Operations Manager", icon: CheckCircle2, description: "Produces weekly schedules, supplier checklists and standard operating procedures.", deliverable: "Operations Manual" },
  { key: "website", name: "Website Agent", role: "Web Developer", icon: Globe, description: "Generates a live landing page for your business using the brand identity.", deliverable: "Landing Page" },
];

const suggestions = [
  "I want to start a bakery",
  "Launch a home-cooked tiffin delivery service",
  "Open a specialty coffee shop",
  "Start an online handmade jewelry brand",
];

// ═══════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════

interface AgentTaskData {
  id: string;
  agentKey: string;
  status: string;
  deliverableType: string | null;
  deliverableContent: string | null;
  startedAt: string | null;
  completedAt: string | null;
}

interface ProjectEvent {
  id: string;
  agentKey: string | null;
  message: string;
  createdAt: string;
}

interface ProjectStats {
  tasksCompleted: number;
  wordsProduced: number;
  hoursSaved: number;
  agentsActive: number;
}

// ═══════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════

export default function StartBusinessPage() {
  const [prompt, setPrompt] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [showBriefing, setShowBriefing] = useState(false);
  const [activeTab, setActiveTab] = useState("Command Center");

  // Project state
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectStatus, setProjectStatus] = useState<string>("draft");
  const [projectTitle, setProjectTitle] = useState("");
  const [tasks, setTasks] = useState<AgentTaskData[]>([]);
  const [events, setEvents] = useState<ProjectEvent[]>([]);
  const [stats, setStats] = useState<ProjectStats>({ tasksCompleted: 0, wordsProduced: 0, hoursSaved: 0, agentsActive: 0 });

  // Review modal state
  const [reviewTask, setReviewTask] = useState<AgentTaskData | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // Polling ref
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const lastEventTimeRef = useRef<string | null>(null);

  // ─── Load existing project on mount ───
  useEffect(() => {
    const loadProject = async () => {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const data = await res.json();
          if (data.projects?.length > 0) {
            const latest = data.projects[0];
            setProjectId(latest.id);
            setProjectTitle(latest.title);
            setProjectStatus(latest.status);
            setPrompt(latest.title);
            // Load full project data
            await fetchProjectData(latest.id);
          }
        }
      } catch (e) {
        console.error("Failed to load projects", e);
      }
    };
    loadProject();
  }, []);

  // ─── Polling for live updates ───
  useEffect(() => {
    if (projectId && (projectStatus === "running" || projectStatus === "completed")) {
      startPolling(projectId);
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [projectId, projectStatus]);

  const fetchProjectData = async (pid: string) => {
    try {
      const res = await fetch(`/api/projects/${pid}`);
      if (res.ok) {
        const data = await res.json();
        setTasks(data.project.tasks);
        setEvents(data.project.events);
        setProjectStatus(data.project.status);

        if (data.project.events.length > 0) {
          lastEventTimeRef.current = data.project.events[0].createdAt;
        }
      }

      // Also fetch stats
      const statsRes = await fetch(`/api/projects/${pid}/stats`);
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
        if (statsData.projectStatus) setProjectStatus(statsData.projectStatus);
      }
    } catch (e) {
      console.error("Failed to fetch project data", e);
    }
  };

  const startPolling = useCallback((pid: string) => {
    if (pollRef.current) clearInterval(pollRef.current);

    pollRef.current = setInterval(async () => {
      try {
        const afterParam = lastEventTimeRef.current ? `?after=${encodeURIComponent(lastEventTimeRef.current)}` : "";
        const res = await fetch(`/api/projects/${pid}/events${afterParam}`);
        if (res.ok) {
          const data = await res.json();

          // Update tasks
          if (data.tasks) setTasks(data.tasks);
          if (data.projectStatus) setProjectStatus(data.projectStatus);

          // Merge new events
          if (data.events?.length > 0) {
            setEvents((prev) => {
              const newIds = new Set(prev.map((e) => e.id));
              const fresh = data.events.filter((e: ProjectEvent) => !newIds.has(e.id));
              return [...fresh, ...prev];
            });
            lastEventTimeRef.current = data.events[0].createdAt;
          }
        }

        // Also refresh stats
        const statsRes = await fetch(`/api/projects/${pid}/stats`);
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData.stats);
        }
      } catch (e) {
        console.error("Polling error", e);
      }
    }, 4000);
  }, []);

  // ─── Deploy handler ───
  const handleDeploy = async () => {
    if (!prompt.trim() || isDeploying) return;

    setIsDeploying(true);
    setShowBriefing(true);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: prompt.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        const pid = data.project.id;
        setProjectId(pid);
        setProjectTitle(data.project.title);
        setProjectStatus("running");

        // Wait for briefing animation, then start agents
        setTimeout(() => {
          setShowBriefing(false);
          setIsDeploying(false);
          setActiveTab("Command Center");
          fetchProjectData(pid);
          startPolling(pid);

          // Fire all 5 agents in parallel — each is its own API call
          const agentKeys = ["planner", "marketing", "finance", "operations", "website"];
          agentKeys.forEach((agentKey) => {
            fetch(`/api/projects/${pid}/run-agent`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ agentKey }),
            }).catch((err) => console.error(`Agent ${agentKey} error:`, err));
          });
        }, 2500);
      } else {
        setShowBriefing(false);
        setIsDeploying(false);
      }
    } catch (e) {
      console.error("Deploy error", e);
      setShowBriefing(false);
      setIsDeploying(false);
    }
  };

  // ─── Task actions ───
  const handleTaskAction = async (taskId: string, action: "approve" | "revise") => {
    if (!projectId) return;
    try {
      await fetch(`/api/projects/${projectId}/tasks/${taskId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      // Refresh data
      await fetchProjectData(projectId);
    } catch (e) {
      console.error("Task action error", e);
    }
  };

  const openReview = async (task: AgentTaskData) => {
    // Fetch full task with deliverable content
    if (!projectId) return;
    try {
      const res = await fetch(`/api/projects/${projectId}/tasks/${task.id}`);
      if (res.ok) {
        const data = await res.json();
        setReviewTask(data.task);
        setIsReviewOpen(true);
      }
    } catch (e) {
      console.error("Failed to fetch task", e);
    }
  };

  // ─── Helper: get task for agent ───
  const getTaskForAgent = (agentKey: string): AgentTaskData | undefined => {
    return tasks.find((t) => t.agentKey === agentKey);
  };

  const getStatusPill = (status: string) => {
    switch (status) {
      case "working":
        return { text: "Working", className: "bg-[#4F7CFF]/10 text-[#4F7CFF] border-[#4F7CFF]/20", dot: true };
      case "queued":
        return { text: "Queued", className: "bg-[#7B5CFF]/10 text-[#7B5CFF] border-[#7B5CFF]/20", dot: true };
      case "needs_review":
        return { text: "Needs Review", className: "bg-[#F7B955]/10 text-[#F7B955] border-[#F7B955]/20", dot: false };
      case "approved":
        return { text: "Approved", className: "bg-[#42D392]/10 text-[#42D392] border-[#42D392]/20", dot: false };
      default:
        return { text: "Idle", className: "bg-white/60 text-[#0A121A]/40 border-white/80", dot: false };
    }
  };

  const formatEventTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  };

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-8 pb-12">

      {/* ─── MISSION BRIEFING OVERLAY ─── */}
      <AnimatePresence>
        {showBriefing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0A121A]/90 backdrop-blur-xl z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-lg w-full mx-4 rounded-3xl bg-[#0A121A] border border-[#4F7CFF]/30 p-8 md:p-10 shadow-[0_0_100px_rgba(79,124,255,0.3)]"
            >
              <div className="flex items-center gap-2 text-[#4F7CFF] mb-6 text-xs tracking-[0.3em] uppercase font-bold">
                <span className="w-2 h-2 rounded-full bg-[#4F7CFF] animate-pulse" />
                Mission Briefing
              </div>
              <div className="space-y-4 font-mono text-sm">
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-[#42D392]">
                  &gt; Mission received...
                </motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-[#2FD9FF]">
                  &gt; Analyzing business goal...
                </motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }} className="text-[#F7B955]">
                  &gt; Assembling AI workforce...
                </motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }} className="text-white/80">
                  &gt; Deploying 5 agents to: &quot;{prompt}&quot;
                </motion.p>
              </div>
              <div className="mt-8 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.2, ease: "easeInOut" }}
                  className="h-full bg-gradient-to-r from-[#4F7CFF] to-[#42D392] rounded-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── BREADCRUMB ─── */}
      <div className="flex items-center gap-2 text-sm font-medium text-[#0A121A]/50 mb-2">
        <span className="hover:text-[#0A121A] cursor-pointer transition-colors">Home</span>
        <ChevronRight className="w-4 h-4 mx-2 opacity-50" />
        <span className="text-[#4F7CFF] bg-[#4F7CFF]/10 px-3 py-1 rounded-full flex items-center gap-2 border border-[#4F7CFF]/20">
          <Rocket className="w-3.5 h-3.5" /> Aura AI
          <span className="text-[10px] tracking-widest uppercase ml-1 opacity-80">MISSION CONTROL</span>
        </span>
      </div>

      {/* ─── HERO SECTION ─── */}
      <GlassCard className="p-8 md:p-12 border-white/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#4F7CFF]/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-[#4F7CFF] mb-4 text-xs tracking-widest uppercase font-bold">
            <Zap className="w-4 h-4" /> Mission Control
            {projectId && <span className="ml-3 text-[#0A121A]/50 normal-case tracking-normal">Current mission: <strong className="text-[#0A121A]">{projectTitle}</strong></span>}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-[#0A121A] mb-4 tracking-tight">What business do you want to build?</h1>
          <p className="text-[#0A121A]/60 mb-8 max-w-3xl text-base leading-relaxed font-medium">
            Type your idea and your AI team gets to work — business plan, social campaign, cost analysis, operations and a live landing page. You review and approve every deliverable.
          </p>

          <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
            <div className="flex-1 w-full flex items-center bg-white/40 backdrop-blur-xl rounded-2xl border border-white/60 px-2 py-2 focus-within:border-[#4F7CFF]/50 focus-within:shadow-[0_0_30px_rgba(79,124,255,0.15)] transition-all">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder='e.g. "I want to start a bakery"'
                className="flex-1 bg-transparent outline-none px-6 text-[#0A121A] placeholder:text-[#0A121A]/40 text-lg font-medium"
                onKeyDown={(e) => e.key === "Enter" && handleDeploy()}
                disabled={isDeploying || (!!projectId && projectStatus === "running")}
                readOnly={!!projectId}
              />
              <Button
                onClick={handleDeploy}
                disabled={isDeploying || !prompt.trim() || !!projectId}
                className="h-full min-h-[56px] rounded-xl px-8 text-base shadow-[0_15px_40px_rgba(79,124,255,0.3)] flex items-center gap-2"
              >
                {isDeploying ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Deploying...</>
                ) : projectId && projectStatus === "running" ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Team working…</>
                ) : projectId ? (
                  <><CheckCircle2 className="w-5 h-5" /> Deployed</>
                ) : (
                  <><Rocket className="w-5 h-5" /> Deploy AI Team</>
                )}
              </Button>
            </div>
          </div>

          {!projectId && (
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[#0A121A]/50 text-sm font-medium mr-2">Try:</span>
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => setPrompt(s)} className="text-xs font-bold text-[#0A121A]/60 bg-white/40 hover:bg-white hover:text-[#4F7CFF] border border-white/60 px-4 py-2 rounded-full transition-colors shadow-sm">
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </GlassCard>

      {/* ─── STATS ROW ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "TASKS COMPLETED", value: stats.tasksCompleted, icon: CheckCircle2, color: "text-[#42D392]" },
          { label: "WORDS PRODUCED", value: stats.wordsProduced.toLocaleString(), icon: FileText, color: "text-[#4F7CFF]" },
          { label: "HOURS SAVED", value: `${stats.hoursSaved}h`, icon: Activity, color: "text-[#F7B955]" },
          { label: "AGENTS ACTIVE", value: stats.agentsActive, icon: Zap, color: "text-[#7B5CFF]" },
        ].map((stat, i) => (
          <GlassCard key={i} className="p-6 flex items-center gap-5" animate={false} hover="none">
            <div className={`w-12 h-12 rounded-2xl bg-white/60 border border-white/80 shadow-sm flex items-center justify-center ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#0A121A] mb-1">{stat.value}</div>
              <div className="text-[10px] font-bold tracking-widest text-[#0A121A]/40 uppercase">{stat.label}</div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* ─── TABS ─── */}
      <GlassCard className="flex items-center gap-2 p-1.5 mt-4 rounded-2xl border-white/60" animate={false} hover="none">
        {["Command Center", "Team", "Automation"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 text-center py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab
                ? "bg-white text-[#0A121A] shadow-sm border border-white/80"
                : "text-[#0A121A]/50 hover:text-[#0A121A] hover:bg-white/40"
            }`}
          >
            {tab}
          </button>
        ))}
      </GlassCard>

      {/* ─── TAB CONTENT ─── */}
      <div className="mt-6">
        {activeTab === "Command Center" && <CommandCenterTab tasks={tasks} events={events} projectId={projectId} onReview={openReview} getStatusPill={getStatusPill} formatEventTime={formatEventTime} />}
        {activeTab === "Team" && <TeamTab tasks={tasks} getStatusPill={getStatusPill} />}
        {activeTab === "Automation" && <AutomationTab tasks={tasks} />}
      </div>

      {/* ─── REVIEW MODAL ─── */}
      {reviewTask && (
        <ReviewModal
          isOpen={isReviewOpen}
          onClose={() => { setIsReviewOpen(false); setReviewTask(null); }}
          task={reviewTask}
          projectId={projectId || ""}
          onAction={handleTaskAction}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// COMMAND CENTER TAB
// ═══════════════════════════════════════════════════════════

function CommandCenterTab({ tasks, events, projectId, onReview, getStatusPill, formatEventTime }: {
  tasks: AgentTaskData[];
  events: ProjectEvent[];
  projectId: string | null;
  onReview: (task: AgentTaskData) => void;
  getStatusPill: (status: string) => { text: string; className: string; dot: boolean };
  formatEventTime: (dateStr: string) => string;
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Agent Cards Grid */}
      <div className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {agents.map((agent) => {
            const task = tasks.find((t) => t.agentKey === agent.key);
            const status = task?.status || "idle";
            const pill = getStatusPill(status);

            return (
              <GlassCard
                key={agent.key}
                className={`p-6 flex flex-col justify-between transition-all relative overflow-hidden group ${
                  status === "working" ? "border-[#4F7CFF]/50 shadow-[0_0_30px_rgba(79,124,255,0.15)] bg-white/80" : ""
                }`}
                animate={false}
                hover="lift"
              >
                {status === "working" && <div className="absolute top-0 left-0 w-full h-1 bg-[#4F7CFF] animate-pulse" />}

                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors ${
                        status === "working" ? "bg-[#4F7CFF]/10 border-[#4F7CFF]/30" : "bg-white/60 border-white/80 shadow-sm"
                      }`}>
                        <agent.icon className={`w-6 h-6 ${status === "working" ? "text-[#4F7CFF]" : "text-[#0A121A]/40"}`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-[#0A121A] text-base tracking-tight">{agent.name}</h3>
                        <p className="text-[#0A121A]/50 font-medium text-xs mt-1">{agent.role}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 ${pill.className}`}>
                      {pill.dot && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
                      {pill.text}
                    </span>
                  </div>

                  <p className="text-[#0A121A]/60 font-medium text-sm leading-relaxed mb-2">{agent.description}</p>
                  {task?.deliverableType && status !== "idle" && status !== "queued" && (
                    <p className="text-xs font-bold text-[#0A121A]/50 mb-4">Deliverable: {task.deliverableType}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-4">
                  {status === "needs_review" ? (
                    <button onClick={() => task && onReview(task)} className="flex-1 bg-[#F7B955] hover:bg-[#F7B955]/90 text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm">
                      <Eye className="w-4 h-4" /> Review Work
                    </button>
                  ) : status === "approved" ? (
                    <button onClick={() => task && onReview(task)} className="flex-1 bg-white/40 hover:bg-white border border-[#42D392]/30 text-[#42D392] py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                      <Eye className="w-4 h-4" /> View Work
                    </button>
                  ) : (
                    <button className="flex-1 bg-white/40 hover:bg-white border border-white/60 shadow-sm text-[#0A121A]/70 hover:text-[#4F7CFF] py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors" disabled={status === "working" || status === "queued"}>
                      {status === "working" ? <><Loader2 className="w-4 h-4 animate-spin" /> Working...</> : <><Play className="w-4 h-4" /> Assign task</>}
                    </button>
                  )}
                  <button className="w-12 h-12 flex items-center justify-center bg-white/40 hover:bg-white border border-white/60 shadow-sm text-[#0A121A]/50 hover:text-[#0A121A] rounded-xl transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="w-12 h-12 flex items-center justify-center bg-white/40 hover:bg-white border border-white/60 shadow-sm text-[#0A121A]/50 hover:text-[#0A121A] rounded-xl transition-colors">
                    <Info className="w-4 h-4" />
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* Live Activity Panel */}
      <div className="w-full lg:w-[350px] shrink-0">
        <GlassCard className="p-6 h-full min-h-[500px] flex flex-col sticky top-8" animate={false} hover="none">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-[#0A121A] tracking-tight">Team Activity</h3>
            <span className="flex items-center gap-2 text-xs font-bold text-[#4F7CFF] tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-[#4F7CFF] animate-pulse" /> Live
            </span>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
            {events.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-center px-4 pt-12">
                <p className="text-[#0A121A]/40 font-medium text-sm">Your AI team&apos;s activity will appear here once you assign a goal.</p>
              </div>
            ) : (
              <AnimatePresence>
                {events.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-3 text-left w-full border-b border-white/40 pb-4"
                  >
                    <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center mt-1 ${
                      event.agentKey
                        ? "bg-[#4F7CFF]/10 border border-[#4F7CFF]/20"
                        : "bg-[#7B5CFF]/10 border border-[#7B5CFF]/20"
                    }`}>
                      {event.agentKey ? (
                        <FileText className="w-3.5 h-3.5 text-[#4F7CFF]" />
                      ) : (
                        <Zap className="w-3.5 h-3.5 text-[#7B5CFF]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#0A121A] text-sm font-medium leading-snug">{event.message}</p>
                      <p className="text-[10px] text-[#0A121A]/40 font-bold mt-1">{formatEventTime(event.createdAt)}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// TEAM TAB
// ═══════════════════════════════════════════════════════════

function TeamTab({ tasks, getStatusPill }: {
  tasks: AgentTaskData[];
  getStatusPill: (status: string) => { text: string; className: string; dot: boolean };
}) {
  return (
    <div>
      <div className="flex justify-between items-end mb-6 px-2">
        <div>
          <h2 className="text-2xl font-bold text-[#0A121A] mb-2 tracking-tight">Your AI Workforce</h2>
          <p className="text-[#0A121A]/50 text-sm font-medium">Hire, edit, pause or remove employees. You are the CEO.</p>
        </div>
        <button className="bg-white/40 hover:bg-white text-[#4F7CFF] border border-white/60 px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-colors shadow-sm">
          <Users className="w-4 h-4" /> Hire Employee
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((agent) => {
          const task = tasks.find((t) => t.agentKey === agent.key);
          const status = task?.status || "idle";
          const pill = getStatusPill(status);

          return (
            <GlassCard key={agent.key} className="p-6 flex flex-col justify-between" animate={false} hover="lift">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/60 border border-white/80 shadow-sm flex items-center justify-center">
                      <agent.icon className="w-6 h-6 text-[#0A121A]/40" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#0A121A] text-base tracking-tight">{agent.name}</h3>
                      <p className="text-[#0A121A]/50 font-medium text-xs mt-1">{agent.role}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0A121A]/5 text-[#0A121A]/40 border border-[#0A121A]/10">○ Core team</span>
                    <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 ${pill.className}`}>
                      {pill.dot && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
                      {pill.text}
                    </span>
                  </div>
                </div>

                <p className="text-[#0A121A]/60 font-medium text-sm leading-relaxed mb-6">{agent.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex-1 bg-white/40 hover:bg-white border border-white/60 shadow-sm text-[#0A121A]/70 hover:text-[#4F7CFF] py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                  <Play className="w-4 h-4" /> Assign task
                </button>
                <button className="w-12 h-12 flex items-center justify-center bg-white/40 hover:bg-white border border-white/60 shadow-sm text-[#0A121A]/50 hover:text-[#0A121A] rounded-xl transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="w-12 h-12 flex items-center justify-center bg-white/40 hover:bg-white border border-white/60 shadow-sm text-[#0A121A]/50 hover:text-[#0A121A] rounded-xl transition-colors">
                  <Info className="w-4 h-4" />
                </button>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// AUTOMATION TAB
// ═══════════════════════════════════════════════════════════

function AutomationTab({ tasks }: { tasks: AgentTaskData[] }) {
  const marketingTask = tasks.find((t) => t.agentKey === "marketing");
  let posts: any[] = [];

  if (marketingTask?.deliverableContent && marketingTask.status === "approved") {
    try {
      const data = JSON.parse(marketingTask.deliverableContent);
      posts = data.posts || [];
    } catch { /* ignore */ }
  }

  const channels = [
    { name: "Instagram", icon: Camera, connected: false, color: "text-[#E4405F]", bg: "bg-[#E4405F]/10", border: "border-[#E4405F]/20" },
    { name: "YouTube", icon: Video, connected: false, color: "text-[#FF0000]", bg: "bg-[#FF0000]/10", border: "border-[#FF0000]/20" },
    { name: "X (Twitter)", icon: MessageCircle, connected: false, color: "text-[#0A121A]", bg: "bg-[#0A121A]/5", border: "border-[#0A121A]/10" },
  ];

  const pipelineSteps = [
    { label: "Marketing Agent generates", icon: Users },
    { label: "Owner approves", icon: CheckCircle2 },
    { label: "Scheduler queues", icon: Clock },
    { label: "Auto-publish to channels", icon: Rocket },
  ];

  return (
    <div className="space-y-8">
      {/* Automation Hub Header */}
      <div className="px-2">
        <h2 className="text-2xl font-bold text-[#0A121A] mb-2 tracking-tight">Automation Hub</h2>
        <p className="text-[#0A121A]/50 text-sm font-medium max-w-2xl">Connect your channels once so your Marketing Agent publishes content automatically on schedule.</p>
      </div>

      {/* Channel Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {channels.map((ch) => (
          <GlassCard key={ch.name} className="p-6" animate={false} hover="lift">
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-xl ${ch.bg} border ${ch.border} flex items-center justify-center`}>
                <ch.icon className={`w-6 h-6 ${ch.color}`} />
              </div>
              <div>
                <h4 className="font-bold text-[#0A121A]">{ch.name}</h4>
                <p className="text-xs text-[#0A121A]/50 font-medium">Not connected</p>
              </div>
            </div>
            <Button variant="outline" className="w-full rounded-xl h-10 font-bold bg-white/40 hover:bg-white border-white/60">
              Connect
            </Button>
          </GlassCard>
        ))}
      </div>

      {/* Publishing Workflow */}
      <GlassCard className="p-8" animate={false} hover="none">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-[#0A121A] tracking-tight">Publishing Workflow</h3>
            <p className="text-sm text-[#0A121A]/50 font-medium mt-1">Your content pipeline from creation to publication</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-[#4F7CFF]">{posts.length > 0 ? `${Math.min(posts.length, 6)}/10 published` : "0/10 published"}</span>
            <button className="w-12 h-12 rounded-xl bg-[#42D392]/10 border border-[#42D392]/20 flex items-center justify-center hover:bg-[#42D392]/20 transition-colors">
              <Power className="w-5 h-5 text-[#42D392]" />
            </button>
          </div>
        </div>

        {/* Pipeline Steps */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4">
          {pipelineSteps.map((step, i) => (
            <React.Fragment key={i}>
              <div className="flex items-center gap-3 bg-white/60 border border-white/80 rounded-2xl px-5 py-4 min-w-[180px] shrink-0">
                <div className="w-10 h-10 rounded-xl bg-[#4F7CFF]/10 border border-[#4F7CFF]/20 flex items-center justify-center shrink-0">
                  <step.icon className="w-5 h-5 text-[#4F7CFF]" />
                </div>
                <span className="text-sm font-bold text-[#0A121A]">{step.label}</span>
              </div>
              {i < pipelineSteps.length - 1 && (
                <ArrowRight className="w-5 h-5 text-[#0A121A]/20 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </GlassCard>

      {/* Approved Posts */}
      {posts.length > 0 && (
        <GlassCard className="p-8" animate={false} hover="none">
          <h3 className="text-xl font-bold text-[#0A121A] mb-6 tracking-tight">Approved Posts</h3>
          <div className="space-y-3">
            {posts.map((post: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/60 border border-white/80">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#7B5CFF]/10 text-[#7B5CFF] border border-[#7B5CFF]/20">{post.platform}</span>
                  <div>
                    <h5 className="font-bold text-[#0A121A] text-sm">{post.headline}</h5>
                    <p className="text-xs text-[#0A121A]/50 font-medium">{post.scheduledDay} · {post.scheduledTime}</p>
                  </div>
                </div>
                <Button size="sm" className="rounded-xl h-9 px-4 text-xs font-bold">
                  Publish Now
                </Button>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
