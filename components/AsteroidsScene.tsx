
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AsteroidRecord } from '../types';

// Fix: Use uppercase aliases for Three.js intrinsic elements to resolve "Property '...' does not exist on type 'JSX.IntrinsicElements'" errors
const Group = 'group' as any;
const Mesh = 'mesh' as any;
const IcosahedronGeometry = 'icosahedronGeometry' as any;
const MeshStandardMaterial = 'meshStandardMaterial' as any;
const RingGeometry = 'ringGeometry' as any;
const MeshBasicMaterial = 'meshBasicMaterial' as any;

interface AsteroidsSceneProps {
  asteroids: AsteroidRecord[];
  onSelect: (ast: AsteroidRecord) => void;
  selectedId: string | null;
}

const AsteroidsScene: React.FC<AsteroidsSceneProps> = ({ asteroids, onSelect, selectedId }) => {
  const asteroidRefs = useRef<THREE.Group[]>([]);

  const asteroidData = useMemo(() => {
    return asteroids.map((ast) => {
      // Scale distances for visualization (NASA distances are huge, we compress them)
      // Real miss distance: thousands or millions of km.
      // We'll place them between 4 and 15 units away.
      const distance = 4 + (ast.miss_distance_km % 10); 
      const speed = 0.1 + (ast.velocity_kph / 100000);
      const orbitOffset = Math.random() * Math.PI * 2;
      const size = Math.max(0.02, Math.min(0.15, ast.kilometers_diameter * 0.5));
      
      return {
        ...ast,
        orbitDistance: distance,
        orbitSpeed: speed,
        orbitOffset,
        visualSize: size
      };
    });
  }, [asteroids]);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    asteroidRefs.current.forEach((ref, i) => {
      if (ref) {
        const data = asteroidData[i];
        const angle = data.orbitOffset + (elapsedTime * data.orbitSpeed * 0.5);
        ref.position.x = Math.cos(angle) * data.orbitDistance;
        ref.position.z = Math.sin(angle) * data.orbitDistance;
        ref.rotation.x += 0.01;
        ref.rotation.y += 0.01;
      }
    });
  });

  return (
    <>
      {asteroidData.map((data, i) => (
        <Group 
          key={data.nasa_id} 
          ref={(el) => (asteroidRefs.current[i] = el!)}
          onClick={(e: any) => {
            e.stopPropagation();
            onSelect(data);
          }}
        >
          {/* Asteroid Mesh */}
          <Mesh>
            <IcosahedronGeometry args={[data.visualSize, 1]} />
            <MeshStandardMaterial 
              color={data.nasa_id === selectedId ? "#22d3ee" : (data.is_hazardous ? "#ef4444" : "#94a3b8")}
              emissive={data.nasa_id === selectedId ? "#22d3ee" : (data.is_hazardous ? "#7f1d1d" : "#000000")}
              emissiveIntensity={0.5}
            />
          </Mesh>
          
          {/* Orbit Line */}
          <Mesh rotation={[Math.PI / 2, 0, 0]}>
            <RingGeometry args={[data.orbitDistance - 0.01, data.orbitDistance + 0.01, 64]} />
            <MeshBasicMaterial color="#334155" transparent opacity={0.15} side={THREE.DoubleSide} />
          </Mesh>
        </Group>
      ))}
    </>
  );
};

export default AsteroidsScene;
