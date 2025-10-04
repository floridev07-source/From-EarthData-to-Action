import { Heart, ExternalLink, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

export default function OctobreRoseBanner() {
  const [showDetails, setShowDetails] = useState(false);
  
  // Icône ruban rose SVG
  const PinkRibbonIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="w-5 h-5"
      aria-label="Ruban rose"
    >
      <path
        d="M12 2C12 2 8 6 8 10C8 12 9 14 10.5 15C9 16 8 18 8 20C8 22 10 24 12 24C12 24 10 20 10 16C10 14 11 12 12.5 11C14 12 15 14 15 16C15 20 13 24 13 24C15 24 17 22 17 20C17 18 16 16 14.5 15C16 14 17 12 17 10C17 6 13 2 13 2"
        fill="#FFC1CC"
        stroke="#FF69B4"
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
        <Card className="bg-[#FFC1CC]/10 border-[#FFC1CC]/30 backdrop-blur-sm">
          <button
            onClick={() => setShowDetails(true)}
            className="flex items-center gap-2 px-4 py-2 hover:bg-[#FFC1CC]/20 transition-all rounded-lg group"
            aria-label="En savoir plus sur Octobre Rose et la pollution"
          >
            <PinkRibbonIcon />
            <span className="text-[#FFC1CC] text-sm">
              Octobre Rose : Pollution & Santé
            </span>
            <ExternalLink className="w-4 h-4 text-[#FFC1CC]/60 group-hover:text-[#FFC1CC] transition-colors" />
          </button>
        </Card>
      </motion.div>

      {/* Dialog avec informations détaillées */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="bg-black/95 border-[#FFC1CC]/30 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <PinkRibbonIcon />
              <DialogTitle className="text-[#FFC1CC]">
                Octobre Rose : Pollution & Santé
              </DialogTitle>
            </div>
            <DialogDescription className="text-white/80">
              Sensibilisation aux liens entre qualité de l'air et cancer du sein
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Section principale */}
            <div className="space-y-4">
              <div className="bg-[#FFC1CC]/10 border border-[#FFC1CC]/30 rounded-lg p-4">
                <h3 className="text-white mb-3 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-[#FFC1CC]" />
                  Le saviez-vous ?
                </h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  Les recherches scientifiques ont établi des liens entre l'exposition prolongée 
                  à la pollution de l'air et l'augmentation du risque de cancer du sein. 
                  Les particules fines (PM2.5) et les composés organiques volatils peuvent 
                  agir comme perturbateurs endocriniens.
                </p>
              </div>

              {/* Statistiques */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-[#FFC1CC]/5 border-[#FFC1CC]/20 p-4">
                  <div className="text-[#FFC1CC] mb-1">+8%</div>
                  <p className="text-white/60 text-sm">
                    Risque accru avec exposition PM2.5
                  </p>
                </Card>
                <Card className="bg-[#FFC1CC]/5 border-[#FFC1CC]/20 p-4">
                  <div className="text-[#FFC1CC] mb-1">1 sur 8</div>
                  <p className="text-white/60 text-sm">
                    Femmes touchées dans leur vie
                  </p>
                </Card>
              </div>

              {/* Polluants à risque */}
              <div>
                <h3 className="text-white mb-3">Polluants préoccupants</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-white/80 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FFC1CC] mt-2" />
                    <span>
                      <strong className="text-white">PM2.5</strong> : Particules fines pouvant pénétrer 
                      profondément dans les tissus
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-white/80 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FFC1CC] mt-2" />
                    <span>
                      <strong className="text-white">NO₂</strong> : Lié à l'inflammation et au stress oxydatif
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-white/80 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FFC1CC] mt-2" />
                    <span>
                      <strong className="text-white">Benzène</strong> : Composé cancérigène présent 
                      dans les émissions automobiles
                    </span>
                  </li>
                </ul>
              </div>

              {/* Actions */}
              <div className="bg-gradient-to-r from-[#FFC1CC]/10 to-[#FF69B4]/10 border border-[#FFC1CC]/30 rounded-lg p-4">
                <h3 className="text-white mb-3">Comment agir ?</h3>
                <ul className="space-y-2 text-white/80 text-sm">
                  <li>• Surveillez la qualité de l'air avant vos activités extérieures</li>
                  <li>• Évitez les zones à forte circulation aux heures de pointe</li>
                  <li>• Utilisez des purificateurs d'air à domicile si nécessaire</li>
                  <li>• Participez aux initiatives de réduction de la pollution</li>
                  <li>• Effectuez des dépistages réguliers</li>
                </ul>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                asChild
                className="flex-1 bg-[#FFC1CC]/20 text-[#FFC1CC] hover:bg-[#FFC1CC]/30 border border-[#FFC1CC]/30"
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
                className="flex-1 bg-gradient-to-r from-[#FF69B4] to-[#FFC1CC] text-white hover:opacity-90"
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
            <p className="text-white/40 text-xs text-center">
              Sources : OMS, Institut National du Cancer, études épidémiologiques récentes
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
