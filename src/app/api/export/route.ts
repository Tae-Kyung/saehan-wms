import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// CSV 유틸: 셀 값 이스케이프 (쉼표, 따옴표, 줄바꿈 포함 시)
function escapeCsv(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCsvRow(values: (string | number | null | undefined)[]): string {
  return values.map(escapeCsv).join(',');
}

function createCsvResponse(csv: string, filename: string): NextResponse {
  // BOM 추가 (한글 Excel 호환)
  const bom = '\uFEFF';
  return new NextResponse(bom + csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}

// 근무 스케줄 CSV 내보내기
async function exportSchedule(
  supabase: Awaited<ReturnType<typeof createClient>>,
  year: string,
  month: string,
): Promise<NextResponse> {
  const startDate = `${year}-${month.padStart(2, '0')}-01`;
  const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
  const endDate = `${year}-${month.padStart(2, '0')}-${lastDay}`;

  // 직원 목록 조회
  const { data: employees, error: empError } = await supabase
    .from('saehan_employees')
    .select('id, name, department, shift_group, role, affiliation')
    .eq('status', '재직')
    .order('department')
    .order('shift_group')
    .order('name');

  if (empError) {
    return NextResponse.json({ error: empError.message }, { status: 500 });
  }

  // 스케줄 조회
  const { data: schedules, error: schedError } = await supabase
    .from('saehan_work_schedules')
    .select('employee_id, date, shift_type')
    .gte('date', startDate)
    .lte('date', endDate);

  if (schedError) {
    return NextResponse.json({ error: schedError.message }, { status: 500 });
  }

  type ScheduleRow = { employee_id: string; date: string; shift_type: string };
  const scheduleMap = new Map<string, string>();
  for (const s of (schedules as ScheduleRow[] ?? [])) {
    scheduleMap.set(`${s.employee_id}_${s.date}`, s.shift_type);
  }

  // 날짜 컬럼 생성
  const days = Array.from({ length: lastDay }, (_, i) => i + 1);
  const dateHeaders = days.map((d) => `${parseInt(month)}/${d}`);

  // CSV 헤더
  const header = toCsvRow(['이름', '부서', '조', '역할', '소속', ...dateHeaders]);

  // CSV 본문
  type EmpRow = { id: string; name: string; department: string; shift_group: string; role: string; affiliation: string };
  const rows = (employees as EmpRow[] ?? []).map((emp) => {
    const shiftValues = days.map((d) => {
      const dateStr = `${year}-${month.padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      return scheduleMap.get(`${emp.id}_${dateStr}`) ?? '';
    });
    return toCsvRow([emp.name, emp.department, emp.shift_group, emp.role, emp.affiliation, ...shiftValues]);
  });

  const csv = [header, ...rows].join('\n');
  const filename = `근무스케줄_${year}년${month}월.csv`;
  return createCsvResponse(csv, filename);
}

// 일별 배치 CSV 내보내기
async function exportAssignments(
  supabase: Awaited<ReturnType<typeof createClient>>,
  date: string,
): Promise<NextResponse> {
  const { data: assignments, error } = await supabase
    .from('saehan_worker_assignments')
    .select('date, shift, department, role, sub_department, status, is_cross_assigned, cross_from, notes, employee:saehan_employees(name, affiliation, shift_group)')
    .eq('date', date)
    .order('shift')
    .order('department')
    .order('role');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const header = toCsvRow(['날짜', '근무조', '부서', '역할', '세부부서', '이름', '소속', '조', '크로스배치', '원소속', '상태', '비고']);

  type AssignmentRow = {
    date: string;
    shift: string;
    department: string;
    role: string;
    sub_department: string | null;
    status: string;
    is_cross_assigned: boolean;
    cross_from: string | null;
    notes: string | null;
    employee: { name: string; affiliation: string; shift_group: string } | null;
  };

  const rows = (assignments as AssignmentRow[] ?? []).map((a) => {
    return toCsvRow([
      a.date,
      a.shift,
      a.department,
      a.role,
      a.sub_department,
      a.employee?.name ?? '',
      a.employee?.affiliation ?? '',
      a.employee?.shift_group ?? '',
      a.is_cross_assigned ? 'Y' : 'N',
      a.cross_from,
      a.status,
      a.notes,
    ]);
  });

  const csv = [header, ...rows].join('\n');
  const filename = `배치표_${date}.csv`;
  return createCsvResponse(csv, filename);
}

// 근태 리포트 CSV 내보내기
async function exportLabor(
  supabase: Awaited<ReturnType<typeof createClient>>,
  period: string,
  date: string,
): Promise<NextResponse> {
  const startDate = new Date(date);
  let endDate: Date;

  if (period === 'monthly') {
    endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
  } else {
    endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
  }

  const startStr = date;
  const endStr = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;

  // 직원 목록
  type EmployeeRow = { id: string; name: string; employee_no: string | null; department: string; affiliation: string; shift_group: string; role: string };
  const { data: employees, error: empError } = await supabase
    .from('saehan_employees')
    .select('id, name, employee_no, department, affiliation, shift_group, role')
    .eq('status', '재직')
    .order('department')
    .order('name') as unknown as { data: EmployeeRow[] | null; error: { message: string } | null };

  if (empError) {
    return NextResponse.json({ error: empError.message }, { status: 500 });
  }

  // 스케줄
  type ScheduleRow = { employee_id: string; date: string; shift_type: string };
  const { data: schedules, error: schedError } = await supabase
    .from('saehan_work_schedules')
    .select('employee_id, date, shift_type')
    .gte('date', startStr)
    .lte('date', endStr);

  if (schedError) {
    return NextResponse.json({ error: schedError.message }, { status: 500 });
  }

  // 출결
  type AttendanceRow = { employee_id: string; date: string; status: string };
  const { data: attendance, error: attError } = await supabase
    .from('saehan_attendance_logs')
    .select('employee_id, date, status')
    .gte('date', startStr)
    .lte('date', endStr);

  if (attError) {
    return NextResponse.json({ error: attError.message }, { status: 500 });
  }

  // 크로스배치
  type CrossRow = { employee_id: string };
  const { data: crossData, error: crossError } = await supabase
    .from('saehan_worker_assignments')
    .select('employee_id')
    .gte('date', startStr)
    .lte('date', endStr)
    .eq('is_cross_assigned', true);

  if (crossError) {
    return NextResponse.json({ error: crossError.message }, { status: 500 });
  }

  const header = toCsvRow([
    '이름', '사번', '부서', '소속', '조', '역할',
    '주간', '야간', '특근', '연차', '결근', '지각', '총근무일', '크로스배치',
  ]);

  const rows = (employees ?? []).map((emp) => {
    const empSchedules = (schedules as ScheduleRow[] ?? []).filter((s) => s.employee_id === emp.id);
    const empAtt = (attendance as AttendanceRow[] ?? []).filter((a) => a.employee_id === emp.id);
    const empCross = (crossData as CrossRow[] ?? []).filter((c) => c.employee_id === emp.id);

    const dayShifts = empSchedules.filter((s) => s.shift_type === '주').length;
    const nightShifts = empSchedules.filter((s) => s.shift_type === '야').length;
    const overtime = empSchedules.filter((s) => s.shift_type === '특근').length;
    const leave = empSchedules.filter((s) => s.shift_type === '연차').length;
    const absent = empAtt.filter((a) => a.status === '결근').length;
    const late = empAtt.filter((a) => a.status === '지각').length;
    const totalWork = dayShifts + nightShifts + overtime;

    return toCsvRow([
      emp.name, emp.employee_no, emp.department, emp.affiliation, emp.shift_group, emp.role,
      dayShifts, nightShifts, overtime, leave, absent, late, totalWork, empCross.length,
    ]);
  });

  const csv = [header, ...rows].join('\n');
  const periodLabel = period === 'monthly' ? '월별' : '주별';
  const filename = `근태리포트_${periodLabel}_${startStr}.csv`;
  return createCsvResponse(csv, filename);
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  if (!type) {
    return NextResponse.json({ error: 'type 파라미터가 필요합니다. (schedule, assignments, labor)' }, { status: 400 });
  }

  switch (type) {
    case 'schedule': {
      const year = searchParams.get('year');
      const month = searchParams.get('month');
      if (!year || !month) {
        return NextResponse.json({ error: 'year, month 파라미터가 필요합니다.' }, { status: 400 });
      }
      return exportSchedule(supabase, year, month);
    }

    case 'assignments': {
      const date = searchParams.get('date');
      if (!date) {
        return NextResponse.json({ error: 'date 파라미터가 필요합니다. (YYYY-MM-DD)' }, { status: 400 });
      }
      return exportAssignments(supabase, date);
    }

    case 'labor': {
      const period = searchParams.get('period') ?? 'weekly';
      const date = searchParams.get('date');
      if (!date) {
        return NextResponse.json({ error: 'date 파라미터가 필요합니다. (YYYY-MM-DD)' }, { status: 400 });
      }
      return exportLabor(supabase, period, date);
    }

    default:
      return NextResponse.json({ error: `지원하지 않는 type: ${type}` }, { status: 400 });
  }
}
