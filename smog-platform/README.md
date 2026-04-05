# SmogIQ — Photochemical Smog Intelligence Platform

A premium, futuristic SaaS-style web application for photochemical smog education, monitoring, simulation, and analysis. Built for an elite startup presentation.

## Features Included 🚀

1. **🌍 Live AQI Dashboard**: Real-time pollution data with auto-location, 24h animated trend charts, and PDF report generation.
2. **🧪 Smog Formation Simulator**: Interactive particle physics canvas showing NO₂, VOCs, and sunlight reacting to form ozone (O₃) and PAN.
3. **🧠 AI Smog Analyzer**: Intelligent risk calculator based on traffic, temp, wind, and humidity with actionable suggestions.
4. **🎮 Sensor Simulation Panel**: Two views — an Admin Control Panel with manual overrides (low/moderate/severe + custom sliders) and a Live User View with scanning animations and real-time updates.
5. **📍 Smart City Map**: Interactive Leaflet map with global smog hotspots, live AQI overlays, and a dynamic leaderboard.
6. **📚 Interactive Education Center**: Tab-based learning module converting PowerPoint notes into interactive visual timelines (featuring Delhi vs LA).
7. **💡 Solution Engine**: Interactive calculator showing the exact projected AQI impact of EV adoption, traffic reduction, and green cover.
8. **🎯 Prediction Engine**: 24-hour predictive modeling of air quality with threshold crossing alerts.

## Tech Stack 🛠

*   **Frontend**: Next.js 15 (App Router), React 19, TypeScript
*   **Styling**: Tailwind CSS v4, Framer Motion, Recharts
*   **Mapping**: Leaflet, React Leaflet
*   **Data APIs**: proxy routes for OpenWeather APIs

## Setup Instructions (Local) 💻

1. Make sure you have Node.js 20+ installed.
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Set your API Key: The `.env.local` file already contains your provided OpenWeather API Key.
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:3000` in your browser.

## Sensor Testing Instructions 🧪

We've built a fast polling-based real-time architecture that works natively on Vercel without WebSockets.

1. Open a normal browser tab to `http://localhost:3000/sensor` (this is the **User view**).
2. Open an Incognito window or second browser to `http://localhost:3000/sensor/admin` (this is the **Admin view**).
3. In the Admin view, click one of the massive colored severity buttons (e.g., "SEVERE").
4. Watch the User view instantly change its gauge, numbers, and colors in real-time.

## Deployment Steps (Vercel) ☁️

This app is specifically optimized for zero-config Vercel deployment.

1. Upload this entire repo to GitHub.
2. Go to [Vercel.com](https://vercel.com/) and click **Add New Project**.
3. Import your GitHub repository.
4. Under Environment Variables, add:
   *   `OPENWEATHER_API_KEY` = `your_api_key_here`
5. Click **Deploy**. That's it! Vercel handles all Next.js API routing automatically.

## API Integration Breakdown 🔌

*   `src/app/api/aqi/route.ts`: Fetches `/data/2.5/air_pollution` and `/weather` from OpenWeather. Contains a dummy data fallback if the API rate limits.
*   `src/app/api/predict/route.ts`: Leverages the 4-day forecast `/air_pollution/forecast` API combined with algorithmic time-of-day weighting.
*   `src/app/api/analyze/route.ts`: A custom weighting algorithm (Traffic * 0.4 + Temp * 0.25) to provide realistic risk factors based on conditions.

*Designed with 💙 for a visionary presentation.*
