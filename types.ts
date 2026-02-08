
export interface NASA_NEO {
  id: string;
  name: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: Array<{
    close_approach_date: string;
    close_approach_date_full: string;
    epoch_date_close_approach: number;
    relative_velocity: {
      kilometers_per_second: string;
      kilometers_per_hour: string;
      miles_per_hour: string;
    };
    miss_distance: {
      astronomical: string;
      lunar: string;
      kilometers: string;
      miles: string;
    };
    orbiting_body: string;
  }>;
  is_sentry_object: boolean;
}

export interface AsteroidRecord {
  id: number;
  created_at: string;
  name: string;
  kilometers_diameter: number;
  is_hazardous: boolean;
  nasa_id: string;
  miss_distance_km: number;
  velocity_kph: number;
  close_approach_date: string;
}

export type RiskLevel = 'Safe' | 'Watch' | 'Potentially Hazardous';

export interface User {
  username: string;
  watchlist: string[]; // array of nasa_ids
}
