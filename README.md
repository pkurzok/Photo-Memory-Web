# Photo Memo+ website

The source of <https://photo-memo.peterkurzok.de>: the homepage with its playable pairs board and
the privacy policy of the Photo Memo+ app, in English at `/` and in German at `/de/`. It is an [Astro](https://astro.build) project that
builds to static files; this repository is the only source of the site.

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

Run `npm run check` before pushing. It prints one line per check and fails when a link dangles
or a published file is missing.

## Where content lives

| Content | File |
|---|---|
| Every text of the homepage, navigation and footer | `src/data/en.ts`, `src/data/de.ts` |
| App Store id and address, languages, list of devices and screenshot motifs | `src/data/site.ts` |
| Privacy policy | `src/pages/privacy.md`, `src/pages/de/privacy.md` |
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

All of them come from the app repository.
