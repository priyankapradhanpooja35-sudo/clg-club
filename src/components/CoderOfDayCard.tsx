'use client';

import React, { useRef, useState } from 'react';
import { Code2, Download, Check, Settings2, Flame, Zap, Clock, Trophy } from 'lucide-react';
import html2canvas from 'html2canvas';

export interface CoderOfDayData {
  userId?: string;
  name: string;
  department?: string;
  year?: string;
  date?: string;
  photoUrl?: string;
  problemName?: string;
  challengeName?: string;
  finishTimeSeconds: number;
  streakCount: number;
  pointsEarned: number;
  rankToday?: number;
  totalParticipants?: number;
  dailyActivity?: number[];
}

export interface CoderOfDayCardProps {
  coder?: CoderOfDayData;
  className?: string;
}

const DEFAULT_CODER: CoderOfDayData = {
  name: 'Priyanka Pradhan',
  department: 'Computer Science & Engg',
  year: '3rd Year',
  date: 'July 31, 2026',
  photoUrl: '/images/priyanka-coder-of-day.jpeg',
  problemName: 'Binary Tree Traversal',
  finishTimeSeconds: 760, // 12m 40s
  streakCount: 14,
  pointsEarned: 40,
  rankToday: 1,
  totalParticipants: 42,
  dailyActivity: [15, 30, 20, 45, 10, 25, 50],
};

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function CoderOfDayCard({ coder = DEFAULT_CODER, className = '' }: CoderOfDayCardProps) {
  const [data, setData] = useState<CoderOfDayData>(coder);

  React.useEffect(() => {
    setData(coder);
  }, [coder]);

  const [isEditing, setIsEditing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const storyRef = useRef<HTMLDivElement>(null);

  // Format seconds into "12m 40s"
  const minutes = Math.floor(data.finishTimeSeconds / 60);
  const seconds = data.finishTimeSeconds % 60;
  const timeFormatted = `${minutes}m ${seconds < 10 ? '0' : ''}${seconds}s`;

  // Initials fallback
  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  // Export Shareable Story Card (1080x1920 PNG)
  const handleDownloadStory = async () => {
    if (!storyRef.current) return;
    setIsExporting(true);

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
      link.download = `BEC_CoderOfDay_${data.name.replace(/\s+/g, '_')}.png`;
      link.href = image;
      link.click();
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Error exporting story card:', err);
    } finally {
      if (storyRef.current) {
        storyRef.current.style.display = 'none';
      }
      setIsExporting(false);
    }
  };

  const activity = data.dailyActivity || [15, 30, 20, 45, 10, 25, 50];
  const rankToday = data.rankToday || 1;
  const totalParticipants = data.totalParticipants || 42;
  const problemName = data.problemName || data.challengeName || 'Binary Tree Traversal';
  const maxActivity = Math.max(...activity, 1);

  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      {/* Clean White Split-Panel Card (0.5px border, 12px corner radius) */}
      <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-none flex flex-col md:flex-row text-slate-900">
        
        {/* ─── Left Panel (Fixed ~160px width, shaded background, top accent bar) ─── */}
        <div className="w-full md:w-[160px] shrink-0 bg-slate-50/80 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col items-center justify-center p-5 text-center relative">
          {/* Top Edge Accent Bar */}
          <div className="absolute top-0 inset-x-0 h-[3px] bg-purple-600" />

          {/* 72px Centered Avatar */}
          <div className="w-[72px] h-[72px] rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center shrink-0 mb-3 shadow-sm">
            {data.photoUrl ? (
              <img src={data.photoUrl} alt={data.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-base font-semibold text-slate-500">{getInitials(data.name)}</span>
            )}
          </div>

          <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-700 block">
            Featured solver
          </span>
          <span className="text-[11px] font-medium text-slate-500 mt-0.5">
            {data.date || 'Today'}
          </span>
        </div>

        {/* ─── Right Panel (flex: 1, detailed stats & chart) ─── */}
        <div className="flex-1 p-5 space-y-3.5 bg-white">
          
          {/* Row 1: Name + Streak Badge in same row */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2.5">
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 leading-snug">
                {data.name}
              </h3>
              {/* Streak Badge */}
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-slate-200 text-xs font-medium text-slate-700 bg-slate-50">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                <span>{data.streakCount}-day streak</span>
              </span>
            </div>

            {/* Customizer Button */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              title="Customize card"
              className="p-1 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Settings2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Editor */}
          {isEditing && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Student Name</label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded text-xs focus:outline-none focus:border-slate-400"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Problem Name</label>
                <input
                  type="text"
                  value={data.problemName}
                  onChange={(e) => setData({ ...data, problemName: e.target.value })}
                  className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded text-xs focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>
          )}

          {/* Row 2: Department / Year Subtitle */}
          <p className="text-xs text-slate-500 font-medium">
            {data.department} • {data.year}
          </p>

          {/* Row 3: 3-Item Inline Stat Row (Finish time, Rank today, Points) separated by bottom border */}
          <div className="grid grid-cols-3 gap-3 pb-3 border-b border-slate-100 text-center">
            <div className="bg-slate-50/80 border border-slate-100 rounded-lg p-2">
              <span className="text-[10px] uppercase font-medium text-slate-400 block mb-0.5">Finish time</span>
              <span className="text-xs font-bold text-slate-900">{timeFormatted}</span>
            </div>

            <div className="bg-slate-50/80 border border-slate-100 rounded-lg p-2">
              <span className="text-[10px] uppercase font-medium text-slate-400 block mb-0.5">Rank today</span>
              <span className="text-xs font-bold text-slate-900">
                #{rankToday} of {totalParticipants}
              </span>
            </div>

            <div className="bg-slate-50/80 border border-slate-100 rounded-lg p-2">
              <span className="text-[10px] uppercase font-medium text-slate-400 block mb-0.5">Points</span>
              <span className="text-xs font-bold text-slate-900">+{data.pointsEarned}</span>
            </div>
          </div>

          {/* Row 4: 7-Day Activity Mini Bar Chart with Bug Fix (explicit min-height & high-contrast colors) */}
          <div className="bg-slate-50/60 border border-slate-100 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1.5 text-[11px] font-medium text-slate-500">
              <span>7-day activity</span>
              <span className="text-[10px] text-slate-400">Past week</span>
            </div>

            {/* Explicit 34px Parent Flex Container */}
            <div className="h-[34px] w-full flex items-end justify-between gap-2 pt-1">
              {activity.map((val, idx) => {
                const isToday = idx === activity.length - 1;
                // Height percentage with minimum 15% height for visible rendering
                const heightPercent = Math.max(18, Math.round((val / maxActivity) * 100));

                return (
                  <div key={idx} className="flex-1 h-full flex flex-col items-center justify-end group">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-sm min-h-[4px] transition-all ${
                        isToday
                          ? 'bg-slate-900 font-bold'
                          : 'bg-slate-300 dark:bg-slate-400 group-hover:bg-slate-500'
                      }`}
                    />
                    <span className="text-[9px] font-mono text-slate-400 leading-none mt-1">
                      {DAY_LABELS[idx]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Row 5: Editorial-Style Summary Sentence */}
          <p className="text-xs text-slate-600 font-serif italic leading-relaxed">
            &ldquo;Solved today&apos;s {problemName} in the fastest time among {totalParticipants} participants, extending a {data.streakCount}-day solving streak.&rdquo;
          </p>

          {/* Row 6: Download Shareable Card Button Full-Width */}
          <div className="pt-1">
            <button
              onClick={handleDownloadStory}
              disabled={isExporting}
              className="w-full py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-slate-700 rounded-full animate-spin" />
                  <span>Exporting card...</span>
                </>
              ) : copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Card exported!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Download shareable card</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ─── Hidden Story Canvas Template (1080x1920 PNG Export) ─── */}
      <div
        ref={storyRef}
        style={{ display: 'none', width: '1080px', height: '1920px' }}
        className="fixed top-0 left-0 bg-slate-50 text-slate-900 flex-col items-center justify-between p-20 overflow-hidden z-[-9999] pointer-events-none"
      >
        <div className="w-full flex items-center justify-between border-b border-slate-200 pb-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-xl border border-slate-300 bg-white flex items-center justify-center text-slate-800">
              <Code2 className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-slate-900">BEC CLUB HUB</h2>
              <p className="text-xl text-slate-500 font-medium">Coder of the Day</p>
            </div>
          </div>
          <span className="px-6 py-2.5 rounded-full border border-slate-300 text-xl font-medium text-slate-600">
            {data.date || 'Today'}
          </span>
        </div>

        <div className="my-auto w-full max-w-2xl bg-white border border-slate-300 rounded-3xl p-16 flex flex-col items-center text-center shadow-none">
          <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-slate-300 bg-slate-100 flex items-center justify-center mb-8">
            {data.photoUrl ? (
              <img src={data.photoUrl} alt={data.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl font-semibold text-slate-500">{getInitials(data.name)}</span>
            )}
          </div>

          <h1 className="text-5xl font-bold text-slate-900 mb-3">{data.name}</h1>
          <p className="text-2xl text-slate-500 font-medium mb-10">
            {problemName} · finished in {timeFormatted}
          </p>

          <div className="grid grid-cols-3 gap-6 w-full mb-10">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <span className="text-lg font-medium text-slate-500 block mb-1">FINISH TIME</span>
              <span className="text-3xl font-bold text-slate-900">{timeFormatted}</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <span className="text-lg font-medium text-slate-500 block mb-1">RANK TODAY</span>
              <span className="text-3xl font-bold text-slate-900">
                #{rankToday} / {totalParticipants}
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <span className="text-lg font-medium text-slate-500 block mb-1">POINTS</span>
              <span className="text-3xl font-bold text-slate-900">+{data.pointsEarned}</span>
            </div>
          </div>

          <p className="text-2xl text-slate-600 font-serif italic leading-relaxed">
            &ldquo;Solved today&apos;s {problemName} in the fastest time among {totalParticipants} participants, extending a {data.streakCount}-day solving streak.&rdquo;
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
