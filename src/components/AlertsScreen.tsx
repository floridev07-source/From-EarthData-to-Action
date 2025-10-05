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
            title: 'Niveaux élevés de PM2.5',
            location: 'Delhi, Inde',
            pollutant: 'PM2.5',
            value: 185,
            affectedPopulation: '2.3M personnes',
            time: 'Il y a 15 min',
        },
        {
            id: '2',
            level: 'high',
            title: 'Alerte Ozone',
            location: 'Los Angeles, USA',
            pollutant: 'O₃',
            value: 142,
            affectedPopulation: '580K personnes',
            time: 'Il y a 1 heure',
        },
        {
            id: '3',
            level: 'medium',
            title: 'NO₂ élevé',
            location: 'Londres, UK',
            pollutant: 'NO₂',
            value: 95,
            affectedPopulation: '1.1M personnes',
            time: 'Il y a 2 heures',
        },
        {
            id: '4',
            level: 'medium',
            title: 'Avis de qualité de l\'air',
            location: 'Pékin, Chine',
            pollutant: 'PM2.5',
            value: 115,
            affectedPopulation: '3.5M personnes',
            time: 'Il y a 3 heures',
        },
    ];

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
                    <OctobreRoseBanner />
                    <div className="flex items-center justify-between mb-8 mt-4 sm:mt-0">
                        <div>
                            <h1 className="text-gray-200 mb-2">Alertes Actives</h1>
                            <p className="text-gray-200/60">Avertissements et notifications en temps réel sur la qualité de l'air</p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="text-gray-200 hover:bg-gray-200/10"
                            aria-label="Fermer l'écran des alertes"
                        >
                            <X className="w-6 h-6" />
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                        <Card className="bg-red-600/20 border-red-600/30 p-4">
                            <AlertTriangle className="w-8 h-8 text-red-600 mb-2" />
                            <div className="text-gray-200 mb-1">2</div>
                            <p className="text-gray-200/60 text-sm">Critique</p>
                        </Card>
                        <Card className="bg-orange-600/20 border-orange-600/30 p-4">
                            <Info className="w-8 h-8 text-orange-600 mb-2" />
                            <div className="text-gray-200 mb-1">2</div>
                            <p className="text-gray-200/60 text-sm">Modéré</p>
                        </Card>
                        <Card className="bg-green-600/20 border-green-600/30 p-4">
                            <Users className="w-8 h-8 text-green-600 mb-2" />
                            <div className="text-gray-200 mb-1">7.5M</div>
                            <p className="text-gray-200/60 text-sm">Personnes Affectées</p>
                        </Card>
                        <Card className="bg-orange-600/20 border-orange-600/30 p-4">
                            <MapPin className="w-8 h-8 text-orange-600 mb-2" />
                            <div className="text-gray-200 mb-1">4</div>
                            <p className="text-gray-200/60 text-sm">Lieux</p>
                        </Card>
                    </div>
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
                                                <h3 className="text-gray-200">{alert.title}</h3>
                                                <Badge className="bg-gray-200/20 text-gray-200 border-0">
                                                    {alert.level.toUpperCase()}
                                                </Badge>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 mb-3">
                                                <div>
                                                    <p className="text-gray-200/60 text-sm mb-1">Lieu</p>
                                                    <p className="text-gray-200">{alert.location}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-200/60 text-sm mb-1">Polluant</p>
                                                    <p className="text-gray-200">{alert.pollutant}: {alert.value} µg/m³</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-200/60 text-sm mb-1">Population Affectée</p>
                                                    <p className="text-gray-200">{alert.affectedPopulation}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-200/60 text-sm mb-1">Heure</p>
                                                    <p className="text-gray-200">{alert.time}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    className="bg-green-600 text-gray-200 hover:bg-green-700 border-0"
                                                >
                                                    Voir Détails
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-orange-600 text-orange-600 hover:bg-orange-600/10"
                                                >
                                                    Ignorer
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
