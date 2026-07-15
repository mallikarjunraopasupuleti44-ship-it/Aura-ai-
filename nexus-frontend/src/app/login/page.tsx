"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { AuraLogo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://aura-ai-orio.onrender.com";
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Store token securely
      localStorage.setItem("aura_token", data.token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-white">
      {/* Left Panel: Branding & Animation */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 items-center justify-center">
        <div className="absolute inset-0 mesh-bg opacity-60" />
        <div className="relative z-10 flex flex-col items-center">
          <AuraLogo size="xl" className="mb-12" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome Back</h2>
            <p className="text-gray-600 max-w-sm">
              Your AI workforce is ready. Log in to manage your business and deploy new agents.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 xl:px-24 relative">
        <Link href="/" className="absolute top-8 left-8 sm:left-16 xl:left-24 text-gray-500 hover:text-purple-600 transition-colors flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full mx-auto"
        >
          <div className="mb-10 lg:hidden flex justify-center">
             <AuraLogo size="md" />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">Log in</h1>
          <p className="text-gray-500 mb-8">Enter your details to access your dashboard.</p>

          <Button variant="outline" className="w-full h-12 rounded-xl mb-4 font-medium text-gray-700 bg-white hover:bg-gray-50 border-gray-200">
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </Button>

          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">Or log in with email</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                {error}
              </div>
            )}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com" 
                  className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <a href="#" className="text-sm text-purple-600 hover:text-purple-700 font-medium">Forgot password?</a>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                required
              />
            </div>

            <div className="flex items-center gap-2 py-2">
              <input type="checkbox" id="remember" className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4 border-gray-300" />
              <label htmlFor="remember" className="text-sm text-gray-600">Remember me for 30 days</label>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-medium shadow-lg shadow-purple-500/25 border-0">
              {isLoading ? "Logging in..." : "Log in"}
            </Button>
          </form>

          <p className="mt-8 text-center text-gray-600 text-sm">
            Don't have an account? <Link href="/signup" className="text-purple-600 font-medium hover:text-purple-700">Sign up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
