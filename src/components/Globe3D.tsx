import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface PollutionData {
  lat: number;
  lon: number;
  intensity: number;
  type: 'NO2' | 'Ozone' | 'PM';
}

interface Globe3DProps {
  selectedLayer: string[];
  timeOffset: number;
  onLocationClick: (data: any) => void;
}

function PollutionOverlay({ data, visible }: { data: PollutionData[]; visible: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const geometry = useMemo(() => {
    const positions = new Float32Array(data.length * 3);
    const colors = new Float32Array(data.length * 3);
    const sizes = new Float32Array(data.length);
    
    data.forEach((point, i) => {
      const phi = (90 - point.lat) * (Math.PI / 180);
      const theta = (point.lon + 180) * (Math.PI / 180);
      const radius = 1.02;
      
      positions[i * 3] = -(radius * Math.sin(phi) * Math.cos(theta));
      positions[i * 3 + 1] = radius * Math.cos(phi);
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      
      const color = point.intensity > 0.7 ? new THREE.Color(1, 0, 0) :
                    point.intensity > 0.4 ? new THREE.Color(1, 0.5, 0) :
                    new THREE.Color(0, 1, 0);
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      sizes[i] = 0.02 + point.intensity * 0.04;
    });
    
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geom.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    return geom;
  }, [data]);
  
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.01;
    }
  });
  
  if (!visible) return null;
  
  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Earth({ selectedLayer, timeOffset, onLocationClick }: Globe3DProps) {
  const earthRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += 0.0005;
    }
  });
  
  // Generate mock pollution data
  const pollutionData = useMemo(() => {
    const data: PollutionData[] = [];
    const cities = [
      { lat: 40.7128, lon: -74.0060, name: 'New York' },
      { lat: 51.5074, lon: -0.1278, name: 'London' },
      { lat: 35.6762, lon: 139.6503, name: 'Tokyo' },
      { lat: 19.4326, lon: -99.1332, name: 'Mexico City' },
      { lat: 28.6139, lon: 77.2090, name: 'Delhi' },
      { lat: -23.5505, lon: -46.6333, name: 'São Paulo' },
      { lat: 31.2304, lon: 121.4737, name: 'Shanghai' },
      { lat: 34.0522, lon: -118.2437, name: 'Los Angeles' },
    ];
    
    cities.forEach(city => {
      ['NO2', 'Ozone', 'PM'].forEach(type => {
        data.push({
          lat: city.lat,
          lon: city.lon,
          intensity: 0.3 + Math.random() * 0.6 + (timeOffset * 0.02),
          type: type as 'NO2' | 'Ozone' | 'PM',
        });
      });
    });
    
    return data;
  }, [timeOffset]);
  
  const filteredData = useMemo(() => {
    return pollutionData.filter(d => selectedLayer.includes(d.type));
  }, [pollutionData, selectedLayer]);
  
  return (
    <group>
      {/* Earth */}
      <Sphere ref={earthRef} args={[1, 64, 64]}>
        <meshPhongMaterial
          color="#1a4d2e"
          emissive="#0a1f14"
          specular="#333333"
          shininess={25}
        />
      </Sphere>
      
      {/* Atmosphere */}
      <Sphere ref={atmosphereRef} args={[1.05, 64, 64]}>
        <meshPhongMaterial
          color="#4a9eff"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Pollution overlays */}
      <PollutionOverlay data={filteredData} visible={selectedLayer.length > 0} />
    </group>
  );
}

export default function Globe3D({ selectedLayer, timeOffset, onLocationClick }: Globe3DProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#0a0e1a']} />
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#4a9eff" />
        
        <Earth
          selectedLayer={selectedLayer}
          timeOffset={timeOffset}
          onLocationClick={onLocationClick}
        />
        
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={1.5}
          maxDistance={5}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}
