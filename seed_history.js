/**
 * 2025년 배치 이력 데이터를 Supabase에 직접 INSERT
 *
 * SQL 파일 대신 Supabase JS SDK로 직접 데이터 삽입
 * (SQL 파일이 7000+줄이라 SQL Editor에서 실행 불가)
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const url = 'https://xlfrwcrfjuvajskvjwnq.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsZnJ3Y3JmanV2YWpza3Zqd25xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTU4NjU2MywiZXhwIjoyMDg1MTYyNTYzfQ.uPb47sF-PbwcLN-ZL2umjr4dJW5d7oliDtb_-2zImHY';
const supabase = createClient(url, key);

// 설비 UUID 매핑
const EQUIP_UUID = {
  "02": "e0200000-0000-0000-0000-000000000002",
  "03": "e0300000-0000-0000-0000-000000000003",
  "04": "e0400000-0000-0000-0000-000000000004",
  "05": "e0500000-0000-0000-0000-000000000005",
  "06": "e0600000-0000-0000-0000-000000000006",
  "07": "e0700000-0000-0000-0000-000000000007",
  "08": "e0800000-0000-0000-0000-000000000008",
  "09": "e0900000-0000-0000-0000-000000000009",
  "10": "e0a00000-0000-0000-0000-000000000010",
  "11": "e0b00000-0000-0000-0000-000000000011",
  "12": "e0c00000-0000-0000-0000-000000000012",
  "13": "e0d00000-0000-0000-0000-000000000013",
  "14": "e0e00000-0000-0000-0000-000000000014",
  "15": "e0f00000-0000-0000-0000-000000000015",
  "16": "e1000000-0000-0000-0000-000000000016",
  "17": "e1100000-0000-0000-0000-000000000017",
  "B1": "eb100000-0000-0000-0000-000000000020",
  "B2": "eb200000-0000-0000-0000-000000000021",
  "S1": "e5100000-0000-0000-0000-000000000026",
  "S2": "e5200000-0000-0000-0000-000000000027",
  "S3": "e5300000-0000-0000-0000-000000000028",
  "S4": "e5400000-0000-0000-0000-000000000029",
  "S5": "e5500000-0000-0000-0000-000000000030",
  "S6": "e5600000-0000-0000-0000-000000000031",
  "S7": "e5700000-0000-0000-0000-000000000032",
  "P1": "ep100000-0000-0000-0000-000000000033",
  "P2": "ep200000-0000-0000-0000-000000000034",
  "P3": "ep300000-0000-0000-0000-000000000035",
  "P4": "ep400000-0000-0000-0000-000000000036",
};

const EQUIP_MAP_F1 = {};
for (let i = 2; i <= 18; i++) EQUIP_MAP_F1[`${i}호`] = String(i).padStart(2, '0');
EQUIP_MAP_F1["B-1"] = "B1";
EQUIP_MAP_F1["B-2"] = "B2";

const EQUIP_MAP_F2 = {};
for (let i = 1; i <= 7; i++) EQUIP_MAP_F2[`S-${i}호`] = `S${i}`;
for (let i = 1; i <= 5; i++) EQUIP_MAP_F2[`P-${i}호`] = `P${i}`;

const SHIFT_MAP = { day: '주간', night: '야간' };
const ROLE_MAP = { '라인': '검사원', 'BOX&운반': '운반포장', 'OP': 'OP', '반장': '반장', '선별&교육': '검사원', '설비관리': '설비관리', '생산관리': '생산관리' };
const DEPT_MAP = { '1공장_PET': '생산1팀PET', '1공장_PE': '생산1팀PE', '2공장_PET': '생산2팀' };

async function main() {
  // 0. 이력용 production plan 생성 ('잠정' 상태 사용 - DB CHECK 제약 우회)
  const HISTORY_PLAN_ID = 'a0000000-0000-0000-0000-000000000099';
  console.log('[0] 이력용 생산계획 레코드 생성...');
  const { error: planErr } = await supabase.from('saehan_production_plans').upsert({
    id: HISTORY_PLAN_ID,
    week_start_date: '2025-01-06',
    revision: 99,
    status: '잠정',
  });
  if (planErr) console.log('  plan 생성 에러:', planErr.message);
  else console.log('  이력 plan 생성 완료 (id:', HISTORY_PLAN_ID, ')');

  // 더미 직원 조회 (employee_id NOT NULL 우회)
  const { data: allEmps } = await supabase.from('saehan_employees').select('id, name');
  const empMap = new Map((allEmps ?? []).map(e => [e.name, e.id]));
  console.log('  직원 매핑:', empMap.size, '명');

  // P1~P5 설비가 DB에 없으면 건너뛰기 위해 맵에서 제거
  delete EQUIP_UUID["P1"];
  delete EQUIP_UUID["P2"];
  delete EQUIP_UUID["P3"];
  delete EQUIP_UUID["P4"];

  const assignsRaw = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'parsed', 'assignments.json'), 'utf-8'));
  const records = assignsRaw.filter(a => a.type !== 'headcount');
  console.log(`총 ${records.length}건 처리 시작`);

  // 1. 설비 가동 이력 INSERT
  console.log('\n[1/2] 설비 가동 이력...');
  const equipSeen = new Set();
  const equipRows = [];
  for (const r of records) {
    if (r.role !== '라인' || !r.equipment) continue;
    const map = r.factory === '1공장' ? EQUIP_MAP_F1 : EQUIP_MAP_F2;
    const code = map[r.equipment];
    if (!code || !EQUIP_UUID[code]) continue;
    const shift = SHIFT_MAP[r.shift] || r.shift;
    const key = `${r.date}_${shift}_${EQUIP_UUID[code]}`;
    if (equipSeen.has(key)) continue;
    equipSeen.add(key);
    equipRows.push({
      plan_id: HISTORY_PLAN_ID,
      equipment_id: EQUIP_UUID[code],
      date: r.date,
      shift: shift,
      status: '가동',
      notes: r.product || '',
    });
  }
  console.log(`  ${equipRows.length}건 준비 완료`);

  // 배치 INSERT (500건씩)
  let inserted = 0;
  for (let i = 0; i < equipRows.length; i += 500) {
    const batch = equipRows.slice(i, i + 500);
    const { error } = await supabase.from('saehan_production_plan_details').insert(batch);
    if (error) {
      console.log(`  배치 ${i}~${i+batch.length} 에러: ${error.message.substring(0, 80)}`);
    } else {
      inserted += batch.length;
    }
    if (i % 2000 === 0) console.log(`  ${inserted}/${equipRows.length}...`);
  }
  console.log(`  설비 가동: ${inserted}건 삽입`);

  // 2. 인력 배치 이력 INSERT
  console.log('\n[2/2] 인력 배치 이력...');
  const assignRows = [];
  for (const r of records) {
    const workers = r.workers || [];
    if (workers.length === 0) continue;
    const shift = SHIFT_MAP[r.shift] || r.shift;
    const dept = DEPT_MAP[`${r.factory}_${r.line || 'PET'}`] || '생산2팀';
    const role = ROLE_MAP[r.role] || r.role;
    for (const w of workers) {
      const eid = empMap.get(w) || null;
      if (!eid) continue; // employee_id NOT NULL이므로 매칭 안 되면 스킵
      assignRows.push({
        date: r.date,
        shift: shift,
        department: dept,
        role: role,
        employee_id: eid,
        notes: w,
        status: '확정',
      });
    }
  }
  console.log(`  ${assignRows.length}건 준비 완료`);

  inserted = 0;
  for (let i = 0; i < assignRows.length; i += 500) {
    const batch = assignRows.slice(i, i + 500);
    const { error } = await supabase.from('saehan_worker_assignments').insert(batch);
    if (error) {
      console.log(`  배치 ${i} 에러: ${error.message}`);
    } else {
      inserted += batch.length;
    }
    if (i % 3000 === 0) console.log(`  ${inserted}/${assignRows.length}...`);
  }
  console.log(`  인력 배치: ${inserted}건 삽입`);

  // 확인
  const { count: c1 } = await supabase.from('saehan_production_plan_details').select('*', { count: 'exact', head: true });
  const { count: c2 } = await supabase.from('saehan_worker_assignments').select('*', { count: 'exact', head: true });
  console.log(`\n최종 DB 현황:`);
  console.log(`  production_plan_details: ${c1}건`);
  console.log(`  worker_assignments: ${c2}건`);
}

main().catch(e => console.error(e));
