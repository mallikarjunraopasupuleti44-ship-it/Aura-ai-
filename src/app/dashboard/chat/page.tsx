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
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative">
      <div className="absolute inset-0 mesh-bg opacity-20 pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center border border-purple-200">
             <Bot className="w-5 h-5 text-purple-600" />
           </div>
           <div>
             <h2 className="font-semibold text-gray-900">Planner Agent</h2>
             <p className="text-xs text-green-600 flex items-center gap-1">
               <span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Online
             </p>
           </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 p-2">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 z-10">
        {messages.map((msg, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${msg.role === 'user' ? 'bg-gray-100' : 'bg-purple-100 border border-purple-200'}`}>
              {msg.role === 'user' ? <User className="w-4 h-4 text-gray-600" /> : <AuraLogo size="sm" />}
            </div>
            <div className={`group relative max-w-[80%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-gray-100 text-gray-900 rounded-tr-sm' : 'glass-card border-gray-100 text-gray-800 rounded-tl-sm'}`}>
              <div className="prose prose-sm prose-p:leading-relaxed prose-headings:font-bold prose-headings:text-gray-900 max-w-none">
                {msg.content.split('\n').map((line, i) => {
                  if (line.startsWith('###')) return <h3 key={i} className="mt-4 mb-2 text-lg">{line.replace('###', '')}</h3>;
                  if (line.startsWith('-')) return <li key={i} className="ml-4">{line.replace('-', '')}</li>;
                  return <p key={i} className="mb-2 last:mb-0">{line}</p>;
                })}
              </div>
              
              {msg.role === 'assistant' && (
                <button className="absolute -bottom-3 -right-3 opacity-0 group-hover:opacity-100 p-2 bg-white rounded-full shadow-md border border-gray-100 text-gray-400 hover:text-purple-600 transition-all">
                  <Copy className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 z-10">
        <div className="relative max-w-3xl mx-auto flex items-center bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-purple-300 focus-within:ring-2 focus-within:ring-purple-100 transition-all p-2">
          <button className="p-3 text-gray-400 hover:text-purple-600 transition-colors">
            <Mic className="w-5 h-5" />
          </button>
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Message Planner Agent..."
            className="flex-1 bg-transparent border-none outline-none px-2 text-gray-800 placeholder:text-gray-400"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-colors ml-2"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-3">Aura AI can make mistakes. Consider verifying important information.</p>
      </div>
    </div>
  );
}
