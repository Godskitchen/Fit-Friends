import { Map, TileLayer } from 'leaflet';
import { MutableRefObject, useEffect, useRef, useState } from 'react';

import { LocationCoords } from 'src/types/user.type';

const MapSettings = {
  TILE_LAYER: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
};

const MAX_ZOOM = 20;

export const useMap = (
  mapRef: MutableRefObject<HTMLElement | null>,
  coords: LocationCoords
): Map | null => {
  const [map, setMap] = useState<Map | null>(null);
  const isRenderedRef = useRef<boolean>(false);

  useEffect(() => {
    if (mapRef.current !== null && !isRenderedRef.current) {
      const instance = new Map(mapRef.current, {
        center: {
          lat: coords.latitude,
          lng: coords.longitude,
        },
        attributionControl: false
      });

      const layer = new TileLayer(
        MapSettings.TILE_LAYER,
        {maxZoom: MAX_ZOOM}
      );

      instance.addLayer(layer);

      setMap(instance);
      isRenderedRef.current = true;
    }
  }, [mapRef, map, coords.latitude, coords.longitude]);

  return map;
};

