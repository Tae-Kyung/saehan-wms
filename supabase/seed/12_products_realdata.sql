-- ============================================
-- 제품 마스터 실데이터 기반 확장 (2025년 배치표에서 추출)
--
-- 451종 제품명 변형을 ~80종 정규 제품으로 통합
-- 인원산출 규칙에 직접 영향을 미치는 제품 + 상위 빈도 제품 우선 등록
-- box_count_12h는 기존 시드 데이터가 있는 경우 유지, 없으면 NULL
-- ============================================

-- 기존 시드 제품과 충돌 방지 위해 ON CONFLICT 사용
-- name 컬럼에 unique 인덱스가 없으므로 INSERT 전 중복 체크

-- ──────────────────────────────────────────────
-- 1공장 주요 제품 (실제 배치 빈도 상위)
-- ──────────────────────────────────────────────

-- 02호 계열 (1.8HD)
INSERT INTO saehan_products (name, volume_ml, packaging_unit)
SELECT * FROM (VALUES
  ('1.8HD N', 1800, '박스'),
  ('1.8HD H', 1800, '박스'),
  ('1.8HD S', 1800, '박스'),
  ('1.5HD', 1500, '박스'),
  ('1.6HD', 1600, '박스'),
  ('1L HD', 1000, '박스')
) AS v(name, volume_ml, packaging_unit)
WHERE NOT EXISTS (SELECT 1 FROM saehan_products sp WHERE sp.name = v.name);

-- 03호 계열 (대형 용기)
INSERT INTO saehan_products (name, volume_ml, packaging_unit)
SELECT * FROM (VALUES
  ('10L 원형', 10000, '박스'),
  ('8L 사각', 8000, '박스'),
  ('10L 뉴그린', 10000, '박스'),
  ('8L 뉴그린', 8000, '박스'),
  ('15L 뉴그린', 15000, '박스'),
  ('20L 뉴그린', 20000, '박스'),
  ('22L 뉴그린', 22000, '박스'),
  ('25L 뉴그린', 25000, '박스'),
  ('30L 뉴그린', 30000, '박스'),
  ('10L 청매실', 10000, '박스'),
  ('15L 청매실', 15000, '박스'),
  ('20L 청매실', 20000, '박스'),
  ('15L 과실주', 15000, '박스'),
  ('20L 과실주', 20000, '박스'),
  ('22L 과실주', 22000, '박스'),
  ('12L 과실주', 12000, '박스')
) AS v(name, volume_ml, packaging_unit)
WHERE NOT EXISTS (SELECT 1 FROM saehan_products sp WHERE sp.name = v.name);

-- 04호 계열 (소형 공통)
INSERT INTO saehan_products (name, volume_ml, packaging_unit)
SELECT * FROM (VALUES
  ('300G 신형', 300, '박스'),
  ('180G 팔각', 180, '박스'),
  ('180G 공통', 180, '박스'),
  ('350G 신형', 350, '박스'),
  ('350G 18각', 350, '박스'),
  ('250G 공통', 250, '박스'),
  ('200G 공통', 200, '박스'),
  ('400G 공통', 400, '박스'),
  ('1KG 단지', 1000, '박스'),
  ('2KG 단지', 2000, '박스'),
  ('3KG 단지', 3000, '박스'),
  ('500G 단지', 500, '박스'),
  ('1KG 옹기', 1000, '박스'),
  ('1KG 광구', 1000, '박스')
) AS v(name, volume_ml, packaging_unit)
WHERE NOT EXISTS (SELECT 1 FROM saehan_products sp WHERE sp.name = v.name);

-- 05호 계열 (광구류)
INSERT INTO saehan_products (name, volume_ml, packaging_unit)
SELECT * FROM (VALUES
  ('700G 광구', 700, '박스'),
  ('400G 광구', 400, '박스'),
  ('800G 광구', 800, '박스'),
  ('500G 광구', 500, '박스'),
  ('600G 광구', 600, '박스'),
  ('300G 공통', 300, '박스')
) AS v(name, volume_ml, packaging_unit)
WHERE NOT EXISTS (SELECT 1 FROM saehan_products sp WHERE sp.name = v.name);

-- 06호 (쌈장 전용)
INSERT INTO saehan_products (name, volume_ml, packaging_unit)
SELECT * FROM (VALUES
  ('대상쌈장450', 450, '박스')
) AS v(name, volume_ml, packaging_unit)
WHERE NOT EXISTS (SELECT 1 FROM saehan_products sp WHERE sp.name = v.name);

-- 07호 계열
INSERT INTO saehan_products (name, volume_ml, packaging_unit)
SELECT * FROM (VALUES
  ('1.65L 원형', 1650, '박스'),
  ('1.65L 사각', 1650, '박스'),
  ('1.16L', 1160, '박스'),
  ('2.4KG 꿀병', 2400, '박스'),
  ('4.4L', 4400, '박스'),
  ('4.3L 사각', 4300, '박스')
) AS v(name, volume_ml, packaging_unit)
WHERE NOT EXISTS (SELECT 1 FROM saehan_products sp WHERE sp.name = v.name);

-- 08호/09호 계열 (다품종)
INSERT INTO saehan_products (name, volume_ml, packaging_unit)
SELECT * FROM (VALUES
  ('2L', 2000, '박스'),
  ('3L', 3000, '박스'),
  ('5L', 5000, '박스'),
  ('ST-750', 750, '박스'),
  ('매일840', 840, '박스'),
  ('매일960', 960, '박스'),
  ('CJ매실청500', 500, '박스'),
  ('CJ매실청800', 800, '박스'),
  ('대상참치250', 250, '박스'),
  ('대상액젓250', 250, '박스')
) AS v(name, volume_ml, packaging_unit)
WHERE NOT EXISTS (SELECT 1 FROM saehan_products sp WHERE sp.name = v.name);

-- 10호 (진로/새한 대형)
INSERT INTO saehan_products (name, volume_ml, packaging_unit)
SELECT * FROM (VALUES
  ('진로3.6', 3600, '박스'),
  ('새한3.6', 3600, '박스'),
  ('진로5.0', 5000, '박스'),
  ('새한5.0', 5000, '박스')
) AS v(name, volume_ml, packaging_unit)
WHERE NOT EXISTS (SELECT 1 FROM saehan_products sp WHERE sp.name = v.name);

-- 13호 (풀무원스벅)
INSERT INTO saehan_products (name, volume_ml, packaging_unit)
SELECT * FROM (VALUES
  ('풀무원스벅190', 190, '박스')
) AS v(name, volume_ml, packaging_unit)
WHERE NOT EXISTS (SELECT 1 FROM saehan_products sp WHERE sp.name = v.name);

-- 14호 (올가니카/우리스벅)
INSERT INTO saehan_products (name, volume_ml, packaging_unit)
SELECT * FROM (VALUES
  ('올가니카190', 190, '박스'),
  ('우리스벅190', 190, '박스')
) AS v(name, volume_ml, packaging_unit)
WHERE NOT EXISTS (SELECT 1 FROM saehan_products sp WHERE sp.name = v.name);

-- 15호 (생수류)
INSERT INTO saehan_products (name, volume_ml, packaging_unit)
SELECT * FROM (VALUES
  ('500생수원형', 500, '박스'),
  ('500생수사각', 500, '박스'),
  ('900생수', 900, '박스'),
  ('1.5생수원형', 1500, '박스'),
  ('1.8생수원형', 1800, '박스')
) AS v(name, volume_ml, packaging_unit)
WHERE NOT EXISTS (SELECT 1 FROM saehan_products sp WHERE sp.name = v.name);

-- 16호 (소주200)
-- 이미 시드에 있음 (소주 200ML)

-- 17호 (미림)
INSERT INTO saehan_products (name, volume_ml, packaging_unit)
SELECT * FROM (VALUES
  ('미림900', 900, '박스'),
  ('미림500', 500, '박스'),
  ('롯데미림900', 900, '박스'),
  ('롯데미림500', 500, '박스')
) AS v(name, volume_ml, packaging_unit)
WHERE NOT EXISTS (SELECT 1 FROM saehan_products sp WHERE sp.name = v.name);

-- B-1호 (간장/맛술/액젓)
INSERT INTO saehan_products (name, volume_ml, packaging_unit)
SELECT * FROM (VALUES
  ('간장500', 500, '박스'),
  ('맛술410', 410, '박스'),
  ('액젓500', 500, '박스'),
  ('액젓1KG', 1000, '박스'),
  ('액젓250', 250, '박스'),
  ('미작830', 830, '박스'),
  ('간장200', 200, '박스'),
  ('식초900', 900, '박스'),
  ('간장900', 900, '박스'),
  ('어간장410', 410, '박스')
) AS v(name, volume_ml, packaging_unit)
WHERE NOT EXISTS (SELECT 1 FROM saehan_products sp WHERE sp.name = v.name);

-- B-2호 (신형 소주병/간장)
INSERT INTO saehan_products (name, volume_ml, packaging_unit)
SELECT * FROM (VALUES
  ('신SP1.8골드펄', 1800, '박스'),
  ('신SP1.8PET', 1800, '박스'),
  ('신SP1.8CL', 1800, '박스'),
  ('알룰로스500', 500, '박스'),
  ('참치액250', 250, '박스'),
  ('참치액830', 830, '박스')
) AS v(name, volume_ml, packaging_unit)
WHERE NOT EXISTS (SELECT 1 FROM saehan_products sp WHERE sp.name = v.name);

-- ──────────────────────────────────────────────
-- 2공장 주요 제품
-- ──────────────────────────────────────────────

-- S-1호 (테일러/진로)
INSERT INTO saehan_products (name, volume_ml, packaging_unit)
SELECT * FROM (VALUES
  ('테일러946', 946, '파렛트'),
  ('테일러1.89', 1890, '파렛트'),
  ('진로2.7', 2700, '파렛트'),
  ('딸기청900', 900, '박스')
) AS v(name, volume_ml, packaging_unit)
WHERE NOT EXISTS (SELECT 1 FROM saehan_products sp WHERE sp.name = v.name);

-- S-2호 (CJ/대상 올리고당)
INSERT INTO saehan_products (name, volume_ml, packaging_unit)
SELECT * FROM (VALUES
  ('CJ올리고당', 1200, '박스'),
  ('대상올리고당', 1200, '박스'),
  ('CJ500', 500, '박스'),
  ('간장840', 840, '박스'),
  ('참치액', 250, '박스'),
  ('마이노멀500', 500, '박스'),
  ('마이노멀900', 900, '박스')
) AS v(name, volume_ml, packaging_unit)
WHERE NOT EXISTS (SELECT 1 FROM saehan_products sp WHERE sp.name = v.name);

-- S-3호 (초고추장/간장/광야)
INSERT INTO saehan_products (name, volume_ml, packaging_unit)
SELECT * FROM (VALUES
  ('초고추장', 1000, '박스'),
  ('신광야950', 950, '박스'),
  ('광야500', 500, '박스'),
  ('호프1.0', 1000, '박스'),
  ('호프1.5', 1500, '박스')
) AS v(name, volume_ml, packaging_unit)
WHERE NOT EXISTS (SELECT 1 FROM saehan_products sp WHERE sp.name = v.name);

-- S-4호 (신새한/생수/간장)
INSERT INTO saehan_products (name, volume_ml, packaging_unit)
SELECT * FROM (VALUES
  ('신새한1.8', 1800, '박스'),
  ('생수900', 900, '박스'),
  ('간장1.7', 1700, '박스'),
  ('간장1.8', 1800, '박스'),
  ('참기름1.5', 1500, '박스')
) AS v(name, volume_ml, packaging_unit)
WHERE NOT EXISTS (SELECT 1 FROM saehan_products sp WHERE sp.name = v.name);

-- S-5호 (미림/간장)
INSERT INTO saehan_products (name, volume_ml, packaging_unit)
SELECT * FROM (VALUES
  ('미림1.8', 1800, '박스'),
  ('미림2.0', 2000, '박스'),
  ('어간장830', 830, '박스')
) AS v(name, volume_ml, packaging_unit)
WHERE NOT EXISTS (SELECT 1 FROM saehan_products sp WHERE sp.name = v.name);

-- S-6호 (지평/홍초)
INSERT INTO saehan_products (name, volume_ml, packaging_unit)
SELECT * FROM (VALUES
  ('지평1.7', 1700, '박스'),
  ('홍초900', 900, '박스'),
  ('홍초500', 500, '박스'),
  ('홍초1.5', 1500, '박스')
) AS v(name, volume_ml, packaging_unit)
WHERE NOT EXISTS (SELECT 1 FROM saehan_products sp WHERE sp.name = v.name);

-- S-7호 (진로/신진로/일반 소주)
INSERT INTO saehan_products (name, volume_ml, packaging_unit)
SELECT * FROM (VALUES
  ('진로1.8', 1800, '박스'),
  ('신진로1.8', 1800, '박스'),
  ('일반1.8', 1800, '박스'),
  ('구진로1.8', 1800, '박스')
) AS v(name, volume_ml, packaging_unit)
WHERE NOT EXISTS (SELECT 1 FROM saehan_products sp WHERE sp.name = v.name);

-- P-1호 (프리폼)
INSERT INTO saehan_products (name, volume_ml, packaging_unit)
SELECT * FROM (VALUES
  ('진로4.0', 4000, '파렛트'),
  ('올리고당', 1200, '박스'),
  ('테일러86', 860, '파렛트'),
  ('진로투명', 4000, '파렛트')
) AS v(name, volume_ml, packaging_unit)
WHERE NOT EXISTS (SELECT 1 FROM saehan_products sp WHERE sp.name = v.name);
