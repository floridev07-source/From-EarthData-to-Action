import { useAqiData } from '../../context/AqiDataContext';
import AqiTrendChart from '../dashboard/AqiTrendChart';
import DaySummaryCard from '../dashboard/DaySummaryCard';
import DominantPollutantsList from '../dashboard/DominantPollutantsList';
import HealthAlertBox from '../dashboard/HealthAlertBox';
import DiseaseSelector from '../dashboard/DiseaseSelector';

import { Button } from '../ui/button';
import { X } from 'lucide-react';

export default function Dashboard({ onClose }: { onClose?: () => void }) {
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {data?.forecast_next_24h && data.forecast_next_24h.length > 0 ? (
              <AqiTrendChart data={data.forecast_next_24h} />
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-white/60">No trend data</div>
            )}
          </div>
          <div>
            {data ? (
              <DaySummaryCard
                weatherSummary={data.weather_summary}
                temperatureC={data.temperature_pred_C}
                humidityPercent={data.humidity_pred_percent}
                windSpeedMs={data.wind_speed_pred_ms}
                pressureHpa={data.pressure_pred_hPa}
              />
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-white/60">No weather data</div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {data ? (
              <HealthAlertBox alertText={data.health_alert} actions={data.recommended_actions} color={data.AQI_color_code} />
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-white/60">No alerts</div>
            )}
          </div>
          <div>
            {data ? (
              <DominantPollutantsList pollutants={data.main_pollutants} percentages={data.pollutant_percentages} />
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-white/60">No pollutants</div>
            )}
          </div>
        </div>

        <DiseaseSelector />
      </div>
    </div>
  );
}
