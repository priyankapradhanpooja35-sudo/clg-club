'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Notice, normalizeNotice } from '@/types/notice';
import { DUMMY_NOTICES } from '@/lib/notices-data';
import { useAuth } from '@/lib/AuthContext';

const LS_READ = 'bec_read_notices_v2';
const LS_PINNED = 'bec_pinned_notices_v2';
const POLL_INTERVAL_MS = 30000; // 30 seconds polling

interface NoticesContextType {
  notices: Notice[];
  unreadCount: number;
  loading: boolean;
  readNoticeIds: Set<string>;
  pinnedNoticeIds: Set<string>;
  markAsRead: (noticeId: string) => void;
  markAllAsRead: () => void;
  togglePin: (noticeId: string) => void;
  addNotice: (noticeData: Partial<Notice>) => Promise<Notice>;
  refetchNotices: () => Promise<void>;
  isRead: (noticeId: string) => boolean;
  isPinned: (noticeId: string) => boolean;
}

const NoticesContext = createContext<NoticesContextType | undefined>(undefined);

export function NoticesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [readNoticeIds, setReadNoticeIds] = useState<Set<string>>(new Set());
  const [pinnedNoticeIds, setPinnedNoticeIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<boolean>(true);

  // Load persisted read/pinned states on mount
  useEffect(() => {
    try {
      const storedRead = localStorage.getItem(LS_READ);
      if (storedRead) {
        setReadNoticeIds(new Set(JSON.parse(storedRead)));
      }
      const storedPinned = localStorage.getItem(LS_PINNED);
      if (storedPinned) {
        setPinnedNoticeIds(new Set(JSON.parse(storedPinned)));
      } else {
        // Default pinned notices demo
        setPinnedNoticeIds(new Set(['n001']));
      }
    } catch (e) {
      console.error('Error loading notices local state:', e);
    }
  }, []);

  // Sync to localStorage
  const saveReadState = (set: Set<string>) => {
    try {
      localStorage.setItem(LS_READ, JSON.stringify(Array.from(set)));
    } catch (e) {}
  };

  const savePinnedState = (set: Set<string>) => {
    try {
      localStorage.setItem(LS_PINNED, JSON.stringify(Array.from(set)));
    } catch (e) {}
  };

  // Convert raw DUMMY_NOTICES into normalized Notice objects
  const loadFallbackNotices = useCallback(() => {
    return DUMMY_NOTICES.map((raw) => {
      const norm = normalizeNotice(raw);
      if (pinnedNoticeIds.has(norm.id)) {
        norm.pinned = true;
      }
      return norm;
    });
  }, [pinnedNoticeIds]);

  // Fetch notices from API with fallback to DUMMY_NOTICES
  const fetchNotices = useCallback(async () => {
    try {
      const res = await fetch('/api/announcements');
      if (res.ok) {
        const json = await res.json();
        const apiData = json.data;
        if (Array.isArray(apiData) && apiData.length > 0) {
          const normalized = apiData.map((item) => normalizeNotice(item));
          
          // Combine with fallback to ensure rich initial state
          const existingIds = new Set(normalized.map((n) => n.id));
          const fallbacks = loadFallbackNotices().filter((f) => !existingIds.has(f.id));
          
          const combined = [...normalized, ...fallbacks];
          setNotices(combined);
          return;
        }
      }
    } catch (err) {
      // Ignore API fetch error, use fallback
    }

    setNotices(loadFallbackNotices());
  }, [loadFallbackNotices]);

  // Initial load
  useEffect(() => {
    let isMounted = true;
    fetchNotices().then(() => {
      if (isMounted) setLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, [fetchNotices]);

  // Polling every 30 seconds for background updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotices();
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [fetchNotices]);

  // Helper check
  const isRead = useCallback(
    (noticeId: string) => {
      if (user && user.id) {
        const notice = notices.find((n) => n.id === noticeId);
        if (notice?.readBy?.includes(user.id)) return true;
      }
      return readNoticeIds.has(noticeId);
    },
    [readNoticeIds, notices, user]
  );

  const isPinned = useCallback(
    (noticeId: string) => {
      const notice = notices.find((n) => n.id === noticeId);
      return notice?.pinned || pinnedNoticeIds.has(noticeId);
    },
    [pinnedNoticeIds, notices]
  );

  // Unread count calculation
  const unreadCount = notices.filter((n) => !isRead(n.id)).length;

  // Actions
  const markAsRead = useCallback(
    (noticeId: string) => {
      setReadNoticeIds((prev) => {
        const next = new Set(prev);
        next.add(noticeId);
        saveReadState(next);
        return next;
      });

      if (user && user.id) {
        setNotices((prev) =>
          prev.map((n) => {
            if (n.id === noticeId) {
              const currentRead = n.readBy || [];
              if (!currentRead.includes(user.id)) {
                return { ...n, readBy: [...currentRead, user.id] };
              }
            }
            return n;
          })
        );
      }
    },
    [user]
  );

  const markAllAsRead = useCallback(() => {
    const allIds = new Set(notices.map((n) => n.id));
    setReadNoticeIds((prev) => {
      const next = new Set([...Array.from(prev), ...Array.from(allIds)]);
      saveReadState(next);
      return next;
    });

    if (user && user.id) {
      setNotices((prev) =>
        prev.map((n) => {
          const currentRead = n.readBy || [];
          if (!currentRead.includes(user.id)) {
            return { ...n, readBy: [...currentRead, user.id] };
          }
          return n;
        })
      );
    }
  }, [notices, user]);

  const togglePin = useCallback((noticeId: string) => {
    setPinnedNoticeIds((prev) => {
      const next = new Set(prev);
      if (next.has(noticeId)) {
        next.delete(noticeId);
      } else {
        next.add(noticeId);
      }
      savePinnedState(next);
      return next;
    });

    setNotices((prev) =>
      prev.map((n) => (n.id === noticeId ? { ...n, pinned: !n.pinned } : n))
    );
  }, []);

  const addNotice = useCallback(
    async (noticeData: Partial<Notice>): Promise<Notice> => {
      const newNotice = normalizeNotice({
        ...noticeData,
        createdAt: new Date().toISOString(),
      });

      setNotices((prev) => [newNotice, ...prev]);

      // Attempt to save to API if available
      try {
        await fetch('/api/announcements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: newNotice.title,
            content: newNotice.body,
            priority: newNotice.category,
          }),
        });
      } catch (err) {}

      return newNotice;
    },
    []
  );

  return (
    <NoticesContext.Provider
      value={{
        notices,
        unreadCount,
        loading,
        readNoticeIds,
        pinnedNoticeIds,
        markAsRead,
        markAllAsRead,
        togglePin,
        addNotice,
        refetchNotices: fetchNotices,
        isRead,
        isPinned,
      }}
    >
      {children}
    </NoticesContext.Provider>
  );
}

export function useNotices() {
  const context = useContext(NoticesContext);
  if (!context) {
    throw new Error('useNotices must be used within a NoticesProvider');
  }
  return context;
}
