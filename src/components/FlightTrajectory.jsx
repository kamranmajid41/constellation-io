import React, { useEffect, useState } from 'react';
import { Source, Layer } from 'react-map-gl/mapbox';

const FlightTrajectory = ({ flightTrajectoryData }) => {

  const [trajectoryGeoJson, setTrajectoryGeoJson] = useState({
    type: 'FeatureCollection',
    features: []
  });

  useEffect(() => {
    if (flightTrajectoryData && flightTrajectoryData.length > 0) {
      console.log("FlightTrajectoryLayer: Preparing GeoJSON for trajectory.");

      const newLineStringFeature = {
        type: 'Feature',
        geometry: {
          type: 'LineString',

          coordinates: flightTrajectoryData.map(p => [p.lon, p.lat, p.alt || 0])
        },
        properties: {} 
      };

      setTrajectoryGeoJson({
        type: 'FeatureCollection',
        features: [newLineStringFeature]
      });

      console.log(`Flight trajectory with ${flightTrajectoryData.length} points updated.`);

    } else {
      console.log("FlightTrajectoryLayer: No trajectory data, clearing map layer.");
      setTrajectoryGeoJson({
        type: 'FeatureCollection',
        features: []
      });
    }
  }, [flightTrajectoryData]); 

  return (
    <>
      <Source id="flight-trajectory-source" type="geojson" data={trajectoryGeoJson}>
        <Layer
          id="flight-trajectory-line-layer"
          type="line"
          layout={{
            'line-join': 'round',
            'line-cap': 'round'
          }}
          paint={{
            'line-color': 'red', 
            'line-width': 2,
            'line-opacity': 0.9, 
            'line-emissive-strength': 1
          }}
        />
      </Source>

    
      {flightTrajectoryData.length > 0 && (
        <>
          {/* Start Point Marker */}
        </>
      )}
    </>
  );
};

export default FlightTrajectory;