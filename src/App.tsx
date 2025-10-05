import { useState } from 'react';
import Globe3D from './components/Globe3D';
import NavigationBar from './components/NavigationBar';
import SidePanel from './components/SidePanel';
import HUD from './components/HUD';
import AlertsScreen from './components/AlertsScreen';
import PredictionsScreen from './components/PredictionsScreen';
import HealthAssistantPanel from './components/HealthAssistantPanel';
import { Toaster } from './components/ui/sonner';
import notify from './lib/notify';
import { AqiDataProvider } from './context/AqiDataContext';
import Dashboard from './components/pages/Dashboard';
import RapportQuotidien from './components/pages/RapportQuotidien';
import AnalyseSante from './components/pages/AnalyseSante';
import Prevision24h from './components/pages/Prevision24h';

type AssistantLocation = {
    city: string;
    lat: number;
    lon: number;
};

type AqiSnapshot = {
    no2: number;
    pm25: number;
    o3: number;
    humidity: number;
    windSpeed: number;
    aqi: number;
};

type LocationInsight = {
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
    regionInsights?: {
        summary: string;
        diseaseProbabilities: string[];
        keyHighlights: string[];
        sources: string[];
    };
};

export default function App() {
    const [selectedLayers, setSelectedLayers] = useState<string[]>(['NO2']);
    const [timeOffset, setTimeOffset] = useState<number>(0);
    const [isSidePanelOpen, setIsSidePanelOpen] = useState<boolean>(true);
    const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
    const [activeScreen, setActiveScreen] = useState<string | null>(null);
    const [locationData, setLocationData] = useState<LocationInsight | null>({
        name: 'Montréal',
        location: 'Montréal, QC, Canada',
        lat: 45.5017,
        lon: -73.5673,
        NO2: 18.5,
        Ozone: 30.2,
        PM: 10.1,
        aqi: 45,
        riskNarrative: 'Bon : niveaux sous les seuils WHO AQG 2021 (valeurs simulées).',
        vulnerableProfiles: 'Population générale : surveillance standard',
        sources: ['NASA TEMPO', 'OpenAQ'],
        region: 'north-america',
    });
    const [assistantStep, setAssistantStep] = useState<number>(1);
    const [maladie, setMaladie] = useState<string | null>(null);
    const [location, setLocation] = useState<AssistantLocation | null>(null);
    const [aqiData, setAqiData] = useState<AqiSnapshot | null>(null);
    const [riskAssessment, setRiskAssessment] = useState<string | null>(null);
    const [adaptedZones, setAdaptedZones] = useState<string[]>([]);
    const [preventionTips, setPreventionTips] = useState<string[]>([]);
    const [respiroScore, setRespiroScore] = useState<string | null>(null);
    const [vulnerableProfiles, setVulnerableProfiles] = useState<string>('');

    const handleLayerToggle = (layer: string) => {
        setSelectedLayers((prev) =>
            prev.includes(layer) ? prev.filter((l) => l !== layer) : [...prev, layer]
        );
        notify.success(`${layer} layer ${selectedLayers.includes(layer) ? 'hidden' : 'visible'}`);
    };

    const handleTimeChange = (value: number) => {
        setTimeOffset(value);
        const dayText = value === 0 ? 'Today' : value > 0 ? `+${value} days` : `${value} days`;
        notify.info(`Time updated: ${dayText}`);
    };

    const handleLocationClick = (data: LocationInsight) => {
        setLocationData(data);
        setLocation({
            city: data.location ?? data.name ?? 'Unknown',
            lat: data.lat,
            lon: data.lon,
        });
        if (data.vulnerableProfiles) {
            setVulnerableProfiles(data.vulnerableProfiles);
        } else {
            setVulnerableProfiles('Population générale : surveillance standard');
        }
        setIsSidePanelOpen(true);
        // N���ouvre plus l’Assistant Santé automatiquement sur clic globe
    };

    const handleNavigate = (screen: string) => {
        setActiveScreen(screen);
    };

    const openAssistant = () => {
        setIsAssistantOpen(true);
        setAssistantStep(1);
    };

    return (
        <AqiDataProvider>
        <div className="size-full relative bg-gradient-to-b from-[#0a0e1a] to-[#1a1f35] overflow-hidden">
            {/* Main Globe View */}
            <div className="h-[100vh]">
                <Globe3D
                    selectedLayer={selectedLayers}
                    timeOffset={timeOffset}
                    onLocationClick={handleLocationClick}
                />
            </div>

            {/* Navigation Bar */}
            <NavigationBar
                selectedLayers={selectedLayers}
                onLayerToggle={handleLayerToggle}
                timeOffset={timeOffset}
                onTimeChange={handleTimeChange}
            />

            {/* Side Panel */}
            <SidePanel
                isOpen={isSidePanelOpen}
                onClose={() => setIsSidePanelOpen(false)}
                locationData={locationData}
            />

            {/* Health Assistant Panel */}
            <HealthAssistantPanel
                isOpen={isAssistantOpen}
                onClose={() => setIsAssistantOpen(false)}
                step={assistantStep}
                setStep={setAssistantStep}
                maladie={maladie}
                setMaladie={setMaladie}
                location={location}
                setLocation={setLocation}
                aqiData={aqiData}
                setAqiData={setAqiData}
                riskAssessment={riskAssessment}
                setRiskAssessment={setRiskAssessment}
                adaptedZones={adaptedZones}
                setAdaptedZones={setAdaptedZones}
                preventionTips={preventionTips}
                setPreventionTips={setPreventionTips}
                respiroScore={respiroScore}
                setRespiroScore={setRespiroScore}
                vulnerableProfiles={vulnerableProfiles}
                setVulnerableProfiles={setVulnerableProfiles}
            />

            {/* HUD */}
            <HUD onNavigate={handleNavigate} activeAlerts={4} openAssistant={openAssistant} />

            {/* Overlay Screens */}
            {activeScreen === 'alerts' && (
                <AlertsScreen onClose={() => setActiveScreen(null)} />
            )}
            {activeScreen === 'predictions' && (
                <PredictionsScreen onClose={() => setActiveScreen(null)} />
            )}
            {activeScreen === 'dashboard' && (
                <Dashboard onClose={() => setActiveScreen(null)} />
            )}
            {activeScreen === 'rapport' && (
                <RapportQuotidien onClose={() => setActiveScreen(null)} />
            )}
            {activeScreen === 'analyse' && (
                <AnalyseSante onClose={() => setActiveScreen(null)} />
            )}
            {activeScreen === 'prevision24h' && (
                <Prevision24h onClose={() => setActiveScreen(null)} />
            )}

            {/* Toast Notifications */}
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: '#1a1a1a',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#ffffff',
                    },
                }}
            />

            {/* Floating Info Panel */}
            {!isSidePanelOpen && !activeScreen && !isAssistantOpen && (
                <div className="absolute top-24 left-6 bg-black/60 backdrop-blur-md border border-white/20 rounded-lg p-4 max-w-xs z-10">
                    <h3 className="text-white mb-2">Bienvenue sur AirVista</h3>
                    <p className="text-white/60 text-sm mb-3">
                        Surveillez la qualité de l'air en temps réel avec les données des satellites TEMPO de la NASA et des stations au sol.
                    </p>
                    <ul className="text-white/60 text-sm space-y-1">
                        <li>• Activez/désactivez les couches de polluants</li>
                        <li>• Utilisez le slider temporel pour les prévisions</li>
                        <li>• Cliquez sur le globe pour des détails</li>
                        <li>• Utilisez l'Assistant Santé pour des conseils personnalisés</li>
                    </ul>
                </div>
            )}
        </div>
        </AqiDataProvider>
    );
}
