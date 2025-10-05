import { Heart, ExternalLink, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

export default function OctobreRoseBanner() {
    const [showDetails, setShowDetails] = useState(false);

    // Icône ruban rouge
    const RedRibbonIcon = () => (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-5 h-5"
            aria-label="Ruban rouge"
        >
            <path
                d="M12 2C12 2 8 6 8 10C8 12 9 14 10.5 15C9 16 8 18 8 20C8 22 10 24 12 24C12 24 10 20 10 16C10 14 11 12 12.5 11C14 12 15 14 15 16C15 20 13 24 13 24C15 24 17 22 17 20C17 18 16 16 14.5 15C16 14 17 12 17 10C17 6 13 2 13 2"
                fill="#dc2626"
                stroke="#dc2626"
                strokeWidth="0.5"
            />
        </svg>
    );

    return (
        <>
            {/* Badge discret en haut à droite */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-4 right-4 z-10"
            >
                <Card className="bg-red-600/20 border-red-600/30 backdrop-blur-sm">
                    <button
                        onClick={() => setShowDetails(true)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-red-600/30 transition-all rounded-lg group"
                        aria-label="En savoir plus sur Octobre Rose et la pollution"
                    >
                        <RedRibbonIcon />
                        <span className="text-red-600 text-sm">
              Octobre Rose : Pollution & Santé
            </span>
                        <ExternalLink className="w-4 h-4 text-red-600/60 group-hover:text-red-600 transition-colors" />
                    </button>
                </Card>
            </motion.div>

            {/* Dialog avec informations détaillées */}
            <Dialog open={showDetails} onOpenChange={setShowDetails}>
                <DialogContent className="bg-[#0a0e1a] border-red-600/30 text-gray-200 max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <RedRibbonIcon />
                            <DialogTitle className="text-red-600">
                                Octobre Rose : Pollution & Santé
                            </DialogTitle>
                        </div>
                        <DialogDescription className="text-gray-200/80">
                            Sensibilisation aux liens entre qualité de l'air et cancer du sein
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 mt-4">
                        {/* Section principale */}
                        <div>
                            <p className="text-gray-200/80">
                                La campagne Octobre Rose met en lumière la prévention du cancer du sein, mais saviez-vous que la pollution atmosphérique joue un rôle dans les risques pour la santé ? Les polluants comme les particules fines (PM2.5), le dioxyde d’azote (NO₂) et les composés organiques volatils peuvent augmenter les risques de maladies, y compris certains cancers.
                            </p>
                        </div>

                        <div className="bg-red-600/20 border-red-600/30 rounded-lg p-4">
                            <h3 className="text-gray-200 mb-3">Polluants clés</h3>
                            <ul className="space-y-2 text-gray-200/80 text-sm">
                                <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-600 mt-2" />
                                    <span>
                    <strong className="text-gray-200">PM2.5</strong> : Particules fines liées à des risques accrus de maladies respiratoires et potentiellement de cancer.
                  </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-600 mt-2" />
                                    <span>
                    <strong className="text-gray-200">NO₂</strong> : Gaz émis par les véhicules, associé à l’inflammation chronique.
                  </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-600 mt-2" />
                                    <span>
                    <strong className="text-gray-200">Benzène</strong> : Composé cancérigène présent dans les émissions automobiles.
                  </span>
                                </li>
                            </ul>
                        </div>

                        {/* Actions */}
                        <div className="bg-red-600/20 border-red-600/30 rounded-lg p-4">
                            <h3 className="text-gray-200 mb-3">Comment agir ?</h3>
                            <ul className="space-y-2 text-gray-200/80 text-sm">
                                <li>• Surveillez la qualité de l'air avant vos activités extérieures</li>
                                <li>• Évitez les zones à forte circulation aux heures de pointe</li>
                                <li>• Utilisez des purificateurs d'air à domicile si nécessaire</li>
                                <li>• Participez aux initiatives de réduction de la pollution</li>
                                <li>• Effectuez des dépistages réguliers</li>
                            </ul>
                        </div>

                        {/* Boutons d'action */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                asChild
                                className="flex-1 bg-green-600 text-gray-200 hover:bg-green-700 border-green-600/30"
                            >
                                <a
                                    href="https://www.ligue-cancer.net/octobre-rose"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2"
                                >
                                    En savoir plus
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </Button>
                            <Button
                                asChild
                                className="flex-1 bg-red-600 text-gray-200 hover:bg-red-700 border-red-600/30"
                            >
                                <a
                                    href="https://www.ligue-cancer.net/octobre-rose/faire-un-don"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2"
                                >
                                    <Heart className="w-4 h-4" />
                                    Faire un don
                                </a>
                            </Button>
                        </div>

                        {/* Footer */}
                        <p className="text-gray-200/40 text-xs text-center">
                            Sources : OMS, Institut National du Cancer, études épidémiologiques récentes
                        </p>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
