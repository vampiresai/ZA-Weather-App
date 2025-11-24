import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Cloud } from '@react-three/drei';
import * as THREE from 'three';

// Add type definitions for Three.js elements in JSX to fix TypeScript errors
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      sphereGeometry: any;
      meshStandardMaterial: any;
      pointLight: any;
      ambientLight: any;
      bufferGeometry: any;
      bufferAttribute: any;
      points: any;
      pointsMaterial: any;
      fog: any;
    }
  }
}

// --- WEATHER COMPONENTS ---

const Sun = () => {
  return (
    <group>
      <mesh position={[10, 10, -20]}>
        <sphereGeometry args={[4, 32, 32]} />
        <meshStandardMaterial 
          emissive="#fbbf24" 
          emissiveIntensity={2} 
          color="#f59e0b" 
          toneMapped={false}
        />
      </mesh>
      <pointLight position={[10, 10, -20]} intensity={2} color="#fbbf24" distance={100} />
      <ambientLight intensity={0.5} color="#fff7ed" />
    </group>
  );
};

const Clouds = ({ stormy = false }: { stormy?: boolean }) => {
  return (
    <group>
      <Cloud 
        opacity={stormy ? 0.8 : 0.5} 
        speed={0.4} 
        width={10} 
        depth={1.5} 
        segments={20} 
        position={[0, 0, -10]}
        color={stormy ? "#475569" : "#ffffff"}
      />
      <Cloud 
        opacity={stormy ? 0.7 : 0.4} 
        speed={0.3} 
        width={10} 
        depth={2} 
        segments={10} 
        position={[0, 5, -15]}
        color={stormy ? "#334155" : "#e2e8f0"}
      />
      <ambientLight intensity={stormy ? 0.2 : 0.8} />
    </group>
  );
};

const Rain = ({ count = 2000 }) => {
  const points = useRef<THREE.Points>(null);

  // Generate random positions for rain drops
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30; // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20; // z
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (!points.current) return;
    
    const positions = points.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      // Move down
      positions[i * 3 + 1] -= 0.3; // Speed

      // Reset if below simple threshold
      if (positions[i * 3 + 1] < -20) {
        positions[i * 3 + 1] = 20;
      }
    }
    
    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#a5f3fc"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

const Lightning = () => {
  const light = useRef<THREE.PointLight>(null);
  
  useFrame((state) => {
    if (light.current) {
        // Random lightning flashes
        if (Math.random() > 0.98) {
            light.current.intensity = 10 + Math.random() * 20;
            light.current.position.set(
                (Math.random() - 0.5) * 20,
                10,
                (Math.random() - 0.5) * 20
            );
        } else {
            light.current.intensity = Math.max(0, light.current.intensity * 0.8);
        }
    }
  });

  return <pointLight ref={light} color="#a5f3fc" distance={50} decay={2} />;
};

// --- MAIN SCENE ---

const Scene = ({ condition }: { condition: string }) => {
  const c = condition.toLowerCase();
  
  // Categorize logic
  const isStorm = c.includes('storm') || c.includes('thunder');
  const isRain = c.includes('rain') || c.includes('drizzle') || c.includes('shower') || isStorm;
  const isCloudy = c.includes('cloud') || c.includes('overcast') || isRain; // Rain usually implies clouds
  const isClear = c.includes('clear') || c.includes('sun');
  
  // Background color interpolation based on weather
  let bgGradient = ['#0f172a', '#1e293b']; // Default Night/Dark
  if (isClear) bgGradient = ['#38bdf8', '#0ea5e9']; // Blue Sky
  if (isCloudy && !isRain) bgGradient = ['#94a3b8', '#64748b']; // Grey Sky
  if (isRain) bgGradient = ['#334155', '#0f172a']; // Dark Stormy

  return (
    <div style={{ 
        width: '100%', 
        height: '100%', 
        background: `linear-gradient(to bottom, ${bgGradient[0]}, ${bgGradient[1]})`,
        transition: 'background 1s ease-in-out'
    }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        
        {/* Environment setup */}
        {!isStorm && !isRain && <ambientLight intensity={0.5} />}
        {isClear && <Sun />}
        
        {/* Weather Elements */}
        {isCloudy && <Clouds stormy={isRain || isStorm} />}
        {isRain && <Rain />}
        {isStorm && <Lightning />}

        {/* Night/Clear filler */}
        {(!isCloudy && !isRain) && <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={0.5} />}
        
        {/* Subtle ambience */}
        <fog attach="fog" args={[bgGradient[0], 5, 40]} />
        
      </Canvas>
    </div>
  );
};

export default Scene;