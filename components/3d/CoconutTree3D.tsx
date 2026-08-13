'use client';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

export default function CoconutTree3D() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  // Procedural leaves
  const leaves = Array.from({ length: 6 }).map((_, i) => {
    const angle = (i / 6) * Math.PI * 2;
    return (
      <mesh key={i} position={[Math.sin(angle) * 0.6, 1.8, Math.cos(angle) * 0.6]} rotation={[0.4, angle, 0]}>
        <planeGeometry args={[1.5, 2.5]} />
        <meshStandardMaterial color="#2d8c3c" side={THREE.DoubleSide} roughness={0.6} />
      </mesh>
    );
  });

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={groupRef} position={[0, -1, 0]} scale={[1.2, 1.2, 1.2]}>
        {/* Trunk */}
        <mesh position={[0, 0.9, 0]}>
          <cylinderGeometry args={[0.15, 0.25, 1.8, 8]} />
          <meshStandardMaterial color="#6b4c3a" roughness={0.9} />
        </mesh>
        {/* Leaves */}
        {leaves}
        {/* Coconuts */}
        <mesh position={[0.2, 1.6, 0.2]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#4a3320" roughness={0.9} />
        </mesh>
        <mesh position={[-0.2, 1.5, 0.1]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#4a3320" roughness={0.9} />
        </mesh>
      </group>
    </Float>
  );
}
