"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function AuraLogo({ className, size = "md" }: LogoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springX = useSpring(mouseX, { stiffness: 150, damping: 15 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set((e.clientX - centerX) / (rect.width / 2));
    mouseY.set((e.clientY - centerY) / (rect.height / 2));
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const sizeMap = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-32 h-32",
    xl: "w-64 h-64",
  };

  const ringSizes = {
    sm: [24, 32],
    md: [48, 64],
    lg: [96, 128],
    xl: [192, 256],
  };

  const containerSize = sizeMap[size];
  const [innerRing, outerRing] = ringSizes[size];

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("relative flex items-center justify-center cursor-pointer", containerSize, className)}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      {/* Soft Bloom Background (Lavender & Electric Blue) */}
      <motion.div 
        className="absolute inset-0 rounded-full bg-indigo-500/10 blur-xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute inset-0 rounded-full bg-blue-500/10 blur-lg"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Orbit Rings (Cyan Light Trails) */}
      <motion.div
        className="absolute rounded-full border border-white/10 border-t-cyan-400/50 border-b-indigo-500/30"
        style={{ width: innerRing, height: innerRing, x: useTransform(springX, (x) => x * -5), y: useTransform(springY, (y) => y * -5) }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      
      <motion.div
        className="absolute rounded-full border border-white/5 border-l-blue-500/40 border-r-purple-500/40"
        style={{ width: outerRing, height: outerRing, x: useTransform(springX, (x) => x * -10), y: useTransform(springY, (y) => y * -10) }}
        animate={{ rotate: -360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />

      {/* Orbital Nodes (Electric Blue, Cyan, Lavender) */}
      {[0, 60, 120, 180, 240, 300].map((angle, index) => {
        const colors = [
          "bg-blue-500", "bg-cyan-400", "bg-indigo-400", 
          "bg-blue-400", "bg-purple-400", "bg-cyan-300"
        ];
        return (
          <motion.div
            key={angle}
            className="absolute origin-center"
            style={{ 
              width: outerRing, height: outerRing,
              x: useTransform(springX, (x) => x * -10), 
              y: useTransform(springY, (y) => y * -10)
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 16, repeat: Infinity, ease: "linear", delay: index * -2.66 }}
          >
            <div 
              className={cn("absolute -top-1 left-1/2 w-[6px] h-[6px] rounded-full shadow-[0_0_10px_rgba(255,255,255,0.9)]", colors[index])}
              style={{ transform: 'translateX(-50%)' }}
            />
          </motion.div>
        );
      })}

      {/* Core Sphere (Glass and Purple/Blue Gradient) */}
      <motion.div
        className="relative z-10 w-[65%] h-[65%] rounded-full overflow-hidden glass shadow-[0_0_35px_rgba(99,102,241,0.4)]"
        style={{ x: useTransform(springX, (x) => x * 15), y: useTransform(springY, (y) => y * 15) }}
        animate={{ y: [-2, 2, -2] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-indigo-100/60 to-blue-300/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_35%,_rgba(255,255,255,1)_0%,_transparent_50%)]" />
        {/* Core Glow Pulse (Electric Blue & Lavender) */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-400/20 mix-blend-overlay"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Interactive Floating Particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className={cn(
            "absolute rounded-full blur-[1px]",
            i % 2 === 0 ? "bg-cyan-300" : "bg-white",
            i % 3 === 0 ? "w-1.5 h-1.5" : "w-1 h-1"
          )}
          style={{ 
            x: useTransform(springX, (x) => x * (20 + i * 5)), 
            y: useTransform(springY, (y) => y * (20 + i * 5)) 
          }}
          initial={{ 
            x: (Math.random() - 0.5) * outerRing, 
            y: (Math.random() - 0.5) * outerRing,
            opacity: 0
          }}
          animate={{ 
            y: [null, (Math.random() - 0.5) * outerRing - 30],
            opacity: [0, 0.9, 0]
          }}
          transition={{ 
            duration: 1.5 + Math.random() * 2, 
            repeat: Infinity, 
            ease: "easeOut",
            delay: Math.random() * 2
          }}
        />
      ))}
    </motion.div>
  );
}
