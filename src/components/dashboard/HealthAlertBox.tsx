import { AlertTriangle } from 'lucide-react';

interface Props {
  alertText: string;
  actions: string[];
  color: string; // hex or rgb
}

export default function HealthAlertBox({ alertText, actions, color }: Props) {
  return (
    <div className="rounded-lg p-4 bg-white/5 border border-white/10" style={{ borderLeft: `4px solid ${color}` }}>
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-white/80" />
        <div className="flex-1">
          <h3 className="text-white mb-1">Alerte santé</h3>
          <p className="text-white/70 text-sm mb-3">{alertText}</p>
          {actions?.length > 0 && (
            <ul className="list-disc list-inside text-white/70 text-sm space-y-1">
              {actions.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
