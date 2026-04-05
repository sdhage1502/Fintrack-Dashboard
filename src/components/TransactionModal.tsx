import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Transaction, TransactionType } from '@/types';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, "id" | "userId" | "createdAt">) => void;
  existingTransaction?: Transaction;
}

export const TransactionModal = ({ isOpen, onClose, onSave, existingTransaction }: TransactionModalProps) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Other");
  const [type, setType] = useState<TransactionType>("Expense");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens/closes or when editing different transaction
  useEffect(() => {
    if (isOpen) {
      setDescription(existingTransaction?.description || "");
      setAmount(existingTransaction?.amount?.toString() || "");
      setCategory(existingTransaction?.category || "Other");
      setType(existingTransaction?.type || "Expense");
      setDate(existingTransaction?.date 
        ? new Date(existingTransaction.date).toISOString().slice(0, 16) 
        : new Date().toISOString().slice(0, 16)
      );
      setErrors({});
    }
  }, [isOpen, existingTransaction]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!description.trim()) errs.description = "Description is required";
    const parsed = parseFloat(amount);
    if (!amount || isNaN(parsed) || parsed <= 0) errs.amount = "Enter a valid positive amount";
    if (!date) errs.date = "Date is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    onSave({
      description,
      amount: parseFloat(amount) || 0,
      category,
      type,
      date: new Date(date).toISOString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-surface-high border border-outline rounded-3xl p-6 sm:p-8 relative shadow-2xl mt-12 sm:mt-0 max-h-[90vh] overflow-y-auto"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold font-manrope mb-2">
          {existingTransaction ? "Edit Transaction" : "New Transaction"}
        </h2>
        <p className="text-sm text-on-surface-variant/60 mb-6">
          {existingTransaction ? "Update the details below." : "Fill in the details to record a transaction."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-60">What was it for?</label>
            <input 
              type="text" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-surface-highest border border-outline rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
              placeholder="e.g., Netflix subscription, Grocery run"
            />
            {errors.description && <p className="text-rose-500 text-xs mt-1">{errors.description}</p>}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-60">Amount ($)</label>
              <input 
                type="number" 
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-surface-highest border border-outline rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                placeholder="0.00"
              />
              {errors.amount && <p className="text-rose-500 text-xs mt-1">{errors.amount}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-60">Type</label>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value as TransactionType)}
                className="w-full bg-surface-highest border border-outline rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none appearance-none"
              >
                <option value="Expense">Expense</option>
                <option value="Income">Income</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-60">Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-surface-highest border border-outline rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none appearance-none"
              >
                <option value="Shopping">Shopping</option>
                <option value="Housing">Housing</option>
                <option value="Food & Drink">Food & Drink</option>
                <option value="Salary">Salary</option>
                <option value="Utilities">Utilities</option>
                <option value="Freelance">Freelance</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Rent">Rent</option>
                <option value="Groceries">Groceries</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-60">Date & Time</label>
              <input 
                type="datetime-local" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-surface-highest border border-outline rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
              />
              {errors.date && <p className="text-rose-500 text-xs mt-1">{errors.date}</p>}
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-4 mt-6 rounded-xl bg-luminous-gradient text-background font-bold tracking-wide glow-emerald hover:opacity-90 transition-opacity"
          >
            {existingTransaction ? "Save Changes" : "Add Transaction"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
