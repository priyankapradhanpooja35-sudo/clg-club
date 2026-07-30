'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import { CardSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { toast } from '@/components/ui/Toast';
import { jsPDF } from 'jspdf';
import {
  Users, Calendar, BarChart3, Activity, TrendingUp,
  ShieldAlert, CheckCircle, Star, Zap, Trash2, ShieldCheck, Download,
  UserPlus
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
  { name: 'Student', value: 720, color: '#2563EB' }, // Blue accent
  { name: 'Faculty', value: 45, color: '#10B981' }, // Green
  { name: 'ClubHead', value: 8, color: '#F59E0B' }, // Amber
  { name: 'Guest', value: 95, color: '#64748B' }, // Slate
];

function KPICard({ title, value, icon: Icon, trend, color = 'blue' }: any) {
  return (
    <Card className="relative overflow-hidden bg-white/85 backdrop-blur-md border border-white/60 dark:bg-slate-900/80 dark:border-slate-800/60 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white">{value}</p>
            {trend && <p className="text-[11px] text-green-500 font-semibold mt-1">↑ {trend}</p>}
          </div>
          <div className="rounded-xl p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
            <Icon className="w-5.5 h-5.5" />
          </div>
        </div>
      </CardContent>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600" />
    </Card>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [clubs, setClubs] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [clubsRes, usersRes, statsRes] = await Promise.all([
        fetch('/api/clubs'),
        fetch('/api/users'),
        fetch('/api/stats'),
      ]);

      if (clubsRes.ok) {
        const d = await clubsRes.json();
        setClubs(d.data || []);
      }
      if (usersRes.ok) {
        const d = await usersRes.json();
        setUsers(d.data || []);
      }
      if (statsRes.ok) {
        const d = await statsRes.json();
        setStats(d.data);
      }
    } catch (err) {
      console.error('Error loading admin dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });
      const data = await res.json();
      if (data.success) {
        toast(`User role updated to ${newRole}`, 'success');
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
      } else {
        toast(data.message || 'Failed to update role', 'error');
      }
    } catch {
      toast('Failed to update role', 'error');
    }
  };

  const handleDeleteClub = async (clubId: string) => {
    if (!confirm('Are you sure you want to delete this club? This action is permanent.')) return;
    try {
      const res = await fetch(`/api/clubs/${clubId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        toast('Club deleted successfully', 'success');
        setClubs(prev => prev.filter(c => c._id !== clubId));
      } else {
        toast(data.message || 'Failed to delete club', 'error');
      }
    } catch {
      toast('Failed to delete club', 'error');
    }
  };

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Document header
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(37, 99, 235); // Blue
      doc.text('BEC Club Management Hub', 14, 20);
      
      doc.setFontSize(12);
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text('Platform Audit & Activity Report', 14, 27);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 33);
      
      doc.setDrawColor(226, 232, 240);
      doc.line(14, 38, 196, 38);
      
      // Stats Block
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(30, 41, 59);
      doc.text('System Statistics Summary', 14, 48);
      
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      doc.text(`• Total Clubs Registered: ${stats?.totalClubs ?? clubs.length}`, 18, 56);
      doc.text(`• Total Active Members: ${stats?.totalMembers ?? users.length}`, 18, 62);
      doc.text(`• Upcoming Events: ${stats?.totalEvents ?? 12}`, 18, 68);
      doc.text(`• Attendee Check-ins Recorded: ${stats?.totalAttendees ?? '3.6K'}`, 18, 74);
      
      // Club list
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(30, 41, 59);
      doc.text('Registered Clubs Directory', 14, 88);
      
      doc.setFontSize(10);
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      let yOffset = 96;
      clubs.forEach((club, index) => {
        if (yOffset > 270) {
          doc.addPage();
          yOffset = 20;
        }
        doc.text(`${index + 1}. ${club.name} (${club.department}) - Coord: ${club.headId?.name || 'Unassigned'}`, 18, yOffset);
        yOffset += 8;
      });
      
      // User list summary
      yOffset += 8;
      if (yOffset > 250) {
        doc.addPage();
        yOffset = 20;
      }
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(30, 41, 59);
      doc.text('User Accounts Directory', 14, yOffset);
      yOffset += 8;
      
      doc.setFontSize(10);
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      users.slice(0, 15).forEach((u, index) => {
        if (yOffset > 270) {
          doc.addPage();
          yOffset = 20;
        }
        doc.text(`${index + 1}. ${u.name} - ${u.email} [Role: ${u.role}]`, 18, yOffset);
        yOffset += 8;
      });
      
      if (users.length > 15) {
        doc.text(`... and ${users.length - 15} more registered users.`, 18, yOffset);
      }
      
      doc.save('BEC-Club-Hub-Audit-Report.pdf');
      toast('PDF Audit Report downloaded!', 'success');
    } catch (err) {
      console.error(err);
      toast('Failed to export PDF report', 'error');
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Admin Overview</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Platform-wide analytics and core settings</p>
        </div>
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" /> Export Report (PDF)
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />) : (
          <>
            <KPICard title="Total Clubs" value={stats?.totalClubs ?? clubs.length} icon={Users} trend="All active" color="blue" />
            <KPICard title="Total Members" value={stats?.totalMembers ?? users.length} icon={Activity} trend="+12% this month" color="blue" />
            <KPICard title="Events Hosted" value={stats?.totalEvents ?? 48} icon={Calendar} trend="+3 this week" color="blue" />
            <KPICard title="Check-ins" value={stats?.totalAttendees ?? '3.6K'} icon={CheckCircle} trend="92% attendance rate" color="blue" />
          </>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Member Growth */}
        <Card className="bg-white/85 backdrop-blur-md border border-white/60 dark:bg-slate-900/80 dark:border-slate-800/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400">
              <TrendingUp className="w-5 h-5 text-blue-600" /> Member Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={memberGrowthData}>
                <defs>
                  <linearGradient id="memberGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--border)', background: 'var(--card)' }} />
                <Area type="monotone" dataKey="members" stroke="#2563EB" strokeWidth={2} fill="url(#memberGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Club Activity */}
        <Card className="bg-white/85 backdrop-blur-md border border-white/60 dark:bg-slate-900/80 dark:border-slate-800/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400">
              <BarChart3 className="w-5 h-5 text-indigo-600" /> Club Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={clubActivityData} barSize={10}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="club" tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--border)', background: 'var(--card)' }} />
                <Bar dataKey="events" fill="#2563EB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="members" fill="#6366F1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* User Distribution & Management Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* User Distribution */}
        <Card className="bg-white/85 backdrop-blur-md border border-white/60 dark:bg-slate-900/80 dark:border-slate-800/60 shadow-sm h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400">
              <Star className="w-5 h-5 text-amber-500" /> User Roles
            </CardTitle>
          </CardHeader>
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

        {/* User Accounts list & Role Management */}
        <Card className="xl:col-span-2 bg-white/85 backdrop-blur-md border border-white/60 dark:bg-slate-900/80 dark:border-slate-800/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400">
              <ShieldCheck className="w-5 h-5 text-blue-600" /> User Role Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
              </div>
            ) : users.length === 0 ? (
              <EmptyState title="No users found" description="No accounts are registered on the hub." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Email</th>
                      <th className="pb-3">Role</th>
                      <th className="pb-3 text-right">Promote/Demote</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id} className="border-b border-slate-50 dark:border-slate-900 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all">
                        <td className="py-3 font-bold text-slate-900 dark:text-white">{u.name}</td>
                        <td className="py-3 text-slate-500 dark:text-slate-400">{u.email}</td>
                        <td className="py-3">
                          <Badge variant={u.role === 'Admin' ? 'danger' : u.role === 'ClubHead' ? 'warning' : 'info'}>
                            {u.role}
                          </Badge>
                        </td>
                        <td className="py-3 text-right">
                          <select
                            value={u.role}
                            onChange={(e) => handleUpdateRole(u._id, e.target.value)}
                            className="text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 font-semibold text-slate-800 dark:text-slate-300 focus:outline-none focus:border-blue-500"
                          >
                            <option value="Student">Student</option>
                            <option value="ClubHead">Club Head</option>
                            <option value="Faculty">Faculty</option>
                            <option value="Admin">Admin</option>
                            <option value="Guest">Guest</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Clubs Management Directory */}
      <Card className="bg-white/85 backdrop-blur-md border border-white/60 dark:bg-slate-900/80 dark:border-slate-800/60 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400">
            <Users className="w-5 h-5 text-indigo-600" /> Club Directory & Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-20 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
          ) : clubs.length === 0 ? (
            <EmptyState title="No clubs created" description="Get started by creating a student club profile." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-3">Club Name</th>
                    <th className="pb-3">Department</th>
                    <th className="pb-3">Coordinator</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clubs.map((c) => (
                    <tr key={c._id} className="border-b border-slate-50 dark:border-slate-900 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all">
                      <td className="py-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-blue-500" /> {c.name}
                      </td>
                      <td className="py-3 text-slate-500 dark:text-slate-400">{c.department}</td>
                      <td className="py-3 font-semibold text-slate-700 dark:text-slate-300">
                        {c.headId?.name || <span className="text-slate-400 italic">Unassigned Coordinator</span>}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleDeleteClub(c._id)}
                          className="p-2 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 transition-all cursor-pointer inline-flex items-center"
                          title="Delete Club"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
