import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxItemProps {
  children?: React.ReactNode;
  speed?: number; // e.g. -50 to 50 or offset in px
  className?: string;
}

export const ParallaxItem: React.FC<ParallaxItemProps> = ({
  children,
  speed = 40,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-speed, speed]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
};

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  backgroundSpeed?: number;
}

export const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  className = '',
  backgroundSpeed = -30,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [0, backgroundSpeed]);

  return (
    <div ref={sectionRef} className={`relative overflow-hidden ${className}`}>
      {/* Decorative Parallax Glow / Aura */}
      <motion.div
        style={{ y: bgY }}
        className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-br from-orange-200/40 via-amber-100/30 to-transparent rounded-full blur-3xl z-0"
      />
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, -backgroundSpeed * 1.2]) }}
        className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 bg-gradient-to-tl from-emerald-200/30 via-sky-100/20 to-transparent rounded-full blur-3xl z-0"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};
