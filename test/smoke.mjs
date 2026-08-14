// 浏览器冒烟测试：用系统 Chrome + playwright-core 跑完整流程并截图
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'file:///C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core/index.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const PORT = 8765;
const OUT = path.join(ROOT, 'test', 'shots');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
};

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';
  const file = path.join(ROOT, urlPath);
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404); res.end('not found'); return;
  }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

fs.mkdirSync(OUT, { recursive: true });

const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const edgePath = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

async function main() {
  await new Promise(r => server.listen(PORT, r));
  const browser = await chromium.launch({
    executablePath: fs.existsSync(chromePath) ? chromePath : edgePath,
    headless: true,
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage({ viewport: { width: 480, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });

  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
  await page.waitForSelector('.home-title');
  await page.screenshot({ path: path.join(OUT, '1-home.png') });
  console.log('home ok:', await page.textContent('.home-title'));

  // 建档
  await page.click('text=开始生涯');
  await page.waitForSelector('.name-input');
  await page.fill('.name-input', '测试者');
  await page.click('text=控球后卫');
  // 滚动到表单中部再选一次位置，滚动位置应保留（不弹回顶部）
  await page.evaluate(() => { const el = document.querySelector('.app > .scroll'); if (el) el.scrollTop = 420; });
  await page.click('text=小前锋');
  await page.waitForTimeout(120);
  const scrollAfter = await page.evaluate(() => { const el = document.querySelector('.app > .scroll'); return el ? el.scrollTop : -1; });
  console.log('identity scroll after select:', scrollAfter);
  if (scrollAfter < 320) throw new Error('建档页选择后滚动位置丢失（弹回顶部）');
  await page.click('.team-select >> nth=0');
  await page.selectOption('.team-select >> nth=0', { index: 2 });
  await page.click('text=开始生涯');
  await page.waitForSelector('.banner, .option, .event-card');
  await page.screenshot({ path: path.join(OUT, '2-career-start.png') });
  console.log('career start ok');

  // 推进生涯：决策选第一个选项，横幅点继续
  let clicks = 0;
  let decisions = 0;
  let sawSummary = false;
  while (clicks < 2500) {
    const state = await page.evaluate(() => window.__testState ? window.__testState() : null);
    const isSummary = await page.locator('.sum-hero').count();
    if (isSummary) { sawSummary = true; break; }
    const option = page.locator('.option').first();
    if (await option.count()) {
      await option.click();
      decisions++;
      // 有的决策（如选择告别方式）会直接进入结算页
      if (await page.locator('.sum-hero').count()) { sawSummary = true; break; }
      // 决策后必须出现可点击的回执
      try {
        await page.waitForSelector('.receipt', { timeout: 3000 });
      } catch (e) {
        console.log('STATE at failure:', JSON.stringify(await page.evaluate(() => window.__testState())));
        console.log('html:', (await page.locator('.scroll').innerHTML()).slice(0, 400));
        throw e;
      }
    } else if (await page.locator('.receipt').count()) {
      await page.locator('.receipt').first().click();
      await page.waitForTimeout(30);
    } else if (await page.locator('.banner').count()) {
      await page.locator('.banner').first().click();
      await page.waitForTimeout(30);
    } else {
      await page.keyboard.press('Enter');
    }
    clicks++;
    if (clicks % 200 === 0) console.log(`  ... ${clicks} clicks, decisions ${decisions}`);
  }
  console.log(`career loop: clicks=${clicks} decisions=${decisions} summary=${sawSummary}`);
  if (!sawSummary) {
    await page.screenshot({ path: path.join(OUT, '3-career-loop.png') });
    throw new Error('生涯未在限制内结束');
  }
  await page.waitForSelector('.sum-hero');
  console.log('summary sections:', await page.locator('.sum-block h4').allTextContents());
  await page.screenshot({ path: path.join(OUT, '3-summary.png') });
  console.log('summary ok:', (await page.textContent('.sum-hero .name')).trim());

  // 分享图
  await page.click('text=分享战绩卡');
  await page.waitForSelector('.share-preview', { timeout: 8000 });
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(OUT, '4-share.png') });
  console.log('share ok');
  await page.click('text=✕');

  // 档案
  await page.click('text=返回历史档案');
  await page.waitForSelector('.archive-item');
  await page.screenshot({ path: path.join(OUT, '5-archive.png') });
  console.log('archive ok:', await page.locator('.archive-item').count(), 'items');

  // 图鉴
  await page.click('text=← 返回');
  await page.click('text=称号图鉴');
  await page.waitForSelector('.gallery-grid');
  await page.screenshot({ path: path.join(OUT, '6-gallery.png') });
  console.log('gallery ok');

  // 首页再来一局后：更新记录弹层
  await page.click('text=← 返回');
  await page.click('text=查看本期更新说明');
  await page.waitForSelector('.update-item');
  await page.screenshot({ path: path.join(OUT, '7-updates.png') });
  console.log('updates ok');

  await browser.close();
  server.close();

  if (errors.length) {
    console.error('ERRORS:\n' + errors.slice(0, 10).join('\n'));
    process.exit(1);
  }
  console.log('SMOKE PASS');
}

main().catch(e => {
  console.error(e);
  server.close();
  process.exit(1);
});
