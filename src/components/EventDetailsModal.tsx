'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar as CalendarIcon, Clock, MapPin, Users, ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';

export interface CalendarEvent {
  id?: string;
  _id?: string;
  title: string;
  clubId?: { slug?: string; name?: string } | string;
  clubName?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  venue?: string;
  description?: string;
  registeredCount?: number;
  registrationOpen?: boolean;
}

export const CLUB_ACCENT: Record<string, { bg: string; text: string; border: string; chip: string }> = {
  'microsoft-club': { bg: '#2563EB', text: '#fff', border: '#2563EB', chip: '#EFF6FF' },
  'music-dance-club': { bg: '#DB2777', text: '#fff', border: '#DB2777', chip: '#FDF2F8' },
  'event-management-club': { bg: '#D97706', text: '#fff', border: '#D97706', chip: '#FFFBEB' },
  'sports-health-club': { bg: '#059669', text: '#fff', border: '#059669', chip: '#ECFDF5' },
  'media-club': { bg: '#7C3AED', text: '#fff', border: '#7C3AED', chip: '#F5F3FF' },
  'startup-internship-club': { bg: '#EA580C', text: '#fff', border: '#EA580C', chip: '#FFF7ED' },
  'social-environmental-club': { bg: '#0D9488', text: '#fff', border: '#0D9488', chip: '#F0FDFA' },
  'placement-club': { bg: '#1D4ED8', text: '#fff', border: '#1D4ED8', chip: '#EFF6FF' },
};

interface EventDetailsModalProps {
  event: CalendarEvent | null;
  onClose: () => void;
  clubLookup?: (slug?: string) => any;
  onRegister?: (eventId: string) => void;
}

export default function EventDetailsModal({
  event,
  onClose,
  clubLookup,
  onRegister,
}: EventDetailsModalProps) {
  const [registered, setRegistered] = React.useState(false);

  if (!event) return null;

  // Extract club details
  const clubSlug =
    typeof event.clubId === 'object' ? event.clubId?.slug : (event.clubId as string);
  
  const club = clubLookup ? clubLookup(clubSlug) : null;
  const clubName = club?.name || event.clubName || 'BEC Campus Club';
  
  const accent = (clubSlug && CLUB_ACCENT[clubSlug]) || {
    bg: '#2563EB',
    text: '#fff',
    border: '#2563EB',
    chip: '#EFF6FF',
  };

  const eventDate = new Date(event.date);
  const formattedDate = isNaN(eventDate.getTime())
    ? event.date
    : eventDate.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });

  const formattedTime =
    event.startTime ||
    (!isNaN(eventDate.getTime())
      ? eventDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      : '10:00 AM');

  const timeRange = event.endTime ? `${formattedTime} - ${event.endTime}` : formattedTime;
  const venueText = event.venue || 'Campus Auditorium, Main Block';
  const attendeesCount = event.registeredCount ?? 42;
  const isRegistrationOpen = event.registrationOpen !== false;

  const defaultDescription =
    event.description ||
    `Join ${clubName} for an engaging session on campus. Connect with student peers, learn practical skills, and participate in interactive workshops. All BEC students are welcome to attend!`;

  const handleRegisterClick = () => {
    if (onRegister) {
      const evId = event.id || event._id || '';
      onRegister(evId);
    }
    setRegistered(true);
  };

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
          {/* Top Bar: Outlined Club Pill + Close (X) Icon */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border"
              style={{
                borderColor: accent.bg,
                color: accent.bg,
                backgroundColor: accent.bg + '10',
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: accent.bg }}
              />
              <span>{clubName}</span>
            </span>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Event Title (medium weight 16px, sentence case) */}
          <h3 className="text-base font-medium text-slate-900 dark:text-white leading-snug mb-4">
            {event.title}
          </h3>

          {/* Metadata Rows: Date/Time, Venue, Registered Attendees */}
          <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 pb-4 border-b border-slate-100 dark:border-slate-800">
            {/* Date & Time Row */}
            <div className="flex items-center gap-2.5">
              <CalendarIcon className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                {formattedDate} • {timeRange}
              </span>
            </div>

            {/* Venue Row */}
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="truncate">{venueText}</span>
            </div>

            {/* Host Club + Registered Attendees Row */}
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                Hosted by <strong className="font-semibold text-slate-800 dark:text-slate-200">{clubName}</strong> • {attendeesCount} registered attendees
              </span>
            </div>
          </div>

          {/* Short Event Description (2-3 sentences max) */}
          <div className="py-4">
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {defaultDescription}
            </p>
          </div>

          {/* Action Button at Bottom */}
          <div className="pt-2">
            {registered ? (
              <div className="w-full py-2.5 px-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Successfully Registered!</span>
              </div>
            ) : isRegistrationOpen ? (
              <button
                onClick={handleRegisterClick}
                className="w-full py-2.5 px-4 rounded-lg text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-none"
              >
                <span>Register for Event</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <Link
                href="/events"
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>View details</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
