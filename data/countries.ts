export interface CountryData {
  fillKey: string;
}

export interface Countries {
  [key: string]: CountryData;
}

export const COUNTRIES: Countries = {
  ITA: { fillKey: 'visited' },
  USA: { fillKey: 'visited' },
  THA: { fillKey: 'visited' },
}; 