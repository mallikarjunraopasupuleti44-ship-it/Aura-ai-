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
    icon: <Bot className="w-6 h-6 text-indigo-500" />,
    status: "Active",
    color: "indigo",
    tasks: ["Analyzing Q3 metrics", "Generating growth roadmap", "Assigning daily tasks"],
  },
  {
    id: "marketer",
    name: "Growth Marketer",
    role: "Marketing",
    icon: <TrendingUp className="w-6 h-6 text-blue-500" />,
    status: "Active",
    color: "blue",
    tasks: ["Optimizing ad spend", "A/B testing landing pages", "Drafting social posts"],
  },
  {
    id: "writer",
    name: "Content Creator",
    role: "Content",
    icon: <PenTool className="w-6 h-6 text-purple-500" />,
    status: "Active",
    color: "purple",
    tasks: ["Writing blog post", "Creating newsletter", "Refining brand voice"],
  },
  {
    id: "sales",
    name: "Sales Agent",
    role: "Outreach",
    icon: <Mail className="w-6 h-6 text-cyan-500" />,
    status: "Idle",
    color: "cyan",
    tasks: ["Following up leads", "Drafting cold emails", "Updating CRM"],
  },
  {
    id: "developer",
    name: "Tech Lead",
    role: "Engineering",
    icon: <Code className="w-6 h-6 text-fuchsia-500" />,
    status: "Active",
    color: "fuchsia",
    tasks: ["Deploying updates", "Fixing bugs", "Monitoring uptime"],
  },
];

const getColorClasses = (color: string) => {
  const map: Record<string, string> = {
    indigo: "from-indigo-500/20 to-blue-500/10 border-indigo-200/50 hover:border-indigo-400/50 shadow-indigo-500/10",
    blue: "from-blue-500/20 to-cyan-500/10 border-blue-200/50 hover:border-blue-400/50 shadow-blue-500/10",
    purple: "from-purple-500/20 to-fuchsia-500/10 border-purple-200/50 hover:border-purple-400/50 shadow-purple-500/10",
    cyan: "from-cyan-500/20 to-blue-500/10 border-cyan-200/50 hover:border-cyan-400/50 shadow-cyan-500/10",
    fuchsia: "from-fuchsia-500/20 to-purple-500/10 border-fuchsia-200/50 hover:border-fuchsia-400/50 shadow-fuchsia-500/10",
  };
  return map[color] || map.indigo;
};

const getBadgeClasses = (color: string, status: string) => {
  if (status !== "Active") return "bg-gray-100 text-gray-500 border-gray-200";
  const map: Record<string, string> = {
    indigo: "bg-indigo-100 text-indigo-700 border-indigo-200",
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    purple: "bg-purple-100 text-purple-700 border-purple-200",
    cyan: "bg-cyan-100 text-cyan-700 border-cyan-200",
    fuchsia: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200",
  };
  return map[color] || map.indigo;
};

export function AIEmployees() {
  return (
    <section id="ai-employees" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/30 to-transparent -z-10" />
      
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" /> Meet Your Team
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6"
          >
            An entire company,<br/> working for you 24/7.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
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
              whileHover={{ y: -10 }}
              className={cn(
                "group relative glass-card p-8 bg-gradient-to-br transition-all duration-500 overflow-hidden",
                getColorClasses(employee.color)
              )}
            >
              {/* Background glow on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/20 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/80 border border-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500">
                    {employee.icon}
                  </div>
                  <div className={cn("px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5", getBadgeClasses(employee.color, employee.status))}>
                    {employee.status === "Active" && (
                      <span className="relative flex h-2 w-2">
                        <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-current")} />
                        <span className={cn("relative inline-flex rounded-full h-2 w-2 bg-current")} />
                      </span>
                    )}
                    {employee.status}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{employee.name}</h3>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{employee.role}</p>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Current Tasks</p>
                  {employee.tasks.map((task, i) => (
                    <motion.div 
                      key={i} 
                      className="flex items-center gap-3 text-sm text-gray-700 bg-white/50 border border-white/40 rounded-lg p-2.5"
                      initial={{ x: -10, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 + (i * 0.1) }}
                    >
                      <CheckCircle2 className={cn("w-4 h-4", i === 0 && employee.status === "Active" ? `text-${employee.color}-500 animate-pulse` : "text-gray-300")} />
                      <span className={i === 0 && employee.status === "Active" ? "font-medium" : ""}>{task}</span>
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
            className="group relative glass-card p-8 bg-white/40 border-dashed border-2 border-gray-300 hover:border-indigo-400 flex flex-col items-center justify-center text-center cursor-pointer transition-all"
            onClick={() => window.location.href='/dashboard/employees'}
          >
            <div className="w-16 h-16 rounded-full bg-gray-100 group-hover:bg-indigo-50 flex items-center justify-center mb-4 transition-colors">
              <span className="text-3xl text-gray-400 group-hover:text-indigo-500 transition-colors">+</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Hire New Agent</h3>
            <p className="text-sm text-gray-500 max-w-[200px]">Browse the marketplace for specialized AI employees.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
