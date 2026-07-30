'use client';
import { useEffect, useState } from 'react';
import DataTable, { Column } from '@/components/ui/DataTable';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { toast } from '@/components/ui/Toast';
import { Plus, Edit, Trash2, Calendar, MapPin, Check, X } from 'lucide-react';

interface EventRow {
  _id: string;
  title: string;
  description: string;
  venue: string;
  date: string;
  isPublished: boolean;
  clubId?: { name: string; slug: string };
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<EventRow | null>(null);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      setEvents(data.data || []);
    } catch {
      toast('Failed to load events', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const togglePublish = async (id: string, isPublished: boolean) => {
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished }),
      });
      const data = await res.json();
      if (data.success) {
        toast(`Event ${isPublished ? 'published' : 'un-published'}`, 'success');
        setEvents((prev) => prev.map((e) => (e._id === id ? { ...e, isPublished } : e)));
      }
    } catch {
      toast('Failed to update event status', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/events/${deleteTarget._id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast('Event deleted', 'success');
        setEvents((prev) => prev.filter((e) => e._id !== deleteTarget._id));
      }
    } finally {
      setDeleteTarget(null);
    }
  };

  const columns: Column<EventRow>[] = [
    {
      key: 'title',
      header: 'Event Title',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-bold text-[var(--foreground)]">{row.title}</p>
          <p className="text-[11px] text-gray-400 truncate max-w-xs">{row.description}</p>
        </div>
      ),
    },
    {
      key: 'clubId',
      header: 'Organizer Club',
      render: (row) => <span className="text-xs font-semibold text-violet-600">{row.clubId?.name || 'Campus Event'}</span>,
    },
    {
      key: 'date',
      header: 'Date & Time',
      sortable: true,
      render: (row) => (
        <span className="text-xs text-gray-500">
          {new Date(row.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      ),
    },
    {
      key: 'venue',
      header: 'Venue',
      render: (row) => <span className="text-xs text-gray-400">{row.venue}</span>,
    },
    {
      key: 'isPublished',
      header: 'Status',
      render: (row) => (
        <Badge variant={row.isPublished ? 'success' : 'warning'}>
          {row.isPublished ? 'Published' : 'Draft'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => togglePublish(row._id, !row.isPublished)}
            className={`p-1.5 rounded-lg text-xs font-semibold ${row.isPublished ? 'text-amber-600 hover:bg-amber-50' : 'text-green-600 hover:bg-green-50'}`}
            title={row.isPublished ? 'Unpublish' : 'Publish'}
          >
            {row.isPublished ? 'Unpublish' : 'Approve'}
          </button>
          <button
            onClick={() => setDeleteTarget(row)}
            className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600"
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
          <h1 className="text-2xl font-black text-[var(--foreground)]">Events Management</h1>
          <p className="text-xs text-gray-400 mt-0.5">Approve, moderate, or create events across all 8 campus clubs.</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={events}
        loading={loading}
        searchPlaceholder="Search event title, venue, or club..."
        searchKey={(r) => `${r.title} ${r.venue}`}
        emptyTitle="No events found"
      />

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={`Delete event "${deleteTarget?.title}"?`}
        description="This will cancel the event and invalidate student registrations."
        confirmText="Delete Event"
      />
    </div>
  );
}
