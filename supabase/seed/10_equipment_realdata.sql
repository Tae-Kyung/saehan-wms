-- ============================================
-- 설비 마스터 실데이터 기반 업데이트 (2025년 근태 데이터)
--
-- 변경 사항:
-- 1. 2공장 P-1~P-5호(프리폼) 설비 추가
-- 2. 설비별 가동 빈도 메타데이터 (staffing_group 활용)
-- 3. 1공장 01호 → 실제 데이터에서 미사용 확인 (검사원 라인으로만 사용)
-- ============================================

-- ──────────────────────────────────────────────
-- 2공장 프리폼 설비 추가 (P-1 ~ P-5호)
-- 실제 데이터: P-1호 118건, P-2호 6건, P-3호 6건, P-4호 5건, P-5호 0건
-- ──────────────────────────────────────────────

INSERT INTO saehan_equipment (id, factory_id, code, name, type, stage, sort_order, is_active)
VALUES
  ('ep100000-0000-0000-0000-000000000033', 'f2000000-0000-0000-0000-000000000002', 'P1', '프리폼 WJ', '프리폼', '캡', 8, true),
  ('ep200000-0000-0000-0000-000000000034', 'f2000000-0000-0000-0000-000000000002', 'P2', '프리폼 HYD', '프리폼', '캡', 9, true),
  ('ep300000-0000-0000-0000-000000000035', 'f2000000-0000-0000-0000-000000000002', 'P3', '프리폼 SDB', '프리폼', '캡', 10, true),
  ('ep400000-0000-0000-0000-000000000036', 'f2000000-0000-0000-0000-000000000002', 'P4', '프리폼', '프리폼', '캡', 11, true),
  ('ep500000-0000-0000-0000-000000000037', 'f2000000-0000-0000-0000-000000000002', 'P5', '프리폼 PCO', '프리폼', '캡', 12, true)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  stage = EXCLUDED.stage,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active;

-- ──────────────────────────────────────────────
-- 1공장 설비 가동 빈도 기반 staffing_group 업데이트
--
-- 실제 가동 빈도 (2025년, 배치 기록 수):
--   B-1:398, 2호:333, B-2:325, 5호:293, 4호:271, 6호:263
--   17호:227, 10호:225, 8호:209, 14호:197, 7호:189
--   검사원:136, 15호:126, 9호:102, 13호:51, 3호:46
--   16호:43, 12호:8, 11호:7
--
-- 가동등급: HIGH(>200), MID(50~200), LOW(<50)
-- ──────────────────────────────────────────────

UPDATE saehan_equipment SET staffing_group = 'HIGH' WHERE code IN ('02', '04', '05', '06', '08', '10', '17') AND factory_id = 'f1000000-0000-0000-0000-000000000001';
UPDATE saehan_equipment SET staffing_group = 'MID'  WHERE code IN ('03', '07', '09', '13', '14', '15', '16') AND factory_id = 'f1000000-0000-0000-0000-000000000001';
UPDATE saehan_equipment SET staffing_group = 'LOW'  WHERE code IN ('01', '11', '12', '18') AND factory_id = 'f1000000-0000-0000-0000-000000000001';
UPDATE saehan_equipment SET staffing_group = 'HIGH' WHERE code IN ('B1', 'B2') AND factory_id = 'f1000000-0000-0000-0000-000000000001';
UPDATE saehan_equipment SET staffing_group = 'LOW'  WHERE code IN ('A1', 'E1', 'E2', 'E3', 'E4') AND factory_id = 'f1000000-0000-0000-0000-000000000001';

-- 2공장 가동 빈도:
--   S-3:629, S-2:620, S-4:525, S-7:523, S-6:493, S-5:444, S-1:341
--   P-1:118, P-2:6, P-3:6, P-4:5, P-5:0
UPDATE saehan_equipment SET staffing_group = 'HIGH' WHERE code IN ('S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7') AND factory_id = 'f2000000-0000-0000-0000-000000000002';
UPDATE saehan_equipment SET staffing_group = 'MID'  WHERE code = 'P1' AND factory_id = 'f2000000-0000-0000-0000-000000000002';
UPDATE saehan_equipment SET staffing_group = 'LOW'  WHERE code IN ('P2', 'P3', 'P4', 'P5') AND factory_id = 'f2000000-0000-0000-0000-000000000002';

-- ──────────────────────────────────────────────
-- 1공장 01호: 실제 데이터에서 직접 라인 배치 기록 없음
-- (검사원 행에서만 참조, 인원배치표의 1번 행 = 검사원)
-- 01호는 검사원 전용이 아니라 배치표 구조상 1번 행이 검사원이기 때문
-- DB에서 01호 설비는 유지하되 비활성 처리
-- ──────────────────────────────────────────────
UPDATE saehan_equipment SET is_active = false WHERE code = '01' AND factory_id = 'f1000000-0000-0000-0000-000000000001';

-- 18호도 실제 배치 기록 0건 → 비활성
UPDATE saehan_equipment SET is_active = false WHERE code = '18' AND factory_id = 'f1000000-0000-0000-0000-000000000001';
