/**
 * HalalChain Proposal — Build PDF
 *
 * Pipeline:
 *   markdown source -> markdown-it -> HTML body
 *   + custom cover page + auto-generated TOC -> template.html
 *   -> Puppeteer (system Chrome) -> A4 PDF with header/footer + page numbers
 *
 * Output: ../Proposal_KKN_Tematik_HalalChain_UIN_Bandung.pdf
 *
 * Usage: node build.mjs
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import MarkdownIt from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItAttrs from 'markdown-it-attrs';
import slugify from 'slugify';
import puppeteer from 'puppeteer-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ─────────────────────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────────────────────
const CONFIG = {
  source: path.join(ROOT, 'Proposal_KKN_Tematik_HalalChain_UIN_Bandung.md'),
  template: path.join(__dirname, 'template.html'),
  styles: path.join(__dirname, 'styles.css'),
  output: path.join(ROOT, 'Proposal_KKN_Tematik_HalalChain_UIN_Bandung.pdf'),

  // Try Chrome first, then Edge as fallback
  chromeCandidates: [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  ],

  pdf: {
    format: 'A4',
    printBackground: true,
    margin: { top: '20mm', right: '0mm', bottom: '16mm', left: '0mm' },
    preferCSSPageSize: false,
    displayHeaderFooter: true,
  },

  // A4 content-area height in CSS px after Puppeteer margins
  // 297mm - 20mm - 16mm = 261mm = ~986 CSS px @ 96dpi
  pageContentHeightPx: 986,

  // Pages before content section (cover + TOC = 2)
  // Lembar Pengesahan is the FIRST H2 of content and starts on page 3.
  coverPagesCount: 2,
};

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
function log(msg) {
  const ts = new Date().toLocaleTimeString('id-ID');
  console.log(`[${ts}] ${msg}`);
}

async function findChrome() {
  for (const candidate of CONFIG.chromeCandidates) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      // continue
    }
  }
  throw new Error(
    'Tidak menemukan Chrome atau Edge. Pastikan salah satu terinstall di lokasi standar.'
  );
}

// ─────────────────────────────────────────────────────────────
// Markdown preprocessing — strip cover & old TOC from source
// ─────────────────────────────────────────────────────────────
function preprocessMarkdown(raw) {
  let md = raw;

  // 1. Strip everything before "## LEMBAR PENGESAHAN"
  const lembarIdx = md.indexOf('## LEMBAR PENGESAHAN');
  if (lembarIdx > 0) {
    md = md.slice(lembarIdx);
  }

  // 2. Remove old "## DAFTAR ISI" section (between heading and next "## ")
  md = md.replace(/## DAFTAR ISI[\s\S]*?(?=\n## [A-ZIVX])/g, '');

  // 3. Collapse multiple consecutive "---" separators
  md = md.replace(/(\n---\s*){2,}/g, '\n---\n');

  // 4. Trim leading/trailing dividers
  md = md.replace(/^(\s*---\s*\n)+/, '').replace(/(\n\s*---\s*)+$/, '');

  return md;
}

// ─────────────────────────────────────────────────────────────
// Post-process HTML — wrap Arabic-containing inlines with class
// ─────────────────────────────────────────────────────────────
function postprocessHtml(html) {
  const ARABIC_RE = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/;

  // Wrap whole <p> if Arabic chars present (with or without inner formatting)
  html = html.replace(/<p>([\s\S]*?)<\/p>/g, (match, inner) => {
    if (ARABIC_RE.test(inner)) {
      // Strip <strong>/<em> wrappers around the Arabic-only paragraph
      const stripped = inner.replace(/<\/?(strong|em|b|i)>/g, '');
      return `<p class="arabic">${stripped}</p>`;
    }
    return match;
  });

  return html;
}

// ─────────────────────────────────────────────────────────────
// Custom anchor slugify (Indonesian-friendly)
// ─────────────────────────────────────────────────────────────
function slugifyHeading(text) {
  return slugify(text, {
    lower: true,
    strict: true,
    locale: 'id',
    trim: true,
  });
}

// ─────────────────────────────────────────────────────────────
// Build TOC HTML from collected headings
// ─────────────────────────────────────────────────────────────
function buildTocHtml(headings) {
  return headings
    .filter((h) => h.level === 2 || h.level === 3)
    .map((h) => {
      const classes = ['toc-entry', `toc-entry-h${h.level}`];
      return `
        <a class="${classes.join(' ')}" href="#${h.id}">
          <span class="toc-entry-label">${escapeHtml(h.text)}</span>
          <span class="toc-entry-leader"></span>
          <span class="toc-entry-page" data-target="${h.id}">&hellip;</span>
        </a>`;
    })
    .join('\n');
}

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ─────────────────────────────────────────────────────────────
// Parse markdown -> HTML + extract heading list
// ─────────────────────────────────────────────────────────────
function renderMarkdown(md) {
  const headings = [];
  const usedIds = new Set();

  const slugifyUnique = (s) => {
    let base = slugifyHeading(s);
    if (!base) base = 'section';
    let id = base;
    let n = 2;
    while (usedIds.has(id)) {
      id = `${base}-${n++}`;
    }
    usedIds.add(id);
    return id;
  };

  const mdParser = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: false,
    breaks: false,
  })
    .use(markdownItAttrs)
    .use(markdownItAnchor, {
      slugify: slugifyUnique,
      level: [2, 3, 4],
      tabIndex: false,
      callback: (token, anchor) => {
        if (token.tag === 'h2' || token.tag === 'h3') {
          headings.push({
            level: parseInt(token.tag.slice(1), 10),
            text: anchor.title,
            id: anchor.slug,
          });
        }
      },
    });

  const html = mdParser.render(md);
  return { html, headings };
}

// ─────────────────────────────────────────────────────────────
// Inject final HTML into template
// ─────────────────────────────────────────────────────────────
async function buildFinalHtml({ contentHtml, tocHtml, stylesInline }) {
  let template = await fs.readFile(CONFIG.template, 'utf-8');

  // Replace external stylesheet link with inline styles so puppeteer
  // doesn't need filesystem URL resolution
  template = template.replace(
    /<link\s+rel="stylesheet"\s+href="styles\.css"\s*\/?>/,
    `<style>\n${stylesInline}\n</style>`
  );

  template = template.replace('{{TOC}}', tocHtml);
  template = template.replace('{{CONTENT}}', contentHtml);
  return template;
}

// ─────────────────────────────────────────────────────────────
// Header/Footer templates for Puppeteer
// ─────────────────────────────────────────────────────────────
const HEADER_TEMPLATE = `
<div style="font-family: 'Inter', Arial, sans-serif; font-size: 7pt; color: #6B7280; width: 100%; padding: 6mm 25mm 0; box-sizing: border-box;">
  <div style="display: flex; justify-content: space-between; align-items: baseline; padding-bottom: 2mm; border-bottom: 0.5pt solid #1A7A4A;">
    <span style="font-weight: 600; letter-spacing: 0.5pt;">PROPOSAL KKN TEMATIK &middot; HALALCHAIN</span>
    <span style="font-style: italic;">UIN Sunan Gunung Djati Bandung</span>
  </div>
</div>`;

const FOOTER_TEMPLATE = `
<div style="font-family: 'Inter', Arial, sans-serif; font-size: 7pt; color: #6B7280; width: 100%; padding: 0 25mm 4mm; box-sizing: border-box;">
  <div style="display: flex; justify-content: space-between; align-items: baseline; padding-top: 2mm; border-top: 0.4pt solid #C8A84B;">
    <span style="font-weight: 600;">HalalChain &middot; UIN SGD Bandung</span>
    <span>Halaman <span class="pageNumber"></span> dari <span class="totalPages"></span></span>
  </div>
</div>`;

// ─────────────────────────────────────────────────────────────
// Main build pipeline
// ─────────────────────────────────────────────────────────────
async function build() {
  log('Memulai build PDF Proposal KKN HalalChain...');

  // 1. Read inputs
  const rawMd = await fs.readFile(CONFIG.source, 'utf-8');
  const styles = await fs.readFile(CONFIG.styles, 'utf-8');
  log(`Markdown source: ${rawMd.length} bytes`);

  // 2. Preprocess markdown
  const md = preprocessMarkdown(rawMd);
  log(`After preprocessing: ${md.length} bytes`);

  // 3. Render markdown -> HTML + collect headings
  const { html: rawHtml, headings } = renderMarkdown(md);
  log(`Rendered ${headings.length} headings (H2/H3) for TOC`);

  // 4. Post-process HTML (Arabic wrapping)
  const contentHtml = postprocessHtml(rawHtml);

  // 5. Build TOC HTML
  const tocHtml = buildTocHtml(headings);

  // 6. Inject into template
  const finalHtml = await buildFinalHtml({
    contentHtml,
    tocHtml,
    stylesInline: styles,
  });

  // 7. Launch puppeteer with system Chrome
  const chromePath = await findChrome();
  log(`Menggunakan browser: ${chromePath}`);

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });

    log('Memuat HTML dan menunggu font siap...');
    await page.setContent(finalHtml, {
      waitUntil: ['load', 'domcontentloaded', 'networkidle0'],
      timeout: 60_000,
    });
    await page.evaluateHandle('document.fonts.ready');

    // 8. Compute page numbers for TOC by simulating print pagination
    log('Menghitung nomor halaman untuk Daftar Isi...');
    const pageMap = await page.evaluate(
      ({ pageHeightPx, coverPagesCount }) => {
        const contentEl = document.querySelector('.content');
        const contentStartY = contentEl.getBoundingClientRect().top + window.scrollY;

        const els = Array.from(
          document.querySelectorAll('.content h2[id], .content h3[id]')
        );
        const results = [];

        // Pagination model:
        //   - .cover-page and .toc-page each occupy 1 print page (coverPagesCount = 2)
        //   - .content begins on print page 3
        //   - The FIRST H2 of content (Lembar Pengesahan) has break-before: auto -> sits at top of page 3
        //   - SUBSEQUENT H2s have break-before: page -> jump to next page boundary
        //   - H3s flow naturally within the chapter
        //
        // We simulate by tracking "printY" inside the content section.
        // Forced page breaks add padding (extraOffset) that carries forward.

        let extraOffset = 0;
        let isFirstH2 = true;

        for (const el of els) {
          const absDomY = el.getBoundingClientRect().top + window.scrollY;
          const relY = absDomY - contentStartY;
          let printY = relY + extraOffset;

          if (el.tagName === 'H2' && !isFirstH2) {
            const currentPageWithin = Math.floor(printY / pageHeightPx);
            const nextPageStart = (currentPageWithin + 1) * pageHeightPx;
            extraOffset += nextPageStart - printY;
            printY = nextPageStart;
          }
          if (el.tagName === 'H2') isFirstH2 = false;

          const pageWithinContent = Math.floor(printY / pageHeightPx) + 1;
          results.push({
            id: el.id,
            page: pageWithinContent + coverPagesCount,
          });
        }

        return results;
      },
      {
        pageHeightPx: CONFIG.pageContentHeightPx,
        coverPagesCount: CONFIG.coverPagesCount,
      }
    );

    // 9. Inject computed page numbers into TOC
    await page.evaluate((pageMap) => {
      pageMap.forEach(({ id, page }) => {
        const cell = document.querySelector(`.toc-entry-page[data-target="${id}"]`);
        if (cell) cell.textContent = String(page);
      });
    }, pageMap);

    // Optional: dump rendered HTML for debugging
    if (process.env.DUMP_HTML === '1') {
      const dumpPath = path.join(__dirname, 'debug.rendered.html');
      const renderedHtml = await page.content();
      await fs.writeFile(dumpPath, renderedHtml);
      log(`Debug HTML dumped to: ${dumpPath}`);
    }

    // 10. Print to PDF
    log('Mencetak ke PDF...');
    await page.emulateMediaType('print');
    const pdfBytes = await page.pdf({
      ...CONFIG.pdf,
      headerTemplate: HEADER_TEMPLATE,
      footerTemplate: FOOTER_TEMPLATE,
    });

    await fs.writeFile(CONFIG.output, pdfBytes);
    const sizeKb = (pdfBytes.length / 1024).toFixed(1);
    log(`PDF tersimpan: ${CONFIG.output} (${sizeKb} KB)`);
  } finally {
    await browser.close();
  }

  log('Selesai. PDF siap diajukan.');
}

build().catch((err) => {
  console.error('[ERROR]', err);
  process.exit(1);
});
