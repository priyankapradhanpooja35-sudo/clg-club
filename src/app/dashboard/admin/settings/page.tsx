'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { toast } from '@/components/ui/Toast';
import { Settings, ShieldAlert, Save, RefreshCw, Key, Bell } from 'lucide-react';

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [resetModal, setResetModal] = useState(false);

  const [form, setForm] = useState({
    siteName: 'BEC Club Hub',
    academicSession: '2024–2025',
    maxEventsPerClub: '20',
    jwtExpiration: '7 days',
    emailNotifications: true,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast('Platform settings updated successfully', 'success');
    }, 600);
  };

  const handleResetData = () => {
    setResetModal(false);
    toast('System data reset triggered', 'warning');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-[var(--foreground)]">System Settings</h1>
        <p className="text-xs text-gray-400 mt-0.5">Configure global platform parameters, security, and policies.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="w-4 h-4 text-violet-500" /> Platform Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Platform Title</label>
                <input
                  type="text"
                  value={form.siteName}
                  onChange={(e) => setForm((p) => ({ ...p, siteName: e.target.value }))}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2 text-sm focus:border-violet-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Academic Session</label>
                <input
                  type="text"
                  value={form.academicSession}
                  onChange={(e) => setForm((p) => ({ ...p, academicSession: e.target.value }))}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2 text-sm focus:border-violet-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">JWT Session Expiration</label>
                <input
                  type="text"
                  value={form.jwtExpiration}
                  onChange={(e) => setForm((p) => ({ ...p, jwtExpiration: e.target.value }))}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2 text-sm focus:border-violet-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Max Events per Month per Club</label>
                <input
                  type="number"
                  value={form.maxEventsPerClub}
                  onChange={(e) => setForm((p) => ({ ...p, maxEventsPerClub: e.target.value }))}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2 text-sm focus:border-violet-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="emailNotifs"
                checked={form.emailNotifications}
                onChange={(e) => setForm((p) => ({ ...p, emailNotifications: e.target.checked }))}
                className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
              />
              <label htmlFor="emailNotifs" className="text-xs font-semibold text-[var(--foreground)]">
                Enable automated system email notifications for new event registrations
              </label>
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" variant="gradient" size="sm" loading={saving} className="gap-1.5">
                <Save className="w-4 h-4" /> Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Danger Zone */}
      <Card className="border-red-500/30 bg-red-500/5">
        <CardHeader>
          <CardTitle className="text-base text-red-600 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-600" /> Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-sm font-bold text-[var(--foreground)]">Re-seed Database</p>
              <p className="text-xs text-gray-400">Restores all 8 clubs, demo students, and sample events.</p>
            </div>
            <Button variant="danger" size="sm" onClick={() => setResetModal(true)}>
              Reset System Data
            </Button>
          </div>
        </CardContent>
      </Card>

      <ConfirmModal
        open={resetModal}
        onClose={() => setResetModal(false)}
        onConfirm={handleResetData}
        title="Reset System Data?"
        description="This will erase non-seed data and re-initialize sample clubs and student accounts."
        confirmText="Confirm Reset"
      />
    </div>
  );
}
