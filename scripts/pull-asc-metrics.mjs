#!/usr/bin/env node
/**
 * Pull App Store Connect attribution metrics for each `ct=` campaign token
 * used in the Threads plan.
 *
 * Status: scaffolded but unimplemented. Apple's App Analytics campaign data
 * sits in a separate report family from the standard Sales report. Pick one
 * of two implementation paths when you fill this in:
 *
 *  A) Sales & Trends Reports API (preferred, official)
 *     POST /v1/salesReports  with parameters:
 *       filter[frequency]=DAILY
 *       filter[reportType]=SALES
 *       filter[reportSubType]=SUMMARY
 *       filter[vendorNumber]=<your vendor #>
 *       filter[reportDate]=YYYY-MM-DD
 *     Response is a gzipped TSV. The campaign token shows up in the
 *     `Provider Country` / `Campaign` columns.
 *
 *  B) App Analytics Reports API (BETA, richer attribution)
 *     POST /v1/analyticsReportRequests
 *     Wait for the report to generate, then download segments. Campaign
 *     attribution lives in the `App Store Discovery and Engagement` report.
 *
 * Both require a JWT signed with an App Store Connect API key:
 *   - Apple Developer → Users and Access → Integrations → App Store Connect API
 *   - Create a key with the "Sales" or "Developer" role
 *   - You get an `.p8` private key file + key ID + issuer ID
 *
 * Required secrets/variables (when implemented):
 *   ASC_KEY_ID             10-char key ID
 *   ASC_ISSUER_ID          UUID issuer ID
 *   ASC_KEY_P8             the contents of the .p8 file (multiline secret)
 *   ASC_VENDOR_NUMBER      8-digit vendor number from Payments & Reports
 *
 * What this script should do once wired up:
 *   1. Generate ES256 JWT (15 min expiry) using ASC_KEY_P8
 *   2. Fetch yesterday's daily report
 *   3. Group App Units by campaign token (the `ct=` values from the plan)
 *   4. Append a row per token to marketing/metrics.csv
 *   5. (Optional) open or update a weekly GitHub issue with the top-3 / bottom-3 tokens
 */

import { existsSync } from 'node:fs';

const {
  ASC_KEY_ID = '',
  ASC_ISSUER_ID = '',
  ASC_KEY_P8 = '',
  ASC_VENDOR_NUMBER = '',
} = process.env;

if (!ASC_KEY_ID || !ASC_ISSUER_ID || !ASC_KEY_P8 || !ASC_VENDOR_NUMBER) {
  console.log('[skip] App Store Connect API credentials not configured.');
  console.log('       See header comment in scripts/pull-asc-metrics.mjs for setup.');
  process.exit(0);
}

// --- JWT generation sketch (uncomment + finish when ready) ---
// import { createPrivateKey, createSign } from 'node:crypto';
// const now = Math.floor(Date.now() / 1000);
// const header = { alg: 'ES256', kid: ASC_KEY_ID, typ: 'JWT' };
// const payload = { iss: ASC_ISSUER_ID, iat: now, exp: now + 900, aud: 'appstoreconnect-v1' };
// const enc = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
// const signingInput = `${enc(header)}.${enc(payload)}`;
// const key = createPrivateKey({ key: ASC_KEY_P8, format: 'pem' });
// const sig = createSign('SHA256').update(signingInput).sign({ key, dsaEncoding: 'ieee-p1363' });
// const jwt = `${signingInput}.${sig.toString('base64url')}`;

console.log('TODO: implement App Store Connect metrics pull. See header comment.');
