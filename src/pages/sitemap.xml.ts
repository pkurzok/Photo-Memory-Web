// Written by hand because @astrojs/sitemap emits sitemap-index.xml, not the published /sitemap.xml.
import type { APIRoute } from 'astro';
import { pages } from '../data/site';

export const GET: APIRoute = ({ site }) => {
  const urls = pages.map((page) => `<url><loc>${new URL(page, site).href}</loc></url>`).join('');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml' } },
  );
};
