'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, Megaphone, Clock } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useNotices } from '@/hooks/useNotices';
import { formatRelativeTime } from '@/types/notice';

export default function NotificationBell() {
  const { notices, unreadCount, markAsRead, markAllAsRead, isRead } = useNotices();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectNotice = (noticeId: string) => {
    markAsRead(noticeId);
    setIsOpen(false);

    const targetUrl = `/announcements?noticeId=${noticeId}`;
    if (pathname === '/announcements' || pathname === '/notices') {
      const el = document.getElementById(`notice-${noticeId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      router.push(targetUrl);
    }
  };

  const recentNotices = notices.slice(0, 8);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button with Unread Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-full p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer focus:outline-none"
        aria-label="Notifications"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />

        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-sm animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel (~340px max-width) */}
      {isOpen && (
        <div className="absolute right-0 top-11 z-50 w-80 sm:w-[340px] max-w-[340px] rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150 text-slate-900 dark:text-slate-100">
          
          {/* Header Row */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                Notifications
              </h4>
              {unreadCount > 0 && (
                <span className="rounded-full bg-indigo-100 dark:bg-indigo-950/80 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* List of Recent Notices */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {recentNotices.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No notifications available
              </div>
            ) : (
              recentNotices.map((n) => {
                const read = isRead(n.id);
                return (
                  <button
                    key={n.id}
                    onClick={() => handleSelectNotice(n.id)}
                    className={`w-full text-left flex items-start gap-3 p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${
                      !read ? 'bg-indigo-50/30 dark:bg-indigo-950/20' : ''
                    }`}
                  >
                    {/* Unread Dot Indicator */}
                    <div className="mt-1 shrink-0">
                      {!read ? (
                        <span className="block w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                      ) : (
                        <span className="block w-2 h-2 rounded-full bg-transparent" />
                      )}
                    </div>

                    {/* Notice Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <p
                          className={`text-xs truncate ${
                            !read
                              ? 'font-bold text-slate-900 dark:text-white'
                              : 'font-medium text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {n.title}
                        </p>
                        <span className="text-[10px] text-slate-400 shrink-0 ml-1">
                          {formatRelativeTime(n.createdAt)}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-tight">
                        {n.body || n.content}
                      </p>

                      <div className="mt-1.5 flex items-center gap-2">
                        <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.2 rounded border border-slate-200 dark:border-slate-700 text-slate-500 font-medium">
                          {n.category}
                        </span>
                        {n.clubName && (
                          <span className="text-[10px] text-slate-400 truncate">
                            {n.clubName}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
