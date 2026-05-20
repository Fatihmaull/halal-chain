/**
 * Quick snapshot tool: render specific pages of the proposal to PNG for visual verification.
 * Usage: node snapshot.mjs
 * Saves snapshots to ./snapshots/
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function findChrome() {
  const paths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ];
  for (const p of paths) {
    try { await fs.access(p); return p; } catch {}
  }
  throw new Error('No browser found');
}

async function main() {
  const htmlPath = path.join(__dirname, 'debug.rendered.html');
  const snapDir = path.join(__dirname, 'snapshots');
  await fs.mkdir(snapDir, { recursive: true });

  const chrome = await findChrome();
  const browser = await puppeteer.launch({
    executablePath: chrome,
    headless: true,
    args: ['--no-sandbox', '--font-render-hinting=none'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 794, height: 2000, deviceScaleFactor: 1.5 });

  const html = await fs.readFile(htmlPath, 'utf-8');
  await page.setContent(html, { waitUntil: ['load', 'networkidle0'] });
  await page.evaluateHandle('document.fonts.ready');

  // Snapshot cover page (top 1500px to detect overflow)
  await page.screenshot({
    path: path.join(snapDir, '01-cover.png'),
    clip: { x: 0, y: 0, width: 794, height: 1500 },
  });
  const coverInfo = await page.evaluate(() => {
    const measure = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { top: r.top + window.scrollY, height: r.height, bottom: r.bottom + window.scrollY };
    };
    return {
      page: measure('.cover-page'),
      header: measure('.cover-header'),
      main: measure('.cover-main'),
      footer: measure('.cover-footer'),
      bannerBottom: measure('.cover-banner-bottom'),
      bannerYear: measure('.cover-banner-year'),
      lastFooterLine: measure('.cover-footer .cover-footer-line:last-child'),
    };
  });
  console.log('Cover layout:', JSON.stringify(coverInfo, null, 2));

  // Snapshot TOC area
  const tocY = await page.evaluate(() => {
    const el = document.querySelector('.toc-page');
    return el.getBoundingClientRect().top + window.scrollY;
  });
  await page.screenshot({
    path: path.join(snapDir, '02-toc.png'),
    clip: { x: 0, y: tocY, width: 794, height: 1123 },
  });
  console.log('Saved TOC snapshot at y=', tocY);

  // Snapshot Lembar Pengesahan area
  const lembarY = await page.evaluate(() => {
    const el = document.getElementById('lembar-pengesahan');
    return el ? el.getBoundingClientRect().top + window.scrollY : null;
  });
  if (lembarY) {
    await page.screenshot({
      path: path.join(snapDir, '03-lembar.png'),
      clip: { x: 0, y: Math.max(0, lembarY - 30), width: 794, height: 1123 },
    });
    console.log('Saved Lembar Pengesahan snapshot at y=', lembarY);
  }

  // Snapshot a page with table (Maqasid)
  const tableY = await page.evaluate(() => {
    // find first table in content
    const t = document.querySelector('.content table');
    return t ? t.getBoundingClientRect().top + window.scrollY : null;
  });
  if (tableY) {
    await page.screenshot({
      path: path.join(snapDir, '04-table.png'),
      clip: { x: 0, y: Math.max(0, tableY - 100), width: 794, height: 1123 },
    });
    console.log('Saved table snapshot at y=', tableY);
  }

  // Snapshot ASCII diagram
  const preY = await page.evaluate(() => {
    const p = document.querySelector('.content pre');
    return p ? p.getBoundingClientRect().top + window.scrollY : null;
  });
  if (preY) {
    await page.screenshot({
      path: path.join(snapDir, '05-ascii.png'),
      clip: { x: 0, y: Math.max(0, preY - 50), width: 794, height: 1123 },
    });
    console.log('Saved ASCII diagram snapshot at y=', preY);
  }

  // Arabic blockquote
  const arabicY = await page.evaluate(() => {
    const a = document.querySelector('.content .arabic');
    return a ? a.getBoundingClientRect().top + window.scrollY : null;
  });
  if (arabicY) {
    await page.screenshot({
      path: path.join(snapDir, '06-arabic.png'),
      clip: { x: 0, y: Math.max(0, arabicY - 200), width: 794, height: 1123 },
    });
    console.log('Saved Arabic snapshot at y=', arabicY);
  }

  // Stakeholder map (3rd <pre>)
  const stakeY = await page.evaluate(() => {
    const pres = document.querySelectorAll('.content pre');
    const target = pres[1]; // Stakeholder map is the 2nd code block
    return target ? target.getBoundingClientRect().top + window.scrollY : null;
  });
  if (stakeY) {
    await page.screenshot({
      path: path.join(snapDir, '07-stakeholder.png'),
      clip: { x: 0, y: Math.max(0, stakeY - 100), width: 794, height: 1123 },
    });
    console.log('Saved Stakeholder snapshot at y=', stakeY);
  }

  // Gantt chart (last <pre>)
  const ganttY = await page.evaluate(() => {
    const pres = document.querySelectorAll('.content pre');
    const target = pres[pres.length - 1];
    return target ? target.getBoundingClientRect().top + window.scrollY : null;
  });
  if (ganttY) {
    await page.screenshot({
      path: path.join(snapDir, '08-gantt.png'),
      clip: { x: 0, y: Math.max(0, ganttY - 200), width: 794, height: 1123 },
    });
    console.log('Saved Gantt snapshot at y=', ganttY);
  }

  // Anggaran (budget table)
  const anggaranY = await page.evaluate(() => {
    const h = document.getElementById('vii-anggaran-biaya-kegiatan');
    return h ? h.getBoundingClientRect().top + window.scrollY : null;
  });
  if (anggaranY) {
    await page.screenshot({
      path: path.join(snapDir, '09-anggaran.png'),
      clip: { x: 0, y: Math.max(0, anggaranY - 30), width: 794, height: 1500 },
    });
    console.log('Saved Anggaran snapshot at y=', anggaranY);
  }

  await browser.close();
  console.log('\nAll snapshots saved to:', snapDir);
}

main().catch(e => { console.error(e); process.exit(1); });
