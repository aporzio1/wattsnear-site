#!/usr/bin/env node
/**
 * Fetch Soro blog posts and save them as Jekyll Markdown files in _posts/.
 *
 * Soro bundles post metadata (SORO_ARTICLES) directly in the embed script.
 * Full article HTML is loaded by navigating to /?post=<slug>. This script
 * does both steps in a headless browser and converts each post to Markdown.
 *
 * Setup (one-time):
 *   npm install
 *   npx playwright install chromium
 *
 * Run:
 *   node scripts/fetch-soro-posts.js
 */

'use strict';

const { chromium } = require('playwright');
const TurndownService = require('turndown');
const http = require('http');
const fs   = require('fs');
const path = require('path');

const SORO_ID   = 'a403844d-5cf4-4fd6-905d-f4a16be5d507';
const POSTS_DIR = path.resolve(__dirname, '../_posts');

// ─── helpers ──────────────────────────────────────────────────────────────────

function slugify(text = '') {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function isoDate(raw) {
  if (!raw) return new Date().toISOString().slice(0, 10);
  const d = new Date(raw);
  return isNaN(d) ? new Date().toISOString().slice(0, 10) : d.toISOString().slice(0, 10);
}

function buildFrontmatter(article, date) {
  const title   = (article.title   || 'Untitled').replace(/"/g, '\\"');
  const summary = (article.excerpt || article.summary || '').replace(/"/g, '\\"');
  const image   = article.image || '';

  const lines = [
    '---',
    'layout: post',
    `title: "${title}"`,
    `date: ${date} 09:00:00 -0400`,
    'author: Andrew Porzio',
  ];
  if (summary) lines.push(`summary: "${summary}"`);
  if (image)   lines.push(`image: "${image}"`);
  lines.push('---', '', '');
  return lines.join('\n');
}

function startLocalServer(html) {
  return new Promise((resolve) => {
    const server = http.createServer((_req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    });
    server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port }));
  });
}

// ─── main ─────────────────────────────────────────────────────────────────────

async function main() {
  const td = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-' });

  const embedHtml = `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body>
<div id="soro-blog"></div>
<script src="https://app.trysoro.com/api/embed/${SORO_ID}?theme=dark"></script>
</body></html>`;

  const { server, port } = await startLocalServer(embedHtml);
  const baseUrl = `http://127.0.0.1:${port}/`;
  console.log(`Local server: ${baseUrl}`);

  const browser = await chromium.launch({ headless: true, args: ['--ignore-certificate-errors'] });
  const page    = await browser.newPage();

  // ── Step 1: intercept embed script and parse SORO_ARTICLES out of it ───────
  let scriptSource = '';
  page.on('response', async (response) => {
    if (!response.url().includes('trysoro.com')) return;
    try { scriptSource = await response.text(); } catch {}
  });

  console.log('Loading embed…');
  await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 30_000 });

  // SORO_ARTICLES is declared as a local var inside an IIFE, so extract via regex
  const match = scriptSource.match(/var SORO_ARTICLES\s*=\s*(\[[\s\S]*?\]);/);
  if (!match) {
    console.error('Could not find SORO_ARTICLES in embed script.');
    if (process.env.DEBUG) console.log('Script preview:', scriptSource.slice(0, 600));
    await browser.close();
    server.close();
    return;
  }

  let articles;
  try { articles = JSON.parse(match[1]); }
  catch (e) { console.error('Failed to parse SORO_ARTICLES JSON:', e.message); await browser.close(); server.close(); return; }

  if (!articles || articles.length === 0) {
    console.error('SORO_ARTICLES is empty.');
    await browser.close();
    server.close();
    return;
  }

  console.log(`Found ${articles.length} article(s) in SORO_ARTICLES\n`);

  // ── Step 2: for each article, load full content via /?post=<slug> ─────────
  fs.mkdirSync(POSTS_DIR, { recursive: true });
  let saved = 0, skipped = 0;

  for (const article of articles) {
    const slug     = article.slug || slugify(article.title || '');
    const date     = isoDate(article.isoDate || article.date);
    const filename = `${date}-${slug}.md`;
    const filePath = path.join(POSTS_DIR, filename);

    if (fs.existsSync(filePath)) {
      console.log(`  skip (exists): _posts/${filename}`);
      skipped++;
      continue;
    }

    console.log(`  fetching: ${slug}`);
    await page.goto(`${baseUrl}?post=${slug}`, { waitUntil: 'networkidle', timeout: 20_000 });
    await new Promise(r => setTimeout(r, 1500));

    // Extract the article body — prefer the innermost content div over the full #soro-blog wrapper
    // (which contains Soro UI chrome like back-nav, title, and date header)
    const articleHtml = await page.evaluate(() => {
      // Remove the back-navigation header and any duplicate h1/time before extracting
      document.querySelectorAll('.soro-blog-header, .soro-blog-back').forEach(el => el.remove());
      const article = document.querySelector('.soro-blog-article');
      if (article) {
        // Remove the first h1 (title) and time element — those go in frontmatter
        article.querySelector('h1')?.remove();
        article.querySelector('time')?.remove();
      }
      const el = article || document.querySelector('#soro-blog');
      return el ? el.innerHTML : '';
    });

    if (!articleHtml) {
      console.log(`  warn: no content found for ${slug}`);
      continue;
    }

    const mdBody   = td.turndown(articleHtml);
    const contents = buildFrontmatter(article, date) + mdBody + '\n';

    fs.writeFileSync(filePath, contents, 'utf8');
    console.log(`  saved: _posts/${filename}`);
    saved++;
  }

  await browser.close();
  server.close();

  console.log(`\nDone — ${saved} saved, ${skipped} already existed.`);
}

main().catch(err => { console.error(err); process.exit(1); });
