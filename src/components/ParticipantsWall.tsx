'use client';

import React, { useState } from 'react';
import { HackathonParticipant } from '@/lib/hackathons-data';
import { Users, Trophy, Medal, Award, Camera, X, Sparkles, Shield } from 'lucide-react';

export interface ParticipantsWallProps {
  participants: HackathonParticipant[];
}

export default function ParticipantsWall({ participants }: ParticipantsWallProps) {
  const [showGroupPhotoModal, setShowGroupPhotoModal] = useState(false);

  // Group participants by teamName
  const teamMap = participants.reduce((acc, p) => {
    if (!acc[p.teamName]) acc[p.teamName] = [];
    acc[p.teamName].push(p);
    return acc;
  }, {} as Record<string, HackathonParticipant[]>);

  const teamNames = Object.keys(teamMap);

  return (
    <div className="w-full bg-slate-950/90 backdrop-blur-2xl border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(147,51,234,0.15)] relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-purple-500/20 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-900/60 border border-purple-500/40 flex items-center justify-center text-purple-300">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white tracking-tight">Participants Wall</h3>
            <p className="text-xs text-slate-400">Celebrating every team & builder who competed</p>
          </div>
        </div>

        {/* View Full Group Photo Modal Trigger */}
        <button
          onClick={() => setShowGroupPhotoModal(true)}
          className="px-4 py-2 rounded-xl bg-purple-900/50 hover:bg-purple-800/70 border border-purple-400/40 text-purple-200 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer active:scale-95 shadow-md"
        >
          <Camera className="w-4 h-4 text-purple-300" />
          <span>View Full Group Photo</span>
        </button>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamNames.map((teamName) => {
          const members = teamMap[teamName];
          const rank = members.find((m) => m.rank !== null)?.rank || null;

          const ringClasses =
            rank === 1
              ? 'ring-2 ring-amber-400 border-amber-400'
              : rank === 2
              ? 'ring-2 ring-slate-300 border-slate-300'
              : rank === 3
              ? 'ring-2 ring-amber-600 border-amber-600'
              : 'border-purple-500/30';

          return (
            <div
              key={teamName}
              className="bg-slate-900/80 border border-purple-500/20 hover:border-purple-500/40 rounded-2xl p-4 transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-white tracking-tight">{teamName}</h4>
                {rank && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1 ${
                      rank === 1
                        ? 'bg-amber-400 text-slate-950'
                        : rank === 2
                        ? 'bg-slate-300 text-slate-950'
                        : 'bg-amber-600 text-white'
                    }`}
                  >
                    {rank === 1 ? <Trophy className="w-3 h-3" /> : rank === 2 ? <Medal className="w-3 h-3" /> : <Award className="w-3 h-3" />}
                    Rank #{rank}
                  </span>
                )}
              </div>

              {/* Row of Avatars & Names */}
              <div className="flex items-center gap-2 flex-wrap">
                {members.map((member) => (
                  <div key={member.userId} className="flex items-center gap-2 bg-slate-950/60 p-1.5 pr-3 rounded-full border border-purple-500/20">
                    <img
                      src={member.photoUrl}
                      alt={member.name}
                      className={`w-7 h-7 rounded-full object-cover ${ringClasses}`}
                    />
                    <span className="text-xs font-semibold text-slate-200">{member.name}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Class Photo Group Modal ─── */}
      {showGroupPhotoModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-purple-500/40 rounded-3xl p-6 sm:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative text-white shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setShowGroupPhotoModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950 border border-purple-500/40 text-xs font-bold text-amber-300 mb-2">
                <Sparkles className="w-3.5 h-3.5" /> Hackathon Class Photo
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white">
                BEC Hackathon Builders Wall
              </h3>
              <p className="text-xs text-slate-400 mt-1">Every student innovator who participated</p>
            </div>

            {/* Class Photo Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {participants.map((p) => {
                const ringStyle =
                  p.rank === 1
                    ? 'ring-4 ring-amber-400 border-amber-300'
                    : p.rank === 2
                    ? 'ring-4 ring-slate-300 border-slate-200'
                    : p.rank === 3
                    ? 'ring-4 ring-amber-600 border-amber-500'
                    : 'border-purple-500/40';

                return (
                  <div
                    key={p.userId}
                    className="flex flex-col items-center text-center p-3 rounded-2xl bg-slate-950/70 border border-purple-500/20 hover:border-purple-500/50 transition-all"
                  >
                    <div className="relative mb-2">
                      <img src={p.photoUrl} alt={p.name} className={`w-16 h-16 rounded-full object-cover border-2 ${ringStyle}`} />
                      {p.rank && (
                        <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[9px]">
                          #{p.rank}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-white truncate max-w-full">{p.name}</span>
                    <span className="text-[10px] text-purple-300 truncate max-w-full font-medium">{p.teamName}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
