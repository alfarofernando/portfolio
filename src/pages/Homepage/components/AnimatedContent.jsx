import { motion, AnimatePresence } from 'framer-motion';

const AnimatedContent = ({ children, keyProp }) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={keyProp}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  </AnimatePresence>
);

export default AnimatedContent;