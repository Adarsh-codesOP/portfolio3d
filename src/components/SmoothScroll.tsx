import { useEffect, ReactNode } from 'react';
import Lenis from 'lenis';
import { useIsMobile } from '@/hooks/use-mobile';

interface SmoothScrollProps {
  children: ReactNode;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const isMobile = useIsMobile();

  useEffect(() => {
    // Disable smooth scroll on mobile for better performance
    if (isMobile) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [isMobile]);

  return <>{children}</>;
}