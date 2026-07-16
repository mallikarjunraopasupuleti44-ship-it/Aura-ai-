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
    
    // Estimate member since from token
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
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Profile</h1>
        <p className="text-gray-500">Manage your personal information and account.</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl border border-white/60 overflow-hidden"
      >
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] opacity-40" />
        </div>

        {/* Avatar + Info */}
        <div className="px-8 pb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 -mt-12">
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg border-4 border-white">
                {initials}
              </div>
              <div className="absolute inset-0 rounded-2xl bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer border-4 border-transparent">
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
                    className="text-2xl font-bold text-gray-900 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                    autoFocus
                  />
                  <button onClick={handleSaveName} className="p-2 bg-green-100 rounded-lg text-green-600 hover:bg-green-200 transition-colors">
                    <Save className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-gray-900">{userName}</h2>
                  <button onClick={() => setIsEditing(true)} className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              )}
              <p className="text-gray-500 text-sm mt-0.5">CEO & Founder</p>
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
        <div className="glass-card rounded-2xl border border-white/60 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Email Address</p>
              <p className="text-gray-900 font-medium">{userEmail || "Not set"}</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl border border-white/60 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Member Since</p>
              <p className="text-gray-900 font-medium">{memberSince}</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl border border-white/60 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Account Status</p>
              <p className="text-green-600 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full" /> Active
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl border border-white/60 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <User className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Plan</p>
              <p className="text-gray-900 font-medium">Free Tier</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-2xl border border-red-100 p-6"
      >
        <h3 className="text-lg font-bold text-gray-900 mb-4">Account Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={handleLogout}
            variant="outline" 
            className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 font-medium flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
