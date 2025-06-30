import { motion } from 'framer-motion';
import { THEME } from '@/constants';
import type { SplashAnimation as SplashAnimationType } from '@/types';
import './SplashAnimation.css';

interface SplashAnimationProps {
  splash: SplashAnimationType;
  onComplete: () => void;
}

export const SplashAnimation: React.FC<SplashAnimationProps> = ({ splash, onComplete }) => {
  const { x, y, toDark } = splash;
  
  // Calculate max radius needed to cover the screen
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const maxRadius = Math.sqrt(vw * vw + vh * vh);
  const initialSize = 50;

  return (
    <motion.div
      className="splash-animation"
      initial={{
        scale: 0,
        opacity: 0.7,
        background: toDark ? THEME.DARK_COLOR : THEME.LIGHT_COLOR,
      }}
      animate={{
        scale: maxRadius / initialSize,
        opacity: 1,
        background: toDark ? THEME.DARK_COLOR : THEME.LIGHT_COLOR,
      }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration: 0.55, 
        ease: [0.4, 0, 0.2, 1] 
      }}
      style={{
        left: x - initialSize,
        top: y - initialSize,
      }}
      onAnimationComplete={onComplete}
    />
  );
}; 