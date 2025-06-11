import React, { useEffect, useState } from 'react';
import { Source, Layer } from 'react-map-gl/mapbox';

/**
 * GroundStationsMapLayer displays SatNOGS ground stations as circles on the map.
 *
 * Props:
 * - geojsonSource (string URL | Array of station objects): data source for ground stations
 * - circleColor (string): Optional, default 'green'
 * - circleRadius (number): Optional, default 6
 */
const GroundStations = ({
  geojsonSource,
  circleColor = 'green',
  circleRadius = 6
}) => {
  const [stationsGeoJson, setStationsGeoJson] = useState({
    type: 'FeatureCollection',
    features: []
  });

  useEffect(() => {
    const loadGeoJSON = async () => {
      let data;

      try {
        if (typeof geojsonSource === 'string') {
          const response = await fetch(geojsonSource);
          if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
          data = await response.json();
        } else if (Array.isArray(geojsonSource)) {
          data = geojsonSource;
        } else {
          console.warn('geojsonSource must be a URL string or an array of station objects');
          return;
        }

        // Convert SatNOGS raw stations array to GeoJSON FeatureCollection
        if (Array.isArray(data)) {
          const features = data
            .filter(station => station.lat != null && station.lon != null)
            .map(station => ({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [station.lon, station.lat]
              },
              properties: { ...station } // all other fields preserved as properties
            }));

          setStationsGeoJson({
            type: 'FeatureCollection',
            features
          });
        } else if (data.type === 'FeatureCollection' && Array.isArray(data.features)) {
          // If already GeoJSON, just use it directly
          setStationsGeoJson(data);
        } else {
          console.warn('Data format not recognized');
        }
      } catch (error) {
        console.error("Error loading ground station data:", error);
      }
    };

    loadGeoJSON();
  }, [geojsonSource]);

  return (
    <>
      {stationsGeoJson.features.length > 0 && (
        <Source id="ground-stations-source" type="geojson" data={stationsGeoJson}>
          <Layer
            id="ground-stations-layer"
            type="circle"
            paint={{
              'circle-radius': circleRadius,
              'circle-color': circleColor,
              'circle-stroke-width': 1,
              'circle-stroke-color': 'white',
              'circle-opacity': 0.3, 
              'circle-emissive-strength': 2
            }}
          />
        </Source>
      )}
    </>
  );
};

export default GroundStations;
