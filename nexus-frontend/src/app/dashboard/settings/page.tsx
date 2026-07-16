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
        <ToggleRight className="w-10 h-10 text-purple-600 cursor-pointer" />
      ) : (
        <ToggleLeft className="w-10 h-10 text-gray-300 cursor-pointer" />
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
    <div className="flex items-center justify-between py-5 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 text-sm">{title}</h4>
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Settings</h1>
        <p className="text-gray-500">Customize your Aura AI experience.</p>
      </motion.div>

      {/* Notifications */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl border border-white/60 p-6"
      >
        <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Bell className="w-5 h-5 text-purple-600" />
          Notifications
        </h3>
        <p className="text-sm text-gray-500 mb-4">Choose how you want to be notified.</p>

        <SettingRow 
          icon={<Bell className="w-5 h-5 text-blue-600" />}
          title="Email Notifications"
          description="Receive updates about your AI agents via email"
        >
          <Toggle enabled={settings.emailNotifications as boolean} onToggle={() => toggleSetting('emailNotifications')} />
        </SettingRow>

        <SettingRow 
          icon={<Volume2 className="w-5 h-5 text-orange-600" />}
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
        className="glass-card rounded-2xl border border-white/60 p-6"
      >
        <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Palette className="w-5 h-5 text-pink-600" />
          Appearance
        </h3>
        <p className="text-sm text-gray-500 mb-4">Control the look and feel of your workspace.</p>

        <SettingRow 
          icon={<Moon className="w-5 h-5 text-indigo-600" />}
          title="Dark Mode"
          description="Switch to a dark theme for comfortable nighttime use"
        >
          <Toggle enabled={settings.darkMode as boolean} onToggle={() => toggleSetting('darkMode')} />
        </SettingRow>

        <SettingRow 
          icon={<Globe className="w-5 h-5 text-green-600" />}
          title="Language"
          description="Choose your preferred display language"
        >
          <select 
            value={settings.language}
            onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
            className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 outline-none focus:border-purple-400 cursor-pointer"
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
        className="glass-card rounded-2xl border border-white/60 p-6"
      >
        <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Monitor className="w-5 h-5 text-cyan-600" />
          AI Preferences
        </h3>
        <p className="text-sm text-gray-500 mb-4">Configure how AI agents behave.</p>

        <SettingRow 
          icon={<Eye className="w-5 h-5 text-purple-600" />}
          title="Auto-Save Deliverables"
          description="Automatically save agent outputs to your workspace"
        >
          <Toggle enabled={settings.autoSave as boolean} onToggle={() => toggleSetting('autoSave')} />
        </SettingRow>

        <SettingRow 
          icon={<Monitor className="w-5 h-5 text-cyan-600" />}
          title="AI Response Speed"
          description="Choose between faster or more detailed responses"
        >
          <select 
            value={settings.aiModel}
            onChange={(e) => setSettings(prev => ({ ...prev, aiModel: e.target.value }))}
            className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 outline-none focus:border-purple-400 cursor-pointer"
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
        className="glass-card rounded-2xl border border-white/60 p-6"
      >
        <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-600" />
          Security & Privacy
        </h3>
        <p className="text-sm text-gray-500 mb-4">Protect your account and data.</p>

        <SettingRow 
          icon={<Lock className="w-5 h-5 text-red-600" />}
          title="Two-Factor Authentication"
          description="Add an extra layer of security to your account"
        >
          <Toggle enabled={settings.twoFactor as boolean} onToggle={() => toggleSetting('twoFactor')} />
        </SettingRow>

        <SettingRow 
          icon={<Eye className="w-5 h-5 text-gray-600" />}
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
          className="rounded-xl px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-medium shadow-lg shadow-purple-500/20"
        >
          {saved ? "✓ Saved!" : "Save Settings"}
        </Button>
      </motion.div>
    </div>
  );
}
