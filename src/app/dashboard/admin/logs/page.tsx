'use client';
import { useState } from 'react';
import DataTable, { Column } from '@/components/ui/DataTable';
import Badge from '@/components/ui/Badge';
import { History, Shield, User, Clock } from 'lucide-react';

interface AuditLog {
  id: string;
  user: string;
  role: string;
  action: string;
  target: string;
  ip: string;
  timestamp: string;
}

export default function AdminLogsPage() {
  const [logs] = useState<AuditLog[]>([
    { id: '1', user: 'Admin User', role: 'Admin', action: 'Approved Club Creation', target: 'Microsoft Club', ip: '192.168.1.1', timestamp: '5 min ago' },
    { id: '2', user: 'Microsoft Club Head', role: 'ClubHead', action: 'Published Event', target: 'Azure AI Bootcamp', ip: '192.168.1.42', timestamp: '12 min ago' },
    { id: '3', user: 'Admin User', role: 'Admin', action: 'Updated System Settings', target: 'JWT Expiration Policy', ip: '192.168.1.1', timestamp: '1 hour ago' },
    { id: '4', user: 'Sports Club Head', role: 'ClubHead', action: 'Approved Join Requests', target: '5 Students', ip: '192.168.1.88', timestamp: '2 hours ago' },
    { id: '5', user: 'Admin User', role: 'Admin', action: 'Exported Attendance Report', target: 'PDF Audit', ip: '192.168.1.1', timestamp: '3 hours ago' },
  ]);

  const columns: Column<AuditLog>[] = [
    {
      key: 'user',
      header: 'Actor',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="font-bold text-[var(--foreground)]">{row.user}</span>
          <Badge variant={row.role === 'Admin' ? 'warning' : 'info'}>{row.role}</Badge>
        </div>
      ),
    },
    {
      key: 'action',
      header: 'Action Performed',
      sortable: true,
      render: (row) => <span className="font-semibold text-violet-600">{row.action}</span>,
    },
    {
      key: 'target',
      header: 'Target Entity',
      render: (row) => <span className="text-xs text-gray-500">{row.target}</span>,
    },
    {
      key: 'ip',
      header: 'IP Address',
      render: (row) => <code className="text-xs text-gray-400 font-mono">{row.ip}</code>,
    },
    {
      key: 'timestamp',
      header: 'Timestamp',
      sortable: true,
      render: (row) => <span className="text-xs text-gray-400">{row.timestamp}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--foreground)]">Activity Logs & Audit Trail</h1>
        <p className="text-xs text-gray-400 mt-0.5">Chronological record of system modifications and administrative actions.</p>
      </div>

      <DataTable
        columns={columns}
        data={logs}
        searchPlaceholder="Filter logs by actor, action, or target..."
        searchKey={(r) => `${r.user} ${r.action} ${r.target}`}
        emptyTitle="No audit logs recorded"
      />
    </div>
  );
}
