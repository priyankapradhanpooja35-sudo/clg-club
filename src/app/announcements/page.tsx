'use client';

import React, { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import NoticeBoard from '@/components/NoticeBoard';

function AnnouncementsContent() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 dark:bg-slate-950">
      <Navbar />
      <main className="flex-1 py-4">
        <NoticeBoard />
      </main>
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-400">
        <p>© 2026 Bhubaneswar Engineering College — BEC Club Hub. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default function AnnouncementsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-400 text-xs">
        Loading announcements...
      </div>
    }>
      <AnnouncementsContent />
    </Suspense>
  );
}
