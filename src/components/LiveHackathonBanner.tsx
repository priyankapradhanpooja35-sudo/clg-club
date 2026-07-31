'use client';

import React, { useState, useEffect } from 'react';
import { Hackathon } from '@/lib/hackathons-data';
import { Radio, Clock, Sparkles, CheckCircle2, Flame } from 'lucide-react';

export interface LiveHackathonBannerProps {
  hackathon: Hackathon;
  onEnded?: () => void;
}

export default function LiveHackathonBanner({ hackathon, onEnded }: LiveHackathonBannerProps) {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
  const [isEnded, setIsEnded] = useState(hackathon.status === 'ended' || hackathon.status === 'archived');

  useEffect(() => {
    const calculateTime = () => {
      const endTimeMs = new Date(hackathon.endTime).getTime();
      const nowMs = new Date().getTime();
      const diff = endTimeMs - nowMs;

      if (diff <= 0) {
        setIsEnded(true);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        if (onEnded) onEnded();
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    calculateTime();
    // Update every second for responsive UI feel
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [hackathon.endTime, onEnded]);

  return (
    <div className="w-full rounded-3xl overflow-hidden shadow-2xl relative">
      {/* Top Banner Status Bar */}
      <div
        className={`px-6 py-3 flex items-center justify-between text-xs sm:text-sm font-bold transition-colors ${
          isEnded
            ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white'
            : 'bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 text-white animate-pulse'
        }`}
      >
        <div className="flex items-center gap-2">
          {!isEnded ? (
            <>
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
              </span>
              <Radio className="w-4 h-4" />
              <span className="uppercase tracking-widest font-black">HACKATHON IS LIVE NOW</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span className="uppercase tracking-widest font-black">HACKATHON ENDED • RESULTS ANNOUNCED</span>
            </>
          )}
        </div>

        {/* Live Remaining Time */}
        <div className="flex items-center gap-2 font-mono font-black text-white bg-black/20 px-3 py-1 rounded-full backdrop-blur-md">
          <Clock className="w-4 h-4" />
          {isEnded ? (
            <span>00h 00m remaining</span>
          ) : timeLeft ? (
            <span>
              {timeLeft.hours} hours {timeLeft.minutes} minutes remaining
            </span>
          ) : (
            <span>Calculating...</span>
          )}
        </div>
      </div>

      {/* Main Hackathon Card Content */}
      <div className="bg-slate-950/90 backdrop-blur-2xl p-6 sm:p-8 border-x border-b border-purple-500/30 text-white relative">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-purple-950 border border-purple-500/40 text-[11px] font-bold text-amber-300 uppercase tracking-wider">
              {hackathon.theme}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-white mb-4">
            {hackathon.title}
          </h2>

          <div className="bg-purple-950/40 border border-purple-500/30 rounded-2xl p-4 sm:p-5 mb-4">
            <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Problem Statement
            </h4>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              {hackathon.problemStatement}
            </p>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">{hackathon.description}</p>
        </div>
      </div>
    </div>
  );
}
