'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { toast } from '@/components/ui/Toast';
import { Check, X, ShieldAlert, Award, Calendar, CheckCircle2, TrendingUp, Users } from 'lucide-react';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const mockReportsData = [
  { day: 'Mon', registrations: 12 },
  { day: 'Tue', registrations: 19 },
  { day: 'Wed', registrations: 32 },
  { day: 'Thu', registrations: 25 },
  { day: 'Fri', registrations: 45 },
  { day: 'Sat', registrations: 55 },
  { day: 'Sun', registrations: 48 },
];

export default function FacultyDashboard() {
  const { user } = useAuth();
  const [clubs, setClubs] = useState<any[]>([]);
  const [pendingEvents, setPendingEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch clubs
      const clubsRes = await fetch('/api/clubs');
      const clubsJson = await clubsRes.json();
      const allClubs = clubsJson.data || [];
      
      // Seed 2 assigned clubs for this faculty demo
      setClubs(allClubs.slice(0, 2));

      // Fetch pending events (isPublished is false)
      const eventsRes = await fetch('/api/events');
      const eventsJson = await eventsRes.json();
      const allEvents = eventsJson.data || [];
      const pending = allEvents.filter((event: any) => !event.isPublished);
      setPendingEvents(pending);
    } catch (error) {
      console.error('Error fetching faculty dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleApproveEvent = async (eventId: string) => {
    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: true }),
      });
      const data = await res.json();
      if (data.success) {
        toast('Event approved and published successfully!', 'success');
        setPendingEvents(prev => prev.filter(e => e._id !== eventId));
      } else {
        toast(data.message || 'Approval failed', 'error');
      }
    } catch {
      toast('Failed to approve event', 'error');
    }
  };

  const handleRejectEvent = async (eventId: string) => {
    // Stub reject action
    toast('Event proposal rejected and returned to Club Head', 'info');
    setPendingEvents(prev => prev.filter(e => e._id !== eventId));
  };

  if (!user) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[var(--foreground)]">Faculty Portal</h1>
          <p className="text-gray-500 mt-1">Review club requests, approve events, and view reports</p>
        </div>
        <div className="flex items-center gap-3">
          <Avatar name={user.name} size="md" />
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">{user.name}</p>
            <Badge variant="success">Faculty Coordinator</Badge>
          </div>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3.5 bg-blue-50 dark:bg-blue-950/30 rounded-xl text-blue-600">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-400">Assigned Clubs</p>
              <p className="text-2xl font-black text-[var(--foreground)] mt-0.5">{loading ? '...' : clubs.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 rounded-xl text-amber-600">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-400">Pending Approvals</p>
              <p className="text-2xl font-black text-[var(--foreground)] mt-0.5">{loading ? '...' : pendingEvents.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3.5 bg-green-50 dark:bg-green-950/30 rounded-xl text-green-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-400">Active Registrations</p>
              <p className="text-2xl font-black text-[var(--foreground)] mt-0.5">236 students</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Approvals Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-500" /> Pending Event Approvals
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  <div className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
                  <div className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
                </div>
              ) : pendingEvents.length === 0 ? (
                <EmptyState
                  title="No pending proposals"
                  description="All club event proposals have been approved and published."
                  icon={CheckCircle2}
                />
              ) : (
                <div className="space-y-4">
                  {pendingEvents.map((event) => (
                    <div
                      key={event._id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-blue-50 bg-blue-50/10 dark:border-slate-800 dark:bg-slate-900/30"
                    >
                      <div>
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {event.clubId?.name || 'Club Proposal'}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                          {event.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md">
                          {event.description}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium mt-1">
                          📅 {new Date(event.date).toLocaleDateString()} | 📍 {event.venue}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => handleRejectEvent(event._id)}
                          className="p-2 rounded-xl text-red-500 bg-red-50 hover:bg-red-100 transition-colors dark:bg-red-950/20 dark:hover:bg-red-900/30"
                          title="Reject proposal"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleApproveEvent(event._id)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 font-semibold text-xs shadow-md shadow-blue-500/20 transition-all"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3px]" /> Approve
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Reports */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" /> Weekly Activity Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockReportsData}>
                    <defs>
                      <linearGradient id="regGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748B' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--border)', background: 'var(--card)' }} />
                    <Area type="monotone" dataKey="registrations" stroke="#2563EB" strokeWidth={2} fill="url(#regGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assigned Clubs Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" /> Coordinated Clubs
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  <div className="h-20 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
                </div>
              ) : clubs.length === 0 ? (
                <EmptyState
                  title="No assigned clubs"
                  description="You are not currently assigned to coordinate any student clubs."
                />
              ) : (
                <div className="space-y-4">
                  {clubs.map((club) => (
                    <div
                      key={club._id}
                      className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 font-bold dark:bg-slate-800 dark:text-blue-400">
                          {club.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {club.name}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mt-0.5">
                            {club.department} Department
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 leading-normal">
                        {club.description.substring(0, 100)}...
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
