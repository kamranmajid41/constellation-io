import React, { useState, useEffect, useRef } from 'react';
import { Source, Layer, Marker } from 'react-map-gl/mapbox';
import * as satellite from 'satellite.js';

import tleData from '../../scripts/starlink_tles.json';

const generateCircle = (latitude, longitude, radiusInDegrees = 0.1, numPoints = 12) => {
  const coordinates = [];
  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * 2 * Math.PI; 
    const latOffset = radiusInDegrees * Math.sin(angle);
    const lonOffset = radiusInDegrees * Math.cos(angle);
    coordinates.push([longitude + lonOffset, latitude + latOffset]);
  }

  coordinates.push(coordinates[0]);
  return coordinates;
};

const Satellites = () => {
  const [satellitePositions, setSatellitePositions] = useState([]);
  const lastUpdateRef = useRef(0); 
  const updateInterval = 10; 

  const getSatellitePosition = (tleLine1, tleLine2) => {
    if (!tleLine1 || !tleLine2) return null;

    try {
      const satrec = satellite.twoline2satrec(tleLine1, tleLine2);
      const currentDate = new Date();
      const positionAndVelocity = satellite.propagate(satrec, currentDate);

      if (!positionAndVelocity || !positionAndVelocity.position) {
        console.error("Invalid position data from propagation.");
        return null;
      }

      const positionEci = positionAndVelocity.position;
      const gmst = satellite.gstime(currentDate);
      const positionGd = satellite.eciToGeodetic(positionEci, gmst);

      const latitude = positionGd.latitude * (180 / Math.PI);
      const longitude = positionGd.longitude * (180 / Math.PI);
      const altitude = positionGd.height * 0.001;

      if (isNaN(latitude) || isNaN(longitude) || isNaN(altitude)) {
        console.error("Invalid coordinates:", latitude, longitude, altitude);
        return null;
      }

      return { latitude, longitude, altitude };
    } catch (error) {
      console.error('Error processing TLE data:', error);
      return null;
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Date.now();

      if (currentTime - lastUpdateRef.current < updateInterval) return;

      lastUpdateRef.current = currentTime;

      const updatedPositions = tleData
        .map((satellite) => {
          const updatedPosition = getSatellitePosition(satellite.tleLine1, satellite.tleLine2);
          return updatedPosition ? { ...updatedPosition, name: satellite.satelliteName } : null;
        })
        .filter((position) => position !== null);

      setSatellitePositions(updatedPositions); 
    }, updateInterval); 

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {satellitePositions.length > 0 && (
        <Source
          type="geojson"
          data={{
            type: 'FeatureCollection',
            features: satellitePositions.map((satellite) => ({
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: [generateCircle(satellite.latitude, satellite.longitude)],
              },
              properties: {
                name: satellite.name,
              },
            })),
          }}
        >
          {/* Layer: fill-extrusion */}
          <Layer
            type="fill-extrusion"
            paint={{
              'fill-extrusion-color': '#88f7f5', 
              'fill-extrusion-height': 550 * 1000, 
              'fill-extrusion-base': 545 * 1000, 
              'fill-extrusion-opacity': 0.9, 
              'fill-extrusion-emissive-strength': 2
            }}
          />
        </Source>
      )}
    </>
  );
};

export default Satellites;
