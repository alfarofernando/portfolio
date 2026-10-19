import styles from './ParallaxBackground.module.css';

type ParallaxBackgroundProps = {
  children: React.ReactNode;
  className?: string;
};

const ParallaxBackground = ({ children, className = '' }: ParallaxBackgroundProps) => (
  <div className={`${styles.wrapper} ${className}`}>{children}</div>
);

export default ParallaxBackground;
