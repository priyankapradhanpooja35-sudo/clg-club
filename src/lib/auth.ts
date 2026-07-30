import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';


const JWT_SECRET = process.env.JWT_SECRET || 'bec-club-hub-super-secret-key-2024';

export interface JWTPayload {
  id: string;
  name: string;
  email: string;
  role: string;
  clubId?: string;
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(req: NextRequest): string | null {
  const cookie = req.cookies.get('bec_token');
  if (cookie) return cookie.value;
  const authHeader = req.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) return authHeader.slice(7);
  return null;
}

export function requireAuth(roles?: string[]) {
  return (req: NextRequest): JWTPayload | NextResponse => {
    const token = getTokenFromRequest(req);
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized: No token provided' }, { status: 401 });
    }
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ success: false, message: 'Unauthorized: Invalid or expired token' }, { status: 401 });
    }
    if (roles && !roles.includes(payload.role)) {
      return NextResponse.json({ success: false, message: 'Forbidden: Insufficient permissions' }, { status: 403 });
    }
    return payload;
  };
}

export function successResponse(data: unknown, message = 'Success', status = 200) {
  return NextResponse.json({ success: true, message, data }, { status });
}

export function errorResponse(message: string, status = 400, errors?: unknown) {
  return NextResponse.json({ success: false, message, errors }, { status });
}

export function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set('bec_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
  return response;
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.delete('bec_token');
  return response;
}

export async function getCurrentUser(): Promise<JWTPayload | null> {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get('bec_token');
    if (!cookie) return null;
    return verifyToken(cookie.value);
  } catch {
    return null;
  }
}

