'use client';

import { useState, useEffect, useCallback } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

type NotificationType =
  | 'PLAN_CONFIRMED'
  | 'ASSIGNMENT_CONFIRMED'
  | 'SHORTAGE'
  | 'LEAVE_REQUEST'
  | 'DEADLINE';

type Notification = {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  is_read: boolean;
  created_at: string;
};

const TYPE_CONFIG: Record<NotificationType, { icon: string; color: string; label: string }> = {
  PLAN_CONFIRMED: {
    icon: '\u2705', // check mark
    color: 'bg-green-100 text-green-700',
    label: '계획확정',
  },
  ASSIGNMENT_CONFIRMED: {
    icon: '\u{1F4CB}', // clipboard
    color: 'bg-blue-100 text-blue-700',
    label: '배치확정',
  },
  SHORTAGE: {
    icon: '\u26A0\uFE0F', // warning
    color: 'bg-red-100 text-red-700',
    label: '인원부족',
  },
  LEAVE_REQUEST: {
    icon: '\u{1F4C5}', // calendar
    color: 'bg-purple-100 text-purple-700',
    label: '연차신청',
  },
  DEADLINE: {
    icon: '\u23F0', // alarm clock
    color: 'bg-amber-100 text-amber-700',
    label: '마감임박',
  },
};

function formatTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return '방금';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay < 7) return `${diffDay}일 전`;
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

type Props = {
  userId: string;
};

export function NotificationPanel({ userId }: Props): React.ReactElement {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const loadNotifications = useCallback(async (): Promise<void> => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/notifications?user_id=${userId}`);
      if (res.ok) {
        const data: { notifications: Notification[]; unread_count: number } = await res.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unread_count);
      }
    } catch {
      // 알림 로드 실패 시 무시
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadNotifications();
    // 30초마다 자동 새로고침
    const interval = setInterval(loadNotifications, 30000);
    return (): void => { clearInterval(interval); };
  }, [loadNotifications]);

  // 패널 열릴 때 새로고침
  useEffect(() => {
    if (open) {
      loadNotifications();
    }
  }, [open, loadNotifications]);

  async function markAsRead(id: string): Promise<void> {
    // 즉시 UI 반영
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_read: true }),
      });
    } catch {
      // 실패 시 다음 새로고침에서 복구됨
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button variant="ghost" size="sm" className="relative">
          {/* 벨 아이콘 */}
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
            />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">알림</h3>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-[10px]">
                {unreadCount}개 읽지 않음
              </Badge>
            )}
          </div>
        </div>
        <ScrollArea className="max-h-[400px] overflow-y-auto">
          {loading && notifications.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              로딩...
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              알림이 없습니다.
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notif) => {
                const config = TYPE_CONFIG[notif.type] ?? TYPE_CONFIG.PLAN_CONFIRMED;
                return (
                  <button
                    key={notif.id}
                    className={cn(
                      'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50',
                      !notif.is_read && 'bg-blue-50/50',
                    )}
                    onClick={() => {
                      if (!notif.is_read) {
                        markAsRead(notif.id);
                      }
                    }}
                  >
                    {/* 타입 아이콘 */}
                    <span
                      className={cn(
                        'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs',
                        config.color,
                      )}
                    >
                      {config.icon}
                    </span>
                    {/* 내용 */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={cn('text-sm', !notif.is_read && 'font-semibold')}>
                          {notif.title}
                        </span>
                        {!notif.is_read && (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                        )}
                      </div>
                      {notif.body && (
                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                          {notif.body}
                        </p>
                      )}
                      <div className="mt-1 flex items-center gap-2">
                        <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-medium', config.color)}>
                          {config.label}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {formatTimeAgo(notif.created_at)}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
