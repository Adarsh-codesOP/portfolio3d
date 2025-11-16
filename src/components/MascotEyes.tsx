import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MascotEyesProps {
  mousePosition: { x: number; y: number };
}

export function MascotEyes({ mousePosition }: MascotEyesProps) {
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const leftPupilRef = useRef<THREE.Mesh>(null);
  const rightPupilRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    // Smooth eye tracking
    const lookAtX = mousePosition.x * 0.15;
    const lookAtY = mousePosition.y * 0.15;

    if (leftPupilRef.current && rightPupilRef.current) {
      // Left pupil movement
      leftPupilRef.current.position.x = THREE.MathUtils.lerp(
        leftPupilRef.current.position.x,
        lookAtX,
        0.1
      );
      leftPupilRef.current.position.y = THREE.MathUtils.lerp(
        leftPupilRef.current.position.y,
        lookAtY,
        0.1
      );

      // Right pupil movement
      rightPupilRef.current.position.x = THREE.MathUtils.lerp(
        rightPupilRef.current.position.x,
        lookAtX,
        0.1
      );
      rightPupilRef.current.position.y = THREE.MathUtils.lerp(
        rightPupilRef.current.position.y,
        lookAtY,
        0.1
      );
    }
  });

  return (
    <group>
      {/* Left Eye */}
      <group position={[-0.3, 0.3, 0.9]}>
        {/* Eye white */}
        <mesh ref={leftEyeRef}>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial 
            color="#ffffff" 
            metalness={0.2}
            roughness={0.3}
          />
        </mesh>
        {/* Pupil */}
        <mesh ref={leftPupilRef} position={[0, 0, 0.15]}>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshStandardMaterial 
            color="#1a1a2e"
            metalness={0.8}
            roughness={0.2}
            emissive="#a855f7"
            emissiveIntensity={0.2}
          />
        </mesh>
        {/* Highlight */}
        <mesh position={[0.05, 0.08, 0.18]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* Right Eye */}
      <group position={[0.3, 0.3, 0.9]}>
        {/* Eye white */}
        <mesh ref={rightEyeRef}>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial 
            color="#ffffff" 
            metalness={0.2}
            roughness={0.3}
          />
        </mesh>
        {/* Pupil */}
        <mesh ref={rightPupilRef} position={[0, 0, 0.15]}>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshStandardMaterial 
            color="#1a1a2e"
            metalness={0.8}
            roughness={0.2}
            emissive="#a855f7"
            emissiveIntensity={0.2}
          />
        </mesh>
        {/* Highlight */}
        <mesh position={[0.05, 0.08, 0.18]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* Smile */}
      <mesh position={[0, -0.1, 1.15]} rotation={[Math.PI, 0, 0]}>
        <torusGeometry args={[0.25, 0.04, 16, 32, Math.PI]} />
        <meshStandardMaterial 
          color="#ff6b9d"
          metalness={0.3}
          roughness={0.4}
          emissive="#ff6b9d"
          emissiveIntensity={0.1}
        />
      </mesh>
    </group>
  );
}