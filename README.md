# CHICHI — Personal Website

A personal portfolio and technical writing site focused on enterprise AI applications, agent engineering, data platforms, and automation.

## Stack

- [Astro](https://astro.build/) for static site generation
- [Tailwind CSS](https://tailwindcss.com/) through the Vite plugin
- [Pagefind](https://pagefind.app/) for fully static, client-side search
- GitHub Actions and GitHub Pages for deployment

## Local development

```bash
npm install
npm run dev
```

The development server runs at `http://localhost:4321` by default.

## Quality checks

```bash
npm run check
npm run build
```

The production build is written to `dist/`. The build command also creates the Pagefind search index.

## Content

- Project case studies: `src/data/projects.ts`
- Technical articles: `src/content/blog/`
- Shared visual system: `src/styles/global.css`
- Static images and migrated article assets: `public/assets/`

Pushing the configured branch triggers `.github/workflows/deploy.yml` and publishes the production build to GitHub Pages.
