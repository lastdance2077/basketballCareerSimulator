// 逐步跟踪第一个决策流程
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'file:///C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core/index.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const PORT = 8766;
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT) || !fs.existsSync(f)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});

await new Promise(r => server.listen(PORT, r));
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 480, height: 900 } });
page.on('pageerror', e => console.error('PAGEERROR:', e.message));

await page.goto(`http://127.0.0.1:${PORT}/`);
await page.click('text=开始生涯');
await page.fill('.name-input', '调试');
await page.click('text=开始生涯');
await page.waitForSelector('.banner');
console.log('after confirm:', JSON.stringify(await page.evaluate(() => window.__testState())));

await page.click('.banner');
await page.waitForSelector('.option');
console.log('after banner click:', JSON.stringify(await page.evaluate(() => window.__testState())));

const opt = page.locator('.option').first();
await opt.click();
await page.waitForTimeout(200);
console.log('after option click:', JSON.stringify(await page.evaluate(() => window.__testState())));
console.log('receipt count:', await page.locator('.receipt').count());
console.log('body html snippet:', (await page.locator('.scroll').innerHTML()).slice(0, 300));

await browser.close();
server.close();
