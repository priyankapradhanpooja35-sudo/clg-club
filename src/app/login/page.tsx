'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { Eye, EyeOff, Mail, Lock, AlertCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const { user, login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle automatic redirect if user is already logged in
  useEffect(() => {
    if (user) {
      const redirectPath = searchParams.get('redirect');
      if (redirectPath) {
        router.push(redirectPath);
      } else {
        const role = user.role;
        if (role === 'Admin') router.push('/dashboard/admin');
        else if (role === 'ClubHead') router.push('/dashboard/club-head');
        else if (role === 'Faculty') router.push('/dashboard/faculty');
        else router.push('/dashboard/student');
      }
    }
  }, [user, router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.message || 'Invalid email or password');
      }
      // Success will trigger the useEffect redirect
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-slate-950 p-4 overflow-hidden">
      {/* Premium blurred background patterns */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[350px] h-[350px] rounded-full bg-blue-400/20 dark:bg-blue-600/10 blur-[80px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-indigo-400/20 dark:bg-indigo-600/10 blur-[90px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md z-10"
      >
        {/* Glass Card */}
        <div className="rounded-[24px] border border-white/60 bg-white/85 dark:bg-slate-900/80 dark:border-slate-800/60 backdrop-blur-[16px] shadow-[0_12px_40px_rgba(37,99,235,0.08)] p-8">
          {/* Logo Title */}
          <div className="flex flex-col items-center mb-8">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 font-black text-sm text-white shadow-md shadow-blue-500/25 transition-transform duration-200 group-hover:scale-105">
                BEC
              </div>
            </Link>
            <h1 className="text-2xl font-bold text-slate-950 dark:text-white tracking-tight flex items-center gap-1.5">
              Welcome back
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
              Sign in to manage your campus legacy
            </p>
          </div>

          {/* Form inline validation warnings */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 mb-5 dark:border-red-950/40 dark:bg-red-950/20"
            >
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <p className="text-xs font-semibold text-red-700 dark:text-red-300">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-wide uppercase">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@bec.edu.in"
                  className="w-full rounded-xl border border-blue-100 bg-white/70 px-4 py-2.5 pl-10 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-wide uppercase">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-blue-100 bg-white/70 px-4 py-2.5 pl-10 pr-10 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Sign In CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 hover:scale-[1.02] active:scale-98 transition-all duration-200 ease-in-out mt-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6 font-medium">
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              className="text-blue-600 hover:text-blue-700 font-bold transition-colors"
            >
              Create one
            </Link>
          </p>

          {/* Seed demo hints */}
          <div className="mt-6 rounded-2xl border border-blue-100/80 bg-blue-50/40 p-4 dark:border-blue-900/30 dark:bg-blue-950/20 text-center text-xs">
            <span className="font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-1">
              ⚡ Campus Demo Credentials
            </span>
            <p className="text-slate-600 dark:text-slate-300 font-medium">
              Student: <span className="font-bold">student@bec.edu.in</span> / student123
            </p>
            <p className="text-slate-600 dark:text-slate-300 font-medium mt-0.5">
              Admin: <span className="font-bold">admin@bec.edu.in</span> / admin123
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
