'use client';

import React, { useRef, useState } from 'react';
import { Download, Check, Trophy } from 'lucide-react';
import html2canvas from 'html2canvas';

export interface HackathonResult {
  hackathonId?: string;
  rank: 1 | 2 | 3;
  studentName: string;
  teamName: string;
  projectTitle: string;
  avatarUrl?: string;
}

export interface HackathonPodiumProps {
  winners?: HackathonResult[];
  title?: string;
  subtitle?: string;
  className?: string;
}

const DEFAULT_WINNERS: HackathonResult[] = [
  {
    rank: 1,
    studentName: 'Sanjana Baidya',
    teamName: 'Team ByteCraft',
    projectTitle: 'Smart AI Disaster Management & Grid Monitoring',
    avatarUrl: '/images/sanjana-baidya.jpeg',
  },
  {
    rank: 2,
    studentName: 'Sthitipragyan Sahu',
    teamName: 'Team CyberPulse',
    projectTitle: 'Low-latency Edge Anomaly Predictor',
    avatarUrl: '/images/sthitipragyan-sahu.jpeg',
  },
  {
    rank: 3,
    studentName: 'Sunita Nayak',
    teamName: 'Team CodeX',
    projectTitle: 'Campus Renewable Energy Optimizer',
    avatarUrl: '/images/sunita-nayak.jpeg',
  },
];

export default function HackathonPodium({
  winners = DEFAULT_WINNERS,
  title = 'BEC SIH hackathon results',
  subtitle = 'BEC Smart India Hackathon 2026 · 24 hours',
  className = '',
}: HackathonPodiumProps) {
  const [exportingRank, setExportingRank] = useState<number | null>(null);
  const [copiedRank, setCopiedRank] = useState<number | null>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const [activeExportWinner, setActiveExportWinner] = useState<HackathonResult | null>(null);

  // Initials fallback
  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  // Export card for a winner
  const handleDownloadCard = async (winner: HackathonResult) => {
    setActiveExportWinner(winner);
    setExportingRank(winner.rank);

    setTimeout(async () => {
      if (!storyRef.current) {
        setExportingRank(null);
        return;
      }

      try {
        const element = storyRef.current;
        element.style.display = 'flex';

        const canvas = await (html2canvas as any)(element, {
          width: 1080,
          height: 1920,
          scale: 1,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#FFFFFF',
          logging: false,
        });

        element.style.display = 'none';

        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `BEC_Hackathon_Rank${winner.rank}_${winner.studentName.replace(/\s+/g, '_')}.png`;
        link.href = image;
        link.click();

        setCopiedRank(winner.rank);
        setTimeout(() => setCopiedRank(null), 3000);
      } catch (err) {
        console.error('Error exporting card:', err);
      } finally {
        if (storyRef.current) storyRef.current.style.display = 'none';
        setExportingRank(null);
      }
    }, 100);
  };

  // Sort winners 1st, 2nd, 3rd
  const winner1 = winners.find((w) => w.rank === 1) || winners[0];
  const winner2 = winners.find((w) => w.rank === 2) || winners[1];
  const winner3 = winners.find((w) => w.rank === 3) || winners[2];
  const sortedWinners = [winner1, winner2, winner3].filter(Boolean);

  return (
    <div className={`w-full max-w-4xl mx-auto space-y-6 ${className}`}>
      {/* Header Section: Plain title & muted subtitle */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h2>
        <p className="text-xs text-slate-500 mt-1 font-medium">{subtitle}</p>
      </div>

      {/* Three Equal-Sized Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
        {sortedWinners.map((winner) => {
          const isFirst = winner.rank === 1;

          return (
            <div
              key={winner.rank + winner.studentName}
              className={`bg-white rounded-xl p-5 border flex flex-col justify-between space-y-4 shadow-none transition-colors ${
                isFirst ? 'border-slate-400' : 'border-slate-200/90'
              }`}
            >
              {/* Outlined Rank Tag at top */}
              <div className="flex items-center justify-between">
                <span
                  className={`inline-block px-2.5 py-1 rounded-full text-xs border ${
                    isFirst
                      ? 'border-slate-400 text-slate-900 font-bold bg-slate-50'
                      : 'border-slate-200 text-slate-600 font-medium'
                  }`}
                >
                  {winner.rank === 1 ? '1st place' : winner.rank === 2 ? '2nd place' : '3rd place'}
                </span>
              </div>

              {/* Card Body: Avatar, Name, Team, Project */}
              <div className="flex flex-col items-center text-center space-y-2">
                {/* 60px Circular Avatar with thin border */}
                <div className="w-[60px] h-[60px] rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center shrink-0 shadow-sm">
                  {winner.avatarUrl ? (
                    <img src={winner.avatarUrl} alt={winner.studentName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm font-semibold text-slate-500">
                      {getInitials(winner.studentName)}
                    </span>
                  )}
                </div>

                <div className="w-full pt-1">
                  <h3 className="text-base font-semibold text-slate-900 leading-snug truncate">
                    {winner.studentName}
                  </h3>
                  <p className="text-xs font-medium text-slate-700 mt-0.5">{winner.teamName}</p>
                  <p className="text-xs text-slate-500 mt-2 font-serif italic line-clamp-2 px-1">
                    &ldquo;{winner.projectTitle}&rdquo;
                  </p>
                </div>
              </div>

              {/* Download Card Button at Bottom */}
              <div className="pt-2">
                <button
                  onClick={() => handleDownloadCard(winner)}
                  disabled={exportingRank === winner.rank}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 disabled:opacity-50 ${
                    isFirst
                      ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-none'
                      : 'border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium'
                  }`}
                >
                  {exportingRank === winner.rank ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-slate-800 rounded-full animate-spin" />
                      <span>Exporting card...</span>
                    </>
                  ) : copiedRank === winner.rank ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Card exported!</span>
                    </>
                  ) : (
                    <>
                      <Download className={`w-3.5 h-3.5 ${isFirst ? 'text-white' : 'text-slate-500'}`} />
                      <span>Download card</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Hidden Story Canvas Template for Export (1080x1920 PNG) ─── */}
      <div
        ref={storyRef}
        style={{ display: 'none', width: '1080px', height: '1920px' }}
        className="fixed top-0 left-0 bg-slate-50 text-slate-900 flex-col items-center justify-between p-20 overflow-hidden z-[-9999] pointer-events-none"
      >
        <div className="w-full flex items-center justify-between border-b border-slate-200 pb-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-xl border border-slate-300 bg-white flex items-center justify-center text-slate-800">
              <Trophy className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-slate-900">BEC CLUB HUB</h2>
              <p className="text-xl text-slate-500 font-medium">{subtitle}</p>
            </div>
          </div>
          <span className="px-6 py-2.5 rounded-full border border-slate-300 text-xl font-bold text-slate-800 bg-white">
            {activeExportWinner?.rank === 1
              ? '1st Place Winner'
              : activeExportWinner?.rank === 2
              ? '2nd Place Winner'
              : '3rd Place Winner'}
          </span>
        </div>

        <div className="my-auto w-full max-w-2xl bg-white border border-slate-300 rounded-3xl p-16 flex flex-col items-center text-center shadow-none">
          <div className="w-44 h-44 rounded-full overflow-hidden border-2 border-slate-300 bg-slate-100 flex items-center justify-center mb-8">
            {activeExportWinner?.avatarUrl ? (
              <img src={activeExportWinner.avatarUrl} alt={activeExportWinner.studentName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-5xl font-semibold text-slate-500">
                {activeExportWinner?.studentName ? getInitials(activeExportWinner.studentName) : 'BC'}
              </span>
            )}
          </div>

          <h1 className="text-6xl font-bold text-slate-900 mb-3">{activeExportWinner?.studentName}</h1>
          <p className="text-3xl text-purple-700 font-semibold mb-6">{activeExportWinner?.teamName}</p>

          <p className="text-2xl text-slate-600 font-serif italic leading-relaxed px-4">
            &ldquo;{activeExportWinner?.projectTitle}&rdquo;
          </p>
        </div>

        <div className="w-full pt-10 border-t border-slate-200 flex items-center justify-between text-slate-500 text-2xl font-medium">
          <span>Bhubaneswar Engineering College</span>
          <span className="font-mono text-slate-400">@bec_clubhub</span>
        </div>
      </div>
    </div>
  );
}
