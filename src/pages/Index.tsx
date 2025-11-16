import { useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Environment } from '@react-three/drei';
import { SmoothScroll } from '@/components/SmoothScroll';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Skills } from '@/components/Skills';
import { Highlights } from '@/components/Highlights';
import { Projects } from '@/components/Projects';
import { Publications } from '@/components/Publications';
import { Footer } from '@/components/Footer';
import { Mascot3D } from '@/components/Mascot3D';
import { useMascotScrollTrigger, MascotPosition } from '@/hooks/useScrollTrigger';

const Index = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mascotPosition, setMascotPosition] = useState<MascotPosition>({
    position: [2, 0, 0],
    rotation: [0, 0, 0],
    scale: 1.2,
  });

  // Track mouse for eye movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // GSAP ScrollTrigger for mascot positions
  const handlePositionChange = useCallback((position: MascotPosition) => {
    setMascotPosition(position);
  }, []);

  useMascotScrollTrigger(handlePositionChange);

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-background text-foreground">
        {/* Fixed 3D Canvas with Mascot */}
        <div className="fixed inset-0 z-10 pointer-events-none">
          <Canvas shadows>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
            
            {/* Lighting */}
            <ambientLight intensity={0.4} />
            <directionalLight 
              position={[5, 5, 5]} 
              intensity={1} 
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            <spotLight
              position={[0, 10, 0]}
              angle={0.3}
              penumbra={1}
              intensity={0.5}
              castShadow
            />
            
            {/* Environment for reflections */}
            <Environment preset="city" />
            
            {/* Mascot */}
            <Mascot3D 
              targetPosition={mascotPosition}
              mousePosition={mousePosition}
            />
          </Canvas>
        </div>

        {/* Content */}
        <div className="relative z-20">
          <Hero />
          <About />
          <Skills />
          <Highlights />
          <Projects />
          <Publications />
          <Footer />
        </div>
      </div>
    </SmoothScroll>
  );
};

export default Index;