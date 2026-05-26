# WattsNear · Threads Launch Plan

Goal: maximize reach to EV owners and drive App Store downloads.
Tone: confident indie developer voice, dry humor, concrete numbers over adjectives, no marketing-speak.

App Store link with campaign tokens:
`https://apps.apple.com/us/app/wattsnear/id6762151871?pt=PROVIDER_ID&ct=<token>&mt=8`

---

## 1. Launch posts

Pick one and pin it. The other becomes a week-2 re-introduction.

### Option A — value-first  · `ct=threads_launch_a`

```text
I drove past three EV chargers last week that were 40% cheaper than the one I stopped at.

So I built WattsNear. iPhone + CarPlay app that shows the closest and cheapest chargers near you, live from the DOE. Every connector, every network. 60,000+ U.S. stations.

Free. No account. No tracking.

Charge for less. Drive farther.

apps.apple.com/us/app/wattsnear/id6762151871
```

**Visual:** 9-second silent screen-recording. Map opens → tap "Cheapest" → list re-sorts with visible $/kWh prices. CarPlay frame in last 2 seconds.

### Option B — story-first  · `ct=threads_launch_b`

```text
I paid $0.56/kWh on a road trip last spring. Two miles away: a station at $0.31. I didn't know because no app showed me both at once.

I'm an iOS dev. I wrote WattsNear that weekend and kept going for a year.

Closest or cheapest, one tap. CarPlay. Siri. Widget. Free. No login.

DOE data, 60k stations, every connector.

apps.apple.com/us/app/wattsnear/id6762151871
```

**Visual:** still photo, iPhone in a CarPlay dash mount, WattsNear's map visible, real road through windshield.

---

## 2. 30-day content calendar

22 posts, 5–6/week, Mon–Sat. Sundays off.

### Week 1 — Launch + establish identity

#### Mon · Launch  · `ct=threads_launch`
Use Option A or B above.

#### Tue · Savings flex  · `ct=threads_savings_commuter`
```text
Quick math. 200 mi/wk EV at 3.5 mi/kWh + $0.18 home rate vs a 28 mpg gas car at $4.20/gal. The EV side: ~$535/yr. The gas side: ~$1,560/yr. Difference: $1,028. Per year. Forever. WattsNear helps you keep that gap wide by finding the cheap kWh. Free on iPhone.
```
**Visual:** side-by-side infographic, two columns, big numbers.

#### Wed · Privacy angle  · `ct=threads_privacy_intro`
```text
WattsNear has no login. No email field. No "create an account to continue." No analytics SDK. No server that knows you exist. Your favorites sync through your own iCloud if you want them to, and don't if you don't. I built the EV charger app I wanted to use.
```
**Visual:** none. Text-only.

#### Thu · Screenshot showcase  · `ct=threads_cheapest_sort`
```text
One tap to re-sort by $/kWh. Real prices, parsed from the DOE's pricing field — not "call station for rates." When the data's there, you see the number.
```
**Visual:** screenshot, cheapest-sort list view with prices visible.

#### Fri · Comparison  · `ct=threads_anti_bloat`
```text
Most charging apps want your email, your car's VIN, push permissions, location 24/7, and a subscription. WattsNear wants none of those. Open it, see chargers, close it. That's the app.
```
**Visual:** none.

#### Sat · Community Q  · no link
```text
EV drivers of Threads — what's the most you've ever paid per kWh on a road trip? I'll start: $0.61 at a highway DCFC in California. Genuinely curious where the ceiling is.
```
**Visual:** none.

---

### Week 2 — Educate + show range of use cases

#### Mon · Trip range planner  · `ct=threads_range_planner`
```text
New feature people keep missing: type in your battery size and your real-world mi/kWh, and WattsNear only shows chargers you can actually reach. No more "this one's perfect, oh wait it's 14 miles past my range."
```
**Visual:** screenshot, range planner with unreachable chargers greyed out.

#### Tue · Apartment dweller  · `ct=threads_free_chargers`
```text
No home charger? You're not stuck. The "Free only" filter on WattsNear surfaces free L2s near you — libraries, town halls, some grocery stores, workplace chargers open to the public. One 15 kWh top-up a week is ~$200/yr in free electrons.
```
**Visual:** screenshot, "Free only" filter toggled on.

#### Wed · CarPlay showcase  · `ct=threads_carplay`
```text
WattsNear on CarPlay: tap once, get the nearest cheap charger routed straight to Apple Maps, hands stay on the wheel. Siri works too — "find EV chargers" opens it from the lock screen.

Took me a long weekend to wire up the CarPlay scenes. It's the feature I use most and the one I'm proudest of.

Free on iPhone. iOS 18+.
```
**Visual:** 10-second video. iPhone on dash mount, CarPlay screen visible on car display, driver taps WattsNear icon, list appears, taps cheapest, route launches. No voiceover. Real car.

#### Thu · Listicle  · `ct=threads_weekly_features`
```text
Things WattsNear does that I use every week:
1. Sort the map by price
2. Filter to my connector (NACS for me)
3. "Free only" toggle
4. Range planner before a trip
5. Siri: "Hey Siri, find chargers near me"
6. Widget on home screen with nearest 3
Free. iPhone + CarPlay.
```
**Visual:** 2×3 grid of feature screenshots.

#### Fri · Road trip story  · `ct=threads_roadtrip_story`
```text
Drove the I-5 corridor last month. Prices between Sacramento and LA ranged $0.31–$0.58/kWh at chargers within 5 miles of each other. Sorting by cheapest saved me about $22 on one trip. The app paid for itself, which is funny because it's free.
```
**Visual:** photo from the trip, charger in frame, casual.

#### Sat · Savings flex (road tripper)  · `ct=threads_savings_roadtrip`
```text
If you drive 12,000 mi/yr and your blended public-charging cost drops from $0.42 to $0.30/kWh because you actually see prices before you pull in, that's about $770/yr. WattsNear shows the $/kWh on the map. Free.
```
**Visual:** infographic, single big number ($770).

---

### Week 3 — Social proof, depth, edge cases

#### Mon · NREL data source  · `ct=threads_nrel`
```text
WattsNear pulls from the U.S. DOE NREL Alternative Fueling Station Locator. Same dataset the government uses. 60,000+ public stations, every network, every connector — NACS, CCS, CHAdeMO, J1772, Tesla. I don't run a server. The DOE does the heavy lifting.
```
**Visual:** simple data-flow diagram.

#### Tue · Permissions  · `ct=threads_permissions`
```text
Counted the permissions WattsNear asks for: location (only while in use), and that's it. No notifications, no contacts, no Bluetooth, no motion, no microphone. If you decline location, you can still search by ZIP. That's what an app should feel like.
```
**Visual:** screenshot of the iOS permissions screen.

#### Wed · Every connector  · `ct=threads_connectors`
```text
Drives I've made with WattsNear:
- Model 3 (NACS)
- Lightning loaner (CCS)
- Bolt rental (CCS)
- Leaf (CHAdeMO, yes really)
One app, every plug. Filter to your connector and the irrelevant chargers disappear from the map.
```
**Visual:** connector-type filter screenshot.

#### Thu · vs gas math (viral target)  · `ct=threads_savings_viral`
```text
Quick math nobody runs.

28 mpg gas car, 12,000 mi/yr, $4.20/gal = $1,800/yr in fuel.
Same miles in an EV at 3.5 mi/kWh on a $0.18/kWh home rate = $617/yr.

Difference: $1,183. Every year. Forever.

That's not even counting oil changes, brake pads, and the part where you never visit a gas station again.

I built WattsNear to keep that gap wide. Free on iPhone.
```
**Visual:** split-screen infographic, gas pump $1,800 / outlet $617, big delta number underneath.

#### Fri · Rideshare/delivery  · `ct=threads_rideshare`
```text
If you Uber or DoorDash in an EV, your fuel cost is your margin. $0.10/kWh swings on public DCFC are real money over a 60-hour week. WattsNear sorts by cheapest, filters to fast chargers, shows what each one actually costs. Free. iPhone + CarPlay.
```
**Visual:** screenshot, cheapest DCFC list view.

#### Sat · Community Q  · no link
```text
What's one feature you wish every charging app had? I'm reading every reply. I built WattsNear solo and the roadmap is basically "what real drivers ask for."
```
**Visual:** none.

---

### Week 4 — Reinforce + push the close

#### Mon · Widget showcase  · `ct=threads_widget`
```text
Home-screen widget shows the 3 nearest chargers and their prices. I check it more than the weather app. iOS 18+.
```
**Visual:** home-screen screenshot with widget prominent.

#### Tue · Privacy viral  · `ct=threads_privacy_viral`
```text
Apps I had to make an account for this month to do one small thing:

- parking meter
- rental scooter
- hotel TV
- a charging station's pay terminal

WattsNear has no account. No email. No password. No "sign in with." Open the app, see chargers near you, close the app. Your data never leaves your phone.

I'm tired too. Free on iPhone.
```
**Visual:** none.

#### Wed · Siri demo  · `ct=threads_siri`
```text
"Hey Siri, find EV chargers" → WattsNear opens straight to the map sorted by closest. Works from CarPlay too, hands on the wheel. Took me a long weekend to wire up. Worth it.
```
**Visual:** short video, CarPlay screen, voice command audible.

#### Thu · Free charger savings  · `ct=threads_free_savings`
```text
The "Free only" filter is my favorite thing I built. One free L2 session per week — 15 kWh, ~3 hours while you're at the gym or the library — is ~$200/yr you don't spend. There are more free chargers near you than you think.
```
**Visual:** map zoomed in on a city, free chargers highlighted.

#### Fri · One year of building  · `ct=threads_oneyear`
```text
A year ago I was annoyed at how much I was overpaying for kWh. Today WattsNear is on the App Store, has a CarPlay app, a Siri shortcut, a widget, and zero servers I have to pay for. Free. No account. If you drive electric, give it a shot. apps.apple.com/us/app/wattsnear/id6762151871
```
**Visual:** App Store page screenshot.

#### Sat · Soft re-pin  · `ct=threads_repin`
```text
If you missed it: WattsNear. Closest + cheapest EV chargers, live DOE data, every connector, CarPlay, Siri, widget. Free on iPhone. No account, no tracking. Charge for less. Drive farther. apps.apple.com/us/app/wattsnear/id6762151871
```
**Visual:** clean app icon + tagline card.

---

## 3. Threads engagement playbook

**Hook formulas that work:**
- "I [did specific thing] last week and [unexpected outcome]."
- "Quick math." — people stop for arithmetic
- "Counted the [permissions/steps/taps] in [X]: [number]."
- Flat opinions, no hedging
- Avoid: rhetorical questions, emoji openers, "Excited to share"

**Reply strategy (~20 min/day):**
- EV owners venting about charging — reply with the specific feature that addresses their gripe, no link unless asked.
- New-EV buyers asking "which app" — answer their question first, mention WattsNear once.
- Personal-finance accounts on gas prices — drop the savings math, no link.
- iOS dev / indie-dev accounts — engage on craft, not pitching. Long-tail credibility.
- Avoid replying under named-competitor accounts. Looks predatory.

**Single vs threaded:**
- Single post: 80% of posting. Savings flexes, screenshots, one-liners, hot takes.
- Mini-thread (3–5): the data-source explainer, build story, deep dives. Strongest line as post 1 — most readers stop there.
- Never thread a launch post.

**Visuals — ranked by what converts on Threads:**
1. 5–12s silent screen-recordings — feels native
2. Real iPhone screenshots, lightly cropped
3. Single-number infographics
4. CarPlay-in-dash photos
5. Avoid: text-on-image quote cards, stock photos

**Hashtags:** sparingly. `#EV` `#ElectricVehicle` `#CarPlay` `#iOSApp` `#IndieDev` worth trying. Avoid `#App` `#Tech` `#Launch`.

**Cross-post Threads → Instagram:** on for visual content, off for text-only hot takes and replies.

---

## 4. Tracking

App Store doesn't pass UTMs, but App Store Connect supports campaign tokens.

**Link format:**
```
https://apps.apple.com/us/app/wattsnear/id6762151871?pt=PROVIDER_ID&ct=<token>&mt=8
```

Where:
- `pt` — your provider ID (find in App Store Connect → Users and Access → integration; optional but recommended)
- `ct` — campaign token, max 40 chars, anything you want. Use the `ct=threads_*` tokens listed throughout this plan.
- `mt=8` — media type (8 = software, the App Store)

**Where to read results:** App Store Connect → App Analytics → Sources → Campaigns. Updates within 24–48h.

**The two metrics that matter:**
1. **App Units per `ct` token** — the only number that pays rent.
2. **Page-view → App-Units conversion** — if Threads traffic converts <15%, audience is off or screenshots aren't carrying the close.

**The five vanity metrics to ignore:** follower count, likes, replies-to-likes ratio, impressions in isolation, profile views.

---

## 5. Realistic expectations

| Window | Followers | Impressions | Page views | Downloads |
|---|---|---|---|---|
| Week 1 | +50 to +250 | 3k–15k | 100–400 | 20–80 |
| Month 1 | 200–2000 | 50k–150k | 1.5k–4k | 200–700 |

A single post going viral (>100k impressions) can 5× all of this. Plan for it not to.

**"Good" looks like:** 500 downloads in month 1, >20% page-view → download rate, one post crossing 50k impressions.

---

## Appendix: post inventory (machine-readable)

```yaml
posts:
  - day: w1-mon
    ct: threads_launch
    type: launch
    visual: screen-recording
  - day: w1-tue
    ct: threads_savings_commuter
    type: savings-math
    visual: infographic
  - day: w1-wed
    ct: threads_privacy_intro
    type: privacy
    visual: none
  - day: w1-thu
    ct: threads_cheapest_sort
    type: screenshot
    visual: app-screenshot
  - day: w1-fri
    ct: threads_anti_bloat
    type: comparison
    visual: none
  - day: w1-sat
    ct: none
    type: community-q
    visual: none
  - day: w2-mon
    ct: threads_range_planner
    type: feature
    visual: app-screenshot
  - day: w2-tue
    ct: threads_free_chargers
    type: feature
    visual: app-screenshot
  - day: w2-wed
    ct: threads_carplay
    type: showcase
    visual: video
  - day: w2-thu
    ct: threads_weekly_features
    type: listicle
    visual: screenshot-grid
  - day: w2-fri
    ct: threads_roadtrip_story
    type: story
    visual: real-photo
  - day: w2-sat
    ct: threads_savings_roadtrip
    type: savings-math
    visual: infographic
  - day: w3-mon
    ct: threads_nrel
    type: educational
    visual: diagram
  - day: w3-tue
    ct: threads_permissions
    type: privacy
    visual: ios-screenshot
  - day: w3-wed
    ct: threads_connectors
    type: listicle
    visual: app-screenshot
  - day: w3-thu
    ct: threads_savings_viral
    type: savings-math
    visual: infographic
  - day: w3-fri
    ct: threads_rideshare
    type: persona
    visual: app-screenshot
  - day: w3-sat
    ct: none
    type: community-q
    visual: none
  - day: w4-mon
    ct: threads_widget
    type: feature
    visual: home-screen
  - day: w4-tue
    ct: threads_privacy_viral
    type: privacy
    visual: none
  - day: w4-wed
    ct: threads_siri
    type: showcase
    visual: video
  - day: w4-thu
    ct: threads_free_savings
    type: savings-math
    visual: map
  - day: w4-fri
    ct: threads_oneyear
    type: story
    visual: app-store-screenshot
  - day: w4-sat
    ct: threads_repin
    type: re-pin
    visual: brand-card
```
