"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bot, PenTool, TrendingUp, Mail, Code, Sparkles, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const employees = [
  {
    id: "planner",
    name: "Strategic Planner",
    role: "Operations",
    icon: <Bot className="w-6 h-6 text-[#7B5CFF]" />,
    status: "Active",
    color: "violet",
    tasks: ["Analyzing Q3 metrics", "Generating growth roadmap", "Assigning daily tasks"],
  },
  {
    id: "marketer",
    name: "Growth Marketer",
    role: "Marketing",
    icon: <TrendingUp className="w-6 h-6 text-[#4F7CFF]" />,
    status: "Active",
    color: "blue",
    tasks: ["Optimizing ad spend", "A/B testing landing pages", "Drafting social posts"],
  },
  {
    id: "writer",
    name: "Content Creator",
    role: "Content",
    icon: <PenTool className="w-6 h-6 text-[#2FD9FF]" />,
    status: "Active",
    color: "cyan",
    tasks: ["Writing blog post", "Creating newsletter", "Refining brand voice"],
  },
  {
    id: "sales",
    name: "Sales Agent",
    role: "Outreach",
    icon: <Mail className="w-6 h-6 text-[#4F7CFF]" />,
    status: "Idle",
    color: "blue",
    tasks: ["Following up leads", "Drafting cold emails", "Updating CRM"],
  },
  {
    id: "developer",
    name: "Tech Lead",
    role: "Engineering",
    icon: <Code className="w-6 h-6 text-[#7B5CFF]" />,
    status: "Active",
    color: "violet",
    tasks: ["Deploying updates", "Fixing bugs", "Monitoring uptime"],
  },
];

const getColorClasses = (color: string) => {
  const map: Record<string, string> = {
    violet: "from-[#7B5CFF]/10 to-[#4F7CFF]/5 border-white/60 hover:border-[#7B5CFF]/40 shadow-[0_10px_40px_rgba(123,92,255,0.08)]",
    blue: "from-[#4F7CFF]/10 to-[#2FD9FF]/5 border-white/60 hover:border-[#4F7CFF]/40 shadow-[0_10px_40px_rgba(79,124,255,0.08)]",
    cyan: "from-[#2FD9FF]/10 to-[#4F7CFF]/5 border-white/60 hover:border-[#2FD9FF]/40 shadow-[0_10px_40px_rgba(47,217,255,0.08)]",
  };
  return map[color] || map.blue;
};

const getBadgeClasses = (color: string, status: string) => {
  if (status !== "Active") return "bg-white/60 text-[#0A121A]/50 border-white/40";
  const map: Record<string, string> = {
    violet: "bg-[#7B5CFF]/10 text-[#7B5CFF] border-[#7B5CFF]/20",
    blue: "bg-[#4F7CFF]/10 text-[#4F7CFF] border-[#4F7CFF]/20",
    cyan: "bg-[#2FD9FF]/10 text-[#0A121A] border-[#2FD9FF]/30",
  };
  return map[color] || map.blue;
};

const getIconColor = (color: string) => {
  const map: Record<string, string> = {
    violet: "text-[#7B5CFF]",
    blue: "text-[#4F7CFF]",
    cyan: "text-[#2FD9FF]",
  };
  return map[color] || map.blue;
};

export function AIEmployees() {
  return (
    <section id="ai-employees" className="relative py-32 overflow-hidden bg-[#FCFDFF]">
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/40 backdrop-blur-md border border-white/60 text-[#4F7CFF] text-sm font-bold mb-6 shadow-sm"
          >
            <Sparkles className="w-4 h-4" /> Meet Your Team
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight text-[#0A121A] mb-6"
          >
            An entire company,<br/> working for you 24/7.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-[#0A121A]/60 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Aura AI doesn't just give you tools. It gives you a dedicated team of autonomous AI agents that collaborate to scale your business.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {employees.map((employee, index) => (
            <motion.div
              key={employee.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className={cn(
                "group relative bg-white/40 backdrop-blur-3xl rounded-[24px] p-8 bg-gradient-to-br transition-all duration-500 overflow-hidden border",
                getColorClasses(employee.color)
              )}
            >
              {/* Background glow on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/40 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-white/80 backdrop-blur-md border border-white/60 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500">
                    {employee.icon}
                  </div>
                  <div className={cn("px-4 py-1.5 rounded-full text-xs font-bold border flex items-center gap-2", getBadgeClasses(employee.color, employee.status))}>
                    {employee.status === "Active" && (
                      <span className="relative flex h-2 w-2">
                        <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-current")} />
                        <span className={cn("relative inline-flex rounded-full h-2 w-2 bg-current")} />
                      </span>
                    )}
                    {employee.status}
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-[#0A121A] mb-1">{employee.name}</h3>
                  <p className="text-sm font-bold text-[#0A121A]/40 uppercase tracking-widest">{employee.role}</p>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-bold text-[#0A121A]/40 uppercase tracking-widest mb-3">Current Tasks</p>
                  {employee.tasks.map((task, i) => (
                    <motion.div 
                      key={i} 
                      className="flex items-center gap-3 text-sm text-[#0A121A]/80 bg-white/60 backdrop-blur-md border border-white/60 rounded-xl p-3.5 shadow-sm transition-colors group-hover:bg-white/80"
                      initial={{ x: -10, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 + (i * 0.1) }}
                    >
                      <CheckCircle2 className={cn("w-4 h-4", i === 0 && employee.status === "Active" ? cn(getIconColor(employee.color), "animate-pulse") : "text-[#0A121A]/20")} />
                      <span className={i === 0 && employee.status === "Active" ? "font-bold text-[#0A121A]" : "font-medium"}>{task}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* Hire more card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="group relative bg-white/20 backdrop-blur-md rounded-[24px] p-8 border-dashed border-2 border-white/60 hover:border-[#4F7CFF]/50 hover:bg-white/40 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-500"
            onClick={() => window.location.href='/dashboard/employees'}
          >
            <div className="w-16 h-16 rounded-full bg-white/60 border border-white/60 group-hover:bg-[#4F7CFF]/10 flex items-center justify-center mb-6 transition-colors duration-500 shadow-sm">
              <span className="text-3xl text-[#0A121A]/30 group-hover:text-[#4F7CFF] transition-colors duration-500">+</span>
            </div>
            <h3 className="text-xl font-bold text-[#0A121A] mb-2">Hire New Agent</h3>
            <p className="text-base text-[#0A121A]/60 max-w-[200px] font-medium leading-relaxed">Browse the marketplace for specialized AI employees.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
