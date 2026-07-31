'use client';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/Card';
import { CardSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { toast } from '@/components/ui/Toast';
import { useAuth } from '@/lib/AuthContext';
import { CLUBS_DATA } from '@/lib/clubs-data';
import { Calendar, MapPin, Search, Filter, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function EventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [registering, setRegistering] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/events')
      .then(r => r.json())
      .then(d => { setEvents(d.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleRegister = async (eventId: string) => {
    if (!user) { toast('Please login to register for events', 'info'); return; }
    setRegistering(eventId);
    const res = await fetch('/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId }),
    });
    const data = await res.json();
    toast(data.message, data.success ? 'success' : 'error');
    setRegistering(null);
  };

  const clubs = [...new Set(events.map(e => e.clubId?.slug).filter(Boolean))];
  const filtered = events.filter(ev => {
    const matchSearch = ev.title?.toLowerCase().includes(search.toLowerCase()) || ev.venue?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || ev.clubId?.slug === filter;
    return matchSearch && matchFilter;
  });

  const getClubData = (slug: string) => CLUBS_DATA.find(c => c.slug === slug);

  const isUpcoming = (date: string) => new Date(date) > new Date();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[var(--background)]">
        {/* Hero */}
        <div className="bg-gradient-to-br from-[#1E1B4B] to-[#1E293B] py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">Campus Events</h1>
            <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
              Register for workshops, fests, competitions, and more across all clubs.
            </p>
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Search events..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pl-12 text-white placeholder-white/40 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 backdrop-blur-sm transition-all"
              />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-10">
          {/* Filter chips */}
          {!loading && clubs.length > 0 && (
            <div className="flex gap-3 mb-8 overflow-x-auto pb-4 scrollbar-hide snap-x mask-fade-edges">
              <button
                onClick={() => setFilter('all')}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap snap-start shrink-0 ${filter === 'all' ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 shadow-sm'}`}
              >
                All Events
              </button>
              {clubs.map(slug => {
                const c = getClubData(slug);
                return (
                  <button
                    key={slug}
                    onClick={() => setFilter(slug)}
                    className={`px-5 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap snap-start shrink-0 ${filter === slug ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 shadow-sm'}`}
                  >
                    {c?.name || slug}
                  </button>
                );
              })}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => <CardSkeleton key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState icon={Calendar} title="No events found" description={search ? `No events match "${search}"` : 'No events published yet. Check back soon!'} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((ev, i) => {
                const clubStatic = getClubData(ev.clubId?.slug);
                const upcoming = isUpcoming(ev.date);
                return (
                  <motion.div key={ev._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Card hover className="flex flex-col h-full overflow-hidden">
                      {/* Club color top bar */}
                      <div className={`h-1.5 bg-gradient-to-r ${clubStatic?.gradient || 'from-violet-500 to-indigo-600'}`} />
                      <CardContent className="flex flex-col flex-1 pt-5">
                        <div className="flex items-start justify-between mb-3">
                          <Badge variant={upcoming ? 'default' : 'success'}>{upcoming ? 'Upcoming' : 'Past'}</Badge>
                          <span className="text-xs text-gray-400">
                            {new Date(ev.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                        <h3 className="font-bold text-[var(--foreground)] text-base leading-tight mb-1">{ev.title}</h3>
                        {ev.clubId?.name && <p className="text-xs font-medium mb-2" style={{ color: clubStatic?.accentColor || '#7C3AED' }}>{ev.clubId.name}</p>}
                        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed flex-1 mb-4">{ev.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />
                            {new Date(ev.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="flex items-center gap-1 truncate"><MapPin className="w-3.5 h-3.5 shrink-0" /> {ev.venue}</span>
                        </div>
                        <Button
                          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-bold shadow-[0_4px_20px_-4px_rgba(59,130,246,0.4)] hover:shadow-[0_8px_25px_-5px_rgba(59,130,246,0.6)] transition-all duration-300 border-0"
                          size="sm"
                          loading={registering === ev._id}
                          onClick={() => handleRegister(ev._id)}
                          disabled={!upcoming}
                        >
                          {upcoming ? 'Register Now' : 'Event Ended'}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
