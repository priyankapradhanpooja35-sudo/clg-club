'use client';

import React from 'react';
import CoderOfDayCard from './CoderOfDayCard';
import { DailyCoder } from '@/lib/hackathons-data';

export interface CoderOfDayDetailProps {
  coder: DailyCoder;
}

export default function CoderOfDayDetail({ coder }: CoderOfDayDetailProps) {
  return (
    <div className="w-full flex justify-center">
      <CoderOfDayCard
        coder={{
          name: coder.name,
          department: coder.department,
          year: coder.year,
          date: coder.date,
          photoUrl: coder.photoUrl,
          challengeName: coder.problemName,
          finishTimeSeconds: coder.finishTimeSeconds,
          streakCount: coder.streakCount,
          pointsEarned: coder.pointsEarned,
        }}
      />
    </div>
  );
}
