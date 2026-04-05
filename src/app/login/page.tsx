"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormValues } from "@/schemas/auth";
import { loginUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, UserPlus, TrendingUp } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);

    try {
      await loginUser(data);
      toast.success("Logged in successfully!");
      router.push("/dashboard"); // AuthGuard will handle role redirect later
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
        toast.error("Incorrect email or password.");
      } else if (error.code === "auth/too-many-requests") {
        toast.error("Too many failed attempts. Please wait.");
      } else {
        toast.error(error.message || "Failed to log in.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Decorative Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-10 rounded-[40px] border-primary/20 bg-surface-high w-full max-w-md shadow-2xl"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 bg-luminous-gradient rounded-xl flex items-center justify-center glow-emerald">
            <TrendingUp className="text-background w-6 h-6" />
          </div>
          <span className="font-manrope text-2xl font-bold tracking-tight text-on-surface">FinTrack</span>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-gradient text-4xl font-bold font-manrope tracking-tight mb-3">Welcome Back</h1>
          <p className="text-on-surface-variant font-medium text-sm tracking-wide">Sign in to access your financial dashboard.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-[0.2em] text-primary/70 ml-2">Email</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
              </div>
              <input
                type="email"
                {...register("email")}
                className="w-full bg-surface-lowest border border-outline/10 p-4 pl-12 rounded-2xl outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all text-on-surface font-manrope font-semibold"
                placeholder="you@example.com"
              />
            </div>
            {errors.email && <p className="text-rose-500 text-xs mt-1 ml-2">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-[0.2em] text-primary/70 ml-2">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
              </div>
              <input
                type="password"
                {...register("password")}
                className="w-full bg-surface-lowest border border-outline/10 p-4 pl-12 rounded-2xl outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all text-on-surface font-manrope font-semibold"
                placeholder="Enter your password"
              />
            </div>
            {errors.password && <p className="text-rose-500 text-xs mt-1 ml-2">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover active:scale-[0.98] transition-all p-4 rounded-2xl text-background font-bold font-manrope flex items-center justify-center gap-3 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed group h-14"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-outline/5 text-center flex flex-col items-center gap-4">
           <p className="text-on-surface-variant/60 text-sm font-medium">Don't have an account?</p>
           <Link href="/signup" className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
             <UserPlus className="w-4 h-4" />
             Create Account
           </Link>
        </div>
      </motion.div>
    </div>
  );
}
