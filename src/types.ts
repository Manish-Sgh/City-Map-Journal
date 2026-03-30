export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter';

export interface Entry {
  id: string;
  title: string;
  body: string;
  mood: string;
  location: {
    name: string;
    lat: string;
    lng: string;
    x: string;
    y: string;
  };
  tags: string[];
  date: string;
  weather: string;
  season: Season;
}

export interface AppState {
  season: Season;
  isNight: boolean;
  isSoundOn: boolean;
}
