declare module '@turf/turf' {
  export function lineString(coordinates: number[][]): any;
  export function length(line: any, options?: { units: string }): number;
  export function along(line: any, distance: number, options?: { units: string }): any;
  export function point(coordinates: number[] | [number, number]): any;
  export function bearing(point1: any, point2: any): number;
  // Add any other functions you might need
} 