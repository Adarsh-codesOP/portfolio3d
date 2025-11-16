import { useRef, useMemo, useState, useEffect } from 'react';
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
  const [scrollProgress, setScrollProgress] = useState(0);
  const morphFactor = useRef(0); // Start as square (0 = square, 1 = blob)

  // Track scroll progress for morphing
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const heroSection = document.getElementById('hero');
      
      if (!heroSection) {
        // If hero section doesn't exist, start as blob
        setScrollProgress(1);
        return;
      }
      
      const heroTop = heroSection.offsetTop;
      const windowHeight = window.innerHeight;
      
      // Calculate progress: 
      // 0 = at very top (square blob)
      // 1 = when hero section is reached (organic blob)
      // Smooth transition over the first viewport height
      const transitionDistance = windowHeight * 0.8; // Transition over 80% of viewport
      const progress = Math.max(0, Math.min(1, scrollY / transitionDistance));
      
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Color schemes for different sections - Theme colors with variations
  const sectionColors = useMemo(() => {
    const colors: Record<string, { main: string; accent: string; glow: string }> = {
      hero: { main: '#4CC9F0', accent: '#4361EE', glow: '#4CC9F0' },
      about: { main: '#5AB5F5', accent: '#4361EE', glow: '#5AB5F5' },
      skills: { main: '#4361EE', accent: '#4CC9F0', glow: '#4361EE' },
      highlights: { main: '#4CC9F0', accent: '#5AB5F5', glow: '#4CC9F0' },
      projects: { main: '#4361EE', accent: '#4CC9F0', glow: '#4361EE' },
      publications: { main: '#5AB5F5', accent: '#4361EE', glow: '#5AB5F5' },
    };
    return colors[currentSection] || colors.hero;
  }, [currentSection]);

  // Create geometries with same vertex count for morphing
  const squareGeometry = useMemo(() => {
    // Use sphere as base to match vertex count, then shape it into rounded square
    const geo = new THREE.SphereGeometry(1, 64, 64);
    const positions = geo.attributes.position;
    
    // Transform sphere into rounded square blob
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);
      
      // Normalize to get direction vector
      const length = Math.sqrt(x * x + y * y + z * z);
      if (length === 0) continue;
      
      const nx = x / length;
      const ny = y / length;
      const nz = z / length;
      
      // Create square shape using infinity norm (max of absolute values)
      // This creates a cube-like shape
      const cornerRadius = 0.15; // Smaller = more square
      const maxAbs = Math.max(Math.abs(nx), Math.abs(ny), Math.abs(nz));
      
      // Create square shape - use infinity norm to create cube
      let newX, newY, newZ;
      
      if (maxAbs > 0.01) {
        // Scale to create square shape
        const scale = 1 / maxAbs;
        newX = nx * scale;
        newY = ny * scale;
        newZ = nz * scale;
        
        // Round the corners slightly
        const dist = Math.sqrt(newX * newX + newY * newY + newZ * newZ);
        if (dist > 1 - cornerRadius) {
          const factor = (1 - cornerRadius) / dist;
          newX *= factor;
          newY *= factor;
          newZ *= factor;
        }
      } else {
        newX = nx;
        newY = ny;
        newZ = nz;
      }
      
      // Normalize back to unit sphere
      const newLength = Math.sqrt(newX * newX + newY * newY + newZ * newZ);
      if (newLength > 0) {
        positions.setXYZ(i, newX / newLength, newY / newLength, newZ / newLength);
      }
    }
    
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Create organic blob geometry (same vertex count)
  const blobGeometry = useMemo(() => {
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

  // Create morphing geometry that interpolates between square and blob
  const geometry = useMemo(() => {
    // Use square as base, we'll morph it in useFrame
    return squareGeometry.clone();
  }, [squareGeometry]);

  useFrame((state) => {
    if (!groupRef.current || !bodyRef.current || !geometry) return;

    // Smooth morph factor based on scroll progress
    // 0 = square (at top), 1 = blob (when hero is visible)
    // Start as square (morphFactor = 0), morph to blob as we scroll
    morphFactor.current = THREE.MathUtils.lerp(morphFactor.current, Math.min(scrollProgress, 1), 0.05);

    // Morph geometry between square and blob
    const squarePositions = squareGeometry.attributes.position;
    const blobPositions = blobGeometry.attributes.position;
    const currentPositions = geometry.attributes.position;
    
    if (squarePositions.count === blobPositions.count && currentPositions.count === squarePositions.count) {
      for (let i = 0; i < currentPositions.count; i++) {
        const squareX = squarePositions.getX(i);
        const squareY = squarePositions.getY(i);
        const squareZ = squarePositions.getZ(i);
        
        const blobX = blobPositions.getX(i);
        const blobY = blobPositions.getY(i);
        const blobZ = blobPositions.getZ(i);
        
        // Interpolate between square and blob
        const x = THREE.MathUtils.lerp(squareX, blobX, morphFactor.current);
        const y = THREE.MathUtils.lerp(squareY, blobY, morphFactor.current);
        const z = THREE.MathUtils.lerp(squareZ, blobZ, morphFactor.current);
        
        currentPositions.setXYZ(i, x, y, z);
      }
      currentPositions.needsUpdate = true;
      geometry.computeVertexNormals();
    }

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