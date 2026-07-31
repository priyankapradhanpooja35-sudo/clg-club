'use client';

import { useEffect, useState } from 'react';
import { useParams, usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { CLUBS_DATA } from '@/lib/clubs-data';
import { toast } from '@/components/ui/Toast';
import { useAuth } from '@/lib/AuthContext';
import {
  Monitor, Music, Star, Dumbbell, Camera, Rocket, Leaf, Briefcase,
  Users, Calendar, MapPin, ArrowRight, CheckCircle2, ChevronDown,
  Cloud, Code2, ShieldCheck, Award,
  Mail, BookOpen, Layers, Sparkles,
  HelpCircle, Flame, Bookmark, Heart, Trophy,
  Mic, Radio, Video, TrendingUp, Lightbulb, Target,
  TreePine, Sprout, Globe2
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [following, setFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const staticData = CLUBS_DATA.find(c => c.slug === slug)
    || (isMusic ? CLUBS_DATA.find(c => c.slug === 'music-dance-club') : null)
    || CLUBS_DATA[0];

  useEffect(() => {
    fetch('/api/events')
      .then(r => r.json())
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, []);

  const handleJoin = async () => {
    if (!user) { toast(`Please login to join ${staticData.name}`, 'info'); return; }
    setJoining(true);
    setTimeout(() => {
      setJoining(false);
      toast(`Successfully joined ${staticData.name}! Welcome aboard 🎉`, 'success');
    }, 800);
  };

  const faqs = isMusic ? [
    { q: 'Who can join Rhythmix Music & Dance Club?', a: 'Any student of BEC with a passion for music, vocals, dance, or stage performance can join! No prior professional experience required.' },
    { q: 'Are instruments and practice spaces provided?', a: 'Yes! The club provides access to the campus music studio, sound equipment, keyboards, guitars, drums, and choreography rooms.' },
    { q: 'How often are rehearsals conducted?', a: 'Jam sessions happen twice a week (Tuesdays & Thursdays, 5 PM – 7 PM) at the Cultural Complex.' },
  ] : [
    { q: 'Who can join the club?', a: 'All enrolled BEC students across any engineering discipline or batch can join.' },
    { q: 'Are there membership fees?', a: 'No, membership is completely free for all BEC students.' },
    { q: 'How can I participate in upcoming workshops?', a: 'Simply click "Register Now" on any upcoming event card on this page.' },
  ];

  const scrollToSection = (tabName: string, secId: string) => {
    setActiveTab(tabName);
    if (secId === 'sec-overview') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elem = document.getElementById(secId);
    if (elem) {
      const yOffset = -90;
      const y = elem.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans relative pb-20">
      <Navbar />

      {/* Subtle Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 space-y-6 relative z-10">

        {/* Top Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-200/90 dark:border-slate-800">
          <Link href="/clubs" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Clubs</Link>
          <span>&gt;</span>
          <span className="text-slate-900 dark:text-white font-medium">{staticData.name}</span>
        </div>

        {/* ─── 1. HERO HEADER CARD (Matching Home Page surface styling) ─── */}
        <div id="sec-overview" className="scroll-mt-24">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-none relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

              {/* Left Info */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {/* Logo Frame */}
                  <div className="h-16 w-16 shrink-0 rounded-xl bg-white dark:bg-slate-800 p-1.5 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                    <img src={(staticData as any).logo || staticData.image} alt={staticData.name} className="w-full h-full object-contain" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                        {staticData.name}
                      </h1>
                      <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                    </div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                      {isMusic ? 'Department of Cultural Affairs & Performing Arts, BEC' : 'Department of Computer Science & Engineering, BEC'}
                    </p>
                  </div>
                </div>

                <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
                  {staticData.description}
                </p>

                {/* Stats Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-3 border-y border-slate-100 dark:border-slate-800">
                  <div>
                    <p className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1">
                      <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" /> {loading ? '...' : (members.length > 0 ? members.length : isMusic ? '380+' : '420+')}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium">Members</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> {loading ? '...' : isMusic ? '34' : '28'}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium">Events</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1">
                      <Award className="w-4 h-4 text-amber-500" /> 2021
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium">Founded</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1">
                      ⭐ {isMusic ? '4.95' : '4.9'}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium">Rating</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <Button
                    onClick={handleJoin}
                    loading={joining}
                    className="bg-[#2563EB] hover:bg-blue-700 text-white font-medium text-xs px-6 py-2.5 rounded-xl shadow-none transition-colors cursor-pointer"
                  >
                    Join Club
                  </Button>
                  <button
                    onClick={() => { setFollowing(!following); toast(following ? 'Unfollowed club' : `Following ${staticData.name}!`, 'info'); }}
                    className={`border px-5 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${following
                        ? 'border-blue-600 text-blue-600 bg-blue-50 dark:bg-blue-950/40'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 inline-block mr-1.5 ${following ? 'fill-blue-600' : ''}`} />
                    {following ? 'Following' : 'Follow Club'}
                  </button>
                </div>
              </div>

              {/* Right Banner Graphic */}
              <div className="lg:col-span-5 relative flex justify-center">
                <div className="relative w-full max-w-md aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50 group">
                  <img
                    src={isMusic ? "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80" : "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80"}
                    alt={isMusic ? "Stage Setup" : "Cloud Setup"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 p-3 rounded-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                      {isMusic ? <Music className="w-6 h-6 text-pink-600 shrink-0" /> : <Cloud className="w-6 h-6 text-blue-600 shrink-0" />}
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{isMusic ? 'Rhythm & Expression Stage' : 'Microsoft Azure Cloud Hub'}</h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">{isMusic ? 'Express, perform & shine on stage' : 'Build, deploy & scale modern web applications'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 2. MAIN BODY GRID (Sidebar + Content Cards) ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Navigation Sidebar */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-none sticky top-24">
              <div className="flex items-center justify-between px-1 py-1 border-b border-slate-100 dark:border-slate-800 mb-3">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Navigation
                </p>
              </div>

              <nav className="space-y-1">
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
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${isActive
                          ? 'border-2 border-slate-900 dark:border-slate-100 text-slate-900 dark:text-slate-100 font-semibold bg-white dark:bg-slate-900'
                          : 'border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-white dark:bg-slate-900'
                        }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <IconComp className="w-3.5 h-3.5 text-slate-400" />
                        <span>{tab.name}</span>
                      </div>
                    </button>
                  );
                })}
              </nav>

              {/* Support Box */}
              <div className="mt-5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-center">
                <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mx-auto mb-1.5" />
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Need Assistance?</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 mb-3">Our faculty coordinator is here to help.</p>
                <button
                  onClick={() => scrollToSection('Contact Us', 'sec-contact')}
                  className="w-full py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Get In Touch
                </button>
              </div>
            </div>
          </div>

          {/* Right Main Content Cards */}
          <div className="lg:col-span-9 space-y-6">

            {/* About Club Card */}
            <div id="sec-about" className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-none scroll-mt-24">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" /> About {staticData.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                {staticData.description}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-5">
                {staticData.mission}
              </p>

              {/* 4 Pillars Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                {(isMusic ? [
                  { title: 'Perform', desc: 'Live Concerts & Stage', icon: Music },
                  { title: 'Rhythm', desc: 'Vocals & Instruments', icon: Flame },
                  { title: 'Express', desc: 'Classical & Western', icon: Star },
                  { title: 'Celebrate', desc: 'Campus Fests & Events', icon: Rocket },
                ] : isSports ? [
                  { title: 'Train', desc: 'Daily Workouts', icon: Dumbbell },
                  { title: 'Compete', desc: 'Tournaments', icon: Trophy },
                  { title: 'Recover', desc: 'Health & Wellness', icon: Heart },
                  { title: 'Teamwork', desc: 'Team Spirit', icon: Users },
                ] : isMedia ? [
                  { title: 'Create', desc: 'Visual Storytelling', icon: Camera },
                  { title: 'Broadcast', desc: 'Podcasts & Radio', icon: Mic },
                  { title: 'Edit', desc: 'Post Production', icon: Video },
                  { title: 'Engage', desc: 'Social Media Reach', icon: Radio },
                ] : isStartup ? [
                  { title: 'Ideate', desc: 'Brainstorm & Validate', icon: Lightbulb },
                  { title: 'Pitch', desc: 'Secure Funding', icon: Target },
                  { title: 'Build', desc: 'Develop MVPs', icon: Code2 },
                  { title: 'Scale', desc: 'Growth & Marketing', icon: TrendingUp },
                ] : isSocial ? [
                  { title: 'Conserve', desc: 'Protect Nature', icon: TreePine },
                  { title: 'Educate', desc: 'Spread Awareness', icon: Globe2 },
                  { title: 'Empower', desc: 'Community Service', icon: Users },
                  { title: 'Sustain', desc: 'Eco-Friendly Tech', icon: Sprout },
                ] : [
                  { title: 'Learn', desc: 'Cutting-edge Tech', icon: BookOpen },
                  { title: 'Build', desc: 'Real-world Projects', icon: Code2 },
                  { title: 'Collaborate', desc: 'Work in Teams', icon: Users },
                  { title: 'Innovate', desc: 'Solve Big Problems', icon: Rocket },
                ]).map((p) => {
                  const PIcon = p.icon;
                  return (
                    <div key={p.title} className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-center space-y-1">
                      <PIcon className="w-4 h-4 mx-auto text-blue-600 dark:text-blue-400" />
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-white">{p.title}</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">{p.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* HOD / Faculty Coordinator Card */}
            {staticData.hodName && (
              <div id="sec-hod" className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-none scroll-mt-24 flex flex-col md:flex-row gap-6 items-center">
                <div className="w-28 h-28 md:w-32 md:h-32 shrink-0 rounded-full border-2 border-slate-200 dark:border-slate-700 overflow-hidden relative bg-slate-100">
                  <img src={staticData.hodPhoto} alt={staticData.hodName} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-2.5 text-center md:text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300">
                    <Award className="w-3.5 h-3.5 text-amber-500" /> Faculty Coordinator
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{staticData.hodName}</h3>
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">{staticData.hodDesignation} • {staticData.hodExperience}</p>

                  <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-0.5">
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400">{staticData.hodQualification}</span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400">{staticData.hodSpecialization}</span>
                  </div>

                  <blockquote className="border-l-2 border-slate-300 dark:border-slate-700 pl-3 py-0.5 text-xs text-slate-500 dark:text-slate-400 italic">
                    {staticData.hodQuote}
                  </blockquote>

                  <div className="flex items-center justify-center md:justify-start gap-4 pt-1 text-xs text-slate-500 dark:text-slate-400">
                    <a href={`mailto:${staticData.hodEmail}`} className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors">
                      <Mail className="w-3.5 h-3.5" /> Email
                    </a>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {staticData.hodOfficeLocation}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Microsoft Unique Feature: Tech Orbit & Roadmap (ONLY for microsoft-club) */}
            {staticData.slug === 'microsoft-club' && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-none overflow-hidden relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="flex flex-col items-center justify-center">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6 text-center">Microsoft Tech Stack</h3>
                    <div className="relative w-56 h-56 flex items-center justify-center">
                      <div className="w-14 h-14 bg-white rounded-xl shadow-sm border border-slate-200 z-20 flex items-center justify-center p-2">
                        <img src="/images/microsoft-logo-official.jpg" alt="Microsoft" className="w-full h-full object-contain" />
                      </div>
                      <div className="absolute inset-0 rounded-full border border-slate-200 dark:border-slate-800" />
                      <div className="absolute w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center p-1.5 shadow border border-slate-200 dark:border-slate-700 animate-orbit z-10">
                        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg" alt="Azure" className="w-full h-full" />
                      </div>
                      <div className="absolute w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center p-1.5 shadow border border-slate-200 dark:border-slate-700 animate-orbit-delayed z-10">
                        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg" alt="C#" className="w-full h-full" />
                      </div>
                      <div className="absolute -inset-6 rounded-full border border-slate-200 dark:border-slate-800 border-dashed" />
                      <div className="absolute w-9 h-9 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center p-1.5 shadow border border-slate-200 dark:border-slate-700 animate-orbit-outer z-10">
                        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub" className="w-full h-full" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Certification Roadmap</h3>
                    <div className="relative border-l border-slate-200 dark:border-slate-800 pl-4 space-y-4 text-xs">
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">1. Join the Club</h4>
                        <p className="text-slate-500 dark:text-slate-400 mt-0.5">Attend intro sessions and setup Azure student account.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-600 dark:text-blue-400">2. Azure Fundamentals (AZ-900)</h4>
                        <p className="text-slate-500 dark:text-slate-400 mt-0.5">Free certification vouchers and weekend bootcamps.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">3. AI Engineer (AI-900)</h4>
                        <p className="text-slate-500 dark:text-slate-400 mt-0.5">Master OpenAI models and cognitive services.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Upcoming Events Section */}
            <div id="sec-events" className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-none scroll-mt-24">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" /> Upcoming Events & Workshops
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Participate in our upcoming sessions and sharpen your skills</p>
                </div>
                <Link href="/events" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                  Explore All <ArrowRight className="w-3.5 h-3.5" />
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
                  <div key={ev.title} className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/50">
                          {ev.date}
                        </span>
                        <span className="text-[10px] text-slate-400">{ev.time}</span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{ev.title}</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{ev.desc}</p>
                      </div>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" /> {ev.venue}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => toast(`Registered for ${ev.title}!`, 'success')}
                      className="w-full mt-3 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-medium py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Register Now
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs Section */}
            <div id="sec-faqs" className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-none scroll-mt-24">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
                <HelpCircle className="w-4 h-4 text-blue-600" /> Frequently Asked Questions
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">Got questions? Find clear answers right here.</p>

              <div className="space-y-2.5">
                {faqs.map((faq, index) => {
                  const isOpen = openFaq === index;
                  return (
                    <div key={faq.q} className="rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden bg-slate-50/50 dark:bg-slate-800/30">
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : index)}
                        className="w-full p-3.5 text-left flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-white cursor-pointer"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-3.5 pb-3.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-200/60 dark:border-slate-800/60 pt-2.5"
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

            {/* Contact Us Section */}
            <div id="sec-contact" className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-none scroll-mt-24">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-600" /> Contact {staticData.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Have questions about upcoming workshops, auditions, or performances? Reach out directly to our department coordinator.
                  </p>
                  <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-1">
                    <p className="flex items-center gap-2">
                      <span className="text-slate-400 font-medium">Faculty Co-ordinator:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{isMusic ? 'Mrs. Ananyaa Mohanty' : 'Mrs. Anita Behera'}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-slate-400 font-medium">Official Email:</span>
                      <a href={`mailto:${isMusic ? 'ananyaamohanty125@gmail.com' : 'anitabehera@gmail.com'}`} className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                        {isMusic ? 'ananyaamohanty125@gmail.com' : 'anitabehera@gmail.com'}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Send Direct Inquiry</h4>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                  <textarea
                    rows={2}
                    placeholder="Your Message..."
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => toast(`Message sent to ${staticData.name} team!`, 'success')}
                    className="w-full py-2 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white font-medium text-xs transition-colors cursor-pointer"
                  >
                    Send Message
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
