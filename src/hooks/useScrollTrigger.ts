import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface MascotPosition {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
}

export const useMascotScrollTrigger = (
  onPositionChange: (position: MascotPosition) => void
) => {
  useEffect(() => {
    // Define mascot positions for each section
    const sections = [
      { id: 'hero', position: [2, 0, 0], rotation: [0, 0, 0], scale: 1.2 },
      { id: 'about', position: [-2.5, -0.5, 0], rotation: [0, 0.3, 0], scale: 1 },
      { id: 'skills', position: [2.5, 0.8, 0], rotation: [0, -0.3, 0], scale: 0.9 },
      { id: 'highlights', position: [-2, -0.3, 0], rotation: [0, 0, 0.2], scale: 1 },
      { id: 'projects', position: [0, 1.5, 0], rotation: [0, 0, 0], scale: 1.1 },
      { id: 'publications', position: [1.5, 0, 0], rotation: [0, 0.2, 0], scale: 0.95 },
    ];

    sections.forEach((section, index) => {
      const nextSection = sections[index + 1];
      
      ScrollTrigger.create({
        trigger: `#${section.id}`,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          onPositionChange({
            position: section.position as [number, number, number],
            rotation: section.rotation as [number, number, number],
            scale: section.scale,
          });
        },
        onEnterBack: () => {
          onPositionChange({
            position: section.position as [number, number, number],
            rotation: section.rotation as [number, number, number],
            scale: section.scale,
          });
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [onPositionChange]);
};

export const useParallax = (ref: React.RefObject<HTMLElement>, speed: number = 0.5) => {
  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    gsap.to(element, {
      yPercent: -50 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === element) trigger.kill();
      });
    };
  }, [ref, speed]);
};