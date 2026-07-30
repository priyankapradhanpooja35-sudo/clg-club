'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams, usePathname } from 'next/navigation';
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
  const params = useParams<{ slug?: string }>();
  const pathname = usePathname() || '';

  // Extract raw slug from params or pathname
  let rawSlug = params?.slug || '';
  if (!rawSlug && pathname.includes('/clubs/')) {
    rawSlug = pathname.split('/clubs/')[1] || '';
  }

  const slug = decodeURIComponent(rawSlug).toLowerCase().replace(/%20|\s+/g, '-');
  const isMusic = slug.includes('music') || slug.includes('dance');
  const isMicrosoft = slug.includes('microsoft');

  const { user } = useAuth();
  const [clubDoc, setClubDoc] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [following, setFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const staticData = CLUBS_DATA.find(c => c.slug === slug)
    || (isMusic ? CLUBS_DATA.find(c => c.slug === 'music-dance-club') : null)
    || (isMicrosoft ? CLUBS_DATA.find(c => c.slug === 'microsoft-club') : null)
    || CLUBS_DATA[0];

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
  const scrollToSection = (tabName: string, secId: string) => {
    setActiveTab(tabName);
    if (secId === 'sec-overview') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elem = document.getElementById(secId);
    if (elem) {
      const yOffset = -90; // offset for fixed header
      const y = elem.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-violet-500 selection:text-white pb-20">
      <Navbar />

      {/* Top Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-2 text-xs text-slate-400 flex items-center gap-2">
        <Link href="/clubs" className="hover:text-violet-400 transition-colors">Clubs</Link>
        <span>&gt;</span>
        <span className="text-slate-200 font-semibold">{staticData.name}</span>
      </div>

      {/* Hero SaaS Header */}
      <div id="sec-overview" className="max-w-7xl mx-auto px-4 py-4 scroll-mt-24">
        <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${isMusic ? 'from-slate-900 via-pink-950/40 to-slate-950 border-pink-900/30' : 'from-slate-900 via-slate-900/90 to-slate-950 border-slate-800/80'} border shadow-2xl p-6 md:p-8`}>
          {/* Neon Glow Accents */}
          <div className={`absolute -top-24 -left-24 w-96 h-96 ${isMusic ? 'bg-pink-600/20' : 'bg-blue-600/20'} rounded-full blur-3xl pointer-events-none`} />
          <div className={`absolute -bottom-24 -right-24 w-96 h-96 ${isMusic ? 'bg-rose-600/20' : 'bg-violet-600/20'} rounded-full blur-3xl pointer-events-none`} />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Info */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                {/* Logo Frame */}
                <div className="h-20 w-20 shrink-0 rounded-2xl bg-white p-2 shadow-xl border border-white/20 flex items-center justify-center overflow-hidden">
                  {isMusic ? (
                    <img src="/images/music-dance-logo.jpg" alt="Music & Dance Club Logo" className="w-full h-full object-contain" />
                  ) : isMicrosoft ? (
                    <img src="/images/microsoft-logo-official.jpg" alt="Microsoft Logo" className="w-full h-full object-contain" />
                  ) : (
                    <Monitor className="w-10 h-10 text-blue-600" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{staticData.name}</h1>
                    <CheckCircle2 className={`w-6 h-6 ${isMusic ? 'text-pink-400 fill-pink-400/20' : 'text-blue-400 fill-blue-400/20'}`} />
                  </div>
                  <p className="text-sm font-medium text-slate-400 mt-1 flex items-center gap-1.5">
                    <span className={`inline-block w-2 h-2 rounded-full ${isMusic ? 'bg-pink-500' : 'bg-blue-500'} animate-ping`} />
                    {isMusic ? '🎭 Department of Cultural Affairs & Performing Arts, BEC' : '🏛️ Department of Computer Science & Engineering, BEC'}
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
                    <Users className={`w-4 h-4 ${isMusic ? 'text-pink-400' : 'text-blue-400'}`} /> {loading ? '...' : (members.length > 0 ? members.length : isMusic ? '380+' : '420+')}
                  </p>
                  <p className="text-xs text-slate-400">Members</p>
                </div>
                <div>
                  <p className="text-xl font-black text-white flex items-center gap-1">
                    <Calendar className={`w-4 h-4 ${isMusic ? 'text-rose-400' : 'text-violet-400'}`} /> {loading ? '...' : isMusic ? '34' : '28'}
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
                    ⭐ {isMusic ? '4.95' : '4.9'}
                  </p>
                  <p className="text-xs text-slate-400">Rating</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Button
                  onClick={handleJoin}
                  loading={joining}
                  className={`${isMusic ? 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 shadow-pink-500/25' : 'bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 shadow-blue-500/25'} text-white font-bold px-7 py-3 rounded-xl shadow-lg transition-all transform active:scale-95`}
                >
                  Join Club
                </Button>
                <Button
                  onClick={() => { setFollowing(!following); toast(following ? 'Unfollowed club' : `Following ${staticData.name}!`, 'info'); }}
                  variant="secondary"
                  className={`border-slate-700 font-semibold px-6 py-3 rounded-xl transition-all ${following ? 'bg-slate-800 text-pink-400 border-pink-500/50' : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                >
                  <Bookmark className={`w-4 h-4 mr-2 ${following ? 'fill-pink-400' : ''}`} />
                  {following ? 'Following' : 'Follow Club'}
                </Button>
              </div>
            </div>

            {/* Right Graphic Banner */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900/60 group">
                <img
                  src={isMusic ? "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80" : "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80"}
                  alt={isMusic ? "Music & Dance Stage Setup" : "Microsoft Azure Cloud Setup"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-800">
                  <div className="flex items-center gap-3">
                    {isMusic ? <Music className="w-8 h-8 text-pink-400 shrink-0" /> : <Cloud className="w-8 h-8 text-blue-400 shrink-0" />}
                    <div>
                      <h4 className="text-sm font-bold text-white">{isMusic ? 'Rhythm & Expression Stage' : 'Microsoft Azure Cloud Hub'}</h4>
                      <p className="text-xs text-slate-400">{isMusic ? 'Express, perform & shine on stage' : 'Build, deploy & scale modern web applications'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Body Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 shadow-2xl backdrop-blur-xl sticky top-24">
            <div className="flex items-center justify-between px-2 py-1.5 border-b border-slate-800/60 mb-3">
              <p className={`text-[11px] font-extrabold ${isMusic ? 'text-pink-400' : 'text-blue-400'} uppercase tracking-widest flex items-center gap-1.5`}>
                <Sparkles className="w-3.5 h-3.5" /> Navigation
              </p>
              <span className={`w-2 h-2 rounded-full ${isMusic ? 'bg-pink-500 shadow-pink-500' : 'bg-blue-500 shadow-blue-500'} shadow-sm`} />
            </div>

            <nav className="space-y-1.5">
              {[
                { name: 'Overview', id: 'sec-overview', icon: Layers },
                { name: 'About Club', id: 'sec-about', icon: BookOpen },
                { name: 'HOD / Faculty Coordinator', id: 'sec-hod', icon: Users },
                { name: 'Upcoming Events', id: 'sec-events', icon: Calendar },
                { name: 'FAQs', id: 'sec-faqs', icon: HelpCircle },
                { name: 'Contact Us', id: 'sec-contact', icon: Mail },
              ].map((tab) => {
                const IconComp = tab.icon;
                const isActive = activeTab === tab.name;
                return (
                  <button
                    key={tab.name}
                    onClick={() => scrollToSection(tab.name, tab.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${isActive ? (isMusic ? 'bg-gradient-to-r from-pink-600/30 to-rose-600/20 text-white border border-pink-500/40 shadow-md shadow-pink-500/10' : 'bg-gradient-to-r from-blue-600/30 to-violet-600/20 text-white border border-blue-500/40 shadow-md shadow-blue-500/10') : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70'}`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComp className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? (isMusic ? 'text-pink-400' : 'text-blue-400') : 'text-slate-500 group-hover:text-pink-400'}`} />
                      <span>{tab.name}</span>
                    </div>
                    {isActive && <span className={`w-1.5 h-1.5 rounded-full ${isMusic ? 'bg-pink-400 shadow-pink-400' : 'bg-blue-400 shadow-blue-400'} shadow-sm`} />}
                  </button>
                );
              })}
            </nav>

            {/* Support Box */}
            <div className={`mt-6 p-4 rounded-xl ${isMusic ? 'bg-gradient-to-br from-pink-950/60 to-slate-900 border-pink-900/40' : 'bg-gradient-to-br from-blue-950/60 to-slate-900 border-blue-900/40'} border text-center relative overflow-hidden`}>
              <div className={`absolute top-0 right-0 w-20 h-20 ${isMusic ? 'bg-pink-500/10' : 'bg-blue-500/10'} rounded-full blur-xl pointer-events-none`} />
              <HelpCircle className={`w-6 h-6 ${isMusic ? 'text-pink-400' : 'text-blue-400'} mx-auto mb-2`} />
              <h4 className="text-xs font-bold text-white">Need Assistance?</h4>
              <p className="text-[11px] text-slate-400 mt-1 mb-3">Our faculty coordinator is here to help.</p>
              <button
                onClick={() => scrollToSection('Contact Us', 'sec-contact')}
                className={`w-full py-2 rounded-xl ${isMusic ? 'bg-pink-600 hover:bg-pink-500 shadow-pink-500/20' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20'} text-white text-xs font-bold transition-all shadow-lg active:scale-95`}
              >
                Get In Touch
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-9 space-y-8">

          {/* Section 1: HOD / Faculty Coordinator & About Club */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

            {/* HOD / Faculty Coordinator Card */}
            <div id="sec-hod" className="md:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-slate-700 transition-all scroll-mt-24">
              <div className={`absolute top-0 right-0 w-32 h-32 ${isMusic ? 'bg-pink-500/10' : 'bg-blue-500/10'} rounded-full blur-2xl pointer-events-none`} />

              <p className={`text-xs font-bold ${isMusic ? 'text-pink-400' : 'text-blue-400'} uppercase tracking-wider mb-4 flex items-center gap-1.5`}>
                <Users className="w-4 h-4" /> HOD / Faculty Coordinator
              </p>

              <div className="flex flex-col items-center text-center space-y-3">
                {/* HOD Image Frame */}
                <div className={`relative w-32 h-32 rounded-2xl overflow-hidden border-2 ${isMusic ? 'border-pink-500/40' : 'border-blue-500/40'} shadow-xl group-hover:scale-105 transition-transform duration-500`}>
                  <img
                    src={isMusic ? "/images/ananyaa-mohanty-hod.jpg" : "/images/anita-behera-hod.jpg"}
                    alt={isMusic ? "Mrs. Ananyaa Mohanty - Faculty Coordinator" : "Mrs. Anita Behera - HOD CSE & Faculty Coordinator"}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white flex items-center justify-center gap-1.5">
                    {isMusic ? 'Mrs. Ananyaa Mohanty' : 'Mrs. Anita Behera'}
                    <CheckCircle2 className={`w-4 h-4 ${isMusic ? 'text-pink-400' : 'text-blue-400'}`} />
                  </h3>
                  <p className={`text-xs font-semibold ${isMusic ? 'text-pink-400' : 'text-blue-400'}`}>
                    Head / Faculty Coordinator, {staticData.name}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Asst. Professor, BEC</p>
                  <p className="text-[11px] text-slate-500">Bhubaneswar Engineering College</p>
                </div>

                {/* HOD Quick Details */}
                <div className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-left space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Qualification:</span>
                    <span className="font-semibold text-white">{isMusic ? 'MSc. Agriculture (Agronomy)' : 'PhD*, M.Tech, BE'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Experience:</span>
                    <span className="font-semibold text-emerald-400">{isMusic ? '3 Yrs Teaching Experience' : '15+ Yrs Teaching | 3 Yrs Res.'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Specialization:</span>
                    <span className={`font-semibold ${isMusic ? 'text-pink-400' : 'text-blue-400'}`}>{isMusic ? 'Agronomy & Cultural Arts' : 'Computer Science & Eng.'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Research Papers:</span>
                    <span className="font-semibold text-violet-400">{isMusic ? '03 Papers in Journals' : '1 Patent Granted'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Patents / Books:</span>
                    <span className="font-semibold text-amber-400">{isMusic ? 'NIL' : '1 Patent Granted'}</span>
                  </div>
                </div>

                {/* Email Contact */}
                <div className="w-full pt-1 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
                  <a href={`mailto:${isMusic ? 'ananyaamohanty125@gmail.com' : 'anitabehera@gmail.com'}`} className={`flex items-center gap-1 ${isMusic ? 'text-pink-400' : 'text-blue-400'} hover:underline text-[11px]`}>
                    <Mail className="w-3.5 h-3.5" /> {isMusic ? 'ananyaamohanty125@gmail.com' : 'anitabehera@gmail.com'}
                  </a>
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-slate-800 rounded-lg text-slate-300 hover:text-white cursor-pointer"><Globe className="w-3.5 h-3.5" /></span>
                  </div>
                </div>
              </div>
            </div>

            {/* About Club Card */}
            <div id="sec-about" className="md:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between scroll-mt-24">
              <div>
                <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                  <Sparkles className={`w-5 h-5 ${isMusic ? 'text-pink-400' : 'text-blue-400'}`} /> About {staticData.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  {isMusic 
                    ? 'The Music & Dance Club is a vibrant student-driven performing arts community at Bhubaneswar Engineering College. We bring together vocalists, instrumentalists, classical dancers, western dancers, and performers to celebrate rhythm, expression, and creative arts.'
                    : 'The Microsoft Club is a student-driven technical community at Bhubaneswar Engineering College. We foster a collaborative environment where students learn cutting-edge technology, build real-world software, and gain hands-on experience with Microsoft Cloud and AI ecosystems.'
                  }
                </p>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                  {isMusic
                    ? 'Through regular jam sessions, dance workshops, auditions, and annual college fests, Music & Dance Club gives every student a platform to shine, perform live, and build lasting creative memories.'
                    : 'Through expert workshops, hackathons, and certification tracks, Microsoft Club equips students to transition smoothly into industry-ready software engineers and innovators.'
                  }
                </p>
              </div>

              {/* 4 Pillars Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {(isMusic ? [
                  { title: 'Perform', desc: 'Live Concerts & Stage', icon: Music, color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
                  { title: 'Rhythm', desc: 'Vocals & Instruments', icon: Flame, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
                  { title: 'Express', desc: 'Classical & Western', icon: Star, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
                  { title: 'Celebrate', desc: 'Campus Fests & Events', icon: Rocket, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                ] : [
                  { title: 'Learn', desc: 'Cutting-edge Tech', icon: BookOpen, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
                  { title: 'Build', desc: 'Real-world Projects', icon: Code2, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                  { title: 'Collaborate', desc: 'Work in Teams', icon: Users, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
                  { title: 'Innovate', desc: 'Solve Big Problems', icon: Rocket, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                ]).map((p) => {
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

          {/* Section 2: Upcoming Events */}
          <div id="sec-events" className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl scroll-mt-24">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Calendar className={`w-5 h-5 ${isMusic ? 'text-pink-400' : 'text-violet-400'}`} /> Upcoming Events & Workshops
                </h3>
                <p className="text-xs text-slate-400 mt-1">Participate in our upcoming sessions and sharpen your skills</p>
              </div>
              <Link href="/events" className={`text-xs font-bold ${isMusic ? 'text-pink-400' : 'text-blue-400'} hover:underline flex items-center gap-1`}>
                Explore All Events <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(isMusic ? [
                { title: 'Spring Musical Night 2026', date: '20 AUG', venue: 'Open Air Theatre, BEC', time: '06:00 PM - 10:00 PM', desc: 'Live musical bands, solo vocals, and acoustic acoustic jam sessions.' },
                { title: 'Inter-College Dance Battle', date: '02 SEP', venue: 'BEC Main Auditorium', time: '10:00 AM - 05:00 PM', desc: 'Western, Hip-Hop, and Classical solo & group dance competition.' },
                { title: 'Vocal & Instrument Auditions', date: '12 SEP', venue: 'Cultural Hall, BEC', time: '03:00 PM - 06:00 PM', desc: 'Auditions for joining the official college music band & dance troupe.' },
              ] : [
                { title: 'Azure Fundamentals Workshop', date: '15 AUG', venue: 'Seminar Hall, BEC', time: '10:00 AM - 01:00 PM', desc: 'Learn core cloud concepts and claim $100 Azure credits.' },
                { title: 'Build with AI Hackathon', date: '28 AUG', venue: 'Computer Lab, CSE', time: '09:00 AM - 09:00 PM', desc: '24-hour coding challenge to build AI solutions.' },
                { title: 'Microsoft Learn Challenge', date: '05 SEP', venue: 'Online Event', time: '07:00 PM - 08:30 PM', desc: 'Complete interactive learning modules for global badges.' },
              ]).map((ev) => (
                <div key={ev.title} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all group">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`px-3 py-1 rounded-lg ${isMusic ? 'bg-pink-600/20 border-pink-500/30' : 'bg-violet-600/20 border-violet-500/30'} border text-center`}>
                        <span className={`text-xs font-black ${isMusic ? 'text-pink-400' : 'text-violet-400'}`}>{ev.date}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">{ev.time}</span>
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold text-white ${isMusic ? 'group-hover:text-pink-400' : 'group-hover:text-blue-400'} transition-colors`}>{ev.title}</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{ev.desc}</p>
                    </div>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" /> {ev.venue}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => toast(`Registered for ${ev.title}!`, 'success')}
                    className={`w-full mt-4 ${isMusic ? 'bg-pink-600 hover:bg-pink-500' : 'bg-blue-600 hover:bg-blue-500'} text-white text-xs font-bold py-2 rounded-xl transition-all shadow-md`}
                  >
                    Register Now
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Frequently Asked Questions */}
          <div id="sec-faqs" className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl scroll-mt-24">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
              <HelpCircle className={`w-5 h-5 ${isMusic ? 'text-pink-400' : 'text-blue-400'}`} /> Frequently Asked Questions
            </h3>
            <p className="text-xs text-slate-400 mb-6">Got questions? Find clear answers right here.</p>

            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div key={faq.q} className="rounded-xl bg-slate-950/80 border border-slate-800 overflow-hidden transition-colors hover:border-slate-700">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full p-4 text-left flex items-center justify-between text-sm font-bold text-slate-200 hover:text-white transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 ${isMusic ? 'text-pink-400' : 'text-blue-400'} transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3"
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

          {/* Section 4: Contact Us */}
          <div id="sec-contact" className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl scroll-mt-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Mail className={`w-5 h-5 ${isMusic ? 'text-pink-400' : 'text-blue-400'}`} /> Contact {staticData.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Have questions about upcoming workshops, auditions, or performances? Reach out directly to our department coordinator.
                </p>
                <div className="space-y-2 text-xs text-slate-300 pt-2">
                  <p className="flex items-center gap-2">
                    <span className="text-slate-500 font-medium">Faculty Co-ordinator:</span>
                    <span className="font-semibold text-white">{isMusic ? 'Mrs. Ananyaa Mohanty' : 'Mrs. Anita Behera'}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-slate-500 font-medium">Official Email:</span>
                    <a href={`mailto:${isMusic ? 'ananyaamohanty125@gmail.com' : 'anitabehera@gmail.com'}`} className={`${isMusic ? 'text-pink-400' : 'text-blue-400'} hover:underline font-semibold`}>
                      {isMusic ? 'ananyaamohanty125@gmail.com' : 'anitabehera@gmail.com'}
                    </a>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-slate-500 font-medium">Department Office:</span>
                    <span className="text-slate-300">{isMusic ? 'Cultural Complex Room 104, BEC Campus' : 'Room 302, CSE Dept, BEC Campus'}</span>
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-white">Send Direct Inquiry</h4>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-700"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-700"
                />
                <textarea
                  rows={2}
                  placeholder="Your Message..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-700"
                />
                <button
                  onClick={() => toast(`Message sent to ${staticData.name} team!`, 'success')}
                  className={`w-full py-2.5 rounded-xl ${isMusic ? 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500' : 'bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500'} text-white font-bold text-xs shadow-md transition-all active:scale-95`}
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>

          {/* Bottom CTA Banner */}
          <div className={`rounded-3xl ${isMusic ? 'bg-gradient-to-r from-pink-600 via-rose-600 to-purple-700' : 'bg-gradient-to-r from-blue-600 via-violet-600 to-indigo-700'} p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6`}>
            <div>
              <h3 className="text-2xl font-black text-white">Ready to express, perform, and shine?</h3>
              <p className="text-sm text-pink-100 mt-1">Join {staticData.name} today and start your creative journey with us.</p>
            </div>
            <Button
              onClick={handleJoin}
              loading={joining}
              className={`bg-white hover:bg-slate-100 ${isMusic ? 'text-pink-900' : 'text-blue-900'} font-extrabold px-8 py-3.5 rounded-xl shadow-xl shrink-0 transition-transform transform active:scale-95`}
            >
              Join {staticData.name} →
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
