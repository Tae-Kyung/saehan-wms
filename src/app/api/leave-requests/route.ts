import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

type LeaveRequestBody = {
  employee_id: string;
  date: string;
  reason: string;
};

type LeaveApprovalBody = {
  id: string;
  action: 'approve' | 'reject';
};

type ScheduleRow = {
  id: string;
  employee_id: string;
  date: string;
  shift_type: string;
  is_confirmed: boolean;
  created_at: string;
  notes: string | null;
};

type EmployeeRow = {
  id: string;
  name: string;
  department: string;
  shift_group: string;
  role: string;
  affiliation: string;
};

// GET: 휴무 신청 목록 조회 (is_confirmed=false인 work_schedule 엔트리)
export async function GET(request: NextRequest): Promise<NextResponse> {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status'); // 대기, 승인, 반려(=삭제됨이므로 조회 불가)
  const department = searchParams.get('department');

  // 휴무 신청 = shift_type='휴' 인 work_schedule 엔트리
  // is_confirmed=false -> 대기, is_confirmed=true -> 승인
  let query = supabase
    .from('saehan_work_schedules')
    .select('id, employee_id, date, shift_type, is_confirmed, created_at, notes')
    .eq('shift_type', '휴');

  if (status === '대기') {
    query = query.eq('is_confirmed', false);
  } else if (status === '승인') {
    query = query.eq('is_confirmed', true);
  }
  // '반려' 상태는 삭제된 레코드이므로 별도 조회 없음

  const { data: schedules, error: schedError } = await query.order('date', { ascending: false });

  if (schedError) {
    return NextResponse.json({ error: schedError.message }, { status: 500 });
  }

  if (!schedules || schedules.length === 0) {
    return NextResponse.json([]);
  }

  // 직원 정보 조인
  const typedSchedules = schedules as ScheduleRow[];
  const employeeIds = [...new Set(typedSchedules.map((s) => s.employee_id))];
  const { data: employees } = await supabase
    .from('saehan_employees')
    .select('id, name, department, shift_group, role, affiliation')
    .in('id', employeeIds);

  const typedEmployees = (employees ?? []) as EmployeeRow[];
  const employeeMap = new Map<string, EmployeeRow>(
    typedEmployees.map((e) => [e.id, e]),
  );

  type LeaveRequestItem = {
    id: string;
    employee_id: string;
    employee_name: string;
    department: string;
    shift_group: string;
    role: string;
    affiliation: string;
    date: string;
    reason: string;
    status: '대기' | '승인';
    created_at: string;
  };

  let result: LeaveRequestItem[] = typedSchedules.map((s) => {
    const emp = employeeMap.get(s.employee_id);
    return {
      id: s.id,
      employee_id: s.employee_id,
      employee_name: emp?.name ?? '(알 수 없음)',
      department: emp?.department ?? '',
      shift_group: emp?.shift_group ?? '',
      role: emp?.role ?? '',
      affiliation: emp?.affiliation ?? '',
      date: s.date,
      reason: (s.notes as string) ?? '',
      status: s.is_confirmed ? '승인' as const : '대기' as const,
      created_at: s.created_at,
    };
  });

  // 부서 필터
  if (department && department !== 'all') {
    result = result.filter((r) => r.department === department);
  }

  return NextResponse.json(result);
}

// POST: 휴무 신청 (work_schedule에 shift_type='휴', is_confirmed=false 로 upsert)
export async function POST(request: NextRequest): Promise<NextResponse> {
  const supabase = await createClient();
  const body = (await request.json()) as LeaveRequestBody;

  if (!body.employee_id || !body.date) {
    return NextResponse.json({ error: 'employee_id, date 필수' }, { status: 400 });
  }

  // 이미 해당 날짜에 확정된 스케줄이 있는지 확인
  const { data: existing } = await supabase
    .from('saehan_work_schedules')
    .select('id, shift_type, is_confirmed')
    .eq('employee_id', body.employee_id)
    .eq('date', body.date)
    .maybeSingle();

  if (existing?.is_confirmed && existing.shift_type === '휴') {
    return NextResponse.json({ error: '이미 승인된 휴무가 있습니다.' }, { status: 400 });
  }

  // upsert: 있으면 업데이트, 없으면 삽입
  const { data, error } = await supabase
    .from('saehan_work_schedules')
    .upsert(
      {
        employee_id: body.employee_id,
        date: body.date,
        shift_type: '휴',
        is_confirmed: false,
        notes: body.reason || null,
      },
      { onConflict: 'employee_id,date' },
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data, { status: 201 });
}

// PUT: 승인/반려 처리
export async function PUT(request: NextRequest): Promise<NextResponse> {
  const supabase = await createClient();
  const body = (await request.json()) as LeaveApprovalBody;

  if (!body.id || !body.action) {
    return NextResponse.json({ error: 'id, action 필수' }, { status: 400 });
  }

  if (body.action === 'approve') {
    // 승인: is_confirmed = true
    const { data, error } = await supabase
      .from('saehan_work_schedules')
      .update({ is_confirmed: true })
      .eq('id', body.id)
      .eq('shift_type', '휴')
      .eq('is_confirmed', false)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(data);
  } else if (body.action === 'reject') {
    // 반려: 해당 레코드 삭제 (원래 스케줄 복원은 별도 처리 필요)
    const { error } = await supabase
      .from('saehan_work_schedules')
      .delete()
      .eq('id', body.id)
      .eq('shift_type', '휴')
      .eq('is_confirmed', false);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: '유효하지 않은 action' }, { status: 400 });
}
