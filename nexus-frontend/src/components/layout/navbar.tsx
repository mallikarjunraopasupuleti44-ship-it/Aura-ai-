"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { AuraLogo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "AI Employees", href: "#ai-employees" },
  { name: "Solutions", href: "#solutions" },
  { name: "Pricing", href: "#pricing" },
  { name: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "py-4" : "py-6"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto px-6 max-w-6xl">
        <div className={`flex items-center justify-between rounded-3xl px-6 py-3 transition-all duration-500 ${
          scrolled ? "aurora-glass shadow-[0_8px_32px_rgba(120,130,255,0.08)]" : "bg-transparent border-transparent"
        } border`}>
          
          <Link href="/" className="flex items-center gap-3 group">
            <AuraLogo size="sm" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#4F7CFF] to-[#2FD9FF] tracking-tight">
              Aura AI
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-2 relative">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                onMouseEnter={() => setHoveredLink(link.name)}
                onMouseLeave={() => setHoveredLink(null)}
                className="relative px-5 py-2 text-sm font-medium text-[#0A121A]/70 transition-colors z-10 hover:text-[#0A121A]"
              >
                <span className="relative z-10">{link.name}</span>
                {hoveredLink === link.name && (
                  <motion.div
                    layoutId="navbar-hover"
                    className="absolute inset-0 bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl shadow-[0_4px_20px_rgba(79,124,255,0.08)] -z-10"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-[#0A121A]/80 hover:text-[#4F7CFF] transition-colors hidden sm:block">
              Login
            </Link>
            <Button onClick={() => window.location.href='/signup'} magnetic={true} className="h-11 px-8 rounded-xl text-sm">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
