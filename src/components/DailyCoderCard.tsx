'use client';

import React from 'react';
import CoderOfDayCard from './CoderOfDayCard';

export interface DailyCoderProps {
  initialName?: string;
  initialPhotoUrl?: string;
  initialSubtitle?: string;
}

export default function DailyCoderCard({
  initialName = 'Priyanka Pradhan',
  initialPhotoUrl = '/images/priyanka-coder-of-day.jpeg',
}: DailyCoderProps) {
  return (
    <div className="w-full flex justify-center py-4">
      <CoderOfDayCard
        coder={{
          name: initialName,
          photoUrl: initialPhotoUrl,
          department: 'Computer Science & Engg',
          year: '3rd Year',
          date: 'July 31, 2026',
          challengeName: 'Daily coding challenge',
          finishTimeSeconds: 760,
          streakCount: 14,
          pointsEarned: 250,
        }}
      />
    </div>
  );
}
