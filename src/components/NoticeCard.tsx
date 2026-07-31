'use client';

import React, { useState } from 'react';
import { Pin, Volume2, VolumeX, CheckCircle, Clock } from 'lucide-react';
import { Notice, formatRelativeTime } from '@/types/notice';

export interface NoticeCardProps {
  notice: Notice;
  isPinned: boolean;
  isRead: boolean;
  onRead: (id: string) => void;
  onPin: (id: string) => void;
}

export default function NoticeCard({
  notice,
  isPinned,
  isRead,
  onRead,
  onPin,
}: NoticeCardProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isUrgent = notice.category === 'urgent' || notice.priority === 'Urgent';

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `${notice.title}. ${notice.body || notice.content}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div
      id={`notice-${notice.id}`}
      onClick={() => !isRead && onRead(notice.id)}
      className={`relative bg-white dark:bg-slate-900 rounded-xl p-5 border shadow-none transition-all duration-200 text-slate-900 dark:text-slate-100 ${
        isUrgent
          ? 'border-rose-300 dark:border-rose-900/60 bg-rose-50/10 dark:bg-rose-950/10'
          : 'border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      {/* Top Bar: Title + Category Pill + Pin Icon */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {/* Pinned Badge Icon */}
            {isPinned && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800/60">
                <Pin className="w-3 h-3 rotate-45 fill-amber-500/20" />
                <span>Pinned</span>
              </span>
            )}

            {/* Unread Dot */}
            {!isRead && (
              <span
                className="w-2 h-2 rounded-full bg-indigo-600 shrink-0"
                title="Unread announcement"
              />
            )}

            {/* Title */}
            <h3
              className={`text-base font-semibold leading-snug tracking-tight text-slate-900 dark:text-white ${
                !isRead ? 'font-bold' : ''
              }`}
            >
              {notice.title}
            </h3>
          </div>

          {/* Subtitle Metadata: Author / Club + Relative Timestamp */}
          <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 mt-1 flex-wrap">
            {notice.author && (
              <span className="font-medium text-slate-600 dark:text-slate-400">
                {notice.author}
              </span>
            )}
            {notice.author && notice.clubName && <span>•</span>}
            {notice.clubName && (
              <span className="text-slate-500 dark:text-slate-400">
                {notice.clubName}
              </span>
            )}
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-slate-400">
              <Clock className="w-3 h-3" />
              {formatRelativeTime(notice.createdAt)}
            </span>
          </div>
        </div>

        {/* Category Tag: Small Outlined Pill */}
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 shrink-0 capitalize">
          {notice.category}
        </span>
      </div>

      {/* Body Content */}
      <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed font-normal whitespace-pre-line">
        {notice.body || notice.content}
      </p>

      {/* Footer Action Bar */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-3">
          {/* Read Aloud Button */}
          <button
            onClick={handleSpeak}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs transition-colors cursor-pointer ${
              isSpeaking
                ? 'border-indigo-500 text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40'
                : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
            title="Read announcement aloud"
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-indigo-600" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                <span>Listen</span>
              </>
            )}
          </button>

          {/* Toggle Pin Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPin(notice.id);
            }}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs transition-colors cursor-pointer ${
              isPinned
                ? 'border-amber-300 text-amber-700 bg-amber-50 dark:border-amber-800 dark:text-amber-300 dark:bg-amber-950/40'
                : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
            title={isPinned ? 'Unpin notice' : 'Pin notice'}
          >
            <Pin className="w-3.5 h-3.5" />
            <span>{isPinned ? 'Unpin' : 'Pin'}</span>
          </button>
        </div>

        {/* Read / Unread Status Badge */}
        {isRead ? (
          <span className="inline-flex items-center gap-1 text-slate-400 text-xs">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            Read
          </span>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRead(notice.id);
            }}
            className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline cursor-pointer"
          >
            Mark as read
          </button>
        )}
      </div>
    </div>
  );
}
