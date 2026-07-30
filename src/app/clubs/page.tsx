'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/Card';
import { CardSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import { CLUBS_DATA } from '@/lib/clubs-data';
import {
  Monitor, Music, Star, Dumbbell, Camera, Rocket, Leaf, Briefcase,
  Users, Calendar, ArrowRight, Search
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { toast } from '@/components/ui/Toast';

const ICON_MAP: Record<string, React.ElementType> = {
  Monitor, Music, Star, Dumbbell, Camera, Rocket, Leaf, Briefcase,
};

export default function ClubsPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [joining, setJoining] = useState<string | null>(null);

  const filtered = CLUBS_DATA.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.department.toLowerCase().includes(search.toLowerCase())
  );

  const handleJoin = async (slug: string) => {
    if (!user) { toast('Please login to join a club', 'info'); return; }
    setJoining(slug);
    try {
      const clubRes = await fetch('/api/clubs');
      const clubData = await clubRes.json();
      const club = clubData.data?.find((c: any) => c.slug === slug);
      if (!club) { toast('Club not found', 'error'); return; }

      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clubId: club._id }),
      });
      const data = await res.json();
      toast(data.message, data.success ? 'success' : 'error');
    } finally {
      setJoining(null);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[var(--background)]">
        {/* Hero */}
        <div className="bg-gradient-to-br from-[#1E1B4B] to-[#1E293B] py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">Explore All Clubs</h1>
            <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
              8 clubs, one campus. Find your community and start making an impact.
            </p>
            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Search clubs or departments..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pl-12 text-white placeholder-white/40 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 backdrop-blur-sm transition-all"
              />
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          {filtered.length === 0 ? (
            <EmptyState icon={Search} title="No clubs found" description={`No clubs match "${search}"`} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filtered.map((club, i) => {
                const Icon = ICON_MAP[club.icon] || Star;
                return (
                  <motion.div
                    key={club.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card hover className="flex flex-col h-full relative overflow-hidden">
                      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${club.gradient}`} />
                      <CardContent className="flex flex-col flex-1 pt-6">
                        <div
                          className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${club.gradient} mb-4 shadow-lg`}
                          style={{ boxShadow: `0 8px 25px ${club.accentColor}40` }}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="font-bold text-[var(--foreground)] text-base leading-tight mb-1">{club.name}</h2>
                        <p className="text-xs text-gray-400 mb-2">{club.department}</p>
                        <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed flex-1">{club.description}</p>
                        <div className="flex gap-2 mt-4">
                          <Link href={`/clubs/${club.slug}`} className="flex-1">
                            <Button variant="secondary" size="sm" className="w-full">View Club</Button>
                          </Link>
                          <Button
                            variant="gradient"
                            size="sm"
                            loading={joining === club.slug}
                            onClick={() => handleJoin(club.slug)}
                            className="flex-1"
                          >
                            Join
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
