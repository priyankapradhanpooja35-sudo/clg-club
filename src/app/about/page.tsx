'use client';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Sparkles, Users, Calendar, Trophy, QrCode, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AboutPage() {
  const steps = [
    {
      icon: Users,
      title: '1. Discover & Join Clubs',
      description: 'Browse all 8 official campus clubs, check their missions, department heads, and send one-click join requests.',
    },
    {
      icon: Calendar,
      title: '2. Register for Events',
      description: 'Explore upcoming workshops, fests, and hackathons. Lock in your spot instantly and get a personalized QR ticket.',
    },
    {
      icon: QrCode,
      title: '3. QR Scan Check-in',
      description: 'Present your unique QR ticket at the venue. Organizers scan with camera to confirm your attendance live.',
    },
    {
      icon: Trophy,
      title: '4. Level Up & Get Certified',
      description: 'Earn engagement points, unlock achievement badges on the leaderboard, and download auto-generated PDF certificates.',
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[var(--background)]">
        {/* Hero */}
        <div className="bg-gradient-to-br from-[#1E1B4B] via-[#4C1D95] to-[#1E293B] py-20 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-white/80 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" /> Platform Overview
            </span>
            <h1 className="text-4xl sm:text-6xl font-black text-white mb-6 tracking-tight">
              About <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">BEC Club Hub</span>
            </h1>
            <p className="text-white/70 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              Designed & built for Bhubaneswar Engineering College. The modern SaaS platform unifying campus engagement, event logistics, and student achievement tracking.
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-[var(--foreground)]">How BEC Club Hub Works</h2>
            <p className="text-gray-500 mt-2">Seamless end-to-end workflow for students, club heads, and faculty.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card hover className="h-full">
                    <CardContent className="pt-6">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600/10 text-violet-600 mb-4">
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-[var(--foreground)] text-base mb-2">{step.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Tech Stack Banner */}
          <div className="mt-16 rounded-3xl bg-gradient-to-br from-indigo-900 to-violet-900 p-8 sm:p-12 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black mb-2">Built with Modern Tech Stack</h3>
                <p className="text-white/70 max-w-xl text-sm leading-relaxed">
                  Next.js 16, React 19, Tailwind CSS v4, MongoDB, JWT Security, Recharts analytics, qrcode, and jsPDF certificate generation.
                </p>
              </div>
              <Link href="/signup">
                <Button variant="gradient" size="lg" className="shrink-0 gap-2">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
