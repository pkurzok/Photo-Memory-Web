---
date: 2026-10-13T09:58:37.114532+00:00
git_commit: 13ce1abb3ba4792f412b0fc85e79b69b31e2d72e
branch: main
topic: "Rebuild photo-memo.peterkurzok.de as an Astro site in the Tabletop design"
tags: [plan, astro, redesign, tabletop, i18n, cloudflare-pages, universal-links]
status: ready
---

# PLAN: Rebuild photo-memo.peterkurzok.de as an Astro site in the Tabletop design

The site is a hand-exported Ignite/Bootstrap build committed to this repository and served by
GitHub Pages. It becomes an Astro project with a design of its own, "Tabletop": the app's wooden
table as the hero with a playable pairs board, cream paper sections below, and the new iPhone,
iPhone Duo and iPad store screenshots. It follows the structure of the two sibling sites that were
already migrated (`../Inquizitive-Web`, `../../ws-workshop/TV-Graphs-Web`) and moves to Cloudflare
Pages like them.

## Acceptance Criteria

- `npm run check` builds the site and passes: expected files, links, images, sizes, URL contract.
- `/` (English) and `/de/` (German) show the Tabletop design in light and dark mode, each with its
  own texts and its own localized store screenshots.
- The hero board is a playable 12-card round (flip, move counter, re-deal, win message with the
  App Store badge), usable by keyboard, without flip animation under reduced motion, and a static
  dealt board without JavaScript.
- The screenshot section has tabs for iPhone, iPhone Duo and iPad with five images each and a
  lightbox.
- No HTML file in `dist/` contains the word "Memory" (any case). The card-back PNG, which prints
  it as artwork, is the one accepted exception. The English site is named
  "Photo Memo+: Picture Pairs", the German one "Photo Memo+: Fotos & Paare".
- These keep working on the live domain:
  - `/`, `/de/`, `/privacy/`, `/de/privacy/`, `/s/` answer 200.
  - `/privacy.html` answers 301 to `/privacy/`, `/de/privacy.html` 301 to `/de/privacy/`.
  - `/imprint.html` and `/de/imprint.html` answer 301 to `https://apps.peterkurzok.de/imprint/`.
  - `/.well-known/apple-app-site-association` and `/apple-app-site-association` answer 200 as
    `application/json`, byte-identical to today's files.
  - `/sitemap.xml`, `/robots.txt`, `/feed.rss`, `/images/app-icon.png` answer 200.
  - Anything else answers 404 with the 404 page.
- A shared link `https://photo-memo.peterkurzok.de/s/#…` still opens the installed app after the
  cutover, and `/s/` still has static Open Graph tags and the Smart App Banner script.
- The site is served by Cloudflare Pages from `main`; GitHub Pages is switched off.
- `README.md` here and `docs/website.md` in the app repository describe the new workflow.

## Technical Key Decisions and Tradeoffs

1. **Design:** Tabletop: wood hero, cream paper sections, card-shaped tiles.
   - Why: the table and the cards are the product's identity; `Screenshots/EasyFrame.json` in the
     app repository already rules out a generic gradient look for the same reason.
   - Impact: `src/styles/site.css` is written for this site. Component structure, data file,
     image route and check scripts are taken over from `../Inquizitive-Web`.
2. **Hosting:** a new Cloudflare Pages project `photo-memory-web`.
   - Why: real 301s via `_redirects`, a JSON content type for the association files via
     `_headers`, branch previews, dashboard rollback; DNS for `peterkurzok.de` is already on
     Cloudflare.
   - Impact: the owner creates the project and attaches the domain. The cutover order in Phase 4
     keeps GitHub Pages serving `main` until the new deployment is verified.
3. **Languages:** English at `/`, German at `/de/`, as plain page folders.
   - Why: today's URLs; the de-DE App Store listing links to `/de/`. Two languages do not need
     Astro's i18n routing.
   - Impact: `src/data/en.ts` and `src/data/de.ts` share one `Content` type; every component takes
     a `lang` prop; pages under `src/pages/de/` mirror the English ones.
4. **Hero board:** a real game with six demo photos, the `Wood-1` table and the app's card-back
   PNG, unchanged, in both languages.
   - Why: owner's decision. The card back prints "Photo Memory"; the trademark exposure is
     already tracked as an app-side open item and is not addressed here.
   - Impact: game rules live in a pure module `src/lib/pairs.ts` with unit tests; the component
     wires it to the DOM. The "Memory" check covers HTML only.
5. **Screenshots:** the framed, captioned store images, per language, behind device tabs.
   - Why: real Apple bezels and localized captions at no extra cost. The old rule "raw captures
     only, the framed ones would put English text on a German page" no longer applies, because
     `/de/` shows the de-DE set.
   - Impact: 30 JPGs (15 per language, about 24 MB together) are committed under
     `src/assets/images/screenshots/{en,de}/`.
6. **Imprint:** the shared page `https://apps.peterkurzok.de/imprint/`.
   - Why: one copy to maintain, and it already cites § 5 DDG and § 18 MStV.
   - Impact: two redirects; footer and privacy policy link there; the policy's reference to
     "§ 5 TMG" becomes "§ 5 DDG" and its "Last updated" line gets the date of that edit.
7. **Privacy policy source:** Markdown in this repository.
   - Why: this repository becomes the only source of the site, as for the siblings. No Kickstart
     step remains.
   - Impact: `docs/website/privacy-policy-{en,de}.md` in the app repository are deleted and
     `docs/website.md` there points here.
8. **Asset hand-over:** `make site-assets SITE=<folder>` in the app repository.
   - Why: screenshots, demo photos, table texture, card back and icon are produced there; a
     scripted copy keeps names and the file list stable. Same pattern as Inquizitive's
     `make press-kit SITE=`.
   - Impact: one script and one Makefile target in the app repository. Phase 1 copies the files
     by hand with the same names; Phase 4 adds the target that reproduces that copy.
9. **No press kit page.**
   - Why: the current site has none and it was not requested.
   - Impact: none. It can be added later the way the siblings did.
10. **Old asset URLs are dropped:** `/images/screenshots/*-framed.png`, the Bootstrap `css/`,
    `js/`, `fonts/` folders, `/de/feed.rss`, `/de/sitemap.xml`, `/de/robots.txt`.
    - Why: nothing in the app repository or the store metadata links to them.
    - Impact: they answer 404 after the cutover. `/images/app-icon.png` stays, because the `/s/`
      link preview uses it.
11. **Game script is a processed Astro `<script>`, not `is:inline`.**
    - Why: it imports the tested module. The small carousel, tab and lightbox scripts stay
      `is:inline` like in the siblings.
    - Impact: Astro may emit one script file under `/_astro/`; the siblings' check "index.html
      loads no script file" is not taken over.

## Current State

```
Photo-Memory-Web (main)  ──►  GitHub Pages, legacy build from /  ──►  photo-memo.peterkurzok.de
├─ index.html              English home, Ignite v0.6.0 export + Bootstrap
├─ de/                     full German copy with its own css/, js/, fonts/, images/
├─ privacy/index.html      policy; privacy.html is a meta-refresh stub (same under de/)
├─ imprint.html, de/imprint.html     hand-written, cite § 5 TMG
├─ s/index.html            shared-set landing page: EN + DE, noindex, static OG, banner script
├─ .well-known/apple-app-site-association, apple-app-site-association   (identical, 141 bytes)
├─ CNAME, .nojekyll, robots.txt, sitemap.xml, feed.rss
└─ css/ js/ fonts/ images/           export output; 10 framed PNGs from August
```

- The home page has seven sections: hero, screenshot carousel with ten Bootstrap modals, five
  highlights, nine features, Free vs Pro, ten questions, download band (`index.html:56-475`).
- There is no source in this repository. The site is authored in the Kickstart app and exported by
  hand; `../Photo-Memory-iOS/docs/website.md` is the runbook, including three per-export fixes.
- GitHub Pages serves the association file as `application/octet-stream`.
- All fourteen App Store localizations use `/privacy.html` as privacy URL; the de-DE listing uses
  `/de/` as marketing URL (`../Photo-Memory-iOS/docs/website.md:242-253`).
- New imagery is in `../Photo-Memory-iOS/Screenshots/` (generated, gitignored):
  `screenshots/<locale>/{iPhone,iPad,Duo}-NN-<Motif>.jpg` at 1320×2868, 2064×2752 and 1398×2034;
  `assets/demo-photos/01…20.jpg` (640×640, CC0, no recognisable faces).
- App assets used by the hero: `Photo Memory/Assets.xcassets/Backgrounds/Wood-1.imageset/Wood-1~iphone@3x.jpeg`
  (2304×3456), `CardBack.imageset/CardBack~universal@3x.png` and `CardBack-Dark~universal@3x.png`,
  `AppIcon.appiconset/ios-marketing.png`.

Current home page:

```
┌──────────────────────────────────────────────┐
│ Photo Memo+   Screenshots Features Questions │
│               Imprint Deutsch [Download]     │
│                  [app icon]                  │
│        Photo Memo+: Picture Pairs            │
│   Not stock animals. Your family. The …      │
│            [ App Store badge ]               │
│  ◀ ten framed PNGs in a scroll row ▶         │
│  five text cards · nine icon cards           │
│  Free | Pro €1.99                            │
│  ten accordion questions                     │
│  Ready to play…  [ App Store badge ]         │
│  Privacy Policy · © · Built with Kickstart   │
└──────────────────────────────────────────────┘
```

## Desired End State

```
Photo-Memory-Web (main)  ──►  Cloudflare Pages `photo-memory-web`  ──►  photo-memo.peterkurzok.de
   npm run build → dist/          (other branches → <branch>.photo-memory-web.pages.dev)

../Photo-Memory-iOS   make site-assets SITE=../Photo-Memory-Web   ──►  src/assets/images/
```

Home page, identical structure in both languages:

```
╔══════════════════════════════════════════════╗
║▒ ( Photo Memo+ )   ( Screenshots Features    ║  header: two translucent capsules on the
║▒                     Questions Deutsch [Get])║  wood, echoing the app's toolbar
║▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Wood-1 texture ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒║
║▒  Not stock animals.     ┌──┐ ┌──┐ ┌──┐ ┌──┐ ║
║▒  Your family.           │ph│ │//│ │//│ │ph│ ║  12 cards, 4×3 from 48rem up,
║▒                         └──┘ └──┘ └──┘ └──┘ ║  3×4 below (the app's phone layout)
║▒  The classic pairs      ┌──┐ ┌──┐ ┌──┐ ┌──┐ ║
║▒  board, built from the  │//│ │ph│ │ph│ │//│ ║  // = the app's card back
║▒  photos already on      └──┘ └──┘ └──┘ └──┘ ║
║▒  your iPhone. Free …    ┌──┐ ┌──┐ ┌──┐ ┌──┐ ║
║▒  [ App Store badge ]    │//│ │//│ │//│ │//│ ║
║▒                         └──┘ └──┘ └──┘ └──┘ ║
║▒                        (Moves: 3) (↻ Deal)  ║  capsules like the app's "Moves" pill
╠══════════════════════════════════════════════╣
║ paper                                        ║
║  Why families keep playing it                ║
║  ╭──────╮ ╭──────╮ ╭──────╮ ╭──────╮ ╭──────╮║  five tiles, each a demo photo with the
║  │photo │ │photo │ │photo │ │photo │ │photo │║  card's corner radius, tilted ±1.5°,
║  │Faces │ │Grand-│ │Never │ │Two to│ │Plane,│║  title and text below
║  ╰──────╯ ╰──────╯ ╰──────╯ ╰──────╯ ╰──────╯║
║                                              ║
║  See it with your own photos                 ║
║  [ iPhone ] [ iPhone Duo ] [ iPad ]          ║  tabs; one row of five per device
║  ◀ ╭────╮ ╭────╮ ╭────╮ ╭────╮ ╭────╮ ▶      ║  tap opens the lightbox
║                                              ║
║  What you get            nine icon tiles     ║
║  Free to play. Pro when you want more.       ║
║  (already bought it? sentence)               ║
║  ┌ Free ───────┐ ┌ Pro €1.99 · Recommended ┐ ║
║  └─────────────┘ └─────────────────────────┘ ║
║  Questions   ▸ ten <details>                 ║
╠══════════════════════════════════════════════╣
║▒▒ Ready to play with your own photos? ▒▒▒▒▒▒▒║  wood band
║▒▒            [ App Store badge ]       ▒▒▒▒▒▒║
╠══════════════════════════════════════════════╣
║ tagline · Privacy Policy · Imprint · More    ║
║ Apps · Deutsch · © 2026 Peter Kurzok         ║
╚══════════════════════════════════════════════╝
```

After the last pair the two capsules under the board are replaced by a panel:

```
╭──────────────────────────────╮
│ All pairs in 9 moves.        │
│ Now try it with your photos. │
│ [ App Store badge ] (↻ Deal) │
╰──────────────────────────────╯
```

Design tokens (`:root` in `src/styles/site.css`):

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--slate` | `#637B90` | `#8FA5B8` | accent, tab underline, Pro badge, icons |
| `--paper` | `#F4F1E8` | `#1F1E1D` | page background |
| `--paper-raised` | `#FFFFFF` | `#2B2A29` | tiles, pricing cards, lightbox |
| `--cream` | `#E2DED1` | `#3A3836` | borders, alternate section |
| `--ink` | `#2B2B2C` | `#F0EDE4` | body text |
| `--ink-muted` | `#5A5557` | `#B5AFA6` | secondary text |
| `--wood-ink` | `#2A1B0C` | `#F4F1E8` | text on the wood |
| `--wood-shade` | `transparent` | `rgba(0,0,0,.55)` | overlay on the texture |
| `--card-radius` | `18%` | same | photo cards and tiles |

- System font stack, as in the siblings. Headings 700, tight tracking, `text-wrap: balance`.
- Links on paper use `color-mix(in srgb, var(--slate) 65%, black)` in light mode: plain slate on
  `--paper` is below 4.5:1.
- Dark appearance follows `prefers-color-scheme`. The wood stays wood, darkened by `--wood-shade`;
  face-down cards use `CardBack-Dark`.
- Motion: one card-flip (`rotateY`, 350 ms) and the tile tilt on hover. Under
  `prefers-reduced-motion: reduce` the flip is an instant swap and the tilt is off.

File tree after the work:

```
.gitignore  .nvmrc  README.md  astro.config.mjs  package.json  package-lock.json  tsconfig.json
docs/agents/plans/2026-10-13-astro-tabletop-redesign.md
public/
  .well-known/apple-app-site-association     apple-app-site-association
  _headers  _redirects  robots.txt
scripts/
  check-dist.mjs  check-live.mjs
src/
  assets/images/
    app-icon.png
    app-store-download-black.svg  app-store-download-white.svg
    table/wood-1.jpg  table/card-back.png  table/card-back-dark.png
    photos/01.jpg … 11.jpg
    screenshots/en/{iphone,duo,ipad}-0N-<motif>.jpg     (15)
    screenshots/de/{iphone,duo,ipad}-0N-<motif>.jpg     (15)
  components/
    Home.astro  Header.astro  Footer.astro  Hero.astro  Board.astro  Highlights.astro
    Screenshots.astro  Lightbox.astro  Features.astro  Pricing.astro  Faq.astro
    Download.astro  StoreBadge.astro  Icon.astro
  data/  site.ts  en.ts  de.ts
  layouts/  Base.astro  Prose.astro
  lib/  pairs.ts  pairs.test.ts
  pages/
    index.astro  privacy.md  s.astro  404.astro
    de/index.astro  de/privacy.md
    feed.rss.ts  sitemap.xml.ts  images/[...file].ts
  styles/site.css
```

## Abstractions and Code Reuse

Taken over from `../Inquizitive-Web` and adapted (copy the file, then change what is listed):

- `src/pages/images/[...file].ts` - unchanged. Publishes `src/assets/images/**` under `/images/…`.
- `src/pages/sitemap.xml.ts`, `src/pages/feed.rss.ts` - unchanged apart from the data import.
- `src/layouts/Base.astro` - gains `lang` and `alternate` props (see Phase 1 and 2).
- `src/layouts/Prose.astro` - passes `lang` from the frontmatter to `Base`.
- `src/components/Lightbox.astro`, `StoreBadge.astro`, `Faq.astro`, `Icon.astro` - `lang` prop
  where they print text; `StoreBadge` loses the launch-status logic (the app is released).
- `src/pages/s.astro` - texts and app id of this app.
- `scripts/check-dist.mjs`, `scripts/check-live.mjs` - same reporting helpers (`check`, `pass`,
  `fail`, `expectStatus`, `expectRedirect`); the lists of files, redirects and pages are this
  site's; press and launch-status checks are removed.
- `README.md` - same sections, this site's content.

New for this site:

- `src/data/`
  - `site.ts` - language-independent facts and helpers.
    - `app` - `{ name: 'Photo Memo+', appStoreId: '1607756335', appStoreUrl, author, email }`;
      `name` is what `feed.rss.ts` and `og:site_name` print, page titles use `content[lang].name`
    - `Lang`, `langs` - `'en'` only in Phase 1, `'en' | 'de'` from Phase 2
    - `Content` - the type both language files satisfy (see Phase 1)
    - `content: Record<Lang, Content>`
    - `localePath(lang, path)` - `'/privacy/'` → `'/de/privacy/'` for German
    - `devices` - `['iphone', 'duo', 'ipad']`, `motifs` - the five file-name motifs
    - `pages` - the four paths of the sitemap
  - `en.ts`, `de.ts` - all texts of one language, typed as `Content`.
- `src/lib/pairs.ts` - the rules of the game without any DOM access.
  - `deal(pairCount, random)` - shuffled list of card ids, each pair id twice
  - `initial(cards)` - `State { cards, faceUp: number[], matched: Set<number>, moves, locked }`
  - `flip(state, index)` - next state; ignores locked boards, matched and face-up cards; the
    second card of a turn increments `moves` and either matches or sets `locked`
  - `settle(state)` - turns a mismatched pair back and unlocks
  - `isWon(state)`
- `src/components/Board.astro` - renders the 12 cards on the server in a fixed deal, then its
  script takes over (Phase 1).
- `src/components/Home.astro` - the home page for one language; both `index.astro` files render it.
- `src/components/Highlights.astro`, `Pricing.astro` - sections the siblings do not have.
- `src/styles/site.css` - the Tabletop tokens and all section styles.

In `../Photo-Memory-iOS` (Phase 4):

- `scripts/site-assets.sh` - copies and renames the files listed in Phase 1 into `$SITE`.
- `Makefile` - target `site-assets`.
- `docs/website.md` - rewritten.
- `docs/website/privacy-policy-en.md`, `privacy-policy-de.md` - deleted.

## Logging & Observability

The site has no runtime logging. Its observability is the two check scripts, one line per check:

```
$ npm run check
✓ expected files are in dist/
✓ both association files have the same content
✓ _headers serves both association files as application/json
✓ _redirects holds the four old addresses
✓ every local link and image resolves (212 references)
✓ every screenshot of src/data is in src/assets/images/screenshots/ and the other way round
✓ no HTML file contains "Memory"
✓ nothing of the old generator is left
✓ no file above 25 MiB (largest: 1.5 MiB)
✓ hreflang links pair / with /de/ and /privacy/ with /de/privacy/
✓ s/index.html is noindex, has static og tags and the banner script
```

```
$ npm run check:live -- https://photo-memory-web.pages.dev
✓ 200 /
✓ 200 /de/
✓ 301 /privacy.html -> /privacy/
✓ 301 /imprint.html -> https://apps.peterkurzok.de/imprint/
✓ 200 /.well-known/apple-app-site-association (application/json, identical bytes)
…
```

Both scripts exit with 1 when a line starts with `✗`.

## Implementation

Work on a branch `astro` of this repository. `main` keeps the old export, and with it the live
site, until Phase 4.

### Phase 1: Astro project and English home page in the Tabletop design

Dependencies: None

The repository becomes an Astro project whose `/` is the complete English home page: wood hero
with the playable board, highlights, screenshot tabs with lightbox, features, pricing, questions,
download band, footer.

**Tasks**:
- [x] Tag the last export: `git tag ignite-final 13ce1ab` (pushed in Phase 4).
- [x] Create branch `astro` and delete the export from it: `index.html`, `imprint.html`,
  `privacy.html`, `privacy/`, `s/`, `de/`, `css/`, `js/`, `fonts/`, `images/`, `feed.rss`,
  `sitemap.xml`, `robots.txt`, `CNAME`, `.nojekyll`. Keep `.well-known/` and
  `apple-app-site-association` until Phase 3 moves them; keep the two
  `app-store-download-*.svg` files by moving them to `src/assets/images/`. The old
  `images/app-icon.png` and `images/favicon.png` are deleted: the icon comes from the app
  repository (see the copy task below) and `Base.astro` derives the favicon from it.
- [x] Add `package.json`, `.nvmrc` (`22`), `tsconfig.json`, `.gitignore` and `astro.config.mjs`
  from `../Inquizitive-Web`, with name `photo-memory-web`, `site: 'https://photo-memo.peterkurzok.de'`,
  `engines.node` `>=22.18` and one more script:
  ```json
  "test": "node --test \"src/lib/*.test.ts\"",
  "check": "npm test && npm run build && node scripts/check-dist.mjs"
  ```
- [x] Copy the image sources from `../Photo-Memory-iOS` into `src/assets/images/` under these
  names (all lower case; this list is the contract for `site-assets.sh` in Phase 4):
  - `Screenshots/screenshots/en-US/{iPhone,Duo,iPad}-0N-<Motif>.jpg` →
    `screenshots/en/{iphone,duo,ipad}-0N-<motif>.jpg`, motifs `photos`, `selection`, `players`,
    `sizes`, `highscores`
  - `Screenshots/assets/demo-photos/01.jpg … 11.jpg` → `photos/01.jpg … 11.jpg`
  - `Photo Memory/Assets.xcassets/Backgrounds/Wood-1.imageset/Wood-1~iphone@3x.jpeg` →
    `table/wood-1.jpg`
  - `Photo Memory/Assets.xcassets/CardBack.imageset/CardBack~universal@3x.png` →
    `table/card-back.png`, `CardBack-Dark~universal@3x.png` → `table/card-back-dark.png`
  - `Photo Memory/Assets.xcassets/AppIcon.appiconset/ios-marketing.png` → `app-icon.png`
- [x] Add `src/pages/images/[...file].ts` from the sibling, unchanged.
- [x] Write `src/data/site.ts` with `app`, `Lang` (for now `'en'` only, so that
  `content: Record<Lang, Content>` type-checks before `de.ts` exists), `langs`, `localePath`,
  `devices`, `motifs`, `pages` (for now `['/', '/privacy/']`) and the `Content` type:
  ```ts
  export type Content = {
    name: string;                 // "Photo Memo+: Picture Pairs"
    shortName: string;            // "Photo Memo+"
    description: string;          // meta description
    nav: { label: string; href: string }[];
    navCta: string;
    otherLanguage: { label: string; lang: Lang };
    hero: { title: string; subtitle: string; badgeAlt: string };
    board: {
      label: string;              // accessible name of the board
      moves: string;              // "Moves"
      deal: string;               // "Deal again"
      faceDown: string;           // "Card {n}, face down"
      won: string;                // "All pairs in {n} moves."
      wonCta: string;             // "Now try it with your photos."
      photos: string[];           // six alt texts, in file order 01…06
    };
    highlights: { title: string; items: { title: string; text: string; photoAlt: string }[] };
    screenshots: {
      title: string; description: string;
      deviceLabels: Record<Device, string>;
      captions: Record<Motif, string>;   // alt text and lightbox heading
      previous: string; next: string; close: string;
    };
    features: { title: string; items: { icon: string; title: string; text: string }[] };
    pricing: { title: string; description: string; oneTime: string; recommended: string;
               tiers: { name: string; text: string; price: string; highlighted?: boolean }[] };
    faq: { title: string; items: { question: string; answer: string }[] };
    download: { title: string; text: string };
    footer: { tagline: string; links: { label: string; href: string }[]; copyright: string };
    privacyTitle: string; notFound: { title: string; text: string; home: string };
  };
  ```
- [x] Write `src/data/en.ts`. Take every text verbatim from the current `index.html`
  (hero subtitle, five highlights, nine features, pricing, ten questions, download band, footer
  tagline). New texts: hero title "Not stock animals. Your family." with the subtitle shortened to
  start at "The classic pairs board…"; `description` "Photo Memo+: Picture Pairs is the classic
  pairs game built from the photos on your iPhone. Free to play, no account, works offline.";
  screenshot captions from the `en-US` headlines in `../Photo-Memory-iOS/Screenshots/EasyFrame.json`;
  alt texts for photos 01…11, written after looking at each photo. Footer links: Privacy Policy
  (`/privacy/`), Imprint (`https://apps.peterkurzok.de/imprint/`), More Apps
  (`https://apps.peterkurzok.de`). No "Built with Kickstart" link and no testimonials.
- [x] Write `src/lib/pairs.ts` (`deal`, `initial`, `flip`, `settle`, `isWon`) and
  `src/lib/pairs.test.ts` with `node:test`. Node runs the TypeScript files directly, so the test
  imports `./pairs.ts` with the extension, and `pairs.ts` imports nothing from the project and
  uses no enums or parameter properties:
  - `deal(6, rng)` returns 12 ids, each of 0…5 exactly twice
  - flipping one card turns it face up and leaves `moves` at 0
  - flipping the same card twice changes nothing
  - a matching second card adds both to `matched`, clears `faceUp`, `moves` is 1, not locked
  - a non-matching second card sets `locked`, `moves` is 1; `flip` is ignored while locked;
    `settle` clears `faceUp` and unlocks
  - a matched card is ignored
  - `isWon` is true exactly when all 12 are matched
- [x] Write `src/styles/site.css`: the tokens of the table above, base styles, and the styles of
  every section below. The wood is one background image on `.hero` and `.download-section`
  (generated with `getImage` at 1600 px wide as WebP, passed in as a CSS variable from
  `Base.astro`), `background-size: cover`, with `--wood-shade` laid over it.
- [x] Write `src/layouts/Base.astro` from the sibling's, with props `lang` (default `'en'`),
  `title`, `description`, `path`, `noindex`, `nav`, `image`, `card`. `<html lang={lang}>`;
  default link-preview image `/images/screenshots/<lang>/iphone-01-photos.jpg`; the
  `apple-itunes-app` tag with `app.appStoreId`.
- [x] Write `src/components/Header.astro`: brand capsule and navigation capsule over the wood;
  below 48rem the navigation collapses behind a `nav-toggle` button with an inline script, as
  in the sibling's header.
- [x] Write `src/components/StoreBadge.astro`: link to `app.appStoreUrl` with the black and the
  white download badge and an `alt` prop.
- [x] Write `src/components/Board.astro`:
  - Markup: `<div class="board" role="group" aria-label={board.label}>` with 12
    `<button class="card" data-pair={id} disabled>`, each holding a back face (card-back image
    with `alt=""`, light and dark variant) and a front face (`<Image>` of the photo at 320 px). The server
    renders a fixed deal with two pairs showing their photo (`.is-up`), so the page shows a board
    in play without JavaScript. Below it a `<p class="board-status" aria-live="polite">`, the
    capsules "Moves: 0" and "Deal again", and the hidden win panel with a `StoreBadge`; all three
    carry `hidden` in the markup.
  - Script (processed `<script>`, imports `../lib/pairs`): on load it deals with `Math.random`,
    reorders the buttons to the deal, turns all cards face down, removes `disabled` and `hidden`.
    A click calls `flip`; when the state is `locked` it calls `settle` after 900 ms. After each
    change it sets `.is-up`/`.is-matched`, each button's `aria-label` (the photo's alt text when
    face up, `faceDown` with its number otherwise), the move count and, when `isWon`, shows the
    win panel and writes `won` into the status line. "Deal again" starts over.
  - The texts and alt texts reach the script as `data-` attributes on `.board`.
- [x] Write `src/components/Hero.astro`: title, subtitle, `StoreBadge` on the left, `Board` on the
  right; stacked below 48rem with the board second.
- [x] Write `src/components/Highlights.astro`: five tiles, each with photo 07…11 at 480 px.
- [x] Write `src/components/Screenshots.astro`: a `role="tablist"` with three tabs and three
  `role="tabpanel"` rows, built from `devices` × `motifs` via
  `import.meta.glob('../assets/images/screenshots/*/*.jpg', { eager: true })`; a missing file
  throws with its name. Thumbnails via `<Image>` (600 px wide for iPhone and Duo, 800 px for
  iPad); each is a `.screenshot-trigger` button with `data-full="/images/screenshots/<lang>/<file>"`
  and `data-alt`. The iPhone panel is visible without JavaScript; the inline script switches
  panels (`hidden`, `aria-selected`, arrow keys) and drives the two scroll arrows of the visible
  panel.
- [x] Add `src/components/Lightbox.astro` from the sibling, with the close label from `content`.
- [x] Write `src/components/Icon.astro` from the sibling's and add the missing paths from
  Bootstrap Icons 1.11 (MIT): `images`, `collection`, `grid-3x3-gap-fill`, `arrow-repeat`,
  `palette-fill`, `people-fill`, `volume-up-fill`, `phone-fill`, `shield-lock-fill`.
- [x] Write `src/components/Features.astro`, `Pricing.astro`, `Faq.astro` (from the sibling),
  `Download.astro` and `Footer.astro`.
- [x] Write `src/components/Home.astro` (prop `lang`) rendering `Base` with all sections in the
  order of the mockup, and `src/pages/index.astro` rendering `<Home lang="en" />`.
- [x] Add `src/layouts/Prose.astro` from the sibling, reading `lang` from the frontmatter, and
  `src/pages/privacy.md` from `../Photo-Memory-iOS/docs/website/privacy-policy-en.md` with
  frontmatter (`layout`, `lang`, `title` "Privacy Policy", `description`, `path`). In the text the
  imprint link becomes `https://apps.peterkurzok.de/imprint/`, "§ 5 TMG" becomes "§ 5 DDG", and
  the "Last updated" line gets the date of this edit.
- [x] Write `scripts/check-dist.mjs` with the helpers of the sibling's and these checks:
  `dist/index.html` and `dist/privacy/index.html` exist; the policy has its title and links to
  the shared imprint; no page links to `imprint.html`; every local `href`, `src` and `data-full` resolves to a file in
  `dist/`; the screenshot files in `src/assets/images/screenshots/en/` are exactly
  `devices` × `motifs`; no HTML file matches `/memory/i`; no text file matches the sibling's
  `oldGenerator` pattern, taken over verbatim (it matches the generator's footer link and class
  names, not the word "Kickstart" alone, which the privacy policy legitimately contains); no file above 25 MiB; `index.html` holds 12 `.card` buttons, 15
  `.screenshot-trigger` buttons, the download badge and the `apple-itunes-app` tag.
- [x] Write the first version of `README.md`: requirements, commands, where content lives, images.

**Automated Verification**:
- [x] `npm ci` succeeds.
- [x] `npm test` passes all cases of `src/lib/pairs.test.ts`.
- [x] `npm run build` reports 0 errors, 0 warnings and 0 hints from `astro check`.
- [x] `npm run check` prints no `✗` line.
- [x] `git ls-files | grep -E '^(css|js|fonts|de)/|^index\.html$|^CNAME$'` prints nothing.

**Manual Verification**:
- [ ] `npm run dev`, open `http://localhost:4321/`: the page matches the mockup in light and dark
  appearance, at phone width (390 px) and desktop width; the text on the wood is easy to read in
  both.
- [ ] Play a round with the mouse and one with the keyboard only (Tab, Enter): pairs stay up,
  mismatches turn back, the counter counts turns, the win panel appears, "Deal again" starts a
  new round.
- [ ] With "Reduce motion" on, cards change without the flip. With JavaScript off, the board
  shows a dealt position and the rest of the page works.
- [ ] The three device tabs switch, the arrows scroll, and a tap opens the full image.

### Phase 2: German home page at /de/

Dependencies: Phase 1

`/de/` shows the same page with German texts and the de-DE screenshots; the two languages link to
each other for visitors and for search engines.

**Tasks**:
- [x] Copy `Screenshots/screenshots/de-DE/*.jpg` from `../Photo-Memory-iOS` to
  `src/assets/images/screenshots/de/` with the lower-case names of Phase 1.
- [ ] Write `src/data/de.ts`, typed as `Content`. Take the texts verbatim from the current
  `de/index.html` (`git show main:de/index.html`); name "Photo Memo+: Fotos & Paare"; hero title
  "Keine Tiere von der Stange. Deine Familie."; captions from the `de-DE` headlines in
  `EasyFrame.json`; German alt texts for the eleven photos; footer links Datenschutzerklärung
  (`/de/privacy/`), Impressum, Weitere Apps. The word "Memory" appears nowhere.
- [ ] In `src/data/site.ts` widen `Lang` to `'en' | 'de'`, add `'de'` to `langs`, register
  `de.ts` in `content`, extend `pages` to `['/', '/de/', '/privacy/', '/de/privacy/']`, and add
  `src/pages/de/index.astro` rendering `<Home lang="de" />`.
- [ ] Add `src/pages/de/privacy.md` from `privacy-policy-de.md` in the app repository, with the
  same frontmatter (`lang: de`, `title` "Datenschutzerklärung") and the same three edits as the
  English policy (imprint link, "§ 5 DDG", the "Stand" date).
- [ ] `Base.astro`: add the prop `alternate` (default true). When set, emit
  `<link rel="alternate" hreflang="en|de|x-default">` for the page's path in both languages
  (`x-default` is the English one), and `og:locale` `en_GB` or `de_DE`.
- [ ] `Header.astro` and `Footer.astro`: the language link from `otherLanguage`, pointing to the
  same page in the other language, with `lang` and `hreflang` attributes. Section links and the
  brand link go through `localePath`.
- [ ] `check-dist.mjs`: `dist/de/index.html` and `dist/de/privacy/index.html` exist and have
  `<html lang="de">`; the German policy has its title and links to the shared imprint; the `de`
  screenshot folder is complete; every page with hreflang links names both languages and each
  target exists; `dist/de/index.html` links to `/de/…` for every local page link.
- [ ] `README.md`: section "Two languages": where the texts are, the rule about the word "Memory"
  and why (Ravensburger trademark in Germany), and that a new text needs both files.

**Automated Verification**:
- [ ] `npm run build` reports 0 errors: a key missing in `de.ts` fails the type check.
- [ ] `npm run check` prints no `✗` line, including "no HTML file contains "Memory"" and the
  hreflang check.
- [ ] `grep -o 'screenshots/de/' dist/de/index.html | wc -l` is at least 15 and
  `grep -o 'screenshots/en/' dist/de/index.html | wc -l` is 0.

**Manual Verification**:
- [ ] `http://localhost:4321/de/`: all visible text is German, including board labels, tab names,
  lightbox heading and badge alt text; the screenshots carry German captions.
- [ ] The language link in header and footer switches between `/` and `/de/` and back.

### Phase 3: Shared-set page, 404 page and technical files

Dependencies: Phase 2

Every address of the URL contract exists in the build, and a script can verify a deployment.

**Tasks**:
- [ ] `src/pages/s.astro` from the sibling's, with the texts of the current `s/index.html`
  (`git show main:s/index.html`): title "A Photo Memo+ picture set", the description, both
  language blocks, `noindex`, `nav={false}`, `alternate={false}`, `image="/images/app-icon.png"`,
  `card="summary"`, and the inline script with `app-id=1607756335`.
- [ ] `src/pages/404.astro`: `noindex`, no `path`, `alternate={false}`, an English and a German
  block from `notFound` with a link to `/` and `/de/`.
- [ ] Move both association files to `public/.well-known/apple-app-site-association` and
  `public/apple-app-site-association` with `git mv`, content untouched.
- [ ] `public/_headers`: `Content-Type: application/json` for both association paths.
- [ ] `public/_redirects`:
  ```
  /privacy.html /privacy/ 301
  /de/privacy.html /de/privacy/ 301
  /imprint.html https://apps.peterkurzok.de/imprint/ 301
  /de/imprint.html https://apps.peterkurzok.de/imprint/ 301
  ```
- [ ] `public/robots.txt` with the sitemap line; `src/pages/sitemap.xml.ts` and
  `src/pages/feed.rss.ts` from the sibling, both reading `pages` and `app.name` from `site.ts`.
- [ ] `check-dist.mjs`: the expected files (`s/index.html`, `404.html`, `sitemap.xml`, `feed.rss`, `robots.txt`, `_headers`, `_redirects`,
  both association files, `images/app-icon.png`); both association files in `dist/` equal each
  other and their copies in `public/`, byte for byte;
  `_headers` names both paths; `_redirects` holds exactly the four lines; the sitemap lists the
  four pages and not `/s/`; `s/index.html` has `noindex`, the four static `og:` tags, no
  navigation link and the `app-argument` script.
- [ ] `scripts/check-live.mjs` from the sibling, testing every line of the URL contract against a
  base URL: the 200 pages with content type, the two policy redirects and the two imprint
  redirects (301 with exact target), both association files as `application/json` with the bytes
  of `public/`, `/images/app-icon.png` and every file of `src/assets/images/` with identical
  bytes, the trailing-slash forms (`/privacy`, `/de`, `/de/privacy`, `/s` answer 308), and 404
  for `/imprint/`, `/de/feed.rss` and `/css/styles.css`, each asked with a `?fresh=<timestamp>`
  query.
- [ ] `README.md`: complete it with the sections of the sibling's README that apply: editing the
  privacy policy, shared picture sets and universal links (the association file is load-bearing
  and cached by Apple for up to 24 hours), images, deployment, rollback, URL contract table.

**Automated Verification**:
- [ ] `npm run check` prints no `✗` line.
- [ ] `cmp public/.well-known/apple-app-site-association <(git show main:.well-known/apple-app-site-association)` reports no difference.
- [ ] `npm run preview` in the background, then
  `curl -s -o /dev/null -w '%{http_code}' http://localhost:4321<path>` answers 200 for `/`,
  `/de/`, `/privacy/`, `/de/privacy/`, `/s/`, `/sitemap.xml`, `/feed.rss`, `/robots.txt`.

### Phase 4: Cutover and documentation

Dependencies: Phase 3

The new site goes live on Cloudflare Pages without a gap, GitHub Pages is switched off, and the
app repository describes the new workflow. Steps marked (owner) happen in the Cloudflare or GitHub
dashboard and are done by the owner; everything else is done by the implementer.

**Tasks**:
- [ ] Push the branch `astro` and the tag `ignite-final`; open a pull request to `main`. Do not
  merge yet.
- [ ] (owner) Create the Cloudflare Pages project `photo-memory-web` from the GitHub repository:
  production branch `astro` for now, build command `npm run build`, output directory `dist`,
  environment variable `NODE_VERSION` = `22` for production and preview.
- [ ] Run `npm run check:live -- https://photo-memory-web.pages.dev` and fix what it reports.
- [ ] (owner) Attach the custom domain `photo-memo.peterkurzok.de` to the project; this replaces
  the DNS record that points to `pkurzok.github.io`. GitHub Pages stays enabled, so pointing the
  record back restores the old site.
- [ ] Run `npm run check:live -- https://photo-memo.peterkurzok.de`.
- [ ] (owner) Set the project's production branch to `main`. This deploys nothing by itself; the
  deployment of `astro` stays live.
- [ ] Switch GitHub Pages off: `gh api -X DELETE repos/pkurzok/Photo-Memory-Web/pages`. It has to
  happen before the merge: with `.nojekyll` and `CNAME` gone, GitHub would otherwise run a Jekyll
  build over the Astro source on `main`.
- [ ] Merge the pull request. The push to `main` is the production deployment; run the live check
  again when it has finished.
- [ ] In the app repository, in a worktree `../Photo-Memory-iOS-worktrees/astro-website` on a new
  branch `docs/astro-website` from `develop` (its default branch):
  - [ ] Add `scripts/site-assets.sh`: takes the site folder, fails with a message naming the
    missing file when a source is absent (run `make screenshots` first), and copies the files of
    the Phase 1 list for `en-US` → `en` and `de-DE` → `de`. The screenshot folder defaults to
    `Screenshots/screenshots` and can be set with `SCREENSHOTS_DIR`, because the generated
    images are gitignored and exist only in the checkout that ran `make screenshots`.
  - [ ] Add the Makefile target `site-assets` (`SITE` required, `SCREENSHOTS_DIR` optional) and
    list it in the help text.
  - [ ] Rewrite `docs/website.md`: the site is the Astro project in `Photo-Memory-Web` on
    Cloudflare Pages and that repository's README is the reference; where the copy comes from
    (`docs/aso/metadata/en-GB.md` and `de-DE.md`, unchanged rule about the word "Memory"); the
    freemium copy rules; `make site-assets`; the store URL table; "No fabricated social proof";
    the two open items about the app. Remove the Kickstart authoring, export, per-export fixes,
    hand-written files and Jekyll rollback sections. State that the framed store images are now
    used and why the old objection no longer holds.
  - [ ] Delete `docs/website/privacy-policy-en.md` and `privacy-policy-de.md`; `docs/website.md`
    names `src/pages/privacy.md` and `src/pages/de/privacy.md` in the site repository as the
    source, and so does the sentence in `docs/release-freemium.md` (section "Publish the
    privacy-policy section") that still points at the deleted files.
  - [ ] Open a pull request in the app repository.

**Automated Verification**:
- [ ] `npm run check:live -- https://photo-memo.peterkurzok.de` prints no `✗` line.
- [ ] `gh api repos/pkurzok/Photo-Memory-Web/pages` answers 404.
- [ ] `dig +short photo-memo.peterkurzok.de` no longer returns `pkurzok.github.io.`.
- [ ] In the app repository's new worktree:
  `make site-assets SITE=/Users/peter.kurzok/ws-privat/Photo-Memory-Web SCREENSHOTS_DIR=/Users/peter.kurzok/ws-privat/Photo-Memory-iOS/Screenshots/screenshots`
  followed by `git -C /Users/peter.kurzok/ws-privat/Photo-Memory-Web status --short src/assets`
  prints nothing.

**Manual Verification**:
- [ ] On an iPhone with Photo Memo+ installed, share a picture set and open the link from
  Messages: the app opens and deals the set.
- [ ] Open the same link on a device without the app: the `/s/` page appears and the link preview
  in Messages shows title, text and icon.
- [ ] In the App Store, the "Privacy Policy" link of the listing opens the policy.
- [ ] A day after the cutover, repeat the first check: Apple's CDN caches the association file
  for up to 24 hours, so only then does it prove that Apple reads the file from the new host.

## Implementation Notes

During implementation, document user feedback, problems, and decisions here.

- Phase 1: the German screenshots were copied together with the English ones (first task of
  Phase 2). Until `/de/` uses them, Astro also emits their 15 originals under `dist/_astro/`.
- Phase 1: `Content` got one key the plan does not list, `navToggle` (the accessible name of the
  menu button on a phone).
- Phase 1: the header floats (`position: fixed`) so that its capsules lie on the wood of the
  homepage; on the policy they lie on the paper.
- Phase 1: Astro 7.3.8 prints a deprecation notice for `markdown.smartypants` on every build. The
  option still works and is kept as in the sibling site.
- Phase 1: the "one-time" label is shown for the Pro tier only; the old page also printed it under
  the price "Free".

## References

- `../Inquizitive-Web` - the sibling Astro site this project is modelled on (README, `src/`,
  `scripts/check-dist.mjs`, `scripts/check-live.mjs`)
- `../../ws-workshop/TV-Graphs-Web/docs/agents/plans/2026-10-02-migrate-website-to-astro.md` - the
  plan of the previous migration
- `../Photo-Memory-iOS/docs/website.md` - current runbook, store URLs, trademark rule, open items
- `../Photo-Memory-iOS/docs/screenshots.md` - the screenshot pipeline, sizes and the iPhone Duo
- `../Photo-Memory-iOS/Screenshots/EasyFrame.json` - captions per locale and the colour tokens
- `../Photo-Memory-iOS/Screenshots/assets/demo-photos/CREDITS.md` - licence of the demo photos
- `../Photo-Memory-iOS/docs/aso/README.md` - the trademark rule
- Cloudflare Pages: <https://developers.cloudflare.com/pages/configuration/redirects/>,
  <https://developers.cloudflare.com/pages/configuration/headers/>
