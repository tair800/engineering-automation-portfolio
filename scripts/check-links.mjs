// Crawl a running build of the site and check every link and image it renders.
//
//   npm run build && npm run start          # in one terminal
//   node scripts/check-links.mjs http://localhost:3000
//
// Pages come from the site's own sitemap. Internal links and images must return 200. External
// links must answer 2xx or 3xx. The free-tier project backends sleep and can take about a minute
// to wake, so external requests get a long timeout and one retry. LinkedIn answers automated
// requests with status 999; that is reported separately rather than counted as broken.

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const EXTERNAL_TIMEOUT_MS = 90_000;
const CONCURRENCY = 4;

async function get(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": "portfolio-link-check/1.0" },
    });
    await response.arrayBuffer().catch(() => undefined);
    return { status: response.status, finalUrl: response.url };
  } catch (error) {
    return { status: 0, error: error.name === "AbortError" ? "timeout" : error.message };
  } finally {
    clearTimeout(timer);
  }
}

async function pool(items, worker) {
  const results = [];
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, items.length) }, async () => {
      while (next < items.length) {
        const item = items[next++];
        results.push(await worker(item));
      }
    }),
  );
  return results;
}

const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]));
if (locs.length === 0) throw new Error("the sitemap lists no pages");
const pages = locs.map((loc) => loc.pathname);
// Canonical and Open Graph URLs point at the production origin; check them against this build.
const canonicalOrigin = locs[0].origin;

const internal = new Set();
const external = new Map();
for (const page of pages) {
  const html = await (await fetch(base + page)).text();
  for (const [, attr, value] of html.matchAll(/\b(href|src)="([^"]+)"/g)) {
    let url = value.replaceAll("&amp;", "&");
    if (url.startsWith(canonicalOrigin)) url = url.slice(canonicalOrigin.length) || "/";
    if (url.startsWith("#") || url.startsWith("data:") || url.startsWith("mailto:")) continue;
    if (url.startsWith("http://") || url.startsWith("https://")) {
      if (!url.startsWith(base)) {
        if (!external.has(url)) external.set(url, new Set());
        external.get(url).add(page);
        continue;
      }
    }
    const resolved = new URL(url, base + page);
    if (attr === "href" || attr === "src") internal.add(resolved.pathname + resolved.search);
  }
}

let failed = 0;
console.log(`Pages from sitemap: ${pages.length}`);

const internalResults = await pool([...internal], async (path) => ({ path, ...(await get(base + path, 15_000)) }));
for (const r of internalResults.sort((a, b) => a.path.localeCompare(b.path))) {
  if (r.status !== 200) {
    failed += 1;
    console.log(`  FAIL internal ${r.status || r.error}  ${r.path}`);
  }
}
console.log(`Internal links and assets: ${internalResults.length} checked`);

const externalResults = await pool([...external.keys()], async (url) => {
  let result = await get(url, EXTERNAL_TIMEOUT_MS);
  if (result.status === 0 || result.status >= 500) result = await get(url, EXTERNAL_TIMEOUT_MS);
  return { url, ...result };
});
const blocked = [];
for (const r of externalResults.sort((a, b) => a.url.localeCompare(b.url))) {
  const ok = r.status >= 200 && r.status < 400;
  if (ok) {
    console.log(`  ok   ${r.status}  ${r.url}`);
  } else if (r.status === 999 && new URL(r.url).hostname.endsWith("linkedin.com")) {
    blocked.push(r.url);
    console.log(`  999  (LinkedIn blocks automated requests)  ${r.url}`);
  } else {
    failed += 1;
    console.log(`  FAIL ${r.status || r.error}  ${r.url}  (on ${[...external.get(r.url)].join(", ")})`);
  }
}
console.log(`External links: ${externalResults.length} checked, ${blocked.length} not checkable, ${failed} failed overall`);
process.exit(failed ? 1 : 0);
