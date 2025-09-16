import React, { useState, useRef, useEffect } from 'react';
import Map from 'react-map-gl/mapbox';
import { Button, ActionIcon, TextInput, Group } from '@mantine/core';
import { IconWorldDown, IconTargetArrow, IconSearch, IconRotate, IconPlayerPause } from '@tabler/icons-react';
import { useGlobalContext } from '../context/GlobalContext';

import Satellites from './Satellites';
import SatelliteMesh from './SatelliteMesh';
import FlightTrajectory from './FlightTrajectory'; 
import GroundStations from './GroundStations';
import stations from '../data/satnogs_ground_stations.json';

let MAPBOX_TOKEN = "pk.eyJ1Ijoia21hamlkMjQiLCJhIjoiY21iZW15ZXB5MWlidTJycHhkbTQ2b2lidSJ9.KYEwuChvbNqoXeOpljFjIw";

function Globe() {

  const { useDefaultConstellation, 
          uploadedFlightGeoJson,
          altitude, beamwidth,
          showFlightPaths, 
          showCircuits, 
          showSatellites, 
          showSatelliteMesh,
          showGroundStations, 
          mapProjection,
          selectedAsset,
          isSidebarOpen
        } = useGlobalContext();

  const mapRef = useRef(null);
  const lastAnimationTime = useRef(0);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [customTleData, setCustomTleData] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [satellitePositions, setSatellitePositions] = useState([]);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [autoRotateEnabled, setAutoRotateEnabled] = useState(true);
  const [spinEnabled, setSpinEnabled] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const initialViewState = {
    longitude: -122.4,
    latitude: 37.8,
    zoom: 2,
  };

  const resetMapView = () => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [initialViewState.longitude, initialViewState.latitude],
        zoom: initialViewState.zoom,
        pitch: 0,
        bearing: 0
      });
    }
  };

  const handleMapLoad = () => {
    setMapLoaded(true);
    // Start rotation after map loads
    setTimeout(() => {
      spinGlobe();
    }, 1000);
  };

  const handleGeolocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (mapRef.current) {
          mapRef.current.flyTo({
            center: [longitude, latitude],
            zoom: 10,
          });
        }
      },
      (err) => {
        // Use a custom message box instead of alert for better UI/UX
        console.error('Unable to retrieve location: ' + err.message);
        // You can implement a modal or toast notification here
        // e.g., showNotification({ message: 'Unable to retrieve location: ' + err.message, color: 'red' });
      }
    );
  };

  const handleSatellitePositionsUpdate = (positions) => {
    setSatellitePositions(positions);
  };

  const handleSearch = async () => {
    if (!searchQuery) return;

    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${MAPBOX_TOKEN}`
    );
    const data = await response.json();
    if (data.features && data.features.length > 0) {
      const [lon, lat] = data.features[0].center;
      if (mapRef.current) {
        mapRef.current.flyTo({
          center: [lon, lat],
          zoom: 10,
        });
      }
    } else {
      // Use a custom message box instead of alert for better UI/UX
      console.warn('Location not found for search query: ' + searchQuery);
      // You can implement a modal or toast notification here
    }
  };

  // Resize map when sidebar state changes
  useEffect(() => {
    if (mapRef.current && mapLoaded) {
      setTimeout(() => {
        mapRef.current.resize();
      }, 10);
    }
  }, [isSidebarOpen, mapLoaded]);

  // Rotation configuration
  const secondsPerRevolution = 240; // Complete a revolution every minute
  const maxSpinZoom = 5; // Above zoom level 5, do not rotate
  const slowSpinZoom = 3; // Rotate at intermediate speeds between zoom levels 3 and 5

  // Spin globe function using interval-based approach
  useEffect(() => {
    if (!mapLoaded || !spinEnabled || isUserInteracting) return;

    const interval = setInterval(() => {
      if (!mapRef.current || !spinEnabled || isUserInteracting) return;
      
      const zoom = mapRef.current.getZoom();
      if (zoom < maxSpinZoom) {
        let distancePerSecond = 360 / secondsPerRevolution;
        if (zoom > slowSpinZoom) {
          // Slow spinning at higher zooms
          const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
          distancePerSecond *= zoomDif;
        }
        const center = mapRef.current.getCenter();
        center.lng -= distancePerSecond; // Westward rotation
        
        // Smoothly animate the map over one second
        mapRef.current.easeTo({ 
          center, 
          duration: 1000, 
          easing: (n) => n 
        });
      }
    }, 1000); // Rotate every second

    return () => clearInterval(interval);
  }, [mapLoaded, spinEnabled, isUserInteracting, secondsPerRevolution, maxSpinZoom, slowSpinZoom]);

  // Handle user interaction detection
  const handleUserInteractionStart = () => {
    setIsUserInteracting(true);
  };

  const handleUserInteractionEnd = () => {
    setIsUserInteracting(false);
  };

  return (
    <Map
      ref={mapRef}
      mapboxAccessToken={MAPBOX_TOKEN}
      initialViewState={initialViewState}
      style={{ 
        height: '100vh', 
        width: isSidebarOpen ? 'calc(100vw - 600px)' : 'calc(100vw)',
        position: 'absolute',
        top: 0,
        left: '66px',
      }}
      mapStyle="mapbox://styles/kmajid24/cmbenh4hd004201ptfkp97j18"
      onLoad={handleMapLoad}
      attributionControl={false}
      projection={mapProjection}
      onMouseDown={handleUserInteractionStart}
      onMouseUp={handleUserInteractionEnd}
      onDragEnd={handleUserInteractionEnd}
      onPitchEnd={handleUserInteractionEnd}
      onRotateEnd={handleUserInteractionEnd}
    >
      {mapLoaded && (
        <>
          {(useDefaultConstellation && showSatellites) && 
            <Satellites
              animationSpeed={animationSpeed}
              isPaused={isPaused || showSatelliteMesh}
              customTleData={customTleData}
              onPositionsUpdate={handleSatellitePositionsUpdate}
          />}

          {(useDefaultConstellation && showSatelliteMesh) && 
            <SatelliteMesh satellitePositions={satellitePositions} />
          }

         { showFlightPaths && 
         <FlightTrajectory
            geojsonSource={uploadedFlightGeoJson}
            heatmapConfig={{
              altitudeKey: 'altitude_meters',
              beamwidthKey: 'antenna_beamwidth_deg',
              defaultAltitude: {altitude},
              defaultBeamwidth: {beamwidth},
              weightCalculator: (beamwidth, altitude) => (beamwidth / (altitude + 1)) ** 1.5
            }}
          />}

          {showGroundStations && 
            <GroundStations geojsonSource={stations} />
          }


          {/* Bottom buttons container */}
          <div
            style={{
              position: 'absolute',
              bottom: 5,
              left: 5,
              display: 'flex',
              gap: 6, 
              alignItems: 'center',
              backgroundColor: 'rgba(67, 67, 67, 0.9)',
              padding: '6px',
              borderRadius: '6px',
              zIndex: 10000
            }}
          >
            <ActionIcon variant="default" onClick={resetMapView} title="Reset View">
              <IconWorldDown size={18}/>
            </ActionIcon>

            <ActionIcon variant="default" onClick={handleGeolocation} title="Find My Location">
              <IconTargetArrow  size={18}/>
            </ActionIcon>

            <ActionIcon 
              variant={spinEnabled ? "filled" : "default"} 
              onClick={() => {
                setSpinEnabled(!spinEnabled);
                if (!spinEnabled) {
                  mapRef.current?.stop(); // Immediately end ongoing animation
                }
              }} 
              title={spinEnabled ? "Pause Rotation" : "Start Rotation"}
              color={spinEnabled ? "blue" : undefined}
            >
              {spinEnabled ? <IconRotate size={18}/> : <IconPlayerPause size={18}/>}
            </ActionIcon>

            <ActionIcon variant="default" onClick={handleSearch} title="Search">
              <IconSearch  size={18}/>
            </ActionIcon>

            <TextInput
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              size='xs'
              style={{ width: 150 }}
            />

          </div>

          {/* Selected Asset Label */}
          {selectedAsset && (
            <div
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                backgroundColor: 'rgba(67, 67, 67, 0.9)',
                padding: '8px 12px',
                borderRadius: '6px',
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold',
                zIndex: 10000,
                border: '2px solid #ff0000'
              }}
            >
              <div style={{ fontSize: '12px', opacity: 0.8 }}>
                {selectedAsset.type === 'satellite' ? '🛰️ Satellite' : '📡 Ground Station'}
              </div>
              <div>{selectedAsset.data?.name || selectedAsset.id}</div>
              {selectedAsset.data?.altitude && (
                <div style={{ fontSize: '12px', opacity: 0.8 }}>
                  Altitude: {selectedAsset.data.altitude.toFixed(1)} km
                </div>
              )}
            </div>
          )}

        </>
      )}
    </Map>
  );
}

export default Globe;
