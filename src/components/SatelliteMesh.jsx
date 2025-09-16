import React, { useState, useEffect, useRef } from 'react';
import { Source, Layer } from 'react-map-gl/mapbox';
import * as satellite from 'satellite.js';
import { useGlobalContext } from '../context/GlobalContext';

import tleData from '../data/starlink_tles.json';

const SatelliteMesh = ({ satellitePositions = [] }) => {
  const { showSatelliteMesh, selectedAsset } = useGlobalContext();
  const [meshConnections, setMeshConnections] = useState({
    type: 'FeatureCollection',
    features: []
  });
  const [lastPositionsHash, setLastPositionsHash] = useState(null);

  // Function to create a hash of satellite positions for caching
  const createPositionsHash = (positions) => {
    return positions.map(p => `${p.latitude.toFixed(2)},${p.longitude.toFixed(2)},${p.altitude.toFixed(1)}`).join('|');
  };

  // Function to save mesh connections to cache
  const saveMeshToCache = async (connections, hash) => {
    try {
      const cacheData = {
        hash: hash,
        timestamp: new Date().toISOString(),
        connections: connections
      };
      
      // Save to localStorage (primary cache)
      localStorage.setItem('satelliteMeshConnections', JSON.stringify(cacheData));
      console.log('Satellite mesh cached to localStorage');
      
      // Also try to load the JSON file and update it
      try {
        const response = await fetch('/src/data/satellite_mesh_cache.json');
        if (response.ok) {
          console.log('Satellite mesh cache data for JSON file:', JSON.stringify(cacheData, null, 2));
        }
      } catch (error) {
        console.log('Satellite mesh JSON cache file not accessible (expected in browser environment)');
      }
    } catch (error) {
      console.error('Error saving satellite mesh cache:', error);
    }
  };

  // Function to load mesh connections from cache
  const loadMeshFromCache = async (currentHash) => {
    try {
      // Try localStorage first
      const cached = localStorage.getItem('satelliteMeshConnections');
      if (cached) {
        const cacheData = JSON.parse(cached);
        if (cacheData.hash === currentHash) {
          console.log('Loading cached satellite mesh from localStorage');
          return cacheData.connections;
        }
      }
      
      // Try to load from JSON file as fallback
      try {
        const response = await fetch('/src/data/satellite_mesh_cache.json');
        if (response.ok) {
          const jsonCache = await response.json();
          if (jsonCache.hash === currentHash) {
            console.log('Loading cached satellite mesh from JSON file');
            // Also save to localStorage for faster access next time
            localStorage.setItem('satelliteMeshConnections', JSON.stringify(jsonCache));
            return jsonCache.connections;
          }
        }
      } catch (error) {
        console.log('Satellite mesh JSON cache file not accessible (expected in browser environment)');
      }
      
      return null;
    } catch (error) {
      console.error('Error loading satellite mesh cache:', error);
      return null;
    }
  };


  // Function to calculate 3D distance between two satellites with proper antimeridian handling
  const calculate3DDistance = (sat1, sat2) => {
    const R = 6371; // Earth's radius in km

    // Convert to radians
    const lat1 = sat1.latitude * Math.PI / 180;
    const lat2 = sat2.latitude * Math.PI / 180;

    // Calculate longitude difference with proper antimeridian handling
    let deltaLon = sat2.longitude - sat1.longitude;

    // Handle antimeridian crossing by taking the shorter path
    if (deltaLon > 180) {
      deltaLon = deltaLon - 360;
    } else if (deltaLon < -180) {
      deltaLon = deltaLon + 360;
    }

    const deltaLonRad = deltaLon * Math.PI / 180;
    const deltaLat = (sat2.latitude - sat1.latitude) * Math.PI / 180;

    // Use the spherical law of cosines for better antimeridian handling
    const a = Math.sin(lat1) * Math.sin(lat2) +
              Math.cos(lat1) * Math.cos(lat2) * Math.cos(deltaLonRad);

    // Clamp to avoid numerical errors
    const clampedA = Math.max(-1, Math.min(1, a));
    const c = Math.acos(clampedA);
    const surfaceDistance = R * c;

    // Add altitude difference for 3D distance
    const altitudeDiff = Math.abs(sat1.altitude - sat2.altitude);
    const distance3D = Math.sqrt(surfaceDistance * surfaceDistance + altitudeDiff * altitudeDiff);

    return distance3D;
  };

  // Function to check if connection is reasonable (not too long horizontally)
  const isReasonableConnection = (sat1, sat2) => {
    // Calculate horizontal distance (surface distance)
    const R = 6371; // Earth's radius in km
    const lat1 = sat1.latitude * Math.PI / 180;
    const lat2 = sat2.latitude * Math.PI / 180;
    
    // Calculate longitude difference with proper antimeridian handling
    let deltaLon = sat2.longitude - sat1.longitude;

    // Handle antimeridian crossing by taking the shorter path
    if (deltaLon > 180) {
      deltaLon = deltaLon - 360;
    } else if (deltaLon < -180) {
      deltaLon = deltaLon + 360;
    }
    
    const deltaLonRad = deltaLon * Math.PI / 180;
    
    // Use the spherical law of cosines for better antimeridian handling
    const a = Math.sin(lat1) * Math.sin(lat2) + 
              Math.cos(lat1) * Math.cos(lat2) * Math.cos(deltaLonRad);
    
    // Clamp to avoid numerical errors
    const clampedA = Math.max(-1, Math.min(1, a));
    const c = Math.acos(clampedA);
    const surfaceDistance = R * c;
    
    // Increased horizontal distance limit for better coverage
    const maxHorizontalDistance = 4000; // km (increased to match 5000km 3D distance)
    return surfaceDistance <= maxHorizontalDistance;
  };

  // Function to generate or load mesh connections
  const generateOrLoadMeshConnections = async (positions) => {
    if (positions.length === 0) {
      setMeshConnections({
        type: 'FeatureCollection',
        features: []
      });
      return;
    }

    const currentHash = createPositionsHash(positions);

    // Check if we need to recalculate
    if (currentHash !== lastPositionsHash) {
      console.log('Satellite positions changed, checking mesh cache...');
      
      // Try to load from cache first
      const cachedConnections = await loadMeshFromCache(currentHash);
      if (cachedConnections) {
        console.log('Using cached satellite mesh');
        setMeshConnections(cachedConnections);
        setLastPositionsHash(currentHash);
      } else {
        console.log('No cache found, generating new satellite mesh...');
        const connections = generateMeshConnections(positions);
        console.log(`Generated ${connections.features.length} satellite mesh connections`);
        setMeshConnections(connections);
        setLastPositionsHash(currentHash);
        
        // Save to cache
        await saveMeshToCache(connections, currentHash);
      }
    } else {
      console.log('Satellite positions unchanged, using existing mesh');
    }
  };

  // Function to generate mesh connections (highly optimized for performance)
  const generateMeshConnections = (positions) => {
    const connections = [];
    const maxDistance = 5000; // Increased to 5000km as requested
    const maxConnections = 4; // Increased connections for better coverage
    const maxSatellites = Math.floor(positions.length / 2); // Half of all satellites
    
    console.log(`Processing ${maxSatellites} satellites (half of ${positions.length}) for mesh connections`);
    
    // If a satellite is selected, only process that satellite's connections
    let positionsToProcess = positions.slice(0, maxSatellites);
    if (selectedAsset?.type === 'satellite' && selectedAsset?.data) {
      const selectedSat = positions.find(sat => sat.name === selectedAsset.data.name);
      if (selectedSat) {
        positionsToProcess = [selectedSat];
        console.log(`Filtering to show only connections for selected satellite: ${selectedAsset.data.name}`);
      }
    }
    
    for (let i = 0; i < positionsToProcess.length; i++) {
      const sat1 = positionsToProcess[i];
      const nearbySats = [];
      
      // Find nearby satellites (check all other satellites for selected satellite, or after current one for general mesh)
      const startJ = selectedAsset?.type === 'satellite' ? 0 : i + 1;
      for (let j = startJ; j < positions.length; j++) {
        const sat2 = positions[j];
        if (j === i) continue; // Skip self
        const distance = calculate3DDistance(sat1, sat2);
        
        // Check both 3D distance and horizontal distance reasonableness
        if (distance <= maxDistance && isReasonableConnection(sat1, sat2)) {
          nearbySats.push({ satellite: sat2, distance });
        }
      }
      
      // Sort by distance and take closest ones
      nearbySats.sort((a, b) => a.distance - b.distance);
      const selectedSats = nearbySats.slice(0, maxConnections);
      
      // Create polygon connections for fill-extrusion
      selectedSats.forEach(({ satellite: sat2 }) => {
        const distance = calculate3DDistance(sat1, sat2);
        
        // Calculate the direction vector for the line
        const latDiff = sat2.latitude - sat1.latitude;
        const lonDiff = sat2.longitude - sat1.longitude;
        
        // Skip connections that are extremely close to each other (same position)
        const isExtremelyClose = (Math.abs(latDiff) < 0.01 && Math.abs(lonDiff) < 0.01);
        
        if (isExtremelyClose) {
          return; // Skip this connection
        }
        
        // Check if this connection crosses the antimeridian
        const crossesAntimeridian = (sat1.longitude > 0 && sat2.longitude < 0 && (sat1.longitude - sat2.longitude) > 180) ||
                                   (sat1.longitude < 0 && sat2.longitude > 0 && (sat2.longitude - sat1.longitude) > 180);
        
        if (crossesAntimeridian) {
          // For antimeridian crossings, create two separate polygon segments
          const lineWidth = 0.008; // Width in degrees (increased from 0.002)
          const halfWidth = lineWidth / 2;
          
          // Calculate direction for the first segment
          const midLat1 = sat1.latitude + (sat2.latitude - sat1.latitude) * 0.5;
          const midLon1 = sat1.longitude > 0 ? 180 : -180;
          
          const latDiff1 = midLat1 - sat1.latitude;
          const lonDiff1 = midLon1 - sat1.longitude;
          
          // Create perpendicular vector for first segment
          const perpLat1 = -lonDiff1 * 0.5;
          const perpLon1 = latDiff1 * 0.5;
          const perpLength1 = Math.sqrt(perpLat1 * perpLat1 + perpLon1 * perpLon1);
          
          if (perpLength1 > 0) {
            const normPerpLat1 = (perpLat1 / perpLength1) * halfWidth;
            const normPerpLon1 = (perpLon1 / perpLength1) * halfWidth;
            
            // Create first polygon segment
            const rectCoords1 = [
              [
                [sat1.longitude - normPerpLon1, sat1.latitude - normPerpLat1],
                [sat1.longitude + normPerpLon1, sat1.latitude + normPerpLat1],
                [midLon1 + normPerpLon1, midLat1 + normPerpLat1],
                [midLon1 - normPerpLon1, midLat1 - normPerpLat1],
                [sat1.longitude - normPerpLon1, sat1.latitude - normPerpLat1]
              ]
            ];
            
            connections.push({
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: rectCoords1
              },
              properties: {
                distance: distance / 2
              }
            });
          }
          
          // Calculate direction for the second segment
          const midLat2 = sat1.latitude + (sat2.latitude - sat1.latitude) * 0.5;
          const midLon2 = sat2.longitude > 0 ? 180 : -180;
          
          const latDiff2 = sat2.latitude - midLat2;
          const lonDiff2 = sat2.longitude - midLon2;
          
          // Create perpendicular vector for second segment
          const perpLat2 = -lonDiff2 * 0.5;
          const perpLon2 = latDiff2 * 0.5;
          const perpLength2 = Math.sqrt(perpLat2 * perpLat2 + perpLon2 * perpLon2);
          
          if (perpLength2 > 0) {
            const normPerpLat2 = (perpLat2 / perpLength2) * halfWidth;
            const normPerpLon2 = (perpLon2 / perpLength2) * halfWidth;
            
            // Create second polygon segment
            const rectCoords2 = [
              [
                [midLon2 - normPerpLon2, midLat2 - normPerpLat2],
                [midLon2 + normPerpLon2, midLat2 + normPerpLat2],
                [sat2.longitude + normPerpLon2, sat2.latitude + normPerpLat2],
                [sat2.longitude - normPerpLon2, sat2.latitude - normPerpLat2],
                [midLon2 - normPerpLon2, midLat2 - normPerpLat2]
              ]
            ];
            
            connections.push({
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: rectCoords2
              },
              properties: {
                distance: distance / 2
              }
            });
          }
        } else {
          // For normal connections, create a thick rectangular polygon
          const lineWidth = 0.05; // Width in degrees (increased from 0.002)
          const halfWidth = lineWidth / 2;
          
          // Create a rectangle perpendicular to the line direction
          const perpLat = -lonDiff * 0.5; // Perpendicular component
          const perpLon = latDiff * 0.5;
          
          // Normalize the perpendicular vector
          const perpLength = Math.sqrt(perpLat * perpLat + perpLon * perpLon);
          if (perpLength === 0) return; // Skip if satellites are at same position
          
          const normPerpLat = (perpLat / perpLength) * halfWidth;
          const normPerpLon = (perpLon / perpLength) * halfWidth;
          
          // Create the rectangular polygon coordinates
          const rectCoords = [
            [
              [sat1.longitude - normPerpLon, sat1.latitude - normPerpLat],
              [sat1.longitude + normPerpLon, sat1.latitude + normPerpLat],
              [sat2.longitude + normPerpLon, sat2.latitude + normPerpLat],
              [sat2.longitude - normPerpLon, sat2.latitude - normPerpLat],
              [sat1.longitude - normPerpLon, sat1.latitude - normPerpLat]
            ]
          ];
          
          connections.push({
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: rectCoords
            },
            properties: {
              distance: distance
            }
          });
        }
      });
    }
    
    console.log(`Generated ${connections.length} total connections from ${positionsToProcess.length} satellites`);
    
    return {
      type: 'FeatureCollection',
      features: connections
    };
  };

  useEffect(() => {
    // Only run when mesh is visible and we have satellite positions
    if (!showSatelliteMesh || satellitePositions.length === 0) {
      // Clear connections when mesh is hidden
      setMeshConnections({
        type: 'FeatureCollection',
        features: []
      });
      return;
    }

    // Generate or load mesh connections with caching using the passed positions
    generateOrLoadMeshConnections(satellitePositions);
  }, [showSatelliteMesh, satellitePositions, selectedAsset]);

  return (
    <>
      {console.log('SatelliteMesh rendering:', meshConnections.features.length, 'features')}
      {meshConnections.features.length > 0 && (
        <Source
          id="satellite-mesh-source"
          type="geojson"
          data={meshConnections}
        >
            <Layer
              id="satellite-mesh-layer"
              type="fill-extrusion"
              paint={{
                'fill-extrusion-color': '#ff00ff', 
                'fill-extrusion-height': 550 * 1000, 
                'fill-extrusion-base': 545 * 1000, 
                'fill-extrusion-opacity': 0.8, 
                'fill-extrusion-emissive-strength': 5
              }}
            />
        </Source>
      )}
    </>
  );
};

export default SatelliteMesh;
