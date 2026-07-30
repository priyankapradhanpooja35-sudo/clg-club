import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';
import { getTokenFromRequest, verifyToken, successResponse, errorResponse } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    const payload = token ? verifyToken(token) : null;
    if (!payload) return errorResponse('Unauthorized', 401);
    await dbConnect();
    const clubId = req.nextUrl.searchParams.get('clubId');
    if (!clubId) return errorResponse('clubId is required');
    const tasks = await Task.find({ clubId }).populate('assignedTo', 'name').lean();
    return successResponse(tasks);
  } catch (err) {
    return errorResponse('Internal server error', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    const payload = token ? verifyToken(token) : null;
    if (!payload || !['Admin', 'ClubHead'].includes(payload.role)) return errorResponse('Forbidden', 403);
    await dbConnect();
    const body = await req.json();
    const { title, description, clubId, assignedTo } = body;
    if (!title || !clubId) return errorResponse('title and clubId are required');
    const task = await Task.create({ title, description, clubId, assignedTo });
    return successResponse(task, 'Task created', 201);
  } catch (err) {
    return errorResponse('Internal server error', 500);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    const payload = token ? verifyToken(token) : null;
    if (!payload) return errorResponse('Unauthorized', 401);
    await dbConnect();
    const body = await req.json();
    const { taskId, status, title, description } = body;
    if (!taskId) return errorResponse('taskId is required');
    const task = await Task.findByIdAndUpdate(taskId, { status, title, description }, { new: true });
    if (!task) return errorResponse('Task not found', 404);
    return successResponse(task, 'Task updated');
  } catch (err) {
    return errorResponse('Internal server error', 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    const payload = token ? verifyToken(token) : null;
    if (!payload || !['Admin', 'ClubHead'].includes(payload.role)) return errorResponse('Forbidden', 403);
    await dbConnect();
    const { id } = await req.json();
    await Task.findByIdAndDelete(id);
    return successResponse(null, 'Task deleted');
  } catch (err) {
    return errorResponse('Internal server error', 500);
  }
}
