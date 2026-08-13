'use client';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

export default function TreasureChest3D({ isOpen }: { isOpen: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const lidRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }
    if (lidRef.current) {
      const targetRotation = isOpen ? -Math.PI / 2.5 : 0;
      lidRef.current.rotation.x = THREE.MathUtils.lerp(lidRef.current.rotation.x, targetRotation, delta * 2);
    }
  });

  const woodMat = <meshStandardMaterial color="#5c3a21" roughness={0.9} />;
  const goldMat = <meshStandardMaterial color="#ffe600" metalness={0.8} roughness={0.2} />;

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
      <group ref={groupRef} position={[0, -0.8, 0]} scale={[1.2, 1.2, 1.2]}>
        {/* Bottom Box */}
        <group position={[0, 0.5, 0]}>
          <mesh>
            <boxGeometry args={[1.6, 1, 1]} />
            {woodMat}
          </mesh>
          {/* Gold Trim Bottom */}
          <mesh position={[0, 0.45, 0]}>
            <boxGeometry args={[1.65, 0.1, 1.05]} />
            {goldMat}
          </mesh>
          <mesh position={[0, -0.45, 0]}>
            <boxGeometry args={[1.65, 0.1, 1.05]} />
            {goldMat}
          </mesh>
        </group>

        {/* Lid (Animated via useFrame) */}
        <group ref={lidRef} position={[0, 1, -0.5]}>
          {/* Shift lid pivot by pushing mesh forward */}
          <group position={[0, 0, 0.5]}>
            <mesh rotation={[0, 0, 0]}>
              <cylinderGeometry args={[0.5, 0.5, 1.6, 16, 1, false, 0, Math.PI]} />
              <meshStandardMaterial color="#5c3a21" roughness={0.9} />
            </mesh>
            {/* Gold Trim Lid */}
            <mesh rotation={[0, 0, 0]} position={[0, 0, 0.5]}>
              <boxGeometry args={[1.65, 0.1, 0.1]} />
              {goldMat}
            </mesh>
          </group>
        </group>
      </group>
    </Float>
  );
}
