export const motionTokens = {
  enterDuration: 0.62,
  enterDistance: 8,
  microDuration: 0.22,
  ease: [0.22, 1, 0.36, 1],
  parallaxSpring: { stiffness: 70, damping: 24, mass: 0.5 },
};

export const getParallaxOffset = (progress, distance) => {
  const normalizedProgress = Number.isFinite(progress)
    ? Math.min(1, Math.max(0, progress))
    : 0.5;
  const safeDistance = Number.isFinite(distance) ? distance : 0;
  return (normalizedProgress * 2 - 1) * safeDistance;
};
