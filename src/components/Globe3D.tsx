import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface PollutionData {
    lat: number;
    lon: number;
    intensity: number;
    type: 'NO2' | 'Ozone' | 'PM';
    name: string;
}

interface Globe3DProps {
    selectedLayer: string[];
    timeOffset: number;
    onLocationClick: (data: any) => void;
}

function PollutionOverlay({ data, visible }: { data: PollutionData[]; visible: boolean }) {
    const instancedMeshRef = useRef<THREE.InstancedMesh>(null);
    const geometry = useMemo(() => new THREE.SphereGeometry(0.01, 8, 8), []);
    const material = useMemo(
        () =>
            new THREE.MeshBasicMaterial({
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending,
            }),
        []
    );

    useEffect(() => {
        if (!visible || !instancedMeshRef.current) return;

        const instanceCount = data.length;
        const instancedMesh = instancedMeshRef.current;
        instancedMesh.count = instanceCount;

        const dummy = new THREE.Object3D();
        const colors = new Float32Array(instanceCount * 3);

        data.forEach((point, i) => {
            const phi = (90 - point.lat) * (Math.PI / 180);
            const theta = (point.lon + 180) * (Math.PI / 180);
            const radius = 1.02;

            dummy.position.set(
                -(radius * Math.sin(phi) * Math.cos(theta)),
                radius * Math.cos(phi),
                radius * Math.sin(phi) * Math.sin(theta)
            );
            dummy.updateMatrix();
            instancedMesh.setMatrixAt(i, dummy.matrix);

            let color: THREE.Color;
            switch (point.type) {
                case 'NO2':
                    color = point.intensity > 0.7 ? new THREE.Color(0xb45309) :
                        point.intensity > 0.4 ? new THREE.Color(0xd97706) :
                            new THREE.Color(0xf59e0b);
                    break;
                case 'Ozone':
                    color = point.intensity > 0.7 ? new THREE.Color(0x1e40af) :
                        point.intensity > 0.4 ? new THREE.Color(0x1e40af) :
                            new THREE.Color(0x3b82f6);
                    break;
                case 'PM':
                    color = point.intensity > 0.7 ? new THREE.Color(0x6b21a8) :
                        point.intensity > 0.4 ? new THREE.Color(0x7e22ce) :
                            new THREE.Color(0xa855f7);
                    break;
                default:
                    color = new THREE.Color(0x16a34a);
            }

            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        });

        instancedMesh.instanceMatrix.needsUpdate = true;
        instancedMesh.geometry.setAttribute('color', new THREE.InstancedBufferAttribute(colors, 3));
        material.vertexColors = true;
    }, [data, visible]);

    useFrame((state) => {
        if (instancedMeshRef.current) {
            instancedMeshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.01;
        }
    });

    if (!visible) return null;

    return <instancedMesh ref={instancedMeshRef} args={[geometry, material, data.length]} />;
}

function Earth({ selectedLayer, timeOffset, onLocationClick, filteredData, earthRef }: Globe3DProps & { filteredData: PollutionData[]; earthRef: React.Ref<THREE.Mesh> }) {
    const atmosphereRef = useRef<THREE.Mesh>(null);
    const earthTexture = useLoader(THREE.TextureLoader, 'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg');

    useFrame((state) => {
        if (earthRef.current) {
            earthRef.current.rotation.y += 0.001;
        }
        if (atmosphereRef.current) {
            atmosphereRef.current.rotation.y += 0.0005;
        }
    });

    return (
        <group>
            <Sphere ref={earthRef} args={[1, 64, 64]}>
                <meshPhongMaterial
                    map={earthTexture}
                    emissive="#0a1f14"
                    specular="#333333"
                    shininess={25}
                />
            </Sphere>
            <Sphere ref={atmosphereRef} args={[1.05, 64, 64]}>
                <meshPhongMaterial
                    color="#4a9eff"
                    transparent
                    opacity={0.15}
                    side={THREE.BackSide}
                />
            </Sphere>
            <PollutionOverlay data={filteredData} visible={selectedLayer.length > 0} />
        </group>
    );
}

export default function Globe3D({ selectedLayer, timeOffset, onLocationClick }: Globe3DProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const raycaster = useRef(new THREE.Raycaster());
    const mouse = useRef(new THREE.Vector2());
    const pointsRef = useRef<THREE.InstancedMesh>(null);
    const earthRef = useRef<THREE.Mesh>(null);

    const cities = useMemo(
        () => [
            { lat: 40.7128, lon: -74.0060, name: 'New York' },
            { lat: 51.5074, lon: -0.1278, name: 'Londres' },
            { lat: 35.6762, lon: 139.6503, name: 'Tokyo' },
            { lat: 19.4326, lon: -99.1332, name: 'Mexico' },
            { lat: 28.6139, lon: 77.2090, name: 'Delhi' },
            { lat: -23.5505, lon: -46.6333, name: 'São Paulo' },
            { lat: 31.2304, lon: 121.4737, name: 'Shanghai' },
            { lat: 34.0522, lon: -118.2437, name: 'Los Angeles' },
        ],
        []
    );

    const pollutionData = useMemo(() => {
        const data: PollutionData[] = [];
        cities.forEach(city => {
            ['NO2', 'Ozone', 'PM'].forEach(type => {
                data.push({
                    lat: city.lat,
                    lon: city.lon,
                    intensity: Math.min(1, 0.3 + Math.random() * 0.6 + timeOffset * 0.02),
                    type: type as 'NO2' | 'Ozone' | 'PM',
                    name: city.name,
                });
            });
        });
        return data;
    }, [timeOffset, cities]);

    const filteredData = useMemo(() => {
        return pollutionData.filter(d => selectedLayer.includes(d.type));
    }, [pollutionData, selectedLayer]);

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (!canvasRef.current || !pointsRef.current || !earthRef.current) return;
            const rect = canvasRef.current.getBoundingClientRect();
            mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.current.setFromCamera(mouse.current, canvasRef.current.getContext('webgl')!.getParameter(0x1700));
            const intersects = raycaster.current.intersectObjects([pointsRef.current, earthRef.current]);

            if (intersects.length > 0) {
                const intersect = intersects[0];
                if (intersect.object === pointsRef.current) {
                    const index = intersect.instanceId;
                    if (index !== undefined) {
                        const clickedData = filteredData[index];
                        onLocationClick({
                            name: clickedData.name,
                            location: clickedData.name,
                            lat: clickedData.lat,
                            lon: clickedData.lon,
                            aqi: Math.round(clickedData.intensity * 300),
                            [clickedData.type]: Math.round(clickedData.intensity * 200),
                        });
                    }
                } else if (intersect.object === earthRef.current) {
                    // Calculate lat/lon from intersection point
                    const point = intersect.point.normalize(); // Normalize to unit sphere
                    const lat = 90 - (Math.acos(point.y) * 180 / Math.PI);
                    const lon = (Math.atan2(point.z, point.x) * 180 / Math.PI) - 180;
                    onLocationClick({
                        name: 'Custom Location',
                        location: 'Custom Location',
                        lat,
                        lon,
                        aqi: 0, // Default or fetch
                    });
                }
            }
        };

        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, [filteredData, onLocationClick]);

    return (
        <div className="w-full h-full">
            <Canvas
                ref={canvasRef}
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
                    filteredData={filteredData}
                    earthRef={earthRef}
                />
                <PollutionOverlay data={filteredData} visible={selectedLayer.length > 0} ref={pointsRef} />
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
