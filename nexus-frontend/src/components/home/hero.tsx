"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { AuraLogo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Play, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import Link from "next/link";

export function Hero() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const words1 = "Your AI Workforce for".split(" ");
  const words2 = "Business Growth".split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <section className="relative min-h-screen pt-32 pb-20 overflow-hidden flex flex-col items-center">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10 mesh-bg opacity-70" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-cyan-400/10 rounded-full blur-[120px] -z-10" />

      <div className="container px-6 flex flex-col items-center text-center max-w-5xl mx-auto z-10">
        
        {/* Animated Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="mb-8"
        >
          <AuraLogo size="lg" />
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
          className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl leading-relaxed"
        >
          Upload your business once. Aura AI learns everything. <br/>
          Your AI workforce plans, markets, automates, analyses, creates documents, 
          sends emails and scales your company while you stay in control.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 items-center mb-16"
        >
          <Button size="lg" onClick={() => window.location.href='/signup'} magnetic={true}>
            Start Free <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button size="lg" variant="outline" magnetic={true} className="group">
            <Play className="mr-2 w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" /> Watch Demo
          </Button>
        </motion.div>

        {/* Floating Cards (Parallax) */}
        <motion.div 
          className="relative w-full max-w-4xl mx-auto h-[400px] sm:h-[500px]"
          style={{ opacity }}
        >
          {/* Main Dashboard Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            style={{ y: y1 }}
            className="absolute inset-x-0 bottom-0 top-10 mx-auto w-[90%] md:w-full glass-card overflow-hidden flex flex-col z-20 premium-shadow border-t-white/80 border-l-white/80"
          >
            <div className="h-12 bg-white/40 border-b border-white/40 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 p-8 flex flex-col gap-6 bg-gradient-to-br from-white/40 to-white/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Planner Agent is working...</h3>
                  <p className="text-sm text-gray-500">Generating Q3 Marketing Strategy</p>
                </div>
              </div>
              <div className="flex-1 rounded-xl bg-white/60 border border-white/60 p-4 space-y-3">
                <div className="h-4 w-3/4 bg-blue-200/50 rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-indigo-200/50 rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-purple-200/50 rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-cyan-200/50 rounded animate-pulse" />
              </div>
            </div>
          </motion.div>

          {/* Floating Element Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 1.4 }}
            style={{ y: y2 }}
            className="absolute left-[-20px] md:left-[-60px] top-[100px] z-30 w-48 sm:w-64 glass-card p-4 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Business Uploaded</p>
              <p className="text-xs text-gray-500">Knowledge loaded.</p>
            </div>
          </motion.div>

          {/* Floating Element Right */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 1.6 }}
            style={{ y: y1 }}
            className="absolute right-[-20px] md:right-[-40px] top-[200px] z-30 w-48 sm:w-64 glass-card p-4 flex flex-col gap-2"
          >
             <p className="text-sm font-medium text-gray-800">Team Active</p>
             <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center text-[10px] font-bold text-indigo-700">
                    A{i}
                  </div>
                ))}
             </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
