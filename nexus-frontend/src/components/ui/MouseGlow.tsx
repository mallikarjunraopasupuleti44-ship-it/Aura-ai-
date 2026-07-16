"use client";

import { useEffect, useRef, useState } from "react";

export function GlobalMouseGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    const updateMousePosition = (e: MouseEvent) => {
      if (!glowRef.current) return;
      
      const x = e.clientX;
      const y = e.clientY;
      
      // Update the background using inline styles for high performance without re-rendering React state
      glowRef.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(236, 72, 153, 0.04), transparent 50%)`;
    };

    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  if (!isMounted) return null;

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-300"
      style={{ 
        opacity: 1,
        // Start with a subtle static glow in the center until mouse moves
        background: `radial-gradient(600px circle at 50% 50%, rgba(236, 72, 153, 0.02), transparent 50%)` 
      }}
    />
  );
}
