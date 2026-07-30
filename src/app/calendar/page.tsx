'use client';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { CLUBS_DATA } from '@/lib/clubs-data';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, MapPin, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CalendarPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  useEffect(() => {
    fetch('/api/events')
      .then((r) => r.json())
      .then((d) => {
        setEvents(d.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getClubData = (slug: string) => CLUBS_DATA.find((c) => c.slug === slug);

  // Month navigation
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[var(--background)] py-10 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-black text-[var(--foreground)] flex items-center gap-3">
                <CalendarIcon className="w-8 h-8 text-violet-500" /> Event Calendar
              </h1>
              <p className="text-gray-500 mt-1">Interactive campus event timetable color-coded by club.</p>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="secondary" size="sm" onClick={prevMonth}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-lg font-bold text-[var(--foreground)] min-w-36 text-center">
                {monthNames[month]} {year}
              </span>
              <Button variant="secondary" size="sm" onClick={nextMonth}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {loading ? (
            <CardSkeleton />
          ) : (
            <Card className="p-0 overflow-hidden">
              {/* Day headers */}
              <div className="grid grid-cols-7 border-b border-[var(--border)] bg-[var(--muted)] text-center text-xs font-bold text-gray-500 py-3">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                  <div key={d}>{d}</div>
                ))}
              </div>

              {/* Grid */}
              <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-[var(--border)] min-h-[500px]">
                {/* Empty cells before month start */}
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="bg-[var(--muted)]/30 min-h-24 p-2" />
                ))}

                {/* Days of month */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const dayEvents = events.filter((e) => {
                    const ed = new Date(e.date);
                    return ed.getFullYear() === year && ed.getMonth() === month && ed.getDate() === dayNum;
                  });

                  return (
                    <div key={dayNum} className="min-h-24 p-2 bg-[var(--card)] hover:bg-[var(--muted)]/50 transition-colors flex flex-col">
                      <span className="text-xs font-bold text-gray-400 mb-1">{dayNum}</span>
                      <div className="space-y-1 overflow-y-auto flex-1 max-h-20">
                        {dayEvents.map((ev) => {
                          const club = getClubData(ev.clubId?.slug);
                          return (
                            <button
                              key={ev._id}
                              onClick={() => setSelectedEvent(ev)}
                              className="w-full text-left rounded-lg p-1.5 text-xs text-white font-medium truncate shadow-sm transition-transform hover:scale-[1.02]"
                              style={{ backgroundColor: club?.accentColor || '#7C3AED' }}
                            >
                              {ev.title}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Event Preview Modal */}
          <Modal
            open={!!selectedEvent}
            onClose={() => setSelectedEvent(null)}
            title={selectedEvent?.title || 'Event Details'}
          >
            {selectedEvent && (
              <div className="space-y-4">
                <Badge variant="default">{selectedEvent.clubId?.name || 'BEC Club'}</Badge>
                <p className="text-sm text-gray-500 leading-relaxed">{selectedEvent.description}</p>
                <div className="space-y-2 text-xs text-gray-400 pt-2 border-t border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-violet-500" />
                    <span>{new Date(selectedEvent.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-violet-500" />
                    <span>{selectedEvent.venue}</span>
                  </div>
                </div>
                <div className="pt-2">
                  <Link href="/events">
                    <Button variant="gradient" className="w-full">
                      View All Events <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </Modal>
        </div>
      </div>
    </>
  );
}
