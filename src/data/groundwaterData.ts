export interface GroundwaterReading {
  state: string;
  district: string;
  block: string;
  lat: number;
  lon: number;
  level_m: number;
  status: 'Critical' | 'Warning' | 'Moderate' | 'Good';
}

export const GROUNDWATER_DATA: GroundwaterReading[] = [
  { state: "Maharashtra", district: "Pune", block: "Haveli", lat: 18.5204, lon: 73.8567, level_m: 12.0, status: "Critical" },
  { state: "Maharashtra", district: "Nagpur", block: "Nagpur", lat: 21.1458, lon: 79.0882, level_m: 22.5, status: "Moderate" },
  { state: "Maharashtra", district: "Mumbai", block: "Mumbai Suburban", lat: 19.0760, lon: 72.8777, level_m: 8.5, status: "Critical" },
  { state: "Delhi", district: "New Delhi", block: "Central", lat: 28.6139, lon: 77.2090, level_m: 25.0, status: "Warning" },
  { state: "Karnataka", district: "Bengaluru", block: "Bangalore Urban", lat: 12.9716, lon: 77.5946, level_m: 18.2, status: "Moderate" },
  { state: "Karnataka", district: "Mysuru", block: "Mysuru", lat: 12.2958, lon: 76.6394, level_m: 28.5, status: "Good" },
  { state: "Tamil Nadu", district: "Chennai", block: "Chennai", lat: 13.0827, lon: 80.2707, level_m: 15.8, status: "Warning" },
  { state: "Tamil Nadu", district: "Coimbatore", block: "Coimbatore", lat: 11.0168, lon: 76.9558, level_m: 32.1, status: "Good" },
  { state: "Rajasthan", district: "Jaipur", block: "Jaipur", lat: 26.9124, lon: 75.7873, level_m: 9.1, status: "Critical" },
  { state: "Rajasthan", district: "Jodhpur", block: "Jodhpur", lat: 26.2389, lon: 73.0243, level_m: 6.8, status: "Critical" },
  { state: "Gujarat", district: "Ahmedabad", block: "Ahmedabad", lat: 23.0225, lon: 72.5714, level_m: 19.5, status: "Warning" },
  { state: "Gujarat", district: "Surat", block: "Surat", lat: 21.1702, lon: 72.8311, level_m: 24.7, status: "Moderate" },
  { state: "West Bengal", district: "Kolkata", block: "Kolkata", lat: 22.5726, lon: 88.3639, level_m: 35.2, status: "Good" },
  { state: "Uttar Pradesh", district: "Lucknow", block: "Lucknow", lat: 26.8467, lon: 80.9462, level_m: 16.8, status: "Warning" },
  { state: "Punjab", district: "Chandigarh", block: "Chandigarh", lat: 30.7333, lon: 76.7794, level_m: 21.4, status: "Moderate" }
];

// Haversine distance calculation
export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Find nearest groundwater data point
export function findNearestData(lat: number, lon: number): { entry: GroundwaterReading | null; distanceKm: number } {
  let best: GroundwaterReading | null = null;
  let bestDist = Infinity;
  
  for (const entry of GROUNDWATER_DATA) {
    const distance = haversineDistance(lat, lon, entry.lat, entry.lon);
    if (distance < bestDist) {
      bestDist = distance;
      best = entry;
    }
  }
  
  return { entry: best, distanceKm: bestDist };
}

// Calculate groundwater health score (0-100)
export function computeHealthScore(level_m: number, status: string): number {
  // Base score from water level depth (deeper is better)
  let score = Math.max(0, Math.min(100, Math.round((level_m / 40) * 100)));
  
  // Adjust based on status
  switch (status) {
    case 'Critical':
      score = Math.min(score, 30);
      break;
    case 'Warning':
      score = Math.min(score, 60);
      break;
    case 'Moderate':
      score = Math.min(score, 80);
      break;
    case 'Good':
      break; // No adjustment needed
  }
  
  return score;
}