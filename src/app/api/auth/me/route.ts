export const dynamic = 'force-static';

import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { getTokenFromRequest, verifyToken, successResponse, errorResponse } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return errorResponse('Not authenticated', 401);

    const payload = verifyToken(token);
    if (!payload) return errorResponse('Invalid or expired token', 401);

    await dbConnect();
    const user = await User.findById(payload.id).select('-password');
    if (!user) return errorResponse('User not found', 404);

    return successResponse({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      clubId: user.clubId,
      engagementScore: user.engagementScore,
    });
  } catch (err) {
    console.error('Auth me error:', err);
    return errorResponse('Internal server error', 500);
  }
}
