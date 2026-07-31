export const dynamic = 'force-static';

import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Event from '@/models/Event';
import Membership from '@/models/Membership';
import { getTokenFromRequest, verifyToken, successResponse, errorResponse } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const token = getTokenFromRequest(req);
    const payload = token ? verifyToken(token) : null;

    if (!payload) {
      // Fallback for non-logged in users: top upcoming events
      const generalEvents = await Event.find({ isPublished: true, date: { $gte: new Date() } })
        .populate('clubId', 'name slug theme icon')
        .sort({ date: 1 })
        .limit(4)
        .lean();

      return successResponse(
        generalEvents.map((e) => ({
          ...e,
          recommendationReason: 'Popular on BEC Campus',
        }))
      );
    }

    // Get user's joined clubs
    const memberships = await Membership.find({ userId: payload.id, status: 'Approved' }).select('clubId').lean();
    const clubIds = memberships.map((m) => m.clubId);

    if (clubIds.length === 0) {
      const featured = await Event.find({ isPublished: true, date: { $gte: new Date() } })
        .populate('clubId', 'name slug theme icon')
        .sort({ date: 1 })
        .limit(4)
        .lean();

      return successResponse(
        featured.map((e) => ({
          ...e,
          recommendationReason: 'Featured campus workshop',
        }))
      );
    }

    // Recommend events from user's clubs first
    const clubEvents = await Event.find({ isPublished: true, clubId: { $in: clubIds }, date: { $gte: new Date() } })
      .populate('clubId', 'name slug theme icon')
      .sort({ date: 1 })
      .limit(3)
      .lean();

    const clubEventIds = clubEvents.map((e) => e._id.toString());

    // Fill with general upcoming events if needed
    const otherEvents = await Event.find({
      isPublished: true,
      _id: { $nin: clubEventIds },
      date: { $gte: new Date() },
    })
      .populate('clubId', 'name slug theme icon')
      .sort({ date: 1 })
      .limit(4 - clubEvents.length)
      .lean();

    const recommended = [
      ...clubEvents.map((e: any) => ({
        ...e,
        recommendationReason: `Because you joined ${e.clubId?.name || 'this club'}`,
      })),
      ...otherEvents.map((e: any) => ({
        ...e,
        recommendationReason: 'Trending among BEC students',
      })),
    ];

    return successResponse(recommended);
  } catch (err) {
    console.error('Recommended events API error:', err);
    return errorResponse('Internal server error', 500);
  }
}
