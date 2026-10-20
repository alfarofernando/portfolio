export const motionTokens = {
  enterDuration: 0.5,
  enterDistance: 16,
  microDuration: 0.18,
  ease: 'easeOut',
};

export const getParallaxOffset = (progress, distance) => {
  const normalizedProgress = Number.isFinite(progress)
    ? Math.min(1, Math.max(0, progress))
    : 0.5;
  const safeDistance = Number.isFinite(distance) ? distance : 0;
  return (normalizedProgress * 2 - 1) * safeDistance;
};
