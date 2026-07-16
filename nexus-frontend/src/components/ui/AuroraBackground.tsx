"use client";

import React, { useEffect, useState } from "react";

export function AuroraBackground() {
  const [particles, setParticles] = useState<{ x: number; y: number; delay: number; duration: number; size: number }[]>([]);

  useEffect(() => {
    // Generate random particles only on client
    const newParticles = Array.from({ length: 12 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 15,
      size: 2 + Math.random() * 4,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#FCFDFF]">
      {/* Aurora Gradients Container */}
      <div className="absolute inset-0 aurora-bg opacity-70 will-change-transform" />

      {/* Noise Texture Overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>

    </div>
  );
}
