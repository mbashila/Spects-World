# Spects World (EyeClinic)

Single-page React 19 + Vite 8 + Tailwind v4 marketing site. Almost everything lives in `src/App.tsx`.

## Commands
- Dev server: `npm run dev` (port 3000)
- Typecheck: `npm run lint` (`tsc --noEmit`)
- Production build: `npx vite build`

## Conventions
- Import images from `src/assets/images/optimized/*.webp` (ES imports, never string paths, or they won't be bundled). Originals JPGs are kept alongside as source files.
- Font: Open Sauce One, self-hosted via `@fontsource/open-sauce-one` (imported in `src/main.tsx`, mapped to `--font-sans` in `src/index.css`).
- Custom animations (`animate-fade-in`, `animate-hero-*`) are defined in the `@theme` block in `src/index.css`.
- Avoid `backdrop-blur` over large images / full-screen layers (paint cost); prefer solid translucent backgrounds.
- Modals use the `useModal` hook (Esc to close + scroll lock).
