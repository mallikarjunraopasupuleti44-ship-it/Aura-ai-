"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  User, Mail, Calendar, Shield, LogOut, Edit3, Save, Camera
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [memberSince, setMemberSince] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("aura_user_name") || "User";
    const email = localStorage.getItem("aura_user_email") || "";
    setUserName(name);
    setUserEmail(email);
    setEditName(name);
    
    const token = localStorage.getItem("aura_token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.iat) {
          setMemberSince(new Date(payload.iat * 1000).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
        }
      } catch {}
    }
    if (!memberSince) setMemberSince("July 2026");
  }, []);

  const handleSaveName = () => {
    localStorage.setItem("aura_user_name", editName);
    setUserName(editName);
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("aura_token");
    localStorage.removeItem("aura_user_name");
    localStorage.removeItem("aura_user_email");
    router.push("/login");
  };

  const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'U';

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-[#0A121A] mb-1 tracking-tight">Profile</h1>
        <p className="text-[#0A121A]/60 font-medium">Manage your personal information and account.</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/40 backdrop-blur-3xl rounded-[24px] border border-white/60 overflow-hidden shadow-[0_20px_40px_rgba(79,124,255,0.05)]"
      >
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-[#4F7CFF] via-[#7B5CFF] to-[#2FD9FF] relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] opacity-40 mix-blend-overlay" />
        </div>

        {/* Avatar + Info */}
        <div className="px-8 pb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 -mt-12">
            <div className="relative group">
              <div className="w-24 h-24 rounded-[20px] bg-gradient-to-br from-[#7B5CFF] to-[#4F7CFF] flex items-center justify-center text-white text-3xl font-bold shadow-xl border-4 border-white/60 backdrop-blur-md">
                {initials}
              </div>
              <div className="absolute inset-0 rounded-[20px] bg-[#0A121A]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer border-4 border-transparent backdrop-blur-sm">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="flex-1 pt-2">
              {isEditing ? (
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="text-2xl font-bold text-[#0A121A] bg-white/60 border border-white/60 rounded-xl px-4 py-1.5 outline-none focus:border-[#4F7CFF] focus:ring-4 focus:ring-[#4F7CFF]/10 transition-all shadow-sm"
                    autoFocus
                  />
                  <button onClick={handleSaveName} className="p-2.5 bg-[#42D392]/10 rounded-xl text-[#42D392] hover:bg-[#42D392]/20 transition-colors shadow-sm">
                    <Save className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-[#0A121A] tracking-tight">{userName}</h2>
                  <button onClick={() => setIsEditing(true)} className="p-2 text-[#0A121A]/40 hover:text-[#4F7CFF] hover:bg-[#4F7CFF]/10 rounded-xl transition-colors">
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              )}
              <p className="text-[#0A121A]/50 text-sm mt-1 font-medium">CEO & Founder</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Details Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="bg-white/40 backdrop-blur-3xl rounded-[24px] border border-white/60 p-6 shadow-sm hover:shadow-[0_10px_30px_rgba(79,124,255,0.08)] transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[16px] bg-[#4F7CFF]/10 flex items-center justify-center border border-[#4F7CFF]/20">
              <Mail className="w-5 h-5 text-[#4F7CFF]" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#0A121A]/40 uppercase tracking-widest mb-1">Email Address</p>
              <p className="text-[#0A121A] font-bold">{userEmail || "Not set"}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/40 backdrop-blur-3xl rounded-[24px] border border-white/60 p-6 shadow-sm hover:shadow-[0_10px_30px_rgba(123,92,255,0.08)] transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[16px] bg-[#7B5CFF]/10 flex items-center justify-center border border-[#7B5CFF]/20">
              <Calendar className="w-5 h-5 text-[#7B5CFF]" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#0A121A]/40 uppercase tracking-widest mb-1">Member Since</p>
              <p className="text-[#0A121A] font-bold">{memberSince}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/40 backdrop-blur-3xl rounded-[24px] border border-white/60 p-6 shadow-sm hover:shadow-[0_10px_30px_rgba(66,211,146,0.08)] transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[16px] bg-[#42D392]/10 flex items-center justify-center border border-[#42D392]/20">
              <Shield className="w-5 h-5 text-[#42D392]" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#0A121A]/40 uppercase tracking-widest mb-1">Account Status</p>
              <p className="text-[#42D392] font-bold flex items-center gap-2">
                <span className="w-2 h-2 bg-[#42D392] rounded-full shadow-[0_0_8px_rgba(66,211,146,0.6)]" /> Active
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/40 backdrop-blur-3xl rounded-[24px] border border-white/60 p-6 shadow-sm hover:shadow-[0_10px_30px_rgba(47,217,255,0.08)] transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[16px] bg-[#2FD9FF]/10 flex items-center justify-center border border-[#2FD9FF]/20">
              <User className="w-5 h-5 text-[#2FD9FF]" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#0A121A]/40 uppercase tracking-widest mb-1">Plan</p>
              <p className="text-[#0A121A] font-bold">Free Tier</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/40 backdrop-blur-3xl rounded-[24px] border border-[#FF6B81]/30 p-6 shadow-sm"
      >
        <h3 className="text-xl font-bold text-[#0A121A] mb-4">Account Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={handleLogout}
            variant="outline" 
            className="rounded-xl h-12 border-[#FF6B81]/40 text-[#FF6B81] hover:bg-[#FF6B81]/10 font-bold flex items-center gap-2 bg-white/60 backdrop-blur-sm shadow-sm transition-all"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
