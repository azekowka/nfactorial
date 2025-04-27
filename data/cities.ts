export interface City {
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  fillKey: string;
  date: string;
}

export const CITIES: City[] = [
  {name: 'Venice', latitude: 45.4408, longitude: 12.3155, radius: 3, fillKey: 'city', date: '1963-10'},
  // Not really a city, but we define just one type of "POI" (fillKey) for visual consistency
  {name: 'Khao Phing Kan', latitude: 8.2745, longitude: 98.5012, radius: 3, fillKey: 'city', date: '1974-12'},
  {name: 'San Francisco', latitude: 37.7749, longitude: -122.4194, radius: 3, fillKey: 'city', date: '1985-05'},
]; 