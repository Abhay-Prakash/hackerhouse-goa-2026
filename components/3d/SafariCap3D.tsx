'use client';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

export default function SafariCap3D() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.8;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef} scale={[1.2, 1.2, 1.2]} rotation={[0.2, 0, 0]}>
        {/* Cap Dome */}
        <mesh position={[0, 0.4, 0]}>
          <sphereGeometry args={[0.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#c2a77a" roughness={0.8} />
        </mesh>
        {/* Cap Brim */}
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.8, 0.8, 0.05, 32]} />
          <meshStandardMaterial color="#c2a77a" roughness={0.9} />
        </mesh>
        {/* Hat band */}
        <mesh position={[0, 0.42, 0]}>
          <cylinderGeometry args={[0.51, 0.51, 0.1, 32]} />
          <meshStandardMaterial color="#4a3b2c" roughness={0.7} />
        </mesh>
      </group>
    </Float>
  );
}
