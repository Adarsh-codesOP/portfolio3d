import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface MascotPosition {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
}

export const useMascotScrollTrigger = (
  onPositionChange: (position: MascotPosition & { section?: string }) => void,
  minimalFX: boolean = false,
  mascotType: 'drone' | 'robot' = 'drone'
) => {
  useEffect(() => {
    if (minimalFX) {
      // Kill all existing triggers if switching to minimal mode
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      return;
    }

    // Drone Configuration
    const droneSections = [
      { id: 'hero', position: [2.0, 0, 0], rotation: [0, -0.3, 0], scale: 1.2 }, // Side view, bigger
      { id: 'about', position: [-2.0, -0.5, 1], rotation: [0.1, 0.3, 0], scale: 1.0 }, // Slight turn
      { id: 'skills', position: [0, 0, 0], rotation: [1.57, 0, 0], scale: 1.3 }, // Top facing camera, front pointing down
      { id: 'highlights', position: [-1.5, 0, 0], rotation: [0, 0.3, -0.1], scale: 1.0 }, // Other side
      { id: 'projects', position: [1.5, 0.5, 1], rotation: [-0.1, -0.4, 0], scale: 1.1 }, // Slight high angle
      { id: 'publications', position: [0, -0.2, 2], rotation: [0, 0, 0], scale: 1.2 }, // Front view
    ];

    // Robot Configuration (Normal positions)
    const robotSections = [
      { id: 'hero', position: [2.0, -1, 0], rotation: [0, -0.5, 0], scale: 1.3 },
      { id: 'about', position: [-2.0, -1, 1], rotation: [0, 0.5, 0], scale: 1.3 },
      { id: 'skills', position: [1.5, -1, 0], rotation: [0, -0.2, 0], scale: 1.3 }, // Normal standing
      { id: 'highlights', position: [-1.5, -1, 0], rotation: [0, 0.5, 0], scale: 1.3 },
      { id: 'projects', position: [1.5, -1, 1], rotation: [0, -0.5, 0], scale: 1.3 },
      { id: 'publications', position: [0, -1, 2], rotation: [0, 0, 0], scale: 1.3 },
    ];

    const sections = mascotType === 'drone' ? droneSections : robotSections;

    // Kill existing triggers before creating new ones
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    sections.forEach((section) => {
      ScrollTrigger.create({
        trigger: `#${section.id}`,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          onPositionChange({
            position: section.position as [number, number, number],
            rotation: section.rotation as [number, number, number],
            scale: section.scale,
            section: section.id,
          });
        },
        onEnterBack: () => {
          onPositionChange({
            position: section.position as [number, number, number],
            rotation: section.rotation as [number, number, number],
            scale: section.scale,
            section: section.id,
          });
        },
      });
    });

    // Add a final trigger for the footer to center the drone
    ScrollTrigger.create({
      trigger: 'footer',
      start: 'top bottom',
      onEnter: () => {
        onPositionChange({
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          scale: 1.0,
          section: 'footer',
        });
      },
      onLeaveBack: () => {
        // Return to publications position when leaving footer upwards
        const lastSection = sections[sections.length - 1];
        onPositionChange({
          position: lastSection.position as [number, number, number],
          rotation: lastSection.rotation as [number, number, number],
          scale: lastSection.scale,
          section: lastSection.id,
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [onPositionChange, minimalFX, mascotType]);
};

export const useParallax = (ref: React.RefObject<HTMLElement>, speed: number = 0.5, minimalFX: boolean = false) => {
  useEffect(() => {
    if (!ref.current || minimalFX) return;

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
  }, [ref, speed, minimalFX]);
};