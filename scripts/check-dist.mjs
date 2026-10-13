// Verifies the build output in dist/ against the URL contract of the site.
// Run through `npm run check`; uses Node built-ins only.
import { existsSync } from 'node:fs';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const dist = 'dist';
const imageSource = 'src/assets/images';
const sizeLimit = 25 * 1024 * 1024; // Cloudflare Pages rejects larger files.

const imprint = 'https://apps.peterkurzok.de/imprint/';
const badges = ['black', 'white'].map((tone) => `app-store-download-${tone}.svg`);

// The lists of src/data/site.ts, read from the source so that this script needs no build step.
const siteData = await readFile('src/data/site.ts', 'utf8');
const list = (name) =>
  [...(siteData.match(new RegExp(`export const ${name}[^=]*= \\[([^\\]]*)\\]`))?.[1] ?? '').matchAll(/'([^']+)'/g)].map(
    ([, entry]) => entry,
  );
const langs = list('langs');
const devices = list('devices');
const motifs = list('motifs');
const screenshotNames = devices
  .flatMap((device) => motifs.map((motif, index) => `${device}-0${index + 1}-${motif}.jpg`))
  .sort();

// Each language has its policy; `title` is the heading the page must carry.
const policies = {
  en: { file: 'privacy/index.html', title: 'Privacy Policy' },
  de: { file: 'de/privacy/index.html', title: 'Datenschutzerklärung' },
};
const homeOf = (lang) => (lang === 'en' ? 'index.html' : `${lang}/index.html`);

const expectedFiles = [
  ...langs.map(homeOf),
  ...langs.map((lang) => policies[lang].file),
  'images/app-icon.png',
  ...badges.map((file) => `images/${file}`),
  ...langs.flatMap((lang) => screenshotNames.map((file) => `images/screenshots/${lang}/${file}`)),
];

let failures = 0;
const pass = (message) => console.log(`✓ ${message}`);
const fail = (message) => {
  failures += 1;
  console.log(`✗ ${message}`);
};
const check = (ok, message, problem = '') => (ok ? pass(message) : fail(`${message}   ${problem}`.trimEnd()));

const walk = async (directory) => {
  const entries = await readdir(directory, { recursive: true, withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => path.relative(directory, path.join(entry.parentPath, entry.name)));
};

if (!existsSync(dist)) {
  console.log(`✗ ${dist}/ does not exist; run the build first`);
  process.exit(1);
}

const files = await walk(dist);
const read = (file) => readFile(path.join(dist, file), 'utf8');
const count = (text, pattern) => [...text.matchAll(pattern)].length;

// Expected files
const missing = expectedFiles.filter((file) => !files.includes(file));
check(missing.length === 0, `${expectedFiles.length} expected files are in ${dist}/`, `missing: ${missing.join(', ')}`);

// Images are published unchanged
const changed = [];
for (const file of files.filter((file) => file.startsWith('images/'))) {
  const source = path.join(imageSource, file.slice('images/'.length));
  if (!existsSync(source) || !(await readFile(source)).equals(await readFile(path.join(dist, file)))) changed.push(file);
}
check(changed.length === 0, `every file under ${dist}/images/ is identical to its source`, changed.join(', '));

// The screenshot folder of every language holds exactly devices × motifs
for (const lang of langs) {
  const folder = path.join(imageSource, 'screenshots', lang);
  const found = existsSync(folder) ? (await readdir(folder)).filter((file) => file.endsWith('.jpg')).sort() : [];
  check(
    screenshotNames.length > 0 && found.join() === screenshotNames.join(),
    `${folder}/ holds the ${screenshotNames.length} screenshots of src/data/site.ts and no others`,
    `found: ${found.join(', ') || 'none'}`,
  );
}

// Internal links
const htmlFiles = files.filter((file) => file.endsWith('.html'));
const html = new Map(await Promise.all(htmlFiles.map(async (file) => [file, await read(file)])));
const pageFor = (pathname) => path.join(pathname, pathname.endsWith('/') ? 'index.html' : '').replace(/^\//, '');

let links = 0;
const linkProblems = [];
for (const [file, content] of html) {
  for (const [, , target] of content.matchAll(/\s(href|src|data-full)="([^"]*)"/g)) {
    if (/^([a-z][a-z0-9+.-]*:|\/\/)/i.test(target)) continue; // external
    links += 1;
    const [pathname, fragment] = target.split('?')[0].split('#');
    if (pathname && !pathname.startsWith('/')) {
      linkProblems.push(`${file}: "${target}" is not root-relative`);
      continue;
    }
    const page = pathname ? pageFor(pathname) : file;
    if (!files.includes(page)) {
      const isPage = !path.extname(pathname) && files.includes(pageFor(`${pathname}/`));
      linkProblems.push(
        isPage ? `${file}: "${target}" must end with "/"` : `${file}: "${target}" does not resolve`,
      );
      continue;
    }
    if (fragment && !html.get(page)?.includes(`id="${fragment}"`)) {
      linkProblems.push(`${file}: "${target}" points at a missing id`);
    }
  }
}
linkProblems.forEach(fail);
if (linkProblems.length === 0) pass(`every local link and image resolves (${links} references)`);

// The trademark rule: the word is assembled here, so that searching the repository for it finds
// only the places that explain the rule. The card-back PNG prints it as artwork and is not HTML.
const trademark = new RegExp('mem' + 'ory', 'i');
const named = htmlFiles.filter((file) => trademark.test(html.get(file)));
check(named.length === 0, `no HTML file contains "${'Mem' + 'ory'}"`, `found in ${named.join(', ')}`);

// No trace of the old generator and its framework. The names are assembled here, so that
// searching the repository for them finds nothing either. The ad network the privacy policy
// names shares the first word and is not matched.
const oldGenerator = new RegExp(
  ['ign' + 'ite', 'built with kick' + 'start', 'www\\.kick' + 'start\\.tools', 'data-site-classes', 'boot' + 'strap'].join('|'),
  'i',
);
const textFiles = files.filter((file) => /\.(html|xml|rss|txt|css|js)$/.test(file));
const tainted = [];
for (const file of textFiles) {
  if (oldGenerator.test(await read(file))) tainted.push(file);
}
check(tainted.length === 0, `nothing of the old generator is left in ${textFiles.length} text files`, `found in ${tainted.join(', ')}`);

// File size
const sizes = await Promise.all(files.map(async (file) => (await stat(path.join(dist, file))).size));
const largest = Math.max(...sizes);
check(
  largest <= sizeLimit,
  `no file above 25 MiB (largest: ${(largest / 1024 / 1024).toFixed(1)} MiB)`,
  files[sizes.indexOf(largest)],
);

// Homepage, once per language
for (const lang of langs) {
  const file = homeOf(lang);
  const page = html.get(file) ?? '';
  check(page.includes(`<html lang="${lang}">`), `${file} is marked as "${lang}"`, 'the lang attribute differs');
  check(count(page, /<button[^>]*class="card[ "]/g) === 12, `${file} holds 12 cards`, 'the board is incomplete');
  check(
    count(page, /<button[^>]*class="card[ "][^>]*disabled/g) === 12 && count(page, /class="card is-up/g) === 4,
    `${file} shows a dealt board without the script: 12 inactive cards, two pairs face up`,
    'the picture of the round differs',
  );
  const own = count(page, new RegExp(`data-full="/images/screenshots/${lang}/`, 'g'));
  const all = count(page, /class="screenshot-trigger"/g);
  check(
    own === screenshotNames.length && all === own,
    `${file} holds ${screenshotNames.length} screenshot buttons, all of its own language`,
    `found ${all}, ${own} of them "${lang}"`,
  );
  check(
    badges.every((badge) => page.includes(`/images/${badge}`)),
    `${file} shows the download badge`,
    'app-store-download-{black,white}.svg not referenced',
  );
  check(page.includes('<meta name="apple-itunes-app" content="app-id='), `${file} has the Smart App Banner tag`, 'missing');
  const ids = ['hero', 'highlights', 'screenshots', 'features', 'pricing', 'faq', 'download'];
  const absent = ids.filter((id) => !page.includes(`id="${id}"`));
  check(absent.length === 0, `${file} has its ${ids.length} sections`, `missing: ${absent.join(', ')}`);

  // Every link to a page of the site stays in the language; the language link is the exception.
  if (lang !== 'en') {
    const strays = [...page.matchAll(/<a\s[^>]*>/g)]
      .map(([tag]) => tag)
      .filter((tag) => !tag.includes('hreflang='))
      .map((tag) => tag.match(/href="(\/[^"]*)"/)?.[1])
      .filter((href) => href && !href.startsWith(`/${lang}/`));
    check(strays.length === 0, `${file} links to /${lang}/… for every page of the site`, `found ${strays.join(', ')}`);
  }
}

// hreflang: a page that names its translations names every language, and each target exists
const site = 'https://photo-memo.peterkurzok.de';
const paired = [];
for (const [file, content] of html) {
  const alternates = [...content.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)];
  if (alternates.length === 0) continue;
  const named = alternates.map(([, lang]) => lang);
  const wanted = [...langs, 'x-default'];
  const broken = alternates
    .map(([, , href]) => href)
    .filter((href) => !href.startsWith(site) || !files.includes(pageFor(href.slice(site.length))));
  const ok = wanted.every((lang) => named.includes(lang)) && named.length === wanted.length && broken.length === 0;
  if (ok) paired.push(`/${file.replace(/index\.html$/, '')}`);
  else fail(`${file}: hreflang links name ${named.join(', ')}${broken.length ? `; no page at ${broken.join(', ')}` : ''}`);
}
const expectedPaired = ['/', '/de/', '/privacy/', '/de/privacy/'];
check(
  paired.sort().join() === [...expectedPaired].sort().join(),
  'hreflang links pair / with /de/ and /privacy/ with /de/privacy/',
  `pages with hreflang links: ${paired.join(', ') || 'none'}`,
);

// Privacy policy and imprint
for (const lang of langs) {
  const { file, title } = policies[lang];
  const policy = html.get(file) ?? '';
  check(new RegExp(`<h1[^>]*>${title}</h1>`).test(policy), `${file} carries its title`, `"${title}" missing`);
  check(policy.includes(`href="${imprint}"`), `${file} links to the shared imprint`, 'missing');
}
const oldImprint = htmlFiles.filter((file) => html.get(file).includes('imprint.html'));
check(oldImprint.length === 0, 'no page links to imprint.html', `found in ${oldImprint.join(', ')}`);

if (failures > 0) {
  console.log(`${failures} ${failures === 1 ? 'check' : 'checks'} failed.`);
  process.exit(1);
}
console.log('All checks passed.');
