import type { APIRoute } from 'astro';

// robots.txt is driven by the SAME switch as the noindex meta tag.
// Staging (PUBLIC_INDEXABLE unset/false)  -> Disallow everything.
// Production launch (PUBLIC_INDEXABLE=true) -> Allow all + Sitemap.
const indexable = import.meta.env.PUBLIC_INDEXABLE === 'true';
const site = 'https://haidrun.com';

const body = indexable
  ? `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap-index.xml\n`
  : `# Staging — not for indexing. Flip PUBLIC_INDEXABLE=true at production launch.\nUser-agent: *\nDisallow: /\n`;

export const GET: APIRoute = () =>
  new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
