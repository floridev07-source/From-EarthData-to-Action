import { useMemo } from 'react';
import { useAqiData } from '../../context/AqiDataContext';
import { downloadCSV } from '../../lib/export';
import { Button } from '../ui/button';

import { X } from 'lucide-react';

export default function RapportQuotidien({ onClose }: { onClose?: () => void }) {
  const { data } = useAqiData();

  const rows = useMemo(() => {
    if (!data?.forecast_next_24h) return [] as Record<string, any>[];
    return data.forecast_next_24h.map((h) => ({
      datetime: h.datetime,
      temperature_C: h.temperature_pred_C,
      humidity_percent: h.humidity_pred_percent,
      wind_speed_ms: h.wind_speed_pred_ms,
      pressure_hPa: h.pressure_pred_hPa,
      AQI_total_pred: h.AQI_total_pred,
      AQI_level_text: h.AQI_level_text,
      main_pollutants: h.main_pollutants.join('|'),
    }));
  }, [data]);

  const handleExportCSV = () => {
    if (!rows.length) return;
    downloadCSV('rapport_quotidien.csv', rows);
  };

  const handleExportPDF = () => {
    if (!data) return;
    const html = `
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Rapport quotidien</title>
          <style>body{font-family: Arial, Helvetica, sans-serif;padding:20px;color:#111} h1{font-size:18px}</style>
        </head>
        <body>
          <h1>Rapport quotidien - ${new Date(data.datetime).toLocaleString()}</h1>
          <p>${data.weather_summary}</p>
          <p>Indice AQI: <strong style="color:${data.AQI_color_code}">${data.AQI_total_pred}</strong> — ${data.AQI_level_text}</p>
          <h2>Composition</h2>
          <ul>
            ${data.main_pollutants.map(p => `<li>${p}: ${(data.pollutant_percentages?.[p] ?? 0).toFixed(0)}%</li>`).join('')}
          </ul>
          <h2>Prévisions 24h</h2>
          <table border="1" cellpadding="6" cellspacing="0">
            <thead><tr><th>Heure</th><th>Temp (°C)</th><th>Vent (m/s)</th><th>Humidité (%)</th><th>Pression (hPa)</th><th>AQI</th></tr></thead>
            <tbody>
              ${data.forecast_next_24h?.map(h => `<tr><td>${new Date(h.datetime).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</td><td>${h.temperature_pred_C}</td><td>${h.wind_speed_pred_ms}</td><td>${h.humidity_pred_percent}</td><td>${h.pressure_pred_hPa}</td><td>${h.AQI_total_pred}</td></tr>`).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
    setTimeout(() => w.print(), 500);
  };

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
        <h2 className="text-white">Rapport quotidien</h2>
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-white/70 text-sm">
          <p className="mb-3">Résumé: {data?.weather_summary || 'Non disponible'}</p>
          <p>Indice AQI: <span style={{ color: data?.AQI_color_code }}>{data?.AQI_total_pred ?? '-'}</span> — {data?.AQI_level_text || '-'}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleExportCSV} className="bg-white/10 border-white/20 text-white hover:bg-white/20">Exporter en CSV</Button>
          <Button onClick={handleExportPDF} className="bg-white/10 border-white/20 text-white hover:bg-white/20">Exporter en PDF</Button>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-white/70 text-sm">
          <h3 className="text-white mb-2">Composition de l’air</h3>
          <ul className="space-y-1">
            {data?.main_pollutants?.map((p) => (
              <li key={p} className="flex items-center justify-between">
                <span>{p}</span>
                <span>{(data.pollutant_percentages?.[p] ?? 0).toFixed(0)}%</span>
              </li>
            )) || <li>Aucune donnée</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
