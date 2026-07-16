"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { 
  Rocket, BrainCircuit, LineChart, Users, Globe, CheckCircle2,
  FileText, Activity, ChevronRight, Zap, X, Copy, Check, Eye
} from "lucide-react";
import ReactMarkdown from 'react-markdown';

// Simulated Agents Workflow Data
const agents = [
  { id: "planner", name: "Planner Agent", role: "Business Strategist", icon: BrainCircuit, bg: "bg-[#7B5CFF]/10", text: "text-[#7B5CFF]", glow: "violet", description: "Turns your idea into a complete business plan.", deliverable: "Business Plan" },
  { id: "finance", name: "Finance Agent", role: "Financial Analyst", icon: LineChart, bg: "bg-[#4F7CFF]/10", text: "text-[#4F7CFF]", glow: "blue", description: "Builds startup cost analysis and projections.", deliverable: "Cost Analysis" },
  { id: "marketing", name: "Marketing Agent", role: "Growth Marketer", icon: Users, bg: "bg-[#2FD9FF]/10", text: "text-[#2FD9FF]", glow: "cyan", description: "Creates ready-to-publish social content.", deliverable: "Social Campaign" },
  { id: "operations", name: "Operations Agent", role: "Operations Manager", icon: CheckCircle2, bg: "bg-[#7B5CFF]/10", text: "text-[#7B5CFF]", glow: "violet", description: "Produces weekly schedules and SOPs.", deliverable: "Weekly Schedule" },
  { id: "website", name: "Website Agent", role: "Web Developer", icon: Globe, bg: "bg-[#4F7CFF]/10", text: "text-[#4F7CFF]", glow: "blue", description: "Generates a live landing page for your business.", deliverable: "Landing Page" }
];

export default function StartBusinessPage() {
  const [prompt, setPrompt] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [tasksData, setTasksData] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDeploy = () => {
    if (!prompt.trim() || isDeploying) return;
    
    setIsDeploying(true);
    setActiveStepIndex(0);
    setCompletedSteps([]);
    setTasksData([]);
    
    // Simulate complex workflow cascading
    let currentStep = 0;
    
    const runNextStep = () => {
      if (currentStep >= agents.length) {
        setIsDeploying(false);
        setActiveStepIndex(-1);
        return;
      }
      
      setTimeout(() => {
        setCompletedSteps(prev => [...prev, currentStep]);
        setTasksData(prev => [...prev, {
          agentId: agents[currentStep].id,
          deliverable: agents[currentStep].deliverable,
          agentName: agents[currentStep].name,
          agentRole: agents[currentStep].role,
          content: `# ${agents[currentStep].deliverable}\n\nGenerated for: **${prompt}**\n\nThis is a highly detailed, AI-generated deliverable created by the ${agents[currentStep].name}. It includes specific actionable steps, strategic insights, and deep contextual memory from your business profile.\n\n### Key Highlights\n- Deep market analysis\n- Competitive intelligence\n- Operational workflows\n\n*All data is synced across your AI Operating System.*`
        }]);
        
        currentStep++;
        setActiveStepIndex(currentStep);
        runNextStep();
      }, 2500); // 2.5s per agent simulation
    };
    
    runNextStep();
  };

  const openPanel = (task: any) => { setSelectedTask(task); setIsPanelOpen(true); };
  const closePanel = () => { setIsPanelOpen(false); setTimeout(() => setSelectedTask(null), 300); };
  const copyContent = () => { if (selectedTask?.content) { navigator.clipboard.writeText(selectedTask.content); setCopied(true); setTimeout(() => setCopied(false), 2000); } };

  return (
    <div className="max-w-[1400px] mx-auto pb-12 flex flex-col gap-8">
      
      {/* HEADER SECTION */}
      <GlassCard className="p-8 md:p-12 border-white/60 relative overflow-hidden">
        {/* Animated background glow */}
        <div className="absolute top-[-50%] right-[-10%] w-[60%] h-[150%] bg-[#4F7CFF]/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-sm font-medium text-[#0A121A]/50 mb-6">
            <span>Home</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#4F7CFF] bg-[#4F7CFF]/10 px-3 py-1 rounded-full flex items-center gap-1.5 border border-[#4F7CFF]/20 shadow-sm">
              <Rocket className="w-3.5 h-3.5" /> Aura AI
              <span className="text-[10px] tracking-widest uppercase ml-1">MISSION CONTROL</span>
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-[#0A121A] mb-4 tracking-tight">Deploy AI Workforce</h1>
          <p className="text-[#0A121A]/60 mb-8 max-w-2xl text-base md:text-lg leading-relaxed font-medium">
            Describe your business goal. Your AI team will collaborate to generate a complete business plan, financial model, marketing strategy, and operations schedule.
          </p>

          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full bg-white/40 backdrop-blur-xl rounded-2xl shadow-sm border border-white/60 overflow-hidden focus-within:border-[#4F7CFF]/50 focus-within:shadow-[0_0_30px_rgba(79,124,255,0.15)] transition-all">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder='e.g. "I want to build an AI SaaS for architects"'
                className="w-full bg-transparent outline-none px-6 py-5 text-[#0A121A] placeholder:text-[#0A121A]/40 text-lg font-medium"
                onKeyDown={(e) => e.key === 'Enter' && handleDeploy()}
                disabled={isDeploying}
              />
            </div>
            <Button 
              onClick={handleDeploy} 
              disabled={isDeploying || !prompt.trim()}
              className="w-full md:w-auto h-full min-h-[68px] rounded-2xl px-10 text-lg shadow-[0_15px_40px_rgba(79,124,255,0.3)]"
            >
              {isDeploying ? (
                <>
                  <Zap className="w-6 h-6 mr-3 animate-pulse text-white" />
                  Agents Working...
                </>
              ) : (
                <>
                  <Rocket className="w-6 h-6 mr-3 text-white" />
                  Deploy Agents
                </>
              )}
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* STATS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "TASKS COMPLETED", value: completedSteps.length, icon: CheckCircle2, color: "text-[#42D392]" },
          { label: "WORDS PRODUCED", value: completedSteps.length * 1250, icon: FileText, color: "text-[#4F7CFF]" },
          { label: "HOURS SAVED", value: completedSteps.length * 24, icon: Activity, color: "text-[#F7B955]", suffix: "h" },
          { label: "AGENTS ACTIVE", value: isDeploying ? 1 : 0, icon: Zap, color: "text-[#7B5CFF]" },
        ].map((stat, i) => (
          <GlassCard key={i} className="p-6">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl bg-white/60 border border-white/80 shadow-sm flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-3xl font-bold text-[#0A121A]">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-[10px] font-bold tracking-widest text-[#0A121A]/40 uppercase mt-1">{stat.label}</div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* WORKFLOW VISUALIZER */}
      <GlassCard className="p-10 border-white/60">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-[#0A121A] mb-2 tracking-tight">Agent Collaboration Stream</h2>
          <p className="text-[#0A121A]/60 font-medium text-sm">Watch your AI team hand off context and build your business in real-time.</p>
        </div>

        <div className="relative">
          {/* Connecting Line Background */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/50 -translate-y-1/2 rounded-full hidden lg:block" />
          
          {/* Animated Progress Line */}
          <div className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-[#4F7CFF] via-[#7B5CFF] to-[#2FD9FF] -translate-y-1/2 rounded-full hidden lg:block transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(79,124,255,0.5)]" 
               style={{ width: `${Math.min(100, (completedSteps.length / (agents.length - 1)) * 100)}%` }} 
          />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-4 relative z-10">
            {agents.map((agent, index) => {
              const isCompleted = completedSteps.includes(index);
              const isActive = activeStepIndex === index;
              const isPending = !isCompleted && !isActive;
              
              const task = tasksData.find(t => t.agentId === agent.id);

              return (
                <motion.div 
                  key={agent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center"
                >
                  {/* Agent Node */}
                  <div className={`relative w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-500 mb-6 ${
                    isActive 
                      ? "bg-white border-2 border-[#4F7CFF] shadow-[0_0_40px_rgba(79,124,255,0.3)] scale-110" 
                      : isCompleted 
                        ? "bg-[#4F7CFF] border-2 border-[#4F7CFF] shadow-lg" 
                        : "bg-white/40 border border-white/60 shadow-sm"
                  }`}>
                    <agent.icon className={`w-8 h-8 transition-colors duration-500 ${
                      isActive ? "text-[#4F7CFF]" : isCompleted ? "text-white" : "text-[#0A121A]/30"
                    }`} />
                    
                    {/* Active Ping */}
                    {isActive && (
                      <span className="absolute inset-0 rounded-3xl border-2 border-[#4F7CFF] animate-ping opacity-20" />
                    )}
                    
                    {/* Completion Check */}
                    {isCompleted && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#42D392] rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                        <Check className="w-3 h-3 text-white font-bold" />
                      </div>
                    )}
                  </div>

                  {/* Text Details */}
                  <div className="text-center">
                    <h3 className={`font-bold text-base mb-1 transition-colors duration-500 ${isActive || isCompleted ? "text-[#0A121A]" : "text-[#0A121A]/40"}`}>
                      {agent.name}
                    </h3>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-[#0A121A]/40 mb-3">
                      {agent.role}
                    </p>
                    
                    {/* Deliverable Action Button */}
                    <AnimatePresence>
                      {isCompleted && task && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ type: "spring", bounce: 0.5 }}
                        >
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => openPanel(task)}
                            className="h-8 rounded-full border-[#4F7CFF]/30 text-[#4F7CFF] hover:bg-[#4F7CFF]/10 text-xs font-bold w-full"
                          >
                            <Eye className="w-3 h-3 mr-1.5" />
                            View {agent.deliverable}
                          </Button>
                        </motion.div>
                      )}
                      
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center justify-center gap-1.5 text-[10px] font-bold tracking-widest text-[#4F7CFF] uppercase bg-[#4F7CFF]/10 py-1.5 px-3 rounded-full border border-[#4F7CFF]/20"
                        >
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Processing...
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </GlassCard>

      {/* SLIDE-OUT PANEL FOR DELIVERABLE REVIEW */}
      <AnimatePresence>
        {isPanelOpen && selectedTask && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-y-0 right-0 left-[312px] z-40 bg-[#0A121A]/20 backdrop-blur-sm" onClick={closePanel} />
            <motion.div initial={{ x: "100%", opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: "100%", opacity: 0 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} className="fixed inset-y-4 right-4 z-50 w-full max-w-2xl h-[calc(100vh-2rem)] bg-white/80 backdrop-blur-2xl rounded-[28px] shadow-[0_0_80px_rgba(79,124,255,0.15)] flex flex-col border border-white/80 overflow-hidden">
              <div className="px-8 py-6 border-b border-white/40 flex justify-between items-center shrink-0 bg-white/40 backdrop-blur-xl">
                <div>
                  <h3 className="font-bold text-2xl text-[#0A121A] tracking-tight">{selectedTask.deliverable}</h3>
                  <p className="text-sm font-medium text-[#0A121A]/50 mt-1">Produced by {selectedTask.agentName}</p>
                </div>
                <button onClick={closePanel} className="p-3 bg-white/50 hover:bg-white border border-white/60 rounded-full text-[#0A121A]/50 hover:text-[#0A121A] transition-all shadow-sm"><X className="w-5 h-5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="prose prose-sm md:prose-base max-w-none text-[#0A121A]/80 prose-headings:text-[#0A121A] prose-headings:font-bold prose-headings:tracking-tight prose-a:text-[#4F7CFF] prose-p:leading-relaxed prose-p:mb-5 prose-li:text-[#0A121A]/80 prose-li:marker:text-[#4F7CFF] prose-strong:text-[#0A121A] prose-strong:font-bold">
                  <ReactMarkdown>{selectedTask.content}</ReactMarkdown>
                </div>
              </div>
              <div className="px-8 py-6 border-t border-white/40 flex justify-between items-center shrink-0 bg-white/50 backdrop-blur-xl">
                <button onClick={copyContent} className="flex items-center gap-2 text-sm text-[#0A121A]/60 hover:text-[#0A121A] transition-colors font-bold px-4 py-2.5 rounded-xl border border-white/60 bg-white/40 hover:bg-white shadow-sm">
                  {copied ? <Check className="w-4 h-4 text-[#42D392]" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
                <Button onClick={closePanel} className="rounded-xl px-8 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Approved
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
