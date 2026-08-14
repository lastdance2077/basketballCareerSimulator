// ================= 篮球生涯模拟器 · UI =================
import {
  APP_TITLE, TAGLINE, MODES, POSITIONS, COUNTRIES, LEAGUES, TEAMS, TITLES, UPDATES,
} from './data.js';
import * as E from './engine.js';

const root = document.getElementById('root');

const app = {
  view: 'home',
  mode: 'standard',
  state: null,
  seed: null,
  archived: false,
  identity: {
    name: '',
    nationality: 'CN',
    position: 'sg',
    hand: '右',
    number: String(8 + Math.floor(Math.random() * 20)),
    domesticDream: '',
    foreignDream: '',
  },
  modal: null,
  archiveDetail: null,
  shareDataUrl: null,
  invite: '',
};

// ---------- 工具 ----------
function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function timeAgo(ts) {
  const d = Date.now() - ts;
  if (d < 60000) return '刚刚';
  if (d < 3600000) return Math.floor(d / 60000) + ' 分钟前';
  if (d < 86400000) return Math.floor(d / 3600000) + ' 小时前';
  if (d < 604800000) return Math.floor(d / 86400000) + ' 天前';
  const date = new Date(ts);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

function toast(msg) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1800);
}

function shell(inner) {
  return `<div class="app">${inner}</div>`;
}

function topbarHTML() {
  const s = app.state;
  if (!s) return '';
  const p = s.player;
  const team = s.currentTeamId ? TEAMS[s.currentTeamId] : null;
  const pct = Math.round(((p.overall - 40) / 59) * 100);
  const r = 20, c = 2 * Math.PI * r;
  return `
    <div class="topbar">
      <div class="rating-ring">
        <svg viewBox="0 0 46 46">
          <circle cx="23" cy="23" r="${r}" fill="none" stroke="#27272a" stroke-width="3.5"/>
          <circle cx="23" cy="23" r="${r}" fill="none" stroke="#10b981" stroke-width="3.5"
            stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - pct / 100)}"/>
        </svg>
        <span class="val num">${p.overall}</span>
      </div>
      <div class="who">
        <div class="name">${esc(p.name)}</div>
        <div class="meta">${p.age} 岁 · ${team ? esc(team.zh) : '青训营'} · ${esc(E.roleName(s.seasons[s.seasons.length - 1]?.role || 'starter'))}</div>
      </div>
      <div class="money">
        <div class="v num">${E.fmtMoney(p.marketValue)}</div>
        <div class="s">身价</div>
      </div>
    </div>`;
}

// ---------- 首页 ----------
function homeHTML() {
  const archive = E.loadArchive();
  const resume = (app.seed && E.loadState(app.seed)) || latestSave()?.state;
  const modeCards = Object.entries(MODES).map(([key, m]) => `
    <button class="mode-card ${app.mode === key ? 'active' : ''}" onclick="BL.setMode('${key}')">
      ${m.recommended ? '<span class="rec">推荐</span>' : ''}
      <div class="name">${m.label}</div>
      <div class="hint">${m.hint}</div>
    </button>`).join('');
  return shell(`
    <div class="scroll">
      <div class="home-hero">
        <div class="home-ball">🏀</div>
        <h1 class="home-title">${APP_TITLE}</h1>
        <p class="home-tagline">${TAGLINE}<br/>选一个国籍和位置，从 16 岁打到退役。转会、伤病、绝杀、国家队，每个决定都算数。</p>
      </div>

      <div class="label">节奏</div>
      <div class="mode-grid">${modeCards}</div>

      <div class="home-actions">
        <button class="btn btn-primary btn-lg btn-block" onclick="BL.start()">开始生涯</button>
        ${resume ? `<button class="btn btn-outline btn-block" onclick="BL.resume()">继续上一局</button>` : ''}
      </div>

      <div class="home-sub">
        <button class="btn" onclick="BL.openArchive()">历史档案${archive.length ? ` · ${archive.length}` : ''}</button>
        <button class="btn" onclick="BL.openGallery()">称号图鉴</button>
      </div>

      <div class="invite-row">
        <input id="invite-input" maxlength="40" placeholder="粘贴朋友给你的编号" value="${esc(app.invite)}" oninput="BL.setInvite(this.value)"/>
        <button class="btn btn-outline" onclick="BL.useInvite()">开局</button>
      </div>

      <div class="home-foot">
        <button onclick="BL.openUpdates()">查看本期更新说明</button><br/>
        玩法一直在更新，点击关注
      </div>
    </div>
    ${app.modal ? modalHTML() : ''}
  `);
}

function latestSave() {
  try {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('bl-save:'));
    if (!keys.length) return null;
    const key = keys.sort().pop();
    return { seed: key.slice(8), state: JSON.parse(localStorage.getItem(key)) };
  } catch (e) {
    return null;
  }
}

// ---------- 建档 ----------
function identityHTML() {
  const id = app.identity;
  const country = COUNTRIES[id.nationality];
  const tierHint = {
    1: '世界强队，大赛常客',
    2: '要凭真本事去挤，有机会进',
    3: '门槛不低，全靠你扛',
  }[country.tier];
  const natGrid = Object.entries(COUNTRIES).map(([code, c]) => `
    <button class="pick ${id.nationality === code ? 'active' : ''}" onclick="BL.setNationality('${code}')">
      <span class="fl">${c.flag}</span>${c.zh}
    </button>`).join('');
  const posGrid = Object.entries(POSITIONS).map(([key, p]) => `
    <button class="pick ${id.position === key ? 'active' : ''}" onclick="BL.setPosition('${key}')">
      ${p.zh}<span class="en">${p.en}</span>
    </button>`).join('');
  const domesticTeams = Object.values(TEAMS).filter(t => t.league === country.league)
    .sort((a, b) => a.zh.localeCompare(b.zh, 'zh'));
  const foreignTeams = Object.values(TEAMS).filter(t => t.league !== country.league)
    .sort((a, b) => LEAGUES[a.league].tier - LEAGUES[b.league].tier || a.zh.localeCompare(b.zh, 'zh'));
  const domOptions = `<option value="">不选</option>` + domesticTeams.map(t =>
    `<option value="${t.id}" ${id.domesticDream === t.id ? 'selected' : ''}>${esc(t.zh)}</option>`).join('');
  const forOptions = `<option value="">不选</option>` + foreignTeams.map(t =>
    `<option value="${t.id}" ${id.foreignDream === t.id ? 'selected' : ''}>${esc(LEAGUES[t.league].zh)} · ${esc(t.zh)}</option>`).join('');
  return shell(`
    <div class="page-head">
      <button class="btn btn-ghost" onclick="BL.backHome()">← 返回</button>
      <h2>建立档案</h2>
    </div>
    <div class="scroll">
      <div class="ident-section">
        <h3>给自己起个名字</h3>
        <input class="name-input" maxlength="12" placeholder="输入姓名" value="${esc(id.name)}" oninput="BL.setName(this.value)"/>
      </div>

      <div class="ident-section">
        <h3>你是哪国人 <span class="sub">国籍决定国家队的门槛和你能捧起哪座冠军</span></h3>
        <div class="grid-3">${natGrid}</div>
        <div class="hint-bar">${esc(country.zh)} · ${tierHint}</div>
      </div>

      <div class="ident-section">
        <h3>打哪个位置 <span class="sub">位置决定你的得分权重，也决定你拿什么奖</span></h3>
        <div class="grid-5">${posGrid}</div>
        <div class="hint-bar">${esc(POSITIONS[id.position].hint)}</div>
      </div>

      <div class="ident-section">
        <h3>惯用手</h3>
        <div class="seg">
          <button class="pick ${id.hand === '右' ? 'active' : ''}" onclick="BL.setHand('右')">右手</button>
          <button class="pick ${id.hand === '左' ? 'active' : ''}" onclick="BL.setHand('左')">左手</button>
        </div>
      </div>

      <div class="ident-section">
        <h3>球衣号码</h3>
        <div class="num-row">
          <input type="number" min="0" max="99" value="${id.number}" oninput="BL.setNumber(this.value)"/>
          <span class="muted">号球衣</span>
        </div>
      </div>

      <div class="ident-section">
        <h3>儿时主队 <span class="sub">主队不影响能力发育，但你有圆梦的机会</span></h3>
        <div class="muted-2" style="margin-bottom:6px">国内主队</div>
        <select class="team-select" onchange="BL.setDream('domestic', this.value)">${domOptions}</select>
        <div class="muted-2" style="margin:10px 0 6px">海外主队</div>
        <select class="team-select" onchange="BL.setDream('foreign', this.value)">${forOptions}</select>
      </div>

      <div style="height:14px"></div>
      <button class="btn btn-primary btn-lg btn-block" onclick="BL.confirmIdentity()">开始生涯</button>
      <div style="height:24px"></div>
    </div>
  `);
}

// ---------- 生涯 ----------
function careerHTML() {
  const s = app.state;
  let body = '';
  if (s.phase === 'summary') {
    return summaryHTML();
  }
  if (app.receipt) {
    // 决策回执优先：显示结果，点一下继续
    body = receiptHTML(s) + (s.currentEvent ? `<div class="banner-tip" style="margin-top:8px">轻触继续</div>` : '');
  } else if (app.pendingBanner) {
    // 先展示刚结束的赛季横幅，再进入事件
    body = bannerHTML(app.lastBanner);
  } else {
    body = s.currentEvent ? eventHTML(s.currentEvent) : bannerHTML(app.lastBanner);
  }
  return shell(`
    ${topbarHTML()}
    <div class="scroll" style="padding-top:6px">
      ${body}
    </div>
    ${app.modal ? modalHTML() : ''}
  `);
}

function bannerHTML(snapshot) {
  if (!snapshot) return `<div class="empty" onclick="BL.next()" style="cursor:pointer">轻触继续</div>`;
  const team = snapshot.teamId ? TEAMS[snapshot.teamId] : null;
  const lg = snapshot.leagueId ? LEAGUES[snapshot.leagueId] : null;
  const st = snapshot.stats || {};
  const avg = st.avg || {};
  const resultKey = snapshot.result.league;
  const resultText = E.resultZh(resultKey, lg);
  const nat = snapshot.national;
  const natText = nat ? nationalBannerText(nat) : null;
  return `
    <div class="banner" onclick="BL.next()" style="cursor:pointer">
      <div class="banner-head">
        <div class="age">${snapshot.age} <small>岁</small></div>
        <div class="team">${snapshot.youth ? '青训营' : team ? esc(team.zh) : ''}${lg ? ` · ${esc(lg.zh)}` : ''}</div>
      </div>
      <div class="banner-body">
        <div class="banner-row">
          <span class="k">能力</span>
          <span class="v num">${snapshot.overall} ${snapshot.suspended ? '<span class="txt-red">· 禁赛</span>' : ''}</span>
        </div>
        <div class="banner-row">
          <span class="k">角色</span>
          <span class="v">${snapshot.suspended ? '停赛' : E.roleName(snapshot.role)}</span>
        </div>
        ${snapshot.youth ? '' : `<div class="banner-row">
          <span class="k">赛季战绩</span>
          <span class="v ${resultKey === 'champion' ? 'hl' : ''}">${resultText}</span>
        </div>`}
        ${snapshot.cup ? `<div class="banner-row">
          <span class="k">杯赛</span>
          <span class="v ${snapshot.cup === 'cup_champion' ? 'hl' : ''}">${snapshot.cup === 'cup_champion' ? '冠军 🏆' : '决赛'}</span>
        </div>` : ''}
        ${natText ? `<div class="banner-row"><span class="k">国家队</span><span class="v">${natText}</span></div>` : ''}
        ${snapshot.trophies.length ? `<div class="banner-row"><span class="k">新奖杯</span><span class="v hl">${snapshot.trophies.map(E.trophyZh).join(' · ')}</span></div>` : ''}
        ${snapshot.awards.length ? `<div class="banner-row"><span class="k">个人荣誉</span><span class="v pos">${snapshot.awards.map(E.awardZh).join(' · ')}</span></div>` : ''}
        ${snapshot.highlight ? `<div class="banner-row"><span class="k">本赛季高光</span><span class="v hl">${esc(snapshot.highlight)}</span></div>` : ''}
        ${snapshot.youth ? '' : `<div class="banner-row">
          <span class="k">年薪</span>
          <span class="v num">${E.fmtMoney(snapshot.salary)}</span>
        </div>`}
      </div>
      ${snapshot.youth ? '' : `
      <div class="banner-stats" style="padding:10px 14px 12px">
        <div><div class="num">${st.g}</div><div class="lab">出场</div></div>
        <div><div class="num">${E.fmtAvg(avg.pts)}</div><div class="lab">得分</div></div>
        <div><div class="num">${E.fmtAvg(avg.reb)}</div><div class="lab">篮板</div></div>
        <div><div class="num">${E.fmtAvg(avg.ast)}</div><div class="lab">助攻</div></div>
        <div><div class="num">${st.pts ? Math.round(st.pts) : 0}</div><div class="lab">总得分</div></div>
      </div>`}
    </div>
    <div class="banner-tip">轻触继续</div>`;
}

function nationalBannerText(nat) {
  const zh = E.tournamentZh(nat.type);
  if (nat.result === 'not_called') return `${zh} · 未入选`;
  if (nat.result === 'not_qualified') return `${zh} · 未出线`;
  const stats = nat.stats;
  const statStr = stats ? ` · ${stats.g} 场 ${Math.round(stats.pts)} 分` : '';
  return `${zh} · ${E.resultZh(nat.result, null, 'national')}${statStr}`;
}

function eventHTML(ev) {
  const isShowdown = ev.type === 'showdown';
  const tag = isShowdown ? '决胜时刻' : ev.type === 'farewell_offer' || ev.type === 'voluntary_retire' || ev.type === 'farewell_style' ? '谢幕' : '决策';
  return `
    <div class="event-card">
      <span class="event-tag">${tag}</span>
      <h2 class="event-title">${esc(ev.title)}</h2>
      <p class="event-text">${esc(ev.text)}</p>
      <div class="option-list">
        ${ev.options.map(o => `
          <button class="option" onclick="BL.choose('${o.id.replace(/'/g, '')}')">
            <div class="o-label">${esc(o.label)}</div>
            ${o.hint ? `<div class="o-hint">${esc(o.hint)}</div>` : ''}
          </button>`).join('')}
      </div>
    </div>`;
}

function receiptHTML(s) {
  const r = s.lastEventOutcome;
  const kind = r ? r.kind : 'neutral';
  const cls = kind === 'positive' ? '' : kind === 'negative' ? ' neg' : '';
  const title = kind === 'positive' ? '成了' : kind === 'negative' ? '砸了' : '回执';
  const text = r ? r.text : '你做了一个决定。';
  return `
    <div class="receipt${cls}" onclick="BL.next()" style="cursor:pointer">
      <div class="r-title">${title}</div>
      <div class="r-text">${esc(text)}</div>
    </div>`;
}

// ---------- 结算 ----------
function summaryHTML() {
  const s = app.state;
  const sum = E.buildSummary(s);
  if (!app.archived) {
    E.saveArchive(sum);
    app.archived = true;
  }
  const t = sum.totals;
  const nat = sum.national;
  const trophyCounts = E.trophyCounts(s.totals.trophies);
  const trophyEntries = Object.entries(trophyCounts).slice(0, 10);
  const titleChips = sum.titles.map(x => `<span class="sum-title">${TITLES.find(t => t.id === x.id)?.art || '🏅'} ${esc(TITLES.find(t => t.id === x.id)?.name || '')}</span>`).join('');
  return shell(`
    <div class="scroll summary-scroll">
      <div class="sum-hero">
        <div class="sum-hero-top">
          <div class="rating-ring" style="width:58px;height:58px">
            <svg viewBox="0 0 46 46">
              <circle cx="23" cy="23" r="20" fill="none" stroke="#27272a" stroke-width="3.5"/>
              <circle cx="23" cy="23" r="20" fill="none" stroke="#fbbf24" stroke-width="3.5"
                stroke-linecap="round" stroke-dasharray="125.66" stroke-dashoffset="${125.66 * (1 - sum.maxOverall / 99)}"/>
            </svg>
            <span class="val" style="font-size:16px">${sum.maxOverall}</span>
          </div>
          <div>
            <div class="name">${esc(sum.player.name)}</div>
            <div class="tags">
              <span class="chip chip-zinc">${esc(sum.player.nationality)}</span>
              <span class="chip chip-green">#${sum.player.number} ${esc(sum.player.positionEn)} ${esc(sum.player.position)}</span>
              <span class="chip chip-zinc">${esc(sum.player.hand)}手</span>
            </div>
          </div>
          <div class="sum-value">
            <div class="k">巅峰身价</div>
            <div class="v num">${E.fmtMoney(sum.peakValue)}</div>
            <div class="k" style="margin-top:8px">生涯总收入</div>
            <div class="v sub num">${E.fmtMoney(sum.totalIncome)}</div>
          </div>
        </div>
        <div class="sum-ending">
          <div class="k">生涯结局</div>
          <div class="t">${esc(sum.titles[0] ? TITLES.find(x => x.id === sum.titles[0].id)?.name || '传奇' : '完整的一生')}</div>
          <div class="p">超过了 ${sum.percentile}% 的球员</div>
          <div class="e">${esc(sum.epitaph)}</div>
        </div>
      </div>

      <div class="sum-block">
        <div class="sum-stats">
          <div><div class="k">出场</div><div class="v num">${E.fmtInt(t.apps)}</div></div>
          <div><div class="k">总得分</div><div class="v num">${E.fmtInt(t.pts)}</div></div>
          <div><div class="k">总篮板</div><div class="v num">${E.fmtInt(t.reb)}</div></div>
          <div><div class="k">总助攻</div><div class="v num">${E.fmtInt(t.ast)}</div></div>
          <div><div class="k">抢断</div><div class="v num">${E.fmtInt(t.stl)}</div></div>
          <div><div class="k">盖帽</div><div class="v num">${E.fmtInt(t.blk)}</div></div>
        </div>
      </div>

      ${nat ? `
      <div class="sum-block">
        <h4>国家队</h4>
        <div class="card" style="padding:12px;text-align:center">
          <div class="muted-2" style="font-weight:800">${esc(sum.player.nationality)} · 大赛 ${nat.games} 场 · ${nat.pts} 分 · ${nat.reb} 板 · ${nat.ast} 助 · 冠军 ${nat.golds} 次</div>
        </div>
      </div>` : ''}

      ${sum.highlights?.length ? `
      <div class="sum-block">
        <h4>生涯高光</h4>
        <div class="card" style="padding:14px">
          ${sum.highlights.map(h => `<div class="sum-legacy" style="margin-top:6px">· ${h.age}岁 ${esc(h.text)}</div>`).join('')}
        </div>
      </div>` : ''}

      ${sum.rival ? `
      <div class="sum-block">
        <h4>一生之敌</h4>
        <div class="card" style="padding:14px">
          <div style="text-align:center;font-weight:900;font-size:15px">${esc(sum.rival.name)} <span class="muted-2" style="font-weight:700">· ${esc(sum.rival.nationality)} · 巅峰 ${sum.rival.peak}</span></div>
          <div style="margin-top:10px">
            <div class="banner-row"><span class="k">交手赛季</span><span class="v num">${sum.rival.series}</span></div>
            <div class="banner-row"><span class="k">总得分</span><span class="v num">你 ${E.fmtInt(sum.rival.myPts)} : ${E.fmtInt(sum.rival.rivalPts)} 他</span></div>
            <div class="banner-row"><span class="k">联赛冠军</span><span class="v num">你 ${sum.rival.myChamps} : ${sum.rival.rivalChamps} 他</span></div>
            <div class="banner-row"><span class="k">常规赛MVP</span><span class="v num">你 ${sum.rival.myMvp} : ${sum.rival.rivalMvp} 他</span></div>
          </div>
          <div style="margin-top:10px;text-align:center;font-size:12px;color:var(--amber);font-weight:800">
            ${sum.rival.myPts >= sum.rival.rivalPts ? `总得分，你赢了。` : `总得分，他赢了。`}
            ${sum.rival.myChamps > sum.rival.rivalChamps ? '冠军数，你也赢了。' : sum.rival.myChamps === sum.rival.rivalChamps ? '冠军数，打了个平手。' : '冠军数，他赢了。'}
          </div>
        </div>
      </div>` : ''}

      <div class="sum-block">
        <h4>荣誉室</h4>
        <div class="card" style="padding:12px 8px">
          ${trophyEntries.length ? `
          <div class="sum-trophies">
            ${trophyEntries.map(([id, n]) => {
              const meta = trophyMeta(id);
              return `<div class="trophy-item"><div class="art">${meta.art}</div><div class="name">${meta.name}</div>${n > 1 ? `<div class="count">×${n}</div>` : ''}</div>`;
            }).join('')}
          </div>` : `<div class="muted" style="text-align:center;padding:14px">还没有奖杯</div>`}
        </div>
      </div>

      ${sum.titles.length ? `
      <div class="sum-block">
        <h4>称号</h4>
        <div class="sum-titles">${titleChips}</div>
      </div>` : ''}

      ${sum.legacyLines.length ? `
      <div class="sum-block">
        <h4>那些时刻</h4>
        <div class="card" style="padding:14px">
          ${sum.legacyLines.map(l => `<div class="sum-legacy" style="margin-top:6px">· ${esc(l)}</div>`).join('')}
        </div>
      </div>` : ''}

      <div class="sum-block">
        <h4>效力过的球队</h4>
        ${sum.clubs.map(c => `
          <div class="sum-club">
            <div class="crest" style="background:${c.color};color:${c.isLight ? '#09090b' : '#fff'}">${esc(c.abbr)}</div>
            <div class="info">
              <div class="n">${esc(c.name)}</div>
              <div class="s">${c.seasons} 个赛季 · ${c.games} 场 · ${c.trophies.length ? c.trophies.length + ' 座奖杯' : '无冠'}</div>
            </div>
            <div class="stat"><b class="num">${c.pts}</b>分</div>
          </div>`).join('')}
      </div>

      <div class="sum-foot">
        ${APP_TITLE} · ${sum.seasonsCount} 个赛季<br/>
        本局编号 <span class="code" onclick="BL.copyCode()" style="cursor:pointer">${esc(sum.seed)}</span> · 点一下复制<br/>
        长按上方图片保存，或直接发给朋友
      </div>
    </div>
    <div class="bottom-actions">
      <div class="row2">
        <button class="btn btn-outline" onclick="BL.replay()">再来一局</button>
        <button class="btn btn-primary" onclick="BL.openShare()">分享战绩卡</button>
      </div>
      <button class="btn btn-ghost" onclick="BL.openArchive()">返回历史档案</button>
    </div>
    ${app.modal ? modalHTML() : ''}
  `);
}

function trophyMeta(id) {
  if (id === 'world_cup') return { art: '🏆', name: '世界杯' };
  if (id === 'olympics') return { art: '🥇', name: '奥运会' };
  if (id === 'continental') return { art: '🌍', name: '洲际冠军' };
  if (id.startsWith('league:')) return { art: '🏀', name: LEAGUES[id.slice(7)]?.champ?.replace('总冠军', '总冠军') || '联赛冠军' };
  if (id.startsWith('cup:')) return { art: '🏅', name: LEAGUES[id.slice(4)]?.cupName || '杯赛冠军' };
  return { art: '🏅', name: '冠军' };
}

// ---------- 档案 / 图鉴 ----------
function archiveHTML() {
  const list = E.loadArchive();
  return shell(`
    <div class="page-head">
      <button class="btn btn-ghost" onclick="BL.backHome()">← 返回</button>
      <h2>历史档案</h2>
      <span class="count">${list.length}</span>
    </div>
    <div class="scroll">
      ${list.length ? list.map(a => {
        const t = a.totals;
        const titles = (a.titles || []).map(x => TITLES.find(t2 => t2.id === x.id)).filter(Boolean);
        return `
        <button class="archive-item" onclick="BL.viewArchive(${list.indexOf(a)})">
          <div class="row1">
            <span class="n">${esc(a.player.name)} <span class="muted" style="font-weight:600">${esc(a.player.positionEn)} · ${esc(a.player.nationality)}</span></span>
            <span class="peak num">巅峰 ${a.maxOverall}</span>
          </div>
          <div class="row2">
            <span class="chip chip-zinc">${a.seasonsCount} 季</span>
            <span class="chip chip-zinc num">${E.fmtInt(t.pts)} 分</span>
            <span class="chip chip-amber num">${E.fmtMoney(a.totalIncome)}</span>
            ${titles.slice(0, 2).map(x => `<span class="chip chip-green">${x.art} ${x.name}</span>`).join('')}
          </div>
          <div class="when">${timeAgo(a.savedAt)} · ${esc(a.seed)}</div>
        </button>`;
      }).join('') : `<div class="empty">还没有踢完的生涯<br/>去开启第一局吧</div>`}
    </div>
  `);
}

function archiveDetailHTML() {
  const a = app.archiveDetail;
  if (!a) return archiveHTML();
  const t = a.totals;
  const nat = a.national;
  const trophyCounts = {};
  const allTrophies = a.clubs.flatMap(c => c.trophies || []);
  allTrophies.forEach(id => trophyCounts[id] = (trophyCounts[id] || 0) + 1);
  const trophies = Object.entries(trophyCounts).slice(0, 10);
  const titles = (a.titles || []).map(x => TITLES.find(t2 => t2.id === x.id)).filter(Boolean);
  return shell(`
    <div class="page-head">
      <button class="btn btn-ghost" onclick="BL.backArchive()">← 返回</button>
      <h2>档案详情</h2>
    </div>
    <div class="scroll summary-scroll">
      <div class="sum-hero">
        <div class="sum-hero-top">
          <div class="rating-ring" style="width:58px;height:58px">
            <svg viewBox="0 0 46 46">
              <circle cx="23" cy="23" r="20" fill="none" stroke="#27272a" stroke-width="3.5"/>
              <circle cx="23" cy="23" r="20" fill="none" stroke="#fbbf24" stroke-width="3.5"
                stroke-linecap="round" stroke-dasharray="125.66" stroke-dashoffset="${125.66 * (1 - a.maxOverall / 99)}"/>
            </svg>
            <span class="val" style="font-size:16px">${a.maxOverall}</span>
          </div>
          <div>
            <div class="name">${esc(a.player.name)}</div>
            <div class="tags">
              <span class="chip chip-zinc">${esc(a.player.nationality)}</span>
              <span class="chip chip-green">#${a.player.number} ${esc(a.player.positionEn)} ${esc(a.player.position)}</span>
            </div>
          </div>
          <div class="sum-value">
            <div class="k">巅峰身价</div>
            <div class="v num">${E.fmtMoney(a.peakValue)}</div>
            <div class="k" style="margin-top:8px">总收入</div>
            <div class="v sub num">${E.fmtMoney(a.totalIncome)}</div>
          </div>
        </div>
        <div class="sum-ending">
          <div class="k">生涯结局</div>
          <div class="t">${esc(titles[0]?.name || '完整的一生')}</div>
          <div class="p">超过了 ${a.percentile}% 的球员</div>
          <div class="e">${esc(a.epitaph)}</div>
        </div>
      </div>
      <div class="sum-block">
        <div class="sum-stats">
          <div><div class="k">出场</div><div class="v num">${E.fmtInt(t.apps)}</div></div>
          <div><div class="k">总得分</div><div class="v num">${E.fmtInt(t.pts)}</div></div>
          <div><div class="k">总篮板</div><div class="v num">${E.fmtInt(t.reb)}</div></div>
          <div><div class="k">总助攻</div><div class="v num">${E.fmtInt(t.ast)}</div></div>
          <div><div class="k">抢断</div><div class="v num">${E.fmtInt(t.stl)}</div></div>
          <div><div class="k">盖帽</div><div class="v num">${E.fmtInt(t.blk)}</div></div>
        </div>
      </div>
      ${nat ? `<div class="sum-block"><h4>国家队</h4><div class="card" style="padding:12px;text-align:center"><div class="muted-2" style="font-weight:800">${esc(a.player.nationality)} · 大赛 ${nat.games} 场 · ${nat.pts} 分 · 冠军 ${nat.golds} 次</div></div></div>` : ''}
      ${a.highlights?.length ? `
      <div class="sum-block">
        <h4>生涯高光</h4>
        <div class="card" style="padding:14px">
          ${a.highlights.map(h => `<div class="sum-legacy" style="margin-top:6px">· ${h.age}岁 ${esc(h.text)}</div>`).join('')}
        </div>
      </div>` : ''}
      ${a.rival ? `
      <div class="sum-block">
        <h4>一生之敌</h4>
        <div class="card" style="padding:14px">
          <div style="text-align:center;font-weight:900;font-size:15px">${esc(a.rival.name)} <span class="muted-2" style="font-weight:700">· ${esc(a.rival.nationality)} · 巅峰 ${a.rival.peak}</span></div>
          <div style="margin-top:10px">
            <div class="banner-row"><span class="k">交手赛季</span><span class="v num">${a.rival.series}</span></div>
            <div class="banner-row"><span class="k">总得分</span><span class="v num">你 ${E.fmtInt(a.rival.myPts)} : ${E.fmtInt(a.rival.rivalPts)} 他</span></div>
            <div class="banner-row"><span class="k">联赛冠军</span><span class="v num">你 ${a.rival.myChamps} : ${a.rival.rivalChamps} 他</span></div>
            <div class="banner-row"><span class="k">常规赛MVP</span><span class="v num">你 ${a.rival.myMvp} : ${a.rival.rivalMvp} 他</span></div>
          </div>
          <div style="margin-top:10px;text-align:center;font-size:12px;color:var(--amber);font-weight:800">
            ${a.rival.myPts >= a.rival.rivalPts ? `总得分，你赢了。` : `总得分，他赢了。`}
            ${a.rival.myChamps > a.rival.rivalChamps ? '冠军数，你也赢了。' : a.rival.myChamps === a.rival.rivalChamps ? '冠军数，打了个平手。' : '冠军数，他赢了。'}
          </div>
        </div>
      </div>` : ''}
      <div class="sum-block">
        <h4>荣誉室</h4>
        <div class="card" style="padding:12px 8px">
          ${trophies.length ? `<div class="sum-trophies">${trophies.map(([id, n]) => {
            const meta = trophyMeta(id);
            return `<div class="trophy-item"><div class="art">${meta.art}</div><div class="name">${meta.name}</div>${n > 1 ? `<div class="count">×${n}</div>` : ''}</div>`;
          }).join('')}</div>` : `<div class="muted" style="text-align:center;padding:14px">还没有奖杯</div>`}
        </div>
      </div>
      ${titles.length ? `<div class="sum-block"><h4>称号</h4><div class="sum-titles">${titles.map(x => `<span class="sum-title">${x.art} ${esc(x.name)}</span>`).join('')}</div></div>` : ''}
      <div class="sum-block">
        <h4>效力过的球队</h4>
        ${a.clubs.map(c => `
          <div class="sum-club">
            <div class="crest" style="background:${c.color};color:${c.isLight ? '#09090b' : '#fff'}">${esc(c.abbr)}</div>
            <div class="info"><div class="n">${esc(c.name)}</div><div class="s">${c.seasons} 个赛季 · ${c.games} 场 · ${c.trophies?.length || 0} 座奖杯</div></div>
            <div class="stat"><b class="num">${c.pts}</b>分</div>
          </div>`).join('')}
      </div>
      <div class="sum-foot">${APP_TITLE} · ${a.seasonsCount} 个赛季<br/>本局编号 ${esc(a.seed)}</div>
    </div>
  `);
}

function galleryHTML() {
  const g = E.galleryState();
  return shell(`
    <div class="page-head">
      <button class="btn btn-ghost" onclick="BL.backHome()">← 返回</button>
      <h2>称号图鉴</h2>
      <span class="count">${g.unlocked.size}/${g.total}</span>
    </div>
    <div class="scroll" style="padding:0">
      <div class="gallery-grid">
        ${TITLES.map(t => {
          const q = g.unlocked.get(t.id);
          return q
            ? `<div class="gallery-cell"><div class="art">${t.art}</div><div class="name">${esc(t.name)}</div><div class="q">${esc(q)}</div></div>`
            : `<div class="gallery-cell locked"><div class="art">${t.art}</div><div class="name">${esc(t.name)}</div><div class="q">${esc(t.hint)}</div></div>`;
        }).join('')}
      </div>
    </div>
  `);
}

// ---------- 弹层 ----------
function modalHTML() {
  const m = app.modal;
  if (!m) return '';
  if (m.type === 'updates') {
    return `<div class="modal-mask" onclick="if(event.target===this)BL.closeModal()">
      <div class="modal">
        <div class="close-row"><button class="btn btn-ghost" onclick="BL.closeModal()">✕</button></div>
        <h3>更新记录</h3>
        ${[...UPDATES].reverse().map(u => `
          <div class="update-item">
            <div class="ver">v${u.version}</div>
            <div class="ti">${esc(u.title)}</div>
            <ul>${u.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>
          </div>`).join('')}
      </div>
    </div>`;
  }
  if (m.type === 'share') {
    return `<div class="modal-mask" onclick="if(event.target===this)BL.closeModal()">
      <div class="modal">
        <div class="close-row"><button class="btn btn-ghost" onclick="BL.closeModal()">✕</button></div>
        <h3>分享战绩卡</h3>
        ${app.shareDataUrl ? `<img class="share-preview" src="${app.shareDataUrl}" alt="生涯战绩卡"/>` : '<div class="empty">正在生成…</div>'}
        <div style="margin-top:12px;display:grid;grid-template-columns:1fr 1fr;gap:8px">
          <button class="btn btn-outline" onclick="BL.copyCode()">复制编号</button>
          <button class="btn btn-primary" onclick="BL.downloadShare()">下载图片</button>
        </div>
        <div class="share-hint">长按上方图片保存，或直接发给朋友<br/>别人输入你的编号，就能看到同一段生涯</div>
      </div>
    </div>`;
  }
  return '';
}

// ---------- 分享图 ----------
function drawShare(sum) {
  const W = 1080, H = 1600;
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d');
  const font = '"PingFang SC","Microsoft YaHei",-apple-system,sans-serif';
  const F = (size, weight = 400) => `${weight} ${size}px ${font}`;

  // 背景
  ctx.fillStyle = '#09090b';
  ctx.fillRect(0, 0, W, H);
  // 球场线装饰
  ctx.strokeStyle = 'rgba(255,255,255,0.045)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(W / 2, 250, 210, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(W / 2, H - 120, 320, Math.PI, Math.PI * 2);
  ctx.stroke();

  // 顶部
  const ringR = 74, cx = 150, cy = 205;
  ctx.strokeStyle = '#27272a';
  ctx.lineWidth = 12;
  ctx.beginPath(); ctx.arc(cx, cy, ringR, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = '#fbbf24';
  ctx.beginPath(); ctx.arc(cx, cy, ringR, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * sum.maxOverall / 99); ctx.stroke();
  ctx.fillStyle = '#fafafa';
  ctx.font = F(44, 900);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(sum.maxOverall, cx, cy);
  ctx.font = F(17, 700);
  ctx.fillStyle = '#71717a';
  ctx.fillText('生涯最高', cx, cy + 58);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#fafafa';
  ctx.font = F(58, 900);
  ctx.fillText(sum.player.name, 252, 178);
  const tags = `${sum.player.nationality}  ·  #${sum.player.number} ${sum.player.positionEn} ${sum.player.position}  ·  ${sum.player.hand}手`;
  ctx.font = F(23, 700);
  ctx.fillStyle = '#a1a1aa';
  ctx.fillText(tags, 254, 232);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#71717a';
  ctx.font = F(18, 700);
  ctx.fillText('巅峰身价', W - 60, 168);
  ctx.fillStyle = '#fbbf24';
  ctx.font = F(34, 900);
  ctx.fillText(E.fmtMoney(sum.peakValue), W - 60, 208);
  ctx.fillStyle = '#71717a';
  ctx.font = F(18, 700);
  ctx.fillText('生涯总收入', W - 60, 252);
  ctx.fillStyle = 'rgba(251,191,36,0.85)';
  ctx.font = F(26, 900);
  ctx.fillText(E.fmtMoney(sum.totalIncome), W - 60, 288);

  // 结局条
  roundRect(ctx, 56, 330, W - 112, 158, 22);
  ctx.fillStyle = 'rgba(251,191,36,0.07)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(251,191,36,0.4)';
  ctx.stroke();
  const topTitle = TITLES.find(t => t.id === sum.titles[0]?.id);
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(251,191,36,0.85)';
  ctx.font = F(18, 800);
  ctx.fillText('生涯结局', W / 2, 368);
  ctx.fillStyle = '#fbbf24';
  ctx.font = F(40, 900);
  ctx.fillText(topTitle ? topTitle.name : '完整的一生', W / 2, 414);
  ctx.fillStyle = '#34d399';
  ctx.font = F(22, 900);
  ctx.fillText(`超过了 ${sum.percentile}% 的球员`, W / 2, 456);

  // 数据
  const t = sum.totals;
  const stats = [[E.fmtInt(t.apps), '出场'], [E.fmtInt(t.pts), '总得分'], [E.fmtInt(t.reb), '总篮板'], [E.fmtInt(t.ast), '总助攻'], [E.fmtInt(t.stl), '抢断'], [E.fmtInt(t.blk), '盖帽']];
  const cellW = (W - 112) / 6;
  ctx.textAlign = 'center';
  stats.forEach(([v, k], i) => {
    const x = 56 + cellW * i + cellW / 2;
    ctx.fillStyle = '#fafafa';
    ctx.font = F(28, 900);
    ctx.fillText(v, x, 545);
    ctx.fillStyle = '#71717a';
    ctx.font = F(15, 700);
    ctx.fillText(k, x, 578);
  });

  let y = 630;
  ctx.textAlign = 'left';

  // 国家队
  if (sum.national) {
    ctx.fillStyle = '#a1a1aa';
    ctx.font = F(22, 700);
    ctx.fillText(`${sum.player.nationality} 国家队：大赛 ${sum.national.games} 场 · ${sum.national.pts} 分 · ${sum.national.reb} 板 · ${sum.national.ast} 助 · 冠军 ${sum.national.golds} 次`, 56, y);
    y += 52;
  }
  if (sum.rival) {
    ctx.fillStyle = '#a1a1aa';
    ctx.font = F(22, 700);
    ctx.fillText(`一生之敌 ${sum.rival.name}：总得分 ${sum.rival.myPts}:${sum.rival.rivalPts} · 冠军 ${sum.rival.myChamps}:${sum.rival.rivalChamps}`, 56, y);
    y += 52;
  }

  // 荣誉
  const trophies = sum.clubs.flatMap(c => (c.trophies || []).map(x => x));
  const tcount = {};
  trophies.forEach(x => tcount[x] = (tcount[x] || 0) + 1);
  const entries = Object.entries(tcount);
  if (entries.length) {
    ctx.fillStyle = '#71717a';
    ctx.font = F(17, 800);
    ctx.fillText('荣 誉 室', 56, y);
    y += 14;
    let tx = 56;
    const per = 170;
    entries.slice(0, 6).forEach(([id, n]) => {
      const meta = trophyMeta(id);
      ctx.font = F(34);
      ctx.textAlign = 'center';
      ctx.fillText(meta.art, tx + 45, y + 28);
      ctx.font = F(17, 800);
      ctx.fillStyle = '#d4d4d8';
      ctx.fillText(`${meta.name}${n > 1 ? ' ×' + n : ''}`, tx + 100, y + 33);
      ctx.textAlign = 'left';
      tx += per;
      if (tx > W - 120) { tx = 56; y += 56; }
    });
    y += 60;
  }

  // 球队
  ctx.fillStyle = '#71717a';
  ctx.font = F(17, 800);
  ctx.fillText('效 力 球 队', 56, y);
  y += 12;
  sum.clubs.slice(0, 5).forEach(c => {
    y += 44;
    ctx.fillStyle = c.color;
    ctx.beginPath();
    ctx.arc(56 + 19, y - 16, 19, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = c.isLight ? '#09090b' : '#fff';
    ctx.font = F(13, 900);
    ctx.textAlign = 'center';
    ctx.fillText(c.abbr.slice(0, 3), 56 + 19, y - 12);
    ctx.textAlign = 'left';
    ctx.fillStyle = '#e4e4e7';
    ctx.font = F(20, 800);
    ctx.fillText(c.name, 104, y - 10);
    ctx.fillStyle = '#71717a';
    ctx.font = F(16, 700);
    ctx.fillText(`${c.seasons} 季 · ${c.games} 场 · ${c.pts} 分 · ${c.trophies?.length || 0} 冠`, 104, y + 16);
  });
  y += 44;

  // 称号
  if (sum.titles.length) {
    ctx.fillStyle = '#71717a';
    ctx.font = F(17, 800);
    ctx.fillText('称 号', 56, y);
    y += 12;
    let tx = 56;
    sum.titles.slice(0, 8).forEach(tid => {
      const meta = TITLES.find(x => x.id === tid.id);
      if (!meta) return;
      const text = `${meta.art} ${meta.name}`;
      ctx.font = F(18, 800);
      const w = ctx.measureText(text).width + 30;
      if (tx + w > W - 56) { tx = 56; y += 44; }
      roundRect(ctx, tx, y, w, 34, 17);
      ctx.fillStyle = 'rgba(251,191,36,0.10)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(251,191,36,0.35)';
      ctx.stroke();
      ctx.fillStyle = '#fbbf24';
      ctx.textAlign = 'center';
      ctx.fillText(text, tx + w / 2, y + 22);
      ctx.textAlign = 'left';
      tx += w + 10;
    });
    y += 54;
  }

  // 结尾
  ctx.strokeStyle = '#27272a';
  ctx.beginPath(); ctx.moveTo(56, H - 108); ctx.lineTo(W - 56, H - 108); ctx.stroke();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#71717a';
  ctx.font = F(17, 700);
  ctx.fillText(`${APP_TITLE} · 从青训到传奇`, W / 2, H - 72);
  ctx.fillStyle = '#3f3f46';
  ctx.font = F(15, 700);
  ctx.fillText(`编号 ${sum.seed}`, W / 2, H - 42);

  app.shareDataUrl = cv.toDataURL('image/png');
  return app.shareDataUrl;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// ---------- 渲染 ----------
function render() {
  const scrollEl = document.querySelector('.app > .scroll');
  const prevScroll = scrollEl ? scrollEl.scrollTop : 0;
  const prevView = app.view;
  if (app.view === 'home') root.innerHTML = homeHTML();
  else if (app.view === 'identity') root.innerHTML = identityHTML();
  else if (app.view === 'career') root.innerHTML = careerHTML();
  else if (app.view === 'summary') root.innerHTML = summaryHTML();
  else if (app.view === 'archive') root.innerHTML = archiveHTML();
  else if (app.view === 'archive-detail') root.innerHTML = archiveDetailHTML();
  else if (app.view === 'gallery') root.innerHTML = galleryHTML();
  if (app.view === prevView) {
    requestAnimationFrame(() => {
      const el = document.querySelector('.app > .scroll');
      if (el) el.scrollTop = prevScroll;
    });
  }
}

// ---------- 事件 ----------
window.BL = {
  setMode(m) { app.mode = m; render(); },
  start() {
    app.seed = null;
    app.identity = { ...app.identity, name: '', number: String(8 + Math.floor(Math.random() * 20)), domesticDream: '', foreignDream: '' };
    app.view = 'identity';
    render();
  },
  resume() {
    if (!app.seed) {
      // 找最近一次的存档
      const key = Object.keys(localStorage).filter(k => k.startsWith('bl-save:')).sort().pop();
      if (key) app.seed = key.slice(8);
    }
    if (!app.seed) { toast('没有可继续的存档'); return; }
    const st = E.loadState(app.seed);
    if (!st) { toast('存档已清理'); return; }
    app.state = st;
    app.archived = false;
    app.view = st.phase === 'summary' ? 'summary' : 'career';
    if (st.phase === 'career' && !st.currentEvent) {
      BL.tick();
      return;
    }
    render();
  },
  backHome() { app.view = 'home'; app.modal = null; render(); },
  openArchive() { app.view = 'archive'; render(); },
  openGallery() { app.view = 'gallery'; render(); },
  openUpdates() { app.modal = { type: 'updates' }; render(); },
  closeModal() { app.modal = null; render(); },
  setInvite(v) { app.invite = v; },
  useInvite() {
    const code = app.invite.trim();
    if (!code) { toast('输入一个编号'); return; }
    app.seed = code;
    const st = E.loadState(code);
    if (st) {
      app.state = st;
      app.archived = false;
      app.view = st.phase === 'summary' ? 'summary' : 'career';
      render();
      return;
    }
    app.view = 'identity';
    render();
  },
  setName(v) { app.identity.name = v; },
  setNationality(c) { app.identity.nationality = c; app.identity.domesticDream = ''; render(); },
  setPosition(p) { app.identity.position = p; render(); },
  setHand(h) { app.identity.hand = h; render(); },
  setNumber(v) {
    let n = parseInt(v, 10);
    if (isNaN(n)) n = 0;
    app.identity.number = String(Math.max(0, Math.min(99, n)));
  },
  setDream(kind, val) {
    if (kind === 'domestic') app.identity.domesticDream = val;
    else app.identity.foreignDream = val;
  },
  confirmIdentity() {
    const id = app.identity;
    if (!id.name.trim()) { toast('先给自己起个名字'); return; }
    const seed = app.seed || E.genSeed();
    const st = E.newGame({
      seed,
      mode: app.mode,
      name: id.name.trim(),
      nationality: id.nationality,
      position: id.position,
      hand: id.hand,
      number: parseInt(id.number, 10) || 8,
      domesticDreamTeamId: id.domesticDream || null,
      foreignDreamTeamId: id.foreignDream || null,
    });
    app.seed = seed;
    app.state = st;
    app.archived = false;
    app.receipt = false;
    app.pendingBanner = false;
    app.lastBanner = null;
    app.view = 'career';
    E.saveState(st);
    BL.tick();
  },
  tick() {
    if (!app.state) return;
    const { state, screen, snapshot } = E.step(app.state);
    app.state = state;
    app.receipt = false;
    if (screen === 'banner') {
      app.lastBanner = snapshot;
      // 若这个横幅后面还跟着事件，先显示横幅，点一下再进事件
      app.pendingBanner = !!state.currentEvent;
    }
    if (screen === 'summary') { app.view = 'summary'; app.archived = false; }
    E.saveState(state);
    render();
  },
  choose(optionId) {
    if (!app.state || !app.state.currentEvent) return;
    if (navigator.vibrate) navigator.vibrate(12);
    const res = E.decide(app.state, optionId);
    const state = res.state;
    app.state = state;
    app.lastBanner = null;
    app.pendingBanner = false;
    if (res.screen === 'summary') {
      app.view = 'summary';
      app.archived = false;
      app.receipt = false;
    } else {
      app.receipt = true;
    }
    E.saveState(state);
    render();
  },
  next() {
    if (app.pendingBanner) {
      app.pendingBanner = false;
      render();
    } else if (app.state && app.state.currentEvent) {
      app.receipt = false;
      render();
    } else {
      BL.tick();
    }
  },
  replay() {
    app.state = null;
    app.seed = null;
    app.modal = null;
    app.shareDataUrl = null;
    app.view = 'home';
    render();
  },
  copyCode() {
    const sum = app.state ? E.buildSummary(app.state) : app.archiveDetail;
    const code = sum?.seed || app.seed || '';
    const text = `${APP_TITLE}｜${sum?.player.name || ''} ${sum?.player.positionEn || ''}｜巅峰 ${sum?.maxOverall || '?'}｜总收入 ${sum ? E.fmtMoney(sum.totalIncome) : ''}｜编号 ${code}`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => toast('已复制')).catch(() => fallbackCopy(text));
    } else fallbackCopy(text);
  },
  openShare() {
    app.modal = { type: 'share' };
    app.shareDataUrl = null;
    render();
    setTimeout(() => {
      if (app.modal?.type === 'share' && app.state) {
        drawShare(E.buildSummary(app.state));
        render();
      }
    }, 30);
  },
  downloadShare() {
    if (!app.shareDataUrl) return;
    const a = document.createElement('a');
    a.href = app.shareDataUrl;
    a.download = `${app.state?.player?.name || '生涯'}-生涯战绩卡.png`;
    a.click();
  },
  viewArchive(i) {
    const list = E.loadArchive();
    app.archiveDetail = list[i];
    app.view = 'archive-detail';
    render();
  },
  backArchive() { app.view = 'archive'; render(); },
};

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.position = 'fixed';
  ta.style.top = '-9999px';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); toast('已复制'); } catch { toast('复制失败'); }
  document.body.removeChild(ta);
}

// 键盘继续：空格/回车轻触继续
document.addEventListener('keydown', (e) => {
  if ((e.key === ' ' || e.key === 'Enter') && app.view === 'career' && !app.modal) {
    e.preventDefault();
    if (app.state?.currentEvent && !app.receipt) return;
    BL.next();
  }
});

render();

// 调试钩子（供自动化测试使用）
window.__testState = () => ({
  view: app.view,
  receipt: app.receipt,
  pendingBanner: app.pendingBanner,
  lastBanner: !!app.lastBanner,
  phase: app.state ? app.state.phase : null,
  stage: app.state ? app.state.stage : null,
  age: app.state ? app.state.player.age : null,
  currentEvent: app.state && app.state.currentEvent ? app.state.currentEvent.type : null,
  eventOptions: app.state && app.state.currentEvent ? app.state.currentEvent.options.length : 0,
  lastOutcome: app.state && app.state.lastEventOutcome ? app.state.lastEventOutcome.text : null,
});
