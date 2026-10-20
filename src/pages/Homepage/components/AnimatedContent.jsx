import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { motionTokens } from '../../../components/motion/motionTokens.js';

/* eslint-disable react/prop-types -- Used for localized inline content with a stable key. */
const AnimatedContent = ({ children, keyProp }) => {
  const prefersReducedMotion = useReducedMotion();
  if (prefersReducedMotion) return children;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={keyProp}
        initial={{ opacity: 0, x: -4 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 4 }}
        transition={{ duration: motionTokens.enterDuration, ease: motionTokens.ease }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedContent;
