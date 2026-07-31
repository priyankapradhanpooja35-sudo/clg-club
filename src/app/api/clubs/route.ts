export const dynamic = 'force-static';

import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Club from '@/models/Club';
import { getTokenFromRequest, verifyToken, successResponse, errorResponse } from '@/lib/auth';
import User from '@/models/User';

// GET /api/clubs — list all clubs
export async function GET(_req: NextRequest) {
  try {
    await dbConnect();
    const clubs = await Club.find().populate('headId', 'name email').lean();
    return successResponse(clubs);
  } catch (err) {
    console.error('GET clubs error:', err);
    return errorResponse('Internal server error', 500);
  }
}

// POST /api/clubs — create a club (Admin only)
export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    const payload = token ? verifyToken(token) : null;
    if (!payload || payload.role !== 'Admin') {
      return errorResponse('Forbidden', 403);
    }

    await dbConnect();
    const body = await req.json();
    const { name, slug, description, mission, department, theme, icon, headId } = body;

    if (!name || !slug || !description) {
      return errorResponse('name, slug, and description are required');
    }

    const existing = await Club.findOne({ slug });
    if (existing) return errorResponse('Slug already in use', 409);

    const club = await Club.create({ name, slug, description, mission, department, theme, icon, headId });

    // If a headId is given, update that user's role and clubId
    if (headId) {
      await User.findByIdAndUpdate(headId, { role: 'ClubHead', clubId: club._id });
    }

    return successResponse(club, 'Club created successfully', 201);
  } catch (err) {
    console.error('POST clubs error:', err);
    return errorResponse('Internal server error', 500);
  }
}
