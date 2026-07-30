import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { signToken, successResponse, errorResponse, setAuthCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password) {
      return errorResponse('Name, email, and password are required');
    }
    if (password.length < 6) {
      return errorResponse('Password must be at least 6 characters');
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return errorResponse('An account with this email already exists', 409);
    }

    const allowedRoles = ['Student', 'Faculty', 'Guest'];
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
