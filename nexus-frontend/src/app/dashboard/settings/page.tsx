"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Bell, Moon, Sun, Globe, Lock, Palette, Volume2, 
  ChevronRight, ToggleLeft, ToggleRight, Monitor, Shield, Eye
} from "lucide-react";

interface ToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

function Toggle({ enabled, onToggle }: ToggleProps) {
  return (
    <button onClick={onToggle} className="relative">
      {enabled ? (
        <ToggleRight className="w-10 h-10 text-[#4F7CFF] cursor-pointer drop-shadow-sm transition-colors" />
      ) : (
        <ToggleLeft className="w-10 h-10 text-[#0A121A]/20 cursor-pointer transition-colors hover:text-[#0A121A]/30" />
      )}
    </button>
  );
}

interface SettingRowProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}

function SettingRow({ icon, title, description, children }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between py-6 border-b border-[#0A121A]/5 last:border-0 group">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-[16px] bg-white/60 border border-white/60 flex items-center justify-center shrink-0 shadow-sm group-hover:bg-white group-hover:border-[#4F7CFF]/20 group-hover:shadow-[0_4px_12px_rgba(79,124,255,0.1)] transition-all">
          {icon}
        </div>
        <div>
          <h4 className="font-bold text-[#0A121A] text-sm group-hover:text-[#4F7CFF] transition-colors">{title}</h4>
          <p className="text-sm text-[#0A121A]/50 mt-1 font-medium">{description}</p>
        </div>
      </div>
      <div className="ml-4 shrink-0">
        {children}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    darkMode: false,
    autoSave: true,
    twoFactor: false,
    publicProfile: false,
    soundEffects: true,
    language: "English",
    aiModel: "Fast (Default)",
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("aura_settings");
    if (stored) {
      try {
        setSettings(JSON.parse(stored));
      } catch {}
    }
  }, []);

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem("aura_settings", JSON.stringify(updated));
      return updated;
    });
  };

  const handleSave = () => {
    localStorage.setItem("aura_settings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-[#0A121A] mb-1 tracking-tight">Settings</h1>
        <p className="text-[#0A121A]/60 font-medium">Customize your Aura AI experience.</p>
      </motion.div>

      {/* Notifications */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/40 backdrop-blur-3xl rounded-[24px] border border-white/60 p-8 shadow-[0_20px_40px_rgba(79,124,255,0.05)]"
      >
        <h3 className="text-xl font-bold text-[#0A121A] mb-2 flex items-center gap-3">
          <Bell className="w-6 h-6 text-[#4F7CFF]" />
          Notifications
        </h3>
        <p className="text-sm font-medium text-[#0A121A]/50 mb-6">Choose how you want to be notified.</p>

        <SettingRow 
          icon={<Bell className="w-5 h-5 text-[#4F7CFF]" />}
          title="Email Notifications"
          description="Receive updates about your AI agents via email"
        >
          <Toggle enabled={settings.emailNotifications as boolean} onToggle={() => toggleSetting('emailNotifications')} />
        </SettingRow>

        <SettingRow 
          icon={<Volume2 className="w-5 h-5 text-[#7B5CFF]" />}
          title="Sound Effects"
          description="Play sounds when agents complete tasks"
        >
          <Toggle enabled={settings.soundEffects as boolean} onToggle={() => toggleSetting('soundEffects')} />
        </SettingRow>
      </motion.div>

      {/* Appearance */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white/40 backdrop-blur-3xl rounded-[24px] border border-white/60 p-8 shadow-[0_20px_40px_rgba(79,124,255,0.05)]"
      >
        <h3 className="text-xl font-bold text-[#0A121A] mb-2 flex items-center gap-3">
          <Palette className="w-6 h-6 text-[#7B5CFF]" />
          Appearance
        </h3>
        <p className="text-sm font-medium text-[#0A121A]/50 mb-6">Control the look and feel of your workspace.</p>

        <SettingRow 
          icon={<Moon className="w-5 h-5 text-[#4F7CFF]" />}
          title="Dark Mode"
          description="Switch to a dark theme for comfortable nighttime use"
        >
          <Toggle enabled={settings.darkMode as boolean} onToggle={() => toggleSetting('darkMode')} />
        </SettingRow>

        <SettingRow 
          icon={<Globe className="w-5 h-5 text-[#2FD9FF]" />}
          title="Language"
          description="Choose your preferred display language"
        >
          <select 
            value={settings.language}
            onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
            className="text-sm bg-white/60 border border-white/60 rounded-xl px-4 py-2 font-bold text-[#0A121A] outline-none focus:border-[#4F7CFF] focus:ring-4 focus:ring-[#4F7CFF]/10 cursor-pointer shadow-sm"
          >
            <option>English</option>
            <option>Hindi</option>
            <option>Telugu</option>
            <option>Spanish</option>
          </select>
        </SettingRow>
      </motion.div>

      {/* AI Preferences */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/40 backdrop-blur-3xl rounded-[24px] border border-white/60 p-8 shadow-[0_20px_40px_rgba(79,124,255,0.05)]"
      >
        <h3 className="text-xl font-bold text-[#0A121A] mb-2 flex items-center gap-3">
          <Monitor className="w-6 h-6 text-[#2FD9FF]" />
          AI Preferences
        </h3>
        <p className="text-sm font-medium text-[#0A121A]/50 mb-6">Configure how AI agents behave.</p>

        <SettingRow 
          icon={<Eye className="w-5 h-5 text-[#4F7CFF]" />}
          title="Auto-Save Deliverables"
          description="Automatically save agent outputs to your workspace"
        >
          <Toggle enabled={settings.autoSave as boolean} onToggle={() => toggleSetting('autoSave')} />
        </SettingRow>

        <SettingRow 
          icon={<Monitor className="w-5 h-5 text-[#2FD9FF]" />}
          title="AI Response Speed"
          description="Choose between faster or more detailed responses"
        >
          <select 
            value={settings.aiModel}
            onChange={(e) => setSettings(prev => ({ ...prev, aiModel: e.target.value }))}
            className="text-sm bg-white/60 border border-white/60 rounded-xl px-4 py-2 font-bold text-[#0A121A] outline-none focus:border-[#4F7CFF] focus:ring-4 focus:ring-[#4F7CFF]/10 cursor-pointer shadow-sm"
          >
            <option>Fast (Default)</option>
            <option>Balanced</option>
            <option>Detailed</option>
          </select>
        </SettingRow>
      </motion.div>

      {/* Security */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white/40 backdrop-blur-3xl rounded-[24px] border border-white/60 p-8 shadow-[0_20px_40px_rgba(79,124,255,0.05)]"
      >
        <h3 className="text-xl font-bold text-[#0A121A] mb-2 flex items-center gap-3">
          <Shield className="w-6 h-6 text-[#42D392]" />
          Security & Privacy
        </h3>
        <p className="text-sm font-medium text-[#0A121A]/50 mb-6">Protect your account and data.</p>

        <SettingRow 
          icon={<Lock className="w-5 h-5 text-[#FF6B81]" />}
          title="Two-Factor Authentication"
          description="Add an extra layer of security to your account"
        >
          <Toggle enabled={settings.twoFactor as boolean} onToggle={() => toggleSetting('twoFactor')} />
        </SettingRow>

        <SettingRow 
          icon={<Eye className="w-5 h-5 text-[#7B5CFF]" />}
          title="Public Profile"
          description="Allow others to see your profile and business"
        >
          <Toggle enabled={settings.publicProfile as boolean} onToggle={() => toggleSetting('publicProfile')} />
        </SettingRow>
      </motion.div>

      {/* Save Button */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-end"
      >
        <Button 
          onClick={handleSave}
          className="rounded-xl h-14 px-10 bg-gradient-to-r from-[#4F7CFF] to-[#2FD9FF] hover:opacity-90 text-white font-bold text-lg shadow-[0_10px_30px_rgba(79,124,255,0.3)] transition-all transform hover:-translate-y-0.5 border-0"
        >
          {saved ? "✓ Saved!" : "Save Settings"}
        </Button>
      </motion.div>
    </div>
  );
}
