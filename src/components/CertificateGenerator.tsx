'use client';

import React, { useRef, useState } from 'react';
import { Download, Award, Check, Sparkles, Shield, Code2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { HackathonParticipant } from '@/lib/hackathons-data';

export interface CertificateGeneratorProps {
  participant: HackathonParticipant;
  hackathonTitle: string;
  date?: string;
}

export default function CertificateGenerator({
  participant,
  hackathonTitle,
  date = 'July 31, 2026',
}: CertificateGeneratorProps) {
  const certRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const rankText =
    participant.rank === 1
      ? '1st Place Winner (Gold Champion)'
      : participant.rank === 2
      ? '2nd Place Winner (Silver Runner-Up)'
      : participant.rank === 3
      ? '3rd Place Winner (Bronze Runner-Up)'
      : 'Honorable Participant';

  // Export PDF / PNG Certificate
  const handleDownloadCertificate = async () => {
    if (!certRef.current) return;
    setIsGenerating(true);

    try {
      const element = certRef.current;
      element.style.display = 'flex';

      const canvas = await (html2canvas as any)(element, {
        width: 1920,
        height: 1080,
        scale: 1,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#0F0728',
        logging: false,
      });

      element.style.display = 'none';

      // 1. Save PNG
      const imgData = canvas.toDataURL('image/png');

      // 2. Generate PDF via jsPDF landscape A4
      const pdf = new jsPDF('landscape', 'px', [1920, 1080]);
      pdf.addImage(imgData, 'PNG', 0, 0, 1920, 1080);
      pdf.save(`BEC_Certificate_${participant.name.replace(/\s+/g, '_')}.pdf`);

      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch (err) {
      console.error('Error generating certificate:', err);
    } finally {
      if (certRef.current) {
        certRef.current.style.display = 'none';
      }
      setIsGenerating(false);
    }
  };

  return (
    <div>
      {/* Download Certificate Trigger Button */}
      <button
        onClick={handleDownloadCertificate}
        disabled={isGenerating}
        className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all duration-200 flex items-center gap-2 shadow-lg shadow-amber-500/30 hover:shadow-amber-400/50 active:scale-95 cursor-pointer disabled:opacity-50"
      >
        {isGenerating ? (
          <>
            <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
            <span>Generating Certificate PDF...</span>
          </>
        ) : downloaded ? (
          <>
            <Check className="w-4 h-4 text-emerald-950" />
            <span>Downloaded Certificate!</span>
          </>
        ) : (
          <>
            <Award className="w-4 h-4 text-slate-950" />
            <span>Download My Certificate (PDF & PNG)</span>
          </>
        )}
      </button>

      {/* ─── Hidden High-Resolution Certificate Template (1920x1080 Landscape) ─── */}
      <div
        ref={certRef}
        style={{ display: 'none', width: '1920px', height: '1080px' }}
        className="fixed top-0 left-0 bg-[#0F0728] text-white flex-col items-center justify-between p-20 border-[16px] border-amber-400/80 overflow-hidden z-[-9999] pointer-events-none"
      >
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-[#0F0728] to-indigo-950 -z-10" />
        <div className="absolute -top-40 -left-40 w-[40rem] h-[40rem] bg-amber-500/10 rounded-full blur-[160px]" />
        <div className="absolute -bottom-40 -right-40 w-[40rem] h-[40rem] bg-purple-600/20 rounded-full blur-[160px]" />

        {/* Certificate Header */}
        <div className="w-full flex items-center justify-between z-10">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center shadow-xl shadow-amber-500/40">
              <Code2 className="w-12 h-12" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-black tracking-tight text-white">BHUBANESWAR ENGINEERING COLLEGE</h1>
              <p className="text-xl text-purple-300 font-bold uppercase tracking-widest">BEC Club Hub • Official Certificate</p>
            </div>
          </div>

          <div className="px-8 py-4 rounded-2xl bg-amber-400/20 border-2 border-amber-400/50 text-2xl font-black text-amber-300 flex items-center gap-3">
            <Sparkles className="w-7 h-7 text-amber-400" /> OFFICIAL CREDENTIAL
          </div>
        </div>

        {/* Certificate Body */}
        <div className="flex flex-col items-center text-center my-auto z-10 w-full max-w-5xl">
          <h2 className="text-3xl font-serif tracking-widest text-amber-300 uppercase mb-4">
            CERTIFICATE OF ACHIEVEMENT
          </h2>
          <p className="text-2xl text-purple-200 font-medium mb-8">This is proudly presented to</p>

          <h3 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-white tracking-tight mb-6 drop-shadow-2xl">
            {participant.name}
          </h3>

          <p className="text-2xl text-purple-200 max-w-3xl leading-relaxed font-medium mb-8">
            for outstanding performance as a member of <strong className="text-amber-300">{participant.teamName}</strong> in the flagship campus hackathon
          </p>

          <div className="px-10 py-4 rounded-3xl bg-purple-950/80 border-2 border-purple-500/40 text-4xl font-black text-white mb-8 shadow-2xl">
            {hackathonTitle}
          </div>

          <div className="inline-flex items-center gap-3 px-8 py-3 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-2xl uppercase tracking-widest shadow-xl">
            <Award className="w-8 h-8" />
            <span>{rankText}</span>
          </div>
        </div>

        {/* Certificate Footer */}
        <div className="w-full pt-10 border-t border-purple-500/30 flex items-center justify-between text-purple-300 text-2xl font-semibold z-10">
          <div className="text-left">
            <p className="text-amber-300 font-bold">Issued on: {date}</p>
            <p className="text-sm text-purple-400 font-mono">Credential ID: BEC-HK-{participant.userId.toUpperCase()}-2026</p>
          </div>

          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="w-48 border-b-2 border-amber-400/80 mb-2"></div>
              <p className="text-sm font-bold text-white uppercase">Faculty Coordinator</p>
            </div>
            <div className="text-center">
              <div className="w-48 border-b-2 border-amber-400/80 mb-2"></div>
              <p className="text-sm font-bold text-white uppercase">President, BEC Club Hub</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
