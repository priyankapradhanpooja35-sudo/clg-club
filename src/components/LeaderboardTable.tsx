'use client';

import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

export type TimePeriod = 'week' | 'month' | 'all';

export interface LeaderboardEntry {
  userId: string;
  name: string;
  avatarUrl?: string;
  points: number;
  tier: 'Gold' | 'Silver' | 'Bronze';
  rankChange: number; // e.g. +3, -1, 0
  period: TimePeriod;
}

export const MOCK_LEADERBOARD_DATA: LeaderboardEntry[] = [
  {
    userId: 'usr_1',
    name: 'Priyanka Pradhan',
    avatarUrl: '/images/priyanka-coder-of-day.jpeg',
    points: 2450,
    tier: 'Gold',
    rankChange: 3,
    period: 'week',
  },
  {
    userId: 'usr_2',
    name: 'Sanjana Baidya',
    avatarUrl: '/images/sanjana-baidya.jpeg',
    points: 2310,
    tier: 'Gold',
    rankChange: -1,
    period: 'week',
  },
  {
    userId: 'usr_3',
    name: 'Sthitipragyan Sahu',
    avatarUrl: '/images/sthitipragyan-sahu.jpeg',
    points: 2180,
    tier: 'Silver',
    rankChange: 2,
    period: 'week',
  },
  {
    userId: 'usr_4',
    name: 'Sunita Nayak',
    avatarUrl: '/images/sunita-nayak.jpeg',
    points: 1950,
    tier: 'Silver',
    rankChange: 0,
    period: 'week',
  },
  {
    userId: 'usr_5',
    name: 'Kavya Sahoo',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
    points: 1820,
    tier: 'Silver',
    rankChange: -2,
    period: 'week',
  },
  {
    userId: 'usr_6',
    name: 'Aditya Patnaik',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&q=80',
    points: 1690,
    tier: 'Bronze',
    rankChange: 1,
    period: 'week',
  },
  {
    userId: 'usr_7',
    name: 'Ishita Behera',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    points: 1540,
    tier: 'Bronze',
    rankChange: 4,
    period: 'week',
  },
  {
    userId: 'usr_8',
    name: 'Siddharth Das',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    points: 1410,
    tier: 'Bronze',
    rankChange: 0,
    period: 'week',
  },
];

export default function LeaderboardTable() {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('week');
  const [entries] = useState<LeaderboardEntry[]>(MOCK_LEADERBOARD_DATA);

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  const getTierBadgeStyle = (tier: 'Gold' | 'Silver' | 'Bronze') => {
    switch (tier) {
      case 'Gold':
        return 'border-amber-400/80 text-amber-700 font-medium';
      case 'Silver':
        return 'border-slate-300 text-slate-600 font-medium';
      case 'Bronze':
        return 'border-amber-700/60 text-amber-800 font-medium';
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Three Plain Outlined Toggle Pills */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setSelectedPeriod('week')}
          className={`px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
            selectedPeriod === 'week'
              ? 'border border-slate-900 font-semibold text-slate-900 bg-white'
              : 'border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 bg-white'
          }`}
        >
          This week
        </button>

        <button
          onClick={() => setSelectedPeriod('month')}
          className={`px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
            selectedPeriod === 'month'
              ? 'border border-slate-900 font-semibold text-slate-900 bg-white'
              : 'border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 bg-white'
          }`}
        >
          This month
        </button>

        <button
          onClick={() => setSelectedPeriod('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
            selectedPeriod === 'all'
              ? 'border border-slate-900 font-semibold text-slate-900 bg-white'
              : 'border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 bg-white'
          }`}
        >
          All time
        </button>
      </div>

      {/* Clean Table Container: White surface, 12px rounded corners, hairline borders, no shadows */}
      <div className="w-full bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-none">
        <table className="w-full text-left border-collapse">
          {/* Header row: small uppercase-free labels in muted gray */}
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-medium text-slate-400">
              <th className="py-3 px-4 w-12 text-center">Rank</th>
              <th className="py-3 px-4">Student</th>
              <th className="py-3 px-4 hidden md:table-cell">Tier</th>
              <th className="py-3 px-4 hidden md:table-cell">Weekly change</th>
              <th className="py-3 px-4 text-right">Points</th>
            </tr>
          </thead>

          {/* Table Body with 0.5px Hairline Borders */}
          <tbody className="divide-y divide-slate-100 text-xs sm:text-sm text-slate-700">
            {entries.map((entry, index) => {
              const rank = index + 1;
              const isRankOne = rank === 1;

              return (
                <tr
                  key={entry.userId}
                  className={`transition-colors hover:bg-slate-50/80 ${
                    isRankOne ? 'bg-purple-50/30 font-normal' : ''
                  }`}
                >
                  {/* Rank Column */}
                  <td className="py-3.5 px-4 text-center font-medium text-slate-400 text-xs w-12">
                    {rank}
                  </td>

                  {/* Student Avatar + Name */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      {/* 28px Circle Avatar with thin border */}
                      <div className="w-7 h-7 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center shrink-0">
                        {entry.avatarUrl ? (
                          <img
                            src={entry.avatarUrl}
                            alt={entry.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[10px] font-medium text-slate-500">
                            {getInitials(entry.name)}
                          </span>
                        )}
                      </div>

                      <div>
                        <span className="font-medium text-slate-900 block leading-snug">
                          {entry.name}
                        </span>

                        {/* Mobile Collapsed Subtext */}
                        <div className="flex items-center gap-2 mt-0.5 md:hidden text-[11px] text-slate-400">
                          <span className={`px-1.5 py-0.2 rounded border text-[10px] ${getTierBadgeStyle(entry.tier)}`}>
                            {entry.tier}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5">
                            {entry.rankChange > 0 ? (
                              <span className="text-emerald-600 font-medium flex items-center">
                                +{entry.rankChange}
                              </span>
                            ) : entry.rankChange < 0 ? (
                              <span className="text-rose-600 font-medium flex items-center">
                                {entry.rankChange}
                              </span>
                            ) : (
                              <span className="text-slate-400">0</span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Tier (Outlined Badge) */}
                  <td className="py-3.5 px-4 hidden md:table-cell">
                    <span
                      className={`inline-block px-2 py-0.5 text-xs rounded border ${getTierBadgeStyle(
                        entry.tier
                      )}`}
                    >
                      {entry.tier}
                    </span>
                  </td>

                  {/* Weekly Change Column */}
                  <td className="py-3.5 px-4 hidden md:table-cell text-xs">
                    {entry.rankChange > 0 ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                        <ArrowUp className="w-3 h-3 stroke-[2.5]" />+{entry.rankChange}
                      </span>
                    ) : entry.rankChange < 0 ? (
                      <span className="inline-flex items-center gap-1 text-rose-600 font-medium">
                        <ArrowDown className="w-3 h-3 stroke-[2.5]" />
                        {entry.rankChange}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-400 font-medium">
                        <Minus className="w-3 h-3" />
                        0
                      </span>
                    )}
                  </td>

                  {/* Points (Right-aligned, Bold) */}
                  <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                    {entry.points.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
