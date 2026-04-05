"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Wallet } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps {
  title: string;
  amount: string;
  trend?: string;
  isPositive?: boolean;
  icon: React.ElementType;
  isFeatured?: boolean;
}

export const DashboardCard = ({ title, amount, trend, isPositive, icon: Icon, isFeatured }: CardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={cn(
        "p-6 rounded-[24px] glass-card relative overflow-hidden group h-full flex flex-col justify-between",
        isFeatured ? "bg-luminous-gradient border-none" : ""
      )}
    >
      {/* Decorative Glow */}
      <div className={cn(
        "absolute -right-4 -top-4 w-24 h-24 blur-3xl opacity-20 transition-opacity group-hover:opacity-40",
        isFeatured ? "bg-white" : "bg-primary"
      )} />

      <div className="flex items-center justify-between mb-6">
        <div className={cn(
          "p-3 rounded-2xl",
          isFeatured ? "bg-white/20 text-white" : "bg-surface-highest text-primary"
        )}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold font-manrope tracking-wider uppercase",
            isFeatured 
              ? "bg-white/20 text-white" 
              : isPositive 
                ? "bg-primary/10 text-primary" 
                : "bg-rose-500/10 text-rose-500"
          )}>
            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {trend}%
          </div>
        )}
      </div>

      <div>
        <p className={cn(
          "text-xs font-bold font-manrope uppercase tracking-widest mb-1.5 opacity-60",
          isFeatured ? "text-white" : "text-on-surface-variant"
        )}>
          {title}
        </p>
        <div className="flex items-baseline gap-2">
          <h3 className={cn(
            "text-4xl font-bold font-manrope tracking-tight leading-none",
            isFeatured ? "text-white" : "text-on-surface"
          )}>
            {amount}
          </h3>
          <span className={cn(
            "text-sm opacity-40 font-medium",
            isFeatured ? "text-white" : "text-on-surface"
          )}>USD</span>
        </div>
      </div>
      
      {/* Ghost Border on Hover for non-featured */}
      {!isFeatured && (
        <div className="absolute inset-0 border border-primary/0 rounded-[24px] transition-colors group-hover:border-primary/20 pointer-events-none" />
      )}
    </motion.div>
  );
};
