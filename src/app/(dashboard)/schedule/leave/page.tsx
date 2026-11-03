import { createClient } from '@/lib/supabase/server';
import { LeaveManagement } from '@/components/schedule/leave-management';

export default async function LeavePage(): Promise<React.ReactElement> {
  const supabase = await createClient();

  // 재직 직원 목록 로드
  const { data: employees } = await supabase
    .from('saehan_employees')
    .select('id, name, department, shift_group, role, affiliation')
    .eq('status', '재직')
    .order('department')
    .order('shift_group')
    .order('name');

  // 휴무 신청 목록 로드 (shift_type='휴'인 work_schedule 엔트리)
  const { data: schedules } = await supabase
    .from('saehan_work_schedules')
    .select('id, employee_id, date, shift_type, is_confirmed, created_at')
    .eq('shift_type', '휴')
    .order('date', { ascending: false })
    .limit(200);

  // 직원 정보 맵 생성
  type EmployeeRow = { id: string; name: string; department: string; shift_group: string; role: string; affiliation: string };
  type ScheduleRow = { id: string; employee_id: string; date: string; shift_type: string; is_confirmed: boolean; created_at: string };
  const typedEmployees = (employees ?? []) as EmployeeRow[];
  const typedSchedules = (schedules ?? []) as ScheduleRow[];
  const employeeMap = new Map<string, EmployeeRow>(
    typedEmployees.map((e) => [e.id, e]),
  );

  // 휴무 신청 데이터에 직원 정보 조인
  const leaveRequests = typedSchedules.map((s) => {
    const emp = employeeMap.get(s.employee_id);
    return {
      id: s.id as string,
      employee_id: s.employee_id as string,
      employee_name: emp?.name ?? '(알 수 없음)',
      department: emp?.department ?? '',
      shift_group: emp?.shift_group ?? '',
      role: emp?.role ?? '',
      affiliation: emp?.affiliation ?? '',
      date: s.date as string,
      reason: '',
      status: (s.is_confirmed ? '승인' : '대기') as '대기' | '승인',
      created_at: s.created_at as string,
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">휴무/연차 관리</h1>
      </div>
      <LeaveManagement
        employees={employees ?? []}
        leaveRequests={leaveRequests}
      />
    </div>
  );
}
