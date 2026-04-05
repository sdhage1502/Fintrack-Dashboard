"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  ShoppingBag,
  Home,
  Coffee,
  TrendingUp,
  Plus,
  DollarSign,
  Wallet,
  Download,
  Trash2,
  Edit3,
  Loader2
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useTransactionStore } from "@/store/transactionStore";
import { useAuthStore } from "@/store/authStore";
import { TransactionModal } from "@/components/TransactionModal";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { Transaction } from "@/types";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const categories = ["All", "Shopping", "Housing", "Salary", "Food & Drink", "Utilities", "Rent", "Groceries", "Freelance", "Entertainment", "Other"];

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

export default function TransactionsPage() {
  const { 
    transactions, 
    isLoading, 
    addTransaction, 
    editTransaction, 
    deleteTransaction, 
    seedMockData,
    searchQuery, 
    setSearchQuery, 
    filterType, 
    setFilterType 
  } = useTransactionStore();
  const { user } = useAuthStore();
  const role = user?.role || "user";
  
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);

  const currentMonthName = currentMonthDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const currentMonthExpenses = transactions
    .filter(t => t.type === 'Expense' && new Date(t.date).getMonth() === currentMonthDate.getMonth() && new Date(t.date).getFullYear() === currentMonthDate.getFullYear())
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Filter Logic
  const filteredTransactions = transactions.filter((tx) => {
    const txDate = new Date(tx.date);
    const matchesMonth = txDate.getMonth() === currentMonthDate.getMonth() && txDate.getFullYear() === currentMonthDate.getFullYear();
    
    // Safety fallback
    const desc = tx.description || "";
    const cat = tx.category || "";
    
    const searchLower = searchQuery.toLowerCase().trim();
    const sanitizedSearchAmount = searchLower.replace(/[$,\s]/g, ""); // removes $ and , for amount search
    
    const matchesCategory = selectedCategory === "All" || cat === selectedCategory;
    const matchesSearch = !searchLower || 
                          desc.toLowerCase().includes(searchLower) || 
                          tx.amount.toString().includes(sanitizedSearchAmount) ||
                          cat.toLowerCase().includes(searchLower);
                          
    const matchesType = filterType === "All" || tx.type === filterType;
    
    return matchesMonth && matchesCategory && matchesSearch && matchesType;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handlePrevMonth = () => setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

  // Permission checks
  const canEdit = (tx: Transaction) => role === "admin" || (role === "user" && tx.userId === user?.uid);
  const canDelete = (tx: Transaction) => role === "admin" || (role === "user" && tx.userId === user?.uid);
  const canAdd = role !== "viewer"; 
  const isViewer = role === "viewer";

  const handleEdit = (tx: Transaction) => {
    if (canEdit(tx)) {
      setEditingTransaction(tx);
      setIsModalOpen(true);
    }
  };

  const handleSaveModal = async (data: Omit<Transaction, "id" | "userId" | "createdAt">) => {
    if (editingTransaction) {
      await editTransaction(editingTransaction.id, data);
    } else if (user) {
      await addTransaction(user.uid, data);
    }
  };

  const handleSeedData = async () => {
    if (!user) return;
    setIsSeeding(true);
    await seedMockData(user.uid);
    setIsSeeding(false);
  };

  const openNewTransaction = () => {
    setEditingTransaction(undefined);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteTarget) {
      await deleteTransaction(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const handleExportCSV = () => {
    const txsToExport = role === "admin" ? transactions : transactions.filter(t => t.userId === user?.uid);
    const header = "Date,Description,Category,Type,Amount\n";
    const rows = txsToExport.map(t => `${t.date},${t.description},${t.category},${t.type},${t.amount}`).join("\n");
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fintrack-transactions-${role === "admin" ? "all" : "personal"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-on-surface-variant font-medium text-sm">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Header & Summary */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold font-manrope tracking-tight mb-2">Transactions</h1>
          <p className="text-on-surface-variant font-medium tracking-tight">
            {role === "admin" 
              ? "View and manage all platform transactions." 
              : "Track, search, and manage your financial activity."}
          </p>
        </motion.div>

        <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-4 md:mt-0">
          <motion.button 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleSeedData}
            disabled={isSeeding}
            className="px-6 py-4 rounded-3xl bg-secondary/10 border border-secondary/20 hover:bg-secondary/20 transition-colors font-bold font-manrope text-sm tracking-tight text-secondary flex items-center gap-2 h-full disabled:opacity-50"
          >
            {isSeeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Seed Mock Data
          </motion.button>
          <motion.button 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleExportCSV}
            className="px-6 py-4 rounded-3xl bg-surface-highest hover:bg-surface-high transition-colors font-bold font-manrope text-sm tracking-tight border border-outline flex items-center gap-2 h-full"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </motion.button>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-4 md:p-6 px-6 md:px-8 rounded-3xl bg-primary/5 border-primary/20 flex flex-col justify-center"
          >
            <div>
              <p className="text-[10px] font-bold font-manrope tracking-[0.2em] uppercase text-primary mb-1">Spent This Month</p>
              <p className="text-2xl md:text-3xl font-bold font-manrope">${currentMonthExpenses.toLocaleString()}</p>
            </div>
          </motion.div>
          {canAdd && (
            <motion.button 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={openNewTransaction}
              className="glass-card p-6 rounded-3xl bg-luminous-gradient text-background glow-emerald hover:opacity-90 transition-all flex items-center gap-2"
            >
              <Plus className="w-8 h-8" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative w-full lg:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, amount, or category..."
              className="w-full bg-surface-highest border border-outline rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full lg:w-auto scrollbar-hide">
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-6 py-3 rounded-full text-xs font-bold font-manrope tracking-widest uppercase transition-all whitespace-nowrap",
                  selectedCategory === cat 
                    ? "bg-primary text-background shadow-lg shadow-primary/20" 
                    : "bg-surface-highest text-on-surface-variant hover:text-on-surface hover:bg-surface-high border border-outline"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Type Filter + Month Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2 md:px-4">
          <div className="flex items-center gap-2">
            {(["All", "Income", "Expense"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
                  filterType === t
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-on-surface-variant hover:text-on-surface"
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4" suppressHydrationWarning>
            <button onClick={handlePrevMonth} className="p-2 rounded-xl border border-outline hover:bg-surface-low transition-colors"><ChevronLeft className="w-5 h-5"/></button>
            <span className="font-bold font-manrope tracking-widest uppercase text-xs text-on-surface">{currentMonthName}</span>
            <button onClick={handleNextMonth} className="p-2 rounded-xl border border-outline hover:bg-surface-low transition-colors"><ChevronRight className="w-5 h-5"/></button>
          </div>
        </div>

        {/* Transaction List */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredTransactions.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 text-on-surface-variant"
              >
                <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="font-manrope font-bold text-xl">No transactions found</p>
                <p className="text-sm mt-1">Try adjusting your search or category filter.</p>
                <button 
                  onClick={openNewTransaction}
                  className="mt-6 px-6 py-3 rounded-2xl bg-primary text-background font-bold font-manrope text-sm"
                >
                  Add Your First Transaction
                </button>
              </motion.div>
            ) : (
              filteredTransactions.map((tx, index) => {
                const Icon = getIconForCategory(tx.category);
                const isIncome = tx.type === 'Income';
                const editable = canEdit(tx);
                const deletable = canDelete(tx);
                
                return (
                  <motion.div 
                    key={tx.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.03 }}
                    className="glass-card p-5 rounded-3xl group border-transparent"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
                      <div className="flex items-center gap-4 md:gap-5">
                        <div className={cn(
                          "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500",
                          isIncome ? "bg-primary/10 text-primary shadow-[0_0_20px_rgba(0,255,148,0.05)]" : "bg-surface-highest text-on-surface-variant"
                        )}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold font-manrope text-on-surface">{tx.description}</h4>
                          <div className="flex items-center gap-3 mt-1 opacity-50 font-medium text-xs">
                             <span className="bg-surface-high px-2 py-0.5 rounded-md uppercase tracking-wider">{tx.category}</span>
                             <span>•</span>
                             <span suppressHydrationWarning>{new Date(tx.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                           <p className={cn(
                             "text-2xl font-bold font-manrope tracking-tight",
                             isIncome ? "text-primary" : "text-on-surface"
                           )}>
                             {isIncome ? "+" : "-"}${tx.amount.toLocaleString()}
                           </p>
                           <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest mt-1">Completed</p>
                        </div>
                        <div className="opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                          {editable && (
                            <button 
                              onClick={() => handleEdit(tx)}
                              className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-2 rounded-xl hover:bg-primary/20 transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          )}
                          {deletable && (
                            <button 
                              onClick={() => setDeleteTarget(tx)}
                              className="text-xs font-bold text-rose-500 uppercase tracking-widest bg-rose-500/10 px-3 py-2 rounded-xl hover:bg-rose-500/20 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <TransactionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveModal}
        existingTransaction={editingTransaction}
      />

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        transactionDescription={deleteTarget?.description || ""}
      />
    </div>
  );
}
