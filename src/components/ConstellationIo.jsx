import { useState, useEffect } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mantine/core/styles.css';
import {
  AppShell, Group, Text, Burger, Space, UnstyledButton, // Add UnstyledButton for the logo
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import { useGlobalContext } from '../context/GlobalContext';

import Globe from './Globe';
import Settings from './Settings';
import ActiveCard from './ActiveCard';
import Demo from './Demo';

function ConstellationIo() {
  const [opened, { toggle }] = useDisclosure();
  const [activePanel, setActivePanel] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const UTCClock = () => {
    const [utcTime, setUtcTime] = useState('');

    useEffect(() => {
      const updateClock = () => {
        setUtcTime(new Date().toUTCString().split(' ')[4]);
      };
      const intervalId = setInterval(updateClock, 1000);
      updateClock();
      return () => clearInterval(intervalId);
    }, []);

    return (
      <Text c="green" size="xs" weight={200} style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '18px',
      }}>
        {utcTime}
      </Text>
    );
  };

  return (
    <AppShell
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'row',
        position: 'fixed',
        top: 0,
        left: 0,
        overflow: 'hidden',
        zIndex: 0,
        margin: 0,
        padding: 0,
      }}
      navbar={{ width: 66, breakpoint: 'sm' }}
    >
      <AppShell.Navbar p="md" style={{
        height: '100vh',
        overflowY: 'auto',
        paddingTop: '16px', // Add padding to the top of the navbar
      }}>
        <UTCClock />

        <Settings
          setActivePanel={setActivePanel}
          activePanel={activePanel}
        />
        <UnstyledButton
          onClick={() => navigate('/')} // Navigate to your home route
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '398px', 
          }}
          aria-label="Go to home page"
        >
          <img
            src="/cio.png" 
            alt="Constellation IO Logo"
            style={{
              height: 35, 
              width: 'auto',
              display: 'block',
              objectFit: 'contain',
              filter: 'brightness(0) invert(1)' 
            }}
          />
        </UnstyledButton>
      </AppShell.Navbar>

      <AppShell.Main
        style={{
          height: '100vh',
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          margin: 0,
          padding: 0,
        }}
      >
        <Globe />
        <Demo />
        <ActiveCard activePanel={activePanel} setActivePanel={setActivePanel} />
      </AppShell.Main>
    </AppShell>
  );
}

export default ConstellationIo;