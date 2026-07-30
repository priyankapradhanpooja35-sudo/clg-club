'use client';
import { useAuth } from '@/lib/AuthContext';
import Sidebar from '@/components/Sidebar';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import NotificationCenter from '@/components/NotificationCenter';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { Search, Eye, LogOut, ChevronDown, Moon, Sun } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Loading Enterprise Admin Suite...</p>
      </div>
    </div>
  );

  if (!user) return null;

  const roleKey = user.role === 'Admin' ? 'admin' : user.role === 'ClubHead' ? 'club-head' : 'student';

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalSearch.trim()) return;
    router.push(`/dashboard/admin/clubs?search=${encodeURIComponent(globalSearch)}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      {/* Admin Header Top Bar */}
      <header className="sticky top-0 z-30 h-16 border-b border-[var(--border)] bg-[var(--card)]/90 backdrop-blur-md px-4 lg:px-8 flex items-center justify-between">
        {/* Left: Brand + Search */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-700 font-black text-xs text-white">
              BEC
            </div>
            <span className="font-bold text-sm text-[var(--foreground)] hidden lg:block">
              BEC <span className="text-violet-600">Enterprise Admin</span>
            </span>
          </Link>

          {/* Global Search */}
          <form onSubmit={handleGlobalSearch} className="relative hidden sm:block w-64 lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Quick search clubs, members, events..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--muted)]/50 px-3.5 py-1.5 pl-9 text-xs text-[var(--foreground)] focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            />
          </form>
        </div>

        {/* Right: Actions + Profile */}
        <div className="flex items-center gap-3">
          {/* Quick "View as Student" Mode Toggle */}
          {user.role === 'Admin' && (
            <Link href="/dashboard/student">
              <Button variant="ghost" size="sm" className="hidden sm:flex gap-1.5 text-xs">
                <Eye className="w-3.5 h-3.5" /> View as Student
              </Button>
            </Link>
          )}

          <NotificationCenter />

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-[var(--muted)] transition-colors"
            >
              <Avatar name={user.name} size="sm" />
              <span className="hidden md:block text-xs font-semibold text-[var(--foreground)]">
                {user.name.split(' ')[0]}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden md:block" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-12 w-56 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl py-2 z-50 animate-in fade-in-0 zoom-in-95 duration-150">
                <div className="px-4 py-2 border-b border-[var(--border)]">
                  <p className="text-xs font-bold text-[var(--foreground)]">{user.name}</p>
                  <p className="text-[11px] text-gray-400">{user.email}</p>
                  <Badge variant="warning" className="mt-1">{user.role}</Badge>
                </div>
                <Link
                  href="/dashboard/student"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs text-[var(--foreground)] hover:bg-[var(--muted)]"
                >
                  <Eye className="w-3.5 h-3.5" /> Student View
                </Link>
                <button
                  onClick={async () => {
                    await logout();
                    router.push('/login');
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar role={roleKey} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Breadcrumb />
          {children}
        </main>
      </div>
    </div>
  );
}
