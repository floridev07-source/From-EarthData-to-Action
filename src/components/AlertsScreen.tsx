import { X, AlertTriangle, Info, Users, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import OctobreRoseBanner from './OctobreRoseBanner';
import { useState } from 'react';

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
            affectedPopulation: '2.3M personnes',
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
            title: 'High NO₂',
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

    const [alertsState, setAlertsState] = useState<Alert[]>(alerts);
    const [levelFilter, setLevelFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
    const [pollutantFilter, setPollutantFilter] = useState<'all' | 'PM2.5' | 'NO₂' | 'O₃'>('all');
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

    const visibleAlerts = alertsState.filter((a) =>
        (levelFilter === 'all' || a.level === levelFilter) && (pollutantFilter === 'all' || a.pollutant === pollutantFilter)
    );

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'high':
                return 'text-red-600 bg-red-600/20 border-red-600/50';
            case 'medium':
                return 'text-orange-600 bg-orange-600/20 border-orange-600/50';
            default:
                return 'text-green-600 bg-green-600/20 border-green-600/50';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 bg-[#0a0e1a]"
        >
            <div className="h-full overflow-y-auto">
                <div className="max-w-6xl mx-auto p-4 sm:p-8 relative">
                    <div className="mt-16"><OctobreRoseBanner /></div>
                    <div className="sticky top-0 z-10 bg-[#0a0e1a] bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm -mx-4 sm:-mx-8 px-4 sm:px-8 pt-2 pb-4 mb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-white mb-1">Active Alerts</h1>
                                <p className="text-white/70 text-sm">Real-time air quality warnings and notifications</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="text-white hover:bg-white/10"
                                aria-label="Close alerts screen"
                            >
                                <X className="w-6 h-6" />
                            </Button>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-2">
                                <Button size="sm" variant={levelFilter==='all'?'default':'outline'} className={levelFilter==='all'?"bg-white/20 text-white border-white/30":"border-white/20 text-white/80 hover:bg-white/10"} onClick={()=>setLevelFilter('all')}>All</Button>
                                <Button size="sm" variant={levelFilter==='high'?'default':'outline'} className={levelFilter==='high'?"bg-red-600/30 text-white border-red-600/50":"border-white/20 text-white/80 hover:bg-white/10"} onClick={()=>setLevelFilter('high')}>Severe</Button>
                                <Button size="sm" variant={levelFilter==='medium'?'default':'outline'} className={levelFilter==='medium'?"bg-orange-600/30 text-white border-orange-600/50":"border-white/20 text-white/80 hover:bg-white/10"} onClick={()=>setLevelFilter('medium')}>Moderate</Button>
                                <Button size="sm" variant={levelFilter==='low'?'default':'outline'} className={levelFilter==='low'?"bg-green-600/30 text-white border-green-600/50":"border-white/20 text-white/80 hover:bg-white/10"} onClick={()=>setLevelFilter('low')}>Low</Button>
                            </div>
                            <div className="h-5 w-px bg-white/10" />
                            <div className="flex items-center gap-2">
                                <Button size="sm" variant={pollutantFilter==='all'?'default':'outline'} className={pollutantFilter==='all'?"bg-white/20 text-white border-white/30":"border-white/20 text-white/80 hover:bg-white/10"} onClick={()=>setPollutantFilter('all')}>All</Button>
                                <Button size="sm" variant={pollutantFilter==='PM2.5'?'default':'outline'} className={pollutantFilter==='PM2.5'?"bg-purple-500/30 text-white border-purple-500/50":"border-white/20 text-white/80 hover:bg-white/10"} onClick={()=>setPollutantFilter('PM2.5')}>PM2.5</Button>
                                <Button size="sm" variant={pollutantFilter==='NO₂'?'default':'outline'} className={pollutantFilter==='NO₂'?"bg-orange-600/30 text-white border-orange-600/50":"border-white/20 text-white/80 hover:bg-white/10"} onClick={()=>setPollutantFilter('NO₂')}>NO₂</Button>
                                <Button size="sm" variant={pollutantFilter==='O₃'?'default':'outline'} className={pollutantFilter==='O₃'?"bg-blue-500/30 text-white border-blue-500/50":"border-white/20 text-white/80 hover:bg-white/10"} onClick={()=>setPollutantFilter('O₃')}>O₃</Button>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                        <Card className="bg-red-600/20 border-red-600/30 p-4">
                            <AlertTriangle className="w-8 h-8 text-red-600 mb-2" />
                            <div className="text-white mb-1">2</div>
                            <p className="text-white/80 text-sm">Severe</p>
                        </Card>
                        <Card className="bg-orange-600/20 border-orange-600/30 p-4">
                            <Info className="w-8 h-8 text-orange-600 mb-2" />
                            <div className="text-white mb-1">2</div>
                            <p className="text-white/80 text-sm">Moderate</p>
                        </Card>
                        <Card className="bg-green-600/20 border-green-600/30 p-4">
                            <Users className="w-8 h-8 text-green-600 mb-2" />
                            <div className="text-white mb-1">7.5M</div>
                            <p className="text-white/80 text-sm">People Affected</p>
                        </Card>
                        <Card className="bg-orange-600/20 border-orange-600/30 p-4">
                            <MapPin className="w-8 h-8 text-orange-600 mb-2" />
                            <div className="text-white mb-1">4</div>
                            <p className="text-white/80 text-sm">Locations</p>
                        </Card>
                    </div>
                    <div className="space-y-4">
                        {visibleAlerts.map((alert, index) => (
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
                                                    <p className="text-white/70 text-sm mb-1">Location</p>
                                                    <p className="text-white">{alert.location}</p>
                                                </div>
                                                <div>
                                                    <p className="text-white/70 text-sm mb-1">Pollutant</p>
                                                    <p className="text-white">{alert.pollutant}: {alert.value} µg/m³</p>
                                                </div>
                                                <div>
                                                    <p className="text-white/70 text-sm mb-1">Affected Population</p>
                                                    <p className="text-white">{alert.affectedPopulation}</p>
                                                </div>
                                                <div>
                                                    <p className="text-white/70 text-sm mb-1">Time</p>
                                                    <p className="text-white">{alert.time}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    className="bg-green-600 text-white hover:bg-green-700 border-0"
                                                    onClick={() => setSelectedAlert(alert)}
                                                >
                                                    View Details
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-orange-600 text-orange-600 hover:bg-orange-600/10"
                                                    onClick={() => setAlertsState((prev)=>prev.filter(a=>a.id!==alert.id))}
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
            <AnimatePresence>
                {selectedAlert && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="absolute top-0 right-0 bottom-0 w-96 bg-black/95 backdrop-blur-md border-l border-white/10 z-40"
                    >
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-white">Alert Details</h3>
                                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={()=>setSelectedAlert(null)}>
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                            <Card className="bg-white/5 border-white/10 p-4 space-y-3">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-orange-400" />
                                    <span className="text-white/80 text-sm">{selectedAlert.title}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="text-white/70">Location</div>
                                    <div className="text-white">{selectedAlert.location}</div>
                                    <div className="text-white/70">Pollutant</div>
                                    <div className="text-white">{selectedAlert.pollutant} · {selectedAlert.value} µg/m³</div>
                                    <div className="text-white/70">Population</div>
                                    <div className="text-white">{selectedAlert.affectedPopulation}</div>
                                    <div className="text-white/70">Time</div>
                                    <div className="text-white">{selectedAlert.time}</div>
                                </div>
                                <p className="text-white/60 text-xs">Sources: TEMPO/WHO/OpenAQ.</p>
                            </Card>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
