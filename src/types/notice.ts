export type NoticeCategory = 'all' | 'general' | 'urgent' | 'challenge' | 'event' | 'achievement' | 'deadline' | 'clubhead';

export interface Notice {
  id: string;
  _id?: string;
  title: string;
  body: string;
  content?: string;
  category: NoticeCategory | string;
  priority?: string;
  pinned: boolean;
  createdAt: string;
  readBy?: string[];
  clubName?: string;
  clubSlug?: string;
  author?: string;
}

export function normalizeNotice(raw: any): Notice {
  const id = raw.id || raw._id || `notice-${Math.random().toString(36).substr(2, 9)}`;
  const title = raw.title || 'Notice Announcement';
  const body = raw.body || raw.content || '';
  const categoryRaw = (raw.category || raw.priority || 'general').toString().toLowerCase();
  
  let category: NoticeCategory = 'general';
  if (['general', 'urgent', 'challenge', 'event', 'achievement', 'deadline', 'clubhead'].includes(categoryRaw)) {
    category = categoryRaw as NoticeCategory;
  }

  return {
    id,
    _id: id,
    title,
    body,
    content: body,
    category,
    priority: raw.priority || category,
    pinned: Boolean(raw.pinned),
    createdAt: raw.createdAt || new Date().toISOString(),
    readBy: Array.isArray(raw.readBy) ? raw.readBy : [],
    clubName: raw.clubName || 'Administration',
    clubSlug: raw.clubSlug,
    author: raw.author || 'BEC Academic Office',
  };
}

export function formatRelativeTime(dateInput: string | Date): string {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return 'Recently';

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 30) return 'Just now';
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;

  const mins = Math.floor(diffInSeconds / 60);
  if (mins < 60) return `${mins} min${mins > 1 ? 's' : ''} ago`;

  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hr${hours > 1 ? 's' : ''} ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;

  return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}
