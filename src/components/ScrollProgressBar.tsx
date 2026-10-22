import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export const ScrollProgressBar: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 25,
    restDelta: 0.001,
  });

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-50 pointer-events-none bg-orange-100/30">
      <motion.div
        className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-500 origin-left shadow-[0_0_12px_rgba(249,115,22,0.8)]"
        style={{ scaleX }}
      />
    </div>
  );
};
