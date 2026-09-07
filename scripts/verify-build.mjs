import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import assert from 'node:assert/strict';

// 验证实际构建产物，防止子路径部署时出现站内死链、丢失资源或旧域名。
const root = 'dist';
const base = '/chi3316.github.io/';
const origin = 'https://jianpeng-chen.github.io';
const files = readdirSync(root, { recursive: true }).filter((file) => file.endsWith('.html'));
const errors = [];
let references = 0;
for (const file of files) {
  const html = readFileSync(join(root, file), 'utf8');
  for (const [, raw] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    if (!raw.startsWith('/') || raw.startsWith('//')) continue;
    references++;
    if (!raw.startsWith(base)) {
      errors.push(`${file}: 缺少部署前缀 ${raw}`);
      continue;
    }
    const path = decodeURIComponent(raw.slice(base.length).split(/[?#]/)[0]);
    const target = join(root, path);
    if (!existsSync(target) && !existsSync(join(target, 'index.html')))
      errors.push(`${file}: 目标不存在 ${raw}`);
  }
  const canonical = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/);
  if (!canonical || !canonical[1].startsWith(origin + base)) errors.push(`${file}: canonical 地址不正确`);
  if (html.includes('https://chi3316.github.io')) errors.push(`${file}: 仍引用已迁移的域名`);
}
for (const file of readdirSync(join(root, '_astro')).filter((file) => extname(file) === '.css')) {
  const css = readFileSync(join(root, '_astro', file), 'utf8');
  for (const [, path] of css.matchAll(/url\(["']?(\/[^)"']+)["']?\)/g)) {
    if (!path.startsWith(base) || !existsSync(join(root, decodeURIComponent(path.slice(base.length)))))
      errors.push(`${file}: 字体或样式资源不可用 ${path}`);
  }
}
assert.ok(existsSync(join(root, 'pagefind/pagefind.js')), '缺少全文搜索索引');
assert.ok(
  readFileSync(join(root, 'rss.xml'), 'utf8').includes(`${origin}${base}writing/`),
  'RSS 条目缺少正确的站点路径',
);
assert.ok(
  readFileSync(join(root, 'sitemap-0.xml'), 'utf8').includes(`${origin}${base}projects/`),
  '站点地图缺少项目页面',
);
assert.equal(errors.length, 0, errors.join('\n'));
console.log(`已验证 ${files.length} 个页面、${references} 个站内引用，以及字体、搜索索引、RSS 和站点地图。`);
