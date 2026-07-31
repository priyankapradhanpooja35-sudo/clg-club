export const dynamic = 'force-static';

import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Membership from '@/models/Membership';
import Registration from '@/models/Registration';
import { successResponse, errorResponse } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const clubId = req.nextUrl.searchParams.get('clubId');

    let userQuery: Record<string, unknown> = { role: { $in: ['Student', 'ClubHead'] } };

    if (clubId) {
      const memberships = await Membership.find({ clubId, status: 'Approved' }).select('userId').lean();
      const userIds = memberships.map((m) => m.userId);
      userQuery = { _id: { $in: userIds } };
    }

    const topUsers = await User.find(userQuery)
      .select('name email engagementScore role clubId')
      .sort({ engagementScore: -1 })
      .limit(10)
      .lean();

    // Compute badges dynamically for top users
    const userIds = topUsers.map((u) => u._id);
    const [allMemberships, allRegistrations] = await Promise.all([
      Membership.find({ userId: { $in: userIds }, status: 'Approved' }).lean(),
      Registration.find({ userId: { $in: userIds }, checkedIn: true }).lean(),
    ]);

    const enrichedUsers = topUsers.map((u) => {
      const userClubCount = allMemberships.filter((m) => m.userId.toString() === u._id.toString()).length;
      const userAttendedCount = allRegistrations.filter((r) => r.userId.toString() === u._id.toString()).length;

      const badges: Array<{ id: string; name: string; icon: string; description: string; color: string }> = [];

      if (userAttendedCount >= 1) {
        badges.push({ id: 'first-event', name: 'First Event', icon: '🎫', description: 'Attended 1st event', color: 'bg-blue-100 text-blue-800' });
      }
      if (userClubCount >= 3) {
        badges.push({ id: 'club-explorer', name: 'Club Explorer', icon: '🧭', description: 'Joined 3+ clubs', color: 'bg-purple-100 text-purple-800' });
      }
      if (userAttendedCount >= 3) {
        badges.push({ id: 'event-enthusiast', name: 'Event Enthusiast', icon: '🔥', description: 'Attended 3+ events', color: 'bg-amber-100 text-amber-800' });
      }
      if (u.engagementScore >= 100) {
        badges.push({ id: 'top-contributor', name: 'Top Contributor', icon: '👑', description: '100+ Engagement score', color: 'bg-emerald-100 text-emerald-800' });
      }

      return {
        ...u,
        clubsJoined: userClubCount,
        eventsAttended: userAttendedCount,
        badges,
      };
    });

    return successResponse(enrichedUsers);
  } catch (err) {
    console.error('Leaderboard API error:', err);
    return errorResponse('Internal server error', 500);
  }
}
