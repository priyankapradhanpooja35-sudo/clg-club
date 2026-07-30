'use client';
import { useEffect, useState } from 'react';
import DataTable, { Column } from '@/components/ui/DataTable';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { toast } from '@/components/ui/Toast';
import { Plus, Edit, Trash2, Eye, Users, ShieldAlert } from 'lucide-react';
import { CLUBS_DATA } from '@/lib/clubs-data';

interface ClubRow {
  _id: string;
  name: string;
  slug: string;
  department?: string;
  description: string;
  headId?: { name: string; email: string };
  memberCount?: number;
  eventCount?: number;
  status?: string;
}

export default function AdminClubsPage() {
  const [clubs, setClubs] = useState<ClubRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ClubRow | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: '',
    slug: '',
    department: 'Computer Science',
    description: '',
    mission: '',
  });

  const fetchClubs = async () => {
    try {
      const res = await fetch('/api/clubs');
      const data = await res.json();
      setClubs(data.data || []);
    } catch {
      toast('Failed to load clubs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const handleCreateClub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.slug || !form.description) {
      toast('Name, slug, and description are required', 'error');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/clubs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        toast('Club created successfully', 'success');
        setModalOpen(false);
        setForm({ name: '', slug: '', department: 'Computer Science', description: '', mission: '' });
        fetchClubs();
      } else {
        toast(data.message || 'Error creating club', 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/clubs/${deleteTarget._id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast('Club deleted', 'success');
        setClubs((prev) => prev.filter((c) => c._id !== deleteTarget._id));
      } else {
        toast(data.message, 'error');
      }
    } finally {
      setDeleteTarget(null);
    }
  };

  const columns: Column<ClubRow>[] = [
    {
      key: 'name',
      header: 'Club Name',
      sortable: true,
      render: (row) => {
        const staticClub = CLUBS_DATA.find((c) => c.slug === row.slug);
        return (
          <div className="flex items-center gap-3">
            <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${staticClub?.gradient || 'from-violet-500 to-indigo-600'} flex items-center justify-center text-white font-bold text-xs shrink-0`}>
              ✦
            </div>
            <div>
              <p className="font-bold text-[var(--foreground)]">{row.name}</p>
              <p className="text-[11px] text-gray-400">/{row.slug}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: 'department',
      header: 'Department',
      sortable: true,
      render: (row) => <span className="text-xs text-gray-500">{row.department || 'General'}</span>,
    },
    {
      key: 'headId',
      header: 'Club Head',
      render: (row) => (
        <span className="text-xs font-semibold text-violet-600 dark:text-violet-400">
          {row.headId?.name || 'Unassigned'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: () => <Badge variant="success">Active</Badge>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => toast(`Editing ${row.name}`, 'info')}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteTarget(row)}
            className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[var(--foreground)]">Clubs Management</h1>
          <p className="text-xs text-gray-400 mt-0.5">Manage all 8 official campus clubs, departments, and leadership.</p>
        </div>
        <Button variant="gradient" size="sm" onClick={() => setModalOpen(true)} className="gap-1.5">
          <Plus className="w-4 h-4" /> Add Club
        </Button>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={clubs}
        loading={loading}
        searchPlaceholder="Search club name or department..."
        searchKey={(r) => `${r.name} ${r.department}`}
        emptyTitle="No clubs found"
        emptyDescription="Click 'Add Club' above to create your first campus club."
      />

      {/* Add Club Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create New Campus Club">
        <form onSubmit={handleCreateClub} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Club Name</label>
            <input
              type="text"
              placeholder="e.g. AI & Robotics Club"
              value={form.name}
              onChange={(e) => {
                const name = e.target.value;
                setForm((p) => ({
                  ...p,
                  name,
                  slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                }));
              }}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2 text-sm focus:border-violet-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Slug (URL endpoint)</label>
            <input
              type="text"
              placeholder="ai-robotics-club"
              value={form.slug}
              onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2 text-sm focus:border-violet-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Department</label>
            <input
              type="text"
              placeholder="e.g. Computer Science"
              value={form.department}
              onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2 text-sm focus:border-violet-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Description</label>
            <textarea
              placeholder="Brief overview of club goals..."
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2 text-sm focus:border-violet-500 focus:outline-none h-20"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border)]">
            <Button variant="secondary" size="sm" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="gradient" size="sm" type="submit" loading={saving}>
              Create Club
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete */}
      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={`Delete "${deleteTarget?.name}"?`}
        description="This will permanently delete the club and remove member associations."
        confirmText="Delete Club"
      />
    </div>
  );
}
