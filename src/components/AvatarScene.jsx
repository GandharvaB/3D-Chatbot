import React, { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stars } from '@react-three/drei';
import { EffectComposer, DepthOfField, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import AvatarModel from './AvatarModel';

// Floating dust particles
function DustParticles() {
  const particlesRef = useRef();
  const count = 8;

  const positions = React.useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 3;
      pos[i * 3 + 1] = Math.random() * 2.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    return pos;
  }, []);

  React.useEffect(() => {
    if (!particlesRef.current) return;
    let frame;
    const animate = () => {
      if (!particlesRef.current) return;
      const pos = particlesRef.current.geometry.attributes.position;
      for (let i = 0; i < count; i++) {
        pos.array[i * 3 + 1] += 0.0005;
        pos.array[i * 3] += Math.sin(Date.now() * 0.001 + i) * 0.0003;
        if (pos.array[i * 3 + 1] > 2.5) {
          pos.array[i * 3 + 1] = -0.5;
        }
      }
      pos.needsUpdate = true;
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.008}
        color="#667799"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// Ground reflection plane
function GroundPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <circleGeometry args={[1.2, 64]} />
      <meshStandardMaterial
        color="#0f0f1a"
        transparent
        opacity={0.3}
        roughness={0.1}
        metalness={0.8}
        envMapIntensity={0.5}
      />
    </mesh>
  );
}

export default function AvatarScene() {
  return (
    <Canvas
      shadows
      camera={{
        position: [0, 0.9, 4.0],
        fov: 35,
        near: 0.1,
        far: 100,
      }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(180deg, #0a0a14 0%, #12101e 50%, #0d0b16 100%)',
      }}
      dpr={[1, 2]}
    >
      {/* Ambient fill */}
      <ambientLight intensity={0.4} color="#8888cc" />

      {/* Key light — warm, slightly above-right */}
      <directionalLight
        position={[2, 3, 2]}
        intensity={1.8}
        color="#fff5e6"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.001}
      />

      {/* Fill light — cool, from left */}
      <directionalLight
        position={[-2, 1, 1]}
        intensity={0.6}
        color="#aabbff"
      />

      {/* Rim light — from behind */}
      <spotLight
        position={[0, 2.5, -2]}
        intensity={2.0}
        color="#6677ff"
        angle={0.5}
        penumbra={0.8}
        distance={6}
      />

      {/* Spotlight on avatar */}
      <spotLight
        position={[0, 3, 1]}
        intensity={1.5}
        color="#ffffff"
        angle={0.4}
        penumbra={0.9}
        distance={8}
        castShadow
      />

      {/* Ground reflection */}
      <GroundPlane />

      {/* Floating particles */}
      <DustParticles />

      {/* Avatar */}
      <Suspense fallback={null}>
        <AvatarModel />
      </Suspense>

      {/* Orbit controls */}
      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        minDistance={1.2}
        maxDistance={4}
        minPolarAngle={Math.PI * 0.2}
        maxPolarAngle={Math.PI * 0.65}
        enablePan={false}
        target={[0, 0.85, 0]}
        autoRotate={false}
      />

      {/* Post-processing */}
      <EffectComposer>
        <Bloom
          intensity={0.15}
          luminanceThreshold={0.8}
          luminanceSmoothing={0.9}
        />
        <Vignette
          offset={0.3}
          darkness={0.6}
        />
      </EffectComposer>
    </Canvas>
  );
}
