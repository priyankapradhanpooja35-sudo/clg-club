'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import { MOCK_ARCHIVED_HACKATHONS, MOCK_CURRENT_HACKATHON } from '@/lib/hackathons-data';
import Link from 'next/link';
import { Archive, Trophy, Calendar, ArrowRight, Sparkles, Flame } from 'lucide-react';

export default function HackathonArchivePage() {
  const allArchived = [
    { ...MOCK_CURRENT_HACKATHON, status: 'archived' as const },
    ...MOCK_ARCHIVED_HACKATHONS,
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[var(--background)] pb-24">
        {/* Hero */}
        <div className="relative overflow-hidden bg-slate-900 py-16 px-4 isolate rounded-b-[2.5rem] shadow-2xl mb-12">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1E1B4B] via-[#4C1D95] to-[#1E293B] -z-20" />
          <div className="absolute -top-32 -left-32 w-[30rem] h-[30rem] bg-purple-500/30 rounded-full blur-[100px] -z-10 animate-pulse" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 text-xs font-bold text-amber-300 mb-4">
              <Archive className="w-4 h-4 text-purple-300" /> Past Hackathons Vault
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-white">
              BEC Hackathon Archive
            </h1>
            <p className="text-white/80 text-sm sm:text-base max-w-xl mx-auto mt-2 font-medium">
              Explore past campus hackathons, winning projects, podium winners, and download certificates.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" /> Past Hackathons ({allArchived.length})
            </h2>
            <Link
              href="/hackathons/today"
              className="text-xs font-bold text-purple-300 hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>View Today&apos;s Live Hackathon</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allArchived.map((h) => (
              <div
                key={h.id}
                className="bg-slate-950/90 border border-purple-500/30 hover:border-purple-500/60 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between shadow-xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-950 border border-purple-500/40 text-[10px] font-bold text-amber-300 uppercase">
                      {h.theme}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {new Date(h.startTime).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-white group-hover:text-amber-300 transition-colors mb-2">
                    {h.title}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-4">{h.problemStatement}</p>
                </div>

                {/* Podium Preview */}
                {h.winningTeams && (
                  <div className="my-3 pt-3 border-t border-purple-500/20">
                    <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider block mb-2">
                      🥇 Champions:
                    </span>
                    <div className="flex items-center gap-2">
                      <img
                        src={h.winningTeams[0].photoUrl}
                        alt={h.winningTeams[0].teamName}
                        className="w-8 h-8 rounded-full object-cover border-2 border-amber-400"
                      />
                      <span className="text-xs font-bold text-white">{h.winningTeams[0].teamName}</span>
                      <span className="text-[10px] text-slate-400 font-medium">({h.winningTeams[0].projectTitle})</span>
                    </div>
                  </div>
                )}

                <Link
                  href={`/hackathons/archive/${h.id}`}
                  className="mt-4 w-full py-2.5 px-4 rounded-xl bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/40 text-purple-200 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>View Full Results & Podium</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
