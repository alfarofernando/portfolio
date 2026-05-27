import { useEffect, useMemo, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import styles from './ParallaxBackground.module.css';

type ParallaxVariant = 'home' | 'projects' | 'about' | 'cta' | 'default';
type ParallaxIntensity = 'low' | 'medium' | 'high';

type VariantConfig = {
  base: number;
  stars: number;
  grid: number;
  lines: number;
  wave: number;
  glow: number;
  objects: number;
};

type MutationSection = {
  id: string;
  variant: ParallaxVariant;
};

type FloatingObjectKind = 'panel' | 'pill' | 'dot' | 'node';

type FloatingObject = {
  left: string;
  top: string;
  width: string;
  height?: string;
  depth: number;
  kind: FloatingObjectKind;
  duration: string;
  delay: string;
  floatX: string;
  floatY: string;
  rotate: string;
};

type ParallaxBackgroundProps = {
  variant?: ParallaxVariant;
  intensity?: ParallaxIntensity;
  className?: string;
  children?: ReactNode;
  mutationSections?: MutationSection[];
  mediaParallax?: boolean;
};

const PARALLAX_VARIANTS: Record<ParallaxVariant, VariantConfig> = {
  home: {
    base: 0.96,
    stars: 0.5,
    grid: 0.28,
    lines: 0.24,
    wave: 0.22,
    glow: 0.38,
    objects: 0.68,
  },
  projects: {
    base: 0.94,
    stars: 0.38,
    grid: 0.24,
    lines: 0.34,
    wave: 0.16,
    glow: 0.26,
    objects: 0.58,
  },
  about: {
    base: 0.95,
    stars: 0.34,
    grid: 0.22,
    lines: 0.2,
    wave: 0.32,
    glow: 0.2,
    objects: 0.62,
  },
  cta: {
    base: 0.92,
    stars: 0.2,
    grid: 0.14,
    lines: 0.12,
    wave: 0.12,
    glow: 0.46,
    objects: 0.52,
  },
  default: {
    base: 0.94,
    stars: 0.34,
    grid: 0.2,
    lines: 0.22,
    wave: 0.2,
    glow: 0.24,
    objects: 0.56,
  },
};

const INTENSITY_MULTIPLIER: Record<ParallaxIntensity, number> = {
  low: 0.55,
  medium: 0.85,
  high: 1.12,
};

const BASE_TRANSLATE_BY_VARIANT: Record<ParallaxVariant, number> = {
  home: 26,
  projects: 22,
  about: 24,
  cta: 16,
  default: 22,
};

const FLOATING_OBJECTS: FloatingObject[] = [
  { left: '9%', top: '12%', width: '220px', height: '150px', depth: 0.18, kind: 'panel', duration: '19s', delay: '-3s', floatX: '12px', floatY: '10px', rotate: '3deg' },
  { left: '86%', top: '16%', width: '180px', height: '124px', depth: 0.22, kind: 'panel', duration: '21s', delay: '-9s', floatX: '-14px', floatY: '12px', rotate: '-4deg' },
  { left: '18%', top: '28%', width: '128px', height: '48px', depth: 0.26, kind: 'pill', duration: '16s', delay: '-2s', floatX: '16px', floatY: '-10px', rotate: '8deg' },
  { left: '79%', top: '32%', width: '144px', height: '52px', depth: 0.3, kind: 'pill', duration: '17s', delay: '-6s', floatX: '-18px', floatY: '9px', rotate: '-9deg' },
  { left: '29%', top: '55%', width: '16px', height: '16px', depth: 0.38, kind: 'dot', duration: '12s', delay: '-4s', floatX: '22px', floatY: '-12px', rotate: '0deg' },
  { left: '72%', top: '61%', width: '12px', height: '12px', depth: 0.42, kind: 'dot', duration: '11s', delay: '-1s', floatX: '-18px', floatY: '16px', rotate: '0deg' },
  { left: '11%', top: '72%', width: '188px', height: '126px', depth: 0.2, kind: 'panel', duration: '20s', delay: '-8s', floatX: '13px', floatY: '-11px', rotate: '-3deg' },
  { left: '84%', top: '76%', width: '232px', height: '160px', depth: 0.24, kind: 'panel', duration: '22s', delay: '-5s', floatX: '-12px', floatY: '13px', rotate: '4deg' },
  { left: '45%', top: '83%', width: '240px', height: '56px', depth: 0.32, kind: 'pill', duration: '18s', delay: '-7s', floatX: '20px', floatY: '-8px', rotate: '5deg' },
  { left: '56%', top: '20%', width: '10px', height: '10px', depth: 0.45, kind: 'node', duration: '13s', delay: '-3s', floatX: '-20px', floatY: '14px', rotate: '0deg' },
  { left: '35%', top: '18%', width: '8px', height: '8px', depth: 0.5, kind: 'node', duration: '9s', delay: '-2s', floatX: '18px', floatY: '-10px', rotate: '0deg' },
  { left: '66%', top: '44%', width: '140px', height: '46px', depth: 0.26, kind: 'pill', duration: '17s', delay: '-12s', floatX: '-14px', floatY: '8px', rotate: '7deg' },
  { left: '24%', top: '41%', width: '150px', height: '44px', depth: 0.28, kind: 'pill', duration: '15s', delay: '-11s', floatX: '15px', floatY: '-9px', rotate: '-6deg' },
  { left: '92%', top: '54%', width: '14px', height: '14px', depth: 0.44, kind: 'dot', duration: '10s', delay: '-5s', floatX: '-16px', floatY: '-14px', rotate: '0deg' },
  { left: '7%', top: '48%', width: '11px', height: '11px', depth: 0.41, kind: 'dot', duration: '11s', delay: '-7s', floatX: '17px', floatY: '15px', rotate: '0deg' },
];

const LAYER_KEYS: Array<keyof VariantConfig> = ['base', 'stars', 'grid', 'lines', 'wave', 'glow', 'objects'];

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const cloneConfig = (config: VariantConfig): VariantConfig => ({ ...config });

const ParallaxBackground = ({
  variant = 'default',
  intensity = 'medium',
  className = '',
  children,
  mutationSections,
  mediaParallax = false,
}: ParallaxBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const variantConfig = useMemo(
    () => PARALLAX_VARIANTS[variant] ?? PARALLAX_VARIANTS.default,
    [variant],
  );

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const container = containerRef.current;
    if (!container) return undefined;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const reduceMotion = () => mediaQuery.matches;
    const intensityFactor = INTENSITY_MULTIPLIER[intensity] ?? INTENSITY_MULTIPLIER.medium;
    const baseTranslate = BASE_TRANSLATE_BY_VARIANT[variant] ?? BASE_TRANSLATE_BY_VARIANT.default;
    const mutationEnabled = Array.isArray(mutationSections) && mutationSections.length > 0;

    let sectionTargets: Array<MutationSection & { element: HTMLElement }> = [];
    let mediaTargets: HTMLElement[] = [];

    const current = {
      x: 0,
      y: 0,
      driftX: 0,
      driftY: 0,
      scrollY: window.scrollY || 0,
      layers: cloneConfig(variantConfig),
    };

    const target = {
      x: 0,
      y: 0,
      driftX: 0,
      driftY: 0,
      scrollY: window.scrollY || 0,
      layers: cloneConfig(variantConfig),
    };

    let frameId = 0;

    const applyFrame = () => {
      container.style.setProperty('--pb-shift-x', current.x.toFixed(3));
      container.style.setProperty('--pb-shift-y', current.y.toFixed(3));
      container.style.setProperty('--pb-drift-x', current.driftX.toFixed(3));
      container.style.setProperty('--pb-drift-y', current.driftY.toFixed(3));
      LAYER_KEYS.forEach((key) => {
        container.style.setProperty(`--pb-${key}-opacity`, String(current.layers[key]));
      });
    };

    const refreshTargets = () => {
      if (mutationEnabled) {
        sectionTargets = mutationSections
          .map((item) => {
            const element = document.getElementById(item.id);
            return element ? { ...item, element } : null;
          })
          .filter((item): item is MutationSection & { element: HTMLElement } => item !== null);
      }

      if (mediaParallax) {
        mediaTargets = Array.from(container.querySelectorAll<HTMLElement>('[data-parallax-media]'));
      }
    };

    const computeBlendedConfig = (): VariantConfig => {
      if (!mutationEnabled || sectionTargets.length === 0) {
        return cloneConfig(variantConfig);
      }

      const viewportHeight = window.innerHeight || 1;
      const viewportCenter = viewportHeight / 2;

      const blend: VariantConfig = {
        base: 0,
        stars: 0,
        grid: 0,
        lines: 0,
        wave: 0,
        glow: 0,
        objects: 0,
      };

      let totalWeight = 0;

      sectionTargets.forEach((section) => {
        const rect = section.element.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const distance = Math.abs(center - viewportCenter);
        const influence = clamp(1 - distance / (viewportHeight * 1.08), 0, 1);
        const weight = influence ** 2;

        if (weight <= 0) return;

        const config = PARALLAX_VARIANTS[section.variant] ?? PARALLAX_VARIANTS.default;

        LAYER_KEYS.forEach((key) => {
          blend[key] += config[key] * weight;
        });

        totalWeight += weight;
      });

      if (totalWeight <= 0.0001) {
        return cloneConfig(variantConfig);
      }

      LAYER_KEYS.forEach((key) => {
        blend[key] /= totalWeight;
      });

      return blend;
    };

    const computeTarget = (nowMs: number) => {
      const time = nowMs * 0.001;

      if (mutationEnabled && sectionTargets.length === 0) {
        refreshTargets();
      }

      const scrollY = window.scrollY || window.pageYOffset || 0;
      const doc = document.documentElement;
      const maxScroll = Math.max((doc.scrollHeight || 0) - (window.innerHeight || 1), 1);
      const progress = clamp(scrollY / maxScroll, 0, 1);
      const normalized = progress * 2 - 1;
      const drift = baseTranslate * intensityFactor;

      if (reduceMotion()) {
        target.x = 0;
        target.y = 0;
        target.driftX = 0;
        target.driftY = 0;
      } else {
        target.x = normalized * drift * 0.38 + Math.sin(time * 0.72) * drift * 0.28;
        target.y = normalized * drift * 0.46 + Math.cos(time * 0.58 + normalized) * drift * 0.34;
        target.driftX = Math.sin(time * 1.4) * 18 * intensityFactor;
        target.driftY = Math.cos(time * 1.1) * 16 * intensityFactor;
      }

      target.scrollY = scrollY;
      target.layers = computeBlendedConfig();

      if (!reduceMotion()) {
        target.layers.stars = clamp(target.layers.stars + Math.sin(time * 0.8) * 0.03, 0, 0.95);
        target.layers.glow = clamp(target.layers.glow + Math.sin(time * 0.5 + 1.2) * 0.04, 0, 0.95);
        target.layers.objects = clamp(target.layers.objects + Math.cos(time * 0.62) * 0.03, 0, 0.95);
      }
    };

    const updateMediaTransforms = (nowMs: number) => {
      if (!mediaParallax || mediaTargets.length === 0) return;

      const time = nowMs * 0.001;
      const viewportHeight = window.innerHeight || 1;
      const viewportCenter = viewportHeight / 2;
      const mobileScale = window.innerWidth < 768 ? 0.62 : 1;

      mediaTargets.forEach((element, index) => {
        if (reduceMotion()) {
          element.style.transform = '';
          element.style.willChange = '';
          return;
        }

        const depth = Number(element.dataset.parallaxMedia || '0.3');
        const rect = element.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const normalized = clamp((viewportCenter - center) / viewportHeight, -1, 1);

        const y = normalized * 20 * depth * intensityFactor * mobileScale;
        const x = Math.sin(current.scrollY * 0.001 + time * 0.75 + index * 0.44) * 9 * depth * mobileScale;
        const rotate = normalized * 1.2 * depth * mobileScale;
        const scale = 1 + depth * 0.016;

        element.style.willChange = 'transform';
        element.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${rotate.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      });
    };

    const tick = (nowMs: number) => {
      computeTarget(nowMs);

      const ease = reduceMotion() ? 1 : 0.075;

      current.x += (target.x - current.x) * ease;
      current.y += (target.y - current.y) * ease;
      current.driftX += (target.driftX - current.driftX) * ease;
      current.driftY += (target.driftY - current.driftY) * ease;
      current.scrollY += (target.scrollY - current.scrollY) * ease;

      LAYER_KEYS.forEach((key) => {
        current.layers[key] += (target.layers[key] - current.layers[key]) * 0.09;
      });

      applyFrame();
      updateMediaTransforms(nowMs);

      frameId = window.requestAnimationFrame(tick);
    };

    const onResize = () => {
      refreshTargets();
      computeTarget(performance.now());
    };

    const onMotionChange = () => {
      computeTarget(performance.now());
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        if (frameId) {
          window.cancelAnimationFrame(frameId);
          frameId = 0;
        }
        return;
      }

      if (!frameId) {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    refreshTargets();
    computeTarget(performance.now());
    applyFrame();
    frameId = window.requestAnimationFrame(tick);

    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('orientationchange', onResize, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', onMotionChange);
    } else {
      mediaQuery.addListener(onMotionChange);
    }

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);

      if (mediaQuery.addEventListener) {
        mediaQuery.removeEventListener('change', onMotionChange);
      } else {
        mediaQuery.removeListener(onMotionChange);
      }

      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      mediaTargets.forEach((element) => {
        element.style.transform = '';
        element.style.willChange = '';
      });
    };
  }, [intensity, mediaParallax, mutationSections, variant, variantConfig]);

  const styleVars = {
    '--pb-base-opacity': String(variantConfig.base),
    '--pb-stars-opacity': String(variantConfig.stars),
    '--pb-grid-opacity': String(variantConfig.grid),
    '--pb-lines-opacity': String(variantConfig.lines),
    '--pb-wave-opacity': String(variantConfig.wave),
    '--pb-glow-opacity': String(variantConfig.glow),
    '--pb-objects-opacity': String(variantConfig.objects),
  } as CSSProperties;

  return (
    <div ref={containerRef} className={`${styles.wrapper} ${className}`} style={styleVars}>
      <div className={styles.layers} aria-hidden="true">
        <div className={`${styles.layer} ${styles.baseLayer}`} />
        <div className={`${styles.layer} ${styles.starLayer} ${styles.motionFar}`} />
        <div className={`${styles.layer} ${styles.gridLayer} ${styles.motionSlow}`} />
        <div className={`${styles.layer} ${styles.lineLayer} ${styles.motionMedium}`} />
        <div className={`${styles.layer} ${styles.waveLayer} ${styles.motionSlow}`} />
        <div className={`${styles.layer} ${styles.glowLayer} ${styles.motionNear}`} />

        <div className={styles.objectScene}>
          {FLOATING_OBJECTS.map((object, index) => (
            <span
              key={`${object.kind}-${index}`}
              className={styles.objectWrapper}
              style={
                {
                  '--fo-left': object.left,
                  '--fo-top': object.top,
                  '--fo-width': object.width,
                  '--fo-height': object.height ?? object.width,
                  '--fo-depth': object.depth,
                } as CSSProperties
              }
            >
              <span
                className={`${styles.object} ${styles[object.kind]}`}
                style={
                  {
                    '--fo-duration': object.duration,
                    '--fo-delay': object.delay,
                    '--fo-float-x': object.floatX,
                    '--fo-float-y': object.floatY,
                    '--fo-rotate': object.rotate,
                  } as CSSProperties
                }
              />
            </span>
          ))}
        </div>
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default ParallaxBackground;
export { PARALLAX_VARIANTS };
export type { MutationSection, ParallaxBackgroundProps, ParallaxIntensity, ParallaxVariant };