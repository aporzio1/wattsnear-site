#!/usr/bin/env python3
"""Fetch Soro article content via the embed API and write Jekyll posts."""

import json, re, sys, os, html, subprocess as sp
from datetime import datetime, timedelta
from urllib.request import urlopen

EMBED_URL = "https://app.trysoro.com/api/embed/a403844d-5cf4-4fd6-905d-f4a16be5d507?theme=dark"
ARTICLE_API = "https://app.trysoro.com/api/embed/a403844d-5cf4-4fd6-905d-f4a16be5d507/article/{id}"
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, '..'))
POSTS_DIR = os.path.join(REPO_ROOT, '_posts')

TARGET_SLUGS = [
    'ev-charging-apps-comparison',
    'ev-charging-price-transparency-trends',
    'nrel-station-locator-data-guide',
    'ev-connector-types-explained-guide',
    'ev-charger-prices-what-drivers-really-pay',
    'how-to-use-carplay-for-ev-charging',
    'best-ways-to-save-on-ev-charging',
    'do-ev-charging-apps-track-location',
    'how-to-compare-ev-charging-prices',
    'compare-ccs-nacs-j1772-chargers',
    'all-network-ev-charger-finder',
    'best-apps-for-finding-ev-chargers',
    'nrel-data-vs-charging-network-apps',
    'which-ev-charging-networks-are-cheapest',
    'how-to-plan-ev-charging-stops',
    'ev-charging-cost-per-mile',
    'how-to-find-cheap-dc-fast-charging',
    'closest-ev-chargers-without-the-guesswork',
    'iphone-ev-charging-app-review',
    'best-carplay-apps-for-ev-drivers',
    'how-to-find-nearby-ev-chargers-fast',
    'tesla-charging-what-drivers-need-to-know',
]

def slug_to_id_map():
    resp = urlopen(EMBED_URL, timeout=30).read().decode()
    m = re.search(r'var SORO_ARTICLES = (\[[\s\S]*?\]);', resp)
    if not m:
        print("ERROR: Could not find SORO_ARTICLES in embed response", file=sys.stderr)
        sys.exit(1)
    articles = json.loads(m.group(1))
    return {a['slug']: a['id'] for a in articles}

def fetch_article(article_id):
    url = ARTICLE_API.format(id=article_id)
    resp = urlopen(url, timeout=30).read().decode()
    data = json.loads(resp)
    body = data.get('content', '') or data.get('body', '') or ''
    body = html.unescape(body)
    body = re.sub(r'<p><a href="https://app\.trysoro\.com/.*?</p>', '', body)
    body = body.strip()
    return body

def html_to_markdown(html_text):
    """Use turndown node module from the repo root."""
    td_code = (
        "const TurndownService = require('turndown');\n"
        "const td = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-', codeBlockStyle: 'fenced' });\n"
        "let input = '';\n"
        "process.stdin.on('data', c => input += c);\n"
        "process.stdin.on('end', () => { process.stdout.write(td.turndown(input)); });\n"
    )
    p = sp.run(['node', '-e', td_code], input=html_text,
               capture_output=True, text=True, timeout=30, cwd=REPO_ROOT)
    return p.stdout.strip()

def slug_to_title(slug):
    return slug.replace('-', ' ').title()

def main():
    slug_map = slug_to_id_map()
    start = datetime(2026, 6, 14)
    dates = [(start + timedelta(days=i*4)).strftime('%Y-%m-%d') for i in range(len(TARGET_SLUGS))]
    os.makedirs(POSTS_DIR, exist_ok=True)
    saved = 0
    failed = 0

    for i, slug in enumerate(TARGET_SLUGS):
        date = dates[i]
        filename = f"{date}-{slug}.md"
        filepath = os.path.join(POSTS_DIR, filename)

        if os.path.exists(filepath):
            print(f"  skip: {filename} (exists)")
            continue

        if slug not in slug_map:
            print(f"  [{i+1}/{len(TARGET_SLUGS)}] {slug} — no UUID in embed, FAIL")
            failed += 1
            continue

        article_id = slug_map[slug]
        sys.stdout.write(f"  [{i+1}/{len(TARGET_SLUGS)}] {slug} ({date})... ")
        sys.stdout.flush()

        try:
            html_body = fetch_article(article_id)
            if not html_body:
                print("EMPTY")
                failed += 1
                continue

            md_body = html_to_markdown(html_body)
            title = slug_to_title(slug)

            frontmatter = (
                "---\n"
                f'layout: post\n'
                f'title: "{title}"\n'
                f'date: {date} 09:00:00 -0400\n'
                f'author: Andrew Porzio\n'
                "---\n\n"
            )

            with open(filepath, 'w') as f:
                f.write(frontmatter + md_body + '\n')

            print(f"OK ({len(md_body)} chars md)")
            saved += 1
        except Exception as e:
            print(f"ERROR: {e}")
            failed += 1

    print(f"\nDone — {saved} saved, {failed} failed.")

if __name__ == '__main__':
    main()
