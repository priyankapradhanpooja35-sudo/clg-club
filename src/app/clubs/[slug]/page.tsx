'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import { CardSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { CLUBS_DATA } from '@/lib/clubs-data';
import { toast } from '@/components/ui/Toast';
import { useAuth } from '@/lib/AuthContext';
import {
  Monitor, Music, Star, Dumbbell, Camera, Rocket, Leaf, Briefcase,
  Users, Calendar, MapPin, ArrowRight, CheckCircle2, ChevronDown,
  Cloud, Code2, Cpu, GitBranch, BarChart3, ShieldCheck, Award,
  ExternalLink, Mail, Globe, BookOpen, Layers, Sparkles,
  HelpCircle, MessageSquare, Flame, Check, Bookmark
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const ICON_MAP: Record<string, React.ElementType> = {
  Monitor, Music, Star, Dumbbell, Camera, Rocket, Leaf, Briefcase,
};

export default function ClubProfilePage() {
  const rawSlug = useParams<{ slug: string }>()?.slug || '';
  const slug = decodeURIComponent(rawSlug).toLowerCase().replace(/\s+/g, '-');
  const { user } = useAuth();
  const [clubDoc, setClubDoc] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [following, setFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const staticData = CLUBS_DATA.find(c => c.slug === slug || c.slug === 'microsoft-club');

  useEffect(() => {
    if (!slug) return;
    Promise.all([
      fetch('/api/clubs').then(r => r.json()),
      fetch('/api/events?upcoming=true').then(r => r.json()),
    ]).then(([clubs, evs]) => {
      const doc = clubs.data?.find((c: any) => c.slug === slug);
      setClubDoc(doc || null);
      if (doc) {
        fetch(`/api/members?clubId=${doc._id}`)
          .then(r => r.json())
          .then(m => setMembers(m.data || []));
        setEvents((evs.data || []).filter((e: any) => e.clubId?._id === doc._id || e.clubId === doc._id));
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [slug]);

  const handleJoin = async () => {
    if (!user) { toast('Please login to join Microsoft Club', 'info'); return; }
    if (!clubDoc) return;
    setJoining(true);
    const res = await fetch('/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clubId: clubDoc._id }),
    });
    const data = await res.json();
    toast(data.message || 'Joined Microsoft Club successfully!', data.success ? 'success' : 'info');
    setJoining(false);
  };

  if (!staticData) return notFound();

  const isMicrosoft = slug === 'microsoft-club';

  // FAQs data
  const faqs = [
    {
      q: 'Who can join Microsoft Club?',
      a: 'Any student enrolled at Bhubaneswar Engineering College (BEC), regardless of department or year, is welcome to join Microsoft Club!'
    },
    {
      q: 'Is there any membership fee?',
      a: 'No! Joining Microsoft Club is 100% free for all BEC students. All workshops, hackathons, and study materials are provided at zero cost.'
    },
    {
      q: 'Do I need prior coding experience to join?',
      a: 'Not at all! We offer beginner-friendly tracks in Web Dev, Azure Basics, and Python along with advanced project tracks for experienced developers.'
    },
    {
      q: 'Can students from non-CSE departments join?',
      a: 'Yes, absolutely! Tech is interdisciplinary. Students from ECE, EE, Civil, and Mechanical actively participate in our design, media, and tech teams.'
    }
  ];

  // Tech stack explore pills
  const techExplore = [
    { name: 'Azure', label: 'Cloud Computing', icon: Cloud, color: 'from-blue-500 to-cyan-500' },
    { name: 'Web Dev', label: '(HTML, CSS, JS)', icon: Code2, color: 'from-emerald-500 to-teal-500' },
    { name: 'AI / ML', label: 'Artificial Intelligence', icon: Cpu, color: 'from-purple-500 to-indigo-500' },
    { name: 'GitHub', label: 'Version Control', icon: GitBranch, color: 'from-slate-600 to-slate-800' },
    { name: 'Power BI', label: 'Data Visualization', icon: BarChart3, color: 'from-amber-500 to-yellow-500' },
    { name: '.NET', label: 'App Development', icon: Sparkles, color: 'from-violet-600 to-purple-700' },
    { name: 'Cybersecurity', label: 'Basics & Awareness', icon: ShieldCheck, color: 'from-green-600 to-emerald-700' },
  ];

  const executiveTeam = [
    { name: 'Pooja Pradhan', role: 'President', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
    { name: 'Rohan Patra', role: 'Vice President', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    { name: 'Ananya Sahu', role: 'Secretary', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    { name: 'Subham Kumar', role: 'Technical Lead', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
    { name: 'Ipsita Das', role: 'Media Lead', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-violet-500 selection:text-white pb-20">
      <Navbar />

      {/* Top Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-2 text-xs text-slate-400 flex items-center gap-2">
        <Link href="/clubs" className="hover:text-violet-400 transition-colors">Clubs</Link>
        <span>&gt;</span>
        <span className="text-slate-200 font-semibold">{staticData.name}</span>
      </div>

      {/* Hero SaaS Card */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800/80 shadow-2xl p-6 md:p-8">
          {/* Neon Glow Accents */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Info */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                {/* Logo Frame */}
                <div className="h-20 w-20 shrink-0 rounded-2xl bg-white p-3 shadow-xl border border-white/20 flex items-center justify-center">
                  {isMicrosoft ? (
                    <img src="/images/microsoft-logo-official.jpg" alt="Microsoft Logo" className="w-full h-full object-contain" />
                  ) : (
                    <Monitor className="w-10 h-10 text-blue-600" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{staticData.name}</h1>
                    <CheckCircle2 className="w-6 h-6 text-blue-400 fill-blue-400/20" />
                  </div>
                  <p className="text-sm font-medium text-slate-400 mt-1 flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
                    🏛️ Department of Computer Science & Engineering, BEC
                  </p>
                </div>
              </div>

              <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">
                {staticData.description}
              </p>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2 border-y border-slate-800/80">
                <div>
                  <p className="text-xl font-black text-white flex items-center gap-1">
                    <Users className="w-4 h-4 text-blue-400" /> {loading ? '...' : (members.length > 0 ? members.length : '420+')}
                  </p>
                  <p className="text-xs text-slate-400">Members</p>
                </div>
                <div>
                  <p className="text-xl font-black text-white flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-violet-400" /> {loading ? '...' : '28'}
                  </p>
                  <p className="text-xs text-slate-400">Events</p>
                </div>
                <div>
                  <p className="text-xl font-black text-white flex items-center gap-1">
                    <Award className="w-4 h-4 text-amber-400" /> 2021
                  </p>
                  <p className="text-xs text-slate-400">Founded</p>
                </div>
                <div>
                  <p className="text-xl font-black text-white flex items-center gap-1 text-amber-300">
                    ⭐ 4.9
                  </p>
                  <p className="text-xs text-slate-400">Rating</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Button
                  onClick={handleJoin}
                  loading={joining}
                  className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold px-7 py-3 rounded-xl shadow-lg shadow-blue-500/25 transition-all transform active:scale-95"
                >
                  Join Club
                </Button>
                <Button
                  onClick={() => { setFollowing(!following); toast(following ? 'Unfollowed club' : 'Following Microsoft Club!', 'info'); }}
                  variant="secondary"
                  className={`border-slate-700 font-semibold px-6 py-3 rounded-xl transition-all ${following ? 'bg-slate-800 text-blue-400 border-blue-500/50' : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                >
                  <Bookmark className={`w-4 h-4 mr-2 ${following ? 'fill-blue-400' : ''}`} />
                  {following ? 'Following' : 'Follow Club'}
                </Button>
              </div>
            </div>

            {/* Right Laptop Illustration Banner */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900/60 group">
                <img
                  src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80"
                  alt="Microsoft Azure Cloud Laptop Setup"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-800">
                  <div className="flex items-center gap-3">
                    <Cloud className="w-8 h-8 text-blue-400 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-white">Microsoft Azure Cloud Hub</h4>
                      <p className="text-xs text-slate-400">Build, deploy & scale modern web applications</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body Content Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Sidebar Menu */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 shadow-xl backdrop-blur-md sticky top-24">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider px-3 py-2">Navigation</p>
            <nav className="space-y-1">
              {[
                { name: 'Overview', icon: Layers },
                { name: 'About', icon: BookOpen },
                { name: 'HOD / Mentor', icon: Users },
                { name: 'Team Members', icon: Users },
                { name: 'Events', icon: Calendar },
                { name: 'Gallery', icon: Camera },
                { name: 'Achievements', icon: Award },
                { name: 'Resources', icon: ExternalLink },
                { name: 'FAQs', icon: HelpCircle },
                { name: 'Announcements', icon: MessageSquare },
                { name: 'Contact', icon: Mail },
              ].map((tab) => {
                const IconComp = tab.icon;
                const isActive = activeTab === tab.name;
                return (
                  <button
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${isActive ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'}`}
                  >
                    <IconComp className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                    {tab.name}
                  </button>
                );
              })}
            </nav>

            {/* Support Box */}
            <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-blue-950/50 to-slate-900 border border-blue-900/30 text-center">
              <HelpCircle className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <h4 className="text-xs font-bold text-white">Have Questions?</h4>
              <p className="text-[11px] text-slate-400 mt-1 mb-3">We are here to help you get started.</p>
              <button
                onClick={() => toast('Contact our student coordinator at anitabehera@gmail.com', 'info')}
                className="w-full py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Column */}
        <div className="lg:col-span-9 space-y-8">

          {/* Row 1: HOD Card + About Card */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

            {/* HOD / Faculty Coordinator Card */}
            <div className="md:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-slate-700 transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

              <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-400" /> HOD / Faculty Coordinator
              </p>

              <div className="flex flex-col items-center text-center space-y-3">
                {/* HOD Image Frame */}
                <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-blue-500/40 shadow-xl group-hover:scale-105 transition-transform duration-500">
                  <img
                    src="/images/anita-behera-hod.jpg"
                    alt="Mrs. Anita Behera - HOD CSE & Faculty Coordinator"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white flex items-center justify-center gap-1.5">
                    Mrs. Anita Behera
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  </h3>
                  <p className="text-xs font-semibold text-blue-400">Head / Faculty Coordinator, Microsoft Club</p>
                  <p className="text-xs text-slate-400 mt-1">Asst. Professor, Dept of CSE</p>
                  <p className="text-[11px] text-slate-500">Bhubaneswar Engineering College</p>
                </div>

                {/* HOD Quick Details Pill */}
                <div className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-left space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Qualification:</span>
                    <span className="font-semibold text-white">PhD*, M.Tech, BE</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Experience:</span>
                    <span className="font-semibold text-emerald-400">15+ Yrs Teaching | 3 Yrs Res.</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Specialization:</span>
                    <span className="font-semibold text-blue-400">Computer Science & Eng.</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Courses:</span>
                    <span className="font-semibold text-violet-400 truncate max-w-[140px]" title="DS, ML, DE, C, Java, Python, IoT, SE">DS, ML, Python, Java, IoT</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Patents:</span>
                    <span className="font-semibold text-amber-400">1 Patent Granted</span>
                  </div>
                </div>

                {/* Contact Email & Socials */}
                <div className="w-full pt-1 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
                  <a href="mailto:anitabehera@gmail.com" className="flex items-center gap-1 text-blue-400 hover:underline text-[11px]">
                    <Mail className="w-3.5 h-3.5" /> anitabehera@gmail.com
                  </a>
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-slate-800 rounded-lg text-slate-300 hover:text-white cursor-pointer"><Globe className="w-3.5 h-3.5" /></span>
                    <span className="p-1.5 bg-slate-800 rounded-lg text-slate-300 hover:text-white cursor-pointer"><Globe className="w-3.5 h-3.5" /></span>
                  </div>
                </div>
              </div>
            </div>

            {/* About Microsoft Club Card */}
            <div className="md:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-400" /> About Microsoft Club
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  The Microsoft Club is a student-driven community at Bhubaneswar Engineering College that explores the world of Microsoft technologies including Azure Cloud, Artificial Intelligence, Web Development, GitHub, and .NET.
                </p>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                  We organize hands-on workshops, hackathons, certification drives, industry expert talks, and collaborative projects to help BEC students learn, build, and grow into industry-ready engineers.
                </p>
              </div>

              {/* 4 Pillars Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {[
                  { title: 'Learn', desc: 'Cutting-edge Tech', icon: BookOpen, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
                  { title: 'Build', desc: 'Real-world Projects', icon: Code2, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                  { title: 'Collaborate', desc: 'Work in Teams', icon: Users, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
                  { title: 'Innovate', desc: 'Solve Big Problems', icon: Rocket, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                ].map((p) => {
                  const PIcon = p.icon;
                  return (
                    <div key={p.title} className={`p-3 rounded-xl border ${p.color} text-center space-y-1`}>
                      <PIcon className="w-5 h-5 mx-auto" />
                      <h4 className="text-xs font-bold text-white">{p.title}</h4>
                      <p className="text-[10px] text-slate-400 leading-tight">{p.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Row 2: What You'll Explore & Upcoming Events */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

            {/* What You'll Explore Grid */}
            <div className="md:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-blue-400" /> What You'll Explore
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {techExplore.map((item) => {
                  const TIcon = item.icon;
                  return (
                    <div key={item.name} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-blue-500/40 transition-all group flex items-start gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${item.color} text-white shrink-0 group-hover:scale-110 transition-transform`}>
                        <TIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{item.name}</h4>
                        <p className="text-[10px] text-slate-400">{item.label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Upcoming Events Column */}
            <div className="md:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-violet-400" /> Upcoming Events
                  </h3>
                  <Link href="/events" className="text-xs font-semibold text-blue-400 hover:underline flex items-center gap-1">
                    View All <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="space-y-3">
                  {[
                    { title: 'Azure Fundamentals Workshop', date: '15 AUG', venue: 'Seminar Hall, BEC', time: '10:00 AM - 01:00 PM' },
                    { title: 'Build with AI Hackathon', date: '28 AUG', venue: 'Computer Lab, CSE', time: '09:00 AM - 09:00 PM' },
                    { title: 'Microsoft Learn Challenge', date: '05 SEP', venue: 'Online Event', time: '07:00 PM - 08:30 PM' },
                  ].map((ev) => (
                    <div key={ev.title} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-violet-600/20 border border-violet-500/30 text-center shrink-0 w-12">
                          <p className="text-xs font-black text-violet-400 leading-none">{ev.date.split(' ')[0]}</p>
                          <p className="text-[9px] font-bold text-slate-400">{ev.date.split(' ')[1]}</p>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white">{ev.title}</h4>
                          <p className="text-[10px] text-slate-400">{ev.venue} • {ev.time}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => toast(`Registered for ${ev.title}!`, 'success')}
                        className="bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold px-3 py-1 rounded-lg shrink-0"
                      >
                        Register
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Executive Team & Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

            {/* Executive Team */}
            <div className="md:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" /> Executive Team
                </h3>
                <span className="text-xs text-slate-400 font-medium">5 Core Leads</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {executiveTeam.map((mem) => (
                  <div key={mem.name} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center space-y-2 hover:border-blue-500/30 transition-all">
                    <img src={mem.avatar} alt={mem.name} className="w-12 h-12 rounded-full object-cover mx-auto ring-2 ring-blue-500/30" />
                    <div>
                      <h4 className="text-xs font-bold text-white truncate">{mem.name}</h4>
                      <p className="text-[10px] text-blue-400 font-semibold truncate">{mem.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery */}
            <div className="md:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Camera className="w-5 h-5 text-blue-400" /> Moments Gallery
                </h3>
                <span className="text-xs text-blue-400 hover:underline cursor-pointer">View All ↗</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { title: 'Azure Workshop', url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&auto=format&fit=crop&q=80' },
                  { title: 'Hackathon 2K24', url: '/images/moments-students-outdoor.jpg' },
                  { title: 'Certification Drive', url: '/images/moments-conference-group.jpg' },
                  { title: 'Annual Tech Fest', url: '/images/moments-cheering-celebration.jpg' },
                ].map((g) => (
                  <div key={g.title} className="group relative h-28 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 cursor-pointer">
                    <img src={g.url} alt={g.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                      <p className="text-[10px] font-bold text-white truncate">{g.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 4: Achievements, Statistics & Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

            {/* Achievements */}
            <div className="md:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-amber-400" /> Achievements
              </h3>
              {[
                'Winner, Smart India Hackathon 2023',
                'Microsoft Learn Student Ambassador',
                'Best Technical Club Award 2023',
                'Organized 20+ Successful Events'
              ].map((ach, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2.5 text-xs font-semibold text-slate-200">
                  <span className="text-amber-400">🏆</span>
                  <span>{ach}</span>
                </div>
              ))}
            </div>

            {/* Club Statistics */}
            <div className="md:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-blue-400" /> Club Statistics
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                  <p className="text-2xl font-black text-blue-400">420+</p>
                  <p className="text-[10px] font-bold text-slate-400">Members</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                  <p className="text-2xl font-black text-violet-400">28</p>
                  <p className="text-[10px] font-bold text-slate-400">Events</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                  <p className="text-2xl font-black text-emerald-400">65+</p>
                  <p className="text-[10px] font-bold text-slate-400">Projects Done</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                  <p className="text-2xl font-black text-amber-400">98%</p>
                  <p className="text-[10px] font-bold text-slate-400">Positive Feedback</p>
                </div>
              </div>
            </div>

            {/* Testimonials */}
            <div className="md:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2 mb-3">
                  <MessageSquare className="w-5 h-5 text-blue-400" /> Member Testimonials
                </h3>
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 italic leading-relaxed mb-3">
                  "Being part of Microsoft Club helped me improve my coding skills and gave me real-world Azure exposure!"
                  <div className="mt-2 not-italic font-bold text-white flex items-center justify-between text-[11px]">
                    <span>Riya Mohanty (3rd Yr, CSE)</span>
                    <span className="text-amber-400">⭐⭐⭐⭐⭐</span>
                  </div>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 italic leading-relaxed">
                "The hackathons organized by Microsoft Club are top notch and helped us win SIH!"
                <div className="mt-2 not-italic font-bold text-white flex items-center justify-between text-[11px]">
                  <span>Siddhant Das (2nd Yr, CSE)</span>
                  <span className="text-amber-400">⭐⭐⭐⭐⭐</span>
                </div>
              </div>
            </div>

          </div>

          {/* Row 5: Resources & FAQs */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

            {/* Resources */}
            <div className="md:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-3">
                <ExternalLink className="w-5 h-5 text-blue-400" /> Student Resources
              </h3>
              {[
                { title: 'Microsoft Learn Platform', link: 'Explore now ↗' },
                { title: 'Azure for Students ($100 Credit)', link: 'Get started ↗' },
                { title: 'GitHub Student Developer Pack', link: 'View benefits ↗' },
                { title: 'Club Study Drive & Notes', link: 'Access now ↗' },
              ].map((res) => (
                <div key={res.title} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs font-bold text-white hover:border-blue-500/40 transition-all cursor-pointer">
                  <span>{res.title}</span>
                  <span className="text-blue-400 text-[11px] font-semibold">{res.link}</span>
                </div>
              ))}
            </div>

            {/* FAQs Accordion */}
            <div className="md:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
                <HelpCircle className="w-5 h-5 text-blue-400" /> Frequently Asked Questions
              </h3>

              <div className="space-y-2">
                {faqs.map((faq, index) => {
                  const isOpen = openFaq === index;
                  return (
                    <div key={faq.q} className="rounded-xl bg-slate-950/80 border border-slate-800 overflow-hidden">
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : index)}
                        className="w-full p-3 text-left flex items-center justify-between text-xs font-bold text-slate-200 hover:text-white transition-colors"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown className={`w-4 h-4 text-blue-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-3 pb-3 text-[11px] text-slate-400 leading-relaxed border-t border-slate-800/60 pt-2"
                          >
                            {faq.a}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Bottom CTA Banner */}
          <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-violet-600 to-indigo-700 p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-black text-white">Ready to innovate and make an impact?</h3>
              <p className="text-sm text-blue-100 mt-1">Join Microsoft Club today and start your amazing developer journey with us.</p>
            </div>
            <Button
              onClick={handleJoin}
              loading={joining}
              className="bg-white hover:bg-slate-100 text-blue-900 font-extrabold px-8 py-3.5 rounded-xl shadow-xl shrink-0 transition-transform transform active:scale-95"
            >
              Join Microsoft Club →
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}

