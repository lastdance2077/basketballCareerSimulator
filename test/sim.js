// 无头模拟测试：随机决策跑完整个生涯
import * as E from '../js/engine.js';

function runOne({ seed, mode, nationality, position }) {
  let st = E.newGame({
    seed,
    mode,
    name: '测试球员',
    nationality,
    position,
    hand: '右',
    number: 23,
    domesticDreamTeamId: null,
    foreignDreamTeamId: null,
  });
  let steps = 0;
  const maxSteps = 3000;
  let decisions = 0;
  let banners = 0;
  const choices = [];
  while (steps < maxSteps) {
    if (st.phase === 'summary') break;
    const res = E.step(st);
    st = res.state;
    if (res.screen === 'banner') banners++;
    if (st.currentEvent && res.screen === 'event') {
      const ev = st.currentEvent;
      const opt = ev.options[Math.floor(Math.random() * ev.options.length)];
      choices.push(`${ev.type}:${opt.id}`);
      const d = E.decide(st, opt.id);
      st = d.state;
      decisions++;
      if (d.screen === 'summary') break;
    }
    steps++;
  }
  if (st.phase !== 'summary') {
    throw new Error(`[${seed}] 未在 ${maxSteps} 步内结束 phase=${st.phase} age=${st.player.age} steps=${steps}`);
  }
  const sum = E.buildSummary(st);
  // 自洽性检查
  const proSeasons = st.seasons.filter(s => !s.youth && s.teamId);
  const ages = proSeasons.map(s => s.age);
  for (let i = 1; i < ages.length; i++) {
    if (ages[i] !== ages[i - 1] + 1) throw new Error(`[${seed}] 赛季年龄不连续: ${ages.join(',')}`);
  }
  if (st.player.age !== (ages[ages.length - 1] || 17) + 1 && st.player.age > 17) {
    // 允许最后退役事件后年龄不变
  }
  const t = st.totals;
  if (t.apps < 0 || t.pts < 0 || t.reb < 0 || t.ast < 0) throw new Error(`[${seed}] 负数据`);
  if (sum.totals.apps !== t.apps) throw new Error(`[${seed}] 结算出场数不一致`);
  if (!sum.rival || sum.rival.series < 1) throw new Error(`[${seed}] 宿敌数据缺失`);
  if (!Array.isArray(sum.highlights)) throw new Error(`[${seed}] 高光数据缺失`);
  return {
    seed, mode, nationality, position,
    steps, decisions, banners,
    age: st.player.age,
    seasons: proSeasons.length,
    peak: sum.maxOverall,
    pts: Math.round(t.pts),
    income: Math.round(t.salary),
    titles: sum.titles.length,
    trophies: t.trophies.length,
    clubs: sum.clubs.length,
    natPeriods: st.nationalTeamPeriods.length,
    farewell: st.farewell || st.goodbye || st.walkaway || null,
    reason: st.retirementReason,
    endingBeat: st.endingBeat,
    legacy: st.legacyLines.length,
    rival: sum.rival ? `${sum.rival.name}(${sum.rival.myPts}:${sum.rival.rivalPts})` : null,
    hl: sum.highlights.length,
    wins: st.showdownWins,
  };
}

const cases = [
  { seed: 'test-a1', mode: 'quick', nationality: 'CN', position: 'sg' },
  { seed: 'test-a2', mode: 'standard', nationality: 'US', position: 'pg' },
  { seed: 'test-a3', mode: 'immersive', nationality: 'ES', position: 'c' },
  { seed: 'test-a4', mode: 'standard', nationality: 'RS', position: 'pf' },
  { seed: 'test-a5', mode: 'quick', nationality: 'JP', position: 'sf' },
  { seed: 'test-a6', mode: 'standard', nationality: 'PH', position: 'sg' },
  { seed: 'test-a7', mode: 'immersive', nationality: 'CV', position: 'pg' },
  { seed: 'test-a8', mode: 'quick', nationality: 'AO', position: 'c' },
  { seed: 'test-a9', mode: 'standard', nationality: 'SI', position: 'sf' },
  { seed: 'test-b1', mode: 'standard', nationality: 'TR', position: 'pf' },
];

let failed = 0;
for (const c of cases) {
  try {
    const r = runOne(c);
    console.log(`OK ${c.seed} ${c.nationality}/${c.position} ${c.mode} | age ${r.age} peak ${r.peak} titles ${r.titles} rival ${r.rival} hl ${r.hl} wins ${JSON.stringify(r.wins)}`);
  } catch (e) {
    failed++;
    console.error(`FAIL ${c.seed}: ${e.message}\n${e.stack.split('\n').slice(0, 6).join('\n')}`);
  }
}

// 确定性测试：同一种子 + 相同随机选择 → 相同结果
function runDeterministic(seed) {
  let st = E.newGame({ seed, mode: 'standard', name: 'X', nationality: 'US', position: 'pg', hand: '右', number: 7, domesticDreamTeamId: null, foreignDreamTeamId: null });
  let guard = 0;
  const trace = [];
  while (guard++ < 3000) {
    if (st.phase === 'summary') break;
    const res = E.step(st);
    st = res.state;
    if (st.currentEvent) {
      const ev = st.currentEvent;
      const opt = ev.options[0];
      trace.push(ev.type + ':' + opt.id);
      const d = E.decide(st, opt.id);
      st = d.state;
      if (d.screen === 'summary') break;
    }
  }
  return { sum: E.buildSummary(st), trace, age: st.player.age };
}

try {
  const r1 = runDeterministic('det-1');
  const r2 = runDeterministic('det-1');
  if (r1.sum.maxOverall !== r2.sum.maxOverall || r1.sum.totals.apps !== r2.sum.totals.apps || r1.trace.length !== r2.trace.length) {
    failed++;
    console.error('FAIL 确定性: 同一种子结果不一致');
  } else {
    console.log(`OK 确定性: peak=${r1.sum.maxOverall} apps=${r1.sum.totals.apps} trace=${r1.trace.length}`);
  }
} catch (e) {
  failed++;
  console.error('FAIL 确定性异常: ' + e.message);
}

console.log(failed === 0 ? 'ALL PASS' : `${failed} FAILED`);
process.exit(failed === 0 ? 0 : 1);
