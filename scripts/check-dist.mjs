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
};

const expectedFiles = [
  'index.html',
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

// Homepage
const index = html.get('index.html') ?? '';
check(count(index, /<button[^>]*class="card[ "]/g) === 12, 'index.html holds 12 cards', 'the board is incomplete');
check(
  count(index, /<button[^>]*class="card[ "][^>]*disabled/g) === 12 && count(index, /class="card is-up/g) === 4,
  'index.html shows a dealt board without the script: 12 inactive cards, two pairs face up',
  'the picture of the round differs',
);
check(
  count(index, /class="screenshot-trigger"/g) === screenshotNames.length,
  `index.html holds ${screenshotNames.length} screenshot buttons`,
  `found ${count(index, /class="screenshot-trigger"/g)}`,
);
check(
  badges.every((file) => index.includes(`/images/${file}`)),
  'index.html shows the download badge',
  'app-store-download-{black,white}.svg not referenced',
);
check(index.includes('<meta name="apple-itunes-app" content="app-id='), 'index.html has the Smart App Banner tag', 'missing');
for (const id of ['hero', 'highlights', 'screenshots', 'features', 'pricing', 'faq', 'download']) {
  check(index.includes(`id="${id}"`), `index.html has id "${id}"`, 'missing');
}

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
