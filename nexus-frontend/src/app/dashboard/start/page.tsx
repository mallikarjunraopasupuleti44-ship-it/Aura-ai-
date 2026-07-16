"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Rocket, BrainCircuit, LineChart, Users, Globe, CheckCircle2,
  FileText, Activity, ChevronRight, Zap, Check, Loader2, Play, Edit2, Info
} from "lucide-react";

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
    <div className="min-h-screen bg-[#060D14] -mt-8 -mx-8 p-8 font-sans text-white selection:bg-[#14b8a6]/30">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8 pb-12">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-2">
          <span className="hover:text-white cursor-pointer transition-colors">&larr; Home</span>
          <ChevronRight className="w-4 h-4 mx-2 opacity-50" />
          <span className="text-[#14b8a6] bg-[#14b8a6]/10 px-3 py-1 rounded-full flex items-center gap-2 border border-[#14b8a6]/20">
            <Rocket className="w-3.5 h-3.5" /> CofounderAI
            <span className="text-[10px] tracking-widest uppercase ml-1 opacity-80">MISSION CONTROL</span>
          </span>
        </div>

        {/* Hero Section */}
        <div className="bg-[#0A131C] border border-[#1E293B] rounded-[24px] p-8 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#14b8a6]/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-[#14b8a6] mb-4 text-xs tracking-widest uppercase font-bold">
              <Zap className="w-4 h-4" /> Mission Control
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">What business do you want to build?</h1>
            <p className="text-slate-400 mb-8 max-w-3xl text-base leading-relaxed">
              Type your idea and your AI team gets to work — business plan, social campaign, cost analysis, operations and a live landing page. You review and approve every deliverable.
            </p>

            <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
              <div className="flex-1 w-full flex items-center bg-[#060D14] rounded-full border border-[#1E293B] px-2 py-2 focus-within:border-[#14b8a6]/50 transition-colors">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder='e.g. "I want to start a bakery"'
                  className="flex-1 bg-transparent outline-none px-6 text-white placeholder:text-slate-600 text-lg"
                  onKeyDown={(e) => e.key === 'Enter' && handleDeploy()}
                  disabled={isDeploying}
                />
                <button 
                  onClick={handleDeploy} 
                  disabled={isDeploying || !prompt.trim()}
                  className="bg-[#14b8a6] hover:bg-[#0f9687] disabled:opacity-50 disabled:hover:bg-[#14b8a6] text-[#060D14] font-bold px-8 py-4 rounded-full flex items-center gap-2 transition-all h-full"
                >
                  {isDeploying ? <Loader2 className="w-5 h-5 animate-spin" /> : <Rocket className="w-5 h-5" />}
                  Deploy AI Team
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-slate-500 text-sm font-medium mr-2">Try:</span>
              {suggestions.map((s, i) => (
                <button 
                  key={i} 
                  onClick={() => setPrompt(s)}
                  className="text-xs text-slate-300 bg-[#0F1722] hover:bg-[#1E293B] border border-[#1E293B] px-4 py-2 rounded-full transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "TASKS COMPLETED", value: completedSteps.length, icon: CheckCircle2, color: "text-[#14b8a6]" },
            { label: "WORDS PRODUCED", value: completedSteps.length * 1250, icon: FileText, color: "text-[#14b8a6]" },
            { label: "HOURS SAVED", value: completedSteps.length * 24, icon: Activity, color: "text-[#F59E0B]", suffix: "h" },
            { label: "AGENTS ACTIVE", value: isDeploying ? 1 : 0, icon: Zap, color: "text-white" },
          ].map((stat, i) => (
            <div key={i} className="bg-[#0A131C] border border-[#1E293B] rounded-2xl p-6 flex items-center gap-5">
              <div className="w-12 h-12 rounded-full bg-[#060D14] border border-[#1E293B] flex items-center justify-center">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-1">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 bg-[#0A131C] border border-[#1E293B] rounded-full p-1.5 mt-4">
          {["Command Center", "Team", "Automation"].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 text-center py-3 rounded-full text-sm font-bold transition-colors ${
                activeTab === tab 
                  ? "bg-[#1E293B] text-white shadow-sm" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Main Content Area: Team */}
        <div className="mt-6 flex flex-col lg:flex-row gap-6">
          
          {/* Left: Agents Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Your AI Workforce</h2>
                <p className="text-slate-400 text-sm">Hire, edit, pause or remove employees. You are the CEO.</p>
              </div>
              <button className="bg-[#0F1722] hover:bg-[#1E293B] text-[#14b8a6] border border-[#14b8a6]/30 px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-colors">
                <Users className="w-4 h-4" /> Hire Employee
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agents.map((agent, index) => {
                const isActive = activeStepIndex === index;
                const isDone = completedSteps.includes(index);
                
                return (
                  <div key={agent.id} className={`bg-[#0A131C] border ${isActive ? 'border-[#14b8a6]' : 'border-[#1E293B]'} rounded-2xl p-6 flex flex-col justify-between transition-colors relative overflow-hidden group`}>
                    {isActive && <div className="absolute top-0 left-0 w-full h-1 bg-[#14b8a6] animate-pulse" />}
                    
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${isActive ? 'bg-[#14b8a6]/10 border-[#14b8a6]/30' : 'bg-[#060D14] border-[#1E293B]'}`}>
                            <agent.icon className={`w-6 h-6 ${isActive ? 'text-[#14b8a6]' : 'text-slate-400'}`} />
                          </div>
                          <div>
                            <h3 className="font-bold text-white text-base">{agent.name}</h3>
                            <p className="text-slate-500 text-xs mt-1">{agent.role}</p>
                          </div>
                        </div>
                        <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full border ${
                          isActive ? 'bg-[#14b8a6]/10 text-[#14b8a6] border-[#14b8a6]/20' : 
                          isDone ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-[#060D14] text-slate-500 border-[#1E293B]'
                        }`}>
                          {isActive ? 'Live' : isDone ? 'Done' : 'Idle'}
                        </span>
                      </div>
                      
                      <p className="text-slate-400 text-sm leading-relaxed mb-6">
                        {agent.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="flex-1 bg-[#060D14] hover:bg-[#0F1722] border border-[#1E293B] text-slate-300 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                        <Play className="w-4 h-4" /> Assign task
                      </button>
                      <button className="w-12 h-12 flex items-center justify-center bg-[#060D14] hover:bg-[#0F1722] border border-[#1E293B] text-slate-400 rounded-xl transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="w-12 h-12 flex items-center justify-center bg-[#060D14] hover:bg-[#0F1722] border border-[#1E293B] text-slate-400 rounded-xl transition-colors">
                        <Info className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Team Activity (Only show if active or done) */}
          <div className="w-full lg:w-[350px] shrink-0">
            <div className="bg-[#0A131C] border border-[#1E293B] rounded-2xl p-6 h-full min-h-[500px] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white tracking-tight">Team Activity</h3>
                <span className="flex items-center gap-2 text-xs font-bold text-[#14b8a6] tracking-widest uppercase">
                  <span className="w-2 h-2 rounded-full bg-[#14b8a6] animate-pulse" /> Live
                </span>
              </div>
              
              <div className="flex-1 flex flex-col justify-center items-center text-center px-4">
                {completedSteps.length === 0 && !isDeploying ? (
                  <p className="text-slate-500 text-sm">
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
                          className="flex items-start gap-3 text-left w-full border-b border-[#1E293B] pb-4"
                        >
                          <div className="w-8 h-8 shrink-0 rounded-full bg-[#14b8a6]/10 flex items-center justify-center mt-1">
                            <Check className="w-4 h-4 text-[#14b8a6]" />
                          </div>
                          <div>
                            <p className="text-white text-sm font-bold">{agents[stepIndex].name}</p>
                            <p className="text-slate-400 text-xs mt-1">Produced {agents[stepIndex].deliverable}</p>
                          </div>
                        </motion.div>
                      ))}
                      {activeStepIndex !== -1 && (
                        <motion.div 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-start gap-3 text-left w-full"
                        >
                          <div className="w-8 h-8 shrink-0 rounded-full border border-[#1E293B] flex items-center justify-center mt-1">
                            <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
                          </div>
                          <div>
                            <p className="text-white text-sm font-bold">{agents[activeStepIndex].name}</p>
                            <p className="text-[#14b8a6] text-xs mt-1 animate-pulse">Working on {agents[activeStepIndex].deliverable}...</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
