import fs from 'node:fs';

/**
 * Parses marketing/threads-plan.md and returns an array of post objects.
 *   { id: 'w1-mon', week: 1, day: 'mon', title, ct, text, visual }
 *
 * The plan is the human-readable source of truth. This parser pulls
 * structured data out of it so a scheduled GitHub Action can pick today's
 * post and ship it to Threads.
 */
export function parsePlan(planPath) {
  const md = fs.readFileSync(planPath, 'utf8');
  const lines = md.split('\n');

  // First pass: pull out the two launch options so we can fall back to
  // Option A whenever a calendar entry says "Use Option A or B above".
  const launchOptions = extractLaunchOptions(lines);

  const posts = [];
  let week = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const wMatch = line.match(/^###\s+Week\s+(\d+)/);
    if (wMatch) { week = parseInt(wMatch[1], 10); continue; }

    const pMatch = line.match(/^####\s+(Mon|Tue|Wed|Thu|Fri|Sat)\s+·\s+([^·\n]+?)\s*·\s+(?:`ct=([\w-]+)`|no link)/i);
    if (!pMatch) continue;

    const day = pMatch[1].toLowerCase();
    const title = pMatch[2].trim();
    const ct = pMatch[3] || null;

    // Capture everything until the next #### / ### / ## header
    const blockLines = [];
    let j = i + 1;
    while (j < lines.length && !/^(####|###|##)\s/.test(lines[j])) {
      blockLines.push(lines[j]);
      j++;
    }
    const block = blockLines.join('\n');

    let text = extractFencedText(block);
    if (!text && /Use Option A or B/i.test(block)) {
      text = launchOptions.a || launchOptions.b || null;
    }

    const visualMatch = block.match(/\*\*Visual:\*\*\s+(.+)/);
    const visual = visualMatch ? visualMatch[1].trim() : null;

    posts.push({ id: `w${week}-${day}`, week, day, title, ct, text, visual });
  }

  return posts;
}

function extractLaunchOptions(lines) {
  // Find the "## 1. Launch posts" section and pull text out of Option A / Option B.
  const result = { a: null, b: null };
  let inLaunch = false;
  let current = null;
  let buffer = [];
  let inFence = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (/^##\s+1\.\s+Launch posts/i.test(line)) { inLaunch = true; continue; }
    if (inLaunch && /^##\s/.test(line) && !/^##\s+1\./i.test(line)) { break; }
    if (!inLaunch) continue;

    const optMatch = line.match(/^###\s+Option\s+([AB])/i);
    if (optMatch) {
      if (current && buffer.length) result[current] = buffer.join('\n').trim();
      current = optMatch[1].toLowerCase();
      buffer = [];
      inFence = false;
      continue;
    }

    if (line.trim() === '```text') { inFence = true; continue; }
    if (line.trim() === '```' && inFence) { inFence = false; continue; }
    if (inFence) buffer.push(line);
  }
  if (current && buffer.length) result[current] = buffer.join('\n').trim();
  return result;
}

function extractFencedText(block) {
  const m = block.match(/```text\n([\s\S]*?)```/);
  return m ? m[1].trim() : null;
}

/**
 * Returns the post scheduled for `now` given a launch date, or null on Sundays / out-of-range.
 */
export function pickTodaysPost(posts, now, launchDate) {
  const dow = now.getUTCDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  if (dow === 0) return null;
  const dayName = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][dow];

  const daysSince = Math.floor((now - launchDate) / 86400000);
  if (daysSince < 0) return null;

  const week = Math.floor(daysSince / 7) + 1;
  if (week < 1 || week > 4) return null;

  return posts.find((p) => p.week === week && p.day === dayName) || null;
}
