import { NextRequest, NextResponse } from "next/server";

// GET /api/aqi?lat=28.6139&lon=77.2090
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat") || "28.6139";
  const lon = searchParams.get("lon") || "77.2090";
  const apiKey = process.env.OPENWEATHER_API_KEY;

  try {
    // Fetch current air pollution data
    const pollutionRes = await fetch(
      `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`,
      { next: { revalidate: 300 } } // Cache for 5 minutes
    );

    // Fetch weather data for temperature + city name
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`,
      { next: { revalidate: 300 } }
    );

    // Fetch forecast for charts
    const forecastRes = await fetch(
      `http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`,
      { next: { revalidate: 600 } }
    );

    if (!pollutionRes.ok) {
      throw new Error(`OpenWeather API error: ${pollutionRes.status}`);
    }

    const pollutionData = await pollutionRes.json();
    const weatherData = weatherRes.ok ? await weatherRes.json() : null;
    const forecastData = forecastRes.ok ? await forecastRes.json() : null;

    const current = pollutionData.list[0];

    // Map OpenWeather AQI (1-5) to standard US AQI scale
    const owAqi = current.main.aqi;
    const aqiMap: Record<number, number> = { 1: 25, 2: 75, 3: 125, 4: 175, 5: 350 };
    const standardAqi = aqiMap[owAqi] || 100;

    // Build response
    const response = {
      aqi: standardAqi,
      owAqi: owAqi,
      city: weatherData?.name || "Unknown",
      country: weatherData?.sys?.country || "",
      temperature: weatherData?.main?.temp || null,
      humidity: weatherData?.main?.humidity || null,
      wind: weatherData?.wind?.speed || null,
      components: {
        pm2_5: current.components.pm2_5,
        pm10: current.components.pm10,
        no2: current.components.no2,
        o3: current.components.o3,
        so2: current.components.so2,
        co: current.components.co,
        no: current.components.no,
        nh3: current.components.nh3,
      },
      // Get 24-hour forecast data points (every 1 hour, take 24)
      forecast: forecastData?.list?.slice(0, 24).map((item: { dt: number; main: { aqi: number }; components: { pm2_5: number; no2: number; o3: number } }) => ({
        dt: item.dt,
        aqi: aqiMap[item.main.aqi] || 100,
        pm2_5: item.components.pm2_5,
        no2: item.components.no2,
        o3: item.components.o3,
      })) || [],
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("AQI API Error:", error);

    // Fallback mock data so the UI always works
    return NextResponse.json({
      aqi: 142,
      owAqi: 3,
      city: "Demo City",
      country: "IN",
      temperature: 32,
      humidity: 65,
      wind: 3.5,
      components: {
        pm2_5: 55.2,
        pm10: 98.4,
        no2: 42.1,
        o3: 88.7,
        so2: 12.3,
        co: 1234.5,
        no: 8.2,
        nh3: 15.6,
      },
      forecast: Array.from({ length: 24 }, (_, i) => ({
        dt: Math.floor(Date.now() / 1000) + i * 3600,
        aqi: 100 + Math.round(Math.sin(i / 4) * 50 + Math.random() * 30),
        pm2_5: 30 + Math.round(Math.sin(i / 3) * 20 + Math.random() * 10),
        no2: 20 + Math.round(Math.sin(i / 5) * 15 + Math.random() * 8),
        o3: 50 + Math.round(Math.sin(i / 4) * 30 + Math.random() * 15),
      })),
      timestamp: new Date().toISOString(),
      mock: true,
    });
  }
}
