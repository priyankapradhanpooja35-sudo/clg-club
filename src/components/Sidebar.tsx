'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  ChevronLeft, ChevronRight, LayoutDashboard, Users, Calendar,
  Ticket, Megaphone, FileText, History, Settings, CheckSquare, Sparkles
} from 'lucide-react';
import { useState } from 'react';

interface SidebarLink {
  href: string;
  label: string;
  icon: React.ElementType;
}

const adminLinks: SidebarLink[] = [
  { href: '/dashboard/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/admin/clubs', label: 'Clubs', icon: Users },
  { href: '/dashboard/admin/members', label: 'Members', icon: Users },
  { href: '/dashboard/admin/events', label: 'Events', icon: Calendar },
  { href: '/dashboard/admin/registrations', label: 'Registrations', icon: Ticket },
  { href: '/dashboard/admin/announcements', label: 'Announcements', icon: Megaphone },
  { href: '/dashboard/admin/reports', label: 'Reports', icon: FileText },
  { href: '/dashboard/admin/logs', label: 'Activity Logs', icon: History },
  { href: '/dashboard/admin/settings', label: 'Settings', icon: Settings },
];

const clubHeadLinks: SidebarLink[] = [
  { href: '/dashboard/club-head', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/club-head/members', label: 'Members', icon: Users },
  { href: '/dashboard/club-head/events', label: 'Events', icon: Calendar },
  { href: '/dashboard/club-head/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/dashboard/club-head/announcements', label: 'Announcements', icon: Megaphone },
  { href: '/dashboard/club-head/scan', label: 'QR Scanner', icon: Ticket },
];

const studentLinks: SidebarLink[] = [
  { href: '/dashboard/student', label: 'My Hub', icon: LayoutDashboard },
  { href: '/dashboard/student/tickets', label: 'QR Tickets', icon: Ticket },
];

const linkSets: Record<string, SidebarLink[]> = {
  admin: adminLinks,
  'club-head': clubHeadLinks,
  student: studentLinks,
};

interface SidebarProps {
  role: string;
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const links = linkSets[role] || studentLinks;

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col h-full border-r border-[var(--border)] bg-[var(--card)] transition-all duration-300',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
        {!collapsed && (
          <span className="text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400">
            {role === 'club-head' ? 'Club Head' : role.charAt(0).toUpperCase() + role.slice(1)} Panel
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg p-1.5 text-gray-400 hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors ml-auto"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                active
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20 font-bold'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-[var(--muted)] hover:text-[var(--foreground)]',
                collapsed && 'justify-center px-2'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
