export const dynamic = 'force-static';

import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Event from '@/models/Event';
import Club from '@/models/Club';
import { getTokenFromRequest, verifyToken, successResponse, errorResponse } from '@/lib/auth';

// GET /api/events — list events (with optional ?clubId= and ?upcoming=true filters)
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const clubId = req.nextUrl.searchParams.get('clubId');
    const upcoming = req.nextUrl.searchParams.get('upcoming');

    const query: Record<string, unknown> = { isPublished: true };
    if (clubId) query.clubId = clubId;
    if (upcoming === 'true') query.date = { $gte: new Date() };

    const events = await Event.find(query)
      .populate('clubId', 'name slug theme icon')
      .sort({ date: 1 })
      .lean();

    return successResponse(events);
  } catch (err) {
    console.error('GET events error:', err);
    return errorResponse('Internal server error', 500);
  }
}

// POST /api/events — create event (ClubHead / Admin)
export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    const payload = token ? verifyToken(token) : null;
    if (!payload || !['Admin', 'ClubHead'].includes(payload.role)) {
      return errorResponse('Forbidden', 403);
    }

    await dbConnect();
    const body = await req.json();
    const { title, description, clubId, date, venue, banner } = body;

    if (!title || !description || !clubId || !date || !venue) {
      return errorResponse('title, description, clubId, date, and venue are required');
    }

    const event = await Event.create({
      title,
      description,
      clubId,
      date: new Date(date),
      venue,
      banner,
      isPublished: payload.role === 'Admin', // Admin auto-publishes
    });

    return successResponse(event, 'Event created', 201);
  } catch (err) {
    console.error('POST events error:', err);
    return errorResponse('Internal server error', 500);
  }
}
