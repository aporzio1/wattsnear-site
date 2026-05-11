# WattsNear website

Customer-facing marketing site for the [WattsNear](https://apps.apple.com/us/app/wattsnear/id6762151871) iPhone & CarPlay app, hosted on GitHub Pages at <https://aporzio1.github.io/wattsnear-site/>.

## Files

- `index.html` — landing page (hero, features, CarPlay/Siri/Widget, calculator, FAQ, download)
- `privacy.html` — Privacy Policy (mirror of the in-app `PrivacyView`)
- `terms.html` — Terms of Service (mirror of the in-app `TermsView`)
- `style.css` — responsive styling, light + dark mode
- `script.js` — theme toggle + EV-vs-gas calculator
- `favicon.svg` — bolt icon
- `sitemap.xml`, `robots.txt`, `.nojekyll` — discoverability + GitHub Pages config

## Deploying to GitHub Pages

1. Push `main`.
2. Repo settings → Pages → source `main` / `/` → Save.
3. After deploy, the site is live at the Pages URL above.

## Keeping legal copy in sync

The canonical Privacy / Terms live in the WattsNear iOS repo under `WattsNear/web/privacy.html` and `WattsNear/web/terms.html` (deployed separately to `wattsnear.aporzio.com` for App Store Connect). When that copy changes, mirror the change here so the public marketing site and the App Store legal links don't drift.
