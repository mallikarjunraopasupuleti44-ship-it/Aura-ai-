"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, BrainCircuit, LineChart, Users, Globe, LayoutList, CheckCircle2 } from "lucide-react";
import { AuraLogo } from "@/components/ui/logo";

export default function StartBusinessPage() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeAgent, setActiveAgent] = useState(0);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    // Simulate the sequence of AI agents working
    const interval = setInterval(() => {
      setActiveAgent((prev) => {
        if (prev >= agents.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 4000); // Change active agent every 4 seconds
  };

  const agents = [
    { name: "Planner Agent", icon: BrainCircuit, color: "text-purple-600", bg: "bg-purple-100", tasks: ["Creating Business Plan", "Defining Brand", "Mapping Roadmap", "Target Audience Strategy"] },
    { name: "Marketing Agent", icon: Users, color: "text-pink-600", bg: "bg-pink-100", tasks: ["Writing Ad Copy", "Creating Content Calendar", "Drafting Social Posts"] },
    { name: "Finance Agent", icon: LineChart, color: "text-green-600", bg: "bg-green-100", tasks: ["Forecasting Revenue", "Calculating Break-even", "Setting Pricing Strategy"] },
    { name: "Operations Agent", icon: LayoutList, color: "text-blue-600", bg: "bg-blue-100", tasks: ["Building Hiring Plan", "Writing SOPs", "Finding Suppliers"] },
    { name: "Website Agent", icon: Globe, color: "text-orange-600", bg: "bg-orange-100", tasks: ["Designing Landing Page", "Writing Website Copy", "Structuring SEO"] }
  ];

  return (
    <div className="max-w-4xl mx-auto py-10">
      
      {!isGenerating ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-12 text-center rounded-3xl"
        >
          <div className="flex justify-center mb-6">
            <AuraLogo size="md" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">What business would you like to build?</h1>
          <p className="text-gray-500 mb-8 max-w-xl mx-auto text-lg">
            Describe your idea, and your AI workforce will immediately begin building your business plan, marketing strategy, financials, and more.
          </p>
          
          <div className="relative max-w-2xl mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur opacity-20" />
            <div className="relative flex items-center bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. I want to start a premium coffee shop in London..."
                className="flex-1 bg-transparent border-none outline-none px-4 text-gray-800 text-lg placeholder:text-gray-400"
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              />
              <Button onClick={handleGenerate} className="rounded-xl px-6 bg-purple-600 hover:bg-purple-700 text-white font-medium ml-2">
                Generate <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2">
            <button onClick={() => setPrompt("I want to start a bakery.")} className="px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">"I want to start a bakery."</button>
            <button onClick={() => setPrompt("I want to start a clothing brand.")} className="px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">"I want to start a clothing brand."</button>
            <button onClick={() => setPrompt("I want to build a SaaS.")} className="px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">"I want to build a SaaS."</button>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-12">
          <div className="text-center">
             <h2 className="text-3xl font-bold text-gray-900 mb-2">Your AI Team is Working</h2>
             <p className="text-gray-500">Building: {prompt}</p>
          </div>

          <div className="relative">
             {/* Connection Line */}
             <div className="absolute left-12 top-0 bottom-0 w-0.5 bg-gray-100 z-0" />
             
             <div className="space-y-8 relative z-10">
                {agents.map((agent, index) => {
                  const isActive = activeAgent === index;
                  const isCompleted = activeAgent > index;
                  const Icon = agent.icon;

                  return (
                    <motion.div 
                      key={agent.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: isActive || isCompleted ? 1 : 0.4, x: 0 }}
                      className={`flex gap-6 items-start ${isActive ? 'scale-105' : 'scale-100'} transition-transform duration-500`}
                    >
                      {/* Agent Avatar */}
                      <div className={`w-24 h-24 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${isActive ? agent.bg : isCompleted ? 'bg-gray-100' : 'bg-gray-50 border border-gray-100'} transition-colors duration-500 relative`}>
                        {isActive && (
                           <motion.div 
                             className="absolute inset-0 border-2 border-purple-400 rounded-2xl"
                             animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
                             transition={{ duration: 2, repeat: Infinity }}
                           />
                        )}
                        <Icon className={`w-10 h-10 ${isActive ? agent.color : isCompleted ? 'text-gray-500' : 'text-gray-300'}`} />
                        {isCompleted && (
                          <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1 border-2 border-white">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Agent Work Area */}
                      <div className={`flex-1 glass-card p-6 border ${isActive ? 'border-purple-200 shadow-purple-100' : 'border-gray-100'} min-h-[140px]`}>
                        <div className="flex items-center justify-between mb-4">
                           <h3 className={`text-xl font-bold ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>{agent.name}</h3>
                           {isActive && <span className="text-xs font-semibold bg-purple-100 text-purple-700 px-3 py-1 rounded-full animate-pulse">Working...</span>}
                           {isCompleted && <span className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">Completed</span>}
                        </div>
                        
                        <div className="space-y-3">
                          {agent.tasks.map((task, tIndex) => {
                            // Show tasks progressively if active
                            const showTask = isCompleted || (isActive && tIndex <= (Date.now() % agent.tasks.length));
                            
                            return (
                              <motion.div 
                                key={tIndex}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: isActive || isCompleted ? 1 : 0 }}
                                className="flex items-center gap-3 text-sm text-gray-600"
                              >
                                <div className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-purple-500'}`} />
                                {task}
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
