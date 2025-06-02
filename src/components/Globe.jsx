import { useState, useRef, useEffect } from 'react';
import Map from 'react-map-gl/mapbox';
import { Button, ActionIcon, Drawer, Box, Text, Group, Slider } from '@mantine/core'; // Import Drawer, Box, Text, Group, Slider
import { useDisclosure } from '@mantine/hooks'; // Import useDisclosure for Drawer
import { IconSettings, IconPlayerPlay, IconPlayerPause, IconClockHour4 } from '@tabler/icons-react'; // Import icons for play, pause, and clock

import Satellites from './Satellites';
import Settings from './Settings'; 

let MAPBOX_TOKEN = "pk.eyJ1Ijoia21hamlkMjQiLCJhIjoiY21iZW15ZXB5MWlidTJycHhkbTQ2b2lidSJ9.KYEwuChvbNqoXeOpljFjIw";

function Globe() {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [isPaused, setIsPaused] = useState(false); 

  const initialViewState = {
    longitude: -122.4,
    latitude: 37.8,
    zoom: 2,
  };

  const handleMapLoad = () => {
    setMapLoaded(true);
  };

  const resetMapView = () => {
    if (mapRef.current) {
      mapRef.current.jumpTo({
        center: [initialViewState.longitude, initialViewState.latitude],
        zoom: initialViewState.zoom,
        pitch: 0
      });
    }
  };

  const UTCClock = () => {
    const [utcTime, setUtcTime] = useState('');

    useEffect(() => {
      const updateClock = () => {
        setUtcTime(new Date().toUTCString().split(' ')[4]);
      };
      const intervalId = setInterval(updateClock, 1000);
      updateClock(); // Initial call
      return () => clearInterval(intervalId);
    }, []);

    return <Text c='grey' component="span">{utcTime}</Text>;
  };

  return (
    <Map
      ref={mapRef}
      mapboxAccessToken={MAPBOX_TOKEN}
      initialViewState={initialViewState}
      style={{ width: '100vw', height: '100vh' }}
      mapStyle="mapbox://styles/kmajid24/cmbenh4hd004201ptfkp97j18"
      onLoad={handleMapLoad}
      attributionControl={false}
    >
      {mapLoaded && (
        <>
          <Satellites animationSpeed={animationSpeed} isPaused={isPaused} /> {/* Pass animation speed and pause state */}
          <Button
            onClick={resetMapView}
            variant="filled"
            size="lg"
            style={{
              position: 'absolute',
              top: 5,
              left: 0,
              zIndex: 10,
              padding: '10px 20px',
              fontFamily: 'Courier New, Courier, monospace',
              fontSize: '18px',
              fontWeight: 'light',
              backgroundColor: '#000',
              color: '#fff',
            }}
          >
            constellation-io
          </Button>
        

          <Settings/>

          <Button
          style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              zIndex: 100,
              backgroundColor: '#000',
              color: '#fff',
            }}
          >
            <Group position="apart" align="center" mb="sm">
              <IconClockHour4 size={15} color='grey'/>
              <Text size="sm" weight={200}>
                <UTCClock /> 
              </Text>
            </Group>
          </Button>
        </>
      )}
    </Map>
  );
}

export default Globe;