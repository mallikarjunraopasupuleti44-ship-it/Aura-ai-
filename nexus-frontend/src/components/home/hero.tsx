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
    <section className="relative min-h-screen pt-32 pb-20 overflow-hidden flex flex-col items-center">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10 mesh-bg opacity-70" />
      <div className="absolute top-[10%] left-[20%] w-[40rem] h-[40rem] bg-indigo-500/10 rounded-full blur-[120px] -z-10 animate-blob" />
      <div className="absolute bottom-[20%] right-[20%] w-[45rem] h-[45rem] bg-cyan-400/10 rounded-full blur-[140px] -z-10 animate-blob animation-delay-2000" />
      
      <div className="container px-6 flex flex-col items-center text-center max-w-5xl mx-auto z-10">
        
        {/* Animated Centered Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="mb-10 relative flex justify-center items-center"
        >
          {/* Subtle orbit rings behind the logo for extra pop */}
          <motion.div 
            className="absolute inset-[-40%] rounded-full border border-blue-500/10 border-dashed"
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
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/60 text-sm font-medium text-gray-800 mb-8 shadow-sm"
        >
          <span>✨</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
            AI Business Operating System
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={container}
          initial="hidden"
          animate="visible"
          className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6 flex flex-wrap justify-center gap-x-3 gap-y-2"
        >
          {words1.map((word, index) => (
            <motion.span variants={child} key={index}>
              {word}
            </motion.span>
          ))}
          <br className="hidden md:block w-full" />
          {words2.map((word, index) => (
            <motion.span variants={child} key={`g-${index}`} className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600">
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl leading-relaxed font-light mx-auto"
        >
          Upload your business once. <span className="font-medium text-gray-800">Aura AI learns your company</span> and deploys an AI workforce that plans, markets, automates, creates documents, manages customers, and helps grow your business.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-16"
        >
          <Button size="lg" onClick={() => window.location.href='/signup'} magnetic={true} className="h-14 px-10 text-lg group relative overflow-hidden">
            <span className="relative z-10 flex items-center">
              Start Free <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          </Button>
          <Button size="lg" variant="outline" magnetic={true} className="h-14 px-8 text-lg group bg-white/40 hover:bg-white/60">
            <Play className="mr-2 w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" /> Watch Demo
          </Button>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="flex flex-wrap justify-center gap-6 text-sm font-medium text-gray-600"
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center"><ShieldCheck className="w-3 h-3 text-green-700" /></div>
            Secure
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center"><Zap className="w-3 h-3 text-blue-700" /></div>
            AI Powered
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center"><Code2 className="w-3 h-3 text-purple-700" /></div>
            No Coding
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center"><Building2 className="w-3 h-3 text-indigo-700" /></div>
            Enterprise Ready
          </div>
        </motion.div>

      </div>
    </section>
  );
}
