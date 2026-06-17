// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
  site: 'https://sidehustlesjob.com',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404') && !page.includes('/500'),
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      customPages: [],
    }),
  ],
});
