import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { getParallaxOffset } from './motionTokens.js';

/* eslint-disable react/prop-types -- Scene layers are local configuration objects. */
const ParallaxLayer = ({ layer, progress, isCompact, prefersReducedMotion }) => {
  const desktopDistance = Number.isFinite(layer.distance) ? layer.distance : 0;
  const mobileDistance = Number.isFinite(layer.mobileDistance)
    ? layer.mobileDistance
    : desktopDistance * 0.32;
  const distance = isCompact ? mobileDistance : desktopDistance;
  const y = useTransform(progress, (value) => getParallaxOffset(value, distance));

  return (
    <motion.div
      aria-hidden="true"
      className={layer.className ?? 'pointer-events-none absolute inset-0'}
      style={{ y: prefersReducedMotion ? 0 : y }}
    >
      {layer.content}
    </motion.div>
  );
};

const ParallaxScene = ({ children, layers = [], className = '', contentClassName = '' }) => {
  const sceneRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const [isCompact, setIsCompact] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches,
  );
  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ['start end', 'end start'],
  });

  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)');
    const updateBreakpoint = () => setIsCompact(media.matches);
    updateBreakpoint();
    media.addEventListener('change', updateBreakpoint);
    return () => media.removeEventListener('change', updateBreakpoint);
  }, []);

  return (
    <div ref={sceneRef} className={`relative isolate ${className}`}>
      {layers.map((layer) => (
        <ParallaxLayer
          key={layer.id}
          layer={layer}
          progress={scrollYProgress}
          isCompact={isCompact}
          prefersReducedMotion={prefersReducedMotion}
        />
      ))}
      <div className={`relative z-10 ${contentClassName}`}>{children}</div>
    </div>
  );
};

export default ParallaxScene;
/* eslint-enable react/prop-types */
