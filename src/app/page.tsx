'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import {
  Monitor, Music, Star, Dumbbell, Camera, Rocket, Leaf, Briefcase,
  ArrowRight, ChevronLeft, ChevronRight, Calendar, Users, Zap, Sparkles,
  MapPin, Clock
} from 'lucide-react';
import { CLUBS_DATA } from '@/lib/clubs-data';
import Navbar from '@/components/Navbar';
import Button from '@/components/ui/Button';

const ICON_MAP: Record<string, React.ElementType> = {
  Monitor, Music, Star, Dumbbell, Camera, Rocket, Leaf, Briefcase,
};

// Animated counter
function Counter({ to, duration = 2 }: { to: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = to / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= to) { setCount(to); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [inView, to, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

// Events carousel
function EventsCarousel({ events }: { events: any[] }) {
  const [idx, setIdx] = useState(0);
  const autoRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    if (events.length <= 1) return;
    autoRef.current = setInterval(() => setIdx((i) => (i + 1) % events.length), 4000);
    return () => clearInterval(autoRef.current);
  }, [events.length]);

  const pause = () => clearInterval(autoRef.current);
  const resume = () => {
    autoRef.current = setInterval(() => setIdx((i) => (i + 1) % events.length), 4000);
  };

  if (!events.length) return (
    <div className="flex items-center justify-center h-48 rounded-2xl bg-white/5 border border-white/10 text-white/40">
      <p>No upcoming events right now</p>
    </div>
  );

  const ev = events[idx];
  const club = CLUBS_DATA.find((c) => c.slug === ev.clubSlug) || CLUBS_DATA[0];

  return (
    <div className="relative" onMouseEnter={pause} onMouseLeave={resume}>
      <motion.div
        key={idx}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.4 }}
        className={`rounded-2xl bg-gradient-to-br ${club.gradient} p-8 min-h-48`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-start justify-between mb-4">
            <span className="text-xs font-semibold bg-white/20 text-white px-3 py-1 rounded-full">{club.name}</span>
            <span className="text-xs text-white/70">
              {new Date(ev.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">{ev.title}</h3>
          <p className="text-white/80 text-sm mb-4 line-clamp-2">{ev.description}</p>
          <div className="flex items-center gap-4 mt-auto">
            <span className="flex items-center gap-1.5 text-white/70 text-xs">
              <MapPin className="w-3.5 h-3.5" /> {ev.venue}
            </span>
            <Link href={`/events/${ev._id}`}>
              <button className="ml-auto flex items-center gap-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-4 py-2 transition-colors">
                Register <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Dots */}
      {events.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {events.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`h-2 rounded-full transition-all ${i === idx ? 'w-6 bg-violet-500' : 'w-2 bg-white/20'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Campus Pulse widget
function CampusPulse({ stats }: { stats: any }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-5 py-3">
      <div className="relative">
        <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-40" />
        <span className="relative flex h-3 w-3 rounded-full bg-green-400" />
      </div>
      <p className="text-sm text-white/80">
        <span className="font-bold text-white">{stats?.totalMembers ?? '...'}</span> students active ·{' '}
        <span className="font-bold text-white">{stats?.totalEvents ?? '...'}</span> events this session
      </p>
    </div>
  );
}

export default function LandingPage() {
  const [stats, setStats] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/stats').then((r) => r.json()).then((d) => setStats(d.data)).catch(() => {});
    fetch('/api/events?upcoming=true').then((r) => r.json()).then((d) => setEvents((d.data || []).slice(0, 5))).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1E1B4B] via-[#4C1D95] to-[#1E293B] pt-20 pb-32 px-4">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-60 left-1/4 w-[600px] h-[600px] rounded-full bg-violet-600/15 blur-3xl" />
          <div className="absolute top-10 right-0 w-96 h-96 rounded-full bg-pink-600/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-indigo-600/15 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl">
          {/* Campus Pulse */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="flex justify-center mb-8">
            <CampusPulse stats={stats} />
          </motion.div>

          {/* Headline */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.08] tracking-tight">
              Discover.{' '}
              <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                Connect.
              </span>{' '}
              Grow.
            </h1>
            <p className="mt-6 text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              BEC Club Hub is your one-stop campus platform — join clubs, register for events, 
              track achievements, and build your legacy at Bhubaneswar Engineering College.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link href="/clubs">
              <Button variant="gradient" size="lg" className="gap-2 px-8 text-base">
                <Sparkles className="w-4 h-4" /> Explore Clubs
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8 text-base">
                Sign In <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { label: 'Clubs', to: stats?.totalClubs ?? 8, icon: Users, color: 'from-violet-500 to-purple-600' },
              { label: 'Members', to: stats?.totalMembers ?? 1200, icon: Users, color: 'from-pink-500 to-rose-600' },
              { label: 'Events Hosted', to: stats?.totalEvents ?? 48, icon: Calendar, color: 'from-amber-500 to-orange-600' },
              { label: 'Attendees', to: stats?.totalAttendees ?? 3600, icon: Zap, color: 'from-green-500 to-emerald-600' },
            ].map(({ label, to, icon: Icon, color }) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 text-center">
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${color} mb-3`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-3xl font-black text-white"><Counter to={to} /></p>
                <p className="text-sm text-white/60 mt-0.5">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CLUBS GRID */}
      <section className="py-20 px-4 bg-[var(--background)]">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 dark:bg-violet-900/30 px-4 py-1.5 text-sm font-semibold text-violet-700 dark:text-violet-300 mb-4">
              <Users className="w-3.5 h-3.5" /> 8 Active Clubs
            </span>
            <h2 className="text-4xl font-black text-[var(--foreground)] tracking-tight">Find Your Community</h2>
            <p className="mt-3 text-[var(--muted-foreground,#64748B)] max-w-xl mx-auto">
              From tech to arts, sports to sustainability — there's a club for every passion at BEC.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CLUBS_DATA.map((club, i) => {
              const Icon = ICON_MAP[club.icon] || Star;
              return (
                <motion.div
                  key={club.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link href={`/clubs/${club.slug}`}>
                    <div className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 h-full transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl cursor-pointer overflow-hidden relative">
                      {/* Gradient top bar */}
                      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${club.gradient}`} />

                      <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${club.gradient} mb-4 shadow-lg`}
                        style={{ boxShadow: `0 8px 25px ${club.accentColor}40` }}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-bold text-[var(--foreground)] text-base leading-tight mb-2">{club.name}</h3>
                      <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">{club.description}</p>
                      <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-violet-600 group-hover:gap-3 transition-all">
                        View Club <ArrowRight className="w-3.5 h-3.5" />
                      </div>

                      {/* Hover glow */}
                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 bg-gradient-to-br ${club.gradient} transition-opacity duration-300 pointer-events-none`} />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section className="py-20 px-4 bg-gradient-to-br from-[#1E1B4B] to-[#1E293B]">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-white/80 mb-4">
              <Calendar className="w-3.5 h-3.5" /> Upcoming Events
            </span>
            <h2 className="text-4xl font-black text-white tracking-tight">Don't Miss Out</h2>
            <p className="mt-3 text-white/60 max-w-md mx-auto">
              Discover and register for exciting upcoming events across all clubs.
            </p>
          </div>
          <EventsCarousel events={events} />
          <div className="flex justify-center mt-8">
            <Link href="/events">
              <Button variant="secondary" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                See All Events <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[var(--card)] border-t border-[var(--border)] py-12 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-700">
                <span className="text-xs font-black text-white">BEC</span>
              </div>
              <div>
                <p className="font-bold text-[var(--foreground)]">BEC Club Hub</p>
                <p className="text-xs text-gray-500">Bhubaneswar Engineering College</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="/clubs" className="hover:text-violet-600 transition-colors">Clubs</Link>
              <Link href="/events" className="hover:text-violet-600 transition-colors">Events</Link>
              <Link href="/announcements" className="hover:text-violet-600 transition-colors">Notices</Link>
              <Link href="/login" className="hover:text-violet-600 transition-colors">Login</Link>
            </div>

            <p className="text-sm text-gray-500 text-center md:text-right">
              Built for{' '}
              <span className="text-violet-600 font-medium">Ayush Technologies Hackathon 2024</span>
              <br />
              <span className="text-xs">© 2024 BEC Club Hub. All rights reserved.</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
