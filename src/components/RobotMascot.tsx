import { useEffect, useRef, useState, useMemo } from 'react';
import { useFrame, useGraph } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';
import { MascotPosition } from '@/hooks/useScrollTrigger';

interface RobotMascotProps {
    targetPosition: MascotPosition;
    mousePosition: { x: number; y: number };
    currentSection?: string;
}

export function RobotMascot({ targetPosition, mousePosition, currentSection = 'hero' }: RobotMascotProps) {
    const group = useRef<THREE.Group>(null);
    const { scene, animations } = useGLTF('/RobotExpressive.glb');
    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
    const { nodes, materials } = useGraph(clone);
    const { actions } = useAnimations(animations, group);

    const [animationState, setAnimationState] = useState('Idle');

    // Color schemes for different sections (Same as Drone)
    const sectionColors = useMemo(() => {
        const colors: Record<string, { main: string; accent: string; glow: string; led: string }> = {
            hero: { main: '#064e3b', accent: '#10b981', glow: '#10b981', led: '#34d399' }, // Green for Hero
            about: { main: '#0f172a', accent: '#3b82f6', glow: '#3b82f6', led: '#60a5fa' },
            skills: { main: '#064e3b', accent: '#10b981', glow: '#10b981', led: '#34d399' },
            highlights: { main: '#451a03', accent: '#f59e0b', glow: '#f59e0b', led: '#fbbf24' },
            projects: { main: '#450a0a', accent: '#ef4444', glow: '#ef4444', led: '#f87171' },
            publications: { main: '#2e1065', accent: '#8b5cf6', glow: '#8b5cf6', led: '#a78bfa' },
        };
        return colors[currentSection] || colors.hero;
    }, [currentSection]);

    // Apply colors to materials
    useEffect(() => {
        clone.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                const mat = mesh.material as THREE.MeshStandardMaterial;

                // Identify parts based on names or material names if possible, 
                // otherwise apply a general theme.
                // The RobotExpressive model has specific material names like 'Main', 'Grey', 'Black', etc.

                if (mat.name === 'Main') {
                    mat.color.set(sectionColors.main);
                    mat.emissive.set(sectionColors.glow);
                    mat.emissiveIntensity = 0.2;
                } else if (mat.name === 'Grey') {
                    mat.color.set(sectionColors.accent);
                }
            }
        });
    }, [clone, sectionColors]);

    // Handle animations based on section or interaction
    useEffect(() => {
        const action = actions[animationState];
        if (action) {
            action.reset().fadeIn(0.5).play();
            return () => {
                action.fadeOut(0.5);
            };
        }
    }, [animationState, actions]);

    // Change animation based on section
    useEffect(() => {
        // Available animations: 'Dance', 'Death', 'Idle', 'Jump', 'No', 'Punch', 'Running', 'Sitting', 'Standing', 'ThumbsUp', 'Walking', 'Wave', 'Yes'

        switch (currentSection) {
            case 'hero':
                setAnimationState('Idle');
                break;
            case 'about':
                setAnimationState('Wave');
                break;
            case 'skills':
                setAnimationState('Jump');
                break;
            case 'highlights':
                setAnimationState('Dance');
                break;
            case 'projects':
                setAnimationState('Walking');
                break;
            case 'publications':
                setAnimationState('ThumbsUp');
                break;
            default:
                setAnimationState('Idle');
        }
    }, [currentSection]);

    useFrame((state) => {
        if (!group.current) return;

        // Smooth position interpolation
        // Adjusted Y offset (-1) to lower the robot so it's not floating too high
        group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, targetPosition.position[0], 0.05);
        group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, targetPosition.position[1] - 1, 0.05);
        group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, targetPosition.position[2], 0.05);

        // Smooth rotation interpolation
        group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetPosition.rotation[0], 0.05);
        group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetPosition.rotation[1], 0.05);
        group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, targetPosition.rotation[2], 0.05);

        // Scale interpolation
        // Reduced scale multiplier to 0.5 for smaller size
        const targetScale = targetPosition.scale * 0.42;
        group.current.scale.setScalar(THREE.MathUtils.lerp(group.current.scale.x, targetScale, 0.05));
    });

    return (
        <group ref={group} dispose={null}>
            <primitive object={clone} />

            {/* Add some lights specifically for the robot to look good */}
            <pointLight position={[0, 2, 2]} intensity={2} color={sectionColors.glow} distance={5} />
            <spotLight position={[0, 5, 0]} intensity={1} color={sectionColors.accent} angle={0.5} penumbra={1} />
        </group>
    );
}

useGLTF.preload('/RobotExpressive.glb');
