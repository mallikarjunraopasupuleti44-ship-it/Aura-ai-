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

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("relative flex items-center justify-center cursor-pointer", containerSize, className)}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      {/* Background Glows */}
      <motion.div 
        className="absolute inset-0 rounded-full bg-blue-500/10 blur-[40px] md:blur-[80px]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute inset-0 rounded-full bg-purple-500/10 blur-[30px] md:blur-[60px]"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      
      {/* Inner bright core glow */}
      <motion.div 
        className="absolute w-1/2 h-1/2 rounded-full bg-white/60 blur-[30px]"
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Orbital Rings Layer */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ 
          x: useTransform(springX, (x) => x * -10), 
          y: useTransform(springY, (y) => y * -10) 
        }}
      >
        {/* Ring 1 - Horizontalish */}
        <motion.div
          className="absolute w-[95%] h-[40%] rounded-[100%] border-[1.5px] border-blue-400/40"
          style={{ rotate: 15 }}
          animate={{ rotate: 15 }}
        >
          {/* Node 1 */}
          <motion.div 
            className="absolute top-0 left-1/2 -ml-2 -mt-2 w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] border border-blue-200"
            animate={{ 
              rotate: 360, 
              x: ["-45vw", "45vw"], 
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            style={{ offsetPath: `path('M 0 50 A 50 20 0 1 1 100 50 A 50 20 0 1 1 0 50')`, offsetDistance: "0%" } as any}
          />
        </motion.div>

        {/* Ring 2 - Diagonal 1 */}
        <motion.div
          className="absolute w-[95%] h-[40%] rounded-[100%] border-[1.5px] border-purple-400/40"
          style={{ rotate: 75 }}
          animate={{ rotate: 75 }}
        >
          {/* Node 2 */}
        </motion.div>

        {/* Ring 3 - Diagonal 2 */}
        <motion.div
          className="absolute w-[95%] h-[40%] rounded-[100%] border-[1.5px] border-pink-400/40"
          style={{ rotate: 135 }}
          animate={{ rotate: 135 }}
        >
           {/* Node 3 */}
        </motion.div>

        {/* I'll use SVG for orbits and nodes for cleaner perfect paths instead of div borders which are hard to animate nodes along. */}
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full overflow-visible">
          <defs>
            <radialGradient id="nodeBlue" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#93c5fd" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </radialGradient>
            <radialGradient id="nodePurple" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#d8b4fe" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#7e22ce" />
            </radialGradient>
            <radialGradient id="nodePink" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#f9a8d4" />
              <stop offset="50%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#be185d" />
            </radialGradient>
            <filter id="glowBlue">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="glowPurple">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="glowPink">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Orbits */}
          <ellipse cx="100" cy="100" rx="90" ry="35" fill="none" stroke="rgba(147,197,253,0.4)" strokeWidth="1" transform="rotate(15 100 100)" />
          <ellipse cx="100" cy="100" rx="90" ry="35" fill="none" stroke="rgba(216,180,254,0.4)" strokeWidth="1" transform="rotate(75 100 100)" />
          <ellipse cx="100" cy="100" rx="90" ry="35" fill="none" stroke="rgba(249,168,212,0.4)" strokeWidth="1" transform="rotate(135 100 100)" />

          {/* Animated Nodes using SVG animateMotion */}
          <circle r="6" fill="url(#nodeBlue)" filter="url(#glowBlue)">
            <animateMotion dur="8s" repeatCount="indefinite" path="M 10 100 A 90 35 15 1 1 190 100 A 90 35 15 1 1 10 100" />
          </circle>
          <circle r="6" fill="url(#nodePurple)" filter="url(#glowPurple)">
            <animateMotion dur="10s" repeatCount="indefinite" path="M 100 10 A 35 90 75 1 1 100 190 A 35 90 75 1 1 100 10" />
          </circle>
          <circle r="6" fill="url(#nodePink)" filter="url(#glowPink)">
            <animateMotion dur="12s" repeatCount="indefinite" path="M 190 100 A 90 35 135 1 1 10 100 A 90 35 135 1 1 190 100" />
          </circle>
          {/* Reverse direction nodes */}
          <circle r="5" fill="url(#nodeBlue)" filter="url(#glowBlue)">
            <animateMotion dur="11s" repeatCount="indefinite" path="M 190 100 A 90 35 15 1 0 10 100 A 90 35 15 1 0 190 100" />
          </circle>
          <circle r="5" fill="url(#nodePink)" filter="url(#glowPink)">
            <animateMotion dur="9s" repeatCount="indefinite" path="M 100 190 A 35 90 75 1 0 100 10 A 35 90 75 1 0 100 190" />
          </circle>
        </svg>
      </motion.div>

      {/* Core "A" Layer */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center drop-shadow-[0_15px_30px_rgba(59,130,246,0.3)]"
        style={{ 
          x: useTransform(springX, (x) => x * 15), 
          y: useTransform(springY, (y) => y * 15) 
        }}
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 100 100" className="w-[60%] h-[60%] overflow-visible">
          <defs>
            <linearGradient id="aGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" /> {/* Blue */}
              <stop offset="100%" stopColor="#a855f7" /> {/* Purple */}
            </linearGradient>
            
            <filter id="aShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="10" stdDeviation="15" floodColor="rgba(59,130,246,0.4)" />
            </filter>

            <filter id="starGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Main "A" Path (Thick chevron) */}
          <path 
            d="M 22 85 L 50 15 L 78 85" 
            fill="none" 
            stroke="url(#aGrad)" 
            strokeWidth="24" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            filter="url(#aShadow)"
          />
          
          {/* White inner highlight to make it look glassy/premium */}
          <path 
            d="M 22 85 L 50 15 L 78 85" 
            fill="none" 
            stroke="rgba(255,255,255,0.6)" 
            strokeWidth="4" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />

          {/* Core Star inside the A */}
          <path 
            d="M 50 48 Q 50 63, 65 63 Q 50 63, 50 78 Q 50 63, 35 63 Q 50 63, 50 48 Z" 
            fill="white" 
            filter="url(#starGlow)"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}
