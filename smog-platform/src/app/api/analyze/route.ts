import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { city, traffic, temperature, wind, humidity } = body;

  // Calculate smog risk using weighted formula
  const trafficFactor = (traffic || 50) / 100;
  const tempFactor = Math.min((temperature || 30) / 45, 1);
  const windFactor = Math.max(0, 1 - (wind || 5) / 30);
  const humidityFactor = humidity ? Math.min(humidity / 100, 1) * 0.3 + 0.7 : 0.85;

  const baseRisk = trafficFactor * 0.4 + tempFactor * 0.25 + windFactor * 0.2 + (1 - humidityFactor) * 0.15;
  const riskPercent = Math.round(Math.min(100, Math.max(5, baseRisk * 100 * 1.3)));

  // Determine severity level
  let severity: string, color: string, warning: string;
  if (riskPercent < 25) {
    severity = "Low";
    color = "#10b981";
    warning = "Air quality is likely good. Enjoy outdoor activities.";
  } else if (riskPercent < 50) {
    severity = "Moderate";
    color = "#f59e0b";
    warning = "Sensitive individuals should limit prolonged outdoor exertion.";
  } else if (riskPercent < 75) {
    severity = "High";
    color = "#f97316";
    warning = "Everyone may experience health effects. Reduce outdoor activities.";
  } else {
    severity = "Severe";
    color = "#ef4444";
    warning = "Health alert: Serious health effects possible. Avoid outdoor exposure.";
  }

  // Generate suggestions based on conditions
  const suggestions = [];
  if (traffic > 60) suggestions.push({ icon: "🚗", text: "Heavy traffic detected. Use public transport or carpool." });
  if (traffic > 40) suggestions.push({ icon: "🚦", text: "Consider traveling during off-peak hours to reduce exposure." });
  if (temperature > 30) suggestions.push({ icon: "☀️", text: "High temperature accelerates smog formation. Stay hydrated indoors." });
  if (temperature > 35) suggestions.push({ icon: "🏠", text: "Extreme heat: Photochemical reactions peak. Keep windows closed." });
  if (wind < 10) suggestions.push({ icon: "🌬️", text: "Low wind conditions trap pollutants. Use air purifiers." });
  if (riskPercent > 50) suggestions.push({ icon: "😷", text: "Wear an N95 mask if you must go outdoors." });
  if (riskPercent > 30) suggestions.push({ icon: "🌳", text: "Stay near green spaces — trees absorb NO₂ and O₃." });
  suggestions.push({ icon: "📱", text: "Monitor real-time AQI updates on our dashboard." });

  return NextResponse.json({
    city: city || "Unknown City",
    risk: riskPercent,
    severity,
    color,
    warning,
    suggestions,
    factors: {
      traffic: Math.round(trafficFactor * 100),
      temperature: Math.round(tempFactor * 100),
      windDispersion: Math.round((1 - windFactor) * 100),
      humidity: Math.round(humidityFactor * 100),
    },
    timestamp: new Date().toISOString(),
  });
}
