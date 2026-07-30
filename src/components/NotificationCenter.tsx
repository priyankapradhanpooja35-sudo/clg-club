'use client';
import { useState, useEffect, useRef } from 'react';
import { Bell, CheckCircle2, Trophy, Megaphone, Calendar, X } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'event' | 'badge' | 'notice';
  read: boolean;
  link?: string;
}

export default function NotificationCenter() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    // Generate realistic notifications based on user session
    const mockNotifs: NotificationItem[] = [
      {
        id: '1',
        title: 'Registration Confirmed 🎉',
        message: 'Your spot for Azure Cloud Workshop is locked in. Access your QR Ticket.',
        time: '10 min ago',
        type: 'event',
        read: false,
        link: '/dashboard/student/tickets',
      },
      {
        id: '2',
        title: 'New Badge Unlocked 🏆',
        message: 'You earned the "Club Explorer" badge for joining 3 campus clubs!',
        time: '2 hours ago',
        type: 'badge',
        read: false,
        link: '/leaderboard',
      },
      {
        id: '3',
        title: 'Urgent Announcement 📢',
        message: 'Microsoft Club posted an update regarding free Azure Exam Vouchers.',
        time: '1 day ago',
        type: 'notice',
        read: true,
        link: '/announcements',
      },
    ];
    setNotifications(mockNotifs);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'event': return <Calendar className="w-4 h-4 text-violet-500" />;
      case 'badge': return <Trophy className="w-4 h-4 text-amber-500" />;
      case 'notice': return <Megaphone className="w-4 h-4 text-pink-500" />;
      default: return <Bell className="w-4 h-4 text-blue-500" />;
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-xl p-2 text-gray-500 hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-violet-600" />
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--muted)]/50">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[var(--foreground)]">Notifications</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-violet-600 px-2 py-0.5 text-xs font-semibold text-white">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs font-medium text-violet-600 hover:underline">
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-[var(--border)]">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-sm">No notifications</div>
            ) : (
              notifications.map((n) => (
                <Link
                  key={n.id}
                  href={n.link || '#'}
                  onClick={() => setOpen(false)}
                  className={`flex items-start gap-3 p-3.5 hover:bg-[var(--muted)] transition-colors ${
                    !n.read ? 'bg-violet-50/50 dark:bg-violet-950/20' : ''
                  }`}
                >
                  <div className="mt-0.5 rounded-xl bg-[var(--card)] p-2 shadow-sm shrink-0 border border-[var(--border)]">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-xs font-bold text-[var(--foreground)] truncate">{n.title}</p>
                      <span className="text-[10px] text-gray-400 shrink-0 ml-1">{n.time}</span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{n.message}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
