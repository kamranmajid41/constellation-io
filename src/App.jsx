import { AppShell, Burger, Group, Space, Text } from '@mantine/core';
import '@mantine/core/styles.css';
import { useDisclosure } from '@mantine/hooks';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useState } from 'react';
import ActiveCard from './components/ActiveCard';
import Globe from './components/Globe';
import Settings from './components/Settings';

function App() {
  const [opened, { toggle }] = useDisclosure();
  const [flightTrajectoryData, setFlightTrajectoryData] = useState([]);
  const [customTleData, setCustomTleData] = useState(null);
  const [activePanel, setActivePanel] = useState(null); 

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
      <Text
        c="green"
        size="xs"
        weight={200}
        style={{
          marginLeft: '-8px',
          marginTop: '2px',
          textAlign: 'left',
          display: 'block',
          marginBottom: '2px'
        }}
      >
        {utcTime}
      </Text>
    );
  };

  return (
    <>
      <AppShell
        navbar={{ width: 66, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      >
        <AppShell.Navbar p="md">
          <Group
            gap={8}
            style={{
              flexDirection: 'column',
              alignItems: 'flex-start',
              paddingLeft: '2px',
              width: '100%',
            }}
          >
            <img
              src="/constellation-io/2018Lebron.png"
              alt="LeBron Icon"
              style={{
                width: '52px',             
                height: '52px',
                objectFit: 'contain',
                display: 'block',
                marginLeft: '-8px',
                marginBottom: '0px'
              }}
            />
            <UTCClock />
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
          </Group>

          <Space h='12pt'/>
          <Settings
            setCustomTleData={setCustomTleData}
            setFlightTrajectoryData={setFlightTrajectoryData}
            setActivePanel={setActivePanel}
            activePanel={activePanel}
          />
        </AppShell.Navbar>

        <AppShell.Main>
          <Globe />
          <ActiveCard
            activePanel={activePanel}
            setActivePanel={setActivePanel}
          />
        </AppShell.Main>
      </AppShell>
    </>
  );
}

export default App;
