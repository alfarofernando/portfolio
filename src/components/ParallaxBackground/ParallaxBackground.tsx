import { useEffect, useMemo, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import styles from './ParallaxBackground.module.css';

type ParallaxVariant = 'home' | 'projects' | 'about' | 'cta' | 'default';
type ParallaxIntensity = 'low' | 'medium' | 'high';

type VariantConfig = {
  baseOpacity: number;
  hudOpacity: number;
  glassOpacity: number;
  timelineOpacity: number;
  ctaOpacity: number;
  starfieldOpacity: number;
  nebulaOpacity: number;
  streaksOpacity: number;
  waveOpacity: number;
  panelsOpacity: number;
  starfieldSoftOpacity: number;
  orbOpacity: number;
  circuitOpacity: number;
  wireframeOpacity: number;
  glassSoftOpacity: number;
};

type MutationSection = {
  id: string;
  variant: ParallaxVariant;
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
    baseOpacity: 0.42,
    hudOpacity: 0.2,
    glassOpacity: 0.18,
    timelineOpacity: 0.08,
    ctaOpacity: 0,
    starfieldOpacity: 0.1,
    nebulaOpacity: 0.08,
    streaksOpacity: 0.08,
    waveOpacity: 0.08,
    panelsOpacity: 0.06,
    starfieldSoftOpacity: 0.18,
    orbOpacity: 0.16,
    circuitOpacity: 0.08,
    wireframeOpacity: 0.1,
    glassSoftOpacity: 0.12,
  },
  projects: {
    baseOpacity: 0.4,
    hudOpacity: 0.14,
    glassOpacity: 0.14,
    timelineOpacity: 0.06,
    ctaOpacity: 0,
    starfieldOpacity: 0.08,
    nebulaOpacity: 0.06,
    streaksOpacity: 0.1,
    waveOpacity: 0.08,
    panelsOpacity: 0.06,
    starfieldSoftOpacity: 0.16,
    orbOpacity: 0.1,
    circuitOpacity: 0.12,
    wireframeOpacity: 0.08,
    glassSoftOpacity: 0.1,
  },
  about: {
    baseOpacity: 0.42,
    hudOpacity: 0.16,
    glassOpacity: 0.12,
    timelineOpacity: 0.2,
    ctaOpacity: 0,
    starfieldOpacity: 0.08,
    nebulaOpacity: 0.06,
    streaksOpacity: 0.12,
    waveOpacity: 0.14,
    panelsOpacity: 0.06,
    starfieldSoftOpacity: 0.14,
    orbOpacity: 0.08,
    circuitOpacity: 0.08,
    wireframeOpacity: 0.16,
    glassSoftOpacity: 0.1,
  },
  cta: {
    baseOpacity: 0.28,
    hudOpacity: 0.08,
    glassOpacity: 0.08,
    timelineOpacity: 0,
    ctaOpacity: 0.24,
    starfieldOpacity: 0.02,
    nebulaOpacity: 0.04,
    streaksOpacity: 0.02,
    waveOpacity: 0.04,
    panelsOpacity: 0.06,
    starfieldSoftOpacity: 0.08,
    orbOpacity: 0.14,
    circuitOpacity: 0.04,
    wireframeOpacity: 0.06,
    glassSoftOpacity: 0.14,
  },
  default: {
    baseOpacity: 0.4,
    hudOpacity: 0.16,
    glassOpacity: 0.14,
    timelineOpacity: 0.08,
    ctaOpacity: 0,
    starfieldOpacity: 0.08,
    nebulaOpacity: 0.08,
    streaksOpacity: 0.08,
    waveOpacity: 0.1,
    panelsOpacity: 0.08,
    starfieldSoftOpacity: 0.14,
    orbOpacity: 0.1,
    circuitOpacity: 0.08,
    wireframeOpacity: 0.1,
    glassSoftOpacity: 0.1,
  },
};

const INTENSITY_MULTIPLIER: Record<ParallaxIntensity, number> = {
  low: 0.5,
  medium: 0.75,
  high: 1,
};

const BASE_TRANSLATE_BY_VARIANT: Record<ParallaxVariant, number> = {
  home: 26,
  projects: 22,
  about: 24,
  cta: 16,
  default: 24,
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const LAYER_KEYS: Array<keyof VariantConfig> = [
  'baseOpacity',
  'hudOpacity',
  'glassOpacity',
  'timelineOpacity',
  'ctaOpacity',
  'starfieldOpacity',
  'nebulaOpacity',
  'streaksOpacity',
  'waveOpacity',
  'panelsOpacity',
  'starfieldSoftOpacity',
  'orbOpacity',
  'circuitOpacity',
  'wireframeOpacity',
  'glassSoftOpacity',
];

const LAYER_BREATH: Record<keyof VariantConfig, { amp: number; speed: number; phase: number }> = {
  baseOpacity: { amp: 0.012, speed: 0.22, phase: 0.2 },
  hudOpacity: { amp: 0.016, speed: 0.44, phase: 0.7 },
  glassOpacity: { amp: 0.014, speed: 0.36, phase: 1.1 },
  timelineOpacity: { amp: 0.015, speed: 0.52, phase: 1.6 },
  ctaOpacity: { amp: 0.018, speed: 0.4, phase: 2.2 },
  starfieldOpacity: { amp: 0.012, speed: 0.26, phase: 0.4 },
  nebulaOpacity: { amp: 0.015, speed: 0.34, phase: 1.9 },
  streaksOpacity: { amp: 0.016, speed: 0.56, phase: 0.9 },
  waveOpacity: { amp: 0.014, speed: 0.28, phase: 2.7 },
  panelsOpacity: { amp: 0.013, speed: 0.38, phase: 2.3 },
  starfieldSoftOpacity: { amp: 0.016, speed: 0.24, phase: 1.4 },
  orbOpacity: { amp: 0.017, speed: 0.3, phase: 0.6 },
  circuitOpacity: { amp: 0.014, speed: 0.5, phase: 2.8 },
  wireframeOpacity: { amp: 0.015, speed: 0.32, phase: 1.8 },
  glassSoftOpacity: { amp: 0.014, speed: 0.42, phase: 2.4 },
};

const toCssVar = (key: keyof VariantConfig) => {
  const base = key.replace('Opacity', '');
  return `--pb-${base}-opacity`;
};

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
      scrollY: window.scrollY || 0,
      opacities: cloneConfig(variantConfig),
    };

    const target = {
      x: 0,
      y: 0,
      scrollY: window.scrollY || 0,
      opacities: cloneConfig(variantConfig),
    };

    let frameId = 0;

    const applyFrame = () => {
      container.style.setProperty('--pb-shift-x', current.x.toFixed(3));
      container.style.setProperty('--pb-shift-y', current.y.toFixed(3));
      LAYER_KEYS.forEach((key) => {
        container.style.setProperty(toCssVar(key), String(current.opacities[key]));
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
      const blended: VariantConfig = {
        baseOpacity: 0,
        hudOpacity: 0,
        glassOpacity: 0,
        timelineOpacity: 0,
        ctaOpacity: 0,
        starfieldOpacity: 0,
        nebulaOpacity: 0,
        streaksOpacity: 0,
        waveOpacity: 0,
        panelsOpacity: 0,
        starfieldSoftOpacity: 0,
        orbOpacity: 0,
        circuitOpacity: 0,
        wireframeOpacity: 0,
        glassSoftOpacity: 0,
      };

      let totalWeight = 0;

      sectionTargets.forEach((section) => {
        const rect = section.element.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const distance = Math.abs(center - viewportCenter);
        const influence = clamp(1 - distance / (viewportHeight * 1.1), 0, 1);
        const weight = influence ** 2;

        if (weight <= 0) return;

        const config = PARALLAX_VARIANTS[section.variant] ?? PARALLAX_VARIANTS.default;
        LAYER_KEYS.forEach((key) => {
          blended[key] += config[key] * weight;
        });

        totalWeight += weight;
      });

      if (totalWeight <= 0.0001) {
        return cloneConfig(variantConfig);
      }

      LAYER_KEYS.forEach((key) => {
        blended[key] /= totalWeight;
      });

      return blended;
    };

    const computeTarget = (nowMs: number) => {
      if (mutationEnabled && sectionTargets.length === 0) {
        refreshTargets();
      }

      const scrollY = window.scrollY || window.pageYOffset || 0;
      const time = nowMs * 0.001;
      const doc = document.documentElement;
      const maxScroll = Math.max((doc.scrollHeight || 0) - (window.innerHeight || 1), 1);
      const progress = clamp(scrollY / maxScroll, 0, 1);
      const normalized = progress * 2 - 1;

      if (reduceMotion()) {
        target.x = 0;
        target.y = 0;
      } else {
        const drift = baseTranslate * intensityFactor;
        target.y =
          normalized * drift * 0.58
          + Math.sin(time * 0.92 + scrollY * 0.00095) * drift * 0.54
          + Math.cos(time * 0.36) * drift * 0.22;
        target.x =
          Math.sin(time * 0.74 + scrollY * 0.00062) * drift * 0.34
          + Math.cos(time * 0.28 + normalized) * drift * 0.14;
      }

      target.scrollY = scrollY;
      target.opacities = computeBlendedConfig();

      if (!reduceMotion()) {
        LAYER_KEYS.forEach((key) => {
          const wave = LAYER_BREATH[key];
          const withWave = target.opacities[key] + Math.sin(time * wave.speed + wave.phase) * wave.amp;
          target.opacities[key] = clamp(withWave, 0, 0.95);
        });
      }
    };

    const updateMediaTransforms = (nowMs: number) => {
      if (!mediaParallax || mediaTargets.length === 0) return;

      const viewportHeight = window.innerHeight || 1;
      const viewportCenter = viewportHeight / 2;
      const mobileScale = window.innerWidth < 768 ? 0.62 : 1;
      const time = nowMs * 0.001;

      mediaTargets.forEach((element, index) => {
        if (reduceMotion()) {
          element.style.transform = '';
          element.style.willChange = '';
          return;
        }

        const depth = Number(element.dataset.parallaxMedia || '0.35');
        const rect = element.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const normalized = clamp((viewportCenter - center) / viewportHeight, -1, 1);

        const y = normalized * 26 * depth * intensityFactor * mobileScale;
        const x = Math.sin(current.scrollY * 0.0012 + time * 0.9 + index * 0.45) * 10 * depth * mobileScale;
        const rotate = normalized * 1.8 * depth * mobileScale;
        const scale = 1 + depth * 0.018;

        element.style.willChange = 'transform';
        element.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${rotate.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      });
    };

    const tick = (nowMs: number) => {
      computeTarget(nowMs);
      const ease = reduceMotion() ? 1 : 0.085;

      current.x += (target.x - current.x) * ease;
      current.y += (target.y - current.y) * ease;
      current.scrollY += (target.scrollY - current.scrollY) * ease;

      LAYER_KEYS.forEach((key) => {
        current.opacities[key] += (target.opacities[key] - current.opacities[key]) * 0.11;
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
    '--pb-base-opacity': String(variantConfig.baseOpacity),
    '--pb-hud-opacity': String(variantConfig.hudOpacity),
    '--pb-glass-opacity': String(variantConfig.glassOpacity),
    '--pb-timeline-opacity': String(variantConfig.timelineOpacity),
    '--pb-cta-opacity': String(variantConfig.ctaOpacity),
    '--pb-starfield-opacity': String(variantConfig.starfieldOpacity),
    '--pb-nebula-opacity': String(variantConfig.nebulaOpacity),
    '--pb-streaks-opacity': String(variantConfig.streaksOpacity),
    '--pb-wave-opacity': String(variantConfig.waveOpacity),
    '--pb-panels-opacity': String(variantConfig.panelsOpacity),
    '--pb-starfieldSoft-opacity': String(variantConfig.starfieldSoftOpacity),
    '--pb-orb-opacity': String(variantConfig.orbOpacity),
    '--pb-circuit-opacity': String(variantConfig.circuitOpacity),
    '--pb-wireframe-opacity': String(variantConfig.wireframeOpacity),
    '--pb-glassSoft-opacity': String(variantConfig.glassSoftOpacity),
  } as CSSProperties;

  return (
    <div ref={containerRef} className={`${styles.wrapper} ${className}`} style={styleVars}>
      <div className={styles.layers} aria-hidden="true">
        <div className={`${styles.layer} ${styles.baseLayer}`} />
        <div className={`${styles.layer} ${styles.starfieldSoftLayer} ${styles.motionFar}`} />
        <div className={`${styles.layer} ${styles.orbLayer} ${styles.motionFar}`} />
        <div className={`${styles.layer} ${styles.hudLayer} ${styles.motionSlow}`} />
        <div className={`${styles.layer} ${styles.glassLayer} ${styles.motionSlow}`} />
        <div className={`${styles.layer} ${styles.circuitLayer} ${styles.motionMedium}`} />
        <div className={`${styles.layer} ${styles.streaksLayer} ${styles.motionMedium}`} />
        <div className={`${styles.layer} ${styles.waveLayer} ${styles.motionSlow}`} />
        <div className={`${styles.layer} ${styles.wireframeLayer} ${styles.motionSlow}`} />
        <div className={`${styles.layer} ${styles.timelineLayer} ${styles.motionSlow}`} />
        <div className={`${styles.layer} ${styles.panelsLayer} ${styles.motionMedium}`} />
        <div className={`${styles.layer} ${styles.glassSoftLayer} ${styles.motionNear}`} />
        <div className={`${styles.layer} ${styles.starfieldLayer} ${styles.motionFar}`} />
        <div className={`${styles.layer} ${styles.nebulaLayer} ${styles.motionFar}`} />
        <div className={`${styles.layer} ${styles.ctaLayer} ${styles.motionNear}`} />
        <div className={styles.vignetteLayer} />
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default ParallaxBackground;
export { PARALLAX_VARIANTS };
export type { MutationSection, ParallaxBackgroundProps, ParallaxIntensity, ParallaxVariant };
