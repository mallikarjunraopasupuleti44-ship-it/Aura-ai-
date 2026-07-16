"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  withText?: boolean;
}

export function AnimatedLogo({ className, size = "md", withText = true }: AnimatedLogoProps) {
  const sizeMap = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  const ringSizeMap = {
    sm: "w-10 h-10",
    md: "w-12 h-12",
    lg: "w-20 h-20",
    xl: "w-32 h-32",
  };

  return (
    <div className={cn("relative flex items-center group cursor-pointer", className)}>
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 15, ease: "linear", repeat: Infinity }}
          className={cn("absolute rounded-full border border-[#4F7CFF]/20 border-t-[#2FD9FF]/50 border-b-[#7B5CFF]/50", ringSizeMap[size])}
        />
        
        {/* Inner rotating ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 20, ease: "linear", repeat: Infinity }}
          className={cn("absolute rounded-full border border-transparent border-l-[#4F7CFF]/40 border-r-[#7B5CFF]/40", sizeMap[size])}
        />

        {/* Floating Particles */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -10, 0],
                x: [0, i % 2 === 0 ? 5 : -5, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
              className="absolute w-1 h-1 rounded-full bg-[#2FD9FF]"
              style={{
                top: `${20 + i * 25}%`,
                left: `${10 + i * 30}%`,
                boxShadow: "0 0 10px rgba(47,217,255,0.8)",
              }}
            />
          ))}
        </div>

        {/* Core Logo Orb */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "relative z-20 flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#FCFDFF]/80 to-white/20 backdrop-blur-md border border-white/60 shadow-[0_0_30px_rgba(79,124,255,0.25)] group-hover:shadow-[0_0_40px_rgba(79,124,255,0.4)] transition-all duration-500",
            sizeMap[size]
          )}
        >
          {/* Inner core glow */}
          <div className="absolute inset-2 rounded-xl bg-gradient-to-tr from-[#4F7CFF]/20 via-[#7B5CFF]/20 to-[#2FD9FF]/20 blur-sm" />
          
          <span className={cn(
            "relative z-30 font-black text-transparent bg-clip-text bg-gradient-to-r from-[#4F7CFF] via-[#7B5CFF] to-[#2FD9FF] tracking-tighter",
            size === "sm" ? "text-lg" : size === "md" ? "text-xl" : size === "lg" ? "text-3xl" : "text-5xl"
          )}>
            A
          </span>
        </motion.div>
      </div>

      {withText && (
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={cn("ml-3 font-bold tracking-tight text-[#0A121A]", size === "sm" ? "text-lg" : size === "md" ? "text-xl" : "text-3xl")}
        >
          Aura <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F7CFF] to-[#7B5CFF]">AI</span>
        </motion.div>
      )}
    </div>
  );
}
