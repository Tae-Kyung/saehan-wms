'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type DaySummary = {
  date: string;
  equip_day: number;
  equip_night: number;
  workers_day: number;
  workers_night: number;
};

type EquipmentDetail = {
  date: string;
  shift: string;
  notes: string;
  equipment: {
    code: string;
    name: string | null;
    type: string | null;
    factory: { name: string } | null;
  } | null;
};

type AssignmentDetail = {
  date: string;
  shift: string;
  department: string;
  role: string;
  notes: string;
  employee: {
    name: string;
    department: string;
    shift_group: string;
    role: string;
    affiliation: string;
  } | null;
};

type MonthData = {
  month: string;
  total_days: number;
  days: DaySummary[];
};

type DayData = {
  date: string;
  factory: string;
  summary: { equipment_count: number; day_workers: number; night_workers: number };
  byShift: {
    주간: { equipment: EquipmentDetail[]; assignments: AssignmentDetail[] };
    야간: { equipment: EquipmentDetail[]; assignments: AssignmentDetail[] };
  };
};

const MONTHS = Array.from({ length: 12 }, (_, i) => `2025-${String(i + 1).padStart(2, '0')}`);
const DOW = ['일', '월', '화', '수', '목', '금', '토'];

function getDow(dateStr: string): string {
  return DOW[new Date(dateStr).getDay()];
}

function isWeekend(dateStr: string): boolean {
  const d = new Date(dateStr).getDay();
  return d === 0 || d === 6;
}

export function HistoryView(): React.ReactElement {
  const [selectedMonth, setSelectedMonth] = useState('2025-06');
  const [selectedFactory, setSelectedFactory] = useState<string>('전체');
  const [monthData, setMonthData] = useState<MonthData | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dayData, setDayData] = useState<DayData | null>(null);
  const [loading, setLoading] = useState(false);

  const loadMonth = useCallback(async (month: string): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch(`/api/history?month=${month}`);
      const data = await res.json();
      setMonthData(data);
    } catch {
      setMonthData(null);
    }
    setLoading(false);
  }, []);

  const loadDay = useCallback(async (date: string, factory: string): Promise<void> => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ date });
      if (factory !== '전체') params.set('factory', factory);
      const res = await fetch(`/api/history?${params}`);
      const data = await res.json();
      setDayData(data);
    } catch {
      setDayData(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadMonth(selectedMonth);
  }, [selectedMonth, loadMonth]);

  useEffect(() => {
    if (selectedDate) {
      loadDay(selectedDate, selectedFactory);
    }
  }, [selectedDate, selectedFactory, loadDay]);

  return (
    <div className="space-y-4">
      {/* 월 선택 + 공장 필터 */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-1">
            {MONTHS.map((m) => (
              <Button
                key={m}
                size="sm"
                variant={selectedMonth === m ? 'default' : 'outline'}
                onClick={() => { setSelectedMonth(m); setSelectedDate(null); setDayData(null); }}
                className="text-xs px-2"
              >
                {parseInt(m.split('-')[1])}월
              </Button>
            ))}
          </div>
          <div className="flex gap-1 ml-auto">
            {['전체', '1공장', '2공장'].map((f) => (
              <Button
                key={f}
                size="sm"
                variant={selectedFactory === f ? 'default' : 'outline'}
                onClick={() => setSelectedFactory(f)}
                className="text-xs"
              >
                {f}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {loading && <p className="text-center text-muted-foreground py-4">로딩 중...</p>}

      {/* 월별 일자 목록 */}
      {monthData && !selectedDate && (
        <Card className="overflow-hidden">
          <div className="border-b bg-gray-50 px-4 py-3">
            <h3 className="font-semibold">{selectedMonth} 일별 현황</h3>
            <p className="text-xs text-muted-foreground">{monthData.total_days}일 데이터</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs">
                <tr>
                  <th className="px-3 py-2 text-left">날짜</th>
                  <th className="px-3 py-2 text-left">요일</th>
                  <th className="px-3 py-2 text-right">주간 설비</th>
                  <th className="px-3 py-2 text-right">야간 설비</th>
                  <th className="px-3 py-2 text-right">주간 인원</th>
                  <th className="px-3 py-2 text-right">야간 인원</th>
                  <th className="px-3 py-2 text-right">합계</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {monthData.days.map((day) => (
                  <tr
                    key={day.date}
                    className={`border-t hover:bg-blue-50 cursor-pointer ${isWeekend(day.date) ? 'bg-red-50/50' : ''}`}
                    onClick={() => setSelectedDate(day.date)}
                  >
                    <td className="px-3 py-2 font-mono">{day.date}</td>
                    <td className={`px-3 py-2 ${isWeekend(day.date) ? 'text-red-500 font-bold' : ''}`}>
                      {getDow(day.date)}
                    </td>
                    <td className="px-3 py-2 text-right">{day.equip_day}</td>
                    <td className="px-3 py-2 text-right">{day.equip_night}</td>
                    <td className="px-3 py-2 text-right font-semibold">{day.workers_day}</td>
                    <td className="px-3 py-2 text-right font-semibold">{day.workers_night}</td>
                    <td className="px-3 py-2 text-right font-bold">
                      {day.workers_day + day.workers_night}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <span className="text-blue-500 text-xs">상세 →</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* 일별 상세 */}
      {selectedDate && dayData && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => { setSelectedDate(null); setDayData(null); }}>
              ← 목록으로
            </Button>
            <h3 className="font-semibold text-lg">
              {selectedDate} ({getDow(selectedDate)}) 배치 상세
            </h3>
            <Badge variant="outline">{dayData.factory}</Badge>
          </div>

          {/* 요약 카드 */}
          <div className="grid gap-3 grid-cols-3">
            <Card className="p-3 text-center">
              <p className="text-muted-foreground text-xs">가동 설비</p>
              <p className="text-2xl font-bold">{dayData.summary.equipment_count}</p>
            </Card>
            <Card className="p-3 text-center">
              <p className="text-muted-foreground text-xs">주간 인원</p>
              <p className="text-2xl font-bold text-blue-600">{dayData.summary.day_workers}</p>
            </Card>
            <Card className="p-3 text-center">
              <p className="text-muted-foreground text-xs">야간 인원</p>
              <p className="text-2xl font-bold text-gray-600">{dayData.summary.night_workers}</p>
            </Card>
          </div>

          {/* 교대별 상세 */}
          {(['주간', '야간'] as const).map((shift) => {
            const shiftData = dayData.byShift[shift];
            if (!shiftData) return null;
            return (
              <Card key={shift} className="overflow-hidden">
                <div className={`border-b px-4 py-2 ${shift === '주간' ? 'bg-blue-50' : 'bg-gray-100'}`}>
                  <h4 className="font-semibold">{shift} 근무</h4>
                  <span className="text-xs text-muted-foreground">
                    설비 {shiftData.equipment.length}대 | 인원 {shiftData.assignments.length}명
                  </span>
                </div>

                <div className="p-4 space-y-3">
                  {/* 설비 가동 */}
                  {shiftData.equipment.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">가동 설비</p>
                      <div className="flex flex-wrap gap-1">
                        {shiftData.equipment.map((eq, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {eq.equipment?.code ?? '?'}: {eq.notes || '-'}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 배치 인원 */}
                  {shiftData.assignments.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">배치 인원</p>
                      <table className="w-full text-xs">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-2 py-1 text-left">이름</th>
                            <th className="px-2 py-1 text-left">부서</th>
                            <th className="px-2 py-1 text-left">역할</th>
                            <th className="px-2 py-1 text-left">소속</th>
                          </tr>
                        </thead>
                        <tbody>
                          {shiftData.assignments.map((a, i) => (
                            <tr key={i} className="border-t">
                              <td className="px-2 py-1 font-medium">
                                {a.employee?.name ?? a.notes}
                              </td>
                              <td className="px-2 py-1">{a.department}</td>
                              <td className="px-2 py-1">{a.role}</td>
                              <td className="px-2 py-1">
                                {a.employee?.affiliation && (
                                  <Badge variant={a.employee.affiliation === '새한' ? 'default' : 'secondary'} className="text-[10px]">
                                    {a.employee.affiliation}
                                  </Badge>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
