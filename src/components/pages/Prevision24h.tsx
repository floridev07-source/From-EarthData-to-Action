import ForecastTable from '../dashboard/ForecastTable';
import AqiTrendChart from '../dashboard/AqiTrendChart';
import { useAqiData } from '../../context/AqiDataContext';

import { Button } from '../ui/button';
import { X } from 'lucide-react';

export default function Prevision24h({ onClose }: { onClose?: () => void }) {
  const { data } = useAqiData();

  return (
    <div className="absolute inset-0 z-20 p-6 overflow-y-auto bg-black/60 backdrop-blur-md">
      {onClose && (
        <div className="absolute top-6 right-6 z-30">
          <Button variant="ghost" size="icon" className="text-white" onClick={onClose} aria-label="Close">
            <X className="w-5 h-5" />
          </Button>
        </div>
      )}
      <div className="max-w-6xl mx-auto space-y-6">
        {data?.forecast_next_24h && data.forecast_next_24h.length > 0 ? (
          <>
            <AqiTrendChart data={data.forecast_next_24h} />
            <ForecastTable data={data.forecast_next_24h} />
          </>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-white/60">No forecast data</div>
        )}
      </div>
    </div>
  );
}
