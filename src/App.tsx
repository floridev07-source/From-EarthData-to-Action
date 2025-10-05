import { useState } from 'react';
import Globe3D from './components/Globe3D';
import NavigationBar from './components/NavigationBar';
import SidePanel from './components/SidePanel';
import HUD from './components/HUD';
import AlertsScreen from './components/AlertsScreen';
import PredictionsScreen from './components/PredictionsScreen';
import HealthAssistantPanel from './components/HealthAssistantPanel';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

export default function App() {
    const [selectedLayers, setSelectedLayers] = useState<string[]>(['NO2']);
    const [timeOffset, setTimeOffset] = useState(0);
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
    const [isAssistantOpen, setIsAssistantOpen] = useState(false);
    const [activeScreen, setActiveScreen] = useState<string | null>(null);
    const [locationData, setLocationData] = useState(null);
    const [assistantStep, setAssistantStep] = useState(1);
    const [maladie, setMaladie] = useState(null);
    const [location, setLocation] = useState(null); // {city: string, lat: number, lon: number}
    const [aqiData, setAqiData] = useState(null);
    const [riskAssessment, setRiskAssessment] = useState(null);
    const [adaptedZones, setAdaptedZones] = useState([]);
    const [preventionTips, setPreventionTips] = useState([]);
    const [respiroScore, setRespiroScore] = useState(null);

    const handleLayerToggle = (layer: string) => {
        setSelectedLayers((prev) =>
            prev.includes(layer) ? prev.filter((l) => l !== layer) : [...prev, layer]
        );
        toast.success(`${layer} layer ${selectedLayers.includes(layer) ? 'hidden' : 'visible'}`);
    };

    const handleTimeChange = (value: number) => {
        setTimeOffset(value);
        const dayText = value === 0 ? 'Today' : value > 0 ? `+${value} days` : `${value} days`;
        toast.info(`Time updated: ${dayText}`);
    };

    const handleLocationClick = (data: any) => {
        setLocationData(data);
        setLocation({ city: data.location || 'Unknown', lat: data.lat, lon: data.lon });
        setIsSidePanelOpen(true);
        setIsAssistantOpen(true);
        setAssistantStep(1);
    };

    const handleNavigate = (screen: string) => {
        setActiveScreen(screen);
    };

    const openAssistant = () => {
        setIsAssistantOpen(true);
        setAssistantStep(1);
    };

    return (
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
                onSettingsChange={(settings) => console.log(settings)}
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
    );
}
