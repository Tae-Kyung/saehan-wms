-- 2025년 배치 이력 전용 테이블
-- 기존 테이블의 FK/NOT NULL 제약을 우회하기 위해 독립 테이블 사용

CREATE TABLE IF NOT EXISTS saehan_history_equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  shift TEXT NOT NULL,
  equipment_code TEXT NOT NULL,
  product TEXT,
  factory TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS saehan_history_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  shift TEXT NOT NULL,
  department TEXT,
  role TEXT,
  worker_name TEXT NOT NULL,
  factory TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_hist_eq_date ON saehan_history_equipment(date);
CREATE INDEX IF NOT EXISTS idx_hist_as_date ON saehan_history_assignments(date);

-- RLS
ALTER TABLE saehan_history_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE saehan_history_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read_history_eq" ON saehan_history_equipment FOR SELECT TO authenticated USING (true);
CREATE POLICY "read_history_as" ON saehan_history_assignments FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_history_eq" ON saehan_history_equipment FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "insert_history_as" ON saehan_history_assignments FOR INSERT TO authenticated WITH CHECK (true);
