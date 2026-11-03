import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

type AssignRow = { date: string; shift: string; department: string; role: string; notes: string; employee: unknown; status: string };
type EquipRow = { date: string; shift: string; notes: string; equipment_id: string; equipment: unknown; status: string };
type DailyEquipRow = { date: string; shift: string; equipment_id: string };
type DailyAssignRow = { date: string; shift: string; department: string };

// 2025년 배치 이력 조회 API
// GET /api/history?date=2025-06-02&factory=1공장
// GET /api/history?month=2025-06&factory=2공장
export async function GET(request: NextRequest): Promise<NextResponse> {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);

  const date = searchParams.get('date');
  const month = searchParams.get('month');
  const factory = searchParams.get('factory');

  // 일별 조회: 특정 날짜의 배치 상세
  if (date) {
    // 설비 가동 이력
    const equipmentQuery = supabase
      .from('saehan_production_plan_details')
      .select('*, equipment:saehan_equipment(code, name, type, factory:saehan_factories(name))')
      .eq('date', date)
      .eq('status', '가동')
      .order('equipment_id');

    // 인력 배치 이력
    const assignmentQuery = supabase
      .from('saehan_worker_assignments')
      .select('*, employee:saehan_employees(name, department, shift_group, role, affiliation)')
      .eq('date', date)
      .eq('status', '이력')
      .order('shift')
      .order('department')
      .order('role');

    const [eqResult, asResult] = await Promise.all([equipmentQuery, assignmentQuery]);

    if (eqResult.error) return NextResponse.json({ error: eqResult.error.message }, { status: 500 });
    if (asResult.error) return NextResponse.json({ error: asResult.error.message }, { status: 500 });

    // 공장 필터링
    let equipment = (eqResult.data ?? []) as EquipRow[];
    let assignments = (asResult.data ?? []) as AssignRow[];

    if (factory) {
      assignments = assignments.filter((a: AssignRow) =>
        factory === '1공장'
          ? a.department?.startsWith('생산1팀')
          : a.department === '생산2팀'
      );
      equipment = equipment.filter((e: EquipRow) => {
        const fName = (e.equipment as { factory?: { name?: string } })?.factory?.name;
        return fName === factory;
      });
    }

    // 교대별 그룹핑
    const byShift = {
      주간: {
        equipment: equipment.filter((e: EquipRow) => e.shift === '주간'),
        assignments: assignments.filter((a: AssignRow) => a.shift === '주간'),
      },
      야간: {
        equipment: equipment.filter((e: EquipRow) => e.shift === '야간'),
        assignments: assignments.filter((a: AssignRow) => a.shift === '야간'),
      },
    };

    return NextResponse.json({
      date,
      factory: factory ?? '전체',
      summary: {
        equipment_count: equipment.length / 2, // 주간+야간 중복
        day_workers: byShift.주간.assignments.length,
        night_workers: byShift.야간.assignments.length,
      },
      byShift,
    });
  }

  // 월별 조회: 일별 요약 목록
  if (month) {
    const startDate = `${month}-01`;
    const [y, m] = month.split('-').map(Number);
    const endDate = `${y}-${String(m + 1).padStart(2, '0')}-01`;

    const { data: dailyEquip, error: eqErr } = await supabase
      .from('saehan_production_plan_details')
      .select('date, shift, equipment_id')
      .gte('date', startDate)
      .lt('date', m === 12 ? `${y + 1}-01-01` : endDate)
      .eq('status', '가동');

    const { data: dailyAssign, error: asErr } = await supabase
      .from('saehan_worker_assignments')
      .select('date, shift, department')
      .gte('date', startDate)
      .lt('date', m === 12 ? `${y + 1}-01-01` : endDate)
      .eq('status', '이력');

    if (eqErr) return NextResponse.json({ error: eqErr.message }, { status: 500 });
    if (asErr) return NextResponse.json({ error: asErr.message }, { status: 500 });

    // 날짜별 집계
    const dailyMap = new Map<string, { date: string; equip_day: number; equip_night: number; workers_day: number; workers_night: number }>();

    for (const row of (dailyEquip ?? []) as DailyEquipRow[]) {
      if (!dailyMap.has(row.date)) {
        dailyMap.set(row.date, { date: row.date, equip_day: 0, equip_night: 0, workers_day: 0, workers_night: 0 });
      }
      const d = dailyMap.get(row.date)!;
      if (row.shift === '주간') d.equip_day++;
      else d.equip_night++;
    }

    for (const row of (dailyAssign ?? []) as DailyAssignRow[]) {
      if (!dailyMap.has(row.date)) {
        dailyMap.set(row.date, { date: row.date, equip_day: 0, equip_night: 0, workers_day: 0, workers_night: 0 });
      }
      const d = dailyMap.get(row.date)!;
      if (row.shift === '주간') d.workers_day++;
      else d.workers_night++;
    }

    const days = Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json({
      month,
      factory: factory ?? '전체',
      total_days: days.length,
      days,
    });
  }

  return NextResponse.json({ error: 'date 또는 month 파라미터 필요' }, { status: 400 });
}
