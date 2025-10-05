import { Heart, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { motion } from 'motion/react';
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
            aria-label="Red ribbon"
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
                        aria-label="Learn more about Pink October and pollution"
                    >
                        <RedRibbonIcon />
                        <span className="text-red-600 text-sm">
              Pink October: Pollution & Health
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
                                Pink October: Pollution & Health
                            </DialogTitle>
                        </div>
                        <DialogDescription className="text-gray-200/80">
                            Awareness of the links between air quality and breast cancer
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 mt-4">
                        {/* Section principale */}
                        <div>
                            <p className="text-gray-200/80">
                                The Pink October campaign highlights breast cancer prevention, but did you know that air pollution plays a role in health risks? Pollutants such as fine particles (PM2.5), nitrogen dioxide (NO₂), and volatile organic compounds can increase the risk of disease, including certain cancers.
                            </p>
                        </div>

                        <div className="bg-red-600/20 border-red-600/30 rounded-lg p-4">
                            <h3 className="text-gray-200 mb-3">Key pollutants</h3>
                            <ul className="space-y-2 text-gray-200/80 text-sm">
                                <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-600 mt-2" />
                                    <span>
                    <strong className="text-gray-200">PM2.5</strong>: Fine particles associated with increased risk of respiratory disease and potentially cancer.
                  </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-600 mt-2" />
                                    <span>
                    <strong className="text-gray-200">NO₂</strong>: Gas emitted by vehicles, associated with chronic inflammation.
                  </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-600 mt-2" />
                                    <span>
                    <strong className="text-gray-200">Benzene</strong>: Carcinogenic compound present in vehicle emissions.
                  </span>
                                </li>
                            </ul>
                        </div>

                        {/* Actions */}
                        <div className="bg-red-600/20 border-red-600/30 rounded-lg p-4">
                            <h3 className="text-gray-200 mb-3">How to act?</h3>
                            <ul className="space-y-2 text-gray-200/80 text-sm">
                                <li>• Check air quality before outdoor activities</li>
                                <li>• Avoid high-traffic areas during rush hours</li>
                                <li>• Use home air purifiers if needed</li>
                                <li>• Participate in pollution reduction initiatives</li>
                                <li>• Get regular screenings</li>
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
                                    Learn more
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
                                    Donate
                                </a>
                            </Button>
                        </div>

                        {/* Footer */}
                        <p className="text-gray-200/40 text-xs text-center">
                            Sources: WHO, National Cancer Institute, recent epidemiological studies
                        </p>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
