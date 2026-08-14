import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://chi3316.github.io',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (page) => !page.includes('/2024/') && !page.endsWith('/categories/') && !page.endsWith('/tags/') && !page.endsWith('/archives/') })],
  vite: {
    plugins: [tailwindcss()],
  },
});
