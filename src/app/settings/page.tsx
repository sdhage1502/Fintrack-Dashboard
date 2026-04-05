"use client";

import React from "react";
import { motion } from "framer-motion";
import { Settings, Moon, Bell, Shield, Globe } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuthStore } from "@/store/authStore";

export default function SettingsPage() {
  const { user } = useAuthStore();

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold font-manrope tracking-tight mb-2 flex items-center gap-3">
          <Settings className="w-10 h-10 text-primary" />
          Settings
        </h1>
        <p className="text-on-surface-variant font-medium tracking-tight mb-10">
          Customize your FinTrack experience.
        </p>
      </motion.div>

      <div className="space-y-6">
        {/* Appearance */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card rounded-3xl p-8"
        >
          <h2 className="text-lg font-bold font-manrope mb-6 flex items-center gap-2">
            <Moon className="w-5 h-5 text-primary" />
            Appearance
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold font-manrope text-sm">Theme</p>
              <p className="text-xs text-on-surface-variant/60 mt-1">Switch between light and dark mode</p>
            </div>
            <ThemeToggle />
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="glass-card rounded-3xl p-8"
        >
          <h2 className="text-lg font-bold font-manrope mb-6 flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold font-manrope text-sm">Transaction Alerts</p>
                <p className="text-xs text-on-surface-variant/60 mt-1">Get notified when a transaction is added</p>
              </div>
              <div className="w-12 h-7 bg-primary rounded-full relative cursor-pointer">
                <div className="w-5 h-5 bg-white rounded-full absolute top-1 right-1 shadow-sm" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold font-manrope text-sm">Budget Warnings</p>
                <p className="text-xs text-on-surface-variant/60 mt-1">Alert when approaching budget limits</p>
              </div>
              <div className="w-12 h-7 bg-surface-highest rounded-full relative cursor-pointer border border-outline">
                <div className="w-5 h-5 bg-on-surface-variant/40 rounded-full absolute top-1 left-1 shadow-sm" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Security */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass-card rounded-3xl p-8"
        >
          <h2 className="text-lg font-bold font-manrope mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Security
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold font-manrope text-sm">Account Type</p>
                <p className="text-xs text-on-surface-variant/60 mt-1">Your current access level</p>
              </div>
              <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg ${
                user?.role === "admin" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
              }`}>
                {user?.role || "user"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold font-manrope text-sm">Two-Factor Authentication</p>
                <p className="text-xs text-on-surface-variant/60 mt-1">Not available yet</p>
              </div>
              <span className="text-xs font-bold bg-surface-highest text-on-surface-variant/60 px-3 py-1.5 rounded-lg uppercase tracking-wider border border-outline">Coming Soon</span>
            </div>
          </div>
        </motion.div>

        {/* Data */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="glass-card rounded-3xl p-8"
        >
          <h2 className="text-lg font-bold font-manrope mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            Data & Privacy
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold font-manrope text-sm">Data Storage</p>
              <p className="text-xs text-on-surface-variant/60 mt-1">All data stored securely in Firebase</p>
            </div>
            <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1.5 rounded-lg uppercase tracking-wider">Encrypted</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
