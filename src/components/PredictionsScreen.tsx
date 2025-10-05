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
        { day: 'Jour 1', NO2: 45, Ozone: 62, PM: 35, predicted: false },
        { day: 'Jour 2', NO2: 52, Ozone: 58, PM: 42, predicted: false },
        { day: 'Jour 3', NO2: 48, Ozone: 65, PM: 38, predicted: true },
        { day: 'Jour 4', NO2: 55, Ozone: 72, PM: 45, predicted: true },
        { day: 'Jour 5', NO2: 62, Ozone: 78, PM: 52, predicted: true },
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
                            <h1 className="text-white mb-2">Prévisions de Qualité de l'Air</h1>
                            <p className="text-white/60">Prévisions sur 5 jours basées sur l'IA et les données satellites</p>
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
                                <span className="text-white/80">AQI de Demain</span>
                                <TrendingDown className="w-5 h-5 text-green-400" />
                            </div>
                            <div className="text-green-400 mb-2">48</div>
                            <p className="text-white/60 text-sm">Bon - Amélioration</p>
                        </Card>

                        <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/30 p-6">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-white/80">Pic de la Semaine</span>
                                <TrendingUp className="w-5 h-5 text-orange-400" />
                            </div>
                            <div className="text-orange-400 mb-2">78</div>
                            <p className="text-white/60 text-sm">Jour 5 après-midi</p>
                        </Card>

                        <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30 p-6">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-white/80">Meilleur Jour</span>
                                <Calendar className="w-5 h-5 text-blue-400" />
                            </div>
                            <div className="text-blue-400 mb-2">Jour 1</div>
                            <p className="text-white/60 text-sm">AQI 35 - Excellent</p>
                        </Card>
                    </div>

                    {/* 5-Day Forecast */}
                    <Card className="bg-white/5 border-white/10 p-6 mb-8">
                        <h2 className="text-white mb-6">Prévisions des Polluants sur 5 Jours</h2>
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
                                <span className="text-white/60 text-sm">Historique</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-0.5 border-t-2 border-dashed border-white/60" />
                                <span className="text-white/60 text-sm">Prévision</span>
                            </div>
                        </div>
                    </Card>

                    {/* 24-Hour AQI Prediction */}
                    <Card className="bg-white/5 border-white/10 p-6">
                        <h2 className="text-white mb-6">Prévision AQI sur 24 Heures</h2>
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
                        <h3 className="text-white mb-4">Insights IA</h3>
                        <ul className="space-y-3 text-white/80">
                            <li className="flex items-start gap-3">
                                <div className="w-2 h-2 rounded-full bg-purple-400 mt-2" />
                                <span>Les prévisions météo suggèrent une baisse des niveaux de pollution dans 5 jours grâce à un système pluvieux.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-2 h-2 rounded-full bg-purple-400 mt-2" />
                                <span>Le jour 3 montre des niveaux d'ozone élevés - limitez les activités extérieures de 14h à 18h.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-2 h-2 rounded-full bg-purple-400 mt-2" />
                                <span>La tendance à long terme montre une amélioration de 15% des niveaux de NO₂ par rapport au mois dernier.</span>
                            </li>
                        </ul>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
}
