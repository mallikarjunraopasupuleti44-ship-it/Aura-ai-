"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mic, Copy, MoreHorizontal, Bot, User } from "lucide-react";
import { AuraLogo } from "@/components/ui/logo";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I'm your Planner Agent. How can I assist you with your business strategy today?" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: "user", content: input }]);
    const currentInput = input;
    setInput("");
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: `I've analyzed your request regarding "${currentInput}". Here is the strategic breakdown:\n\n### 1. Market Analysis\nThe current market shows a 15% increase in demand for premium services in this sector.\n\n### 2. Action Items\n- Update pricing model\n- Launch targeted campaigns\n- Optimize operations\n\nWould you like me to assign these tasks to the Marketing and Operations agents?` 
      }]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-4xl mx-auto bg-white/40 backdrop-blur-3xl rounded-[32px] shadow-[0_20px_60px_rgba(79,124,255,0.08)] border border-white/60 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[#4F7CFF]/5 via-transparent to-[#7B5CFF]/5 pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-white/60 bg-white/40 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-[16px] bg-[#4F7CFF]/10 flex items-center justify-center border border-[#4F7CFF]/20 shadow-sm">
             <Bot className="w-6 h-6 text-[#4F7CFF]" />
           </div>
           <div>
             <h2 className="font-bold text-[#0A121A] text-lg">Planner Agent</h2>
             <p className="text-xs font-bold text-[#42D392] flex items-center gap-1.5 mt-0.5">
               <span className="w-2 h-2 rounded-full bg-[#42D392] shadow-[0_0_8px_rgba(66,211,146,0.6)] inline-block" /> Online
             </p>
           </div>
        </div>
        <button className="text-[#0A121A]/40 hover:text-[#4F7CFF] p-2 hover:bg-[#4F7CFF]/10 rounded-xl transition-all">
          <MoreHorizontal className="w-6 h-6" />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 z-10 custom-scrollbar">
        {messages.map((msg, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center shrink-0 mt-1 shadow-sm border ${msg.role === 'user' ? 'bg-[#0A121A]/5 border-white/60 backdrop-blur-sm' : 'bg-white/80 border-[#4F7CFF]/20 backdrop-blur-md'}`}>
              {msg.role === 'user' ? <User className="w-5 h-5 text-[#0A121A]/60" /> : <AuraLogo size="sm" />}
            </div>
            <div className={`group relative max-w-[80%] p-5 rounded-[24px] ${msg.role === 'user' ? 'bg-[#0A121A]/5 text-[#0A121A] rounded-tr-sm border border-white/40 backdrop-blur-sm' : 'bg-white/60 border border-white/60 text-[#0A121A] rounded-tl-sm backdrop-blur-md shadow-sm'}`}>
              <div className="prose prose-sm prose-p:leading-relaxed prose-headings:font-bold prose-headings:text-[#0A121A] prose-li:text-[#0A121A]/80 prose-p:text-[#0A121A]/80 max-w-none">
                {msg.content.split('\n').map((line, i) => {
                  if (line.startsWith('###')) return <h3 key={i} className="mt-4 mb-2 text-lg text-[#0A121A]">{line.replace('###', '')}</h3>;
                  if (line.startsWith('-')) return <li key={i} className="ml-4">{line.replace('-', '')}</li>;
                  return <p key={i} className="mb-2 last:mb-0 font-medium">{line}</p>;
                })}
              </div>
              
              {msg.role === 'assistant' && (
                <button className="absolute -bottom-4 -right-4 opacity-0 group-hover:opacity-100 p-2.5 bg-white rounded-full shadow-[0_8px_20px_rgba(79,124,255,0.15)] border border-white/60 text-[#0A121A]/40 hover:text-[#4F7CFF] transition-all transform hover:scale-110">
                  <Copy className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-5 bg-white/40 backdrop-blur-xl border-t border-white/60 z-10">
        <div className="relative max-w-4xl mx-auto flex items-center bg-white/60 backdrop-blur-md rounded-[20px] border border-white/60 focus-within:border-[#4F7CFF] focus-within:ring-4 focus-within:ring-[#4F7CFF]/10 transition-all p-2 shadow-sm">
          <button className="p-3 text-[#0A121A]/40 hover:text-[#7B5CFF] transition-colors rounded-xl hover:bg-white">
            <Mic className="w-6 h-6" />
          </button>
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Message Planner Agent..."
            className="flex-1 bg-transparent border-none outline-none px-3 font-medium text-[#0A121A] placeholder:text-[#0A121A]/40 text-base"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-3.5 bg-gradient-to-r from-[#4F7CFF] to-[#2FD9FF] hover:opacity-90 disabled:from-gray-300 disabled:to-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-[16px] transition-all ml-2 shadow-[0_8px_20px_rgba(79,124,255,0.3)] disabled:shadow-none transform hover:-translate-y-0.5 disabled:transform-none"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-center text-xs font-bold text-[#0A121A]/40 mt-4 tracking-wide">Aura AI can make mistakes. Consider verifying important information.</p>
      </div>
    </div>
  );
}
