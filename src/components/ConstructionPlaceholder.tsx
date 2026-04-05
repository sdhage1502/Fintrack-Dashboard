"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface ConstructionPlaceholderProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const ConstructionPlaceholder = ({ title, description, icon: Icon }: ConstructionPlaceholderProps) => {
  return (
    <div className="max-w-6xl mx-auto pb-20 flex flex-col items-center justify-center min-h-[70vh]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-card p-12 rounded-[40px] border-primary/20 bg-surface-high relative overflow-hidden group text-center max-w-2xl w-full"
      >
        {/* Decorative Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(0,255,148,0.1)] transition-transform group-hover:scale-110 duration-500">
          <Icon className="w-10 h-10 text-primary" />
        </div>
        
        <h1 className="text-4xl font-bold font-manrope tracking-tight text-on-surface mb-4">
          {title}
        </h1>
        <p className="text-on-surface-variant font-medium tracking-wide text-lg max-w-md mx-auto leading-relaxed">
          {description}
        </p>

        <div className="mt-12 flex items-center justify-center gap-3 opacity-50">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse delay-150" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse delay-300" />
          <span className="text-xs font-bold font-manrope uppercase tracking-[0.2em] ml-2 text-primary">Coming Soon</span>
        </div>
      </motion.div>
    </div>
  );
};
