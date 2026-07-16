"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Rocket, BrainCircuit, LineChart, Users, Globe, CheckCircle2,
  FileText, Activity, ChevronRight, Zap, Check, Loader2, Play, Edit2, Info
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";

const agents = [
  { id: "planner", name: "Planner Agent", role: "Business Strategist", icon: BrainCircuit, description: "Turns your idea into a complete business plan: concept, brand, market and roadmap.", deliverable: "Business Plan" },
  { id: "marketing", name: "Marketing Agent", role: "Growth Marketer", icon: Users, description: "Creates ready-to-publish social content with captions, hashtags and a posting schedule.", deliverable: "Social Campaign" },
  { id: "finance", name: "Finance Agent", role: "Financial Analyst", icon: LineChart, description: "Builds startup cost analysis, break-even point and 12-month projections with charts.", deliverable: "Cost Analysis" },
  { id: "operations", name: "Operations Agent", role: "Operations Manager", icon: CheckCircle2, description: "Produces weekly schedules, supplier checklists and standard operating procedures.", deliverable: "Weekly Schedule" },
  { id: "website", name: "Website Agent", role: "Web Developer", icon: Globe, description: "Generates a live landing page for your business using the brand identity.", deliverable: "Landing Page" }
];

const suggestions = [
  "I want to start a bakery",
  "Launch a home-cooked tiffin delivery service",
  "Open a specialty coffee shop",
  "Start an online handmade jewelry brand"
];

export default function StartBusinessPage() {
  const [prompt, setPrompt] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState("Command Center");

  const handleDeploy = () => {
    if (!prompt.trim() || isDeploying) return;
    
    setIsDeploying(true);
    setActiveStepIndex(0);
    setCompletedSteps([]);
    
    let currentStep = 0;
    const runNextStep = () => {
      if (currentStep >= agents.length) {
        setIsDeploying(false);
        setActiveStepIndex(-1);
        return;
      }
      setTimeout(() => {
        setCompletedSteps(prev => [...prev, currentStep]);
        currentStep++;
        setActiveStepIndex(currentStep);
        runNextStep();
      }, 2500);
    };
    runNextStep();
  };

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-8 pb-12">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm font-medium text-[#0A121A]/50 mb-2">
        <span className="hover:text-[#0A121A] cursor-pointer transition-colors">Home</span>
        <ChevronRight className="w-4 h-4 mx-2 opacity-50" />
        <span className="text-[#4F7CFF] bg-[#4F7CFF]/10 px-3 py-1 rounded-full flex items-center gap-2 border border-[#4F7CFF]/20">
          <Rocket className="w-3.5 h-3.5" /> Aura AI
          <span className="text-[10px] tracking-widest uppercase ml-1 opacity-80">MISSION CONTROL</span>
        </span>
      </div>

      {/* Hero Section */}
      <GlassCard className="p-8 md:p-12 border-white/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#4F7CFF]/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-[#4F7CFF] mb-4 text-xs tracking-widest uppercase font-bold">
            <Zap className="w-4 h-4" /> Mission Control
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
                onKeyDown={(e) => e.key === 'Enter' && handleDeploy()}
                disabled={isDeploying}
              />
              <Button 
                onClick={handleDeploy} 
                disabled={isDeploying || !prompt.trim()}
                className="h-full min-h-[56px] rounded-xl px-8 text-base shadow-[0_15px_40px_rgba(79,124,255,0.3)] flex items-center gap-2"
              >
                {isDeploying ? <Loader2 className="w-5 h-5 animate-spin" /> : <Rocket className="w-5 h-5" />}
                Deploy AI Team
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[#0A121A]/50 text-sm font-medium mr-2">Try:</span>
            {suggestions.map((s, i) => (
              <button 
                key={i} 
                onClick={() => setPrompt(s)}
                className="text-xs font-bold text-[#0A121A]/60 bg-white/40 hover:bg-white hover:text-[#4F7CFF] border border-white/60 px-4 py-2 rounded-full transition-colors shadow-sm"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "TASKS COMPLETED", value: completedSteps.length, icon: CheckCircle2, color: "text-[#42D392]" },
          { label: "WORDS PRODUCED", value: completedSteps.length * 1250, icon: FileText, color: "text-[#4F7CFF]" },
          { label: "HOURS SAVED", value: completedSteps.length * 24, icon: Activity, color: "text-[#F7B955]", suffix: "h" },
          { label: "AGENTS ACTIVE", value: isDeploying ? 1 : 0, icon: Zap, color: "text-[#7B5CFF]" },
        ].map((stat, i) => (
          <GlassCard key={i} className="p-6 flex items-center gap-5">
            <div className={`w-12 h-12 rounded-2xl bg-white/60 border border-white/80 shadow-sm flex items-center justify-center ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#0A121A] mb-1">
                {stat.value}{stat.suffix}
              </div>
              <div className="text-[10px] font-bold tracking-widest text-[#0A121A]/40 uppercase">{stat.label}</div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Tabs */}
      <GlassCard className="flex items-center gap-2 p-1.5 mt-4 rounded-2xl border-white/60">
        {["Command Center", "Team", "Automation"].map(tab => (
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

      {/* Main Content Area: Team */}
      <div className="mt-6 flex flex-col lg:flex-row gap-6">
        
        {/* Left: Agents Grid */}
        <div className="flex-1">
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
            {agents.map((agent, index) => {
              const isActive = activeStepIndex === index;
              const isDone = completedSteps.includes(index);
              
              return (
                <GlassCard key={agent.id} className={`p-6 flex flex-col justify-between transition-all relative overflow-hidden group ${isActive ? 'border-[#4F7CFF]/50 shadow-[0_0_30px_rgba(79,124,255,0.15)] bg-white/80' : ''}`}>
                  {isActive && <div className="absolute top-0 left-0 w-full h-1 bg-[#4F7CFF] animate-pulse" />}
                  
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors ${isActive ? 'bg-[#4F7CFF]/10 border-[#4F7CFF]/30' : 'bg-white/60 border-white/80 shadow-sm'}`}>
                          <agent.icon className={`w-6 h-6 ${isActive ? 'text-[#4F7CFF]' : 'text-[#0A121A]/40'}`} />
                        </div>
                        <div>
                          <h3 className="font-bold text-[#0A121A] text-base tracking-tight">{agent.name}</h3>
                          <p className="text-[#0A121A]/50 font-medium text-xs mt-1">{agent.role}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full border transition-colors ${
                        isActive ? 'bg-[#4F7CFF]/10 text-[#4F7CFF] border-[#4F7CFF]/20' : 
                        isDone ? 'bg-[#42D392]/10 text-[#42D392] border-[#42D392]/20' : 'bg-white/60 text-[#0A121A]/40 border-white/80'
                      }`}>
                        {isActive ? 'Live' : isDone ? 'Done' : 'Idle'}
                      </span>
                    </div>
                    
                    <p className="text-[#0A121A]/60 font-medium text-sm leading-relaxed mb-6">
                      {agent.description}
                    </p>
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

        {/* Right: Team Activity (Only show if active or done) */}
        <div className="w-full lg:w-[350px] shrink-0">
          <GlassCard className="p-6 h-full min-h-[500px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-[#0A121A] tracking-tight">Team Activity</h3>
              <span className="flex items-center gap-2 text-xs font-bold text-[#4F7CFF] tracking-widest uppercase">
                <span className="w-2 h-2 rounded-full bg-[#4F7CFF] animate-pulse" /> Live
              </span>
            </div>
            
            <div className="flex-1 flex flex-col justify-center items-center text-center px-4">
              {completedSteps.length === 0 && !isDeploying ? (
                <p className="text-[#0A121A]/40 font-medium text-sm">
                  Your AI team's activity will appear here once you assign a goal.
                </p>
              ) : (
                <div className="w-full h-full flex flex-col justify-start items-start gap-4">
                  <AnimatePresence>
                    {completedSteps.map((stepIndex) => (
                      <motion.div 
                        key={stepIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-start gap-3 text-left w-full border-b border-white/40 pb-4"
                      >
                        <div className="w-8 h-8 shrink-0 rounded-full bg-[#42D392]/10 border border-[#42D392]/20 flex items-center justify-center mt-1">
                          <Check className="w-4 h-4 text-[#42D392]" />
                        </div>
                        <div>
                          <p className="text-[#0A121A] text-sm font-bold">{agents[stepIndex].name}</p>
                          <p className="text-[#0A121A]/50 font-medium text-xs mt-1">Produced {agents[stepIndex].deliverable}</p>
                        </div>
                      </motion.div>
                    ))}
                    {activeStepIndex !== -1 && (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-start gap-3 text-left w-full"
                      >
                        <div className="w-8 h-8 shrink-0 rounded-full border border-white/60 bg-white/40 flex items-center justify-center mt-1">
                          <Loader2 className="w-4 h-4 text-[#4F7CFF] animate-spin" />
                        </div>
                        <div>
                          <p className="text-[#0A121A] text-sm font-bold">{agents[activeStepIndex].name}</p>
                          <p className="text-[#4F7CFF] text-xs font-medium mt-1 animate-pulse">Working on {agents[activeStepIndex].deliverable}...</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
