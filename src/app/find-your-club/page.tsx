'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Search, Loader2, Users, Calendar, ArrowRight,
  TrendingUp, Star, Zap, Trophy, Target, Brain,
  Monitor, Music, Camera, Rocket, Leaf, Briefcase, Dumbbell,
  CheckCircle2,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { toast } from '@/components/ui/Toast';
import { getTopRecommendations, type ClubRecommendation } from '@/lib/recommender';

/* ─── Icon map (matches CLUBS_DATA icon strings) ─── */
const ICON_MAP: Record<string, React.ElementType> = {
  Monitor, Music, Star, Dumbbell, Camera, Rocket, Leaf, Briefcase,
};

/* ─── Gradient map ─── */
const GRADIENT_MAP: Record<string, string> = {
  'microsoft-club':        'from-blue-500 to-cyan-500',
  'music-dance-club':      'from-pink-500 to-rose-500',
  'event-management-club': 'from-amber-500 to-orange-500',
  'sports-health-club':    'from-green-500 to-emerald-500',
  'media-club':            'from-purple-500 to-violet-500',
  'startup-internship-club':'from-orange-500 to-red-500',
  'social-environmental-club':'from-teal-500 to-cyan-500',
  'placement-club':        'from-blue-700 to-indigo-800',
};

/* ─── Category helper ─── */
function getCategory(slug: string) {
  const map: Record<string, { label: string; cls: string }> = {
    'microsoft-club':        { label: 'Technical',    cls: 'bg-indigo-100 text-indigo-700' },
    'music-dance-club':      { label: 'Cultural',     cls: 'bg-pink-100 text-pink-700' },
    'event-management-club': { label: 'Management',   cls: 'bg-amber-100 text-amber-700' },
    'sports-health-club':    { label: 'Sports',       cls: 'bg-green-100 text-green-700' },
    'media-club':            { label: 'Creative',     cls: 'bg-purple-100 text-purple-700' },
    'startup-internship-club':{ label: 'Startup',     cls: 'bg-orange-100 text-orange-700' },
    'social-environmental-club':{ label: 'Social',    cls: 'bg-teal-100 text-teal-700' },
    'placement-club':        { label: 'Career',       cls: 'bg-blue-100 text-blue-700' },
  };
  return map[slug] ?? { label: 'Club', cls: 'bg-gray-100 text-gray-600' };
}

/* ─── Animated progress bar ─── */
function MatchBar({ percent }: { percent: number }) {
  return (
    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500"
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 }}
      />
    </div>
  );
}

/* ─── Single Recommendation Card ─── */
function RecommendCard({
  rec,
  index,
  onJoin,
}: {
  rec: ClubRecommendation;
  index: number;
  onJoin: (name: string) => void;
}) {
  const Icon = ICON_MAP[rec.club.icon] ?? Star;
  const cat = getCategory(rec.club.slug);
  const gradient = GRADIENT_MAP[rec.club.slug] ?? 'from-slate-400 to-slate-600';
  const isTop = index === 0 && !rec.isTrending;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.12, duration: 0.45, ease: 'easeOut' }}
      className="relative group"
    >
      {/* Top-pick ribbon */}
      {isTop && (
        <div className="absolute -top-3 left-4 z-10 flex items-center gap-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-lg shadow-violet-500/40">
          <Trophy className="w-3 h-3" /> Best Match
        </div>
      )}

      <div
        className={`bg-white rounded-2xl border overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(109,40,217,0.12)] transition-all duration-300 hover:-translate-y-1 flex flex-col h-full ${
          isTop ? 'border-violet-300 ring-1 ring-violet-200' : 'border-slate-200'
        }`}
      >
        {/* Coloured header strip with icon */}
        <div className={`bg-gradient-to-br ${gradient} h-2 w-full`} />

        <div className="p-5 flex flex-col flex-1">
          {/* Club identity row */}
          <div className="flex items-start gap-3 mb-4">
            <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 shadow-md`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-slate-900 text-base truncate">{rec.club.name}</h3>
                {rec.isTrending && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                    <TrendingUp className="w-3 h-3" /> Trending
                  </span>
                )}
              </div>
              <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-md mt-1 ${cat.cls}`}>
                {cat.label}
              </span>
            </div>
          </div>

          {/* Match % section */}
          {!rec.isTrending && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-500">Match Score</span>
                <motion.span
                  className="text-sm font-black text-violet-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.12 + 0.3 }}
                >
                  {rec.matchPercent}%
                </motion.span>
              </div>
              <MatchBar percent={rec.matchPercent} />
            </div>
          )}

          {/* Matched keywords */}
          {rec.matchedKeywords.length > 0 ? (
            <div className="mb-4">
              <p className="text-xs text-slate-500 mb-2 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-violet-500" />
                Matched because you mentioned:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {rec.matchedKeywords.slice(0, 6).map((kw) => (
                  <span
                    key={kw}
                    className="inline-flex items-center gap-1 bg-violet-50 text-violet-700 border border-violet-200 text-[11px] font-semibold px-2 py-0.5 rounded-full"
                  >
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    {kw}
                  </span>
                ))}
                {rec.matchedKeywords.length > 6 && (
                  <span className="text-[11px] text-slate-400 font-medium self-center">
                    +{rec.matchedKeywords.length - 6} more
                  </span>
                )}
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 mb-4 italic">
              Popular club loved by many students — a great place to start!
            </p>
          )}

          {/* Description */}
          <p className="text-xs text-slate-500 leading-relaxed mb-4 flex-1 line-clamp-2">
            {rec.club.description}
          </p>

          {/* Stats row */}
          <div className="flex items-center gap-4 text-xs text-slate-400 mb-4 border-t border-slate-100 pt-3">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              {'members' in rec.club ? `${rec.club.members}` : '20'} Members
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {'upcomingEvents' in rec.club ? `${rec.club.upcomingEvents}` : '2'} Events
            </span>
          </div>

          {/* CTA buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => onJoin(rec.club.name)}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-violet-500/25 transition-all hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Join Now <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              href={`/clubs/${rec.club.slug}`}
              className="flex items-center justify-center gap-1 border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium px-3 py-2.5 rounded-xl transition-colors"
            >
              View
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Thinking animation ─── */
function ThinkingLoader() {
  const dots = ['Analysing your interests', 'Matching keywords', 'Finding your clubs'];
  const [phase, setPhase] = useState(0);

  // Cycle through phases
  useState(() => {
    const interval = setInterval(() => setPhase((p) => (p + 1) % dots.length), 500);
    return () => clearInterval(interval);
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col items-center gap-5 py-14"
    >
      {/* Spinning rings */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-violet-200" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-violet-600 animate-spin" />
        <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-indigo-400 animate-spin [animation-direction:reverse] [animation-duration:0.7s]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Brain className="w-5 h-5 text-violet-600" />
        </div>
      </div>

      <div className="text-center">
        <motion.p
          key={phase}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-sm font-semibold text-violet-700"
        >
          {dots[phase]}…
        </motion.p>
        <p className="text-xs text-slate-400 mt-1">Powered by local keyword intelligence</p>
      </div>
    </motion.div>
  );
}

/* ─── Example chips ─── */
const EXAMPLES = [
  'coding, hackathon, tech',
  'music, singing, dance',
  'photography, creative, film',
  'fitness, cricket, sports',
  'startup, internship, career',
  'environment, social work',
];

/* ─── Main page ─── */
export default function FindYourClubPage() {
  const [input, setInput] = useState('');
  const [phase, setPhase] = useState<'idle' | 'loading' | 'results'>('idle');
  const [results, setResults] = useState<ClubRecommendation[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSubmit = useCallback(async () => {
    if (!input.trim()) return;
    setPhase('loading');

    // 1.5 s fake-thinking delay so the feature feels smart
    await new Promise((r) => setTimeout(r, 1500));

    const recs = getTopRecommendations(input);
    setResults(recs);
    setPhase('results');

    // Smooth scroll to results
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  }, [input]);

  const handleExampleClick = (example: string) => {
    setInput(example);
    textareaRef.current?.focus();
  };

  const handleJoin = (clubName: string) => {
    toast(`🎉 Join request sent for ${clubName}!`, 'success');
  };

  const handleReset = () => {
    setInput('');
    setPhase('idle');
    setResults([]);
    textareaRef.current?.focus();
  };

  const isTrendingFallback = results.length > 0 && results[0].isTrending;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-50">
        {/* ── Hero Band ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1E1B4B] via-[#4C1D95] to-[#1E3A8A] py-20 px-4">
          {/* Decorative blobs */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />

          <div className="relative max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm px-4 py-1.5 text-xs text-white/80 mb-6"
            >
              <Brain className="w-3.5 h-3.5 text-violet-300" />
              Smart Keyword Recommender · No AI API Required
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl sm:text-6xl font-black text-white leading-tight tracking-tight"
            >
              Find Your{' '}
              <span className="bg-gradient-to-r from-violet-300 to-blue-300 bg-clip-text text-transparent">
                Perfect Club
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              className="mt-4 text-slate-300 text-lg leading-relaxed max-w-xl mx-auto"
            >
              Tell us what you love — we'll match you with the clubs where you'll thrive.
              Just type your interests naturally.
            </motion.p>
          </div>
        </section>

        {/* ── Search Card ── */}
        <section className="px-4 -mt-10 relative z-10 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-slate-200/80 p-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <Search className="w-4 h-4 text-violet-500" />
              <label htmlFor="interest-input" className="text-sm font-semibold text-slate-700">
                What are you into?
              </label>
            </div>

            <textarea
              id="interest-input"
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSubmit();
              }}
              placeholder="e.g. I love coding, gaming, photography, startups, music…"
              rows={3}
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-200 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 transition-all outline-none font-medium"
            />

            {/* Example chips */}
            <div className="flex flex-wrap gap-2 mt-3 mb-5">
              <span className="text-[11px] text-slate-400 font-medium self-center shrink-0">Try:</span>
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => handleExampleClick(ex)}
                  className="text-[11px] font-semibold text-violet-600 bg-violet-50 hover:bg-violet-100 border border-violet-200 px-2.5 py-1 rounded-full transition-colors"
                >
                  {ex}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                id="find-club-btn"
                onClick={handleSubmit}
                disabled={!input.trim() || phase === 'loading'}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg shadow-violet-500/30 transition-all hover:-translate-y-0.5 active:scale-[0.98]"
              >
                {phase === 'loading' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Finding matches…
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Find My Club →
                  </>
                )}
              </button>

              {phase === 'results' && (
                <button
                  onClick={handleReset}
                  className="text-sm font-semibold text-slate-500 hover:text-slate-700 px-3 py-3 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Reset
                </button>
              )}
            </div>

            <p className="text-[11px] text-slate-400 text-center mt-2">
              Ctrl+Enter to submit · All matching runs locally in your browser
            </p>
          </motion.div>
        </section>

        {/* ── Thinking Loader / Results ── */}
        <section ref={resultsRef} className="px-4 py-8 max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {phase === 'loading' && (
              <ThinkingLoader key="loader" />
            )}

            {phase === 'results' && results.length > 0 && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Results header */}
                <div className="text-center mb-8">
                  {isTrendingFallback ? (
                    <>
                      <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold px-4 py-2 rounded-full mb-3">
                        <TrendingUp className="w-4 h-4" />
                        No strong keyword match — showing trending clubs instead
                      </div>
                      <h2 className="text-2xl font-black text-slate-900">Trending at BEC Right Now</h2>
                      <p className="text-slate-500 text-sm mt-1">
                        These clubs are popular among students — explore and find your community!
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200 text-violet-700 text-sm font-semibold px-4 py-2 rounded-full mb-3">
                        <Target className="w-4 h-4" />
                        Found {results.length} club{results.length > 1 ? 's' : ''} matching your interests
                      </div>
                      <h2 className="text-2xl font-black text-slate-900">Your Top Matches</h2>
                      <p className="text-slate-500 text-sm mt-1">
                        Based on keywords: <span className="font-semibold text-violet-600">{input}</span>
                      </p>
                    </>
                  )}
                </div>

                {/* Cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map((rec, i) => (
                    <RecommendCard
                      key={rec.club.slug}
                      rec={rec}
                      index={i}
                      onJoin={handleJoin}
                    />
                  ))}
                </div>

                {/* Browse all clubs CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-center mt-10"
                >
                  <p className="text-slate-500 text-sm mb-3">Not quite what you're looking for?</p>
                  <Link
                    href="/clubs"
                    className="inline-flex items-center gap-2 border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-sm px-6 py-3 rounded-xl transition-colors"
                  >
                    <Users className="w-4 h-4" />
                    Browse All 8 Clubs
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </motion.div>
            )}

            {phase === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16"
              >
                {/* How it works section */}
                <p className="text-slate-400 text-sm font-medium mb-8">How it works</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
                  {[
                    { icon: Search, title: 'Type Your Interests', desc: 'Write anything — hobbies, passions, skills, goals' },
                    { icon: Brain, title: 'Smart Matching', desc: 'Local keyword engine scores every club against your input' },
                    { icon: Trophy, title: 'Discover Your Club', desc: 'Get your top 3 matches with match scores and reasons' },
                  ].map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col items-center text-center gap-3">
                      <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-violet-600" />
                      </div>
                      <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </>
  );
}
