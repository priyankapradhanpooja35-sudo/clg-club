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
import { Users, Calendar, Megaphone, CheckSquare, Plus, Clock, Check, X } from 'lucide-react';

export default function ClubHeadDashboard() {
  const { user } = useAuth();
  const [members, setMembers] = useState<any[]>([]);
  const [pending, setPending] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.clubId) return;
    Promise.all([
      fetch(`/api/members?clubId=${user.clubId}&status=Approved`).then(r => r.json()),
      fetch(`/api/members?clubId=${user.clubId}&status=Pending`).then(r => r.json()),
      fetch(`/api/tasks?clubId=${user.clubId}`).then(r => r.json()),
    ]).then(([m, p, t]) => {
      setMembers(m.data || []);
      setPending(p.data || []);
      setTasks(t.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  const handleApprove = async (membershipId: string, status: 'Approved' | 'Rejected') => {
    const res = await fetch('/api/members', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ membershipId, status }),
    });
    const data = await res.json();
    if (data.success) {
      toast(`Member ${status.toLowerCase()}`, status === 'Approved' ? 'success' : 'info');
      setPending(prev => prev.filter(p => p._id !== membershipId));
      if (status === 'Approved') setMembers(prev => [...prev, data.data]);
    }
  };

  const updateTaskStatus = async (taskId: string, status: string) => {
    await fetch('/api/tasks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId, status }),
    });
    setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status } : t));
    toast('Task updated', 'success');
  };

  const taskColumns = ['To-do', 'In-progress', 'Done'];
  const taskColors: Record<string, string> = {
    'To-do': 'border-gray-300 dark:border-gray-700',
    'In-progress': 'border-amber-400',
    'Done': 'border-green-500',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[var(--foreground)]">Club Head Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your club, events, and members</p>
        </div>
        <div className="flex items-center gap-3">
          <Avatar name={user?.name || 'CH'} size="md" />
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">{user?.name}</p>
            <Badge variant="info">Club Head</Badge>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Members', value: members.length, icon: Users, color: 'violet' },
          { label: 'Pending', value: pending.length, icon: Clock, color: 'amber' },
          { label: 'Tasks Active', value: tasks.filter(t => t.status !== 'Done').length, icon: CheckSquare, color: 'blue' },
          { label: 'Completed', value: tasks.filter(t => t.status === 'Done').length, icon: Check, color: 'green' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent>
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-2xl font-black text-[var(--foreground)]">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending join requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2"><Clock className="w-5 h-5 text-amber-500" /> Pending Join Requests</span>
            {pending.length > 0 && <Badge variant="warning">{pending.length}</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? <CardSkeleton /> : pending.length === 0 ? (
            <EmptyState icon={Users} title="No pending requests" description="All join requests have been processed" />
          ) : (
            <div className="space-y-3">
              {pending.map((p) => (
                <div key={p._id} className="flex items-center gap-4 p-4 rounded-xl bg-[var(--muted)]">
                  <Avatar name={p.userId?.name || 'User'} size="sm" />
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-[var(--foreground)]">{p.userId?.name}</p>
                    <p className="text-xs text-gray-400">{p.userId?.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleApprove(p._id, 'Approved')} className="rounded-lg p-2 bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 transition-colors">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleApprove(p._id, 'Rejected')} className="rounded-lg p-2 bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Kanban Task Board */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[var(--foreground)] flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-violet-500" /> Task Board
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {taskColumns.map((col) => (
            <div key={col} className={`rounded-2xl border-2 ${taskColors[col]} bg-[var(--card)] p-4`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[var(--foreground)]">{col}</h3>
                <Badge variant={col === 'Done' ? 'success' : col === 'In-progress' ? 'warning' : 'default'}>
                  {tasks.filter(t => t.status === col).length}
                </Badge>
              </div>
              <div className="space-y-2.5">
                {tasks.filter(t => t.status === col).map(task => (
                  <div key={task._id} className="rounded-xl bg-[var(--muted)] p-3.5">
                    <p className="font-medium text-sm text-[var(--foreground)] mb-1">{task.title}</p>
                    {task.description && <p className="text-xs text-gray-500 mb-3 line-clamp-2">{task.description}</p>}
                    {task.assignedTo && (
                      <div className="flex items-center gap-1.5 mb-3">
                        <Avatar name={task.assignedTo.name || '?'} size="sm" />
                        <span className="text-xs text-gray-500">{task.assignedTo.name}</span>
                      </div>
                    )}
                    <div className="flex gap-1.5 flex-wrap">
                      {taskColumns.filter(c => c !== col).map(c => (
                        <button key={c} onClick={() => updateTaskStatus(task._id, c)}
                          className="text-xs px-2.5 py-1 rounded-lg bg-[var(--card)] border border-[var(--border)] text-gray-500 hover:text-violet-600 hover:border-violet-300 transition-colors">
                          → {c}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                {tasks.filter(t => t.status === col).length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-6">No tasks here</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
