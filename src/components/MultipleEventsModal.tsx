'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar as CalendarIcon, Clock, MapPin, ChevronRight } from 'lucide-react';
import { CalendarEvent, CLUB_ACCENT } from './EventDetailsModal';

interface MultipleEventsModalProps {
  events: CalendarEvent[];
  dateLabel: string;
  onSelectEvent: (event: CalendarEvent) => void;
  onClose: () => void;
  clubLookup?: (slug?: string) => any;
}

export default function MultipleEventsModal({
  events,
  dateLabel,
  onSelectEvent,
  onClose,
  clubLookup,
}: MultipleEventsModalProps) {
  if (!events || events.length === 0) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-6 shadow-xl text-slate-900 dark:text-slate-100 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Events on {dateLabel}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {events.length} campus events scheduled
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* List of Events */}
          <div className="space-y-2.5 max-h-80 overflow-y-auto">
            {events.map((ev, idx) => {
              const clubSlug =
                typeof ev.clubId === 'object' ? ev.clubId?.slug : (ev.clubId as string);
              const club = clubLookup ? clubLookup(clubSlug) : null;
              const clubName = club?.name || ev.clubName || 'BEC Club';

              const accent = (clubSlug && CLUB_ACCENT[clubSlug]) || {
                bg: '#2563EB',
                text: '#fff',
                border: '#2563EB',
                chip: '#EFF6FF',
              };

              const eventDate = new Date(ev.date);
              const formattedTime =
                ev.startTime ||
                (!isNaN(eventDate.getTime())
                  ? eventDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
                  : '10:00 AM');

              return (
                <button
                  key={ev.id || ev._id || idx}
                  onClick={() => onSelectEvent(ev)}
                  className="w-full text-left p-3.5 rounded-lg border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/60 dark:hover:bg-slate-800/80 transition-all flex items-center justify-between gap-3 group cursor-pointer"
                >
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: accent.bg }}
                      />
                      <span
                        className="text-[10px] font-semibold uppercase tracking-wider"
                        style={{ color: accent.bg }}
                      >
                        {clubName}
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {ev.title}
                    </h4>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {formattedTime}
                      </span>
                      {ev.venue && (
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{ev.venue}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors shrink-0" />
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
