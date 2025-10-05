import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useAqiData } from '../../context/AqiDataContext';

const OPTIONS = ["Asthme", "Hypertension", "BPCO", "Diabète", "Grossesse", "Aucune"] as const;

export default function DiseaseSelector() {
  const { selectedDisease, setSelectedDisease } = useAqiData();
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
      <h3 className="text-white mb-2">Sélectionner une maladie</h3>
      <Select value={selectedDisease || "Aucune"} onValueChange={(v) => setSelectedDisease(v === 'Aucune' ? null : v)}>
        <SelectTrigger className="max-w-xs text-white">
          <SelectValue placeholder="Aucune" />
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
