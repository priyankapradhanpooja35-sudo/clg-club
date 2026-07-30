'use client';
import { useEffect, useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import { CLUBS_DATA } from '@/lib/clubs-data';
import {
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, MapPin, Clock,
  ArrowRight, List, LayoutGrid, Rows3, TrendingUp, Users, Zap, X
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Soft muted accent palette (500-600 range) ────────────────────────────────
const CLUB_ACCENT: Record<string, { bg: string; text: string; border: string; chip: string }> = {
  'microsoft-club':        { bg: '#2563EB', text: '#fff', border: '#2563EB', chip: '#EFF6FF' },
  'music-dance-club':      { bg: '#DB2777', text: '#fff', border: '#DB2777', chip: '#FDF2F8' },
  'event-management-club': { bg: '#D97706', text: '#fff', border: '#D97706', chip: '#FFFBEB' },
  'sports-health-club':    { bg: '#059669', text: '#fff', border: '#059669', chip: '#ECFDF5' },
  'media-club':            { bg: '#7C3AED', text: '#fff', border: '#7C3AED', chip: '#F5F3FF' },
  'startup-internship-club':{ bg: '#EA580C', text: '#fff', border: '#EA580C', chip: '#FFF7ED' },
  'social-environmental-club':{ bg: '#0D9488', text: '#fff', border: '#0D9488', chip: '#F0FDFA' },
  'placement-club':        { bg: '#1D4ED8', text: '#fff', border: '#1D4ED8', chip: '#EFF6FF' },
};

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];
const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const VIEW_TABS = [
  { id: 'month', label: 'Month', icon: LayoutGrid },
  { id: 'week',  label: 'Week',  icon: Rows3 },
  { id: 'list',  label: 'List',  icon: List },
];

// ─── Tooltip Popover ──────────────────────────────────────────────────────────
function EventTooltip({ ev, club, onClose }: { ev: any; club: any; onClose: () => void }) {
  const accent = club ? (CLUB_ACCENT[club.slug] || CLUB_ACCENT['microsoft-club']) : CLUB_ACCENT['microsoft-club'];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.93, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.93, y: 6 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="absolute z-50 w-64 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/70 shadow-2xl shadow-slate-900/10 p-4 pointer-events-auto"
      style={{ top: '110%', left: '50%', transform: 'translateX(-50%)' }}
      onClick={e => e.stopPropagation()}
    >
      {/* Close */}
      <button onClick={onClose} className="absolute top-2.5 right-2.5 text-slate-400 hover:text-slate-600">
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Club tag */}
      <div className="flex items-center gap-2 mb-2">
        <span
          className="inline-block h-2.5 w-2.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: accent.bg }}
        />
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: accent.bg }}>
          {club?.name || 'BEC Club'}
        </span>
      </div>

      {/* Title */}
      <p className="text-sm font-bold text-slate-900 leading-snug mb-3">{ev.title}</p>

      {/* Meta */}
      <div className="space-y-1.5 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-[#2563EB] flex-shrink-0" />
          <span>{new Date(ev.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        {ev.venue && (
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#2563EB] flex-shrink-0" />
            <span className="truncate">{ev.venue}</span>
          </div>
        )}
      </div>

      {/* CTA */}
      <Link href="/events" className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:underline">
        View Details <ArrowRight className="w-3 h-3" />
      </Link>
    </motion.div>
  );
}

// ─── Event Pill ───────────────────────────────────────────────────────────────
function EventPill({ ev, clubLookup }: { ev: any; clubLookup: (slug: string) => any }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const club = clubLookup(ev.clubId?.slug);
  const accent = club ? (CLUB_ACCENT[club.slug] || CLUB_ACCENT['microsoft-club']) : CLUB_ACCENT['microsoft-club'];

  return (
    <div className="relative" onClick={e => e.stopPropagation()}>
      <button
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(v => !v)}
        className="w-full text-left rounded-md px-1.5 py-0.5 text-[10px] font-semibold truncate transition-transform hover:scale-[1.03] active:scale-95 select-none"
        style={{ backgroundColor: accent.bg + '18', color: accent.bg, border: `1px solid ${accent.bg}30` }}
      >
        {ev.title}
      </button>
      <AnimatePresence>
        {showTooltip && (
          <EventTooltip ev={ev} club={club} onClose={() => setShowTooltip(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CalendarPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'list'>('month');
  const [activeClubs, setActiveClubs] = useState<Set<string>>(
    new Set(CLUBS_DATA.map(c => c.slug))
  );
  const [direction, setDirection] = useState<1 | -1>(1);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    fetch('/api/events')
      .then(r => r.json())
      .then(d => { setEvents(d.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const navigate = (dir: 1 | -1) => {
    setDirection(dir);
    setAnimKey(k => k + 1);
    setCurrentDate(new Date(year, month + dir, 1));
  };

  const goToday = () => {
    const t = new Date();
    setDirection(t > currentDate ? 1 : -1);
    setAnimKey(k => k + 1);
    setCurrentDate(new Date(t.getFullYear(), t.getMonth(), 1));
  };

  const getClub = (slug: string) => CLUBS_DATA.find(c => c.slug === slug);

  const filteredEvents = events.filter(e => {
    const slug = e.clubId?.slug;
    return !slug || activeClubs.has(slug);
  });

  const toggleClub = (slug: string) => {
    setActiveClubs(prev => {
      const next = new Set(prev);
      if (next.has(slug)) { if (next.size > 1) next.delete(slug); }
      else next.add(slug);
      return next;
    });
  };

  // Upcoming events (next 7 days)
  const upcomingEvents = [...events]
    .filter(e => {
      const d = new Date(e.date);
      const diff = (d.getTime() - today.getTime()) / 86400000;
      return diff >= 0 && diff <= 14;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  // Stats
  const thisMonthEvents = events.filter(e => {
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
  thisMonthEvents.forEach(e => {
    const week = Math.ceil(new Date(e.date).getDate() / 7);
    weekCounts[week] = (weekCounts[week] || 0) + 1;
  });
  const busiestWeek = Object.entries(weekCounts).sort((a, b) => +b[1] - +a[1])[0]?.[0];

  // ── List View ──
  const listEvents = [...filteredEvents]
    .filter(e => {
      const d = new Date(e.date);
      return d.getFullYear() === year && d.getMonth() === month;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // ── Week View ──
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });
  const weekEvents = filteredEvents.filter(e => {
    const d = new Date(e.date);
    return d >= weekStart && d <= weekDays[6];
  });

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F8FAFC] pb-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-10">

          {/* ── HEADER ── */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-6">
            <div>
              <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                <CalendarIcon className="w-8 h-8 text-[#2563EB]" />
                Event Calendar
              </h1>
              <p className="text-slate-500 mt-1 text-sm">Interactive campus event timetable color-coded by club.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full border border-slate-200">
                {VIEW_TABS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setView(id as any)}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                      view === id
                        ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-500/30'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" /> {label}
                  </button>
                ))}
              </div>

              {/* Today button */}
              <button
                onClick={goToday}
                className="px-4 py-2 rounded-full text-xs font-bold border border-[#2563EB]/30 text-[#2563EB] bg-[#EFF6FF] hover:bg-blue-100 transition-all duration-200"
              >
                Today
              </button>

              {/* Month Navigator */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(-1)}
                  className="h-8 w-8 flex items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-[#EFF6FF] hover:text-[#2563EB] hover:border-blue-200 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-base font-bold text-slate-900 min-w-[148px] text-center">
                  {MONTH_NAMES[month]} {year}
                </span>
                <button
                  onClick={() => navigate(1)}
                  className="h-8 w-8 flex items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-[#EFF6FF] hover:text-[#2563EB] hover:border-blue-200 transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* ── CLUB FILTER CHIPS ── */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => setActiveClubs(new Set(CLUBS_DATA.map(c => c.slug)))}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 ${
                activeClubs.size === CLUBS_DATA.length
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
              }`}
            >
              All Clubs
            </button>
            {CLUBS_DATA.map(club => {
              const accent = CLUB_ACCENT[club.slug] || CLUB_ACCENT['microsoft-club'];
              const active = activeClubs.has(club.slug);
              return (
                <button
                  key={club.slug}
                  onClick={() => toggleClub(club.slug)}
                  className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200`}
                  style={{
                    backgroundColor: active ? accent.bg + '18' : '#fff',
                    borderColor: active ? accent.bg + '60' : '#E2E8F0',
                    color: active ? accent.bg : '#64748B',
                  }}
                >
                  <span
                    className="h-2 w-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: active ? accent.bg : '#CBD5E1' }}
                  />
                  {club.name}
                </button>
              );
            })}
          </div>

          {/* ── MAIN LAYOUT: Calendar + Side Panel ── */}
          <div className="flex flex-col xl:flex-row gap-6">

            {/* ── CALENDAR AREA ── */}
            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_4px_24px_rgba(0,0,0,0.06)] h-[600px] animate-pulse" />
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden">

                  {/* ─── MONTH VIEW ─── */}
                  {view === 'month' && (
                    <>
                      {/* Weekday headers */}
                      <div className="grid grid-cols-7 border-b border-slate-100">
                        {DAY_NAMES.map(d => (
                          <div key={d} className="py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                            {d}
                          </div>
                        ))}
                      </div>

                      {/* Animated grid */}
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                          key={animKey}
                          initial={{ opacity: 0, x: direction * 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -direction * 30 }}
                          transition={{ duration: 0.22, ease: 'easeInOut' }}
                          className="grid grid-cols-7 divide-x divide-y divide-slate-100"
                        >
                          {/* Empty cells */}
                          {Array.from({ length: firstDay }).map((_, i) => (
                            <div key={`e-${i}`} className="min-h-28 bg-slate-50/60 p-2" />
                          ))}

                          {/* Day cells */}
                          {Array.from({ length: daysInMonth }).map((_, i) => {
                            const dayNum = i + 1;
                            const isToday =
                              today.getFullYear() === year &&
                              today.getMonth() === month &&
                              today.getDate() === dayNum;

                            const dayEvents = filteredEvents.filter(e => {
                              const d = new Date(e.date);
                              return d.getFullYear() === year && d.getMonth() === month && d.getDate() === dayNum;
                            });

                            const shown = dayEvents.slice(0, 2);
                            const overflow = dayEvents.length - shown.length;

                            return (
                              <div
                                key={dayNum}
                                className={`min-h-28 p-2 flex flex-col transition-colors duration-150 hover:bg-blue-50/40 group ${
                                  isToday ? 'bg-blue-50/70 ring-2 ring-inset ring-[#2563EB]/40' : 'bg-white'
                                }`}
                              >
                                {/* Date number */}
                                <div className="flex justify-end mb-1">
                                  <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                                    isToday
                                      ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-500/30'
                                      : 'text-slate-400 group-hover:text-slate-600'
                                  }`}>
                                    {dayNum}
                                  </span>
                                </div>

                                {/* Event pills */}
                                <div className="space-y-0.5 flex-1">
                                  {shown.map(ev => (
                                    <EventPill key={ev._id} ev={ev} clubLookup={getClub} />
                                  ))}
                                  {overflow > 0 && (
                                    <button className="text-[10px] font-semibold text-[#2563EB] hover:underline pl-1">
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

                  {/* ─── WEEK VIEW ─── */}
                  {view === 'week' && (
                    <div>
                      <div className="grid grid-cols-7 border-b border-slate-100">
                        {weekDays.map(d => {
                          const isT = d.toDateString() === today.toDateString();
                          return (
                            <div key={d.toString()} className={`py-3 text-center ${isT ? 'bg-blue-50/70' : ''}`}>
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                                {DAY_NAMES[d.getDay()]}
                              </span>
                              <span className={`inline-flex h-7 w-7 mt-1 mx-auto items-center justify-center rounded-full text-sm font-black ${
                                isT ? 'bg-[#2563EB] text-white' : 'text-slate-600'
                              }`}>
                                {d.getDate()}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="grid grid-cols-7 divide-x divide-slate-100 min-h-[400px]">
                        {weekDays.map(d => {
                          const isT = d.toDateString() === today.toDateString();
                          const dayEvs = weekEvents.filter(e => new Date(e.date).toDateString() === d.toDateString());
                          return (
                            <div key={d.toString()} className={`p-2 ${isT ? 'bg-blue-50/40' : 'hover:bg-slate-50'} transition-colors`}>
                              <div className="space-y-1">
                                {dayEvs.map(ev => (
                                  <EventPill key={ev._id} ev={ev} clubLookup={getClub} />
                                ))}
                                {dayEvs.length === 0 && (
                                  <div className="h-6 rounded bg-slate-100/0" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ─── LIST VIEW ─── */}
                  {view === 'list' && (
                    <div className="divide-y divide-slate-100">
                      {listEvents.length === 0 && (
                        <div className="py-20 text-center text-slate-400 text-sm">No events this month.</div>
                      )}
                      {listEvents.map(ev => {
                        const club = getClub(ev.clubId?.slug);
                        const accent = club ? (CLUB_ACCENT[club.slug] || CLUB_ACCENT['microsoft-club']) : CLUB_ACCENT['microsoft-club'];
                        return (
                          <div key={ev._id} className="flex items-start gap-4 px-5 py-4 hover:bg-slate-50/80 transition-colors group">
                            {/* Date badge */}
                            <div className="flex-shrink-0 text-center min-w-[48px]">
                              <span className="block text-xl font-black text-slate-800">{new Date(ev.date).getDate()}</span>
                              <span className="block text-[10px] font-bold text-slate-400 uppercase">{MONTH_NAMES[new Date(ev.date).getMonth()].slice(0,3)}</span>
                            </div>
                            {/* Color stripe */}
                            <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ backgroundColor: accent.bg }} />
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-sm text-slate-900 truncate">{ev.title}</p>
                              <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-400">
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(ev.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                                {ev.venue && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{ev.venue}</span>}
                                <span className="font-semibold" style={{ color: accent.bg }}>{club?.name}</span>
                              </div>
                            </div>
                            <Link href="/events" className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              <ArrowRight className="w-4 h-4 text-[#2563EB]" />
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── SIDE PANEL ── */}
            <div className="xl:w-80 flex-shrink-0 space-y-5">

              {/* Stats row */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_4px_24px_rgba(0,0,0,0.05)] p-5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">This Month at a Glance</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#EFF6FF]">
                    <div className="h-8 w-8 rounded-lg bg-[#2563EB] flex items-center justify-center flex-shrink-0">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xl font-black text-[#2563EB]">{thisMonthEvents.length}</p>
                      <p className="text-[10px] font-semibold text-slate-500">Total Events</p>
                    </div>
                  </div>
                  {mostActiveClub && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                      <div className="h-8 w-8 rounded-lg bg-slate-200 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-4 h-4 text-slate-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-slate-900 truncate">{mostActiveClub.name}</p>
                        <p className="text-[10px] font-semibold text-slate-500">Most Active Club</p>
                      </div>
                    </div>
                  )}
                  {busiestWeek && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                      <div className="h-8 w-8 rounded-lg bg-slate-200 flex items-center justify-center flex-shrink-0">
                        <Users className="w-4 h-4 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">Week {busiestWeek}</p>
                        <p className="text-[10px] font-semibold text-slate-500">Busiest Week</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Upcoming events */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_4px_24px_rgba(0,0,0,0.05)] p-5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Upcoming Events</h3>
                {upcomingEvents.length === 0 ? (
                  <p className="text-sm text-slate-400">No upcoming events in the next 14 days.</p>
                ) : (
                  <div className="space-y-3">
                    {upcomingEvents.map(ev => {
                      const club = getClub(ev.clubId?.slug);
                      const accent = club ? (CLUB_ACCENT[club.slug] || CLUB_ACCENT['microsoft-club']) : CLUB_ACCENT['microsoft-club'];
                      const d = new Date(ev.date);
                      const isToday2 = d.toDateString() === today.toDateString();
                      return (
                        <div
                          key={ev._id}
                          className="flex gap-3 rounded-xl border border-slate-100 p-3 hover:border-blue-100 hover:bg-blue-50/30 transition-all group"
                          style={{ borderLeft: `3px solid ${accent.bg}` }}
                        >
                          <div className="flex-shrink-0 text-center min-w-[36px]">
                            <span className="block text-base font-black" style={{ color: accent.bg }}>{d.getDate()}</span>
                            <span className="block text-[9px] font-bold text-slate-400 uppercase">{MONTH_NAMES[d.getMonth()].slice(0,3)}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">{ev.title}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                            {isToday2 && (
                              <span className="inline-block mt-1 text-[9px] font-bold bg-[#EFF6FF] text-[#2563EB] px-2 py-0.5 rounded-full">Today</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                <Link href="/events" className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:underline">
                  View all events <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
