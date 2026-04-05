"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  transactionDescription: string;
}

export const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, transactionDescription }: DeleteConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm bg-surface-high border border-outline rounded-3xl p-8 relative shadow-2xl text-center"
      >
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 flex items-center justify-center mb-6">
          <AlertTriangle className="w-8 h-8 text-rose-500" />
        </div>

        <h2 className="text-xl font-bold font-manrope mb-2">Delete Transaction?</h2>
        <p className="text-sm text-on-surface-variant mb-1">
          You&apos;re about to delete:
        </p>
        <p className="text-sm font-bold text-on-surface mb-6">&ldquo;{transactionDescription}&rdquo;</p>
        <p className="text-xs text-on-surface-variant/60 mb-8">This action cannot be undone.</p>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-outline text-on-surface-variant font-bold font-manrope text-sm hover:bg-surface-low transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-rose-500 text-white font-bold font-manrope text-sm hover:bg-rose-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
};
