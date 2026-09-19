# Marketing

Source-of-truth for WattsNear's Threads content plan and automation.

## Files

- `threads-plan.md` — the human-readable 30-day calendar. Edit this freely; the workflow parses it directly.
- `visuals/` — drop a file named `<post-id>.png` (or `.jpg`, `.webp`, `.mp4`) and the posting workflow will attach it. Post IDs are `w1-mon`, `w1-tue`, …, `w4-sat`.
- `posts.log` — append-only log of what the workflow posted (auto-generated; committed back is opt-in).
- `metrics.csv` — daily App Units per `ct=` campaign token (auto-generated once App Store Connect API is wired up).

## Automation overview

Two workflows live in `.github/workflows/`:

| Workflow | Schedule | What it does |
|---|---|---|
| `post-to-threads.yml` | 14:00 UTC Mon–Sat | Picks today's post from `threads-plan.md`, attaches a visual if one exists, posts via the Threads Graph API |
| `threads-metrics.yml` | 06:00 UTC Mon | Pulls last week's App Store Connect attribution by `ct=` token, writes `metrics.csv` |

Both workflows default to a safe no-op until the required secrets/variables are set. Adding them turns automation on; removing them turns it back off.

## Turning automation on

### 1. Repository **variables** (Settings → Secrets and variables → Actions → Variables)

| Name | Value | Notes |
|---|---|---|
| `THREADS_LAUNCH_DATE` | `YYYY-MM-DD` | First day W1-Mon should post. Required. |
| `APP_STORE_PROVIDER_TOKEN` | numeric `pt=` value | Optional. App Store Connect → Users and Access → Integrations. |
| `ASC_VENDOR_NUMBER` | 8-digit number | Required for metrics. Find in Payments and Financial Reports. |

### 2. Repository **secrets** (Settings → Secrets and variables → Actions → Secrets)

For posting:

| Name | How to get it |
|---|---|
| `THREADS_ACCESS_TOKEN` | Meta for Developers → Apps → create app → request `threads_basic` + `threads_content_publish` scopes → generate long-lived token (60 days; needs a refresh script eventually). |
| `THREADS_USER_ID` | Same dashboard, under your Threads account profile. |

For metrics (optional):

| Name | How to get it |
|---|---|
| `ASC_KEY_ID` | App Store Connect → Users and Access → Integrations → App Store Connect API → create a key with Sales or Developer role. 10-char alphanumeric. |
| `ASC_ISSUER_ID` | Same page. UUID at the top. |
| `ASC_KEY_P8` | Contents of the downloaded `.p8` file (paste the whole multi-line PEM). |

### 3. (Optional) Override the post time

The workflow runs at 14:00 UTC. To shift it, edit the cron line at the top of `.github/workflows/post-to-threads.yml`. Note: GitHub cron is best-effort and may delay 5–15 min on shared runners.

### 4. Test it

Trigger a manual dry-run before flipping it live:

```
Actions → Post to Threads → Run workflow → dry_run = true
```

You'll see the resolved post text and visual URL in the run logs.

### 5. Refresh the access token (~every 50 days)

Threads long-lived tokens last 60 days. Use Meta's refresh endpoint:

```
GET https://graph.threads.net/refresh_access_token
    ?grant_type=th_refresh_token
    &access_token=<current_token>
```

Returns a fresh token with another 60-day window. Either rotate manually or add a quarterly cron that runs the refresh, writes the new token to the secret via the GitHub API, and notifies you on failure.

## How "today's post" is resolved

```
launchDate = THREADS_LAUNCH_DATE
daysSince  = floor((now - launchDate) / 1 day)
week       = floor(daysSince / 7) + 1     # 1..4
dayOfWeek  = mon|tue|wed|thu|fri|sat       # Sun is skipped
postId     = w<week>-<dayOfWeek>
```

Outside the 4-week window, or on Sundays, the script logs and exits cleanly.

## Adding a visual

Save `marketing/visuals/<post-id>.png` (or `.jpg`, `.webp`, `.mp4`) and commit. Once it's on `main` and Pages has rebuilt, the URL `https://wattsnear.com/marketing/visuals/<post-id>.png` is fetchable by Meta's API, which the workflow will use automatically.

Tips:
- Threads supports JPEG and PNG up to 8 MB, MP4 up to 100 MB.
- For screen-recordings, 5–12 seconds, 1080×1920 (vertical) or 1080×1080 (square) work best.

## Reading the data

`marketing/metrics.csv` will look like:

```
date,ct,impressions,page_views,app_units
2026-05-19,threads_launch,18200,420,87
2026-05-20,threads_savings_commuter,11500,310,64
...
```

The only column that matters is `app_units`. Sort by it weekly. Promote the top 3 formats into the next round of posts; quietly retire the bottom 3.
