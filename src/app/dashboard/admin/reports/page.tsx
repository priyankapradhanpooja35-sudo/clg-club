'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { toast } from '@/components/ui/Toast';
import { FileText, Download, Printer, Filter, Calendar } from 'lucide-react';
import jsPDF from 'jspdf';

export default function AdminReportsPage() {
  const [reportType, setReportType] = useState('engagement');
  const [dateRange, setDateRange] = useState('30days');
  const [generating, setGenerating] = useState(false);

  const reportData = [
    { metric: 'Total Active Members', value: '680 Students', change: '+12% vs last month' },
    { metric: 'Total Events Hosted', value: '48 Events', change: '+8 events this quarter' },
    { metric: 'Check-in Verification Rate', value: '92% Attendance', change: '+4% improvement' },
    { metric: 'Top Performing Club', value: 'Microsoft Club', change: '95 active members' },
  ];

  const exportPDFReport = () => {
    setGenerating(true);
    setTimeout(() => {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      doc.setFillColor(30, 27, 75);
      doc.rect(0, 0, 210, 30, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('BEC CLUB HUB — OFFICIAL ANALYTICS REPORT', 15, 20);

      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Report Type: ${reportType.toUpperCase()} | Generated: ${new Date().toLocaleDateString('en-IN')}`, 15, 40);

      let y = 55;
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('Summary Metrics:', 15, y);
      y += 10;

      reportData.forEach((item) => {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`${item.metric}:`, 15, y);
        doc.setFont('helvetica', 'normal');
        doc.text(`${item.value} (${item.change})`, 75, y);
        y += 8;
      });

      doc.save(`bec-report-${reportType}-${Date.now()}.pdf`);
      setGenerating(false);
      toast('Report exported to PDF', 'success');
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[var(--foreground)]">Reports & Export Center</h1>
          <p className="text-xs text-gray-400 mt-0.5">Generate custom executive reports for college administration and fests.</p>
        </div>
        <Button variant="gradient" size="sm" onClick={exportPDFReport} loading={generating} className="gap-1.5">
          <Download className="w-4 h-4" /> Download PDF Report
        </Button>
      </div>

      {/* Configuration Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="w-4 h-4 text-violet-500" /> Report Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Metric Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2 text-sm focus:border-violet-500 focus:outline-none"
              >
                <option value="engagement">Campus Engagement Leaderboard</option>
                <option value="attendance">Event Check-in Attendance</option>
                <option value="membership">Club Membership Growth</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Time Period</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2 text-sm focus:border-violet-500 focus:outline-none"
              >
                <option value="30days">Last 30 Days</option>
                <option value="quarter">This Academic Quarter</option>
                <option value="year">Full Academic Session 2024</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button variant="secondary" size="md" className="w-full" onClick={() => toast('Preview refreshed', 'info')}>
                Refresh Preview
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Preview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="w-4 h-4 text-violet-500" /> Report Summary Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reportData.map((item, i) => (
              <div key={i} className="p-4 rounded-xl border border-[var(--border)] bg-[var(--muted)]">
                <p className="text-xs text-gray-400 font-medium mb-1">{item.metric}</p>
                <p className="text-xl font-black text-[var(--foreground)]">{item.value}</p>
                <p className="text-xs text-green-500 font-medium mt-1">↑ {item.change}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
