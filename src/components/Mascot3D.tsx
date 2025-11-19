import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MascotPosition } from '@/hooks/useScrollTrigger';

interface Mascot3DProps {
  targetPosition: MascotPosition;
  mousePosition: { x: number; y: number };
  currentSection?: string;
}

export function Mascot3D({ targetPosition, mousePosition, currentSection = 'hero' }: Mascot3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const gimbalRef = useRef<THREE.Group>(null);
  const rotorsRef = useRef<THREE.Group[]>([]);
  const floatOffset = useRef(0);

  // Color schemes for different sections
  const sectionColors = useMemo(() => {
    const colors: Record<string, { main: string; accent: string; glow: string; led: string }> = {
      hero: { main: '#1a1a2e', accent: '#a855f7', glow: '#a855f7', led: '#ec4899' },
      about: { main: '#0f172a', accent: '#3b82f6', glow: '#3b82f6', led: '#60a5fa' },
      skills: { main: '#064e3b', accent: '#10b981', glow: '#10b981', led: '#34d399' },
      highlights: { main: '#451a03', accent: '#f59e0b', glow: '#f59e0b', led: '#fbbf24' },
      projects: { main: '#450a0a', accent: '#ef4444', glow: '#ef4444', led: '#f87171' },
      publications: { main: '#2e1065', accent: '#8b5cf6', glow: '#8b5cf6', led: '#a78bfa' },
    };
    return colors[currentSection] || colors.hero;
  }, [currentSection]);

  useFrame((state) => {
    if (!groupRef.current || !bodyRef.current) return;

    // 1. Floating animation (Mechanical hover)
    floatOffset.current += 0.02;
    const floatY = Math.sin(floatOffset.current) * 0.1;

    // 2. Smooth position interpolation
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetPosition.position[0], 0.05);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetPosition.position[1] + floatY, 0.05);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetPosition.position[2], 0.05);

    // 3. Drone Body Tilt based on movement/mouse
    const tiltX = -mousePosition.y * 0.2; // Tilt forward/back
    const tiltZ = mousePosition.x * 0.2;  // Tilt left/right

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetPosition.rotation[0] + tiltX, 0.05);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetPosition.rotation[1], 0.05);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetPosition.rotation[2] + tiltZ, 0.05);

    // 4. Rotor Animation
    rotorsRef.current.forEach((rotor, i) => {
      if (rotor) {
        // Spin direction alternates for realism
        const dir = i % 2 === 0 ? 1 : -1;
        rotor.rotation.y += 0.3 * dir;
      }
    });

    // 5. Gimbal Tracking (Camera follows mouse)
    if (gimbalRef.current) {
      // Calculate look angles
      const lookX = -mousePosition.y * 0.8; // Pitch
      const lookY = -mousePosition.x * 0.8; // Yaw

      // Faster tracking (0.2 lerp)
      gimbalRef.current.rotation.x = THREE.MathUtils.lerp(gimbalRef.current.rotation.x, lookX, 0.2);
      gimbalRef.current.rotation.y = THREE.MathUtils.lerp(gimbalRef.current.rotation.y, lookY, 0.2);
    }

    // 6. Scale Animation (Breathing/Deploying)
    const targetScale = targetPosition.scale;
    groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.05));
  });

  // Reusable geometry/materials
  const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: sectionColors.main,
    metalness: 0.8,
    roughness: 0.2,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
  });

  const accentMaterial = new THREE.MeshStandardMaterial({
    color: sectionColors.accent,
    metalness: 0.9,
    roughness: 0.1,
    emissive: sectionColors.accent,
    emissiveIntensity: 0.5,
  });

  const ledMaterial = new THREE.MeshBasicMaterial({
    color: sectionColors.led,
  });

  return (
    <group ref={groupRef}>
      <group ref={bodyRef}>
        {/* --- Central Body --- */}
        <mesh castShadow receiveShadow material={bodyMaterial}>
          <boxGeometry args={[0.8, 0.3, 1.2]} />
        </mesh>

        {/* Top Plate Detail */}
        <mesh position={[0, 0.16, 0]} material={accentMaterial}>
          <boxGeometry args={[0.6, 0.05, 1]} />
        </mesh>

        {/* --- Arms (X Configuration) --- */}
        {[
          [-1, 1], [1, 1], [1, -1], [-1, -1]
        ].map(([xDir, zDir], i) => (
          <group key={i} position={[0, 0, 0]} rotation={[0, Math.atan2(xDir, zDir), 0]}>
            {/* Arm Strut */}
            <mesh position={[0, 0, 0.8]} rotation={[Math.PI / 2, 0, 0]} material={bodyMaterial}>
              <cylinderGeometry args={[0.08, 0.05, 1.2, 8]} />
            </mesh>

            {/* Motor Housing */}
            <mesh position={[0, 0.1, 1.4]} material={accentMaterial}>
              <cylinderGeometry args={[0.15, 0.15, 0.2, 16]} />
            </mesh>

            {/* Rotor Blade Group */}
            <group
              position={[0, 0.25, 1.4]}
              ref={(el) => { if (el) rotorsRef.current[i] = el; }}
            >
              <mesh material={new THREE.MeshStandardMaterial({ color: '#333', metalness: 0.5, roughness: 0.5 })}>
                <boxGeometry args={[1.8, 0.02, 0.15]} />
              </mesh>
              <mesh rotation={[0, Math.PI / 2, 0]} material={new THREE.MeshStandardMaterial({ color: '#333', metalness: 0.5, roughness: 0.5 })}>
                <boxGeometry args={[1.8, 0.02, 0.15]} />
              </mesh>
            </group>

            {/* LED Indicator under arm */}
            <mesh position={[0, -0.1, 1.3]} material={ledMaterial}>
              <sphereGeometry args={[0.05, 16, 16]} />
            </mesh>
          </group>
        ))}

        {/* --- Gimbal Camera System (Underbelly) --- */}
        <group position={[0, -0.2, 0.4]}>
          {/* Gimbal Base */}
          <mesh material={bodyMaterial}>
            <cylinderGeometry args={[0.2, 0.25, 0.1, 16]} />
          </mesh>

          {/* Moving Gimbal Head */}
          <group ref={gimbalRef} position={[0, -0.1, 0]}>
            {/* Camera Housing - Larger */}
            <mesh material={accentMaterial} castShadow>
              <sphereGeometry args={[0.3, 32, 32]} />
            </mesh>

            {/* Lens Ring */}
            <mesh position={[0, 0, 0.25]} rotation={[Math.PI / 2, 0, 0]} material={bodyMaterial}>
              <torusGeometry args={[0.15, 0.03, 16, 32]} />
            </mesh>

            {/* Lens Glass - More visible */}
            <mesh position={[0, 0, 0.26]}>
              <circleGeometry args={[0.12, 32]} />
              <meshPhysicalMaterial
                color="#000"
                roughness={0}
                metalness={0.5}
                transmission={0.2}
                emissive="#fff"
                emissiveIntensity={0.1}
              />
            </mesh>

            {/* Camera Active LED */}
            <mesh position={[0.18, 0.18, 0.18]} material={ledMaterial}>
              <sphereGeometry args={[0.04, 16, 16]} />
            </mesh>

            {/* Camera Spotlight */}
            <spotLight
              position={[0, 0, 0.3]}
              target-position={[0, 0, 5]}
              angle={0.5}
              penumbra={0.5}
              intensity={5}
              color={sectionColors.accent}
              distance={10}
            />
          </group>
        </group>

        {/* --- Rear Antenna/Sensor --- */}
        <group position={[0, 0.15, -0.5]} rotation={[-0.2, 0, 0]}>
          <mesh material={bodyMaterial}>
            <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
          </mesh>
          <mesh position={[0, 0.2, 0]} material={ledMaterial}>
            <sphereGeometry args={[0.04, 8, 8]} />
          </mesh>
        </group>

      </group>

      {/* --- Lighting Effects --- */}
      <pointLight position={[0, -0.5, 0.5]} intensity={2} color={sectionColors.glow} distance={3} />
      <pointLight position={[0, 0.5, -0.5]} intensity={1} color={sectionColors.accent} distance={3} />
    </group>
  );
}