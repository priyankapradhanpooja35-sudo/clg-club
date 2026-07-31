'use client';

import React, { useState, useEffect } from 'react';
import { DailyChallenge, DailyChallengeSolver } from '@/lib/hackathons-data';
import { Code2, Clock, Zap, CheckCircle2, Send, Terminal, Trophy, Flame } from 'lucide-react';

export interface DailyChallengeSectionProps {
  challenge: DailyChallenge;
  onSolveSuccess?: (solver: DailyChallengeSolver) => void;
}

export default function DailyChallengeSection({ challenge, onSolveSuccess }: DailyChallengeSectionProps) {
  const [solvers, setSolvers] = useState<DailyChallengeSolver[]>(challenge.solvers);
  const [timeLeft, setTimeLeft] = useState('');
  const [code, setCode] = useState(`// Solves: ${challenge.title}\nfunction solve(input) {\n  // Write your algorithm here\n  return output;\n}`);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [solved, setSolved] = useState(false);
  const [finishTime, setFinishTime] = useState<string | null>(null);

  // Live countdown till closesAt
  useEffect(() => {
    const updateCountdown = () => {
      const closingTime = new Date(challenge.closesAt).getTime();
      const now = new Date().getTime();
      const diff = closingTime - now;

      if (diff <= 0) {
        setTimeLeft('Closed');
        return;
      }

      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [challenge.closesAt]);

  const handleSubmitSolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (solved || isSubmitting) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const timeInSec = Math.floor(Math.random() * 400) + 400; // 6-12 mins
      const newSolver: DailyChallengeSolver = {
        userId: 'usr_me',
        name: 'You (Current Student)',
        photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80',
        department: 'BEC Student',
        finishTimeSeconds: timeInSec,
        solvedAt: 'Just now',
      };

      setSolvers([newSolver, ...solvers]);
      setSolved(true);
      setFinishTime(`${Math.floor(timeInSec / 60)}m ${timeInSec % 60}s`);
      setIsSubmitting(false);

      if (onSolveSuccess) {
        onSolveSuccess(newSolver);
      }
    }, 1200);
  };

  const difficultyColors = {
    Easy: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    Medium: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    Hard: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
  };

  return (
    <div className="w-full bg-slate-950/90 backdrop-blur-2xl border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(147,51,234,0.15)] relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between gap-4 pb-6 border-b border-purple-500/20 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/30">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-black text-white tracking-tight">Day of the Coder</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${difficultyColors[challenge.difficulty]}`}>
                {challenge.difficulty}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Daily Challenge • Posted 08:00 AM</p>
          </div>
        </div>

        {/* Live Countdown Timer */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-purple-950/80 border border-purple-500/40 text-xs font-mono font-bold text-amber-300 shadow-inner">
          <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>Closes in: {timeLeft}</span>
        </div>
      </div>

      {/* Problem Statement Box */}
      <div className="mt-6 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-white mb-2">{challenge.title}</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/80 border border-purple-500/20 rounded-2xl p-4">
            {challenge.problemStatement}
          </p>
        </div>

        {/* Input/Output Samples */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          <div className="bg-slate-900 border border-purple-500/20 rounded-xl p-3">
            <span className="text-purple-400 font-bold block mb-1">SAMPLE INPUT:</span>
            <span className="text-slate-300">{challenge.inputExample}</span>
          </div>
          <div className="bg-slate-900 border border-purple-500/20 rounded-xl p-3">
            <span className="text-emerald-400 font-bold block mb-1">SAMPLE OUTPUT:</span>
            <span className="text-slate-300">{challenge.outputExample}</span>
          </div>
        </div>

        {/* Interactive Code Editor & Submission Form */}
        <div className="mt-6 border border-purple-500/30 rounded-2xl overflow-hidden bg-slate-900">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-purple-500/20 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-purple-400" />
              <span>solution.js</span>
            </div>
            {solved && (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Solved in {finishTime}!
              </span>
            )}
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={solved}
            rows={5}
            className="w-full p-4 bg-slate-900 font-mono text-xs text-purple-100 focus:outline-none resize-none"
          />

          <div className="p-3 bg-slate-950 border-t border-purple-500/20 flex justify-end">
            <button
              onClick={handleSubmitSolution}
              disabled={solved || isSubmitting}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                solved
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 cursor-default'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/40 active:scale-95'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Running Tests...</span>
                </>
              ) : solved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Submitted & Solved</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Solution</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Solvers List Feeding into Coder of the Day */}
      <div className="mt-8 pt-6 border-t border-purple-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Today&apos;s Solvers Leaderboard</h4>
          </div>
          <span className="text-xs text-purple-300 font-semibold">{solvers.length} Solved</span>
        </div>

        <div className="space-y-2">
          {solvers.map((solver, idx) => {
            const mins = Math.floor(solver.finishTimeSeconds / 60);
            const secs = solver.finishTimeSeconds % 60;
            const formatted = `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
            const isFirst = idx === 0;

            return (
              <div
                key={solver.userId + idx}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  isFirst
                    ? 'bg-amber-500/10 border-amber-400/50 shadow-md shadow-amber-500/10'
                    : 'bg-slate-900/60 border-purple-500/20 hover:border-purple-500/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-black w-6 text-center ${isFirst ? 'text-amber-400 text-sm' : 'text-slate-400'}`}>
                    #{idx + 1}
                  </span>
                  <img src={solver.photoUrl} alt={solver.name} className="w-9 h-9 rounded-full object-cover border border-purple-500/30" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{solver.name}</span>
                      {isFirst && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] uppercase">
                          Fastest 👑
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400">{solver.department}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center justify-end gap-1 text-xs font-mono font-bold text-purple-300">
                    <Clock className="w-3.5 h-3.5 text-purple-400" />
                    <span>{formatted}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{solver.solvedAt}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
