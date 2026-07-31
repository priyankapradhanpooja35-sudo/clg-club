'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/Card';
import { CardSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
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
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const filtered = CLUBS_DATA.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.department.toLowerCase().includes(search.toLowerCase())
  );

  const handleJoin = async (slug: string) => {
    if (!user) {
      toast('Please login to join a club', 'info');
      return;
    }
    setJoining(slug);
    try {
      const clubRes = await fetch('/api/clubs');
      const clubData = await clubRes.json();
      const club = clubData.data?.find((c: any) => c.slug === slug);
      if (!club) {
        toast('Club not found', 'error');
        return;
      }

      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clubId: club._id }),
      });
      const data = await res.json();
      toast(data.message, data.success ? 'success' : 'error');
    } catch {
      toast('Failed to join club', 'error');
    } finally {
      setJoining(null);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950">
        {/* Hero Header */}
        <div className="bg-gradient-to-b from-[#EFF6FF] via-[#F8FAFC] to-[#F8FAFC] dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 py-20 px-4 border-b border-blue-50/50 dark:border-slate-800/50">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-xs font-bold text-[#2563EB] tracking-widest uppercase bg-blue-50 dark:bg-blue-950 dark:text-blue-400 px-3.5 py-1 rounded-full">
              Campus Communities
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mt-4 mb-4 tracking-tight">
              Explore Campus Clubs
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg mb-8 max-w-xl mx-auto font-medium leading-relaxed">
              8 unique clubs, one campus. Find your community, build new skills, and elevate your student life.
            </p>
            
            {/* Search Input Box */}
            <div className="relative max-w-md mx-auto shadow-md shadow-blue-500/5 rounded-2xl bg-white dark:bg-slate-900">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search clubs or departments..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-blue-100 bg-white px-4 py-3.5 pl-12 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-slate-900 dark:border-slate-850 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Club Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          {filtered.length === 0 ? (
            <EmptyState icon={Search} title="No clubs found" description={`No clubs match "${search}"`} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filtered.map((club, i) => {
                const Icon = ICON_MAP[club.icon] || Star;
                const hasImage = club.image && !imageErrors[club.slug];

                return (
                  <motion.div
                    key={club.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                  >
                    <Card className="bg-white border-t-3 border-t-[#2563EB]/80 dark:bg-slate-900 border border-blue-50/50 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(37,99,235,0.08)] hover:border-blue-100/80 transition-all duration-300 rounded-2xl relative overflow-hidden flex flex-col h-full">
                      
                      {/* Banner Image / Fallback Placeholder */}
                      {hasImage ? (
                        <div className="relative w-full h-40 overflow-hidden bg-slate-100">
                          <Image
                            src={club.image}
                            alt={club.name}
                            width={400}
                            height={200}
                            onError={() => setImageErrors(prev => ({ ...prev, [club.slug]: true }))}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            priority={i < 4}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-transparent pointer-events-none" />
                        </div>
                      ) : (
                        <div className="relative w-full h-40 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-slate-850 dark:to-slate-900/50 border-b border-blue-50/50 dark:border-slate-800">
                          <Icon className="w-12 h-12 text-[#2563EB] opacity-40" />
                        </div>
                      )}

                      {/* Content Section */}
                      <CardContent className="flex flex-col flex-1 pt-8 pb-6 px-5 relative">
                        {/* Layered Logo Badge overlapping the banner */}
                        <div className="absolute -top-7 left-5 h-12 w-12 flex items-center justify-center rounded-xl bg-white border border-blue-100/60 shadow-sm dark:bg-slate-950 dark:border-slate-800 overflow-hidden p-1">
                          <img src={(club as any).logo || club.image} alt={club.name} className="w-full h-full object-contain" />
                        </div>

                        {/* Title and Category */}
                        <div className="flex-1">
                          <h2 className="font-bold text-[#1E293B] dark:text-white text-base leading-snug mb-0.5 tracking-tight">
                            {club.name}
                          </h2>
                          <span className="text-[10px] font-bold text-[#64748B] dark:text-slate-400 uppercase tracking-widest block mb-3">
                            {club.department}
                          </span>
                          <p className="text-xs text-[#475569] dark:text-slate-300 line-clamp-3 leading-relaxed">
                            {club.description}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2.5 mt-5">
                          <Link href={`/clubs/${club.slug}`} className="flex-1">
                            <button className="w-full text-center px-4 py-2 rounded-full text-xs font-bold text-[#2563EB] border border-[#2563EB] bg-transparent hover:bg-[#EFF6FF] dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-950/40 transition-all duration-200 ease-in-out cursor-pointer">
                              View Club
                            </button>
                          </Link>
                          <button
                            disabled={joining === club.slug}
                            onClick={() => handleJoin(club.slug)}
                            className="flex-1 px-4 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#2563EB] to-[#3B82F6] shadow-md shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all duration-200 ease-in-out disabled:opacity-50 cursor-pointer"
                          >
                            {joining === club.slug ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                            ) : (
                              'Join'
                            )}
                          </button>
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
