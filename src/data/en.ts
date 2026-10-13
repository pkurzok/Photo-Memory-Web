// All English texts of the site. Every key exists in each language file; the type makes the
// build fail when one is missing.
import type { Content } from './site';

export const en: Content = {
  name: 'Photo Memo+: Picture Pairs',
  shortName: 'Photo Memo+',
  description:
    'Photo Memo+: Picture Pairs is the classic pairs game built from the photos on your iPhone. Free to play, no account, works offline.',
  nav: [
    { label: 'Screenshots', href: '#screenshots' },
    { label: 'Features', href: '#features' },
    { label: 'Questions', href: '#faq' },
  ],
  navCta: 'Get',
  navToggle: 'Toggle navigation',
  otherLanguage: { label: 'Deutsch', lang: 'de' },
  hero: {
    title: 'Not stock animals. Your family.',
    subtitle:
      'The classic pairs board, built from the photos already on your iPhone. Free to download and free to play — no subscription, no account, and nothing needs an internet connection.',
    badgeAlt: 'Download on the App Store',
  },
  board: {
    label: 'A round of pairs to try',
    moves: 'Moves',
    deal: 'Deal again',
    faceDown: 'Card {n}, face down',
    won: 'All pairs in {n} moves.',
    wonCta: 'Now try it with your photos.',
    photos: [
      'A pug wrapped in a checked blanket',
      'A cat and a dog asleep nose to nose',
      'A wave breaking on a beach',
      'A birthday cake with lit candles',
      'A field of sunflowers',
      'Berry ice lollies',
    ],
  },
  highlights: {
    title: 'Why families keep playing it',
    items: [
      {
        title: 'Faces they already love',
        text: 'Toddlers match the people in the pictures instead of cartoon fruit.',
        photoAlt: 'A brown puppy looking up',
      },
      {
        title: 'Grandparents recognise every card',
        text: 'Every card is someone they know — and they win more often than they should.',
        photoAlt: 'Two pairs of feet on a jetty by a mountain lake',
      },
      {
        title: 'Never the same board twice',
        text: 'New pictures make a brand new board, so it never runs out.',
        photoAlt: 'A bowl of strawberries',
      },
      {
        title: 'Two to four players, by name',
        text: 'Turns are tracked by name, so nobody argues about whose go it is.',
        photoAlt: 'A lighthouse by the sea at night',
      },
      {
        title: 'Plane, car, waiting room',
        text: 'Nothing here needs an internet connection.',
        photoAlt: 'A gull standing on a wall',
      },
    ],
  },
  screenshots: {
    title: 'See it with your own photos',
    description:
      'Five screens from the app: the board, your saved picture sets, named players, the 40-card board and the high score table.',
    deviceLabels: { iphone: 'iPhone', duo: 'iPhone Duo', ipad: 'iPad' },
    captions: {
      photos: 'Not stock animals. Your family.',
      selection: 'New pictures, brand new board',
      players: 'Two to four players, by name',
      sizes: 'From four cards to forty',
      highscores: 'Every round has a winner',
    },
    previous: 'Previous screenshot',
    next: 'Next screenshot',
    close: 'Close',
  },
  features: {
    title: 'What you get',
    items: [
      {
        icon: 'images',
        title: 'Any pictures you like',
        text: 'Straight from your photo library. Free and Pro alike.',
      },
      {
        icon: 'collection',
        title: 'Saved picture sets',
        text: 'Keep one for free, or as many as you like with Pro.',
      },
      {
        icon: 'grid-3x3-gap-fill',
        title: 'Boards from 4 to 40 cards',
        text: '4, 8, 12 and 16 are free. The big 24- and 40-card boards are Pro.',
      },
      {
        icon: 'arrow-repeat',
        title: 'Three rounds a day, free',
        text: 'Pro removes the limit and plays all afternoon.',
      },
      {
        icon: 'palette-fill',
        title: 'Seven table backgrounds',
        text: 'Wood and concrete, to taste. Free.',
      },
      {
        icon: 'people-fill',
        title: 'Named players & high scores',
        text: 'Turn tracking and a high score table per board size. Free.',
      },
      {
        icon: 'volume-up-fill',
        title: 'Sound and haptics',
        text: 'Both switchable in Settings.',
      },
      {
        icon: 'phone-fill',
        title: 'iPhone and iPad',
        text: 'One app, both devices — and Pro covers both too.',
      },
      {
        icon: 'shield-lock-fill',
        title: 'Your photos stay on your device',
        text: 'Nothing is uploaded unless you share a picture set — and that is encrypted on your device first.',
      },
    ],
  },
  pricing: {
    title: 'Free to play. Pro when you want more.',
    description:
      'Already bought Photo Memo+ back when it was a paid app? Every Pro feature is already yours — free, forever. Nothing to buy, nothing to restore.',
    oneTime: 'one-time',
    recommended: 'Recommended',
    tiers: [
      {
        name: 'Free',
        text: 'Three rounds a day · one saved picture set · boards from 4 to 16 cards · your own photos, always · includes adverts',
        price: 'Free',
      },
      {
        name: 'Photo Memo+ Pro',
        text: 'No adverts · unlimited rounds · as many saved picture sets as you like · the big 24- and 40-card boards. One purchase, yours forever — no subscription.',
        price: '€1.99',
        highlighted: true,
      },
    ],
  },
  faq: {
    title: 'Questions',
    items: [
      {
        question: 'Do my photos leave my iPhone?',
        answer:
          "Only if you choose to share a picture set. The pictures you pick are copied into the app's own storage on the device and stay there. If you send someone a set, it is encrypted on your device first and the key travels only inside the link — so we cannot read it. That copy is deleted after 7 days. Nothing else is ever uploaded, and there is no account.",
      },
      {
        question: 'Does it work without an internet connection?',
        answer: 'Yes, entirely. Nothing in the game needs a connection.',
      },
      {
        question: 'Can several people play?',
        answer:
          'Two to four players take turns by name, and the app tracks whose go it is and who has how many pairs.',
      },
      {
        question: 'What does the app collect?',
        answer:
          'Crash reports through Sentry and anonymous usage statistics through Mixpanel. Both are switchable in Settings, and neither ever includes your photos. See the privacy policy.',
      },
      {
        question: 'Is there a subscription?',
        answer:
          'No. Photo Memo+ is free to download and free to play, and Pro is a single purchase that is yours forever. There is nothing recurring.',
      },
      {
        question: 'What do I get for free, and what needs Pro?',
        answer:
          'Free: three rounds a day, one saved picture set, boards from 4 to 16 cards, and your own photos throughout. Pro (€1.99, one purchase): no adverts, unlimited rounds, as many saved picture sets as you like, and the 24- and 40-card boards.',
      },
      {
        question: 'I already bought the app when it was paid. What happens to me?',
        answer:
          'Nothing changes, and nothing is taken away. Every Pro feature stays yours — free, forever. You do not need to buy anything and you do not need to restore anything; the app works it out for itself the first time it can reach the App Store.',
      },
      {
        question: 'Are there adverts?',
        answer:
          'The free version shows a single small banner below the board. Pro removes it, and it disappears the moment the purchase goes through — no relaunch.',
      },
      {
        question: 'How many cards can a board have?',
        answer:
          'From 4 up to 40, chosen in Settings. 4, 8, 12 and 16 are free; the 24- and 40-card boards need Pro. A bigger board simply needs more pictures.',
      },
      {
        question: 'Does it run on iPad?',
        answer: 'Yes, on iPhone and iPad. If you buy Pro, it covers both.',
      },
    ],
  },
  download: {
    title: 'Ready to play with your own photos?',
    text: 'Photo Memo+: Picture Pairs — the classic pairs game, played with the people in your pocket.',
  },
  footer: {
    tagline: 'The classic pairs game, played with the people in your pocket.',
    links: [
      { label: 'Privacy Policy', href: '/privacy/' },
      { label: 'Imprint', href: 'https://apps.peterkurzok.de/imprint/' },
      { label: 'More Apps', href: 'https://apps.peterkurzok.de' },
    ],
    copyright: '© 2026 Peter Kurzok',
  },
  privacyTitle: 'Privacy Policy',
  notFound: {
    title: 'Page not found',
    text: 'There is nothing at this address. The homepage has everything about Photo Memo+.',
    home: 'Back to the homepage',
  },
};
