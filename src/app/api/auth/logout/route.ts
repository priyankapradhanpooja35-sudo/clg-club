export const dynamic = 'force-static';

import { NextRequest } from 'next/server';
import { successResponse, clearAuthCookie } from '@/lib/auth';

export async function POST(_req: NextRequest) {
  const res = successResponse(null, 'Logged out successfully');
  return clearAuthCookie(res);
}
