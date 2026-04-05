import { AQI_LEVELS } from './constants';

// Get AQI level info based on AQI value
export function getAqiLevel(aqi: number) {
  return AQI_LEVELS.find(l => aqi >= l.range[0] && aqi <= l.range[1]) || AQI_LEVELS[AQI_LEVELS.length - 1];
}

// Convert OpenWeather AQI (1-5) to standard AQI (0-500) scale
export function owAqiToStandard(owAqi: number): number {
  const map: Record<number, number> = { 1: 25, 2: 75, 3: 125, 4: 175, 5: 350 };
  return map[owAqi] || 100;
}

// Calculate smog risk percentage based on inputs
export function calculateSmogRisk(params: {
  nox: number;      // 0-100
  voc: number;      // 0-100
  sunlight: number; // 0-100
  temperature: number; // °C
  wind: number;     // km/h
  traffic: number;  // 0-100
}): number {
  const { nox, voc, sunlight, temperature, wind, traffic } = params;
  // Weighted formula: smog forms when NOx + VOCs + sunlight are high, wind is low
  const precursorFactor = (nox * 0.35 + voc * 0.3 + traffic * 0.15) / 80;
  const uvFactor = sunlight / 100;
  const tempFactor = Math.min(temperature / 40, 1); // Higher temp = more reaction
  const windFactor = Math.max(0, 1 - wind / 30); // Wind disperses pollutants
  const risk = precursorFactor * uvFactor * tempFactor * windFactor * 100;
  return Math.round(Math.min(100, Math.max(0, risk)));
}

// Generate 24-hour AQI prediction based on current value
export function predictAqi24h(currentAqi: number): { hour: number; aqi: number; label: string }[] {
  const predictions = [];
  const now = new Date();
  for (let i = 0; i < 24; i++) {
    const hour = (now.getHours() + i) % 24;
    // Simulate daily pattern: rises in morning rush, peaks afternoon, dips at night
    const timeMultiplier = getTimeMultiplier(hour);
    const noise = (Math.random() - 0.5) * 30;
    const predicted = Math.round(Math.max(10, currentAqi * timeMultiplier + noise));
    const h = hour.toString().padStart(2, '0') + ':00';
    predictions.push({ hour: i, aqi: predicted, label: h });
  }
  return predictions;
}

function getTimeMultiplier(hour: number): number {
  // Peaks at 2pm (14:00), lowest at 4am
  if (hour >= 0 && hour < 5) return 0.6;
  if (hour >= 5 && hour < 8) return 0.85;   // Morning buildup
  if (hour >= 8 && hour < 11) return 1.1;    // Morning rush
  if (hour >= 11 && hour < 15) return 1.3;   // Peak UV + traffic
  if (hour >= 15 && hour < 18) return 1.15;  // Afternoon
  if (hour >= 18 && hour < 21) return 0.9;   // Evening
  return 0.7; // Night
}

// Format number with commas
export function formatNumber(num: number): string {
  return num.toLocaleString('en-IN');
}

// Clamp a value between min and max
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
