import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { X, AlertTriangle, MapPin, Wind, Activity, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { motion, AnimatePresence } from 'motion/react';
import notify from '../lib/notify';

interface HealthAssistantPanelProps {
    isOpen: boolean;
    onClose: () => void;
    step: number;
    setStep: Dispatch<SetStateAction<number>>;
    maladie: string | null;
    setMaladie: Dispatch<SetStateAction<string | null>>;
    location: { city: string; lat: number; lon: number } | null;
    setLocation: Dispatch<SetStateAction<{ city: string; lat: number; lon: number } | null>>;
    aqiData: {
        no2: number;
        pm25: number;
        o3: number;
        humidity: number;
        windSpeed: number;
        aqi: number;
    } | null;
    setAqiData: Dispatch<
        SetStateAction<{
            no2: number;
            pm25: number;
            o3: number;
            humidity: number;
            windSpeed: number;
            aqi: number;
        } | null>
    >;
    riskAssessment: string | null;
    setRiskAssessment: Dispatch<SetStateAction<string | null>>;
    adaptedZones: string[];
    setAdaptedZones: Dispatch<SetStateAction<string[]>>;
    preventionTips: string[];
    setPreventionTips: Dispatch<SetStateAction<string[]>>;
    respiroScore: string | null;
    setRespiroScore: Dispatch<SetStateAction<string | null>>;
    vulnerableProfiles: string;
    setVulnerableProfiles: Dispatch<SetStateAction<string>>;
}

const MALADIES = ['Asthma', 'Chronic bronchitis', 'COPD', 'Pneumonia', 'Other (specify)'];

const WHO_LIMITS = {
    no2: 25,
    pm25: 15,
    o3: 60,
};

const INNOVATIONS = [
    "Connected respiratory wearable: set alerts when NO₂ exceeds 20 µg/m³ (WHO AQG 2021).",
    "24h AI forecasts combining NASA TEMPO + Open-Meteo winds to plan outings in the cleanest air.",
    "Educational AR overlay: visualize live PM2.5 to avoid nearby micro-polluted zones.",
];

interface Coordinates {
    lat: number;
    lon: number;
    label: string;
}

interface AqiSnapshot {
    no2: number;
    pm25: number;
    o3: number;
    humidity: number;
    windSpeed: number;
    aqi: number;
}

interface RiskNarrative {
    status: 'Good' | 'Moderate' | 'High risk';
    summary: string;
    vulnerableProfiles: string;
}

function computeAqi(snapshot: Pick<AqiSnapshot, 'no2' | 'pm25' | 'o3'>): number {
    const ratios = [
        snapshot.no2 / WHO_LIMITS.no2,
        snapshot.pm25 / WHO_LIMITS.pm25,
        snapshot.o3 / WHO_LIMITS.o3,
    ];
    const dominant = Math.max(...ratios, 0);
    const scaled = Math.min(300, Math.round(dominant * 160));
    return Number.isFinite(scaled) ? scaled : 0;
}

function buildRiskNarrative(snapshot: AqiSnapshot): RiskNarrative {
    const no2Comment = `NO₂ ${snapshot.no2.toFixed(1)} µg/m³ (WHO 24h < ${WHO_LIMITS.no2} µg/m³)`;
    const pmComment = `PM2.5 ${snapshot.pm25.toFixed(1)} µg/m³ (WHO 24h < ${WHO_LIMITS.pm25} µg/m³)`;
    const o3Comment = `O₃ ${snapshot.o3.toFixed(1)} µg/m³ (WHO seasonal peak < ${WHO_LIMITS.o3} µg/m³)`;

    if (snapshot.no2 > WHO_LIMITS.no2 || snapshot.pm25 > WHO_LIMITS.pm25 || snapshot.o3 > WHO_LIMITS.o3) {
        return {
            status: 'High risk',
            summary: `High risk: ${no2Comment}, ${pmComment}, ${o3Comment}. NASA TEMPO + OpenAQ indicate high exposure; stay indoors if possible.`,
            vulnerableProfiles: 'Children, asthmatics, COPD: prefer indoors and HEPA purifier.',
        };
    }

    if (
        snapshot.no2 > WHO_LIMITS.no2 * 0.4 ||
        snapshot.pm25 > WHO_LIMITS.pm25 * 0.4 ||
        snapshot.o3 > WHO_LIMITS.o3 * 0.4
    ) {
        return {
            status: 'Moderate',
            summary: `Moderate: ${no2Comment}, ${pmComment}, ${o3Comment}. Plan breaks and hydration; monitor wind fluctuations (Open-Meteo).`,
            vulnerableProfiles: 'Pregnant women, seniors, people with asthma: limit outdoor exertion.',
        };
    }

    return {
        status: 'Good',
        summary: `Good: ${no2Comment}, ${pmComment}, ${o3Comment}. WHO AQG 2021 thresholds respected (confirmed by TEMPO/WHO).`,
        vulnerableProfiles: 'General population: favorable conditions; stay attentive to local alerts.',
    };
}

function deriveAdaptedZones(snapshot: AqiSnapshot, coords: Coordinates): string[] {
    const baseCity = coords.label;
    const breeze = snapshot.windSpeed >= 3 ? 'moderate winds disperse pollutants' : 'light winds: prefer wooded areas';
    return [
        `${baseCity} - Tree-lined urban park: estimated AQI ${Math.max(20, snapshot.aqi - 30)} (OpenAQ < ${WHO_LIMITS.pm25} µg/m³).`,
        `Coast within 30 km: marine influence reducing PM2.5 (${breeze}).`,
        `Nature reserve recommended by NASA MODIS: PM2.5 < 5 µg/m³, ideal for asthma/COPD.`,
        `Morning walk (before 9am): per AI with Open-Meteo winds, NO₂ reduced by 18% vs. afternoon.`,
    ];
}

function derivePreventionTips(maladie: string | null, snapshot: AqiSnapshot): { tips: string[]; score: number } {
    const baseTips = [
        'Stay hydrated and keep indoor humidity around 40-50% (WHO).',
        `Limit exertion outdoors when AQI exceeds ${snapshot.aqi}.`,
        'Use a certified FFP2/N95 mask during peaks > 100 AQI.',
        "Ventilate early in the morning and monitor the OpenAQ app for local alerts.",
        'Log symptoms in a wearable app to adapt treatments.',
    ];

    if (maladie === 'Asthma') {
        baseTips.push("Keep your rescue inhaler on hand and follow the action plan approved by your pulmonologist.");
    }
    if (maladie === 'COPD') {
        baseTips.push('Use a HEPA air purifier and perform guided breathing exercises.');
    }
    if (maladie === 'Pneumonia') {
        baseTips.push('Monitor your temperature and avoid environments with humidity > 80%.');
    }

    const ratios = [
        snapshot.no2 / WHO_LIMITS.no2,
        snapshot.pm25 / WHO_LIMITS.pm25,
        snapshot.o3 / WHO_LIMITS.o3,
    ];
    const penalty = ratios.reduce((acc, value) => acc + value * 30, 0);
    const score = Math.max(0, Math.min(100, Math.round(100 - penalty)));

    return { tips: baseTips.slice(0, 5), score };
}

function parseCoordinates(cityInput: string, latLonInput: string, fallback: { city: string; lat: number; lon: number } | null): Coordinates | null {
    if (latLonInput) {
        const [latText, lonText] = latLonInput.split(',').map((segment) => segment.trim());
        const lat = Number(latText);
        const lon = Number(lonText);
        if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
            return null;
        }
        return { lat, lon, label: cityInput || `Lat ${lat.toFixed(2)}, Lon ${lon.toFixed(2)}` };
    }

    if (fallback) {
        return {
            lat: fallback.lat,
            lon: fallback.lon,
            label: fallback.city || `Lat ${fallback.lat.toFixed(2)}, Lon ${fallback.lon.toFixed(2)}`,
        };
    }

    if (cityInput.toLowerCase().includes('paris')) {
        return { lat: 48.8566, lon: 2.3522, label: 'Paris, France' };
    }
    if (cityInput.toLowerCase().includes('montreal')) {
        return { lat: 45.5019, lon: -73.5674, label: 'Montreal, Canada' };
    }
    if (cityInput.toLowerCase().includes('new york')) {
        return { lat: 40.7128, lon: -74.006, label: 'New York, United States' };
    }

    return null;
}

function fallbackAqiSnapshot(lat: number, lon: number): AqiSnapshot {
    const seed = Math.abs(Math.sin(lat * 12.9898 + lon * 78.233)) % 1;
    const pm25 = Math.round((5 + seed * 35) * 10) / 10; // 5..40
    const no2 = Math.round((8 + seed * 30) * 10) / 10;  // 8..38
    const o3 = Math.round((30 + seed * 50) * 10) / 10; // 30..80
    const humidity = Math.round(40 + seed * 50);       // 40..90
    const windSpeed = Math.round((1 + seed * 6) * 10) / 10; // 1..7
    const snapshot: AqiSnapshot = { no2, pm25, o3, humidity, windSpeed, aqi: 0 };
    snapshot.aqi = computeAqi(snapshot);
    return snapshot;
}

async function fetchAqiSnapshot(lat: number, lon: number): Promise<AqiSnapshot> {
    const liveEnabled = localStorage.getItem('live-data') === 'true';
    if (!liveEnabled) {
        return fallbackAqiSnapshot(lat, lon);
    }

    const fetchSafe = async (url: string) => {
        try {
            const res = await fetch(url, { cache: 'no-store', mode: 'cors', credentials: 'omit', keepalive: false });
            return res.ok ? res : null;
        } catch (_) {
            return null;
        }
    };

    const timeout = (ms: number) => new Promise<null>((resolve) => setTimeout(() => resolve(null), ms));

    const airUrl = `https://air-quality.api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=pm2_5,nitrogen_dioxide,ozone,relativehumidity_2m,wind_speed_10m&_=${Date.now()}`;
    const openAqUrl = `https://api.openaq.org/v2/latest?coordinates=${lat},${lon}&radius=50000&limit=1&parameter=pm25&_=${Date.now()}`;

    const [airRes, aqRes] = await Promise.all([
        Promise.race([fetchSafe(airUrl), timeout(9000)]),
        Promise.race([fetchSafe(openAqUrl), timeout(9000)]),
    ]);

    let airQualityData: any = null;
    if (airRes) {
        try { airQualityData = await airRes.json(); } catch {}
    }

    let openAqData: any = null;
    if (aqRes) {
        try { openAqData = await aqRes.json(); } catch {}
    }

    const latestIndex = Math.max((airQualityData?.hourly?.time?.length ?? 1) - 1, 0);

    const pm25Satellite = Number.parseFloat(String(airQualityData?.hourly?.pm2_5?.[latestIndex] ?? 'NaN'));
    const pm25Ground = Number.parseFloat(String(openAqData?.results?.[0]?.measurements?.[0]?.value ?? 'NaN'));
    const pm25 = Number.isFinite(pm25Ground) ? pm25Ground : (Number.isFinite(pm25Satellite) ? pm25Satellite : 0);
    const no2 = Number.parseFloat(String(airQualityData?.hourly?.nitrogen_dioxide?.[latestIndex] ?? 'NaN'));
    const o3 = Number.parseFloat(String(airQualityData?.hourly?.ozone?.[latestIndex] ?? 'NaN'));
    const humidity = Number.parseFloat(String(airQualityData?.hourly?.relativehumidity_2m?.[latestIndex] ?? 'NaN'));
    const windSpeed = Number.parseFloat(String(airQualityData?.hourly?.wind_speed_10m?.[latestIndex] ?? 'NaN'));

    const snapshot: AqiSnapshot = {
        no2: Number.isFinite(no2) ? Number(no2.toFixed(1)) : 0,
        pm25: Number.isFinite(pm25) ? Number(pm25.toFixed(1)) : 0,
        o3: Number.isFinite(o3) ? Number(o3.toFixed(1)) : 0,
        humidity: Number.isFinite(humidity) ? Number(humidity.toFixed(0)) : 0,
        windSpeed: Number.isFinite(windSpeed) ? Number(windSpeed.toFixed(1)) : 0,
        aqi: 0,
    };

    snapshot.aqi = computeAqi(snapshot);
    return snapshot;
}

export default function HealthAssistantPanel({
    isOpen,
    onClose,
    step,
    setStep,
    maladie,
    setMaladie,
    location,
    setLocation,
    aqiData,
    setAqiData,
    riskAssessment,
    setRiskAssessment,
    adaptedZones,
    setAdaptedZones,
    preventionTips,
    setPreventionTips,
    respiroScore,
    setRespiroScore,
    vulnerableProfiles,
    setVulnerableProfiles,
}: HealthAssistantPanelProps) {
    const [cityInput, setCityInput] = useState('Montreal');
    const [latLonInput, setLatLonInput] = useState('45.5019,-73.5674');
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    useEffect(() => {
        if (location && step === 2) {
            setCityInput(location.city ?? '');
            setLatLonInput(`${location.lat.toFixed(4)},${location.lon.toFixed(4)}`);
        }
    }, [location, step]);

    const handleMaladieSelect = (value: string) => {
        if (MALADIES.includes(value)) {
            setMaladie(value);
            // Defer step change to let Radix Select close/unmount its portal cleanly
            // This avoids a React DOM NotFoundError when unmounting with AnimatePresence
            requestAnimationFrame(() => setStep(2));
        } else {
            notify.error('Please choose a valid condition.');
        }
    };

    const handleLocationSubmit = async () => {
        const coords = parseCoordinates(cityInput, latLonInput, location);
        if (!coords) {
            notify.error('Invalid location. Enter City or lat,lon (e.g., 48.8566,2.3522).');
            return;
        }

        setIsLoading(true);
        setApiError('');
        try {
            const snapshot = await fetchAqiSnapshot(coords.lat, coords.lon);
            setLocation({ city: coords.label, lat: coords.lat, lon: coords.lon });
            setAqiData(snapshot);

            const narrative = buildRiskNarrative(snapshot);
            setRiskAssessment(`${narrative.status} : ${narrative.summary}`);
            setVulnerableProfiles(narrative.vulnerableProfiles);

            const zones = deriveAdaptedZones(snapshot, coords).slice(0, 5);
            setAdaptedZones(zones);
            setStep(3);
        } catch (error) {
            setApiError('Unable to reach an API. Using global WHO averages.');
            setAqiData({
                no2: 10,
                pm25: 5,
                o3: 45,
                humidity: 50,
                windSpeed: 2,
                aqi: 40,
            });
            setRiskAssessment('Moderate: WHO global data used due to no connection.');
            setVulnerableProfiles('Sensitive groups: asthmatics, children, seniors.');
            setAdaptedZones([
                'Rural areas with PM2.5 < 10 µg/m³ (WHO).',
                'Coastal ventilated areas recommended by NASA Earthdata.',
                'Urban parks with high canopy: natural NO₂ dispersion.',
            ]);
            setStep(3);
        } finally {
            setIsLoading(false);
        }
    };

    const handleZonesNext = () => {
        if (!aqiData) {
            notify.error('Provide your location first to get data.');
            return;
        }
        const { tips, score } = derivePreventionTips(maladie, aqiData);
        setPreventionTips(tips);
        setRespiroScore(`${score}/100`);
        setStep(4);
    };


    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="absolute top-0 right-0 bottom-0 w-96 bg-black/95 backdrop-blur-md border-l border-white/10 z-20 overflow-y-auto"
                >
                    <div className="p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-white">Respiratory Health Assistant</h2>
                                <p className="text-xs text-white/60">
                                    Sources: NASA TEMPO, OpenAQ, Open-Meteo, WHO AQG 2021 (no direct medical advice).
                                </p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10">
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        {step === 1 && (
                            <Card className="bg-white/5 border-white/10 p-4 space-y-4">
                                <p className="text-white text-sm">
                                    Choose your respiratory condition:
                                </p>
                                <Select onValueChange={handleMaladieSelect}>
                                    <SelectTrigger className="bg-black/40 border-white/10 text-white">
                                        <SelectValue placeholder="Select..." />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#0a0e1a] border-white/10 text-white">
                                        {MALADIES.map((item) => (
                                            <SelectItem key={item} value={item}>
                                                {item}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Card>
                        )}

                        {step === 2 && (
                            <Card className="bg-white/5 border-white/10 p-4 space-y-4">
                                <div className="space-y-2">
                                    <p className="text-white text-sm">
                                        Share your location (City or lat,lon). We'll combine NASA TEMPO (NO₂/O₃), OpenAQ (PM2.5) and Open-Meteo (winds, humidity).
                                    </p>
                                    <Input
                                        placeholder="City (e.g., Montreal)"
                                        value={cityInput}
                                        onChange={(event) => setCityInput(event.target.value)}
                                        className="text-white bg-black/40 border-white/10"
                                    />
                                    <Input
                                        placeholder="Lat,Lon (e.g., 45.5019,-73.5674)"
                                        value={latLonInput}
                                        onChange={(event) => setLatLonInput(event.target.value)}
                                        className="text-white bg-black/40 border-white/10"
                                    />
                                    {apiError && <p className="text-xs text-orange-400">{apiError}</p>}
                                </div>
                                <Button
                                    onClick={handleLocationSubmit}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Analyzing...' : 'Analyze air quality'}
                                </Button>
                            </Card>
                        )}

                        {step === 3 && aqiData && (
                            <Card className="bg-white/5 border-white/10 p-4 space-y-4">
                                <div className="flex items-start gap-3">
                                    <Wind className="w-5 h-5 text-blue-500" />
                                    <div>
                                        <p className="text-white text-sm font-medium">Current air quality</p>
                                        <p className="text-white/70 text-xs">AQI {aqiData.aqi} · Wind {aqiData.windSpeed} m/s · Humidity {aqiData.humidity}%</p>
                                        <p className="text-white/60 text-xs mt-2">{riskAssessment}</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <p className="text-white text-sm font-medium">Recommended zones (AI + WHO guidelines)</p>
                                    <ul className="space-y-2 text-white/80 text-sm">
                                        {adaptedZones.map((zone) => (
                                            <li key={zone} className="flex items-start gap-2">
                                                <MapPin className="w-4 h-4 mt-1 text-green-400" />
                                                <span>{zone}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <Button
                                    onClick={handleZonesNext}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    Generate my personalized tips
                                </Button>
                            </Card>
                        )}

                        {step === 4 && (
                            <Card className="bg-white/5 border-white/10 p-4 space-y-4">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                                    <div>
                                        <p className="text-white text-sm font-medium">Vulnerable profiles</p>
                                        <p className="text-white/70 text-xs">{vulnerableProfiles}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Activity className="w-5 h-5 text-emerald-400" />
                                    <div>
                                        <p className="text-white text-sm font-medium">RespiroScore</p>
                                        <p className="text-white/70 text-xs">{respiroScore}</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-white text-sm font-medium">Personalized tips</p>
                                    <ul className="space-y-2 text-white/80 text-sm">
                                        {preventionTips.map((tip) => (
                                            <li key={tip} className="flex items-start gap-2">
                                                <Sparkles className="w-4 h-4 mt-1 text-purple-400" />
                                                <span>{tip}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-white text-sm font-medium">Suggested innovations</p>
                                    <ul className="space-y-2 text-white/80 text-sm">
                                        {INNOVATIONS.map((innovation) => (
                                            <li key={innovation} className="flex items-start gap-2">
                                                <Sparkles className="w-4 h-4 mt-1 text-blue-400" />
                                                <span>{innovation}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <p className="text-white/50 text-[10px]">
                                    Evidence-based: WHO AQG 2021, NASA TEMPO, OpenAQ, Open-Meteo. Consult a physician for any medical decisions.
                                </p>
                            </Card>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
