import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export interface ScrollRevealProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'zoom' | 'fade';
  distance?: number;
  threshold?: number;
  triggerOnce?: boolean;
  className?: string;
  scaleInitial?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  delay = 0,
  duration = 0.8,
  direction = 'up',
  distance = 50,
  threshold = 0.15,
  triggerOnce = true,
  className = '',
  scaleInitial = 0.96,
  ...rest
}) => {
  const { ref, inView } = useInView({
    threshold,
    triggerOnce,
  });

  const getHiddenTransform = () => {
    switch (direction) {
      case 'up':
        return { y: distance, x: 0, scale: scaleInitial };
      case 'down':
        return { y: -distance, x: 0, scale: scaleInitial };
      case 'left':
        return { x: distance, y: 0, scale: scaleInitial };
      case 'right':
        return { x: -distance, y: 0, scale: scaleInitial };
      case 'zoom':
        return { x: 0, y: 0, scale: 0.88 };
      case 'fade':
      default:
        return { x: 0, y: 0, scale: 1 };
    }
  };

  const hiddenTransform = getHiddenTransform();

  const variants = {
    hidden: {
      opacity: 0,
      ...hiddenTransform,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1] as const, // Apple/Stripe cinematic cubic-bezier
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={variants}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
};
