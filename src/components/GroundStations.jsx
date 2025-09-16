import React, { useEffect, useState } from 'react';
import { Source, Layer } from 'react-map-gl/mapbox';
import { useGlobalContext } from '../context/GlobalContext';

const GroundStations = ({
  geojsonSource,
  circleColor = 'green',
  circleRadius = 3
}) => {
  const [stationsGeoJson, setStationsGeoJson] = useState({
    type: 'FeatureCollection',
    features: []
  });
  const [connectionsGeoJson, setConnectionsGeoJson] = useState({
    type: 'FeatureCollection',
    features: []
  });
  const {showGroundStationLabels, showGroundStationConnections} = useGlobalContext();
  const [lastStationsHash, setLastStationsHash] = useState(null);

  // Function to create a hash of stations data for caching
  const createStationsHash = (stations) => {
    return stations.map(s => `${s.lat},${s.lon},${s.name}`).join('|');
  };

  // Function to save connections to cache
  const saveConnectionsToFile = async (connections, hash) => {
    try {
      const cacheData = {
        hash: hash,
        timestamp: new Date().toISOString(),
        connections: connections
      };
      
      // Save to localStorage (primary cache)
      localStorage.setItem('groundStationConnections', JSON.stringify(cacheData));
      console.log('Connections cached to localStorage');
      
      // Also try to load the JSON file and update it
      try {
        const response = await fetch('/src/data/ground_station_connections_cache.json');
        if (response.ok) {
          console.log('JSON cache file exists, would update it with:', JSON.stringify(cacheData, null, 2));
        }
      } catch (error) {
        console.log('JSON cache file not accessible (expected in browser environment)');
      }
    } catch (error) {
      console.error('Error saving connections cache:', error);
    }
  };

  // Function to load connections from cache
  const loadConnectionsFromCache = async (currentHash) => {
    try {
      // Try localStorage first
      const cached = localStorage.getItem('groundStationConnections');
      if (cached) {
        const cacheData = JSON.parse(cached);
        if (cacheData.hash === currentHash) {
          console.log('Loading cached connections from localStorage');
          return cacheData.connections;
        }
      }
      
      // Try to load from JSON file as fallback
      try {
        const response = await fetch('/src/data/ground_station_connections_cache.json');
        if (response.ok) {
          const jsonCache = await response.json();
          if (jsonCache.hash === currentHash) {
            console.log('Loading cached connections from JSON file');
            // Also save to localStorage for faster access next time
            localStorage.setItem('groundStationConnections', JSON.stringify(jsonCache));
            return jsonCache.connections;
          }
        }
      } catch (error) {
        console.log('JSON cache file not accessible (expected in browser environment)');
      }
      
      return null;
    } catch (error) {
      console.error('Error loading connections cache:', error);
      return null;
    }
  };

  // Function to generate or load connections
  const generateOrLoadConnections = async (stations) => {
    if (stations.length === 0) {
      setConnectionsGeoJson({
        type: 'FeatureCollection',
        features: []
      });
      return;
    }

    const maxDistance = 500;
    const maxConnections = 6;
    const currentHash = createStationsHash(stations);

    // Check if we need to recalculate
    if (currentHash !== lastStationsHash) {
      console.log('Stations changed, checking cache...');
      
      // Try to load from cache first
      const cachedConnections = await loadConnectionsFromCache(currentHash);
      if (cachedConnections) {
        console.log('Using cached connections');
        setConnectionsGeoJson(cachedConnections);
        setLastStationsHash(currentHash);
      } else {
        console.log('No cache found, generating new connections...');
        const connections = generateConnections(stations, maxDistance, maxConnections);
        console.log('Generated connections:', connections);
        setConnectionsGeoJson(connections);
        setLastStationsHash(currentHash);
        
        // Save to cache
        await saveConnectionsToFile(connections, currentHash);
      }
    } else {
      console.log('Stations unchanged, using existing connections');
    }
  };

  // Function to generate connections for all ground stations
  const generateConnections = (stations, maxDistance = 500, maxConnections = 3) => {
    if (stations.length === 0) {
      return {
        type: 'FeatureCollection',
        features: []
      };
    }

    const coordinates = [];
    
    console.log('Processing', stations.length, 'stations for connections');
    
    for (let i = 0; i < stations.length; i++) {
      const centerStation = stations[i];
      const nearbyStations = [];
      
      // Find nearby stations for this center station (check all stations for selected station, or all for general mesh)
      for (let j = 0; j < stations.length; j++) {
        if (i === j) continue; // Skip self
        
        const station = stations[j];
        
        // Calculate distance using Haversine formula with antimeridian handling
        const lat1 = centerStation.lat * Math.PI / 180;
        const lat2 = station.lat * Math.PI / 180;
        const deltaLat = (station.lat - centerStation.lat) * Math.PI / 180;
        
        // Handle antimeridian crossing (180°/-180° boundary)
        let deltaLon = station.lon - centerStation.lon;
        if (deltaLon > 180) {
          deltaLon -= 360;
        } else if (deltaLon < -180) {
          deltaLon += 360;
        }
        deltaLon = deltaLon * Math.PI / 180;
        
        const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
                  Math.cos(lat1) * Math.cos(lat2) *
                  Math.sin(deltaLon/2) * Math.sin(deltaLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = 6371 * c; // Earth's radius in km

        if (distance <= maxDistance) {
          nearbyStations.push({ station, distance });
        }
      }
      
      // Sort by distance and take only the closest ones
      nearbyStations.sort((a, b) => a.distance - b.distance);
      const selectedStations = nearbyStations.slice(0, maxConnections);
      
      // Create connections for this station
      selectedStations.forEach(({ station }) => {
        coordinates.push([
          [centerStation.lon, centerStation.lat],
          [station.lon, station.lat]
        ]);
      });
    }
    
    console.log('Total connections generated:', coordinates.length);
    console.log('First few coordinates:', coordinates.slice(0, 3));
    console.log('Sample connection:', coordinates[0]);
    console.log('First connection details:', {
      from: coordinates[0][0],
      to: coordinates[0][1],
      distance: Math.sqrt(
        Math.pow(coordinates[0][1][0] - coordinates[0][0][0], 2) + 
        Math.pow(coordinates[0][1][1] - coordinates[0][0][1], 2)
      ) * 111 // rough km conversion
    });
    
    // Create individual LineString features instead of one MultiLineString
    const features = coordinates.map((coord, index) => ({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: coord
      },
      properties: {
        id: index,
        name: 'Ground Station Connection'
      }
    }));
    
    console.log('Created', features.length, 'individual features');
    
    return {
      type: 'FeatureCollection',
      features: features
    };
  };

  useEffect(() => {
    const loadGeoJSON = async () => {
      let data;

      try {
        console.log('GroundStations: Starting data load, geojsonSource type:', typeof geojsonSource);
        if (typeof geojsonSource === 'string') {
          console.log('GroundStations: Fetching from URL:', geojsonSource);
          const response = await fetch(geojsonSource);
          if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
          data = await response.json();
        } else if (Array.isArray(geojsonSource)) {
          console.log('GroundStations: Using array data, length:', geojsonSource.length);
          data = geojsonSource;
        } else {
          console.warn('GroundStations: geojsonSource must be a URL string or an array of station objects, got:', typeof geojsonSource);
          return;
        }

        // Convert to GeoJSON FeatureCollection
        if (Array.isArray(data)) {
          console.log('GroundStations: Processing array data, length:', data.length);
          const validStations = data.filter(station => station.lat != null && station.lon != null);
          console.log('GroundStations: Valid stations after filtering:', validStations.length);
          const features = validStations.map(station => ({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [station.lon, station.lat]
              },
              properties: { ...station }
            }));

          console.log('GroundStations: Created features:', features.length);
          setStationsGeoJson({
            type: 'FeatureCollection',
            features
          });
        } else if (data.type === 'FeatureCollection') {
          console.log('GroundStations: Processing FeatureCollection, features:', data.features?.length);
          setStationsGeoJson(data);
        }
      } catch (error) {
        console.error("Error loading ground station data:", error);
      }
    };

    loadGeoJSON();
  }, [geojsonSource]);

  // Effect to handle connection generation when checkbox is pressed or stations change
  useEffect(() => {
    if (showGroundStationConnections && stationsGeoJson.features.length > 0) {
      // Extract stations from the GeoJSON
      const stations = stationsGeoJson.features.map(feature => ({
        lat: feature.geometry.coordinates[1],
        lon: feature.geometry.coordinates[0],
        name: feature.properties.name || 'Unknown'
      }));
      
      generateOrLoadConnections(stations);
    } else if (!showGroundStationConnections) {
      // Clear connections when checkbox is unchecked
      setConnectionsGeoJson({
        type: 'FeatureCollection',
        features: []
      });
    }
  }, [showGroundStationConnections, stationsGeoJson]);

  return (
    <>
      {/* Ground station connections */}
      {showGroundStationConnections && connectionsGeoJson.features.length > 0 && (
        <>
          <Source id="ground-stations-connections-source" type="geojson" data={connectionsGeoJson}>
            <Layer
              id="ground-stations-connections-layer"
              type="line"
              layout={{
                'line-join': 'round',
                'line-cap': 'round'
              }}
              paint={{
                'line-color': '#00ff00',
                'line-width': 1,
                'line-opacity': 1.0,
                'line-emissive-strength': 2
              }}
            />
          </Source>
        </>
      )}

      {/* Ground stations */}
      {console.log('GroundStations render - features count:', stationsGeoJson.features.length)}
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
              'circle-opacity': 0.8,
              'circle-emissive-strength': 2
            }}
          />
        { showGroundStationLabels && 
          <Layer
            id="ground-stations-labels"
            type="symbol"
            layout={{
              'text-field': ['get', 'name'], 
              'text-size': 8,
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
