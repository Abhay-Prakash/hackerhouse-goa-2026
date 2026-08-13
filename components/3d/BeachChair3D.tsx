'use client';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

export default function BeachChair3D() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.6;
    }
  });

  const woodMaterial = <meshStandardMaterial color="#d4b48c" roughness={0.8} />;
  const fabricMaterial = <meshStandardMaterial color="#ff007a" roughness={0.6} side={THREE.DoubleSide} />;

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
      <group ref={groupRef} position={[0, -0.5, 0]} rotation={[0.2, -Math.PI / 4, 0]} scale={[1.4, 1.4, 1.4]}>
        {/* Wood frame back */}
        <mesh position={[-0.4, 0.5, -0.3]} rotation={[0, 0, -0.4]}>
          <boxGeometry args={[0.1, 1.5, 0.1]} />
          {woodMaterial}
        </mesh>
        <mesh position={[0.4, 0.5, -0.3]} rotation={[0, 0, -0.4]}>
          <boxGeometry args={[0.1, 1.5, 0.1]} />
          {woodMaterial}
        </mesh>
        
        {/* Wood frame legs */}
        <mesh position={[-0.4, 0.3, 0.3]} rotation={[0, 0, 0.6]}>
          <boxGeometry args={[0.1, 1.2, 0.1]} />
          {woodMaterial}
        </mesh>
        <mesh position={[0.4, 0.3, 0.3]} rotation={[0, 0, 0.6]}>
          <boxGeometry args={[0.1, 1.2, 0.1]} />
          {woodMaterial}
        </mesh>
        
        {/* Fabric Seat */}
        <mesh position={[0, 0.6, -0.1]} rotation={[0, 0, -0.5]}>
          <planeGeometry args={[0.7, 1.4]} />
          {fabricMaterial}
        </mesh>
      </group>
    </Float>
  );
}
