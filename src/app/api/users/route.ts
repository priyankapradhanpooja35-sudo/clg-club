import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { getTokenFromRequest, verifyToken, successResponse, errorResponse } from '@/lib/auth';

// GET /api/users - List all users (Admin only)
export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    const payload = token ? verifyToken(token) : null;
    if (!payload || payload.role !== 'Admin') {
      return errorResponse('Forbidden: Admin access required', 403);
    }

    await dbConnect();
    const users = await User.find().select('-password').sort({ createdAt: -1 }).lean();
    return successResponse(users);
  } catch (err) {
    console.error('GET users error:', err);
    return errorResponse('Internal server error', 500);
  }
}

// PATCH /api/users - Update user role or details (Admin only)
export async function PATCH(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    const payload = token ? verifyToken(token) : null;
    if (!payload || payload.role !== 'Admin') {
      return errorResponse('Forbidden: Admin access required', 403);
    }

    await dbConnect();
    const body = await req.json();
    const { userId, role, clubId } = body;

    if (!userId) {
      return errorResponse('userId is required');
    }

    const validRoles = ['Student', 'ClubHead', 'Faculty', 'Admin', 'Guest'];
    if (role && !validRoles.includes(role)) {
      return errorResponse(`Invalid role: must be one of ${validRoles.join(', ')}`);
    }

    const updateData: Record<string, any> = {};
    if (role) updateData.role = role;
    
    // Allow assigning or clearing clubId
    if (clubId !== undefined) {
      updateData.clubId = clubId === '' || clubId === null ? null : clubId;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
    if (!updatedUser) {
      return errorResponse('User not found', 404);
    }

    return successResponse(updatedUser, 'User updated successfully');
  } catch (err) {
    console.error('PATCH users error:', err);
    return errorResponse('Internal server error', 500);
  }
}
