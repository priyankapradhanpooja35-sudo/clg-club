import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Registration from '@/models/Registration';
import User from '@/models/User';
import { getTokenFromRequest, verifyToken, successResponse, errorResponse } from '@/lib/auth';

// POST /api/registrations/checkin — scan QR to check in
export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    const payload = token ? verifyToken(token) : null;
    if (!payload || !['Admin', 'ClubHead', 'Faculty'].includes(payload.role)) {
      return errorResponse('Forbidden', 403);
    }

    await dbConnect();
    const body = await req.json();
    const { qrCodeData } = body;
    if (!qrCodeData) return errorResponse('qrCodeData is required');

    const registration = await Registration.findOne({ qrCodeData });
    if (!registration) return errorResponse('Invalid QR code', 404);
    if (registration.checkedIn) return errorResponse('Already checked in', 409);

    registration.checkedIn = true;
    registration.checkedInAt = new Date();
    await registration.save();

    // Increase user engagement score on check-in
    await User.findByIdAndUpdate(registration.userId, { $inc: { engagementScore: 10 } });

    const populated = await registration.populate('userId', 'name email');
    return successResponse(populated, 'Check-in successful');
  } catch (err) {
    console.error('Check-in error:', err);
    return errorResponse('Internal server error', 500);
  }
}
