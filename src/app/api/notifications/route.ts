import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export type NotificationType =
  | 'PLAN_CONFIRMED'
  | 'ASSIGNMENT_CONFIRMED'
  | 'SHORTAGE'
  | 'LEAVE_REQUEST'
  | 'DEADLINE';

type NotificationRow = {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  is_read: boolean;
  created_at: string;
};

// 알림 목록 조회 (최신 20개)
export async function GET(request: NextRequest): Promise<NextResponse> {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');

  if (!userId) {
    return NextResponse.json({ error: 'user_id 파라미터가 필요합니다.' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('saehan_notifications')
    .select('id, user_id, type, title, body, is_read, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const notifications = (data as NotificationRow[] | null) ?? [];
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return NextResponse.json({ notifications, unread_count: unreadCount });
}

// 알림 읽음 처리
export async function PUT(request: NextRequest): Promise<NextResponse> {
  const supabase = await createClient();
  const body = await request.json();
  const { id, is_read } = body as { id: string; is_read: boolean };

  if (!id) {
    return NextResponse.json({ error: 'id가 필요합니다.' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('saehan_notifications')
    .update({ is_read: is_read ?? true })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}

// 알림 생성
export async function POST(request: NextRequest): Promise<NextResponse> {
  const supabase = await createClient();
  const body = await request.json();
  const { type, title, body: notifBody, user_id } = body as {
    type: NotificationType;
    title: string;
    body?: string;
    user_id: string;
  };

  if (!type || !title || !user_id) {
    return NextResponse.json({ error: 'type, title, user_id가 필요합니다.' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('saehan_notifications')
    .insert({
      type,
      title,
      body: notifBody ?? null,
      user_id,
      is_read: false,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
