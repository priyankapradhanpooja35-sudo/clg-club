export const dynamic = 'force-static';

import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { signToken, successResponse, errorResponse, setAuthCookie } from '@/lib/auth';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[0-9]).{8,}$/; // min 8 chars, 1 number

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, email, password, role } = body;

    // Validation checks
    if (!name || !email || !password) {
      return errorResponse('Name, email, and password are required');
    }
    if (!emailRegex.test(email)) {
      return errorResponse('Please provide a valid email address');
    }
    if (!passwordRegex.test(password)) {
      return errorResponse('Password must be at least 8 characters long and contain at least one number');
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return errorResponse('An account with this email already exists', 409);
    }

    // Map client selection labels to model values
    const allowedRoles = ['Student', 'ClubHead', 'Faculty', 'Guest'];
    const userRole = allowedRoles.includes(role) ? role : 'Student';

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: userRole,
    });

    const token = signToken({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    });

    const res = successResponse(
      { id: user._id, name: user.name, email: user.email, role: user.role },
      'Account created successfully',
      201
    );
    return setAuthCookie(res, token);
  } catch (err: unknown) {
    console.error('Register error:', err);
    return errorResponse('Internal server error', 500);
  }
}
