// Shared GSAP setup + small reveal helpers used by every section.
// Every animation is created inside `useMotion`, which scopes selectors to a
// component root and reverts everything (tweens, ScrollTriggers, SplitText)
// on unmount, so nothing leaks between renders or hot reloads.
import { useLayoutEffect, type DependencyList, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText };

export const EASE = {
  text: 'power3.out',
  headline: 'power4.out',
  image: 'power2.inOut',
  entrance: 'expo.out',
  ambient: 'sine.inOut',
} as const;

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Parallax only on wider screens with enough CPU headroom, and never for reduced-motion users. */
export const allowParallax = () =>
  !prefersReducedMotion() &&
  window.matchMedia('(min-width: 768px)').matches &&
  !(navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4);

export const isFinePointer = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/**
 * Runs `setup` inside a gsap.context scoped to `scope` before first paint (so
 * hidden start states never flash). Skipped entirely for reduced-motion users,
 * leaving content in its normal, fully visible state.
 */
export function useMotion(
  scope: RefObject<HTMLElement | null>,
  setup: (root: HTMLElement) => void | (() => void),
  deps: DependencyList = []
) {
  useLayoutEffect(() => {
    const root = scope.current;
    if (!root || prefersReducedMotion()) return;
    let cleanup: void | (() => void);
    const ctx = gsap.context(() => {
      cleanup = setup(root);
    }, root);
    return () => {
      cleanup?.();
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** Line split with per-line overflow masks (mask class `split-line-mask`, padded in index.css). */
export const SPLIT_LINES = { type: 'lines', mask: 'lines', linesClass: 'split-line', autoSplit: true } as const;
/** Same split without autoSplit, for text whose animations are managed manually (hero copy swaps). */
export const SPLIT_LINES_STATIC = { type: 'lines', mask: 'lines', linesClass: 'split-line' } as const;

interface RevealOpts {
  trigger?: Element | string;
  start?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  ease?: string;
}

/** Masked line-by-line headline reveal (each line rises out of its own overflow mask). */
export function revealLines(target: Element | null, opts: RevealOpts = {}) {
  if (!target) return;
  const { trigger = target, start = 'top 85%', delay = 0, stagger = 0.1, duration = 0.95, ease = EASE.headline } = opts;
  SplitText.create(target, {
    ...SPLIT_LINES,
    // Returning the tween lets SplitText carry its progress over when it re-splits on resize/font load
    onSplit: (self) =>
      gsap.from(self.lines, {
        yPercent: 110,
        duration,
        stagger,
        delay,
        ease,
        scrollTrigger: { trigger, start, once: true },
      }),
  });
}

/** Small upward fade for supporting copy / details. */
export function revealUp(targets: gsap.TweenTarget, opts: RevealOpts & { y?: number } = {}) {
  const { trigger, start = 'top 85%', delay = 0, stagger = 0.08, duration = 0.85, ease = EASE.text, y = 24 } = opts;
  return gsap.from(targets, {
    y,
    autoAlpha: 0,
    duration,
    stagger,
    delay,
    ease,
    scrollTrigger: trigger ? { trigger, start, once: true } : undefined,
  });
}

/** Clip-path image reveal from the bottom edge, with the photo settling from a slight zoom. */
export function revealImage(wrapper: Element | null, img: Element | null, opts: RevealOpts & { radius?: string } = {}) {
  if (!wrapper) return;
  const { trigger = wrapper, start = 'top 85%', delay = 0, duration = 1.15, ease = EASE.entrance, radius = '16px' } = opts;
  const tl = gsap.timeline({ delay, scrollTrigger: { trigger, start, once: true } });
  tl.fromTo(
    wrapper,
    { clipPath: `inset(100% 0% 0% 0% round ${radius})`, y: 40 },
    { clipPath: `inset(0% 0% 0% 0% round ${radius})`, y: 0, duration, ease }
  );
  if (img) tl.fromTo(img, { scale: 1.18 }, { scale: 1, duration: duration + 0.35, ease: EASE.text }, 0);
  return tl;
}

/** Re-measure all ScrollTriggers once fonts have loaded (line splits and heights may change). */
export function refreshOnFontsReady() {
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}
