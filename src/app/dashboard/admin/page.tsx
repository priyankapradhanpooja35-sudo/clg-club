'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Navbar from '@/components/Navbar';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import { CardSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import {
  Users, Calendar, BarChart3, Activity, TrendingUp,
  Bell, CheckCircle, Star, Zap
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const memberGrowthData = [
  { month: 'Jan', members: 80 }, { month: 'Feb', members: 150 },
  { month: 'Mar', members: 220 }, { month: 'Apr', members: 310 },
  { month: 'May', members: 410 }, { month: 'Jun', members: 540 },
  { month: 'Jul', members: 680 },
];

const clubActivityData = [
  { club: 'Microsoft', events: 8, members: 95 },
  { club: 'Music', events: 6, members: 72 },
  { club: 'Events', events: 12, members: 88 },
  { club: 'Sports', events: 10, members: 110 },
  { club: 'Media', events: 7, members: 65 },
  { club: 'Startup', events: 5, members: 58 },
  { club: 'Social', events: 9, members: 70 },
  { club: 'Placement', events: 11, members: 102 },
];

const pieData = [
  { name: 'Student', value: 720, color: '#7C3AED' },
  { name: 'Faculty', value: 45, color: '#EC4899' },
  { name: 'ClubHead', value: 8, color: '#F59E0B' },
  { name: 'Guest', value: 95, color: '#10B981' },
];

function KPICard({ title, value, icon: Icon, trend, color = 'violet' }: any) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <p className="text-3xl font-black text-[var(--foreground)]">{value}</p>
            {trend && <p className="text-xs text-green-500 font-medium mt-1">↑ {trend}</p>}
          </div>
          <div className={`rounded-xl p-3 bg-${color}-100 dark:bg-${color}-900/30`}>
            <Icon className={`w-5 h-5 text-${color}-600`} />
          </div>
        </div>
      </CardContent>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-pink-500" />
    </Card>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(d => { setStats(d.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (!user) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[var(--foreground)]">Admin Overview</h1>
          <p className="text-gray-500 mt-1">Platform-wide analytics and management</p>
        </div>
        <div className="flex items-center gap-3">
          <Avatar name={user.name} size="md" />
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">{user.name}</p>
            <Badge variant="warning">Admin</Badge>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />) : (
          <>
            <KPICard title="Total Clubs" value={stats?.totalClubs ?? 8} icon={Users} trend="All active" color="violet" />
            <KPICard title="Total Members" value={stats?.totalMembers ?? '680+'} icon={Activity} trend="+12% this month" color="pink" />
            <KPICard title="Events Hosted" value={stats?.totalEvents ?? 48} icon={Calendar} trend="+3 this week" color="amber" />
            <KPICard title="Check-ins" value={stats?.totalAttendees ?? '3.6K'} icon={CheckCircle} trend="92% attendance rate" color="green" />
          </>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Member Growth */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-violet-500" /> Member Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={memberGrowthData}>
                <defs>
                  <linearGradient id="memberGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--border)', background: 'var(--card)' }} />
                <Area type="monotone" dataKey="members" stroke="#7C3AED" strokeWidth={2} fill="url(#memberGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Club Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-pink-500" /> Club Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={clubActivityData} barSize={10}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="club" tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--border)', background: 'var(--card)' }} />
                <Bar dataKey="events" fill="#7C3AED" radius={[4, 4, 0, 0]} />
                <Bar dataKey="members" fill="#EC4899" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* User Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Star className="w-5 h-5 text-amber-500" /> User Roles</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--border)', background: 'var(--card)' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader><CardTitle className="flex items-center gap-2"><Zap className="w-5 h-5 text-violet-500" /> Recent Activity</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { action: 'New member joined Microsoft Club', time: '2 min ago', type: 'join' },
                { action: 'Tech Fest 2024 event published', time: '15 min ago', type: 'event' },
                { action: 'Sports Club approved 5 join requests', time: '1 hour ago', type: 'approve' },
                { action: 'Media Club posted announcement', time: '2 hours ago', type: 'announce' },
                { action: '32 students registered for AI Workshop', time: '3 hours ago', type: 'reg' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--muted)] text-sm">
                  <div className="h-2 w-2 rounded-full bg-violet-500 shrink-0" />
                  <span className="flex-1 text-[var(--foreground)]">{item.action}</span>
                  <span className="text-gray-400 text-xs shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
