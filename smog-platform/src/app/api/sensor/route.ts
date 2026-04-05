import { NextRequest, NextResponse } from "next/server";

// In-memory sensor state (works perfectly for dev + single Vercel instance)
let sensorState = {
  level: "analyzing" as "low" | "moderate" | "severe" | "analyzing",
  aqi: 0,
  pm25: 0,
  no2: 0,
  o3: 0,
  timestamp: Date.now(),
  updatedBy: "system",
};

// GET - User polls for current sensor data
export async function GET() {
  return NextResponse.json(sensorState);
}

// POST - Admin pushes new sensor data
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { level, aqi, pm25, no2, o3 } = body;

  // Preset values for quick buttons
  const presets: Record<string, { aqi: number; pm25: number; no2: number; o3: number }> = {
    low: { aqi: 35, pm25: 12, no2: 18, o3: 40 },
    moderate: { aqi: 115, pm25: 45, no2: 65, o3: 95 },
    severe: { aqi: 340, pm25: 180, no2: 150, o3: 220 },
  };

  if (level && presets[level]) {
    sensorState = {
      level,
      ...presets[level],
      timestamp: Date.now(),
      updatedBy: "admin",
    };
  } else {
    sensorState = {
      level: level || "moderate",
      aqi: aqi ?? sensorState.aqi,
      pm25: pm25 ?? sensorState.pm25,
      no2: no2 ?? sensorState.no2,
      o3: o3 ?? sensorState.o3,
      timestamp: Date.now(),
      updatedBy: "admin",
    };
  }

  return NextResponse.json({ success: true, state: sensorState });
}
