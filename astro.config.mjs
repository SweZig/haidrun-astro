import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Canonical domain per beslut-domanstrategi (Scenario A): haidrun.io
export default defineConfig({
  site: 'https://haidrun.io',
  integrations: [sitemap()],
  build: { format: 'directory' },
});
