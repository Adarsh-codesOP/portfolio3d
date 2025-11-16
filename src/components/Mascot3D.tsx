import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MascotEyes } from './MascotEyes';
import { MascotPosition } from '@/hooks/useScrollTrigger';

interface Mascot3DProps {
  targetPosition: MascotPosition;
  mousePosition: { x: number; y: number };
}

export function Mascot3D({ targetPosition, mousePosition }: Mascot3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const floatOffset = useRef(0);
  const glowRef = useRef<THREE.PointLight>(null);

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

    // Animate glow intensity
    if (glowRef.current) {
      glowRef.current.intensity = 3 + Math.sin(state.clock.elapsedTime * 2) * 0.5;
    }

    // Subtle body rotation for liveliness
    if (bodyRef.current) {
      bodyRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main Body */}
      <mesh ref={bodyRef} geometry={geometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#a855f7"
          metalness={0.6}
          roughness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.1}
          transmission={0.3}
          thickness={0.8}
          ior={1.5}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Eyes and Face */}
      <MascotEyes mousePosition={mousePosition} />

      {/* Accent glow sphere inside */}
      <mesh scale={0.6}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial 
          color="#ec4899" 
          transparent 
          opacity={0.1}
        />
      </mesh>

      {/* Lighting */}
      <pointLight 
        ref={glowRef}
        position={[0, 0, 0]} 
        intensity={3} 
        color="#a855f7" 
        distance={5}
      />
      <pointLight position={[2, 2, 2]} intensity={2} color="#3b82f6" />
      <pointLight position={[-2, -1, -1]} intensity={1.5} color="#ec4899" />
      
      {/* Rim light */}
      <pointLight position={[0, 0, -2]} intensity={2} color="#8b5cf6" />
      
      {/* Ambient glow */}
      <pointLight position={[0, 3, 0]} intensity={1} color="#a855f7" distance={8} />
    </group>
  );
}