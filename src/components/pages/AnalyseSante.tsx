import { useAqiData } from '../../context/AqiDataContext';

import { Button } from '../ui/button';
import { X } from 'lucide-react';

export default function AnalyseSante({ onClose }: { onClose?: () => void }) {
  const { data, selectedDisease } = useAqiData();

  return (
    <div className="absolute inset-0 z-20 p-6 overflow-y-auto bg-black/60 backdrop-blur-md">
      {onClose && (
        <div className="absolute top-6 right-6 z-30">
          <Button variant="ghost" size="icon" className="text-white" onClick={onClose} aria-label="Close">
            <X className="w-5 h-5" />
          </Button>
        </div>
      )}
      <div className="max-w-4xl mx-auto space-y-4">
        <h2 className="text-white">Health Analysis</h2>
        <p className="text-white/70 text-sm">Selected condition: {selectedDisease || 'None'}</p>
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <h3 className="text-white mb-2">Specific risk</h3>
          <p className="text-white/70 text-sm">{data?.disease_specific_risk || 'No analysis available'}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <h3 className="text-white mb-2">At-risk groups</h3>
          <ul className="text-white/70 text-sm list-disc list-inside space-y-1">
            {data?.population_risk_groups?.map((g) => (
              <li key={g}>{g}</li>
            )) || <li>No group identified</li>}
          </ul>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <h3 className="text-white mb-2">Recommended actions</h3>
          <ul className="text-white/70 text-sm list-disc list-inside space-y-1">
            {data?.recommended_actions?.map((g) => (
              <li key={g}>{g}</li>
            )) || <li>No recommendations</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
