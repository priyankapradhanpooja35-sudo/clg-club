'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import { toast } from '@/components/ui/Toast';
import { QrCode, CheckCircle2, AlertCircle, Camera, Search } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OrganizerScannerPage() {
  const { user } = useAuth();
  const [qrCodeInput, setQrCodeInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [scannedResult, setScannedResult] = useState<any | null>(null);

  const handleCheckIn = async (codeToScan?: string) => {
    const code = codeToScan || qrCodeInput.trim();
    if (!code) {
      toast('Please enter or scan a QR code token', 'error');
      return;
    }

    setLoading(true);
    setScannedResult(null);

    try {
      const res = await fetch('/api/registrations/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrCodeData: code }),
      });

      const data = await res.json();

      if (data.success) {
        setScannedResult(data.data);
        toast('Attendee checked in successfully!', 'success');
        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
        setQrCodeInput('');
      } else {
        toast(data.message || 'Check-in failed', 'error');
      }
    } catch {
      toast('Failed to process check-in', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-black text-[var(--foreground)] flex items-center gap-3">
          <QrCode className="w-8 h-8 text-violet-500" /> Event Check-in Scanner
        </h1>
        <p className="text-gray-500 mt-1">Scan attendee QR ticket tokens to confirm attendance and award points.</p>
      </div>

      {/* Manual Input / Scan Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Camera className="w-5 h-5 text-violet-500" /> Scan or Enter QR Token
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCheckIn();
            }}
            className="flex gap-3"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="e.g. bec-reg-123456..."
                value={qrCodeInput}
                onChange={(e) => setQrCodeInput(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 pl-10 text-sm text-[var(--foreground)] focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              />
            </div>
            <Button type="submit" variant="gradient" loading={loading}>
              Check-in
            </Button>
          </form>

          {/* Quick Demo Scan Shortcuts */}
          <div className="mt-4 pt-4 border-t border-[var(--border)]">
            <p className="text-xs font-semibold text-gray-400 mb-2">Simulate Camera Scan (Demo Shortcut):</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleCheckIn('bec-reg-demo-1')}
                className="text-xs px-3 py-1.5 rounded-lg bg-violet-50 dark:bg-violet-950/30 text-violet-600 hover:bg-violet-100 font-medium"
              >
                Scan Ticket #1 (Priya Patel)
              </button>
              <button
                type="button"
                onClick={() => handleCheckIn('bec-reg-demo-2')}
                className="text-xs px-3 py-1.5 rounded-lg bg-violet-50 dark:bg-violet-950/30 text-violet-600 hover:bg-violet-100 font-medium"
              >
                Scan Ticket #2 (Rahul Sharma)
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scanned Result Confirmation */}
      {scannedResult && (
        <Card className="border-green-500/40 bg-green-500/5">
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-green-500/20 p-3 text-green-500 shrink-0">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-[var(--foreground)]">Check-in Confirmed</h3>
                  <Badge variant="success">Verified</Badge>
                </div>
                <p className="text-sm text-gray-500">
                  Attendee:{' '}
                  <span className="font-bold text-[var(--foreground)]">{scannedResult.userId?.name || 'Student'}</span> (
                  {scannedResult.userId?.email})
                </p>
                <p className="text-xs text-green-600 font-medium mt-1">
                  +10 Engagement Points awarded to student profile.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
