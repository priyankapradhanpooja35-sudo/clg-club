'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { cn } from '@/lib/utils';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import { useState } from 'react';
import {
  Menu, X, Bell, LogOut, LayoutDashboard, Users, Calendar, Megaphone,
  Home, ChevronDown
} from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/clubs', label: 'Clubs', icon: Users },
  { href: '/events', label: 'Events', icon: Calendar },
  { href: '/announcements', label: 'Notices', icon: Megaphone },
];

import NotificationCenter from '@/components/NotificationCenter';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const getDashboardHref = () => {
    if (!user) return '/login';
    if (user.role === 'Admin') return '/dashboard/admin';
    if (user.role === 'ClubHead') return '/dashboard/club-head';
    return '/dashboard/student';
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 font-black text-xs text-white shadow-sm">
              BEC
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-[var(--foreground)] leading-none">
                BEC Club Hub
              </span>
              <span className="text-[10px] text-gray-400 font-medium leading-tight mt-0.5">
                Connect. Engage. Excel.
              </span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname === href
                    ? 'bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300'
                    : 'text-gray-600 hover:text-[var(--foreground)] hover:bg-[var(--muted)] dark:text-gray-400'
                )}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/leaderboard"
              className={cn(
                'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                pathname === '/leaderboard'
                  ? 'bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300'
                  : 'text-gray-600 hover:text-[var(--foreground)] hover:bg-[var(--muted)] dark:text-gray-400'
              )}
            >
              Leaderboard
            </Link>
            <Link
              href="/calendar"
              className={cn(
                'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                pathname === '/calendar'
                  ? 'bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300'
                  : 'text-gray-600 hover:text-[var(--foreground)] hover:bg-[var(--muted)] dark:text-gray-400'
              )}
            >
              Calendar
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <NotificationCenter />
                <Link href={getDashboardHref()}>
                  <Button variant="secondary" size="sm" className="hidden sm:flex gap-1.5">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>
                {/* Profile dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-[var(--muted)] transition-colors"
                  >
                    <Avatar name={user.name} size="sm" />
                    <span className="hidden sm:block text-sm font-medium text-[var(--foreground)]">{user.name.split(' ')[0]}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 top-12 w-52 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-xl py-2 z-50">
                      <div className="px-4 py-2 border-b border-[var(--border)]">
                        <p className="text-sm font-semibold text-[var(--foreground)]">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.role}</p>
                      </div>
                      <Link
                        href={getDashboardHref()}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
                        onClick={() => setProfileOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link href="/signup" className="hidden sm:block">
                  <Button variant="gradient" size="sm">Sign Up</Button>
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden rounded-lg p-2 text-gray-500 hover:bg-[var(--muted)]"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--card)] px-4 pb-4 pt-2 space-y-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                pathname === href
                  ? 'bg-violet-50 text-violet-700'
                  : 'text-gray-600 hover:bg-[var(--muted)]'
              )}
              onClick={() => setMenuOpen(false)}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
          {user && (
            <Link
              href={getDashboardHref()}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-violet-700 bg-violet-50"
              onClick={() => setMenuOpen(false)}
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
