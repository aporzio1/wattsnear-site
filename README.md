# WattsNear website

Customer-facing marketing site for the [WattsNear](https://apps.apple.com/us/app/wattsnear/id6762151871) iPhone & CarPlay app. Hosted on GitHub Pages, served at <https://wattsnear.com/>.

## Files

- `index.html` — landing page (hero, features, CarPlay/Siri/Widget, calculator, FAQ, download)
- `privacy.html` — Privacy Policy (mirror of the in-app `PrivacyView`)
- `terms.html` — Terms of Service (mirror of the in-app `TermsView`)
- `style.css` — responsive styling, light + dark mode
- `script.js` — theme toggle + EV-vs-gas calculator
- `favicon.svg` — bolt icon
- `sitemap.xml`, `robots.txt`, `.nojekyll` — discoverability + GitHub Pages config

## Deploying to GitHub Pages

Push to `main`. Pages config: source `main` / `/`, custom domain `wattsnear.com` (also see `CNAME`).

## Keeping legal copy in sync

The canonical Privacy / Terms also live in the WattsNear iOS repo under `WattsNear/web/privacy.html` and `WattsNear/web/terms.html` (in-app mirrors). When the in-app copy changes, update `privacy.html` / `terms.html` here so the App Store legal links served from `wattsnear.com` don't drift.
