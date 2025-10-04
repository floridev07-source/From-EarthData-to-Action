import { X, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { motion } from 'motion/react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PredictionsScreenProps {
  onClose: () => void;
}

export default function PredictionsScreen({ onClose }: PredictionsScreenProps) {
  const forecastData = [
    { day: 'Mon', NO2: 45, Ozone: 62, PM: 35, predicted: false },
    { day: 'Tue', NO2: 52, Ozone: 58, PM: 42, predicted: false },
    { day: 'Wed', NO2: 48, Ozone: 65, PM: 38, predicted: false },
    { day: 'Thu', NO2: 55, Ozone: 72, PM: 45, predicted: true },
    { day: 'Fri', NO2: 62, Ozone: 78, PM: 52, predicted: true },
    { day: 'Sat', NO2: 58, Ozone: 68, PM: 48, predicted: true },
    { day: 'Sun', NO2: 45, Ozone: 55, PM: 35, predicted: true },
  ];
  
  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    AQI: 40 + Math.random() * 60 + Math.sin(i / 4) * 20,
  }));
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-30 bg-black/95 backdrop-blur-md"
    >
      <div className="h-full overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-white mb-2">Air Quality Predictions</h1>
              <p className="text-white/60">7-day forecast powered by AI and satellite data</p>
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
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30 p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/80">Tomorrow's AQI</span>
                <TrendingDown className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-green-400 mb-2">48</div>
              <p className="text-white/60 text-sm">Good - Improving</p>
            </Card>
            
            <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/30 p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/80">Peak This Week</span>
                <TrendingUp className="w-5 h-5 text-orange-400" />
              </div>
              <div className="text-orange-400 mb-2">78</div>
              <p className="text-white/60 text-sm">Friday afternoon</p>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30 p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/80">Best Day</span>
                <Calendar className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-blue-400 mb-2">Sunday</div>
              <p className="text-white/60 text-sm">AQI 35 - Excellent</p>
            </Card>
          </div>
          
          {/* 7-Day Forecast */}
          <Card className="bg-white/5 border-white/10 p-6 mb-8">
            <h2 className="text-white mb-6">7-Day Pollutant Forecast</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="day" stroke="#ffffff60" />
                <YAxis stroke="#ffffff60" />
                <Tooltip
                  contentStyle={{ 
                    background: '#1a1a1a', 
                    border: '1px solid #ffffff20', 
                    borderRadius: '8px' 
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="NO2" 
                  stroke="#fb923c" 
                  strokeWidth={2}
                  dot={{ fill: '#fb923c', strokeWidth: 2 }}
                  strokeDasharray={(entry) => entry.predicted ? '5 5' : '0'}
                />
                <Line 
                  type="monotone" 
                  dataKey="Ozone" 
                  stroke="#60a5fa" 
                  strokeWidth={2}
                  dot={{ fill: '#60a5fa', strokeWidth: 2 }}
                  strokeDasharray={(entry) => entry.predicted ? '5 5' : '0'}
                />
                <Line 
                  type="monotone" 
                  dataKey="PM" 
                  stroke="#c084fc" 
                  strokeWidth={2}
                  dot={{ fill: '#c084fc', strokeWidth: 2 }}
                  strokeDasharray={(entry) => entry.predicted ? '5 5' : '0'}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-6 mt-4 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-white/60" />
                <span className="text-white/60 text-sm">Historical</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 border-t-2 border-dashed border-white/60" />
                <span className="text-white/60 text-sm">Predicted</span>
              </div>
            </div>
          </Card>
          
          {/* 24-Hour AQI Prediction */}
          <Card className="bg-white/5 border-white/10 p-6">
            <h2 className="text-white mb-6">24-Hour AQI Prediction</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={hourlyData}>
                <defs>
                  <linearGradient id="colorAQI" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="hour" stroke="#ffffff60" />
                <YAxis stroke="#ffffff60" />
                <Tooltip
                  contentStyle={{ 
                    background: '#1a1a1a', 
                    border: '1px solid #ffffff20', 
                    borderRadius: '8px' 
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="AQI" 
                  stroke="#22c55e" 
                  fillOpacity={1} 
                  fill="url(#colorAQI)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
          
          {/* AI Insights */}
          <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30 p-6 mt-8">
            <h3 className="text-white mb-4">AI Insights</h3>
            <ul className="space-y-3 text-white/80">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-400 mt-2" />
                <span>Weather patterns suggest decreased pollution levels this weekend due to incoming rain system</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-400 mt-2" />
                <span>Friday afternoon shows elevated ozone levels - recommend limiting outdoor activities 2-6 PM</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-400 mt-2" />
                <span>Long-term trend shows 15% improvement in NO₂ levels compared to last month</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
