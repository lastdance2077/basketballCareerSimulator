// ================= 篮球生涯模拟器 · 引擎 =================
import {
  APP_TITLE, TAGLINE, MODES, POSITIONS, COUNTRIES, LEAGUES, TEAMS,
  EVENTS, SHOWDOWNS, TITLES, FAREWELL_STYLES, GOODBYE_STYLES, WALKAWAY_STYLES,
} from './data.js';

// ---------- RNG ----------
export function xmur3(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

export function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function nextRng(state) {
  const fn = mulberry32(state);
  return { v: fn(), state: (fn() * 4294967296) >>> 0 || 12345 };
}

// 用一次性序列推进：确保每次调用都消耗两个随机数，行为稳定
export function roll(rngState, n = 1) {
  let s = rngState;
  const out = [];
  for (let i = 0; i < n; i++) {
    const r = nextRng(s);
    out.push(r.v);
    s = r.state;
  }
  return { v: out, state: s };
}

export function chance(rngState, p) {
  const r = roll(rngState);
  return { ok: r.v[0] < p, state: r.state };
}

export function pickWeighted(rngState, items, weightFn) {
  const total = items.reduce((s, it) => s + weightFn(it), 0);
  if (total <= 0) return { item: items[0], state: rngState };
  const r = roll(rngState);
  let t = r.v[0] * total;
  for (const it of items) {
    t -= weightFn(it);
    if (t <= 0) return { item: it, state: r.state };
  }
  return { item: items[items.length - 1], state: r.state };
}

export function genSeed() {
  const t = Date.now().toString(36);
  const r = Math.random().toString(36).slice(2, 8);
  return `${t}-${r}`;
}

// ---------- 格式化 ----------
export function fmtMoney(v) {
  if (v == null || isNaN(v)) return '—';
  if (v >= 10000) {
    const y = v / 10000;
    return (y >= 100 ? Math.round(y) : y.toFixed(y >= 10 ? 1 : 2)) + '亿';
  }
  if (v >= 1000) return Math.round(v) + '万';
  return Math.round(v) + '万';
}

export function fmtInt(n) {
  if (n == null) return '0';
  return Math.round(n).toLocaleString('zh-CN');
}

export function fmtAvg(n) {
  if (n == null) return '0';
  return n.toFixed(1);
}

export function percentileOf(overall) {
  if (overall >= 99) return 99;
  if (overall >= 96) return 97;
  if (overall >= 93) return 94;
  if (overall >= 90) return 88;
  if (overall >= 87) return 80;
  if (overall >= 84) return 70;
  if (overall >= 80) return 56;
  if (overall >= 76) return 40;
  if (overall >= 72) return 25;
  if (overall >= 68) return 13;
  return 5;
}

export function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

export function teamById(id) {
  return TEAMS[id] || null;
}

export function leagueById(id) {
  return LEAGUES[id] || null;
}

export function countryById(code) {
  return COUNTRIES[code] || null;
}

const ROLE_NAMES = ['边缘轮换', '轮换主力', '绝对主力', '队内核心', '联盟巨星'];
export const ROLE_KEYS = ['edge', 'rotation', 'starter', 'star', 'superstar'];

export function roleName(role) {
  const i = ROLE_KEYS.indexOf(role);
  return i >= 0 ? ROLE_NAMES[i] : '轮换主力';
}

export function roleFactor(role) {
  const map = { edge: 0.5, rotation: 0.72, starter: 0.92, star: 1.1, superstar: 1.26 };
  return map[role] ?? 0.92;
}

// ---------- 生涯创建 ----------
export function tournamentSchedule(maxAge = 44) {
  const list = [];
  for (let age = 18; age <= maxAge; age++) {
    if ((age - 18) % 4 === 0) list.push({ type: 'world_cup', age, qualified: null });
    if ((age - 20) % 4 === 0) list.push({ type: 'olympics', age, qualified: null });
    if ((age - 19) % 2 === 0) list.push({ type: 'continental', age, qualified: true });
  }
  return list;
}

export function newGame({ seed, mode, name, nationality, position, hand, number, domesticDreamTeamId, foreignDreamTeamId }) {
  const seedHash = xmur3(seed)();
  const rng = mulberry32(seedHash);
  const initial = clamp(58 + Math.floor(rng() * 9), 55, 66); // 16 岁初始能力
  const country = COUNTRIES[nationality];
  const pos = POSITIONS[position];
  const league = LEAGUES[country.league] || LEAGUES.eur;
  // 潜力：随机 76-96，初始能力高一点潜力略高
  const potential = clamp(78 + Math.floor(rng() * 22) + Math.round((initial - 58) * 0.5), 78, 99);
  const player = {
    name: name || '未命名',
    nationality: country.zh,
    nationalityCode: nationality,
    position,
    positionZh: pos.zh,
    hand,
    number,
    age: 16,
    overall: initial,
    potential,
    debutOverall: initial,
    marketValue: marketValueOf(initial, 16, league),
    domesticDreamTeamId: domesticDreamTeamId || null,
    foreignDreamTeamId: foreignDreamTeamId || null,
  };
  const rival = makeRival(player, rng);
  return {
    seed,
    mode,
    step: 0,
    phase: 'career',
    stage: 'youth',
    player,
    currentTeamId: null,
    contractTeamId: null,
    seasons: [],
    nationalTeamPeriods: [],
    totals: { apps: 0, pts: 0, reb: 0, ast: 0, stl: 0, blk: 0, salary: 0, trophies: [], awards: [] },
    hasNationalTeamCallup: false,
    nationalTeamRetiredAge: undefined,
    tournaments: tournamentSchedule(),
    period: { periodIndex: 0, remaining: 2, run: 0, modifiers: {}, youth: true },
    currentEvent: null,
    lastEventOutcome: null,
    usedEventKeys: [],
    transfers: [],
    farewell: null,
    goodbye: null,
    walkaway: null,
    retirementReason: null,
    endingBeat: null,
    showdownWins: { last_shot: 0, free_throw: 0, game7: 0, qualifier_showdown: 0, world_cup_showdown: 0 },
    legacyLines: [],
    highlights: [],
    rival,
    rivalSeries: [],
    usedRivalAges: [],
    suspensionSeasonsRemaining: 0,
    suspensionRustRemaining: 0,
    pendingTransfer: null,
    pendingWorldCupUpgrade: null,
    pendingQualifier: null,
    championsFarewellOffered: false,
    noOffersOffered: false,
    lastVoluntaryOfferAge: 0,
    usedTransferOfferAges: [],
    rngState: seedHash,
  };
}

function randomCountry(rng) {
  const codes = Object.keys(COUNTRIES);
  return COUNTRIES[codes[Math.floor(rng() * codes.length)]];
}

function makeRival(player, rng) {
  const sameCountry = rng() < 0.45;
  const c = sameCountry ? COUNTRIES[player.nationalityCode] : randomCountry(rng);
  const name = c.surnames[Math.floor(rng() * c.surnames.length)];
  const potential = clamp(player.potential + Math.floor(rng() * 13) - 6, 72, 99);
  const overall = clamp(player.debutOverall + Math.floor(rng() * 7) - 3, 55, 70);
  return {
    name,
    nationality: c.zh,
    position: player.position,
    overall,
    potential,
    peak: overall,
    totals: { pts: 0, champs: 0, mvp: 0, apps: 0 },
  };
}

function rivalSeason(rival, age, rng) {
  if (age <= 21) rival.overall = Math.min(rival.potential, rival.overall + (rng() < 0.75 ? 2 : 1));
  else if (age <= 29) rival.overall = Math.min(rival.potential, rival.overall + (rng() < 0.35 ? 1 : 0));
  else if (age >= 33) rival.overall = Math.max(55, rival.overall - (rng() < 0.65 ? 1 : 0));
  rival.peak = Math.max(rival.peak, rival.overall);
  const w = POSITIONS[rival.position].weight;
  const scale = clamp((rival.overall - 40) / 59, 0.05, 1);
  const ageF = ageFactor(age);
  // 宿敌也按球队角色出场比赛，规则与玩家一致
  const teamStr = 72 + rng() * 14;
  const diff = rival.overall - teamStr;
  const idx = diff <= -8 ? 0 : diff <= -3 ? 1 : diff <= 3 ? 2 : diff <= 8 ? 3 : 4;
  const role = ROLE_KEYS[clamp(idx, 0, 4)];
  const rf = roleFactor(role);
  const gameRange = { edge: [28, 46], rotation: [46, 62], starter: [60, 76], star: [68, 80], superstar: [72, 82] }[role];
  const g = Math.round((gameRange[0] + rng() * (gameRange[1] - gameRange[0])) * ageF);
  const per = (9 + 23 * scale) * w.pts * rf * (0.95 + rng() * 0.1) * ageF;
  const champ = rng() < clamp((rival.overall - 72) * 0.005 + 0.03, 0.02, 0.3);
  const mvp = rival.overall >= 86 && rng() < 0.25;
  const pts = per * g;
  rival.totals.pts += pts;
  rival.totals.apps += g;
  rival.totals.champs += champ ? 1 : 0;
  rival.totals.mvp += mvp ? 1 : 0;
  return { pts, champ, mvp, g };
}

export function marketValueOf(overall, age, league) {
  let v;
  if (overall < 75) v = 20 + (overall - 60) * 8;
  else if (overall < 85) v = 150 * Math.pow(1.35, overall - 75);
  else if (overall < 95) v = 3200 * Math.pow(1.30, overall - 85);
  else v = 46000 * Math.pow(1.22, overall - 95);
  const ageFactor =
    age <= 18 ? 0.45 : age <= 20 ? 0.6 : age <= 23 ? 0.82 :
    age <= 30 ? 1.0 : age <= 32 ? 0.82 : age <= 34 ? 0.62 : 0.45;
  const leagueFactor = { 1: 1.12, 2: 1.0, 3: 0.82, 4: 0.62 }[league.tier] ?? 0.8;
  return Math.round(v * ageFactor * leagueFactor);
}

export function salaryOf(marketValue, role) {
  const ratio = { edge: 0.10, rotation: 0.14, starter: 0.18, star: 0.20, superstar: 0.22 }[role] ?? 0.15;
  return Math.round(marketValue * ratio);
}

// ---------- 事件池 ----------
function youthEvents() {
  return Object.values(EVENTS).filter(e => e.minAge <= 17);
}

function poolForAge(state, age) {
  const pool = Object.values(EVENTS).filter(e => {
    if (e.minAge > age || e.maxAge < age) return false;
    if (state.usedEventKeys.includes(e.key)) return false;
    if (e.key === 'national_retire' && state.nationalTeamRetiredAge !== undefined) return false;
    if (e.key === 'home_league_offer' && state.player.nationalityCode === 'US') return false;
    return true;
  });
  // 年龄越大，越是"身体"主题
  const weighted = pool.map(e => ({ e, w: e.weight * (e.key.includes('injury') && age >= 32 ? 2 : 1) }));
  return weighted;
}

function pickEvent(state, age) {
  const pool = poolForAge(state, age);
  if (pool.length === 0) return null;
  const { item, state: s } = pickWeighted(state.rngState, pool, x => x.w);
  const ev = { ...item.e, options: item.e.options.map(o => ({ ...o })) };
  state.rngState = s;
  state.usedEventKeys.push(ev.key);
  if (state.usedEventKeys.length > 12) state.usedEventKeys.shift();
  ev.id = `${ev.key}-${state.step}`;
  return ev;
}

function signContractEvent(state) {
  const country = COUNTRIES[state.player.nationalityCode];
  const leagueId = country.league;
  const candidates = Object.values(TEAMS).filter(t => t.league === leagueId).sort((a, b) => b.strength - a.strength);
  const offers = candidates.slice(0, 4);
  // 若母国联赛没有球队（一般都有），退回欧洲联赛
  const list = offers.length >= 2 ? offers : Object.values(TEAMS).filter(t => t.league === 'eur').slice(0, 4);
  return {
    id: `sign-${state.step}`,
    type: 'sign_contract',
    title: '青训报价',
    text: `18 岁生日那天，${state.player.nationality}的几支球队给你发来了职业合同。你的第一步走哪儿。`,
    options: list.map(t => ({
      id: `sign-${t.id}`,
      label: `${t.zh}（${LEAGUES[t.league].zh}）`,
      hint: `球队强度 ${t.strength}，${t.strength >= 85 ? '豪门' : t.strength >= 78 ? '强队' : '成长空间大'}`,
      teamId: t.id,
    })),
  };
}

function transferChooseEvent(state) {
  const cur = state.currentTeamId ? TEAMS[state.currentTeamId] : null;
  const curTier = cur ? LEAGUES[cur.league].tier : 3;
  const candidates = Object.values(TEAMS).filter(t => {
    if (cur && t.id === cur.id) return false;
    const tier = LEAGUES[t.league].tier;
    return tier <= curTier + 1 && tier >= Math.min(1, curTier - 1);
  });
  const picked = [];
  const rng = mulberry32(state.rngState ^ 0x9e3779b9);
  const sorted = candidates.sort((a, b) => b.strength * (LEAGUES[b.league].tier === 1 ? 1.08 : 1) - a.strength * (LEAGUES[a.league].tier === 1 ? 1.08 : 1));
  const first = sorted[0];
  picked.push(first);
  for (let i = 1; i < sorted.length && picked.length < 3; i++) {
    if (rng() < 0.35 && Math.abs(sorted[i].strength - first.strength) > 3) picked.push(sorted[i]);
  }
  if (picked.length < 2 && sorted.length > 1) picked.push(sorted[1]);
  state.rngState = (mulberry32(state.rngState)(0) * 4294967296) >>> 0 || 12345;
  return {
    id: `transfer-${state.step}`,
    type: 'transfer_choose',
    title: '新东家',
    text: '经纪人摆出几份报价，你看着那些队徽，做了一个决定。',
    options: picked.map(t => ({
      id: `tf-${t.id}`,
      label: `${t.zh}`,
      hint: `${LEAGUES[t.league].zh} · 强度 ${t.strength}${t.id === state.player.foreignDreamTeamId || t.id === state.player.domesticDreamTeamId ? ' · 你的儿时主队！' : ''}`,
      teamId: t.id,
    })),
  };
}

// ---------- 赛季模拟 ----------
function roleFor(state, team, age, modifiers) {
  const diff = state.player.overall - team.strength;
  let idx =
    diff <= -8 ? 0 : diff <= -3 ? 1 : diff <= 3 ? 2 : diff <= 8 ? 3 : 4;
  if (age <= 18) idx = Math.max(0, idx - 1);
  if (age >= 33 && idx >= 2) idx -= 1;
  if (age >= 36 && idx >= 3) idx -= 1;
  idx = clamp(idx + (modifiers.roleShift || 0), 0, 4);
  return ROLE_KEYS[idx];
}

function ageFactor(age) {
  if (age <= 18) return 0.72;
  if (age <= 21) return 0.88;
  if (age <= 29) return 1.0;
  if (age <= 32) return 0.94;
  if (age <= 34) return 0.84;
  if (age <= 36) return 0.7;
  return 0.55;
}

function simulateSeason(state, team, age, modifiers) {
  const rng = mulberry32(state.rngState);
  const player = state.player;
  const league = LEAGUES[team.league];
  const suspended = modifiers.suspended;
  const injury = modifiers.injury;
  const form = 1 + (modifiers.tempDelta || 0) * 0.045;

  let role, g, stats;
  if (suspended) {
    role = 'edge';
    g = 0;
    stats = { g: 0, pts: 0, reb: 0, ast: 0, stl: 0, blk: 0 };
  } else {
    role = roleFor(state, team, age, modifiers);
    const rf = roleFactor(role);
    const af = ageFactor(age);
    const lf = { 1: 1.0, 2: 0.96, 3: 0.9, 4: 0.84 }[league.tier] ?? 0.9;
    const scale = clamp((player.overall - 40) / 59, 0.05, 1);
    const w = POSITIONS[player.position].weight;
    const noise = () => 0.88 + rng() * 0.24;
    const injFactor = injury ? 0.72 : 1;
    const base = {
      pts: (9 + 23 * scale) * w.pts * rf * af * lf * injFactor * form * noise(),
      reb: (2.5 + 8.5 * scale) * w.reb * rf * af * lf * injFactor * form * noise(),
      ast: (1.8 + 7.2 * scale) * w.ast * rf * af * lf * injFactor * form * noise(),
      stl: (0.5 + 2.0 * scale) * w.stl * rf * af * lf * injFactor * form * noise(),
      blk: (0.35 + 1.8 * scale) * w.blk * rf * af * lf * injFactor * form * noise(),
    };
    const gameRange = { edge: [28, 46], rotation: [46, 62], starter: [60, 76], star: [68, 80], superstar: [72, 82] }[role];
    const rawG = gameRange[0] + rng() * (gameRange[1] - gameRange[0]);
    g = Math.round(rawG * (league.games / 82) * (injury ? 0.62 : 1));
    stats = {
      g,
      pts: base.pts * g,
      reb: base.reb * g,
      ast: base.ast * g,
      stl: base.stl * g,
      blk: base.blk * g,
      avg: { pts: base.pts, reb: base.reb, ast: base.ast, stl: base.stl, blk: base.blk },
    };
  }

  // 球队战绩
  const teamPower = team.strength * 0.62 + player.overall * 0.38 + roleFactor(role) * 1.5;
  let champP = clamp(0.03 + (teamPower - 74) * 0.005, 0.015, 0.34);
  champP *= { 1: 1.18, 2: 1.0, 3: 0.9, 4: 0.75 }[league.tier] ?? 0.9;
  if (modifiers.trophyMult) champP *= modifiers.trophyMult;
  if (suspended) champP *= 0.7;

  const r1 = rng();
  let result;
  if (r1 < champP) result = { league: 'champion' };
  else if (r1 < champP + champP * 0.55) result = { league: 'final' };
  else if (r1 < champP * 2.2) result = { league: 'semis' };
  else if (r1 < champP * 3.4) result = { league: 'quarters' };
  else if (r1 < champP * 4.6) result = { league: 'playoffs' };
  else result = { league: 'missed' };

  let cup = null;
  if (league.cup && !suspended) {
    if (rng() < champP * 0.8) cup = 'cup_champion';
    else if (rng() < champP * 0.6) cup = 'cup_final';
  }

  // 个人奖项
  const awards = [];
  if (!suspended && g > 0) {
    if (player.overall >= 78 && rng() < 0.75) awards.push('allstar');
    if (player.overall >= 84 && rng() < 0.65) awards.push('all_team');
    if (player.overall >= 86 && rng() < 0.4) awards.push('mvp');
    if (result.league === 'champion' && player.overall >= 84 && rng() < 0.55) awards.push('fmvp');
    if (player.overall >= 84 && rng() < 0.35 && ['pf', 'c'].includes(player.position)) awards.push('dpoy');
    if (player.overall >= 86 && rng() < 0.45 && ['sg', 'sf', 'pg'].includes(player.position)) awards.push('scoring_title');
    if (player.overall >= 85 && rng() < 0.35 && ['pf', 'c'].includes(player.position)) awards.push('rebound_title');
    if (player.overall >= 85 && rng() < 0.35 && player.position === 'pg') awards.push('assist_title');
  }

  const trophies = [];
  if (result.league === 'champion') trophies.push(`league:${team.league}`);
  if (cup === 'cup_champion') trophies.push(`cup:${team.league}`);

  const marketValue = marketValueOf(player.overall, age, league);
  const salary = salaryOf(marketValue, role) * (modifiers.salaryMult || 1);

  // 赛季结束后的能力成长/下滑
  const dev = develop(player, age, rng);
  player.overall = dev;

  let highlight = null;
  if (!suspended && g > 0) {
    const a = stats.avg;
    if (a.pts >= 30) highlight = `单赛季场均 ${a.pts.toFixed(1)} 分`;
    else if (a.pts >= 24 && a.reb >= 10 && a.ast >= 10) highlight = `单赛季场均 ${a.pts.toFixed(1)} 分 ${a.reb.toFixed(1)} 板 ${a.ast.toFixed(1)} 助`;
    else if (result.league === 'champion' && awards.includes('fmvp')) highlight = '总冠军 + 总决赛MVP';
    else if (awards.includes('mvp')) highlight = '荣膺常规赛MVP';
    else if (awards.includes('scoring_title')) highlight = '荣膺得分王';
    else if (awards.includes('dpoy')) highlight = '荣膺最佳防守球员';
    else if (awards.includes('allstar_mvp')) highlight = '全明星MVP';
    else if (a.pts >= 23 && rng() < 0.22) highlight = '单场轰下 50+ 分';
  }

  const snapshot = {
    age,
    teamId: team.id,
    leagueId: team.league,
    overall: player.overall,
    role,
    suspended: !!suspended,
    stats,
    result,
    cup,
    trophies,
    awards,
    salary,
    marketValue,
    highlight,
    note: null,
  };

  state.rngState = (rng() * 4294967296) >>> 0 || 12345;
  return { snapshot, rng };
}

function develop(player, age, rng) {
  const p = player.potential;
  let target;
  if (age <= 29) target = p;
  else if (age <= 31) target = p - 1;
  else if (age <= 33) target = p - 3;
  else if (age <= 35) target = p - 6;
  else target = p - 11;
  let delta = 0;
  if (player.overall < target) {
    const speed = age <= 21 ? 2.5 : age <= 26 ? 1.35 : age <= 29 ? 0.8 : 0.4;
    delta = speed * (0.75 + rng() * 0.7);
  } else if (player.overall > target) {
    delta = -(age >= 31 ? 0.7 + rng() * 0.9 : 0.25 + rng() * 0.3);
  }
  return clamp(Math.round(player.overall + delta), 40, 99);
}

// ---------- 国家队 ----------
function nationalThreshold(country) {
  return { 1: 70, 2: 75, 3: 78, 4: 80 }[country.tier] ?? 78;
}

function qualifyProb(state, country) {
  const boost = (state.player.overall - 80) * 0.012;
  let p = country.qualify + boost;
  if (state.nationalTeamRetiredAge !== undefined) p = 0;
  return clamp(p, 0.05, 0.97);
}

function tournamentResult(state, country, tournament, modifiers, rng) {
  const overall = state.player.overall;
  const calledUp = overall >= nationalThreshold(country) && state.nationalTeamRetiredAge === undefined;
  if (!calledUp) return { called: false, result: 'not_called', stats: null };
  let q = qualifyProb(state, country);
  if (modifiers.nationalMult) q *= modifiers.nationalMult;
  if (tournament.type === 'continental') q = 1;
  if (state.pendingQualifier && state.pendingQualifier.age === tournament.age) {
    q = state.pendingQualifier.won ? 1 : 0;
  }
  const qualified = tournament.qualified === false ? false : rng() < q;
  if (!qualified) return { called: true, result: 'not_qualified', stats: null };

  // 深度
  const power = country.tier === 1 ? 78 : country.tier === 2 ? 70 : country.tier === 3 ? 62 : 56;
  const pBonus = (overall - 80) * 0.45;
  const strength = power + pBonus + (modifiers.nationalMult ? (modifiers.nationalMult - 1) * 15 : 0);
  const championP = clamp((strength - 68) * 0.006 + 0.015, 0.008, 0.32);
  const semisP = championP * 2.2;
  const quartersP = championP * 4;
  const r = rng();
  let result;
  if (r < championP) result = 'champion';
  else if (r < championP + semisP) result = 'semis';
  else if (r < championP + semisP + quartersP) result = 'quarters';
  else result = 'group';

  // 半决赛触发的决战
  if (result === 'semis' && overall >= 84 && (tournament.type === 'world_cup' || tournament.type === 'olympics')) {
    state.pendingWorldCupUpgrade = { age: tournament.age, type: tournament.type };
  }

  const depthGames = { champion: 8, semis: 7, quarters: 6, group: 4 }[result] ?? 5;
  const rf = roleFactor('superstar') * 0.95;
  const scale = clamp((overall - 40) / 59, 0.1, 1);
  const w = POSITIONS[state.player.position].weight;
  const pg = {
    pts: (10 + 24 * scale) * w.pts * rf,
    reb: (3 + 9 * scale) * w.reb * rf,
    ast: (2 + 7.5 * scale) * w.ast * rf,
  };
  const stats = {
    g: depthGames,
    pts: pg.pts * depthGames,
    reb: pg.reb * depthGames,
    ast: pg.ast * depthGames,
    avg: pg,
  };
  const awards = [];
  if (result === 'champion' && overall >= 87) awards.push('tournament_mvp');
  if ((result === 'champion' || result === 'semis') && overall >= 84) awards.push('tournament_all_team');
  return { called: true, result, stats, awards };
}

// ---------- 推进 ----------
export function step(state) {
  if (state.phase !== 'career') return { state, screen: 'summary' };
  if (state.currentEvent) return { state, screen: 'event' };

  const age = state.player.age;
  const modifiers = state.period.modifiers || {};

  if (state.stage === 'youth') {
    const snapshot = {
      age,
      teamId: null,
      leagueId: null,
      overall: state.player.overall,
      role: 'starter',
      stats: { g: 0, pts: 0, reb: 0, ast: 0, stl: 0, blk: 0 },
      result: { league: 'youth' },
      trophies: [],
      awards: [],
      salary: 0,
      marketValue: state.player.marketValue,
      youth: true,
    };
    state.seasons.push(snapshot);
    state.period.run += 1;
    state.player.age += 1;
    if (state.period.run === 1) {
      // 16 岁青训赛季后有一次青训决策
      state.currentEvent = pickEvent(state, 16);
    } else {
      state.stage = 'sign';
      state.currentEvent = signContractEvent(state);
      state.period = { periodIndex: 1, remaining: MODES[state.mode].periodLength, run: 0, modifiers: {} };
    }
    return { state, screen: 'banner', snapshot };
  }

  // 职业赛季
  const team = TEAMS[state.currentTeamId];
  if (!team) {
    state.phase = 'summary';
    state.retirementReason = state.retirementReason || 'no_offers';
    return { state, screen: 'summary' };
  }

  const suspended = state.suspensionSeasonsRemaining > 0;
  const seasonModifiers = {
    ...modifiers,
    suspended: suspended ? '禁赛' : modifiers.injury,
    roleShift: modifiers.roleShift || (state.suspensionRustRemaining > 0 ? -1 : 0),
  };

  const { snapshot } = simulateSeason(state, team, age, seasonModifiers);

  // 结算
  const t = state.totals;
  t.apps += snapshot.stats.g;
  t.pts += snapshot.stats.pts;
  t.reb += snapshot.stats.reb;
  t.ast += snapshot.stats.ast;
  t.stl += snapshot.stats.stl;
  t.blk += snapshot.stats.blk;
  t.salary += snapshot.salary;
  snapshot.trophies.forEach(tid => t.trophies.push(tid));
  snapshot.awards.forEach(aid => t.awards.push(aid));
  if (snapshot.highlight) state.highlights.push({ age, text: snapshot.highlight });

  // 宿敌对位
  if (state.rival) {
    const rr = mulberry32(state.rngState);
    const rs = rivalSeason(state.rival, age, rr);
    state.rngState = (rr() * 4294967296) >>> 0 || 12345;
    state.rivalSeries.push({
      age,
      my: snapshot.stats.pts,
      rival: rs.pts,
      myChamp: snapshot.result.league === 'champion',
      rivalChamp: rs.champ,
      myMvp: snapshot.awards.includes('mvp'),
      rivalMvp: rs.mvp,
    });
  }

  if (suspended) {
    state.suspensionSeasonsRemaining -= 1;
    if (state.suspensionSeasonsRemaining === 0) state.suspensionRustRemaining = 2;
  } else if (state.suspensionRustRemaining > 0) {
    state.suspensionRustRemaining -= 1;
  }

  // 国家队征召与大赛
  const country = COUNTRIES[state.player.nationalityCode];
  const tournament = state.tournaments.find(t2 => t2.age === age);
  if (tournament && state.nationalTeamRetiredAge === undefined) {
    const tr = tournamentResult(state, country, tournament, modifiers, mulberry32(state.rngState ^ 0x51ab));
    if (tr.called) {
      state.hasNationalTeamCallup = true;
      if (tr.result !== 'not_called' && tr.result !== 'not_qualified') {
        const nat = {
          age,
          type: tournament.type,
          result: tr.result,
          stats: tr.stats,
          awards: tr.awards || [],
        };
        state.nationalTeamPeriods.push(nat);
        if (tr.stats) {
          t.apps += tr.stats.g;
          t.pts += tr.stats.pts;
          t.reb += tr.stats.reb;
          t.ast += tr.stats.ast;
        }
        if (tr.result === 'champion') {
          t.trophies.push(tournament.type === 'world_cup' ? 'world_cup' : tournament.type === 'olympics' ? 'olympics' : 'continental');
          if (tournament.type === 'world_cup') state.legacyLines.push('你把世界杯举过头顶。');
          if (tournament.type === 'olympics') state.legacyLines.push('奥运金牌挂在了你的脖子上。');
          if (tournament.type === 'continental') state.legacyLines.push(`你率${country.zh}拿下了洲际冠军。`);
        }
        tr.awards?.forEach(a => t.awards.push(a));
        snapshot.national = nat;
      } else {
        snapshot.national = { age, type: tournament.type, result: tr.result, stats: null, awards: [] };
      }
      tournament.qualified = tr.result === 'champion' || tr.result === 'semis' || tr.result === 'quarters' || tr.result === 'group';
    } else {
      snapshot.national = { age, type: tournament.type, result: 'not_called', stats: null, awards: [] };
    }
    if (state.pendingWorldCupUpgrade && state.pendingWorldCupUpgrade.age === age) {
      state.currentEvent = showdownEvent('world_cup_showdown', state, tournament);
    }
  }

  // 预选赛生死战（大赛前一年触发）
  const upcoming = state.tournaments.find(t2 => t2.age === age + 1 && (t2.type === 'world_cup' || t2.type === 'olympics') && t2.qualified === null);
  if (upcoming && state.nationalTeamRetiredAge === undefined && state.player.overall >= nationalThreshold(country) - 3) {
    const qp = qualifyProb(state, country) * (modifiers.nationalMult || 1);
    if (qp > 0.32 && qp < 0.72) {
      state.currentEvent = showdownEvent('qualifier_showdown', state, upcoming);
      state.pendingQualifier = { age: upcoming.age, won: null };
    }
  }

  state.seasons.push(snapshot);

  // 打到半决赛/决赛：可能触发抢七决战
  if (!state.currentEvent && ['semis', 'final'].includes(snapshot.result.league)) {
    const r = roll(state.rngState);
    state.rngState = r.state;
    if (r.v[0] < 0.45) state.currentEvent = showdownEvent('game7', state, null);
  }

  state.period.run += 1;
  state.player.age += 1;
  const league = LEAGUES[team.league];
  state.player.marketValue = marketValueOf(state.player.overall, state.player.age, league);

  const periodEnd = state.period.run >= state.period.remaining;
  if (periodEnd && !state.currentEvent) {
    // 阶段结束 → 安排下一个事件
    state.period = { ...state.period, run: 0, modifiers: {} };
    const ev = scheduleNextEvent(state);
    if (ev) state.currentEvent = ev;
  }

  return { state, screen: 'banner', snapshot };
}

function scheduleNextEvent(state) {
  const age = state.player.age;
  // 40 岁必退
  if (age >= 40) {
    state.retirementReason = 'age';
    return retirementStyleEvent(state, 'age');
  }
  // 36 岁以上：无人问津
  if (age >= 36 && !state.noOffersOffered) {
    state.noOffersOffered = true;
    return { ...EVENTS.no_offers, id: `no-offers-${state.step}`, options: EVENTS.no_offers.options.map(o => ({ ...o })) };
  }
  // 32 岁以上：偶尔可以自己选择挂靴
  if (age >= 32 && age - state.lastVoluntaryOfferAge >= 4) {
    state.lastVoluntaryOfferAge = age;
    return {
      id: `retire-voluntary-${state.step}`,
      type: 'voluntary_retire',
      title: '退役的决定',
      text: `${age} 岁，那份合同在桌上摆了两个星期，你始终没签。剩下的只是怎么让人知道。`,
      options: [
        { id: 'keep', label: '再打两年', hint: '还想留在场上' },
        { id: 'retire', label: '就此结束职业生涯', hint: '自己决定退役' },
      ],
    };
  }
  // 决胜时刻
  {
    const r = roll(state.rngState);
    state.rngState = r.state;
    if (r.v[0] < 0.16) return showdownEvent('last_shot', state, null);
    if (r.v[0] < 0.26) return showdownEvent('free_throw', state, null);
  }
  // 22/26/30 岁左右常有转会报价
  if (state.rival && [20, 24, 28, 32].includes(age) && !state.usedRivalAges.includes(age)) {
    state.usedRivalAges.push(age);
    return rivalDuelEvent(state);
  }
  if ([22, 26, 30].includes(age) && !state.usedTransferOfferAges.includes(age)) {
    state.usedTransferOfferAges.push(age);
    const r = roll(state.rngState);
    state.rngState = r.state;
    if (r.v[0] < 0.55) {
      return { ...EVENTS.transfer_rumor, id: `transfer-rumor-${state.step}`, options: EVENTS.transfer_rumor.options.map(o => ({ ...o })) };
    }
  }
  // 34 岁以上：告别赛
  if (age >= 34 && !state.championsFarewellOffered && state.currentTeamId) {
    state.championsFarewellOffered = true;
    return {
      id: `farewell-offer-${state.step}`,
      type: 'farewell_offer',
      title: '告别赛',
      text: `${age} 岁，你在训练结束后叫住了主教练。俱乐部想为你办一场告别赛，先问问你的意思。`,
      options: [
        { id: 'accept', label: '办，跟球迷好好告别', hint: '赛季末全场为你起立' },
        { id: 'decline', label: '不办，安静地离开', hint: '低调谢幕' },
        { id: 'keep', label: '再打一年', hint: '还不想走' },
      ],
    };
  }
  const ev = pickEvent(state, age);
  return ev;
}

function retirementStyleEvent(state, reason) {
  const styles = reason === 'no_offers' || reason === 'contract' ? WALKAWAY_STYLES : FAREWELL_STYLES;
  return {
    id: `retire-style-${state.step}`,
    type: reason === 'no_offers' || reason === 'contract' ? 'walkaway_style' : 'farewell_style',
    title: '谢幕',
    text: '你宣布了退役的决定。剩下的只是怎么让人知道。',
    options: styles.map(s => ({ id: s.id, label: s.label, hint: s.hint })),
  };
}

function showdownEvent(key, state, tournament) {
  const sd = SHOWDOWNS[key];
  return {
    id: `${key}-${state.step}`,
    type: 'showdown',
    showdownKey: key,
    title: sd.title,
    text: sd.text,
    tournamentAge: tournament ? tournament.age : null,
    options: sd.options.map(o => ({ ...o })),
  };
}

function rivalDuelEvent(state) {
  const r = state.rival;
  const myPts = state.rivalSeries.reduce((s, x) => s + x.my, 0);
  const hisPts = state.rivalSeries.reduce((s, x) => s + x.rival, 0);
  const lead = hisPts > myPts ? `总得分上，他还压着你。` : `总得分上，你压着他。`;
  return {
    id: `rival-${state.step}`,
    type: 'career_event',
    title: '宿敌对决',
    text: `${state.player.age} 岁这年，你和${r.name}的每一次碰面都像季后赛。${lead}`,
    options: [
      {
        id: 'train', label: '赛后加练，研究他的打法', hint: '练成能力上涨，练过头有伤', outcomes: [
          { prob: 0.6, text: `你把${r.name}的进攻习惯研究透了，场上防得他难受。`, effects: { overallDelta: 1, permanent: true, legacy: `你和${r.name}的恩怨，又多了一页。` } },
          { prob: 0.4, text: '加练过猛，小腿拉伤。', effects: { injury: '小腿拉伤', tempDelta: -1 } },
        ],
      },
      {
        id: 'trash', label: '赛后当众放话', hint: '热度拉满，赢了封神输了挨骂', outcomes: [
          { prob: 0.5, text: `你在采访里点了${r.name}的名字，第二天全城都在讨论。`, effects: { tempDelta: 1, money: 200, legacy: `你向${r.name}下了战书。` } },
          { prob: 0.5, text: '话放出去了，下一场被打爆，成了笑柄。', effects: { tempDelta: -2 } },
        ],
      },
      {
        id: 'respect', label: '赛后握手致敬', hint: '英雄相惜', outcomes: [
          { prob: 1, text: `你和${r.name}交换了球衣。他说：下一场，我不会放水。`, effects: { roleShift: 1, legacy: `你和${r.name}互换了球衣。` } },
        ],
      },
    ],
  };
}

// ---------- 决策 ----------
export function decide(state, optionId) {
  const ev = state.currentEvent;
  if (!ev) return { state, screen: 'event' };
  const opt = ev.options.find(o => o.id === optionId);
  if (!opt) return { state, screen: 'event' };

  if (ev.type === 'sign_contract') {
    state.currentTeamId = opt.teamId;
    state.contractTeamId = opt.teamId;
    const team = TEAMS[opt.teamId];
    state.player.marketValue = marketValueOf(state.player.overall, state.player.age, LEAGUES[team.league]);
    state.lastEventOutcome = { eventKey: 'sign_contract', optionKey: opt.teamId, text: `你穿上了${team.zh}的球衣。`, kind: 'positive' };
    state.step += 1;
    state.currentEvent = null;
    return { state, screen: 'career' };
  }

  if (ev.type === 'transfer_choose') {
    const from = state.currentTeamId ? TEAMS[state.currentTeamId] : null;
    const team = TEAMS[opt.teamId];
    state.transfers.push({ age: state.player.age, from: from ? from.id : null, to: team.id });
    state.currentTeamId = team.id;
    state.contractTeamId = team.id;
    const league = LEAGUES[team.league];
    state.player.marketValue = marketValueOf(state.player.overall, state.player.age, league);
    if (team.id === state.player.foreignDreamTeamId || team.id === state.player.domesticDreamTeamId) {
      state.legacyLines.push(`你穿上了儿时主队${team.zh}的球衣。`);
    }
    state.lastEventOutcome = { eventKey: 'transfer', optionKey: team.id, text: `你加盟了${team.zh}。`, kind: 'positive' };
    state.step += 1;
    state.currentEvent = null;
    state.pendingTransfer = null;
    return { state, screen: 'career' };
  }

  if (ev.type === 'farewell_offer') {
    if (optionId === 'keep') {
      state.lastEventOutcome = { eventKey: 'farewell_offer', optionKey: 'keep', text: '你还想再打一年。', kind: 'neutral' };
      state.currentEvent = null;
      state.step += 1;
      return { state, screen: 'career' };
    }
    state.retirementReason = 'farewell';
    if (optionId === 'accept') {
      state.lastEventOutcome = { eventKey: 'farewell_offer', optionKey: 'accept', text: '赛季最后一个主场，为你办一场告别赛。', kind: 'neutral' };
      state.currentEvent = {
        id: `farewell-style-${state.step}`,
        type: 'farewell_style',
        title: '告别赛',
        text: '赛季最后一个主场，为你办一场。你想怎么告别。',
        options: FAREWELL_STYLES.map(s => ({ id: s.id, label: s.label, hint: s.hint })),
      };
    } else {
      state.lastEventOutcome = { eventKey: 'farewell_offer', optionKey: 'decline', text: '不办，安静地离开。', kind: 'neutral' };
      state.currentEvent = {
        id: `goodbye-style-${state.step}`,
        type: 'goodbye_style',
        title: '谢幕',
        text: '不办，安静地离开。',
        options: GOODBYE_STYLES.map(s => ({ id: s.id, label: s.label, hint: s.hint })),
      };
    }
    state.step += 1;
    return { state, screen: 'event' };
  }

  if (ev.type === 'farewell_style' || ev.type === 'goodbye_style' || ev.type === 'walkaway_style') {
    if (ev.type === 'farewell_style') state.farewell = optionId;
    if (ev.type === 'goodbye_style') state.goodbye = optionId;
    if (ev.type === 'walkaway_style') state.walkaway = optionId;
    state.currentEvent = null;
    return finalize(state);
  }

  if (ev.type === 'voluntary_retire') {
    if (optionId === 'keep') {
      state.lastEventOutcome = { eventKey: 'voluntary_retire', optionKey: 'keep', text: '你还想再打两年。', kind: 'neutral' };
      state.currentEvent = null;
      state.step += 1;
      return { state, screen: 'career' };
    }
    state.lastEventOutcome = { eventKey: 'voluntary_retire', optionKey: 'retire', text: '你决定把退役消息发出去。', kind: 'neutral' };
    state.currentEvent = null;
    return beginRetirement(state, 'voluntary');
  }

  if (ev.type === 'showdown') {
    return resolveShowdown(state, ev, opt);
  }

  // 普通生涯事件：掷结果
  const rng = mulberry32(state.rngState);
  const outcomes = opt.outcomes;
  let pickR = rng();
  let picked = outcomes[0];
  let acc = 0;
  for (const o of outcomes) {
    acc += o.prob;
    if (pickR < acc) { picked = o; break; }
  }
  state.rngState = (rng() * 4294967296) >>> 0 || 12345;

  const effects = picked.effects || {};
  const wasPositive = effects.overallDelta > 0 || effects.transfer || effects.money > 0 || effects.roleShift > 0;
  state.lastEventOutcome = {
    eventKey: ev.key,
    optionKey: optionId,
    text: picked.text,
    kind: wasPositive ? 'positive' : (effects.overallDelta < 0 || effects.injury || effects.suspended ? 'negative' : 'neutral'),
  };
  state.step += 1;

  // 应用效果
  const mods = state.period.modifiers || {};
  if (effects.overallDelta) state.player.overall = clamp(state.player.overall + effects.overallDelta, 40, 99);
  if (effects.roleShift) mods.roleShift = (mods.roleShift || 0) + effects.roleShift;
  if (effects.tempDelta) mods.tempDelta = (mods.tempDelta || 0) + effects.tempDelta;
  if (effects.trophyMult) mods.trophyMult = (mods.trophyMult || 1) * effects.trophyMult;
  if (effects.nationalMult) mods.nationalMult = (mods.nationalMult || 1) * effects.nationalMult;
  if (effects.salaryMult) mods.salaryMult = (mods.salaryMult || 1) * effects.salaryMult;
  if (effects.injury) mods.injury = effects.injury;
  if (effects.suspended) {
    state.suspensionSeasonsRemaining = effects.suspended;
    mods.suspended = true;
  }
  if (effects.money) state.totals.salary += effects.money;
  if (effects.nationalTeamRetired) state.nationalTeamRetiredAge = state.player.age;
  if (effects.legacy) state.legacyLines.push(effects.legacy);
  if (effects.award) state.totals.awards.push(effects.award);
  if (effects.forceRetire) {
    state.currentEvent = null;
    return beginRetirement(state, 'no_offers');
  }
  if (effects.transfer) {
    state.currentEvent = null;
    state.pendingTransfer = true;
    state.currentEvent = transferChooseEvent(state);
    return { state, screen: 'event' };
  }
  if (effects.dreamTeam) {
    const dream = state.player.domesticDreamTeamId || state.player.foreignDreamTeamId;
    if (dream) {
      state.transfers.push({ age: state.player.age, from: state.currentTeamId, to: dream });
      state.currentTeamId = dream;
      state.contractTeamId = dream;
      state.legacyLines.push(`你穿上了儿时主队${TEAMS[dream].zh}的球衣。`);
    }
  }

  state.currentEvent = null;
  return { state, screen: 'career' };
}

function resolveShowdown(state, ev, opt) {
  const key = ev.showdownKey;
  const overall = state.player.overall;
  let p = clamp(0.42 + (overall - 75) * 0.01, 0.28, 0.88);
  const mods = {
    last_shot: { three: -0.08, drive: 0.05, pass: 0.03 },
    free_throw: { calm: 0.06, quick: -0.02 },
    game7: { iso: -0.04, screen: 0.06 },
    qualifier_showdown: { aggressive: -0.06, steady: 0.07 },
    world_cup_showdown: { hero: -0.05, team: 0.05 },
  };
  p = clamp(p + (mods[key]?.[opt.id] || 0), 0.22, 0.92);
  const rng = mulberry32(state.rngState);
  const won = rng() < p;
  state.rngState = (rng() * 4294967296) >>> 0 || 12345;
  state.showdownWins[key] += won ? 1 : 0;
  const text = won ? opt.successText : opt.failText;
  state.lastEventOutcome = { eventKey: key, optionKey: opt.id, text, kind: won ? 'positive' : 'negative' };
  state.step += 1;

  if (key === 'last_shot' && won) state.legacyLines.push('终场哨响前，你把球投进了。');
  if (key === 'free_throw' && won) state.legacyLines.push('关键罚球，你稳稳两罚全中。');
  if (key === 'game7' && won) state.legacyLines.push('抢七大战，你带走了系列赛。');

  if (key === 'qualifier_showdown' && ev.tournamentAge) {
    const t = state.tournaments.find(t2 => t2.age === ev.tournamentAge);
    if (t) t.qualified = won;
    state.pendingQualifier = { age: ev.tournamentAge, won };
    if (won) state.legacyLines.push('生死战，你把国家队送进了大赛。');
  }

  if (key === 'world_cup_showdown') {
    const nat = state.nationalTeamPeriods.find(n => n.age === ev.tournamentAge);
    if (nat) {
      if (won) {
        nat.result = 'champion';
        state.totals.trophies.push(nat.type === 'world_cup' ? 'world_cup' : 'olympics');
        state.legacyLines.push(nat.type === 'world_cup' ? '你把世界杯举过头顶。' : '奥运金牌挂在了你的脖子上。');
        if (state.player.overall >= 86) state.totals.awards.push('tournament_mvp');
      } else {
        nat.result = 'semis';
      }
    }
    state.pendingWorldCupUpgrade = null;
  }

  state.currentEvent = null;
  return { state, screen: 'career' };
}

function beginRetirement(state, reason) {
  state.retirementReason = reason;
  if (reason === 'voluntary' && state.player.age <= 32) state.endingBeat = '在最好看的时候转身';
  state.currentEvent = retirementStyleEvent(state, reason);
  return { state, screen: 'event' };
}

// ---------- 结算 ----------
export function maxOverall(state) {
  let m = state.player.overall;
  for (const s of state.seasons) m = Math.max(m, s.overall);
  return m;
}

export function peakSeason(state) {
  let best = null;
  for (const s of state.seasons) {
    if (!best || s.overall > best.overall) best = s;
  }
  return best;
}

export function clubsOf(state) {
  const map = new Map();
  for (const s of state.seasons) {
    if (!s.teamId || s.youth) continue;
    const key = s.teamId;
    if (!map.has(key)) {
      map.set(key, { teamId: key, seasons: 0, stats: { g: 0, pts: 0, reb: 0, ast: 0 }, trophies: [], awards: [] });
    }
    const c = map.get(key);
    c.seasons += 1;
    c.stats.g += s.stats.g;
    c.stats.pts += s.stats.pts;
    c.stats.reb += s.stats.reb;
    c.stats.ast += s.stats.ast;
    s.trophies.forEach(x => c.trophies.push(x));
    s.awards.forEach(x => c.awards.push(x));
  }
  return [...map.values()];
}

export function trophyCounts(trophies) {
  const counts = {};
  for (const t of trophies) counts[t] = (counts[t] || 0) + 1;
  return counts;
}

export function trophyZh(id) {
  if (id === 'world_cup') return '世界杯';
  if (id === 'olympics') return '奥运会';
  if (id === 'continental') return '洲际冠军';
  if (id.startsWith('league:')) {
    const lg = LEAGUES[id.slice(7)];
    return lg ? lg.champ : '联赛冠军';
  }
  if (id.startsWith('cup:')) {
    const lg = LEAGUES[id.slice(4)];
    return lg && lg.cupName ? lg.cupName : '杯赛冠军';
  }
  return '冠军';
}

export function awardZh(id) {
  const map = {
    allstar: '全明星',
    all_team: '最佳阵容',
    mvp: '常规赛MVP',
    fmvp: '总决赛MVP',
    dpoy: '最佳防守球员',
    scoring_title: '得分王',
    rebound_title: '篮板王',
    assist_title: '助攻王',
    tournament_mvp: '大赛MVP',
    tournament_all_team: '大赛最佳阵容',
    allstar_mvp: '全明星MVP',
    dunk_king: '扣篮大赛冠军',
    three_king: '三分大赛冠军',
  };
  return map[id] || id;
}

export function tournamentZh(type) {
  return { world_cup: '世界杯', olympics: '奥运会', continental: '洲际锦标赛' }[type] || type;
}

export function resultZh(result, league, type = 'club') {
  if (type === 'club') {
    const map = {
      champion: league && league.tier === 1 ? 'NBA总冠军' : '联赛冠军',
      final: '总决赛/决赛',
      semis: '四强',
      quarters: '八强',
      playoffs: '季后赛',
      missed: '无缘季后赛',
      youth: '青训营',
    };
    return map[result] || result;
  }
  const map = {
    champion: '冠军',
    semis: '四强',
    quarters: '八强',
    group: '小组赛',
    not_qualified: '未出线',
    not_called: '未入选',
  };
  return map[result] || result;
}

function epitaph(state) {
  const peak = maxOverall(state);
  const t = state.totals;
  const lines = [];
  if (t.trophies.includes('world_cup')) lines.push('一路打到世界之巅，能拿的都拿到了。');
  else if (peak >= 96) lines.push('天生的妖人胚子，真的打到了 ' + peak + '。');
  else if (peak >= 90 && t.trophies.length === 0) lines.push('强到无可争议，却始终两手空空。');
  else if (clubsOf(state).length === 1 && state.seasons.filter(s => !s.youth).length >= 8) lines.push('一辈子只穿一件球衣。');
  else if (peak >= 85 && state.player.overall <= 72) lines.push('不是每个天才都来得及长大。');
  else if (state.player.age >= 38) lines.push('同龄人都挂靴了，你还在名单里。');
  else lines.push('从青训到传奇，每个决定都算数。');
  if (state.endingBeat) lines.push(state.endingBeat);
  return lines.join('');
}

export function computeTitles(state) {
  const t = state.totals;
  const peak = maxOverall(state);
  const peakAge = peakSeason(state)?.age ?? 16;
  const clubs = clubsOf(state);
  const proSeasons = state.seasons.filter(s => !s.youth && s.teamId);
  const won = (id) => t.trophies.includes(id);
  const countAward = (id) => t.awards.filter(a => a === id).length;
  const champCount = t.trophies.filter(x => x.startsWith('league:') || x.startsWith('cup:')).length;
  const titles = [];
  const unlocked = (id, quote) => titles.push({ id, quote });

  if (peak >= 96) unlocked('tian_zhijiaozi', `巅峰能力 ${peak}，真·天之骄子。`);
  if (peak >= 93 && (state.player.debutOverall || 99) <= 72) unlocked('yao_ren_dx', `出道 ${state.player.debutOverall}，巅峰 ${peak}。`);
  if (peak >= 88 && (state.player.debutOverall || 99) <= 62 && peakAge >= 28) unlocked('da_qi_wan_cheng', `晚熟型球员，硬是把自己练到了 ${peak}。`);
  if (peak >= 85 && state.player.overall <= 72) unlocked('shang_zhong_yong', `巅峰 ${peak}，退役时只有 ${state.player.overall}。`);
  if (clubs.length === 1 && proSeasons.length >= 8) unlocked('yi_ren_yi_cheng', '一生只效力一支球队。');
  if (clubs.length >= 6) unlocked('lan_tan_liu_lang_zhe', `效力过 ${clubs.length} 支球队，走到哪都是客场。`);
  if (t.apps >= 1000) unlocked('tie_ren', `生涯出场 ${fmtInt(t.apps)} 场，铁人。`);
  if (t.pts >= 30000) unlocked('de_fen_ji_qi', `生涯总得分 ${fmtInt(Math.round(t.pts))}。`);
  if (state.seasons.some(s => s.stats.avg && s.stats.avg.pts >= 10 && s.stats.avg.reb >= 10 && s.stats.avg.ast >= 10)) unlocked('san_shuang_ji_qi', '单季场均三双，只有怪物能打出来。');
  if (peak >= 90 && champCount === 0 && !won('world_cup') && !won('olympics')) unlocked('wu_mian_zhi_wang', `巅峰 ${peak}，却一冠未得。`);
  if (won('world_cup') || won('olympics')) unlocked('shi_jie_zhi_dian', '世界之巅，你站上去过。');
  if ((won('world_cup') || won('olympics')) && countAward('fmvp') >= 1 && peak >= 96) unlocked('lan_qiu_zhi_shen', '世界杯 + FMVP + 巅峰 96，篮球之神。');
  if (won('world_cup') && won('olympics') && won('continental') && champCount >= 2) unlocked('jin_man_guan', '世界杯、奥运、洲际、联赛，全拿过。');
  if (consecutiveTitles(state) >= 3) unlocked('wang_chao_ji', `同一支球队 ${consecutiveTitles(state)} 连冠，王朝。`);
  if (champCount >= 12) unlocked('guan_jun_shou_ge_ji', `生涯 ${champCount} 座奖杯。`);
  if (t.salary >= 200000) unlocked('lan_tan_shou_fu', `生涯总收入 ${fmtMoney(t.salary)}。`);
  if (state.seasons.some(s => s.salary >= 30000)) unlocked('tian_jia_he_tong', `单季年薪 ${fmtMoney(Math.max(...state.seasons.map(s => s.salary)))}。`);
  if (countAward('allstar') >= 10) unlocked('quan_ming_xing_zhi_wang', `${countAward('allstar')} 次全明星。`);
  if (countAward('mvp') >= 4) unlocked('zui_you_jia_zhi', `${countAward('mvp')} 次常规赛MVP。`);
  if (countAward('fmvp') >= 3) unlocked('zong_jue_sai_zhi_wang', `${countAward('fmvp')} 次总决赛MVP。`);
  if (countAward('scoring_title') >= 5) unlocked('de_fen_wang', `${countAward('scoring_title')} 次得分王。`);
  if (countAward('rebound_title') >= 5 || t.reb >= 15000) unlocked('lan_ban_guai_shou', '篮板就是命。');
  if (countAward('assist_title') >= 5 || t.ast >= 10000) unlocked('zu_zhi_da_shi', '把队友喂成巨星。');
  if (countAward('dpoy') >= 3) unlocked('fang_shou_tie_zha', `${countAward('dpoy')} 次最佳防守球员。`);
  if (state.player.age >= 38 && proSeasons.length >= 18) unlocked('bu_lao_chuan_shuo', `${state.player.age} 岁还在打，不老传说。`);
  if ((state.retirementReason === 'voluntary' || state.farewell) && state.player.age <= 32 && peak >= 90) unlocked('ji_liu_yong_tui', '在最好看的时候转身。');
  if (state.nationalTeamPeriods.length >= 10) unlocked('guo_jia_dui_qi_zhi', `为国出战 ${state.nationalTeamPeriods.length} 届大赛。`);
  const dreamTeam = state.player.domesticDreamTeamId || state.player.foreignDreamTeamId;
  if (dreamTeam && t.trophies.some(id => id === `league:${TEAMS[dreamTeam].league}`)) unlocked('yuan_meng_ren', '为儿时主队拿过冠军，圆梦。');
  if (state.showdownWins.last_shot > 0) unlocked('jue_sha_zhi_wang', '关键球，交给我。');
  if (state.showdownWins.free_throw >= 2) unlocked('fa_qiu_da_shi', '罚球线上，从不手软。');
  const rs = state.rivalSeries || [];
  if (state.rival && rs.length >= 8 && rs.filter(x => x.myChamp).length >= 1 && rs.filter(x => x.rivalChamp).length >= 1) {
    unlocked('yi_sheng_zhi_di', `你和${state.rival.name}斗了一辈子，谁也没服过谁。`);
  }
  if (state.rival && rs.length >= 6) {
    const myPts = rs.reduce((s, x) => s + x.my, 0);
    const hisPts = rs.reduce((s, x) => s + x.rival, 0);
    const myChamp = rs.filter(x => x.myChamp).length;
    const hisChamp = rs.filter(x => x.rivalChamp).length;
    if (myPts >= hisPts * 1.05 && myChamp > hisChamp) {
      unlocked('yan_zhong_ding', `你压了${state.rival.name}一辈子。`);
    }
  }

  return titles;
}

function consecutiveTitles(state) {
  let best = 0, cur = 0, curTeam = null;
  for (const s of state.seasons) {
    const champ = s.trophies.some(x => x.startsWith('league:'));
    if (champ && s.teamId === curTeam) cur += 1;
    else if (champ) { cur = 1; curTeam = s.teamId; }
    else { cur = 0; curTeam = null; }
    best = Math.max(best, cur);
  }
  return best;
}

export function nationalLine(state) {
  const periods = state.nationalTeamPeriods;
  if (periods.length === 0) return null;
  const games = periods.reduce((s, p) => s + (p.stats ? p.stats.g : 0), 0);
  const pts = periods.reduce((s, p) => s + (p.stats ? p.stats.pts : 0), 0);
  const reb = periods.reduce((s, p) => s + (p.stats ? p.stats.reb : 0), 0);
  const ast = periods.reduce((s, p) => s + (p.stats ? p.stats.ast : 0), 0);
  const golds = periods.filter(p => p.result === 'champion').length;
  return { games, pts, reb, ast, golds };
}

export function finalize(state) {
  state.phase = 'summary';
  state.currentEvent = null;
  if (!state.endingBeat) {
    if (state.retirementReason === 'voluntary' && state.player.age <= 32) state.endingBeat = '在最好看的时候转身';
    if (state.player.age >= 38) state.endingBeat = '同龄人都挂靴了，你还在名单里。';
  }
  return { state, screen: 'summary' };
}

export function buildSummary(state) {
  const peak = maxOverall(state);
  const t = state.totals;
  const nat = nationalLine(state);
  const titles = computeTitles(state);
  const clubs = clubsOf(state);
  const proSeasons = state.seasons.filter(s => !s.youth && s.teamId);
  const rs = state.rivalSeries || [];
  const rival = state.rival && rs.length ? {
    name: state.rival.name,
    nationality: state.rival.nationality,
    peak: state.rival.peak,
    series: rs.length,
    myPts: Math.round(rs.reduce((s, x) => s + x.my, 0)),
    rivalPts: Math.round(rs.reduce((s, x) => s + x.rival, 0)),
    myChamps: rs.filter(x => x.myChamp).length,
    rivalChamps: rs.filter(x => x.rivalChamp).length,
    myMvp: rs.filter(x => x.myMvp).length,
    rivalMvp: rs.filter(x => x.rivalMvp).length,
  } : null;
  return {
    seed: state.seed,
    player: {
      name: state.player.name,
      nationality: state.player.nationality,
      position: state.player.positionZh,
      positionEn: POSITIONS[state.player.position].en,
      number: state.player.number,
      hand: state.player.hand,
    },
    maxOverall: peak,
    peakAge: peakSeason(state)?.age ?? 16,
    peakValue: Math.max(...state.seasons.map(s => s.marketValue || 0), state.player.marketValue),
    totalIncome: t.salary,
    totals: {
      apps: t.apps,
      pts: Math.round(t.pts),
      reb: Math.round(t.reb),
      ast: Math.round(t.ast),
      stl: Math.round(t.stl),
      blk: Math.round(t.blk),
    },
    national: nat ? {
      games: nat.games,
      pts: Math.round(nat.pts),
      reb: Math.round(nat.reb),
      ast: Math.round(nat.ast),
      golds: nat.golds,
    } : null,
    titles,
    titleIds: titles.map(x => x.id),
    epitaph: epitaph(state),
    percentile: percentileOf(peak),
    clubs: clubs.map(c => {
      const team = TEAMS[c.teamId];
      return {
        teamId: c.teamId,
        abbr: team.abbr,
        name: team.zh,
        color: team.color,
        isLight: isLight(team.color),
        elite: team.strength >= 85,
        seasons: c.seasons,
        games: c.stats.g,
        pts: Math.round(c.stats.pts),
        reb: Math.round(c.stats.reb),
        ast: Math.round(c.stats.ast),
        trophies: c.trophies,
        awards: c.awards,
      };
    }),
    seasonsCount: proSeasons.length,
    legacyLines: state.legacyLines,
    highlights: (state.highlights || []).slice(-14),
    rival,
    farewell: state.farewell,
    goodbye: state.goodbye,
    walkaway: state.walkaway,
    retirementReason: state.retirementReason,
    endingBeat: state.endingBeat,
    savedAt: Date.now(),
  };
}

export function isLight(hex) {
  const c = hex.replace('#', '');
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 165;
}

export function endingZh(reason) {
  const map = {
    age: '挂靴',
    voluntary: '主动退役',
    no_offers: '无人问津',
    farewell: '告别赛',
    contract: '合同到期',
  };
  return map[reason] || '退役';
}

// ---------- 存档 ----------
export function saveState(state) {
  try {
    localStorage.setItem(`bl-save:${state.seed}`, JSON.stringify(state));
  } catch (e) { /* ignore */ }
}

export function loadState(seed) {
  try {
    const raw = localStorage.getItem(`bl-save:${seed}`);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

export function clearState(seed) {
  try { localStorage.removeItem(`bl-save:${seed}`); } catch (e) { /* ignore */ }
}

export function saveArchive(summary) {
  try {
    const key = 'bl-archive';
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    list.unshift(summary);
    const dedup = [];
    const seen = new Set();
    for (const it of list) {
      if (!seen.has(it.seed)) { seen.add(it.seed); dedup.push(it); }
    }
    localStorage.setItem(key, JSON.stringify(dedup.slice(0, 50)));
  } catch (e) { /* ignore */ }
}

export function loadArchive() {
  try {
    return JSON.parse(localStorage.getItem('bl-archive') || '[]');
  } catch (e) { return []; }
}

export function galleryState() {
  const archive = loadArchive();
  const unlocked = new Map();
  for (const a of archive) {
    for (const t of (a.titles || [])) {
      if (!unlocked.has(t.id)) unlocked.set(t.id, t.quote);
    }
  }
  return { unlocked, total: TITLES.length };
}
