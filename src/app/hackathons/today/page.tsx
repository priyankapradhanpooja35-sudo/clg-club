'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import LiveHackathonBanner from '@/components/LiveHackathonBanner';
import HackathonResults from '@/components/HackathonResults';
import DailyCoderDetail from '@/components/CoderOfDayDetail';
import DailyChallengeSection from '@/components/DailyChallengeSection';
import {
  MOCK_CURRENT_HACKATHON,
  MOCK_HACKATHON_PARTICIPANTS,
  MOCK_DAILY_CODER,
  MOCK_DAILY_CHALLENGE,
} from '@/lib/hackathons-data';
import Link from 'next/link';
import { Archive, Sparkles, Flame, Code2, Trophy } from 'lucide-react';

export default function TodayHackathonPage() {
  const [hackathon, setHackathon] = useState(MOCK_CURRENT_HACKATHON);
  const [isEnded, setIsEnded] = useState(false);

  const handleHackathonEnded = () => {
    setIsEnded(true);
    setHackathon((prev) => ({ ...prev, status: 'ended' }));
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[var(--background)] pb-24">
        {/* Page Hero */}
        <div className="relative overflow-hidden bg-slate-900 py-16 px-4 isolate rounded-b-[2.5rem] shadow-2xl mb-10">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1E1B4B] via-[#4C1D95] to-[#1E293B] -z-20" />
          <div className="absolute -top-32 -left-32 w-[30rem] h-[30rem] bg-purple-500/30 rounded-full blur-[100px] -z-10 animate-pulse" />
          <div className="absolute -bottom-32 -right-32 w-[30rem] h-[30rem] bg-amber-500/20 rounded-full blur-[100px] -z-10" />

          <div className="max-w-5xl mx-auto flex items-center justify-between gap-6 flex-wrap relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 text-xs font-bold text-amber-300 mb-4">
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>BEC Hackathons & Coding Hub</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-white tracking-tight">
                Today&apos;s Flagship Hackathon
              </h1>
              <p className="text-white/80 text-sm sm:text-base max-w-xl mt-2 font-medium">
                Live countdown, real-time leaderboard transitions, and daily coding challenges.
              </p>
            </div>

            <Link
              href="/hackathons/archive"
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 backdrop-blur-md shadow-lg"
            >
              <Archive className="w-4 h-4 text-purple-300" />
              <span>Browse Past Hackathons Archive</span>
            </Link>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-5xl mx-auto px-4 space-y-12">
          {/* Live Hackathon Banner (Always shows live status & countdown) */}
          <LiveHackathonBanner hackathon={hackathon} onEnded={handleHackathonEnded} />

          {/* Reveal Results when Hackathon is Ended */}
          {isEnded || hackathon.status === 'ended' ? (
            <HackathonResults hackathon={hackathon} participants={MOCK_HACKATHON_PARTICIPANTS} />
          ) : (
            /* While Live: Show active participants wall preview */
            <div className="bg-slate-950/80 border border-purple-500/30 rounded-3xl p-6 text-white text-center">
              <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold uppercase inline-flex items-center gap-1.5 mb-2">
                <Flame className="w-3.5 h-3.5 fill-rose-400" /> Hackathon In Progress
              </span>
              <h3 className="text-xl font-bold">Hackers are currently building prototypes!</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                Once the countdown timer hits 00h 00m, winners will be announced here automatically with shareable certificates!
              </p>
            </div>
          )}

          {/* Day of the Coder Section */}
          <div className="pt-6">
            <div className="flex items-center gap-2 mb-6">
              <Code2 className="w-5 h-5 text-amber-400" />
              <h2 className="text-2xl font-black text-white">Day of the Coder</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Daily Challenge Card */}
              <DailyChallengeSection challenge={MOCK_DAILY_CHALLENGE} />

              {/* Coder of the Day Feature */}
              <DailyCoderDetail coder={MOCK_DAILY_CODER} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
