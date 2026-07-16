"use client";

import React from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { BrainCircuit, ArrowRight, Zap, Globe, CheckCircle2, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export function Workflow() {
  const steps = [
    { name: "You provide the idea", desc: "Just describe what business you want to build in a single sentence.", icon: BrainCircuit, color: "text-[#7B5CFF]" },
    { name: "Agents collaborate", desc: "Our AI team breaks down the task into planning, marketing, and operations.", icon: Zap, color: "text-[#4F7CFF]" },
    { name: "Deliverables generated", desc: "You receive a ready-to-go business plan, financial model, and marketing strategy.", icon: CheckCircle2, color: "text-[#42D392]" },
    { name: "Live deployment", desc: "Your landing page goes live and social posts are scheduled automatically.", icon: Globe, color: "text-[#2FD9FF]" },
  ];

  return (
    <section className="relative py-32 overflow-hidden bg-transparent">
      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/40 backdrop-blur-md border border-white/60 text-[#7B5CFF] text-sm font-bold mb-6 shadow-sm"
          >
            <Zap className="w-4 h-4" /> Seamless Workflow
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight text-[#0A121A] mb-6"
          >
            From idea to launched business <br className="hidden md:block" /> in under 5 minutes.
          </motion.h2>
        </div>

        <div className="relative mt-16">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#4F7CFF]/30 to-transparent -translate-y-1/2 hidden lg:block" />
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-8">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: idx * 0.2 }}
                  className="relative z-10 flex flex-col items-center text-center"
                >
                  <GlassCard className="w-24 h-24 rounded-3xl flex items-center justify-center mb-8 relative group" hover="lift">
                    <Icon className={cn("w-10 h-10 transition-transform duration-500 group-hover:scale-110", step.color)} />
                    <div className="absolute -inset-2 bg-gradient-to-r from-[#4F7CFF]/0 to-[#7B5CFF]/0 group-hover:from-[#4F7CFF]/10 group-hover:to-[#7B5CFF]/10 blur-xl rounded-3xl transition-all duration-500" />
                  </GlassCard>
                  
                  <div className="relative">
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 hidden lg:block text-[#0A121A]/20">
                      {idx > 0 && <ArrowRight className="w-6 h-6" />}
                    </div>
                    <h3 className="text-xl font-bold text-[#0A121A] mb-3">{step.name}</h3>
                    <p className="text-sm font-medium text-[#0A121A]/60 leading-relaxed max-w-[250px] mx-auto">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
