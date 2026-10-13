// An empty channel: the site has no posts, but /feed.rss has been published and stays reachable.
import type { APIRoute } from 'astro';
import { app } from '../data/site';

export const GET: APIRoute = ({ site }) => {
  const home = new URL('/', site).href.replace(/\/$/, '');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8" ?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${app.name}</title><description></description><link>${home}</link><atom:link href="${home}/feed.rss" rel="self" type="application/rss+xml" /><language>en</language></channel></rss>\n`,
    { headers: { 'Content-Type': 'application/rss+xml' } },
  );
};
