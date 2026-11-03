-- ============================================
-- 직원 마스터 실데이터 기반 업데이트 (2025년 출근부)
--
-- 출처: app/data/parsed/employees.json (1공장 출근부 6월)
-- 변경:
--   1. 시드에 없는 43명 추가 (1공장 주전반 + 세영 협력사)
--   2. 교대조 불일치 수정 (칭군 A→C, 프라카스 A→A 유지 등)
--   3. 1공장에서 미발견된 피너 6명 퇴사 처리
-- 주의: 2공장 직원(32명)은 출근부 데이터 없으므로 기존 시드 유지
-- ============================================

-- ──────────────────────────────────────────────
-- 1. 교대조 불일치 수정
-- ──────────────────────────────────────────────

-- 칭군: 시드 A조 → 실데이터 C조
UPDATE saehan_employees SET shift_group = 'C' WHERE name = '칭군' AND department = '생산1팀PET';

-- 프라카스: 시드 A조 → 실데이터에서 A조 확인 (유지)
-- 나빈: 시드 A조 → 실데이터 C조에서 발견 (수정 보류 - 교대조 변경 가능)

-- ──────────────────────────────────────────────
-- 2. 미발견 직원 퇴사 처리 (피너 파견직 6명)
-- ──────────────────────────────────────────────
UPDATE saehan_employees SET status = '퇴사'
WHERE name IN ('세레노바 무나라', '강나현', '김희숙', '이성애', '김연향', '이지원')
  AND department = '생산1팀PET';

-- 신세영, 셰르조드도 2025 출근부에 미발견 → 퇴사 처리
UPDATE saehan_employees SET status = '퇴사'
WHERE name IN ('신세영', '셰르조드')
  AND department = '생산1팀PET';

-- ──────────────────────────────────────────────
-- 3. 신규 직원 추가 (1공장 주전반)
-- ──────────────────────────────────────────────

INSERT INTO saehan_employees (name, department, shift_group, role, gender, affiliation) VALUES
  ('김종남', '생산1팀PET', '주전', 'OP', 'M', '새한'),
  ('김명구', '생산1팀PET', '주전', 'OP', 'M', '새한'),
  ('안동명', '생산1팀PET', '주전', 'OP', 'M', '새한'),
  ('김정시', '생산1팀PET', '주전', 'OP', 'M', '새한'),
  ('신동건', '생산1팀PET', '주전', 'OP', 'M', '새한'),
  ('아드캄존', '생산1팀PET', '주전', '운반포장', 'M', '새한'),
  ('김광준', '생산1팀PET', '주전', 'OP', 'M', '새한')
ON CONFLICT DO NOTHING;

-- 1공장 PE 주전반
INSERT INTO saehan_employees (name, department, shift_group, role, gender, affiliation) VALUES
  ('김완수', '생산1팀PE', '주전', 'OP', 'M', '새한')
ON CONFLICT DO NOTHING;

-- ──────────────────────────────────────────────
-- 4. 1공장 PET 교대반 추가 (시드에 없는 새한 직원)
-- ──────────────────────────────────────────────

INSERT INTO saehan_employees (name, department, shift_group, role, gender, affiliation) VALUES
  ('김무용', '생산1팀PET', 'B', 'OP', 'M', '새한'),
  ('소비르', '생산1팀PET', 'B', '운반포장', 'M', '새한'),
  ('라우트', '생산1팀PET', 'B', '운반포장', 'M', '새한'),
  ('최한결', '생산1팀PET', 'C', 'OP', 'M', '새한'),
  ('버기', '생산1팀PET', 'C', '운반포장', 'M', '새한')
ON CONFLICT DO NOTHING;

-- ──────────────────────────────────────────────
-- 5. 1공장 PET 협력사 (세영) 추가
-- ──────────────────────────────────────────────

-- A조
INSERT INTO saehan_employees (name, department, shift_group, role, gender, affiliation) VALUES
  ('김유옥', '생산1팀PET', 'A', '검사원', 'F', '세영'),
  ('나라', '생산1팀PET', 'A', '검사원', 'F', '세영'),
  ('이윤지', '생산1팀PET', 'A', '검사원', 'F', '세영'),
  ('장홍', '생산1팀PET', 'A', '검사원', 'M', '세영'),
  ('최미선', '생산1팀PET', 'A', '검사원', 'F', '세영'),
  ('김숙진', '생산1팀PET', 'A', '검사원', 'F', '세영'),
  ('김경은', '생산1팀PET', 'A', '검사원', 'F', '세영'),
  ('박효순', '생산1팀PET', 'A', '검사원', 'F', '세영'),
  ('박알라', '생산1팀PET', 'A', '검사원', 'F', '세영'),
  ('손베로니카', '생산1팀PET', 'A', '검사원', 'F', '세영'),
  ('최민형', '생산1팀PET', 'A', '검사원', 'F', '세영'),
  ('정의정', '생산1팀PET', 'A', '검사원', 'F', '세영'),
  ('홍석화', '생산1팀PET', 'A', '검사원', 'F', '세영')
ON CONFLICT DO NOTHING;

-- B조
INSERT INTO saehan_employees (name, department, shift_group, role, gender, affiliation) VALUES
  ('강성희', '생산1팀PET', 'B', '검사원', 'F', '세영'),
  ('송문희', '생산1팀PET', 'B', '검사원', 'F', '세영'),
  ('유선애', '생산1팀PET', 'B', '검사원', 'F', '세영'),
  ('이상미', '생산1팀PET', 'B', '검사원', 'F', '세영'),
  ('조기순', '생산1팀PET', 'B', '검사원', 'F', '세영'),
  ('남보라', '생산1팀PET', 'B', '검사원', 'F', '세영'),
  ('박주영', '생산1팀PET', 'B', '검사원', 'F', '세영'),
  ('손란희', '생산1팀PET', 'B', '검사원', 'F', '세영'),
  ('이선화', '생산1팀PET', 'B', '검사원', 'F', '세영'),
  ('임현주', '생산1팀PET', 'B', '검사원', 'F', '세영')
ON CONFLICT DO NOTHING;

-- C조
INSERT INTO saehan_employees (name, department, shift_group, role, gender, affiliation) VALUES
  ('전효정', '생산1팀PET', 'C', '검사원', 'F', '세영'),
  ('최인실', '생산1팀PET', 'C', '검사원', 'F', '세영'),
  ('강수정', '생산1팀PET', 'C', '검사원', 'F', '세영'),
  ('김연하', '생산1팀PET', 'C', '검사원', 'F', '세영'),
  ('김진숙', '생산1팀PET', 'C', '검사원', 'F', '세영')
ON CONFLICT DO NOTHING;

-- ──────────────────────────────────────────────
-- 6. 1공장 PE 협력사 추가
-- ──────────────────────────────────────────────

INSERT INTO saehan_employees (name, department, shift_group, role, gender, affiliation) VALUES
  ('김명희', '생산1팀PE', 'A', '검사원', 'F', '세영')
ON CONFLICT DO NOTHING;

-- ──────────────────────────────────────────────
-- 7. 2공장 역할 타입 추가 (설비관리, 생산관리)
-- 기존 2공장 반장(OP)을 생산관리로 구분 필요 시 아래 쿼리 사용
-- 실제 배치표에서 2공장은 반장 대신 "설비관리"+"생산관리" 역할 사용
-- ──────────────────────────────────────────────
-- (역할 변경은 운영 팀 확인 후 적용 - 여기서는 주석 처리)
-- UPDATE saehan_employees SET role = '설비관리' WHERE name = '김경돈' AND department = '생산2팀';
-- UPDATE saehan_employees SET role = '생산관리' WHERE name = '최상진' AND department = '생산2팀';
