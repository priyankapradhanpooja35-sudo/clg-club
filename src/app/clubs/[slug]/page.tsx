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
  HelpCircle, MessageSquare, Flame, Check, Bookmark, Activity, Heart, Trophy,
  Mic, Radio, Video, TrendingUp, Lightbulb, LineChart, Target,
  TreePine, Droplets, Sprout, Globe2, Sun
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
  const isSports = slug.includes('sports') || slug.includes('health');
  const isMedia = slug.includes('media');
  const isStartup = slug.includes('startup') || slug.includes('internship');
  const isSocial = slug.includes('social') || slug.includes('environmental');

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
    || (isSports ? CLUBS_DATA.find(c => c.slug === 'sports-health-club') : null)
    || (isMedia ? CLUBS_DATA.find(c => c.slug === 'media-club') : null)
    || (isStartup ? CLUBS_DATA.find(c => c.slug === 'startup-internship-club') : null)
    || (isSocial ? CLUBS_DATA.find(c => c.slug === 'social-environmental-club') : null)
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
    <div className="min-h-screen bg-[#0A1128] text-slate-100 font-sans selection:bg-violet-500 selection:text-white pb-20 relative overflow-hidden">
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

            {/* About Club Card */}
            <div id="sec-about" className="md:col-span-12 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between scroll-mt-24">
              <div>
                <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                  <Sparkles className={`w-5 h-5 ${staticData.theme.includes('music') ? 'text-pink-400' : staticData.theme.includes('sports') ? 'text-green-400' : 'text-blue-400'}`} /> About {staticData.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  {staticData.description}
                </p>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                  {staticData.mission}
                </p>
              </div>

              {/* 4 Pillars Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {(isMusic ? [
                  { title: 'Perform', desc: 'Live Concerts & Stage', icon: Music, color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
                  { title: 'Rhythm', desc: 'Vocals & Instruments', icon: Flame, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
                  { title: 'Express', desc: 'Classical & Western', icon: Star, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
                  { title: 'Celebrate', desc: 'Campus Fests & Events', icon: Rocket, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                ] : isSports ? [
                  { title: 'Train', desc: 'Daily Workouts', icon: Dumbbell, color: 'text-green-400 bg-green-500/10 border-green-500/20' },
                  { title: 'Compete', desc: 'Tournaments', icon: Trophy, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                  { title: 'Recover', desc: 'Health & Wellness', icon: Heart, color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
                  { title: 'Teamwork', desc: 'Team Spirit', icon: Users, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
                ] : isMedia ? [
                  { title: 'Create', desc: 'Visual Storytelling', icon: Camera, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
                  { title: 'Broadcast', desc: 'Podcasts & Radio', icon: Mic, color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
                  { title: 'Edit', desc: 'Post Production', icon: Video, color: 'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20' },
                  { title: 'Engage', desc: 'Social Media Reach', icon: Radio, color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
                ] : isStartup ? [
                  { title: 'Ideate', desc: 'Brainstorm & Validate', icon: Lightbulb, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
                  { title: 'Pitch', desc: 'Secure Funding', icon: Target, color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
                  { title: 'Build', desc: 'Develop MVPs', icon: Code2, color: 'text-red-400 bg-red-500/10 border-red-500/20' },
                  { title: 'Scale', desc: 'Growth & Marketing', icon: TrendingUp, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
                ] : isSocial ? [
                  { title: 'Conserve', desc: 'Protect Nature', icon: TreePine, color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
                  { title: 'Educate', desc: 'Spread Awareness', icon: Globe2, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
                  { title: 'Empower', desc: 'Community Service', icon: Users, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                  { title: 'Sustain', desc: 'Eco-Friendly Tech', icon: Sprout, color: 'text-green-400 bg-green-500/10 border-green-500/20' },
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

          {/* HOD / Faculty Coordinator Section */}
          {staticData.hodName && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl mb-6 flex flex-col md:flex-row gap-6 items-center">
              <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-full border-4 border-slate-800 overflow-hidden shadow-2xl relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 z-10" />
                <img src={staticData.hodPhoto} alt={staticData.hodName} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 space-y-3 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-xs font-medium text-slate-300">
                  <Award className="w-3.5 h-3.5 text-amber-400" /> Faculty Coordinator
                </div>
                <h3 className="text-2xl font-bold text-white">{staticData.hodName}</h3>
                <p className="text-sm font-medium text-blue-400">{staticData.hodDesignation} • {staticData.hodExperience}</p>
                
                <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-1 pb-2">
                  <Badge variant="info" className="bg-slate-800/30 text-slate-300 border-slate-700">{staticData.hodQualification}</Badge>
                  <Badge variant="info" className="bg-slate-800/30 text-slate-300 border-slate-700">{staticData.hodSpecialization}</Badge>
                </div>
                
                <blockquote className="border-l-2 border-slate-700 pl-4 py-1 text-sm text-slate-400 italic">
                  {staticData.hodQuote}
                </blockquote>
                
                <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
                  <a href={`mailto:${staticData.hodEmail}`} className="text-xs flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors">
                    <Mail className="w-3.5 h-3.5" /> Email
                  </a>
                  <span className="text-xs flex items-center gap-1.5 text-slate-400">
                    <MapPin className="w-3.5 h-3.5" /> {staticData.hodOfficeLocation}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Social & Environmental Unique Feature: Eco-Impact Tracker */}
          {staticData.slug === 'social-environmental-club' && (
            <div className="bg-slate-900/90 border border-teal-500/30 rounded-2xl p-8 shadow-[0_0_30px_rgba(20,184,166,0.15)] overflow-hidden relative mb-6">
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                
                {/* Glowing Tree Animation & Stats */}
                <div className="flex flex-col items-center justify-center">
                  <h3 className="text-xl font-black text-white mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-400">Eco-Impact Tracker</h3>
                  <div className="relative w-full max-w-[280px] h-56 flex flex-col items-center justify-center bg-slate-950 rounded-2xl border-2 border-slate-800 shadow-inner overflow-hidden mt-4">
                    {/* Glowing Tree Center */}
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <div className="relative">
                        <div className="absolute inset-0 bg-teal-500/20 blur-xl rounded-full scale-150 animate-pulse" />
                        <TreePine className="w-20 h-20 text-teal-400 drop-shadow-[0_0_15px_rgba(20,184,166,0.5)] relative z-10 animate-grow" />
                      </div>
                    </div>
                    
                    {/* Floating Leaves Background */}
                    <div className="absolute inset-0 flex items-center justify-center z-10 opacity-40">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Leaf 
                          key={i} 
                          className="absolute text-teal-500/30 animate-float-leaf"
                          style={{
                            width: Math.random() * 15 + 10 + 'px',
                            height: Math.random() * 15 + 10 + 'px',
                            top: Math.random() * 100 + '%',
                            left: Math.random() * 100 + '%',
                            animationDelay: Math.random() * 3 + 's',
                            animationDuration: Math.random() * 2 + 3 + 's'
                          }}
                        />
                      ))}
                    </div>

                    <div className="absolute bottom-4 flex gap-4 w-full justify-around px-4 z-30">
                      <div className="text-center">
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Trees Planted</p>
                        <p className="text-lg font-black text-teal-400">1,250 <span className="text-xs">Trees</span></p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Carbon Offset</p>
                        <p className="text-lg font-black text-cyan-400">45 <span className="text-xs">Tons</span></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sustainability Journey */}
                <div className="space-y-6">
                  <h3 className="text-xl font-black text-white text-center lg:text-left bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-400">Action Roadmap</h3>
                  <div className="relative border-l-2 border-teal-500/30 pl-6 space-y-6">
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] border-2 border-slate-900" />
                      <h4 className="text-sm font-bold text-blue-400">1. Awareness Campaigns</h4>
                      <p className="text-xs text-slate-400 mt-1">Seminars on climate change, pollution, and sustainable living.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] border-2 border-slate-900" />
                      <h4 className="text-sm font-bold text-cyan-400">2. Campus Clean-up Drives</h4>
                      <p className="text-xs text-slate-400 mt-1">Organizing weekly plastic-free zones and recycling efforts.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.8)] border-2 border-slate-900" />
                      <h4 className="text-sm font-bold text-teal-300">3. Mega Plantation</h4>
                      <p className="text-xs text-slate-500 mt-1">Planting saplings across the city to restore green cover.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-slate-700 border-2 border-slate-900" />
                      <h4 className="text-sm font-bold text-slate-300">4. Community Outreach</h4>
                      <p className="text-xs text-slate-500 mt-1">Helping local villages with clean water and solar initiatives.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Startup & Internship Unique Feature: Venture Launchpad */}
          {staticData.slug === 'startup-internship-club' && (
            <div className="bg-slate-900/90 border border-orange-500/30 rounded-2xl p-8 shadow-[0_0_30px_rgba(249,115,22,0.15)] overflow-hidden relative mb-6">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                
                {/* Rocket Launch Animation & Stats */}
                <div className="flex flex-col items-center justify-center">
                  <h3 className="text-xl font-black text-white mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-400">Venture Launchpad</h3>
                  <div className="relative w-full max-w-[280px] h-56 flex flex-col items-center justify-center bg-slate-950 rounded-2xl border-2 border-slate-800 shadow-inner overflow-hidden mt-4">
                    {/* Glowing Rocket Center */}
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <div className="relative">
                        <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full scale-150 animate-pulse" />
                        <Rocket className="w-20 h-20 text-orange-400 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)] relative z-10 animate-bounce" />
                      </div>
                    </div>
                    
                    {/* Starfield Background */}
                    <div className="absolute inset-0 flex items-center justify-center z-10 opacity-40">
                      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                        <div 
                          key={i} 
                          className="absolute bg-white rounded-full animate-twinkle"
                          style={{
                            width: Math.random() * 3 + 'px',
                            height: Math.random() * 3 + 'px',
                            top: Math.random() * 100 + '%',
                            left: Math.random() * 100 + '%',
                            animationDelay: Math.random() * 2 + 's'
                          }}
                        />
                      ))}
                    </div>

                    <div className="absolute bottom-4 flex gap-4 w-full justify-around px-4 z-30">
                      <div className="text-center">
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Funded Startups</p>
                        <p className="text-lg font-black text-orange-400">12 <span className="text-xs">Active</span></p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Total Capital</p>
                        <p className="text-lg font-black text-red-400">₹50L <span className="text-xs">Raised</span></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Startup Journey */}
                <div className="space-y-6">
                  <h3 className="text-xl font-black text-white text-center lg:text-left bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-400">Founder's Journey</h3>
                  <div className="relative border-l-2 border-orange-500/30 pl-6 space-y-6">
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)] border-2 border-slate-900" />
                      <h4 className="text-sm font-bold text-yellow-400">1. Ideation & MVP</h4>
                      <p className="text-xs text-slate-400 mt-1">Brainstorming, market research, and building the first prototype.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.8)] border-2 border-slate-900" />
                      <h4 className="text-sm font-bold text-orange-400">2. Pre-Incubation</h4>
                      <p className="text-xs text-slate-400 mt-1">Mentorship, business model canvas, and early user testing.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] border-2 border-slate-900" />
                      <h4 className="text-sm font-bold text-red-300">3. Pitching & Funding</h4>
                      <p className="text-xs text-slate-500 mt-1">Presenting to angel investors and securing seed capital.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-slate-700 border-2 border-slate-900" />
                      <h4 className="text-sm font-bold text-slate-300">4. Growth & Scale</h4>
                      <p className="text-xs text-slate-500 mt-1">Expanding the team, scaling operations, and hitting milestones.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Media Unique Feature: Broadcasting Studio */}
          {staticData.slug === 'media-club' && (
            <div className="bg-slate-900/90 border border-purple-500/30 rounded-2xl p-8 shadow-[0_0_30px_rgba(168,85,247,0.15)] overflow-hidden relative mb-6">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                
                {/* On Air Broadcasting Studio */}
                <div className="flex flex-col items-center justify-center relative">
                  <h3 className="text-xl font-black text-white mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-violet-400">Broadcasting Studio</h3>
                  
                  {/* ON AIR Sign */}
                  <div className="absolute -top-4 right-0 lg:right-auto lg:-top-6 bg-slate-950 border-2 border-red-500/30 rounded-lg px-4 py-1.5 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,1)]" />
                    <span className="text-red-500 font-black tracking-widest text-sm">ON AIR</span>
                  </div>

                  <div className="relative w-full max-w-[280px] h-56 flex flex-col items-center justify-center bg-slate-950 rounded-2xl border-2 border-slate-800 shadow-inner overflow-hidden mt-4">
                    {/* Glowing Center Microphone */}
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <div className="relative">
                        <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full scale-150 animate-pulse" />
                        <Mic className="w-20 h-20 text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] relative z-10" />
                      </div>
                    </div>
                    
                    {/* Soundwaves Animation */}
                    <div className="absolute inset-0 flex items-center justify-center gap-1.5 z-10 opacity-60">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i) => (
                        <div 
                          key={i} 
                          className="w-1.5 bg-gradient-to-t from-purple-600 to-violet-400 rounded-full animate-soundwave"
                          style={{ 
                            height: `${20 + Math.random() * 60}%`, 
                            animationDelay: `${Math.random() * 0.5}s`,
                            animationDuration: `${0.8 + Math.random() * 0.5}s`
                          }}
                        />
                      ))}
                    </div>

                    <div className="absolute bottom-4 flex gap-4 w-full justify-around px-4 z-30">
                      <div className="text-center">
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Listener Count</p>
                        <p className="text-lg font-black text-purple-400">4,208 <span className="text-xs">Live</span></p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Frequency</p>
                        <p className="text-lg font-black text-violet-400">98.3 <span className="text-xs">MHz</span></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Media Journey */}
                <div className="space-y-6">
                  <h3 className="text-xl font-black text-white text-center lg:text-left bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-violet-400">Content Journey</h3>
                  <div className="relative border-l-2 border-purple-500/30 pl-6 space-y-6">
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)] border-2 border-slate-900" />
                      <h4 className="text-sm font-bold text-white">1. Pre-Production</h4>
                      <p className="text-xs text-slate-400 mt-1">Scripting, storyboarding, and planning the ultimate shoot.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.8)] border-2 border-slate-900" />
                      <h4 className="text-sm font-bold text-violet-400">2. Lights, Camera, Action!</h4>
                      <p className="text-xs text-slate-400 mt-1">Operating professional DSLRs, drones, and audio gear on the field.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-fuchsia-500 shadow-[0_0_10px_rgba(217,70,239,0.8)] border-2 border-slate-900" />
                      <h4 className="text-sm font-bold text-fuchsia-300">3. Post-Production Magic</h4>
                      <p className="text-xs text-slate-500 mt-1">Color grading, audio mixing, and video editing in Adobe Premiere.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-slate-700 border-2 border-slate-900" />
                      <h4 className="text-sm font-bold text-slate-300">4. Publishing & Broadcasting</h4>
                      <p className="text-xs text-slate-500 mt-1">Going live on YouTube, campus radio, and social media platforms.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sports & Health Unique Feature: Active Life & Fitness Dashboard */}
          {staticData.slug === 'sports-health-club' && (
            <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-8 shadow-[0_0_30px_rgba(16,185,129,0.15)] overflow-hidden relative mb-6">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                
                {/* Heart Rate & Pulse Animation */}
                <div className="flex flex-col items-center justify-center">
                  <h3 className="text-xl font-black text-white mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-400">Peak Performance</h3>
                  <div className="relative w-full max-w-[280px] h-48 flex flex-col items-center justify-center bg-slate-950 rounded-2xl border-2 border-slate-800 shadow-inner overflow-hidden">
                    {/* Glowing Center Heart */}
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <Heart className="w-16 h-16 text-emerald-500 fill-emerald-500/20 animate-heartbeat drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                    </div>
                    
                    {/* Activity EKG Line (SVG) */}
                    <div className="absolute inset-0 flex items-center justify-center z-10 opacity-70">
                      <svg width="280" height="100" viewBox="0 0 280 100" className="stroke-emerald-400 stroke-2 fill-none stroke-[3px]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M 0 50 L 50 50 L 65 20 L 80 80 L 100 10 L 120 90 L 135 50 L 280 50">
                          <animate attributeName="stroke-dasharray" values="0, 1000; 1000, 0" dur="2s" repeatCount="indefinite" />
                        </path>
                      </svg>
                    </div>

                    <div className="absolute bottom-4 flex gap-4 w-full justify-around px-4 z-30">
                      <div className="text-center">
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Avg HR</p>
                        <p className="text-lg font-black text-emerald-400">124 <span className="text-xs">bpm</span></p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Active</p>
                        <p className="text-lg font-black text-emerald-400">3h <span className="text-xs">/day</span></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fitness Roadmap */}
                <div className="space-y-6">
                  <h3 className="text-xl font-black text-white text-center lg:text-left bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-400">Fitness Journey</h3>
                  <div className="relative border-l-2 border-emerald-500/30 pl-6 space-y-6">
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] border-2 border-slate-900" />
                      <h4 className="text-sm font-bold text-white">1. Fitness Assessment</h4>
                      <p className="text-xs text-slate-400 mt-1">Get your baseline health stats and body composition checked.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)] border-2 border-slate-900" />
                      <h4 className="text-sm font-bold text-green-400">2. Daily Training</h4>
                      <p className="text-xs text-slate-400 mt-1">Participate in organized practice sessions and bootcamps.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.8)] border-2 border-slate-900" />
                      <h4 className="text-sm font-bold text-teal-300">3. Campus Marathons</h4>
                      <p className="text-xs text-slate-500 mt-1">Join our bi-annual 5K runs and cycling events.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-slate-700 border-2 border-slate-900" />
                      <h4 className="text-sm font-bold text-slate-300">4. Inter-College Tournaments</h4>
                      <p className="text-xs text-slate-500 mt-1">Represent the college and bring home the trophy!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Music & Dance Unique Feature: Rhythm & Stage Visualizer */}
          {staticData.slug === 'music-dance-club' && (
            <div className="bg-slate-900/90 border border-pink-500/30 rounded-2xl p-8 shadow-[0_0_30px_rgba(236,72,153,0.15)] overflow-hidden relative mb-6">
              <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                
                {/* Vinyl Record & Stage Animation */}
                <div className="flex flex-col items-center justify-center">
                  <h3 className="text-xl font-black text-white mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-rose-400">The Stage is Yours</h3>
                  <div className="relative w-64 h-64 flex items-center justify-center">
                    {/* Glowing Stage Base */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-pink-500/20 to-purple-500/20 blur-xl animate-pulse" />
                    
                    {/* Vinyl Record */}
                    <div className="relative w-48 h-48 rounded-full bg-slate-950 border-4 border-slate-800 shadow-2xl flex items-center justify-center animate-spin-slow z-20 overflow-hidden">
                      {/* Grooves */}
                      <div className="absolute inset-1 rounded-full border border-slate-800/80" />
                      <div className="absolute inset-3 rounded-full border border-slate-800/80" />
                      <div className="absolute inset-6 rounded-full border border-slate-800/80" />
                      <div className="absolute inset-9 rounded-full border border-slate-800/80" />
                      <div className="absolute inset-12 rounded-full border border-slate-800/80" />
                      
                      {/* Vinyl Label */}
                      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center z-10 shadow-inner border-2 border-slate-900">
                        <div className="w-3 h-3 rounded-full bg-slate-950" /> {/* Spindle hole */}
                      </div>
                    </div>
                    
                    {/* Floating Notes */}
                    <div className="absolute top-4 left-4 text-pink-400 animate-float z-30"><Music className="w-6 h-6" /></div>
                    <div className="absolute bottom-10 right-4 text-rose-400 animate-float-delayed z-30"><Flame className="w-5 h-5" /></div>
                    <div className="absolute top-1/2 -right-4 text-purple-400 animate-float z-30"><Star className="w-8 h-8" /></div>
                  </div>
                </div>

                {/* Journey Roadmap */}
                <div className="space-y-6">
                  <h3 className="text-xl font-black text-white text-center lg:text-left bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-rose-400">Your Journey</h3>
                  <div className="relative border-l-2 border-pink-500/30 pl-6 space-y-6">
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.8)] border-2 border-slate-900" />
                      <h4 className="text-sm font-bold text-white">1. Auditions & Entry</h4>
                      <p className="text-xs text-slate-400 mt-1">Showcase your talent in our bi-annual open mic & dance auditions.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-rose-400 shadow-[0_0_10px_rgba(251,113,133,0.8)] border-2 border-slate-900" />
                      <h4 className="text-sm font-bold text-rose-400">2. Rehearsals & Jamming</h4>
                      <p className="text-xs text-slate-400 mt-1">Join weekly band jams and choreography practice sessions.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)] border-2 border-slate-900" />
                      <h4 className="text-sm font-bold text-purple-300">3. Campus Fests</h4>
                      <p className="text-xs text-slate-500 mt-1">Perform live in front of the entire college at our annual cultural fest.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-slate-700 border-2 border-slate-900" />
                      <h4 className="text-sm font-bold text-slate-300">4. Inter-College Battles</h4>
                      <p className="text-xs text-slate-500 mt-1">Represent BEC in regional and national level competitions.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Microsoft Unique Feature: Tech Orbit & Roadmap (ONLY for microsoft-club) */}
          {staticData.slug === 'microsoft-club' && (
            <div className="bg-slate-900/90 border border-blue-500/30 rounded-2xl p-8 shadow-[0_0_30px_rgba(37,99,235,0.15)] overflow-hidden relative mb-6">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                {/* Tech Orbit Animation */}
                <div className="flex flex-col items-center justify-center">
                  <h3 className="text-xl font-black text-white mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">Microsoft Tech Stack</h3>
                  <div className="relative w-64 h-64 flex items-center justify-center">
                    {/* Center Logo */}
                    <div className="w-16 h-16 bg-white rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.5)] z-20 flex items-center justify-center p-2">
                      <img src="/images/microsoft-logo-official.jpg" alt="Microsoft" className="w-full h-full object-contain" />
                    </div>
                    
                    {/* Inner Orbit */}
                    <div className="absolute inset-0 rounded-full border border-blue-500/20" />
                    
                    <div className="absolute w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center p-1.5 shadow-lg border border-slate-700 animate-orbit z-10">
                      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg" alt="Azure" className="w-full h-full" />
                    </div>
                    
                    <div className="absolute w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center p-1.5 shadow-lg border border-slate-700 animate-orbit-delayed z-10">
                      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg" alt="C#" className="w-full h-full" />
                    </div>

                    {/* Outer Orbit */}
                    <div className="absolute -inset-8 rounded-full border border-cyan-500/20 border-dashed" />
                    
                    <div className="absolute w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center p-2 shadow-lg border border-slate-700 animate-orbit-outer z-10">
                      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub" className="w-full h-full" />
                    </div>
                    
                    <div className="absolute w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center p-2 shadow-lg border border-slate-700 animate-orbit-outer-delayed z-10">
                      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" alt="VS Code" className="w-full h-full" />
                    </div>
                  </div>
                </div>

                {/* Certification Roadmap */}
                <div className="space-y-6">
                  <h3 className="text-xl font-black text-white text-center lg:text-left bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">Certification Roadmap</h3>
                  <div className="relative border-l-2 border-blue-500/30 pl-6 space-y-6">
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.8)] border-2 border-slate-900" />
                      <h4 className="text-sm font-bold text-white">1. Join the Club</h4>
                      <p className="text-xs text-slate-400 mt-1">Attend intro sessions and setup Azure student account.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] border-2 border-slate-900" />
                      <h4 className="text-sm font-bold text-cyan-400">2. Azure Fundamentals (AZ-900)</h4>
                      <p className="text-xs text-slate-400 mt-1">Free certification vouchers and weekend bootcamps.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-slate-700 border-2 border-slate-900" />
                      <h4 className="text-sm font-bold text-slate-300">3. AI Engineer (AI-900)</h4>
                      <p className="text-xs text-slate-500 mt-1">Master OpenAI models and cognitive services.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-slate-700 border-2 border-slate-900" />
                      <h4 className="text-sm font-bold text-slate-300">4. Build & Compete</h4>
                      <p className="text-xs text-slate-500 mt-1">Participate in Imagine Cup and SIH using Microsoft tech.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

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
