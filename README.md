# Haidrun website (Astro)

Multi-page marketing site for **haidrun.io** (canonical domain per the .io/.com
domain decision — Scenario A). Converted from the single-file v0.99A prototype
into an Astro static site: one indexable URL per page, per-page `<title>`/meta,
canonical tags, Open Graph/Twitter cards, Organization JSON-LD and an
auto-generated sitemap.

## Develop
```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # -> dist/
npm run preview
```

## Staging vs production
- **Staging (default):** every page ships `<meta name="robots" content="noindex,nofollow">`
  and `public/robots.txt` disallows all crawlers.
- **Production launch:** set env `PUBLIC_INDEXABLE=true` and replace `public/robots.txt`
  with an allow rule. Then wire the `.com → .io` 301 redirect map.

## Structure
- `src/layouts/Layout.astro` — shared head (SEO/meta), header, footer, nav + animation scripts.
- `src/pages/**` — one file per route.
- `src/content/*.html` — page bodies (source of truth for copy).
- `src/styles/global.css` — Aurora Cinematic design system.

## Still to wire before public launch (client input)
Legal texts (Privacy/Terms/Cookies), customer cases, team bios & photos,
MiCA/VARA status, API spec/docs, lead flow (CRM + calendar + consent), OG image.
Placeholders are flagged in copy as `[INPUT]` / `[LEGAL]` / `[VERIFY]`.
