-- ============================================
-- 설비-제품 매핑 실데이터 기반 업데이트
-- 2025년 배치 이력에서 설비별 상위 생산 제품 매핑
-- ============================================

-- 기존 매핑 삭제 후 재생성
DELETE FROM saehan_equipment_products;

-- ──────────────────────────────────────────────
-- 1공장 설비-제품 매핑
-- ──────────────────────────────────────────────

-- 02호: 1.8HD 계열 (333건)
INSERT INTO saehan_equipment_products (equipment_id, product_id, is_default)
SELECT 'e0200000-0000-0000-0000-000000000002', id, name = '1.8HD N'
FROM saehan_products WHERE name IN ('1.8HD N', '1.8HD H', '1.8HD S', '1.5HD', '1.6HD', '1L HD')
ON CONFLICT DO NOTHING;

-- 03호: 대형 용기 (46건)
INSERT INTO saehan_equipment_products (equipment_id, product_id, is_default)
SELECT 'e0300000-0000-0000-0000-000000000003', id, name = '10L 원형'
FROM saehan_products WHERE name IN ('10L 원형', '8L 사각', '10L 뉴그린', '8L 뉴그린')
ON CONFLICT DO NOTHING;

-- 04호: 소형 공통 (271건)
INSERT INTO saehan_equipment_products (equipment_id, product_id, is_default)
SELECT 'e0400000-0000-0000-0000-000000000004', id, name = '300G 신형'
FROM saehan_products WHERE name IN ('300G 신형', '1KG 단지', '180G 팔각', '500G 단지', '2KG 단지', '180G 공통', '350G 신형')
ON CONFLICT DO NOTHING;

-- 05호: 광구류 (293건)
INSERT INTO saehan_equipment_products (equipment_id, product_id, is_default)
SELECT 'e0500000-0000-0000-0000-000000000005', id, name = '700G 광구'
FROM saehan_products WHERE name IN ('700G 광구', '400G 광구', '800G 광구', '500G 광구', '600G 광구')
ON CONFLICT DO NOTHING;

-- 06호: 대상쌈장 전용 (263건)
INSERT INTO saehan_equipment_products (equipment_id, product_id, is_default)
SELECT 'e0600000-0000-0000-0000-000000000006', id, true
FROM saehan_products WHERE name IN ('대상쌈장450')
ON CONFLICT DO NOTHING;

-- 07호: 중형 용기 (189건)
INSERT INTO saehan_equipment_products (equipment_id, product_id, is_default)
SELECT 'e0700000-0000-0000-0000-000000000007', id, name = '1.65L 원형'
FROM saehan_products WHERE name IN ('1.65L 원형', '1.65L 사각', '4.4L', '2.4KG 꿀병', '1.16L')
ON CONFLICT DO NOTHING;

-- 08호: 다품종 (209건)
INSERT INTO saehan_equipment_products (equipment_id, product_id, is_default)
SELECT 'e0800000-0000-0000-0000-000000000008', id, false
FROM saehan_products WHERE name IN ('2L', '3L', '4.4L', '500G 단지', '700G 광구')
ON CONFLICT DO NOTHING;

-- 09호: 다품종 (102건)
INSERT INTO saehan_equipment_products (equipment_id, product_id, is_default)
SELECT 'e0900000-0000-0000-0000-000000000009', id, false
FROM saehan_products WHERE name IN ('1.65L 원형', 'ST-750', '매일840', '2L', '5L')
ON CONFLICT DO NOTHING;

-- 10호: 진로/새한 (225건)
INSERT INTO saehan_equipment_products (equipment_id, product_id, is_default)
SELECT 'e0a00000-0000-0000-0000-000000000010', id, name = '진로3.6'
FROM saehan_products WHERE name IN ('진로3.6', '새한3.6', '진로5.0', '새한5.0')
ON CONFLICT DO NOTHING;

-- 11호: 후추 (7건)
INSERT INTO saehan_equipment_products (equipment_id, product_id, is_default)
SELECT 'e0b00000-0000-0000-0000-000000000011', id, true
FROM saehan_products WHERE name IN ('후추20')
ON CONFLICT DO NOTHING;

-- 12호: 후추 (8건)
INSERT INTO saehan_equipment_products (equipment_id, product_id, is_default)
SELECT 'e0c00000-0000-0000-0000-000000000012', id, true
FROM saehan_products WHERE name IN ('후추20')
ON CONFLICT DO NOTHING;

-- 13호: 풀무원스벅 (51건)
INSERT INTO saehan_equipment_products (equipment_id, product_id, is_default)
SELECT 'e0d00000-0000-0000-0000-000000000013', id, true
FROM saehan_products WHERE name IN ('풀무원스벅190')
ON CONFLICT DO NOTHING;

-- 14호: 올가니카/우리스벅 (197건)
INSERT INTO saehan_equipment_products (equipment_id, product_id, is_default)
SELECT 'e0e00000-0000-0000-0000-000000000014', id, name = '올가니카190'
FROM saehan_products WHERE name IN ('올가니카190', '우리스벅190')
ON CONFLICT DO NOTHING;

-- 15호: 생수 (126건)
INSERT INTO saehan_equipment_products (equipment_id, product_id, is_default)
SELECT 'e0f00000-0000-0000-0000-000000000015', id, name = '500생수원형'
FROM saehan_products WHERE name IN ('500생수원형', '500생수사각', '900생수', '1.5생수원형', '1.8생수원형')
ON CONFLICT DO NOTHING;

-- 16호: 소주200 (43건)
INSERT INTO saehan_equipment_products (equipment_id, product_id, is_default)
SELECT 'e1000000-0000-0000-0000-000000000016', id, true
FROM saehan_products WHERE name = '소주 200ML'
ON CONFLICT DO NOTHING;

-- 17호: 미림 (227건)
INSERT INTO saehan_equipment_products (equipment_id, product_id, is_default)
SELECT 'e1100000-0000-0000-0000-000000000017', id, name = '미림900'
FROM saehan_products WHERE name IN ('미림900', '미림500', '롯데미림900', '롯데미림500')
ON CONFLICT DO NOTHING;

-- B1호: 간장/맛술/액젓 (398건)
INSERT INTO saehan_equipment_products (equipment_id, product_id, is_default)
SELECT 'eb100000-0000-0000-0000-000000000020', id, name = '간장500'
FROM saehan_products WHERE name IN ('간장500', '맛술410', '액젓500', '미작830', '액젓1KG', '식초900', '간장900')
ON CONFLICT DO NOTHING;

-- B2호: 신형 소주병 (325건)
INSERT INTO saehan_equipment_products (equipment_id, product_id, is_default)
SELECT 'eb200000-0000-0000-0000-000000000021', id, name = '신SP1.8골드펄'
FROM saehan_products WHERE name IN ('신SP1.8골드펄', '신SP1.8PET', '간장200', '액젓250', '신SP1.8CL', '알룰로스500')
ON CONFLICT DO NOTHING;

-- ──────────────────────────────────────────────
-- 2공장 설비-제품 매핑
-- ──────────────────────────────────────────────

-- S1호: 테일러/진로 (341건, 인원산출 핵심)
INSERT INTO saehan_equipment_products (equipment_id, product_id, is_default)
SELECT 'e5100000-0000-0000-0000-000000000026', id, name = '테일러946'
FROM saehan_products WHERE name IN ('테일러946', '테일러1.89', '진로4.0', '진로2.7', '딸기청900')
ON CONFLICT DO NOTHING;

-- S2호: CJ/대상 올리고당 (620건)
INSERT INTO saehan_equipment_products (equipment_id, product_id, is_default)
SELECT 'e5200000-0000-0000-0000-000000000027', id, name = 'CJ올리고당'
FROM saehan_products WHERE name IN ('CJ올리고당', '대상올리고당', 'CJ500', '간장840', '참치액', '마이노멀500')
ON CONFLICT DO NOTHING;

-- S3호: 초고추장/간장 (629건)
INSERT INTO saehan_equipment_products (equipment_id, product_id, is_default)
SELECT 'e5300000-0000-0000-0000-000000000028', id, name = '초고추장'
FROM saehan_products WHERE name IN ('초고추장', '간장840', '마이노멀500', '신광야950', '대상올리고당', '광야500', '호프1.0')
ON CONFLICT DO NOTHING;

-- S4호: 신새한/참기름/간장 (525건)
INSERT INTO saehan_equipment_products (equipment_id, product_id, is_default)
SELECT 'e5400000-0000-0000-0000-000000000029', id, name = '신새한1.8'
FROM saehan_products WHERE name IN ('신새한1.8', '생수900', '간장1.7', '호프1.0', '간장1.8', '참기름1.5')
ON CONFLICT DO NOTHING;

-- S5호: 미림/간장 (444건)
INSERT INTO saehan_equipment_products (equipment_id, product_id, is_default)
SELECT 'e5500000-0000-0000-0000-000000000030', id, name = '미림1.8'
FROM saehan_products WHERE name IN ('미림1.8', '간장1.7', '미림2.0', '어간장830')
ON CONFLICT DO NOTHING;

-- S6호: 지평/홍초 (493건)
INSERT INTO saehan_equipment_products (equipment_id, product_id, is_default)
SELECT 'e5600000-0000-0000-0000-000000000031', id, name = '지평1.7'
FROM saehan_products WHERE name IN ('지평1.7', '홍초900', '홍초500', '홍초1.5')
ON CONFLICT DO NOTHING;

-- S7호: 진로/소주 (523건)
INSERT INTO saehan_equipment_products (equipment_id, product_id, is_default)
SELECT 'e5700000-0000-0000-0000-000000000032', id, name = '진로1.8'
FROM saehan_products WHERE name IN ('진로1.8', '신진로1.8', '일반1.8', '구진로1.8')
ON CONFLICT DO NOTHING;

-- P1호: 프리폼 (118건)
INSERT INTO saehan_equipment_products (equipment_id, product_id, is_default)
SELECT 'ep100000-0000-0000-0000-000000000033', id, name = '진로4.0'
FROM saehan_products WHERE name IN ('진로4.0', '올리고당', '테일러86', '진로투명')
ON CONFLICT DO NOTHING;

-- P2호~P4호: 소량
INSERT INTO saehan_equipment_products (equipment_id, product_id, is_default)
SELECT 'ep200000-0000-0000-0000-000000000034', id, true
FROM saehan_products WHERE name = '테일러86'
ON CONFLICT DO NOTHING;

INSERT INTO saehan_equipment_products (equipment_id, product_id, is_default)
SELECT 'ep400000-0000-0000-0000-000000000036', id, true
FROM saehan_products WHERE name = '진로투명'
ON CONFLICT DO NOTHING;
