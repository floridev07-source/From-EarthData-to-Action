import { Map, Bell, BarChart3, Heart, LayoutGrid, FileText, Stethoscope } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface HUDProps {
    onNavigate: (screen: string) => void;
    activeAlerts: number;
    openAssistant: () => void;
}

export default function HUD({ onNavigate, activeAlerts, openAssistant }: HUDProps) {
    return (
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-[#0a0e1a] border-t border-gray-200/10">
            <div className="flex items-center justify-between px-6 py-4">
                {/* Mini Map */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => onNavigate('map')}
                        className="relative w-32 h-20 bg-green-600/20 border border-green-600/30 rounded-lg overflow-hidden hover:bg-green-600/30 transition-all"
                    >
                        <Map className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-gray-200/60" />
                    </button>
                    <div>
                        <p className="text-gray-200 text-sm">Mini Map</p>
                        <p className="text-gray-200/60 text-xs">2D view</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 flex-wrap">
                    <Button
                        variant="outline"
                        onClick={() => onNavigate('dashboard')}
                        className="bg-white/10 border-white/20 text-gray-200 hover:bg-white/20"
                    >
                        <LayoutGrid className="w-4 h-4 mr-2" />
                        Dashboard
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => onNavigate('prevision24h')}
                        className="bg-orange-600/20 border-orange-600/30 text-gray-200 hover:bg-orange-600/30"
                    >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        24h Forecast
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => onNavigate('rapport')}
                        className="bg-white/10 border-white/20 text-gray-200 hover:bg-white/20"
                    >
                        <FileText className="w-4 h-4 mr-2" />
                        Report
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => onNavigate('analyse')}
                        className="bg-white/10 border-white/20 text-gray-200 hover:bg-white/20"
                    >
                        <Stethoscope className="w-4 h-4 mr-2" />
                        Health Analysis
                    </Button>
                    <Button
                        variant="outline"
                        onClick={openAssistant}
                        className="bg-green-600/20 border-green-600/30 text-gray-200 hover:bg-green-600/30"
                    >
                        <Heart className="w-4 h-4 mr-2" />
                        Health Assistant
                    </Button>

                </div>

                {/* Alerts */}
                <button
                    onClick={() => onNavigate('alerts')}
                    className="relative flex items-center gap-3 px-4 py-2 bg-red-600/20 border border-red-600/30 rounded-lg hover:bg-red-600/30 transition-all"
                >
                    <Bell className="w-5 h-5 text-gray-200" />
                    <div className="text-left">
                        <p className="text-gray-200 text-sm">Alerts</p>
                        <p className="text-gray-200/60 text-xs">{activeAlerts} active</p>
                    </div>
                    {activeAlerts > 0 && (
                        <Badge className="absolute -top-2 -right-2 bg-red-600 text-gray-200 border-0">
                            {activeAlerts}
                        </Badge>
                    )}
                </button>
            </div>
        </div>
    );
}
