import { useEffect, useState } from 'react';
import { Wind, Cloud, Droplets, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

interface NavigationBarProps {
    selectedLayers: string[];
    onLayerToggle: (layer: string) => void;
    timeOffset: number;
    onTimeChange: (value: number) => void;
}

export default function NavigationBar({
                                          selectedLayers,
                                          onLayerToggle,
                                          timeOffset,
                                          onTimeChange,
                                      }: NavigationBarProps) {
    const [darkMode, setDarkMode] = useState<boolean>(false);
    const [notifications, setNotifications] = useState<boolean>(true);
    const [highContrast, setHighContrast] = useState<boolean>(false);
    const [liveData, setLiveData] = useState<boolean>(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const savedNotif = localStorage.getItem('notifications');
        const savedHC = localStorage.getItem('high-contrast');
        const savedLive = localStorage.getItem('live-data');
        const isDark = savedTheme ? savedTheme === 'dark' : document.documentElement.classList.contains('dark');
        setDarkMode(isDark);
        setNotifications(savedNotif ? savedNotif === 'true' : true);
        setHighContrast(savedHC ? savedHC === 'true' : false);
        setLiveData(savedLive ? savedLive === 'true' : false);
        // Apply current classes on mount
        document.documentElement.classList.toggle('dark', isDark);
        document.documentElement.classList.toggle('high-contrast', savedHC === 'true');
    }, []);

    const applyDark = (enabled: boolean) => {
        setDarkMode(enabled);
        document.documentElement.classList.toggle('dark', enabled);
        localStorage.setItem('theme', enabled ? 'dark' : 'light');
    };

    const applyNotifications = (enabled: boolean) => {
        setNotifications(enabled);
        localStorage.setItem('notifications', String(enabled));
        window.dispatchEvent(new CustomEvent('app:notifications', { detail: { enabled } }));
    };

    const applyHighContrast = (enabled: boolean) => {
        setHighContrast(enabled);
        document.documentElement.classList.toggle('high-contrast', enabled);
        localStorage.setItem('high-contrast', String(enabled));
    };

    const applyLiveData = (enabled: boolean) => {
        setLiveData(enabled);
        localStorage.setItem('live-data', String(enabled));
        window.dispatchEvent(new CustomEvent('app:live-data', { detail: { enabled } }));
    };

    const layers = [
        { id: 'NO2', label: 'NO₂', icon: Wind, color: 'text-orange-400' },
        { id: 'Ozone', label: 'Ozone', icon: Cloud, color: 'text-blue-400' },
        { id: 'PM', label: 'PM2.5', icon: Droplets, color: 'text-purple-400' },
    ];

    return (
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm border-b border-white/10">
            <div className="flex items-center justify-between px-6 py-4">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                        <Wind className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-white">AirVista</h1>
                        <p className="text-xs text-white/60">Surveillance Mondiale de la Qualité de l'Air</p>
                    </div>
                </div>

                {/* Layer Toggles */}
                <div className="flex items-center gap-6">
                    {layers.map((layer) => {
                        const Icon = layer.icon;
                        const isActive = selectedLayers.includes(layer.id);
                        return (
                            <button
                                key={layer.id}
                                onClick={() => onLayerToggle(layer.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                                    isActive
                                        ? 'bg-white/20 border border-white/30'
                                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                                }`}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? layer.color : 'text-white/40'}`} />
                                <span className={isActive ? 'text-white' : 'text-white/60'}>{layer.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Time Slider */}
                <div className="flex items-center gap-4 w-64">
                    <span className="text-white/60 text-sm">J{timeOffset > 0 ? '+' : ''}{timeOffset}</span>
                    <Slider
                        value={[timeOffset]}
                        onValueChange={(value) => onTimeChange(value[0])}
                        min={-7}
                        max={7}
                        step={1}
                        className="flex-1"
                    />
                </div>

                {/* Settings */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                            <Settings className="w-5 h-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="bg-black/95 border-white/10 text-white">
                        <SheetHeader>
                            <SheetTitle className="text-white">Paramètres</SheetTitle>
                        </SheetHeader>
                        <div className="space-y-6 mt-6">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="dark-mode">Mode Sombre</Label>
                                <Switch id="dark-mode" checked={darkMode} onCheckedChange={applyDark} />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="notifications">Notifications</Label>
                                <Switch id="notifications" checked={notifications} onCheckedChange={applyNotifications} />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="high-contrast">Contraste Élevé</Label>
                                <Switch id="high-contrast" checked={highContrast} onCheckedChange={applyHighContrast} />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="live-data">Données en direct</Label>
                                <Switch id="live-data" checked={liveData} onCheckedChange={applyLiveData} />
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
}
