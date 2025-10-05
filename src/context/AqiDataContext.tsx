import React, { createContext, useContext, useMemo, useState } from 'react';
import type { AQIModelOutput, AQIState } from '../types/aqi';

interface AqiContextValue extends AQIState {
  setData: (data: AQIModelOutput | null) => void;
  setSelectedDisease: (d: string | null) => void;
}

const AqiDataContext = createContext<AqiContextValue | undefined>(undefined);

import { SAMPLE_AQI } from '../lib/sampleAqi';

export function AqiDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AQIModelOutput | null>(SAMPLE_AQI);
  const [selectedDisease, setSelectedDisease] = useState<string | null>(null);

  const value = useMemo(() => ({ data, selectedDisease, setData, setSelectedDisease }), [data, selectedDisease]);
  return <AqiDataContext.Provider value={value}>{children}</AqiDataContext.Provider>;
}

export function useAqiData() {
  const ctx = useContext(AqiDataContext);
  if (!ctx) throw new Error('useAqiData must be used within AqiDataProvider');
  return ctx;
}
