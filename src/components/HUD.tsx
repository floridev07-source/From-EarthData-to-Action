import { Map, GitCompare, Bell, Download, Trophy, BarChart3 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface HUDProps {
  onNavigate: (screen: string) => void;
  activeAlerts: number;
}

export default function HUD({ onNavigate, activeAlerts }: HUDProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent backdrop-blur-sm border-t border-white/10">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Mini Map */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('map')}
            className="relative w-32 h-20 bg-white/10 border border-white/20 rounded-lg overflow-hidden hover:bg-white/20 transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 to-blue-500/30" />
            <Map className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-white/60" />
          </button>
          <div>
            <p className="text-white text-sm">Mini Map</p>
            <p className="text-white/60 text-xs">2D Overview</p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => onNavigate('compare')}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <GitCompare className="w-4 h-4 mr-2" />
            Compare
          </Button>
          
          <Button
            variant="outline"
            onClick={() => onNavigate('predictions')}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Predictions
          </Button>
          
          <Button
            variant="outline"
            onClick={() => onNavigate('gamified')}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Trophy className="w-4 h-4 mr-2" />
            Challenges
          </Button>
          
          <Button
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
        
        {/* Alerts */}
        <button
          onClick={() => onNavigate('alerts')}
          className="relative flex items-center gap-3 px-4 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-all"
        >
          <Bell className="w-5 h-5 text-white" />
          <div className="text-left">
            <p className="text-white text-sm">Alerts</p>
            <p className="text-white/60 text-xs">{activeAlerts} active</p>
          </div>
          {activeAlerts > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white border-0">
              {activeAlerts}
            </Badge>
          )}
        </button>
      </div>
    </div>
  );
}
