'use client';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { toast } from '@/components/ui/Toast';
import { QrCode, Download, Ticket } from 'lucide-react';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import Navbar from '@/components/Navbar';

interface Registration {
  _id: string;
  qrCodeData: string;
  checkedIn: boolean;
  eventId: { _id: string; title: string; date: string; venue: string };
}

function QRTicketCard({ reg }: { reg: Registration }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrReady, setQrReady] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, reg.qrCodeData, { width: 160, margin: 1, color: { dark: '#1E1B4B', light: '#ffffff' } })
        .then(() => setQrReady(true))
        .catch(console.error);
    }
  }, [reg.qrCodeData]);

  const downloadQR = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket-${reg.eventId?.title?.replace(/\s+/g, '-')}.png`;
    a.click();
  };

  const downloadCertificate = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();

    // Background
    doc.setFillColor(30, 27, 75);
    doc.rect(0, 0, w, h, 'F');

    // Border
    doc.setDrawColor(124, 58, 237);
    doc.setLineWidth(3);
    doc.rect(10, 10, w - 20, h - 20);

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('CERTIFICATE OF PARTICIPATION', w / 2, 50, { align: 'center' });

    // BEC Logo text
    doc.setFontSize(12);
    doc.setTextColor(167, 139, 250);
    doc.text('BEC Club Hub — Bhubaneswar Engineering College', w / 2, 62, { align: 'center' });

    // Body
    doc.setFontSize(14);
    doc.setTextColor(200, 200, 220);
    doc.text('This certifies that the participant successfully attended', w / 2, 90, { align: 'center' });

    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bolditalic');
    doc.text(`"${reg.eventId?.title || 'Event'}"`, w / 2, 110, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(200, 200, 220);
    doc.text(`Held on: ${reg.eventId?.date ? new Date(reg.eventId.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'TBD'}`, w / 2, 125, { align: 'center' });
    doc.text(`Venue: ${reg.eventId?.venue || 'BEC Campus'}`, w / 2, 133, { align: 'center' });

    // Signature line
    doc.setDrawColor(124, 58, 237);
    doc.setLineWidth(0.5);
    doc.line(60, 160, 130, 160);
    doc.line(w - 130, 160, w - 60, 160);
    doc.setFontSize(10);
    doc.setTextColor(167, 139, 250);
    doc.text('Club Coordinator', 95, 166, { align: 'center' });
    doc.text('Principal, BEC', w - 95, 166, { align: 'center' });

    // QR code on certificate
    if (canvasRef.current) {
      const qrData = canvasRef.current.toDataURL('image/png');
      doc.addImage(qrData, 'PNG', w / 2 - 15, 145, 30, 30);
    }

    doc.save(`certificate-${reg.eventId?.title?.replace(/\s+/g, '-') || 'event'}.pdf`);
    toast('Certificate downloaded!', 'success');
  };

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-br from-indigo-900 to-violet-900 p-5 flex flex-col items-center">
        <canvas ref={canvasRef} className="rounded-xl" />
        {!qrReady && <div className="w-40 h-40 bg-white/10 animate-pulse rounded-xl" />}
      </div>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-sm text-[var(--foreground)] line-clamp-2 flex-1 pr-2">{reg.eventId?.title}</h3>
          <Badge variant={reg.checkedIn ? 'success' : 'default'}>{reg.checkedIn ? '✓ Attended' : 'Upcoming'}</Badge>
        </div>
        <p className="text-xs text-gray-500 mb-1">
          📅 {reg.eventId?.date ? new Date(reg.eventId.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'TBD'}
        </p>
        <p className="text-xs text-gray-500 mb-4">📍 {reg.eventId?.venue}</p>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={downloadQR} className="flex-1 gap-1.5">
            <QrCode className="w-3.5 h-3.5" /> QR
          </Button>
          {reg.checkedIn && (
            <Button variant="gradient" size="sm" onClick={downloadCertificate} className="flex-1 gap-1.5">
              <Download className="w-3.5 h-3.5" /> Certificate
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function TicketsPage() {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/registrations')
      .then(r => r.json())
      .then(d => { setRegistrations(d.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[var(--background)] py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-[var(--foreground)] flex items-center gap-3">
              <Ticket className="w-8 h-8 text-violet-500" /> My QR Tickets
            </h1>
            <p className="text-gray-500 mt-1">
              Show your QR code at the venue for check-in.
              {registrations.filter(r => r.checkedIn).length > 0 && ' Download certificates for events you attended.'}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <CardSkeleton key={i} />)}
            </div>
          ) : registrations.length === 0 ? (
            <EmptyState icon={Ticket} title="No tickets yet" description="Register for events to get your QR tickets here." />
          ) : (
            <>
              <div className="flex gap-4 mb-6 text-sm">
                <span className="px-3 py-1.5 rounded-lg bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-medium">
                  {registrations.length} total
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-medium">
                  {registrations.filter(r => r.checkedIn).length} attended
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {registrations.map(reg => <QRTicketCard key={reg._id} reg={reg} />)}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
