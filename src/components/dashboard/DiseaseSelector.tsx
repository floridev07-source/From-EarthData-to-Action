import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useAqiData } from '../../context/AqiDataContext';

const OPTIONS = ["Asthma", "Hypertension", "COPD", "Diabetes", "Pregnancy", "None"] as const;

export default function DiseaseSelector() {
  const { selectedDisease, setSelectedDisease } = useAqiData();
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
      <h3 className="text-white mb-2">Select a condition</h3>
      <Select value={selectedDisease || "None"} onValueChange={(v) => setSelectedDisease(v === 'None' ? null : v)}>
        <SelectTrigger className="max-w-xs text-white">
          <SelectValue placeholder="None" />
        </SelectTrigger>
        <SelectContent>
          {OPTIONS.map((o) => (
            <SelectItem value={o} key={o}>{o}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
