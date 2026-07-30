'use client';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import { CardSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { Trophy, Award, Zap, Star, Flame, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LeaderboardPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then((r) => r.json())
      .then((d) => {
        setUsers(d.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <span className="text-2xl">🥇</span>;
    if (rank === 2) return <span className="text-2xl">🥈</span>;
    if (rank === 3) return <span className="text-2xl">🥉</span>;
    return <span className="text-sm font-black text-gray-400">#{rank}</span>;
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[var(--background)]">
        {/* Hero */}
        <div className="bg-gradient-to-br from-[#1E1B4B] via-[#4C1D95] to-[#1E293B] py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-white/80 mb-4">
              <Trophy className="w-3.5 h-3.5 text-amber-400" /> BEC Gamification
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">Campus Leaderboard</h1>
            <p className="text-white/70 text-lg max-w-xl mx-auto">
              Top active students earning engagement points through event participation and club contributions.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : users.length === 0 ? (
            <EmptyState icon={Trophy} title="No activity recorded yet" description="Attend events to earn points!" />
          ) : (
            <div className="space-y-3">
              {users.map((user, i) => {
                const rank = i + 1;
                const isTop3 = rank <= 3;
                return (
                  <motion.div
                    key={user._id}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card
                      className={`transition-all duration-200 ${
                        isTop3 ? 'border-amber-400/40 bg-gradient-to-r from-amber-500/5 via-violet-500/5 to-transparent' : ''
                      }`}
                    >
                      <CardContent className="py-4 px-5">
                        <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
                          {/* Rank */}
                          <div className="w-10 text-center shrink-0">{getRankBadge(rank)}</div>

                          {/* Avatar */}
                          <Avatar name={user.name} size="md" />

                          {/* User Info */}
                          <div className="flex-1 min-w-48">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-[var(--foreground)] text-base">{user.name}</h3>
                              {user.role === 'ClubHead' && <Badge variant="warning">Club Head</Badge>}
                            </div>
                            <p className="text-xs text-gray-400">{user.email}</p>

                            {/* Badges Pill Row */}
                            {user.badges && user.badges.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {user.badges.map((b: any) => (
                                  <span
                                    key={b.id}
                                    title={b.description}
                                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${b.color}`}
                                  >
                                    <span>{b.icon}</span>
                                    <span>{b.name}</span>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Engagement Score */}
                          <div className="text-right shrink-0">
                            <div className="flex items-center justify-end gap-1.5">
                              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                              <span className="text-xl font-black text-[var(--foreground)]">
                                {user.engagementScore || 0}
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-400">pts</p>
                          </div>
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
