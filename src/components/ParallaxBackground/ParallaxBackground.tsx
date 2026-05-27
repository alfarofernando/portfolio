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

type ParallaxBackgroundProps = {
  variant?: ParallaxVariant;
  intensity?: ParallaxIntensity;
  className?: string;
  children?: ReactNode;
};

const PARALLAX_VARIANTS: Record<ParallaxVariant, VariantConfig> = {
  home: {
    baseOpacity: 0.55,
    hudOpacity: 0.34,
    glassOpacity: 0.26,
    timelineOpacity: 0.12,
    ctaOpacity: 0,
    starfieldOpacity: 0.24,
    nebulaOpacity: 0.2,
    streaksOpacity: 0.16,
    waveOpacity: 0.14,
    panelsOpacity: 0.14,
  },
  projects: {
    baseOpacity: 0.44,
    hudOpacity: 0.24,
    glassOpacity: 0.17,
    timelineOpacity: 0.08,
    ctaOpacity: 0,
    starfieldOpacity: 0.16,
    nebulaOpacity: 0.12,
    streaksOpacity: 0.12,
    waveOpacity: 0.08,
    panelsOpacity: 0.08,
  },
  about: {
    baseOpacity: 0.5,
    hudOpacity: 0.27,
    glassOpacity: 0.12,
    timelineOpacity: 0.34,
    ctaOpacity: 0,
    starfieldOpacity: 0.18,
    nebulaOpacity: 0.1,
    streaksOpacity: 0.18,
    waveOpacity: 0.24,
    panelsOpacity: 0.1,
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
    baseOpacity: 0.5,
    hudOpacity: 0.28,
    glassOpacity: 0.2,
    timelineOpacity: 0.1,
    ctaOpacity: 0,
    starfieldOpacity: 0.16,
    nebulaOpacity: 0.14,
    streaksOpacity: 0.12,
    waveOpacity: 0.12,
    panelsOpacity: 0.1,
  },
};

const INTENSITY_MULTIPLIER: Record<ParallaxIntensity, number> = {
  low: 1,
  medium: 1.45,
  high: 1.95,
};

const MAX_TRANSLATE_BY_VARIANT: Record<ParallaxVariant, number> = {
  home: 56,
  projects: 44,
  about: 58,
  cta: 30,
  default: 48,
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const ParallaxBackground = ({
  variant = 'default',
  intensity = 'medium',
  className = '',
  children,
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

    const intensityValue = INTENSITY_MULTIPLIER[intensity] ?? INTENSITY_MULTIPLIER.medium;
    const maxTranslate = MAX_TRANSLATE_BY_VARIANT[variant] ?? MAX_TRANSLATE_BY_VARIANT.default;

    const setTransforms = (x: number, y: number) => {
      container.style.setProperty('--pb-shift-x', x.toFixed(3));
      container.style.setProperty('--pb-shift-y', y.toFixed(3));
    };

    const updateParallax = () => {
      ticking = false;

      if (mediaQuery.matches) {
        setTransforms(0, 0);
        return;
      }

      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const viewportCenter = viewportHeight / 2;
      const elementCenter = rect.top + rect.height / 2;

      const normalized = clamp((viewportCenter - elementCenter) / viewportHeight, -1, 1);
      const shiftY = normalized * maxTranslate * intensityValue;
      const shiftX = normalized * maxTranslate * 0.35 * intensityValue;

      setTransforms(shiftX, shiftY);
    };

    const requestTick = () => {
      if (ticking) return;
      ticking = true;
      frameId = window.requestAnimationFrame(updateParallax);
    };

    const handleMotionPreferenceChange = () => {
      if (mediaQuery.matches) {
        setTransforms(0, 0);
      } else {
        requestTick();
      }
    };

    requestTick();
    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick, { passive: true });
    window.addEventListener('orientationchange', requestTick, { passive: true });

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMotionPreferenceChange);
    } else {
      mediaQuery.addListener(handleMotionPreferenceChange);
    }

    return () => {
      window.removeEventListener('scroll', requestTick);
      window.removeEventListener('resize', requestTick);
      window.removeEventListener('orientationchange', requestTick);

      if (mediaQuery.addEventListener) {
        mediaQuery.removeEventListener('change', handleMotionPreferenceChange);
      } else {
        mediaQuery.removeListener(handleMotionPreferenceChange);
      }

      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [intensity, variant]);

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
        <div className={`${styles.layer} ${styles.hudLayer} ${styles.motionSlow}`} />
        <div className={`${styles.layer} ${styles.glassLayer} ${styles.motionMedium}`} />
        <div className={`${styles.layer} ${styles.timelineLayer} ${styles.motionStrong}`} />
        <div className={`${styles.layer} ${styles.starfieldLayer} ${styles.motionFar}`} />
        <div className={`${styles.layer} ${styles.nebulaLayer} ${styles.motionSlow}`} />
        <div className={`${styles.layer} ${styles.streaksLayer} ${styles.motionStrong}`} />
        <div className={`${styles.layer} ${styles.waveLayer} ${styles.motionMedium}`} />
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
export type { ParallaxBackgroundProps, ParallaxIntensity, ParallaxVariant };
