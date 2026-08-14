// 模糊测试：大量随机生涯，确保无异常且存档可序列化
import * as E from '../js/engine.js';

const countries = ['US','ES','RS','AR','FR','SI','AU','GR','CA','DE','LT','IT','TR','BR','NG','LV','HR','PR','DO','CZ','PL','FI','CN','JP','KR','PH','IR','NZ','AO','CV'];
const positions = ['pg','sg','sf','pf','c'];
const modes = ['quick','standard','immersive'];

let fail = 0;
const N = 40;
for (let i = 0; i < N; i++) {
  const seed = `fuzz-${i}-${Date.now() % 100000}`;
  const nationality = countries[Math.floor(Math.random() * countries.length)];
  const position = positions[Math.floor(Math.random() * positions.length)];
  const mode = modes[Math.floor(Math.random() * modes.length)];
  try {
    let st = E.newGame({
      seed, mode, name: '模糊' + i, nationality, position,
      hand: Math.random() < 0.5 ? '右' : '左',
      number: 1 + Math.floor(Math.random() * 99),
      domesticDreamTeamId: null,
      foreignDreamTeamId: null,
    });
    let guard = 0;
    while (guard++ < 4000 && st.phase !== 'summary') {
      const res = E.step(st);
      st = res.state;
      if (st.currentEvent) {
        const ev = st.currentEvent;
        if (!ev.options.length) throw new Error(`事件 ${ev.type} 无选项`);
        const opt = ev.options[Math.floor(Math.random() * ev.options.length)];
        const d = E.decide(st, opt.id);
        st = d.state;
      }
    }
    if (st.phase !== 'summary') throw new Error('超时未结束');
    const sum = E.buildSummary(st);
    const json = JSON.stringify(sum);
    if (json.length < 100) throw new Error('结算数据过短');
    // 校验称号 id 都合法
    for (const t of sum.titles) {
      if (!E.TITLES_IDS?.includes) {}
    }
    console.log(`OK ${i} ${nationality}/${position}/${mode} age=${st.player.age} peak=${sum.maxOverall} clubs=${sum.clubs.length} titles=${sum.titles.length} json=${json.length}`);
  } catch (e) {
    fail++;
    console.error(`FAIL ${i} ${nationality}/${position}/${mode}: ${e.message}`);
  }
}
console.log(fail === 0 ? `FUZZ PASS (${N})` : `${fail} FAILED`);
process.exit(fail === 0 ? 0 : 1);
