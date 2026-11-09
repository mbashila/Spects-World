import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import {
  gsap,
  ScrollTrigger,
  SplitText,
  EASE,
  SPLIT_LINES,
  SPLIT_LINES_STATIC,
  allowParallax,
  isFinePointer,
  prefersReducedMotion,
  refreshOnFontsReady,
  revealImage,
  revealLines,
  revealUp,
  useMotion,
} from './motion';
import visionGalleryImg from './assets/images/optimized/vision_gallery_bg.webp';
import eyeExamImg from './assets/images/optimized/eye_exam_procedure.webp';
import designerGlassesImg from './assets/images/optimized/designer_glasses_display.webp';
import patientWearingImg from './assets/images/optimized/patient_wearing_spects.webp';
import testimonialOneImg from './assets/images/optimized/patient_testimonial_one.webp';
import testimonialTwoImg from './assets/images/optimized/patient_testimonial_two.webp';

// HIGH-RESOLUTION EYE CLINIC & DESIGNER SPECTACLES IMAGES
const SECTION3_BG = patientWearingImg;

// HERO SLIDES
const HERO_INTERVAL = 7000;
const HERO_SLIDES = [
  {
    label: 'Eye Exams',
    eyebrow: 'Comprehensive Eye Exams',
    title: 'Clear Vision Starts Here',
    text: 'Board-certified optometrists, retinal imaging and wavefront diagnostics in one unhurried visit.',
    image: eyeExamImg,
    position: '50% 40%',
  },
  {
    label: 'Designer Frames',
    eyebrow: 'Independent Eyewear',
    title: 'Frames With Character',
    text: 'Titanium and Japanese acetate from small design houses, fitted to the geometry of your face.',
    image: designerGlassesImg,
    position: '50% 60%',
  },
  {
    label: 'Custom Lenses',
    eyebrow: 'Digital Freeform Lenses',
    title: 'Lenses Made For You',
    text: 'Progressive, blue-light and anti-reflective lenses measured digitally to your exact optical center.',
    image: visionGalleryImg,
    position: '65% 30%',
  },
];

// TESTIMONIAL PATIENT PORTRAITS
const TESTIMONIAL_PATIENTS = [
  {
    id: 1,
    author: 'Marcus Vance',
    role: 'Architectural Director',
    frame: 'Lindberg Titanium Round',
    rating: '5.0',
    quote:
      'Finding progressive lenses that didn’t distort architectural sightlines was impossible until Spects World measured my optical center digitally. Razor-sharp vision with weightless frames.',
    image: testimonialOneImg,
  },
  {
    id: 2,
    author: 'Amara Chen',
    role: 'UX Design Lead',
    frame: 'Gold Rimless Custom Spectacles',
    rating: '5.0',
    quote:
      'The eye examination felt like an advanced vision lab. The optometrists helped me choose frames tailored to my face geometry, and the blue-light filtering makes 10-hour screen work effortless.',
    image: testimonialTwoImg,
  },
  {
    id: 3,
    author: 'Sophie Laurent',
    role: 'Editorial Photographer',
    frame: 'Acetate Tortoiseshell Classics',
    rating: '5.0',
    quote:
      'Spects World completely elevated how I view eyewear. They treat precision lens crafting as an art form. I get compliments on my frames almost everywhere I go.',
    image: patientWearingImg,
  },
];

// DATA CONSTANTS
// Each service owns the photo shown behind the gallery cards when it is selected.
// fx / fy = focal point (0–1) used when the photo is cropped to fill the section.
interface ServiceItem {
  name: string;
  num: string;
  headline: string;
  desc: string;
  image: string;
  fx: number;
  fy: number;
}

const SERVICES: ServiceItem[] = [
  {
    name: 'Designer\nFrames',
    num: '01',
    headline: 'Frames with character',
    desc: 'Handcrafted titanium & Japanese acetate frames from independent design houses.',
    image: designerGlassesImg,
    fx: 0.5,
    fy: 0.6,
  },
  {
    name: 'Prescription\nLenses',
    num: '02',
    headline: 'Lenses cut for your eyes',
    desc: 'Freeform digital wavefront lenses with anti-reflective & blue-light coatings.',
    image: testimonialOneImg,
    fx: 0.5,
    fy: 0.3,
  },
  {
    name: 'Eye\nExams',
    num: '03',
    headline: 'A thorough, unhurried exam',
    desc: 'Comprehensive 45-point health check, corneal mapping, and retinal scans.',
    image: eyeExamImg,
    fx: 0.5,
    fy: 0.35,
  },
  {
    name: 'Contact\nLenses',
    num: '04',
    headline: 'Contacts that feel like nothing',
    desc: 'Specialty toric, multifocal, and breathable daily hydration fittings.',
    image: visionGalleryImg,
    fx: 0.6,
    fy: 0.35,
  },
];

const navLinks = ['Home', 'Eye Care', 'Services', 'Reviews', 'Contact'];

const CARE_STEPS = [
  {
    title: 'Comprehensive exam',
    text: 'A 45-minute check-up with retinal imaging, corneal mapping and a wavefront scan.',
  },
  {
    title: 'Lens & frame fitting',
    text: 'We digitally measure your optical centre, then help you choose frames that suit your face.',
  },
  {
    title: 'Aftercare for life',
    text: 'Free adjustments and cleanings, plus a 30-day progressive lens adaptation guarantee.',
  },
];

const OPENING_HOURS = [
  ['Mon – Fri', '9:00 – 7:30'],
  ['Saturday', '9:30 – 6:00'],
  ['Sunday', '11:00 – 4:00'],
] as const;

const LEGAL_LINKS = [
  ['privacy', 'Privacy'],
  ['terms', 'Terms'],
  ['hipaa', 'HIPAA'],
  ['accessibility', 'Accessibility'],
] as const;

const iconProps = {
  width: 14,
  height: 14,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    icon: (
      <svg {...iconProps}>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: 'X (Twitter)',
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    icon: (
      <svg {...iconProps}>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    icon: (
      <svg {...iconProps}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
];

// HOOKS
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(max-width: 767px)').matches;
    }
    return false;
  });

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const update = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return isMobile;
}

type ImageSizes = Record<string, { w: number; h: number }>;

// Preloads images and records their natural size (needed for cover-style mask math)
function useImageSizes(srcs: string[]) {
  const [sizes, setSizes] = useState<ImageSizes>({});
  const key = srcs.join('|');

  useEffect(() => {
    const imgs = key.split('|').map((src) => {
      const img = new Image();
      const done = () =>
        setSizes((prev) => (prev[src] ? prev : { ...prev, [src]: { w: img.naturalWidth, h: img.naturalHeight } }));
      img.onload = done;
      img.src = src;
      if (img.complete && img.naturalWidth) done();
      return img;
    });
    return () => imgs.forEach((img) => (img.onload = null));
  }, [key]);

  return sizes;
}

interface MaskPosition {
  x: number;
  y: number;
  sw: number;
  sh: number;
}

function useMaskPositions(
  sectionRef: React.RefObject<HTMLElement | null>,
  cardRefs: React.RefObject<(HTMLElement | null)[]>
) {
  const [positions, setPositions] = useState<MaskPosition[]>([]);

  // Uses offsetLeft/offsetTop (layout box) instead of getBoundingClientRect so
  // reveal transforms on the cards don't skew the measured mask offsets.
  const calculatePositions = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;

    const sw = section.offsetWidth;
    const sh = section.offsetHeight;

    const cards = cardRefs.current || [];
    setPositions(
      cards.map((card) => {
        let x = 0;
        let y = 0;
        let node: HTMLElement | null = card;
        while (node && node !== section) {
          x += node.offsetLeft;
          y += node.offsetTop;
          node = node.offsetParent as HTMLElement | null;
        }
        return { x, y, sw, sh };
      })
    );
  }, [sectionRef, cardRefs]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let rafId = 0;
    const schedule = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(calculatePositions);
    };

    calculatePositions();
    const ro = new ResizeObserver(schedule);
    ro.observe(section);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [calculatePositions, sectionRef]);

  return positions;
}

// MASKED CARD COMPONENT
// Every card shows its slice of one shared, section-sized photo ("window" effect).
// The photo is scaled like `background-size: cover` over the whole section, then
// offset by the card's position so the cards line up seamlessly. Several photos
// are stacked and crossfaded via `active`.
interface MaskLayer {
  image: string;
  fx: number;
  fy: number;
}

interface MaskedCardProps {
  layers: MaskLayer[];
  active: number;
  sizes: ImageSizes;
  position?: MaskPosition;
  className?: string;
  children?: React.ReactNode;
  cardRef?: (el: HTMLElement | null) => void;
  style?: React.CSSProperties;
  cursor?: string;
}

function maskLayerStyle(layer: MaskLayer, sizes: ImageSizes, position?: MaskPosition): React.CSSProperties {
  const size = sizes[layer.image];
  const base: React.CSSProperties = { backgroundImage: `url(${layer.image})`, backgroundRepeat: 'no-repeat' };

  if (!position || !size || position.sh <= 0) {
    return { ...base, backgroundSize: 'cover', backgroundPosition: `${layer.fx * 100}% ${layer.fy * 100}%` };
  }

  const scale = Math.max(position.sw / size.w, position.sh / size.h);
  const bw = size.w * scale;
  const bh = size.h * scale;
  const ox = (bw - position.sw) * layer.fx;
  const oy = (bh - position.sh) * layer.fy;
  return {
    ...base,
    backgroundSize: `${bw}px ${bh}px`,
    backgroundPosition: `${-(position.x + ox)}px ${-(position.y + oy)}px`,
    // Scale around the section's centre so zooming every card's layer by the same amount stays seamless
    transformOrigin: `${position.sw / 2 - position.x}px ${position.sh / 2 - position.y}px`,
  };
}

function MaskedCard({ layers, active, sizes, position, className = '', children, cardRef, style, cursor }: MaskedCardProps) {
  return (
    <div ref={cardRef} data-gallery-card data-cursor={cursor} className={`relative overflow-hidden bg-neutral-200 ${className}`} style={style}>
      {/* Hover zoom lives on this wrapper so it never fights the GSAP-driven layer transforms */}
      <div className="absolute inset-0 transition-transform duration-700 ease-[var(--ease-premium)] group-hover/card:scale-[1.04]">
        {layers.map((layer, i) => (
          <div
            key={layer.image}
            data-mask-layer={i}
            aria-hidden="true"
            className="absolute inset-0 transition-opacity duration-700 ease-out"
            style={{ ...maskLayerStyle(layer, sizes, position), opacity: i === active ? 1 : 0 }}
          />
        ))}
      </div>
      {children}
    </div>
  );
}

// MODAL BEHAVIOUR: Esc to close + lock page scroll while open
function useModal(isOpen: boolean, onClose: () => void) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);
}

const MODAL_BACKDROP =
  'fixed inset-0 z-[120] flex items-center justify-center p-4 bg-neutral-950/70 animate-fade-in';

// NAVBAR COMPONENT
interface NavbarProps {
  activeLink: string;
  onNavClick: (target: string) => void;
  onOpenBooking: () => void;
  onOpenEmergency: () => void;
}

function Navbar({ activeLink, onNavClick, onOpenBooking, onOpenEmergency }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // rAF-throttled: transparent over the hero, solid white once the page scrolls
  useEffect(() => {
    let ticking = false;
    const update = () => {
      setScrolled(window.scrollY > 40);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const solid = scrolled || mobileOpen;
  const tone = solid ? 'text-black' : 'text-white';
  const barColor = solid ? 'bg-black' : 'bg-white';
  const headerRef = useRef<HTMLElement | null>(null);

  useModal(mobileOpen, () => setMobileOpen(false));

  // Entrance: logo, links, urgent-care and the booking button settle in sequence alongside the hero intro
  useMotion(headerRef, (root) => {
    gsap.from(root.querySelectorAll('[data-nav-item]'), {
      yPercent: 120,
      autoAlpha: 0,
      duration: 0.8,
      stagger: 0.06,
      delay: 0.55,
      ease: EASE.entrance,
      clearProps: 'transform,opacity,visibility',
    });
  });

  const handleLinkClick = (link: string) => {
    setMobileOpen(false);
    onNavClick(link);
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 grid grid-cols-[1fr_auto] lg:grid-cols-[1fr_auto_1fr] items-center gap-6 px-5 md:px-8 xl:px-10 border-b whitespace-nowrap transition-[height,background-color,border-color] duration-500 ease-[var(--ease-premium)] ${
          solid
            ? 'h-14 md:h-[60px] bg-white/80 backdrop-blur-lg backdrop-saturate-150 border-black/[0.06]'
            : 'h-16 md:h-[72px] bg-transparent border-transparent'
        }`}
      >
        {/* Logo (left side) */}
        <button
          type="button"
          data-nav-item
          onClick={() => handleLinkClick('Home')}
          aria-label="Spects World home"
          className={`justify-self-start flex flex-col items-start cursor-pointer select-none hover:opacity-75 transition-[color,opacity] duration-300 ${tone}`}
        >
          <span className="text-lg md:text-xl font-extrabold uppercase tracking-[0.35em] leading-none">
            Spects
          </span>
          <span className="text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.5em] leading-none mt-1.5 opacity-80">
            World
          </span>
        </button>

        {/* Desktop centered links */}
        <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
          {navLinks.map((link) => (
            <button
              key={link}
              type="button"
              data-nav-item
              onClick={() => handleLinkClick(link)}
              aria-current={link === activeLink ? 'page' : undefined}
              className={`relative py-1 text-xs font-bold uppercase tracking-[0.2em] cursor-pointer transition-[color,opacity] duration-300 group ${tone} ${
                link === activeLink ? 'opacity-100' : 'opacity-70 hover:opacity-100'
              }`}
            >
              {link}
              {/* Underline draws in from the left on hover, retracts to the right on leave */}
              <span
                className={`absolute left-0 -bottom-0.5 h-px w-full transition-transform duration-500 ease-[var(--ease-premium)] ${barColor} ${
                  link === activeLink
                    ? 'scale-x-100 origin-left'
                    : 'scale-x-0 origin-right group-hover:scale-x-100 group-hover:origin-left'
                }`}
              />
            </button>
          ))}
        </nav>

        {/* Right actions */}
        <div className="justify-self-end flex items-center gap-4 md:gap-6">
          <button
            type="button"
            data-nav-item
            onClick={onOpenEmergency}
            className={`hidden md:flex lg:hidden xl:flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] cursor-pointer hover:opacity-70 transition-[color,opacity] duration-300 ${tone}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Urgent Care
          </button>
          <span className={`hidden md:block lg:hidden xl:block w-px h-4 transition-colors duration-500 ${solid ? 'bg-black/20' : 'bg-white/40'}`} />
          <button
            type="button"
            data-nav-item
            onClick={onOpenBooking}
            style={
              (solid ? { '--fill': '#404040', '--fill-text': '#fff' } : { '--fill': '#0a0a0a', '--fill-text': '#fff' }) as React.CSSProperties
            }
            className={`btn-fill hidden md:block px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-[0.15em] cursor-pointer ${
              solid ? 'bg-black text-white' : 'bg-white text-black'
            }`}
          >
            Book Exam
          </button>

          {/* Hamburger (mobile + tablet) */}
          <button
            type="button"
            data-nav-item
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="lg:hidden w-10 h-10 flex items-center justify-center relative focus:outline-none cursor-pointer"
          >
            <span
              className={`absolute h-0.5 w-6 rounded-full transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] ${barColor} ${
                mobileOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'
              }`}
            />
            <span
              className={`absolute h-0.5 w-6 rounded-full transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] ${barColor} ${
                mobileOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'
              }`}
            />
            <span
              className={`absolute h-0.5 w-6 rounded-full transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] ${barColor} ${
                mobileOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'
              }`}
            />
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          onClick={() => setMobileOpen(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity duration-500 ${
            mobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white transition-[transform,visibility] duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
            mobileOpen ? 'translate-x-0 shadow-2xl visible' : 'translate-x-full invisible'
          }`}
        >
          <div className="flex flex-col justify-center h-full px-8 gap-1">
            {navLinks.map((link, i) => (
              <button
                key={link}
                type="button"
                onClick={() => handleLinkClick(link)}
                style={{
                  transitionDelay: mobileOpen ? `${100 + i * 60}ms` : '0ms',
                }}
                className={`text-left text-4xl font-bold text-black hover:text-neutral-500 transition-[opacity,transform,color] duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] cursor-pointer ${
                  mobileOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                }`}
              >
                {link}
              </button>
            ))}

            {/* Bottom section */}
            <div
              style={{
                transitionDelay: mobileOpen ? '450ms' : '0ms',
              }}
              className={`mt-8 pt-8 border-t border-neutral-200 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                mobileOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  onOpenEmergency();
                }}
                className="text-sm font-semibold text-black mb-4 flex items-center gap-2 cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Urgent Eye Care Hotline
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  onOpenBooking();
                }}
                className="w-full px-6 py-4 bg-black rounded-full text-white text-sm font-semibold hover:bg-neutral-800 transition-colors duration-200 cursor-pointer shadow-lg"
              >
                Book Eye Exam
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// HERO SLIDER COMPONENT
// One GSAP controller owns every visual state of the hero: the intro timeline,
// clip-path slide transitions, masked headline swaps, progress bars, Ken Burns
// drift and scroll parallax. React state only tracks the active index for labels/ARIA.
interface HeroSliderProps {
  sectionRef: (el: HTMLElement | null) => void;
  onOpenBooking: () => void;
  onExplore: () => void;
}

type PauseReason = 'controls' | 'focus' | 'hidden' | 'offscreen';

function HeroSlider({ sectionRef, onOpenBooking, onExplore }: HeroSliderProps) {
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLElement | null>(null);
  const api = useRef<{ goTo: (index: number, dir?: number) => void; pause: (r: PauseReason, on: boolean) => void } | null>(
    null
  );
  const touchX = useRef<number | null>(null);

  const setRefs = useCallback(
    (el: HTMLElement | null) => {
      rootRef.current = el;
      sectionRef(el);
    },
    [sectionRef]
  );

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = prefersReducedMotion();
    const n = HERO_SLIDES.length;
    const q = gsap.utils.selector(root);
    let startText: (() => void) | null = null;

    const ctx = gsap.context(() => {
      const layers = q<HTMLElement>('[data-hero-layer]');
      const imgs = q<HTMLElement>('[data-hero-img]');
      const drifts = q<HTMLElement>('[data-hero-drift]');
      const copies = q<HTMLElement>('[data-hero-copy]');
      const bars = q<HTMLElement>('[data-hero-bar]');
      const part = (i: number, name: string) => copies[i].querySelector<HTMLElement>(`[data-hero-${name}]`)!;
      // Split after fonts load (see start()) so line breaks match the final typeface
      let splits: SplitText[] = [];

      let current = 0;
      let intro: gsap.core.Timeline | null = null;
      let transition: gsap.core.Timeline | null = null;
      let progress: gsap.core.Tween | null = null;
      let drift: gsap.core.Tween | null = null;
      const reasons = new Set<PauseReason>();

      const applyPause = () => {
        const paused = reasons.size > 0;
        [progress, drift].forEach((t) => t && (paused ? t.pause() : t.resume()));
      };

      const startProgress = (i: number) => {
        progress?.kill();
        gsap.set(bars, { scaleX: 0 });
        if (reduce) {
          gsap.set(bars[i], { scaleX: 1 });
          return;
        }
        progress = gsap.to(bars[i], {
          scaleX: 1,
          duration: HERO_INTERVAL / 1000,
          ease: 'none',
          onComplete: () => goTo(current + 1, 1),
        });
        applyPause();
      };

      // Extremely gentle Ken Burns drift on the active photo (alternating direction per slide)
      const startDrift = (i: number) => {
        drift?.kill();
        if (reduce) return;
        drift = gsap.fromTo(
          drifts[i],
          { scale: 1, xPercent: 0 },
          { scale: 1.045, xPercent: i % 2 ? -1 : 1, duration: HERO_INTERVAL / 1000 + 2, ease: EASE.ambient }
        );
        applyPause();
      };

      const goTo = (target: number, dir?: number) => {
        const next = ((target % n) + n) % n;
        if (next === current || !splits.length) return;
        // Finish the intro / any running transition instantly so timelines never overlap on rapid clicks
        intro?.progress(1).kill();
        intro = null;
        transition?.progress(1).kill();
        const prev = current;
        const direction = dir ?? (next > prev ? 1 : -1);
        current = next;
        setActive(next);
        startProgress(next);
        startDrift(next);

        const settle = () => {
          gsap.set(layers[prev], { autoAlpha: 0, zIndex: 0 });
          gsap.set(layers[next], { zIndex: 1 });
          gsap.set(imgs[prev], { scale: 1 });
          gsap.set(copies[prev], { autoAlpha: 0 });
        };

        if (reduce) {
          gsap.set(layers[next], { zIndex: 2, autoAlpha: 0 });
          gsap.set(copies[next], { autoAlpha: 0 });
          transition = gsap
            .timeline({ onComplete: settle })
            .to(layers[next], { autoAlpha: 1, duration: 0.4 }, 0)
            .to(copies[prev], { autoAlpha: 0, duration: 0.2 }, 0)
            .to(copies[next], { autoAlpha: 1, duration: 0.3 }, 0.15);
          return;
        }

        // Next photo wipes in from the side we are travelling towards
        const fromClip = direction > 0 ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)';
        transition = gsap
          .timeline({ defaults: { ease: EASE.image }, onComplete: settle })
          // outgoing copy exits upward through its masks
          .to(splits[prev].lines, { yPercent: -110, duration: 0.55, stagger: 0.06, ease: 'power3.in' }, 0)
          .to([part(prev, 'eyebrow'), part(prev, 'text')], { autoAlpha: 0, y: -14, duration: 0.4, ease: 'power2.in' }, 0)
          // incoming photo: directional clip reveal while settling from a slight zoom, old photo pushes in
          .set(layers[next], { autoAlpha: 1, zIndex: 2, clipPath: fromClip }, 0.1)
          .to(layers[next], { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3 }, 0.1)
          .fromTo(imgs[next], { scale: 1.08 }, { scale: 1, duration: 1.5, ease: EASE.text }, 0.1)
          .to(imgs[prev], { scale: 1.06, duration: 1.3 }, 0.1)
          // incoming copy rises into place
          .set(copies[next], { autoAlpha: 1 }, 0.5)
          .fromTo(splits[next].lines, { yPercent: 110 }, { yPercent: 0, duration: 0.95, stagger: 0.12, ease: EASE.headline }, 0.55)
          .fromTo(part(next, 'eyebrow'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: EASE.text }, 0.5)
          .fromTo(part(next, 'text'), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: EASE.text }, 0.75)
          .fromTo(q('[data-hero-cta]'), { y: 10 }, { y: 0, duration: 0.7, stagger: 0.06, ease: EASE.text }, 0.8);
      };

      const pause = (r: PauseReason, on: boolean) => {
        if (on) reasons.add(r);
        else reasons.delete(r);
        applyPause();
      };
      api.current = { goTo, pause };

      // Initial stacking: only the first slide is visible
      gsap.set(layers, { autoAlpha: 0, zIndex: 0 });
      gsap.set(layers[0], { autoAlpha: 1, zIndex: 1 });
      gsap.set(copies.slice(1), { autoAlpha: 0 });
      gsap.set(bars, { scaleX: 0, transformOrigin: '0% 50%' });

      // Headline split waits for the web font so line breaks are final; the title stays hidden until then
      const title0 = part(0, 'title');
      if (!reduce) gsap.set(title0, { autoAlpha: 0 });
      let lastWidth = window.innerWidth;
      const onResize = () => {
        if (!splits.length || window.innerWidth === lastWidth) return;
        lastWidth = window.innerWidth;
        // Re-flow lines for the new width; finished state = active copy visible, others hidden via autoAlpha
        transition?.progress(1).kill();
        intro?.progress(1).kill();
        splits.forEach((s) => s.split(SPLIT_LINES_STATIC));
      };
      startText = () => {
        splits = copies.map((_, i) => SplitText.create(part(i, 'title'), SPLIT_LINES_STATIC));
        if (reduce) return;
        gsap.set(title0, { autoAlpha: 1 });
        // Slot the line reveal into the intro at ~0.75s, even if the font arrived a little late
        gsap.fromTo(
          splits[0].lines,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 0.95,
            stagger: 0.12,
            ease: EASE.headline,
            delay: Math.max(0, 0.85 - (intro?.time() ?? 1)),
          }
        );
      };
      window.addEventListener('resize', onResize);

      if (reduce) {
        startProgress(0);
      } else {
        // Cinematic intro: framed photo opens to full bleed, then type rises through masks
        intro = gsap
          .timeline({ delay: 0.1, onComplete: () => startProgress(current) })
          .fromTo(
            layers[0],
            { clipPath: 'inset(9% 7% 9% 7% round 28px)' },
            { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1.4, ease: 'power3.inOut' },
            0
          )
          .fromTo(imgs[0], { scale: 1.12 }, { scale: 1, duration: 1.6, ease: 'power3.inOut' }, 0)
          .fromTo(q('[data-hero-overlay]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.2, ease: 'power2.out' }, 0.15)
          .fromTo(part(0, 'eyebrow'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: EASE.text }, 0.7)
          .fromTo(part(0, 'text'), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: EASE.text }, 1.0)
          .fromTo(q('[data-hero-cta]'), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08, ease: EASE.text }, 1.1)
          .fromTo(q('[data-hero-track]'), { scaleX: 0 }, { scaleX: 1, transformOrigin: '0% 50%', duration: 0.9, stagger: 0.08, ease: EASE.entrance }, 1.15)
          .fromTo(q('[data-hero-tab-label]'), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: EASE.text }, 1.2)
          .fromTo(q('[data-hero-arrow]'), { autoAlpha: 0, x: 8 }, { autoAlpha: 1, x: 0, duration: 0.6, stagger: 0.06, ease: EASE.text }, 1.3);
        startDrift(0);
      }

      // Pause when the tab is hidden or the hero is scrolled away
      const onVisibility = () => pause('hidden', document.hidden);
      document.addEventListener('visibilitychange', onVisibility);
      ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: 'bottom top',
        onToggle: (self) => pause('offscreen', !self.isActive),
      });

      // Scroll depth: photo drifts slower than the page, copy lifts away faster, overlay deepens
      if (allowParallax()) {
        gsap
          .timeline({ scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: 0.6 } })
          .to(q('[data-hero-parallax]'), { yPercent: 22, scale: 1.06, ease: 'none' }, 0)
          .to(q('[data-hero-content]'), { yPercent: -18, opacity: 0.15, ease: 'none' }, 0)
          .to(q('[data-hero-controls]'), { y: -40, opacity: 0, ease: 'none' }, 0)
          .to(q('[data-hero-deepen]'), { opacity: 0.55, ease: 'none' }, 0);
      }

      return () => {
        document.removeEventListener('visibilitychange', onVisibility);
        window.removeEventListener('resize', onResize);
      };
    }, root);

    let alive = true;
    (document.fonts?.ready ?? Promise.resolve()).then(() => {
      if (alive && startText) ctx.add(startText);
    });

    return () => {
      alive = false;
      api.current = null;
      ctx.revert();
    };
  }, []);

  const goTo = (index: number, dir?: number) => api.current?.goTo(index, dir);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') goTo(active + 1, 1);
    else if (e.key === 'ArrowLeft') goTo(active - 1, -1);
  };

  return (
    <section
      ref={setRefs}
      aria-roledescription="carousel"
      aria-label="Featured services"
      onKeyDown={onKeyDown}
      onFocus={() => api.current?.pause('focus', true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && api.current?.pause('focus', false)}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) goTo(active + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
      className="relative h-svh min-h-[560px] w-full overflow-hidden bg-neutral-950 text-white"
    >
      {/* Background slides (stacked layers so transitions never show a blank frame) */}
      <div data-hero-parallax className="absolute inset-0 will-change-transform">
        {HERO_SLIDES.map((s, i) => (
          <div key={s.label} data-hero-layer aria-hidden={i !== active} className="absolute inset-0 overflow-hidden">
            <div data-hero-drift className="absolute inset-0">
              <img
                data-hero-img
                src={s.image}
                alt=""
                width={1376}
                height={896}
                decoding="async"
                style={{ objectPosition: s.position }}
                className="w-full h-full object-cover"
                fetchPriority={i === 0 ? 'high' : 'low'}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Readability overlays */}
      <div data-hero-overlay className="absolute inset-0 z-[3] pointer-events-none">
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      <div data-hero-deepen className="absolute inset-0 z-[3] bg-black opacity-0 pointer-events-none" />

      {/* Centered headline (all slides stacked in one grid cell, swapped by GSAP) */}
      <div data-hero-content className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <div className="grid">
          {HERO_SLIDES.map((s, i) => (
            <div
              key={s.label}
              data-hero-copy
              aria-hidden={i !== active}
              className="[grid-area:1/1] flex flex-col items-center"
            >
              <span data-hero-eyebrow className="text-[11px] md:text-xs font-bold uppercase tracking-[0.4em] text-white/80 mb-5">
                {s.eyebrow}
              </span>
              {i === 0 ? (
                <h1 data-hero-title className="max-w-5xl text-[clamp(2.5rem,7.5vw,6.5rem)] font-extrabold uppercase leading-[0.95] tracking-tight">
                  {s.title}
                </h1>
              ) : (
                <h2 data-hero-title className="max-w-5xl text-[clamp(2.5rem,7.5vw,6.5rem)] font-extrabold uppercase leading-[0.95] tracking-tight">
                  {s.title}
                </h2>
              )}
              <p data-hero-text className="max-w-xl mt-6 text-sm md:text-lg text-white/85 leading-relaxed">
                {s.text}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 mt-10">
          <button
            type="button"
            data-hero-cta
            onClick={onOpenBooking}
            style={{ '--fill': '#0a0a0a', '--fill-text': '#fff' } as React.CSSProperties}
            className="btn-fill flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full text-xs font-bold uppercase tracking-[0.2em] cursor-pointer"
          >
            Book an Eye Exam
            <ArrowIcon className="btn-arrow" />
          </button>
          <button
            type="button"
            data-hero-cta
            onClick={onExplore}
            style={{ '--fill': '#fff', '--fill-text': '#0a0a0a' } as React.CSSProperties}
            className="btn-fill px-8 py-4 rounded-full border border-white/60 text-white text-xs font-bold uppercase tracking-[0.2em] cursor-pointer"
          >
            Explore Services
          </button>
        </div>
      </div>

      {/* Bottom bar: slide tabs + arrows */}
      <div
        data-hero-controls
        onPointerEnter={() => api.current?.pause('controls', true)}
        onPointerLeave={() => api.current?.pause('controls', false)}
        className="absolute bottom-0 inset-x-0 z-10 px-5 md:px-10 pb-6 md:pb-8"
      >
        <div className="flex items-end justify-between gap-6">
          <div className="flex-1 grid grid-cols-3 gap-3 md:gap-6 max-w-3xl">
            {HERO_SLIDES.map((s, i) => (
              <button
                key={s.label}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Show ${s.label}`}
                aria-current={i === active}
                className="text-left cursor-pointer group py-2"
              >
                <span data-hero-track className="block h-px w-full bg-white/25 overflow-hidden">
                  <span data-hero-bar className="block h-full bg-white" />
                </span>
                <span
                  data-hero-tab-label
                  className={`hidden sm:flex items-baseline gap-2 mt-3 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${
                    i === active ? 'text-white' : 'text-white/45 group-hover:text-white/80'
                  }`}
                >
                  <span className="tabular-nums">0{i + 1}</span>
                  {s.label}
                </span>
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            {[-1, 1].map((dir) => (
              <button
                key={dir}
                type="button"
                data-hero-arrow
                onClick={() => goTo(active + dir, dir)}
                aria-label={dir < 0 ? 'Previous slide' : 'Next slide'}
                style={{ '--fill': '#fff', '--fill-text': '#0a0a0a' } as React.CSSProperties}
                className="btn-fill group w-11 h-11 rounded-full border border-white/40 flex items-center justify-center cursor-pointer"
              >
                <ArrowIcon className={dir < 0 ? 'rotate-180' : ''} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ArrowIcon({ className = '', size = 14 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M2 8h12m0 0L8 2m6 6L8 14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CalendarIcon({ className = '' }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

// CONTEXT CURSOR — desktop/fine-pointer only. A small label that trails the native cursor over
// elements marked `data-cursor="Label"`; hidden over nested controls and disabled for reduced motion.
function ContextCursor() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [label, setLabel] = useState('');

  useEffect(() => {
    const el = ref.current;
    if (!el || !isFinePointer() || prefersReducedMotion()) return;
    gsap.set(el, { autoAlpha: 0, scale: 0.4 });
    const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: EASE.text });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: EASE.text });
    let current: string | null = null;

    const show = (next: string | null) => {
      if (next === current) return;
      current = next;
      if (next) setLabel(next);
      gsap.to(el, { autoAlpha: next ? 1 : 0, scale: next ? 1 : 0.4, duration: 0.35, ease: EASE.text, overwrite: 'auto' });
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return show(null);
      xTo(e.clientX);
      yTo(e.clientY);
      const target = e.target as Element | null;
      const zone = target?.closest?.('[data-cursor]');
      const control = target?.closest?.('a, button, input, select, textarea, label');
      // Over a nested control (e.g. a button inside a gallery card) the standard pointer is clearer
      show(zone && (!control || control === zone) ? zone.getAttribute('data-cursor') : null);
    };
    const onLeave = () => show(null);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="invisible pointer-events-none fixed left-0 top-0 z-[200] ml-4 mt-4 px-3 py-1.5 rounded-full bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em]"
    >
      {label}
    </div>
  );
}

// INTERACTIVE APPOINTMENT MODAL
interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const toISODate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const BOOKING_SERVICES = [
  'Comprehensive Eye Examination & Wavefront Scan',
  'Bespoke Designer Frame Styling & Fitting',
  'Digital Progressive Lens Customization',
  'Specialty Contact Lens Evaluation',
  'Pediatric Vision Assessment',
];

function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [bookingId, setBookingId] = useState('');
  const [formData, setFormData] = useState(() => ({
    service: BOOKING_SERVICES[0],
    date: toISODate(new Date(Date.now() + 86400000)),
    time: '10:30 AM',
    patientName: '',
    phone: '',
    email: '',
  }));

  const resetAndClose = () => {
    setStep('form');
    onClose();
  };

  useModal(isOpen, resetAndClose);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingId(`SW-${new Date().getFullYear()}-${Math.floor(Math.random() * 90000 + 10000)}`);
    setStep('success');
  };

  return (
    <div className={MODAL_BACKDROP} onClick={resetAndClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Book an eye exam"
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-lg rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto overscroll-contain"
      >
        <button
          type="button"
          onClick={resetAndClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-black flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          ✕
        </button>

        {step === 'form' ? (
          <div>
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Spects World • Appointment Concierge
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-black tracking-tight mt-1">
                Book Your Vision Consultation
              </h3>
              <p className="text-xs md:text-sm text-neutral-600 mt-1">
                45-minute comprehensive clinical optometry & custom lens mapping.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
                  Select Service
                </label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-black focus:outline-none bg-neutral-50 font-medium"
                >
                  {BOOKING_SERVICES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    required
                    min={toISODate(new Date())}
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-black focus:outline-none bg-neutral-50 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
                    Preferred Time Slot
                  </label>
                  <select
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-black focus:outline-none bg-neutral-50 font-medium"
                  >
                    <option>09:30 AM</option>
                    <option>10:30 AM</option>
                    <option>01:15 PM</option>
                    <option>03:00 PM</option>
                    <option>05:30 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Marcus Vance"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-black focus:outline-none bg-neutral-50 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(201) 555-0199"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-black focus:outline-none bg-neutral-50 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-black focus:outline-none bg-neutral-50 font-medium"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 bg-black text-white rounded-full font-bold text-sm hover:bg-neutral-800 transition-colors cursor-pointer shadow-lg"
                >
                  Confirm Appointment Request
                </button>
                <p className="text-[11px] text-center text-neutral-500 mt-2">
                  No advance payment needed. Direct insurance verification upon arrival.
                </p>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl font-bold mb-4">
              ✓
            </div>
            <h3 className="text-2xl font-bold text-black mb-2">Appointment Reserved!</h3>
            <p className="text-sm text-neutral-600 mb-4 max-w-sm mx-auto">
              Thank you, <strong>{formData.patientName || 'valued patient'}</strong>. A confirmation SMS & calendar invite has been dispatched for <strong>{formData.date}</strong> at <strong>{formData.time}</strong>.
            </p>
            <div className="p-4 bg-neutral-100 rounded-xl text-left text-xs space-y-1 mb-6 text-neutral-700">
              <div><strong>Clinic:</strong> Spects World Flagship Studio</div>
              <div><strong>Address:</strong> 6024 Bergenline Ave, West New York, NJ</div>
              <div><strong>Service:</strong> {formData.service}</div>
              <div><strong>Booking ID:</strong> {bookingId}</div>
            </div>
            <button
              type="button"
              onClick={resetAndClose}
              className="px-8 py-3 bg-black text-white rounded-full font-semibold text-sm hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// URGENT EYE CARE MODAL
interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function EmergencyModal({ isOpen, onClose }: EmergencyModalProps) {
  useModal(isOpen, onClose);
  if (!isOpen) return null;

  return (
    <div className={MODAL_BACKDROP} onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Urgent eye care"
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl relative"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-black flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="flex items-center gap-2 mb-3">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Optometrist On-Call 24/7
          </span>
        </div>

        <h3 className="text-2xl font-extrabold text-black tracking-tight mb-2">
          Urgent Eye Care & Triage
        </h3>
        <p className="text-xs md:text-sm text-neutral-600 mb-4">
          If you are experiencing sudden flashes of light, painful eye trauma, sudden vision loss, or a foreign body sensation, our optical physicians provide immediate same-day priority triage.
        </p>

        <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2 mb-5">
          <div className="text-xs font-bold text-black uppercase tracking-wider">
            Direct Emergency Hotline
          </div>
          <div className="text-2xl font-extrabold text-black tracking-tight">
            +1 (201) 869-2020
          </div>
          <div className="text-xs text-neutral-500">
            Open daily: 6024 Bergenline Ave, West New York, NJ
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <a
            href="tel:2018692020"
            className="w-full py-3.5 bg-black text-white rounded-full font-bold text-center text-sm hover:bg-neutral-800 transition-colors shadow-md"
          >
            Call Physician Now
          </a>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 border border-neutral-300 rounded-full font-semibold text-center text-sm text-neutral-700 hover:border-black hover:text-black transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// LEGAL NOTICE MODAL (Privacy, Terms, HIPAA, Accessibility)
interface LegalModalProps {
  type: 'privacy' | 'terms' | 'hipaa' | 'accessibility' | null;
  onClose: () => void;
}

function LegalModal({ type, onClose }: LegalModalProps) {
  useModal(type !== null, onClose);
  if (!type) return null;

  const contentMap = {
    privacy: {
      title: 'Privacy Policy',
      subtitle: 'Last updated: January 2026 • Patient Confidentiality Standard',
      text: `Spects World operates in strict compliance with federal privacy guidelines. We collect personal contact information and prescription records solely to produce custom prescription eyewear, facilitate optical triage, and bill your vision insurance carrier. We never sell, distribute, or monetize patient diagnostic records or contact information to third-party advertisers.`,
    },
    terms: {
      title: 'Terms of Service',
      subtitle: 'Standard Eyecare & Custom Lens Crafting Terms',
      text: `All custom spectacle lenses crafted by Spects World come with a complimentary 30-day progressive lens adaptation guarantee and a 1-year anti-scratch coating warranty. Frames purchased from our designer collection are eligible for free lifetime adjustments and ultrasonic cleanings at our West New York clinic studio.`,
    },
    hipaa: {
      title: 'HIPAA Compliance Notice',
      subtitle: 'Health Insurance Portability and Accountability Act',
      text: `Your electronic medical records (EMR), including corneal topography scans, optical coherence tomography (OCT) data, and spectacle prescription histories, are encrypted using AES-256 standard protocols. Only credentialed optometrists and optical lab technicians directly involved in your care are authorized to access your clinical files.`,
    },
    accessibility: {
      title: 'Accessibility Statement',
      subtitle: 'Vision & Physical Inclusivity Commitment',
      text: `Spects World is dedicated to making both our physical boutique and online digital experience fully accessible to individuals with low vision, photophobia, or physical mobility restrictions. Our clinic features zero-step wheelchair access and high-contrast diagnostic instrumentation.`,
    },
  };

  const item = contentMap[type];

  return (
    <div className={MODAL_BACKDROP} onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={item.title}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-lg rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl relative max-h-[85vh] overflow-y-auto overscroll-contain"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-black flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          ✕
        </button>

        <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
          Legal & Compliance
        </span>
        <h3 className="text-2xl font-extrabold text-black tracking-tight mt-1 mb-1">
          {item.title}
        </h3>
        <p className="text-xs font-semibold text-neutral-500 mb-4">{item.subtitle}</p>

        <div className="prose text-xs md:text-sm text-neutral-700 leading-relaxed space-y-3 mb-6 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
          <p>{item.text}</p>
          <p>
            For questions regarding clinical records or requests for physical transcripts, please contact our Compliance Officer at <strong>compliance@spectsworld.com</strong> or call (201) 869-2020.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 bg-black text-white rounded-full font-semibold text-sm hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          I Understand
        </button>
      </div>
    </div>
  );
}

// EYE CARE SECTION — editorial portrait reveal, masked heading, drawn service rows
interface EyeCareSectionProps {
  sectionRef: (el: HTMLElement | null) => void;
  onOpenBooking: () => void;
  onOpenTerms: () => void;
}

function EyeCareSection({ sectionRef, onOpenBooking, onOpenTerms }: EyeCareSectionProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const setRefs = useCallback(
    (el: HTMLElement | null) => {
      rootRef.current = el;
      sectionRef(el);
    },
    [sectionRef]
  );

  useMotion(rootRef, (root) => {
    const q = gsap.utils.selector(root);
    const start = 'top 72%';
    revealImage(q('[data-photo]')[0], q('[data-photo-img]')[0], { trigger: root, start });
    revealUp(q('[data-eyebrow]'), { trigger: root, start, y: 12, delay: 0.15 });
    revealLines(q('h2')[0], { trigger: root, start, delay: 0.2, stagger: 0.1 });
    revealUp(q('[data-intro]'), { trigger: root, start, delay: 0.45 });

    // Rows: dividers draw left → right, then each row's text rises in sequence
    gsap
      .timeline({ scrollTrigger: { trigger: q('[data-steps]')[0], start: 'top 85%', once: true } })
      .from(q('[data-step-divider]'), { scaleX: 0, transformOrigin: '0% 50%', duration: 1.1, stagger: 0.12, ease: 'power3.inOut' }, 0)
      .from(q('[data-step-content]'), { y: 22, autoAlpha: 0, duration: 0.8, stagger: 0.12, ease: EASE.text }, 0.2);

    revealUp(q('[data-cta]'), { trigger: q('[data-cta]')[0], start: 'top 95%', stagger: 0.08, y: 16 });

    // Gentle depth: the portrait drifts within its frame while the text stays put
    if (allowParallax()) {
      gsap.fromTo(
        q('[data-photo-img]'),
        { yPercent: -5 },
        { yPercent: 5, ease: 'none', scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true } }
      );
    }
  });

  return (
    <section
      ref={setRefs}
      className="scroll-mt-16 md:scroll-mt-[72px] px-5 md:px-8 xl:px-10 pt-20 md:pt-32 pb-4 md:pb-6"
    >
      <div className="mx-auto max-w-7xl grid md:grid-cols-2 gap-12 md:gap-20 items-center">
        <div data-photo className="relative aspect-[4/5] xl:aspect-[6/7] rounded-2xl overflow-hidden bg-neutral-100">
          <img
            data-photo-img
            src={SECTION3_BG}
            alt="Patient with clear vision wearing fashionable spectacles"
            decoding="async"
            loading="lazy"
            className="absolute inset-x-0 -top-[6%] h-[112%] w-full object-cover"
          />
          <span className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-white text-[11px] font-semibold text-black">
            Zeiss wavefront diagnostics
          </span>
        </div>

        <div>
          <span data-eyebrow className="block text-[11px] font-bold uppercase tracking-[0.3em] text-neutral-500">
            Eye Care
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight leading-[1.05] text-black">
            Precision optometry, without the rush.
          </h2>
          <p data-intro className="mt-5 text-base xl:text-lg text-neutral-600 leading-relaxed max-w-lg">
            Every visit follows the same careful process, from your first scan to the day your new glasses feel like
            your own.
          </p>

          <ol data-steps className="relative mt-10">
            <span data-step-divider aria-hidden="true" className="absolute top-0 inset-x-0 h-px bg-neutral-200" />
            {CARE_STEPS.map((step, i) => (
              <li key={step.title} className="group relative py-5">
                <div data-step-content className="grid grid-cols-[3rem_1fr] gap-2">
                  <span className="text-xs font-semibold text-neutral-400 tabular-nums pt-1 transition-colors duration-500 group-hover:text-black">
                    0{i + 1}
                  </span>
                  <div className="transition-transform duration-500 ease-[var(--ease-premium)] group-hover:translate-x-1.5">
                    <h3 className="text-lg font-bold text-black">{step.title}</h3>
                    <p className="mt-1 text-sm text-neutral-600 leading-relaxed">{step.text}</p>
                  </div>
                </div>
                {/* Divider: drawn on scroll, darkens left → right on hover */}
                <span data-step-divider aria-hidden="true" className="absolute bottom-0 inset-x-0 h-px bg-neutral-200 overflow-hidden">
                  <span className="absolute inset-0 bg-neutral-900 origin-left scale-x-0 transition-transform duration-700 ease-[var(--ease-premium)] group-hover:scale-x-100" />
                </span>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <button
              type="button"
              data-cta
              onClick={onOpenBooking}
              style={{ '--fill': '#404040', '--fill-text': '#fff' } as React.CSSProperties}
              className="btn-fill flex items-center gap-3 px-7 py-4 rounded-full bg-black text-white text-xs font-bold uppercase tracking-[0.18em] cursor-pointer"
            >
              Book Online
              <ArrowIcon className="btn-arrow" />
            </button>
            <button
              type="button"
              data-cta
              onClick={onOpenTerms}
              className="text-sm font-semibold text-black underline underline-offset-4 decoration-neutral-300 hover:decoration-black transition-colors cursor-pointer"
            >
              Our lens guarantee
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// VISION GALLERY / SERVICES SECTION — campaign-style panels over one shared photo, expanding service tiles
interface VisionGallerySectionProps {
  sectionRef: (el: HTMLElement | null) => void;
  onCall: () => void;
}

function VisionGallerySection({ sectionRef, onCall }: VisionGallerySectionProps) {
  const isMobile = useIsMobile();
  const [activeService, setActiveService] = useState(0);
  const service = SERVICES[activeService];
  const rootRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const positions = useMaskPositions(rootRef, cardRefs);
  const sizes = useImageSizes(SERVICES.map((s) => s.image));
  // On mobile the cards stack vertically, so each card crops its own photo instead of sharing one
  const mask = (i: number) => ({
    layers: SERVICES,
    active: activeService,
    sizes,
    position: isMobile ? undefined : positions[i],
    cardRef: (el: HTMLElement | null) => {
      cardRefs.current[i] = el;
    },
  });

  const setRefs = useCallback(
    (el: HTMLElement | null) => {
      rootRef.current = el;
      sectionRef(el);
    },
    [sectionRef]
  );

  useMotion(rootRef, (root) => {
    const q = gsap.utils.selector(root);
    // Entrance: panels rise out of a bottom clip one after another, the photo settles, then copy and tiles
    gsap
      .timeline({ scrollTrigger: { trigger: root, start: 'top 70%', once: true } })
      .fromTo(
        q('[data-gallery-card]'),
        { clipPath: 'inset(100% 0% 0% 0% round 16px)', y: 60 },
        { clipPath: 'inset(0% 0% 0% 0% round 16px)', y: 0, duration: 1.2, stagger: 0.15, ease: EASE.entrance, clearProps: 'clipPath' },
        0
      )
      .fromTo(q('[data-mask-layer]'), { scale: 1.1 }, { scale: 1, duration: 1.6, ease: EASE.text }, 0)
      .from(q('[data-gallery-text]'), { y: 24, autoAlpha: 0, duration: 0.8, stagger: 0.1, ease: EASE.text }, 0.55)
      // clearProps hands opacity back to the tiles' own hover/active classes once they're in
      .from(q('[role="tab"]'), { y: 20, autoAlpha: 0, duration: 0.7, stagger: 0.07, ease: EASE.text, clearProps: 'all' }, 0.7);

    // Opens up from a slightly inset frame as it approaches the centre of the viewport
    if (allowParallax()) {
      gsap.fromTo(
        q('[data-gallery-grid]'),
        { scale: 0.95 },
        { scale: 1, ease: 'none', scrollTrigger: { trigger: root, start: 'top bottom', end: 'top 15%', scrub: 0.6 } }
      );
    }
  });

  // Selecting a service: its photo settles from a slight zoom and the left-panel copy rises through masks
  const firstRun = useRef(true);
  useLayoutEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;
    const q = gsap.utils.selector(root);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        q(`[data-mask-layer="${activeService}"]`),
        { scale: 1.06 },
        { scale: 1, duration: 1.3, ease: EASE.image, overwrite: 'auto' }
      );
      const split = SplitText.create(q('[data-service-headline]')[0], SPLIT_LINES_STATIC);
      gsap
        .timeline()
        .from(split.lines, { yPercent: 110, duration: 0.85, stagger: 0.08, ease: EASE.headline })
        .from(q('[data-service-meta]'), { y: 14, autoAlpha: 0, duration: 0.6, stagger: 0.06, ease: EASE.text }, 0.1);
    }, root);
    return () => ctx.revert();
  }, [activeService]);

  return (
    <section
      ref={setRefs}
      className="relative min-h-screen md:h-[max(100svh,720px)] w-full overflow-hidden flex flex-col pt-[72px] md:pt-[84px] px-3 md:px-5 pb-1.5 md:pb-2 gap-1.5 md:gap-2"
    >
      <div
        data-gallery-grid
        className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 md:grid-rows-[1.9fr_1fr] gap-1.5 md:gap-2"
      >
        {/* Card 0 - Left: copy for the selected service */}
        <MaskedCard {...mask(0)} cursor="View" className="group/card rounded-xl md:rounded-2xl min-h-[320px] md:min-h-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/25" />
          <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover/card:bg-black/10" />
          <div className="relative z-10 h-full flex flex-col justify-between p-5 md:p-8 text-white">
            <span data-gallery-text className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/85">
              Vision Gallery
            </span>
            <div data-gallery-text>
              {/* keyed so React swaps the node instead of patching text GSAP has split */}
              <div
                key={activeService}
                className="max-w-md transition-transform duration-500 ease-[var(--ease-premium)] group-hover/card:-translate-y-1.5"
              >
                <span
                  data-service-meta
                  className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/70 mb-3 tabular-nums"
                >
                  {service.num} / {String(SERVICES.length).padStart(2, '0')}
                </span>
                <h2 data-service-headline className="text-3xl md:text-[2.75rem] font-bold leading-[1.05] tracking-tight">
                  {service.headline}
                </h2>
                <p
                  data-service-meta
                  className="mt-3 text-sm md:text-base text-white/80 leading-relaxed transition-colors duration-500 group-hover/card:text-white"
                >
                  {service.desc}
                </p>
              </div>
            </div>
          </div>
        </MaskedCard>

        {/* Card 1 - Right: call-to-action */}
        <MaskedCard {...mask(1)} cursor="View" className="group/card rounded-xl md:rounded-2xl min-h-[220px] md:min-h-0">
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/65 to-transparent transition-opacity duration-500 group-hover/card:opacity-90" />
          <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover/card:bg-black/10" />
          <div data-gallery-text className="relative z-10 h-full flex items-end justify-between gap-4 p-5 md:p-8">
            <p className="max-w-xs text-sm md:text-base font-semibold text-white/85 leading-snug transition-[color,transform] duration-500 ease-[var(--ease-premium)] group-hover/card:text-white group-hover/card:-translate-y-1">
              Not sure what you need? Talk to an optician about frames, lenses or a check-up.
            </p>
            <button
              type="button"
              onClick={onCall}
              style={{ '--fill': '#0a0a0a', '--fill-text': '#fff' } as React.CSSProperties}
              className="btn-fill shrink-0 flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 bg-white rounded-full text-black text-sm md:text-base font-bold cursor-pointer"
            >
              Call Us
              <ArrowIcon className="btn-arrow" />
            </button>
          </div>
        </MaskedCard>

        {/* Card 2 - Bottom Full Width: service selector (tiles expand on hover on desktop) */}
        <MaskedCard {...mask(2)} className="md:col-span-2 rounded-xl md:rounded-2xl">
          <div
            role="tablist"
            aria-label="Services"
            className="relative z-10 h-full grid grid-cols-2 md:flex gap-1.5 md:gap-2 p-1.5 md:p-2"
          >
            {SERVICES.map((svc, idx) => {
              const isActive = idx === activeService;
              return (
                <button
                  type="button"
                  role="tab"
                  key={svc.name}
                  onClick={() => setActiveService(idx)}
                  aria-selected={isActive}
                  data-cursor="Explore"
                  className={`group/tile relative min-h-[120px] md:min-w-0 md:basis-0 text-left rounded-lg md:rounded-xl p-3 md:p-5 flex flex-col justify-between gap-3 overflow-hidden cursor-pointer transition-[flex-grow,background-color,color,opacity] duration-700 ease-[var(--ease-premium)] md:hover:grow-[1.5] ${
                    isActive
                      ? 'bg-white text-black md:grow-[1.25]'
                      : 'bg-black/35 text-white hover:bg-black/50 opacity-90 hover:opacity-100 md:grow-[1]'
                  }`}
                >
                  <div className="transition-transform duration-500 ease-[var(--ease-premium)] md:group-hover/tile:-translate-y-1">
                    <h3 className="text-lg md:text-3xl font-bold leading-[1.05] whitespace-pre-line">{svc.name}</h3>
                    {/* Description unfolds for the hovered / active tile (desktop) */}
                    <div
                      className={`hidden md:grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-premium)] ${
                        isActive
                          ? 'grid-rows-[1fr] opacity-100'
                          : 'grid-rows-[0fr] opacity-0 group-hover/tile:grid-rows-[1fr] group-hover/tile:opacity-100'
                      }`}
                    >
                      <p className="overflow-hidden">
                        <span
                          className={`block pt-3 text-sm leading-relaxed max-w-xs ${
                            isActive ? 'text-neutral-600' : 'text-white/85'
                          }`}
                        >
                          {svc.desc}
                        </span>
                      </p>
                    </div>
                  </div>
                  <span
                    className={`self-end w-8 h-8 md:w-11 md:h-11 rounded-full border flex items-center justify-center text-[11px] md:text-xs font-semibold tabular-nums transition-[background-color,color,border-color,transform] duration-500 ease-[var(--ease-premium)] group-hover/tile:scale-110 ${
                      isActive
                        ? 'border-black bg-black text-white'
                        : 'border-white/70 group-hover/tile:bg-white group-hover/tile:text-black group-hover/tile:border-white'
                    }`}
                  >
                    {svc.num}
                  </span>
                </button>
              );
            })}
          </div>
        </MaskedCard>
      </div>
    </section>
  );
}

// TESTIMONIALS SECTION (own state so carousel ticks/swipes don't re-render the whole page)
// `active` = selected review (drives portrait + controls immediately);
// `shown` = review whose text is on screen (swapped after the outgoing quote has left).
interface TestimonialsSectionProps {
  sectionRef: (el: HTMLElement | null) => void;
}

const TESTIMONIAL_INTERVAL = 6000;

function TestimonialsSection({ sectionRef }: TestimonialsSectionProps) {
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const rootRef = useRef<HTMLElement | null>(null);
  const swapTl = useRef<gsap.core.Timeline | null>(null);
  const dragX = useRef<number | null>(null);
  const prevActive = useRef(0);
  const n = TESTIMONIAL_PATIENTS.length;

  const setRefs = useCallback(
    (el: HTMLElement | null) => {
      rootRef.current = el;
      sectionRef(el);
    },
    [sectionRef]
  );

  const go = useCallback((dir: number) => setActive((prev) => (prev + dir + n) % n), [n]);

  // Entrance choreography: label → headline lines → rating → portrait mask → quote
  useMotion(rootRef, (root) => {
    const q = gsap.utils.selector(root);
    const start = 'top 70%';
    revealUp(q('[data-eyebrow]'), { trigger: root, start, y: 12 });
    revealLines(q('h2')[0], { trigger: root, start, delay: 0.08 });
    revealUp(q('[data-rating]'), { trigger: root, start, delay: 0.3, y: 18 });
    revealImage(q('[data-portrait]')[0], q('[data-portrait-inner]')[0], { trigger: q('[data-portrait]')[0], start: 'top 80%' });
    revealUp(q('[data-quote-block]'), { trigger: q('[data-portrait]')[0], start: 'top 80%', delay: 0.45, stagger: 0.1 });
  });

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    io.observe(el);
    const onVis = () => setTabHidden(document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  // Gentle auto-advance, only while visible, not hovered/dragged, tab visible, and motion allowed
  useEffect(() => {
    if (hovered || !inView || tabHidden || prefersReducedMotion()) return;
    const timer = setTimeout(() => go(1), TESTIMONIAL_INTERVAL);
    return () => clearTimeout(timer);
  }, [hovered, inView, tabHidden, active, go]);

  // Selection changed: crossfade portraits and send the current quote up and out
  useLayoutEffect(() => {
    const root = rootRef.current;
    const prev = prevActive.current;
    if (!root || prev === active) return;
    prevActive.current = active;
    const q = gsap.utils.selector(root);
    const imgs = q<HTMLElement>('[data-portrait-img]');
    swapTl.current?.progress(1).kill();

    if (prefersReducedMotion()) {
      gsap.set(imgs, { autoAlpha: 0 });
      gsap.set(imgs[active], { autoAlpha: 1 });
      setShown(active);
      return;
    }

    gsap.set(imgs, { zIndex: 0 });
    gsap.set(imgs[active], { zIndex: 1 });
    gsap.to(imgs[prev], { autoAlpha: 0, scale: 1.04, duration: 1, ease: EASE.image, overwrite: 'auto' });
    gsap.fromTo(
      imgs[active],
      { autoAlpha: 0, scale: 1.08 },
      { autoAlpha: 1, scale: 1, duration: 1.15, ease: EASE.image, overwrite: 'auto' }
    );
    swapTl.current = gsap
      .timeline({ onComplete: () => setShown(active) })
      .to(q('[data-quote-swap]'), { y: -24, autoAlpha: 0, duration: 0.4, stagger: 0.05, ease: 'power2.in' });
  }, [active]);

  // New text is in the DOM: lift it back in, quote line by line
  const firstShown = useRef(true);
  useLayoutEffect(() => {
    if (firstShown.current) {
      firstShown.current = false;
      return;
    }
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;
    const q = gsap.utils.selector(root);
    const ctx = gsap.context(() => {
      gsap.set(q('[data-quote-swap]'), { y: 0, autoAlpha: 1 });
      const split = SplitText.create(q('[data-quote-text]')[0], SPLIT_LINES_STATIC);
      gsap
        .timeline()
        .from(split.lines, { yPercent: 110, duration: 0.85, stagger: 0.07, ease: EASE.headline })
        .from(q('[data-quote-caption]'), { y: 14, autoAlpha: 0, duration: 0.6, ease: EASE.text }, 0.25);
    }, root);
    return () => ctx.revert();
  }, [shown]);

  const patient = TESTIMONIAL_PATIENTS[shown];

  // Mouse drag / touch swipe (pointer events cover both); vertical page scroll stays native via touch-action
  const onPointerDown = (e: React.PointerEvent) => (dragX.current = e.clientX);
  const onPointerUp = (e: React.PointerEvent) => {
    if (dragX.current === null) return;
    const dx = e.clientX - dragX.current;
    dragX.current = null;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  };

  return (
    <section ref={setRefs} className="scroll-mt-16 md:scroll-mt-[72px] bg-stone-50 px-5 md:px-8 xl:px-10 py-20 md:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <span data-eyebrow className="block text-[11px] font-bold uppercase tracking-[0.3em] text-neutral-500">
              Patient Stories
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight leading-[1.05] text-black">
              Real people, clearer days.
            </h2>
          </div>
          <div data-rating className="flex items-center gap-4">
            <span className="text-5xl font-bold tracking-tight text-black tabular-nums">4.98</span>
            <div className="text-sm leading-tight">
              <div className="text-black tracking-[0.2em]" aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
              <div className="mt-1 text-neutral-500">from 1,400+ verified reviews</div>
            </div>
          </div>
        </div>

        {/* Carousel */}
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Patient reviews"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') go(1);
            else if (e.key === 'ArrowLeft') go(-1);
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => {
            setHovered(false);
            dragX.current = null;
          }}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          className="mt-12 md:mt-16 grid md:grid-cols-[1fr_1.2fr] gap-10 md:gap-16 items-center rounded-2xl touch-pan-y select-none focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-black"
        >
          <div
            data-portrait
            data-cursor="Drag"
            className="relative aspect-[4/5] md:aspect-[5/6] xl:aspect-[6/7] rounded-2xl overflow-hidden bg-neutral-200 cursor-grab active:cursor-grabbing"
          >
            <div data-portrait-inner className="absolute inset-0">
              {TESTIMONIAL_PATIENTS.map((p, idx) => (
                <img
                  key={p.id}
                  data-portrait-img
                  src={p.image}
                  alt={idx === active ? `${p.author} wearing spectacles` : ''}
                  aria-hidden={idx !== active}
                  decoding="async"
                  loading="lazy"
                  draggable={false}
                  // initial visibility only; GSAP owns opacity after the first change
                  style={{ opacity: idx === 0 ? 1 : 0 }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ))}
            </div>
          </div>

          <figure aria-live="polite">
            <div data-quote-block>
              <span aria-hidden="true" className="block text-7xl leading-none font-bold text-neutral-300 select-none">
                &ldquo;
              </span>
              <blockquote data-quote-swap className="-mt-4">
                {/* keyed so each review gets a fresh node for SplitText */}
                <p key={patient.id} data-quote-text className="text-2xl md:text-[2rem] font-semibold leading-snug tracking-tight text-black">
                  {patient.quote}
                </p>
              </blockquote>
              <figcaption data-quote-swap className="mt-8">
                <div key={patient.id} data-quote-caption>
                  <div className="text-base font-bold text-black">{patient.author}</div>
                  <div className="mt-1 text-sm text-neutral-500">
                    {patient.role} &middot; {patient.frame}
                  </div>
                </div>
              </figcaption>
            </div>

            <div data-quote-block className="mt-10 pt-6 border-t border-neutral-200 flex items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                {TESTIMONIAL_PATIENTS.map((p, idx) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setActive(idx)}
                    aria-label={`Show review from ${p.author}`}
                    aria-current={idx === active}
                    className="group/pill py-3 cursor-pointer"
                  >
                    <span
                      className={`block h-1.5 rounded-full transition-[width,background-color] duration-500 ease-[var(--ease-premium)] ${
                        idx === active ? 'w-8 bg-black' : 'w-3 bg-neutral-300 group-hover/pill:bg-neutral-500'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                {[-1, 1].map((dir) => (
                  <button
                    key={dir}
                    type="button"
                    onClick={() => go(dir)}
                    aria-label={dir < 0 ? 'Previous review' : 'Next review'}
                    style={{ '--fill': '#0a0a0a', '--fill-text': '#fff' } as React.CSSProperties}
                    className="btn-fill group/arrow w-11 h-11 rounded-full border border-neutral-300 text-black flex items-center justify-center cursor-pointer"
                  >
                    <ArrowIcon
                      className={`transition-transform duration-300 ease-[var(--ease-premium)] ${
                        dir < 0 ? 'rotate-180 group-hover/arrow:-translate-x-0.5' : 'group-hover/arrow:translate-x-0.5'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}

// MAIN APP COMPONENT
export default function App() {
  // Modals state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<
    'privacy' | 'terms' | 'hipaa' | 'accessibility' | null
  >(null);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // SECTION 1 HERO
  const section1Ref = useRef<HTMLElement | null>(null);
  const setSection1Ref = useCallback((el: HTMLElement | null) => {
    section1Ref.current = el;
  }, []);

  // SECTION 2 (VISION GALLERY) + SECTION 3 (EYE CARE) REFS — used for nav scrolling / active link
  const section2Ref = useRef<HTMLElement | null>(null);
  const setSection2Ref = useCallback((el: HTMLElement | null) => {
    section2Ref.current = el;
  }, []);
  const section3Ref = useRef<HTMLElement | null>(null);
  const setSection3Ref = useCallback((el: HTMLElement | null) => {
    section3Ref.current = el;
  }, []);

  // SECTION 4 TESTIMONIALS
  const section4Ref = useRef<HTMLElement | null>(null);
  const setSection4Ref = useCallback((el: HTMLElement | null) => {
    section4Ref.current = el;
  }, []);

  // SECTION 5 FOOTER — restrained motion: panel opens, headline rises, then CTAs; columns just fade
  const footerRef = useRef<HTMLElement | null>(null);
  const setSection5CombinedRef = useCallback((el: HTMLElement | null) => {
    footerRef.current = el;
  }, []);
  useMotion(footerRef, (root) => {
    const q = gsap.utils.selector(root);
    if (allowParallax()) {
      gsap.fromTo(
        q('[data-footer-panel]'),
        { clipPath: 'inset(0% 2.5% 0% 2.5% round 32px)' },
        {
          clipPath: 'inset(0% 0% 0% 0% round 0px)',
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top bottom', end: 'top 35%', scrub: 0.6 },
        }
      );
    }
    const trigger = q('[data-footer-cta]')[0];
    revealUp(q('[data-footer-up]')[0], { trigger, start: 'top 80%', y: 12 });
    revealLines(q('[data-footer-title]')[0], { trigger, start: 'top 80%', delay: 0.1 });
    revealUp(q('[data-footer-up]')[1], { trigger, start: 'top 80%', delay: 0.4 });
    revealUp(q('[data-footer-btn]'), { trigger, start: 'top 80%', delay: 0.55, stagger: 0.08, y: 16 });
    revealUp(q('[data-footer-cols]'), { trigger: q('[data-footer-cols]')[0], start: 'top 92%', y: 16, duration: 0.8 });
  });

  const sectionForLink = useCallback(
    (link: string): HTMLElement | null =>
      ({
        Home: section1Ref.current,
        Services: section2Ref.current,
        'Eye Care': section3Ref.current,
        Reviews: section4Ref.current,
        Contact: footerRef.current,
      })[link] ?? null,
    []
  );

  const handleNavClick = useCallback(
    (target: string) => {
      if (target === 'Home') window.scrollTo({ top: 0, behavior: 'smooth' });
      else sectionForLink(target)?.scrollIntoView({ behavior: 'smooth' });
    },
    [sectionForLink]
  );

  // Line splits and section heights can shift once the web font lands; re-measure scroll triggers then
  useEffect(() => refreshOnFontsReady(), []);

  // Highlight the nav link of whichever section crosses the middle of the viewport
  const [activeLink, setActiveLink] = useState('Home');
  useEffect(() => {
    const entries = navLinks
      .map((link) => [link, sectionForLink(link)] as const)
      .filter((e): e is readonly [string, HTMLElement] => !!e[1]);
    const io = new IntersectionObserver(
      (observed) => {
        observed.forEach((o) => {
          if (!o.isIntersecting) return;
          const match = entries.find(([, el]) => el === o.target);
          if (match) setActiveLink(match[0]);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    entries.forEach(([, el]) => io.observe(el));
    return () => io.disconnect();
  }, [sectionForLink]);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
    }, 4000);
  };

  return (
    <div className="bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* Fixed Navbar */}
      <Navbar
        activeLink={activeLink}
        onNavClick={handleNavClick}
        onOpenBooking={() => setIsBookingOpen(true)}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
      />

      {/* 3. SECTION 1 - HERO */}
      <HeroSlider
        sectionRef={setSection1Ref}
        onOpenBooking={() => setIsBookingOpen(true)}
        onExplore={() => handleNavClick('Services')}
      />

      {/* 4. SECTION 2 - EYE CARE */}
      <EyeCareSection
        sectionRef={setSection3Ref}
        onOpenBooking={() => setIsBookingOpen(true)}
        onOpenTerms={() => setLegalModalType('terms')}
      />

      {/* 5. SECTION 3 - VISION GALLERY / SERVICES */}
      <VisionGallerySection sectionRef={setSection2Ref} onCall={() => setIsEmergencyOpen(true)} />

      {/* 6. SECTION 4 - PATIENT STORIES & TESTIMONIALS CAROUSEL */}
      <TestimonialsSection sectionRef={setSection4Ref} />

      {/* 7. FOOTER */}
      <footer
        ref={setSection5CombinedRef}
        className="scroll-mt-16 md:scroll-mt-[72px] bg-stone-50 text-neutral-400"
      >
        {/* Dark panel opens out of the light section above as it scrolls in */}
        <div data-footer-panel className="bg-neutral-950">
        <div className="mx-auto max-w-7xl px-5 md:px-8 xl:px-10">
          {/* Closing call-to-action */}
          <div
            data-footer-cta
            className="py-16 md:py-24 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/10"
          >
            <div className="max-w-3xl">
              <span data-footer-up className="block text-[11px] font-bold uppercase tracking-[0.3em] text-neutral-500">
                Book a visit
              </span>
              <h2 data-footer-title className="mt-4 text-4xl md:text-6xl font-bold tracking-tight leading-[1.02] text-white">
                Ready to see clearly?
              </h2>
              <p data-footer-up className="mt-4 text-sm md:text-base leading-relaxed">
                Reserve a comprehensive eye exam in under a minute. No advance payment, and we verify your
                insurance when you arrive.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <button
                type="button"
                data-footer-btn
                onClick={() => setIsBookingOpen(true)}
                style={{ '--fill': '#262626', '--fill-text': '#fff' } as React.CSSProperties}
                className="btn-fill flex items-center justify-center gap-3 px-7 py-4 rounded-full bg-white border border-white text-black text-xs font-bold uppercase tracking-[0.18em] cursor-pointer"
              >
                <CalendarIcon className="btn-arrow" />
                Book an Eye Exam
              </button>
              <a
                href="tel:2018692020"
                data-footer-btn
                style={{ '--fill': '#fff', '--fill-text': '#0a0a0a' } as React.CSSProperties}
                className="btn-fill px-7 py-4 rounded-full border border-white/25 text-white text-xs font-bold uppercase tracking-[0.18em] text-center"
              >
                (201) 869-2020
              </a>
            </div>
          </div>

          {/* Link columns */}
          <div
            data-footer-cols
            className="py-14 md:py-16 grid grid-cols-2 md:grid-cols-12 gap-x-8 gap-y-12 text-sm"
          >
            <div className="col-span-2 md:col-span-4">
              <div className="flex flex-col text-white">
                <span className="text-xl font-extrabold uppercase tracking-[0.35em] leading-none">Spects</span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.5em] leading-none mt-1.5 text-neutral-400">
                  World
                </span>
              </div>
              <p className="mt-5 max-w-xs leading-relaxed">
                An independent optometry clinic and eyewear studio in West New York, NJ.
              </p>

              <form onSubmit={handleNewsletterSubmit} className="mt-8 max-w-xs">
                <label htmlFor="newsletter-email" className="block text-xs font-semibold text-white mb-3">
                  Trunk-show invites &amp; eye care tips
                </label>
                <div className="flex items-center border-b border-white/25 focus-within:border-white transition-colors">
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    placeholder="Email address"
                    value={newsletterEmail}
                    onChange={(e) => {
                      setNewsletterEmail(e.target.value);
                      setNewsletterSubscribed(false);
                    }}
                    className="w-full bg-transparent py-2.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="shrink-0 pl-3 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-white hover:text-neutral-300 transition-colors cursor-pointer"
                  >
                    Subscribe
                  </button>
                </div>
                <p aria-live="polite" className="mt-2 h-4 text-xs text-emerald-400">
                  {newsletterSubscribed ? 'Thanks, you are on the list.' : ''}
                </p>
              </form>
            </div>

            <nav aria-label="Footer" className="md:col-span-2">
              <h3 className="text-xs font-semibold text-white mb-5">Explore</h3>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link}>
                    <button
                      type="button"
                      onClick={() => handleNavClick(link)}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="md:col-span-3">
              <h3 className="text-xs font-semibold text-white mb-5">Visit</h3>
              <address className="not-italic space-y-3 leading-relaxed">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=6024+Bergenline+Ave+West+New+York+NJ+07093"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:text-white transition-colors"
                >
                  6024 Bergenline Ave
                  <br />
                  West New York, NJ 07093
                </a>
                <a href="tel:2018692020" className="block hover:text-white transition-colors">
                  +1 (201) 869-2020
                </a>
                <a href="mailto:care@spectsworld.com" className="block hover:text-white transition-colors">
                  care@spectsworld.com
                </a>
                <button
                  type="button"
                  onClick={() => setIsEmergencyOpen(true)}
                  className="flex items-center gap-2 text-white hover:text-neutral-300 transition-colors cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Urgent eye care
                </button>
              </address>
            </div>

            <div className="col-span-2 md:col-span-3">
              <h3 className="text-xs font-semibold text-white mb-5">Hours</h3>
              <dl className="space-y-3">
                {OPENING_HOURS.map(([day, hours]) => (
                  <div key={day} className="flex justify-between gap-4 max-w-xs">
                    <dt>{day}</dt>
                    <dd className="text-white tabular-nums">{hours}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-xs text-neutral-500">Sundays are reserved for urgent care.</p>
            </div>
          </div>

          {/* Legal bar */}
          <div className="py-6 border-t border-white/10 flex flex-col-reverse md:flex-row md:items-center justify-between gap-5 text-xs text-neutral-500">
            <p>
              &copy; {new Date().getFullYear()} Spects World Inc. &middot; Board Certified Optometric Clinic #OP-8821
            </p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              {LEGAL_LINKS.map(([type, label]) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setLegalModalType(type)}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {label}
                </button>
              ))}
              <span className="hidden md:block w-px h-3 bg-white/15" />
              <div className="flex items-center gap-1">
                {SOCIAL_LINKS.map((s) => (
                  <a
                    key={s.label}
                    href="#"
                    aria-label={s.label}
                    onClick={(e) => e.preventDefault()}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                aria-label="Back to top"
                className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors cursor-pointer"
              >
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="-rotate-90">
                  <path d="M2 8h12m0 0L8 2m6 6L8 14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        </div>
      </footer>

      <ContextCursor />

      {/* INTERACTIVE MODALS */}
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
      <EmergencyModal isOpen={isEmergencyOpen} onClose={() => setIsEmergencyOpen(false)} />
      <LegalModal type={legalModalType} onClose={() => setLegalModalType(null)} />
    </div>
  );
}
