'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import HackathonResults from '@/components/HackathonResults';
import {
  MOCK_ARCHIVED_HACKATHONS,
  MOCK_CURRENT_HACKATHON,
  MOCK_HACKATHON_PARTICIPANTS,
  Hackathon,
} from '@/lib/hackathons-data';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Trophy, Calendar } from 'lucide-react';

export default function ArchivedHackathonDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const allHackathons = [MOCK_CURRENT_HACKATHON, ...MOCK_ARCHIVED_HACKATHONS];
  const hackathon = allHackathons.find((h) => h.id === id) || MOCK_ARCHIVED_HACKATHONS[0];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[var(--background)] pb-24">
        {/* Top Navigation Bar */}
        <div className="max-w-5xl mx-auto px-4 pt-8 pb-4">
          <Link
            href="/hackathons/archive"
            className="inline-flex items-center gap-2 text-xs font-bold text-purple-300 hover:text-white transition-colors bg-purple-950/60 border border-purple-500/30 px-3.5 py-1.5 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Hackathons Archive</span>
          </Link>
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-4">
          <HackathonResults hackathon={hackathon} participants={MOCK_HACKATHON_PARTICIPANTS} />
        </div>
      </div>
    </>
  );
}
