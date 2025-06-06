import React, { useState, useRef, useEffect } from 'react';
import Map from 'react-map-gl/mapbox';
import { Button, ActionIcon, TextInput, Group } from '@mantine/core';
import { IconWorldDown, IconTargetArrow, IconSearch } from '@tabler/icons-react';

import Satellites from './Satellites';
import FlightTrajectoryLayer from './FlightTrajectory';

let MAPBOX_TOKEN = "pk.eyJ1Ijoia21hamlkMjQiLCJhIjoiY21iZW15ZXB5MWlidTJycHhkbTQ2b2lidSJ9.KYEwuChvbNqoXeOpljFjIw";

function Globe() {
  const mapRef = useRef(null);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [flightTrajectoryData, setFlightTrajectoryData] = useState([]);
  const [customTleData, setCustomTleData] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const initialViewState = {
    longitude: -122.4,
    latitude: 37.8,
    zoom: 2,
  };

  const resetMapView = () => {
    if (mapRef.current) {
      mapRef.current.jumpTo({
        center: [initialViewState.longitude, initialViewState.latitude],
        zoom: initialViewState.zoom,
        pitch: 0,
      });
    }
  };

  const handleMapLoad = () => {
    setMapLoaded(true);
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
        alert('Unable to retrieve location: ' + err.message);
      }
    );
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
      alert('Location not found.');
    }
  };

  return (
    <Map
      ref={mapRef}
      mapboxAccessToken={MAPBOX_TOKEN}
      initialViewState={initialViewState}
      style={{ height: '100vh', width: '98vw' }}
      mapStyle="mapbox://styles/kmajid24/cmbenh4hd004201ptfkp97j18"
      onLoad={handleMapLoad}
      attributionControl={false}
    >
      {mapLoaded && (
        <>
          <Satellites
            animationSpeed={animationSpeed}
            isPaused={isPaused}
            customTleData={customTleData}
          />

          <FlightTrajectoryLayer flightTrajectoryData={flightTrajectoryData} />

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

            <ActionIcon variant="default" onClick={handleSearch} title="Search">
              <IconSearch  size={18}/>
            </ActionIcon>

            <TextInput
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              size='xs'
              style={{ width: 100 }}
            />

          </div>

        </>
      )}
    </Map>
  );
}

export default Globe;
