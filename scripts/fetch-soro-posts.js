#!/usr/bin/env node
/**
 * Fetch Soro blog posts and save them as Jekyll Markdown files in _posts/.
 *
 * Works by loading the Soro embed in a headless Chromium browser, intercepting
 * the API responses Soro makes, then converting each post to Markdown.
 *
 * Setup (one-time):
 *   npm install
 *   npx playwright install chromium
 *
 * Run:
 *   node scripts/fetch-soro-posts.js
 *
 * Debug (dumps raw API payloads):
 *   DEBUG=1 node scripts/fetch-soro-posts.js
 */

'use strict';

const { chromium } = require('playwright');
const TurndownService = require('turndown');
const fs   = require('fs');
const path = require('path');

const SORO_ID   = 'a403844d-5cf4-4fd6-905d-f4a16be5d507';
const SITE_URL  = 'https://wattsnear.com/';
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

function buildFrontmatter(post, date) {
  const title   = (post.title   || 'Untitled').replace(/"/g, '\\"');
  const summary = (post.summary || '').replace(/"/g, '\\"');
  const image   = post.image || '';

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

function normalisePost(raw) {
  return {
    title:   raw.title || raw.name || raw.heading || '',
    slug:    raw.slug  || raw.url_slug || slugify(raw.title || raw.name || ''),
    date:    raw.date  || raw.published_at || raw.publishedAt || raw.created_at || raw.createdAt || '',
    summary: raw.summary || raw.excerpt || raw.meta_description || raw.seoDescription || '',
    image:   raw.image || raw.featured_image || raw.coverImage || raw.thumbnail || '',
    content: raw.content || raw.body || raw.html || raw.markdown || '',
  };
}

function extractPostsFromResponse(data) {
  if (Array.isArray(data)) return data;
  for (const key of ['posts', 'articles', 'blogs', 'items', 'data', 'results']) {
    if (Array.isArray(data[key])) return data[key];
  }
  if (data.title || data.name) return [data]; // single post object
  return [];
}

// ─── main ─────────────────────────────────────────────────────────────────────

async function main() {
  const td = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-' });

  console.log('Launching browser…');
  const browser = await chromium.launch({ headless: true });
  const page    = await browser.newPage();

  // Collect every JSON response from trysoro.com
  const captured = [];
  page.on('response', async (response) => {
    if (!response.url().includes('trysoro.com')) return;
    const ct = response.headers()['content-type'] || '';
    if (!ct.includes('json')) return;
    try {
      const data = await response.json();
      captured.push({ url: response.url(), data });
      console.log(`  [api] ${response.url()}`);
    } catch {}
  });

  // Minimal host page with real site Referer so Soro doesn't reject the embed
  const embedHtml = `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body>
<div id="soro-blog"></div>
<script src="https://app.trysoro.com/api/embed/${SORO_ID}?theme=dark" defer></script>
</body></html>`;

  await page.setExtraHTTPHeaders({ Referer: SITE_URL });
  await page.goto(`data:text/html,${encodeURIComponent(embedHtml)}`, { waitUntil: 'networkidle', timeout: 30_000 }).catch(() => {});
  await page.setContent(embedHtml, { waitUntil: 'networkidle', timeout: 30_000 }).catch(() => {});

  // Brief pause for any deferred/lazy API calls
  await new Promise(r => setTimeout(r, 4000));

  await browser.close();

  // ── find posts in captured responses ──────────────────────────────────────
  let rawPosts = [];
  for (const { url, data } of captured) {
    const found = extractPostsFromResponse(data);
    if (found.length > 0) {
      console.log(`\nFound ${found.length} post(s) from: ${url}`);
      rawPosts = found;
      break;
    }
  }

  if (rawPosts.length === 0) {
    console.log('\nNo posts found in intercepted API responses.');
    if (captured.length === 0) {
      console.log('No requests to trysoro.com were intercepted at all.');
      console.log('The embed may require a real browser session or domain whitelist.');
    } else {
      console.log('Intercepted URLs:');
      captured.forEach(c => console.log('  ', c.url));
    }
    if (process.env.DEBUG) {
      console.log('\nRaw payloads:');
      captured.forEach(c => console.log(JSON.stringify(c.data, null, 2)));
    }
    console.log('\nFallback: open your blog in Chrome, open DevTools → Network,');
    console.log('filter by "trysoro", and look for a JSON response with your posts.');
    console.log('Copy that JSON and run: node scripts/import-soro-json.js <file.json>');
    return;
  }

  // ── convert & save ────────────────────────────────────────────────────────
  fs.mkdirSync(POSTS_DIR, { recursive: true });
  let saved = 0, skipped = 0;

  for (const raw of rawPosts) {
    const post     = normalisePost(raw);
    const date     = isoDate(post.date);
    const slug     = post.slug || slugify(post.title);
    const filename = `${date}-${slug}.md`;
    const filePath = path.join(POSTS_DIR, filename);

    if (fs.existsSync(filePath)) {
      console.log(`  skip (exists): _posts/${filename}`);
      skipped++;
      continue;
    }

    const mdBody = post.content.includes('<')
      ? td.turndown(post.content)
      : post.content;

    fs.writeFileSync(filePath, buildFrontmatter(post, date) + mdBody + '\n', 'utf8');
    console.log(`  saved: _posts/${filename}`);
    saved++;
  }

  console.log(`\nDone — ${saved} saved, ${skipped} already existed.`);
}

main().catch(err => { console.error(err); process.exit(1); });
