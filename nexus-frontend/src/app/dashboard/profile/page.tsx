"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  User, Mail, Calendar, Shield, LogOut, Edit3, Save, Camera, Building,
  Briefcase, Globe, Users, Target, Rocket, PieChart, Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [editName, setEditName] = useState("");
  
  // Business Profile State
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState({
    businessName: "",
    industry: "",
    country: "",
    businessType: "",
    employees: "",
    products: "",
    services: "",
    targetAudience: "",
    mission: "",
    vision: "",
    revenueModel: "",
    website: "",
    competitors: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session?.user) {
      setUserName(session.user.name || "User");
      setUserEmail(session.user.email || "");
      setEditName(session.user.name || "User");
      fetchProfile();
    }
  }, [session, status, router]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        if (data.profile) {
          setProfile({
            ...profile,
            ...data.profile,
          });
        }
      }
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  };

  const handleSaveName = () => {
    // Ideally this would save to the User table, but for now just update local state
    setUserName(editName);
    setIsEditingUser(false);
  };

  const handleSaveBusinessProfile = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (!res.ok) throw new Error("Failed to save profile");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    localStorage.removeItem("aura_token");
    router.push("/login");
  };

  const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'U';

  if (status === "loading") {
    return <div className="p-8 text-center text-[#0A121A]/50">Loading profile...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-[#0A121A] mb-1 tracking-tight">Profile</h1>
        <p className="text-[#0A121A]/60 font-medium">Manage your personal and business information.</p>
      </motion.div>

      {/* Personal Profile Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/40 backdrop-blur-3xl rounded-[24px] border border-white/60 overflow-hidden shadow-[0_20px_40px_rgba(79,124,255,0.05)]"
      >
        <div className="h-32 bg-gradient-to-r from-[#4F7CFF] via-[#7B5CFF] to-[#2FD9FF] relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] opacity-40 mix-blend-overlay" />
        </div>

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
              {isEditingUser ? (
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
                  <button onClick={() => setIsEditingUser(true)} className="p-2 text-[#0A121A]/40 hover:text-[#4F7CFF] hover:bg-[#4F7CFF]/10 rounded-xl transition-colors">
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              )}
              <p className="text-[#0A121A]/50 text-sm mt-1 font-medium">{profile.businessName ? `CEO, ${profile.businessName}` : "Founder"}</p>
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
              <p className="text-[#0A121A] font-bold">{userEmail}</p>
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
      </motion.div>

      {/* Business Profile Editor */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white/40 backdrop-blur-3xl rounded-[24px] border border-white/60 p-8 shadow-[0_20px_40px_rgba(79,124,255,0.05)] space-y-6"
      >
        <div>
          <h3 className="text-xl font-bold text-[#0A121A] mb-1 flex items-center gap-3">
            <Building className="w-6 h-6 text-[#7B5CFF]" />
            Business Profile
          </h3>
          <p className="text-sm font-medium text-[#0A121A]/50">This information will be used by all AI agents to contextually understand your company.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { key: "businessName", label: "Business Name", icon: Building },
            { key: "industry", label: "Industry", icon: Briefcase },
            { key: "country", label: "Country", icon: Globe },
            { key: "employees", label: "Number of Employees", icon: Users },
            { key: "targetAudience", label: "Target Audience", icon: Target },
            { key: "revenueModel", label: "Revenue Model", icon: PieChart },
          ].map((field) => (
            <div key={field.key} className="space-y-1.5">
              <label className="text-sm font-bold text-[#0A121A]">{field.label}</label>
              <div className="relative">
                <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0A121A]/40" />
                <input 
                  type="text" 
                  value={(profile as any)[field.key] || ""}
                  onChange={(e) => setProfile({ ...profile, [field.key]: e.target.value })}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-white/60 bg-white/40 backdrop-blur-sm focus:bg-white focus:border-[#4F7CFF] focus:ring-4 focus:ring-[#4F7CFF]/10 outline-none transition-all placeholder:text-[#0A121A]/30 text-[#0A121A] text-sm font-medium"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4 pt-2">
          {[
            { key: "products", label: "Products & Services", placeholder: "What do you sell?", rows: 2 },
            { key: "mission", label: "Company Mission", placeholder: "What is your mission statement?", rows: 2 },
            { key: "competitors", label: "Key Competitors", placeholder: "Who are your biggest competitors?", rows: 2 },
          ].map((field) => (
            <div key={field.key} className="space-y-1.5">
              <label className="text-sm font-bold text-[#0A121A]">{field.label}</label>
              <textarea 
                value={(profile as any)[field.key] || ""}
                onChange={(e) => setProfile({ ...profile, [field.key]: e.target.value })}
                placeholder={field.placeholder}
                rows={field.rows}
                className="w-full p-4 rounded-xl border border-white/60 bg-white/40 backdrop-blur-sm focus:bg-white focus:border-[#4F7CFF] focus:ring-4 focus:ring-[#4F7CFF]/10 outline-none transition-all placeholder:text-[#0A121A]/30 text-[#0A121A] text-sm font-medium resize-none"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <Button 
            onClick={handleSaveBusinessProfile}
            disabled={isSaving}
            className="rounded-xl h-12 px-8 bg-gradient-to-r from-[#4F7CFF] to-[#2FD9FF] hover:opacity-90 text-white font-bold shadow-[0_10px_30px_rgba(79,124,255,0.3)] transition-all"
          >
            {isSaving ? "Saving..." : "Save Business Profile"}
          </Button>
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
