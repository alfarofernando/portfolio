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
  rain: number;
  electric: number;
  farLights: number;
};

type MutationSection = {
  id: string;
  variant: ParallaxVariant;
};

type FloatingObjectKind = 'panel' | 'pill' | 'dot' | 'node';

type FloatingObject = {
  originX: string;
  originY: string;
  width: string;
  height?: string;
  depth: number;
  kind: FloatingObjectKind;
  duration: string;
  delay: string;
  travelX: string;
  travelY: string;
  swingX: string;
  swingY: string;
  rotateFrom: string;
  rotateTo: string;
};

type ElectricRay = {
  originX: string;
  originY: string;
  width: string;
  angleFrom: string;
  angleTo: string;
  depth: number;
  duration: string;
  delay: string;
  travelX: string;
  travelY: string;
};

type RainDrop = {
  originX: string;
  length: string;
  thickness: string;
  angle: string;
  opacity: number;
  depth: number;
  duration: string;
  delay: string;
  travelX: string;
  swayX: string;
};

type DistantLight = {
  originX: string;
  originY: string;
  size: string;
  glow: string;
  travelX: string;
  travelY: string;
  depth: number;
  duration: string;
  delay: string;
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
    rain: 0.3,
    electric: 0.34,
    farLights: 0.44,
  },
  projects: {
    base: 0.94,
    stars: 0.38,
    grid: 0.24,
    lines: 0.34,
    wave: 0.16,
    glow: 0.26,
    objects: 0.58,
    rain: 0.34,
    electric: 0.28,
    farLights: 0.36,
  },
  about: {
    base: 0.95,
    stars: 0.34,
    grid: 0.22,
    lines: 0.2,
    wave: 0.32,
    glow: 0.2,
    objects: 0.62,
    rain: 0.22,
    electric: 0.2,
    farLights: 0.34,
  },
  cta: {
    base: 0.92,
    stars: 0.2,
    grid: 0.14,
    lines: 0.12,
    wave: 0.12,
    glow: 0.46,
    objects: 0.52,
    rain: 0.1,
    electric: 0.14,
    farLights: 0.26,
  },
  default: {
    base: 0.94,
    stars: 0.34,
    grid: 0.2,
    lines: 0.22,
    wave: 0.2,
    glow: 0.24,
    objects: 0.56,
    rain: 0.2,
    electric: 0.2,
    farLights: 0.3,
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
  { originX: '8', originY: '6', width: '220px', height: '150px', depth: 0.18, kind: 'panel', duration: '25s', delay: '-3s', travelX: '132vw', travelY: '84vh', swingX: '18vw', swingY: '14vh', rotateFrom: '-8deg', rotateTo: '6deg' },
  { originX: '84', originY: '10', width: '180px', height: '124px', depth: 0.22, kind: 'panel', duration: '23s', delay: '-9s', travelX: '-126vw', travelY: '76vh', swingX: '20vw', swingY: '16vh', rotateFrom: '7deg', rotateTo: '-7deg' },
  { originX: '14', originY: '24', width: '128px', height: '48px', depth: 0.26, kind: 'pill', duration: '19s', delay: '-2s', travelX: '120vw', travelY: '52vh', swingX: '15vw', swingY: '12vh', rotateFrom: '-10deg', rotateTo: '9deg' },
  { originX: '78', originY: '30', width: '144px', height: '52px', depth: 0.3, kind: 'pill', duration: '21s', delay: '-6s', travelX: '-118vw', travelY: '46vh', swingX: '16vw', swingY: '10vh', rotateFrom: '11deg', rotateTo: '-10deg' },
  { originX: '22', originY: '56', width: '16px', height: '16px', depth: 0.38, kind: 'dot', duration: '15s', delay: '-4s', travelX: '112vw', travelY: '-68vh', swingX: '14vw', swingY: '10vh', rotateFrom: '0deg', rotateTo: '0deg' },
  { originX: '72', originY: '62', width: '12px', height: '12px', depth: 0.42, kind: 'dot', duration: '14s', delay: '-1s', travelX: '-108vw', travelY: '-64vh', swingX: '13vw', swingY: '9vh', rotateFrom: '0deg', rotateTo: '0deg' },
  { originX: '10', originY: '70', width: '188px', height: '126px', depth: 0.2, kind: 'panel', duration: '24s', delay: '-8s', travelX: '128vw', travelY: '-42vh', swingX: '20vw', swingY: '14vh', rotateFrom: '6deg', rotateTo: '-6deg' },
  { originX: '82', originY: '76', width: '232px', height: '160px', depth: 0.24, kind: 'panel', duration: '26s', delay: '-5s', travelX: '-130vw', travelY: '-48vh', swingX: '21vw', swingY: '15vh', rotateFrom: '-7deg', rotateTo: '8deg' },
  { originX: '42', originY: '82', width: '240px', height: '56px', depth: 0.32, kind: 'pill', duration: '22s', delay: '-7s', travelX: '124vw', travelY: '-70vh', swingX: '18vw', swingY: '12vh', rotateFrom: '-9deg', rotateTo: '9deg' },
  { originX: '56', originY: '20', width: '10px', height: '10px', depth: 0.45, kind: 'node', duration: '13s', delay: '-3s', travelX: '-116vw', travelY: '74vh', swingX: '14vw', swingY: '10vh', rotateFrom: '0deg', rotateTo: '0deg' },
  { originX: '35', originY: '18', width: '8px', height: '8px', depth: 0.5, kind: 'node', duration: '12s', delay: '-2s', travelX: '118vw', travelY: '68vh', swingX: '12vw', swingY: '9vh', rotateFrom: '0deg', rotateTo: '0deg' },
  { originX: '64', originY: '42', width: '140px', height: '46px', depth: 0.26, kind: 'pill', duration: '20s', delay: '-12s', travelX: '-122vw', travelY: '58vh', swingX: '17vw', swingY: '11vh', rotateFrom: '8deg', rotateTo: '-8deg' },
  { originX: '22', originY: '40', width: '150px', height: '44px', depth: 0.28, kind: 'pill', duration: '18s', delay: '-11s', travelX: '114vw', travelY: '62vh', swingX: '15vw', swingY: '11vh', rotateFrom: '-8deg', rotateTo: '8deg' },
  { originX: '92', originY: '54', width: '14px', height: '14px', depth: 0.44, kind: 'dot', duration: '14s', delay: '-5s', travelX: '-120vw', travelY: '-72vh', swingX: '13vw', swingY: '10vh', rotateFrom: '0deg', rotateTo: '0deg' },
  { originX: '6', originY: '48', width: '11px', height: '11px', depth: 0.41, kind: 'dot', duration: '13s', delay: '-7s', travelX: '118vw', travelY: '-66vh', swingX: '12vw', swingY: '9vh', rotateFrom: '0deg', rotateTo: '0deg' },
];

const ELECTRIC_RAYS: ElectricRay[] = Array.from({ length: 22 }, (_, index) => ({
  originX: `${(index * 4.7) % 100}`,
  originY: `${(index * 9.4) % 100}`,
  width: `${110 + (index % 6) * 36}px`,
  angleFrom: `${-38 + (index % 7) * 11}deg`,
  angleTo: `${-12 + (index % 6) * 12}deg`,
  depth: 0.2 + (index % 7) * 0.045,
  duration: `${7.4 + (index % 4) * 1.4}s`,
  delay: `${-index * 0.82}s`,
  travelX: `${76 + (index % 5) * 26}vw`,
  travelY: `${28 + (index % 4) * 18}vh`,
}));

const RAIN_DROPS: RainDrop[] = Array.from({ length: 86 }, (_, index) => ({
  originX: `${(index * 1.73) % 100}`,
  length: `${24 + (index % 7) * 12}px`,
  thickness: `${1 + (index % 3) * 0.65}px`,
  angle: `${66 + (index % 6) * 8}deg`,
  opacity: 0.4 + (index % 5) * 0.1,
  depth: 0.18 + (index % 9) * 0.05,
  duration: `${2.6 + (index % 6) * 0.42}s`,
  delay: `${-index * 0.28}s`,
  travelX: `${48 + (index % 7) * 24}vw`,
  swayX: `${8 + (index % 5) * 7}vw`,
}));

const DISTANT_LIGHTS: DistantLight[] = Array.from({ length: 112 }, (_, index) => ({
  originX: `${(index * 7.7) % 100}`,
  originY: `${(index * 13.4) % 100}`,
  size: `${2 + (index % 5) * 1.6}px`,
  glow: `${8 + (index % 6) * 5}px`,
  travelX: `${26 + (index % 7) * 14}vw`,
  travelY: `${22 + (index % 5) * 16}vh`,
  depth: 0.1 + (index % 10) * 0.035,
  duration: `${4.5 + (index % 8) * 1.1}s`,
  delay: `${-index * 0.37}s`,
}));

const LAYER_KEYS: Array<keyof VariantConfig> = ['base', 'stars', 'grid', 'lines', 'wave', 'glow', 'objects', 'rain', 'electric', 'farLights'];

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
    let lastScrollY = window.scrollY || 0;
    let lastScrollAt = performance.now();

    const current = {
      x: 0,
      y: 0,
      driftX: 0,
      driftY: 0,
      flowDir: 1,
      scrollY: window.scrollY || 0,
      layers: cloneConfig(variantConfig),
    };

    const target = {
      x: 0,
      y: 0,
      driftX: 0,
      driftY: 0,
      flowDir: 1,
      scrollY: window.scrollY || 0,
      layers: cloneConfig(variantConfig),
    };

    let frameId = 0;

    const applyFrame = () => {
      container.style.setProperty('--pb-shift-x', current.x.toFixed(3));
      container.style.setProperty('--pb-shift-y', current.y.toFixed(3));
      container.style.setProperty('--pb-drift-x', current.driftX.toFixed(3));
      container.style.setProperty('--pb-drift-y', current.driftY.toFixed(3));
      container.style.setProperty('--pb-flow-dir', current.flowDir.toFixed(3));
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
        rain: 0,
        electric: 0,
        farLights: 0,
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
      const deltaY = scrollY - lastScrollY;
      lastScrollY = scrollY;

      if (Math.abs(deltaY) > 0.2) {
        lastScrollAt = nowMs;
      }

      const reversing = nowMs - lastScrollAt < 280;
      target.flowDir = reversing ? -1 : 1;

      const doc = document.documentElement;
      const maxScroll = Math.max((doc.scrollHeight || 0) - (window.innerHeight || 1), 1);
      const progress = clamp(scrollY / maxScroll, 0, 1);
      const normalized = progress * 2 - 1;
      const drift = baseTranslate * intensityFactor;
      const flow = target.flowDir;

      if (reduceMotion()) {
        target.x = 0;
        target.y = 0;
        target.driftX = 0;
        target.driftY = 0;
        target.flowDir = 1;
      } else {
        target.x = flow * (drift * 0.48 + Math.sin(time * 0.9) * drift * 0.22) + normalized * drift * 0.14;
        target.y = flow * (drift * 0.3 + Math.cos(time * 0.74 + 0.4) * drift * 0.18) + normalized * drift * 0.36;
        target.driftX = flow * (16 * intensityFactor + Math.sin(time * 1.42) * 8 * intensityFactor);
        target.driftY = flow * (11 * intensityFactor + Math.cos(time * 1.24) * 7 * intensityFactor);
      }

      target.scrollY = scrollY;
      target.layers = computeBlendedConfig();

      if (!reduceMotion()) {
        target.layers.stars = clamp(target.layers.stars + Math.sin(time * 0.8) * 0.03, 0, 0.95);
        target.layers.glow = clamp(target.layers.glow + Math.sin(time * 0.5 + 1.2) * 0.04, 0, 0.95);
        target.layers.objects = clamp(target.layers.objects + Math.cos(time * 0.62) * 0.03, 0, 0.95);
        target.layers.electric = clamp(target.layers.electric + Math.cos(time * 1.4) * 0.05, 0, 0.95);
        target.layers.rain = clamp(target.layers.rain + Math.sin(time * 1.05) * 0.03, 0, 0.95);
        target.layers.farLights = clamp(target.layers.farLights + Math.cos(time * 0.7 + 0.9) * 0.03, 0, 0.95);
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
        const x =
          Math.sin(current.scrollY * 0.001 + time * 0.75 + index * 0.44) * 9 * depth * mobileScale
          + current.flowDir * 6 * depth * intensityFactor * mobileScale;
        const rotate = normalized * 1.2 * depth * mobileScale;
        const scale = 1 + depth * 0.016;

        element.style.willChange = 'transform';
        element.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${rotate.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      });
    };

    const tick = (nowMs: number) => {
      computeTarget(nowMs);

      const ease = reduceMotion() ? 1 : 0.092;

      current.x += (target.x - current.x) * ease;
      current.y += (target.y - current.y) * ease;
      current.driftX += (target.driftX - current.driftX) * ease;
      current.driftY += (target.driftY - current.driftY) * ease;
      current.flowDir += (target.flowDir - current.flowDir) * 0.22;
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
    '--pb-rain-opacity': String(variantConfig.rain),
    '--pb-electric-opacity': String(variantConfig.electric),
    '--pb-farLights-opacity': String(variantConfig.farLights),
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

        <div className={styles.farLightsScene}>
          {DISTANT_LIGHTS.map((light, index) => (
            <span
              key={`far-light-${index}`}
              className={styles.farLightWrapper}
              style={
                {
                  '--fl-origin-x': light.originX,
                  '--fl-origin-y': light.originY,
                  '--fl-size': light.size,
                  '--fl-glow': light.glow,
                  '--fl-travel-x': light.travelX,
                  '--fl-travel-y': light.travelY,
                  '--fl-depth': light.depth,
                  '--fl-duration': light.duration,
                  '--fl-delay': light.delay,
                } as CSSProperties
              }
            >
              <span className={styles.farLight} />
            </span>
          ))}
        </div>

        <div className={styles.rainScene}>
          {RAIN_DROPS.map((drop, index) => (
            <span
              key={`rain-drop-${index}`}
              className={styles.rainDropWrapper}
              style={
                {
                  '--rd-origin-x': drop.originX,
                  '--rd-length': drop.length,
                  '--rd-thickness': drop.thickness,
                  '--rd-angle': drop.angle,
                  '--rd-opacity': drop.opacity,
                  '--rd-depth': drop.depth,
                  '--rd-duration': drop.duration,
                  '--rd-delay': drop.delay,
                  '--rd-travel-x': drop.travelX,
                  '--rd-sway-x': drop.swayX,
                } as CSSProperties
              }
            >
              <span className={styles.rainDrop} />
            </span>
          ))}
        </div>

        <div className={styles.electricScene}>
          {ELECTRIC_RAYS.map((ray, index) => (
            <span
              key={`electric-ray-${index}`}
              className={styles.electricRayWrapper}
              style={
                {
                  '--er-origin-x': ray.originX,
                  '--er-origin-y': ray.originY,
                  '--er-width': ray.width,
                  '--er-angle-from': ray.angleFrom,
                  '--er-angle-to': ray.angleTo,
                  '--er-depth': ray.depth,
                  '--er-duration': ray.duration,
                  '--er-delay': ray.delay,
                  '--er-travel-x': ray.travelX,
                  '--er-travel-y': ray.travelY,
                } as CSSProperties
              }
            >
              <span className={styles.electricRay} />
            </span>
          ))}
        </div>

        <div className={styles.objectScene}>
          {FLOATING_OBJECTS.map((object, index) => (
            <span
              key={`${object.kind}-${index}`}
              className={styles.objectWrapper}
              style={
                {
                  '--fo-origin-x': object.originX,
                  '--fo-origin-y': object.originY,
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
                    '--fo-travel-x': object.travelX,
                    '--fo-travel-y': object.travelY,
                    '--fo-swing-x': object.swingX,
                    '--fo-swing-y': object.swingY,
                    '--fo-rotate-from': object.rotateFrom,
                    '--fo-rotate-to': object.rotateTo,
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
