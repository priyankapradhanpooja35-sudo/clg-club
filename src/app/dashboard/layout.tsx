'use client';
import { useAuth } from '@/lib/AuthContext';
import Sidebar from '@/components/Sidebar';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Loading your dashboard...</p>
      </div>
    </div>
  );

  if (!user) return null;

  const roleKey = user.role === 'Admin' ? 'admin' : user.role === 'ClubHead' ? 'club-head' : 'student';

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar role={roleKey} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
