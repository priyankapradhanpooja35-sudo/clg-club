'use client';

import React, { useRef, useState } from 'react';
import { Crown, Trophy, Medal, Award, Download, Sparkles, Share2, Check, Code2 } from 'lucide-react';
import html2canvas from 'html2canvas';

export type BadgeType = 'coder-of-day' | 'hackathon-1st' | 'hackathon-2nd' | 'hackathon-3rd';

export interface AchievementBadgeCardProps {
  photoUrl?: string;
  name: string;
  subtitle?: string;
  badgeType: BadgeType;
  className?: string;
  showDownloadButton?: boolean;
}

/* ─── Badge Config Helper ─── */
export const getBadgeConfig = (type: BadgeType) => {
  switch (type) {
    case 'coder-of-day':
      return {
        label: 'Coder of the Day',
        shortLabel: 'Coder of the Day',
        rank: 1,
        icon: Crown,
        defaultSubtitle: 'Daily Coding Challenge',
        // Gold theme
        ringGradient: 'from-amber-300 via-yellow-400 to-amber-600',
        ringBorderClass: 'border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.5)]',
        badgeBg: 'bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 border-2 border-yellow-200 shadow-lg shadow-amber-500/40',
        pillBg: 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/30',
        cardGlow: 'shadow-[0_0_40px_rgba(245,158,11,0.25)] border-amber-400/40',
        textColor: 'text-amber-300',
        storyGlow: 'from-amber-500/30 via-purple-900/60 to-indigo-950',
      };
    case 'hackathon-1st':
      return {
        label: 'Champion 🥇',
        shortLabel: 'Champion',
        rank: 1,
        icon: Trophy,
        defaultSubtitle: '1st Place • BEC Hackathon 2026',
        // Gold theme
        ringGradient: 'from-amber-300 via-yellow-400 to-amber-600',
        ringBorderClass: 'border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.5)]',
        badgeBg: 'bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 border-2 border-yellow-200 shadow-lg shadow-amber-500/40',
        pillBg: 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/30',
        cardGlow: 'shadow-[0_0_40px_rgba(245,158,11,0.25)] border-amber-400/40',
        textColor: 'text-amber-300',
        storyGlow: 'from-amber-500/30 via-purple-900/60 to-indigo-950',
      };
    case 'hackathon-2nd':
      return {
        label: '1st Runner-Up 🥈',
        shortLabel: '2nd Place',
        rank: 2,
        icon: Trophy,
        defaultSubtitle: '2nd Place • BEC Hackathon 2026',
        // Silver theme
        ringGradient: 'from-slate-200 via-slate-300 to-slate-400',
        ringBorderClass: 'border-slate-300 shadow-[0_0_20px_rgba(203,213,225,0.4)]',
        badgeBg: 'bg-gradient-to-br from-slate-200 to-slate-400 text-slate-950 border-2 border-slate-100 shadow-lg shadow-slate-400/30',
        pillBg: 'bg-gradient-to-r from-slate-200 via-slate-300 to-slate-400 text-slate-950 font-black shadow-md shadow-slate-400/20',
        cardGlow: 'shadow-[0_0_30px_rgba(148,163,184,0.15)] border-slate-400/40',
        textColor: 'text-slate-300',
        storyGlow: 'from-slate-500/30 via-purple-900/60 to-indigo-950',
      };
    case 'hackathon-3rd':
      return {
        label: '2nd Runner-Up 🥉',
        shortLabel: '3rd Place',
        rank: 3,
        icon: Award,
        defaultSubtitle: '3rd Place • BEC Hackathon 2026',
        // Bronze theme
        ringGradient: 'from-amber-600 via-orange-500 to-amber-700',
        ringBorderClass: 'border-amber-600 shadow-[0_0_20px_rgba(217,119,6,0.3)]',
        badgeBg: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white border-2 border-amber-300 shadow-lg shadow-orange-500/30',
        pillBg: 'bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 text-white font-black shadow-md shadow-orange-500/20',
        cardGlow: 'shadow-[0_0_30px_rgba(217,119,6,0.15)] border-amber-600/40',
        textColor: 'text-amber-400',
        storyGlow: 'from-orange-600/30 via-purple-900/60 to-indigo-950',
      };
  }
};

export default function AchievementBadgeCard({
  photoUrl,
  name,
  subtitle,
  badgeType,
  className = '',
  showDownloadButton = true,
}: AchievementBadgeCardProps) {
  const config = getBadgeConfig(badgeType);
  const BadgeIcon = config.icon;
  const storyRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Avatar Initials Fallback
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'BC';

  const finalSubtitle = subtitle || config.defaultSubtitle;

  /* ─── Export Handler for 1080x1920 Instagram Story / WhatsApp Status ─── */
  const handleDownloadStory = async () => {
    if (!storyRef.current) return;
    setIsExporting(true);

    try {
      // Temporary unhide story template for capturing
      const element = storyRef.current;
      element.style.display = 'flex';

      const canvas = await (html2canvas as any)(element, {
        width: 1080,
        height: 1920,
        scale: 1,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#0F0728',
        logging: false,
      });

      element.style.display = 'none';

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `BEC_Achievement_${name.replace(/\s+/g, '_')}_${badgeType}.png`;
      link.href = image;
      link.click();
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Error generating story card:', err);
    } finally {
      if (storyRef.current) {
        storyRef.current.style.display = 'none';
      }
      setIsExporting(false);
    }
  };

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      {/* ─── Main On-Screen Card Component ─── */}
      <div
        className={`w-full max-w-sm rounded-3xl p-6 bg-slate-900/90 backdrop-blur-xl border ${config.cardGlow} transition-all duration-300 hover:scale-[1.02] text-center flex flex-col items-center relative overflow-hidden group`}
      >
        {/* Ambient Purple Theme Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 via-slate-900/60 to-slate-950 -z-10" />
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-[11px] font-semibold text-purple-200 mb-6">
          <Sparkles className="w-3 h-3 text-purple-400" />
          <span>BEC Gamification</span>
        </div>

        {/* Circular Frame for Profile Photo with Overlapping Icon Badge */}
        <div className="relative mb-5 group-hover:scale-105 transition-transform duration-300">
          {/* Overlapping Top Icon Badge */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center ${config.badgeBg}`}>
              <BadgeIcon className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>

          {/* Gradient Ring Outer Border */}
          <div className={`p-1.5 rounded-full bg-gradient-to-tr ${config.ringGradient} ${config.ringBorderClass}`}>
            <div className="w-28 h-28 rounded-full overflow-hidden bg-slate-950 flex items-center justify-center border-2 border-slate-900 relative">
              {photoUrl ? (
                // eslint-disable-next-next/no-img-element
                <img
                  src={photoUrl}
                  alt={name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to initials if image fails
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : null}
              {/* Fallback Initials */}
              <div
                className={`w-full h-full bg-gradient-to-br from-purple-800 to-indigo-900 flex items-center justify-center font-black text-2xl text-white ${
                  photoUrl ? 'absolute inset-0 -z-10' : ''
                }`}
              >
                {initials}
              </div>
            </div>
          </div>
        </div>

        {/* Student Name */}
        <h3 className="text-2xl font-black text-white tracking-tight mb-1 group-hover:text-purple-200 transition-colors">
          {name}
        </h3>

        {/* Date / Subtitle */}
        <p className="text-xs font-medium text-slate-400 mb-4 flex items-center justify-center gap-1.5">
          <span>{finalSubtitle}</span>
        </p>

        {/* Pill-Style Achievement Label */}
        <div className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs uppercase tracking-wider ${config.pillBg}`}>
          <BadgeIcon className="w-4 h-4" />
          <span>{config.label}</span>
        </div>

        {/* Share Button (Optional) */}
        {showDownloadButton && (
          <button
            onClick={handleDownloadStory}
            disabled={isExporting}
            className="mt-6 w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs tracking-wide uppercase transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-purple-900/40 hover:shadow-purple-700/50 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating PNG...</span>
              </>
            ) : copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-purple-200" />
                <span>Download Shareable Card</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* ─── Hidden Instagram Story / WhatsApp Status Export Canvas Template (1080x1920) ─── */}
      <div
        ref={storyRef}
        style={{ display: 'none', width: '1080px', height: '1920px' }}
        className="fixed top-0 left-0 bg-[#0F0728] text-white flex-col items-center justify-between p-16 overflow-hidden z-[-9999] pointer-events-none"
      >
        {/* Background Ambient FX */}
        <div className={`absolute inset-0 bg-gradient-to-b ${config.storyGlow} -z-10`} />
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-purple-600/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-indigo-600/30 rounded-full blur-[120px]" />

        {/* Story Header */}
        <div className="w-full flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Code2 className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h2 className="text-3xl font-black tracking-tight text-white">BEC CLUB HUB</h2>
              <p className="text-lg text-purple-300 font-semibold uppercase tracking-widest">Campus Leaderboard</p>
            </div>
          </div>

          <div className="px-6 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xl font-bold text-amber-300 flex items-center gap-2">
            <Sparkles className="w-6 h-6" /> Official Badge
          </div>
        </div>

        {/* Main Center Content */}
        <div className="flex flex-col items-center text-center my-auto z-10 w-full max-w-2xl">
          {/* Circular Frame Photo */}
          <div className="relative mb-12">
            {/* Top Badge Icon */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-30">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center ${config.badgeBg}`}>
                <BadgeIcon className="w-12 h-12 stroke-[2.5]" />
              </div>
            </div>

            {/* Glowing Ring */}
            <div className={`p-4 rounded-full bg-gradient-to-tr ${config.ringGradient} shadow-[0_0_80px_rgba(245,158,11,0.6)]`}>
              <div className="w-72 h-72 rounded-full overflow-hidden bg-slate-950 flex items-center justify-center border-4 border-slate-900 relative">
                {photoUrl ? (
                  // eslint-disable-next-next/no-img-element
                  <img src={photoUrl} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-800 to-indigo-900 flex items-center justify-center font-black text-7xl text-white">
                    {initials}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Student Name */}
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-white tracking-tight mb-4 drop-shadow-xl">
            {name}
          </h1>

          {/* Subtitle */}
          <p className="text-2xl font-medium text-purple-200 mb-10 tracking-wide">{finalSubtitle}</p>

          {/* Huge Pill Badge */}
          <div className={`inline-flex items-center gap-4 rounded-full px-12 py-5 text-2xl uppercase tracking-widest ${config.pillBg}`}>
            <BadgeIcon className="w-8 h-8" />
            <span>{config.label}</span>
          </div>
        </div>

        {/* Story Footer */}
        <div className="w-full pt-10 border-t border-white/10 flex items-center justify-between text-purple-300 text-xl font-semibold z-10">
          <div className="flex items-center gap-3">
            <Share2 className="w-6 h-6 text-purple-400" />
            <span>Share your achievement on Instagram & WhatsApp</span>
          </div>
          <span className="px-5 py-2 rounded-xl bg-purple-950/80 border border-purple-500/30 text-purple-200 font-mono">
            @bec_clubhub
          </span>
        </div>
      </div>
    </div>
  );
}
