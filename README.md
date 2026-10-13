# Photo Memo+ website

The source of <https://photo-memo.peterkurzok.de>: the homepage with its playable pairs board, the
privacy policy and the landing page for shared picture sets of the Photo Memo+ app, in English at
`/` and in German at `/de/`. It is an [Astro](https://astro.build) project that builds to static
files; this repository is the only source of the site.

## Requirements

- Node 22.18 or later (`.nvmrc`)
- `npm ci` once after cloning

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Serves the site locally with live reload, by default at <http://localhost:4321/> |
| `npm test` | Runs the unit tests of the game rules in `src/lib/` |
| `npm run build` | Type-checks the project and builds the site into `dist/` |
| `npm run check` | Tests, builds, then verifies `dist/`: expected files, images, links, file sizes |
| `npm run preview` | Serves the built `dist/` locally |
| `npm run check:live -- <base-url>` | Verifies a deployed site against the URL contract below |

Run `npm run check` before pushing. It prints one line per check and fails when a link dangles
or a published file is missing.

## Where content lives

| Content | File |
|---|---|
| Every text of the homepage, navigation and footer | `src/data/en.ts`, `src/data/de.ts` |
| App Store id and address, languages, list of devices and screenshot motifs | `src/data/site.ts` |
| Privacy policy | `src/pages/privacy.md`, `src/pages/de/privacy.md` |
| Redirects | `public/_redirects` |
| Landing page for shared picture sets | `src/pages/s.astro` |
| Universal-link files, response headers | `public/.well-known/apple-app-site-association`, `public/apple-app-site-association`, `public/_headers` |
| 404 page | `src/pages/404.astro` |
| `robots.txt` | `public/robots.txt` |
| Rules of the pairs game, and their tests | `src/lib/pairs.ts`, `src/lib/pairs.test.ts` |
| The board: markup, and the script that connects the rules to the page | `src/components/Board.astro` |
| Markup of a section | `src/components/` |
| Page frame: `<head>`, header, footer | `src/layouts/Base.astro` |
| Styles and colour tokens | `src/styles/site.css` |

A question, a feature text or a footer link is one edit in each language file.

## Two languages

English is at `/`, German at `/de/`. The pages under `src/pages/de/` mirror the English ones, and
every component takes the language as a prop.

- All texts of a language are in one file, `src/data/en.ts` or `src/data/de.ts`. Both satisfy the
  type `Content` in `src/data/site.ts`, so a new text needs a key in the type and an entry in
  both files; the build fails when one is missing.
- Each language shows its own store screenshots, from `src/assets/images/screenshots/en/` and
  `…/de/`.
- Header and footer link to the same page in the other language, and each page names both
  versions for search engines (`hreflang`).
- **The word "Memory" must not appear on the site, in either language.** It is a Ravensburger
  trademark in Germany, and the site is published from a `.de` domain by a German resident. The
  app is "Photo Memo+: Picture Pairs" in English and "Photo Memo+: Fotos & Paare" in German; the
  game is a "pairs game". `npm run check` fails when a built HTML file contains the word. The one
  accepted exception is the card back in `src/assets/images/table/`, which prints it as artwork.

## Editing the privacy policy

The policy is `src/pages/privacy.md` and `src/pages/de/privacy.md`, plain Markdown. When the
wording changes, change both and update the "Last updated" and "Stand" lines at the top of the
texts. All App Store listings link to `/privacy.html`, which `public/_redirects` sends to
`/privacy/`, so both addresses must stay. The imprint is not part of this site: the footer and
the policy link to <https://apps.peterkurzok.de/imprint/>, and the old `/imprint.html` addresses
redirect there.

## Shared picture sets and universal links

The app shares a picture set as `https://photo-memo.peterkurzok.de/s/#…`. On an iPhone with the
app installed the link opens the app; everywhere else it shows `src/pages/s.astro`.

- The page has no navigation, is `noindex`, and carries an English and a German text. Its Open
  Graph tags are static on purpose: messengers build their link preview from them without
  running any script. The one inline script only hands the full address to the Smart App Banner.
- `public/.well-known/apple-app-site-association` is what makes the links open the app. It is
  load-bearing: a change to it changes which links the app receives, and Apple's CDN caches the
  file for up to 24 hours, so a mistake stays live for a day. `public/apple-app-site-association`
  is a second copy with identical content, and `public/_headers` serves both as
  `application/json`. `npm run check` fails when the copies differ or a header rule is missing.

## Images

Originals live in `src/assets/images/` and exist only there.

- They are published unchanged under `/images/…` by `src/pages/images/[...file].ts`.
  `/images/app-icon.png` is linked from outside, so do not rename it.
- The pages show smaller variants that Astro derives from the same originals at build time.
- `screenshots/<language>/` holds the framed store images, one per device and motif:
  `<device>-0<n>-<motif>.jpg`. The devices and motifs are listed in `src/data/site.ts`, and
  `npm run check` fails when a folder holds anything else.
- `photos/01.jpg` to `06.jpg` are the cards of the board, `07.jpg` to `11.jpg` the photos of the
  highlight tiles. Their alt texts are in the language files, in the same order.
- `table/` holds the wood texture and the two card backs of the app.

All of them come from the app repository; `make site-assets SITE=<this folder>` there copies
them here under these names.

No file above 25 MiB may enter the build: Cloudflare Pages rejects it and the whole deployment
fails. `npm run check` fails for such a file.

## Deployment

The Cloudflare Pages project `photo-memory-web` builds the site itself; there is nothing to upload.

- A push to `main` deploys to <https://photo-memo.peterkurzok.de>.
- Any other branch gets a preview at `https://<branch>.photo-memory-web.pages.dev`.
- Build settings in the Cloudflare dashboard (Settings, Builds & deployments): build command
  `npm run build`, build output directory `dist`, environment variable `NODE_VERSION` = `22`
  for production and preview.
- A failed build shows up as the "Cloudflare Pages" check on the commit in GitHub; the log is in
  the Cloudflare dashboard. The live site keeps its last successful deployment.

Check a preview before merging, and production after:

```sh
npm run check:live -- https://<branch>.photo-memory-web.pages.dev
npm run check:live -- https://photo-memo.peterkurzok.de
```

Redirects, the JSON content type of the association files and the trailing-slash redirects are
the work of Cloudflare Pages, so `check:live` reports them as failures against `npm run preview`.

Cloudflare's edge may keep answering for a deleted file from its cache for up to a week.
`check:live` therefore asks for its 404 paths with a query string, which bypasses that cache.

### Rollback

In the Cloudflare dashboard open the Pages project, go to Deployments and choose "Rollback" on
an earlier deployment. That takes effect at once and needs no commit. Follow up by reverting
the offending commit on `main`, so that the next push does not bring the problem back.

The last hand-exported version of the site is the tag `ignite-final`.

## URL contract

These addresses are linked from the app, from App Store Connect or from shared links and must
keep working. `npm run check:live` tests every line.

| Address | Answer |
|---|---|
| `/`, `/de/`, `/privacy/`, `/de/privacy/`, `/s/` | 200 |
| `/privacy`, `/de`, `/de/privacy`, `/s` | 308 to the form with a trailing slash |
| `/privacy.html`, `/de/privacy.html` | 301 to `/privacy/`, `/de/privacy/` |
| `/imprint.html`, `/de/imprint.html` | 301 to `https://apps.peterkurzok.de/imprint/` |
| `/.well-known/apple-app-site-association`, `/apple-app-site-association` | 200 as `application/json`, identical to `public/` |
| `/feed.rss`, `/sitemap.xml`, `/robots.txt` | 200 |
| every file in `src/assets/images/`, under `/images/…`; `/images/app-icon.png` is the link preview of `/s/` | 200, identical bytes |
| anything else | 404 with the 404 page |
