'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

// ============================================
// 타입 정의
// ============================================

type EmployeeOption = {
  id: string;
  name: string;
  department: string;
  shift_group: string;
  role: string;
  affiliation: string;
};

type LeaveRequest = {
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

type Props = {
  employees: EmployeeOption[];
  leaveRequests: LeaveRequest[];
};

const DEPARTMENTS = ['생산1팀PET', '생산1팀PE', '생산2팀'] as const;
const STATUS_OPTIONS = ['all', '대기', '승인'] as const;

// ============================================
// 메인 컴포넌트
// ============================================

export function LeaveManagement({ employees, leaveRequests: initialRequests }: Props): React.ReactElement {
  const [activeTab, setActiveTab] = useState<string>('list');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="list">신청 현황</TabsTrigger>
        <TabsTrigger value="form">휴무 신청</TabsTrigger>
      </TabsList>

      <TabsContent value="list">
        <LeaveRequestList initialRequests={initialRequests} />
      </TabsContent>

      <TabsContent value="form">
        <LeaveRequestForm
          employees={employees}
          onSubmitted={() => setActiveTab('list')}
        />
      </TabsContent>
    </Tabs>
  );
}

// ============================================
// 신청 현황 (리스트)
// ============================================

function LeaveRequestList({ initialRequests }: { initialRequests: LeaveRequest[] }): React.ReactElement {
  const router = useRouter();
  const [requests, setRequests] = useState<LeaveRequest[]>(initialRequests);
  const [filterDept, setFilterDept] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [processing, setProcessing] = useState<string | null>(null);

  const filtered = useMemo((): LeaveRequest[] => {
    return requests.filter((r) => {
      if (filterDept !== 'all' && r.department !== filterDept) return false;
      if (filterStatus !== 'all' && r.status !== filterStatus) return false;
      return true;
    });
  }, [requests, filterDept, filterStatus]);

  async function handleAction(id: string, action: 'approve' | 'reject'): Promise<void> {
    const label = action === 'approve' ? '승인' : '반려';
    if (!confirm(`이 휴무 신청을 ${label}하시겠습니까?`)) return;

    setProcessing(id);
    try {
      const res = await fetch('/api/leave-requests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });

      if (!res.ok) {
        const err = await res.json() as { error?: string };
        alert(err.error ?? `${label} 실패`);
        return;
      }

      if (action === 'approve') {
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: '승인' as const } : r)),
        );
      } else {
        // 반려 시 목록에서 제거
        setRequests((prev) => prev.filter((r) => r.id !== id));
      }

      router.refresh();
    } catch {
      alert(`${label} 중 오류가 발생했습니다.`);
    } finally {
      setProcessing(null);
    }
  }

  function formatDate(dateStr: string): string {
    const d = new Date(dateStr + 'T00:00:00');
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const day = dayNames[d.getDay()];
    return `${dateStr} (${day})`;
  }

  return (
    <div className="mt-4 space-y-4">
      {/* 필터 영역 */}
      <div className="flex flex-wrap items-center gap-3">
        {/* 부서 필터 */}
        <div className="flex gap-1">
          <button
            onClick={() => setFilterDept('all')}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              filterDept === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80',
            )}
          >
            전체 부서
          </button>
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept}
              onClick={() => setFilterDept(dept)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                filterDept === dept
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80',
              )}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* 상태 필터 */}
        <div className="flex gap-1">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                filterStatus === s
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80',
              )}
            >
              {s === 'all' ? '전체 상태' : s}
            </button>
          ))}
        </div>

        <span className="text-muted-foreground text-sm">{filtered.length}건</span>
      </div>

      {/* 신청 목록 테이블 */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-3 py-3 text-left font-medium sm:px-4">신청일</th>
                <th className="px-3 py-3 text-left font-medium sm:px-4">직원</th>
                <th className="hidden px-3 py-3 text-left font-medium sm:table-cell sm:px-4">부서</th>
                <th className="hidden px-3 py-3 text-center font-medium md:table-cell md:px-4">조</th>
                <th className="px-3 py-3 text-left font-medium sm:px-4">휴무일</th>
                <th className="hidden px-3 py-3 text-left font-medium md:table-cell md:px-4">사유</th>
                <th className="px-3 py-3 text-center font-medium sm:px-4">상태</th>
                <th className="px-3 py-3 text-center font-medium sm:px-4">처리</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((req) => (
                <tr key={req.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-3 py-3 text-muted-foreground sm:px-4">
                    {req.created_at ? new Date(req.created_at).toLocaleDateString('ko-KR') : '-'}
                  </td>
                  <td className="px-3 py-3 font-medium sm:px-4">
                    {req.employee_name}
                    <span className="ml-1 text-xs text-muted-foreground">
                      ({req.affiliation})
                    </span>
                  </td>
                  <td className="hidden px-3 py-3 sm:table-cell sm:px-4">{req.department}</td>
                  <td className="hidden px-3 py-3 text-center md:table-cell md:px-4">
                    <Badge variant="outline">{req.shift_group}조</Badge>
                  </td>
                  <td className="px-3 py-3 sm:px-4">{formatDate(req.date)}</td>
                  <td className="hidden max-w-[200px] truncate px-3 py-3 md:table-cell md:px-4">
                    {req.reason || '-'}
                  </td>
                  <td className="px-3 py-3 text-center sm:px-4">
                    <StatusBadge status={req.status} />
                  </td>
                  <td className="px-3 py-3 text-center sm:px-4">
                    {req.status === '대기' ? (
                      <div className="flex justify-center gap-1">
                        <Button
                          size="sm"
                          variant="default"
                          disabled={processing === req.id}
                          onClick={() => handleAction(req.id, 'approve')}
                        >
                          {processing === req.id ? '...' : '승인'}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={processing === req.id}
                          onClick={() => handleAction(req.id, 'reject')}
                        >
                          {processing === req.id ? '...' : '반려'}
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">처리 완료</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                    휴무 신청 내역이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ============================================
// 상태 뱃지
// ============================================

function StatusBadge({ status }: { status: '대기' | '승인' }): React.ReactElement {
  if (status === '대기') {
    return (
      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
        대기
      </Badge>
    );
  }
  return (
    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
      승인
    </Badge>
  );
}

// ============================================
// 휴무 신청 폼
// ============================================

function LeaveRequestForm({
  employees,
  onSubmitted,
}: {
  employees: EmployeeOption[];
  onSubmitted: () => void;
}): React.ReactElement {
  const router = useRouter();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const selectedEmployee = useMemo((): EmployeeOption | undefined => {
    return employees.find((e) => e.id === selectedEmployeeId);
  }, [employees, selectedEmployeeId]);

  const filteredEmployees = useMemo((): EmployeeOption[] => {
    if (!search) return employees;
    const q = search.toLowerCase();
    return employees.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q) ||
        e.affiliation.toLowerCase().includes(q),
    );
  }, [employees, search]);

  function handleSelectEmployee(emp: EmployeeOption): void {
    setSelectedEmployeeId(emp.id);
    setSearch(emp.name);
    setShowDropdown(false);
  }

  async function handleSubmit(): Promise<void> {
    setError('');
    setSuccess('');

    if (!selectedEmployeeId) {
      setError('직원을 선택하세요.');
      return;
    }
    if (!date) {
      setError('휴무일을 선택하세요.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/leave-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employee_id: selectedEmployeeId,
          date,
          reason,
        }),
      });

      if (!res.ok) {
        const err = await res.json() as { error?: string };
        setError(err.error ?? '신청 실패');
        return;
      }

      setSuccess('휴무 신청이 완료되었습니다.');
      setSelectedEmployeeId('');
      setSearch('');
      setDate('');
      setReason('');

      router.refresh();

      // 잠시 후 목록 탭으로 이동
      setTimeout(() => {
        onSubmitted();
      }, 1000);
    } catch {
      setError('신청 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  }

  // 오늘 이후 날짜만 선택 가능하도록 min 설정
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="mt-4">
      <Card className="mx-auto max-w-lg p-6">
        <h3 className="mb-4 text-lg font-semibold">휴무 신청</h3>

        <div className="space-y-4">
          {/* 직원 선택 (검색 가능) */}
          <div className="relative">
            <Label>직원 선택 *</Label>
            <Input
              placeholder="이름, 부서, 소속으로 검색..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowDropdown(true);
                if (!e.target.value) setSelectedEmployeeId('');
              }}
              onFocus={() => setShowDropdown(true)}
            />
            {selectedEmployee && (
              <p className="mt-1 text-xs text-muted-foreground">
                {selectedEmployee.department} / {selectedEmployee.shift_group}조 / {selectedEmployee.role} / {selectedEmployee.affiliation}
              </p>
            )}

            {/* 검색 드롭다운 */}
            {showDropdown && search && (
              <div className="absolute z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border bg-popover shadow-md">
                {filteredEmployees.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    검색 결과가 없습니다.
                  </div>
                ) : (
                  filteredEmployees.slice(0, 20).map((emp) => (
                    <button
                      key={emp.id}
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted"
                      onClick={() => handleSelectEmployee(emp)}
                    >
                      <span className="font-medium">{emp.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {emp.department} / {emp.shift_group}조 / {emp.affiliation}
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* 날짜 선택 */}
          <div>
            <Label>휴무일 *</Label>
            <Input
              type="date"
              value={date}
              min={today}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* 사유 */}
          <div>
            <Label>사유</Label>
            <Textarea
              placeholder="휴무 사유를 입력하세요 (선택사항)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>

          {/* 에러/성공 메시지 */}
          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          {/* 제출 버튼 */}
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? '신청 중...' : '휴무 신청'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
