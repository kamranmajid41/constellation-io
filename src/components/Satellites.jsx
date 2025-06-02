import React, { useState, useEffect, useRef } from 'react';
import { Source, Layer, Marker } from 'react-map-gl/mapbox';
import * as satellite from 'satellite.js';

import tleData from '../../scripts/starlink_tles.json';

// Function to generate a circle (polygon) around a center point with a given radius
const generateCircle = (latitude, longitude, radiusInDegrees = 0.1, numPoints = 12) => {
  const coordinates = [];
  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * 2 * Math.PI; // Angle in radians
    const latOffset = radiusInDegrees * Math.sin(angle);
    const lonOffset = radiusInDegrees * Math.cos(angle);
    coordinates.push([longitude + lonOffset, latitude + latOffset]);
  }

  // Close the polygon by repeating the first point at the end
  coordinates.push(coordinates[0]);
  return coordinates;
};

const Satellites = () => {
  const [satellitePositions, setSatellitePositions] = useState([]);
  const lastUpdateRef = useRef(0); // To store last update time to reduce frequency
  const updateInterval = 10; // Update every 100 ms

  // Function to calculate satellite position based on TLE data
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
    // Store last update timestamp to manage update frequency
    const interval = setInterval(() => {
      const currentTime = Date.now();

      // If last update was too recent, skip this update
      if (currentTime - lastUpdateRef.current < updateInterval) return;

      lastUpdateRef.current = currentTime;

      // Only calculate and update positions for satellites if the position has changed
      const updatedPositions = tleData
        .map((satellite) => {
          const updatedPosition = getSatellitePosition(satellite.tleLine1, satellite.tleLine2);
          return updatedPosition ? { ...updatedPosition, name: satellite.satelliteName } : null;
        })
        .filter((position) => position !== null);

      setSatellitePositions(updatedPositions); // Update the state with valid positions
    }, updateInterval); // Reduce the update interval

    // Cleanup interval on component unmount
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
                coordinates: [generateCircle(satellite.latitude, satellite.longitude)], // Create a circle as a polygon
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
              'fill-extrusion-color': '#88f7f5', // Color of the extrusion
              'fill-extrusion-height': 550 * 1000, // Extrusion height based on altitude
              'fill-extrusion-base': 545 * 1000, // Base of the extrusion (on the ground)
              'fill-extrusion-opacity': 0.9, // Opacity of the extrusion
              'fill-extrusion-emissive-strength': 2
            }}
          />
        </Source>
      )}
    </>
  );
};

export default Satellites;
