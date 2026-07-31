'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, Pin, CheckCircle2, Megaphone } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useNotices } from '@/hooks/useNotices';
import NoticeCard from './NoticeCard';
import { NoticeCategory } from '@/types/notice';
import { useAuth } from '@/lib/AuthContext';

const FILTER_CATEGORIES: { id: string; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'general', label: 'General' },
  { id: 'urgent', label: 'Urgent' },
  { id: 'challenge', label: 'Challenge' },
  { id: 'event', label: 'Event' },
  { id: 'achievement', label: 'Achievement' },
  { id: 'deadline', label: 'Deadline' },
];

export default function NoticeBoard() {
  const { user } = useAuth();
  const {
    notices,
    loading,
    markAsRead,
    markAllAsRead,
    togglePin,
    isRead,
    isPinned,
    addNotice,
  } = useNotices();

  const searchParams = useSearchParams();
  const targetNoticeId = searchParams.get('noticeId');

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // New notice form state
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newCategory, setNewCategory] = useState<NoticeCategory>('general');

  // Scroll to notice if noticeId present in query param
  useEffect(() => {
    if (targetNoticeId && !loading) {
      setTimeout(() => {
        const el = document.getElementById(`notice-${targetNoticeId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [targetNoticeId, loading]);

  // Filter notices by search query and category
  const filteredNotices = notices.filter((n) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.body && n.body.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (n.content && n.content.toLowerCase().includes(searchQuery.toLowerCase()));

    const catNormalized = (n.category || n.priority || '').toString().toLowerCase();
    const matchesCategory =
      activeCategory === 'all' || catNormalized === activeCategory;

    return matchesSearch && matchesCategory;
  });

  // Pinned notices appear at top regardless of date
  const sortedNotices = [...filteredNotices].sort((a, b) => {
    const aPinned = isPinned(a.id);
    const bPinned = isPinned(b.id);
    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) return;

    await addNotice({
      title: newTitle.trim(),
      body: newBody.trim(),
      content: newBody.trim(),
      category: newCategory,
      priority: newCategory,
      author: user?.name || 'Academic Cell',
    });

    setNewTitle('');
    setNewBody('');
    setNewCategory('general');
    setShowCreateModal(false);
  };

  const isStaffOrAdmin =
    user && ['Admin', 'ClubHead', 'Faculty'].includes(user.role);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-900 dark:text-slate-100">
      
      {/* ─── 1. Plain Page Header (No purple hero) ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200/90 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">
            Announcements
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Official campus notices, club updates, and urgent announcements
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isStaffOrAdmin && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Post Notice</span>
            </button>
          )}

          <button
            onClick={markAllAsRead}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Mark all read</span>
          </button>
        </div>
      </div>

      {/* ─── 2. Search & Outlined Filter Pills Bar ─── */}
      <div className="space-y-3">
        {/* Search Input */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search announcements by keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 dark:focus:border-slate-600 transition-colors"
          />
        </div>

        {/* Filter Pills (Outlined style, active gets solid border, no filled background) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {FILTER_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-2 border-slate-900 dark:border-slate-100 text-slate-900 dark:text-slate-100 font-semibold bg-white dark:bg-slate-900'
                    : 'border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-white dark:bg-slate-900'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── 3. Notices List ─── */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 animate-pulse space-y-3"
            >
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
              <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-2/3" />
              <div className="h-12 bg-slate-50 dark:bg-slate-800/50 rounded" />
            </div>
          ))}
        </div>
      ) : sortedNotices.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
          <Megaphone className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            No announcements found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No notices match your selected category or search term. Try switching filters or search keywords.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedNotices.map((notice) => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              isPinned={isPinned(notice.id)}
              isRead={isRead(notice.id)}
              onRead={markAsRead}
              onPin={togglePin}
            />
          ))}
        </div>
      )}

      {/* ─── Create Notice Modal (Admin / Club Head) ─── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Post New Announcement
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="Notice title..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as NoticeCategory)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:border-slate-400"
                >
                  <option value="general">General</option>
                  <option value="urgent">Urgent</option>
                  <option value="challenge">Challenge</option>
                  <option value="event">Event</option>
                  <option value="achievement">Achievement</option>
                  <option value="deadline">Deadline</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Content Body
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Full announcement details..."
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:border-slate-400 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:bg-slate-800 transition-colors"
                >
                  Broadcast Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
