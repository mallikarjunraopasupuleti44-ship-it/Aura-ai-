"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { AuraLogo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Play, ArrowRight, ShieldCheck, Zap, Code2, Building2 } from "lucide-react";
import Link from "next/link";

export function Hero() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const words1 = "Your AI Workforce for".split(" ");
  const words2 = "Business Growth".split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, damping: 12, stiffness: 100 },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: { type: "spring" as const, damping: 12, stiffness: 100 },
    },
  };

  return (
    <section className="relative min-h-screen pt-32 pb-20 flex flex-col items-center justify-center">
      <div className="container px-6 flex flex-col items-center text-center max-w-5xl mx-auto z-10">
        
        {/* Animated Centered Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="mb-10 relative flex justify-center items-center"
        >
          <motion.div 
            className="absolute inset-[-40%] rounded-full border border-[#4F7CFF]/20 border-dashed"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          />
          <AuraLogo size="lg" className="animate-float" />
        </motion.div>

        {/* Small Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/40 backdrop-blur-md border border-white/60 text-sm font-bold text-[#0A121A] mb-8 shadow-[0_4px_20px_rgba(79,124,255,0.1)]"
        >
          <span>✨</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4F7CFF] to-[#7B5CFF]">
            AI Business Operating System
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={container}
          initial="hidden"
          animate="visible"
          className="text-5xl md:text-7xl font-bold tracking-tight text-[#0A121A] mb-6 flex flex-wrap justify-center gap-x-3 gap-y-2"
        >
          {words1.map((word, index) => (
            <motion.span variants={child} key={index}>
              {word}
            </motion.span>
          ))}
          <br className="hidden md:block w-full" />
          {words2.map((word, index) => (
            <motion.span variants={child} key={`g-${index}`} className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F7CFF] to-[#2FD9FF] pb-2">
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-lg md:text-xl text-[#0A121A]/60 mb-10 max-w-3xl leading-relaxed font-medium mx-auto"
        >
          Upload your business once. <span className="font-bold text-[#0A121A]">Aura AI learns your company</span> and deploys an AI workforce that plans, markets, automates, creates documents, manages customers, and helps grow your business.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-16"
        >
          <Button size="lg" onClick={() => window.location.href='/signup'} magnetic={true} className="h-14 px-10 text-lg group relative overflow-hidden bg-[#4F7CFF] hover:bg-[#7B5CFF] text-white shadow-[0_10px_30px_rgba(79,124,255,0.3)]">
            <span className="relative z-10 flex items-center font-bold">
              Start Free <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          </Button>
          <Button size="lg" variant="outline" magnetic={true} className="h-14 px-8 text-lg group bg-white/40 backdrop-blur-md border-white/60 hover:bg-white/60 text-[#0A121A] font-bold shadow-sm">
            <Play className="mr-2 w-5 h-5 text-[#4F7CFF] group-hover:scale-110 transition-transform" /> Watch Demo
          </Button>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="flex flex-wrap justify-center gap-6 text-sm font-bold text-[#0A121A]/60"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#42D392]/20 border border-[#42D392]/30 flex items-center justify-center"><ShieldCheck className="w-3.5 h-3.5 text-[#42D392]" /></div>
            Secure
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#4F7CFF]/20 border border-[#4F7CFF]/30 flex items-center justify-center"><Zap className="w-3.5 h-3.5 text-[#4F7CFF]" /></div>
            AI Powered
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#7B5CFF]/20 border border-[#7B5CFF]/30 flex items-center justify-center"><Code2 className="w-3.5 h-3.5 text-[#7B5CFF]" /></div>
            No Coding
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#2FD9FF]/20 border border-[#2FD9FF]/30 flex items-center justify-center"><Building2 className="w-3.5 h-3.5 text-[#2FD9FF]" /></div>
            Enterprise Ready
          </div>
        </motion.div>

      </div>
    </section>
  );
}
