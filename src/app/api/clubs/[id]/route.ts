import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Club from '@/models/Club';
import { getTokenFromRequest, verifyToken, successResponse, errorResponse } from '@/lib/auth';

// GET /api/clubs/[id]
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const club = await Club.findById(id).populate('headId', 'name email').lean();
    if (!club) return errorResponse('Club not found', 404);
    return successResponse(club);
  } catch (err) {
    console.error('GET club error:', err);
    return errorResponse('Internal server error', 500);
  }
}

// PUT /api/clubs/[id]
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
    const club = await Club.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!club) return errorResponse('Club not found', 404);
    return successResponse(club, 'Club updated');
  } catch (err) {
    console.error('PUT club error:', err);
    return errorResponse('Internal server error', 500);
  }
}

// DELETE /api/clubs/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = getTokenFromRequest(req);
    const payload = token ? verifyToken(token) : null;
    if (!payload || payload.role !== 'Admin') return errorResponse('Forbidden', 403);

    await dbConnect();
    const { id } = await params;
    const club = await Club.findByIdAndDelete(id);
    if (!club) return errorResponse('Club not found', 404);
    return successResponse(null, 'Club deleted');
  } catch (err) {
    console.error('DELETE club error:', err);
    return errorResponse('Internal server error', 500);
  }
}
