'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import LeaderboardTable from '@/components/LeaderboardTable';
import DailyCoderCard from '@/components/DailyCoderCard';
import HackathonPodium from '@/components/HackathonPodium';
import { Trophy, Code2, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'coder-of-day' | 'hackathon-podium'>('leaderboard');

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50/50 text-slate-900 pb-20">
        {/* Clean Dashboard Header */}
        <div className="bg-white border-b border-slate-200 py-10 px-4 mb-8">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-700 block mb-1">
                BEC Club Hub Analytics
              </span>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                Student Engagement Leaderboard
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Institutional activity metrics, daily coder achievements, and hackathon results.
              </p>
            </div>

            {/* Plain Outlined Navigation Tabs */}
            <div className="inline-flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-lg border border-slate-200/80 self-start md:self-auto">
              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'leaderboard'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <Trophy className="w-3.5 h-3.5 text-purple-600" />
                <span>Leaderboard</span>
              </button>

              <button
                onClick={() => setActiveTab('coder-of-day')}
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'coder-of-day'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <Code2 className="w-3.5 h-3.5 text-purple-600" />
                <span>Coder of the Day</span>
              </button>

              <button
                onClick={() => setActiveTab('hackathon-podium')}
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'hackathon-podium'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-purple-600" />
                <span>Hackathon Podium</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto px-4">
          {activeTab === 'leaderboard' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
              <LeaderboardTable />
            </motion.div>
          )}

          {activeTab === 'coder-of-day' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
              <DailyCoderCard />
            </motion.div>
          )}

          {activeTab === 'hackathon-podium' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
              <HackathonPodium />
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
