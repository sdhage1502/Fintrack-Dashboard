"use client";

import React from "react";
import { motion } from "framer-motion";
import { DashboardCard } from "@/components/DashboardCards";
import { FinChart } from "@/components/FinChart";
import { CategoryPieChart } from "@/components/CategoryPieChart";
import { 
  DollarSign, 
  Wallet, 
  TrendingUp, 
  CreditCard, 
  ArrowUpRight, 
  ShoppingBag, 
  Home, 
  Coffee,
  ShieldCheck,
  Loader2
} from "lucide-react";

import { useTransactionStore } from "@/store/transactionStore";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";

// Helper icon mapping
const getIconForCategory = (category: string) => {
  switch(category) {
    case "Salary":
    case "Freelance": return TrendingUp;
    case "Rent":
    case "Housing": return Home;
    case "Groceries": 
    case "Food & Drink": return Coffee;
    case "Shopping": return ShoppingBag;
    case "Utilities": return Wallet;
    default: return DollarSign;
  }
};

export default function Dashboard() {
  const { transactions, isLoading } = useTransactionStore();
  const { user } = useAuthStore();
  
  const income = transactions.filter(t => t.type === 'Income').reduce((acc, curr) => acc + curr.amount, 0);
  const expense = transactions.filter(t => t.type === 'Expense').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = income - expense;

  // Recent 4 sorted by latest date
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);

  // Insights Calculations
  const expensesByCategory = transactions
    .filter(t => t.type === "Expense")
    .reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

  const sortedCategories = Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1]);
  const highestCategory = sortedCategories.length > 0 ? sortedCategories[0][0] : "None";
  const highestAmount = sortedCategories.length > 0 ? sortedCategories[0][1] : 0;

  // Safety score based on savings ratio
  const savingsRatio = income > 0 ? ((income - expense) / income) * 100 : 0;
  const safetyScore = Math.min(100, Math.max(0, Math.round(savingsRatio + 50)));

  // Greeting based on time of day
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const firstName = user?.name?.split(" ")[0] || "there";

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-on-surface-variant font-medium text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-0 mb-10"
      >
        <div>
          <h1 className="text-4xl md:text-5xl font-bold font-manrope tracking-tight mb-2">
            {greeting}, <span className="text-gradient">{firstName}</span>
          </h1>
          <p className="text-on-surface-variant/80 font-medium tracking-tight" suppressHydrationWarning>
            {user?.role === "admin" 
              ? "Here's a platform-wide overview of all financial activity."
              : "Here's how your finances are doing today."}
          </p>
        </div>
        {user?.role === "admin" && (
          <Link 
            href="/admin"
            className="px-5 py-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary font-bold font-manrope text-sm flex items-center gap-2 hover:bg-primary/20 transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            Admin Panel
          </Link>
        )}
      </motion.div>

      {/* Grid Layout */}
      <div className="grid grid-cols-12 gap-8">
        {/* Left Column: Cards & Chart */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <DashboardCard 
              title="Total Balance" 
              amount={`$${balance.toLocaleString()}`} 
              trend={savingsRatio > 0 ? savingsRatio.toFixed(1) : "0"} 
              isPositive={balance >= 0} 
              icon={Wallet} 
              isFeatured={true}
            />
            <DashboardCard 
              title="Income" 
              amount={`$${income.toLocaleString()}`} 
              isPositive={true} 
              icon={TrendingUp} 
            />
            <DashboardCard 
              title="Expenses" 
              amount={`$${expense.toLocaleString()}`} 
              isPositive={false} 
              icon={CreditCard} 
            />
          </div>

          <FinChart />
        </div>

        {/* Right Column: Transactions & Insights */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-6 md:p-8 rounded-[32px] h-full"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold font-manrope tracking-tight">Recent Activity</h3>
              <Link href="/transactions" className="p-2.5 rounded-xl bg-surface-highest hover:bg-surface-high transition-colors text-on-surface-variant group">
                <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform" />
              </Link>
            </div>

            <div className="space-y-6">
              {recentTransactions.length === 0 ? (
                <div className="text-center py-8 text-on-surface-variant">
                  <DollarSign className="w-10 h-10 mx-auto mb-3 opacity-20" />
                  <p className="font-manrope font-bold">No transactions yet</p>
                  <p className="text-xs mt-1">Add your first transaction to see it here.</p>
                </div>
              ) : (
                recentTransactions.map((tx) => {
                  const Icon = getIconForCategory(tx.category);
                  const isIncome = tx.type === 'Income';
                  const colorClass = isIncome ? "text-primary bg-primary/10" : "text-rose-500 bg-rose-500/10";
                  
                  return (
                    <div key={tx.id} className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className={`p-3.5 rounded-2xl ${colorClass} transition-transform group-hover:scale-110 duration-300`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold font-manrope text-on-surface group-hover:text-primary transition-colors">{tx.description}</p>
                          <p className="text-xs font-bold font-manrope text-on-surface-variant/40 uppercase tracking-widest" suppressHydrationWarning>
                            {tx.category} • {new Date(tx.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <p className={`font-bold font-manrope tracking-tight ${isIncome ? 'text-primary' : 'text-on-surface'}`}>
                        {isIncome ? '+' : '-'}${tx.amount.toLocaleString()}
                      </p>
                    </div>
                  );
                })
              )}
            </div>

            {/* Categorical Breakdown (Requirement 1.3) */}
            <div className="mt-10 pt-10 border-t border-outline/5">
              <h3 className="text-xl font-bold font-manrope tracking-tight mb-2">Spending Breakdown</h3>
              <p className="text-xs text-on-surface-variant font-medium">Top 5 expense categories</p>
              <CategoryPieChart />
            </div>

            {/* Insights Section */}
            <div className="mt-12 space-y-4">
              <div className="p-6 rounded-3xl bg-secondary/5 border border-secondary/10 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <ShieldCheck className="w-20 h-20 text-secondary" />
                 </div>
                 <h4 className="text-sm font-bold font-manrope text-secondary uppercase tracking-[0.2em] mb-2">Financial Health</h4>
                 <p className="text-3xl font-bold font-manrope mb-1 tracking-tight">{safetyScore} <span className="text-xs opacity-40 font-medium">/100</span></p>
                 <p className="text-xs text-on-surface-variant/60 font-medium">
                   {safetyScore >= 70 ? "You're on track — keep it up!" : safetyScore >= 40 ? "Room for improvement. Review your spending." : "Spending exceeds income. Consider adjustments."}
                 </p>
              </div>

              <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <DollarSign className="w-20 h-20 text-primary" />
                 </div>
                 <h4 className="text-sm font-bold font-manrope text-primary uppercase tracking-[0.2em] mb-2">Top Spending</h4>
                 <p className="text-lg font-bold font-manrope mb-1 tracking-tight">{highestCategory}</p>
                 <p className="text-xs text-on-surface-variant/80 font-medium leading-relaxed">
                   You spent <span className="text-primary font-bold">${highestAmount.toLocaleString()}</span> in this category.
                 </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
