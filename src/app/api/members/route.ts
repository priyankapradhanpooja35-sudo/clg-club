import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Membership from '@/models/Membership';
import { getTokenFromRequest, verifyToken, successResponse, errorResponse } from '@/lib/auth';

// GET /api/members?clubId= — list members of a club
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const clubId = req.nextUrl.searchParams.get('clubId');
    const status = req.nextUrl.searchParams.get('status') || 'Approved';
    if (!clubId) return errorResponse('clubId query param is required');

    const validStatuses = ['Pending', 'Approved', 'Rejected'] as const;
    const typedStatus = validStatuses.includes(status as (typeof validStatuses)[number])
      ? (status as (typeof validStatuses)[number])
      : 'Approved';

    const members = await Membership.find({ clubId, status: typedStatus })
      .populate('userId', 'name email engagementScore')
      .lean();

    return successResponse(members);
  } catch (err) {
    console.error('GET members error:', err);
    return errorResponse('Internal server error', 500);
  }
}

// POST /api/members — join request
export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    const payload = token ? verifyToken(token) : null;
    if (!payload) return errorResponse('Unauthorized', 401);

    await dbConnect();
    const body = await req.json();
    const { clubId } = body;
    if (!clubId) return errorResponse('clubId is required');

    const existing = await Membership.findOne({ clubId, userId: payload.id });
    if (existing) return errorResponse('Join request already exists', 409);

    const membership = await Membership.create({ clubId, userId: payload.id });
    return successResponse(membership, 'Join request submitted', 201);
  } catch (err) {
    console.error('POST member error:', err);
    return errorResponse('Internal server error', 500);
  }
}

// PATCH /api/members — approve/reject a join request
export async function PATCH(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    const payload = token ? verifyToken(token) : null;
    if (!payload || !['Admin', 'ClubHead'].includes(payload.role)) {
      return errorResponse('Forbidden', 403);
    }

    await dbConnect();
    const body = await req.json();
    const { membershipId, status, memberRole } = body;
    if (!membershipId || !status) return errorResponse('membershipId and status are required');
    if (!['Approved', 'Rejected'].includes(status)) return errorResponse('Invalid status');

    const membership = await Membership.findByIdAndUpdate(
      membershipId,
      { status, ...(memberRole && { memberRole }) },
      { new: true }
    );
    if (!membership) return errorResponse('Membership not found', 404);
    return successResponse(membership, `Membership ${status.toLowerCase()}`);
  } catch (err) {
    console.error('PATCH member error:', err);
    return errorResponse('Internal server error', 500);
  }
}
