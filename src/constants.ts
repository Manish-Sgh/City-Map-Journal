export const NOIDA_COORDS = {
  lat: 28.570900,
  lng: 77.372063,
};

export const DEFAULT_ZOOM = 14;

export const MAPBOX_TOKEN = 'pk.eyJ1IjoiYWlzdHVkaW8iLCJhIjoiY204YmN6YmN6MDB6ejJqcHpjMDB6ejJqcCJ9.MDB6ejJqcHpjMDB6ejJqc';

export const SEASONS = ['Spring', 'Summer', 'Autumn', 'Winter'] as const;

export const SEASON_PALETTES = {
  Spring: {
    sky: ['#0d1e12', '#162a1a', '#1e3a22', '#2a5a30', '#4a8a50', '#7ab07e', '#a0c8a4'],
    terrain: ['#0d1a0d', '#1a2e1a', '#243a24', '#3a5a3a', '#4e7a4e', '#6a9a6a', '#8ab88a'],
    fog: 'rgba(40,70,40,0.25)',
    tint: 'rgba(255,182,193,0.07)',
    particleColors: ['rgba(255,182,193,', 'rgba(255,200,220,', 'rgba(240,180,200,'],
  },
  Summer: {
    sky: ['#080e08', '#101a10', '#182818', '#243824', '#3a5a3a', '#5a7a5a', '#7a9a7a'],
    terrain: ['#060d06', '#0f1e0f', '#1a2e1a', '#2a4a2a', '#3d6b3d', '#5a8a5a', '#78a878'],
    fog: 'rgba(20,40,20,0.3)',
    tint: 'rgba(255,220,80,0.05)',
    particleColors: ['rgba(200,255,200,', 'rgba(180,230,180,', 'rgba(160,220,160,'],
  },
  Autumn: {
    sky: ['#120a04', '#1e1206', '#2a1a08', '#3a2410', '#5a3820', '#7a5230', '#9a7050'],
    terrain: ['#0e0804', '#1a1008', '#281810', '#3a2418', '#523420', '#6a4428', '#845040'],
    fog: 'rgba(50,30,10,0.35)',
    tint: 'rgba(160,60,10,0.09)',
    particleColors: ['rgba(220,100,30,', 'rgba(180,80,20,', 'rgba(240,140,40,', 'rgba(200,60,20,'],
  },
  Winter: {
    sky: ['#0a0c14', '#10141e', '#161e2a', '#202a3a', '#2e3e56', '#445672', '#607090'],
    terrain: ['#0c0e18', '#141822', '#1c2030', '#28303e', '#384050', '#4a5468', '#607080'],
    fog: 'rgba(20,25,45,0.35)',
    tint: 'rgba(180,210,250,0.08)',
    particleColors: ['rgba(220,235,255,', 'rgba(200,220,245,', 'rgba(240,245,255,'],
  },
};

export const DEMO_LOCATIONS = [
  { name: 'Lodhi Garden', x: '38%', y: '58%', lat: '28.5932° N', lng: '77.2197° E' },
  { name: 'India Gate', x: '55%', y: '52%', lat: '28.6129° N', lng: '77.2295° E' },
  { name: 'Khan Market', x: '62%', y: '60%', lat: '28.6006° N', lng: '77.2266° E' },
  { name: 'Morning Café', x: '45%', y: '62%', lat: '28.6021° N', lng: '77.2108° E' },
];
