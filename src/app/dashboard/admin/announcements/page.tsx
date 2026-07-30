'use client';
import { useEffect, useState } from 'react';
import DataTable, { Column } from '@/components/ui/DataTable';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { toast } from '@/components/ui/Toast';
import { Plus, Trash2, Megaphone, AlertTriangle } from 'lucide-react';

interface AnnRow {
  _id: string;
  title: string;
  content: string;
  priority: 'General' | 'Urgent';
  createdAt: string;
}

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<AnnRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AnnRow | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({ title: '', content: '', priority: 'General' });

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/announcements');
      const data = await res.json();
      setAnnouncements(data.data || []);
    } catch {
      toast('Failed to load announcements', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content) {
      toast('Title and content are required', 'error');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        toast('Announcement posted', 'success');
        setModalOpen(false);
        setForm({ title: '', content: '', priority: 'General' });
        fetchAnnouncements();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch('/api/announcements', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteTarget._id }),
      });
      const data = await res.json();
      if (data.success) {
        toast('Announcement deleted', 'success');
        setAnnouncements((prev) => prev.filter((a) => a._id !== deleteTarget._id));
      }
    } finally {
      setDeleteTarget(null);
    }
  };

  const columns: Column<AnnRow>[] = [
    {
      key: 'title',
      header: 'Notice Title',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-bold text-[var(--foreground)]">{row.title}</p>
          <p className="text-[11px] text-gray-400 line-clamp-1">{row.content}</p>
        </div>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      sortable: true,
      render: (row) => (
        <Badge variant={row.priority === 'Urgent' ? 'urgent' : 'default'}>
          {row.priority}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Posted Date',
      render: (row) => (
        <span className="text-xs text-gray-400">
          {new Date(row.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <button
          onClick={() => setDeleteTarget(row)}
          className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[var(--foreground)]">Announcements Moderation</h1>
          <p className="text-xs text-gray-400 mt-0.5">Post campus notices or moderate announcements from club heads.</p>
        </div>
        <Button variant="gradient" size="sm" onClick={() => setModalOpen(true)} className="gap-1.5">
          <Plus className="w-4 h-4" /> Post Notice
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={announcements}
        loading={loading}
        searchPlaceholder="Search announcement title or content..."
        searchKey={(r) => `${r.title} ${r.content}`}
        emptyTitle="No announcements found"
      />

      {/* Post Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Broadcast Campus Announcement">
        <form onSubmit={handlePost} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Title</label>
            <input
              type="text"
              placeholder="e.g. End Semester Exam Break"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2 text-sm focus:border-violet-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Priority Level</label>
            <select
              value={form.priority}
              onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value as any }))}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2 text-sm focus:border-violet-500 focus:outline-none"
            >
              <option value="General">General Notice</option>
              <option value="Urgent">Urgent / Priority Alert</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Content</label>
            <textarea
              placeholder="Full notice details..."
              value={form.content}
              onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2 text-sm focus:border-violet-500 focus:outline-none h-24"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border)]">
            <Button variant="secondary" size="sm" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="gradient" size="sm" type="submit" loading={saving}>
              Broadcast Notice
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={`Delete announcement "${deleteTarget?.title}"?`}
        description="This will remove the announcement from all student feeds."
        confirmText="Delete Notice"
      />
    </div>
  );
}
