"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: 'blue' | 'violet' | 'cyan' | 'none';
  hover?: 'lift' | 'scale' | 'glow' | 'none';
  animate?: boolean;
  delay?: number;
  onClick?: () => void;
}

export function GlassCard({
  children,
  className,
  glow = 'none',
  hover = 'lift',
  animate = true,
  delay = 0,
  onClick,
}: GlassCardProps) {
  
  const baseClasses = "aurora-glass relative overflow-hidden";
  
  const glowClasses = {
    none: "",
    blue: "aurora-glow-blue",
    violet: "aurora-glow-violet",
    cyan: "aurora-glow-cyan",
  };
  
  const hoverClasses = {
    none: "",
    lift: "hover:-translate-y-1.5 hover:shadow-[0_30px_90px_rgba(120,130,255,0.12)] transition-all duration-400",
    scale: "hover:scale-[1.02] hover:shadow-[0_30px_90px_rgba(120,130,255,0.12)] transition-all duration-400",
    glow: "hover:shadow-[0_30px_90px_rgba(120,130,255,0.15)] transition-shadow duration-400",
  };

  const combinedClasses = cn(
    baseClasses,
    glowClasses[glow],
    hoverClasses[hover],
    onClick ? "cursor-pointer" : "",
    className
  );

  const content = (
    <div className={combinedClasses} onClick={onClick}>
      {/* Subtle top reflection */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      {children}
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: delay, ease: "easeOut" }}
        className="h-full"
      >
        {content}
      </motion.div>
    );
  }

  return content;
}
