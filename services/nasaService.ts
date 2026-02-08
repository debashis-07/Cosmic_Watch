
import { NASA_NEO, AsteroidRecord } from '../types';

const NASA_API_KEY = 'DEMO_KEY'; // In a real app, this would be an environment variable
const BASE_URL = 'https://api.nasa.gov/neo/rest/v1';

export const fetchTodayNEOs = async (): Promise<AsteroidRecord[]> => {
  const today = new Date().toISOString().split('T')[0];
  try {
    const response = await fetch(`${BASE_URL}/feed?start_date=${today}&end_date=${today}&api_key=${NASA_API_KEY}`);
    if (!response.ok) throw new Error('NASA API Error');
    const data = await response.json();
    
    const rawList: NASA_NEO[] = data.near_earth_objects[today] || [];
    
    return rawList.map((neo, index) => ({
      id: index + 1,
      created_at: new Date().toISOString(),
      name: neo.name,
      kilometers_diameter: (neo.estimated_diameter.kilometers.estimated_diameter_min + neo.estimated_diameter.kilometers.estimated_diameter_max) / 2,
      is_hazardous: neo.is_potentially_hazardous_asteroid,
      nasa_id: neo.id,
      miss_distance_km: parseFloat(neo.close_approach_data[0].miss_distance.kilometers),
      velocity_kph: parseFloat(neo.close_approach_data[0].relative_velocity.kilometers_per_hour),
      close_approach_date: neo.close_approach_data[0].close_approach_date
    }));
  } catch (error) {
    console.error("Failed to fetch NEOs:", error);
    return [];
  }
};
