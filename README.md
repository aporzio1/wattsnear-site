# WattsNear website

Customer-facing marketing site for the [WattsNear](https://apps.apple.com/app/apple-store/id6762151871?pt=127464251&ct=website&mt=8) iPhone & CarPlay app. Hosted on GitHub Pages, served at <https://wattsnear.com/>. Jekyll-powered so the blog Just Works.

## Files

- `index.html` — landing page (hero, features, CarPlay/Siri/Widget, calculator, FAQ, download)
- `privacy.html` — Privacy Policy (mirror of the in-app `PrivacyView`)
- `terms.html` — Terms of Service (mirror of the in-app `TermsView`)
- `style.css` — responsive styling, light + dark mode (now includes blog styles)
- `script.js` — theme toggle + EV-vs-gas calculator
- `favicon.svg` — bolt icon
- `sitemap.xml`, `robots.txt` — discoverability
- `app-ads.txt` — AdMob verification (must live at the marketing-URL root)
- `_config.yml` — Jekyll config (title, plugins, permalink scheme)
- `_layouts/` — Jekyll layouts shared by blog pages (`default.html`, `post.html`)
- `_posts/` — blog posts as Markdown, filename pattern `YYYY-MM-DD-slug.md`
- `blog/index.html` — blog index, lists every post in `_posts/`

## Blog: adding a new post

1. Create a file in `_posts/` named `YYYY-MM-DD-your-slug.md`.
2. Front matter at the top:
   ```yaml
   ---
   layout: post
   title: "Your Title Here"
   date: 2026-05-15
   author: Andrew Porzio
   summary: "One-line description for the blog index and SEO."
   read_time: 4
   ---
   ```
3. Write the body in plain Markdown below the front matter.
4. (Optional) add the new URL to `sitemap.xml`.
5. Commit + push. GitHub Pages builds Jekyll automatically; the post is live within ~1 min at `/blog/<slug>/`.

The existing marketing pages (`index.html`, `privacy.html`, `terms.html`) don't have Jekyll front matter, so Jekyll treats them as static and copies them through unchanged.

## Deploying to GitHub Pages

Push to `main`. Pages config: source `main` / `/`, custom domain `wattsnear.com` (also see `CNAME`). GitHub Pages runs Jekyll on every push to `main`.

## Keeping legal copy in sync

The canonical Privacy / Terms also live in the WattsNear iOS repo under `WattsNear/web/privacy.html` and `WattsNear/web/terms.html` (in-app mirrors). When the in-app copy changes, update `privacy.html` / `terms.html` here so the App Store legal links served from `wattsnear.com` don't drift.
