import { X, TrendingUp, AlertTriangle, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  locationData: any;
}

export default function SidePanel({ isOpen, onClose, locationData }: SidePanelProps) {
  const mockData = [
    { time: '00:00', NO2: 45, Ozone: 62, PM: 35 },
    { time: '04:00', NO2: 38, Ozone: 58, PM: 28 },
    { time: '08:00', NO2: 72, Ozone: 45, PM: 52 },
    { time: '12:00', NO2: 68, Ozone: 78, PM: 48 },
    { time: '16:00', NO2: 85, Ozone: 92, PM: 65 },
    { time: '20:00', NO2: 58, Ozone: 68, PM: 42 },
  ];
  
  const aqiLevel = 72;
  const aqiCategory = aqiLevel > 100 ? 'Unhealthy' : aqiLevel > 50 ? 'Moderate' : 'Good';
  const aqiColor = aqiLevel > 100 ? 'text-red-400' : aqiLevel > 50 ? 'text-orange-400' : 'text-green-400';
  
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
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-white">Location Details</h2>
                <p className="text-white/60">New York, USA</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            {/* AQI Score */}
            <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-white/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/80">Air Quality Index</span>
                <Badge className={`${aqiColor} bg-white/10`}>{aqiCategory}</Badge>
              </div>
              <div className={`${aqiColor}`}>
                {aqiLevel}
              </div>
              <p className="text-white/60 text-sm mt-2">
                Air quality is acceptable for most people
              </p>
            </Card>
            
            {/* Pollutant Levels */}
            <div className="space-y-3">
              <h3 className="text-white">Pollutant Levels</h3>
              
              <Card className="bg-white/5 border-white/10 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/80">NO₂ (Nitrogen Dioxide)</span>
                  <span className="text-orange-400">45 µg/m³</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-400 to-red-400 h-full" style={{ width: '45%' }} />
                </div>
              </Card>
              
              <Card className="bg-white/5 border-white/10 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/80">O₃ (Ozone)</span>
                  <span className="text-blue-400">62 µg/m³</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-400 to-cyan-400 h-full" style={{ width: '62%' }} />
                </div>
              </Card>
              
              <Card className="bg-white/5 border-white/10 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/80">PM2.5 (Fine Particles)</span>
                  <span className="text-purple-400">35 µg/m³</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-400 to-pink-400 h-full" style={{ width: '35%' }} />
                </div>
              </Card>
            </div>
            
            {/* 24h Trend */}
            <div className="space-y-3">
              <h3 className="text-white">24-Hour Trend</h3>
              <Card className="bg-white/5 border-white/10 p-4">
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={mockData}>
                    <defs>
                      <linearGradient id="colorNO2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#fb923c" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#fb923c" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis dataKey="time" stroke="#ffffff60" />
                    <YAxis stroke="#ffffff60" />
                    <Tooltip
                      contentStyle={{ background: '#1a1a1a', border: '1px solid #ffffff20', borderRadius: '8px' }}
                    />
                    <Area type="monotone" dataKey="NO2" stroke="#fb923c" fillOpacity={1} fill="url(#colorNO2)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </div>
            
            {/* Health Impact */}
            <div className="space-y-3">
              <h3 className="text-white">Health Impact</h3>
              <Card className="bg-white/5 border-white/10 p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-400 mt-1" />
                  <div>
                    <p className="text-white/80">Sensitive Groups</p>
                    <p className="text-white/60 text-sm">
                      Children and elderly should limit outdoor activities
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-blue-400 mt-1" />
                  <div>
                    <p className="text-white/80">General Public</p>
                    <p className="text-white/60 text-sm">
                      Normal activities acceptable
                    </p>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Satellite vs Ground */}
            <div className="space-y-3">
              <h3 className="text-white">Data Sources</h3>
              <Card className="bg-white/5 border-white/10 p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">Satellite (TEMPO)</span>
                    <span className="text-green-400 text-sm">Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">Ground Stations</span>
                    <span className="text-green-400 text-sm">12 sensors</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">Last Update</span>
                    <span className="text-white/60 text-sm">2 min ago</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
