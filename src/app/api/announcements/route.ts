export const dynamic = 'force-static';

import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Announcement from '@/models/Announcement';
import { getTokenFromRequest, verifyToken, successResponse, errorResponse } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const clubId = req.nextUrl.searchParams.get('clubId');
    const query: Record<string, unknown> = clubId ? { $or: [{ clubId }, { clubId: null }] } : { clubId: null };
    const announcements = await Announcement.find(query).sort({ createdAt: -1 }).lean();
    return successResponse(announcements);
  } catch (err) {
    return errorResponse('Internal server error', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    const payload = token ? verifyToken(token) : null;
    if (!payload || !['Admin', 'ClubHead', 'Faculty'].includes(payload.role)) {
      return errorResponse('Forbidden', 403);
    }
    await dbConnect();
    const body = await req.json();
    const { title, content, priority, clubId } = body;
    if (!title || !content) return errorResponse('title and content are required');
    const ann = await Announcement.create({ title, content, priority: priority || 'General', clubId });
    return successResponse(ann, 'Announcement created', 201);
  } catch (err) {
    return errorResponse('Internal server error', 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    const payload = token ? verifyToken(token) : null;
    if (!payload || !['Admin', 'ClubHead'].includes(payload.role)) return errorResponse('Forbidden', 403);
    await dbConnect();
    const { id } = await req.json();
    await Announcement.findByIdAndDelete(id);
    return successResponse(null, 'Announcement deleted');
  } catch (err) {
    return errorResponse('Internal server error', 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    const payload = token ? verifyToken(token) : null;
    if (!payload || !['Admin', 'ClubHead', 'Faculty'].includes(payload.role)) {
      return errorResponse('Forbidden', 403);
    }
    await dbConnect();
    const body = await req.json();
    const { id, title, content, priority } = body;
    if (!id || !title || !content) return errorResponse('id, title, and content are required');
    const ann = await Announcement.findByIdAndUpdate(
      id,
      { title, content, priority: priority || 'General' },
      { new: true }
    );
    if (!ann) return errorResponse('Announcement not found', 404);
    return successResponse(ann, 'Announcement updated', 200);
  } catch (err) {
    return errorResponse('Internal server error', 500);
  }
}
