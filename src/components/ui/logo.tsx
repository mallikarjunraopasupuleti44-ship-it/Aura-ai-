"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function AuraLogo({ className, size = "md" }: LogoProps) {
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
      className={cn("relative flex items-center justify-center", containerSize, className)}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      {/* Soft Bloom Background */}
      <motion.div 
        className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Orbit Rings */}
      <motion.div
        className="absolute rounded-full border border-white/20 border-t-white/40 border-b-purple-500/30"
        style={{ width: innerRing, height: innerRing }}
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
      
      <motion.div
        className="absolute rounded-full border border-white/10 border-l-pink-400/30 border-r-blue-400/30"
        style={{ width: outerRing, height: outerRing }}
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      {/* Orbital Nodes (Six colorful nodes on the outer ring) */}
      {[0, 60, 120, 180, 240, 300].map((angle, index) => {
        const colors = [
          "bg-blue-400", "bg-purple-400", "bg-pink-400", 
          "bg-indigo-400", "bg-violet-400", "bg-fuchsia-400"
        ];
        return (
          <motion.div
            key={angle}
            className="absolute origin-center"
            style={{ width: outerRing, height: outerRing }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: index * -3.33 }}
          >
            <div 
              className={cn("absolute -top-1 left-1/2 w-2 h-2 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]", colors[index])}
              style={{ transform: 'translateX(-50%)' }}
            />
          </motion.div>
        );
      })}

      {/* Core Sphere (Glass and Purple Gradient) */}
      <motion.div
        className="relative z-10 w-[60%] h-[60%] rounded-full overflow-hidden glass shadow-[0_0_30px_rgba(168,85,247,0.4)]"
        animate={{ y: [-2, 2, -2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-purple-100/50 to-fuchsia-300/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.9)_0%,_transparent_40%)]" />
        {/* Core Glow Pulse */}
        <motion.div 
          className="absolute inset-0 bg-purple-400/20"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Floating Particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-white rounded-full blur-[1px]"
          initial={{ 
            x: (Math.random() - 0.5) * outerRing, 
            y: (Math.random() - 0.5) * outerRing,
            opacity: 0
          }}
          animate={{ 
            y: [null, (Math.random() - 0.5) * outerRing - 20],
            opacity: [0, 0.8, 0]
          }}
          transition={{ 
            duration: 2 + Math.random() * 2, 
            repeat: Infinity, 
            ease: "easeOut",
            delay: Math.random() * 2
          }}
        />
      ))}
    </motion.div>
  );
}
