import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { NOIDA_COORDS, DEFAULT_ZOOM, MAPBOX_TOKEN } from '../constants';

mapboxgl.accessToken = MAPBOX_TOKEN;

interface MapProps {
  isNight: boolean;
}

const Map: React.FC<MapProps> = ({ isNight }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: isNight ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [NOIDA_COORDS.lng, NOIDA_COORDS.lat],
      zoom: DEFAULT_ZOOM,
      pitch: 45,
      bearing: -17.6,
      antialias: true
    });

    map.current.on('style.load', () => {
      // Add 3D terrain
      map.current?.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
        'tileSize': 512,
        'maxzoom': 14
      });
      map.current?.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

      // Add sky layer
      map.current?.addLayer({
        'id': 'sky',
        'type': 'sky',
        'paint': {
          'sky-type': 'atmosphere',
          'sky-atmosphere-sun': [0.0, 0.0],
          'sky-atmosphere-sun-intensity': 15
        }
      });
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;
    map.current.setStyle(isNight ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/satellite-streets-v12');
  }, [isNight]);

  return (
    <div ref={mapContainer} className="absolute inset-0 w-full h-full z-0" />
  );
};

export default Map;
