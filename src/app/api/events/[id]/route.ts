export const dynamic = 'force-static';

export function generateStaticParams() {
  return [{ id: '1' }];
}

import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Event from '@/models/Event';
import Club from '@/models/Club';
import { getTokenFromRequest, verifyToken, successResponse, errorResponse } from '@/lib/auth';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const event = await Event.findById(id).populate('clubId', 'name slug theme icon').lean();
    if (!event) return errorResponse('Event not found', 404);
    return successResponse(event);
  } catch (err) {
    console.error('GET event error:', err);
    return errorResponse('Internal server error', 500);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = getTokenFromRequest(req);
    const payload = token ? verifyToken(token) : null;
    if (!payload || !['Admin', 'ClubHead'].includes(payload.role)) {
      return errorResponse('Forbidden', 403);
    }
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const event = await Event.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!event) return errorResponse('Event not found', 404);
    return successResponse(event, 'Event updated');
  } catch (err) {
    console.error('PUT event error:', err);
    return errorResponse('Internal server error', 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = getTokenFromRequest(req);
    const payload = token ? verifyToken(token) : null;
    if (!payload || !['Admin', 'ClubHead'].includes(payload.role)) {
      return errorResponse('Forbidden', 403);
    }
    await dbConnect();
    const { id } = await params;
    await Event.findByIdAndDelete(id);
    return successResponse(null, 'Event deleted');
  } catch (err) {
    console.error('DELETE event error:', err);
    return errorResponse('Internal server error', 500);
  }
}
