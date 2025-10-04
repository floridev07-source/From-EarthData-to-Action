import { X, AlertTriangle, Info, Users, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import OctobreRoseBanner from './OctobreRoseBanner';

interface Alert {
  id: string;
  level: 'high' | 'medium' | 'low';
  title: string;
  location: string;
  pollutant: string;
  value: number;
  affectedPopulation: string;
  time: string;
}

interface AlertsScreenProps {
  onClose: () => void;
}

export default function AlertsScreen({ onClose }: AlertsScreenProps) {
  const alerts: Alert[] = [
    {
      id: '1',
      level: 'high',
      title: 'High PM2.5 Levels',
      location: 'Delhi, India',
      pollutant: 'PM2.5',
      value: 185,
      affectedPopulation: '2.3M people',
      time: '15 min ago',
    },
    {
      id: '2',
      level: 'high',
      title: 'Ozone Alert',
      location: 'Los Angeles, USA',
      pollutant: 'O₃',
      value: 142,
      affectedPopulation: '580K people',
      time: '1 hour ago',
    },
    {
      id: '3',
      level: 'medium',
      title: 'Elevated NO₂',
      location: 'London, UK',
      pollutant: 'NO₂',
      value: 95,
      affectedPopulation: '1.1M people',
      time: '2 hours ago',
    },
    {
      id: '4',
      level: 'medium',
      title: 'Air Quality Advisory',
      location: 'Beijing, China',
      pollutant: 'PM2.5',
      value: 115,
      affectedPopulation: '3.5M people',
      time: '3 hours ago',
    },
  ];
  
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'text-red-400 bg-red-500/20 border-red-500/50';
      case 'medium':
        return 'text-orange-400 bg-orange-500/20 border-orange-500/50';
      default:
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50';
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-30 bg-black/95 backdrop-blur-md"
    >
      <div className="h-full overflow-y-auto">
        <div className="max-w-6xl mx-auto p-4 sm:p-8 relative">
          {/* Octobre Rose Banner */}
          <OctobreRoseBanner />
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8 mt-4 sm:mt-0">
            <div>
              <h1 className="text-white mb-2">Active Alerts</h1>
              <p className="text-white/60">Real-time air quality warnings and notifications</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/10"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
          
          {/* Statistics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <Card className="bg-red-500/10 border-red-500/30 p-4">
              <AlertTriangle className="w-8 h-8 text-red-400 mb-2" />
              <div className="text-white mb-1">2</div>
              <p className="text-white/60 text-sm">Critical</p>
            </Card>
            <Card className="bg-orange-500/10 border-orange-500/30 p-4">
              <Info className="w-8 h-8 text-orange-400 mb-2" />
              <div className="text-white mb-1">2</div>
              <p className="text-white/60 text-sm">Moderate</p>
            </Card>
            <Card className="bg-blue-500/10 border-blue-500/30 p-4">
              <Users className="w-8 h-8 text-blue-400 mb-2" />
              <div className="text-white mb-1">7.5M</div>
              <p className="text-white/60 text-sm">People Affected</p>
            </Card>
            <Card className="bg-purple-500/10 border-purple-500/30 p-4">
              <MapPin className="w-8 h-8 text-purple-400 mb-2" />
              <div className="text-white mb-1">4</div>
              <p className="text-white/60 text-sm">Locations</p>
            </Card>
          </div>
          
          {/* Alerts List */}
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`${getLevelColor(alert.level)} p-6`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <AlertTriangle className="w-5 h-5" />
                        <h3 className="text-white">{alert.title}</h3>
                        <Badge className="bg-white/20 text-white border-0">
                          {alert.level.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-white/60 text-sm mb-1">Location</p>
                          <p className="text-white">{alert.location}</p>
                        </div>
                        <div>
                          <p className="text-white/60 text-sm mb-1">Pollutant</p>
                          <p className="text-white">{alert.pollutant}: {alert.value} µg/m³</p>
                        </div>
                        <div>
                          <p className="text-white/60 text-sm mb-1">Affected Population</p>
                          <p className="text-white">{alert.affectedPopulation}</p>
                        </div>
                        <div>
                          <p className="text-white/60 text-sm mb-1">Time</p>
                          <p className="text-white">{alert.time}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          className="bg-white/20 text-white hover:bg-white/30 border-0"
                        >
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/30 text-white hover:bg-white/10"
                        >
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
