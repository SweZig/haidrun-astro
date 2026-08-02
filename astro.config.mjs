import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Canonical production domain: haidrun.com (owner decision 2026-08-02, reverses earlier .io choice).
export default defineConfig({
  site: 'https://haidrun.com',
  integrations: [sitemap()],
  build: { format: 'directory' },
});
