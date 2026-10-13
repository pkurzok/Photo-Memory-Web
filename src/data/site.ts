// Facts and helpers that do not depend on the language. The texts of a language are in
// en.ts and de.ts; the privacy policies are Markdown in src/pages/.
import { de } from './de';
import { en } from './en';

export const app = {
  // What the feed and og:site_name print. Page titles use content[lang].name.
  name: 'Photo Memo+',
  author: 'Peter Kurzok',
  email: 'photo-memo-privacy@peterkurzok.de',
  appStoreId: '1607756335',
  appStoreUrl: 'https://apps.apple.com/app/id1607756335',
};

export type Lang = 'en' | 'de';
export const langs: Lang[] = ['en', 'de'];

// The screenshot files are src/assets/images/screenshots/<lang>/<device>-0<n>-<motif>.jpg,
// with n counting the motifs from 1.
export const devices = ['iphone', 'duo', 'ipad'] as const;
export type Device = (typeof devices)[number];
export const motifs = ['photos', 'selection', 'players', 'sizes', 'highscores'] as const;
export type Motif = (typeof motifs)[number];

export const screenshotFile = (device: Device, motif: Motif) =>
  `${device}-0${motifs.indexOf(motif) + 1}-${motif}.jpg`;

export type Content = {
  name: string;
  shortName: string;
  description: string;
  // Entries starting with "#" are sections of the homepage.
  nav: { label: string; href: string }[];
  navCta: string;
  navToggle: string;
  otherLanguage: { label: string; lang: Lang };
  hero: { title: string; subtitle: string; badgeAlt: string };
  board: {
    label: string;
    moves: string;
    deal: string;
    // {n} is the position of the card on the board.
    faceDown: string;
    // {n} is the number of moves.
    won: string;
    wonCta: string;
    // Alt texts of src/assets/images/photos/01.jpg … 06.jpg, in that order.
    photos: string[];
  };
  // The tiles show photos 07.jpg … 11.jpg, in that order.
  highlights: { title: string; items: { title: string; text: string; photoAlt: string }[] };
  screenshots: {
    title: string;
    description: string;
    deviceLabels: Record<Device, string>;
    // Alt text of the image and heading of the lightbox.
    captions: Record<Motif, string>;
    previous: string;
    next: string;
    close: string;
  };
  features: { title: string; items: { icon: string; title: string; text: string }[] };
  pricing: {
    title: string;
    description: string;
    oneTime: string;
    recommended: string;
    tiers: { name: string; text: string; price: string; highlighted?: boolean }[];
  };
  faq: { title: string; items: { question: string; answer: string }[] };
  download: { title: string; text: string };
  footer: { tagline: string; links: { label: string; href: string }[]; copyright: string };
  privacyTitle: string;
  notFound: { title: string; text: string; home: string };
};

export const content: Record<Lang, Content> = { en, de };

// The address of a page in a language: English at the root, every other language in its folder.
export const localePath = (lang: Lang, path: string) => (lang === 'en' ? path : `/${lang}${path}`);

// The same page in another language: "/de/privacy/" read as German becomes "/privacy/" in English.
export const translatedPath = (path: string, from: Lang, to: Lang) =>
  localePath(to, from === 'en' ? path : path.slice(from.length + 1));

// What og:locale prints.
export const locales: Record<Lang, string> = { en: 'en_GB', de: 'de_DE' };

// The paths the sitemap lists.
export const pages = ['/', '/de/', '/privacy/', '/de/privacy/'];
