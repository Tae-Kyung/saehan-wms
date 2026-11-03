-- ============================================
-- box_count_12h 업데이트 (12_products_realdata.sql 제품)
--
-- 방법: 05_products_sample.sql의 기존 box_count_12h 값을 기준으로
-- 동일/유사 제품명의 12_products_realdata.sql 제품에 매핑
--
-- 매핑 근거:
--   - 동일 용량(ml) 제품 → 동일 box_count_12h 적용
--   - 용량 비례 추정: box_count ∝ 1/volume (같은 설비 생산량 기준)
--   - 기존 시드에 없는 제품은 용량 기반 추정치 사용
-- ============================================

-- ──────────────────────────────────────────────
-- 1공장 제품 box_count_12h 업데이트
-- ──────────────────────────────────────────────

-- 10호 계열: 진로3.6 / 새한3.6 → '새한 3.6L' (147.3)
UPDATE saehan_products SET box_count_12h = 147.3 WHERE name = '진로3.6' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 147.3 WHERE name = '새한3.6' AND box_count_12h IS NULL;

-- 10호 계열: 진로5.0 / 새한5.0 → '새한 5.0L' (122.7)
UPDATE saehan_products SET box_count_12h = 122.7 WHERE name = '진로5.0' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 122.7 WHERE name = '새한5.0' AND box_count_12h IS NULL;

-- 06호: 대상쌈장450 → '대상 쌈장 450ML' (375.0)
UPDATE saehan_products SET box_count_12h = 375.0 WHERE name = '대상쌈장450' AND box_count_12h IS NULL;

-- 08/09호 계열: 매일840 → '대상 양념장 840ML' (416.7) - 동일 용량대
UPDATE saehan_products SET box_count_12h = 416.7 WHERE name = '매일840' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 416.7 WHERE name = '매일960' AND box_count_12h IS NULL;

-- 04호 소형 계열: 180G/200G/250G/300G/350G/400G → '소금 180ML' (312.5) 기준 용량비
-- 180ml = 312.5, 200ml ≈ 333.3 (소주 200ML), 300ml ≈ 333.3 (대상 김치 300ML)
UPDATE saehan_products SET box_count_12h = 312.5 WHERE name = '180G 팔각' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 312.5 WHERE name = '180G 공통' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 333.3 WHERE name = '200G 공통' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 333.3 WHERE name = '250G 공통' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 333.3 WHERE name = '300G 신형' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 333.3 WHERE name = '300G 공통' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 300.0 WHERE name = '350G 신형' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 300.0 WHERE name = '350G 18각' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 280.0 WHERE name = '400G 공통' AND box_count_12h IS NULL;

-- 05호 광구 계열: 용량 기반 추정
UPDATE saehan_products SET box_count_12h = 280.0 WHERE name = '400G 광구' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 260.0 WHERE name = '500G 광구' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 240.0 WHERE name = '600G 광구' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 220.0 WHERE name = '700G 광구' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 200.0 WHERE name = '800G 광구' AND box_count_12h IS NULL;

-- 04호 단지 계열: 대형 용기 (생산 속도 느림)
UPDATE saehan_products SET box_count_12h = 260.0 WHERE name = '500G 단지' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 200.0 WHERE name = '1KG 단지' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 200.0 WHERE name = '1KG 옹기' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 200.0 WHERE name = '1KG 광구' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 150.0 WHERE name = '2KG 단지' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 120.0 WHERE name = '3KG 단지' AND box_count_12h IS NULL;

-- 02호 계열: 1.8HD → '소주 1.8L' (8.3 파렛트) 또는 박스 기준 375.0
-- 1공장 HD는 박스 포장이므로 간장1.8L(375.0) 참고
UPDATE saehan_products SET box_count_12h = 375.0 WHERE name = '1.8HD N' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 375.0 WHERE name = '1.8HD H' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 375.0 WHERE name = '1.8HD S' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 375.0 WHERE name = '1.5HD' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 375.0 WHERE name = '1.6HD' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 333.3 WHERE name = '1L HD' AND box_count_12h IS NULL;

-- 03호 대형 용기: 생산 속도 매우 느림 (수동 공정 비율 높음)
UPDATE saehan_products SET box_count_12h = 80.0 WHERE name = '8L 사각' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 80.0 WHERE name = '8L 뉴그린' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 60.0 WHERE name = '10L 원형' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 60.0 WHERE name = '10L 뉴그린' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 60.0 WHERE name = '10L 청매실' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 45.0 WHERE name = '12L 과실주' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 40.0 WHERE name = '15L 뉴그린' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 40.0 WHERE name = '15L 청매실' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 40.0 WHERE name = '15L 과실주' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 30.0 WHERE name = '20L 뉴그린' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 30.0 WHERE name = '20L 청매실' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 30.0 WHERE name = '20L 과실주' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 25.0 WHERE name = '22L 뉴그린' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 25.0 WHERE name = '22L 과실주' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 20.0 WHERE name = '25L 뉴그린' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 15.0 WHERE name = '30L 뉴그린' AND box_count_12h IS NULL;

-- 07호 계열: 중형 용기
UPDATE saehan_products SET box_count_12h = 216.0 WHERE name = '1.65L 원형' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 216.0 WHERE name = '1.65L 사각' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 266.7 WHERE name = '1.16L' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 150.0 WHERE name = '2.4KG 꿀병' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 122.7 WHERE name = '4.4L' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 122.7 WHERE name = '4.3L 사각' AND box_count_12h IS NULL;

-- 08/09호 다품종
UPDATE saehan_products SET box_count_12h = 200.0 WHERE name = '2L' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 150.0 WHERE name = '3L' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 122.7 WHERE name = '5L' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 250.0 WHERE name = 'ST-750' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 375.0 WHERE name = 'CJ매실청500' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 300.0 WHERE name = 'CJ매실청800' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 375.0 WHERE name = '대상참치250' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 375.0 WHERE name = '대상액젓250' AND box_count_12h IS NULL;

-- 13호/14호 (소형 PET 음료)
UPDATE saehan_products SET box_count_12h = 375.0 WHERE name = '풀무원스벅190' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 375.0 WHERE name = '올가니카190' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 375.0 WHERE name = '우리스벅190' AND box_count_12h IS NULL;

-- 15호 생수류
UPDATE saehan_products SET box_count_12h = 375.0 WHERE name = '500생수원형' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 375.0 WHERE name = '500생수사각' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 333.3 WHERE name = '900생수' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 216.0 WHERE name = '1.5생수원형' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 375.0 WHERE name = '1.8생수원형' AND box_count_12h IS NULL;

-- 17호 미림류 → '미림 1.8L' (375.0) 참고
UPDATE saehan_products SET box_count_12h = 333.3 WHERE name = '미림900' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 375.0 WHERE name = '미림500' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 333.3 WHERE name = '롯데미림900' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 375.0 WHERE name = '롯데미림500' AND box_count_12h IS NULL;

-- B-1호 간장/맛술/액젓 → '간장 1.8L' (375.0), '미작 830ML' (416.7) 참고
UPDATE saehan_products SET box_count_12h = 375.0 WHERE name = '간장500' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 375.0 WHERE name = '맛술410' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 375.0 WHERE name = '액젓500' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 266.7 WHERE name = '액젓1KG' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 416.7 WHERE name = '액젓250' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 416.7 WHERE name = '미작830' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 416.7 WHERE name = '간장200' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 333.3 WHERE name = '식초900' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 333.3 WHERE name = '간장900' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 375.0 WHERE name = '어간장410' AND box_count_12h IS NULL;

-- B-2호 신형 소주병/간장
UPDATE saehan_products SET box_count_12h = 375.0 WHERE name = '신SP1.8골드펄' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 375.0 WHERE name = '신SP1.8PET' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 375.0 WHERE name = '신SP1.8CL' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 375.0 WHERE name = '알룰로스500' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 416.7 WHERE name = '참치액250' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 416.7 WHERE name = '참치액830' AND box_count_12h IS NULL;

-- ──────────────────────────────────────────────
-- 2공장 제품 box_count_12h 업데이트
-- ──────────────────────────────────────────────

-- S-1호: 테일러/진로 → 기존 시드 참고
-- 테일러946 → '테일러 946ML UV' (4.3 파렛트)
UPDATE saehan_products SET box_count_12h = 4.3 WHERE name = '테일러946' AND box_count_12h IS NULL;
-- 테일러1.89 → '테일러 1.89L UV' (5.8 파렛트)
UPDATE saehan_products SET box_count_12h = 5.8 WHERE name = '테일러1.89' AND box_count_12h IS NULL;
-- 진로2.7 → '진로 2.7L 20%' (10.9 파렛트)
UPDATE saehan_products SET box_count_12h = 10.9 WHERE name = '진로2.7' AND box_count_12h IS NULL;
-- 딸기청900 → 유사 900ml 박스 기준
UPDATE saehan_products SET box_count_12h = 333.3 WHERE name = '딸기청900' AND box_count_12h IS NULL;

-- S-2호: CJ올리고당 → 'CJ 1.2L' (266.7)
UPDATE saehan_products SET box_count_12h = 266.7 WHERE name = 'CJ올리고당' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 266.7 WHERE name = '대상올리고당' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 375.0 WHERE name = 'CJ500' AND box_count_12h IS NULL;
-- 간장840 → '대상 양념장 840ML' (416.7)
UPDATE saehan_products SET box_count_12h = 416.7 WHERE name = '간장840' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 416.7 WHERE name = '참치액' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 375.0 WHERE name = '마이노멀500' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 333.3 WHERE name = '마이노멀900' AND box_count_12h IS NULL;

-- S-3호: 초고추장/광야/호프
UPDATE saehan_products SET box_count_12h = 266.7 WHERE name = '초고추장' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 300.0 WHERE name = '신광야950' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 375.0 WHERE name = '광야500' AND box_count_12h IS NULL;
-- 호프1.0 → 용량비 추정 ('호프 1.5L' = 216.5)
UPDATE saehan_products SET box_count_12h = 266.7 WHERE name = '호프1.0' AND box_count_12h IS NULL;
-- 호프1.5 → '호프 1.5L [ALC 40g]' (216.5)
UPDATE saehan_products SET box_count_12h = 216.5 WHERE name = '호프1.5' AND box_count_12h IS NULL;

-- S-4호: 신새한/생수/간장/참기름
UPDATE saehan_products SET box_count_12h = 375.0 WHERE name = '신새한1.8' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 333.3 WHERE name = '생수900' AND box_count_12h IS NULL;
-- 간장1.7 → '탁주 1.7L' (375.0) 동일 용량
UPDATE saehan_products SET box_count_12h = 375.0 WHERE name = '간장1.7' AND box_count_12h IS NULL;
-- 간장1.8 → '간장 1.8L' (375.0)
UPDATE saehan_products SET box_count_12h = 375.0 WHERE name = '간장1.8' AND box_count_12h IS NULL;
-- 참기름1.5 → '참기름 1.5L' (216.0)
UPDATE saehan_products SET box_count_12h = 216.0 WHERE name = '참기름1.5' AND box_count_12h IS NULL;

-- S-5호: 미림/간장
-- 미림1.8 → '미림 1.8L' (375.0)
UPDATE saehan_products SET box_count_12h = 375.0 WHERE name = '미림1.8' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 200.0 WHERE name = '미림2.0' AND box_count_12h IS NULL;
-- 어간장830 → '미작 830ML' (416.7)
UPDATE saehan_products SET box_count_12h = 416.7 WHERE name = '어간장830' AND box_count_12h IS NULL;

-- S-6호: 지평/홍초
UPDATE saehan_products SET box_count_12h = 375.0 WHERE name = '지평1.7' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 333.3 WHERE name = '홍초900' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 375.0 WHERE name = '홍초500' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 216.0 WHERE name = '홍초1.5' AND box_count_12h IS NULL;

-- S-7호: 진로/신진로/소주 1.8L → '소주 1.8L' (8.3 파렛트) 또는 박스 포장
-- S-7호는 박스 포장이므로 간장1.8L(375.0) 참고
UPDATE saehan_products SET box_count_12h = 375.0 WHERE name = '진로1.8' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 375.0 WHERE name = '신진로1.8' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 375.0 WHERE name = '일반1.8' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 375.0 WHERE name = '구진로1.8' AND box_count_12h IS NULL;

-- P-1호: 프리폼 (대형 파렛트 단위)
-- 진로4.0 → '진로 4.0L' (16.9 파렛트)
UPDATE saehan_products SET box_count_12h = 16.9 WHERE name = '진로4.0' AND box_count_12h IS NULL;
UPDATE saehan_products SET box_count_12h = 16.9 WHERE name = '진로투명' AND box_count_12h IS NULL;
-- 올리고당 → CJ 1.2L 기준 (266.7 박스)
UPDATE saehan_products SET box_count_12h = 266.7 WHERE name = '올리고당' AND box_count_12h IS NULL;
-- 테일러86 → 테일러 946ML (4.3) 기준 용량비
UPDATE saehan_products SET box_count_12h = 4.7 WHERE name = '테일러86' AND box_count_12h IS NULL;
