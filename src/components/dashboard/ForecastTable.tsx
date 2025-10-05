import type { ForecastHour } from '../../types/aqi';

interface Props {
  data: ForecastHour[];
}

export default function ForecastTable({ data }: Props) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4 overflow-x-auto">
      <h3 className="text-white mb-3">Detailed forecast (next day)</h3>
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="text-white/60">
            <th className="py-2 pr-4">Time</th>
            <th className="py-2 pr-4">Temperature (°C)</th>
            <th className="py-2 pr-4">Wind (m/s)</th>
            <th className="py-2 pr-4">Humidity (%)</th>
            <th className="py-2 pr-4">Pressure (hPa)</th>
            <th className="py-2 pr-4">Predicted AQI</th>
            <th className="py-2 pr-4">AQI Level</th>
            <th className="py-2 pr-4">Dominant pollutants</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((row) => (
            <tr key={row.datetime} className="border-t border-white/10">
              <td className="py-2 pr-4 text-white/80">{row.datetime}</td>
              <td className="py-2 pr-4 text-white">{row.temperature_pred_C.toFixed(1)}</td>
              <td className="py-2 pr-4 text-white">{row.wind_speed_pred_ms.toFixed(1)}</td>
              <td className="py-2 pr-4 text-white">{row.humidity_pred_percent.toFixed(0)}</td>
              <td className="py-2 pr-4 text-white">{row.pressure_pred_hPa.toFixed(0)}</td>
              <td className="py-2 pr-4" style={{ color: row.AQI_color_code }}>{row.AQI_total_pred.toFixed(0)}</td>
              <td className="py-2 pr-4 text-white/80">{row.AQI_level_text}</td>
              <td className="py-2 pr-4 text-white/80">{row.main_pollutants.join(', ')}</td>
            </tr>
          ))}
          {!data?.length && (
            <tr>
              <td className="py-4 text-white/60" colSpan={8}>No forecast data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
