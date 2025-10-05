export type AQILevel = "Bon" | "Modéré" | "Mauvais" | "Très mauvais" | "Dangereux";

export interface ForecastHour {
  datetime: string; // ISO string or HH:mm
  temperature_pred_C: number;
  humidity_pred_percent: number;
  wind_speed_pred_ms: number;
  pressure_pred_hPa: number;
  AQI_total_pred: number;
  AQI_level_text: AQILevel | string;
  main_pollutants: string[];
  AQI_color_code: string; // HEX or rgb()
}

export interface AQIModelOutput {
  datetime: string; // current timestamp
  AQI_total_pred: number;
  AQI_level_text: AQILevel | string;
  health_alert: string;
  main_pollutants: string[];
  pollutant_percentages: Record<string, number>; // e.g., { CO: 15, NO2: 35 }
  weather_summary: string;
  temperature_pred_C: number;
  humidity_pred_percent: number;
  wind_speed_pred_ms: number;
  pressure_pred_hPa: number;
  forecast_next_24h: ForecastHour[];
  population_risk_groups: string[];
  recommended_actions: string[];
  disease_specific_risk: string; // description for current disease selection
  AQI_color_code: string; // primary color for current AQI
  visual_summary_chart?: { points: Array<{ datetime: string; value: number; color: string }>; };
}

export interface AQIState {
  data: AQIModelOutput | null;
  selectedDisease: string | null;
}
