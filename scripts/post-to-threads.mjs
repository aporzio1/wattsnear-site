#!/usr/bin/env node
/**
 * Posts today's WattsNear Threads post per the schedule in marketing/threads-plan.md.
 *
 * Runs in dry-run mode when secrets aren't configured so the workflow can be
 * scheduled now and "turned on" later by adding the secrets in repo settings.
 *
 * Env (set as GitHub secrets / variables):
 *   THREADS_ACCESS_TOKEN   long-lived Threads Graph API token  (secret)
 *   THREADS_USER_ID        Threads numeric user id              (secret)
 *   APP_STORE_PROVIDER_TOKEN  Apple `pt=` provider id           (variable, optional)
 *   THREADS_LAUNCH_DATE    YYYY-MM-DD, day W1 Mon should post   (variable)
 *   DRY_RUN                "true" to log without posting        (input)
 */

import path from 'node:path';
import { existsSync, appendFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parsePlan, pickTodaysPost } from './parse-plan.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.join(__dirname, '..');

const {
  THREADS_ACCESS_TOKEN = '',
  THREADS_USER_ID = '',
  APP_STORE_PROVIDER_TOKEN = '',
  THREADS_LAUNCH_DATE = '',
  DRY_RUN = 'false',
} = process.env;

const APP_ID = '6762151871';
const APP_BASE = `https://apps.apple.com/us/app/wattsnear/id${APP_ID}`;
const SITE = 'https://wattsnear.com';

const dryRun = DRY_RUN === 'true' || !THREADS_ACCESS_TOKEN || !THREADS_USER_ID;

if (!THREADS_LAUNCH_DATE) {
  console.log('[skip] THREADS_LAUNCH_DATE repo variable is not set. Exiting.');
  process.exit(0);
}

const launchDate = new Date(`${THREADS_LAUNCH_DATE}T00:00:00Z`);
const now = new Date();

const posts = parsePlan(path.join(repoRoot, 'marketing', 'threads-plan.md'));
const post = pickTodaysPost(posts, now, launchDate);

if (!post) {
  console.log(`[skip] No post for ${now.toISOString().slice(0, 10)} (UTC ${now.getUTCDay()}).`);
  process.exit(0);
}
if (!post.text) {
  console.log(`[skip] Post ${post.id} has no text body in the plan.`);
  process.exit(0);
}

// Build tracked App Store URL using the post's ct= token
let appUrl = APP_BASE;
if (post.ct) {
  const params = new URLSearchParams({ ct: post.ct, mt: '8' });
  if (APP_STORE_PROVIDER_TOKEN) params.set('pt', APP_STORE_PROVIDER_TOKEN);
  appUrl = `${APP_BASE}?${params.toString()}`;
}

// Substitute bare App Store URLs in the post body with the tracked one
let text = post.text;
const urlPatterns = [
  /https?:\/\/apps\.apple\.com\/us\/app\/wattsnear\/id6762151871[^\s]*/g,
  /\bapps\.apple\.com\/us\/app\/wattsnear\/id6762151871[^\s]*/g,
];
for (const re of urlPatterns) text = text.replace(re, appUrl);

// Resolve a visual asset if one has been dropped in marketing/visuals/<post.id>.<ext>
let mediaUrl = null;
let mediaType = 'TEXT';
for (const ext of ['png', 'jpg', 'jpeg', 'webp']) {
  const p = path.join(repoRoot, 'marketing', 'visuals', `${post.id}.${ext}`);
  if (existsSync(p)) {
    mediaUrl = `${SITE}/marketing/visuals/${post.id}.${ext}`;
    mediaType = 'IMAGE';
    break;
  }
}
if (!mediaUrl) {
  const mp4 = path.join(repoRoot, 'marketing', 'visuals', `${post.id}.mp4`);
  if (existsSync(mp4)) {
    mediaUrl = `${SITE}/marketing/visuals/${post.id}.mp4`;
    mediaType = 'VIDEO';
  }
}

console.log(`Today's post: ${post.id} (${post.title})`);
console.log(`ct=${post.ct ?? 'none'}  media=${mediaType}`);
console.log('--- post text ---');
console.log(text);
console.log('--- end ---');

if (dryRun) {
  console.log('\n[dry-run] Skipping API calls. Set THREADS_ACCESS_TOKEN + THREADS_USER_ID secrets to enable.');
  process.exit(0);
}

const graph = 'https://graph.threads.net/v1.0';

async function call(endpoint, params) {
  const url = new URL(`${graph}/${endpoint}`);
  url.searchParams.set('access_token', THREADS_ACCESS_TOKEN);
  const body = new URLSearchParams(params);
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const data = await res.json();
  if (!res.ok) {
    console.error(`POST ${endpoint} failed:`, data);
    throw new Error(`Threads API error on ${endpoint}`);
  }
  return data;
}

// 1. Create the media container
const containerParams = { media_type: mediaType, text };
if (mediaType === 'IMAGE') containerParams.image_url = mediaUrl;
if (mediaType === 'VIDEO') containerParams.video_url = mediaUrl;

const created = await call(`${THREADS_USER_ID}/threads`, containerParams);
console.log(`Container: ${created.id}`);

// 2. Meta recommends waiting before publishing (longer for videos)
const waitMs = mediaType === 'VIDEO' ? 60_000 : 30_000;
console.log(`Waiting ${waitMs / 1000}s before publish...`);
await new Promise((r) => setTimeout(r, waitMs));

const published = await call(`${THREADS_USER_ID}/threads_publish`, { creation_id: created.id });
console.log(`Published: ${published.id}`);

// Append to a simple log file the workflow can commit back if desired
const logLine = `${now.toISOString()}\t${post.id}\t${post.ct ?? '-'}\t${published.id}\n`;
try { appendFileSync(path.join(repoRoot, 'marketing', 'posts.log'), logLine); } catch (e) {}
