import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat") || "28.6139";
  const lon = searchParams.get("lon") || "77.2090";
  const apiKey = process.env.OPENWEATHER_API_KEY;

  try {
    const res = await fetch(
      `http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`,
      { next: { revalidate: 600 } }
    );

    if (!res.ok) throw new Error("Forecast API failed");

    const data = await res.json();
    const aqiMap: Record<number, number> = { 1: 25, 2: 75, 3: 125, 4: 175, 5: 350 };

    // Get next 24 hourly data points
    const predictions = data.list.slice(0, 24).map((item: { dt: number; main: { aqi: number }; components: { pm2_5: number; no2: number; o3: number } }, index: number) => {
      const date = new Date(item.dt * 1000);
      return {
        hour: index,
        label: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
        aqi: aqiMap[item.main.aqi] || 100,
        pm2_5: item.components.pm2_5,
        no2: item.components.no2,
        o3: item.components.o3,
      };
    });

    return NextResponse.json({ predictions, source: "openweather" });
  } catch {
    // Fallback predictions using time-of-day pattern
    const now = new Date();
    const predictions = Array.from({ length: 24 }, (_, i) => {
      const hour = (now.getHours() + i) % 24;
      const timeMultiplier = hour >= 11 && hour <= 15 ? 1.3 : hour >= 8 && hour <= 10 ? 1.1 : hour >= 0 && hour <= 5 ? 0.6 : 0.9;
      const baseAqi = 120;
      return {
        hour: i,
        label: `${hour.toString().padStart(2, "0")}:00`,
        aqi: Math.round(baseAqi * timeMultiplier + (Math.random() - 0.5) * 40),
        pm2_5: Math.round(35 * timeMultiplier + Math.random() * 15),
        no2: Math.round(28 * timeMultiplier + Math.random() * 10),
        o3: Math.round(55 * timeMultiplier + Math.random() * 20),
      };
    });

    return NextResponse.json({ predictions, source: "model" });
  }
}
