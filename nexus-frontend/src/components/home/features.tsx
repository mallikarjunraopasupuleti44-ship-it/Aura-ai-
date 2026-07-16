"use client";

import React from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Sparkles, BarChart3, Mail, Code2, MessagesSquare, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Financial Intelligence",
    description: "Automated cost analysis, revenue projections, and burn-rate tracking without opening Excel.",
    icon: BarChart3,
    color: "text-[#42D392]",
    bg: "bg-[#42D392]/10"
  },
  {
    title: "Content Marketing",
    description: "Your Marketing Agent researches competitors and schedules weeks of social content.",
    icon: MessagesSquare,
    color: "text-[#4F7CFF]",
    bg: "bg-[#4F7CFF]/10"
  },
  {
    title: "Outbound Sales",
    description: "Drafts hyper-personalized cold emails and manages follow-ups entirely autonomously.",
    icon: Mail,
    color: "text-[#7B5CFF]",
    bg: "bg-[#7B5CFF]/10"
  },
  {
    title: "No-Code Websites",
    description: "Generates high-converting landing pages tailored to your brand in seconds.",
    icon: Code2,
    color: "text-[#2FD9FF]",
    bg: "bg-[#2FD9FF]/10"
  },
  {
    title: "Document Creation",
    description: "Drafts NDAs, SOPs, proposals, and contracts utilizing your uploaded company knowledge.",
    icon: FileText,
    color: "text-[#F7B955]",
    bg: "bg-[#F7B955]/10"
  },
  {
    title: "Continuous Learning",
    description: "Upload PDFs and data. Your agents learn instantly and adapt to your unique business context.",
    icon: Sparkles,
    color: "text-[#FF6B81]",
    bg: "bg-[#FF6B81]/10"
  }
];

export function Features() {
  return (
    <section className="relative py-32 overflow-hidden bg-[#FCFDFF]">
      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/40 backdrop-blur-md border border-white/60 text-[#42D392] text-sm font-bold mb-6 shadow-sm"
            >
              <Sparkles className="w-4 h-4" /> Enterprise Capabilities
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold tracking-tight text-[#0A121A]"
            >
              Everything you need to <br className="hidden md:block" /> scale an empire.
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-[#0A121A]/60 font-medium max-w-md leading-relaxed"
          >
            Aura AI isn't a chatbot. It's an entire suite of enterprise-grade tools operated autonomously by AI.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <GlassCard className="p-8 h-full group" hover="lift">
                  <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center border border-white/60 mb-8 shadow-sm transition-transform duration-500 group-hover:scale-110", feature.bg)}>
                    <Icon className={cn("w-8 h-8", feature.color)} />
                  </div>
                  <h3 className="text-xl font-bold text-[#0A121A] mb-3">{feature.title}</h3>
                  <p className="text-[#0A121A]/60 font-medium leading-relaxed">{feature.description}</p>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
