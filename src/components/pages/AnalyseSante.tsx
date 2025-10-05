import { useAqiData } from '../../context/AqiDataContext';

import { Button } from '../ui/button';
import { X } from 'lucide-react';

export default function AnalyseSante({ onClose }: { onClose?: () => void }) {
  const { data, selectedDisease } = useAqiData();

  return (
    <div className="absolute inset-0 z-20 p-6 overflow-y-auto bg-black/60 backdrop-blur-md">
      {onClose && (
        <div className="absolute top-6 right-6 z-30">
          <Button variant="ghost" size="icon" className="text-white" onClick={onClose} aria-label="Fermer">
            <X className="w-5 h-5" />
          </Button>
        </div>
      )}
      <div className="max-w-4xl mx-auto space-y-4">
        <h2 className="text-white">Analyse santé</h2>
        <p className="text-white/70 text-sm">Maladie sélectionnée: {selectedDisease || 'Aucune'}</p>
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <h3 className="text-white mb-2">Risque spécifique</h3>
          <p className="text-white/70 text-sm">{data?.disease_specific_risk || 'Aucune analyse disponible'}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <h3 className="text-white mb-2">Groupes à risque</h3>
          <ul className="text-white/70 text-sm list-disc list-inside space-y-1">
            {data?.population_risk_groups?.map((g) => (
              <li key={g}>{g}</li>
            )) || <li>Aucun groupe identifié</li>}
          </ul>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <h3 className="text-white mb-2">Actions recommandées</h3>
          <ul className="text-white/70 text-sm list-disc list-inside space-y-1">
            {data?.recommended_actions?.map((g) => (
              <li key={g}>{g}</li>
            )) || <li>Aucune recommandation</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
