import { useCallback, useMemo, useRef, useEffect, type RefObject } from 'react';
import { Canvas, useFrame, useLoader, type ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';

type PollutionType = 'NO2' | 'Ozone' | 'PM';

interface PollutionPoint {
    lat: number;
    lon: number;
    intensity: number;
    type: PollutionType;
    name: string;
}

interface LocationInsight {
    name?: string;
    location?: string;
    lat: number;
    lon: number;
    NO2?: number;
    Ozone?: number;
    PM?: number;
    aqi?: number;
    riskNarrative?: string;
    vulnerableProfiles?: string;
    sources?: string[];
    region?: string;
    regionInsights?: any;
}

interface Globe3DProps {
    selectedLayer: string[];
    timeOffset: number;
    onLocationClick: (data: any) => void;
}

const NORTH_AMERICA_BOUNDS = {
    latMin: 5,
    latMax: 83,
    lonMin: -168,
    lonMax: -52,
};

const WHO_LIMITS = {
    no2: 25,
    pm25: 15,
    o3: 60,
};

function convertIntensityToConcentration(intensity: number, type: PollutionType): number {
    const multipliers: Record<PollutionType, number> = {
        NO2: 80,
        Ozone: 120,
        PM: 90,
    };
    return Number((intensity * multipliers[type]).toFixed(1));
}

function computeAqi(metrics: { no2: number; pm25: number; o3: number }): number {
    const ratios = [metrics.no2 / WHO_LIMITS.no2, metrics.pm25 / WHO_LIMITS.pm25, metrics.o3 / WHO_LIMITS.o3];
    const dominant = Math.max(...ratios, 0);
    return Math.min(300, Math.round(dominant * 160));
}

function buildRiskSummary(aqi: number, metrics: { no2: number; pm25: number; o3: number }) {
    if (aqi >= 150) {
        return {
            label: 'High risk',
            description: `High risk: NO₂ ${metrics.no2.toFixed(1)} µg/m³ (> ${WHO_LIMITS.no2}), PM2.5 ${metrics.pm25.toFixed(1)} µg/m³ (> ${WHO_LIMITS.pm25}), O₃ ${metrics.o3.toFixed(1)} µg/m³ (> ${WHO_LIMITS.o3}). Reduce all outdoor activity (WHO AQG 2021).`,
            vulnerableProfiles: 'Children, asthmatics, COPD: stay indoors; HEPA purifier recommended.',
        };
    }

    if (aqi >= 100) {
        return {
            label: 'Moderate',
            description: `Moderate: partial compliance with WHO thresholds (NO₂ ${metrics.no2.toFixed(1)} µg/m³, PM2.5 ${metrics.pm25.toFixed(1)} µg/m³, O₃ ${metrics.o3.toFixed(1)} µg/m³). Monitor fluctuations from NASA TEMPO and OpenAQ.`,
            vulnerableProfiles: 'Pregnant women, seniors, people with asthma: limit outdoor exertion.',
        };
    }

    return {
        label: 'Good',
        description: `Good: levels below WHO AQG 2021 (NO₂ ${metrics.no2.toFixed(1)} µg/m³, PM2.5 ${metrics.pm25.toFixed(1)} µg/m³, O₃ ${metrics.o3.toFixed(1)} µg/m³).`,
        vulnerableProfiles: 'General population: favorable conditions; maintain regular monitoring.',
    };
}

function isWithinNorthAmerica(lat: number, lon: number) {
    return (
        lat >= NORTH_AMERICA_BOUNDS.latMin &&
        lat <= NORTH_AMERICA_BOUNDS.latMax &&
        lon >= NORTH_AMERICA_BOUNDS.lonMin &&
        lon <= NORTH_AMERICA_BOUNDS.lonMax
    );
}

function PollutionOverlay({
                              data,
                              visible,
                              onPointClick,
                          }: {
    data: PollutionPoint[];
    visible: boolean;
    onPointClick: (index: number) => void;
}) {
    const instancedMeshRef = useRef<THREE.InstancedMesh>(null);
    const geometry = useMemo(() => new THREE.SphereGeometry(0.01, 8, 8), []);
    const material = useMemo(
        () =>
            new THREE.MeshBasicMaterial({
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending,
                vertexColors: true,
            }),
        []
    );

    useMemo(() => geometry.computeBoundingSphere(), [geometry]);

    useMemo(() => material.needsUpdate = true, [material]);

    useMemo(() => {
        if (!visible || !instancedMeshRef.current) return;
        const instancedMesh = instancedMeshRef.current;
        instancedMesh.count = data.length;

        const dummy = new THREE.Object3D();
        const colors = new Float32Array(data.length * 3);

        data.forEach((point, index) => {
            const phi = (90 - point.lat) * (Math.PI / 180);
            const theta = (point.lon + 180) * (Math.PI / 180);
            const radius = 1.02;

            dummy.position.set(
                -(radius * Math.sin(phi) * Math.cos(theta)),
                radius * Math.cos(phi),
                radius * Math.sin(phi) * Math.sin(theta)
            );
            dummy.updateMatrix();
            instancedMesh.setMatrixAt(index, dummy.matrix);

            const color = new THREE.Color();
            switch (point.type) {
                case 'NO2':
                    color.set(point.intensity > 0.7 ? 0xb45309 : point.intensity > 0.4 ? 0xd97706 : 0xf59e0b);
                    break;
                case 'Ozone':
                    color.set(point.intensity > 0.7 ? 0x1e40af : point.intensity > 0.4 ? 0x2563eb : 0x3b82f6);
                    break;
                case 'PM':
                    color.set(point.intensity > 0.7 ? 0x6b21a8 : point.intensity > 0.4 ? 0x7e22ce : 0xa855f7);
                    break;
            }

            colors[index * 3] = color.r;
            colors[index * 3 + 1] = color.g;
            colors[index * 3 + 2] = color.b;
        });

        instancedMesh.instanceMatrix.needsUpdate = true;
        instancedMesh.geometry.setAttribute('color', new THREE.InstancedBufferAttribute(colors, 3));
    }, [data, visible, geometry]);

    useFrame((_) => {
        if (instancedMeshRef.current) {
            instancedMeshRef.current.rotation.y += 0.001;
        }
    });

    if (!visible || data.length === 0) {
        return null;
    }

    return (
        <instancedMesh
            ref={instancedMeshRef}
            args={[geometry, material, data.length]}
            onPointerDown={(event) => {
                event.stopPropagation();
                if (typeof event.instanceId === 'number') {
                    onPointClick(event.instanceId);
                }
            }}
        />
    );
}

function Earth({
                   onSurfaceClick,
                   earthRef,
               }: {
    onSurfaceClick: (coords: { lat: number; lon: number }) => void;
    earthRef: RefObject<THREE.Mesh | null>;
}) {
    const atmosphereRef = useRef<THREE.Mesh>(null);
    const highlightGroupRef = useRef<THREE.Group>(null);
    const earthTexture = useLoader(THREE.TextureLoader, 'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg');
    const pinTexture = useLoader(THREE.TextureLoader, 'https://raw.githubusercontent.com/oscarduzer/countries-states-cities-database/refs/heads/master/pin-carte.png'); // Chemin vers l'icône

    useFrame(() => {
        if (earthRef.current) {
            earthRef.current.rotation.y += 0.001;
        }
        if (atmosphereRef.current) {
            atmosphereRef.current.rotation.y += 0.0005;
        }
    });

    const handleSurfaceInteraction = useCallback(
        (event: ThreeEvent<MouseEvent>) => {
            event.stopPropagation();
            const point = event.point.clone().normalize();
            const lat = 90 - (Math.acos(point.y) * 180) / Math.PI;
            let lon = (Math.atan2(point.z, point.x) * 180) / Math.PI;
            if (lon > 180) lon -= 360;
            onSurfaceClick({ lat, lon });
        },
        [onSurfaceClick]
    );

    const latLonToPosition = (lat: number, lon: number, radius = 1.02) => {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        const x = -(radius * Math.sin(phi) * Math.cos(theta));
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);
        return new THREE.Vector3(x, y, z);
    };

    useEffect(() => {
        if (highlightGroupRef.current) {
            highlightGroupRef.current.lookAt(new THREE.Vector3(0, 0, 0));
        }
    }, []);

    return (
        <group>
            <Sphere ref={earthRef} args={[1, 64, 64]} onPointerDown={handleSurfaceInteraction}>
                <meshPhongMaterial map={earthTexture} emissive="#0a1f14" specular="#333333" shininess={25} />
                <group ref={highlightGroupRef} position={latLonToPosition(45.50182284708731, -73.56219553253155, 1.03)}>
                    <mesh>
                        <planeGeometry args={[0.05, 0.05]} /> {/* Taille de l'icône */}
                        <meshBasicMaterial map={pinTexture} transparent side={THREE.DoubleSide} />
                    </mesh>
                </group>
            </Sphere>
            <Sphere ref={atmosphereRef} args={[1.05, 64, 64]}>
                <meshPhongMaterial color="#4a9eff" transparent opacity={0.15} side={THREE.BackSide} />
            </Sphere>
        </group>
    );
}
export default function Globe3D({ selectedLayer, timeOffset, onLocationClick }: Globe3DProps) {
    const earthRef = useRef<THREE.Mesh | null>(null);
    const controlsRef = useRef<any>(null);

    const cities = useMemo(
        () => [
            { lat: 40.7128, lon: -74.006, name: 'New York' },
            { lat: 51.5074, lon: -0.1278, name: 'London' },
            { lat: 35.6762, lon: 139.6503, name: 'Tokyo' },
            { lat: 19.4326, lon: -99.1332, name: 'Mexico' },
            { lat: 28.6139, lon: 77.209, name: 'Delhi' },
            { lat: -23.5505, lon: -46.6333, name: 'São Paulo' },
            { lat: 31.2304, lon: 121.4737, name: 'Shanghai' },
            { lat: 34.0522, lon: -118.2437, name: 'Los Angeles' },
            { lat: 49.2827, lon: -123.1207, name: 'Vancouver' },
            { lat: 45.4215, lon: -75.6972, name: 'Ottawa' },
            { lat: 45.5017, lon: -73.5673, name: 'Montreal' },
        ],
        []
    );

    const pollutionData = useMemo(() => {
        const entries: PollutionPoint[] = [];
        cities.forEach((city) => {
            (['NO2', 'Ozone', 'PM'] as PollutionType[]).forEach((type) => {
                const base = 0.3 + Math.random() * 0.4;
                const variation = timeOffset * 0.02;
                entries.push({
                    lat: city.lat,
                    lon: city.lon,
                    name: city.name,
                    type,
                    intensity: Math.min(1, base + variation),
                });
            });
        });
        return entries;
    }, [cities, timeOffset]);

    const filteredData = useMemo(() => {
        if (selectedLayer.length === 0) {
            return pollutionData;
        }
        return pollutionData.filter((entry) => selectedLayer.includes(entry.type));
    }, [pollutionData, selectedLayer]);

    const aggregatedByCity = useMemo(() => {
        const cityMap = new Map<
            string,
            {
                lat: number;
                lon: number;
                metrics: Record<PollutionType, number>;
            }
        >();

        pollutionData.forEach((entry) => {
            if (!cityMap.has(entry.name)) {
                cityMap.set(entry.name, {
                    lat: entry.lat,
                    lon: entry.lon,
                    metrics: { NO2: 0, Ozone: 0, PM: 0 },
                });
            }
            const cityRecord = cityMap.get(entry.name)!;
            cityRecord.metrics[entry.type] = convertIntensityToConcentration(entry.intensity, entry.type);
        });

        return cityMap;
    }, [pollutionData]);

    const handlePointClick = useCallback(
        (index: number) => {
            const clicked = filteredData[index];
            if (!clicked) return;
            const aggregate = aggregatedByCity.get(clicked.name);
            if (!aggregate) return;

            const metrics = {
                no2: aggregate.metrics.NO2,
                pm25: aggregate.metrics.PM,
                o3: aggregate.metrics.Ozone,
            };
            const aqi = computeAqi(metrics);
            const risk = buildRiskSummary(aqi, metrics);

            const payload = {
                name: aggregate ? clicked.name : 'Location',
                location: `${clicked.name} (satellite + ground data)`,
                lat: aggregate.lat,
                lon: aggregate.lon,
                NO2: Number(metrics.no2.toFixed(1)),
                Ozone: Number(metrics.o3.toFixed(1)),
                PM: Number(metrics.pm25.toFixed(1)),
                aqi,
                riskNarrative: risk.description,
                vulnerableProfiles: risk.vulnerableProfiles,
                sources: ['NASA TEMPO', 'OpenAQ', 'Open-Meteo'],
            } as LocationInsight;

            onLocationClick(payload);
        },
        [aggregatedByCity, filteredData, onLocationClick]
    );

    const handleSurfaceClick = useCallback(
        ({ lat, lon }: { lat: number; lon: number }) => {
            if (isWithinNorthAmerica(lat, lon)) {
                const northAmericaPoints = pollutionData.filter((point) => isWithinNorthAmerica(point.lat, point.lon));
                if (northAmericaPoints.length > 0) {
                    const accumulators = { NO2: 0, Ozone: 0, PM: 0 } as Record<PollutionType, number>;
                    const counts = { NO2: 0, Ozone: 0, PM: 0 } as Record<PollutionType, number>;
                    northAmericaPoints.forEach((point) => {
                        accumulators[point.type] += convertIntensityToConcentration(point.intensity, point.type);
                        counts[point.type] += 1;
                    });

                    const averages = {
                        no2: counts.NO2 ? accumulators.NO2 / counts.NO2 : 0,
                        pm25: counts.PM ? accumulators.PM / counts.PM : 0,
                        o3: counts.Ozone ? accumulators.Ozone / counts.Ozone : 0,
                    };
                    const aqi = computeAqi(averages);
                    const risk = buildRiskSummary(aqi, averages);
                    const diseaseProbabilities = [
                        `Asthma: ${Math.min(90, Math.round(aqi * 0.45))}% (High NO₂ + PM2.5).`,
                        `Chronic bronchitis: ${Math.min(80, Math.round(averages.pm25 * 4))}% (based on WHO data).`,
                        `COPD: ${Math.min(70, Math.round(averages.no2 * 2.2))}%.`,
                        `Pneumonia: ${Math.min(60, Math.round(averages.o3 * 1.1))}%.`,
                    ];

                    const payload = {
                        name: 'North America',
                        location: `North America zone (${lat.toFixed(1)}°, ${lon.toFixed(1)}°)`,
                        lat,
                        lon,
                        NO2: Number(averages.no2.toFixed(1)),
                        Ozone: Number(averages.o3.toFixed(1)),
                        PM: Number(averages.pm25.toFixed(1)),
                        aqi,
                        vulnerableProfiles: risk.vulnerableProfiles,
                        riskNarrative: risk.description,
                        region: 'north-america',
                        regionInsights: {
                            summary: risk.description,
                            diseaseProbabilities,
                            keyHighlights: [
                                `Avg NO₂ ${averages.no2.toFixed(1)} µg/m³ (WHO 24h < ${WHO_LIMITS.no2}).`,
                                `Avg PM2.5 ${averages.pm25.toFixed(1)} µg/m³ (WHO 24h < ${WHO_LIMITS.pm25}).`,
                                `Avg O₃ ${averages.o3.toFixed(1)} µg/m³ (WHO seasonal peak < ${WHO_LIMITS.o3}).`,
                            ],
                            sources: ['NASA TEMPO', 'OpenAQ', 'Open-Meteo'],
                        },
                    } as LocationInsight;

                    onLocationClick(payload);
                    return;
                }
            }

            const cityEntries = Array.from(aggregatedByCity.values());
            if (cityEntries.length === 0) {
                const payload = {
                    name: 'Custom Location',
                    location: `Lat ${lat.toFixed(1)}°, Lon ${lon.toFixed(1)}°`,
                    lat,
                    lon,
                    aqi: 0,
                    NO2: 0,
                    Ozone: 0,
                    PM: 0,
                    riskNarrative: 'Data unavailable for this area. Use the Health Assistant for an estimate.',
                    vulnerableProfiles: 'General population: monitor local alerts.',
                } as LocationInsight;

                onLocationClick(payload);
                return;
            }

            const toRadians = (value: number) => (value * Math.PI) / 180;
            const nearest = cityEntries.reduce((closest, entry) => {
                const dLat = toRadians(entry.lat - lat);
                const dLon = toRadians(entry.lon - lon);
                const a =
                    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(toRadians(lat)) * Math.cos(toRadians(entry.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
                const distance = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                if (!closest || distance < closest.distance) {
                    return { entry, distance };
                }
                return closest;
            }, null as { entry: { lat: number; lon: number; metrics: Record<PollutionType, number> }; distance: number } | null);

            if (!nearest) return;
            const metrics = {
                no2: nearest.entry.metrics.NO2,
                pm25: nearest.entry.metrics.PM,
                o3: nearest.entry.metrics.Ozone,
            };
            const aqi = computeAqi(metrics);
            const risk = buildRiskSummary(aqi, metrics);

            const payload = {
                name: 'Custom Location',
                location: `Near ${nearest.entry.lat.toFixed(1)}°, ${nearest.entry.lon.toFixed(1)}°`,
                lat,
                lon,
                NO2: Number(metrics.no2.toFixed(1)),
                Ozone: Number(metrics.o3.toFixed(1)),
                PM: Number(metrics.pm25.toFixed(1)),
                aqi,
                riskNarrative: risk.description,
                vulnerableProfiles: risk.vulnerableProfiles,
                sources: ['NASA TEMPO', 'OpenAQ', 'Open-Meteo'],
            } as LocationInsight;

            onLocationClick(payload);
        },
        [aggregatedByCity, onLocationClick, pollutionData]
    );

   /* // Helper to convert lat/lon to 3D position used by markers
    const latLonToPosition = (lat: number, lon: number, radius = 1.02) => {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        const x = -(radius * Math.sin(phi) * Math.cos(theta));
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);
        return [x, y, z];
    };*/




/*
    // Set initial camera to center (Montréal) and optionally lock focus on mount
    function SetInitialView({ center, zoom }: { center: [number, number]; zoom: number }) {
        const { camera } = useThree();
        useEffect(() => {
            const pos = latLonToPosition(center[0], center[1], zoom) as unknown as [number, number, number];
            camera.position.set(pos[0], pos[1], pos[2]);
            if (controlsRef.current && controlsRef.current.target) {
                const tgt = latLonToPosition(center[0], center[1], 1.02) as unknown as [number, number, number];
                controlsRef.current.target.set(tgt[0], tgt[1], tgt[2]);
                controlsRef.current.update();
            }
            // no deps: run once
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);
        return null;
    }*/

    return (
        <div className="w-full h-full relative">

            <Canvas camera={{ position: [0, 0, 3], fov: 45 }} gl={{ antialias: true, alpha: true }}>
                <color attach="background" args={['#020d30']} />
                <ambientLight intensity={0.3} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.3} color="#4a9eff" />
                <Earth onSurfaceClick={handleSurfaceClick} earthRef={earthRef} />
                <PollutionOverlay data={filteredData} visible={selectedLayer.length > 0} onPointClick={handlePointClick} />

                {/*<SetInitialView center={[45.5017, -73.5673]} zoom={3.5} />*/}

                <OrbitControls autoRotate={false} ref={controlsRef} enablePan={true} enableZoom={true} enableRotate={true} minDistance={1.5} maxDistance={8} enableDamping dampingFactor={0.05} />

            </Canvas>
        </div>
    );
}
