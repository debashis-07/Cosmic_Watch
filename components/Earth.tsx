
import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

// Fix: Use uppercase aliases for Three.js intrinsic elements to resolve TypeScript JSX errors
const Group = 'group' as any;
const Mesh = 'mesh' as any;
const SphereGeometry = 'sphereGeometry' as any;
const MeshPhongMaterial = 'meshPhongMaterial' as any;

const Earth: React.FC = () => {
  const earthRef = useRef<THREE.Group>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  // High-res public textures (standard NASA Blue Marble derived)
  const [colorMap, bumpMap, specMap, cloudMap] = useLoader(THREE.TextureLoader, [
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png',
  ]);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    if (earthRef.current) earthRef.current.rotation.y = elapsedTime / 25;
    if (cloudRef.current) cloudRef.current.rotation.y = elapsedTime / 20;
    if (atmosphereRef.current) atmosphereRef.current.rotation.y = elapsedTime / 25;
  });

  return (
    <Group ref={earthRef}>
      {/* Earth Surface - High Quality Blue Planet */}
      <Mesh castShadow receiveShadow>
        <SphereGeometry args={[2, 64, 64]} />
        <MeshPhongMaterial
          map={colorMap}
          bumpMap={bumpMap}
          bumpScale={0.05}
          specularMap={specMap}
          specular={new THREE.Color('#333333')}
          shininess={15}
          emissive={new THREE.Color('#000b1a')}
          emissiveIntensity={0.1}
        />
      </Mesh>

      {/* Cloud Layer */}
      <Mesh ref={cloudRef}>
        <SphereGeometry args={[2.015, 64, 64]} />
        <MeshPhongMaterial
          map={cloudMap}
          transparent
          opacity={0.5}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Mesh>

      {/* Atmospheric Glow - Deep Blue Halo for "Earth-like" feel */}
      <Mesh ref={atmosphereRef}>
        <SphereGeometry args={[2.08, 64, 64]} />
        <MeshPhongMaterial
          color="#1e40af"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </Mesh>
      
      {/* Secondary Atmosphere Glow - Cyan Highlights */}
      <Mesh>
        <SphereGeometry args={[2.1, 64, 64]} />
        <MeshPhongMaterial
          color="#06b6d4"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </Mesh>
    </Group>
  );
};

export default Earth;
