"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

import { useTransactionStore } from "@/store/transactionStore";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-highest/90 backdrop-blur-xl border border-outline p-4 rounded-2xl shadow-2xl">
        <p className="text-xs font-bold font-manrope text-on-surface-variant uppercase tracking-widest mb-1.5">{label}</p>
        <p className="text-2xl font-bold font-manrope text-primary">${payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export const FinChart = () => {
  const { transactions } = useTransactionStore();
  
  const expenseData = transactions
    .filter(t => t.type === 'Expense')
    .reduce((acc: Record<string, { originalDate: Date, amount: number }>, curr) => {
      const dateObj = new Date(curr.date);
      const shortDate = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;
      if (!acc[shortDate]) acc[shortDate] = { originalDate: dateObj, amount: 0 };
      acc[shortDate].amount += curr.amount;
      return acc;
    }, {} as Record<string, { originalDate: Date, amount: number }>);

  const chartData = Object.values(expenseData)
    .sort((a, b) => a.originalDate.getTime() - b.originalDate.getTime())
    .map(item => ({
      name: item.originalDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      value: item.amount
    }));

  if (chartData.length === 0) {
    chartData.push({ name: "Today", value: 0 }); // Fallback
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-4 sm:p-6 md:p-8 rounded-3xl md:rounded-[32px] h-[300px] sm:h-[400px] w-full mt-8 group"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold font-manrope tracking-tight text-on-surface">Spending Trends</h3>
          <p className="text-sm text-on-surface-variant/60 font-medium">Monthly expenditure analysis</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary glow-emerald" />
            <span className="text-xs font-bold text-on-surface-variant tracking-wider uppercase">Expenses</span>
          </div>
        </div>
      </div>

      <div className="h-[200px] sm:h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00ff94" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00ff94" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#b9cbbb", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em" }} 
              dy={15}
            />
            <YAxis 
              hide
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#00ff94"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#colorValue)"
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
