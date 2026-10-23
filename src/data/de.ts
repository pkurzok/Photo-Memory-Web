// All German texts of the site. The word the trademark rule in the README names must not appear
// in this file; `npm run check` searches the built pages for it.
import type { Content } from './site';

export const de: Content = {
  name: 'Photo Memo+: Fotos & Paare',
  shortName: 'Photo Memo+',
  description:
    'Photo Memo+: Fotos & Paare ist das klassische Paare-Spiel aus den Fotos auf deinem iPhone. Kostenlos spielbar, ohne Konto, auch offline.',
  nav: [
    { label: 'Screenshots', href: '#screenshots' },
    { label: 'Funktionen', href: '#features' },
    { label: 'Fragen', href: '#faq' },
  ],
  navCta: 'Laden',
  navToggle: 'Navigation ein- und ausblenden',
  otherLanguage: { label: 'English', lang: 'en' },
  hero: {
    title: 'Keine Tiere von der Stange. Deine Familie.',
    subtitle:
      'Das klassische Spielfeld aus den Fotos, die ohnehin auf deinem iPhone liegen. Kostenlos laden, kostenlos spielen — kein Abo, kein Konto, und nichts davon braucht Internet.',
    badgeAlt: 'Im App Store laden',
  },
  board: {
    label: 'Eine Runde Paare zum Ausprobieren',
    moves: 'Züge',
    deal: 'Neu austeilen',
    faceDown: 'Karte {n}, verdeckt',
    won: 'Alle Paare in {n} Zügen.',
    wonCta: 'Jetzt mit deinen eigenen Fotos.',
    photos: [
      'Ein Mops, in eine karierte Decke gewickelt',
      'Eine Katze und ein Hund, Nase an Nase eingeschlafen',
      'Eine Welle, die am Strand bricht',
      'Ein Geburtstagskuchen mit brennenden Kerzen',
      'Ein Sonnenblumenfeld',
      'Beereneis am Stiel',
    ],
  },
  highlights: {
    title: 'Darum bleiben Familien dabei',
    items: [
      {
        title: 'Gesichter, die sie längst lieben',
        text: 'Kleinkinder decken Gesichter auf, die sie längst lieben — statt gezeichneter Bananen.',
        photoAlt: 'Ein brauner Welpe schaut nach oben',
      },
      {
        title: 'Oma und Opa erkennen jede Karte',
        text: 'Jede Karte zeigt jemanden, den sie kennen — und sie gewinnen öfter, als ihnen zusteht.',
        photoAlt: 'Zwei Paar Füße auf einem Steg an einem Bergsee',
      },
      {
        title: 'Nie zweimal dasselbe Spielfeld',
        text: 'Neue Bilder ergeben ein völlig neues Spielfeld. Es geht nie aus.',
        photoAlt: 'Eine Schale Erdbeeren',
      },
      {
        title: 'Zwei bis vier Spieler, mit Namen',
        text: 'Die Zugreihenfolge läuft über Namen, also streitet niemand, wer dran ist.',
        photoAlt: 'Ein Leuchtturm am Meer bei Nacht',
      },
      {
        title: 'Flugzeug, Auto, Wartezimmer',
        text: 'Nichts davon braucht eine Internetverbindung.',
        photoAlt: 'Eine Möwe steht auf einer Mauer',
      },
    ],
  },
  screenshots: {
    title: 'Sieh es mit deinen eigenen Fotos',
    description:
      'Fünf Bildschirme aus der App: das Spielfeld, deine gespeicherten Bildersets, Spieler mit Namen, das Spielfeld mit 40 Karten und die Highscore-Tabelle.',
    deviceLabels: { iphone: 'iPhone', duo: 'iPhone Duo', ipad: 'iPad' },
    captions: {
      photos: 'Keine Tiere von der Stange. Deine Familie.',
      selection: 'Neue Bilder, neues Spielfeld',
      players: 'Zwei bis vier Spieler, mit Namen',
      sizes: 'Von vier Karten bis vierzig',
      highscores: 'Jede Runde hat einen Sieger',
    },
    previous: 'Vorheriger Screenshot',
    next: 'Nächster Screenshot',
    close: 'Schließen',
  },
  features: {
    title: 'Das bekommst du',
    items: [
      {
        icon: 'images',
        title: 'Beliebige Bilder',
        text: 'Direkt aus deiner Fotomediathek. Kostenlos wie mit Pro.',
      },
      {
        icon: 'collection',
        title: 'Gespeicherte Bildersets',
        text: 'Eins ist kostenlos, mit Pro so viele du möchtest.',
      },
      {
        icon: 'grid-3x3-gap-fill',
        title: 'Spielfelder von 4 bis 40 Karten',
        text: '4, 8, 12 und 16 sind kostenlos. Die großen Felder mit 24 und 40 Karten brauchen Pro.',
      },
      {
        icon: 'arrow-repeat',
        title: 'Drei Runden pro Tag, kostenlos',
        text: 'Pro hebt die Grenze auf — den ganzen Nachmittag lang.',
      },
      {
        icon: 'palette-fill',
        title: 'Sieben Hintergründe',
        text: 'Holz und Beton, ganz nach Geschmack. Kostenlos.',
      },
      {
        icon: 'people-fill',
        title: 'Spieler mit Namen & Highscores',
        text: 'Zugreihenfolge und eine Highscore-Tabelle je Spielfeldgröße. Kostenlos.',
      },
      {
        icon: 'volume-up-fill',
        title: 'Ton und Haptik',
        text: 'Beides in den Einstellungen abschaltbar.',
      },
      {
        icon: 'universal-access',
        title: 'VoiceOver beschreibt die Karten',
        text: 'Eine aufgedeckte Karte sagt, was sie zeigt — „Mops in einer Decke“ statt „Foto 1“. Eigene Fotos werden auf dem Gerät beschrieben (iOS 27, Apple Intelligence). Kostenlos.',
      },
      {
        icon: 'lightbulb-fill',
        title: 'Sag uns, was als Nächstes kommt',
        text: 'Schlag in den Einstellungen Funktionen vor und stimm über Ideen ab (ab iOS 18). Kostenlos.',
      },
      {
        icon: 'phone-fill',
        title: 'iPhone und iPad',
        text: 'Eine App, beide Geräte — und Pro gilt ebenfalls für beide.',
      },
      {
        icon: 'shield-lock-fill',
        title: 'Deine Fotos bleiben auf dem Gerät',
        text: 'Nichts wird hochgeladen, es sei denn, du teilst ein Bilderset — und das wird vorher auf deinem Gerät verschlüsselt.',
      },
    ],
  },
  pricing: {
    title: 'Kostenlos spielen. Pro, wenn du mehr willst.',
    description:
      'Du hast Photo Memo+ damals gekauft, als es noch kostenpflichtig war? Dann gehören dir alle Pro-Funktionen bereits — kostenlos, für immer. Nichts zu kaufen, nichts wiederherzustellen.',
    oneTime: 'einmalig',
    recommended: 'Empfohlen',
    tiers: [
      {
        name: 'Kostenlos',
        text: 'Drei Runden pro Tag · ein gespeichertes Bilderset · Spielfelder von 4 bis 16 Karten · immer mit deinen eigenen Fotos · mit Werbung',
        price: 'Kostenlos',
      },
      {
        name: 'Photo Memo+ Pro',
        text: 'Keine Werbung · unbegrenzt viele Runden · so viele gespeicherte Bildersets, wie du möchtest · die großen Spielfelder mit 24 und 40 Karten. Einmal kaufen, für immer deins — kein Abo.',
        price: '1,99 €',
        highlighted: true,
      },
    ],
  },
  faq: {
    title: 'Fragen',
    items: [
      {
        question: 'Verlassen meine Fotos mein iPhone?',
        answer:
          'Nur, wenn du ein Bilderset teilst. Die Bilder, die du auswählst, werden in den eigenen Speicher der App auf dem Gerät kopiert und bleiben dort. Schickst du jemandem ein Set, wird es vorher auf deinem Gerät verschlüsselt, und der Schlüssel reist nur im Link — wir können es also nicht lesen. Diese Kopie wird nach 7 Tagen gelöscht. Sonst wird nie etwas hochgeladen, und es gibt kein Konto.',
      },
      {
        question: 'Funktioniert es ohne Internetverbindung?',
        answer: 'Ja, vollständig. Nichts im Spiel braucht eine Verbindung.',
      },
      {
        question: 'Können mehrere Personen spielen?',
        answer:
          'Zwei bis vier Spieler sind mit Namen an der Reihe, und die App verfolgt, wer dran ist und wer wie viele Paare hat.',
      },
      {
        question: 'Was erfasst die App?',
        answer:
          'Absturzberichte über Sentry und anonyme Nutzungsstatistiken über Mixpanel. Beides ist in den Einstellungen abschaltbar, und keines davon enthält jemals deine Fotos. Siehe die Datenschutzerklärung.',
      },
      {
        question: 'Gibt es ein Abo?',
        answer:
          'Nein. Photo Memo+ ist kostenlos zu laden und kostenlos zu spielen, und Pro ist ein einmaliger Kauf, der für immer dir gehört. Es gibt nichts Wiederkehrendes.',
      },
      {
        question: 'Was ist kostenlos, und wofür brauche ich Pro?',
        answer:
          'Kostenlos: drei Runden pro Tag, ein gespeichertes Bilderset, Spielfelder von 4 bis 16 Karten — durchgehend mit deinen eigenen Fotos. Pro (1,99 €, einmalig): keine Werbung, unbegrenzt viele Runden, beliebig viele gespeicherte Bildersets und die Spielfelder mit 24 und 40 Karten.',
      },
      {
        question: 'Ich habe die App gekauft, als sie noch kostenpflichtig war. Was passiert mit mir?',
        answer:
          'Nichts ändert sich, und dir wird nichts weggenommen. Alle Pro-Funktionen bleiben dir erhalten — kostenlos, für immer. Du musst nichts kaufen und nichts wiederherstellen; die App erkennt es selbst, sobald sie den App Store erreichen kann.',
      },
      {
        question: 'Gibt es Werbung?',
        answer:
          'Die kostenlose Version zeigt ein einzelnes kleines Banner unter dem Spielfeld. Pro entfernt es — und zwar in dem Moment, in dem der Kauf durchgeht, ohne Neustart.',
      },
      {
        question: 'Wie viele Karten kann ein Spielfeld haben?',
        answer:
          'Von 4 bis 40, einstellbar in den Einstellungen. 4, 8, 12 und 16 sind kostenlos; die Spielfelder mit 24 und 40 Karten brauchen Pro. Ein größeres Spielfeld braucht einfach mehr Bilder.',
      },
      {
        question: 'Läuft es auf dem iPad?',
        answer: 'Ja, auf iPhone und iPad. Wenn du Pro kaufst, gilt es für beide.',
      },
    ],
  },
  download: {
    title: 'Bereit für ein Spiel mit deinen eigenen Fotos?',
    text: 'Photo Memo+: Fotos & Paare — der Klassiker, gespielt mit den Menschen in deiner Hosentasche.',
  },
  footer: {
    tagline: 'Der Klassiker, gespielt mit den Menschen in deiner Hosentasche.',
    links: [
      { label: 'Datenschutzerklärung', href: '/de/privacy/' },
      { label: 'Impressum', href: 'https://apps.peterkurzok.de/imprint/' },
      { label: 'Weitere Apps', href: 'https://apps.peterkurzok.de' },
    ],
    copyright: '© 2026 Peter Kurzok',
  },
  privacyTitle: 'Datenschutzerklärung',
  notFound: {
    title: 'Seite nicht gefunden',
    text: 'Unter dieser Adresse gibt es nichts. Auf der Startseite steht alles über Photo Memo+.',
    home: 'Zur Startseite',
  },
};
