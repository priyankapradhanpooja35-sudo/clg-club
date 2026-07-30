'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import {
  Monitor, Music, Star, Dumbbell, Camera, Rocket, Leaf, Briefcase,
  ArrowRight, Calendar, Users, Zap, Sparkles, MapPin, Clock
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
        className={`rounded-2xl bg-gradient-to-br ${club.gradient} p-8 min-h-48 shadow-xl`}
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
              className={`h-2 rounded-full transition-all ${i === idx ? 'w-6 bg-blue-500' : 'w-2 bg-white/20'}`}
            />
          ))}
        </div>
      )}
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
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      {/* HERO SECTION WITH CAMPUS IMAGE BACKGROUND (PIC 3 DESIGN) */}
      <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center overflow-hidden bg-[#0A1128]">
        {/* Campus Building Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/bec-building.jpg"
            alt="Bhubaneswar Engineering College Campus"
            className="w-full h-full object-cover object-center lg:object-right"
          />
          {/* Gradient Overlay: Dark Navy fade on the left, revealing building on the right */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A1128] via-[#0A1128]/90 to-transparent lg:via-[#0A1128]/75" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1128] via-transparent to-transparent opacity-80" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-xl text-left">
            {/* Campus Pulse Widget */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/10 backdrop-blur-md px-4 py-1.5 text-xs text-white/90 mb-8"
            >
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
              </div>
              <span>
                <strong className="text-white font-bold">{stats?.totalMembers ?? 38}</strong> students active ·{' '}
                <strong className="text-white font-bold">{stats?.totalEvents ?? 13}</strong> events this session
              </span>
            </motion.div>

            {/* Left-Aligned Headline matching Pic 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight">
                Discover.<br />
                <span className="text-blue-400 bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
                  Connect.
                </span><br />
                Grow.
              </h1>
              <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                BEC Club Hub is your one-stop campus platform — join clubs, register for events, 
                track achievements, and build your legacy at Bhubaneswar Engineering College.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="flex flex-wrap items-center gap-4 mt-8"
            >
              <Link href="/clubs">
                <button className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-6 py-3.5 shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-0.5">
                  <Sparkles className="w-4 h-4" /> Explore Clubs
                </button>
              </Link>
              <Link href="/login">
                <button className="flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold text-sm px-6 py-3.5 transition-all">
                  Sign In <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS ROW (PIC 3 SPEC: LIGHT BG WITH 4 CLEAN WHITE CARDS) */}
      <section className="bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                label: 'Clubs',
                to: stats?.totalClubs ?? 8,
                icon: Users,
                iconBg: 'bg-blue-600 text-white',
                indicatorBg: 'bg-blue-600',
              },
              {
                label: 'Members',
                to: stats?.totalMembers ?? 38,
                icon: Users,
                iconBg: 'bg-emerald-500 text-white',
                indicatorBg: 'bg-emerald-500',
              },
              {
                label: 'Events Hosted',
                to: stats?.totalEvents ?? 13,
                icon: Calendar,
                iconBg: 'bg-orange-500 text-white',
                indicatorBg: 'bg-orange-500',
              },
              {
                label: 'Attendees',
                to: stats?.totalAttendees ?? 109,
                icon: Zap,
                iconBg: 'bg-purple-600 text-white',
                indicatorBg: 'bg-purple-600',
              },
            ].map(({ label, to, icon: Icon, iconBg, indicatorBg }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl bg-white border border-slate-200/70 p-6 text-center shadow-sm flex flex-col items-center justify-between"
              >
                <div className={`h-12 w-12 rounded-full ${iconBg} flex items-center justify-center mb-3 shadow-md`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-3xl font-black text-slate-900 leading-tight">
                  <Counter to={to} />
                </p>
                <p className="text-xs font-semibold text-slate-500 mt-1 mb-3">{label}</p>
                <div className={`h-0.5 w-8 ${indicatorBg} rounded-full`} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CLUBS GRID SECTION (MATCHING PIC 3: POPULAR CLUBS) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
                POPULAR CLUBS
              </span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Explore Active Clubs</h2>
            </div>
            <Link
              href="/clubs"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
            >
              View All Clubs <ArrowRight className="w-3.5 h-3.5" />
            </Link>
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
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={`/clubs/${club.slug}`}>
                    <div className="group rounded-2xl border border-slate-200 bg-white p-6 h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer relative overflow-hidden flex flex-col justify-between">
                      {/* Accent top line */}
                      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${club.gradient}`} />

                      <div>
                        <div
                          className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${club.gradient} mb-4 text-white shadow-md`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-slate-900 text-base leading-tight mb-2">{club.name}</h3>
                        <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{club.description}</p>
                      </div>

                      <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-blue-600 group-hover:gap-2.5 transition-all">
                        View Club <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-blue-300 mb-3">
              <Calendar className="w-3.5 h-3.5" /> Upcoming Events
            </span>
            <h2 className="text-3xl font-black text-white tracking-tight">Don't Miss Out</h2>
            <p className="mt-2 text-sm text-slate-400">
              Discover and register for exciting upcoming workshops and events.
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
      <footer className="bg-white border-t border-slate-200 py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 font-black text-xs text-white">
                BEC
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">BEC Club Hub</p>
                <p className="text-xs text-slate-500">Bhubaneswar Engineering College</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs text-slate-500 font-medium">
              <Link href="/clubs" className="hover:text-blue-600 transition-colors">Clubs</Link>
              <Link href="/events" className="hover:text-blue-600 transition-colors">Events</Link>
              <Link href="/announcements" className="hover:text-blue-600 transition-colors">Notices</Link>
              <Link href="/login" className="hover:text-blue-600 transition-colors">Login</Link>
            </div>

            <p className="text-xs text-slate-500 text-center md:text-right">
              Built for <span className="text-blue-600 font-bold">Ayush Technologies Hackathon 2024</span>
              <br />
              <span>© 2024 BEC Club Hub. All rights reserved.</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
