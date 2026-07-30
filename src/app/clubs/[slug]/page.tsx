'use client';
import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import { CardSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { CLUBS_DATA } from '@/lib/clubs-data';
import { toast } from '@/components/ui/Toast';
import { useAuth } from '@/lib/AuthContext';
import {
  Monitor, Music, Star, Dumbbell, Camera, Rocket, Leaf, Briefcase,
  Users, Calendar, MapPin, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const ICON_MAP: Record<string, React.ElementType> = {
  Monitor, Music, Star, Dumbbell, Camera, Rocket, Leaf, Briefcase,
};

export default function ClubProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [clubDoc, setClubDoc] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  const staticData = CLUBS_DATA.find(c => c.slug === slug);

  useEffect(() => {
    if (!slug) return;
    // Fetch club from API by slug (get all and filter)
    Promise.all([
      fetch('/api/clubs').then(r => r.json()),
      fetch('/api/events?upcoming=true').then(r => r.json()),
    ]).then(([clubs, evs]) => {
      const doc = clubs.data?.find((c: any) => c.slug === slug);
      setClubDoc(doc || null);
      if (doc) {
        fetch(`/api/members?clubId=${doc._id}`)
          .then(r => r.json())
          .then(m => setMembers(m.data || []));
        setEvents((evs.data || []).filter((e: any) => e.clubId?._id === doc._id || e.clubId === doc._id));
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [slug]);

  const handleJoin = async () => {
    if (!user) { toast('Please login to join', 'info'); return; }
    if (!clubDoc) return;
    setJoining(true);
    const res = await fetch('/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clubId: clubDoc._id }),
    });
    const data = await res.json();
    toast(data.message, data.success ? 'success' : 'error');
    setJoining(false);
  };

  if (!staticData) return notFound();

  const Icon = ICON_MAP[staticData.icon] || Star;

  return (
    <>
      <Navbar />
      {/* Hero Banner */}
      <div className={`bg-gradient-to-br ${staticData.gradient} py-16 px-4`}>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-xl">
              <Icon className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white/70 text-sm font-medium mb-1">{staticData.department}</p>
              <h1 className="text-4xl font-black text-white mb-2">{staticData.name}</h1>
              <p className="text-white/80 max-w-2xl leading-relaxed">{staticData.description}</p>
            </div>
            <Button
              variant="secondary"
              size="lg"
              loading={joining}
              onClick={handleJoin}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30 shrink-0"
            >
              Join Club
            </Button>
          </div>
          <div className="flex items-center gap-6 mt-8">
            <div className="text-center text-white">
              <p className="text-2xl font-black">{loading ? '…' : members.length}</p>
              <p className="text-xs text-white/60">Members</p>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-center text-white">
              <p className="text-2xl font-black">{loading ? '…' : events.length}</p>
              <p className="text-xs text-white/60">Upcoming Events</p>
            </div>
            {clubDoc?.headId && (
              <>
                <div className="h-8 w-px bg-white/20" />
                <div className="flex items-center gap-2 text-white">
                  <Avatar name={clubDoc.headId?.name || 'Head'} size="sm" />
                  <div>
                    <p className="text-xs text-white/60">Club Head</p>
                    <p className="text-sm font-semibold">{clubDoc.headId?.name}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
        {/* Mission */}
        <Card glass>
          <CardContent>
            <h2 className="text-lg font-bold text-[var(--foreground)] mb-2">Our Mission</h2>
            <p className="text-gray-500 leading-relaxed">{staticData.mission}</p>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <div>
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-violet-500" /> Upcoming Events
          </h2>
          {loading ? <CardSkeleton /> : events.length === 0 ? (
            <EmptyState icon={Calendar} title="No upcoming events" description="Check back soon for new events." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {events.map((ev, i) => (
                <motion.div key={ev._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                  <Card hover>
                    <CardContent>
                      <h3 className="font-bold text-[var(--foreground)] mb-1">{ev.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-3">{ev.description}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />
                          {new Date(ev.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {ev.venue}</span>
                      </div>
                      <Link href={`/events/${ev._id}`}>
                        <Button variant="gradient" size="sm" className="w-full">Register <ArrowRight className="w-3.5 h-3.5" /></Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Members */}
        <div>
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-violet-500" /> Members ({members.length})
          </h2>
          {loading ? <CardSkeleton /> : members.length === 0 ? (
            <EmptyState icon={Users} title="No members yet" description="Be the first to join this club!" />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {members.slice(0, 8).map((m) => (
                <Card key={m._id} className="text-center p-4">
                  <Avatar name={m.userId?.name || '?'} size="lg" className="mx-auto mb-2" />
                  <p className="font-semibold text-sm text-[var(--foreground)] truncate">{m.userId?.name}</p>
                  <Badge variant="default" className="mt-1">{m.memberRole}</Badge>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
