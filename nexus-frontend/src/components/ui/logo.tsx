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
    xl: "w-full max-w-[450px] aspect-square",
  };

  const containerSize = sizeMap[size];

  // Using a container-relative sizing approach so we can just use 100% inside.
  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("relative flex items-center justify-center cursor-pointer", containerSize, className)}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      {/* Background Blooms */}
      <motion.div 
        className="absolute inset-0 rounded-full bg-indigo-500/10 blur-[40px] md:blur-[80px]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute inset-0 rounded-full bg-blue-500/10 blur-[30px] md:blur-[60px]"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Hexagon Layer (Outer) */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center drop-shadow-xl"
        style={{ 
          x: useTransform(springX, (x) => x * -10), 
          y: useTransform(springY, (y) => y * -10) 
        }}
        animate={{ y: [-3, 3, -3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 100 100" className="w-[90%] h-[90%] overflow-visible">
          <defs>
            <linearGradient id="hexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
              <stop offset="50%" stopColor="rgba(240,245,255,0.6)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.8)" />
            </linearGradient>
            <filter id="hexShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="rgba(99,102,241,0.15)" />
            </filter>
          </defs>
          <polygon 
            points="50,5 93,27 93,73 50,95 7,73 7,27" 
            fill="url(#hexGrad)" 
            stroke="rgba(255,255,255,0.9)"
            strokeWidth="1.5"
            strokeLinejoin="round"
            filter="url(#hexShadow)"
            className="backdrop-blur-md"
          />
        </svg>
      </motion.div>

      {/* Triangle Layer (Middle) */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center drop-shadow-lg"
        style={{ 
          x: useTransform(springX, (x) => x * 15), 
          y: useTransform(springY, (y) => y * 15) 
        }}
        animate={{ y: [2, -2, 2] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <svg viewBox="0 0 100 100" className="w-[75%] h-[75%] overflow-visible">
          <defs>
            <linearGradient id="triGrad" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
              <stop offset="100%" stopColor="rgba(224,231,255,0.7)" />
            </linearGradient>
            <filter id="triShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="rgba(59,130,246,0.15)" />
            </filter>
          </defs>
          <polygon 
            points="50,15 90,82 10,82" 
            fill="url(#triGrad)" 
            stroke="rgba(255,255,255,1)"
            strokeWidth="1.5"
            strokeLinejoin="round"
            filter="url(#triShadow)"
          />
        </svg>
      </motion.div>

      {/* Core "S" Layer (Inner) */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ 
          x: useTransform(springX, (x) => x * 25), 
          y: useTransform(springY, (y) => y * 25) 
        }}
      >
        <svg viewBox="0 0 100 100" className="w-[50%] h-[50%] overflow-visible">
          <defs>
            <linearGradient id="sGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4f46e5" /> {/* Indigo */}
              <stop offset="50%" stopColor="#3b82f6" /> {/* Blue */}
              <stop offset="100%" stopColor="#06b6d4" /> {/* Cyan */}
            </linearGradient>
            <filter id="sGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          {/* Stylized "S" Path */}
          <path 
            d="M 65 30 C 55 20, 35 25, 35 40 C 35 55, 65 50, 65 65 C 65 80, 45 85, 35 75"
            fill="none"
            stroke="url(#sGrad)"
            strokeWidth="12"
            strokeLinecap="round"
            filter="url(#sGlow)"
          />
          <path 
            d="M 65 30 C 55 20, 35 25, 35 40 C 35 55, 65 50, 65 65 C 65 80, 45 85, 35 75"
            fill="none"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>

      {/* Floating Orbital Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className={cn(
            "absolute rounded-full",
            i % 2 === 0 ? "bg-cyan-400" : "bg-indigo-400",
            i % 3 === 0 ? "w-2 h-2" : "w-1 h-1"
          )}
          style={{ 
            x: useTransform(springX, (x) => x * (15 + i * 5)), 
            y: useTransform(springY, (y) => y * (15 + i * 5)) 
          }}
          initial={{ 
            x: (Math.random() - 0.5) * 200, 
            y: (Math.random() - 0.5) * 200,
            opacity: 0
          }}
          animate={{ 
            rotate: 360,
            x: [(Math.random() - 0.5) * 100, (Math.random() - 0.5) * -100],
            y: [null, (Math.random() - 0.5) * 200 - 50],
            opacity: [0, 0.8, 0]
          }}
          transition={{ 
            duration: 3 + Math.random() * 3, 
            repeat: Infinity, 
            ease: "linear",
            delay: Math.random() * 2
          }}
        />
      ))}
    </motion.div>
  );
}
