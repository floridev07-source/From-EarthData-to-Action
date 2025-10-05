import { useState, useEffect } from 'react';
import { X, AlertTriangle, MapPin, Wind } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface HealthAssistantPanelProps {
    isOpen: boolean;
    onClose: () => void;
    step: number;
    setStep: (step: number) => void;
    maladie: string | null;
    setMaladie: (maladie: string) => void;
    location: { city: string; lat: number; lon: number } | null;
    setLocation: (location: any) => void;
    aqiData: any;
    setAqiData: (data: any) => void;
    riskAssessment: string | null;
    setRiskAssessment: (assessment: string) => void;
    adaptedZones: string[];
    setAdaptedZones: (zones: string[]) => void;
    preventionTips: string[];
    setPreventionTips: (tips: string[]) => void;
    respiroScore: string | null;
    setRespiroScore: (score: string) => void;
}

export default function HealthAssistantPanel({
                                                 isOpen,
                                                 onClose,
                                                 step,
                                                 setStep,
                                                 maladie,
                                                 setMaladie,
                                                 location,
                                                 setLocation,
                                                 aqiData,
                                                 setAqiData,
                                                 riskAssessment,
                                                 setRiskAssessment,
                                                 adaptedZones,
                                                 setAdaptedZones,
                                                 preventionTips,
                                                 setPreventionTips,
                                                 respiroScore,
                                                 setRespiroScore,
                                             }: HealthAssistantPanelProps) {
    const [cityInput, setCityInput] = useState('');
    const [latLonInput, setLatLonInput] = useState('');

    const maladies = ['Asthme', 'Bronchite chronique', 'BPCO (COPD)', 'Pneumonie', 'Autres (précise)'];

    const handleMaladieSelect = (value: string) => {
        if (maladies.includes(value) || value.startsWith('Autres')) {
            setMaladie(value);
            setStep(2);
        } else {
            toast.error('Veuillez choisir une maladie valide de la liste.');
        }
    };

    const fetchAqiData = async (lat: number, lon: number) => {
        try {
            const response = await fetch(`https://air-quality.api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=pm2_5,nitrogen_dioxide,ozone`);
            const data = await response.json();
            const latestIndex = data.hourly.time.length - 1;
            const currentData = {
                pm25: data.hourly.pm2_5[latestIndex],
                no2: data.hourly.nitrogen_dioxide[latestIndex],
                o3: data.hourly.ozone[latestIndex],
            };
            setAqiData(currentData);

            // Risk Assessment based on WHO guidelines
            let risk = 'Bon';
            if (currentData.no2 > 25 || currentData.pm25 > 15 || currentData.o3 > 60) {
                risk = 'Haut risque';
            } else if (currentData.no2 > 10 || currentData.pm25 > 5 || currentData.o3 > 30) {
                risk = 'Modéré';
            }
            setRiskAssessment(risk);

            // Mock adapted zones (replace with real API like NASA MODIS)
            setAdaptedZones(['Parc local', 'Zone côtière proche', 'Montagne à proximité']);

            setStep(3);
        } catch (error) {
            toast.error('Erreur lors de la récupération des données. Utilisation des données globales OMS.');
            setAqiData({ pm25: 5, no2: 10, o3: 60 }); // Fallback WHO global averages
            setRiskAssessment('Modéré (données globales OMS)');
            setAdaptedZones(['Zones rurales générales']);
            setStep(3);
        }
    };

    const handleLocationSubmit = () => {
        let lat, lon;
        if (latLonInput) {
            const [parsedLat, parsedLon] = latLonInput.split(',').map(Number);
            if (isNaN(parsedLat) || isNaN(parsedLon)) {
                toast.error('Format lat,lon invalide. Exemple: 48.8566,2.3522');
                return;
            }
            lat = parsedLat;
            lon = parsedLon;
        } else if (cityInput) {
            // Mock geocoding (replace with real geocoding API like OpenCage)
            if (cityInput.toLowerCase().includes('paris')) {
                lat = 48.8566;
                lon = 2.3522;
            } else {
                toast.error('Ville non reconnue. Essayez une autre ville ou utilisez lat,lon.');
                return;
            }
        } else {
            toast.error('Veuillez entrer une ville ou des coordonnées.');
            return;
        }
        setLocation({ city: cityInput || 'Inconnue', lat, lon });
        fetchAqiData(lat, lon);
    };

    const handleZonesNext = () => {
        // Prevention tips based on maladie
        const tips = [
            'Évitez les sorties aux heures de pointe de pollution (14h-18h).',
            'Utilisez un masque FFP2 si vous devez sortir.',
            'Surveillez vos symptômes et consultez un médecin si nécessaire.',
            'Préférez les zones vertes comme les parcs.',
            'Restez hydraté pour soutenir votre santé respiratoire.',
        ];
        if (maladie === 'Asthme') {
            tips.push('Gardez votre inhalateur à portée de main.');
        } else if (maladie === 'BPCO (COPD)') {
            tips.push('Utilisez un purificateur d’air à domicile.');
        }
        setPreventionTips(tips);

        // RespiroScore calculation
        if (aqiData) {
            const score = 100 - ((aqiData.no2 / 25 * 30) + (aqiData.pm25 / 15 * 40) + (aqiData.o3 / 60 * 30));
            setRespiroScore(`${Math.max(0, Math.min(100, Math.round(score)))}/100`);
        }

        setStep(4);
    };

    const outputJson = {
        maladie,
        aqi_actuel: { no2: aqiData?.no2, pm25: aqiData?.pm25, o3: aqiData?.o3, risk: riskAssessment },
        zones_adaptees: adaptedZones,
        conseils: preventionTips,
        respiro_score: respiroScore,
        innovations_suggerees: ['Journal wearable pour suivi des symptômes', 'Overlay AR pour visualiser les polluants'],
        vulnerable_profiles: 'Enfants, personnes âgées, asthmatiques',
        sources: ['OMS 2021 (https://www.who.int/news-room/fact-sheets/detail/ambient-air-pollution)', 'NASA TEMPO', 'Open-Meteo'],
    };

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
                            <h2 className="text-white">Assistant Santé Respiratoire</h2>
                            <Button variant="ghost" size="icon" onClick={onClose}>
                                <X className="w-5 h-5 text-white" />
                            </Button>
                        </div>

                        {step === 1 && (
                            <Card className="p-4">
                                <p className="text-white mb-4">Choisis ta maladie respiratoire :</p>
                                <Select onValueChange={handleMaladieSelect}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionne..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {maladies.map((m) => (
                                            <SelectItem key={m} value={m}>{m}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Card>
                        )}

                        {step === 2 && (
                            <Card className="p-4">
                                <p className="text-white mb-4">Partage ta localisation (ville ou lat,lon) :</p>
                                <Input
                                    placeholder="Ville (ex. Paris)"
                                    value={cityInput}
                                    onChange={(e) => setCityInput(e.target.value)}
                                    className="mb-2 text-white bg-white/10 border-white/20"
                                />
                                <Input
                                    placeholder="Lat,Lon (ex. 48.8566,2.3522)"
                                    value={latLonInput}
                                    onChange={(e) => setLatLonInput(e.target.value)}
                                    className="mb-4 text-white bg-white/10 border-white/20"
                                />
                                <Button onClick={handleLocationSubmit} className="bg-green-600 hover:bg-green-700">
                                    Soumettre
                                </Button>
                            </Card>
                        )}

                        {step === 3 && (
                            <Card className="p-4">
                                <p className="text-white mb-4">Zones adaptées pour un air plus sain :</p>
                                <ul className="text-white/80 space-y-2">
                                    {adaptedZones.map((zone) => (
                                        <li key={zone} className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            {zone}
                                        </li>
                                    ))}
                                </ul>
                                <Button onClick={handleZonesNext} className="mt-4 bg-green-600 hover:bg-green-700">
                                    Suivant
                                </Button>
                            </Card>
                        )}

                        {step === 4 && (
                            <Card className="p-4">
                                <p className="text-white mb-4">Conseils personnalisés et RespiroScore :</p>
                                <p className="text-white/80 mb-2">RespiroScore: {respiroScore}</p>
                                <ul className="text-white/80 space-y-2 mb-4">
                                    {preventionTips.map((tip) => (
                                        <li key={tip} className="flex items-start gap-2">
                                            <AlertTriangle className="w-4 h-4 mt-1" />
                                            {tip}
                                        </li>
                                    ))}
                                </ul>
                                <pre className="bg-white/10 p-4 rounded-lg overflow-auto text-white/80 text-sm">
                  {JSON.stringify(outputJson, null, 2)}
                </pre>
                                <p className="text-white/60 text-xs mt-4">
                                    Consultez un médecin pour des conseils médicaux. Sources : OMS, NASA.
                                </p>
                            </Card>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
