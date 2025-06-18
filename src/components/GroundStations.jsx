import React, { useEffect, useState } from 'react';
import { Source, Layer } from 'react-map-gl/mapbox';
import { useGlobalContext } from '../context/GlobalContext';

const GroundStations = ({
  geojsonSource,
  circleColor = 'green',
  circleRadius = 6
}) => {
  const [stationsGeoJson, setStationsGeoJson] = useState({
    type: 'FeatureCollection',
    features: []
  });
  const {showGroundStationLabels} = useGlobalContext(); 

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

        // Convert to GeoJSON FeatureCollection
        if (Array.isArray(data)) {
          const features = data
            .filter(station => station.lat != null && station.lon != null)
            .map(station => ({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [station.lon, station.lat]
              },
              properties: { ...station }
            }));

          setStationsGeoJson({
            type: 'FeatureCollection',
            features
          });
        } else if (data.type === 'FeatureCollection') {
          setStationsGeoJson(data);
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
        { showGroundStationLabels && 
          <Layer
            id="ground-stations-labels"
            type="symbol"
            layout={{
              'text-field': ['get', 'name'], 
              'text-size': 12,
              'text-anchor': 'top',
              'text-offset': [0, 0.6]
            }}
            paint={{
              'text-color': '#000000',
              'text-halo-color': '#ffffff',
              'text-halo-width': 1
            }}
          />}
        </Source>
      )}
    </>
  );
};

export default GroundStations;
