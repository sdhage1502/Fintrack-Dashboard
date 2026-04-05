"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useTransactionStore } from "@/store/transactionStore";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ShieldCheck, Users, Activity, DollarSign, TrendingUp, TrendingDown, Loader2, ChevronDown, Check, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

interface PlatformUser {
  uid: string;
  name: string;
  email: string;
  role: "admin" | "user" | "viewer";
  createdAt: string;
}

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const { transactions, isLoading: txLoading } = useTransactionStore();
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [roleDropdown, setRoleDropdown] = useState<string | null>(null);

  // Fetch all users from Firestore
  useEffect(() => {
    if (user?.role !== "admin") return;
    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(collection(db, "users"));
        const userList = snapshot.docs.map(d => ({
          uid: d.id,
          ...d.data()
        })) as PlatformUser[];
        setUsers(userList);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users");
      } finally {
        setUsersLoading(false);
      }
    };
    fetchUsers();
  }, [user]);

  const handleRoleChange = async (targetUid: string, newRole: "admin" | "user" | "viewer") => {
    if (targetUid === user?.uid) {
      toast.error("You cannot change your own role!");
      return;
    }
    try {
      await updateDoc(doc(db, "users", targetUid), { role: newRole });
      setUsers(prev => prev.map(u => u.uid === targetUid ? { ...u, role: newRole } : u));
      toast.success(`Role updated to ${newRole}!`);
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update role");
    }
    setRoleDropdown(null);
  };

  const handleDeleteUser = async (targetUid: string) => {
    if (targetUid === user?.uid) {
      toast.error("You cannot delete yourself!");
      return;
    }
    const confirmDelete = window.confirm("Are you sure you want to block/remove this user? Their profile data will be permanently inaccessible.");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "users", targetUid));
      setUsers(prev => prev.filter(u => u.uid !== targetUid));
      toast.success("User removed successfully!");
    } catch (error) {
      console.error("Error removing user:", error);
      toast.error("Failed to remove user");
    }
  };

  // Platform stats
  const totalIncome = transactions.reduce((s, t) => t.type === "Income" ? s + t.amount : s, 0);
  const totalExpense = transactions.reduce((s, t) => t.type === "Expense" ? s + t.amount : s, 0);
  const totalTransactions = transactions.length;
  const totalUsers = users.length;
  const adminCount = users.filter(u => u.role === "admin").length;

  // Recent 10 transactions across all users
  const recentGlobal = [...transactions]
    .sort((a, b) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime())
    .slice(0, 10);

  if (!user || user.role !== "admin") return null;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-end justify-between"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-manrope tracking-tight mb-2 flex items-center gap-3">
            <ShieldCheck className="w-10 h-10 text-primary" />
            Admin Panel
          </h1>
          <p className="text-on-surface-variant font-medium tracking-tight">
            Platform-wide management. View stats, manage users, and oversee all transactions.
          </p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="p-6 glass-card rounded-3xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users className="w-20 h-20 text-primary" />
          </div>
          <h3 className="font-bold font-manrope text-on-surface-variant text-sm mb-1">Total Users</h3>
          <p className="text-3xl md:text-4xl font-bold font-manrope text-primary">
            {usersLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : totalUsers}
          </p>
          <p className="text-xs text-on-surface-variant/50 mt-1">{adminCount} admin{adminCount !== 1 ? "s" : ""}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="p-6 glass-card rounded-3xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity className="w-20 h-20 text-secondary" />
          </div>
          <h3 className="font-bold font-manrope text-on-surface-variant text-sm mb-1">Total Transactions</h3>
          <p className="text-3xl md:text-4xl font-bold font-manrope text-secondary">
            {txLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : totalTransactions}
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="p-6 glass-card rounded-3xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp className="w-20 h-20 text-primary" />
          </div>
          <h3 className="font-bold font-manrope text-on-surface-variant text-sm mb-1">Platform Income</h3>
          <p className="text-3xl md:text-4xl font-bold font-manrope text-primary">${totalIncome.toLocaleString()}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="p-6 glass-card rounded-3xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingDown className="w-20 h-20 text-rose-500" />
          </div>
          <h3 className="font-bold font-manrope text-on-surface-variant text-sm mb-1">Platform Expenses</h3>
          <p className="text-3xl md:text-4xl font-bold font-manrope text-rose-500">${totalExpense.toLocaleString()}</p>
        </motion.div>
      </div>

      {/* User Management */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="glass-card rounded-[32px] p-8"
      >
        <h2 className="text-xl md:text-2xl font-bold font-manrope mb-6 flex items-center gap-2">
          <Users className="w-6 h-6 text-primary" />
          User Management
        </h2>
        
        {usersLoading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          </div>
        ) : users.length === 0 ? (
          <p className="text-on-surface-variant text-center py-8">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline/10">
                  <th className="text-left text-xs font-bold uppercase tracking-wider text-on-surface-variant/60 pb-4 pl-4">User</th>
                  <th className="text-left text-xs font-bold uppercase tracking-wider text-on-surface-variant/60 pb-4">Email</th>
                  <th className="text-left text-xs font-bold uppercase tracking-wider text-on-surface-variant/60 pb-4">Role</th>
                  <th className="text-left text-xs font-bold uppercase tracking-wider text-on-surface-variant/60 pb-4">Joined</th>
                  <th className="text-right text-xs font-bold uppercase tracking-wider text-on-surface-variant/60 pb-4 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.uid} className="border-b border-outline/5 hover:bg-surface-low/50 transition-colors">
                    <td className="py-4 pl-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">{u.name?.charAt(0)?.toUpperCase() || "?"}</span>
                        </div>
                        <span className="font-bold font-manrope text-sm">{u.name || "Unknown"}</span>
                        {u.uid === user?.uid && (
                          <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-md uppercase tracking-wider">You</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 text-sm text-on-surface-variant">{u.email}</td>
                    <td className="py-4">
                      <div className="relative">
                        <button
                          onClick={() => setRoleDropdown(roleDropdown === u.uid ? null : u.uid)}
                          disabled={u.uid === user?.uid}
                          className={`flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors ${
                            u.role === "admin" 
                              ? "bg-primary/10 text-primary" 
                              : "bg-secondary/10 text-secondary"
                          } ${u.uid === user?.uid ? "opacity-50 cursor-not-allowed" : "hover:opacity-80 cursor-pointer"}`}
                        >
                          {u.role}
                          {u.uid !== user?.uid && <ChevronDown className="w-3 h-3" />}
                        </button>
                        <AnimatePresence>
                          {roleDropdown === u.uid && (
                            <motion.div
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              className="absolute top-full left-0 mt-1 bg-surface-high border border-outline rounded-xl p-1 shadow-2xl z-20 min-w-[120px]"
                            >
                              {(["admin", "user", "viewer"] as const).map(r => (
                                <button
                                  key={r}
                                  onClick={() => handleRoleChange(u.uid, r)}
                                  className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                                    u.role === r ? "bg-primary/10 text-primary" : "text-on-surface-variant hover:bg-surface-low"
                                  }`}
                                >
                                  {u.role === r && <Check className="w-3 h-3" />}
                                  {r}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-on-surface-variant/60" suppressHydrationWarning>
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "—"}
                    </td>
                    <td className="py-4 pr-4 text-right">
                       <button
                         onClick={() => handleDeleteUser(u.uid)}
                         disabled={u.uid === user?.uid}
                         className="p-2 rounded-lg text-on-surface-variant hover:text-rose-500 hover:bg-rose-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                         title="Remove / Block User"
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Global Transaction Feed */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="glass-card rounded-[32px] p-8"
      >
        <h2 className="text-2xl font-bold font-manrope mb-6 flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-primary" />
          Global Transaction Feed
        </h2>
        <p className="text-on-surface-variant font-medium mb-6 text-sm">
          All transactions across all users in real-time.
        </p>
        
        {txLoading ? (
          <div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" /></div>
        ) : recentGlobal.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-surface-lowest border border-outline/5 border-dashed">
            <DollarSign className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p className="font-semibold text-on-surface-variant">No transactions on the platform yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentGlobal.map((tx) => {
              const isIncome = tx.type === "Income";
              const ownerUser = users.find(u => u.uid === tx.userId);
              return (
                <div key={tx.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 p-4 rounded-2xl bg-surface-lowest/50 hover:bg-surface-low transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${isIncome ? "bg-primary/10 text-primary" : "bg-rose-500/10 text-rose-500"}`}>
                      {isIncome ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-bold font-manrope text-sm">{tx.description}</p>
                      <p className="text-xs text-on-surface-variant/50">
                        {tx.category} • by {ownerUser?.name || tx.userId.slice(0, 8) + "..."} 
                        {" "} • <span suppressHydrationWarning>{new Date(tx.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                      </p>
                    </div>
                  </div>
                  <p className={`font-bold font-manrope ${isIncome ? "text-primary" : "text-rose-500"}`}>
                    {isIncome ? "+" : "-"}${tx.amount.toLocaleString()}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
