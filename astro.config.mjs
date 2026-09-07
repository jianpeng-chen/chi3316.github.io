import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import rehypeSiteLinks from './scripts/rehype-site-links.mjs';

const base = '/chi3316.github.io';

export default defineConfig({
  site: 'https://jianpeng-chen.github.io',
  base,
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/2024/') &&
        !page.endsWith('/categories/') &&
        !page.endsWith('/tags/') &&
        !page.endsWith('/archives/'),
    }),
  ],
  markdown: { processor: unified({ rehypePlugins: [[rehypeSiteLinks, { base }]] }) },
  vite: { plugins: [tailwindcss()] },
});
