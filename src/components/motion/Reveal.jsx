import { motion, useReducedMotion } from 'framer-motion';
import { motionTokens } from './motionTokens.js';

/* eslint-disable react/prop-types -- Shared wrapper forwards native and ARIA attributes. */
const Reveal = ({ children, className = '', delay = 0, as = 'div', ...props }) => {
  const prefersReducedMotion = useReducedMotion();
  const Component = {
    article: motion.article,
    header: motion.header,
    nav: motion.nav,
    section: motion.section,
  }[as] ?? motion.div;

  return (
    <Component
      initial={prefersReducedMotion ? false : { opacity: 0, y: motionTokens.enterDistance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{
        duration: prefersReducedMotion ? 0 : motionTokens.enterDuration,
        delay: prefersReducedMotion ? 0 : Math.min(delay, 0.27),
        ease: motionTokens.ease,
      }}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Reveal;
