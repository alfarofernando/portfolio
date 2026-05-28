import { useMemo } from 'react';
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
  weight: number;
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

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);

const randomTravel = (maxDistance: number, minAbs: number, unit: 'vw' | 'vh') => {
  let value = 0;
  while (Math.abs(value) < minAbs) {
    value = randomBetween(-maxDistance, maxDistance);
  }
  return `${value.toFixed(2)}${unit}`;
};

const pickKind = (index: number): FloatingObjectKind => {
  const kinds: FloatingObjectKind[] = ['panel', 'pill', 'dot', 'node'];
  return kinds[index % kinds.length];
};

const createFloatingObjects = (count: number): FloatingObject[] => (
  Array.from({ length: count }, (_, index) => {
    const kind = pickKind(index);
    const weight = randomBetween(0.62, 1.42);

    const widthBase = kind === 'panel'
      ? randomBetween(120, 260)
      : kind === 'pill'
        ? randomBetween(110, 220)
        : kind === 'dot'
          ? randomBetween(10, 18)
          : randomBetween(8, 16);

    const heightBase = kind === 'panel'
      ? randomBetween(72, 168)
      : kind === 'pill'
        ? randomBetween(36, 70)
        : widthBase;

    const sizeWeight = kind === 'panel' || kind === 'pill' ? weight : 1;
    const width = `${Math.round(widthBase * sizeWeight)}px`;
    const height = `${Math.round(heightBase * sizeWeight)}px`;

    return {
      originX: randomBetween(0, 100).toFixed(2),
      originY: randomBetween(0, 100).toFixed(2),
      width,
      height,
      depth: Number(randomBetween(0.16, 0.52).toFixed(3)),
      kind,
      duration: `${(randomBetween(9.6, 15.2) * (0.95 + weight * 0.32)).toFixed(2)}s`,
      delay: `${(-randomBetween(0, 22)).toFixed(2)}s`,
      travelX: randomTravel(180, 70, 'vw'),
      travelY: randomTravel(180, 70, 'vh'),
      swingX: `${randomBetween(5, 16).toFixed(2)}vw`,
      swingY: `${randomBetween(5, 16).toFixed(2)}vh`,
      rotateFrom: `${randomBetween(-12, 12).toFixed(2)}deg`,
      rotateTo: `${randomBetween(-12, 12).toFixed(2)}deg`,
      weight: Number(weight.toFixed(3)),
    };
  })
);

const createElectricRays = (count: number): ElectricRay[] => (
  Array.from({ length: count }, () => ({
    originX: randomBetween(0, 100).toFixed(2),
    originY: randomBetween(0, 100).toFixed(2),
    width: `${Math.round(randomBetween(120, 300))}px`,
    angleFrom: `${randomBetween(-46, 14).toFixed(2)}deg`,
    angleTo: `${randomBetween(-22, 40).toFixed(2)}deg`,
    depth: Number(randomBetween(0.2, 0.48).toFixed(3)),
    duration: `${randomBetween(6.8, 10.4).toFixed(2)}s`,
    delay: `${(-randomBetween(0, 16)).toFixed(2)}s`,
    travelX: randomTravel(140, 45, 'vw'),
    travelY: randomTravel(110, 35, 'vh'),
  }))
);

const createRainDrops = (count: number): RainDrop[] => (
  Array.from({ length: count }, () => ({
    originX: randomBetween(0, 100).toFixed(2),
    length: `${Math.round(randomBetween(8, 18))}px`,
    thickness: `${randomBetween(4, 11).toFixed(2)}px`,
    opacity: Number(randomBetween(0.4, 0.9).toFixed(2)),
    depth: Number(randomBetween(0.16, 0.56).toFixed(3)),
    duration: `${randomBetween(1.8, 3.8).toFixed(2)}s`,
    delay: `${(-randomBetween(0, 14)).toFixed(2)}s`,
    travelX: randomTravel(20, 4, 'vw'),
    swayX: `${randomBetween(2, 8).toFixed(2)}vw`,
  }))
);

const createDistantLights = (count: number): DistantLight[] => (
  Array.from({ length: count }, () => ({
    originX: randomBetween(0, 100).toFixed(2),
    originY: randomBetween(0, 100).toFixed(2),
    size: `${randomBetween(2, 9).toFixed(2)}px`,
    glow: `${randomBetween(8, 38).toFixed(2)}px`,
    travelX: randomTravel(90, 24, 'vw'),
    travelY: randomTravel(90, 24, 'vh'),
    depth: Number(randomBetween(0.1, 0.44).toFixed(3)),
    duration: `${randomBetween(4.2, 8.8).toFixed(2)}s`,
    delay: `${(-randomBetween(0, 18)).toFixed(2)}s`,
  }))
);

const ParallaxBackground = ({
  variant = 'default',
  intensity = 'medium',
  className = '',
  children,
  mutationSections,
  mediaParallax,
}: ParallaxBackgroundProps) => {
  void mutationSections;
  void mediaParallax;

  const variantConfig = useMemo(
    () => PARALLAX_VARIANTS[variant] ?? PARALLAX_VARIANTS.default,
    [variant],
  );
  const intensityFactor = INTENSITY_MULTIPLIER[intensity] ?? INTENSITY_MULTIPLIER.medium;

  const floatingObjects = useMemo(() => createFloatingObjects(8), []);
  const electricRays = useMemo(() => createElectricRays(11), []);
  const rainDrops = useMemo(() => createRainDrops(43), []);
  const distantLights = useMemo(() => createDistantLights(56), []);

  const styleVars = {
    '--pb-opacity-scale': String(0.74 + intensityFactor * 0.22),
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
    <div className={`${styles.wrapper} ${className}`} style={styleVars}>
      <div className={styles.layers} aria-hidden="true">
        <div className={`${styles.layer} ${styles.baseLayer}`} />
        <div className={`${styles.layer} ${styles.starLayer} ${styles.motionFar}`} />
        <div className={`${styles.layer} ${styles.gridLayer} ${styles.motionSlow}`} />
        <div className={`${styles.layer} ${styles.lineLayer} ${styles.motionMedium}`} />
        <div className={`${styles.layer} ${styles.waveLayer} ${styles.motionSlow}`} />
        <div className={`${styles.layer} ${styles.glowLayer} ${styles.motionNear}`} />

        <div className={styles.farLightsScene}>
          {distantLights.map((light, index) => (
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
          {rainDrops.map((drop, index) => (
            <span
              key={`rain-drop-${index}`}
              className={styles.rainDropWrapper}
              style={
                {
                  '--rd-origin-x': drop.originX,
                  '--rd-length': drop.length,
                  '--rd-thickness': drop.thickness,
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
          {electricRays.map((ray, index) => (
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
          {floatingObjects.map((object, index) => (
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
                  '--fo-weight': object.weight,
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
