'use client';

import React from 'react';
import { Hackathon, HackathonParticipant } from '@/lib/hackathons-data';
import HackathonPodium from './HackathonPodium';
import ParticipantsWall from './ParticipantsWall';
import CertificateGenerator from './CertificateGenerator';
import { Trophy, Sparkles, CheckCircle2, Award } from 'lucide-react';

export interface HackathonResultsProps {
  hackathon: Hackathon;
  participants: HackathonParticipant[];
  currentUserId?: string;
}

export default function HackathonResults({
  hackathon,
  participants,
  currentUserId = 'usr_priyanka',
}: HackathonResultsProps) {
  // Find current user's participant info for certificate download
  const currentParticipant = participants.find((p) => p.userId === currentUserId) || participants[1];

  // Map top 3 winners for the podium
  const winners = participants
    .filter((p) => p.rank !== null)
    .sort((a, b) => (a.rank || 0) - (b.rank || 0))
    .map((p) => ({
      rank: p.rank as 1 | 2 | 3,
      studentName: p.name,
      teamName: p.teamName,
      projectTitle: 'Smart Energy & AI Disaster Management System',
      avatarUrl: p.photoUrl,
    }));

  return (
    <div className="space-y-8 w-full">
      {/* Results Header */}
      <div className="bg-slate-950/90 backdrop-blur-2xl border border-purple-500/30 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Hackathon Ended
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-950 border border-purple-500/40 text-purple-300 text-xs font-bold uppercase">
              {hackathon.theme}
            </span>
          </div>

          {/* Certificate Download Component */}
          {currentParticipant && (
            <CertificateGenerator participant={currentParticipant} hackathonTitle={hackathon.title} />
          )}
        </div>

        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-white">
          {hackathon.title} — Official Results
        </h2>

        {/* Problem Statement Recap */}
        <div className="mt-4 p-4 rounded-2xl bg-purple-950/50 border border-purple-500/30">
          <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Challenge Recap
          </h4>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">{hackathon.problemStatement}</p>
        </div>
      </div>

      {/* 1st / 2nd / 3rd Winners Podium */}
      <HackathonPodium winners={winners} title={`${hackathon.title} Winners`} />

      {/* Participants Wall */}
      <ParticipantsWall participants={participants} />
    </div>
  );
}
