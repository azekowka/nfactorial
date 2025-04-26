export interface Coordinates {
  lng: number;
  lat: number;
}

export interface Country {
  name: string;
  code: string;
  coordinates: Coordinates;
  status?: 'visited' | 'want-to-visit' | null;
}

export interface RoutePoint {
  coordinates: Coordinates;
  timestamp: number;
}

export interface AnimationConfig {
  duration: number;
  speed: number;
}

export interface MapAnimationState {
  isPlaying: boolean;
  progress: number;
  currentRouteIndex: number;
}

export interface VideoExportOptions {
  format: 'mp4' | 'gif' | 'webm';
  quality: 'low' | 'medium' | 'high';
  duration: number;
}

export type VehicleType = 'airplane' | 'person' | 'car'; 