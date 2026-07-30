'use client';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { CardSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { Megaphone, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/announcements')
      .then(r => r.json())
      .then(d => { setAnnouncements(d.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[var(--background)] py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 dark:bg-violet-900/30 px-4 py-1.5 text-sm font-semibold text-violet-700 dark:text-violet-300 mb-4">
              <Megaphone className="w-3.5 h-3.5" /> Notice Board
            </span>
            <h1 className="text-3xl font-black text-[var(--foreground)]">Announcements</h1>
            <p className="text-gray-500 mt-1">Important updates and notices from all clubs and administration.</p>
          </div>

          {loading ? (
            <div className="space-y-4">{[1,2,3].map(i => <CardSkeleton key={i} />)}</div>
          ) : announcements.length === 0 ? (
            <EmptyState icon={Megaphone} title="No announcements" description="Check back later for updates from your clubs." />
          ) : (
            <div className="space-y-4">
              {announcements.map((ann, i) => (
                <motion.div
                  key={ann._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className={ann.priority === 'Urgent' ? 'border-red-300 dark:border-red-900' : ''}>
                    <CardContent className="pt-5">
                      <div className="flex items-start gap-3">
                        <div className={`rounded-xl p-2.5 shrink-0 ${ann.priority === 'Urgent' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-violet-100 dark:bg-violet-900/30'}`}>
                          {ann.priority === 'Urgent'
                            ? <AlertTriangle className="w-5 h-5 text-red-600" />
                            : <Megaphone className="w-5 h-5 text-violet-600" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
                            <h3 className="font-bold text-[var(--foreground)]">{ann.title}</h3>
                            <Badge variant={ann.priority === 'Urgent' ? 'urgent' : 'default'}>{ann.priority}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{ann.content}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(ann.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
