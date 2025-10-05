import { Card } from '../ui/card';
import { CloudSun } from 'lucide-react';

interface Props {
  weatherSummary: string;
  temperatureC: number;
  humidityPercent: number;
  windSpeedMs: number;
  pressureHpa: number;
}

export default function DaySummaryCard({ weatherSummary, temperatureC, humidityPercent, windSpeedMs, pressureHpa }: Props) {
  return (
    <Card className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-white/20 p-5">
      <div className="flex items-start gap-3">
        <CloudSun className="w-6 h-6 text-white/80" />
        <div>
          <h3 className="text-white mb-1">Résumé du jour</h3>
          <p className="text-white/70 text-sm mb-3">{weatherSummary}</p>
          <div className="grid grid-cols-2 gap-3 text-sm text-white/80">
            <div>Température: <span className="text-white">{temperatureC.toFixed(1)} °C</span></div>
            <div>Humidité: <span className="text-white">{humidityPercent.toFixed(0)} %</span></div>
            <div>Vent: <span className="text-white">{windSpeedMs.toFixed(1)} m/s</span></div>
            <div>Pression: <span className="text-white">{pressureHpa.toFixed(0)} hPa</span></div>
          </div>
        </div>
      </div>
    </Card>
  );
}
