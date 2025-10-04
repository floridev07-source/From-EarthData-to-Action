import { useState } from 'react';
import Globe3D from './components/Globe3D';
import NavigationBar from './components/NavigationBar';
import SidePanel from './components/SidePanel';
import HUD from './components/HUD';
import AlertsScreen from './components/AlertsScreen';
import PredictionsScreen from './components/PredictionsScreen';
import GamifiedScreen from './components/GamifiedScreen';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

export default function App() {
    const [selectedLayers, setSelectedLayers] = useState<string[]>(['NO2']);
    const [timeOffset, setTimeOffset] = useState(0);
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
    const [activeScreen, setActiveScreen] = useState<string | null>(null);
    const [locationData, setLocationData] = useState(null);

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
        setIsSidePanelOpen(true);
    };

    const handleNavigate = (screen: string) => {
        setActiveScreen(screen);
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

            {/* HUD */}
            <HUD onNavigate={handleNavigate} activeAlerts={4} />

            {/* Overlay Screens */}
            {activeScreen === 'alerts' && (
                <AlertsScreen onClose={() => setActiveScreen(null)} />
            )}
            {activeScreen === 'predictions' && (
                <PredictionsScreen onClose={() => setActiveScreen(null)} />
            )}
            {activeScreen === 'gamified' && (
                <GamifiedScreen onClose={() => setActiveScreen(null)} />
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
            {!isSidePanelOpen && !activeScreen && (
                <div className="absolute top-24 left-6 bg-black/60 backdrop-blur-md border border-white/20 rounded-lg p-4 max-w-xs z-10">
                    <h3 className="text-white mb-2">Welcome to AirVision</h3>
                    <p className="text-white/60 text-sm mb-3">
                        Monitor real-time air quality data from NASA's TEMPO satellite and ground stations worldwide.
                    </p>
                    <ul className="text-white/60 text-sm space-y-1">
                        <li>• Toggle pollution layers</li>
                        <li>• Use time slider for forecasts</li>
                        <li>• Click globe for location details</li>
                        <li>• Complete challenges to learn</li>
                    </ul>
                </div>
            )}
        </div>
    );
}
