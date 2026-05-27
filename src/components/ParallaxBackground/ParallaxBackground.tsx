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
    baseOpacity: 0.58,
    hudOpacity: 0.42,
    glassOpacity: 0.34,
    timelineOpacity: 0.14,
    ctaOpacity: 0,
    starfieldOpacity: 0.3,
    nebulaOpacity: 0.24,
    streaksOpacity: 0.26,
    waveOpacity: 0.2,
    panelsOpacity: 0.18,
  },
  projects: {
    baseOpacity: 0.52,
    hudOpacity: 0.3,
    glassOpacity: 0.24,
    timelineOpacity: 0.12,
    ctaOpacity: 0,
    starfieldOpacity: 0.2,
    nebulaOpacity: 0.16,
    streaksOpacity: 0.24,
    waveOpacity: 0.12,
    panelsOpacity: 0.12,
  },
  about: {
    baseOpacity: 0.56,
    hudOpacity: 0.34,
    glassOpacity: 0.18,
    timelineOpacity: 0.42,
    ctaOpacity: 0,
    starfieldOpacity: 0.24,
    nebulaOpacity: 0.16,
    streaksOpacity: 0.28,
    waveOpacity: 0.34,
    panelsOpacity: 0.14,
  },
  cta: {
    baseOpacity: 0,
    hudOpacity: 0,
    glassOpacity: 0,
    timelineOpacity: 0,
    ctaOpacity: 0.82,
    starfieldOpacity: 0.06,
    nebulaOpacity: 0.28,
    streaksOpacity: 0,
    waveOpacity: 0.12,
    panelsOpacity: 0.1,
  },
  default: {
    baseOpacity: 0.54,
    hudOpacity: 0.32,
    glassOpacity: 0.26,
    timelineOpacity: 0.18,
    ctaOpacity: 0,
    starfieldOpacity: 0.2,
    nebulaOpacity: 0.18,
    streaksOpacity: 0.2,
    waveOpacity: 0.18,
    panelsOpacity: 0.16,
  },
};

const INTENSITY_MULTIPLIER: Record<ParallaxIntensity, number> = {
  low: 1.2,
  medium: 2,
  high: 2.8,
};

const MAX_TRANSLATE_BY_VARIANT: Record<ParallaxVariant, number> = {
  home: 82,
  projects: 72,
  about: 86,
  cta: 40,
  default: 78,
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const EMPTY_CONFIG: VariantConfig = {
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
};

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
    let frameId = 0;
    let ticking = false;

    let sectionTargets: Array<MutationSection & { element: HTMLElement }> = [];
    let mediaTargets: HTMLElement[] = [];

    const mutationEnabled = Array.isArray(mutationSections) && mutationSections.length > 0;
    const intensityValue = INTENSITY_MULTIPLIER[intensity] ?? INTENSITY_MULTIPLIER.medium;

    const setTransforms = (x: number, y: number) => {
      container.style.setProperty('--pb-shift-x', x.toFixed(3));
      container.style.setProperty('--pb-shift-y', y.toFixed(3));
    };

    const setOpacityConfig = (config: VariantConfig) => {
      container.style.setProperty('--pb-base-opacity', String(config.baseOpacity));
      container.style.setProperty('--pb-hud-opacity', String(config.hudOpacity));
      container.style.setProperty('--pb-glass-opacity', String(config.glassOpacity));
      container.style.setProperty('--pb-timeline-opacity', String(config.timelineOpacity));
      container.style.setProperty('--pb-cta-opacity', String(config.ctaOpacity));
      container.style.setProperty('--pb-starfield-opacity', String(config.starfieldOpacity));
      container.style.setProperty('--pb-nebula-opacity', String(config.nebulaOpacity));
      container.style.setProperty('--pb-streaks-opacity', String(config.streaksOpacity));
      container.style.setProperty('--pb-wave-opacity', String(config.waveOpacity));
      container.style.setProperty('--pb-panels-opacity', String(config.panelsOpacity));
    };

    const resetMediaTransforms = () => {
      mediaTargets.forEach((element) => {
        element.style.transform = '';
        element.style.willChange = '';
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

    const getBlendedConfig = (viewportHeight: number) => {
      if (!mutationEnabled || sectionTargets.length === 0) {
        return variantConfig;
      }

      const viewportCenter = viewportHeight / 2;
      const weighted = { ...EMPTY_CONFIG };
      let weightTotal = 0;
      let nearestSectionVariant: ParallaxVariant = variant;
      let nearestDistance = Number.POSITIVE_INFINITY;

      sectionTargets.forEach((section) => {
        const rect = section.element.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const distance = Math.abs(center - viewportCenter);
        const influence = clamp(1 - distance / (viewportHeight * 1.05), 0, 1);
        const weight = influence ** 2.8;

        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestSectionVariant = section.variant;
        }

        if (weight <= 0) return;

        const config = PARALLAX_VARIANTS[section.variant] ?? PARALLAX_VARIANTS.default;

        weighted.baseOpacity += config.baseOpacity * weight;
        weighted.hudOpacity += config.hudOpacity * weight;
        weighted.glassOpacity += config.glassOpacity * weight;
        weighted.timelineOpacity += config.timelineOpacity * weight;
        weighted.ctaOpacity += config.ctaOpacity * weight;
        weighted.starfieldOpacity += config.starfieldOpacity * weight;
        weighted.nebulaOpacity += config.nebulaOpacity * weight;
        weighted.streaksOpacity += config.streaksOpacity * weight;
        weighted.waveOpacity += config.waveOpacity * weight;
        weighted.panelsOpacity += config.panelsOpacity * weight;

        weightTotal += weight;
      });

      if (weightTotal <= 0.0001) {
        return PARALLAX_VARIANTS[nearestSectionVariant] ?? variantConfig;
      }

      return {
        baseOpacity: weighted.baseOpacity / weightTotal,
        hudOpacity: weighted.hudOpacity / weightTotal,
        glassOpacity: weighted.glassOpacity / weightTotal,
        timelineOpacity: weighted.timelineOpacity / weightTotal,
        ctaOpacity: weighted.ctaOpacity / weightTotal,
        starfieldOpacity: weighted.starfieldOpacity / weightTotal,
        nebulaOpacity: weighted.nebulaOpacity / weightTotal,
        streaksOpacity: weighted.streaksOpacity / weightTotal,
        waveOpacity: weighted.waveOpacity / weightTotal,
        panelsOpacity: weighted.panelsOpacity / weightTotal,
      };
    };

    const updateMediaParallax = (viewportHeight: number, scrollY: number) => {
      if (!mediaParallax || mediaTargets.length === 0) return;

      const viewportCenter = viewportHeight / 2;
      const mobileScale = window.innerWidth < 768 ? 0.58 : 1;

      mediaTargets.forEach((element, index) => {
        const depth = Number(element.dataset.parallaxMedia || '1');
        const rect = element.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const normalized = clamp((viewportCenter - center) / viewportHeight, -1, 1);

        const shiftY = normalized * 120 * intensityValue * depth * mobileScale;
        const shiftX = Math.sin(scrollY * 0.018 + index * 0.9) * 22 * depth * mobileScale;
        const rotate = normalized * 5 * depth * mobileScale;
        const scale = 1 + 0.035 * depth;

        element.style.willChange = 'transform';
        element.style.transform = `translate3d(${shiftX.toFixed(2)}px, ${shiftY.toFixed(2)}px, 0) rotate(${rotate.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      });
    };

    const updateParallax = () => {
      ticking = false;

      if (mediaQuery.matches) {
        setTransforms(0, 0);
        setOpacityConfig(mutationEnabled ? getBlendedConfig(window.innerHeight || 1) : variantConfig);
        resetMediaTransforms();
        return;
      }

      if (mutationEnabled && sectionTargets.length === 0) {
        refreshTargets();
      }

      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const viewportCenter = viewportHeight / 2;
      const elementCenter = rect.top + rect.height / 2;
      const normalized = clamp((viewportCenter - elementCenter) / viewportHeight, -1, 1);

      const activeConfig = getBlendedConfig(viewportHeight);
      setOpacityConfig(activeConfig);

      const scrollY = window.scrollY || window.pageYOffset || 0;
      const variantRange = MAX_TRANSLATE_BY_VARIANT[variant] ?? MAX_TRANSLATE_BY_VARIANT.default;
      const violentRange = variantRange * intensityValue * 2.2;
      const waveX = Math.sin(scrollY * 0.014) * 28 * intensityValue;
      const waveY = Math.cos(scrollY * 0.01) * 34 * intensityValue;

      const shiftY = normalized * violentRange + waveY;
      const shiftX = normalized * violentRange * 0.72 + waveX;

      setTransforms(shiftX, shiftY);
      updateMediaParallax(viewportHeight, scrollY);
    };

    const requestTick = () => {
      if (ticking) return;
      ticking = true;
      frameId = window.requestAnimationFrame(updateParallax);
    };

    const handleMotionPreferenceChange = () => {
      if (mediaQuery.matches) {
        setTransforms(0, 0);
        resetMediaTransforms();
      } else {
        requestTick();
      }
    };

    refreshTargets();
    setOpacityConfig(variantConfig);
    requestTick();

    const handleResize = () => {
      refreshTargets();
      requestTick();
    };

    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', requestTick, { passive: true });

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMotionPreferenceChange);
    } else {
      mediaQuery.addListener(handleMotionPreferenceChange);
    }

    return () => {
      window.removeEventListener('scroll', requestTick);
      window.removeEventListener('orientationchange', requestTick);
      window.removeEventListener('resize', handleResize);

      if (mediaQuery.addEventListener) {
        mediaQuery.removeEventListener('change', handleMotionPreferenceChange);
      } else {
        mediaQuery.removeListener(handleMotionPreferenceChange);
      }

      resetMediaTransforms();

      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
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
  } as CSSProperties;

  return (
    <div ref={containerRef} className={`${styles.wrapper} ${className}`} style={styleVars}>
      <div className={styles.layers} aria-hidden="true">
        <div className={`${styles.layer} ${styles.baseLayer}`} />
        <div className={`${styles.layer} ${styles.starfieldLayer} ${styles.motionFar}`} />
        <div className={`${styles.layer} ${styles.nebulaLayer} ${styles.motionSlow}`} />
        <div className={`${styles.layer} ${styles.hudLayer} ${styles.motionSlow}`} />
        <div className={`${styles.layer} ${styles.glassLayer} ${styles.motionMedium}`} />
        <div className={`${styles.layer} ${styles.streaksLayer} ${styles.motionStrong}`} />
        <div className={`${styles.layer} ${styles.waveLayer} ${styles.motionMedium}`} />
        <div className={`${styles.layer} ${styles.timelineLayer} ${styles.motionStrong}`} />
        <div className={`${styles.layer} ${styles.panelsLayer} ${styles.motionNear}`} />
        <div className={`${styles.layer} ${styles.ctaLayer} ${styles.motionMedium}`} />
        <div className={styles.vignetteLayer} />
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default ParallaxBackground;
export { PARALLAX_VARIANTS };
export type { MutationSection, ParallaxBackgroundProps, ParallaxIntensity, ParallaxVariant };
