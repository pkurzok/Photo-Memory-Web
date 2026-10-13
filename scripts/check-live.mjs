// Verifies the URL contract of a deployed site.
// Usage: npm run check:live -- https://photo-memo.peterkurzok.de
// Uses Node built-ins only; run it from the repository root, it compares files with
// src/assets/images and public/.
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const base = process.argv[2]?.replace(/\/$/, '');
if (!base) {
  console.log('Usage: npm run check:live -- <base-url>');
  process.exit(1);
}

const imageSource = 'src/assets/images';
const imprint = 'https://apps.peterkurzok.de/imprint/';
const aasaFiles = ['.well-known/apple-app-site-association', 'apple-app-site-association'];

let checks = 0;
let failures = 0;
const report = (ok, label, problem) => {
  checks += 1;
  if (ok) {
    console.log(`✓ ${label}`);
  } else {
    failures += 1;
    console.log(`✗ ${label}   ${problem}`);
  }
};

const get = (pathname) => fetch(base + pathname, { redirect: 'manual' });

try {
  await get('/');
} catch (error) {
  console.log(`✗ ${base} is not reachable: ${error.cause?.message ?? error.message}`);
  process.exit(1);
}

// Answers with `status`; `contentType` and `body` are optional further expectations.
const expectStatus = async (status, pathname, { contentType, body } = {}) => {
  const response = await get(pathname);
  const type = response.headers.get('content-type') ?? '';
  let problem;
  if (response.status !== status) {
    problem = `expected ${status}, got ${response.status}`;
  } else if (contentType && !type.startsWith(contentType)) {
    problem = `expected ${contentType}, got ${type}`;
  } else if (body && !Buffer.from(await response.arrayBuffer()).equals(body)) {
    problem = 'differs from the source file';
  }
  const details = [contentType, body && 'identical bytes'].filter(Boolean).join(', ');
  report(!problem, `${status} ${pathname}${details ? ` (${details})` : ''}`, problem);
  return response;
};

// Redirects with `status` to `target`, a path on the site or an absolute URL.
const expectRedirect = async (status, pathname, target) => {
  const response = await get(pathname);
  const location = response.headers.get('location');
  const resolved = location ? new URL(location, base).href : 'no location';
  const expected = new URL(target, base).href;
  let problem;
  if (response.status !== status) {
    problem = `expected ${status}, got ${response.status}`;
  } else if (resolved !== expected) {
    problem = `expected ${expected}, got ${resolved}`;
  }
  report(!problem, `${status} ${pathname} -> ${target}`, problem);
};

const titleOf = async (pathname) => (await (await get(pathname)).text()).match(/<title>([^<]*)<\/title>/)?.[1];

// Pages
for (const page of ['/', '/de/', '/privacy/', '/de/privacy/', '/s/']) {
  await expectStatus(200, page, { contentType: 'text/html' });
}
for (const [page, expected] of [
  ['/', 'Photo Memo+: Picture Pairs'],
  ['/de/', 'Photo Memo+: Fotos &amp; Paare'],
  ['/privacy/', 'Privacy Policy - Photo Memo+'],
  ['/de/privacy/', 'Datenschutzerklärung - Photo Memo+'],
]) {
  const title = await titleOf(page);
  report(title === expected, `title of ${page}`, `got "${title}"`);
}
const share = await (await get('/s/')).text();
report(
  share.includes('<meta property="og:title" content="A Photo Memo+ picture set"'),
  'og:title of /s/',
  'the static tag is missing',
);

// Technical files
await expectStatus(200, '/feed.rss', { contentType: 'application/rss+xml' });
await expectStatus(200, '/sitemap.xml', { contentType: 'application/xml' });
await expectStatus(200, '/robots.txt');

// Universal links: both association files, as JSON and unchanged
for (const file of aasaFiles) {
  await expectStatus(200, `/${file}`, {
    contentType: 'application/json',
    body: await readFile(path.join('public', file)),
  });
}

// Every image keeps its URL and its bytes; /images/app-icon.png is the one the /s/ preview uses
const images = (await readdir(imageSource, { recursive: true, withFileTypes: true }))
  .filter((entry) => entry.isFile() && /\.(png|jpg|svg)$/.test(entry.name))
  .map((entry) => path.relative(imageSource, path.join(entry.parentPath, entry.name)))
  .sort();
for (const image of images) {
  await expectStatus(200, `/images/${image}`, { body: await readFile(path.join(imageSource, image)) });
}

// Trailing-slash forms
for (const [from, to] of [
  ['/privacy', '/privacy/'],
  ['/de', '/de/'],
  ['/de/privacy', '/de/privacy/'],
  ['/s', '/s/'],
]) {
  await expectRedirect(308, from, to);
}

// Old addresses: the policy, which the App Store listings link to, and the imprint
await expectRedirect(301, '/privacy.html', '/privacy/');
await expectRedirect(301, '/de/privacy.html', '/de/privacy/');
await expectRedirect(301, '/imprint.html', imprint);
await expectRedirect(301, '/de/imprint.html', imprint);

// Unknown paths, including files of the old export. Cloudflare's edge may serve a deleted file
// from its cache for up to a week; the query string asks the deployment itself.
const fresh = `?fresh=${Date.now()}`;
for (const gone of ['/does-not-exist', '/imprint/', '/de/feed.rss', '/css/styles.css']) {
  const response = await expectStatus(404, gone + fresh);
  if (gone === '/does-not-exist') {
    report((await response.text()).includes('Page not found'), '404 answers with the 404 page', 'its text is missing');
  }
}

if (failures > 0) {
  console.log(`${failures} of ${checks} checks failed.`);
  process.exit(1);
}
console.log(`All ${checks} checks passed.`);
