'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { CLUBS_DATA } from '@/lib/clubs-data';
import {
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, MapPin, Clock,
  ArrowRight, List, LayoutGrid, Rows3
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import EventDetailsModal from '@/components/EventDetailsModal';
import MultipleEventsModal from '@/components/MultipleEventsModal';

// ─── Data-driven club color mapping ────────────────────────────────
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

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const VIEW_TABS = [
  { id: 'month', label: 'Month', icon: LayoutGrid },
  { id: 'week', label: 'Week', icon: Rows3 },
  { id: 'list', label: 'List', icon: List },
];

// ─── Event Pill Component (Plain text label preceded by a 6px colored dot) ───
function EventPill({
  ev,
  clubLookup,
  onClick,
}: {
  ev: any;
  clubLookup: (slug?: string) => any;
  onClick?: () => void;
}) {
  const club = clubLookup(ev.clubId?.slug);
  const accent = club
    ? CLUB_ACCENT[club.slug] || CLUB_ACCENT['microsoft-club']
    : CLUB_ACCENT['microsoft-club'];

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick();
      }}
      className="w-full text-left py-0.5 px-1 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium truncate flex items-center gap-1.5 cursor-pointer bg-transparent transition-colors rounded"
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: accent.bg }}
      />
      <span className="truncate leading-tight">{ev.title}</span>
    </button>
  );
}

// ─── Main Calendar Page ────────────────────────────────────────────────────────
export default function CalendarPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'list'>('month');
  const [activeClubs, setActiveClubs] = useState<Set<string>>(
    new Set(CLUBS_DATA.map((c) => c.slug))
  );
  const [direction, setDirection] = useState<1 | -1>(1);
  const [animKey, setAnimKey] = useState(0);

  // Modal State
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [multipleEventsData, setMultipleEventsData] = useState<{
    events: any[];
    dateLabel: string;
  } | null>(null);

  const handleDateCellClick = (dayEvents: any[], dateLabel: string) => {
    if (!dayEvents || dayEvents.length === 0) return;
    if (dayEvents.length === 1) {
      setSelectedEvent(dayEvents[0]);
    } else {
      setMultipleEventsData({ events: dayEvents, dateLabel });
    }
  };

  useEffect(() => {
    fetch('/api/events')
      .then((r) => r.json())
      .then((d) => {
        setEvents(d.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const navigate = (dir: 1 | -1) => {
    setDirection(dir);
    setAnimKey((k) => k + 1);
    setCurrentDate(new Date(year, month + dir, 1));
  };

  const goToday = () => {
    const t = new Date();
    setDirection(t > currentDate ? 1 : -1);
    setAnimKey((k) => k + 1);
    setCurrentDate(new Date(t.getFullYear(), t.getMonth(), 1));
  };

  const getClub = (slug?: string) =>
    slug ? CLUBS_DATA.find((c) => c.slug === slug) : undefined;

  const filteredEvents = events.filter((e) => {
    const slug = e.clubId?.slug;
    return !slug || activeClubs.has(slug);
  });

  const toggleClub = (slug: string) => {
    setActiveClubs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        if (next.size > 1) next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  };

  // Upcoming events (next 14 days)
  const upcomingEvents = [...events]
    .filter((e) => {
      const d = new Date(e.date);
      const diff = (d.getTime() - today.getTime()) / 86400000;
      return diff >= 0 && diff <= 14;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  // This Month Stats
  const thisMonthEvents = events.filter((e) => {
    const d = new Date(e.date);
    return d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth();
  });

  const clubCounts = thisMonthEvents.reduce<Record<string, number>>((acc, e) => {
    const slug = e.clubId?.slug;
    if (slug) acc[slug] = (acc[slug] || 0) + 1;
    return acc;
  }, {});
  const mostActiveSlug = Object.entries(clubCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
  const mostActiveClub = mostActiveSlug ? getClub(mostActiveSlug) : null;

  // Week stats
  const weekCounts: Record<number, number> = {};
  thisMonthEvents.forEach((e) => {
    const week = Math.ceil(new Date(e.date).getDate() / 7);
    weekCounts[week] = (weekCounts[week] || 0) + 1;
  });
  const busiestWeek = Object.entries(weekCounts).sort((a, b) => +b[1] - +a[1])[0]?.[0];

  // List View Events
  const listEvents = [...filteredEvents]
    .filter((e) => {
      const d = new Date(e.date);
      return d.getFullYear() === year && d.getMonth() === month;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Week View Events
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });
  const weekEvents = filteredEvents.filter((e) => {
    const d = new Date(e.date);
    return d >= weekStart && d <= weekDays[6];
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* ─── 1. Plain Page Header (Clean, professional header) ─── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/90 dark:border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">
              Event Calendar
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-normal">
              Interactive campus event timetable color-coded by club
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Outlined View Toggle */}
            <div className="flex items-center gap-1">
              {VIEW_TABS.map(({ id, label }) => {
                const isActive = view === id;
                return (
                  <button
                    key={id}
                    onClick={() => setView(id as any)}
                    className={`px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                      isActive
                        ? 'border-2 border-slate-900 dark:border-slate-100 text-slate-900 dark:text-slate-100 font-semibold bg-white dark:bg-slate-900'
                        : 'border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-white dark:bg-slate-900'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Outlined Today Button */}
            <button
              onClick={goToday}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 bg-white dark:bg-slate-900 transition-colors cursor-pointer"
            >
              Today
            </button>

            {/* Month Navigator */}
            <div className="flex items-center gap-1.5 ml-1">
              <button
                onClick={() => navigate(-1)}
                className="h-8 w-8 flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white min-w-[130px] text-center">
                {MONTH_NAMES[month]} {year}
              </span>
              <button
                onClick={() => navigate(1)}
                className="h-8 w-8 flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ─── 2. Outlined Club Filter Pills ─── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {/* All Clubs Filter Pill */}
          <button
            onClick={() => setActiveClubs(new Set(CLUBS_DATA.map((c) => c.slug)))}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
              activeClubs.size === CLUBS_DATA.length
                ? 'border-2 border-slate-900 dark:border-slate-100 text-slate-900 dark:text-slate-100 font-semibold bg-white dark:bg-slate-900'
                : 'border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-white dark:bg-slate-900'
            }`}
          >
            All Clubs
          </button>

          {CLUBS_DATA.map((club) => {
            const accent = CLUB_ACCENT[club.slug] || CLUB_ACCENT['microsoft-club'];
            const active = activeClubs.has(club.slug);

            return (
              <button
                key={club.slug}
                onClick={() => toggleClub(club.slug)}
                className={`flex items-center gap-1.5 flex-shrink-0 px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                  active
                    ? 'border-2 border-slate-900 dark:border-slate-100 text-slate-900 dark:text-slate-100 font-semibold bg-white dark:bg-slate-900'
                    : 'border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-white dark:bg-slate-900'
                }`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: accent.bg }}
                />
                <span>{club.name}</span>
              </button>
            );
          })}
        </div>

        {/* ─── 3. Main Content Grid (Calendar Grid + Sidebar) ─── */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Calendar Grid Container */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 h-[520px] animate-pulse" />
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-none">
                
                {/* MONTH VIEW */}
                {view === 'month' && (
                  <>
                    <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30">
                      {DAY_NAMES.map((d) => (
                        <div
                          key={d}
                          className="py-2.5 text-center text-[11px] font-medium text-slate-400 uppercase tracking-wider"
                        >
                          {d}
                        </div>
                      ))}
                    </div>

                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={animKey}
                        initial={{ opacity: 0, x: direction * 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -direction * 20 }}
                        transition={{ duration: 0.18, ease: 'easeInOut' }}
                        className="grid grid-cols-7 divide-x divide-y divide-slate-100 dark:divide-slate-800/60"
                      >
                        {/* Empty day cells before month start */}
                        {Array.from({ length: firstDay }).map((_, i) => (
                          <div key={`empty-${i}`} className="min-h-[105px] bg-slate-50/30 dark:bg-slate-900/40 p-2" />
                        ))}

                        {/* Month day cells */}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                          const dayNum = i + 1;
                          const isToday =
                            today.getFullYear() === year &&
                            today.getMonth() === month &&
                            today.getDate() === dayNum;

                          const dayEvents = filteredEvents.filter((e) => {
                            const d = new Date(e.date);
                            return (
                              d.getFullYear() === year &&
                              d.getMonth() === month &&
                              d.getDate() === dayNum
                            );
                          });

                          const shown = dayEvents.slice(0, 2);
                          const overflow = dayEvents.length - shown.length;
                          const dateLabel = `${MONTH_NAMES[month]} ${dayNum}, ${year}`;

                          return (
                            <div
                              key={dayNum}
                              onClick={() =>
                                dayEvents.length > 0 &&
                                handleDateCellClick(dayEvents, dateLabel)
                              }
                              className={`min-h-[105px] p-2 flex flex-col transition-colors duration-150 group ${
                                dayEvents.length > 0
                                  ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40'
                                  : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/20'
                              } ${
                                isToday
                                  ? 'bg-slate-50/90 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80'
                                  : 'bg-transparent'
                              }`}
                            >
                              {/* Date Number */}
                              <div className="flex items-center justify-between mb-1.5">
                                {isToday ? (
                                  <span className="text-[10px] font-semibold text-slate-900 dark:text-white px-1.5 py-0.2 rounded bg-slate-200/80 dark:bg-slate-700">
                                    Today
                                  </span>
                                ) : (
                                  <span />
                                )}
                                <span
                                  className={`text-xs font-semibold ${
                                    isToday
                                      ? 'text-slate-900 dark:text-white font-bold'
                                      : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                                  }`}
                                >
                                  {dayNum}
                                </span>
                              </div>

                              {/* Plain Text Event Labels with 6px Colored Dot */}
                              <div className="space-y-1 flex-1">
                                {shown.map((ev) => (
                                  <EventPill
                                    key={ev._id || ev.id}
                                    ev={ev}
                                    clubLookup={getClub}
                                    onClick={() => setSelectedEvent(ev)}
                                  />
                                ))}

                                {overflow > 0 && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDateCellClick(dayEvents, dateLabel);
                                    }}
                                    className="text-[10px] font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white pl-1 cursor-pointer"
                                  >
                                    +{overflow} more
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </motion.div>
                    </AnimatePresence>
                  </>
                )}

                {/* WEEK VIEW */}
                {view === 'week' && (
                  <div>
                    <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                      {weekDays.map((d) => {
                        const isT = d.toDateString() === today.toDateString();
                        return (
                          <div
                            key={d.toString()}
                            className={`py-2.5 text-center ${
                              isT ? 'bg-slate-100/80 dark:bg-slate-800/60 font-semibold' : ''
                            }`}
                          >
                            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                              {DAY_NAMES[d.getDay()]}
                            </span>
                            <span className="text-xs font-semibold text-slate-900 dark:text-white mt-0.5 block">
                              {d.getDate()}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="grid grid-cols-7 divide-x divide-slate-100 dark:divide-slate-800/60 min-h-[380px]">
                      {weekDays.map((d) => {
                        const isT = d.toDateString() === today.toDateString();
                        const dayEvs = weekEvents.filter(
                          (e) => new Date(e.date).toDateString() === d.toDateString()
                        );
                        const dateLabel = d.toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        });

                        return (
                          <div
                            key={d.toString()}
                            onClick={() =>
                              dayEvs.length > 0 && handleDateCellClick(dayEvs, dateLabel)
                            }
                            className={`p-2 transition-colors ${
                              dayEvs.length > 0
                                ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40'
                                : 'hover:bg-slate-50/50'
                            } ${isT ? 'bg-slate-50/80 dark:bg-slate-800/30' : ''}`}
                          >
                            <div className="space-y-1">
                              {dayEvs.map((ev) => (
                                <EventPill
                                  key={ev._id || ev.id}
                                  ev={ev}
                                  clubLookup={getClub}
                                  onClick={() => setSelectedEvent(ev)}
                                />
                              ))}
                              {dayEvs.length === 0 && (
                                <div className="h-6 rounded bg-transparent" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* LIST VIEW */}
                {view === 'list' && (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {listEvents.length === 0 && (
                      <div className="py-16 text-center text-slate-400 text-xs">
                        No events found for this month.
                      </div>
                    )}
                    {listEvents.map((ev) => {
                      const club = getClub(ev.clubId?.slug);
                      const accent = club
                        ? CLUB_ACCENT[club.slug] || CLUB_ACCENT['microsoft-club']
                        : CLUB_ACCENT['microsoft-club'];
                      const evDate = new Date(ev.date);

                      return (
                        <div
                          key={ev._id || ev.id}
                          onClick={() => setSelectedEvent(ev)}
                          className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            {/* Date Badge */}
                            <div className="text-center shrink-0 w-12 py-1 px-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                              <span className="block text-xs font-bold text-slate-900 dark:text-white leading-tight">
                                {evDate.getDate()}
                              </span>
                              <span className="block text-[10px] font-medium text-slate-400 uppercase leading-none mt-0.5">
                                {MONTH_NAMES[evDate.getMonth()].slice(0, 3)}
                              </span>
                            </div>

                            {/* Title & Metadata */}
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span
                                  className="w-1.5 h-1.5 rounded-full shrink-0"
                                  style={{ backgroundColor: accent.bg }}
                                />
                                <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                                  {ev.title}
                                </h4>
                              </div>

                              <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  {evDate.toLocaleTimeString('en-IN', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                                {ev.venue && (
                                  <span className="flex items-center gap-1 truncate">
                                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                    <span className="truncate">{ev.venue}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEvent(ev);
                            }}
                            className="text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0 cursor-pointer"
                          >
                            View details
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ─── 4. Simplified Sidebar Cards (var(--surface-2) Style) ─── */}
          <div className="w-full lg:w-72 shrink-0 space-y-4">
            
            {/* Card 1: Compact "This Month at a Glance" */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-none space-y-3">
              <h3 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                This Month at a Glance
              </h3>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div className="bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-lg p-2.5">
                  <span className="text-[10px] uppercase font-medium text-slate-400 block mb-0.5">
                    Total Events
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {thisMonthEvents.length}
                  </span>
                </div>

                <div className="bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-lg p-2.5">
                  <span className="text-[10px] uppercase font-medium text-slate-400 block mb-0.5">
                    Busiest Week
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {busiestWeek ? `Week ${busiestWeek}` : '—'}
                  </span>
                </div>
              </div>

              {mostActiveClub && (
                <div className="bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-lg p-2.5">
                  <span className="text-[10px] uppercase font-medium text-slate-400 block mb-0.5">
                    Most Active Club
                  </span>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white block truncate">
                    {mostActiveClub.name}
                  </span>
                </div>
              )}
            </div>

            {/* Card 2: "Upcoming Events" */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-none space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                  Upcoming Events
                </h3>
                <span className="text-[10px] text-slate-400 font-medium">Next 14 days</span>
              </div>

              {upcomingEvents.length === 0 ? (
                <p className="text-xs text-slate-400 py-2">No upcoming events scheduled.</p>
              ) : (
                <div className="space-y-2 divide-y divide-slate-100 dark:divide-slate-800/60">
                  {upcomingEvents.map((ev) => {
                    const club = getClub(ev.clubId?.slug);
                    const accent = club
                      ? CLUB_ACCENT[club.slug] || CLUB_ACCENT['microsoft-club']
                      : CLUB_ACCENT['microsoft-club'];
                    const d = new Date(ev.date);

                    return (
                      <button
                        key={ev._id || ev.id}
                        onClick={() => setSelectedEvent(ev)}
                        className="w-full text-left pt-2 first:pt-0 group flex items-start gap-2.5 cursor-pointer"
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5"
                          style={{ backgroundColor: accent.bg }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                            {ev.title}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {MONTH_NAMES[d.getMonth()].slice(0, 3)} {d.getDate()} •{' '}
                            {d.toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="pt-1 border-t border-slate-100 dark:border-slate-800/80">
                <Link
                  href="/events"
                  className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <span>View all events</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 5. Modal Details & Multiple Events Popups ─── */}
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          clubLookup={getClub}
        />

        <MultipleEventsModal
          events={multipleEventsData?.events || []}
          dateLabel={multipleEventsData?.dateLabel || ''}
          onClose={() => setMultipleEventsData(null)}
          onSelectEvent={(ev) => {
            setMultipleEventsData(null);
            setSelectedEvent(ev);
          }}
          clubLookup={getClub}
        />
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-400 mt-12">
        <p>© 2026 Bhubaneswar Engineering College — BEC Club Hub. All rights reserved.</p>
      </footer>
    </div>
  );
}
