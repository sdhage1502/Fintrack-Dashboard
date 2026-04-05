"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import { User, Mail, Shield, Calendar, Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [name, setName] = useState(user?.name || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    setIsSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid), { name: name.trim() });
      setUser({ ...user, name: name.trim() });
      toast.success("Profile updated!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold font-manrope tracking-tight mb-2">Profile</h1>
        <p className="text-on-surface-variant font-medium tracking-tight mb-10">Manage your personal information.</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-[32px] p-10"
      >
        {/* Avatar */}
        <div className="flex items-center gap-6 mb-10 pb-10 border-b border-outline/10">
          <div className="w-20 h-20 rounded-2xl bg-luminous-gradient flex items-center justify-center">
            <span className="text-3xl font-bold font-manrope text-background">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-manrope">{user.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-2 h-2 rounded-full ${user.role === "admin" ? "bg-primary" : "bg-secondary"}`} />
              <span className="text-sm font-bold uppercase tracking-wider text-on-surface-variant/60">
                {user.role === "admin" ? "Administrator" : "Member"}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Editable Name */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant/60 mb-3">
              <User className="w-4 h-4" />
              Full Name
            </label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface-highest border border-outline rounded-2xl p-4 text-lg font-manrope font-semibold focus:ring-2 focus:ring-primary/20 focus:border-primary/40 outline-none transition-all"
            />
          </div>

          {/* Read-only Email */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant/60 mb-3">
              <Mail className="w-4 h-4" />
              Email Address
            </label>
            <div className="w-full bg-surface-lowest border border-outline/5 rounded-2xl p-4 text-lg font-manrope text-on-surface-variant">
              {user.email}
            </div>
          </div>

          {/* Read-only Role */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant/60 mb-3">
              <Shield className="w-4 h-4" />
              Role
            </label>
            <div className="w-full bg-surface-lowest border border-outline/5 rounded-2xl p-4 text-lg font-manrope text-on-surface-variant capitalize">
              {user.role}
              <span className="text-xs ml-3 opacity-50">(Cannot be changed from here)</span>
            </div>
          </div>

          {/* Member Since */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant/60 mb-3">
              <Calendar className="w-4 h-4" />
              Member Since
            </label>
            <div className="w-full bg-surface-lowest border border-outline/5 rounded-2xl p-4 text-lg font-manrope text-on-surface-variant" suppressHydrationWarning>
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : "Unknown"}
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving || name === user.name}
          className="mt-10 w-full py-4 rounded-xl bg-luminous-gradient text-background font-bold font-manrope tracking-wide glow-emerald hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </motion.div>
    </div>
  );
}
