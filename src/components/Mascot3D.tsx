import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MascotEyes } from './MascotEyes';
import { MascotPosition } from '@/hooks/useScrollTrigger';

interface Mascot3DProps {
  targetPosition: MascotPosition;
  mousePosition: { x: number; y: number };
  currentSection?: string;
}

export function Mascot3D({ targetPosition, mousePosition, currentSection = 'hero' }: Mascot3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const floatOffset = useRef(0);
  const glowRef = useRef<THREE.PointLight>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);

  // Color schemes for different sections
  const sectionColors = useMemo(() => {
    const colors: Record<string, { main: string; accent: string; glow: string }> = {
      hero: { main: '#a855f7', accent: '#ec4899', glow: '#a855f7' },
      about: { main: '#3b82f6', accent: '#60a5fa', glow: '#3b82f6' },
      skills: { main: '#10b981', accent: '#34d399', glow: '#10b981' },
      highlights: { main: '#f59e0b', accent: '#fbbf24', glow: '#f59e0b' },
      projects: { main: '#ef4444', accent: '#f87171', glow: '#ef4444' },
      publications: { main: '#8b5cf6', accent: '#a78bfa', glow: '#8b5cf6' },
    };
    return colors[currentSection] || colors.hero;
  }, [currentSection]);

  // Create smooth blob geometry
  const geometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(1, 64, 64);
    const positions = geo.attributes.position;
    
    // Deform sphere to create organic blob shape
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);
      
      const noise = Math.sin(x * 3) * Math.cos(y * 3) * Math.sin(z * 3) * 0.15;
      
      positions.setXYZ(
        i,
        x * (1 + noise),
        y * (1 + noise * 0.8),
        z * (1 + noise)
      );
    }
    
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((state) => {
    if (!groupRef.current || !bodyRef.current) return;

    // Floating animation
    floatOffset.current += 0.008;
    const floatY = Math.sin(floatOffset.current) * 0.15;
    const tiltX = Math.cos(floatOffset.current * 0.7) * 0.05;
    const tiltZ = Math.sin(floatOffset.current * 0.5) * 0.03;
    
    // Smooth position interpolation
    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      targetPosition.position[0],
      0.03
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetPosition.position[1] + floatY,
      0.03
    );
    groupRef.current.position.z = THREE.MathUtils.lerp(
      groupRef.current.position.z,
      targetPosition.position[2],
      0.03
    );

    // Smooth rotation interpolation with base rotation + tilt
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetPosition.rotation[0] + tiltX,
      0.05
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetPosition.rotation[1] + mousePosition.y * 0.2,
      0.05
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      targetPosition.rotation[2] + tiltZ,
      0.05
    );

    // Breathing scale animation
    const breatheScale = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.03;
    const targetScale = targetPosition.scale * breatheScale;
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.05)
    );

    // Animate glow intensity with section-specific variation
    if (glowRef.current) {
      const baseIntensity = currentSection === 'projects' ? 4 : currentSection === 'highlights' ? 3.5 : 3;
      glowRef.current.intensity = baseIntensity + Math.sin(state.clock.elapsedTime * 2) * 0.5;
      glowRef.current.color.set(sectionColors.glow);
    }

    // Update material colors smoothly
    if (materialRef.current) {
      const targetColor = new THREE.Color(sectionColors.main);
      const currentColor = materialRef.current.color;
      materialRef.current.color.lerp(targetColor, 0.05);
    }

    // Section-specific animations
    if (bodyRef.current) {
      let rotationSpeed = 0.002;
      if (currentSection === 'skills') rotationSpeed = 0.004; // Faster for skills
      if (currentSection === 'projects') rotationSpeed = 0.001; // Slower for projects
      bodyRef.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main Body */}
      <mesh ref={bodyRef} geometry={geometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          ref={materialRef}
          color={sectionColors.main}
          metalness={currentSection === 'projects' ? 0.8 : 0.6}
          roughness={currentSection === 'highlights' ? 0.1 : 0.2}
          clearcoat={1}
          clearcoatRoughness={0.1}
          transmission={currentSection === 'about' ? 0.4 : 0.3}
          thickness={0.8}
          ior={1.5}
          envMapIntensity={currentSection === 'skills' ? 2 : 1.5}
        />
      </mesh>

      {/* Eyes and Face */}
      <MascotEyes mousePosition={mousePosition} />

      {/* Accent glow sphere inside */}
      <mesh scale={0.6}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial 
          color={sectionColors.accent} 
          transparent 
          opacity={currentSection === 'highlights' ? 0.15 : 0.1}
        />
      </mesh>

      {/* Lighting */}
      <pointLight 
        ref={glowRef}
        position={[0, 0, 0]} 
        intensity={3} 
        color={sectionColors.glow} 
        distance={5}
      />
      <pointLight position={[2, 2, 2]} intensity={2} color={sectionColors.accent} />
      <pointLight position={[-2, -1, -1]} intensity={1.5} color={sectionColors.main} />
      
      {/* Rim light */}
      <pointLight position={[0, 0, -2]} intensity={2} color={sectionColors.glow} />
      
      {/* Ambient glow */}
      <pointLight position={[0, 3, 0]} intensity={1} color={sectionColors.glow} distance={8} />
    </group>
  );
}