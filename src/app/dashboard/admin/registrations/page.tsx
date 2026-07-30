'use client';
import { useEffect, useState } from 'react';
import DataTable, { Column } from '@/components/ui/DataTable';
import Badge from '@/components/ui/Badge';
import { toast } from '@/components/ui/Toast';
import { Ticket, CheckCircle2, Clock } from 'lucide-react';

interface RegRow {
  _id: string;
  qrCodeData: string;
  checkedIn: boolean;
  checkedInAt?: string;
  eventId?: { title: string; date: string; venue: string };
  userId?: { name: string; email: string };
}

export default function AdminRegistrationsPage() {
  const [registrations, setRegistrations] = useState<RegRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/registrations')
      .then((r) => r.json())
      .then((d) => {
        setRegistrations(d.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const total = registrations.length;
  const checkedInCount = registrations.filter((r) => r.checkedIn).length;
  const rate = total > 0 ? Math.round((checkedInCount / total) * 100) : 0;

  const columns: Column<RegRow>[] = [
    {
      key: 'userId',
      header: 'Student Name',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-bold text-[var(--foreground)]">{row.userId?.name || 'Student'}</p>
          <p className="text-[11px] text-gray-400">{row.userId?.email}</p>
        </div>
      ),
    },
    {
      key: 'eventId',
      header: 'Event Name',
      render: (row) => (
        <span className="text-xs font-semibold text-violet-600">{row.eventId?.title || 'Event'}</span>
      ),
    },
    {
      key: 'qrCodeData',
      header: 'QR Token',
      render: (row) => <code className="text-xs text-gray-400 font-mono">{row.qrCodeData}</code>,
    },
    {
      key: 'checkedIn',
      header: 'Attendance Status',
      sortable: true,
      render: (row) => (
        <Badge variant={row.checkedIn ? 'success' : 'default'}>
          {row.checkedIn ? '✓ Checked-In' : 'Registered'}
        </Badge>
      ),
    },
    {
      key: 'checkedInAt',
      header: 'Check-in Time',
      render: (row) => (
        <span className="text-xs text-gray-400">
          {row.checkedInAt
            ? new Date(row.checkedInAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
            : '—'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--foreground)]">Registrations & Attendance</h1>
          <p className="text-xs text-gray-400 mt-0.5">Master log of all event check-ins and tickets across campus.</p>
        </div>

        {/* Attendance Rate Metric */}
        <div className="flex items-center gap-4 bg-[var(--card)] border border-[var(--border)] rounded-2xl p-3 px-5">
          <div className="text-right">
            <p className="text-xs text-gray-400">Overall Attendance Rate</p>
            <p className="text-xl font-black text-green-600">{rate}%</p>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-green-500 border-t-transparent flex items-center justify-center font-bold text-xs">
            {rate}%
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={registrations}
        loading={loading}
        searchPlaceholder="Search student, event, or QR token..."
        searchKey={(r) => `${r.userId?.name} ${r.eventId?.title} ${r.qrCodeData}`}
        emptyTitle="No registrations found"
      />
    </div>
  );
}
