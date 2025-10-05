import { Card } from '../ui/card';

interface Props {
  pollutants: string[];
  percentages: Record<string, number>;
}

export default function DominantPollutantsList({ pollutants, percentages }: Props) {
  return (
    <Card className="bg-white/5 border-white/10 p-4">
      <h3 className="text-white mb-3">Dominant Pollutants</h3>
      <ul className="space-y-2">
        {pollutants.map((p) => (
          <li key={p} className="flex items-center justify-between text-sm">
            <span className="text-white/80">{p}</span>
            <div className="flex items-center gap-2 min-w-[160px]">
              <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-white/40" style={{ width: `${Math.min(100, Math.max(0, percentages[p] ?? 0))}%` }} />
              </div>
              <span className="text-white/60">{(percentages[p] ?? 0).toFixed(0)}%</span>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
