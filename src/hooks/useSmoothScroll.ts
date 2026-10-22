import { useEffect, useRef } from 'react';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';

export function useSmoothScroll(enabled: boolean = true) {
  const scrollRef = useRef<LocomotiveScroll | null>(null);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    try {
      scrollRef.current = new LocomotiveScroll({
        lenisOptions: {
          lerp: 0.08,
          duration: 1.2,
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 1.5,
        },
      });
    } catch (err) {
      console.warn('Smooth scroll initialization fallback:', err);
    }

    return () => {
      if (scrollRef.current) {
        try {
          scrollRef.current.destroy();
        } catch {
          // ignore cleanup error
        }
        scrollRef.current = null;
      }
    };
  }, [enabled]);

  return scrollRef;
}
