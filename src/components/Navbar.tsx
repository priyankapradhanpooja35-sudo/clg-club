'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { cn } from '@/lib/utils';
import Avatar from '@/components/ui/Avatar';
import NotificationCenter from '@/components/NotificationCenter';
import {
  Menu, X, LogOut, LayoutDashboard, Users, Calendar, Megaphone,
  Home, ChevronDown, Award
} from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/clubs', label: 'Clubs', icon: Users },
  { href: '/events', label: 'Events', icon: Calendar },
  { href: '/announcements', label: 'Notices', icon: Megaphone },
  { href: '/leaderboard', label: 'Leaderboard', icon: Award },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Dynamic notification/event unread counts
  const [announcementsCount, setAnnouncementsCount] = useState(0);
  const [eventsCount, setEventsCount] = useState(0);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  // Sticky Scroll Behavior
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch unread count statistics
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const now = Date.now().toString();

        // Mark as read immediately when user visits the target pages
        if (pathname === '/announcements') {
          localStorage.setItem('last_visited_announcements', now);
          setAnnouncementsCount(0);
        }
        if (pathname === '/events') {
          localStorage.setItem('last_visited_events', now);
          setEventsCount(0);
        }

        // Fetch announcements/notices
        const annRes = await fetch('/api/announcements');
        if (annRes.ok) {
          const resJson = await annRes.json();
          const list = resJson.data || [];
          
          if (pathname === '/announcements') {
            setAnnouncementsCount(0);
          } else {
            const lastVisited = localStorage.getItem('last_visited_announcements');
            const lastVisitedTime = lastVisited ? parseInt(lastVisited, 10) : 0;
            const unread = list.filter((item: any) => {
              const itemTime = new Date(item.createdAt || Date.now()).getTime();
              return itemTime > lastVisitedTime;
            });
            setAnnouncementsCount(unread.length);
          }
        }

        // Fetch upcoming events
        const eventsRes = await fetch('/api/events?upcoming=true');
        if (eventsRes.ok) {
          const resJson = await eventsRes.json();
          const list = resJson.data || [];
          
          if (pathname === '/events') {
            setEventsCount(0);
          } else {
            const lastVisited = localStorage.getItem('last_visited_events');
            const lastVisitedTime = lastVisited ? parseInt(lastVisited, 10) : 0;
            const unread = list.filter((item: any) => {
              const itemTime = new Date(item.createdAt || item.date || Date.now()).getTime();
              return itemTime > lastVisitedTime;
            });
            setEventsCount(unread.length);
          }
        }
      } catch (error) {
        console.error('Error fetching unread badge counts:', error);
      }
    };

    fetchCounts();
    const interval = setInterval(fetchCounts, 25000);
    return () => clearInterval(interval);
  }, [pathname]);

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
    <header className="sticky top-4 sm:top-5 z-50 mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-7xl">
      <nav
        className={cn(
          'rounded-[20px] border border-white/80 transition-all duration-300 ease-in-out dark:border-slate-800/80',
          isScrolled
            ? 'shadow-[0_12px_40px_rgba(0,0,0,0.12)] backdrop-blur-[16px] bg-white/90 dark:bg-slate-900/90 py-2.5'
            : 'shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-[12px] bg-white/85 dark:bg-slate-900/85 py-4'
        )}
      >
        <div className="px-4 sm:px-6">
          <div className="flex h-12 items-center justify-between">
            {/* Logo + Tagline */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2563EB] text-white font-black text-xs shadow-md shadow-blue-500/25 transition-transform duration-200 group-hover:scale-105">
                BEC
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-[#1E293B] dark:text-white leading-none tracking-tight">
                  BEC Club Hub
                </span>
                <span className="text-[10px] text-[#2563EB] dark:text-blue-400 font-semibold leading-tight mt-0.5 tracking-wide">
                  Discover. Connect. Grow.
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-1.5 bg-slate-100/60 p-1.5 rounded-full border border-slate-200/50 dark:bg-slate-800/50 dark:border-slate-700/50">
              {navLinks.map(({ href, label }) => {
                const isActive = pathname === href;
                
                // Unread status badges configuration
                const hasBadge = (label === 'Notices' && announcementsCount > 0) || (label === 'Events' && eventsCount > 0);
                const badgeCount = label === 'Notices' ? announcementsCount : eventsCount;
                const badgeColor = label === 'Notices' ? '#F59E0B' : '#3B82F6';

                return (
                  <div
                    key={href}
                    className="relative"
                    onMouseEnter={() => setHoveredLink(label)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    <Link
                      href={href}
                      className={cn(
                        'relative block px-4 py-2 text-sm font-semibold tracking-wide transition-all duration-200 ease-in-out rounded-full',
                        isActive
                          ? 'text-white'
                          : 'text-[#1E293B] hover:text-[#2563EB] hover:bg-[#EFF6FF] dark:text-slate-200 dark:hover:text-blue-400 dark:hover:bg-slate-800/80'
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="navbar-active-pill"
                          className="absolute inset-0 bg-[#2563EB] rounded-full shadow-md shadow-blue-600/25"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{label}</span>
                      
                      {/* Floating dynamic pulsing indicator badge */}
                      {hasBadge && (
                        <span className="absolute -top-1 -right-1 flex h-[18px] w-[18px] items-center justify-center z-20">
                          <span 
                            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                            style={{ backgroundColor: badgeColor }}
                          ></span>
                          <span 
                            className="relative flex h-[18px] w-[18px] items-center justify-center rounded-full text-[9px] font-black text-white shadow-sm"
                            style={{ 
                              backgroundColor: badgeColor,
                              boxShadow: `0 2px 8px ${badgeColor}40`
                            }}
                          >
                            {badgeCount}
                          </span>
                        </span>
                      )}
                    </Link>

                    {/* Premium Hover Dropdown Tooltip / Preview */}
                    <AnimatePresence>
                      {hoveredLink === label && hasBadge && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, x: '-50%' }}
                          animate={{ opacity: 1, y: 0, x: '-50%' }}
                          exit={{ opacity: 0, y: 8, x: '-50%' }}
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                          className="absolute top-full left-1/2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 shadow-lg px-3.5 py-1.5 rounded-xl text-[11px] text-[#1E293B] dark:text-slate-200 font-semibold whitespace-nowrap z-50 pointer-events-none mt-3"
                        >
                          {label === 'Notices' ? `🔔 ${badgeCount} unread notices` : `📅 ${badgeCount} upcoming events`}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Right Side: Auth / Profile */}
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <NotificationCenter />
                  <Link href={getDashboardHref()}>
                    <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-[#2563EB] bg-[#EFF6FF] border border-blue-200/80 hover:bg-blue-100 transition-all duration-200 ease-in-out dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800">
                      <LayoutDashboard className="w-4 h-4 text-[#2563EB]" />
                      Dashboard
                    </button>
                  </Link>
                  {/* Profile dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="flex items-center gap-2 rounded-full px-2.5 py-1.5 border border-slate-200 bg-white hover:bg-[#EFF6FF] transition-all duration-200 ease-in-out dark:border-slate-700 dark:bg-slate-800"
                    >
                      <Avatar name={user.name} size="sm" />
                      <span className="hidden sm:block text-sm font-semibold text-[#1E293B] dark:text-slate-200">
                        {user.name.split(' ')[0]}
                      </span>
                      <span className={cn(
                        'hidden md:inline-block px-2 py-0.5 rounded-full text-[9px] font-bold text-white',
                        user.role === 'Admin' ? 'bg-[#EF4444]' :
                        user.role === 'ClubHead' ? 'bg-[#10B981]' :
                        user.role === 'Faculty' ? 'bg-[#8B5CF6]' : 'bg-[#64748B]'
                      )}>
                        {user.role}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                    </button>

                    <AnimatePresence>
                      {profileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-12 w-56 rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-xl shadow-xl py-2 z-50 dark:border-slate-800 dark:bg-slate-900/95"
                        >
                          <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                            <p className="text-sm font-bold text-[#1E293B] dark:text-white">
                              {user.name}
                            </p>
                            <p className="text-xs text-[#2563EB] font-semibold dark:text-blue-400">
                              {user.role}
                            </p>
                          </div>
                          <Link
                            href={getDashboardHref()}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-[#1E293B] hover:bg-[#EFF6FF] hover:text-[#2563EB] transition-all duration-200 dark:text-slate-200 dark:hover:bg-slate-800"
                            onClick={() => setProfileOpen(false)}
                          >
                            <LayoutDashboard className="w-4 h-4 text-[#2563EB]" />
                            Dashboard Overview
                          </Link>

                          {/* Conditional Admin, ClubHead, and Faculty Action Links */}
                          {user.role === 'Admin' && (
                            <Link
                              href="/dashboard/admin"
                              className="flex items-center gap-2.5 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200 dark:hover:bg-slate-800"
                              onClick={() => setProfileOpen(false)}
                            >
                              <ShieldCheck className="w-4 h-4" />
                              Admin Panel
                            </Link>
                          )}
                          {user.role === 'ClubHead' && (
                            <Link
                              href="/dashboard/club-head"
                              className="flex items-center gap-2.5 px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 transition-all duration-200 dark:hover:bg-slate-800"
                              onClick={() => setProfileOpen(false)}
                            >
                              <Users className="w-4 h-4" />
                              Manage My Club
                            </Link>
                          )}
                          {user.role === 'Faculty' && (
                            <Link
                              href="/dashboard/faculty"
                              className="flex items-center gap-2.5 px-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 transition-all duration-200 dark:hover:bg-slate-800"
                              onClick={() => setProfileOpen(false)}
                            >
                              <Award className="w-4 h-4" />
                              Faculty Portal
                            </Link>
                          )}

                          <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-all duration-200 dark:hover:bg-red-950/20"
                          >
                            <LogOut className="w-4 h-4" /> Logout
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/login">
                    <button className="px-5 py-2 text-sm font-semibold rounded-full text-[#2563EB] border border-[#2563EB]/40 bg-transparent hover:border-[#2563EB] hover:bg-[#EFF6FF] transition-all duration-200 ease-in-out dark:text-blue-400 dark:border-blue-700/60 dark:hover:bg-blue-950/50">
                      Login
                    </button>
                  </Link>
                  <Link href="/signup">
                    <button className="px-5 py-2 text-sm font-bold rounded-full bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white shadow-md shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all duration-200 ease-in-out">
                      Sign Up
                    </button>
                  </Link>
                </div>
              )}

              {/* Mobile hamburger button */}
              <button
                className="lg:hidden rounded-full p-2 text-[#1E293B] hover:bg-[#EFF6FF] hover:text-[#2563EB] transition-all duration-200 dark:text-slate-300 dark:hover:bg-slate-800"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle navigation menu"
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Sheet (Floating) */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="lg:hidden border-t border-slate-100 bg-white/95 rounded-b-[20px] px-4 pb-4 pt-3 space-y-1.5 dark:border-slate-800 dark:bg-slate-900/95"
            >
              {navLinks.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;
                
                const hasMobileBadge = (label === 'Notices' && announcementsCount > 0) || (label === 'Events' && eventsCount > 0);
                const mobileBadgeCount = label === 'Notices' ? announcementsCount : eventsCount;
                const mobileBadgeColor = label === 'Notices' ? '#F59E0B' : '#3B82F6';

                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'flex items-center justify-between rounded-full px-4 py-2.5 text-sm font-semibold tracking-wide transition-all duration-200 ease-in-out',
                      isActive
                        ? 'bg-[#2563EB] text-white shadow-md shadow-blue-600/25'
                        : 'text-[#1E293B] hover:bg-[#EFF6FF] hover:text-[#2563EB] dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-blue-400'
                    )}
                    onClick={() => setMenuOpen(false)}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      {label}
                    </div>
                    {hasMobileBadge && (
                      <span 
                        className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[9px] font-black text-white shadow-sm"
                        style={{ backgroundColor: mobileBadgeColor }}
                      >
                        {mobileBadgeCount}
                      </span>
                    )}
                  </Link>
                );
              })}
              {user && (
                <Link
                  href={getDashboardHref()}
                  className="flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-semibold text-[#2563EB] bg-[#EFF6FF] dark:bg-blue-950/60 dark:text-blue-300"
                  onClick={() => setMenuOpen(false)}
                >
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
