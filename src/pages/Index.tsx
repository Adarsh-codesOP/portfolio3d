import { useState, useEffect, useCallback, Suspense } from 'react';
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
import { RobotMascot } from '@/components/RobotMascot';
import { useMascotScrollTrigger, MascotPosition } from '@/hooks/useScrollTrigger';
import { GridScan } from '@/components/GridScan';
import Dock from '@/components/Dock';
import { Home, User, Briefcase, FileText, Mail, Github, Linkedin } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ContactForm } from '@/components/ContactForm';

const Index = () => {
  const isMobile = useIsMobile();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mascotPosition, setMascotPosition] = useState<MascotPosition & { section?: string }>({
    position: [2.5, 0, 0],
    rotation: [0, -0.2, 0],
    scale: 1.3,
    section: 'hero',
  });
  const [mascotType, setMascotType] = useState<'drone' | 'robot'>('drone');
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);

  // Track mouse for eye movement (only on desktop)
  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);

  // GSAP ScrollTrigger for mascot positions (only on desktop)
  const handlePositionChange = useCallback((position: MascotPosition & { section?: string }) => {
    if (!isMobile) {
      setMascotPosition(position);
    }
  }, [isMobile]);

  useMascotScrollTrigger(handlePositionChange);

  const dockItems = [
    {
      icon: <Home size={18} />,
      label: 'Home',
      onClick: () => document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
      icon: <User size={18} />,
      label: 'About',
      onClick: () => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
      icon: <Briefcase size={18} />,
      label: 'Projects',
      onClick: () => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
      icon: <FileText size={18} />,
      label: 'Publications',
      onClick: () => document.getElementById('publications')?.scrollIntoView({ behavior: 'smooth' })
    },
    {
      icon: <Mail size={18} />,
      label: 'Contact',
      onClick: () => setIsContactFormOpen(true)
    },
    {
      icon: <Github size={18} />,
      label: 'GitHub',
      onClick: () => window.open('https://github.com/Adarsh-codesOP', '_blank')
    },
    {
      icon: <Linkedin size={18} />,
      label: 'LinkedIn',
      onClick: () => window.open('https://linkedin.com/in/adarsh-as-oo7', '_blank')
    },
  ];

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-background text-foreground relative">
        {/* GridScan Background - Changes color based on mascot type */}
        <div className="fixed inset-0 z-0">
          {isMobile ? (
            <GridScan
              sensitivity={0.3}
              lineThickness={0.8}
              linesColor={mascotType === 'drone' ? "#6a0dad" : "#008080"}
              gridScale={0.15}
              scanColor={mascotType === 'drone' ? "#ff00ff" : "#00ffcc"}
              scanOpacity={0.3}
              enablePost={false}
              bloomIntensity={0}
              chromaticAberration={0}
              noiseIntensity={0.005}
              className=""
              style={{}}
            />
          ) : (
            <GridScan
              sensitivity={0.55}
              lineThickness={1}
              linesColor={mascotType === 'drone' ? "#6a0dad" : "#008080"}
              gridScale={0.1}
              scanColor={mascotType === 'drone' ? "#ff00ff" : "#00ffcc"}
              scanOpacity={0.4}
              enablePost
              bloomIntensity={0.8}
              chromaticAberration={0.002}
              noiseIntensity={0.01}
              className=""
              style={{}}
            />
          )}
        </div>

        {/* Fixed 3D Canvas with Mascot - Desktop only */}
        {!isMobile && (
          <div className="fixed inset-0 z-30 pointer-events-none">
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
              <Suspense fallback={null}>
                {mascotType === 'drone' ? (
                  <Mascot3D
                    targetPosition={mascotPosition}
                    mousePosition={mousePosition}
                    currentSection={mascotPosition.section}
                  />
                ) : (
                  <RobotMascot
                    targetPosition={mascotPosition}
                    mousePosition={mousePosition}
                    currentSection={mascotPosition.section}
                  />
                )}
              </Suspense>
            </Canvas>
          </div>
        )}

        {/* Content */}
        <div className="relative z-40">
          <Hero />
          <About />
          <Skills />
          <Highlights />
          <Projects />
          <Publications openContact={() => setIsContactFormOpen(true)} />
          <Footer />
        </div>

        {/* Dock Navigation */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 pointer-events-none">
          <div className="pointer-events-auto">
            <Dock
              items={dockItems}
              mascotType={mascotType}
              onToggleMascot={() => setMascotType(prev => prev === 'drone' ? 'robot' : 'drone')}
            />
          </div>
        </div>

        {/* Contact Form Modal */}
        <ContactForm isOpen={isContactFormOpen} onClose={() => setIsContactFormOpen(false)} />
      </div>
    </SmoothScroll>
  );
};

export default Index;