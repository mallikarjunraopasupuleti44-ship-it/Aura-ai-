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
    sm: { wrapper: "w-8 h-8", scale: 0.16 }, // 32px
    md: { wrapper: "w-12 h-12", scale: 0.24 }, // 48px
    lg: { wrapper: "w-32 h-32", scale: 0.64 }, // 128px
    xl: { wrapper: "w-64 h-64", scale: 1.28 }, // 256px
  };

  const { wrapper, scale } = sizeMap[size];

  return (
    <div 
      className={cn("relative flex items-center justify-center cursor-pointer select-none", wrapper, className)}
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="absolute w-[200px] h-[200px] flex items-center justify-center"
        style={{ scale }}
        whileHover={{ scale: scale * 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        {/* Glassmorphism Backdrop */}
        <div className="absolute inset-0 bg-white/20 backdrop-blur-md rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]" />

        {/* Background Glows */}
        <motion.div 
          className="absolute inset-0 rounded-full bg-[#4F7CFF]/20 blur-[30px]"
          animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute inset-0 rounded-full bg-[#7B5CFF]/20 blur-[25px]"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        
        {/* Inner bright core glow */}
        <motion.div 
          className="absolute w-1/2 h-1/2 rounded-full bg-[#2FD9FF]/30 blur-[20px]"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Orbital Rings Layer */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ 
            x: useTransform(springX, (x) => x * -15), 
            y: useTransform(springY, (y) => y * -15) 
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full overflow-visible">
            <defs>
              <filter id="glowBlue" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="glowPurple" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="glowCyan" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>

            {/* Orbits */}
            <ellipse cx="100" cy="100" rx="90" ry="35" fill="none" stroke="rgba(79,124,255,0.5)" strokeWidth="1.5" transform="rotate(15 100 100)" filter="url(#glowBlue)" />
            <ellipse cx="100" cy="100" rx="90" ry="35" fill="none" stroke="rgba(123,92,255,0.5)" strokeWidth="1.5" transform="rotate(75 100 100)" filter="url(#glowPurple)" />
            <ellipse cx="100" cy="100" rx="90" ry="35" fill="none" stroke="rgba(47,217,255,0.5)" strokeWidth="1.5" transform="rotate(135 100 100)" filter="url(#glowCyan)" />

            {/* Orbital Particles */}
            <circle cx="100" cy="10" r="3" fill="#4F7CFF" transform="rotate(15 100 100)" filter="url(#glowBlue)" />
            <circle cx="100" cy="190" r="2" fill="#7B5CFF" transform="rotate(75 100 100)" filter="url(#glowPurple)" />
            <circle cx="10" cy="100" r="3" fill="#2FD9FF" transform="rotate(135 100 100)" filter="url(#glowCyan)" />
            <circle cx="190" cy="100" r="2" fill="#4F7CFF" transform="rotate(135 100 100)" filter="url(#glowBlue)" />

          </svg>
        </motion.div>

        {/* Core "A" Layer */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ 
            x: useTransform(springX, (x) => x * 20), 
            y: useTransform(springY, (y) => y * 20),
            filter: "drop-shadow(0 0 20px rgba(79,124,255,0.4))"
          }}
          animate={{ y: [-4, 4, -4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 100 100" className="w-[60%] h-[60%] overflow-visible">
            <defs>
              <linearGradient id="aGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4F7CFF" /> {/* Electric Blue */}
                <stop offset="100%" stopColor="#7B5CFF" /> {/* Violet */}
              </linearGradient>
              
              <filter id="aShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="rgba(79,124,255,0.6)" />
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
              stroke="rgba(255,255,255,0.7)" 
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
    </div>
  );
}
