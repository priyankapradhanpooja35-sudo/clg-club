import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { signToken, successResponse, errorResponse, setAuthCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return errorResponse('Email and password are required');
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return errorResponse('Invalid email or password', 401);
    }

    const token = signToken({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      clubId: user.clubId?.toString(),
    });

    const res = successResponse(
      { id: user._id, name: user.name, email: user.email, role: user.role, clubId: user.clubId },
      'Login successful'
    );
    return setAuthCookie(res, token);
  } catch (err) {
    console.error('Login error:', err);
    return errorResponse('Internal server error', 500);
  }
}
