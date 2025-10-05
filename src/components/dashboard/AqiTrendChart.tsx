import type { ForecastHour } from '../../types/aqi';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Scatter } from 'recharts';

interface Props {
  data: ForecastHour[];
}

export default function AqiTrendChart({ data }: Props) {
  const chartData = data.map(d => ({
    datetime: new Date(d.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    value: d.AQI_total_pred,
    color: d.AQI_color_code || '#22c55e',
  }));

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
      <h3 className="text-black mb-3">24h AQI Trend</h3>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="aqiFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#00000020" />
            <XAxis dataKey="datetime" stroke="#00000060" tick={{ fill: '#00000099', fontSize: 12 }} />
            <YAxis stroke="#00000060" tick={{ fill: '#00000099', fontSize: 12 }} />
            <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #00000020', borderRadius: 8 }} />
            <Area type="monotone" dataKey="value" stroke="#22c55e" fillOpacity={1} fill="url(#aqiFill)" dot={(p: any) => {
              const { cx, cy, payload } = p;
              return <circle key={`${payload.datetime}-dot`} cx={cx} cy={cy} r={4} fill={payload.color} />;
            }} />
            <Scatter data={chartData} shape={(p: any) => {
              const { cx, cy, payload } = p;
              return <circle key={`${payload.datetime}-scatter`} cx={cx} cy={cy} r={4} fill={payload.color} />;
            }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
