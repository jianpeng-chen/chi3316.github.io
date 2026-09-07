# CHICHI — 迟迟的数字世界

像素冒险风格的个人网站，展示企业 AI 应用、Agent、数据平台与开源工程实践。

线上地址：https://jianpeng-chen.github.io/chi3316.github.io/

## 本地开发与验证

```sh
npm ci
npm run dev
```

打开 http://localhost:4321/chi3316.github.io/ 。

```sh
npm run check
npm run build
npm run verify
npm run preview
```

`verify` 检查实际构建产物中的站内链接、字体、搜索索引、RSS、canonical 与站点地图。生产产物位于 `dist/`，全文搜索由 Pagefind 在构建后生成；开发模式下会明确提示按标题和简介搜索。

## 内容与视觉

- `src/data/projects.ts`：项目案例。
- `src/content/blog/`：技术文章，旧文章地址保留跳转。
- `src/components/`：玩家档案、项目卡片、导航与页脚。
- `src/styles/`：响应式布局、昼夜主题、本地字体。
- `public/worlds/`：原创 SVG 像素山谷、森林与夕阳场景。
- `public/scripts/writing.js`：文章标签过滤与全文搜索。
- `public/fonts/`：Space Grotesk、DM Sans、Silkscreen、Noto Sans SC 字体及 OFL 授权文件。

Noto Sans SC 按现有内容提取汉字子集；新增字符未覆盖时使用系统字体。所有视觉资产和字体均由本站提供，无外部 CDN 依赖。

## 部署

GitHub Actions 在 PR 中执行检查、构建和产物验证。合入 `master` 后自动发布至 GitHub Pages；手动发布也应选择 `master`。部署地址已适配仓库迁移后的 `/chi3316.github.io/` 子路径。站内路径统一通过 `src/lib/paths.ts` 处理，Markdown 中的资源地址在构建阶段补齐。

历史文章中可以按文件名恢复的插图会映射至现有资源，无法找到的插图显示说明，原始 Markdown 地址保留。
