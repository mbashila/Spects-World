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
- Avoid `backdrop-blur` over large images / full-screen layers (paint cost); prefer solid translucent backgrounds. (The compact navbar strip is the one exception.)
- Modals use the `useModal` hook (Esc to close + scroll lock).

## Motion (GSAP)
- `gsap@3.15.0` (pinned) with ScrollTrigger + SplitText; shared setup and helpers live in `src/motion.ts`.
- Create animations inside `useMotion(ref, setup)` (scoped `gsap.context`, auto-reverted, skipped for `prefers-reduced-motion`). Components with custom lifecycles (hero, testimonial swaps) use `gsap.context` directly and must `ctx.revert()` on cleanup.
- Reveal helpers: `revealLines` (masked SplitText headline), `revealUp` (supporting copy), `revealImage` (bottom clip-path photo reveal). Split lines use class `split-line`; masks get `split-line-mask` (padded in `index.css` so descenders aren't clipped).
- Hero is driven entirely by GSAP (stacked layers, clip-path wipes, progress tweens); React state there only tracks the active index. Headline splits wait for `document.fonts.ready`.
- Gallery mask layers set `transformOrigin` at the section centre so uniform scaling stays seamless; hover zoom lives on a wrapper, never on the GSAP-animated layers.
- Parallax only when `allowParallax()` (≥768px, not reduced motion, ≥4 cores).
- Buttons use `.btn-fill` (+ `--fill` / `--fill-text` CSS vars) and `.btn-arrow` for the hover fill/arrow nudge.
- Context cursor: add `data-cursor="Label"` to an element; fine-pointer only, hidden over nested controls.
