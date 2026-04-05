// ─── AQI Level Definitions ────────────────────────────────
export const AQI_LEVELS = [
  { label: 'Good', range: [0, 50], color: '#10b981', bg: 'rgba(16,185,129,0.15)', emoji: '😊' },
  { label: 'Moderate', range: [51, 100], color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', emoji: '😐' },
  { label: 'Unhealthy (Sensitive)', range: [101, 150], color: '#f97316', bg: 'rgba(249,115,22,0.15)', emoji: '😷' },
  { label: 'Unhealthy', range: [151, 200], color: '#ef4444', bg: 'rgba(239,68,68,0.15)', emoji: '🤢' },
  { label: 'Very Unhealthy', range: [201, 300], color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)', emoji: '🤮' },
  { label: 'Hazardous', range: [301, 500], color: '#dc2626', bg: 'rgba(220,38,38,0.15)', emoji: '☠️' },
] as const;

// ─── Pollutant Info ──────────────────────────────────────
export const POLLUTANTS = {
  pm2_5: { name: 'PM2.5', unit: 'µg/m³', icon: '🫁', safe: 15, danger: 75 },
  pm10: { name: 'PM10', unit: 'µg/m³', icon: '💨', safe: 45, danger: 150 },
  no2: { name: 'NO₂', unit: 'µg/m³', icon: '🏭', safe: 40, danger: 200 },
  o3: { name: 'O₃', unit: 'µg/m³', icon: '☀️', safe: 60, danger: 180 },
  so2: { name: 'SO₂', unit: 'µg/m³', icon: '🌋', safe: 20, danger: 350 },
  co: { name: 'CO', unit: 'µg/m³', icon: '🚗', safe: 4400, danger: 15400 },
} as const;

// ─── City Data for Map & Analysis ────────────────────────
export const CITIES = [
  { name: 'Delhi', lat: 28.6139, lng: 77.209, country: 'India', aqi: 312, description: 'Severe pollution from vehicles, industry, and crop burning' },
  { name: 'Los Angeles', lat: 34.0522, lng: -118.2437, country: 'USA', aqi: 78, description: 'Improved via strict regulations and EV adoption' },
  { name: 'Beijing', lat: 39.9042, lng: 116.4074, country: 'China', aqi: 185, description: 'Industrial smog with heavy coal usage' },
  { name: 'London', lat: 51.5074, lng: -0.1278, country: 'UK', aqi: 52, description: 'Congestion zones and green policies helping' },
  { name: 'Mumbai', lat: 19.076, lng: 72.8777, country: 'India', aqi: 198, description: 'Vehicle emissions and construction dust' },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503, country: 'Japan', aqi: 45, description: 'Strict emissions standards, clean public transport' },
  { name: 'São Paulo', lat: -23.5505, lng: -46.6333, country: 'Brazil', aqi: 95, description: 'Vehicle-heavy city with biofuel adoption' },
  { name: 'Cairo', lat: 30.0444, lng: 31.2357, country: 'Egypt', aqi: 165, description: 'Desert dust compounds vehicle emissions' },
  { name: 'Lagos', lat: 6.5244, lng: 3.3792, country: 'Nigeria', aqi: 210, description: 'Rapid urbanization, generator fumes' },
  { name: 'Paris', lat: 48.8566, lng: 2.3522, country: 'France', aqi: 48, description: 'Diesel bans and cycling infrastructure' },
] as const;

// ─── India Regional Data for Heatmap ─────────────────────
export const INDIA_REGIONS = [
  { name: 'Delhi NCR (Central)', pincode: '110001', lat: 28.6139, lng: 77.209, aqi: 350, description: 'Severe core. High traffic & stubble burning.' },
  { name: 'Delhi (Narela)', pincode: '110040', lat: 28.8428, lng: 77.0926, aqi: 410, description: 'Industrial severe zone.' },
  { name: 'Gurugram', pincode: '122001', lat: 28.4595, lng: 77.0266, aqi: 320, description: 'High vehicle emissions.' },
  { name: 'Noida', pincode: '201301', lat: 28.5355, lng: 77.3910, aqi: 330, description: 'Construction dust and traffic.' },
  { name: 'Amritsar', pincode: '143001', lat: 31.6340, lng: 74.8723, aqi: 280, description: 'Agricultural residue burning.' },
  { name: 'Lucknow', pincode: '226001', lat: 26.8467, lng: 80.9462, aqi: 250, description: 'Poor ventilation, high dust.' },
  { name: 'Patna', pincode: '800001', lat: 25.5941, lng: 85.1376, aqi: 290, description: 'High PM2.5 from brick kilns.' },
  { name: 'Kolkata', pincode: '700001', lat: 22.5726, lng: 88.3639, aqi: 180, description: 'Traffic congestion smog.' },
  { name: 'Mumbai (Bandra)', pincode: '400050', lat: 19.0596, lng: 72.8295, aqi: 150, description: 'Coastal breeze helps, but heavy traffic.' },
  { name: 'Mumbai (Navi)', pincode: '400703', lat: 19.0330, lng: 73.0297, aqi: 170, description: 'Industrial zone outputs.' },
  { name: 'Pune', pincode: '411001', lat: 18.5204, lng: 73.8567, aqi: 120, description: 'Moderate valley pollution.' },
  { name: 'Bangalore (Urban)', pincode: '560001', lat: 12.9716, lng: 77.5946, aqi: 90, description: 'Traffic bottleneck but green cover.' },
  { name: 'Bangalore (Whitefield)', pincode: '560066', lat: 12.9698, lng: 77.7499, aqi: 110, description: 'Tech park congestion.' },
  { name: 'Chennai', pincode: '600001', lat: 13.0827, lng: 80.2707, aqi: 85, description: 'Coastal air dispersion.' },
  { name: 'Hyderabad', pincode: '500001', lat: 17.3850, lng: 78.4867, aqi: 105, description: 'Moderate traffic emissions.' },
  { name: 'Ahmedabad', pincode: '380001', lat: 23.0225, lng: 72.5714, aqi: 190, description: 'Industrial city smog.' },
  { name: 'Jaipur', pincode: '302001', lat: 26.9124, lng: 75.7873, aqi: 160, description: 'Dust storms + traffic.' },
  { name: 'Shimla', pincode: '171001', lat: 31.1048, lng: 77.1734, aqi: 35, description: 'Clean Himalayan air.' },
  { name: 'Ooty', pincode: '643001', lat: 11.4102, lng: 76.6950, aqi: 25, description: 'Pristine forest areas.' },
  { name: 'Guwahati', pincode: '781001', lat: 26.1158, lng: 91.7086, aqi: 130, description: 'Valley trapped emissions.' },
  { name: 'Kochi', pincode: '682001', lat: 9.9312, lng: 76.2673, aqi: 45, description: 'Good coastal air quality.' },
] as const;

// ─── Education Content ───────────────────────────────────
export const SMOG_DEFINITION = {
  title: 'What is Photochemical Smog?',
  formula: 'Sunlight + NOₓ + VOCs → O₃ + PAN + Aldehydes',
  description: 'Photochemical smog is a type of air pollution produced when sunlight reacts with nitrogen oxides (NOₓ) and volatile organic compounds (VOCs) in the atmosphere. This reaction creates ground-level ozone (O₃) and peroxyacetyl nitrate (PAN), which are harmful to human health and the environment.',
};

export const REACTION_STEPS = [
  { step: 1, equation: 'NO₂ + UV light → NO + O', description: 'UV radiation breaks nitrogen dioxide into nitric oxide and atomic oxygen', color: '#f59e0b' },
  { step: 2, equation: 'O + O₂ → O₃', description: 'Atomic oxygen combines with molecular oxygen to form ground-level ozone', color: '#ef4444' },
  { step: 3, equation: 'NO + O₃ → NO₂ + O₂', description: 'Nitric oxide reacts with ozone, regenerating NO₂ (cycle continues)', color: '#8b5cf6' },
  { step: 4, equation: 'VOCs + NOₓ + UV → PAN + Aldehydes', description: 'VOCs enter the cycle, producing peroxyacetyl nitrate and aldehydes — the smog', color: '#06b6d4' },
];

export const CAUSES = [
  { icon: '🚗', title: 'Vehicle Emissions', description: 'Cars, trucks, and buses emit NOₓ and VOCs from incomplete combustion of fossil fuels.', stat: '~60% of NOₓ' },
  { icon: '🏭', title: 'Industrial Activity', description: 'Factories and power plants release massive amounts of nitrogen oxides and volatile chemicals.', stat: '~25% of VOCs' },
  { icon: '🏙️', title: 'Urbanization', description: 'Concrete jungles trap heat (urban heat island) intensifying photochemical reactions.', stat: '+2-5°C hotter' },
  { icon: '🔥', title: 'Biomass Burning', description: 'Crop stubble burning and wildfires inject huge amounts of particulates and precursors.', stat: 'Delhi: Oct-Nov' },
];

export const HEALTH_EFFECTS = [
  { icon: '🫁', title: 'Respiratory Issues', description: 'Ozone irritates airways, triggers asthma attacks, reduces lung function', severity: 'Critical' },
  { icon: '👁️', title: 'Eye Irritation', description: 'PAN and aldehydes cause burning, watering, and redness of eyes', severity: 'Moderate' },
  { icon: '🧬', title: 'Long-term Diseases', description: 'Chronic exposure linked to lung cancer, heart disease, and reduced life expectancy', severity: 'Severe' },
  { icon: '🧠', title: 'Neurological Impact', description: 'Fine particulates can cross blood-brain barrier, linked to cognitive decline', severity: 'Emerging' },
];

export const ENVIRONMENTAL_EFFECTS = [
  { icon: '🌾', title: 'Crop Damage', description: 'Ozone stunts plant growth, reduces crop yields by up to 30%' },
  { icon: '🌫️', title: 'Reduced Visibility', description: 'Fine particles scatter light, creating haze that can reduce visibility to <1 km' },
  { icon: '🌡️', title: 'Climate Effects', description: 'Smog components act as greenhouse gases, trapping additional heat' },
  { icon: '🌊', title: 'Ecosystem Damage', description: 'Acid deposition from NOₓ harms aquatic life and soil chemistry' },
];

// ─── Solutions ───────────────────────────────────────────
export const SOLUTIONS = [
  { icon: '🔌', title: 'Electric Vehicles', description: 'Replace combustion engines with EVs to eliminate tailpipe NOₓ and VOC emissions', impact: 'Up to 40% NOₓ reduction', category: 'transport' },
  { icon: '🚦', title: 'Smart Traffic Management', description: 'AI-powered traffic flow optimization reduces idling and congestion emissions', impact: '15-25% emission reduction', category: 'transport' },
  { icon: '🌳', title: 'Green Urban Planning', description: 'Urban forests and green corridors absorb pollutants and cool the city', impact: '5-15% pollution absorption', category: 'planning' },
  { icon: '🏭', title: 'Industrial Scrubbers', description: 'Mandate catalytic converters and scrubbers on all industrial exhaust', impact: '60-90% NOₓ capture', category: 'regulation' },
  { icon: '☀️', title: 'Renewable Energy', description: 'Transition power generation from coal/gas to solar, wind, and hydro', impact: '70% fewer power plant emissions', category: 'energy' },
  { icon: '🚇', title: 'Public Transit Expansion', description: 'Efficient metro and bus rapid transit systems reduce private vehicle use', impact: '30% fewer vehicles on road', category: 'transport' },
];
