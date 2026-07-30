'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { toast } from '@/components/ui/Toast';
import { CLUBS_DATA } from '@/lib/clubs-data';
import Link from 'next/link';
import {
  Users, Calendar, Ticket, Zap, Star, TrendingUp, ArrowRight,
  QrCode, Plus
} from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [memberships, setMemberships] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [recommendedEvents, setRecommendedEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      fetch(`/api/registrations`).then(r => r.json()),
      fetch(`/api/members?userId=${user.id}&status=Approved`).then(r => r.json()).catch(() => ({ data: [] })),
      fetch('/api/announcements').then(r => r.json()),
      fetch('/api/events/recommended').then(r => r.json()),
    ]).then(([regs, mems, anns, recs]) => {
      setRegistrations(regs.data || []);
      setMemberships(mems.data || []);
      setAnnouncements((anns.data || []).slice(0, 5));
      setRecommendedEvents(recs.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  const handleJoinClub = async (clubId: string) => {
    const res = await fetch('/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clubId }),
    });
    const data = await res.json();
    toast(data.message, data.success ? 'success' : 'error');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-[var(--foreground)]">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 mt-1">Here's what's happening on campus today</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 px-4 py-2.5 text-white">
            <p className="text-xs opacity-80">Engagement Score</p>
            <p className="text-xl font-black flex items-center gap-1">
              <Zap className="w-4 h-4" />
              {user?.engagementScore ?? 0}
            </p>
          </div>
          <Avatar name={user?.name || 'User'} size="lg" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Clubs Joined', value: memberships.length, icon: Users, color: 'text-violet-600' },
          { label: 'Events Registered', value: registrations.length, icon: Calendar, color: 'text-pink-600' },
          { label: 'Events Attended', value: registrations.filter(r => r.checkedIn).length, icon: Star, color: 'text-amber-600' },
          { label: 'QR Tickets', value: registrations.filter(r => !r.checkedIn).length, icon: QrCode, color: 'text-green-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} hover>
            <CardContent>
              <Icon className={`w-6 h-6 ${color} mb-2`} />
              <p className="text-2xl font-black text-[var(--foreground)]">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* My QR Tickets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2"><Ticket className="w-5 h-5 text-violet-500" /> My Event Tickets</span>
            <Link href="/dashboard/student/tickets">
              <Button variant="ghost" size="sm">View all</Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? <CardSkeleton /> : registrations.length === 0 ? (
            <EmptyState icon={Ticket} title="No event registrations yet" description="Browse events and register to get your QR ticket"
              action={<Link href="/events"><Button variant="primary" size="sm">Browse Events</Button></Link>} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {registrations.slice(0, 3).map((reg) => (
                <div key={reg._id} className="rounded-xl border border-[var(--border)] p-4 bg-[var(--muted)]">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-semibold text-sm text-[var(--foreground)] line-clamp-1">{reg.eventId?.title || 'Event'}</p>
                    <Badge variant={reg.checkedIn ? 'success' : 'default'}>
                      {reg.checkedIn ? 'Attended' : 'Registered'}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    {reg.eventId?.date ? new Date(reg.eventId.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'TBD'}
                  </p>
                  <code className="text-xs text-violet-600 bg-violet-50 dark:bg-violet-950/30 px-2 py-1 rounded-lg block truncate">
                    {reg.qrCodeData}
                  </code>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Announcements Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-pink-500" /> Latest Announcements
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? <CardSkeleton /> : announcements.length === 0 ? (
            <EmptyState icon={TrendingUp} title="No announcements" description="Check back later for updates" />
          ) : (
            <div className="space-y-3">
              {announcements.map((ann) => (
                <div key={ann._id} className="flex items-start gap-3 p-4 rounded-xl bg-[var(--muted)]">
                  <Badge variant={ann.priority === 'Urgent' ? 'urgent' : 'default'}>{ann.priority}</Badge>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-[var(--foreground)]">{ann.title}</p>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{ann.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommended for You */}
      {recommendedEvents.length > 0 && (
        <Card className="border-violet-500/20 bg-gradient-to-r from-violet-500/5 via-indigo-500/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" /> Recommended for You
              </span>
              <Badge variant="default">AI Smart Match</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendedEvents.map((ev) => (
                <div key={ev._id} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-violet-600 bg-violet-50 dark:bg-violet-950/40 px-2 py-0.5 rounded-md">
                        {ev.recommendationReason}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(ev.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-[var(--foreground)] mb-1">{ev.title}</h4>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">{ev.description}</p>
                  </div>
                  <Link href="/events">
                    <Button variant="secondary" size="sm" className="w-full text-xs">
                      View Event Details
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Discover Clubs */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-[var(--foreground)]">Discover Clubs</h2>
          <Link href="/clubs">
            <Button variant="ghost" size="sm" className="gap-1">See all <ArrowRight className="w-3.5 h-3.5" /></Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CLUBS_DATA.slice(0, 4).map((club) => (
            <Link key={club.slug} href={`/clubs/${club.slug}`}>
              <Card hover className="text-center p-4">
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${club.gradient} mb-3`}>
                  <span className="text-white text-lg">✦</span>
                </div>
                <p className="text-sm font-semibold text-[var(--foreground)] leading-tight">{club.name}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
