# AirVista — Global Air Quality Monitoring

AirVista is a Vite + React (TypeScript) application that visualizes global air quality with a 3D globe, rich dashboards, health insights, and exportable reports. The UI is fully in English and designed to be responsive across devices.

## Features

- Interactive 3D globe with pollutant overlays (NO₂, O₃, PM2.5)
- Live-like synthetic data with optional hooks for real APIs (NASA TEMPO, OpenAQ, Open‑Meteo)
- Dashboard widgets: 24h AQI trend, dominant pollutants, day summary, detailed forecast table
- Health Assistant with adaptive tips, risk narratives, and suggested zones
- Side panel with AQI category, pollutant levels, disease probabilities, and data sources
- Daily Report screen with CSV/PDF export
- Alerts screen with filtering by pollutant and severity
- Accessibility-friendly dark mode, high contrast mode, keyboard focus, and ARIA labels
- Mobile-first responsive layout using Tailwind CSS v4

## Tech Stack

- Framework: React 19 + TypeScript
- Build tool: Vite 5
- Styling: Tailwind CSS v4 (utility-first) + CSS variables for theming
- Charts: Recharts
- 3D: three.js + @react-three/fiber + @react-three/drei
- UI Primitives: Radix UI (via custom wrappers in src/components/ui)
- Icons: lucide-react
- State/Context: React Context (src/context)

## Project Structure

- src/components
  - pages: high-level screens (Dashboard, RapportQuotidien for daily report, AnalyseSante for health analysis)
  - dashboard: dashboard widgets (Trend, Forecast, Pollutants, Day summary)
  - ui: reusable UI components (button, card, dialog, etc.)
  - Globe3D.tsx: 3D globe scene and data synthesis
  - HUD.tsx: bottom navigation and quick actions
  - NavigationBar.tsx: top navigation, layer toggles, time slider, settings
- src/context/AqiDataContext.tsx: shared AQI data state and helpers
- src/types/aqi.ts: shared types (forecast model, AQI types)
- src/lib: helpers (CSV export, notifications, sample data)
- src/styles/globals.css: theme variables and Tailwind layers

## Getting Started

1) Install dependencies

```
npm install
```

2) Start the dev server

```
npm run dev
```

- Local: http://localhost:5173/

3) Build for production

```
npm run build
```

4) Preview production build

```
npm run preview
```
Access link to the frontend of our application deployed on Vercel:  https://from-earth-data-to-action-n8j6-git-master-floridev07s-projects.vercel.app?_vercel_share=16ffiCaFBXWcfKmpNnKH7n3VGhGBmwhU
## Configuration

- Tailwind is configured via the new @tailwindcss/vite plugin and inline theme tokens in CSS.
- Dark mode and high-contrast mode are toggled by applying the .dark and .high-contrast classes to html. The UI exposes toggles in the Settings panel.
- Some components use synthetic data by default. Hooks and endpoints are present to connect:
  - NASA TEMPO (NO₂ / O₃)
  - OpenAQ (PM2.5)
  - Open‑Meteo (weather, winds)
  Update fetch functions in src/components/HealthAssistantPanel.tsx and src/components/Globe3D.tsx as needed.

## Internationalization

- The entire UI is currently in English. If you wish to add localization:
  - Introduce a translation layer (e.g., i18next) and wrap the app with a provider.
  - Extract visible strings into locale files (e.g., locales/en.json, locales/fr.json).
  - Replace hard-coded strings with translation keys across components.

## Responsiveness

- The layout is mobile-first and uses Tailwind utilities for breakpoints.
- Tables and wide content use overflow-x-auto on small screens.
- Navigation components were adjusted to wrap or shrink on narrow viewports.
- Test on common widths (360px, 768px, 1024px, 1280px) to validate UI.

## Accessibility

- Color variables support dark and high-contrast variants.
- Important interactive elements have ARIA labels.
- Focus outlines use outline-ring tokens and are visible in high-contrast mode.

## Data Model (simplified)

```
ForecastHour {
  datetime: string
  temperature_pred_C: number
  humidity_pred_percent: number
  wind_speed_pred_ms: number
  pressure_pred_hPa: number
  AQI_total_pred: number
  AQI_level_text: "Good" | "Moderate" | "Unhealthy" | "Very Unhealthy" | "Hazardous" | string
  main_pollutants: string[]
  AQI_color_code: string
}

AQIModelOutput {
  datetime: string
  AQI_total_pred: number
  AQI_level_text: string
  health_alert: string
  main_pollutants: string[]
  pollutant_percentages: Record<string, number>
  weather_summary: string
  temperature_pred_C: number
  humidity_pred_percent: number
  wind_speed_pred_ms: number
  pressure_pred_hPa: number
  forecast_next_24h: ForecastHour[]
  population_risk_groups: string[]
  recommended_actions: string[]
  disease_specific_risk: string
  AQI_color_code: string
}
```

## Development Notes

- Keep styling consistent: reuse existing utility classes and CSS variables; avoid inline styles when possible.
- Prefer accessible, descriptive labels for all UI controls.
- When adding charts or 3D layers, ensure performance at 60 FPS where feasible.
- Avoid committing secrets; use environment variables for API keys.

## Scripts

- npm run dev — start development server
- npm run build — type-check and build
- npm run preview — preview production build
- npm run lint — lint the codebase

## License

MIT
