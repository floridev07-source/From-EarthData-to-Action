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

    const aqiLevel = locationData?.aqi || 72;
    let aqiCategory = 'Bon';
    let aqiColor = 'text-green-600';
    if (aqiLevel > 150) {
        aqiCategory = 'Malsain';
        aqiColor = 'text-red-700';
    } else if (aqiLevel > 100) {
        aqiCategory = 'Malsain pour les groupes sensibles';
        aqiColor = 'text-orange-700';
    } else if (aqiLevel > 50) {
        aqiCategory = 'Modéré';
        aqiColor = 'text-yellow-600';
    }

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
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-white">{locationData?.name || 'Détails de Localisation'}</h2>
                                <p className="text-white/60">{locationData?.location || 'New York, USA'}</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="text-white hover:bg-white/10"
                                aria-label="Fermer le panneau latéral"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                        <Card className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-white/20 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-white/80">Indice de Qualité de l'Air</span>
                                <Badge className={`${aqiColor} bg-white/10`}>{aqiCategory}</Badge>
                            </div>
                            <div className={`${aqiColor}`}>
                                {aqiLevel}
                            </div>
                            <p className="text-white/60 text-sm mt-2">
                                {aqiLevel > 100 ? 'Peut causer des problèmes de santé pour les groupes sensibles' : 'La qualité de l’air est acceptable pour la plupart des gens'}
                            </p>
                        </Card>
                        <div className="space-y-3">
                            <h3 className="text-white">Niveaux de Polluants</h3>
                            <Card className="bg-white/5 border-white/10 p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-white/80">NO₂ (Dioxyde d’Azote)</span>
                                    <span className="text-orange-700">{locationData?.NO2 || 0} µg/m³</span>
                                </div>
                                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                                    <div className="bg-gradient-to-r from-orange-700 to-red-700 h-full" style={{ width: `${(locationData?.NO2 || 0) / 2}%` }} />
                                </div>
                            </Card>
                            <Card className="bg-white/5 border-white/10 p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-white/80">O₃ (Ozone)</span>
                                    <span className="text-blue-600">{locationData?.Ozone || 0} µg/m³</span>
                                </div>
                                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                                    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 h-full" style={{ width: `${(locationData?.Ozone || 0) / 2}%` }} />
                                </div>
                            </Card>
                            <Card className="bg-white/5 border-white/10 p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-white/80">PM2.5 (Particules Fines)</span>
                                    <span className="text-purple-600">{locationData?.PM || 0} µg/m³</span>
                                </div>
                                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-full" style={{ width: `${(locationData?.PM || 0) / 2}%` }} />
                                </div>
                            </Card>
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-white">Tendance sur 24 Heures</h3>
                            <Card className="bg-white/5 border-white/10 p-4">
                                <ResponsiveContainer width="100%" height={200}>
                                    <AreaChart data={mockData}>
                                        <defs>
                                            <linearGradient id="colorNO2" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#c2410c" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#c2410c" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                                        <XAxis dataKey="time" stroke="#ffffff60" />
                                        <YAxis stroke="#ffffff60" />
                                        <Tooltip
                                            contentStyle={{ background: '#1a1a1a', border: '1px solid #ffffff20', borderRadius: '8px' }}
                                        />
                                        <Area type="monotone" dataKey="NO2" stroke="#c2410c" fillOpacity={1} fill="url(#colorNO2)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </Card>
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-white">Impact sur la Santé</h3>
                            <Card className="bg-white/5 border-white/10 p-4 space-y-3">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 text-orange-700 mt-1" />
                                    <div>
                                        <p className="text-white/80">Groupes Sensibles</p>
                                        <p className="text-white/60 text-sm">
                                            Les enfants et les personnes âgées doivent limiter les activités extérieures
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Users className="w-5 h-5 text-blue-600 mt-1" />
                                    <div>
                                        <p className="text-white/80">Public Général</p>
                                        <p className="text-white/60 text-sm">
                                            Activités normales acceptables
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-white">Sources des Données</h3>
                            <Card className="bg-white/5 border-white/10 p-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-white/60 text-sm">Satellite (TEMPO)</span>
                                        <span className="text-green-600 text-sm">Actif</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-white/60 text-sm">Stations au Sol</span>
                                        <span className="text-green-600 text-sm">12 capteurs</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-white/60 text-sm">Dernière Mise à Jour</span>
                                        <span className="text-white/60 text-sm">Il y a 2 min</span>
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
