import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://photo-memo.peterkurzok.de',
  // The Markdown texts keep their straight quotes.
  markdown: { smartypants: false },
});
