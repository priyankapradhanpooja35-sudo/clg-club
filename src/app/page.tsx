'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import {
  Monitor, Music, Star, Dumbbell, Camera, Rocket, Leaf, Briefcase,
  ArrowRight, ChevronLeft, ChevronRight, Calendar, Users, Zap, Sparkles,
  MapPin, Clock, CheckCircle2, ShieldCheck, FileText, Bell, Image as ImageIcon,
  UserCheck, Trophy, Award, MessageSquare, ChevronDown, Plus, HelpCircle,
  ExternalLink, Mail, Phone, Code, Cpu, Activity, User
} from 'lucide-react';
import { CLUBS_DATA } from '@/lib/clubs-data';
import Navbar from '@/components/Navbar';
import Button from '@/components/ui/Button';

const ICON_MAP: Record<string, React.ElementType> = {
  Monitor, Music, Star, Dumbbell, Camera, Rocket, Leaf, Briefcase,
};

// Animated counter component
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

export default function LandingPage() {
  const [stats, setStats] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    fetch('/api/stats').then((r) => r.json()).then((d) => setStats(d.data)).catch(() => {});
    fetch('/api/events?upcoming=true').then((r) => r.json()).then((d) => setEvents((d.data || []).slice(0, 5))).catch(() => {});
  }, []);

  const topClubs = [
    {
      name: 'CodeLab',
      category: 'Technical',
      categoryColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300',
      icon: Code,
      image: '/images/clubs/microsoft-club.jpg',
      members: 24,
      upcoming: 2,
      slug: 'microsoft-club',
    },
    {
      name: 'Rhythmix',
      category: 'Cultural',
      categoryColor: 'bg-pink-100 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300',
      icon: Music,
      image: '/images/clubs/music-dance-club.jpg',
      members: 18,
      upcoming: 1,
      slug: 'music-dance-club',
    },
    {
      name: 'RoboClub',
      category: 'Technical',
      categoryColor: 'bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300',
      icon: Cpu,
      image: '/images/clubs/startup-internship-club.jpg',
      members: 20,
      upcoming: 3,
      slug: 'startup-internship-club',
    },
    {
      name: 'Sports & Health',
      category: 'Sports',
      categoryColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
      icon: Dumbbell,
      image: '/images/clubs/sports-health-club.png',
      members: 22,
      upcoming: 2,
      slug: 'sports-health-club',
    },
  ];

  const upcomingEvents = [
    {
      day: '04',
      month: 'AUG',
      color: 'bg-indigo-600',
      title: 'Web Development Workshop',
      venue: 'Seminar Hall, BEC',
      time: '10:00 AM – 01:00 PM',
      registered: '120+ Registered',
    },
    {
      day: '10',
      month: 'AUG',
      color: 'bg-purple-600',
      title: 'Photography Masterclass',
      venue: 'Media Studio, BEC',
      time: '02:00 PM – 05:00 PM',
      registered: '80+ Registered',
    },
    {
      day: '16',
      month: 'AUG',
      color: 'bg-emerald-600',
      title: 'Tech Quiz Challenge',
      venue: 'Main Auditorium, BEC',
      time: '11:00 AM – 01:00 PM',
      registered: '200+ Registered',
    },
  ];

  const highlights = [
    {
      title: 'Real-Time Use',
      desc: 'Register, join & track events in real-time.',
      icon: Activity,
      color: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/30 dark:border-blue-900',
    },
    {
      title: 'Smart Dashboard',
      desc: 'Manage activities, achievements & attendance easily.',
      icon: LayoutDashboardIcon,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-900',
    },
    {
      title: 'Instant Notifications',
      desc: 'Get updates about events, clubs & announcements.',
      icon: Bell,
      color: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/30 dark:border-amber-900',
    },
    {
      title: 'Gallery & Media',
      desc: 'Upload and explore event photos and videos.',
      icon: ImageIcon,
      color: 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-950/30 dark:border-purple-900',
    },
    {
      title: 'Reports & Export',
      desc: 'Generate & export reports in PDF / Excel.',
      icon: FileText,
      color: 'bg-pink-50 text-pink-600 border-pink-100 dark:bg-pink-950/30 dark:border-pink-900',
    },
    {
      title: 'Secure & Role Based',
      desc: 'Different access for admin, faculty, coordinators & members.',
      icon: ShieldCheck,
      color: 'bg-teal-50 text-teal-600 border-teal-100 dark:bg-teal-950/30 dark:border-teal-900',
    },
  ];

  const userRolesList = [
    'Students',
    'Faculty / Club Heads',
    'Club Coordinators / Members',
    'Training & Placement Cell',
    'Alumni (College)',
    'Guests / External Participants',
  ];

  const galleryImages = [
    { title: 'BEC Campus Aerial View', url: '/images/bec-building.jpg' },
    { title: 'BEC Campus Fest & Outdoor Group', url: '/images/moments-students-outdoor.jpg' },
    { title: 'Springer ICDECT Conference Team', url: '/images/moments-conference-group.jpg' },
    { title: 'Campus Celebration & Faculty Honor', url: '/images/moments-cheering-celebration.jpg' },
  ];

  const testimonials = [
    {
      quote: "Being part of CodeLab helped me enhance my coding skills and build real-world projects.",
      name: 'Ananya Priyadarshini',
      dept: 'CSE, 3rd Year',
      avatar: 'AP',
    },
    {
      quote: "Rhythmix gave me a platform to express myself and perform on big stages.",
      name: 'Siddharth Das',
      dept: 'ECE, 2nd Year',
      avatar: 'SD',
    },
    {
      quote: "BEC Club Hub makes it so easy to find, join, and grow with the right community.",
      name: 'Priyanshu Nanda',
      dept: 'IT, 3rd Year',
      avatar: 'PN',
    },
  ];

  const faqs = [
    {
      q: 'How can I join a club?',
      a: 'Simply browse the Clubs directory, pick the club matching your interests, and click "Join Club". The club coordinator will approve your join request.',
    },
    {
      q: 'Can I create my own club?',
      a: 'Yes! Faculty members or student leaders can submit a new club proposal to the Admin Panel. Once reviewed by Student Affairs, it becomes an official campus club.',
    },
    {
      q: 'How do I register for an event?',
      a: 'Head over to the Events tab, select any upcoming event, and click "Register Now". You will instantly receive a QR ticket in your Student Dashboard.',
    },
    {
      q: 'Is there any membership fee?',
      a: 'All official BEC campus clubs hosted on BEC Club Hub are completely free to join for all enrolled BEC students.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />

      {/* 1. HERO SECTION WITH CAMPUS IMAGE BACKGROUND */}
      <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center overflow-hidden bg-[#0A1128]">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/bec-building.jpg"
            alt="Bhubaneswar Engineering College Campus"
            className="w-full h-full object-cover object-center lg:object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A1128] via-[#0A1128]/90 to-transparent lg:via-[#0A1128]/75" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1128] via-transparent to-transparent opacity-80" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-xl text-left">
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

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
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

      {/* 2. STATS ROW */}
      <section className="bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: 'Clubs', sub: 'Explore Communities', to: stats?.totalClubs ?? 8, icon: Users, iconBg: 'bg-indigo-600 text-white' },
              { label: 'Members', sub: 'Active Members', to: stats?.totalMembers ?? 38, icon: UserCheck, iconBg: 'bg-emerald-600 text-white' },
              { label: 'Events Hosted', sub: 'This Semester', to: stats?.totalEvents ?? 13, icon: Calendar, iconBg: 'bg-amber-600 text-white' },
              { label: 'Attendees', sub: 'Across All Events', to: stats?.totalAttendees ?? 109, icon: Zap, iconBg: 'bg-purple-600 text-white' },
            ].map(({ label, sub, to, icon: Icon, iconBg }) => (
              <div key={label} className="rounded-2xl bg-slate-800/80 border border-slate-700/60 p-5 shadow-sm flex items-center gap-4">
                <div className={`h-12 w-12 rounded-xl ${iconBg} flex items-center justify-center shrink-0 shadow-md`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-3xl font-black text-white leading-none">
                    <Counter to={to} />
                  </p>
                  <p className="text-sm font-bold text-slate-200 mt-1">{label}</p>
                  <p className="text-[11px] text-slate-400 font-medium">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. POPULAR CLUBS / EXPLORE TOP CLUBS (CAROUSEL WITH IMAGES) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
                POPULAR CLUBS
              </span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Explore Top Clubs</h2>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/clubs" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors mr-2">
                View All Clubs <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {topClubs.map((club, i) => {
              const Icon = club.icon;
              return (
                <motion.div
                  key={club.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link href={`/clubs/${club.slug}`}>
                    <div className="group rounded-2xl border border-slate-200 bg-white text-slate-800 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(37,99,235,0.08)] transition-all duration-200 flex flex-col h-full">
                      {/* Top Image */}
                      <div className="relative h-48 overflow-hidden bg-slate-100">
                        <img src={club.image} alt={club.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-transparent pointer-events-none" />
                      </div>

                      {/* Content */}
                      <div className="p-5 flex flex-col flex-1 justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2.5">
                            {/* Small icon badge next to category */}
                            <div className="h-7 w-7 rounded-full bg-[#EFF6FF] flex items-center justify-center text-[#2563EB]">
                              <Icon className="w-4 h-4 text-[#2563EB]" />
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              club.category === 'Technical' ? 'bg-[#EFF6FF] text-[#2563EB]' :
                              club.category === 'Cultural' ? 'bg-[#FDF2F8] text-[#DB2777]' : 'bg-[#FFF7ED] text-[#D97706]'
                            }`}>
                              {club.category}
                            </span>
                          </div>
                          <h3 className="font-bold text-base text-[#1E293B] mb-2">{club.name}</h3>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-[#64748B] border-t border-gray-100 pt-3 mt-3">
                          <span className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-[#64748B]" /> {club.members} Members
                          </span>
                          <span className="text-gray-350">•</span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#64748B]" /> {club.upcoming} Upcoming
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. HAPPENING SOON ON CAMPUS (EVENTS + HAVE AN EVENT IDEA?) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-b border-slate-200">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 block mb-1">
                HAPPENING SOON ON CAMPUS
              </span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Upcoming Campus Events</h2>
            </div>
            <Link href="/events" className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 transition-colors">
              View All Events <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {upcomingEvents.map((ev, i) => (
              <motion.div
                key={ev.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`${ev.color} rounded-xl px-3 py-2 text-white text-center font-bold shrink-0 shadow-sm`}>
                      <span className="block text-lg leading-none">{ev.day}</span>
                      <span className="block text-[10px] tracking-wider uppercase opacity-90">{ev.month}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base leading-snug">{ev.title}</h3>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-500 mb-4">
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {ev.venue}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {ev.time}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200/80 pt-3 text-xs text-slate-500 font-medium">
                  <span>{ev.registered}</span>
                  <Link href="/events" className="text-blue-600 font-bold hover:underline">
                    Register →
                  </Link>
                </div>
              </motion.div>
            ))}

            {/* 4th Card: Have an Event Idea? */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              className="rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/50 p-6 flex flex-col items-center justify-center text-center"
            >
              <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Have an Event Idea?</h3>
              <p className="text-xs text-slate-500 mb-4">We'd love to hear it!</p>
              <Link href="/login">
                <button className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-700 font-semibold text-xs px-4 py-2 shadow-sm transition-colors">
                  <User className="w-3.5 h-3.5" /> Submit Event
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. PLATFORM HIGHLIGHTS / A PLATFORM BUILT FOR EVERYONE */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
              PLATFORM HIGHLIGHTS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              A Platform Built for Everyone
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className={`rounded-2xl border ${item.color} p-6 shadow-sm flex flex-col justify-between`}
                >
                  <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base mb-1">{item.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. DUAL SECTION: WHO USES THIS PLATFORM? & CLUBS WE MANAGE */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-b border-slate-200">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Who Uses This Platform */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
                WHO USES THIS PLATFORM?
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-6">
                Designed for Entire BEC Campus
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {userRolesList.map((role) => (
                  <div key={role} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                    <div className="h-7 w-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">{role}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Clubs We Manage */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 block mb-1">
                CLUBS WE MANAGE
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-6">
                Official Campus Clubs
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {CLUBS_DATA.map((club) => {
                  const Icon = ICON_MAP[club.icon] || Star;
                  return (
                    <Link key={club.slug} href={`/clubs/${club.slug}`}>
                      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white hover:border-blue-300 p-3 shadow-sm hover:shadow transition-all">
                        <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${club.gradient} text-white flex items-center justify-center shrink-0`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-800 truncate">{club.name}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. LIFE AT BEC@B / MOMENTS THAT MATTER (GALLERY) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
                LIFE AT BEC@B
              </span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Moments That Matter</h2>
            </div>
            <Link href="/clubs" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
              View Gallery <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {galleryImages.map((img, i) => (
              <motion.div
                key={img.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group relative h-60 rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-slate-900 cursor-pointer"
              >
                <img src={img.url} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <p className="text-xs font-bold text-white leading-tight">{img.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. DUAL SECTION: OUR ACHIEVEMENTS & WHAT STUDENTS SAY */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-b border-slate-200">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column: Achievements */}
            <div className="lg:col-span-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-1">
                OUR ACHIEVEMENTS
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-6">
                Proud of Our Journey
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { title: '2nd Place', sub: 'Smart India Hackathon 2023', icon: Trophy, color: 'text-amber-500 bg-amber-50' },
                  { title: 'Top 50', sub: 'NIRF Innovation Ranking', icon: Award, color: 'text-emerald-500 bg-emerald-50' },
                  { title: '25+', sub: 'Events Conducted', icon: Calendar, color: 'text-indigo-500 bg-indigo-50' },
                  { title: '1000+', sub: 'Students Impacted', icon: Users, color: 'text-purple-500 bg-purple-50' },
                ].map((ach) => {
                  const Icon = ach.icon;
                  return (
                    <div key={ach.title} className="rounded-2xl border border-slate-200 p-4 text-center bg-slate-50">
                      <div className={`h-10 w-10 rounded-xl ${ach.color} flex items-center justify-center mx-auto mb-2`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <p className="text-lg font-black text-slate-900">{ach.title}</p>
                      <p className="text-[11px] font-medium text-slate-500 mt-0.5">{ach.sub}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Testimonials */}
            <div className="lg:col-span-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
                WHAT STUDENTS SAY
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-6">
                Voices of Our Community
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {testimonials.map((t) => (
                  <div key={t.name} className="rounded-2xl border border-slate-200 p-5 bg-slate-50 flex flex-col justify-between">
                    <div>
                      <div className="flex text-amber-400 mb-2 text-xs">★★★★★</div>
                      <p className="text-xs text-slate-600 italic leading-relaxed mb-4">"{t.quote}"</p>
                    </div>
                    <div className="flex items-center gap-2.5 border-t border-slate-200/80 pt-3">
                      <div className="h-8 w-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {t.avatar}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{t.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{t.dept}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. GOT QUESTIONS? / WE'VE GOT ANSWERS (FAQ ACCORDION) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
                GOT QUESTIONS?
              </span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">We've Got Answers</h2>
            </div>
            <Link href="/about" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
              View All FAQs <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-900 text-sm sm:text-base hover:bg-slate-50"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. CTA BANNER / READY TO CONNECT, LEARN & GROW? */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="relative z-10 max-w-xl">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-3 leading-tight">
                Ready to Connect, Learn & Grow?
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Join BEC Club Hub today and be part of something bigger. Discover clubs, attend events, and build your campus legacy.
              </p>
            </div>
            <div className="relative z-10 shrink-0">
              <Link href="/signup">
                <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm px-8 py-4 shadow-xl transition-all hover:scale-105">
                  Join Now <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 11. RICH FOOTER */}
      <footer className="bg-slate-900 text-slate-300 py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Col 1 */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-black text-xs text-white">
                  BEC
                </div>
                <span className="font-bold text-white text-base">BEC Club Hub</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Empowering students to explore, connect and grow beyond academics at Bhubaneswar Engineering College.
              </p>
            </div>

            {/* Col 2 */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Quick Links</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/clubs" className="hover:text-white transition-colors">Clubs</Link></li>
                <li><Link href="/events" className="hover:text-white transition-colors">Events</Link></li>
                <li><Link href="/announcements" className="hover:text-white transition-colors">Notices</Link></li>
                <li><Link href="/leaderboard" className="hover:text-white transition-colors">Leaderboard</Link></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Resources</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><Link href="/about" className="hover:text-white transition-colors">FAQs</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">Guidelines</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">Student Council</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Contact Us</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-2">
                Bhubaneswar Engineering College<br />
                Bhubaneswar, Odisha, India
              </p>
              <p className="text-xs text-slate-400">📧 clubhub@bec.ac.in</p>
              <p className="text-xs text-slate-400">📞 +91 91234 56789</p>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© 2024 BEC Club Hub. All rights reserved.</p>
            <p>Built for <span className="text-blue-400 font-bold">Ayush Technologies Hackathon 2024</span></p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Icon helper function alias
function LayoutDashboardIcon(props: any) {
  return <Zap {...props} />;
}
