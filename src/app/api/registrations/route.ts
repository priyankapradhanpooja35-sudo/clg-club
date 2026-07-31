export const dynamic = 'force-static';

import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Registration from '@/models/Registration';
import { getTokenFromRequest, verifyToken, successResponse, errorResponse } from '@/lib/auth';
import { randomUUID } from 'crypto';

// GET /api/registrations?eventId= — list registrations
export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    const payload = token ? verifyToken(token) : null;
    if (!payload) return errorResponse('Unauthorized', 401);

    await dbConnect();
    const eventId = req.nextUrl.searchParams.get('eventId');
    const userId = req.nextUrl.searchParams.get('userId');

    const query: Record<string, unknown> = {};
    if (eventId) query.eventId = eventId;
    if (userId) query.userId = userId;
    if (!eventId && !userId) query.userId = payload.id; // default: current user's registrations

    const registrations = await Registration.find(query)
      .populate('eventId', 'title date venue clubId')
      .populate('userId', 'name email')
      .lean();

    return successResponse(registrations);
  } catch (err) {
    console.error('GET registrations error:', err);
    return errorResponse('Internal server error', 500);
  }
}

// POST /api/registrations — register for an event, generates QR token
export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    const payload = token ? verifyToken(token) : null;
    if (!payload) return errorResponse('Unauthorized', 401);

    await dbConnect();
    const body = await req.json();
    const { eventId } = body;
    if (!eventId) return errorResponse('eventId is required');

    const Event = (await import('@/models/Event')).default;
    const event = await Event.findById(eventId);
    if (!event) return errorResponse('Event not found', 404);

    const existing = await Registration.findOne({ eventId, userId: payload.id });
    if (existing) return errorResponse('Already registered for this event', 409);

    const currentRegCount = await Registration.countDocuments({ eventId });
    if (event.capacity && currentRegCount >= event.capacity) {
      return errorResponse('Event is full (capacity reached)', 400);
    }

    const qrCodeData = `bec-reg-${randomUUID()}`;
    const registration = await Registration.create({
      eventId,
      userId: payload.id,
      qrCodeData,
    });

    return successResponse(registration, 'Registered successfully', 201);
  } catch (err) {
    console.error('POST registration error:', err);
    return errorResponse('Internal server error', 500);
  }
}
