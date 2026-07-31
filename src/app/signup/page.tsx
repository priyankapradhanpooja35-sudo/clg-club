'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import {
  Eye, EyeOff, Mail, Lock, User, GraduationCap, Users, ShieldAlert,
  UserCheck, Check, AlertCircle, Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

const signupRoles = [
  { value: 'Student', label: 'Student', desc: 'Join clubs & register for campus events', icon: GraduationCap },
  { value: 'ClubHead', label: 'Club Head', desc: 'Manage club, post events & track attendees', icon: Users },
  { value: 'Faculty', label: 'Faculty', desc: 'Oversee and approve club actions', icon: UserCheck },
  { value: 'Guest', label: 'Guest', desc: 'Explore campus events as visitor', icon: ShieldAlert },
];

export default function SignupPage() {
  const { user, register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Student' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Automatically redirect if already logged in
  useEffect(() => {
    if (user) {
      const role = user.role;
      if (role === 'Admin') router.push('/dashboard/admin');
      else if (role === 'ClubHead') router.push('/dashboard/club-head');
      else if (role === 'Faculty') router.push('/dashboard/faculty');
      else router.push('/dashboard/student');
    }
  }, [user, router]);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  // Dynamic Password Strength (min 8 chars, 1 number)
  const passwordStrength = () => {
    const pwd = form.password;
    if (pwd.length === 0) return 0;
    if (pwd.length < 8) return 1;
    if (!/\d/.test(pwd)) return 2;
    return 3;
  };

  const strengthColors = ['', 'bg-red-500', 'bg-amber-500', 'bg-green-500'];
  const strengthLabels = ['', 'Too short (min 8)', 'Missing a number', 'Strong password'];
  const strength = passwordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[0-9]).{8,}$/;

    if (!form.name || !form.email || !form.password) {
      setError('Please fill in all fields');
      return;
    }
    if (!emailRegex.test(form.email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!passwordRegex.test(form.password)) {
      setError('Password must be at least 8 characters and contain at least one number');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const result = await register(form.name, form.email, form.password, form.role);
      if (!result.success) {
        setError(result.message || 'Signup failed');
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
      {/* Background blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[10%] right-[10%] w-[350px] h-[350px] rounded-full bg-blue-400/20 dark:bg-blue-600/10 blur-[80px]" />
        <div className="absolute bottom-[10%] left-[10%] w-[400px] h-[400px] rounded-full bg-indigo-400/20 dark:bg-indigo-600/10 blur-[90px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-lg z-10"
      >
        {/* Glass Card */}
        <div className="rounded-[24px] border border-white/60 bg-white/85 dark:bg-slate-900/80 dark:border-slate-800/60 backdrop-blur-[16px] shadow-[0_12px_40px_rgba(37,99,235,0.08)] p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <Link href="/" className="flex items-center gap-3.5 mb-4 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-full overflow-hidden bg-white border border-slate-200/80 shadow-md shadow-blue-500/15 transition-transform duration-200 group-hover:scale-105">
                <img src="/images/bec-logo-clean.png" alt="BEC Logo" className="w-full h-full object-cover rounded-full" />
              </div>
              <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                BEC Club Hub
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-slate-950 dark:text-white tracking-tight flex items-center gap-1.5">
              Create your account
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
              Join the official campus hub
            </p>
          </div>

          {/* Form validation warning banner */}
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
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-wide uppercase">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="text"
                  value={form.name}
                  onChange={set('name')}
                  placeholder="Ayush Kumar"
                  className="w-full rounded-xl border border-blue-100 bg-white/70 px-4 py-2.5 pl-10 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-wide uppercase">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  placeholder="you@bec.edu.in"
                  className="w-full rounded-xl border border-blue-100 bg-white/70 px-4 py-2.5 pl-10 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-wide uppercase">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  placeholder="Min. 8 characters with 1 number"
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
              
              {/* Password Strength Indicator */}
              {form.password.length > 0 && (
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex gap-1.5 flex-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          i <= strength ? strengthColors[strength] : 'bg-slate-200 dark:bg-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                    {strengthLabels[strength]}
                  </span>
                </div>
              )}
            </div>

            {/* Selectable Role Cards */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-wide uppercase block">
                Sign Up As
              </label>
              <div className="grid grid-cols-2 gap-3">
                {signupRoles.map((roleOpt) => {
                  const Icon = roleOpt.icon;
                  const isSelected = form.role === roleOpt.value;
                  return (
                    <button
                      key={roleOpt.value}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, role: roleOpt.value }))}
                      className={`flex flex-col items-start p-3 text-left border rounded-2xl transition-all duration-200 group relative ${
                        isSelected
                          ? 'border-[#2563EB] bg-blue-50/80 dark:bg-blue-950/20 text-[#2563EB]'
                          : 'border-blue-100 bg-white/70 hover:border-blue-200 hover:bg-blue-50/20 dark:border-slate-800 dark:bg-slate-950/50'
                      }`}
                    >
                      <div className="flex w-full items-center justify-between mb-1.5">
                        <div className={`p-1.5 rounded-lg ${
                          isSelected ? 'bg-[#2563EB] text-white' : 'bg-blue-50 text-[#2563EB] dark:bg-slate-900'
                        }`}>
                          <Icon className="w-4.5 h-4.5" />
                        </div>
                        {isSelected && (
                          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#2563EB] text-white">
                            <Check className="w-2.5 h-2.5 stroke-[3px]" />
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {roleOpt.label}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium leading-normal mt-0.5">
                        {roleOpt.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sign Up CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 hover:scale-[1.02] active:scale-98 transition-all duration-200 ease-in-out mt-4 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6 font-medium">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-700 font-bold transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
