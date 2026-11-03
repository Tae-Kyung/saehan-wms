import { HistoryView } from '@/components/history/history-view';

export default function HistoryPage(): React.ReactElement {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">2025년 생산/배치 이력</h1>
        <p className="text-muted-foreground text-sm">
          2025년 실제 인원배치표 데이터를 날짜별로 조회합니다.
        </p>
      </div>
      <HistoryView />
    </div>
  );
}
