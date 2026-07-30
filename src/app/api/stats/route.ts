import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Club from '@/models/Club';
import Event from '@/models/Event';
import Membership from '@/models/Membership';
import Registration from '@/models/Registration';
import { successResponse, errorResponse } from '@/lib/auth';

// GET /api/stats — public stats for landing page
export async function GET(_req: NextRequest) {
  try {
    await dbConnect();
    const [totalClubs, totalUsers, totalEvents, totalRegistrations] = await Promise.all([
      Club.countDocuments(),
      User.countDocuments({ role: { $ne: 'Admin' } }),
      Event.countDocuments({ isPublished: true }),
      Registration.countDocuments({ checkedIn: true }),
    ]);

    return successResponse({ totalClubs, totalMembers: totalUsers, totalEvents, totalAttendees: totalRegistrations });
  } catch (err) {
    console.error('Stats error:', err);
    return errorResponse('Internal server error', 500);
  }
}
