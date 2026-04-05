"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useTransactionStore } from "@/store/transactionStore";
import { useAuthStore } from "@/store/authStore";
import { 
  PieChart as PieChartIcon, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Target,
  Loader2,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const COLORS = ['#00ff94', '#0068ed', '#845ef7', '#ff6b6b', '#ffa94d', '#20c997', '#339af0', '#f06595', '#a9e34b', '#ffd43b'];

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-highest/90 backdrop-blur-xl border border-outline p-3 rounded-xl shadow-2xl">
        <p className="text-xs font-bold text-on-surface-variant">{payload[0].name}</p>
        <p className="text-lg font-bold text-primary">${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default function InsightsPage() {
  const { transactions, isLoading } = useTransactionStore();
  const { user } = useAuthStore();

  const insights = useMemo(() => {
    const income = transactions.filter(t => t.type === "Income").reduce((s, t) => s + t.amount, 0);
    const expense = transactions.filter(t => t.type === "Expense").reduce((s, t) => s + t.amount, 0);
    const savingsRate = income > 0 ? ((income - expense) / income * 100) : 0;

    // Category breakdown for pie chart
    const byCat = transactions
      .filter(t => t.type === "Expense")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    const pieData = Object.entries(byCat)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Monthly breakdown for bar chart
    const byMonth = transactions.reduce((acc, t) => {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!acc[key]) acc[key] = { income: 0, expense: 0 };
      if (t.type === "Income") acc[key].income += t.amount;
      else acc[key].expense += t.amount;
      return acc;
    }, {} as Record<string, { income: number; expense: number }>);

    const barData = Object.entries(byMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6) // Last 6 months
      .map(([month, data]) => ({
        name: new Date(month + '-01').toLocaleDateString(undefined, { month: 'short' }),
        Income: data.income,
        Expenses: data.expense,
      }));

    // Top categories
    const topCategories = pieData.slice(0, 5);
    const totalExpense = expense || 1; // prevent division by zero

    // Average transaction
    const avgTransaction = transactions.length > 0 ? (income + expense) / transactions.length : 0;

    return { income, expense, savingsRate, pieData, barData, topCategories, totalExpense, avgTransaction };
  }, [transactions]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-on-surface-variant font-medium text-sm">Analyzing data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-4xl font-bold font-manrope tracking-tight mb-2 flex items-center gap-3">
          <PieChartIcon className="w-10 h-10 text-primary" />
          Insights
        </h1>
        <p className="text-on-surface-variant font-medium tracking-tight">
          {user?.role === "admin" 
            ? "Platform-wide financial analytics and trends."
            : "Your personal financial analytics and trends."}
        </p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="glass-card p-6 rounded-3xl"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-primary/10"><TrendingUp className="w-5 h-5 text-primary" /></div>
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant/60">Total Income</span>
          </div>
          <p className="text-3xl font-bold font-manrope text-primary">${insights.income.toLocaleString()}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card p-6 rounded-3xl"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-rose-500/10"><TrendingDown className="w-5 h-5 text-rose-500" /></div>
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant/60">Total Expenses</span>
          </div>
          <p className="text-3xl font-bold font-manrope text-rose-500">${insights.expense.toLocaleString()}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="glass-card p-6 rounded-3xl"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-secondary/10"><Target className="w-5 h-5 text-secondary" /></div>
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant/60">Savings Rate</span>
          </div>
          <p className="text-3xl font-bold font-manrope">{insights.savingsRate.toFixed(1)}%</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass-card p-6 rounded-3xl"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-accent-violet/10"><DollarSign className="w-5 h-5 text-accent-violet" /></div>
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant/60">Avg Transaction</span>
          </div>
          <p className="text-3xl font-bold font-manrope">${insights.avgTransaction.toFixed(0)}</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Pie Chart — Expense by Category */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="col-span-12 lg:col-span-5 glass-card p-8 rounded-[32px]"
        >
          <h3 className="text-xl font-bold font-manrope mb-6">Spending by Category</h3>
          {insights.pieData.length === 0 ? (
            <div className="text-center py-16 text-on-surface-variant">
              <DollarSign className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p className="font-manrope font-bold">No expense data yet</p>
            </div>
          ) : (
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={insights.pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={60}
                    dataKey="value"
                    stroke="none"
                    paddingAngle={3}
                  >
                    {insights.pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
          {/* Legend */}
          <div className="mt-4 space-y-2">
            {insights.topCategories.map((cat, i) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-sm font-medium">{cat.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">${cat.value.toLocaleString()}</span>
                  <span className="text-xs text-on-surface-variant/50">
                    {((cat.value / insights.totalExpense) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bar Chart — Monthly Income vs Expense */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="col-span-12 lg:col-span-7 glass-card p-8 rounded-[32px]"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold font-manrope">Income vs Expenses</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary glow-emerald" />
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Income</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Expenses</span>
              </div>
            </div>
          </div>
          {insights.barData.length === 0 ? (
            <div className="text-center py-16 text-on-surface-variant">
              <Calendar className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p className="font-manrope font-bold">No data for chart</p>
            </div>
          ) : (
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={insights.barData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "#b9cbbb", fontSize: 11, fontWeight: 700 }}
                  />
                  <YAxis hide />
                  <Tooltip />
                  <Bar dataKey="Income" fill="#00ff94" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="Expenses" fill="#ff6b6b" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent Trends */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"
      >
        <div className="glass-card p-8 rounded-3xl">
          <h3 className="text-lg font-bold font-manrope mb-6 flex items-center gap-2">
            <ArrowUpRight className="w-5 h-5 text-primary" />
            Biggest Income Sources
          </h3>
          <div className="space-y-4">
            {transactions
              .filter(t => t.type === "Income")
              .sort((a, b) => b.amount - a.amount)
              .slice(0, 5)
              .map(tx => (
                <div key={tx.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-bold font-manrope text-sm">{tx.description}</p>
                    <p className="text-xs text-on-surface-variant/50">{tx.category}</p>
                  </div>
                  <p className="font-bold text-primary">+${tx.amount.toLocaleString()}</p>
                </div>
              ))}
            {transactions.filter(t => t.type === "Income").length === 0 && (
              <p className="text-sm text-on-surface-variant text-center py-4">No income transactions yet</p>
            )}
          </div>
        </div>

        <div className="glass-card p-8 rounded-3xl">
          <h3 className="text-lg font-bold font-manrope mb-6 flex items-center gap-2">
            <ArrowDownRight className="w-5 h-5 text-rose-500" />
            Biggest Expenses
          </h3>
          <div className="space-y-4">
            {transactions
              .filter(t => t.type === "Expense")
              .sort((a, b) => b.amount - a.amount)
              .slice(0, 5)
              .map(tx => (
                <div key={tx.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-bold font-manrope text-sm">{tx.description}</p>
                    <p className="text-xs text-on-surface-variant/50">{tx.category}</p>
                  </div>
                  <p className="font-bold text-rose-500">-${tx.amount.toLocaleString()}</p>
                </div>
              ))}
            {transactions.filter(t => t.type === "Expense").length === 0 && (
              <p className="text-sm text-on-surface-variant text-center py-4">No expense transactions yet</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
