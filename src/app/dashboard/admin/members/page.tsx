'use client';
import { useEffect, useState } from 'react';
import DataTable, { Column } from '@/components/ui/DataTable';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { toast } from '@/components/ui/Toast';
import { Users, Zap, Shield, Filter, CheckCircle, Mail } from 'lucide-react';

interface MemberRow {
  _id: string;
  name: string;
  email: string;
  role: string;
  engagementScore: number;
  createdAt: string;
}

export default function AdminMembersPage() {
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<MemberRow | null>(null);

  useEffect(() => {
    // Fetch all users
    fetch('/api/leaderboard')
      .then((r) => r.json())
      .then((d) => {
        setMembers(d.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: Column<MemberRow>[] = [
    {
      key: 'name',
      header: 'Student Name',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSelectedMember(row)}>
          <Avatar name={row.name} size="sm" />
          <div>
            <p className="font-bold text-[var(--foreground)] hover:text-violet-600 transition-colors">{row.name}</p>
            <p className="text-[11px] text-gray-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      sortable: true,
      render: (row) => (
        <Badge variant={row.role === 'Admin' ? 'warning' : row.role === 'ClubHead' ? 'info' : 'default'}>
          {row.role}
        </Badge>
      ),
    },
    {
      key: 'engagementScore',
      header: 'Engagement Score',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-1 text-amber-600 font-bold">
          <Zap className="w-3.5 h-3.5 fill-amber-500" />
          <span>{row.engagementScore || 0} pts</span>
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: 'Joined Date',
      render: (row) => (
        <span className="text-xs text-gray-400">
          {row.createdAt ? new Date(row.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <Button variant="ghost" size="sm" onClick={() => setSelectedMember(row)}>
          View Profile
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[var(--foreground)]">Members Directory</h1>
          <p className="text-xs text-gray-400 mt-0.5">Manage student profiles, engagement scores, and permissions.</p>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={members}
        loading={loading}
        searchPlaceholder="Search student name or email..."
        searchKey={(r) => `${r.name} ${r.email}`}
        emptyTitle="No members found"
      />

      {/* Member Details Drawer Modal */}
      <Modal
        open={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        title={selectedMember?.name || 'Member Details'}
      >
        {selectedMember && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--muted)]">
              <Avatar name={selectedMember.name} size="lg" />
              <div>
                <h3 className="font-bold text-base text-[var(--foreground)]">{selectedMember.name}</h3>
                <p className="text-xs text-gray-400">{selectedMember.email}</p>
                <div className="flex gap-2 mt-1.5">
                  <Badge variant="info">{selectedMember.role}</Badge>
                  <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 fill-amber-500" /> {selectedMember.engagementScore} points
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-[var(--border)] pt-3 space-y-2">
              <h4 className="text-xs font-semibold uppercase text-gray-400">Activity & Verification</h4>
              <div className="flex justify-between text-xs p-2 rounded-lg bg-[var(--card)] border border-[var(--border)]">
                <span className="text-gray-500">Status</span>
                <span className="font-bold text-green-600">Active Campus Member</span>
              </div>
              <div className="flex justify-between text-xs p-2 rounded-lg bg-[var(--card)] border border-[var(--border)]">
                <span className="text-gray-500">Permissions</span>
                <span className="font-semibold">{selectedMember.role === 'Admin' ? 'Full System Access' : 'Standard Student'}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
